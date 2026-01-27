/**
 * ChapterPlayer - Composant réutilisable pour jouer les chapitres narratifs
 * Style néo-brutaliste avec bulles de dialogue, choix et système de progression
 * Supporte les chapitres générés automatiquement ou manuels
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { Chapter, DialogueLine, UnlockableRight } from '@/types/chapter'

// Hook pour détecter si on est sur mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

interface ChapterPlayerProps {
  chapter: Chapter
  onComplete?: (chapterId: string, unlockedRights: number[]) => void
  onExit?: () => void
}

export default function ChapterPlayer({ chapter, onComplete, onExit }: ChapterPlayerProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  
  // États du jeu
  const [currentScene, setCurrentScene] = useState<string>(chapter.config?.startScene || 'intro')
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0)
  const [showChoices, setShowChoices] = useState<boolean>(false)
  const [textComplete, setTextComplete] = useState<boolean>(false)
  const [showEndScreen, setShowEndScreen] = useState<boolean>(false)
  const [showIntroScreen, setShowIntroScreen] = useState<boolean>(true)
  const [endType, setEndType] = useState<string>('positive')
  
  // Audio
  const [musiqueMuted, setMusiqueMuted] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const voiceOverRef = useRef<HTMLAudioElement | null>(null)
  
  // Progression
  const [unlockedRights, setUnlockedRights] = useState<Set<number>>(new Set())
  
  // Données actuelles
  const currentDialogue = chapter.dialogue[currentScene]
  const currentLine = currentDialogue?.[currentLineIndex]
  
  // Vérifier les droits à débloquer
  useEffect(() => {
    if (!chapter.unlockableRights) return
    
    const newUnlocked = new Set(unlockedRights)
    
    for (const right of chapter.unlockableRights) {
      if (
        right.unlockCondition.scene === currentScene &&
        currentLineIndex >= right.unlockCondition.lineIndex
      ) {
        newUnlocked.add(right.id)
      }
    }
    
    if (newUnlocked.size !== unlockedRights.size) {
      setUnlockedRights(newUnlocked)
    }
  }, [currentScene, currentLineIndex, chapter.unlockableRights, unlockedRights])
  
  // Gestion de la musique de fond
  useEffect(() => {
    if (chapter.config?.backgroundMusic) {
      const audio = new Audio(chapter.config.backgroundMusic)
      audio.loop = true
      audio.volume = volume * 0.75
      audioRef.current = audio
      audio.play().catch(e => console.log('Autoplay bloqué:', e))
      
      return () => {
        audio.pause()
        audioRef.current = null
      }
    }
  }, [])
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musiqueMuted ? 0 : (volume * 0.75)
    }
  }, [volume, musiqueMuted])
  
  // Animation du texte
  useEffect(() => {
    if (currentLine && !showIntroScreen) {
      setShowChoices(false)
      setTextComplete(false)
      
      // Jouer le voice-over si disponible
      if (currentLine.audioFile && !musiqueMuted) {
        if (voiceOverRef.current) {
          voiceOverRef.current.pause()
        }
        
        const audio = new Audio(currentLine.audioFile)
        audio.volume = volume
        voiceOverRef.current = audio
        
        audio.addEventListener('ended', () => setTextComplete(true))
        audio.play().catch(() => {
          setTimeout(() => setTextComplete(true), 1000)
        })
      } else {
        // Pas de voice-over, simuler l'apparition du texte
        const timer = setTimeout(() => setTextComplete(true), 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [currentScene, currentLineIndex, showIntroScreen, musiqueMuted, volume])
  
  // Handlers
  const handleContinue = () => {
    if (currentLine?.choices) {
      setShowChoices(true)
      return
    }
    
    if (currentLineIndex < currentDialogue.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1)
      setShowChoices(false)
    } else {
      // Vérifier si c'est une fin
      if (currentScene.startsWith('fin_')) {
        setEndType(currentScene.replace('fin_', ''))
        setShowEndScreen(true)
        onComplete?.(chapter.metadata.id, Array.from(unlockedRights))
      }
    }
  }
  
  const handleChoice = (choiceIndex: number) => {
    // Trouver le mapping correspondant
    const mapping = chapter.choiceMappings.find(
      m => m.sceneKey === currentScene && m.choiceIndex === choiceIndex
    )
    
    if (mapping) {
      if (mapping.action === 'redirect' && mapping.actionTarget) {
        router.push(mapping.actionTarget)
        return
      }
      
      if (mapping.action === 'end') {
        setEndType('positive')
        setShowEndScreen(true)
        return
      }
      
      setCurrentScene(mapping.targetScene)
      setCurrentLineIndex(0)
      setShowChoices(false)
    }
  }
  
  const handleRestart = () => {
    setShowEndScreen(false)
    setShowIntroScreen(true)
    setCurrentScene(chapter.config?.startScene || 'intro')
    setCurrentLineIndex(0)
    setShowChoices(false)
    setTextComplete(false)
    setUnlockedRights(new Set())
  }
  
  // Styles selon le speaker
  const getBubbleStyle = () => {
    if (!currentLine) return { bg: 'bg-yellow-300', border: 'border-black border-4', shadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]', text: 'text-black', position: '' }
    
    const character = chapter.metadata.characters.find(
      c => c.id === currentLine.speaker || c.name.toLowerCase() === currentLine.speaker
    )
    
    if (character) {
      return {
        bg: character.color.bg,
        border: `${character.color.border} border-4`,
        shadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        text: character.color.text,
        position: currentLine.speaker === 'alex' ? 'left-2 sm:left-4 md:left-8 bottom-16 sm:bottom-20 md:bottom-24' : 'right-2 sm:right-4 md:right-8 bottom-16 sm:bottom-20 md:bottom-24'
      }
    }
    
    // Narrateur
    if (currentLine.speaker === 'narrateur') {
      return {
        bg: 'bg-yellow-300',
        border: 'border-black border-4',
        shadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        text: 'text-black',
        position: 'left-2 sm:left-4 right-2 sm:right-4 md:left-1/2 md:-translate-x-1/2 top-2 sm:top-4 md:top-12'
      }
    }
    
    // Default
    return {
      bg: 'bg-cyan-400',
      border: 'border-black border-4',
      shadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
      text: 'text-black',
      position: 'left-2 sm:left-4 md:left-8 bottom-16 sm:bottom-20 md:bottom-24'
    }
  }
  
  const getSpeakerLabel = () => {
    if (!currentLine) return ''
    
    const character = chapter.metadata.characters.find(
      c => c.id === currentLine.speaker || c.name.toLowerCase() === currentLine.speaker
    )
    
    if (character) return character.displayName
    if (currentLine.speaker === 'narrateur') return '📖 NARRATEUR'
    return currentLine.speaker.toUpperCase()
  }
  
  // Composant pour afficher un droit
  const RightItem = ({ right, isUnlocked }: { right: UnlockableRight, isUnlocked: boolean }) => {
    if (isUnlocked) {
      return (
        <motion.li
          initial={{ opacity: 0, x: -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          className="flex items-start gap-2 sm:gap-3 font-bold text-sm sm:text-base md:text-lg"
        >
          <motion.span 
            className="text-lime-400 text-lg sm:text-xl md:text-2xl flex-shrink-0"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
          >
            ✓
          </motion.span>
          <span className="break-words">{right.text}</span>
        </motion.li>
      )
    }
    
    return (
      <motion.li 
        className="flex items-start gap-2 sm:gap-3 font-bold text-sm sm:text-base md:text-lg opacity-40"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-gray-500 text-lg sm:text-xl md:text-2xl flex-shrink-0">🔒</span>
        <span className="blur-[3px] select-none">Droit à débloquer...</span>
      </motion.li>
    )
  }
  
  // Écran d'introduction
  if (showIntroScreen) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="w-full mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <Link href="/" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-red-500 text-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xs sm:text-sm md:text-base hover:translate-x-1 hover:translate-y-1 transition-all">
              ← RETOUR
            </Link>
            
            {/* Contrôles audio */}
            <div className="flex items-center gap-2 sm:gap-3 bg-gray-900 border-2 sm:border-4 border-black px-2 sm:px-3 md:px-4 py-1 sm:py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <button onClick={() => setMusiqueMuted(!musiqueMuted)} className="text-2xl hover:scale-110 transition-transform">
                {musiqueMuted ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musiqueMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value)
                  setVolume(newVolume)
                  if (newVolume > 0 && musiqueMuted) setMusiqueMuted(false)
                }}
                className="w-16 sm:w-20 md:w-24 h-2 bg-white border-2 border-black rounded-none appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Panneau d'intro */}
          <div className="bg-yellow-300 border-4 sm:border-6 md:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 md:p-8 lg:p-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-5 md:mb-6 text-center">
              {chapter.metadata.title.toUpperCase()}
            </h1>
            
            {chapter.metadata.subtitle && (
              <p className="text-lg sm:text-xl text-center mb-4">{chapter.metadata.subtitle}</p>
            )}
            
            <p className="text-base sm:text-lg md:text-xl font-bold text-center mb-6">
              {chapter.metadata.description}
            </p>

            {/* Info sur le droit */}
            <div className="bg-cyan-400 border-2 sm:border-4 border-black p-3 sm:p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
              <h3 className="text-base sm:text-lg md:text-xl font-black mb-2 text-center">
                {chapter.metadata.right.icon} DROIT #{chapter.metadata.right.id}: {chapter.metadata.right.title}
              </h3>
              <p className="text-center font-bold text-sm sm:text-base">
                {chapter.metadata.right.description}
              </p>
            </div>

            {/* Bouton commencer */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowIntroScreen(false)}
                className="px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 bg-lime-400 text-black border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-base sm:text-lg md:text-xl lg:text-2xl hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                COMMENCER L'HISTOIRE ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Écran de fin
  if (showEndScreen) {
    const endScreen = chapter.config?.endScreens?.[endType] || {
      title: '📖 HISTOIRE TERMINÉE',
      message: 'Tu as terminé ce chapitre!',
      color: 'bg-cyan-400'
    }
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-4xl">
          <div className={`${endScreen.color} border-4 sm:border-6 md:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 md:p-8 lg:p-12`}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-center">
              {endScreen.title}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl font-bold mb-6 text-center">
              {endScreen.message}
            </p>

            {/* Résumé des droits */}
            {chapter.unlockableRights && chapter.unlockableRights.length > 0 && (
              <div className="bg-gray-900 text-white border-2 sm:border-4 border-black p-3 sm:p-4 md:p-6 mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-black mb-3 text-center">
                  📋 DROITS APPRIS :
                </h2>
                <ul className="space-y-3">
                  {chapter.unlockableRights.map(right => (
                    <RightItem key={right.id} right={right} isUnlocked={unlockedRights.has(right.id)} />
                  ))}
                </ul>
                <p className="text-center mt-4 text-lime-400 font-bold text-sm">
                  {unlockedRights.size}/{chapter.unlockableRights.length} droits débloqués
                </p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
              <Link href="/" className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-red-500 text-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-sm sm:text-base md:text-lg hover:translate-x-1 hover:translate-y-1 transition-all text-center">
                RETOUR À L'ACCUEIL
              </Link>
              <button
                onClick={handleRestart}
                className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-cyan-400 text-black border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-sm sm:text-base md:text-lg hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                REJOUER L'HISTOIRE
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!currentLine) return null
  
  const bubbleStyle = getBubbleStyle()
  
  // Écran de jeu principal
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-6xl mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 px-2 sm:px-0">
        <Link href="/" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-red-500 text-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xs sm:text-sm md:text-base hover:translate-x-1 hover:translate-y-1 transition-all">
          ← RETOUR
        </Link>
        
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight flex-1 text-center">
          {chapter.metadata.title.toUpperCase()}
        </h1>
        
        {/* Contrôles audio */}
        <div className="flex items-center gap-2 sm:gap-3 bg-gray-900 border-2 sm:border-4 border-black px-2 sm:px-3 md:px-4 py-1 sm:py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <button onClick={() => setMusiqueMuted(!musiqueMuted)} className="text-2xl hover:scale-110 transition-transform">
            {musiqueMuted ? '🔇' : '🔊'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={musiqueMuted ? 0 : volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value)
              setVolume(newVolume)
              if (newVolume > 0 && musiqueMuted) setMusiqueMuted(false)
            }}
            className="w-16 sm:w-20 md:w-24 h-2 bg-white border-2 border-black rounded-none appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Zone principale avec image */}
      <div className="w-full max-w-5xl">
        <div className="relative w-full aspect-video border-4 sm:border-6 md:border-8 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-gray-200">
          {/* Image de fond */}
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentScene}-${currentLineIndex}`}
              src={currentLine.image}
              alt="Scène"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/jeune_reflechi.webp'
              }}
            />
          </AnimatePresence>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Bulle de dialogue - Desktop */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentScene}-${currentLineIndex}-bubble`}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`hidden md:block absolute ${bubbleStyle.position} max-w-lg lg:max-w-xl z-20`}
            >
              <div className={`${bubbleStyle.bg} ${bubbleStyle.border} ${bubbleStyle.shadow} ${bubbleStyle.text} p-4 lg:p-5`}>
                <div className="text-xs font-black mb-3 tracking-widest">
                  {getSpeakerLabel()}
                </div>
                <div className="text-base lg:text-lg font-bold leading-tight">
                  {currentLine.text}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bouton continuer - Desktop */}
          <AnimatePresence>
            {!showChoices && textComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 z-30"
              >
                <button
                  onClick={handleContinue}
                  className="px-8 py-4 bg-lime-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-xl hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  {currentLine.choices ? 'CHOISIR ▼' : 'CONTINUER ▶'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulle de dialogue - Mobile */}
        <motion.div
          key={`${currentScene}-${currentLineIndex}-mobile`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4"
        >
          <div className={`${bubbleStyle.bg} ${bubbleStyle.border} ${bubbleStyle.shadow} ${bubbleStyle.text} p-3 sm:p-4`}>
            <div className="text-xs font-black mb-2 tracking-widest">
              {getSpeakerLabel()}
            </div>
            <div className="text-sm sm:text-base font-bold leading-tight">
              {currentLine.text}
            </div>
          </div>
        </motion.div>

        {/* Bouton continuer - Mobile */}
        {!showChoices && textComplete && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex mt-4 justify-center"
          >
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-lime-400 border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-sm sm:text-base hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              {currentLine.choices ? 'CHOISIR ▼' : 'CONTINUER ▶'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Choix */}
      <AnimatePresence>
        {showChoices && currentLine.choices && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-5xl mt-4 sm:mt-6 space-y-3 sm:space-y-4 px-2 sm:px-0"
          >
            {currentLine.choices.map((choice, index) => {
              const colors = ['bg-cyan-400', 'bg-yellow-300', 'bg-pink-400', 'bg-lime-400']
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, x: 8 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(index)}
                  className={`w-full ${colors[index % colors.length]} border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4 md:p-6 text-left font-black text-sm sm:text-base md:text-lg hover:translate-x-1 hover:translate-y-1 transition-all`}
                >
                  <span className="text-lg sm:text-xl md:text-2xl mr-2 sm:mr-3">→</span> {choice}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info des droits en bas */}
      {chapter.unlockableRights && chapter.unlockableRights.length > 0 && (
        <motion.div 
          layout
          className="w-full max-w-5xl mt-4 sm:mt-6 bg-gray-900 text-white border-2 sm:border-4 border-black p-3 sm:p-4 md:p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <h3 className="font-black text-sm sm:text-base md:text-xl">
              {chapter.metadata.right.icon} DROIT #{chapter.metadata.right.id}
            </h3>
            <span className="text-lime-400 font-bold text-xs sm:text-sm">
              {unlockedRights.size}/{chapter.unlockableRights.length} débloqués
            </span>
          </div>
          <ul className="space-y-2">
            {chapter.unlockableRights.map(right => (
              <RightItem key={right.id} right={right} isUnlocked={unlockedRights.has(right.id)} />
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}

