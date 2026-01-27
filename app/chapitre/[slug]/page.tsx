/**
 * Page dynamique pour les chapitres du jeu
 * Charge un chapitre depuis data/chapters/[slug].json et l'affiche avec ChapterPlayer
 * Inclut la navigation entre chapitres
 */
import { notFound } from 'next/navigation'
import ChapterPlayer from '@/components/ChapterPlayer'
import ChapterNavigation from '@/components/ChapterNavigation'
import type { Chapter } from '@/types/chapter'

// Importer les chapitres disponibles
async function getChapter(slug: string): Promise<Chapter | null> {
  try {
    // Essayer de charger le chapitre depuis le fichier JSON
    const chapter = await import(`@/data/chapters/${slug}.json`)
    return chapter.default as Chapter
  } catch {
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

// Générer les routes statiques pour les chapitres connus
export async function generateStaticParams() {
  // Liste des chapitres disponibles
  const chapters = ['la-fugue', 'fouilles-cafouillage']
  
  return chapters.map((slug) => ({
    slug,
  }))
}

