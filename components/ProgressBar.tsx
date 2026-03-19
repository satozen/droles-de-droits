/**
 * ProgressBar - Barre de progression globale (droits découverts)
 * Affiche X/12 droits et une rangée d’icônes; clique pour aller au quiz/parcours.
 */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { droits } from '@/data/droits'
import { useGlobalProgress } from '@/hooks/useGlobalProgress'

export default function ProgressBar() {
  const pathname = usePathname()
  const { globalProgress, totalRightsCount, rightsDiscoveredSet } = useGlobalProgress()

  if (pathname?.startsWith('/admin')) return null

  const discoveredCount = rightsDiscoveredSet.size
  const percent = totalRightsCount > 0 ? Math.round((discoveredCount / totalRightsCount) * 100) : 0

  return (
    <Link href="/jeu" className="block w-full">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gray-900 text-white border-b-4 border-black"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <div className="flex items-center justify-between md:justify-start gap-3">
              <div className="font-black tracking-wide text-sm sm:text-base">
                🧠 PROGRESSION: <span className="text-lime-400">{discoveredCount}/{totalRightsCount}</span> droits découverts
              </div>
              <div className="md:hidden text-xs font-bold text-gray-300">{percent}%</div>
            </div>

            <div className="flex-1">
              <div className="h-3 bg-gray-700 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <motion.div
                  key={globalProgress.updatedAt}
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  className="h-full bg-gradient-to-r from-cyan-400 via-lime-400 to-yellow-300"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {droits.map((d) => {
                  const seen = rightsDiscoveredSet.has(d.id)
                  return (
                    <span
                      key={d.id}
                      className={`inline-flex items-center justify-center w-7 h-7 text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        seen ? 'bg-lime-400 text-black' : 'bg-gray-700 text-gray-300 opacity-70'
                      }`}
                      title={`Droit #${d.id}: ${d.titre}`}
                    >
                      {seen ? d.icone : '•'}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="hidden md:block font-black text-sm text-gray-200">
              Clique pour continuer →
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

