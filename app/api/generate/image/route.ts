/**
 * API Route pour générer des images avec Nano Banana Pro (Gemini 3 Pro Image Preview)
 * Utilise le SDK officiel @google/genai
 * Documentation: https://ai.google.dev/gemini-api/docs/image-generation
 */

import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'
import type { GenerateImageRequest, GenerateImageResponse } from '@/types/chapter'

// Gemini 3 Pro Image Preview (Nano Banana Pro)
// - High-resolution: 1K, 2K, 4K
// - Up to 14 reference images (6 objects + 5 humans for character consistency)
// - Advanced text rendering
// - Thinking mode for complex prompts
const MODEL = 'gemini-3-pro-image-preview'

// Images de référence pour les personnages (cohérence visuelle)
// TOUJOURS envoyer l'image d'Alex pour maintenir sa cohérence
const CHARACTER_REFERENCES: { [key: string]: string } = {
  'alex': '/images/jeune_reflechi.webp',
  'alex_confiant': '/images/refus_drogue_non.webp',
  'alex_triste': '/images/cafeteria_triste.webp',
  'centre_jeunesse': '/images/establishing_centre jeunesse.webp',
  'educateur': '/images/intervenante_arrive_lieu_echange_drogues.webp',
  'police': '/images/police_centre_jeunesse.webp',
  'fugue': '/images/fugue_course.webp',
  'tribunal': '/images/jeune_tribunal.webp',
  'famille': '/images/jeune_entoure_famille_avocats.webp',
}

// Image par défaut d'Alex - TOUJOURS incluse pour cohérence
const DEFAULT_ALEX_REFERENCE = '/images/jeune_reflechi.webp'

// Types de plans pour varier les compositions
type ShotType = 'establishing' | 'medium' | 'closeup_character' | 'closeup_object' | 'two_shot' | 'over_shoulder' | 'pov'

const SHOT_DESCRIPTIONS: { [key in ShotType]: string } = {
  'establishing': 'Wide establishing shot showing the full environment and setting, characters small in frame, emphasizing location and atmosphere',
  'medium': 'Medium shot from waist up, character centered, showing body language and facial expression clearly',
  'closeup_character': 'Close-up shot of character face, filling most of frame, intense focus on emotion and expression',
  'closeup_object': 'Extreme close-up on a specific object or detail, shallow depth of field, dramatic emphasis',
  'two_shot': 'Two-shot framing both characters in conversation, balanced composition, showing their interaction',
  'over_shoulder': 'Over-the-shoulder shot, one character in foreground (back visible), other character facing camera',
  'pov': 'Point-of-view shot, showing what the character sees, first-person perspective'
}

