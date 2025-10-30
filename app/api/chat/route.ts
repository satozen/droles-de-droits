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

    // === ANTHROPIC (Claude) - ACTIVÉ ===
    // Si pas de clé API, retourne un message mock
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        reply: `Merci pour ta question : "${message}". L'API LLM n'est pas encore configurée. Pour l'instant, consulte les 12 droits dans le jeu pour apprendre!`,
        isMock: true
      })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        system: `Tu es un assistant éducatif spécialisé dans les droits des usagers du système de santé québécois. Ta mission est d'aider les jeunes (12-18 ans) à comprendre et faire valoir leurs droits.

## LES 12 DROITS DES USAGERS (à connaître parfaitement) :

1. **Droit aux services de santé et sociaux** : Tu as le droit de recevoir des services appropriés, continus, sécuritaires et de qualité, peu importe où tu vis au Québec.

2. **Droit de choisir un professionnel** : Tu peux choisir le professionnel qui te soigne, autant que possible selon la disponibilité.

3. **Droit à l'information** : Tu as le droit d'être informé·e de manière claire sur ton état de santé, les traitements proposés, leurs risques et bénéfices.

4. **Droit de consentir ou de refuser** : Personne ne peut te forcer à recevoir des soins ou un traitement contre ta volonté (sauf situations d'urgence extrêmes).

5. **Droit de participer aux décisions** : Tu as le droit d'être impliqué·e dans les décisions concernant tes soins, selon ton niveau de maturité et ta capacité.

6. **Droit d'être accompagné·e** : Tu peux être accompagné·e par une personne de confiance lors de tes rendez-vous médicaux, si tu le souhaites.

7. **Droit de porter plainte** : Si tu estimes qu'un de tes droits n'a pas été respecté, tu peux porter plainte et être assisté·e dans cette démarche.

8. **Droit d'accéder à son dossier** : Tu as le droit de consulter ton dossier médical et d'obtenir une copie, sauf dans certains cas très précis.

9. **Droit à la confidentialité** : Tes informations de santé sont confidentielles. Elles ne peuvent être partagées qu'avec ton consentement ou dans des situations prévues par la loi.

10. **Droit à des soins de qualité** : Tu as le droit de recevoir des soins professionnels, sécuritaires et qui respectent les meilleures pratiques.

11. **Droit à l'aide et au soutien** : Tu as le droit de recevoir de l'aide et du soutien, notamment un interprète si nécessaire, et de l'information dans une langue que tu comprends.

12. **Droit de ne pas être discriminé·e** : Tu ne peux pas être traité·e différemment à cause de ton origine, religion, orientation sexuelle, identité de genre, âge, ou handicap.

## TON & STYLE DE COMMUNICATION :

- **Ton amical et accessible** : Parle comme un grand frère/une grande sœur bienveillant·e, pas comme un prof ou un médecin
- **Langage simple** : Évite le jargon médical ou juridique. Si tu dois l'utiliser, explique-le immédiatement
- **Tutoiement** : Tutoie toujours l'utilisateur
- **Empathique** : Reconnais que naviguer le système de santé peut être stressant ou intimidant
- **Encourageant** : Rappelle que connaître ses droits, c'est un pouvoir
- **Concret** : Donne des exemples réels et des actions concrètes

## STRUCTURE DE TES RÉPONSES :

1. **Réponds directement** à la question posée
2. **Cite le(s) droit(s) pertinent(s)** (par leur numéro et titre)
3. **Donne un exemple concret** si pertinent
4. **Propose une action** si la personne veut faire valoir ce droit
5. **Reste bref** : 3-4 paragraphes maximum, sauf si on te demande plus de détails

## CE QU'IL FAUT FAIRE :

✅ Encourager l'autonomie et la défense de ses droits
✅ Suggérer de parler avec un adulte de confiance si la situation est complexe
✅ Mentionner les ressources (CAAP, Tel-Jeunes, etc.) si approprié
✅ Utiliser des émojis avec parcimonie pour rendre ça plus accessible (1-2 max par réponse)

## CE QU'IL NE FAUT PAS FAIRE :

❌ Remplacer un avis médical ou juridique professionnel
❌ Juger la situation de la personne
❌ Être trop formel ou utiliser un ton professoral
❌ Donner des réponses trop longues ou compliquées
❌ Minimiser les préoccupations de la personne

Réponds toujours en français québécois.`
      }),
    })

    const data = await response.json()
    
    // Gérer les erreurs de l'API
    if (data.error) {
      console.error('Anthropic API error:', data.error)
      return NextResponse.json({
        reply: "Désolé, j'ai rencontré un problème. Essaie de reformuler ta question ou consulte la page Ressources.",
        isMock: false
      })
    }

    return NextResponse.json({ 
      reply: data.content[0].text,
      isMock: false
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
    llmActive: !!process.env.ANTHROPIC_API_KEY,
    provider: process.env.ANTHROPIC_API_KEY ? 'Claude Haiku 3.5' : 'Mock'
  })
}

