/**
 * API Route pour générer des character sheets avec Nano Banana 2
 * Crée un portrait de référence pour chaque personnage de la bible,
 * en utilisant les images existantes comme références de style visuel.
 *
 * POST: Génère un character sheet pour un personnage donné
 * GET: Liste les personnages et leur statut (a une ref image ou non)
 */

import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'

const MODEL = 'gemini-3.1-flash-image-preview'

// Approved style reference images — always sent to keep visual consistency
const STYLE_REFS = [
  '/images/jeune_reflechi.webp',
  '/images/cafeteria_dialogue.webp',
  '/images/intervenante_arrive_lieu_echange_drogues.webp',
]

async function loadImageAsBase64(imagePath: string) {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath)
    const buf = await readFile(fullPath)
    const ext = path.extname(imagePath).toLowerCase()
    const mime: Record<string, string> = {
      '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    }
    return { data: buf.toString('base64'), mimeType: mime[ext] || 'image/webp' }
  } catch { return null }
}

async function loadBiblePersonnages(): Promise<Record<string, any>> {
  try {
    const raw = await readFile(path.join(process.cwd(), 'data', 'bible', 'personnages.json'), 'utf-8')
    return JSON.parse(raw)
  } catch { return {} }
}

export interface CharacterSheetRequest {
  characterId: string
  extraStyleRefs?: string[]
}

export async function POST(request: Request) {
  try {
    const body: CharacterSheetRequest = await request.json()

    if (!body.characterId) {
      return NextResponse.json({ success: false, error: 'characterId requis' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false, error: 'GEMINI_API_KEY non configurée',
      }, { status: 500 })
    }

    const personnages = await loadBiblePersonnages()
    const char = personnages[body.characterId]
    if (!char) {
      return NextResponse.json({
        success: false, error: `Personnage "${body.characterId}" non trouvé dans la bible`,
      }, { status: 404 })
    }

    const ai = new GoogleGenAI({ apiKey })
    const contents: any[] = []

    // 1) Inject style reference images
    const allStyleRefs = [...STYLE_REFS, ...(body.extraStyleRefs || [])]
    for (const ref of allStyleRefs) {
      const img = await loadImageAsBase64(ref)
      if (img) {
        contents.push({ inlineData: { mimeType: img.mimeType, data: img.data } })
        contents.push({ text: 'STYLE REFERENCE: Match the semi-realistic graphic novel style, color palette, bold linework, soft shading, and cinematic lighting of this image exactly. The new character sheet MUST look like it belongs in the same game.' })
      }
    }

    // 2) If the character already has reference images, inject them
    const existingRefs: string[] = char.references || []
    for (const ref of existingRefs) {
      const img = await loadImageAsBase64(ref)
      if (img) {
        contents.push({ inlineData: { mimeType: img.mimeType, data: img.data } })
        contents.push({ text: `EXISTING REFERENCE of ${char.nom}: Maintain this exact appearance — face, hair, body type, skin tone. The character sheet must match this person.` })
      }
    }

    // 3) Build the detailed prompt
    const a = char.apparence || {}
    const prompt = `Create a CHARACTER REFERENCE SHEET for the character "${char.nom}" from the educational game "Drôles de Droits" (set in a Quebec youth center).

CHARACTER DETAILS:
- Name: ${char.nom}
- Role: ${char.role}
- Age: ${char.age}
- Gender: ${char.genre}
- Hair: ${a.cheveux || 'not specified'}
- Eyes: ${a.yeux || 'not specified'}
- Skin: ${a.peau || 'not specified'}
- Height: ${a.taille || 'average'}
- Build: ${a.corpulence || 'average'}
- Default outfit: ${a.vetements_defaut || 'casual clothing'}
- Accessories: ${a.accessoires || 'none'}
- Personality: ${(char.personnalite || []).join(', ')}

SHEET LAYOUT:
- Center: Full-body front-facing portrait of the character, standing naturally
- Left side: 3/4 view of the character (slightly turned)
- Right side: Profile view (side)
- Bottom row: 3 small head close-ups showing different emotions (neutral, happy/confident, sad/worried)
- Clean white/light gray background
- Character name "${char.nom}" written at the top

VISUAL STYLE (CRITICAL):
- Semi-realistic graphic novel art style matching Life is Strange / Telltale Games
- Warm color palette with blues, oranges, and earth tones
- Clean bold linework with soft cel-shading
- Dramatic but natural lighting
- The style MUST match the reference images provided — same rendering, same quality
- This character must look like they belong in the same game as the other characters shown

TECHNICAL:
- Resolution: high quality, at least 2K
- Landscape orientation (wider than tall)
- NO speech bubbles, NO logos, NO watermarks
- Character must look realistic for a Quebec youth center setting`

    contents.push({ text: prompt })

    console.log(`🎨 Generating character sheet for: ${char.nom} (${body.characterId})`)

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ parts: contents }],
      config: { responseModalities: ['IMAGE', 'TEXT'] },
    })

    let imageData: string | null = null
    let textResponse: string | null = null

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) imageData = part.inlineData.data
        else if (part.text) textResponse = part.text
      }
    }

    if (!imageData) {
      return NextResponse.json({
        success: false, error: 'Gemini n\'a pas retourné d\'image',
        textResponse,
      })
    }

    // Save the character sheet
    const sheetsDir = path.join(process.cwd(), 'public', 'images', 'character-sheets')
    await mkdir(sheetsDir, { recursive: true })
    const filename = `${body.characterId}_sheet.png`
    const filepath = path.join(sheetsDir, filename)
    await writeFile(filepath, Buffer.from(imageData, 'base64'))

    const imagePath = `/images/character-sheets/${filename}`
    console.log(`💾 Character sheet saved: ${imagePath}`)

    return NextResponse.json({
      success: true,
      characterId: body.characterId,
      characterName: char.nom,
      imagePath,
      imageData: `data:image/png;base64,${imageData}`,
      textResponse,
    })

  } catch (error: any) {
    console.error('❌ Erreur génération character sheet:', error.message || error)
    return NextResponse.json({
      success: false, error: error.message || 'Erreur lors de la génération',
    })
  }
}

export async function GET() {
  const personnages = await loadBiblePersonnages()
  const apiKey = process.env.GEMINI_API_KEY

  const characters = Object.entries(personnages).map(([id, char]: [string, any]) => ({
    id,
    nom: char.nom,
    role: char.role,
    age: char.age,
    genre: char.genre,
    hasReferenceImage: (char.references || []).length > 0,
    references: char.references || [],
    needsCharacterSheet: (char.references || []).length === 0,
  }))

  return NextResponse.json({
    status: 'ok',
    message: 'API Character Sheet Generator - Nano Banana 2',
    model: MODEL,
    apiConfigured: !!apiKey,
    characters,
    totalCharacters: characters.length,
    withReferences: characters.filter(c => c.hasReferenceImage).length,
    needingSheets: characters.filter(c => c.needsCharacterSheet).length,
  })
}