// Charger une image locale en base64
async function loadImageAsBase64(imagePath: string): Promise<{ data: string, mimeType: string } | null> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath)
    const imageBuffer = await readFile(fullPath)
    const ext = path.extname(imagePath).toLowerCase()
    const mimeTypes: { [key: string]: string } = {
      '.webp': 'image/webp',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif'
    }
    return {
      data: imageBuffer.toString('base64'),
      mimeType: mimeTypes[ext] || 'image/webp'
    }
  } catch (error) {
    console.error(`Erreur chargement image ${imagePath}:`, error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body: GenerateImageRequest = await request.json()

    // Validation
    if (!body.prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt requis' },
        { status: 400 }
      )
    }

    // Vérifier la clé API Gemini
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.warn('Clé API Gemini non configurée, utilisation de placeholder')
      return NextResponse.json({
        success: true,
        imagePath: getPlaceholderImage(body.style),
        isPlaceholder: true,
        error: 'GEMINI_API_KEY non configurée'
      })
    }

    // Initialiser le client Google GenAI
    const ai = new GoogleGenAI({ apiKey })

    // Construire le prompt enrichi
    const enhancedPrompt = buildImagePrompt(body)
    console.log('🎨 Generating image with prompt:', enhancedPrompt.slice(0, 150) + '...')

    // Préparer les contenus (texte + images de référence)
    const contents: any[] = []
    
    // TOUJOURS ajouter l'image de référence d'Alex pour cohérence
    // Sauf si c'est explicitement un plan sans personnage
    const shotType = detectShotType(body.prompt, body.shotType)
    const needsAlexReference = shotType !== 'closeup_object' && shotType !== 'establishing'
    
    if (needsAlexReference) {
      const alexRef = await loadImageAsBase64(DEFAULT_ALEX_REFERENCE)
      if (alexRef) {
        contents.push({
          inlineData: {
            mimeType: alexRef.mimeType,
            data: alexRef.data
          }
        })
        contents.push({
          text: "CRITICAL: This is Alex, the main character. ALWAYS maintain his exact appearance: brown hair, blue eyes, light blue jacket, freckles. He must look identical in every scene."
        })
        console.log('📷 Added Alex reference image for character consistency')
      }
    }
    
    // Ajouter les images de référence supplémentaires si fournies
    if (body.referenceImages && body.referenceImages.length > 0) {
      for (const refImage of body.referenceImages) {
        // Éviter de dupliquer la référence d'Alex
        if (refImage === DEFAULT_ALEX_REFERENCE) continue
        
        const imageData = await loadImageAsBase64(refImage)
        if (imageData) {
          contents.push({
            inlineData: {
              mimeType: imageData.mimeType,
              data: imageData.data
            }
          })
          contents.push({
            text: "Use this additional reference for style, setting, or secondary character appearance."
          })
        }
      }
    }
    
    // Ajouter le prompt principal avec le type de plan
    const promptWithShot = addShotTypeToPrompt(enhancedPrompt, shotType)
    contents.push({ text: promptWithShot })
    console.log('🎬 Shot type:', shotType)

    // Appeler Gemini pour générer l'image
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ parts: contents }],
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      }
    })

    console.log('📡 Gemini response received')

    // Extraire l'image de la réponse
    let imageData: string | null = null
    let textResponse: string | null = null

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          imageData = part.inlineData.data
          console.log('✅ Image data received from Gemini')
        } else if (part.text) {
          textResponse = part.text
        }
      }
    }

    if (!imageData) {
      console.warn('⚠️ Pas d\'image dans la réponse Gemini')
      console.log('Response:', JSON.stringify(response, null, 2).slice(0, 500))
      return NextResponse.json({
        success: true,
        imagePath: getPlaceholderImage(body.style),
        isPlaceholder: true,
        error: 'Gemini n\'a pas retourné d\'image',
        textResponse
      })
    }

    // Sauvegarder l'image générée
    const imagePath = await saveImage(imageData, body.prompt)
    console.log('💾 Image saved to:', imagePath)

    return NextResponse.json({
      success: true,
      imagePath,
      imageData: `data:image/png;base64,${imageData}`,
      isPlaceholder: false,
      textResponse
    } as GenerateImageResponse)

  } catch (error: any) {
    console.error('❌ Erreur génération image:', error.message || error)
    
    // Vérifier si c'est une erreur d'API
    if (error.message?.includes('API key') || error.message?.includes('authentication')) {
      return NextResponse.json({
        success: true,
        imagePath: getPlaceholderImage(),
        isPlaceholder: true,
        error: 'Problème d\'authentification API Gemini'
      })
    }
    
    return NextResponse.json({
      success: true,
      imagePath: getPlaceholderImage(),
      isPlaceholder: true,
      error: error.message || 'Erreur lors de la génération'
    })
  }
}

// Types de plans cinématographiques pour varier les images
type ShotType = 'establishing' | 'two_shot' | 'closeup_speaker' | 'closeup_listener' | 'object' | 'over_shoulder' | 'wide' | 'medium'

