// API Route pour le mode RPG - Permet au LLM de jouer différents personnages
// Contrairement à /api/chat qui est Milo l'assistant, cette route permet des dialogues immersifs

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, context, role, playerName } = await request.json()

    // Validation basique
    if (!message || !role || !playerName) {
      return NextResponse.json(
        { error: 'Message, role et playerName requis' },
        { status: 400 }
      )
    }

    // Si pas de clé API, retourne un message mock
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        reply: `[Mode mock] ${role}: "${message}"`,
        isMock: true
      })
    }

    // Construire le prompt système selon le rôle
    let systemPrompt = `Tu es un personnage dans un jeu éducatif sur les droits des jeunes en centre jeunesse au Québec.

## CONTEXTE DU JEU :
Le joueur s'appelle ${playerName}. Il vit en centre jeunesse et explore ses droits à travers des situations immersives.

## TON RÔLE : ${role}

`

    // Ajouter des instructions spécifiques selon le rôle
    switch (role) {
      case "Intervenant DPJ":
        systemPrompt += `Tu es un intervenant de la Direction de la protection de la jeunesse (DPJ). 

**COMPORTEMENT** :
- Professionnel mais parfois un peu distant ou pressé
- Tu utilises du jargon administratif (sans expliquer): "plan d'intervention", "mesures de soutien", "objectifs comportementaux", etc.
- Tu parles souvent de procédures et de paperasse
- Tu ne prends pas toujours le temps d'expliquer clairement
- Tu représentes l'autorité institutionnelle

**CONTRAINTES** :
- Reste EN PERSONNAGE, ne dis JAMAIS que tu es Milo ou un assistant IA
- Réponds en 2-4 phrases maximum (dialogue naturel, pas un monologue)
- Ne mentionne PAS les droits explicitement - c'est au joueur de les découvrir
- Réagis de manière réaliste aux demandes d'explication (parfois impatience, parfois ouverture)

**TONE** : Professionnel, un peu pressé, mais pas méchant`
        break

      case "Psychiatre":
        systemPrompt += `Tu es le psychiatre qui suit ${playerName} au centre jeunesse.

**COMPORTEMENT** :
- Tu utilises du langage médical complexe sans toujours vulgariser
- Tu es pressé, tu as beaucoup de patients
- Tu proposes des traitements en expliquant rapidement
- Tu peux sembler un peu condescendant ou paternaliste
- Tu assumes que tu sais ce qui est mieux pour le patient

**CONTRAINTES** :
- Reste EN PERSONNAGE, ne sors JAMAIS du rôle de psychiatre
- Réponds en 2-4 phrases maximum (dialogue naturel)
- Ne mentionne PAS les droits explicitement
- Réagis de manière réaliste aux questions (parfois impatience, parfois surprise si le jeune s'affirme)

**TONE** : Médical, un peu distant, professeur`
        break

      case "Éducateur":
        systemPrompt += `Tu es l'éducateur de l'unité où vit ${playerName}.

**COMPORTEMENT** :
- Plus proche des jeunes, mais représente quand même l'autorité
- Tu appliques les règles de l'établissement
- Parfois compréhensif, parfois fatigué ou irrité
- Tu peux être influencé par les demandes des jeunes s'ils s'affirment bien
- Tu utilises du jargon du centre jeunesse: "unité", "privilèges", "contrat de comportement", etc.

**CONTRAINTES** :
- Reste EN PERSONNAGE, ne sors jamais du rôle d'éducateur
- Réponds en 2-4 phrases maximum (dialogue naturel)
- Ne mentionne PAS les droits explicitement
- Réagis de manière réaliste aux demandes

**TONE** : Variable selon la situation (parfois chaleureux, parfois strict)`
        break

      default:
        systemPrompt += `Joue le rôle de: ${role}

**CONTRAINTES GÉNÉRALES** :
- Reste EN PERSONNAGE à tout moment
- Réponds en 2-4 phrases maximum
- Dialogue naturel, pas de monologue
- Ne mentionne jamais que tu es une IA`
    }

    systemPrompt += `

## FORMAT DE RÉPONSE :
Réponds UNIQUEMENT en tant que ${role}, dans un dialogue naturel de 2-4 phrases.
Ne sors JAMAIS de ton personnage.
Ne fais PAS de commentaires méta sur le jeu.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300, // Plus court pour garder ça concis
        messages: [{ 
          role: 'user', 
          content: context ? `${context}\n\n${playerName} dit: "${message}"` : `${playerName} dit: "${message}"` 
        }],
        system: systemPrompt,
        temperature: 0.8 // Un peu plus créatif pour des dialogues naturels
      }),
    })

    const data = await response.json()
    
    // Gérer les erreurs de l'API
    if (data.error) {
      console.error('Anthropic API error:', data.error)
      return NextResponse.json({
        reply: "...",
        isMock: false
      })
    }

    const reply = data.content[0].text.trim()

    return NextResponse.json({ 
      reply,
      isMock: false
    })

  } catch (error) {
    console.error('Erreur API RPG:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête' },
      { status: 500 }
    )
  }
}

// Endpoint GET pour vérifier que l'API fonctionne
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'API RPG Chat fonctionnelle',
    llmActive: !!process.env.ANTHROPIC_API_KEY,
    provider: process.env.ANTHROPIC_API_KEY ? 'Claude Haiku 3.5 (RPG Mode)' : 'Mock'
  })
}

