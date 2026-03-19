/**
 * 🎨 Studio de Création d'Images - Nano Banana 2
 * 
 * Interface de type "node-based" pour générer et éditer des images avec Nano Banana 2
 * (Gemini 3.1 Flash Image Preview). Pro-level fidelity avec Flash speed.
 * 
 * FONCTIONNALITÉS:
 * - Bibliothèque de références: Personnages, lieux et objets pour maintenir la cohérence
 * - Workflows multiples: Text2Image, Style Transfer, Combine, Multi-références
 * - Support de 5 personnages + 14 objets de référence simultanés
 * - Prompts JSON structurés pour des résultats optimaux
 * 
 * WORKFLOWS:
 * - Text 2 Image: Génération à partir d'un prompt texte uniquement
 * - Style Transfer: Appliquer le style d'une image de référence
 * - Combine 2 Images: Fusionner deux images avec un prompt
 * - Multi-Style: Utiliser jusqu'à 4 images de référence pour le style
 */
'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// Types pour les workflows Nano Banana 2
type WorkflowType = 'text2image' | 'style_transfer' | 'combine_images' | 'multi_style'

// Types pour la bibliothèque de références
type ReferenceType = 'character' | 'location' | 'object' | 'style'

interface ReferenceItem {
  id: string
  name: string
  type: ReferenceType
  imagePath: string
  description?: string
  tags?: string[]
}

interface ImageSlot {
  id: string
  file?: File
  preview?: string
  path?: string // Pour les images existantes du projet
}

interface NodePosition {
  x: number
  y: number
}

interface WorkflowConfig {
  type: WorkflowType
  label: string
  icon: string
  description: string
  imageSlots: number
  credits: number
  estimatedTime: string
}

const WORKFLOWS: WorkflowConfig[] = [
  {
    type: 'text2image',
    label: 'Text → Image',
    icon: '✨',
    description: 'Génère une image à partir d\'un prompt texte uniquement',
    imageSlots: 0,
    credits: 8,
    estimatedTime: '~30s'
  },
  {
    type: 'style_transfer',
    label: 'Style Transfer',
    icon: '🎨',
    description: 'Applique le style d\'une image de référence à ton prompt',
    imageSlots: 1,
    credits: 12,
    estimatedTime: '~45s'
  },
  {
    type: 'combine_images',
    label: 'Fusionner 2 Images',
    icon: '🔗',
    description: 'Combine deux images avec les instructions du prompt',
    imageSlots: 2,
    credits: 17,
    estimatedTime: '~60s'
  },
  {
    type: 'multi_style',
    label: 'Multi-Références',
    icon: '🖼️',
    description: 'Utilise jusqu\'à 4 images de référence pour le style',
    imageSlots: 4,
    credits: 25,
    estimatedTime: '~90s'
  }
]

const QUALITY_OPTIONS = [
  { value: '1k', label: '1K', resolution: '1024x1024' },
  { value: '2k', label: '2K', resolution: '2048x2048' },
  { value: '4k', label: '4K', resolution: '4096x4096' }
]

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1', icon: '⬛' },
  { value: '16:9', label: '16:9', icon: '🖥️' },
  { value: '9:16', label: '9:16', icon: '📱' },
  { value: '4:3', label: '4:3', icon: '📺' },
  { value: '3:2', label: '3:2', icon: '📷' }
]

// Images de référence disponibles dans le projet
const PROJECT_IMAGES = [
  { path: '/images/jeune_reflechi.webp', label: 'Alex - Réfléchit' },
  { path: '/images/refus_drogue_non.webp', label: 'Alex - Refuse' },
  { path: '/images/cafeteria_triste.webp', label: 'Alex - Triste' },
  { path: '/images/jeune_offre_drogue.webp', label: 'Jay offre drogue' },
  { path: '/images/establishing_centre jeunesse.webp', label: 'Centre jeunesse' },
  { path: '/images/cafeteria_dialogue.webp', label: 'Cafétéria' },
  { path: '/images/intervenante_arrive_lieu_echange_drogues.webp', label: 'Intervenante' },
  { path: '/images/fugue_course.webp', label: 'Fugue - Course' },
  { path: '/images/jeune_tribunal.webp', label: 'Tribunal' },
  { path: '/images/crystaux_decision.webp', label: 'Décision' },
  { path: '/images/adolescent_bus_stress.webp', label: 'Bus - Stress' },
  { path: '/images/police_centre_jeunesse.webp', label: 'Police' },
]