// Déterminer automatiquement le type de plan selon le contexte
function determineShotType(prompt: string, speaker: string, emotion?: string): ShotType {
  const promptLower = prompt.toLowerCase()
  
  // Mots-clés pour gros plan sur objet
  const objectKeywords = ['regarde', 'tient', 'prend', 'donne', 'montre', 'pilule', 'drogue', 'papier', 'lettre', 'téléphone', 'clé', 'sac', 'argent']
  if (objectKeywords.some(k => promptLower.includes(k))) {
    return 'object'
  }
  
  // Mots-clés pour plan d'établissement
  const establishingKeywords = ['arrive', 'entre', 'sort', 'plus tard', 'le lendemain', 'quelques jours', 'semaines plus tard', 'mois plus tard']
  if (establishingKeywords.some(k => promptLower.includes(k))) {
    return 'establishing'
  }
  
  // Si c'est une émotion forte, gros plan sur le speaker
  const intenseEmotions = ['peur', 'en_colere', 'triste', 'choque', 'determine']
  if (emotion && intenseEmotions.includes(emotion)) {
    return 'closeup_speaker'
  }
  
  // Si c'est une question ou un dialogue, alterner
  if (promptLower.includes('?') || promptLower.includes('demande')) {
    return 'two_shot'
  }
  
  // Si narrateur, plan large
  if (speaker === 'narrateur') {
    return 'wide'
  }
  
  // Varier aléatoirement entre les autres types
  const randomTypes: ShotType[] = ['medium', 'two_shot', 'over_shoulder', 'closeup_speaker']
  return randomTypes[Math.floor(Math.random() * randomTypes.length)]
}

// Descriptions des types de plans
function getShotDescription(shotType: ShotType, speaker: string, characters?: string[]): string {
  const otherCharacter = characters?.find(c => c.toLowerCase() !== speaker.toLowerCase()) || 'another person'
  
  const shotDescriptions: Record<ShotType, string> = {
    'establishing': `ESTABLISHING SHOT: Wide angle showing the entire location, setting the scene. Characters small in frame if visible. Focus on atmosphere and environment.`,
    'two_shot': `TWO SHOT: Both ${speaker} and ${otherCharacter} visible in frame, facing each other. Medium distance, showing body language and interaction between them.`,
    'closeup_speaker': `CLOSE-UP on ${speaker}: Tight framing on face and shoulders only. Intense focus on facial expression and emotion. Blurred background.`,
    'closeup_listener': `CLOSE-UP on ${otherCharacter}: Reaction shot. Tight framing showing their response to what ${speaker} is saying. Emotional focus.`,
    'object': `OBJECT CLOSE-UP: Dramatic close-up on the important object or action mentioned. Hands visible if holding something. Shallow depth of field.`,
    'over_shoulder': `OVER THE SHOULDER: Camera behind ${otherCharacter}, looking at ${speaker} who is speaking. Creates intimacy and perspective.`,
    'wide': `WIDE SHOT: Full scene visible, characters in context of their environment. Shows spatial relationships and setting.`,
    'medium': `MEDIUM SHOT: ${speaker} from waist up, some environment visible. Balanced composition showing both character and setting.`
  }
  
  return shotDescriptions[shotType]
}

