/**
 * API Route pour générer des images avec Nano Banana 2 (Gemini 3.1 Flash Image Preview)
 * Utilise le SDK officiel @google/genai
 *
 * Charge automatiquement la bible visuelle (personnages + lieux) pour injecter
 * les bonnes images de référence et descriptions d'apparence dans chaque prompt.
 * Nano Banana 2 supporte jusqu'à 5 personnages + 14 objets par requête.
 */

import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'
import type { GenerateImageRequest, GenerateImageResponse } from '@/types/chapter'

const MODEL = 'gemini-3.1-flash-image-preview'

// ---------------------------------------------------------------------------
// Bible loading (cached in-process)
// ---------------------------------------------------------------------------

let cachedPersonnages: Record<string, any> | null = null
let cachedLieux: Record<string, any> | null = null

async function loadBible() {
  if (!cachedPersonnages) {
    try {
      const raw = await readFile(path.join(process.cwd(), 'data', 'bible', 'personnages.json'), 'utf-8')
      cachedPersonnages = JSON.parse(raw)
    } catch { cachedPersonnages = {} }
  }
  if (!cachedLieux) {
    try {
      const raw = await readFile(path.join(process.cwd(), 'data', 'bible', 'lieux.json'), 'utf-8')
      cachedLieux = JSON.parse(raw)
    } catch { cachedLieux = {} }
  }
  return { personnages: cachedPersonnages!, lieux: cachedLieux! }
}

// ---------------------------------------------------------------------------
// Image loading helper
// ---------------------------------------------------------------------------

async function loadImageAsBase64(imagePath: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath)
    const imageBuffer = await readFile(fullPath)
    const ext = path.extname(imagePath).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.png': 'image/png', '.gif': 'image/gif',
    }
    return { data: imageBuffer.toString('base64'), mimeType: mimeTypes[ext] || 'image/webp' }
  } catch {
    return null
  }
}

// Inject an image + description into the content array
async function injectReference(contents: any[], imagePath: string, instruction: string) {
  const img = await loadImageAsBase64(imagePath)
  if (img) {
    contents.push({ inlineData: { mimeType: img.mimeType, data: img.data } })
    contents.push({ text: instruction })
    return true
  }
  return false
}

// ---------------------------------------------------------------------------
// Intelligent reference selection
// ---------------------------------------------------------------------------

// Two existing style-reference images we always try to attach so Gemini
// stays visually consistent with the project's graphic-novel look.
const STYLE_REFS = [
  '/images/jeune_reflechi.webp',
  '/images/cafeteria_dialogue.webp',
]

