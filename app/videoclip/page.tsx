// Page Video Clip - Paroles de rap avec images synchronisées
// Style néo-brutaliste pour afficher les paroles
// Système de timeline avec changement d'images
'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface LyricBlock {
  text: string
  type: 'intro' | 'couplet' | 'refrain' | 'pont' | 'outro'
  imageFolder: string // videoclip_1, videoclip_2, etc.
}

export default function VideoClipPage() {
  const lyrics: LyricBlock[] = [
    {
      text: "Yo...\n\nIls m'ont dit que j'avais pas le choix\nQue j'étais juste un numéro, un dossier, une croix\nMais j'ai découvert douze clés cachées dans leurs lois\nEt j'ai compris qu'avec le pouvoir vient la responsabilité, tu vois?",
      type: 'intro',
      imageFolder: 'videoclip_1'
    },
    {
      text: "J'suis arrivé les mains vides, la tête pleine de questions\nPourquoi personne m'explique rien? C'est quelle mission?\nPremier droit, j'l'ai trouvé caché dans les papiers\nDroit à l'information - maintenant j'peux tout demander",
      type: 'couplet',
      imageFolder: 'videoclip_2'
    },
    {
      text: "Mais avec ça vient le devoir d'écouter vraiment\nPas juste entendre, comprendre c'est différent\nMon dossier? J'veux l'voir, c'est ma vie écrite là\nMon plan d'intervention? J'suis assis à cette table-là",
      type: 'couplet',
      imageFolder: 'videoclip_3'
    },
    {
      text: "Mais j'dois aussi m'présenter, participer pour vrai\nPas arriver en retard avec mon attitude de \"j'm'en fous anyway\"\nDroit aux services, j'demande mon assistance\nPsy, docteur, tuteur - mais j'dois faire ma part, c'est l'alliance",
      type: 'couplet',
      imageFolder: 'videoclip_4'
    },
    {
      text: "Tu veux qu'on t'aide? Faut que tu t'aides aussi\nLes droits c'est pas un free pass pour rester assis\nDeuxième clé déverrouillée, j'commence à comprendre\nQue mes choix aussi, j'vais devoir en répondre",
      type: 'couplet',
      imageFolder: 'videoclip_5'
    },
    {
      text: "J'ai trouvé mon Codex, douze clés en or\nMais chaque clé vient avec un poids à porter\nJ'ai trouvé ma voix, elle résonne encore plus fort\nDroits et devoirs, c'est ça la vraie liberté",
      type: 'refrain',
      imageFolder: 'videoclip_6'
    },
    {
      text: "Droits, droits, j'les connais par cœur\nDevoirs, devoirs, j'les assume avec honneur\nDroits, droits, c'est mon armure\nDevoirs, devoirs, c'est ma maturité pure",
      type: 'refrain',
      imageFolder: 'videoclip_7'
    },
    {
      text: "Droit de communication, troisième fragment trouvé\nJ'peux appeler maman même si tout est compliqué\nMais j'respecte les heures, les règles collectives\nParce que quinze autres jeunes veulent aussi leur perspective",
      type: 'couplet',
      imageFolder: 'videoclip_8'
    },
    {
      text: "Ma liberté s'arrête où celle des autres commence\nC'est pas juste \"moi moi moi\", c'est l'équilibre, la balance\nDroit aux soins, numéro quatre dans mon trousseau\nMais faut que j'me présente aux rendez-vous, c'est pas beau",
      type: 'couplet',
      imageFolder: 'videoclip_9'
    },
    {
      text: "Si j'prends mes médicaments, c'est pas pour eux, c'est pour moi\nDroit de refuser aussi, cinq sur la liste\nMais refuser intelligent, pas juste être en crise\nJ'pose des questions, j'propose des alternatives",
      type: 'couplet',
      imageFolder: 'videoclip_10'
    },
    {
      text: "Consentement éclairé, c'est un dialogue, un échange\nPas juste dire non et partir, ça c'est immature et étrange\nDroit de participer - six, le boss de mi-game\nCette réunion de plan? J'contribue, c'est mon game",
      type: 'couplet',
      imageFolder: 'videoclip_11'
    },
    {
      text: "Check ça... y'a une ligne fine, tu vois\nEntre réclamer mes droits et fuir mes responsabilités\nJ'pensais qu'liberté c'était faire tout c'que j'veux\nMais vraie liberté c'est choisir qui j'veux être, pas juste ce qui est mieux",
      type: 'pont',
      imageFolder: 'videoclip_12'
    },
    {
      text: "Jay m'a donné son briquet à cacher, j'ai dit non\nPas pour le snitch, mais parce que j'choisis mes actions\nAider un ami c'est pas être complice de ses erreurs\nVraie amitié c'est lui montrer y'a d'autres valeurs",
      type: 'pont',
      imageFolder: 'videoclip_13'
    },
    {
      text: "Droit à l'hébergement, huit, un toit digne\nMais j'respecte aussi l'espace, j'le garde clean, j'le signe\nSi on m'donne une chambre, c'est ma responsabilité\nDe pas la détruire, d'en prendre soin, d'la respecter",
      type: 'couplet',
      imageFolder: 'videoclip_14'
    },
    {
      text: "Droit au respect - neuf - les fouilles et saisies\nOui ils doivent avoir des motifs, mais moi j'dois faciliter\nSi j'ai rien à cacher qui m'tire vers l'bas\nAlors une fouille c'est juste un check-up, un constat",
      type: 'couplet',
      imageFolder: 'videoclip_15'
    },
    {
      text: "J'comprends maintenant: ils protègent tout l'monde ici\nMa sécurité plus celle des autres, c'est une communauté\nMes choix affectent pas juste moi dans ces murs\nChaque action a des conséquences, c'est ça être mature",
      type: 'couplet',
      imageFolder: 'videoclip_16'
    },
    {
      text: "Droit à mon dossier - dix - le livre de ma vie\nJ'peux le lire, contester, ajouter ma partie\nMais j'dois aussi accepter mon histoire, mes erreurs\nPas juste blâmer les autres, prendre ownership, c'est l'heure",
      type: 'couplet',
      imageFolder: 'videoclip_17'
    },
    {
      text: "Confidentialité - onze - mes secrets m'appartiennent\nMais si mon secret met quelqu'un en danger, là j'comprends qu'on intervienne\nPorter le poids d'un secret toxique, ça rend pas plus fort\nParfois parler c'est pas snitch, c'est sauver quelqu'un dehors",
      type: 'couplet',
      imageFolder: 'videoclip_18'
    },
    {
      text: "Et le dernier, numéro douze, la clé maîtresse\nDroit de porter plainte quand y'a une injustice\nMais j'utilise ça pour de vraies injustices, tu vois\nPas pour manipuler le système quand ça fait pas mon affaire, loi",
      type: 'couplet',
      imageFolder: 'videoclip_19'
    },
    {
      text: "J'suis plus ce jeune perdu qui subissait en silence\nJ'ai mon Codex complet, plus ma conscience\nGardien de mes droits, architecte de mon plan\nMais aussi responsable de mes choix, de mon clan",
      type: 'couplet',
      imageFolder: 'videoclip_20'
    },
    {
      text: "J'ai trouvé mon Codex, douze clés en or\nMais chaque clé vient avec un poids à porter\nJ'ai trouvé ma voix, elle résonne encore plus fort\nDroits et devoirs, c'est ça la vraie liberté\n\nDroits, droits, j'les connais par cœur\nDevoirs, devoirs, j'les assume avec honneur\nDroits, droits, c'est mon armure\nDevoirs, devoirs, c'est ma signature",
      type: 'refrain',
      imageFolder: 'videoclip_21'
    }
  ]

  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showControls, setShowControls] = useState<boolean>(true)
  // Contrôles séparés pour musique et sons
  const [musiqueMuted, setMusiqueMuted] = useState<boolean>(false)
  const [musiqueVolume, setMusiqueVolume] = useState<number>(0.375)
  const [sonsMuted, setSonsMuted] = useState<boolean>(false)
  const [sonsVolume, setSonsVolume] = useState<number>(0.5)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentBlockIndexRef = useRef<number>(currentBlockIndex)
  
  const SONG_DURATION = 262 // 4:22 en secondes
  const BLOCK_DURATION = useMemo(() => SONG_DURATION / lyrics.length, [lyrics.length]) // ~12.5 secondes par bloc

  // Mettre à jour la ref quand currentBlockIndex change
  useEffect(() => {
    currentBlockIndexRef.current = currentBlockIndex
  }, [currentBlockIndex])

  const currentBlock = lyrics[currentBlockIndex]
  
  // Charger l'image depuis le dossier videoclip
  const getImagePath = (folder: string) => {
    // Le folder est déjà au format "videoclip_X"
    const path = `/images/videoclip/${folder}.webp`
    console.log('Image path:', path, 'Folder:', folder)
    return path
  }

  // Obtenir le style de bloc selon le type
  const getBlockStyle = (type: string) => {
    switch (type) {
      case 'intro':
        return 'bg-purple-400'
      case 'couplet':
        return 'bg-cyan-400'
      case 'refrain':
        return 'bg-yellow-300'
      case 'pont':
        return 'bg-pink-400'
      case 'outro':
        return 'bg-lime-400'
      default:
        return 'bg-gray-400'
    }
  }

  // Synchronisation avec l'audio - vérification fréquente via intervalle
  useEffect(() => {
    const intervalId = setInterval(() => {
      const audio = audioRef.current
      if (!audio || audio.paused) return
      
      const currentTime = audio.currentTime
      setCurrentTime(currentTime)
      
      // Calculer quel bloc devrait être affiché selon le temps
      const blockIndex = Math.floor(currentTime / BLOCK_DURATION)
      const clampedIndex = Math.min(blockIndex, lyrics.length - 1)
      
      // Utiliser la ref pour éviter les dépendances circulaires
      if (clampedIndex !== currentBlockIndexRef.current) {
        console.log(`Changement de bloc: ${currentBlockIndexRef.current} -> ${clampedIndex} (temps: ${currentTime.toFixed(2)}s)`)
        setCurrentBlockIndex(clampedIndex)
      }
    }, 100) // Vérification toutes les 100ms pour une synchronisation précise

    return () => {
      clearInterval(intervalId)
    }
  }, [BLOCK_DURATION, lyrics.length])

  // Gestion des événements audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentBlockIndex(0)
      setCurrentTime(0)
    }

    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Gestion de la musique de fond
  useEffect(() => {
    const audio = new Audio('/audio/karim/MON CODEX.mp3')
    audio.loop = false
    audio.volume = musiqueVolume
    audioRef.current = audio
    
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musiqueMuted ? 0 : musiqueVolume
      if (isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch(e => console.log('Play bloqué:', e))
      } else if (!isPlaying && !audioRef.current.paused) {
        audioRef.current.pause()
      }
    }
  }, [musiqueVolume, musiqueMuted, isPlaying])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(e => console.log('Play bloqué:', e))
    }
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    const audio = audioRef.current
    if (!audio) return
    
    if (currentBlockIndex < lyrics.length - 1) {
      const newIndex = currentBlockIndex + 1
      const newTime = newIndex * BLOCK_DURATION
      audio.currentTime = newTime
      setCurrentBlockIndex(newIndex)
    }
  }

  const handlePrevious = () => {
    const audio = audioRef.current
    if (!audio) return
    
    if (currentBlockIndex > 0) {
      const newIndex = currentBlockIndex - 1
      const newTime = newIndex * BLOCK_DURATION
      audio.currentTime = newTime
      setCurrentBlockIndex(newIndex)
    }
  }

  const handleBlockClick = (index: number) => {
    const audio = audioRef.current
    if (audio) {
      const newTime = index * BLOCK_DURATION
      audio.currentTime = newTime
      setCurrentBlockIndex(index)
    } else {
      setCurrentBlockIndex(index)
    }
  }

  // Fonction helper pour jouer des sons (personnages et effets sonores)
  const playSound = (src: string) => {
    const audio = new Audio(src)
    audio.volume = sonsMuted ? 0 : sonsVolume
    audio.play().catch(e => console.log('Sound play bloqué:', e))
    return audio
  }

  // Générer des notes de musique animées pour l'arrière-plan
  const musicalNotes = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      size: 20 + Math.random() * 40,
      rotation: Math.random() * 360,
    }))
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Tapisserie de notes de musique animées en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {musicalNotes.map((note) => (
          <motion.div
            key={note.id}
            className="absolute"
            style={{
              left: `${note.x}%`,
              top: `${note.y}%`,
              fontSize: `${note.size}px`,
              color: 'rgba(0, 0, 0, 0.15)',
            }}
            initial={{ 
              y: 0,
              rotate: note.rotation,
              opacity: 0.15
            }}
            animate={{
              y: [0, -30, 30, 0],
              x: [0, 20, -20, 0],
              rotate: [note.rotation, note.rotation + 360],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: note.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: note.delay,
            }}
          >
            {/* Note de musique SVG simplifiée */}
            <svg
              width={note.size}
              height={note.size}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Portée de musique */}
              <line x1="15" y1="25" x2="85" y2="25" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
              <line x1="15" y1="35" x2="85" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
              <line x1="15" y1="45" x2="85" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
              <line x1="15" y1="55" x2="85" y2="55" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
              <line x1="15" y1="65" x2="85" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
              {/* Note de musique */}
              <ellipse cx="40" cy="45" rx="8" ry="12" fill="currentColor"/>
              <path d="M40 57 L40 75 Q40 85 50 85 L55 85" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-start items-center">
        <Link 
          href="/"
          className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-sm sm:text-base hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          ← RETOUR
        </Link>
      </div>

      {/* Zone principale avec image */}
      <div className="relative w-full max-w-6xl aspect-video border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-gray-200 mb-6" style={{ minHeight: '400px', zIndex: 10 }}>
        {/* Image de fond avec animations continues */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBlock.imageFolder}
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ zIndex: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.5 } }}
          >
            <motion.img
            src={getImagePath(currentBlock.imageFolder)}
            alt="Video clip"
              className="w-full h-full object-cover"
              style={{
                minWidth: '110%',
                minHeight: '110%',
                display: 'block'
              }}
              initial={{ scale: 1.1 }}
            animate={{ 
              scale: [1, 1.05, 1],
                x: [0, -15, 15, 0],
                y: [0, 10, -10, 0]
            }}
            transition={{ 
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', currentBlock.imageFolder, getImagePath(currentBlock.imageFolder))
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              const folder = currentBlock.imageFolder
              const currentSrc = target.src
              console.error('❌ Image load error:', currentSrc, 'Trying fallback for folder:', folder)
              if (currentSrc.endsWith('.webp')) {
                target.src = `/images/videoclip/${folder}.jpg`
              } else if (currentSrc.endsWith('.jpg')) {
                target.src = `/images/videoclip/${folder}.png`
              } else {
                target.src = '/images/establishing_centre jeunesse.webp'
              }
            }}
          />
          </motion.div>
        </AnimatePresence>

        {/* Overlay très léger uniquement pour les paroles */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 md:h-40 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" style={{ zIndex: 10 }} />

        {/* Bloc de paroles néo-brutaliste */}
        <motion.div
          key={currentBlockIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={`absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 max-w-4xl mx-auto ${getBlockStyle(currentBlock.type)} border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-2 sm:p-4 z-30`}
        >
          <div className="text-black font-black text-xs sm:text-sm md:text-base leading-tight whitespace-pre-line max-h-[120px] sm:max-h-[150px] md:max-h-[180px] overflow-y-auto">
            {currentBlock.text}
          </div>
        </motion.div>
      </div>

      {/* Contrôles de lecture */}
      <div className="w-full max-w-6xl flex gap-2 sm:gap-4 justify-center items-center mb-4 sm:mb-6">
        <button
          onClick={handlePrevious}
          disabled={currentBlockIndex === 0}
          className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-cyan-400 border-2 sm:border-3 md:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-xs sm:text-sm md:text-base lg:text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          ◀ PRÉC
        </button>

        <button
          onClick={handlePlayPause}
          className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-lime-400 border-2 sm:border-3 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-sm sm:text-base md:text-lg lg:text-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          {isPlaying ? '⏸ PAUSE' : '▶ JOUER'}
        </button>

        <button
          onClick={handleNext}
          disabled={currentBlockIndex === lyrics.length - 1}
          className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-cyan-400 border-2 sm:border-3 md:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-xs sm:text-sm md:text-base lg:text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          SUIV ▶
        </button>
      </div>

      {/* Timeline avec miniatures */}
      <div className="w-full max-w-6xl bg-gray-100 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <div className="flex gap-3">
          {lyrics.map((block, index) => (
            <button
              key={index}
              onClick={() => handleBlockClick(index)}
              className={`flex-shrink-0 w-20 h-20 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative ${getBlockStyle(block.type)} ${currentBlockIndex === index ? 'ring-4 ring-yellow-400 ring-offset-2' : ''} hover:scale-110 transition-transform`}
            >
              <img
                src={getImagePath(block.imageFolder)}
                alt={`Bloc ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  const currentSrc = target.src
                  if (currentSrc.endsWith('.webp')) {
                    target.src = `/images/videoclip/${block.imageFolder}.jpg`
                  } else if (currentSrc.endsWith('.jpg')) {
                    target.src = `/images/videoclip/${block.imageFolder}.png`
                  } else {
                    target.src = '/images/establishing_centre jeunesse.webp'
                  }
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs font-black text-center py-1">
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

