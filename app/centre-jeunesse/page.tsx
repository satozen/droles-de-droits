// Page Fouilles et Cafouillage - Style Néo-Brutaliste / BD
// Jeu interactif avec Karim sur les fouilles et saisies dans un centre jeunesse
// Système de visual novel avec bulles de dialogue style comic book
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type Speaker = 'alex' | 'karim' | 'narrateur'

interface DialogueLine {
  speaker: Speaker
  text: string
  image: string // Quelle image afficher
  emotion?: string // Pour ajouter des effets visuels
  choices?: string[]
}

interface DialogueScript {
  [key: string]: DialogueLine[]
}

export default function CentreJeunessePage() {
  const dialogue: DialogueScript = {
    'intro': [
      {
        speaker: 'karim',
        text: "Yo, prends ça, ça va te calmer. Personne va le savoir.",
        image: '/images/jeune_offre_drogue.jpg',
        emotion: 'pression'
      },
      {
        speaker: 'alex',
        text: "Je... je sais pas... Et si on se fait prendre?",
        image: '/images/jeune_reflechi.jpg',
        emotion: 'nerveux'
      },
      {
        speaker: 'karim',
        text: "Relax man! J'te dis que personne va rien savoir. Cache-les juste sous ton oreiller.",
        image: '/images/jeune_offre_drogue.jpg',
        emotion: 'pression'
      },
      {
        speaker: 'alex',
        text: "Sous mon oreiller... Je sais pas... Ils font des fouilles des fois. Et si je me fais prendre, qu'est-ce qui va m'arriver?",
        image: '/images/jeune_reflechi.jpg',
        emotion: 'hesite',
        choices: [
          "Ok, j'en prends et je les cache...",
          "Non! J'appelle une intervenante",
          "Non merci, j'veux rien savoir de ça"
        ]
      }
    ],
    'appelle-intervenante': [
      {
        speaker: 'alex',
        text: "Non! Je vais appeler une intervenante. Ce que tu fais, c'est pas correct.",
        image: '/images/jeune_reflechi.jpg',
        emotion: 'determine'
      },
      {
        speaker: 'karim',
        text: "Quoi?! T'es sérieux là? Tu vas me stooler?",
        image: '/images/jeune_offre_drogue.jpg',
        emotion: 'choque'
      },
      {
        speaker: 'narrateur',
        text: "Alex se dirige vers le bureau des intervenants...",
        image: '/images/intervenante_arrive_lieu_echange_drogues.jpg',
        emotion: 'action'
      },
      {
        speaker: 'narrateur',
        text: "L'intervenante arrive rapidement et prend la situation en charge. Alex a fait le bon choix en demandant de l'aide.",
        image: '/images/intervenante_arrive_lieu_echange_drogues.jpg',
        emotion: 'resolution'
      },
      {
        speaker: 'narrateur',
        text: "En signalant la situation, Alex se protège lui-même ET les autres résidents du centre. Il a le droit de vivre dans un environnement sécuritaire.",
        image: '/images/intervenante_arrive_lieu_echange_drogues.jpg',
        emotion: 'lecon'
      }
    ],
    'refus-ferme': [
      {
        speaker: 'alex',
        text: "Non merci, j'veux rien savoir de ça. Garde tes affaires.",
        image: '/images/refus_drogue_non.jpg',
        emotion: 'confiant'
      },
      {
        speaker: 'karim',
        text: "Come on man! T'es vraiment sérieux?",
        image: '/images/jeune_offre_drogue.jpg',
        emotion: 'frustre'
      },
      {
        speaker: 'alex',
        text: "Ouais, j'suis sérieux. Laisse-moi tranquille avec ça.",
        image: '/images/refus_drogue_non.jpg',
        emotion: 'fort'
      },
      {
        speaker: 'narrateur',
        text: "Alex a refusé clairement. Il a le droit de dire NON et d'être respecté dans sa décision.",
        image: '/images/jeune_reflechi.jpg',
        emotion: 'victoire'
      },
      {
        speaker: 'narrateur',
        text: "En refusant, Alex évite des conséquences graves comme une fouille ou des sanctions disciplinaires.",
        image: '/images/jeune_reflechi.jpg',
        emotion: 'lecon'
      }
    ],
    'accepte-drogue': [
      {
        speaker: 'alex',
        text: "Ok... juste cette fois alors. Je les cache où?",
        image: '/images/jeune_offre_drogue.jpg',
        emotion: 'cede'
      },
      {
        speaker: 'karim',
        text: "Mets-les sous ton oreiller. Personne va fouiller là.",
        image: '/images/jeune_offre_drogue.jpg',
        emotion: 'complice'
      },
      {
        speaker: 'narrateur',
        text: "Plus tard le même jour... L'équipe de sécurité fait une inspection de routine.",
        image: '/images/police_centre_jeunesse.jpg',
        emotion: 'tension'
      },
      {
        speaker: 'narrateur',
        text: "Les pilules sont découvertes dans la chambre d'Alex.",
        image: '/images/pilules_rejetees_lit.jpg',
        emotion: 'decouverte'
      },
      {
        speaker: 'narrateur',
        text: "L'agent de sécurité vient parler à Alex.",
        image: '/images/police_parle_au_jeune.jpg',
        emotion: 'serieux',
        choices: [
          "Que se passe-t-il maintenant?"
        ]
      }
    ],
    'consequences': [
      {
        speaker: 'narrateur',
        text: "Alex se retrouve dans une situation difficile. Une procédure disciplinaire est lancée.",
        image: '/images/police_parle_au_jeune.jpg',
        emotion: 'grave'
      },
      {
        speaker: 'narrateur',
        text: "🔍 LORS DE LA FOUILLE: L'agent devait INFORMER Alex des raisons de la fouille AVANT de la faire. C'est un DROIT fondamental.",
        image: '/images/police_parle_au_jeune.jpg',
        emotion: 'education'
      },
      {
        speaker: 'narrateur',
        text: "🛡️ RESPECT DE LA DIGNITÉ: Même lors d'une fouille, Alex a droit au RESPECT. La fouille doit être faite en privé, avec dignité.",
        image: '/images/police_parle_au_jeune.jpg',
        emotion: 'droits'
      },
      {
        speaker: 'narrateur',
        text: "⚖️ PROCÉDURE DISCIPLINAIRE: Alex a le DROIT d'être informé clairement des accusations portées contre lui. Pas de surprise!",
        image: '/images/jeune_entoure_famille_avocats.jpg',
        emotion: 'info'
      },
      {
        speaker: 'narrateur',
        text: "👨‍⚖️ REPRÉSENTATION LÉGALE: Alex a le DROIT d'avoir un avocat ou un représentant pour le défendre. C'est GRATUIT si nécessaire!",
        image: '/images/jeune_entoure_famille_avocats.jpg',
        emotion: 'support'
      },
      {
        speaker: 'narrateur',
        text: "👨‍👩‍👦 SOUTIEN FAMILIAL: Alex a le DROIT d'être accompagné par sa famille dans cette épreuve. Il n'est PAS seul.",
        image: '/images/jeune_entoure_famille_avocats.jpg',
        emotion: 'famille'
      },
      {
        speaker: 'narrateur',
        text: "🗣️ DROIT D'ÊTRE ENTENDU: Au tribunal, Alex a le DROIT de raconter SA VERSION des faits. Le juge DOIT l'écouter.",
        image: '/images/jeune_tribunal.jpg',
        emotion: 'parole'
      },
      {
        speaker: 'narrateur',
        text: "📋 RÉSUMÉ - Tes droits lors d'une fouille et procédure: 1) Être informé POURQUOI | 2) Respect de ta dignité | 3) Avoir un avocat | 4) Famille présente | 5) Être écouté",
        image: '/images/jeune_tribunal.jpg',
        emotion: 'resume'
      },
      {
        speaker: 'narrateur',
        text: "❓ QUESTION POUR TOI: Si un agent veut fouiller ta chambre sans explication, que peux-tu faire? Tu peux DEMANDER les raisons et EXIGER que tes droits soient respectés!",
        image: '/images/jeune_tribunal.jpg',
        emotion: 'question'
      },
      {
        speaker: 'narrateur',
        text: "❓ AUTRE QUESTION: Si tu es accusé de quelque chose, qui peut t'aider? Un avocat, ta famille, un intervenant de confiance. Tu n'as PAS à affronter ça seul!",
        image: '/images/jeune_tribunal.jpg',
        emotion: 'question'
      },
      {
        speaker: 'narrateur',
        text: "💡 RAPPEL IMPORTANT: La meilleure façon d'éviter tout ça? REFUSER dès le départ et DEMANDER de l'aide à un intervenant.",
        image: '/images/jeune_tribunal.jpg',
        emotion: 'conseil'
      }
    ]
  }

  const [currentScene, setCurrentScene] = useState<string>('intro')
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0)
  const [showChoices, setShowChoices] = useState<boolean>(false)
  const [textComplete, setTextComplete] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.5)
  const [showEndScreen, setShowEndScreen] = useState<boolean>(false)
  const [showIntroScreen, setShowIntroScreen] = useState<boolean>(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const voiceOverRef = useRef<HTMLAudioElement | null>(null)

  const currentDialogue = dialogue[currentScene]
  const currentLine = currentDialogue?.[currentLineIndex]
  
  // Vérifier si l'histoire est terminée
  const isStoryEnded = !currentLine || (currentLineIndex >= currentDialogue.length - 1 && !currentLine.choices && currentScene !== 'intro')

  // Gestion de la musique de fond
  useEffect(() => {
    const audio = new Audio('/audio/Droles de droits.mp3')
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio
    audio.play().catch(e => console.log('Autoplay bloqué:', e))
    
    return () => {
      audio.pause()
      audio.currentTime = 0
      audioRef.current = null
    }
  }, [])

  // Mise à jour du volume et mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Fonction pour obtenir le nom du fichier audio de Karim
  const getKarimAudioFile = (scene: string, lineIndex: number): string | null => {
    if (!dialogue[scene] || !dialogue[scene][lineIndex]) return null
    if (dialogue[scene][lineIndex].speaker !== 'karim') return null
    
    // Compter combien de fois Karim a parlé avant cette ligne dans cette scène (inclus)
    let karimLineCount = 0
    for (let i = 0; i <= lineIndex; i++) {
      if (dialogue[scene][i] && dialogue[scene][i].speaker === 'karim') {
        karimLineCount++
      }
    }
    
    // Le numéro dans le fichier est karimLineCount
    const lineNumber = String(karimLineCount).padStart(2, '0')
    
    return `/audio/karim/karim_${scene}_${lineNumber}.mp3`
  }

  // Fonction pour obtenir le nom du fichier audio d'Alex
  const getAlexAudioFile = (scene: string, lineIndex: number): string | null => {
    if (!dialogue[scene] || !dialogue[scene][lineIndex]) return null
    if (dialogue[scene][lineIndex].speaker !== 'alex') return null
    
    // Compter combien de fois Alex a parlé avant cette ligne dans cette scène (inclus)
    let alexLineCount = 0
    for (let i = 0; i <= lineIndex; i++) {
      if (dialogue[scene][i] && dialogue[scene][i].speaker === 'alex') {
        alexLineCount++
      }
    }
    
    // Le numéro dans le fichier est alexLineCount
    const lineNumber = String(alexLineCount).padStart(2, '0')
    
    return `/audio/alex/alex_${scene}_${lineNumber}.mp3`
  }

  useEffect(() => {
    if (currentLine && !showIntroScreen) {
      setShowChoices(false)
      setTextComplete(false)
      
      // Jouer le voice-over de Karim si c'est lui qui parle (seulement après le clic pour commencer)
      if (currentLine.speaker === 'karim' && !isMuted) {
        const audioFile = getKarimAudioFile(currentScene, currentLineIndex)
        if (audioFile) {
          // Arrêter le voice-over précédent s'il y en a un
          if (voiceOverRef.current) {
            voiceOverRef.current.pause()
            voiceOverRef.current.currentTime = 0
          }
          
          // Jouer le nouveau voice-over
          const audio = new Audio(audioFile)
          audio.volume = volume
          voiceOverRef.current = audio
          audio.play().catch(e => console.log('Voice-over bloqué:', e))
        }
      }

      // Jouer le voice-over d'Alex si c'est lui qui parle (seulement après le clic pour commencer)
      if (currentLine.speaker === 'alex' && !isMuted) {
        const audioFile = getAlexAudioFile(currentScene, currentLineIndex)
        if (audioFile) {
          // Arrêter le voice-over précédent s'il y en a un
          if (voiceOverRef.current) {
            voiceOverRef.current.pause()
            voiceOverRef.current.currentTime = 0
          }
          
          // Jouer le nouveau voice-over
          const audio = new Audio(audioFile)
          audio.volume = volume
          voiceOverRef.current = audio
          audio.play().catch(e => console.log('Voice-over bloqué:', e))
        }
      }
      
      // Simuler l'apparition du texte
      const timer = setTimeout(() => {
        setTextComplete(true)
      }, 1000)
      
      return () => {
        clearTimeout(timer)
        // Nettoyer le voice-over si la ligne change
        if (voiceOverRef.current) {
          voiceOverRef.current.pause()
          voiceOverRef.current.currentTime = 0
        }
      }
    }
  }, [currentScene, currentLineIndex, isMuted, volume, showIntroScreen])

  const handleContinue = () => {
    // Si la ligne a des choix, les afficher
    if (currentLine.choices) {
      setShowChoices(true)
      return
    }

    // Passer à la ligne suivante
    if (currentLineIndex < currentDialogue.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1)
      setShowChoices(false)
    } else {
      // Histoire terminée
      setShowEndScreen(true)
    }
  }

  const handleChoice = (choiceIndex: number) => {
    // Mapping des choix vers les scènes
    const currentChoices = currentLine.choices || []
    const choice = currentChoices[choiceIndex]

    // Scène intro
    if (currentScene === 'intro') {
      if (choiceIndex === 0) {
        // Alex accepte → conséquences
        setCurrentScene('accepte-drogue')
      } else if (choiceIndex === 1) {
        // Alex appelle intervenante
        setCurrentScene('appelle-intervenante')
      } else {
        // Alex refuse fermement
        setCurrentScene('refus-ferme')
      }
    }
    // Scène accepte-drogue
    else if (currentScene === 'accepte-drogue') {
      if (choiceIndex === 0) {
        // Voir les conséquences
        setCurrentScene('consequences')
      }
    }

    setCurrentLineIndex(0)
    setShowChoices(false)
  }

  // Style néo-brutaliste pour les bulles
  const getBubbleStyle = () => {
    if (currentLine.speaker === 'alex') {
      return {
        bg: 'bg-cyan-400',
        border: 'border-black border-4',
        shadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        text: 'text-black',
        position: 'left-8 bottom-24'
      }
    } else if (currentLine.speaker === 'karim') {
      return {
        bg: 'bg-red-500',
        border: 'border-black border-4',
        shadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        text: 'text-white',
        position: 'right-8 bottom-24'
      }
    } else {
      return {
        bg: 'bg-yellow-300',
        border: 'border-black border-4',
        shadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        text: 'text-black',
        position: 'left-1/2 -translate-x-1/2 top-12'
      }
    }
  }

  const getSpeakerLabel = () => {
    switch (currentLine.speaker) {
      case 'alex': return '💪 ALEX'
      case 'karim': return '😈 KARIM'
      case 'narrateur': return '📖 NARRATEUR'
      default: return ''
    }
  }

  const getEmotionEffect = () => {
    switch (currentLine.emotion) {
      case 'pression':
        return '' // Pas d'animation flash
      case 'nerveux':
        return '' // Pas d'animation bounce
      case 'fort':
        return '' // Pas de scale
      case 'danger':
        return '' // Pas de shake
      default:
        return ''
    }
  }

  // Panneau de fin
  if (showEndScreen) {
    const getEndMessage = () => {
      if (currentScene === 'appelle-intervenante' || currentScene === 'refus-ferme') {
        return {
          title: "✅ BON CHOIX!",
          message: "Tu as fait les bons choix en refusant la drogue et/ou en demandant de l'aide. Tu connais maintenant tes droits lors d'une fouille!",
          color: "bg-lime-400"
        }
      } else if (currentScene === 'consequences') {
        return {
          title: "⚠️ CONSEQUENCES APPRISES",
          message: "Tu as vu les conséquences d'accepter des drogues, mais tu connais maintenant TES DROITS même dans cette situation difficile!",
          color: "bg-yellow-300"
        }
      }
      return {
        title: "📖 HISTOIRE TERMINÉE",
        message: "Tu connais maintenant tes droits lors d'une fouille et d'une procédure disciplinaire!",
        color: "bg-cyan-400"
      }
    }

    const endContent = getEndMessage()

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header avec contrôles audio */}
          <div className="w-full mb-6 flex justify-end">
            {/* Contrôles audio */}
            <div className="flex items-center gap-3 bg-gray-900 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-2xl hover:scale-110 transition-transform"
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value)
                  setVolume(newVolume)
                  if (newVolume > 0 && isMuted) {
                    setIsMuted(false)
                  }
                }}
                className="w-24 h-2 bg-white border-2 border-black rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* Panneau de fin néo-brutaliste */}
          <div className={`${endContent.color} border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-12`}>
            <h1 className="text-5xl md:text-6xl font-black mb-6 text-center">{endContent.title}</h1>
            
            <p className="text-2xl font-bold mb-8 text-center leading-relaxed">
              {endContent.message}
            </p>

            {/* Résumé des droits appris */}
            <div className="bg-gray-900 text-white border-4 border-black p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black mb-4 text-center">📋 TES DROITS LORS D'UNE FOUILLE :</h2>
              <ul className="space-y-3 font-bold text-lg">
                <li>✓ Droit d'être <span className="text-red-400 font-black">INFORMÉ</span> des raisons AVANT la fouille</li>
                <li>✓ Droit au <span className="text-red-400 font-black">RESPECT</span> de ta dignité</li>
                <li>✓ Droit d'avoir un <span className="text-red-400 font-black">AVOCAT</span> ou représentant</li>
                <li>✓ Droit d'être <span className="text-red-400 font-black">ACCOMPAGNÉ</span> par ta famille</li>
                <li>✓ Droit d'être <span className="text-red-400 font-black">ENTENDU</span> et de présenter ta version</li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-6 justify-center flex-wrap">
              <Link 
                href="/"
                className="px-10 py-5 bg-red-500 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                RETOUR À L'ACCUEIL
              </Link>
              <button
                onClick={() => {
                  setShowEndScreen(false)
                  setShowIntroScreen(true)
                  setCurrentScene('intro')
                  setCurrentLineIndex(0)
                  setShowChoices(false)
                  setTextComplete(false)
                }}
                className="px-10 py-5 bg-cyan-400 text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                REJOUER L'HISTOIRE
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Panneau d'introduction
  if (showIntroScreen) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header avec contrôles audio */}
          <div className="w-full mb-6 flex justify-between items-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-red-500 text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              ← RETOUR
            </Link>
            
            {/* Contrôles audio */}
            <div className="flex items-center gap-3 bg-gray-900 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-2xl hover:scale-110 transition-transform"
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value)
                  setVolume(newVolume)
                  if (newVolume > 0 && isMuted) {
                    setIsMuted(false)
                  }
                }}
                className="w-24 h-2 bg-white border-2 border-black rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* Image d'établissement avec zoom lent */}
          <div className="relative w-full aspect-video border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-gray-200 mb-8">
            <motion.img
              src="/images/establishing_centre jeunesse.jpg"
              alt="Centre Jeunesse"
              className="w-full h-full object-cover"
              animate={{
                scale: [1, 1.1, 1.1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                transformOrigin: "center center"
              }}
            />
          </div>

          {/* Panneau de contexte néo-brutaliste */}
          <div className="bg-yellow-300 border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-12">
            <h1 className="text-5xl md:text-6xl font-black mb-6 text-center">
              FOUILLES ET CAFOUILLAGE
            </h1>
            
            <div className="space-y-6 text-xl font-bold leading-relaxed">
              <p className="text-center">
                Tu es <span className="text-red-600 font-black">ALEX</span>, un jeune résident dans un centre jeunesse.
              </p>
              
              <p className="text-center">
                Aujourd'hui, <span className="text-red-600 font-black">KARIM</span>, un autre résident, t'offre des pilules de drogue.
              </p>

              <div className="bg-gray-900 text-white border-4 border-black p-6 mt-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black mb-4 text-center">💡 QUE VAIS-TU FAIRE ?</h2>
                <ul className="space-y-3 font-bold text-lg">
                  <li>• Accepter et cacher les pilules?</li>
                  <li>• Refuser et demander de l'aide?</li>
                  <li>• Simplement dire non?</li>
                </ul>
                <p className="text-center mt-4 text-yellow-300 font-black">
                  Tes choix détermineront ce qui arrive ensuite...
                </p>
              </div>

              <div className="bg-cyan-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-black mb-2 text-center">🎓 CE QUE TU VAS APPRENDRE :</h3>
                <p className="text-center font-bold">
                  Tes <span className="text-red-600 font-black">DROITS</span> lors d'une fouille, d'une procédure disciplinaire, et comment te protéger dans ces situations.
                </p>
              </div>
            </div>

            {/* Bouton pour commencer */}
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setShowIntroScreen(false)}
                className="px-12 py-6 bg-lime-400 text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                COMMENCER L'HISTOIRE ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentLine) {
    return null
  }

  const bubbleStyle = getBubbleStyle()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Header néo-brutaliste */}
      <div className="w-full max-w-6xl mb-6 flex justify-between items-center gap-4">
        <Link 
          href="/"
          className="px-6 py-3 bg-red-500 text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          ← RETOUR
        </Link>
        
        <h1 className="text-2xl md:text-3xl font-black tracking-tight flex-1 text-center">
          FOUILLES ET CAFOUILLAGE
        </h1>
        
        {/* Contrôles audio */}
        <div className="flex items-center gap-3 bg-gray-900 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Bouton Mute/Unmute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-2xl hover:scale-110 transition-transform"
            title={isMuted ? "Activer le son" : "Couper le son"}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          
          {/* Slider de volume */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value)
              setVolume(newVolume)
              if (newVolume > 0 && isMuted) {
                setIsMuted(false)
              }
            }}
            className="w-24 h-2 bg-white border-2 border-black rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Zone principale avec image */}
      <div className="relative w-full max-w-5xl aspect-video border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-gray-200">
        {/* Image de fond */}
        <img
          src={currentLine.image}
          alt="Scène"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/cafeteria_triste.png'
          }}
        />

        {/* Overlay sombre pour meilleure lisibilité */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Bulle de dialogue néo-brutaliste */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScene}-${currentLineIndex}`}
            initial={{ scale: 0, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 5 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`absolute ${bubbleStyle.position} max-w-2xl z-20`}
          >
            <div className={`${bubbleStyle.bg} ${bubbleStyle.border} ${bubbleStyle.shadow} ${bubbleStyle.text} p-6 ${getEmotionEffect()}`}>
              {/* Label du speaker */}
              <div className="text-xs font-black mb-3 tracking-widest">
                {getSpeakerLabel()}
              </div>
              
              {/* Texte avec mots en évidence */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-lg md:text-xl font-bold leading-tight"
              >
                {currentLine.text.split(' ').map((word, index) => {
                  // Mettre en évidence les mots en MAJUSCULES pour le narrateur
                  const isAllCaps = word.length > 2 && word === word.toUpperCase() && /[A-ZÀ-Ÿ]/.test(word)
                  const isEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(word)
                  
                  if (currentLine.speaker === 'narrateur' && (isAllCaps || isEmoji)) {
                    return (
                      <span 
                        key={index}
                        className={`${isEmoji ? 'text-2xl' : 'text-red-600 font-black'}`}
                      >
                        {word}{' '}
                      </span>
                    )
                  }
                  return <span key={index}>{word} </span>
                })}
              </motion.div>
              
              {/* Indicateur de continuation */}
              {!showChoices && textComplete && !currentLine.choices && currentLineIndex < currentDialogue.length - 1 && (
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex justify-end mt-3"
                >
                  <span className="text-2xl font-black">▶</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bouton continuer en bas */}
        {!showChoices && textComplete && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={handleContinue}
              className="px-8 py-4 bg-lime-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {currentLine.choices ? 'CHOISIR ▼' : 'CONTINUER ▶'}
            </button>
          </div>
        )}
      </div>

      {/* Choix de réponses - style néo-brutaliste */}
      <AnimatePresence>
        {showChoices && currentLine.choices && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-5xl mt-6 space-y-4"
          >
            {currentLine.choices.map((choice, index) => {
              const colors = ['bg-cyan-400', 'bg-yellow-300', 'bg-pink-400', 'bg-lime-400']
              const bgColor = colors[index % colors.length]
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, x: 8 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(index)}
                  className={`w-full ${bgColor} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-left font-black text-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
                >
                  <span className="text-2xl mr-3">→</span> {choice}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info des droits en bas */}
      <div className="w-full max-w-5xl mt-6 bg-gray-900 text-white border-4 border-black p-6">
        <h3 className="font-black text-xl mb-2">💡 DROITS LORS D'UNE FOUILLE :</h3>
        <ul className="space-y-2 font-bold">
          <li>✓ Droit d'être informé des raisons de la fouille</li>
          <li>✓ Droit au respect de ta dignité pendant la fouille</li>
          <li>✓ Droit d'avoir un avocat ou représentant si tu es accusé</li>
          <li>✓ Droit d'être accompagné par ta famille</li>
          <li>✓ Droit d'être entendu et de présenter ta version</li>
        </ul>
      </div>
    </div>
  )
}