async function buildReferenceContents(
  body: GenerateImageRequest,
  bible: { personnages: Record<string, any>; lieux: Record<string, any> },
  shotType: string,
) {
  const contents: any[] = []
  const loaded = new Set<string>()

  // 1) STYLE REFERENCES — attach 1-2 approved images so Gemini knows the look
  for (const ref of STYLE_REFS) {
    if (loaded.size >= 2) break
    const ok = await injectReference(contents, ref, 
      'STYLE REFERENCE: Match the semi-realistic graphic novel style, color palette, and rendering quality of this image exactly.')
    if (ok) loaded.add(ref)
  }

  // 2) CHARACTER REFERENCES — everyone mentioned in the scene
  const speakerList = (body.characters || []).map(c => c.toLowerCase())
  // Also scan prompt for character names
  const promptLower = (body.prompt + ' ' + (body.sceneContext || '')).toLowerCase()
  for (const [id, char] of Object.entries(bible.personnages)) {
    const nameLC = (char.nom || id).toLowerCase()
    const mentioned = speakerList.includes(id) || promptLower.includes(nameLC) || promptLower.includes(id)
    if (!mentioned) continue

    const refs: string[] = char.references || []
    if (refs.length === 0) continue

    for (const refPath of refs) {
      if (loaded.has(refPath) || loaded.size >= 6) continue
      const apparence = char.apparence
        ? `${char.apparence.cheveux || ''}, ${char.apparence.yeux || ''}, ${char.apparence.peau || ''}, wearing ${char.apparence.vetements_defaut || ''}`
        : ''
      const ok = await injectReference(contents, refPath,
        `CHARACTER REFERENCE — ${char.nom} (${char.role}, ${char.age}): ALWAYS maintain this exact appearance: ${apparence}. This character must look identical in every scene.`)
      if (ok) loaded.add(refPath)
    }
  }

  // 3) LOCATION REFERENCES — detect which lieu matches the scene
  const locationKeywords: Record<string, string[]> = {
    cafeteria:         ['cafétéria', 'cafeteria', 'caf', 'mange', 'repas', 'table'],
    couloir_principal: ['couloir', 'corridor', 'hallway'],
    chambre_alex:      ['chambre', 'lit', 'sa chambre', 'room'],
    bureau_sophie:     ['bureau', 'office', 'intervenante', 'intervenant', 'consultation'],
    exterieur_centre:  ['extérieur', 'dehors', 'parking', 'entrée du centre', 'outside'],
    ruelle_squat:      ['ruelle', 'squat', 'rue', 'fugue', 'nuit urbaine', 'alley'],
    tribunal:          ['tribunal', 'juge', 'audience', 'cour'],
    salle_commune:     ['salon', 'salle commune', 'sofa', 'tv', 'common room'],
    infirmerie:        ['infirmerie', 'médical', 'nurse', 'infirmière'],
    ecole_centre:      ['classe', 'école', 'cours', 'school'],
  }

  // Also use the explicit style field from the request
  const styleToLieu: Record<string, string> = {
    cafeteria: 'cafeteria',
    bureau: 'bureau_sophie',
    chambre: 'chambre_alex',
    centre_jeunesse: 'couloir_principal',
    exterieur: 'exterieur_centre',
    urbain: 'ruelle_squat',
    fugue: 'ruelle_squat',
  }

  const matchedLieu = styleToLieu[body.style || '']
  let lieuId: string | null = matchedLieu || null

  if (!lieuId) {
    for (const [id, keywords] of Object.entries(locationKeywords)) {
      if (keywords.some(kw => promptLower.includes(kw))) {
        lieuId = id
        break
      }
    }
  }

  if (lieuId && bible.lieux[lieuId]) {
    const lieu = bible.lieux[lieuId]
    const lieuRefs: string[] = lieu.references || []
    for (const refPath of lieuRefs) {
      if (loaded.has(refPath) || loaded.size >= 8) continue
      const desc = lieu.details
        ? Object.values(lieu.details).join(', ')
        : lieu.description
      const ok = await injectReference(contents, refPath,
        `LOCATION REFERENCE — ${lieu.nom}: Match this setting's architecture, colors, furniture, and atmosphere. Details: ${desc}`)
      if (ok) loaded.add(refPath)
    }
  }

  // 4) EXTRA REFERENCES from the request (manually selected in Studio)
  if (body.referenceImages) {
    for (const refPath of body.referenceImages) {
      if (loaded.has(refPath) || loaded.size >= 10) continue
      const ok = await injectReference(contents, refPath,
        'Additional reference for style, setting, or character appearance.')
      if (ok) loaded.add(refPath)
    }
  }

  console.log(`📷 Loaded ${loaded.size} reference images: ${[...loaded].map(p => path.basename(p)).join(', ')}`)
  return contents
}

// ---------------------------------------------------------------------------
// Shot type detection
// ---------------------------------------------------------------------------

type ShotType = 'establishing' | 'medium' | 'closeup_character' | 'closeup_object' | 'two_shot' | 'over_shoulder' | 'pov'

const SHOT_DESCRIPTIONS: Record<ShotType, string> = {
  establishing: 'Wide establishing shot showing the full environment and setting, characters small in frame, emphasizing location and atmosphere',
  medium: 'Medium shot from waist up, character centered, showing body language and facial expression clearly',
  closeup_character: 'Close-up shot of character face, filling most of frame, intense focus on emotion and expression',
  closeup_object: 'Extreme close-up on a specific object or detail, shallow depth of field, dramatic emphasis',
  two_shot: 'Two-shot framing both characters in conversation, balanced composition, showing their interaction',
  over_shoulder: 'Over-the-shoulder shot, one character in foreground (back visible), other character facing camera',
  pov: 'Point-of-view shot, showing what the character sees, first-person perspective',
}

