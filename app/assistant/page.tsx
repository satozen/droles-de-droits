// Page Assistant IA - Pose tes questions sur tes droits
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isMock?: boolean
  followUpQuestions?: string[]
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Salut! 👋 Je suis là pour répondre à tes questions sur tes droits en tant qu'usager du système de santé. Pose-moi n'importe quelle question!"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const questionsExemples = [
    "Puis-je refuser un traitement?",
    "Mon médecin peut-il parler à mes parents sans mon consentement?",
    "Comment porter plainte si mes droits ne sont pas respectés?",
    "Ai-je le droit de voir mon dossier médical?"
  ]

  const handleSend = async (question?: string) => {
    const messageToSend = question || input.trim()
    if (!messageToSend) return

    // Ajouter le message de l'utilisateur
    const userMessage: Message = { role: 'user', content: messageToSend }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      // Construire l'historique de conversation pour l'API (sans les followUpQuestions)
      const conversationHistory = updatedMessages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          context: 'droits-usagers',
          conversationHistory
        }),
      })

      const data = await res.json()
      
      // Ajouter la réponse de l'assistant avec les questions de suivi
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        isMock: data.isMock,
        followUpQuestions: data.followUpQuestions || []
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Erreur:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Désolé, une erreur s'est produite. Essaie à nouveau ou consulte la page Ressources pour des contacts directs."
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <button className="text-gray-700 hover:text-gray-900 font-semibold mb-4">
              ← Retour
            </button>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                Assistant IA
              </motion.h1>
              <p className="text-gray-700">
                Pose tes questions sur tes droits, je suis là pour t'aider!
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-gradient-to-br from-purple-100 to-pink-100">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/ai assistant video loop2.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Questions exemples (si aucun message utilisateur) */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <p className="text-sm text-gray-600 mb-3">Questions populaires :</p>
            <div className="grid md:grid-cols-2 gap-3">
              {questionsExemples.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-left bg-white rounded-lg p-3 text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-300 border-2 border-transparent transition-all"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Zone de messages */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 mb-4 overflow-y-auto max-h-[60vh]">
          <AnimatePresence>
            {messages.map((message, index) => (
              <div key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mb-3 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    ) : (
                      <div className="text-sm md:text-base leading-relaxed prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({children}) => <li className="ml-2">{children}</li>,
                            strong: ({children}) => <strong className="font-bold text-purple-700">{children}</strong>,
                            em: ({children}) => <em className="italic">{children}</em>,
                            code: ({children}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">{children}</code>,
                            h1: ({children}) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    {message.isMock && (
                      <p className="text-xs mt-2 opacity-70">
                        ⚠️ Mode démo - Active une clé API pour des réponses personnalisées
                      </p>
                    )}
                  </div>
                </motion.div>
                
                {/* Questions de suivi - seulement pour les messages de l'assistant et si c'est le dernier message */}
                {message.role === 'assistant' && message.followUpQuestions && message.followUpQuestions.length > 0 && index === messages.length - 1 && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4 flex justify-start"
                  >
                    <div className="max-w-[80%] space-y-2">
                      <p className="text-xs text-gray-500 mb-2 px-2">💡 Tu pourrais dire :</p>
                      {message.followUpQuestions.map((question, qIndex) => (
                        <button
                          key={qIndex}
                          onClick={() => handleSend(question)}
                          className="block w-full text-left bg-white border-2 border-purple-200 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <span className="text-purple-500 mr-2">💬</span>
                          {question}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-4"
            >
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écris ta question ici..."
              className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'Envoyer'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 Cette fonctionnalité utilise l'IA. Les réponses sont informatives mais ne remplacent pas un avis professionnel.
          </p>
        </div>
      </div>
    </main>
  )
}

