// Layout principal de l'application - structure globale, police et navigation
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Fredoka } from 'next/font/google'
import Navigation from '@/components/Navigation'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400','600','700'] })

export const metadata: Metadata = {
  title: 'DRÔLES DE DROITS - Jeu éducatif interactif sur tes 12 droits | Québec',
  description: '🎮 Apprends tes droits et responsabilités en tant qu\'usager·ère du système de santé québécois. Jeux interactifs, dialogues et scénarios réalistes pour les jeunes.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://droles-de-droits.vercel.app'),
  keywords: ['droits usagers', 'santé québécois', 'jeu éducatif', 'centre jeunesse', 'droits des jeunes', 'santé mentale', 'droits et devoirs', 'système de santé Québec'],
  authors: [{ name: 'Drôles de Droits' }],
  openGraph: {
    title: 'DRÔLES DE DROITS 🎮 | Connais tes 12 droits en santé',
    description: 'Jeu interactif éducatif pour apprendre tes droits et responsabilités dans le système de santé québécois. Scénarios réalistes, dialogues avec Karim et Alex, mode RPG et vidéoclip rap. Parfait pour les jeunes en centre jeunesse! 🎯',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://droles-de-droits.vercel.app',
    siteName: 'Drôles de Droits',
    images: [
      {
        url: '/images/hero_centre_jeunesse_sourire.png',
        width: 1200,
        height: 630,
        alt: 'DRÔLES DE DROITS - Jeu interactif éducatif sur les 12 droits des usagers en santé au Québec',
        type: 'image/png',
      },
    ],
    locale: 'fr_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DRÔLES DE DROITS 🎮 | Connais tes 12 droits en santé',
    description: 'Jeu interactif pour apprendre tes droits et responsabilités dans le système de santé québécois. Scénarios, dialogues, RPG et rap! 🎯',
    images: ['/images/hero_centre_jeunesse_sourire.png'],
    creator: '@drolesdedroits',
    site: '@drolesdedroits',
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
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://droles-de-droits.vercel.app',
  },
  category: 'education',
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
