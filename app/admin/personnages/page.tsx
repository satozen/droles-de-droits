/**
 * Admin - Character Sheet Generator
 * Affiche tous les personnages de la bible, permet de générer des character sheets
 * via Nano Banana 2, et met à jour la bible automatiquement.
 */
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface CharacterInfo {
  id: string
  nom: string
  role: string
  age: string
  genre: string
  hasReferenceImage: boolean
  references: string[]
  needsCharacterSheet: boolean
}

export default function PersonnagesAdmin() {
  const [characters, setCharacters] = useState<CharacterInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)
  const [generatedSheets, setGeneratedSheets] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [batchMode, setBatchMode] = useState(false)
  const [batchQueue, setBatchQueue] = useState<string[]>([])
  const [batchProgress, setBatchProgress] = useState(0)

  useEffect(() => {
    fetchCharacters()
  }, [])

  async function fetchCharacters() {
    try {
      const res = await fetch('/api/generate/character-sheet')
      const data = await res.json()
      setCharacters(data.characters || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function generateSheet(charId: string) {
    setGenerating(charId)
    setError(null)
    try {
      const res = await fetch('/api/generate/character-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: charId }),
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedSheets(prev => ({ ...prev, [charId]: data.imageData }))
        setCharacters(prev => prev.map(c =>
          c.id === charId
            ? { ...c, hasReferenceImage: true, references: [...c.references, data.imagePath], needsCharacterSheet: false }
            : c
        ))
      } else {
        setError(`Erreur pour ${charId}: ${data.error}`)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setGenerating(null)
    }
  }

  async function generateAll() {
    const queue = characters.filter(c => c.needsCharacterSheet).map(c => c.id)
    setBatchMode(true)
    setBatchQueue(queue)
    setBatchProgress(0)

    for (let i = 0; i < queue.length; i++) {
      setBatchProgress(i + 1)
      await generateSheet(queue[i])
      if (i < queue.length - 1) {
        await new Promise(r => setTimeout(r, 3000))
      }
    }

    setBatchMode(false)
  }

  const needingSheets = characters.filter(c => c.needsCharacterSheet)
  const withRefs = characters.filter(c => c.hasReferenceImage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
              &larr; Admin
            </Link>
            <h1 className="text-2xl font-bold">Personnages — Character Sheets</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
              {withRefs.length} avec refs
            </span>
            <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full">
              {needingSheets.length} à générer
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Batch generate button */}
        {needingSheets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-xl border border-purple-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">Génération en batch</h2>
                <p className="text-white/60 text-sm">
                  {needingSheets.length} personnage{needingSheets.length > 1 ? 's' : ''} sans image de référence :
                  {' '}{needingSheets.map(c => c.nom).join(', ')}
                </p>
              </div>
              <button
                onClick={generateAll}
                disabled={batchMode || !!generating}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed
                  rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {batchMode
                  ? `Génération ${batchProgress}/${batchQueue.length}...`
                  : `Générer tout (${needingSheets.length})`}
              </button>
            </div>
            {batchMode && (
              <div className="mt-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(batchProgress / batchQueue.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200"
            >
              {error}
              <button onClick={() => setError(null)} className="ml-3 text-red-400 hover:text-red-200">
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character grid */}
        {loading ? (
          <div className="text-center py-20 text-white/60">Chargement de la bible...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char, i) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border p-5 transition-all ${
                  char.hasReferenceImage
                    ? 'bg-white/5 border-white/10'
                    : 'bg-amber-900/10 border-amber-500/20'
                }`}
              >
                {/* Character header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{char.nom}</h3>
                    <p className="text-sm text-white/50">{char.role}</p>
                    <p className="text-xs text-white/40 mt-0.5">{char.age} • {char.genre}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    char.hasReferenceImage
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {char.hasReferenceImage ? 'Ref OK' : 'Pas de ref'}
                  </span>
                </div>

                {/* Image preview */}
                <div className="aspect-video bg-black/30 rounded-lg overflow-hidden mb-3 relative">
                  {generatedSheets[char.id] ? (
                    <img
                      src={generatedSheets[char.id]}
                      alt={`Character sheet: ${char.nom}`}
                      className="w-full h-full object-cover"
                    />
                  ) : char.references.length > 0 ? (
                    <img
                      src={char.references[0]}
                      alt={char.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/20 text-4xl">
                      {char.genre === 'feminin' ? '👩' : '👨'}
                    </div>
                  )}
                  {generating === char.id && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-purple-300">Génération en cours...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Existing refs list */}
                {char.references.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-white/40 mb-1">Références existantes :</p>
                    <div className="flex flex-wrap gap-1">
                      {char.references.map((ref, j) => (
                        <span key={j} className="text-xs bg-white/10 px-2 py-0.5 rounded">
                          {ref.split('/').pop()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generate button */}
                <button
                  onClick={() => generateSheet(char.id)}
                  disabled={!!generating || batchMode}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    char.needsCharacterSheet
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-white/10 hover:bg-white/15 text-white/70'
                  } disabled:bg-gray-700 disabled:cursor-not-allowed`}
                >
                  {generating === char.id
                    ? 'Génération...'
                    : char.needsCharacterSheet
                      ? 'Générer Character Sheet'
                      : 'Regénérer Character Sheet'}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-white/30 text-sm">
          Nano Banana 2 (Gemini 3.1 Flash Image) — Character Sheet Generator
          <br />
          Les images générées sont sauvegardées dans <code className="text-white/50">/images/character-sheets/</code>
        </div>
      </div>
    </div>
  )
}
