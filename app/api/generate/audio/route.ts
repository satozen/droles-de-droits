/**
 * API Route pour générer des voice-overs avec ElevenLabs TTS
 * Convertit le texte de dialogue en audio MP3 pour chaque ligne du chapitre.
 * Utilise Eleven Flash v2.5 pour le meilleur rapport qualité/latence/prix.
 *
 * POST: Génère un audio pour une ligne de dialogue
 * GET: Vérifie le status de l'API et liste les voix disponibles
 */

import { NextResponse } from 'next/server'
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MODEL_ID = 'eleven_flash_v2_5'

// Mapping personnage → voix ElevenLabs
// Ces IDs peuvent être personnalisés avec des voix clonées ou des voix de la bibliothèque
const CHARACTER_VOICES: Record<string, { voiceId: string; label: string }> = {
  alex:      { voiceId: 'pNInz6obpgDQGcFmaJgB', label: 'Adam (Alex - jeune homme)' },
  narrateur: { voiceId: 'EXAVITQu4vr4xnSDxMaL', label: 'Sarah (Narrateur)' },
  sophie:    { voiceId: 'EXAVITQu4vr4xnSDxMaL', label: 'Sarah (Sophie)' },
  karim:     { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam (Karim)' },
  david:     { voiceId: 'VR6AewLTigWG4xSOukaG', label: 'Arnold (David)' },
  diane:     { voiceId: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy (Diane)' },
  jay:       { voiceId: 'ODq5zmih8GrVes37Dizd', label: 'Patrick (Jay)' },
  marco:     { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam (Marco)' },
}

const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'

// Voice settings ajustées par émotion
function getVoiceSettings(emotion?: string) {
  const base = { similarity_boost: 0.75, stability: 0.5, style: 0.0, use_speaker_boost: true, speed: 1.0 }

  switch (emotion) {
    case 'en_colere':
    case 'frustre':
      return { ...base, stability: 0.3, style: 0.6, speed: 1.1 }
    case 'triste':
      return { ...base, stability: 0.7, style: 0.3, speed: 0.9 }
    case 'peur':
    case 'nerveux':
      return { ...base, stability: 0.3, style: 0.4, speed: 1.05 }
    case 'confiant':
    case 'determine':
    case 'victoire':
      return { ...base, stability: 0.6, style: 0.5, speed: 1.0 }
    case 'choque':
      return { ...base, stability: 0.25, style: 0.5, speed: 1.15 }
    case 'hesitant':
      return { ...base, stability: 0.4, style: 0.2, speed: 0.95 }
    case 'soulage':
      return { ...base, stability: 0.7, style: 0.3, speed: 0.95 }
    case 'tension':
    case 'grave':
      return { ...base, stability: 0.5, style: 0.4, speed: 0.95 }
    default:
      return base
  }
}

export interface GenerateAudioRequest {
  text: string
  speaker: string
  emotion?: string
  chapterSlug: string
  sceneKey: string
  lineIndex: number
  voiceIdOverride?: string
}

export interface GenerateAudioResponse {
  success: boolean
  audioPath?: string
  duration?: number
  error?: string
  isPlaceholder?: boolean
}

export async function POST(request: Request) {
  try {
    const body: GenerateAudioRequest = await request.json()

    if (!body.text || !body.speaker || !body.chapterSlug) {
      return NextResponse.json(
        { success: false, error: 'text, speaker et chapterSlug requis' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      console.warn('ELEVENLABS_API_KEY non configurée')
      return NextResponse.json({
        success: true,
        audioPath: null,
        isPlaceholder: true,
        error: 'ELEVENLABS_API_KEY non configurée'
      })
    }

    const client = new ElevenLabsClient({ apiKey })

    const voiceId = body.voiceIdOverride
      || CHARACTER_VOICES[body.speaker.toLowerCase()]?.voiceId
      || DEFAULT_VOICE_ID

    const voiceSettings = getVoiceSettings(body.emotion)

    console.log(`🎤 Generating audio: ${body.speaker} (${voiceId}) - "${body.text.slice(0, 60)}..."`)

    const audioResponse = await client.textToSpeech.convert(voiceId, {
      text: body.text,
      modelId: MODEL_ID,
      outputFormat: 'mp3_44100_128',
      languageCode: 'fr',
      voiceSettings: {
        stability: voiceSettings.stability,
        similarityBoost: voiceSettings.similarity_boost,
        style: voiceSettings.style,
        useSpeakerBoost: voiceSettings.use_speaker_boost,
        speed: voiceSettings.speed,
      },
    })

    // Collecter les chunks du stream en un seul Buffer
    const audioBuffer = await collectAudioToBuffer(audioResponse as any)

    if (audioBuffer.length === 0) {
      return NextResponse.json({
        success: true,
        audioPath: null,
        isPlaceholder: true,
        error: 'ElevenLabs n\'a pas retourné d\'audio'
      })
    }

    // Sauvegarder le fichier MP3
    const audioDir = path.join(process.cwd(), 'public', 'audio', body.chapterSlug)
    await mkdir(audioDir, { recursive: true })

    const lineNum = String(body.lineIndex + 1).padStart(2, '0')
    const filename = `${body.speaker}_${body.sceneKey}_${lineNum}.mp3`
    const filepath = path.join(audioDir, filename)

    await writeFile(filepath, audioBuffer)

    const audioPath = `/audio/${body.chapterSlug}/${filename}`
    console.log(`💾 Audio saved: ${audioPath} (${(audioBuffer.length / 1024).toFixed(1)} KB)`)

    return NextResponse.json({
      success: true,
      audioPath,
      duration: estimateDuration(audioBuffer.length),
      isPlaceholder: false,
    } as GenerateAudioResponse)

  } catch (error: any) {
    console.error('❌ Erreur génération audio:', error.message || error)

    return NextResponse.json({
      success: true,
      audioPath: null,
      isPlaceholder: true,
      error: error.message || 'Erreur lors de la génération audio'
    })
  }
}

function estimateDuration(byteSize: number): number {
  // MP3 128kbps ≈ 16 KB/s
  return Math.round(byteSize / 16000 * 10) / 10
}

async function collectAudioToBuffer(audioResponse: any): Promise<Buffer> {
  // Certains runtimes/types exposent un AsyncIterable, d'autres un ReadableStream Web.
  const chunks: Uint8Array[] = []

  if (audioResponse && typeof audioResponse[Symbol.asyncIterator] === 'function') {
    for await (const chunk of audioResponse as AsyncIterable<Uint8Array>) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks)
  }

  if (audioResponse && typeof audioResponse.getReader === 'function') {
    const reader = (audioResponse as ReadableStream<Uint8Array>).getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }
    return Buffer.concat(chunks)
  }

  // Dernier recours: essayer via Response (arrayBuffer)
  try {
    const ab = await new Response(audioResponse).arrayBuffer()
    return Buffer.from(ab)
  } catch {
    return Buffer.from([])
  }
}

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceList = Object.entries(CHARACTER_VOICES).map(([character, { voiceId, label }]) => ({
    character,
    voiceId,
    label,
  }))

  return NextResponse.json({
    status: 'ok',
    message: 'API Génération Audio - ElevenLabs TTS',
    model: MODEL_ID,
    modelName: 'Eleven Flash v2.5',
    apiConfigured: !!apiKey,
    voices: voiceList,
    outputFormat: 'mp3_44100_128',
    languageCode: 'fr',
  })
}