// Construire un prompt enrichi pour le style du jeu "Drôles de Droits"
function buildImagePrompt(body: GenerateImageRequest): string {
  const styleDescriptions: { [key: string]: string } = {
    'centre_jeunesse': 'Quebec youth center (Centre Jeunesse) interior: institutional hallways with blue/orange walls, fluorescent lighting, bulletin boards with French posters, common rooms with plastic chairs',
    'cafeteria': 'Youth center cafeteria: serving counter, colorful plastic chairs, tables, food trays, French signs on walls, other teenagers in background',
    'chambre': 'Youth center bedroom: small room, single bed, desk, window with bars, personal items, institutional furniture',
    'bureau': 'Social worker office: desk with papers, filing cabinets, two chairs, window, diplomas on wall, warm but professional',
    'exterieur': 'Outside youth center: brick building entrance, parking lot, Quebec suburban environment, cloudy sky',
    'urbain': 'Montreal or Quebec City street: brick buildings, French signs, bus stop, diverse young people',
    'fugue': 'Urban night scene: dark alley, abandoned building, cold atmosphere, danger implied'
  }

  const emotionDescriptions: { [key: string]: string } = {
    'frustre': 'frustrated expression, clenched jaw, tension in shoulders, looking away',
    'nerveux': 'anxious expression, fidgeting, biting lip, avoiding eye contact',
    'confiant': 'confident stance, shoulders back, slight smile, direct gaze',
    'triste': 'downcast eyes, slumped posture, tears or wet eyes, withdrawn',
    'en_colere': 'angry expression, furrowed brows, clenched fists, aggressive stance',
    'peur': 'wide fearful eyes, hunched shoulders, stepping back, pale face',
    'determine': 'resolute expression, firm jaw, focused eyes, standing tall',
    'hesitant': 'uncertain expression, looking between options, biting nail, conflicted',
    'soulage': 'relaxed shoulders, soft smile, exhaling, peaceful expression',
    'complice': 'conspiratorial smile, leaning in, mischievous eyes, secretive',
    'tension': 'stiff body language, serious faces, charged atmosphere, dramatic lighting'
  }

  const baseStyle = styleDescriptions[body.style || 'centre_jeunesse']
  const emotionStyle = body.emotion ? emotionDescriptions[body.emotion] || body.emotion : 'neutral expression'

  // Déterminer le type de plan cinématographique
  const speaker = body.characters?.[0] || 'alex'
  const shotType = determineShotType(body.prompt, speaker, body.emotion)
  const shotDescription = getShotDescription(shotType, speaker, body.characters)
  
  console.log(`🎬 Shot type: ${shotType} for speaker: ${speaker}`)

  // Prompt très descriptif pour "Drôles de Droits"
  return `Create a high-quality digital illustration for the interactive educational game "Drôles de Droits" about youth rights in Quebec youth centers.

SCENE DESCRIPTION: ${body.prompt}

CAMERA/FRAMING:
${shotDescription}

VISUAL STYLE (MANDATORY):
- Semi-realistic graphic novel art style, similar to Life is Strange or Telltale Games
- Warm color palette with blues, oranges, and earth tones
- Dramatic cinematic lighting with depth of field
- Clean bold linework with soft shading
- Professional quality, suitable for educational game

SETTING: ${baseStyle}

CHARACTER REQUIREMENTS:
- Quebec teenager aged 15-17 years old
- Diverse representation (mixed ethnicities common in Quebec)  
- Casual clothing: hoodies, jeans, sneakers, backpacks
- ${emotionStyle}
- Realistic proportions, expressive faces
- MAINTAIN CONSISTENT APPEARANCE from reference images provided

TECHNICAL SPECS:
- Resolution: 1920x1080 pixels (16:9 widescreen)
- Horizontal landscape orientation
- NO text, NO speech bubbles, NO logos, NO watermarks
- Safe for all ages, appropriate for educational content

${body.sceneContext ? `NARRATIVE CONTEXT: ${body.sceneContext}` : ''}
${body.characters?.length ? `CHARACTERS IN SCENE: ${body.characters.join(', ')}` : ''}`
}