// Bibliothèque de références par défaut (personnages, lieux, objets)
const DEFAULT_REFERENCES: ReferenceItem[] = [
  // Personnages
  {
    id: 'alex-1',
    name: 'Alex',
    type: 'character',
    imagePath: '/images/jeune_reflechi.webp',
    description: 'Protagoniste, 16 ans, cheveux bruns, yeux bleus, veste bleue claire, taches de rousseur',
    tags: ['protagoniste', 'adolescent', 'garçon']
  },
  {
    id: 'alex-2',
    name: 'Alex (confiant)',
    type: 'character',
    imagePath: '/images/refus_drogue_non.webp',
    description: 'Alex montrant de la détermination, posture confiante',
    tags: ['protagoniste', 'confiant']
  },
  {
    id: 'alex-3',
    name: 'Alex (triste)',
    type: 'character',
    imagePath: '/images/cafeteria_triste.webp',
    description: 'Alex dans un moment de vulnérabilité, expression triste',
    tags: ['protagoniste', 'émotionnel']
  },
  {
    id: 'jay',
    name: 'Jay',
    type: 'character',
    imagePath: '/images/jeune_offre_drogue.webp',
    description: 'Personnage secondaire, offre de la drogue, style streetwear',
    tags: ['antagoniste', 'adolescent']
  },
  {
    id: 'intervenante',
    name: 'Intervenante',
    type: 'character',
    imagePath: '/images/intervenante_arrive_lieu_echange_drogues.webp',
    description: 'Éducatrice du centre jeunesse, professionnelle, bienveillante',
    tags: ['adulte', 'staff', 'aide']
  },
  {
    id: 'police',
    name: 'Agent de police',
    type: 'character',
    imagePath: '/images/police_centre_jeunesse.webp',
    description: 'Policier québécois en uniforme',
    tags: ['adulte', 'autorité']
  },
  // Lieux
  {
    id: 'centre-ext',
    name: 'Centre jeunesse (extérieur)',
    type: 'location',
    imagePath: '/images/establishing_centre jeunesse.webp',
    description: 'Vue extérieure du centre jeunesse, bâtiment institutionnel québécois',
    tags: ['extérieur', 'établissement']
  },
  {
    id: 'cafeteria',
    name: 'Cafétéria',
    type: 'location',
    imagePath: '/images/cafeteria_dialogue.webp',
    description: 'Cafétéria du centre avec tables, chaises plastique, affiches françaises',
    tags: ['intérieur', 'commun']
  },
  {
    id: 'tribunal',
    name: 'Tribunal',
    type: 'location',
    imagePath: '/images/jeune_tribunal.webp',
    description: 'Salle de tribunal pour les causes jeunesse',
    tags: ['intérieur', 'officiel']
  },
  {
    id: 'rue-nuit',
    name: 'Rue urbaine (nuit)',
    type: 'location',
    imagePath: '/images/fugue_course.webp',
    description: 'Rue urbaine de Montréal/Québec la nuit, atmosphère de fugue',
    tags: ['extérieur', 'nuit', 'urbain']
  },
  {
    id: 'bus',
    name: 'Autobus',
    type: 'location',
    imagePath: '/images/adolescent_bus_stress.webp',
    description: 'Intérieur d\'un autobus de ville, ambiance stressante',
    tags: ['transport', 'public']
  },
  // Objets / Style
  {
    id: 'decision',
    name: 'Moment de décision',
    type: 'style',
    imagePath: '/images/crystaux_decision.webp',
    description: 'Style visuel pour les moments de choix importants',
    tags: ['abstrait', 'choix']
  },
]

// Icônes par type de référence
const TYPE_ICONS: Record<ReferenceType, string> = {
  character: '👤',
  location: '📍',
  object: '📦',
  style: '🎨'
}

const TYPE_LABELS: Record<ReferenceType, string> = {
  character: 'Personnage',
  location: 'Lieu',
  object: 'Objet',
  style: 'Style'
}

const TYPE_COLORS: Record<ReferenceType, string> = {
  character: 'from-blue-500 to-cyan-500',
  location: 'from-green-500 to-emerald-500',
  object: 'from-purple-500 to-pink-500',
  style: 'from-amber-500 to-orange-500'
}

