// Page Dialogue Cafétéria - Système de dialogue scriptés avec pagination
// Conversation entre un jeune et un intervenant sur le plan d'intervention
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type Speaker = 'jeune' | 'intervenant'

interface DialogueLine {
  speaker: Speaker
  text: string
  choices?: string[] // Si présent, affiche des choix au lieu de continuer
}

interface DialogueScript {
  [key: string]: DialogueLine[]
}

export default function DialoguePage() {
  // Le script complet du dialogue
  const dialogue: DialogueScript = {
    'intro': [
      {
        speaker: 'jeune',
        text: "Yo... fait que là, j'suis dans marde. Demain ils veulent me mettre des pilules pour le TDAH, pis y'ont même pas demandé mon avis. La psy a juste dit 'c'est mieux pour toi' pis c'est toute."
      },
      {
        speaker: 'intervenant',
        text: "Attends, attends. Ils veulent te prescrire de la médication sans t'expliquer c'est quoi exactement?"
      },
      {
        speaker: 'jeune',
        text: "Ben là... genre oui? La dame a parlé pendant 5 minutes, utilisé des mots de docteur que j'ai rien compris, pis après elle a dit 'on commence lundi'. J'ai même pas eu le temps de poser de questions."
      },
      {
        speaker: 'intervenant',
        text: "Ok, écoute-moi bien. Ce qu'ils font là, c'est pas correct. T'as le droit de comprendre TOUT ce qui va rentrer dans ton corps. Les effets secondaires, combien de temps, toute l'affaire.",
        choices: [
          "Mais si je refuse, y vont me punir non?",
          "J'ai juste 16 ans, j'ai tu vraiment le choix?",
          "C'est quoi mes options concrètement?"
        ]
      }
    ],
    'choix-1': [
      {
        speaker: 'jeune',
        text: "Mais si je refuse, y vont me punir non? Genre, perte de privilèges ou retarder ma sortie?"
      },
      {
        speaker: 'intervenant',
        text: "Non. LÉGALEMENT, ils peuvent pas faire ça. Si quelqu'un te menace avec tes privilèges parce que tu refuses un traitement, c'est carrément illégal."
      },
      {
        speaker: 'jeune',
        text: "Pour vrai? Parce que l'éduc hier m'a dit 'si tu collabores pas, ça va mal paraître dans ton dossier'..."
      },
      {
        speaker: 'intervenant',
        text: "Wow, ok. Ça, c'est de la manipulation pure. Écoute, demain à la réunion, tu dis clairement : 'Je veux comprendre les effets secondaires et j'ai besoin de temps pour réfléchir.' C'est ton droit de consentir ou de refuser.",
        choices: [
          "Pis si y disent que j'ai pas le choix?",
          "Ok mais... comment je dis ça sans avoir l'air bête?",
          "Est-ce que je peux amener quelqu'un avec moi?"
        ]
      }
    ],
    'choix-2': [
      {
        speaker: 'jeune',
        text: "J'ai juste 16 ans... J'ai tu vraiment le choix? Mes parents ont signé les papiers quand j'suis arrivé ici."
      },
      {
        speaker: 'intervenant',
        text: "Ok, écoute ça parce que c'est important : à 14 ans et plus, TU as le dernier mot sur tes soins de santé. Pas tes parents, pas le centre. TOI."
      },
      {
        speaker: 'jeune',
        text: "Sérieux?! Genre même si ma mère a dit oui, je peux dire non?"
      },
      {
        speaker: 'intervenant',
        text: "EXACT. C'est ton corps, ta santé. Ils doivent t'expliquer les risques, répondre à TOUTES tes questions, pis tu décides. Si tu dis non, c'est non. Point final.",
        choices: [
          "Ça marche vraiment de même? Ils vont pas juste me forcer pareil?",
          "Comment je fais pour me défendre si personne m'écoute?",
          "Y'a quelqu'un qui peut être là avec moi demain?"
        ]
      }
    ],
    'choix-3': [
      {
        speaker: 'jeune',
        text: "C'est quoi mes options concrètement? Parce que là j'me sens coincé en criss."
      },
      {
        speaker: 'intervenant',
        text: "Ok, plan d'action. Un : demain, tu demandes une liste écrite des effets secondaires et du temps de traitement prévu. Deux : tu exiges qu'on respecte ton droit de poser des questions."
      },
      {
        speaker: 'jeune',
        text: "Pis si y'écoutent pas?"
      },
      {
        speaker: 'intervenant',
        text: "Là tu sors l'artillerie lourde : tu contactes le comité des usagers ou tu portes plainte. Crois-moi, dès que tu dis ces mots-là, le monde se réveille pas mal vite.",
        choices: [
          "Le comité des usagers, c'est quoi ça?",
          "Une plainte... ça va pas empirer ma situation?",
          "Ok, j'pense que j'comprends mieux. Merci man."
        ]
      }
    ],
    'fin': [
      {
        speaker: 'jeune',
        text: "Ok, j'pense que j'comprends mieux. J'étais vraiment stressé tantôt mais là... j'me sens un peu moins pris dans l'étau."
      },
      {
        speaker: 'intervenant',
        text: "T'as raison de stresser, c'est normal. Mais maintenant t'es armé. Demain, tu rentres dans cette réunion-là en sachant c'est quoi tes droits."
      },
      {
        speaker: 'jeune',
        text: "Ouais... Merci man, pour vrai. Au moins maintenant je sais que j'suis pas fou de trouver ça louche."
      },
      {
        speaker: 'intervenant',
        text: "T'es pas fou pantoute. T'es juste un jeune qui mérite du respect. Garde la tête haute, pis si ça tourne mal, tu reviens me voir. On va régler ça ensemble."
      }
    ]
  }

  const [currentScene, setCurrentScene] = useState<string>('intro')
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0)
  const [displayedText, setDisplayedText] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [showChoices, setShowChoices] = useState<boolean>(false)

  const currentDialogue = dialogue[currentScene]
  const currentLine = currentDialogue[currentLineIndex]

  // Diviser le texte en chunks de ~150 caractères pour pagination
  const splitTextIntoPages = (text: string, maxLength: number = 150): string[] => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    const pages: string[] = []
    let currentPage = ''

    sentences.forEach(sentence => {
      if ((currentPage + sentence).length > maxLength && currentPage.length > 0) {
        pages.push(currentPage.trim())
        currentPage = sentence
      } else {
        currentPage += sentence
      }
    })

    if (currentPage.length > 0) {
      pages.push(currentPage.trim())
    }

    return pages
  }

  const [textPages, setTextPages] = useState<string[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)

  // Charger le texte de la ligne actuelle
  useEffect(() => {
    if (currentLine) {
      const pages = splitTextIntoPages(currentLine.text)
      setTextPages(pages)
      setCurrentPageIndex(0)
      setDisplayedText(pages[0] || '')
      setShowChoices(false)
    }
  }, [currentScene, currentLineIndex])

  // Gérer la progression du dialogue
  const handleContinue = () => {
    // S'il y a encore des pages à afficher pour cette ligne
    if (currentPageIndex < textPages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
      setDisplayedText(textPages[currentPageIndex + 1])
      return
    }

    // Si la ligne actuelle a des choix, les afficher
    if (currentLine.choices) {
      setShowChoices(true)
      return
    }

    // Passer à la ligne suivante
    if (currentLineIndex < currentDialogue.length - 1) {
      const nextLine = currentDialogue[currentLineIndex + 1]
      const pages = splitTextIntoPages(nextLine.text)
      setTextPages(pages)
      setCurrentPageIndex(0)
      setDisplayedText(pages[0])
      setCurrentLineIndex(currentLineIndex + 1)
      setShowChoices(false)
    } else {
      // Fin de la scène, retour à l'accueil
      setCurrentScene('fin')
      setCurrentLineIndex(0)
      const pages = splitTextIntoPages(dialogue['fin'][0].text)
      setTextPages(pages)
      setCurrentPageIndex(0)
      setDisplayedText(pages[0])
    }
  }

  // Gérer le choix du joueur
  const handleChoice = (choiceIndex: number) => {
    // Déterminer la prochaine scène selon le choix
    const sceneMap: { [key: number]: string } = {
      0: 'choix-1',
      1: 'choix-2',
      2: 'choix-3'
    }

    const nextScene = sceneMap[choiceIndex] || 'fin'
    setCurrentScene(nextScene)
    setCurrentLineIndex(0)
    
    const pages = splitTextIntoPages(dialogue[nextScene][0].text)
    setTextPages(pages)
    setCurrentPageIndex(0)
    setDisplayedText(pages[0])
    setShowChoices(false)
  }

  // Déterminer la position de la bulle selon le speaker
  const getBubblePosition = () => {
    if (currentLine.speaker === 'jeune') {
      return 'left-16 bottom-32' // En bas à gauche
    } else {
      return 'right-16 bottom-32' // En bas à droite
    }
  }

  const getBubbleColor = () => {
    if (currentLine.speaker === 'jeune') {
      return 'bg-blue-500 text-white border-blue-600'
    } else {
      return 'bg-white text-gray-900 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-6xl mb-4 flex justify-between items-center">
        <Link 
          href="/"
          className="px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          ← Accueil
        </Link>
        <h1 className="text-white text-xl font-bold">DIALOGUE : CAFÉTÉRIA</h1>
        <div className="w-24"></div>
      </div>

      {/* Zone principale avec image */}
      <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
        {/* Image de fond */}
        <img
          src="/images/cafeteria_triste.png"
          alt="Cafétéria - Dialogue"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Erreur chargement image')
            e.currentTarget.src = '/images/cafeteria_dialogue.png'
          }}
        />

        {/* Bulle de dialogue */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScene}-${currentLineIndex}-${currentPageIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`absolute ${getBubblePosition()} max-w-2xl z-20`}
          >
            <div className={`${getBubbleColor()} px-6 py-4 rounded-2xl shadow-2xl border-2`}>
              <p className="text-base font-medium leading-relaxed mb-2">
                {displayedText}
              </p>
              
              {/* Indicateur de continuation */}
              {!showChoices && (
                <div className="flex justify-end">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-xs opacity-60"
                  >
                    ▼
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Instruction en bas */}
        {!showChoices && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white px-8 py-4 text-center z-30">
            <button 
              onClick={handleContinue}
              className="text-sm font-medium hover:text-blue-400 transition-colors"
            >
              PRESSER X POUR CONTINUER
            </button>
          </div>
        )}
      </div>

      {/* Choix de réponses */}
      <AnimatePresence>
        {showChoices && currentLine.choices && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-5xl mt-6 space-y-3"
          >
            {currentLine.choices.map((choice, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice(index)}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-left text-white transition-all text-base"
              >
                <span className="font-semibold">→</span> {choice}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
