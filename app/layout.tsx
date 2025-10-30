// Layout principal de l'application - structure globale, police et navigation
import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { Fredoka } from 'next/font/google'

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
      <body className={`antialiased ${fredoka.className}`}>
        <header className="w-full">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-wide">
              DRÔLES DE DROITS
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900">Accueil</Link>
              <Link href="/a-propos" className="text-gray-700 hover:text-gray-900">À Propos</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
