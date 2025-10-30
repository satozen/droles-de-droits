// Composant exemple montrant comment utiliser l'API Chat avec un LLM
'use client'

import { useState } from 'react'

export default function ChatExample() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: 'droits-usagers' // Optionnel: contexte pour le LLM
        }),
      })

      const data = await res.json()
      setResponse(data.reply)
      
      if (data.isMock) {
        console.log('⚠️ Réponse mock - Active ton API key pour utiliser le vrai LLM')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setResponse('Erreur lors de la communication avec l\'API')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4">Assistant IA - Droits des Usagers</h3>
      
      <div className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Pose une question sur tes droits..."
          className="w-full p-3 border rounded-lg"
          rows={4}
        />
        
        <button
          onClick={handleSendMessage}
          disabled={loading || !message.trim()}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'En cours...' : 'Envoyer'}
        </button>

        {response && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-800">{response}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Utilisation dans une page:
// import ChatExample from '@/components/ChatExample'
// <ChatExample />

