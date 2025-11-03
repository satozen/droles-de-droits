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
  keywords: ['droits usagers', 'santé québécois', 'jeu éducatif', 'centre jeunesse', 'droits des jeunes', 'santé mentale'],
  authors: [{ name: 'Drôles de Droits' }],
  openGraph: {
    title: 'DRÔLES DE DROITS - Jeu éducatif sur les droits des usagers',
    description: 'Apprends tes 12 droits et responsabilités en tant qu\'usager·ère du système de santé québécois à travers des scénarios interactifs et engageants.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://droles-de-droits.vercel.app',
    siteName: 'Drôles de Droits',
    images: [
      {
        url: '/images/hero image.png',
        width: 1200,
        height: 630,
        alt: 'DRÔLES DE DROITS - Jeu éducatif interactif',
      },
    ],
    locale: 'fr_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DRÔLES DE DROITS - Jeu éducatif sur les droits des usagers',
    description: 'Apprends tes 12 droits et responsabilités en tant qu\'usager·ère du système de santé québécois',
    images: ['/images/hero image.png'],
    creator: '@drolesdedroits',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
