// Layout principal de l'application - structure globale, police et navigation
import type { Metadata } from 'next'
import './globals.css'
import { Fredoka } from 'next/font/google'
import Navigation from '@/components/Navigation'

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
        <Navigation />
        {children}
      </body>
    </html>
  )
}
