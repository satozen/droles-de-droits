// Hook personnalisé pour gérer la progression du joueur à travers les scénarios
'use client'

import { useState, useEffect } from 'react'
import { droits } from '@/data/droits'

export interface ProgressItem {
  key: string
  droitId: number
  scenarioId: string
  completed: boolean
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressItem[]>([])

  useEffect(() => {
    // Charger la progression depuis localStorage
    const loadProgress = () => {
      const stored = typeof window !== 'undefined' 
        ? localStorage.getItem('progress') 
        : null
      
      if (stored) {
        const completedKeys = JSON.parse(stored) as string[]
        const progressItems: ProgressItem[] = droits.flatMap(droit =>
          droit.scenarios.map(scenario => ({
            key: `${droit.id}-${scenario.id}`,
            droitId: droit.id,
            scenarioId: scenario.id,
            completed: completedKeys.includes(`${droit.id}-${scenario.id}`),
          }))
        )
        setProgress(progressItems)
      } else {
        // Initialiser avec tous les scénarios non complétés
        const progressItems: ProgressItem[] = droits.flatMap(droit =>
          droit.scenarios.map(scenario => ({
            key: `${droit.id}-${scenario.id}`,
            droitId: droit.id,
            scenarioId: scenario.id,
            completed: false,
          }))
        )
        setProgress(progressItems)
      }
    }

    loadProgress()

    // Écouter les mises à jour
    const handleUpdate = () => {
      loadProgress()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('progress-update', handleUpdate)
      return () => window.removeEventListener('progress-update', handleUpdate)
    }
  }, [])

  const completedDroits = droits.filter(droit => {
    const droitProgress = progress.filter(p => p.droitId === droit.id)
    return droitProgress.length > 0 && droitProgress.every(p => p.completed)
  })

  return { progress, completedDroits }
}