// Détecter automatiquement le type de plan basé sur le contenu du prompt
function detectShotType(prompt: string, explicitType?: string): ShotType {
  // Si explicitement spécifié, utiliser ce type
  if (explicitType && SHOT_DESCRIPTIONS[explicitType as ShotType]) {
    return explicitType as ShotType
  }
  
  const promptLower = prompt.toLowerCase()
  
  // ORDRE IMPORTANT: Les conditions plus spécifiques EN PREMIER
  
  // 1. Two-shot (deux personnages en conversation) - priorité haute
  if (promptLower.includes('alex et marco') || promptLower.includes('marco et alex') ||
      promptLower.includes('discutent') || promptLower.includes('conversation') ||
      promptLower.includes('parle à') || promptLower.includes('dit à')) {
    return 'two_shot'
  }
  
  // 2. Close-up sur un objet spécifique
  if (promptLower.includes('gros plan') || promptLower.includes('close-up') ||
      promptLower.includes('pilule') || promptLower.includes('drogue') || 
      promptLower.includes('lettre') || promptLower.includes('téléphone') || 
      promptLower.includes('document') || promptLower.includes('objet')) {
    return 'closeup_object'
  }
  
  // 3. Close-up sur un visage/émotion
  if (promptLower.includes('visage') || promptLower.includes('larmes') || 
      promptLower.includes('yeux') || promptLower.includes('expression') ||
      promptLower.includes('pleure') || promptLower.includes('crie')) {
    return 'closeup_character'
  }
  
  // 4. Over-the-shoulder
  if (promptLower.includes('derrière') || promptLower.includes('dos') || 
      promptLower.includes('épaule') || promptLower.includes('over shoulder')) {
    return 'over_shoulder'
  }
  
  // 5. POV (point de vue)
  if (promptLower.includes('regarde') || promptLower.includes('voit') || 
      promptLower.includes('aperçoit') || promptLower.includes('observe') ||
      promptLower.includes('pov') || promptLower.includes('point de vue')) {
    return 'pov'
  }
  
  // 6. Establishing shot (décor sans focus sur personnage) - seulement si pas de personnage mentionné
  const hasCharacter = promptLower.includes('alex') || promptLower.includes('marco') || 
                       promptLower.includes('il ') || promptLower.includes('elle ')
  
  if (!hasCharacter && (
      promptLower.includes('établissement') || promptLower.includes('bâtiment') ||
      promptLower.includes('extérieur') || promptLower.includes('ruelle') ||
      promptLower.includes('squat') || promptLower.includes('nuit'))) {
    return 'establishing'
  }
  
  // Transitions temporelles = establishing si pas de personnage au premier plan
  if (promptLower.includes('trois jours plus tard') || promptLower.includes('un mois plus tard') ||
      promptLower.includes('quelques semaines') || promptLower.includes('le lendemain')) {
    // Mais s'il y a un dialogue ou une action, c'est un medium shot
    if (hasCharacter) {
      return 'medium'
    }
    return 'establishing'
  }
  
  // 7. Par défaut: plan medium (le plus courant)
  return 'medium'
}

// Ajouter les instructions de cadrage au prompt
function addShotTypeToPrompt(prompt: string, shotType: ShotType): string {
  const shotDescription = SHOT_DESCRIPTIONS[shotType]
  
  return `${prompt}

CAMERA/FRAMING (IMPORTANT):
${shotDescription}

COMPOSITION NOTES:
- Use cinematic framing techniques
- Consider rule of thirds for character placement
- Ensure proper depth and layering
- Match the emotional tone with lighting and color`
}

// Sauvegarder l'image générée
async function saveImage(base64Data: string, prompt: string): Promise<string> {
  try {
    const chaptersDir = path.join(process.cwd(), 'public', 'images', 'chapitres', 'generated')
    await mkdir(chaptersDir, { recursive: true })

    const timestamp = Date.now()
    const slug = prompt.slice(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '_')
    const filename = `${slug}_${timestamp}.png`
    const filepath = path.join(chaptersDir, filename)

    const buffer = Buffer.from(base64Data, 'base64')
    await writeFile(filepath, buffer)

    return `/images/chapitres/generated/${filename}`
  } catch (error) {
    console.error('Erreur sauvegarde image:', error)
    return '/images/jeune_reflechi.webp'
  }
}

// Obtenir une image placeholder selon le style
function getPlaceholderImage(style?: string): string {
  const placeholders: { [key: string]: string } = {
    'centre_jeunesse': '/images/establishing_centre jeunesse.webp',
    'urbain': '/images/adolescent_bus_stress.webp',
    'interieur': '/images/cafeteria_dialogue.webp',
    'exterieur': '/images/fugue_course.webp'
  }
  return placeholders[style || 'centre_jeunesse'] || '/images/jeune_reflechi.webp'
}

// Endpoint GET pour vérifier le status
export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY
  return NextResponse.json({
    status: 'ok',
    message: 'API Génération Images',
    model: MODEL,
    sdkVersion: '@google/genai',
    apiConfigured: !!apiKey,
    fallbackAvailable: true
  })
}
