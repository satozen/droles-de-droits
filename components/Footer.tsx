/**
 * Footer - Navigation et informations du site
 * Affiche les liens principaux et les informations de contact en bas de page
 */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  const mainLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/centre-jeunesse', label: 'Jeu' },
    { href: '/jeu', label: 'Quiz' },
    { href: '/assistant', label: 'Assistant IA' },
    { href: '/ressources', label: 'Ressources' },
    { href: '/guide', label: 'Guide' },
    { href: '/a-propos', label: 'À Propos' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <footer className="w-full bg-gray-800 dark:bg-gray-900 border-t-4 border-gray-700 dark:border-gray-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Section Logo et Description */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              DRÔLES DE DROITS
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Une plateforme interactive pour découvrir tes 12 droits d'usagers en santé à travers des scénarios engageants.
            </p>
          </div>

          {/* Section Navigation */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Navigation</h3>
            <nav className="flex flex-col gap-2">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-gray-300 hover:text-white transition-colors text-sm md:text-base ${
                    isActive(link.href) ? 'font-bold text-purple-400' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Section Informations */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Informations</h3>
            <div className="flex flex-col gap-2 text-gray-300 text-sm md:text-base">
              <p>🎮 Jeu éducatif interactif</p>
              <p>📚 12 droits d'usagers</p>
              <p>🎯 Pour les jeunes en centre jeunesse</p>
              <Link 
                href="/a-propos" 
                className="text-purple-400 hover:text-purple-300 transition-colors mt-2"
              >
                En savoir plus →
              </Link>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-700 dark:border-gray-600 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs md:text-sm">
            <p>© {new Date().getFullYear()} Drôles de Droits. Tous droits réservés.</p>
            <div className="flex gap-4">
              <Link href="/a-propos" className="hover:text-white transition-colors">
                À Propos
              </Link>
              <Link href="/ressources" className="hover:text-white transition-colors">
                Ressources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

