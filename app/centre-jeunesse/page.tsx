// Page Fouilles et Cafouillage - Style Néo-Brutaliste / BD
// Jeu interactif avec Jay sur les fouilles et saisies dans un centre jeunesse
// Système de visual novel avec bulles de dialogue style comic book
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// Hook pour détecter si on est sur mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

type Speaker = 'alex' | 'jay' | 'narrateur'

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
  const router = useRouter()
  const isMobile = useIsMobile()
  const dialogue: DialogueScript = {
    'intro': [
      {
        speaker: 'jay',
        text: "Yo, j'ai un truc pour toi. Ça va t'aider à relaxer. Personne va rien savoir.",
        image: '/images/jeune_offre_drogue.webp',
        emotion: 'pression'
      },
      {
        speaker: 'alex',
        text: "Je... je sais pas... Et si on se fait prendre?",
        image: '/images/jeune_reflechi.webp',
        emotion: 'nerveux'
      },
      {
        speaker: 'jay',
        text: "Relax man! J'te dis que personne va rien savoir. Cache ça juste sous ton oreiller.",
        image: '/images/jeune_offre_drogue.webp',
        emotion: 'pression'
      },
      {
        speaker: 'alex',
        text: "Sous mon oreiller... Je sais pas... Ils font des fouilles des fois. Et si je me fais prendre, qu'est-ce qui va m'arriver?",
        image: '/images/jeune_reflechi.webp',
        emotion: 'hesite',
        choices: [
          "Ok, je prends ça et je le cache...",
          "Non! J'appelle une intervenante",
          "Non merci, j'veux rien savoir de ça"
        ]
      }
    ],
    'appelle-intervenante': [
      {
        speaker: 'alex',
        text: "Non! Je vais appeler une intervenante. Ce que tu fais, c'est pas correct.",
        image: '/images/jeune_reflechi.webp',
        emotion: 'determine'
      },
      {
        speaker: 'jay',
        text: "Quoi?! T'es sérieux là? Tu vas me stooler?",
        image: '/images/jeune_offre_drogue.webp',
        emotion: 'choque'
      },
      {
        speaker: 'narrateur',
        text: "Alex se dirige vers le bureau des intervenants...",
        image: '/images/intervenante_arrive_lieu_echange_drogues.webp',
        emotion: 'action'
      },
      {
        speaker: 'narrateur',
        text: "L'intervenante arrive rapidement et prend la situation en charge. Alex a fait le bon choix en demandant de l'aide.",
        image: '/images/intervenante_arrive_lieu_echange_drogues.webp',
        emotion: 'resolution'
      },
      {
        speaker: 'narrateur',
        text: "En signalant la situation, Alex se protège lui-même ET les autres résidents du centre. Il a le droit de vivre dans un environnement sécuritaire.",
        image: '/images/intervenante_arrive_lieu_echange_drogues.webp',
        emotion: 'lecon'
      }
    ],
    'refus-ferme': [
      {
        speaker: 'alex',
        text: "Non merci, j'veux rien savoir de ça. Garde tes affaires.",
        image: '/images/refus_drogue_non.webp',
        emotion: 'confiant'
      },
      {
        speaker: 'jay',
        text: "Come on man! T'es vraiment sérieux?",
        image: '/images/jeune_offre_drogue.webp',
        emotion: 'frustre'
      },
      {
        speaker: 'alex',
        text: "Ouais, j'suis sérieux. Laisse-moi tranquille avec ça.",
        image: '/images/refus_drogue_non.webp',
        emotion: 'fort'
      },
      {
        speaker: 'narrateur',
        text: "Alex a refusé clairement. Il a le droit de dire NON et d'être respecté dans sa décision.",
        image: '/images/jeune_reflechi.webp',
        emotion: 'victoire'
      },
      {
        speaker: 'narrateur',
        text: "En refusant, Alex évite des conséquences graves comme une fouille ou des sanctions disciplinaires.",
        image: '/images/jeune_reflechi.webp',
        emotion: 'lecon'
      }
    ],
    'accepte-drogue': [
      {
        speaker: 'alex',
        text: "Ok... juste cette fois alors. Je cache ça où?",
        image: '/images/jeune_offre_drogue.webp',
        emotion: 'cede'
      },
      {
        speaker: 'jay',
        text: "Mets ça sous ton oreiller. Personne va fouiller là.",
        image: '/images/jeune_offre_drogue.webp',
        emotion: 'complice'
      },
      {
        speaker: 'narrateur',
        text: "Plus tard le même jour... L'équipe de sécurité fait une inspection de routine.",
        image: '/images/police_centre_jeunesse.webp',
        emotion: 'tension'
      },
      {
        speaker: 'narrateur',
        text: "L'objet interdit est découvert dans la chambre d'Alex.",
        image: '/images/pilules_rejetees_lit.webp',
        emotion: 'decouverte'
      },
      {
        speaker: 'narrateur',
        text: "L'agent de sécurité vient parler à Alex.",
        image: '/images/police_parle_au_jeune.webp',
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
        image: '/images/police_parle_au_jeune.webp',
        emotion: 'grave'
      },
      {
        speaker: 'narrateur',
        text: "💡 PRÉVENTION: Mais tu sais quoi? La meilleure solution à tout ça, c'est peut-être de prendre de meilleures décisions dès le départ. Refuser, demander de l'aide, faire les bons choix.",
        image: '/images/jeune_reflechi.webp',
        emotion: 'conseil',
        choices: [
          "En savoir plus sur mes droits"
        ]
      }
    ],
    /* Section complète sur les droits - En développement
    'droits-complets': [
      {
        speaker: 'narrateur',
        text: "⚖️ PROCÉDURE DISCIPLINAIRE: Alex a le DROIT d'être informé clairement des accusations portées contre lui. Pas de surprise!",
        image: '/images/jeune_entoure_famille_avocats.webp',
        emotion: 'info'
      },
      {
        speaker: 'narrateur',
        text: "👨‍⚖️ REPRÉSENTATION LÉGALE: Alex a le DROIT d'avoir un avocat ou un représentant pour le défendre. C'est GRATUIT si nécessaire!",
        image: '/images/jeune_entoure_famille_avocats.webp',
        emotion: 'support'
      },
      {
        speaker: 'narrateur',
        text: "👨‍👩‍👦 SOUTIEN FAMILIAL: Alex a le DROIT d'être accompagné par sa famille dans cette épreuve. Il n'est PAS seul.",
        image: '/images/jeune_entoure_famille_avocats.webp',
        emotion: 'famille'
      },
      {
        speaker: 'narrateur',
        text: "🗣️ DROIT D'ÊTRE ENTENDU: Au tribunal, Alex a le DROIT de raconter SA VERSION des faits. Le juge DOIT l'écouter.",
        image: '/images/jeune_tribunal.webp',
        emotion: 'parole'
      }
    ]
    */
  }

  const [currentScene, setCurrentScene] = useState<string>('intro')
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0)
  const [showChoices, setShowChoices] = useState<boolean>(false)
  const [textComplete, setTextComplete] = useState<boolean>(false)
  const [musiqueMuted, setMusiqueMuted] = useState<boolean>(false) // Contrôle de la musique
  const [voiceMuted, setVoiceMuted] = useState<boolean>(false) // Contrôle des voice-overs
  const [volume, setVolume] = useState<number>(0.5) // Volume pour voice-overs
  const [showEndScreen, setShowEndScreen] = useState<boolean>(false)
  const [showIntroScreen, setShowIntroScreen] = useState<boolean>(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const voiceOverRef = useRef<HTMLAudioElement | null>(null)
  
  // Système de déblocage progressif des droits
  const [unlockedRights, setUnlockedRights] = useState<Set<number>>(new Set())
  
  // Débloquer les droits progressivement selon la scène et la progression
  useEffect(() => {
    const newUnlocked = new Set(unlockedRights)
    
    // Droit 1: Dès qu'on parle de fouille (scène accepte-drogue, ligne 2+)
    if (currentScene === 'accepte-drogue' && currentLineIndex >= 2) {
      newUnlocked.add(1) // Droit d'être informé des raisons
    }
    
    // Droit 2: Quand l'objet est découvert (scène accepte-drogue, ligne 3+)
    if (currentScene === 'accepte-drogue' && currentLineIndex >= 3) {
      newUnlocked.add(2) // Motifs raisonnables
    }
    
    // Droit 3: Dans la scène des conséquences
    if (currentScene === 'consequences' && currentLineIndex >= 0) {
      newUnlocked.add(1)
      newUnlocked.add(2)
      newUnlocked.add(3) // Possession de quelque chose de dangereux/illégal
    }
    
    // Droit 4: Dans toutes les fins (quand on parle du respect et de la dignité)
    if (currentScene === 'appelle-intervenante' && currentLineIndex >= 2) {
      newUnlocked.add(1)
      newUnlocked.add(2)
      newUnlocked.add(3)
      newUnlocked.add(4) // Respect de la dignité
    }
    
    if (currentScene === 'refus-ferme' && currentLineIndex >= 1) {
      newUnlocked.add(1)
      newUnlocked.add(2)
      newUnlocked.add(3)
      newUnlocked.add(4) // Respect de la dignité
    }
    
    if (currentScene === 'consequences' && currentLineIndex >= 2) {
      newUnlocked.add(4) // Respect de la dignité
    }
    
    if (newUnlocked.size !== unlockedRights.size) {
      setUnlockedRights(newUnlocked)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene, currentLineIndex])

  const currentDialogue = dialogue[currentScene]
  const currentLine = currentDialogue?.[currentLineIndex]
  
  // Vérifier si l'histoire est terminée
  const isStoryEnded = !currentLine || (currentLineIndex >= currentDialogue.length - 1 && !currentLine.choices && currentScene !== 'intro')

  // Gestion de la musique de fond (25% plus basse que les voice-overs)
  useEffect(() => {
    const audio = new Audio('/audio/Droles de droits.mp3')
    audio.loop = true
    audio.volume = volume * 0.75 // Musique à 75% du volume des voice-overs
    audioRef.current = audio
    audio.play().catch(e => console.log('Autoplay bloqué:', e))
    
    return () => {
      audio.pause()
      audio.currentTime = 0
      audioRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mise à jour du volume et mute de la musique (musique à 75% du volume des voice-overs)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musiqueMuted ? 0 : (volume * 0.75)
    }
  }, [volume, musiqueMuted])

  // Fonction pour obtenir le nom du fichier audio de Jay
  const getJayAudioFile = (scene: string, lineIndex: number): string | null => {
    if (!dialogue[scene] || !dialogue[scene][lineIndex]) return null
    if (dialogue[scene][lineIndex].speaker !== 'jay') return null

    // Compter combien de fois Jay a parlé avant cette ligne dans cette scène (inclus)
    let jayLineCount = 0
    for (let i = 0; i <= lineIndex; i++) {
      if (dialogue[scene][i] && dialogue[scene][i].speaker === 'jay') {
        jayLineCount++
      }
    }

    // Le numéro dans le fichier est jayLineCount
    const lineNumber = String(jayLineCount).padStart(2, '0')

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
      
      let hasAudio = false
      let timer: NodeJS.Timeout | null = null
      
      // Jouer le voice-over de Jay si c'est lui qui parle (seulement après le clic pour commencer)
      if (currentLine.speaker === 'jay' && !voiceMuted) {
        const audioFile = getJayAudioFile(currentScene, currentLineIndex)
        if (audioFile) {
          hasAudio = true
          // Arrêter le voice-over précédent s'il y en a un
          if (voiceOverRef.current) {
            voiceOverRef.current.pause()
            voiceOverRef.current.currentTime = 0
          }
          
          // Jouer le nouveau voice-over
          const audio = new Audio(audioFile)
          audio.volume = volume
          voiceOverRef.current = audio
          
          // Écouter la fin de l'audio pour mettre à jour textComplete
          audio.addEventListener('ended', () => {
            setTextComplete(true)
          })
          
          audio.play().catch(e => {
            console.log('Voice-over bloqué:', e)
            // Si l'audio ne peut pas jouer, mettre textComplete à true après un délai
            timer = setTimeout(() => setTextComplete(true), 1000)
          })
        }
      }

      // Jouer le voice-over d'Alex si c'est lui qui parle (seulement après le clic pour commencer)
      if (currentLine.speaker === 'alex' && !voiceMuted) {
        const audioFile = getAlexAudioFile(currentScene, currentLineIndex)
        if (audioFile) {
          hasAudio = true
          // Arrêter le voice-over précédent s'il y en a un
          if (voiceOverRef.current) {
            voiceOverRef.current.pause()
            voiceOverRef.current.currentTime = 0
          }
          
          // Jouer le nouveau voice-over
          const audio = new Audio(audioFile)
          audio.volume = volume
          voiceOverRef.current = audio
          
          // Écouter la fin de l'audio pour mettre à jour textComplete
          audio.addEventListener('ended', () => {
            setTextComplete(true)
          })
          
          audio.play().catch(e => {
            console.log('Voice-over bloqué:', e)
            // Si l'audio ne peut pas jouer, mettre textComplete à true après un délai
            timer = setTimeout(() => setTextComplete(true), 1000)
          })
        }
      }
      
      // Si pas de voice-over (narrateur ou muted), simuler l'apparition du texte
      if (!hasAudio) {
        timer = setTimeout(() => {
          setTextComplete(true)
        }, 1000)
      }
      
      return () => {
        if (timer) {
          clearTimeout(timer)
        }
        // Nettoyer le voice-over si la ligne change
        if (voiceOverRef.current) {
          voiceOverRef.current.pause()
          voiceOverRef.current.currentTime = 0
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // currentLine, getAlexAudioFile, getJayAudioFile sont dérivés de currentScene/currentLineIndex
  }, [currentScene, currentLineIndex, voiceMuted, volume, showIntroScreen])

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
    // Scène consequences
    else if (currentScene === 'consequences') {
      if (choiceIndex === 0) {
        // Rediriger vers la page en développement
        router.push('/en-developpement')
        return
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
        position: 'left-2 sm:left-4 md:left-8 bottom-16 sm:bottom-20 md:bottom-24'
      }
    } else if (currentLine.speaker === 'jay') {
      return {
        bg: 'bg-red-500',
        border: 'border-black border-4',
        shadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        text: 'text-white',
        position: 'right-2 sm:right-4 md:right-8 bottom-16 sm:bottom-20 md:bottom-24'
      }
    } else {
      return {
        bg: 'bg-yellow-300',
        border: 'border-black border-4',
        shadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        text: 'text-black',
        position: 'left-2 sm:left-4 right-2 sm:right-4 md:left-1/2 md:-translate-x-1/2 top-2 sm:top-4 md:top-12'
      }
    }
  }

  const getSpeakerLabel = () => {
    switch (currentLine.speaker) {
      case 'alex': return '💪 ALEX'
      case 'jay': return '😈 JAY'
      case 'narrateur': return '📖 NARRATEUR'
      default: return ''
    }
  }
  
  // Définition des droits
  const rightsData = [
    { id: 1, text: "Droit d'être informé des raisons de la fouille" },
    { id: 2, text: "Ils doivent avoir des motifs raisonnables" },
    { id: 3, text: "Penser que tu es en possession de quelque chose de dangereux ou illégal" },
    { id: 4, text: "Droit au respect de ta dignité pendant la fouille" }
  ]
  
  // Composant pour afficher un droit (débloqué ou verrouillé)
  const RightItem = ({ right, isUnlocked }: { right: typeof rightsData[0], isUnlocked: boolean }) => {
    if (isUnlocked) {
      return (
        <motion.li
          initial={{ opacity: 0, x: -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex items-start gap-2 sm:gap-3 font-bold text-sm sm:text-base md:text-lg"
        >
          <motion.span 
            className="text-lime-400 text-lg sm:text-xl md:text-2xl flex-shrink-0"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            ✓
          </motion.span>
          <span className="break-words">{right.text}</span>
        </motion.li>
      )
    } else {
      return (
        <motion.li 
          className="flex items-start gap-2 sm:gap-3 font-bold text-sm sm:text-base md:text-lg opacity-40 relative"
          animate={{ 
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.span 
            className="text-gray-500 text-lg sm:text-xl md:text-2xl flex-shrink-0"
            animate={{ 
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🔒
          </motion.span>
          <div className="relative">
            <span className="blur-[3px] select-none text-sm sm:text-base md:text-lg">Droit à débloquer...</span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ 
                x: [-100, 200]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1
              }}
            />
          </div>
        </motion.li>
      )
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
          title: "⚠️ CONSÉQUENCES APPRISES",
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
      <div className="min-h-screen bg-white flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-4xl">
          {/* Header avec contrôles audio */}
          <div className="w-full mb-4 sm:mb-6 flex justify-end">
            {/* Contrôles audio */}
            <div className="flex items-center gap-2 sm:gap-3 bg-gray-900 border-2 sm:border-4 border-black px-2 sm:px-3 md:px-4 py-1 sm:py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => setMusiqueMuted(!musiqueMuted)}
                className="text-xl sm:text-2xl hover:scale-110 transition-transform"
                title={musiqueMuted ? "Activer la musique" : "Couper la musique"}
              >
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
                  if (newVolume > 0 && musiqueMuted) {
                    setMusiqueMuted(false)
                  }
                }}
                className="w-16 sm:w-20 md:w-24 h-2 bg-white border-2 border-black rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 sm:[&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* Panneau de fin néo-brutaliste */}
          <div className={`${endContent.color} border-4 sm:border-6 md:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 md:p-8 lg:p-12`}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-5 md:mb-6 text-center">{endContent.title}</h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-center leading-relaxed">
              {endContent.message}
            </p>

            {/* Résumé des droits appris */}
            <div className="bg-gray-900 text-white border-2 sm:border-4 border-black p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 text-center">📋 TES DROITS LORS D'UNE FOUILLE :</h2>
              <ul className="space-y-3">
                {rightsData.map(right => (
                  <RightItem key={right.id} right={right} isUnlocked={unlockedRights.has(right.id)} />
                ))}
              </ul>
              <p className="text-center mt-4 text-lime-400 font-bold text-sm">
                {unlockedRights.size}/{rightsData.length} droits débloqués
              </p>
            </div>

            {/* Panneau des prochains chapitres */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 border-2 sm:border-4 border-black p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-4 sm:mb-5 md:mb-6 text-center text-white">
                📚 PROCHAINS CHAPITRES
              </h2>
              
              <p className="text-white text-center font-bold text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6">
                L'aventure continue ! D'autres histoires immersives arrivent pour explorer les 12 droits :
              </p>

              <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                {/* Chapitre 1 - LA FUGUE */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  className="relative border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed overflow-hidden h-48 sm:h-64 md:h-80"
                >
                  {/* Image de fond */}
                  <div className="absolute inset-0">
                    <img 
                      src="/images/fugue_course.webp" 
                      alt="La Fugue"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                  
                  {/* Contenu */}
                  <div className="relative h-full p-3 sm:p-4 md:p-5 flex flex-col justify-end">
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <span className="text-xs bg-yellow-300 border-2 border-black px-1 sm:px-2 py-0.5 sm:py-1 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">BIENTÔT</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="font-black text-lg sm:text-xl md:text-2xl lg:text-3xl text-white" style={{ textShadow: '2px 2px 0px rgba(0,0,0,1), -1px -1px 0px rgba(0,0,0,1), 1px -1px 0px rgba(0,0,0,1), -1px 1px 0px rgba(0,0,0,1)' }}>LA FUGUE</h3>
                      <div className="bg-cyan-400 border-2 sm:border-4 border-black p-2 sm:p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-xs sm:text-sm text-black font-bold mb-1">
                          🏃 Le droit à l'hébergement
                        </p>
                        <p className="text-xs sm:text-sm text-black font-semibold">
                          Un toit digne et sécuritaire
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Chapitre 2 - L'ÉLIXIR DES CHOIX */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="relative border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed overflow-hidden h-48 sm:h-64 md:h-80"
                >
                  {/* Image de fond */}
                  <div className="absolute inset-0">
                    <img 
                      src="/images/crystaux_decision.webp" 
                      alt="L'Élixir des Choix"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                  
                  {/* Contenu */}
                  <div className="relative h-full p-3 sm:p-4 md:p-5 flex flex-col justify-end">
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <span className="text-xs bg-yellow-300 border-2 border-black px-1 sm:px-2 py-0.5 sm:py-1 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">BIENTÔT</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="font-black text-lg sm:text-xl md:text-2xl lg:text-3xl text-white" style={{ textShadow: '2px 2px 0px rgba(0,0,0,1), -1px -1px 0px rgba(0,0,0,1), 1px -1px 0px rgba(0,0,0,1), -1px 1px 0px rgba(0,0,0,1)' }}>L'ÉLIXIR DES CHOIX</h3>
                      <div className="bg-yellow-300 border-2 sm:border-4 border-black p-2 sm:p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-xs sm:text-sm text-black font-bold mb-1">
                          ⚗️ Le droit de participer aux décisions
                        </p>
                        <p className="text-xs sm:text-sm text-black font-semibold">
                          Ton pouvoir de décision
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Chapitre 3 - LE PLAN D'INTERVENTION */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  className="relative border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed overflow-hidden h-48 sm:h-64 md:h-80"
                >
                  {/* Image de fond */}
                  <div className="absolute inset-0">
                    <img 
                      src="/images/plan d'intervention_gemini.webp" 
                      alt="Le Plan d'Intervention"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                  
                  {/* Contenu */}
                  <div className="relative h-full p-3 sm:p-4 md:p-5 flex flex-col justify-end">
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <span className="text-xs bg-yellow-300 border-2 border-black px-1 sm:px-2 py-0.5 sm:py-1 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">BIENTÔT</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="font-black text-lg sm:text-xl md:text-2xl lg:text-3xl text-white" style={{ textShadow: '2px 2px 0px rgba(0,0,0,1), -1px -1px 0px rgba(0,0,0,1), 1px -1px 0px rgba(0,0,0,1), -1px 1px 0px rgba(0,0,0,1)' }}>LE PLAN D'INTERVENTION</h3>
                      <div className="bg-lime-400 border-2 sm:border-4 border-black p-2 sm:p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-xs sm:text-sm text-black font-bold mb-1">
                          📋 Le droit de consulter son dossier
                        </p>
                        <p className="text-xs sm:text-sm text-black font-semibold">
                          Accède à ton dossier
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Chapitre 4 - TEXTO À L'EAU */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="relative border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed overflow-hidden h-48 sm:h-64 md:h-80"
                >
                  {/* Image de fond */}
                  <div className="absolute inset-0">
                    <img 
                      src="/images/droit_confidentialite_top_confidentiel.webp" 
                      alt="Texto à l'Eau"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                  
                  {/* Contenu */}
                  <div className="relative h-full p-3 sm:p-4 md:p-5 flex flex-col justify-end">
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <span className="text-xs bg-yellow-300 border-2 border-black px-1 sm:px-2 py-0.5 sm:py-1 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">BIENTÔT</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="font-black text-lg sm:text-xl md:text-2xl lg:text-3xl text-white" style={{ textShadow: '2px 2px 0px rgba(0,0,0,1), -1px -1px 0px rgba(0,0,0,1), 1px -1px 0px rgba(0,0,0,1), -1px 1px 0px rgba(0,0,0,1)' }}>TEXTO À L'EAU</h3>
                      <div className="bg-pink-400 border-2 sm:border-4 border-black p-2 sm:p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-xs sm:text-sm text-black font-bold mb-1">
                          📱 Le droit à la communication
                        </p>
                        <p className="text-xs sm:text-sm text-black font-semibold">
                          Reste en contact avec tes proches
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 text-center bg-black/20 border-2 border-black p-4 rounded">
                <p className="text-white font-bold text-sm">
                  ✨ Chaque chapitre = Une nouvelle aventure interactive pour découvrir tes droits !
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
              <Link 
                href="/"
                className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-red-500 text-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-sm sm:text-base md:text-lg lg:text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
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
                  setUnlockedRights(new Set()) // Réinitialiser les droits débloqués
                }}
                className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-cyan-400 text-black border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-sm sm:text-base md:text-lg lg:text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
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
      <div className="min-h-screen bg-white flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-6xl">
          {/* Header avec contrôles audio */}
          <div className="w-full mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <Link 
              href="/"
              className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-red-500 text-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-xs sm:text-sm md:text-base hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              ← RETOUR
            </Link>
            
            {/* Contrôles audio */}
            <div className="flex items-center gap-2 sm:gap-3 bg-gray-900 border-2 sm:border-4 border-black px-2 sm:px-3 md:px-4 py-1 sm:py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => setMusiqueMuted(!musiqueMuted)}
                className="text-2xl hover:scale-110 transition-transform"
                title={musiqueMuted ? "Activer la musique" : "Couper la musique"}
              >
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
                  if (newVolume > 0 && musiqueMuted) {
                    setMusiqueMuted(false)
                  }
                }}
                className="w-16 sm:w-20 md:w-24 h-2 bg-white border-2 border-black rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 sm:[&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* Image d'établissement avec zoom lent */}
          <div className="relative w-full aspect-video border-4 sm:border-6 md:border-8 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-gray-200 mb-4 sm:mb-6 md:mb-8">
            <motion.img
              src="/images/establishing_centre jeunesse.webp"
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

          {/* Message de bienvenue pour les décideurs */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-4 sm:border-6 border-purple-400 shadow-[6px_6px_0px_0px_rgba(147,51,234,0.3)] sm:shadow-[12px_12px_0px_0px_rgba(147,51,234,0.3)] p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 rounded-xl">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black mb-3 sm:mb-4 text-gray-800 text-center">
              👥 Bienvenue aux membres des comités d'usagers
            </h2>
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg text-gray-700 max-w-4xl mx-auto">
              <p className="leading-relaxed">
                <strong>Cette démo interactive</strong> a été conçue pour sensibiliser vos jeunes en centre jeunesse à leurs droits, notamment en ce qui concerne <strong>les fouilles et saisies</strong> (Droit #9).
              </p>
              <p className="leading-relaxed">
                À travers une histoire réaliste avec des personnages auxquels vos jeunes peuvent s'identifier, ce jeu présente des situations concrètes où leurs droits entrent en jeu. Les jeunes font des <strong>choix qui ont des conséquences</strong>, apprenant ainsi de façon interactive plutôt que passive.
              </p>
              <p className="leading-relaxed bg-white/80 rounded-lg p-4 border-l-4 border-purple-500">
                <strong>🎮 Fonctionnalités de cette démo :</strong> Narration immersive style bande dessinée • Choix multiples avec conséquences • Voice-over des personnages • Apprentissage par l'expérience • Style visuel engageant
              </p>
            </div>
          </div>

          {/* Panneau de contexte néo-brutaliste */}
          <div className="bg-yellow-300 border-4 sm:border-6 md:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 md:p-8 lg:p-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-5 md:mb-6 text-center">
              FOUILLES ET CAFOUILLAGE
            </h1>
            
            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-base sm:text-lg md:text-xl font-bold leading-relaxed">
              <p className="text-center">
                Tu es <span className="text-red-600 font-black">ALEX</span>, un jeune résident dans un centre jeunesse.
              </p>
              
              <p className="text-center">
                Aujourd'hui, <span className="text-red-600 font-black">JAY</span>, un des grands du centre, arrive avec une offre louche qui pourrait te causer des problèmes.
              </p>

              <div className="bg-gray-900 text-white border-2 sm:border-4 border-black p-3 sm:p-4 md:p-6 mt-4 sm:mt-6 md:mt-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 text-center">💡 QUE VAS-TU FAIRE ?</h2>
                <ul className="space-y-2 sm:space-y-3 font-bold text-sm sm:text-base md:text-lg">
                  <li>• Accepter et le cacher?</li>
                  <li>• Refuser et demander de l'aide?</li>
                  <li>• Simplement dire non?</li>
                </ul>
                <p className="text-center mt-4 text-yellow-300 font-black">
                  Tes choix détermineront ce qui arrive ensuite...
                </p>
              </div>

              <div className="bg-cyan-400 border-2 sm:border-4 border-black p-3 sm:p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-base sm:text-lg md:text-xl font-black mb-2 text-center">🎓 CE QUE TU VAS APPRENDRE :</h3>
                <p className="text-center font-bold text-sm sm:text-base md:text-lg">
                  Tes <span className="text-red-600 font-black">DROITS</span> lors d'une fouille, d'une procédure disciplinaire, et comment te protéger dans ces situations.
                </p>
              </div>
            </div>

            {/* Bouton pour commencer */}
            <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
              <button
                onClick={() => setShowIntroScreen(false)}
                className="px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 bg-lime-400 text-black border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-base sm:text-lg md:text-xl lg:text-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4" style={{ cursor: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' style='font-size:32px'><text y='32'>👆</text></svg>\") 16 0, pointer" }}>
      {/* Header néo-brutaliste */}
      <div className="w-full max-w-6xl mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 px-2 sm:px-0">
        <Link 
          href="/"
          className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-red-500 text-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-xs sm:text-sm md:text-base hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          ← RETOUR
        </Link>
        
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight flex-1 text-center order-first sm:order-none">
          FOUILLES ET CAFOUILLAGE
        </h1>
        
        {/* Contrôles audio */}
        <div className="flex items-center gap-2 sm:gap-3 bg-gray-900 border-2 sm:border-4 border-black px-2 sm:px-3 md:px-4 py-1 sm:py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Bouton Mute/Unmute pour la musique */}
          <button
            onClick={() => setMusiqueMuted(!musiqueMuted)}
            className="text-2xl hover:scale-110 transition-transform"
            title={musiqueMuted ? "Activer la musique" : "Couper la musique"}
          >
            {musiqueMuted ? '🔇' : '🔊'}
          </button>
          
          {/* Slider de volume */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={musiqueMuted ? 0 : volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value)
              setVolume(newVolume)
              if (newVolume > 0 && musiqueMuted) {
                setMusiqueMuted(false)
              }
            }}
            className="w-16 sm:w-20 md:w-24 h-2 bg-white border-2 border-black rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 sm:[&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Zone principale avec image */}
      <div className="w-full max-w-5xl">
        <div className="relative w-full aspect-video border-4 sm:border-6 md:border-8 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-gray-200 md:overflow-visible md:pb-12">
          <div className="absolute inset-0 overflow-hidden">
          {/* Image de fond */}
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentScene}-${currentLineIndex}-image`}
              src={currentLine.image}
              alt="Scène"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/cafeteria_triste.webp'
              }}
            />
          </AnimatePresence>

          {/* Overlay sombre pour meilleure lisibilité */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Bulle de dialogue néo-brutaliste - Desktop seulement (position absolue) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentScene}-${currentLineIndex}`}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.6,
                duration: 0.4
              }}
              className={`hidden md:block absolute ${bubbleStyle.position} max-w-lg lg:max-w-xl z-20`}
            >
              <div className={`${bubbleStyle.bg} ${bubbleStyle.border} ${bubbleStyle.shadow} ${bubbleStyle.text} p-4 lg:p-5 ${getEmotionEffect()}`}>
                {/* Label du speaker */}
                <div className="text-xs font-black mb-3 tracking-widest">
                  {getSpeakerLabel()}
                </div>
                
                {/* Texte avec mots en évidence */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="text-base lg:text-lg font-bold leading-tight"
                >
                  {currentLine.text.split(' ').map((word, index) => {
                    // Mettre en évidence les mots en MAJUSCULES pour le narrateur
                    const isAllCaps = word.length > 2 && word === word.toUpperCase() && /[A-ZÀ-Ÿ]/.test(word)
                    const isEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(word)
                    
                    if (currentLine.speaker === 'narrateur' && (isAllCaps || isEmoji)) {
                      return (
                        <span 
                          key={index}
                          className={`${isEmoji ? 'text-xl lg:text-2xl' : 'text-red-600 font-black'}`}
                        >
                          {word}{' '}
                        </span>
                      )
                    }
                    return <span key={index}>{word} </span>
                  })}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Bouton continuer en bas - Desktop seulement (position absolue) */}
          <AnimatePresence>
            {!showChoices && textComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  mass: 0.8,
                  delay: 0.1
                }}
                className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
              >
                <button
                  onClick={handleContinue}
                  className="px-8 py-4 bg-lime-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  {currentLine.choices ? 'CHOISIR ▼' : (
                    <>
                      CONTINUER{' '}
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          duration: 1, 
                          repeat: Infinity, 
                          ease: 'easeInOut',
                          delay: 0.3
                        }}
                        className="inline-block"
                      >
                        ▶
                      </motion.span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulle de dialogue néo-brutaliste - Mobile seulement (sous l'image) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScene}-${currentLineIndex}-mobile`}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.6,
              duration: 0.4
            }}
            className="md:hidden mt-4"
          >
            <div className={`${bubbleStyle.bg} ${bubbleStyle.border} ${bubbleStyle.shadow} ${bubbleStyle.text} p-3 sm:p-4 ${getEmotionEffect()}`}>
              {/* Label du speaker */}
              <div className="text-xs font-black mb-2 tracking-widest">
                {getSpeakerLabel()}
              </div>
              
              {/* Texte avec mots en évidence */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="text-sm sm:text-base font-bold leading-tight"
              >
                {currentLine.text.split(' ').map((word, index) => {
                  // Mettre en évidence les mots en MAJUSCULES pour le narrateur
                  const isAllCaps = word.length > 2 && word === word.toUpperCase() && /[A-ZÀ-Ÿ]/.test(word)
                  const isEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(word)
                  
                  if (currentLine.speaker === 'narrateur' && (isAllCaps || isEmoji)) {
                    return (
                      <span 
                        key={index}
                        className={`${isEmoji ? 'text-xl' : 'text-red-600 font-black'}`}
                      >
                        {word}{' '}
                      </span>
                    )
                  }
                  return <span key={index}>{word} </span>
                })}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bouton continuer - Mobile seulement (sous la bulle) */}
        <AnimatePresence>
          {!showChoices && textComplete && isMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', y: 0, scale: 1 }}
              exit={{ opacity: 0, height: 0, y: -10, scale: 0.95 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.8,
                delay: 0.1
              }}
              className="flex mt-4 justify-center overflow-hidden"
            >
              <button
                onClick={handleContinue}
                className="px-6 py-3 bg-lime-400 border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-sm sm:text-base hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {currentLine.choices ? 'CHOISIR ▼' : (
                  <>
                    CONTINUER{' '}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        ease: 'easeInOut',
                        delay: 0.3
                      }}
                      className="inline-block"
                    >
                      ▶
                    </motion.span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Choix de réponses - style néo-brutaliste */}
      <AnimatePresence>
        {showChoices && currentLine.choices && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
            className="w-full max-w-5xl mt-4 sm:mt-6 space-y-3 sm:space-y-4 px-2 sm:px-0 overflow-hidden"
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
                  className={`w-full ${bgColor} border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4 md:p-6 text-left font-black text-sm sm:text-base md:text-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
                >
                  <span className="text-lg sm:text-xl md:text-2xl mr-2 sm:mr-3">→</span> {choice}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info des droits en bas */}
      <motion.div 
        layout
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3
        }}
        className="w-full max-w-5xl mt-4 sm:mt-6 bg-gray-900 text-white border-2 sm:border-4 border-black p-3 sm:p-4 md:p-6 mx-2 sm:mx-0"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
          <h3 className="font-black text-sm sm:text-base md:text-xl">💡 DROITS LORS D'UNE FOUILLE</h3>
          <span className="text-lime-400 font-bold text-xs sm:text-sm">
            {unlockedRights.size}/{rightsData.length} débloqués
          </span>
        </div>
        <ul className="space-y-2">
          {rightsData.map(right => (
            <RightItem key={right.id} right={right} isUnlocked={unlockedRights.has(right.id)} />
          ))}
        </ul>
      </motion.div>
    </div>
  )
}

