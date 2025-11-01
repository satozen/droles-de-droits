// Layout principal de l'application - structure globale, police et navigation
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Fredoka } from 'next/font/google'
import Navigation from '@/components/Navigation'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400','600','700'] })

export const metadata: Metadata = {
  title: 'DRÔLES DE DROITS - Jeu éducatif sur les droits des usagers',
  description: 'Apprends tes droits et responsabilités en tant qu\'usager·ère du système de santé québécois',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://droles-de-droits.vercel.app'),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
