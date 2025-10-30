// Layout principal de l'application - structure globale, police et navigation
import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { Fredoka } from 'next/font/google'
import ThemeToggle from '@/components/ThemeToggle'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400','600','700'] })

export const metadata: Metadata = {
  title: 'Droits de Droits - Jeu éducatif',
  description: 'Apprends tes droits et responsabilités en tant qu\'usager·ère du système de santé québécois',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`antialiased ${fredoka.className} bg-white dark:bg-gray-900 transition-colors`}>
        <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-wide text-gray-900 dark:text-white">
              DRÔLES DE DROITS
            </Link>
            <div className="flex items-center gap-4 md:gap-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm md:text-base">Accueil</Link>
              <Link href="/jeu" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm md:text-base">Jeu</Link>
              <Link href="/assistant" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm md:text-base">Milo</Link>
              <Link href="/ressources" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm md:text-base">Ressources</Link>
              <Link href="/guide" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm md:text-base">Guide</Link>
              <Link href="/a-propos" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm md:text-base">À Propos</Link>
              <ThemeToggle />
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
