// Page RPG Interactive - Aventure narrative avec LLM et gamification
// Utilise l'API Haiku pour générer des dialogues adaptatifs et dynamiques
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface PlayerStats {
  confiance: number
  connaissance: number
  energie: number
}

interface Badge {
  id: string
  nom: string
  icone: string
  debloque: boolean
}

interface Carte {
  id: string
  titre: string
  droit: string
  icone: string
  description: string
  pouvoir: string
  debloque: boolean
}

export default function RPGPage() {
  const [playerName, setPlayerName] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [stats, setStats] = useState<PlayerStats>({ confiance: 50, connaissance: 0, energie: 100 })
  const [currentScene, setCurrentScene] = useState(0)
  const [dialogue, setDialogue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [choices, setChoices] = useState<string[]>([])
  const [badges, setBadges] = useState<Badge[]>([
    { id: 'premiere-voix', nom: 'Première Voix', icone: '🗣️', debloque: false },
    { id: 'perseverant', nom: 'Persévérant', icone: '💪', debloque: false },
    { id: 'strategique', nom: 'Stratège', icone: '🧠', debloque: false },
  ])
  const [cartes, setCartes] = useState<Carte[]>([
    { 
      id: 'info', 
      titre: 'Droit à l\'Info', 
      droit: 'Droit #1',
      icone: '📋', 
      description: 'Demande des explications claires',
      pouvoir: '+15 Confiance quand utilisé',
      debloque: false 
    },
    { 
      id: 'refus', 
      titre: 'Droit de Refuser', 
      droit: 'Droit #5',
      icone: '✋', 
      description: 'Tu peux dire non',
      pouvoir: '+20 Confiance, -10 Énergie',
      debloque: false 
    },
    { 
      id: 'accompagne', 
      titre: 'Droit d\'Accompagnement', 
      droit: 'Droit #7',
      icone: '👥', 
      description: 'Demande du soutien',
      pouvoir: '+10 Confiance, +15 Énergie',
      debloque: false 
    },
  ])
  const [showBadgeUnlock, setShowBadgeUnlock] = useState<string | null>(null)
  const [showCarteUnlock, setShowCarteUnlock] = useState<string | null>(null)
  const [selectedCarte, setSelectedCarte] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fonctions de sons
  const playSound = (type: 'click' | 'success' | 'unlock' | 'card' | 'level') => {
    if (typeof window === 'undefined') return
    
    const soundMap: { [key: string]: { freq: number[], duration: number } } = {
      click: { freq: [400, 500], duration: 50 },
      success: { freq: [523, 659, 784], duration: 100 },
      unlock: { freq: [523, 659, 784, 1047], duration: 150 },
      card: { freq: [800, 1000], duration: 80 },
      level: { freq: [392, 494, 587, 698], duration: 120 }
    }

    const sound = soundMap[type]
    if (!sound) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      sound.freq.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = freq
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration / 1000)
        
        oscillator.start(audioContext.currentTime + i * sound.duration / 1000)
        oscillator.stop(audioContext.currentTime + (i + 1) * sound.duration / 1000)
      })
    } catch (e) {
      console.log('Audio non supporté')
    }
  }

  // Scénarios de base
  const scenes = [
    {
      id: 0,
      titre: 'Premier Jour au Centre',
      role: 'Éducateur',
      contexte: "C'est le premier jour de {name} au centre jeunesse. Tu lui fais visiter et l'accueilles.",
      prompt: "Accueille-moi et explique brièvement comment va se dérouler la journée."
    },
    {
      id: 1,
      titre: 'Plan d\'Intervention',
      role: 'Intervenant DPJ',
      contexte: "Tu révises le plan d'intervention de {name}. Tu dois discuter des nouveaux objectifs et des changements à son horaire.",
      prompt: "Discute de mon plan d'intervention en utilisant beaucoup de jargon professionnel."
    },
    {
      id: 2,
      titre: 'Médication Proposée',
      role: 'Psychiatre',
      contexte: "Tu rencontres {name} pour lui proposer un nouveau médicament pour 'stabiliser son humeur'.",
      prompt: "Propose-moi un nouveau médicament en utilisant des termes médicaux, sans expliquer les effets secondaires."
    }
  ]

  // Générer le dialogue avec le LLM
  const generateDialogue = async (sceneId: number) => {
    setIsLoading(true)
    setIsTyping(true)
    
    const scene = scenes[sceneId]
    const context = scene.contexte.replace('{name}', playerName || 'le jeune')
    const prompt = scene.prompt

    try {
      const response = await fetch('/api/rpg/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          context: context,
          role: scene.role,
          playerName: playerName || 'le jeune'
        })
      })

      const data = await response.json()
      const llmResponse = data.reply || "Bienvenue au centre. Comment puis-je t'aider aujourd'hui?"
      
      // Animation typing
      await typeText(llmResponse)
      
      // Générer les choix selon la scène
      generateChoices(sceneId)
      
    } catch (error) {
      console.error('Erreur LLM:', error)
      await typeText("Bienvenue. Je suis là pour t'aider dans ton parcours.")
      generateChoices(sceneId)
    }
    
    setIsLoading(false)
  }

  // Animation de texte qui s'écrit
  const typeText = async (text: string) => {
    setDialogue('')
    const words = text.split(' ')
    
    for (let i = 0; i < words.length; i++) {
      setDialogue(prev => prev + (i > 0 ? ' ' : '') + words[i])
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    setIsTyping(false)
  }

  // Générer les choix selon la scène
  const generateChoices = (sceneId: number) => {
    const choicesByScene: { [key: number]: string[] } = {
      0: [
        "😊 Merci, je suis un peu nerveux mais ça va aller",
        "😐 Ouais... je suppose",
        "🤔 J'ai des questions sur mes droits ici"
      ],
      1: [
        "😕 Euh... je ne comprends pas trop ce que ça veut dire concrètement",
        "😤 Pouvez-vous m'expliquer en mots simples? C'est MA vie après tout",
        "😔 OK... je vais juste signer"
      ],
      2: [
        "🤨 J'aimerais en savoir plus sur les effets secondaires avant de décider",
        "😰 Si vous le dites... je vais le prendre",
        "🛑 Je veux prendre le temps d'y penser et explorer d'autres options"
      ]
    }

    setChoices(choicesByScene[sceneId] || [])
  }

  // Gérer le choix du joueur
  const handleChoice = async (choiceIndex: number) => {
    playSound('click')
    const choice = choices[choiceIndex]
    
    // Impact sur les stats selon le choix
    if (choice.includes('explique') || choice.includes('savoir plus') || choice.includes('autres options')) {
      // Choix assertif
      playSound('success')
      setStats(prev => ({ 
        ...prev, 
        confiance: Math.min(prev.confiance + 15, 100),
        connaissance: prev.connaissance + 20,
        energie: Math.max(prev.energie - 5, 0)
      }))
      
      // Débloquer badge et carte
      if (!badges[0].debloque) {
        setTimeout(() => unlockBadge('premiere-voix'), 500)
      }
      
      // Débloquer cartes selon la scène
      if (currentScene === 1 && !cartes[0].debloque) {
        setTimeout(() => unlockCarte('info'), 1000)
      }
    } else if (choice.includes('signer') || choice.includes('le prendre') || choice.includes('suppose')) {
      // Choix passif
      setStats(prev => ({ 
        ...prev, 
        confiance: Math.max(prev.confiance - 10, 0),
        connaissance: prev.connaissance + 5,
        energie: Math.max(prev.energie - 15, 0)
      }))
    } else {
      // Choix neutre
      setStats(prev => ({ 
        ...prev, 
        connaissance: prev.connaissance + 10,
        energie: Math.max(prev.energie - 8, 0)
      }))
      
      // Débloquer carte selon contexte
      if (currentScene === 2 && !cartes[1].debloque) {
        setTimeout(() => unlockCarte('refus'), 1000)
      }
    }

    // Check niveau up
    const newLevel = Math.floor((stats.connaissance + 20) / 50) + 1
    const oldLevel = Math.floor(stats.connaissance / 50) + 1
    if (newLevel > oldLevel) {
      playSound('level')
    }

    // Passer à la scène suivante
    if (currentScene < scenes.length - 1) {
      setTimeout(() => {
        setCurrentScene(currentScene + 1)
        generateDialogue(currentScene + 1)
      }, 1000)
    } else {
      // Fin du prototype
      playSound('success')
      setDialogue("🎉 Bravo! Tu as complété le prototype. La suite arrive bientôt!")
      setChoices([])
      if (!cartes[2].debloque) {
        setTimeout(() => unlockCarte('accompagne'), 1000)
      }
    }
  }

  // Débloquer un badge
  const unlockBadge = (badgeId: string) => {
    playSound('unlock')
    setBadges(prev => prev.map(b => 
      b.id === badgeId ? { ...b, debloque: true } : b
    ))
    setShowBadgeUnlock(badgeId)
    setTimeout(() => setShowBadgeUnlock(null), 3000)
  }

  // Débloquer une carte
  const unlockCarte = (carteId: string) => {
    playSound('card')
    setCartes(prev => prev.map(c => 
      c.id === carteId ? { ...c, debloque: true } : c
    ))
    setShowCarteUnlock(carteId)
    setTimeout(() => setShowCarteUnlock(null), 3000)
  }

  // Utiliser une carte
  const handleUseCarte = (carteId: string) => {
    playSound('success')
    const carte = cartes.find(c => c.id === carteId)
    if (!carte || !carte.debloque) return

    setSelectedCarte(carteId)
    
    // Appliquer les effets selon la carte
    if (carteId === 'info') {
      setStats(prev => ({ ...prev, confiance: Math.min(prev.confiance + 15, 100) }))
    } else if (carteId === 'refus') {
      setStats(prev => ({ 
        ...prev, 
        confiance: Math.min(prev.confiance + 20, 100),
        energie: Math.max(prev.energie - 10, 0)
      }))
    } else if (carteId === 'accompagne') {
      setStats(prev => ({ 
        ...prev, 
        confiance: Math.min(prev.confiance + 10, 100),
        energie: Math.min(prev.energie + 15, 100)
      }))
    }

    setTimeout(() => setSelectedCarte(null), 2000)
  }

  // Démarrer le jeu
  const startGame = () => {
    if (playerName.trim()) {
      setGameStarted(true)
      generateDialogue(0)
    }
  }

  // Écran de création de personnage
  if (!gameStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20"
        >
          <Link href="/jeu" className="text-white/70 hover:text-white text-sm mb-4 inline-block">← Retour</Link>
          
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            🎮 Mode Aventure
          </h1>
          <p className="text-white/80 text-center mb-8">
            Crée ton personnage et vis ton histoire
          </p>

          <div className="space-y-6">
            <div>
              <label className="text-white font-semibold block mb-2">
                Quel est ton prénom?
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Entre ton prénom..."
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border-2 border-white/30 focus:border-pink-400 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && startGame()}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              disabled={!playerName.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Commencer l'Aventure 🚀
            </motion.button>
          </div>

          <div className="mt-8 p-4 bg-white/5 rounded-xl">
            <p className="text-white/60 text-sm text-center">
              💡 Dans ce mode, tes choix ont des conséquences réelles sur ton parcours!
            </p>
          </div>
        </motion.div>
      </main>
    )
  }

  // Écran de jeu principal
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header avec stats */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl">
              😊
            </div>
            <div>
              <h2 className="text-white font-bold">{playerName}</h2>
              <p className="text-white/60 text-sm">Niveau {Math.floor(stats.connaissance / 50) + 1}</p>
            </div>
          </div>

          {/* Stats bars */}
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-white/60 text-xs mb-1">💪 Confiance</div>
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.confiance}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/60 text-xs mb-1">🧠 Connaissance</div>
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.connaissance % 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/60 text-xs mb-1">⚡ Énergie</div>
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.energie}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de jeu principale */}
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-4 gap-6">
        {/* Sidebar gauche - Badges & Cartes */}
        <div className="col-span-1 space-y-4">
          {/* Badges */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              🏆 Badges
            </h3>
            <div className="space-y-2">
              {badges.map(badge => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: badge.debloque ? 1.05 : 1 }}
                  className={`p-2 rounded-xl flex items-center gap-2 ${
                    badge.debloque 
                      ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/50' 
                      : 'bg-white/5 opacity-40'
                  }`}
                >
                  <span className="text-2xl">{badge.debloque ? badge.icone : '🔒'}</span>
                  <span className="text-white text-sm font-semibold">{badge.nom}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cartes de Droits */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              🎴 Cartes de Droits
            </h3>
            <div className="space-y-3">
              {cartes.map(carte => (
                <motion.div
                  key={carte.id}
                  whileHover={{ scale: carte.debloque ? 1.05 : 1, rotateY: carte.debloque ? 5 : 0 }}
                  whileTap={{ scale: carte.debloque ? 0.95 : 1 }}
                  onClick={() => carte.debloque && handleUseCarte(carte.id)}
                  className={`relative rounded-xl p-3 cursor-pointer transition-all ${
                    carte.debloque 
                      ? selectedCarte === carte.id
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 scale-105'
                        : 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-2 border-blue-400/50 hover:border-purple-400'
                      : 'bg-white/5 opacity-30 cursor-not-allowed'
                  }`}
                  style={{ perspective: '1000px' }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-3xl">{carte.debloque ? carte.icone : '🔒'}</span>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">{carte.titre}</div>
                      <div className="text-white/60 text-xs">{carte.droit}</div>
                    </div>
                  </div>
                  
                  {carte.debloque && (
                    <>
                      <div className="text-white/80 text-xs mb-1">{carte.description}</div>
                      <div className="bg-white/20 rounded px-2 py-1 text-xs text-white font-semibold">
                        {carte.pouvoir}
                      </div>
                      <div className="absolute top-2 right-2">
                        <motion.div
                          animate={{ rotate: selectedCarte === carte.id ? 360 : 0 }}
                          transition={{ duration: 0.5 }}
                          className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs"
                        >
                          ✨
                        </motion.div>
                      </div>
                    </>
                  )}
                  
                  {selectedCarte === carte.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-white/20 rounded-xl flex items-center justify-center"
                    >
                      <span className="text-4xl">✨</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {cartes.some(c => c.debloque) && (
              <p className="text-white/60 text-xs mt-3 text-center">
                Clique sur une carte pour l'utiliser!
              </p>
            )}
          </div>
        </div>

        {/* Zone centrale - Dialogue */}
        <div className="col-span-3 space-y-6">
          {/* Titre de scène */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              {scenes[currentScene].titre}
            </h2>
            <p className="text-white/60">
              {scenes[currentScene].contexte}
            </p>
          </motion.div>

          {/* Box de dialogue */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 min-h-[200px] relative"
          >
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full"
                />
              </div>
            )}
            
            {!isLoading && (
              <p className="text-white text-lg leading-relaxed">
                {dialogue}
                {isTyping && <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  |
                </motion.span>}
              </p>
            )}
          </motion.div>

          {/* Choix */}
          <AnimatePresence>
            {!isTyping && choices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {choices.map((choice, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(index)}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-left text-white transition-all"
                  >
                    <span className="text-lg">{choice}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Notification de badge débloqué */}
      <AnimatePresence>
        {showBadgeUnlock && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl z-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">🏆</span>
              <div>
                <div className="font-bold text-lg">Badge Débloqué!</div>
                <div className="text-sm opacity-90">
                  {badges.find(b => b.id === showBadgeUnlock)?.nom}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification de carte débloquée */}
      <AnimatePresence>
        {showCarteUnlock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotateY: 90 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="fixed top-32 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-4 border-white/30"
            >
              <div className="flex items-center gap-3">
                <motion.span 
                  className="text-5xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  🎴
                </motion.span>
                <div>
                  <div className="font-bold text-xl">Nouvelle Carte!</div>
                  <div className="text-sm opacity-90">
                    {cartes.find(c => c.id === showCarteUnlock)?.titre}
                  </div>
                  <div className="text-xs bg-white/20 rounded px-2 py-1 mt-1 inline-block">
                    {cartes.find(c => c.id === showCarteUnlock)?.droit}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

