/**
 * API Route pour générer des scénarios de chapitres avec Claude Opus 4.6
 * Génère des dialogues, choix et structures narratives pour le jeu
 * Utilise le modèle le plus avancé d'Anthropic pour une qualité narrative maximale
 */

import { NextResponse } from 'next/server'
import type { 
  GenerateScenarioRequest, 
  GenerateScenarioResponse,
  Chapter,
  DialogueScript,
  ChoiceMapping,
  UnlockableRight,
  Character
} from '@/types/chapter'

export async function POST(request: Request) {
  try {
    const body: GenerateScenarioRequest = await request.json()

    // Validation
    if (!body.chapterTitle || !body.rightId || !body.context) {
      return NextResponse.json(
        { success: false, error: 'Titre, droit et contexte requis' },
        { status: 400 }
      )
    }

    // Vérifier la clé API
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Clé API Anthropic non configurée'
      }, { status: 500 })
    }

    // Construire le prompt système pour Claude
    const systemPrompt = buildSystemPrompt(body)
    const userPrompt = buildUserPrompt(body)

    // Appeler Claude Sonnet 4.5
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-20260318',
        max_tokens: 16000,
        messages: [{ role: 'user', content: userPrompt }],
        system: systemPrompt,
        temperature: 0.8
      })
    })

    const data = await response.json()

    if (data.error) {
      console.error('Anthropic API error:', data.error)
      return NextResponse.json({
        success: false,
        error: data.error.message || 'Erreur API Anthropic'
      })
    }

    // Parser la réponse JSON de Claude
    const content = data.content[0].text
    let chapter: Partial<Chapter>

    try {
      // Extraire le JSON de la réponse
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/)
      if (jsonMatch) {
        chapter = JSON.parse(jsonMatch[1])
      } else {
        // Essayer de parser directement
        chapter = JSON.parse(content)
      }
    } catch (parseError) {
      console.error('Erreur parsing JSON:', parseError)
      return NextResponse.json({
        success: false,
        error: 'Erreur lors du parsing du scénario généré',
        rawContent: content
      })
    }

    // Ajouter les métadonnées
    const now = new Date().toISOString()
    chapter.metadata = {
      id: slugify(body.chapterTitle),
      slug: slugify(body.chapterTitle),
      title: body.chapterTitle,
      description: body.context,
      right: {
        id: body.rightId,
        title: body.rightTitle,
        description: body.rightDescription,
        icon: getRightIcon(body.rightId)
      },
      characters: body.characters.map((c, i) => ({
        id: c.name.toLowerCase().replace(/\s+/g, '_'),
        name: c.name,
        displayName: `${getCharacterEmoji(c.role)} ${c.name.toUpperCase()}`,
        color: getCharacterColors(i)
      })),
      estimatedDuration: 10,
      difficulty: 'moyen',
      tags: ['droits', `droit-${body.rightId}`],
      createdAt: now,
      updatedAt: now,
      isGenerated: true,
      status: 'draft'
    }

    // Générer les placeholders d'images
    if (chapter.dialogue) {
      chapter.images = generateImagePlaceholders(chapter.dialogue)
    }

    return NextResponse.json({
      success: true,
      chapter,
      tokensUsed: data.usage?.output_tokens || 0
    } as GenerateScenarioResponse)

  } catch (error) {
    console.error('Erreur génération scénario:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}

// Construire le prompt système
function buildSystemPrompt(body: GenerateScenarioRequest): string {
  return `Tu es un scénariste expert en jeux narratifs éducatifs pour adolescents québécois en centre jeunesse.

## TA MISSION
Créer un scénario interactif complet pour le chapitre "${body.chapterTitle}" qui enseigne le Droit #${body.rightId}: "${body.rightTitle}".

## CONTEXTE DU JEU
- Public cible: Jeunes de 12-18 ans en centre jeunesse au Québec
- Format: Visual novel interactif avec choix multiples
- Ton: Réaliste mais accessible, langage québécois naturel
- Objectif: Apprendre les droits à travers des situations concrètes

## PERSONNAGES
${body.characters.map(c => `- ${c.name}: ${c.role} - ${c.personality}`).join('\n')}

## STRUCTURE REQUISE
Tu dois générer un JSON avec la structure exacte suivante:

{
  "dialogue": {
    "intro": [
      {
        "speaker": "personnage_id",
        "text": "Dialogue en français québécois naturel",
        "image": "/images/chapitres/${slugify(body.chapterTitle)}/scene_01.webp",
        "emotion": "neutre|nerveux|confiant|etc",
        "choices": ["Choix 1", "Choix 2", "Choix 3"] // Seulement sur la dernière ligne d'une scène
      }
    ],
    "branche_a": [...],
    "branche_b": [...],
    "fin_positive": [...],
    "fin_negative": [...]
  },
  "choiceMappings": [
    {
      "sceneKey": "intro",
      "choiceIndex": 0,
      "targetScene": "branche_a"
    }
  ],
  "unlockableRights": [
    {
      "id": 1,
      "text": "Description du droit appris",
      "unlockCondition": {
        "scene": "fin_positive",
        "lineIndex": 2
      }
    }
  ],
  "config": {
    "startScene": "intro",
    "endScreens": {
      "positive": {
        "title": "✅ BON CHOIX!",
        "message": "Message de félicitations",
        "color": "bg-lime-400"
      },
      "negative": {
        "title": "⚠️ À RETENIR",
        "message": "Message d'apprentissage",
        "color": "bg-yellow-300"
      }
    }
  }
}

## RÈGLES IMPORTANTES
1. Chaque scène doit avoir 3-6 lignes de dialogue
2. Les choix doivent avoir des conséquences réalistes
3. Inclure au moins ${body.desiredBranches} branches narratives différentes
4. Le droit #${body.rightId} doit être illustré concrètement
5. Utiliser un langage québécois naturel (pas trop formel)
6. Les émotions doivent correspondre au contexte
7. Chaque image doit être unique et descriptive

## ÉMOTIONS DISPONIBLES
neutre, nerveux, confiant, triste, en_colere, peur, determine, hesitant, soulage, choque, frustre, complice, tension, victoire, lecon, info, conseil, action, resolution, grave, decouverte

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`
}

// Construire le prompt utilisateur
function buildUserPrompt(body: GenerateScenarioRequest): string {
  return `Génère le scénario complet pour le chapitre "${body.chapterTitle}".

## DROIT À ENSEIGNER
Droit #${body.rightId}: ${body.rightTitle}
${body.rightDescription}

## CONTEXTE DE L'HISTOIRE
${body.context}

## PERSONNAGES
${body.characters.map(c => `- ${c.name} (${c.role}): ${c.personality}`).join('\n')}

## EXIGENCES
- Ton: ${body.tone}
- Nombre de branches: ${body.desiredBranches}
- Le personnage principal est toujours "alex"

Génère le JSON complet maintenant.`
}

// Helpers
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getRightIcon(rightId: number): string {
  const icons: { [key: number]: string } = {
    1: '📋', 2: '🏥', 3: '👨‍⚕️', 4: '⭐', 5: '✋',
    6: '🤝', 7: '👥', 8: '🏠', 9: '🗣️', 10: '📁',
    11: '🔒', 12: '📢'
  }
  return icons[rightId] || '📋'
}

function getCharacterEmoji(role: string): string {
  const roleEmojis: { [key: string]: string } = {
    'protagoniste': '💪',
    'antagoniste': '😈',
    'ami': '🤝',
    'educateur': '👨‍🏫',
    'intervenant': '👔',
    'parent': '👨‍👩‍👧',
    'default': '👤'
  }
  return roleEmojis[role.toLowerCase()] || roleEmojis['default']
}

function getCharacterColors(index: number): Character['color'] {
  const colors = [
    { bg: 'bg-cyan-400', text: 'text-black', border: 'border-black' },
    { bg: 'bg-red-500', text: 'text-white', border: 'border-black' },
    { bg: 'bg-yellow-300', text: 'text-black', border: 'border-black' },
    { bg: 'bg-lime-400', text: 'text-black', border: 'border-black' },
    { bg: 'bg-pink-400', text: 'text-black', border: 'border-black' }
  ]
  return colors[index % colors.length]
}

function generateImagePlaceholders(dialogue: DialogueScript): Chapter['images'] {
  const images: Chapter['images'] = []
  let imageIndex = 1

  for (const [sceneKey, lines] of Object.entries(dialogue)) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      // Utiliser un placeholder avec description
      const placeholderPath = `/images/placeholder_scene_${String(imageIndex).padStart(2, '0')}.webp`
      
      images.push({
        sceneKey,
        lineIndex: i,
        prompt: `Scène: ${sceneKey}, ${line.speaker} parle avec émotion ${line.emotion || 'neutre'}`,
        imagePath: line.image || placeholderPath,
        isPlaceholder: true
      })
      imageIndex++
    }
  }

  return images
}

// Endpoint GET pour vérifier le status
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'API Génération Scénario',
    model: 'Claude Opus 4.6',
    apiConfigured: !!process.env.ANTHROPIC_API_KEY
  })
}