function detectShotType(prompt: string, explicitType?: string): ShotType {
  if (explicitType && SHOT_DESCRIPTIONS[explicitType as ShotType]) return explicitType as ShotType

  const p = prompt.toLowerCase()

  if (/alex et \w|discutent|conversation|parle à|dit à/.test(p)) return 'two_shot'
  if (/gros plan|close-up|pilule|drogue|lettre|téléphone|document|objet/.test(p)) return 'closeup_object'
  if (/visage|larmes|yeux|expression|pleure|crie/.test(p)) return 'closeup_character'
  if (/derrière|dos|épaule|over shoulder/.test(p)) return 'over_shoulder'
  if (/regarde|voit|aperçoit|observe|pov|point de vue/.test(p)) return 'pov'

  const hasChar = /alex|marco|karim|sophie|david|diane|il |elle /.test(p)
  if (!hasChar && /établissement|bâtiment|extérieur|ruelle|squat|nuit/.test(p)) return 'establishing'
  if (/trois jours plus tard|un mois plus tard|quelques semaines|le lendemain/.test(p)) {
    return hasChar ? 'medium' : 'establishing'
  }

  return 'medium'
}

// ---------------------------------------------------------------------------
// Prompt building — now injects bible appearance descriptions
// ---------------------------------------------------------------------------

