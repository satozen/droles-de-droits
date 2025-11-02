// Page de jeu - Parcours progressif à travers les 12 droits
'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { droits } from '@/data/droits'
import { useProgress } from '@/hooks/useProgress'
import IntroUsager from '@/components/IntroUsager'

export default function JeuPage() {
  const { progress } = useProgress()
  const [selectedDroit, setSelectedDroit] = useState<number | null>(null)
  const [modeLibre, setModeLibre] = useState(false)
  const [showIntro, setShowIntro] = useState(false)

  // Vérifier si c'est la première visite
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro')
    if (!hasSeenIntro) {
      setShowIntro(true)
    }
  }, [])

  const handleIntroComplete = () => {
    localStorage.setItem('hasSeenIntro', 'true')
    setShowIntro(false)
  }

  const totalScenarios = droits.reduce((acc, droit) => acc + droit.scenarios.length, 0)
  const completedScenarios = progress.reduce((acc, p) => acc + (p.completed ? 1 : 0), 0)

  // Calculer le nombre de droits complétés
  const completedDroits = useMemo(() => {
    return droits.filter(droit => {
      const droitProgress = progress.filter(p => p.droitId === droit.id)
      const completed = droitProgress.filter(p => p.completed).length
      return completed === droit.scenarios.length && droit.scenarios.length > 0
    }).length
  }, [progress])

  // Système de badges
  const badges = useMemo(() => [
    {
      id: 'premier-pas',
      nom: 'Premier pas',
      description: 'Complète ton premier droit',
      icone: '🌟',
      couleur: 'from-yellow-400 to-orange-400',
      debloque: completedDroits >= 1
    },
    {
      id: 'curieux',
      nom: 'Curieux',
      description: 'Complète 3 droits',
      icone: '🔍',
      couleur: 'from-blue-400 to-cyan-400',
      debloque: completedDroits >= 3
    },
    {
      id: 'assidu',
      nom: 'Assidu',
      description: 'Complète 6 droits',
      icone: '📚',
      couleur: 'from-purple-400 to-pink-400',
      debloque: completedDroits >= 6
    },
    {
      id: 'champion',
      nom: 'Champion',
      description: 'Complète 9 droits',
      icone: '🏆',
      couleur: 'from-green-400 to-emerald-400',
      debloque: completedDroits >= 9
    },
    {
      id: 'maitre',
      nom: 'Maître des droits',
      description: 'Complète tous les 12 droits',
      icone: '👑',
      couleur: 'from-amber-400 to-yellow-500',
      debloque: completedDroits === 12
    }
  ], [completedDroits])

  const badgesDebloques = badges.filter(b => b.debloque).length

  // Calculer le prochain droit à débloquer
  const prochainDroit = useMemo(() => {
    for (const droit of droits) {
      const droitProgress = progress.filter(p => p.droitId === droit.id)
      const completed = droitProgress.filter(p => p.completed).length
      const total = droit.scenarios.length
      if (completed < total) {
        return droit.id
      }
    }
    return null
  }, [progress])

  if (selectedDroit) {
    return (
      <ScenarioComponent
        droitId={selectedDroit}
        onBack={() => setSelectedDroit(null)}
        onComplete={(droitId, scenarioId) => {
          if (typeof window !== 'undefined') {
            const existing = JSON.parse(localStorage.getItem('progress') || '[]')
            const key = `${droitId}-${scenarioId}`
            if (!existing.includes(key)) {
              existing.push(key)
              localStorage.setItem('progress', JSON.stringify(existing))
            }
            window.dispatchEvent(new Event('progress-update'))
          }
        }}
        onNextDroit={(nextDroitId) => {
          setSelectedDroit(nextDroitId)
        }}
      />
    )
  }

  return (
    <>
      {/* Intro première visite */}
      {showIntro && <IntroUsager onComplete={handleIntroComplete} />}

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-700 hover:text-gray-900 font-semibold flex items-center gap-2"
            >
              ← Accueil
            </motion.button>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/rpg">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                title="Mode Aventure RPG"
              >
                🎮 Mode Aventure
              </motion.button>
            </Link>
            <Link href="/dialogue">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                title="Dialogue Cafétéria"
              >
                💬 Dialogue Cafétéria
              </motion.button>
            </Link>
            <button
              onClick={() => {
                if (confirm('Es-tu sûr de vouloir réinitialiser toute ta progression? Cette action ne peut pas être annulée.')) {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('progress')
                    localStorage.removeItem('hasSeenIntro')
                    window.dispatchEvent(new Event('progress-update'))
                    window.location.reload()
                  }
                }
              }}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-300"
              title="Réinitialiser la progression"
            >
              🔄 Réinitialiser
            </button>
            <button
              onClick={() => setModeLibre(!modeLibre)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                modeLibre
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-200'
              }`}
            >
              {modeLibre ? '🔓 Mode libre' : '🎯 Mode guidé'}
            </button>
          </div>
        </div>

        {/* Barre de progression */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-gray-800">Ta progression</h2>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {completedScenarios}<span className="text-lg text-gray-400">/{totalScenarios}</span>
              </div>
              <div className="text-xs text-gray-500">scénarios complétés</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedScenarios / totalScenarios) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-600 text-center mb-4">
            {completedScenarios === totalScenarios ? (
              <span className="text-green-600 font-semibold">🎉 Bravo! Tu as complété tous les droits!</span>
            ) : (
              `Continue, il te reste ${totalScenarios - completedScenarios} scénario${totalScenarios - completedScenarios > 1 ? 's' : ''} !`
            )}
          </p>

          {/* Section des badges */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-800">Badges collectés</h3>
              <span className="text-sm font-semibold text-gray-600">
                {badgesDebloques}/{badges.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ scale: badge.debloque ? 1.1 : 1 }}
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-md transition-all ${
                      badge.debloque
                        ? `bg-gradient-to-br ${badge.couleur} cursor-pointer`
                        : 'bg-gray-200 opacity-40 grayscale'
                    }`}
                  >
                    {badge.debloque ? badge.icone : '🔒'}
                  </motion.div>
                  
                  {/* Tooltip au survol */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                      <div className="font-bold">{badge.nom}</div>
                      <div className="text-gray-300">{badge.description}</div>
                      {badge.debloque && <div className="text-green-400 mt-1">✓ Débloqué</div>}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Parcours des droits */}
        <div className="space-y-4">
          {droits.map((droit, index) => {
            const droitProgress = progress.filter(p => p.droitId === droit.id)
            const completed = droitProgress.filter(p => p.completed).length
            const total = droit.scenarios.length
            const isCompleted = completed === total && total > 0
            const isUnlocked = modeLibre || droit.id <= (prochainDroit || 13)
            const isCurrent = droit.id === prochainDroit

            return (
              <motion.div
                key={droit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                {/* Ligne de connexion (sauf pour le dernier) */}
                {index < droits.length - 1 && (
                  <div className="absolute left-8 top-24 w-1 h-8 bg-gray-300 -z-10" />
                )}

                <motion.div
                  whileHover={isUnlocked ? { scale: 1.02, x: 5 } : {}}
                  onClick={() => isUnlocked && setSelectedDroit(droit.id)}
                  className={`bg-white rounded-2xl p-6 shadow-md transition-all ${
                    isUnlocked ? 'cursor-pointer hover:shadow-xl' : 'opacity-60 cursor-not-allowed'
                  } ${isCurrent ? 'ring-4 ring-purple-400 ring-opacity-50' : ''} ${
                    isCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300' : ''
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Numéro et icône */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                          isCompleted
                            ? 'bg-green-500'
                            : isCurrent
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                            : isUnlocked
                            ? 'bg-gradient-to-br from-blue-400 to-purple-400'
                            : 'bg-gray-300'
                        }`}
                      >
                        {isCompleted ? '✓' : droit.icone}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-500">Droit #{droit.id}</span>
                        {!isUnlocked && <span className="text-xs bg-gray-200 px-2 py-1 rounded">🔒 Verrouillé</span>}
                        {isCurrent && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">En cours</span>}
                        {isCompleted && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">✓ Complété</span>}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{droit.titre}</h3>
                      <p className="text-sm text-gray-600 mb-3">{droit.description}</p>

                      {/* Progression du droit */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 min-w-[3rem]">
                          {completed}/{total}
                        </span>
                      </div>
                    </div>

                    {/* Flèche */}
                    {isUnlocked && (
                      <div className="flex-shrink-0 text-2xl text-purple-400">
                        →
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Message de félicitations final */}
        {completedScenarios === totalScenarios && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-8 text-center text-white shadow-xl"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold mb-2">Félicitations !</h2>
            <p className="text-lg mb-4">
              Tu maîtrises maintenant tes 12 droits en tant qu'usager·ère du système de santé !
            </p>
            <Link href="/">
              <button className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Retour à l'accueil
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
    </>
  )
}

// Composant pour afficher et répondre aux scénarios d'un droit
function ScenarioComponent({ 
  droitId, 
  onBack, 
  onComplete,
  onNextDroit
}: { 
  droitId: number
  onBack: () => void
  onComplete: (droitId: number, scenarioId: string) => void
  onNextDroit: (nextDroitId: number) => void
}) {
  const droit = droits.find(d => d.id === droitId)!
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const { progress } = useProgress()

  const currentScenario = droit.scenarios[currentScenarioIndex]
  const scenarioKey = `${droitId}-${currentScenario.id}`
  const isCompleted = progress.some(p => p.key === scenarioKey && p.completed)

  // Vérifier si ce droit est déjà entièrement complété
  const isDroitCompleted = droit.scenarios.every(scenario => 
    progress.some(p => p.key === `${droitId}-${scenario.id}` && p.completed)
  )

  // Afficher l'écran de complétion si le droit est déjà complété
  useEffect(() => {
    if (isDroitCompleted && currentScenarioIndex === 0 && !selectedAnswer) {
      setShowCompletion(true)
    }
  }, [isDroitCompleted, currentScenarioIndex, selectedAnswer])

  const handleAnswer = (answerId: string) => {
    if (showExplanation) return
    setSelectedAnswer(answerId)
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer === currentScenario.bonneReponse
      if (isCorrect) {
        onComplete(droitId, currentScenario.id)
      }
    }

    if (currentScenarioIndex < droit.scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Afficher l'écran de complétion
      setShowCompletion(true)
    }
  }

  const isCorrect = selectedAnswer === currentScenario.bonneReponse
  
  // Trouver le prochain droit NON complété
  const findNextIncompleteDroit = () => {
    for (let i = droitId + 1; i <= droits.length; i++) {
      const nextDroit = droits.find(d => d.id === i)
      if (nextDroit) {
        const isNextDroitCompleted = nextDroit.scenarios.every(scenario => 
          progress.some(p => p.key === `${i}-${scenario.id}` && p.completed)
        )
        if (!isNextDroitCompleted) {
          return i
        }
      }
    }
    return null
  }

  const nextIncompleteDroitId = findNextIncompleteDroit()
  const hasNextDroit = nextIncompleteDroitId !== null

  // Écran de complétion du droit
  if (showCompletion) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 shadow-xl text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Droit complété !
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Tu as terminé tous les scénarios du <span className="font-semibold text-purple-600">{droit.titre}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {hasNextDroit && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNextDroit(nextIncompleteDroitId!)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  Droit suivant →
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors"
              >
                Retour aux droits
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-gray-700 hover:text-gray-900 font-semibold mb-4 flex items-center gap-2"
          >
            ← Retour au parcours
          </button>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">{droit.icone}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-purple-600 mb-1">Droit #{droit.id}</div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {droit.titre}
                </h1>
                <p className="text-gray-600 mt-1">{droit.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Scénario {currentScenarioIndex + 1} / {droit.scenarios.length}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentScenarioIndex + 1) / droit.scenarios.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scénario */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenarioIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl p-8 shadow-lg mb-6"
          >
            <div className="mb-6">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-5 mb-4 border-l-4 border-purple-500">
                <p className="text-gray-800 font-medium leading-relaxed">{currentScenario.situation}</p>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {currentScenario.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentScenario.options.map((option) => {
                const isSelected = selectedAnswer === option.id
                const isCorrectOption = option.id === currentScenario.bonneReponse
                let styling = 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                
                if (showExplanation) {
                  if (isCorrectOption) {
                    styling = 'bg-green-100 border-2 border-green-500'
                  } else if (isSelected && !isCorrectOption) {
                    styling = 'bg-red-100 border-2 border-red-500'
                  }
                } else if (isSelected) {
                  styling = 'bg-purple-100 border-2 border-purple-500'
                }

                return (
                  <motion.button
                    key={option.id}
                    whileHover={!showExplanation ? { scale: 1.02, x: 5 } : {}}
                    whileTap={!showExplanation ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(option.id)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-xl transition-all ${styling} ${
                      showExplanation ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-400'
                      }`}>
                        {isSelected && !showExplanation && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                        {showExplanation && isCorrectOption && (
                          <span className="text-white text-sm">✓</span>
                        )}
                        {showExplanation && isSelected && !isCorrectOption && (
                          <span className="text-white text-sm">✗</span>
                        )}
                      </div>
                      <span className="font-medium text-gray-800 flex-1">{option.texte}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Explication */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-5 mb-6 ${
                  isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-blue-50 border-2 border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-3xl flex-shrink-0 ${isCorrect ? 'text-green-600' : 'text-blue-600'}`}>
                    {isCorrect ? '🎉' : '💡'}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold mb-1 ${isCorrect ? 'text-green-800' : 'text-blue-800'}`}>
                      {isCorrect ? 'Excellent choix !' : 'Pas tout à fait...'}
                    </p>
                    <p className="text-gray-700 leading-relaxed">{currentScenario.explication}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bouton suivant */}
            {showExplanation && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                {currentScenarioIndex < droit.scenarios.length - 1 ? 'Scénario suivant →' : 'Terminer ce droit ✓'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
