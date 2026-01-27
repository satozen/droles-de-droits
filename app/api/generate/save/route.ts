/**
 * API Route pour sauvegarder les chapitres générés dans data/chapters/
 * Nom de fichier lisible : [slug]_droit-[id]_[date].json
 */

import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import type { Chapter } from '@/types/chapter'

export async function POST(request: Request) {
  try {
    const { chapter } = await request.json() as { chapter: Chapter }

    if (!chapter || !chapter.metadata) {
      return NextResponse.json(
        { success: false, error: 'Chapitre invalide' },
        { status: 400 }
      )
    }

    // Créer le dossier si nécessaire
    const chaptersDir = path.join(process.cwd(), 'data', 'chapters')
    await mkdir(chaptersDir, { recursive: true })

    // Générer un nom de fichier lisible
    const date = new Date().toISOString().split('T')[0] // 2025-12-01
    const slug = chapter.metadata.slug || 'chapitre'
    const rightId = chapter.metadata.right?.id || 0
    const filename = `${slug}_droit-${rightId}_${date}.json`
    
    // Chemin complet
    const filepath = path.join(chaptersDir, filename)

    // Ajouter des métadonnées de sauvegarde
    const chapterWithMeta = {
      ...chapter,
      _savedAt: new Date().toISOString(),
      _filename: filename,
      _version: '1.0'
    }

    // Sauvegarder avec formatage lisible
    await writeFile(
      filepath, 
      JSON.stringify(chapterWithMeta, null, 2),
      'utf-8'
    )

    // Compter les images à générer
    let imageCount = 0
    if (chapter.dialogue) {
      for (const lines of Object.values(chapter.dialogue)) {
        imageCount += (lines as any[]).length
      }
    }

    return NextResponse.json({
      success: true,
      filename,
      filepath: `data/chapters/${filename}`,
      imageCount,
      message: `Chapitre sauvegardé: ${filename}`
    })

  } catch (error) {
    console.error('Erreur sauvegarde chapitre:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}

// Endpoint pour lister les chapitres sauvegardés
export async function GET() {
  try {
    const { readdir, stat } = await import('fs/promises')
    const chaptersDir = path.join(process.cwd(), 'data', 'chapters')
    
    try {
      const files = await readdir(chaptersDir)
      const jsonFiles = files.filter(f => f.endsWith('.json'))
      
      const chapters = await Promise.all(
        jsonFiles.map(async (filename) => {
          const filepath = path.join(chaptersDir, filename)
          const fileStat = await stat(filepath)
          
          // Extraire les infos du nom de fichier
          const match = filename.match(/^(.+)_droit-(\d+)_(\d{4}-\d{2}-\d{2})\.json$/)
          
          return {
            filename,
            slug: match?.[1] || filename.replace('.json', ''),
            rightId: match?.[2] ? parseInt(match[2]) : null,
            date: match?.[3] || null,
            size: fileStat.size,
            modifiedAt: fileStat.mtime.toISOString()
          }
        })
      )
      
      return NextResponse.json({
        success: true,
        chapters,
        count: chapters.length
      })
    } catch {
      // Dossier n'existe pas encore
      return NextResponse.json({
        success: true,
        chapters: [],
        count: 0
      })
    }
  } catch (error) {
    console.error('Erreur listing chapitres:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors du listing' },
      { status: 500 }
    )
  }
}

