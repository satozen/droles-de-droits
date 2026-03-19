/**
 * ChapterNavigation - Navigation entre chapitres précédent/suivant
 * Permet de naviguer facilement entre les différents chapitres du jeu
 */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CHAPTERS = [
  { slug: 'fouilles-cafouillage', title: 'Fouilles et Cafouillage' },
  { slug: 'la-fugue', title: 'La Fugue' },
  { slug: 'le-secret-dalex', title: 'Le Secret d\'Alex' },
]

interface ChapterNavigationProps {
  currentSlug: string
}

export default function ChapterNavigation({ currentSlug }: ChapterNavigationProps) {
  const pathname = usePathname()
  const currentIndex = CHAPTERS.findIndex(ch => ch.slug === currentSlug)
  
  const previousChapter = currentIndex > 0 ? CHAPTERS[currentIndex - 1] : null
  const nextChapter = currentIndex < CHAPTERS.length - 1 ? CHAPTERS[currentIndex + 1] : null

  if (!previousChapter && !nextChapter) {
    return null
  }

  return (
    <nav className="w-full bg-white dark:bg-gray-800 border-t-4 border-gray-200 dark:border-gray-700 py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Chapitre précédent */}
          <div className="flex-1 w-full sm:w-auto">
            {previousChapter ? (
              <Link
                href={`/chapitre/${previousChapter.slug}`}
                className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 md:border-4 border-black dark:border-gray-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] font-bold text-sm md:text-base transition-all hover:translate-x-1 hover:translate-y-1 group"
              >
                <svg 
                  className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Précédent</span>
                  <span className="text-gray-900 dark:text-white">{previousChapter.title}</span>
                </div>
              </Link>
            ) : (
              <div className="px-4 md:px-6 py-3 bg-gray-50 dark:bg-gray-800 border-2 md:border-4 border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-2 md:gap-3">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Précédent</span>
                    <span className="text-gray-400">—</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Indicateur de progression */}
          <div className="flex items-center gap-2 text-sm md:text-base font-bold text-gray-700 dark:text-gray-300">
            <span className="hidden sm:inline">Chapitre</span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 border-2 border-purple-500 dark:border-purple-400 rounded-lg">
              {currentIndex + 1} / {CHAPTERS.length}
            </span>
          </div>

          {/* Chapitre suivant */}
          <div className="flex-1 w-full sm:w-auto flex justify-end">
            {nextChapter ? (
              <Link
                href={`/chapitre/${nextChapter.slug}`}
                className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 bg-lime-400 hover:bg-lime-500 border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-sm md:text-base transition-all hover:translate-x-1 hover:translate-y-1 group w-full sm:w-auto justify-end"
              >
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-700">Suivant</span>
                  <span className="text-black">{nextChapter.title}</span>
                </div>
                <svg 
                  className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div className="px-4 md:px-6 py-3 bg-gray-50 dark:bg-gray-800 border-2 md:border-4 border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">Suivant</span>
                    <span className="text-gray-400">—</span>
                  </div>
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