export default function StudioPage() {
  // État du workflow
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType>('text2image')
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([])
  const [prompt, setPrompt] = useState('')
  const [quality, setQuality] = useState('2k')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  
  // Bibliothèque de références
  const [references, setReferences] = useState<ReferenceItem[]>(DEFAULT_REFERENCES)
  const [selectedReferences, setSelectedReferences] = useState<string[]>([])
  const [referenceFilter, setReferenceFilter] = useState<ReferenceType | 'all'>('all')
  const [showReferenceLibrary, setShowReferenceLibrary] = useState(false)
  const [showAddReference, setShowAddReference] = useState(false)
  
  // État de génération
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // UI state
  const [showImagePicker, setShowImagePicker] = useState<number | null>(null)
  const [showPromptBuilder, setShowPromptBuilder] = useState(false)
  const [activePanel, setActivePanel] = useState<'workflow' | 'references'>('workflow')
  const [showFinalPrompt, setShowFinalPrompt] = useState(false)
  const [finalPromptOverride, setFinalPromptOverride] = useState<string | null>(null)
  
  // Refs pour les nodes
  const canvasRef = useRef<HTMLDivElement>(null)
  
  const currentWorkflow = WORKFLOWS.find(w => w.type === selectedWorkflow)!
  
  // Références filtrées
  const filteredReferences = referenceFilter === 'all' 
    ? references 
    : references.filter(r => r.type === referenceFilter)
  
  // Ajouter/Retirer une référence de la sélection (max 6)
  const toggleReference = (id: string) => {
    setSelectedReferences(prev => {
      if (prev.includes(id)) {
        return prev.filter(r => r !== id)
      }
      if (prev.length >= 6) {
        // Remplacer le premier sélectionné
        return [...prev.slice(1), id]
      }
      return [...prev, id]
    })
  }
  
  // Obtenir les objets ReferenceItem sélectionnés
  const getSelectedReferenceItems = () => {
    return selectedReferences
      .map(id => references.find(r => r.id === id))
      .filter(Boolean) as ReferenceItem[]
  }
  
  // Initialiser les slots d'images quand le workflow change
  useEffect(() => {
    const slots: ImageSlot[] = []
    for (let i = 0; i < currentWorkflow.imageSlots; i++) {
      slots.push({ id: `slot-${i}` })
    }
    setImageSlots(slots)
    setGeneratedImage(null)
  }, [selectedWorkflow])
  
  // Gérer l'upload d'une image
  const handleImageUpload = (slotIndex: number, file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const newSlots = [...imageSlots]
      newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        file,
        preview: reader.result as string
      }
      setImageSlots(newSlots)
    }
    reader.readAsDataURL(file)
    setShowImagePicker(null)
  }
  
  // Sélectionner une image du projet
  const handleSelectProjectImage = (slotIndex: number, imagePath: string) => {
    const newSlots = [...imageSlots]
    newSlots[slotIndex] = {
      ...newSlots[slotIndex],
      path: imagePath,
      preview: imagePath
    }
    setImageSlots(newSlots)
    setShowImagePicker(null)
  }
  
  // Supprimer une image d'un slot
  const handleRemoveImage = (slotIndex: number) => {
    const newSlots = [...imageSlots]
    newSlots[slotIndex] = { id: newSlots[slotIndex].id }
    setImageSlots(newSlots)
  }
  
  // Construire le prompt JSON pour Nano Banana 2
  const buildJsonPrompt = useCallback(() => {
    // Format JSON structuré pour des résultats optimaux
    const jsonPrompt = {
      scene: {
        description: prompt,
        context: "Drôles de Droits - jeu éducatif sur les droits des jeunes en centre jeunesse au Québec"
      },
      style: {
        medium: "digital illustration, semi-realistic graphic novel style",
        influences: "Life is Strange, Telltale Games visual style",
        color_palette: "warm blues, oranges, earth tones, dramatic cinematic lighting",
        quality: "professional quality, clean bold linework, soft shading"
      },
      technical: {
        resolution: quality,
        aspect_ratio: aspectRatio,
        restrictions: "NO text, NO speech bubbles, NO watermarks, safe for all ages"
      }
    }
    
    // Ajouter les instructions pour les images de référence
    if (selectedWorkflow === 'style_transfer' && imageSlots[0]?.preview) {
      return `${prompt} in the exact vibe, texture, drawing style, medium, color palette, and visual characteristics as this reference image`
    }
    
    if (selectedWorkflow === 'combine_images') {
      return `Combine image1 and image2: ${prompt}. Blend them naturally following the instructions.`
    }
    
    if (selectedWorkflow === 'multi_style') {
      return `${prompt} in the style, vibe, texture, and medium of these reference images`
    }
    
    // Pour text2image, utiliser le prompt enrichi
    return JSON.stringify(jsonPrompt, null, 2)
  }, [prompt, selectedWorkflow, imageSlots, quality, aspectRatio])
  
  // Obtenir le prompt final complet (avec contexte des personnages)
  const getFullPrompt = useCallback(() => {
    const basePrompt = buildJsonPrompt()
    const characterContext = buildCharacterContext()
    return basePrompt + characterContext
  }, [buildJsonPrompt])
  
  // Construire le contexte des personnages pour le prompt
  const buildCharacterContext = () => {
    const selectedItems = getSelectedReferenceItems()
    if (selectedItems.length === 0) return ''
    
    const characters = selectedItems.filter(r => r.type === 'character')
    const locations = selectedItems.filter(r => r.type === 'location')
    const objects = selectedItems.filter(r => r.type === 'object')
    const styles = selectedItems.filter(r => r.type === 'style')
    
    let context = '\n\nREFERENCE IMAGES INCLUDED:\n'
    
    if (characters.length > 0) {
      context += `CHARACTERS (maintain exact appearance): ${characters.map(c => `${c.name} - ${c.description}`).join('; ')}\n`
    }
    if (locations.length > 0) {
      context += `LOCATIONS (match setting): ${locations.map(l => `${l.name} - ${l.description}`).join('; ')}\n`
    }
    if (objects.length > 0) {
      context += `OBJECTS: ${objects.map(o => `${o.name} - ${o.description}`).join('; ')}\n`
    }
    if (styles.length > 0) {
      context += `STYLE REFERENCES: ${styles.map(s => `${s.name} - ${s.description}`).join('; ')}\n`
    }
    
    return context
  }
  
  // Lancer la génération
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Entre un prompt pour générer une image')
      return
    }
    
    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)
    
    try {
      // Utiliser le prompt override si disponible, sinon construire le prompt enrichi
      let enrichedPrompt: string
      if (finalPromptOverride) {
        enrichedPrompt = finalPromptOverride
      } else {
        enrichedPrompt = buildJsonPrompt()
        enrichedPrompt += buildCharacterContext()
      }
      
      // Préparer les images de référence (slots + bibliothèque)
      const slotImages = imageSlots
        .filter(slot => slot.preview || slot.path)
        .map(slot => slot.path || slot.preview)
      
      const libraryImages = getSelectedReferenceItems().map(r => r.imagePath)
      
      // Combiner les deux sources (max 6 images)
      const allReferenceImages = [...new Set([...slotImages, ...libraryImages])].slice(0, 6)
      
      console.log('🎨 Generating with references:', allReferenceImages)
      
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: enrichedPrompt,
          style: 'centre_jeunesse',
          aspectRatio,
          quality,
          referenceImages: allReferenceImages,
          workflow: selectedWorkflow
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setGeneratedImage(data.imageData || data.imagePath)
      } else {
        setError(data.error || 'Erreur lors de la génération')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/admin" 
              className="text-white/50 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <h1 className="text-lg font-semibold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Nano Banana 2
              </span>
              <span className="text-white/40 ml-2 font-normal">Studio</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/60">API connectée</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout - Two Columns */}
      <div className="pt-20 min-h-screen flex">
        {/* Left Panel - Controls */}
        <div className="w-[480px] flex-shrink-0 border-r border-white/5 bg-[#0d0d0d] overflow-y-auto h-[calc(100vh-80px)]">
          {/* Panel Tabs */}
          <div className="flex border-b border-white/10 sticky top-0 bg-[#0d0d0d] z-10">
            <button
              onClick={() => setActivePanel('workflow')}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activePanel === 'workflow'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              ✨ Workflow
            </button>
            <button
              onClick={() => setActivePanel('references')}
              className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                activePanel === 'references'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              👥 Références
              {selectedReferences.length > 0 && (
                <span className="absolute top-2 right-4 w-5 h-5 bg-amber-500 rounded-full text-xs text-black font-bold flex items-center justify-center">
                  {selectedReferences.length}
                </span>
              )}
            </button>
          </div>

          {/* Panel Content */}
          <div className="p-6 space-y-6">
            
            {/* REFERENCES PANEL */}
            {activePanel === 'references' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Selected References */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                      Sélectionnées ({selectedReferences.length}/6)
                    </h2>
                    {selectedReferences.length > 0 && (
                      <button
                        onClick={() => setSelectedReferences([])}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Tout retirer
                      </button>
                    )}
                  </div>
                  
                  {selectedReferences.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {getSelectedReferenceItems().map((ref) => (
                        <motion.div
                          key={ref.id}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="relative group"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-amber-500/50">
                            <img 
                              src={ref.imagePath} 
                              alt={ref.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => toggleReference(ref.id)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            ✕
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[9px] text-center py-0.5 truncate">
                            {ref.name}
                          </div>
                          <div className={`absolute top-0 left-0 w-4 h-4 rounded-br-lg flex items-center justify-center text-[10px] bg-gradient-to-br ${TYPE_COLORS[ref.type]}`}>
                            {TYPE_ICONS[ref.type]}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/20 text-center text-white/40 text-sm">
                      Aucune référence sélectionnée.<br/>
                      <span className="text-xs">Sélectionne jusqu'à 6 images ci-dessous.</span>
                    </div>
                  )}
                  
                  {selectedReferences.length > 0 && (
                    <p className="text-xs text-white/30 mt-2">
                      💡 Ces images seront envoyées à Nano Banana 2 pour maintenir la cohérence visuelle
                    </p>
                  )}
                </section>
                
                {/* Filter Tabs */}
                <section>
                  <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                    {(['all', 'character', 'location', 'object', 'style'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setReferenceFilter(filter)}
                        className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${
                          referenceFilter === filter
                            ? 'bg-white/10 text-white'
                            : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        {filter === 'all' ? '📚 Tout' : `${TYPE_ICONS[filter]} ${TYPE_LABELS[filter]}s`}
                      </button>
                    ))}
                  </div>
                </section>
                
                {/* Reference Grid */}
                <section>
                  <div className="grid grid-cols-3 gap-3">
                    {filteredReferences.map((ref) => {
                      const isSelected = selectedReferences.includes(ref.id)
                      return (
                        <button
                          key={ref.id}
                          onClick={() => toggleReference(ref.id)}
                          className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            isSelected
                              ? 'border-amber-500 ring-2 ring-amber-500/30 scale-[0.98]'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <img 
                            src={ref.imagePath} 
                            alt={ref.name}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Type badge */}
                          <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gradient-to-r ${TYPE_COLORS[ref.type]} text-white`}>
                            {TYPE_ICONS[ref.type]}
                          </div>
                          
                          {/* Selected indicator */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                              <span className="text-black text-xs">✓</span>
                            </div>
                          )}
                          
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                            <span className="text-white text-xs font-medium leading-tight">{ref.name}</span>
                            {ref.description && (
                              <span className="text-white/60 text-[10px] leading-tight mt-0.5 line-clamp-2">{ref.description}</span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </section>
                
                {/* Add Custom Reference */}
                <section>
                  <button
                    onClick={() => setShowAddReference(true)}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-white/20 text-white/40 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5 transition-all text-sm font-medium"
                  >
                    + Ajouter une nouvelle référence
                  </button>
                </section>
              </motion.div>
            )}

            {/* WORKFLOW PANEL */}
            {activePanel === 'workflow' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
            
            {/* Workflow Selector */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                Workflow
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {WORKFLOWS.map(workflow => (
                  <button
                    key={workflow.type}
                    onClick={() => setSelectedWorkflow(workflow.type)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedWorkflow === workflow.type
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50 shadow-lg shadow-amber-500/10'
                        : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-2">{workflow.icon}</div>
                    <div className="text-sm font-medium">{workflow.label}</div>
                    <div className="text-xs text-white/40 mt-1">{workflow.estimatedTime}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-3 px-1">
                {currentWorkflow.description}
              </p>
            </section>

            {/* Image Inputs */}
            {currentWorkflow.imageSlots > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Images de référence
                </h2>
                <div className={`grid gap-3 ${currentWorkflow.imageSlots > 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {imageSlots.map((slot, index) => (
                    <div key={slot.id} className="relative">
                      <div 
                        className={`
                          aspect-[4/3] rounded-xl border-2 border-dashed transition-all overflow-hidden
                          ${slot.preview 
                            ? 'border-amber-500/50 bg-amber-500/5' 
                            : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
                          }
                        `}
                      >
                        {slot.preview ? (
                          <div className="relative w-full h-full group">
                            <img 
                              src={slot.preview} 
                              alt={`Reference ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => setShowImagePicker(index)}
                                className="px-3 py-1.5 bg-white/20 rounded-lg text-sm hover:bg-white/30"
                              >
                                Changer
                              </button>
                              <button
                                onClick={() => handleRemoveImage(index)}
                                className="px-3 py-1.5 bg-red-500/30 rounded-lg text-sm hover:bg-red-500/50"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowImagePicker(index)}
                            className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white/60"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                              {index === 0 ? '🖼️' : '➕'}
                            </div>
                            <span className="text-xs">Image {index + 1}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prompt Input */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Prompt
                </h2>
                <button
                  onClick={() => setShowPromptBuilder(!showPromptBuilder)}
                  className="text-xs text-amber-400 hover:text-amber-300"
                >
                  {showPromptBuilder ? '✕ Fermer assistant' : '🔧 Assistant JSON'}
                </button>
              </div>
              
              {/* Textarea toujours visible */}
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décris l'image que tu veux générer..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none text-sm placeholder:text-white/30"
              />
              
              {/* Assistant JSON en dessous si activé */}
              <AnimatePresence>
                {showPromptBuilder && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden"
                  >
                    <PromptBuilder 
                      onPromptChange={setPrompt}
                      currentPrompt={prompt}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Quality & Aspect Ratio */}
            <section className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Qualité
                </h2>
                <div className="flex gap-2">
                  {QUALITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setQuality(opt.value)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        quality === opt.value
                          ? 'bg-amber-500 text-black'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Ratio
                </h2>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-amber-500/50"
                >
                  {ASPECT_RATIOS.map(ar => (
                    <option key={ar.value} value={ar.value}>
                      {ar.icon} {ar.label}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* Final Prompt Preview - Toujours visible avec toggle pour expand/collapse */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    Prompt Final
                  </h2>
                  {finalPromptOverride && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">modifié</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {finalPromptOverride && (
                    <button
                      onClick={() => setFinalPromptOverride(null)}
                      className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                    >
                      ↩️ Reset
                    </button>
                  )}
                  <button
                    onClick={() => setShowFinalPrompt(!showFinalPrompt)}
                    className="text-xs text-amber-400 hover:text-amber-300"
                  >
                    {showFinalPrompt ? '▲ Réduire' : '▼ Développer'}
                  </button>
                </div>
              </div>
              
              {/* Mini preview toujours visible */}
              {!showFinalPrompt && (
                <div 
                  onClick={() => setShowFinalPrompt(true)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
                >
                  <pre className="text-xs font-mono text-white/40 whitespace-nowrap overflow-hidden text-ellipsis">
                    {(finalPromptOverride || getFullPrompt()).slice(0, 100)}...
                  </pre>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-white/30">Cliquer pour voir/modifier le prompt complet</span>
                    {selectedReferences.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                        +{selectedReferences.length} ref
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Full prompt editor */}
              <AnimatePresence>
                {showFinalPrompt && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/40">Ce prompt sera envoyé à Nano Banana 2:</span>
                        <button
                          onClick={() => {
                            if (finalPromptOverride) {
                              setFinalPromptOverride(null)
                            } else {
                              setFinalPromptOverride(getFullPrompt())
                            }
                          }}
                          className={`text-xs px-2 py-1 rounded ${
                            finalPromptOverride 
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                              : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                          }`}
                        >
                          {finalPromptOverride ? '👁️ Voir auto' : '✏️ Modifier'}
                        </button>
                      </div>
                      
                      <textarea
                        value={finalPromptOverride || getFullPrompt()}
                        onChange={(e) => setFinalPromptOverride(e.target.value)}
                        rows={10}
                        readOnly={!finalPromptOverride}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-mono focus:outline-none resize-none ${
                          finalPromptOverride 
                            ? 'bg-black/30 border border-amber-500/30 text-white/90 focus:border-amber-500/50' 
                            : 'bg-black/20 border border-white/10 text-white/60 cursor-default'
                        }`}
                      />
                      
                      {/* Images de référence qui seront envoyées */}
                      {(selectedReferences.length > 0 || imageSlots.some(s => s.preview)) && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <span className="text-xs text-white/40">Images de référence envoyées:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {getSelectedReferenceItems().map((ref) => (
                              <div key={ref.id} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs">
                                <img src={ref.imagePath} alt={ref.name} className="w-4 h-4 rounded object-cover" />
                                <span className="text-white/60">{ref.name}</span>
                              </div>
                            ))}
                            {imageSlots.filter(s => s.preview).map((slot, i) => (
                              <div key={slot.id} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs">
                                <img src={slot.preview} alt={`Slot ${i+1}`} className="w-4 h-4 rounded object-cover" />
                                <span className="text-white/60">Slot {i+1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg transition-all
                ${isGenerating 
                  ? 'bg-white/10 text-white/50 cursor-wait' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98]'
                }
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              `}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    ⏳
                  </motion.span>
                  Génération en cours...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Générer l'image</span>
                  <span className="text-black/60">({currentWorkflow.credits} crédits)</span>
                </span>
              )}
            </button>

            {/* Footer Info */}
            <div className="text-center text-xs text-white/30 space-y-1">
              <p>Nano Banana 2 • Gemini 3.1 Flash Image</p>
              <p>Temps estimé: {currentWorkflow.estimatedTime}</p>
            </div>
            
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Panel - Canvas/Preview */}
        <div className="flex-1 bg-[#080808] relative" ref={canvasRef}>
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Node Connections Visualization */}
          <svg className="absolute inset-0 pointer-events-none z-10">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            
            {/* Connection lines from inputs to output */}
            {imageSlots.length > 0 && imageSlots.some(s => s.preview) && (
              <motion.path
                d="M 240 200 Q 400 200 400 350 Q 400 500 560 500"
                stroke="url(#connectionGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            )}
            
            {prompt && (
              <motion.path
                d="M 240 400 Q 400 400 400 450 Q 400 500 560 500"
                stroke="url(#connectionGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
              />
            )}
          </svg>

          {/* Output Preview */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-3xl w-full"
            >
              {/* Output Node Frame */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#0d0d0d] rounded-full border border-white/10 z-20">
                <span className="text-xs font-medium text-white/60">Output</span>
              </div>
              
              <div 
                className={`
                  relative rounded-2xl border-2 overflow-hidden transition-all duration-500
                  ${generatedImage 
                    ? 'border-green-500/50 shadow-2xl shadow-green-500/10' 
                    : 'border-white/10'
                  }
                `}
                style={{ 
                  aspectRatio: aspectRatio.replace(':', '/'),
                  background: 'linear-gradient(135deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)'
                }}
              >
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                    >
                      {/* Animated rings */}
                      <div className="relative w-24 h-24">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 rounded-full border-2 border-amber-500/30"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.4,
                              ease: 'easeInOut'
                            }}
                          />
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl">🍌</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-white/60 text-sm">Nano Banana 2 génère ton image...</p>
                        <p className="text-white/30 text-xs mt-1">Ça peut prendre jusqu'à {currentWorkflow.estimatedTime}</p>
                      </div>
                    </motion.div>
                  ) : generatedImage ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      <img 
                        src={generatedImage} 
                        alt="Generated"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Action overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                          <button className="flex-1 py-2.5 bg-white/10 backdrop-blur rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
                            📥 Télécharger
                          </button>
                          <button className="flex-1 py-2.5 bg-white/10 backdrop-blur rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
                            💾 Sauvegarder
                          </button>
                          <button 
                            onClick={handleGenerate}
                            className="flex-1 py-2.5 bg-amber-500/20 backdrop-blur rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-500/30 transition-colors"
                          >
                            🔄 Régénérer
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
                    >
                      <div className="text-6xl mb-6 opacity-20">🖼️</div>
                      <p className="text-white/30 text-lg mb-2">
                        L'image générée apparaîtra ici
                      </p>
                      <p className="text-white/20 text-sm max-w-md">
                        Choisis un workflow, ajoute des images de référence si nécessaire, 
                        puis entre ton prompt et clique sur Générer
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Mini workflow indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-[#0d0d0d]/90 backdrop-blur rounded-full border border-white/10">
            <span className="text-2xl">{currentWorkflow.icon}</span>
            <span className="text-sm text-white/60">{currentWorkflow.label}</span>
            <span className="text-xs text-white/30">•</span>
            <span className="text-sm text-white/40">{ASPECT_RATIOS.find(a => a.value === aspectRatio)?.icon} {aspectRatio}</span>
            <span className="text-xs text-white/30">•</span>
            <span className="text-sm text-white/40">{quality.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Selected References Indicator (floating) */}
      {selectedReferences.length > 0 && activePanel === 'workflow' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-6 z-40"
        >
          <button
            onClick={() => setActivePanel('references')}
            className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] rounded-xl border border-amber-500/30 shadow-lg shadow-amber-500/10 hover:border-amber-500/50 transition-all"
          >
            <div className="flex -space-x-2">
              {getSelectedReferenceItems().slice(0, 4).map((ref, i) => (
                <div 
                  key={ref.id}
                  className="w-8 h-8 rounded-lg overflow-hidden border-2 border-[#1a1a1a]"
                  style={{ zIndex: 10 - i }}
                >
                  <img src={ref.imagePath} alt={ref.name} className="w-full h-full object-cover" />
                </div>
              ))}
              {selectedReferences.length > 4 && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border-2 border-[#1a1a1a] flex items-center justify-center text-xs text-amber-400 font-bold">
                  +{selectedReferences.length - 4}
                </div>
              )}
            </div>
            <div className="text-left">
              <div className="text-xs text-white/60">{selectedReferences.length} référence{selectedReferences.length > 1 ? 's' : ''}</div>
              <div className="text-[10px] text-amber-400">Cliquer pour modifier</div>
            </div>
          </button>
        </motion.div>
      )}

      {/* Add Reference Modal */}
      <AnimatePresence>
        {showAddReference && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddReference(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1a1a1a] rounded-2xl border border-white/10 max-w-lg w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <AddReferenceForm 
                onAdd={(newRef) => {
                  setReferences(prev => [...prev, newRef])
                  setShowAddReference(false)
                }}
                onCancel={() => setShowAddReference(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Picker Modal */}
      <AnimatePresence>
        {showImagePicker !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowImagePicker(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1a1a1a] rounded-2xl border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold">Choisir une image</h3>
                <p className="text-white/40 text-sm mt-1">
                  Sélectionne une image du projet ou uploade la tienne
                </p>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Upload zone */}
                <div className="mb-6">
                  <label className="block">
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer">
                      <div className="text-4xl mb-3">📤</div>
                      <p className="text-white/60 text-sm">Clique pour uploader ou drag & drop</p>
                      <p className="text-white/30 text-xs mt-1">PNG, JPG, WEBP jusqu'à 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file && showImagePicker !== null) {
                          handleImageUpload(showImagePicker, file)
                        }
                      }}
                    />
                  </label>
                </div>
                
                {/* Project images */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                    Images du projet
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    {PROJECT_IMAGES.map((img) => (
                      <button
                        key={img.path}
                        onClick={() => {
                          if (showImagePicker !== null) {
                            handleSelectProjectImage(showImagePicker, img.path)
                          }
                        }}
                        className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-500/50 transition-all"
                      >
                        <img 
                          src={img.path} 
                          alt={img.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-xs text-white/80 leading-tight">{img.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={() => setShowImagePicker(null)}
                  className="w-full py-2.5 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

// Composant pour construire des prompts avec des champs structurés
function PromptBuilder({ 
  onPromptChange, 
  currentPrompt 
}: { 
  onPromptChange: (prompt: string) => void
  currentPrompt: string 
}) {
  const [subject, setSubject] = useState({
    description: currentPrompt || '',
    age: '15-17 ans',
    expression: '',
    clothing: ''
  })
  
  const [scene, setScene] = useState({
    setting: 'centre_jeunesse',
    atmosphere: '',
    lighting: 'natural indoor'
  })
  
  const [camera, setCamera] = useState({
    shot: 'medium',
    angle: 'eye-level'
  })
  
  // Construire le prompt texte enrichi (pas JSON, juste texte descriptif)
  const buildEnrichedPrompt = useCallback(() => {
    const parts: string[] = []
    
    // Sujet principal
    if (subject.description) {
      parts.push(subject.description)
    }
    
    // Expression
    if (subject.expression) {
      parts.push(`Expression: ${subject.expression}`)
    }
    
    // Vêtements
    if (subject.clothing) {
      parts.push(`Vêtements: ${subject.clothing}`)
    }
    
    // Lieu
    const settingLabels: Record<string, string> = {
      'centre_jeunesse': 'dans un centre jeunesse au Québec',
      'cafeteria': 'dans la cafétéria du centre',
      'chambre': 'dans sa chambre au centre',
      'bureau': "dans le bureau d'un intervenant",
      'exterieur': 'à l\'extérieur du centre',
      'urbain': 'dans une rue de Montréal',
      'nuit': 'la nuit dans un environnement urbain'
    }
    if (scene.setting && settingLabels[scene.setting]) {
      parts.push(settingLabels[scene.setting])
    }
    
    // Atmosphère
    if (scene.atmosphere) {
      parts.push(`Ambiance: ${scene.atmosphere}`)
    }
    
    // Type de plan
    const shotLabels: Record<string, string> = {
      'establishing': 'Plan d\'ensemble',
      'wide': 'Plan large',
      'medium': 'Plan moyen',
      'closeup': 'Gros plan',
      'extreme_closeup': 'Très gros plan',
      'two_shot': 'Plan à deux personnages',
      'over_shoulder': 'Par-dessus l\'épaule'
    }
    if (camera.shot && shotLabels[camera.shot]) {
      parts.push(`Cadrage: ${shotLabels[camera.shot]}`)
    }
    
    return parts.join('. ')
  }, [subject, scene, camera])
  
  // Appliquer les changements au prompt principal
  const applyToPrompt = () => {
    const enrichedPrompt = buildEnrichedPrompt()
    if (enrichedPrompt) {
      onPromptChange(enrichedPrompt)
    }
  }
  
  return (
    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          🔧 Assistant de prompt
        </h4>
        <button
          onClick={applyToPrompt}
          className="text-xs px-3 py-1.5 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition-colors"
        >
          Appliquer au prompt ↑
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Expression */}
        <div>
          <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Expression</label>
          <select
            value={subject.expression}
            onChange={(e) => setSubject(s => ({ ...s, expression: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
          >
            <option value="">Choisir...</option>
            <option value="nerveux">😰 Nerveux</option>
            <option value="confiant">😎 Confiant</option>
            <option value="triste">😢 Triste</option>
            <option value="en colère">😠 En colère</option>
            <option value="déterminé">💪 Déterminé</option>
            <option value="hésitant">🤔 Hésitant</option>
            <option value="soulagé">😌 Soulagé</option>
            <option value="effrayé">😨 Effrayé</option>
          </select>
        </div>
        
        {/* Lieu */}
        <div>
          <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Lieu</label>
          <select
            value={scene.setting}
            onChange={(e) => setScene(s => ({ ...s, setting: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
          >
            <option value="centre_jeunesse">🏢 Centre jeunesse</option>
            <option value="cafeteria">🍽️ Cafétéria</option>
            <option value="chambre">🛏️ Chambre</option>
            <option value="bureau">💼 Bureau intervenant</option>
            <option value="exterieur">🌳 Extérieur</option>
            <option value="urbain">🏙️ Rue urbaine</option>
            <option value="nuit">🌙 Scène de nuit</option>
          </select>
        </div>
        
        {/* Cadrage */}
        <div>
          <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Cadrage</label>
          <select
            value={camera.shot}
            onChange={(e) => setCamera(c => ({ ...c, shot: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
          >
            <option value="medium">📷 Plan moyen</option>
            <option value="establishing">🏞️ Plan d'ensemble</option>
            <option value="wide">📐 Plan large</option>
            <option value="closeup">🔍 Gros plan</option>
            <option value="extreme_closeup">👁️ Très gros plan</option>
            <option value="two_shot">👥 Plan à deux</option>
            <option value="over_shoulder">🎬 Par-dessus l'épaule</option>
          </select>
        </div>
        
        {/* Atmosphère */}
        <div>
          <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Atmosphère</label>
          <input
            type="text"
            value={scene.atmosphere}
            onChange={(e) => setScene(s => ({ ...s, atmosphere: e.target.value }))}
            placeholder="tendue, calme, dramatique..."
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
          />
        </div>
      </div>
      
      {/* Vêtements */}
      <div>
        <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Vêtements (optionnel)</label>
        <input
          type="text"
          value={subject.clothing}
          onChange={(e) => setSubject(s => ({ ...s, clothing: e.target.value }))}
          placeholder="hoodie bleu, jeans, sneakers..."
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
        />
      </div>
      
      {/* Preview du prompt enrichi */}
      <div className="p-3 rounded-lg bg-black/20 border border-white/5">
        <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Aperçu du prompt enrichi:</div>
        <p className="text-xs text-white/60 italic">
          {buildEnrichedPrompt() || 'Entre une description ci-dessus...'}
        </p>
      </div>
    </div>
  )
}

// Composant pour ajouter une nouvelle référence à la bibliothèque
function AddReferenceForm({
  onAdd,
  onCancel
}: {
  onAdd: (ref: ReferenceItem) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState<ReferenceType>('character')
  const [description, setDescription] = useState('')
  const [imagePath, setImagePath] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [tags, setTags] = useState('')
  
  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      // En production, on uploaderait l'image sur le serveur
      // Pour l'instant, on utilise la préview base64
      setImagePath(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  const handleSelectProjectImage = (path: string) => {
    setImagePath(path)
    setImagePreview(path)
  }
  
  const handleSubmit = () => {
    if (!name || !imagePath) return
    
    const newRef: ReferenceItem = {
      id: `custom-${Date.now()}`,
      name,
      type,
      imagePath,
      description: description || undefined,
      tags: tags ? tags.split(',').map(t => t.trim()) : undefined
    }
    
    onAdd(newRef)
  }
  
  return (
    <div>
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-semibold">Ajouter une référence</h3>
        <p className="text-white/40 text-sm mt-1">
          Crée un personnage, lieu ou objet réutilisable
        </p>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Image Upload */}
        <div>
          {imagePreview ? (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  setImagePath('')
                  setImagePreview(null)
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-500"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="block">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer">
                <div className="text-4xl mb-3">📤</div>
                <p className="text-white/60 text-sm">Clique pour uploader une image</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
              />
            </label>
          )}
          
          {/* Quick select from project */}
          {!imagePreview && (
            <div className="mt-3">
              <p className="text-xs text-white/40 mb-2">Ou sélectionne une image existante:</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {PROJECT_IMAGES.slice(0, 6).map((img) => (
                  <button
                    key={img.path}
                    onClick={() => handleSelectProjectImage(img.path)}
                    className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 border-transparent hover:border-amber-500/50"
                  >
                    <img src={img.path} alt={img.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Name & Type */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la référence"
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-amber-500/50"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ReferenceType)}
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm"
          >
            <option value="character">👤 Personnage</option>
            <option value="location">📍 Lieu</option>
            <option value="object">📦 Objet</option>
            <option value="style">🎨 Style</option>
          </select>
        </div>
        
        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (sera incluse dans le prompt)..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-amber-500/50 resize-none"
        />
        
        {/* Tags */}
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (séparés par des virgules)"
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-amber-500/50"
        />
      </div>
      
      <div className="p-4 border-t border-white/10 flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name || !imagePath}
          className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter à la bibliothèque
        </button>
      </div>
    </div>
  )
}

