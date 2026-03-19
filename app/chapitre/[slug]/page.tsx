/**
 * Page dynamique pour les chapitres du jeu
 * Charge un chapitre depuis data/chapters/ (par slug ou slug_droit-X_date) et l'affiche avec ChapterPlayer
 * Inclut la navigation entre chapitres
 */
import { notFound } from 'next/navigation'
import { readdir } from 'fs/promises'
import path from 'path'
import ChapterPlayer from '@/components/ChapterPlayer'
import ChapterNavigation from '@/components/ChapterNavigation'
import type { Chapter } from '@/types/chapter'

async function getChapter(slug: string): Promise<Chapter | null> {
  try {
    const chapter = await import(`@/data/chapters/${slug}.json`)
    return chapter.default as Chapter
  } catch {
    // Fallback: chercher un fichier qui commence par le slug (ex: la-fugue_droit-8_2025-12-01.json)
    try {
      const chaptersDir = path.join(process.cwd(), 'data', 'chapters')
      const files = await readdir(chaptersDir)
      const match = files.find(f => f.startsWith(slug) && f.endsWith('.json'))
      if (match) {
        const chapter = await import(`@/data/chapters/${match}`)
        return chapter.default as Chapter
      }
    } catch {}
    return null
  }
}

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const chapter = await getChapter(slug)
  
  if (!chapter) {
    return { title: 'Chapitre non trouvé - Drôles de Droits' }
  }
  
  return {
    title: `${chapter.metadata.title} - Drôles de Droits`,
    description: chapter.metadata.description,
    openGraph: {
      title: `${chapter.metadata.title} | Drôles de Droits`,
      description: chapter.metadata.description,
    }
  }
}

// Page du chapitre
export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const chapter = await getChapter(slug)
  
  if (!chapter) {
    notFound()
  }
  
  return (
    <>
      <ChapterPlayer chapter={chapter} />
      <ChapterNavigation currentSlug={slug} />
    </>
  )
}

export async function generateStaticParams() {
  const chapters = ['la-fugue', 'fouilles-cafouillage', 'le-secret-dalex']
  return chapters.map((slug) => ({ slug }))
}

