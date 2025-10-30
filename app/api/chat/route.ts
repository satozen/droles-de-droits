// API Route pour appels LLM sécurisés (OpenAI/Anthropic)
// La clé API reste côté serveur, jamais exposée au client

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json()

    // Validation basique
    if (!message) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      )
    }

    // Pour l'instant, retourne une réponse mock
    // Quand tu auras ta clé API, décommente la section ci-dessous
    
    /* 
    // === POUR OPENAI ===
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant éducatif spécialisé dans les droits des usagers du système de santé québécois. Tu aides les jeunes à comprendre leurs droits de manière claire et accessible.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    return NextResponse.json({ 
      reply: data.choices[0].message.content 
    })
    */

    /* 
    // === POUR ANTHROPIC (Claude) ===
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        system: 'Tu es un assistant éducatif spécialisé dans les droits des usagers du système de santé québécois. Tu aides les jeunes à comprendre leurs droits de manière claire et accessible.'
      }),
    })

    const data = await response.json()
    return NextResponse.json({ 
      reply: data.content[0].text 
    })
    */

    // Réponse mock pour tester (retire quand tu actives le vrai LLM)
    return NextResponse.json({
      reply: `Merci pour ta question : "${message}". L'API LLM sera activée prochainement. Pour l'instant, consulte les 12 droits dans le jeu pour apprendre!`,
      isMock: true
    })

  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête' },
      { status: 500 }
    )
  }
}

// Optionnel: endpoint GET pour vérifier que l'API fonctionne
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'API Chat fonctionnelle',
    llmActive: false // Change à true quand tu actives OpenAI/Anthropic
  })
}