function buildImagePrompt(
  body: GenerateImageRequest,
  bible: { personnages: Record<string, any>; lieux: Record<string, any> },
  shotType: ShotType,
) {
  const emotionDescriptions: Record<string, string> = {
    frustre: 'frustrated expression, clenched jaw, tension in shoulders, looking away',
    nerveux: 'anxious expression, fidgeting, biting lip, avoiding eye contact',
    confiant: 'confident stance, shoulders back, slight smile, direct gaze',
    triste: 'downcast eyes, slumped posture, tears or wet eyes, withdrawn',
    en_colere: 'angry expression, furrowed brows, clenched fists, aggressive stance',
    peur: 'wide fearful eyes, hunched shoulders, stepping back, pale face',
    determine: 'resolute expression, firm jaw, focused eyes, standing tall',
    hesitant: 'uncertain expression, looking between options, biting nail, conflicted',
    soulage: 'relaxed shoulders, soft smile, exhaling, peaceful expression',
    complice: 'conspiratorial smile, leaning in, mischievous eyes, secretive',
    tension: 'stiff body language, serious faces, charged atmosphere, dramatic lighting',
    choque: 'eyes wide, mouth slightly open, stunned body language, frozen',
    grave: 'serious expression, furrowed brow, heavy atmosphere, muted tones',
    victoire: 'proud stance, bright eyes, slight smile, shoulders back, warm light',
    decouverte: 'eyes wide with realization, leaning forward, moment of clarity',
    info: 'neutral but engaged, explaining gesture, informational tone',
    conseil: 'warm expression, leaning forward slightly, supportive body language',
    action: 'dynamic pose, movement implied, purposeful stride',
    resolution: 'calm determination, settled posture, composed expression',
    lecon: 'reflective expression, looking slightly down, thoughtful',
  }

  const emotionStyle = body.emotion ? (emotionDescriptions[body.emotion] || body.emotion) : 'neutral expression'

  // Build per-character appearance descriptions from the bible
  const charDescriptions: string[] = []
  const speakers = (body.characters || []).map(c => c.toLowerCase())
  const promptLower = (body.prompt + ' ' + (body.sceneContext || '')).toLowerCase()

  for (const [id, char] of Object.entries(bible.personnages)) {
    const nameLC = (char.nom || id).toLowerCase()
    if (!speakers.includes(id) && !promptLower.includes(nameLC) && !promptLower.includes(id)) continue
    const a = char.apparence
    if (!a) continue
    charDescriptions.push(
      `${char.nom} (${char.age}, ${char.genre}): ${a.cheveux}, ${a.yeux} eyes, ${a.peau} skin, ${a.corpulence}. Default outfit: ${a.vetements_defaut}. ${a.accessoires ? 'Accessories: ' + a.accessoires : ''}`
    )
  }

  // Detect location from bible for setting description
  let settingDesc = ''
  const styleToLieu: Record<string, string> = {
    cafeteria: 'cafeteria', bureau: 'bureau_sophie', chambre: 'chambre_alex',
    centre_jeunesse: 'couloir_principal', exterieur: 'exterieur_centre',
    urbain: 'ruelle_squat', fugue: 'ruelle_squat',
  }
  const lieuId = styleToLieu[body.style || '']
  if (lieuId && bible.lieux[lieuId]) {
    const lieu = bible.lieux[lieuId]
    const d = lieu.details || {}
    settingDesc = `${lieu.nom}: ${lieu.description}. ${Object.entries(d).map(([k, v]) => `${k}: ${v}`).join('. ')}`
  }

  return `Create a high-quality digital illustration for the interactive educational game "Drôles de Droits" about youth rights in Quebec youth centers.

SCENE DESCRIPTION: ${body.prompt}

CAMERA/FRAMING:
${SHOT_DESCRIPTIONS[shotType]}

VISUAL STYLE (MANDATORY):
- Semi-realistic graphic novel art style, similar to Life is Strange or Telltale Games
- Warm color palette with blues, oranges, and earth tones
- Dramatic cinematic lighting with depth of field
- Clean bold linework with soft shading
- Professional quality, suitable for educational game

${settingDesc ? `SETTING (from bible): ${settingDesc}` : ''}

${charDescriptions.length > 0 ? `CHARACTER APPEARANCE (from bible — MUST match reference images exactly):
${charDescriptions.map(d => '- ' + d).join('\n')}` : ''}

EMOTION: ${emotionStyle}

TECHNICAL SPECS:
- Resolution: 1920x1080 pixels (16:9 widescreen)
- Horizontal landscape orientation
- NO text, NO speech bubbles, NO logos, NO watermarks
- Safe for all ages, appropriate for educational content

${body.sceneContext ? `NARRATIVE CONTEXT: ${body.sceneContext}` : ''}
${body.characters?.length ? `CHARACTERS IN SCENE: ${body.characters.join(', ')}` : ''}`
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body: GenerateImageRequest = await request.json()

    if (!body.prompt) {
      return NextResponse.json({ success: false, error: 'Prompt requis' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: true, imagePath: getPlaceholderImage(body.style),
        isPlaceholder: true, error: 'GEMINI_API_KEY non configurée',
      })
    }

    const bible = await loadBible()
    const ai = new GoogleGenAI({ apiKey })
    const shotType = detectShotType(body.prompt, body.shotType)

    // Build reference images from bible
    const contents = await buildReferenceContents(body, bible, shotType)

    // Build and append the text prompt (enriched with bible data)
    const enhancedPrompt = buildImagePrompt(body, bible, shotType)
    contents.push({ text: enhancedPrompt })

    console.log(`🎨 Generating image | shot: ${shotType} | prompt: ${enhancedPrompt.slice(0, 120)}...`)

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
      console.warn('⚠️ No image in Gemini response')
      return NextResponse.json({
        success: true, imagePath: getPlaceholderImage(body.style),
        isPlaceholder: true, error: 'Gemini n\'a pas retourné d\'image', textResponse,
      })
    }

    const imagePath = await saveImage(imageData, body.prompt)
    console.log('💾 Image saved to:', imagePath)

    return NextResponse.json({
      success: true, imagePath,
      imageData: `data:image/png;base64,${imageData}`,
      isPlaceholder: false, textResponse,
    } as GenerateImageResponse)

  } catch (error: any) {
    console.error('❌ Erreur génération image:', error.message || error)
    return NextResponse.json({
      success: true, imagePath: getPlaceholderImage(),
      isPlaceholder: true, error: error.message || 'Erreur lors de la génération',
    })
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function saveImage(base64Data: string, prompt: string): Promise<string> {
  try {
    const chaptersDir = path.join(process.cwd(), 'public', 'images', 'chapitres', 'generated')
    await mkdir(chaptersDir, { recursive: true })
    const timestamp = Date.now()
    const slug = prompt.slice(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '_')
    const filename = `${slug}_${timestamp}.png`
    await writeFile(path.join(chaptersDir, filename), Buffer.from(base64Data, 'base64'))
    return `/images/chapitres/generated/${filename}`
  } catch {
    return '/images/jeune_reflechi.webp'
  }
}

function getPlaceholderImage(style?: string): string {
  const placeholders: Record<string, string> = {
    centre_jeunesse: '/images/establishing_centre jeunesse.webp',
    urbain: '/images/adolescent_bus_stress.webp',
    interieur: '/images/cafeteria_dialogue.webp',
    exterieur: '/images/fugue_course.webp',
  }
  return placeholders[style || 'centre_jeunesse'] || '/images/jeune_reflechi.webp'
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY
  return NextResponse.json({
    status: 'ok',
    message: 'API Génération Images - Nano Banana 2',
    model: MODEL,
    modelName: 'Nano Banana 2 (Gemini 3.1 Flash Image)',
    sdkVersion: '@google/genai',
    apiConfigured: !!apiKey,
    features: [
      'Auto-loads bible (personnages.json + lieux.json)',
      'Injects character appearance descriptions in prompts',
      'Attaches character + location reference images automatically',
      'Up to 5 characters + 14 objects per request',
    ],
    fallbackAvailable: true,
  })
}
