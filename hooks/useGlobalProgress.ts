/**
 * useGlobalProgress - Progression globale persistante (quiz + chapitres)
 * Stocke un profil local dans localStorage et expose des helpers pour enregistrer chapitres, droits découverts et badges.
 */
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { droits } from '@/data/droits'

export type EndingType = 'positive' | 'negative' | 'neutral' | string

export type ChapterChoiceMade = {
  scene: string
  choiceIndex: number
  timestamp: string
}

export type CompletedChapter = {
  chapterId: string
  endType: EndingType
  unlockedRights: number[]
  choicesMade: ChapterChoiceMade[]
  completedAt: string
}

export type GlobalProgress = {
  version: number
  rightsDiscovered: number[] // ids 1..12
  completedQuizDroits: number[]
  completedChapters: Record<string, CompletedChapter>
  badges: string[]
  updatedAt: string
}

const STORAGE_KEY = 'globalProgress'
const CURRENT_VERSION = 1

function uniqSorted(nums: number[]) {
  return Array.from(new Set(nums)).sort((a, b) => a - b)
}

function clampRights(rightIds: number[]) {
  const max = droits.length || 12
  return uniqSorted(rightIds.filter((n) => Number.isFinite(n) && n >= 1 && n <= max))
}

function computeBadges(gp: GlobalProgress) {
  const discovered = gp.rightsDiscovered.length
  const completed = gp.completedQuizDroits.length
  const chapters = Object.keys(gp.completedChapters).length

  const badges: string[] = []
  if (discovered >= 1) badges.push('premier-droit')
  if (discovered >= 3) badges.push('curieux')
  if (discovered >= 6) badges.push('assidu')
  if (discovered >= 9) badges.push('champion')
  if (discovered >= 12) badges.push('maitre')
  if (chapters >= 1) badges.push('premier-chapitre')
  if (completed >= 3) badges.push('quiz-solide')
  return Array.from(new Set(badges))
}

function defaultProgress(): GlobalProgress {
  const now = new Date().toISOString()
  return {
    version: CURRENT_VERSION,
    rightsDiscovered: [],
    completedQuizDroits: [],
    completedChapters: {},
    badges: [],
    updatedAt: now,
  }
}

function loadProgressSafe(): GlobalProgress {
  if (typeof window === 'undefined') return defaultProgress()

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultProgress()

  try {
    const parsed = JSON.parse(raw) as Partial<GlobalProgress>
    const base = defaultProgress()
    const merged: GlobalProgress = {
      ...base,
      ...parsed,
      version: CURRENT_VERSION,
      rightsDiscovered: clampRights(parsed.rightsDiscovered ?? []),
      completedQuizDroits: clampRights(parsed.completedQuizDroits ?? []),
      completedChapters: (parsed.completedChapters ?? {}) as Record<string, CompletedChapter>,
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : base.updatedAt,
    }
    merged.badges = computeBadges(merged)
    return merged
  } catch {
    return defaultProgress()
  }
}

function saveProgressSafe(gp: GlobalProgress) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gp))
  window.dispatchEvent(new Event('global-progress-update'))
}

export function useGlobalProgress() {
  const [globalProgress, setGlobalProgress] = useState<GlobalProgress>(() => loadProgressSafe())

  useEffect(() => {
    const sync = () => setGlobalProgress(loadProgressSafe())
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('global-progress-update', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('global-progress-update', sync)
    }
  }, [])

  const totalRightsCount = droits.length || 12

  const rightsDiscoveredSet = useMemo(() => new Set(globalProgress.rightsDiscovered), [globalProgress.rightsDiscovered])

  const addRightsDiscovered = useCallback((rightIds: number[]) => {
    setGlobalProgress((prev) => {
      const next: GlobalProgress = {
        ...prev,
        rightsDiscovered: clampRights([...prev.rightsDiscovered, ...rightIds]),
        updatedAt: new Date().toISOString(),
      }
      next.badges = computeBadges(next)
      saveProgressSafe(next)
      return next
    })
  }, [])

  const markQuizDroitCompleted = useCallback((droitId: number) => {
    setGlobalProgress((prev) => {
      const next: GlobalProgress = {
        ...prev,
        completedQuizDroits: clampRights([...prev.completedQuizDroits, droitId]),
        rightsDiscovered: clampRights([...prev.rightsDiscovered, droitId]),
        updatedAt: new Date().toISOString(),
      }
      next.badges = computeBadges(next)
      saveProgressSafe(next)
      return next
    })
  }, [])

  const saveChapterProgress = useCallback(
    (chapterId: string, data: Omit<CompletedChapter, 'chapterId'>) => {
      setGlobalProgress((prev) => {
        const next: GlobalProgress = {
          ...prev,
          completedChapters: {
            ...prev.completedChapters,
            [chapterId]: {
              chapterId,
              ...data,
            },
          },
          rightsDiscovered: clampRights([...prev.rightsDiscovered, ...(data.unlockedRights || [])]),
          updatedAt: new Date().toISOString(),
        }
        next.badges = computeBadges(next)
        saveProgressSafe(next)
        return next
      })
    },
    []
  )

  return {
    globalProgress,
    totalRightsCount,
    rightsDiscoveredSet,
    addRightsDiscovered,
    markQuizDroitCompleted,
    saveChapterProgress,
  }
}

