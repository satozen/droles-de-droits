/**
 * Interface Admin pour générer de nouveaux chapitres
 * Utilise Claude Opus 4.6 pour les scénarios et Nano Banana 2 pour les images
 */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Chapter, GenerateScenarioRequest } from '@/types/chapter'

// Les 12 droits disponibles
const DROITS = [
  { id: 1, titre: "Droit à l'information", icon: "📋" },
  { id: 2, titre: "Droit aux services", icon: "🏥" },
  { id: 3, titre: "Droit de choisir son professionnel", icon: "👨‍⚕️" },
  { id: 4, titre: "Droit de recevoir les soins requis", icon: "⭐" },
  { id: 5, titre: "Droit de consentir ou refuser", icon: "✋" },
  { id: 6, titre: "Droit de participer aux décisions", icon: "🤝" },
  { id: 7, titre: "Droit d'être accompagné", icon: "👥" },
  { id: 8, titre: "Droit à l'hébergement", icon: "🏠" },
  { id: 9, titre: "Droit à la langue anglaise", icon: "🗣️" },
  { id: 10, titre: "Droit au dossier d'usager", icon: "📁" },
  { id: 11, titre: "Droit à la confidentialité", icon: "🔒" },
  { id: 12, titre: "Droit de porter plainte", icon: "📢" },
]

export default function GeneratePage() {
  // État du formulaire
  const [formData, setFormData] = useState<GenerateScenarioRequest>({
    chapterTitle: '',
    rightId: 8,
    rightTitle: 'Droit à l\'hébergement',
    rightDescription: 'Si ton état le requiert, tu as le droit d\'être hébergé dans un établissement qui offre des services adaptés à tes besoins.',
    context: '',
    characters: [
      { name: 'Alex', role: 'protagoniste', personality: 'Jeune résident du centre, curieux mais anxieux' }
    ],
    desiredBranches: 3,
    tone: 'serieux'
  })
  
  // États de génération
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedChapter, setGeneratedChapter] = useState<Partial<Chapter> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'form' | 'preview' | 'images' | 'audio'>('form')
  const [imageProgress, setImageProgress] = useState<{current: number, total: number, status: string}>({ current: 0, total: 0, status: '' })
  
  // Ajouter un personnage
  const addCharacter = () => {
    setFormData(prev => ({
      ...prev,
      characters: [...prev.characters, { name: '', role: '', personality: '' }]
    }))
  }
  
  // Supprimer un personnage
  const removeCharacter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.filter((_, i) => i !== index)
    }))
  }
  
  // Mettre à jour un personnage
  const updateCharacter = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.map((char, i) => 
        i === index ? { ...char, [field]: value } : char
      )
    }))
  }
  
  // Générer le scénario
  const generateScenario = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success && data.chapter) {
        setGeneratedChapter(data.chapter)
        setStep('preview')
      } else {
        setError(data.error || 'Erreur lors de la génération')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Générer les images pour le chapitre
  const generateImages = async () => {
    if (!generatedChapter?.dialogue) return
    
    setStep('images')
    const scenes = Object.entries(generatedChapter.dialogue)
    let total = 0
    
    // Compter le nombre total d'images
    for (const [_, lines] of scenes) {
      total += (lines as any[]).length
    }
    
    setImageProgress({ current: 0, total, status: 'Démarrage...' })
    
    let current = 0
    const updatedDialogue = { ...generatedChapter.dialogue }
    
    for (const [sceneKey, lines] of scenes) {
      for (let i = 0; i < (lines as any[]).length; i++) {
        current++
        const line = (lines as any[])[i]
        
        setImageProgress({
          current,
          total,
          status: `Génération: ${sceneKey} - ligne ${i + 1}`
        })
        
        try {
          const response = await fetch('/api/generate/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: line.text,
              sceneContext: `Scene: ${sceneKey}, ${formData.chapterTitle}`,
              style: 'centre_jeunesse',
              aspectRatio: '16:9',
              characters: formData.characters.map(c => c.name),
              emotion: line.emotion
            })
          })
          
          const data = await response.json()
          
          if (data.success && data.imagePath) {
            // Mettre à jour le chemin de l'image
            (updatedDialogue as any)[sceneKey][i].image = data.imagePath
          }
        } catch (err) {
          console.error(`Erreur image ${sceneKey}:${i}:`, err)
        }
        
        // Délai entre les requêtes
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    setGeneratedChapter(prev => prev ? { ...prev, dialogue: updatedDialogue } : null)
    setImageProgress({ current: total, total, status: 'Terminé!' })
  }
  
  // État de sauvegarde
  const [saveStatus, setSaveStatus] = useState<{success: boolean, message: string, filename?: string, imageCount?: number} | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Sauvegarder le chapitre dans data/chapters/
  const saveChapter = async () => {
    if (!generatedChapter) return
    
    setIsSaving(true)
    setSaveStatus(null)
    
    try {
      const response = await fetch('/api/generate/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter: generatedChapter })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSaveStatus({
          success: true,
          message: `✅ Sauvegardé: ${data.filename}`,
          filename: data.filename,
          imageCount: data.imageCount
        })
      } else {
        setSaveStatus({
          success: false,
          message: `❌ Erreur: ${data.error}`
        })
      }
    } catch (err) {
      setSaveStatus({
        success: false,
        message: '❌ Erreur de connexion'
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  // Télécharger aussi en local (backup)
  const downloadChapter = () => {
    if (!generatedChapter) return
    
    const json = JSON.stringify(generatedChapter, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const date = new Date().toISOString().split('T')[0]
    a.download = `${generatedChapter.metadata?.slug || 'chapitre'}_droit-${generatedChapter.metadata?.right?.id || 0}_${date}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  // Sélectionner un droit
  const selectRight = (rightId: number) => {
    const droit = DROITS.find(d => d.id === rightId)
    if (droit) {
      setFormData(prev => ({
        ...prev,
        rightId: droit.id,
        rightTitle: droit.titre
      }))
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-white/70 hover:text-white transition-colors">
            ← Retour
          </Link>
          <h1 className="text-2xl md:text-4xl font-black text-white">
            🎮 Générateur de Chapitres
          </h1>
          <div className="text-white/50 text-sm">
            Admin
          </div>
        </div>

        {/* Étape 1: Formulaire */}
        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20"
          >
            <h2 className="text-xl font-bold text-white mb-6">📝 Configuration du chapitre</h2>
            
            {/* Titre du chapitre */}
            <div className="mb-6">
              <label className="block text-white/80 mb-2 font-semibold">Titre du chapitre</label>
              <input
                type="text"
                value={formData.chapterTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, chapterTitle: e.target.value }))}
                placeholder="Ex: La Fugue"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none"
              />
            </div>
            
            {/* Sélection du droit */}
            <div className="mb-6">
              <label className="block text-white/80 mb-2 font-semibold">Droit à enseigner</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DROITS.map(droit => (
                  <button
                    key={droit.id}
                    onClick={() => selectRight(droit.id)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      formData.rightId === droit.id
                        ? 'bg-purple-500 text-white border-2 border-white'
                        : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-xl mr-2">{droit.icon}</span>
                    <span className="text-xs font-semibold">#{droit.id}</span>
                  </button>
                ))}
              </div>
              <p className="text-white/60 mt-2 text-sm">
                Sélectionné: <span className="text-purple-400 font-semibold">{formData.rightTitle}</span>
              </p>
            </div>
            
            {/* Contexte */}
            <div className="mb-6">
              <label className="block text-white/80 mb-2 font-semibold">Contexte de l'histoire</label>
              <textarea
                value={formData.context}
                onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                placeholder="Décris la situation de départ, le conflit principal, ce que le joueur va apprendre..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none resize-none"
              />
            </div>
            
            {/* Personnages */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/80 font-semibold">Personnages</label>
                <button
                  onClick={addCharacter}
                  className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30"
                >
                  + Ajouter
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.characters.map((char, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={char.name}
                      onChange={(e) => updateCharacter(index, 'name', e.target.value)}
                      placeholder="Nom"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-sm"
                    />
                    <input
                      type="text"
                      value={char.role}
                      onChange={(e) => updateCharacter(index, 'role', e.target.value)}
                      placeholder="Rôle"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-sm"
                    />
                    <input
                      type="text"
                      value={char.personality}
                      onChange={(e) => updateCharacter(index, 'personality', e.target.value)}
                      placeholder="Personnalité"
                      className="flex-2 px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-sm"
                    />
                    {index > 0 && (
                      <button
                        onClick={() => removeCharacter(index)}
                        className="px-2 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Options */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-white/80 mb-2 font-semibold">Nombre de branches</label>
                <select
                  value={formData.desiredBranches}
                  onChange={(e) => setFormData(prev => ({ ...prev, desiredBranches: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20"
                >
                  <option value={2}>2 branches</option>
                  <option value={3}>3 branches</option>
                  <option value={4}>4 branches</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 mb-2 font-semibold">Ton</label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20"
                >
                  <option value="serieux">Sérieux</option>
                  <option value="leger">Léger</option>
                  <option value="dramatique">Dramatique</option>
                </select>
              </div>
            </div>
            
            {/* Erreur */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
                {error}
              </div>
            )}
            
            {/* Bouton générer */}
            <button
              onClick={generateScenario}
              disabled={isGenerating || !formData.chapterTitle || !formData.context}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.span>
                  Génération en cours avec Claude Opus 4.6...
                </span>
              ) : (
                '🚀 Générer le scénario'
              )}
            </button>
          </motion.div>
        )}

        {/* Étape 2: Preview du scénario */}
        {step === 'preview' && generatedChapter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Info */}
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-green-300">
              ✅ Scénario généré avec succès! Vérifie le contenu puis génère les images.
            </div>
            
            {/* Preview des scènes */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">📖 Aperçu du scénario</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {generatedChapter.dialogue && Object.entries(generatedChapter.dialogue).map(([sceneKey, lines]) => (
                  <div key={sceneKey} className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-purple-400 font-bold mb-2">🎬 {sceneKey}</h3>
                    <div className="space-y-2">
                      {(lines as any[]).map((line, i) => (
                        <div key={i} className="text-white/80 text-sm pl-4 border-l-2 border-white/20">
                          <span className="text-yellow-400 font-semibold">{line.speaker}:</span> {line.text}
                          {line.choices && (
                            <div className="mt-1 text-cyan-400 text-xs">
                              Choix: {line.choices.join(' | ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Status de sauvegarde */}
            {saveStatus && (
              <div className={`p-4 rounded-xl border mb-4 ${
                saveStatus.success 
                  ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                  : 'bg-red-500/20 border-red-500/50 text-red-300'
              }`}>
                <p className="font-semibold">{saveStatus.message}</p>
                {saveStatus.success && saveStatus.imageCount && (
                  <p className="text-sm mt-1 opacity-80">
                    📸 {saveStatus.imageCount} images à générer
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setStep('form')}
                className="flex-1 min-w-[150px] py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20"
              >
                ← Modifier
              </button>
              <button
                onClick={generateImages}
                className="flex-1 min-w-[150px] py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg"
              >
                🎨 Générer les images
              </button>
              <button
                onClick={saveChapter}
                disabled={isSaving}
                className="flex-1 min-w-[150px] py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50"
              >
                {isSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder dans Cursor'}
              </button>
              <button
                onClick={downloadChapter}
                className="py-3 px-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20"
                title="Télécharger une copie locale"
              >
                ⬇️
              </button>
            </div>
          </motion.div>
        )}

        {/* Étape 3: Génération des images - Une à la fois */}
        {step === 'images' && generatedChapter && (
          <ImageGeneratorStep 
            chapter={generatedChapter}
            onBack={() => setStep('preview')}
            onUpdateChapter={(updated) => setGeneratedChapter(updated)}
            onSave={saveChapter}
            onNextStep={() => setStep('audio')}
          />
        )}

        {/* Étape 4: Génération des audios - ElevenLabs TTS */}
        {step === 'audio' && generatedChapter && (
          <AudioGeneratorStep
            chapter={generatedChapter}
            onBack={() => setStep('images')}
            onUpdateChapter={(updated) => setGeneratedChapter(updated)}
            onSave={saveChapter}
          />
        )}
        
        {/* Instructions */}
        <div className="mt-8 text-white/40 text-sm text-center">
          <p>Utilise Claude Opus 4.6 pour les scénarios et Nano Banana 2 pour les images.</p>
          <p>Les chapitres générés sont sauvegardés dans <code className="text-purple-400">data/chapters/</code></p>
        </div>
      </div>
    </main>
  )
}

// Images de référence disponibles (Fouilles et Cafouillage + autres)
const REFERENCE_IMAGES = [
  { path: '/images/jeune_reflechi.webp', label: 'Alex - Réfléchit', character: 'alex' },
  { path: '/images/refus_drogue_non.webp', label: 'Alex - Refuse', character: 'alex' },
  { path: '/images/cafeteria_triste.webp', label: 'Alex - Triste', character: 'alex' },
  { path: '/images/jeune_offre_drogue.webp', label: 'Jay offre drogue', character: 'jay' },
  { path: '/images/establishing_centre jeunesse.webp', label: 'Centre jeunesse - Extérieur', character: 'lieu' },
  { path: '/images/cafeteria_dialogue.webp', label: 'Cafétéria - Dialogue', character: 'lieu' },
  { path: '/images/intervenante_arrive_lieu_echange_drogues.webp', label: 'Intervenante arrive', character: 'educateur' },
  { path: '/images/police_centre_jeunesse.webp', label: 'Police au centre', character: 'police' },
  { path: '/images/police_parle_au_jeune.webp', label: 'Police parle au jeune', character: 'police' },
  { path: '/images/pilules_rejetees_lit.webp', label: 'Pilules sur lit', character: 'objet' },
  { path: '/images/fugue_course.webp', label: 'Fugue - Course', character: 'alex' },
  { path: '/images/jeune_tribunal.webp', label: 'Jeune au tribunal', character: 'alex' },
  { path: '/images/jeune_entoure_famille_avocats.webp', label: 'Famille et avocats', character: 'famille' },
  { path: '/images/crystaux_decision.webp', label: 'Décision - Cristaux', character: 'abstrait' },
  { path: '/images/adolescent_bus_stress.webp', label: 'Ado stressé - Bus', character: 'alex' },
  { path: '/images/droit_confidentialite_top_confidentiel.webp', label: 'Confidentialité', character: 'abstrait' },
  { path: '/images/plan d\'intervention_gemini.webp', label: 'Plan intervention', character: 'document' },
]

// Composant pour générer les images une par une avec preview des prompts
function ImageGeneratorStep({ 
  chapter, 
  onBack, 
  onUpdateChapter,
  onSave,
  onNextStep
}: { 
  chapter: Partial<Chapter>
  onBack: () => void
  onUpdateChapter: (chapter: Partial<Chapter>) => void
  onSave: () => void
  onNextStep?: () => void
}) {
  // Extraire toutes les images à générer
  const [imageList, setImageList] = useState<Array<{
    sceneKey: string
    lineIndex: number
    speaker: string
    text: string
    emotion?: string
    prompt: string
    status: 'pending' | 'generating' | 'done' | 'error'
    imagePath?: string
    referenceImage?: string // Image de référence sélectionnée
  }>>(() => {
    const list: any[] = []
    if (chapter.dialogue) {
      Object.entries(chapter.dialogue).forEach(([sceneKey, lines]) => {
        (lines as any[]).forEach((line, lineIndex) => {
          list.push({
            sceneKey,
            lineIndex,
            speaker: line.speaker,
            text: line.text,
            emotion: line.emotion,
            prompt: buildImagePrompt(sceneKey, line, chapter),
            status: 'pending',
            imagePath: line.image
          })
        })
      })
    }
    return list
  })
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null)
  const [selectedReference, setSelectedReference] = useState<string | null>(null)
  const [showReferenceSelector, setShowReferenceSelector] = useState(false)
  
  const currentImage = imageList[currentIndex]
  const doneCount = imageList.filter(i => i.status === 'done').length
  
  // Générer le prompt pour une image
  function buildImagePrompt(sceneKey: string, line: any, chapterData: Partial<Chapter>): string {
    const emotionMap: {[key: string]: string} = {
      'nerveux': 'anxious, worried expression',
      'confiant': 'confident, determined',
      'triste': 'sad, downcast',
      'determine': 'resolute, focused',
      'hesitant': 'uncertain, conflicted',
      'peur': 'scared, fearful',
      'soulage': 'relieved, calm'
    }
    
    const emotion = line.emotion ? emotionMap[line.emotion] || line.emotion : 'neutral'
    
    return `Scene from "${chapterData.metadata?.title || 'youth center story'}": ${line.text.slice(0, 100)}... 
Character ${line.speaker} showing ${emotion} emotion. 
Quebec youth center setting, semi-realistic graphic novel style.
Teenager 15-17 years old, diverse Quebec youth.`
  }
  
  // Générer une seule image
  const generateSingleImage = async () => {
    if (!currentImage || isGenerating) return
    
    setIsGenerating(true)
    
    // Mettre à jour le status et la référence sélectionnée
    const newList = [...imageList]
    newList[currentIndex].status = 'generating'
    if (selectedReference) {
      newList[currentIndex].referenceImage = selectedReference
    }
    setImageList(newList)
    
    try {
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: editingPrompt || currentImage.prompt,
          sceneContext: `Scene: ${currentImage.sceneKey}`,
          style: 'centre_jeunesse',
          aspectRatio: '16:9',
          characters: [currentImage.speaker],
          emotion: currentImage.emotion,
          // Envoyer l'image de référence si sélectionnée
          referenceImages: selectedReference ? [selectedReference] : []
        })
      })
      
      const data = await response.json()
      
      const updatedList = [...imageList]
      if (data.success && data.imagePath) {
        updatedList[currentIndex].status = 'done'
        updatedList[currentIndex].imagePath = data.imagePath
        
        // Mettre à jour le chapitre
        if (chapter.dialogue) {
          const updatedDialogue = { ...chapter.dialogue }
          const scene = updatedDialogue[currentImage.sceneKey] as any[]
          if (scene && scene[currentImage.lineIndex]) {
            scene[currentImage.lineIndex].image = data.imagePath
          }
          onUpdateChapter({ ...chapter, dialogue: updatedDialogue })
        }
      } else {
        updatedList[currentIndex].status = 'error'
      }
      setImageList(updatedList)
      
    } catch (err) {
      const updatedList = [...imageList]
      updatedList[currentIndex].status = 'error'
      setImageList(updatedList)
    } finally {
      setIsGenerating(false)
      setEditingPrompt(null)
    }
  }
  
  // Passer à l'image suivante
  const goNext = () => {
    if (currentIndex < imageList.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setEditingPrompt(null)
    }
  }
  
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setEditingPrompt(null)
    }
  }
  
  // Sauter cette image (utiliser placeholder)
  const skipImage = () => {
    const updatedList = [...imageList]
    updatedList[currentIndex].status = 'done'
    updatedList[currentIndex].imagePath = '/images/jeune_reflechi.webp' // placeholder
    setImageList(updatedList)
    goNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header avec progression */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">🎨 Génération des images</h2>
          <span className="text-white/60">
            {currentIndex + 1} / {imageList.length} ({doneCount} générées)
          </span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: `${(doneCount / imageList.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Image actuelle */}
      {currentImage && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          {/* Info de la scène */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-purple-500/30 rounded text-purple-300 text-sm font-semibold">
              {currentImage.sceneKey}
            </span>
            <span className="px-2 py-1 bg-yellow-500/30 rounded text-yellow-300 text-sm">
              {currentImage.speaker}
            </span>
            {currentImage.emotion && (
              <span className="px-2 py-1 bg-blue-500/30 rounded text-blue-300 text-sm">
                {currentImage.emotion}
              </span>
            )}
            <span className={`ml-auto px-2 py-1 rounded text-sm font-semibold ${
              currentImage.status === 'done' ? 'bg-green-500/30 text-green-300' :
              currentImage.status === 'generating' ? 'bg-yellow-500/30 text-yellow-300' :
              currentImage.status === 'error' ? 'bg-red-500/30 text-red-300' :
              'bg-white/10 text-white/60'
            }`}>
              {currentImage.status === 'done' ? '✅ Fait' :
               currentImage.status === 'generating' ? '⏳ En cours...' :
               currentImage.status === 'error' ? '❌ Erreur' :
               '⏸️ En attente'}
            </span>
          </div>

          {/* Dialogue */}
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <p className="text-white/80 italic">"{currentImage.text}"</p>
          </div>

          {/* Prompt (éditable) */}
          <div className="mb-4">
            <label className="block text-white/60 text-sm mb-2">
              Prompt pour Nano Banana 2:
            </label>
            <textarea
              value={editingPrompt ?? currentImage.prompt}
              onChange={(e) => setEditingPrompt(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none resize-none text-sm"
            />
          </div>

          {/* Sélecteur d'image de référence */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/60 text-sm">
                📷 Image de référence (optionnel):
              </label>
              <button
                onClick={() => setShowReferenceSelector(!showReferenceSelector)}
                className="text-purple-400 text-sm hover:text-purple-300"
              >
                {showReferenceSelector ? '▲ Masquer' : '▼ Afficher les images'}
              </button>
            </div>
            
            {/* Image sélectionnée */}
            {selectedReference && (
              <div className="flex items-center gap-3 p-3 bg-purple-500/20 rounded-lg border border-purple-500/50 mb-3">
                <img 
                  src={selectedReference} 
                  alt="Référence" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-purple-300 text-sm font-semibold">Image de référence sélectionnée</p>
                  <p className="text-white/60 text-xs">{selectedReference}</p>
                </div>
                <button
                  onClick={() => setSelectedReference(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            )}
            
            {/* Grille d'images de référence */}
            {showReferenceSelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <p className="text-white/40 text-xs mb-3">
                  💡 Sélectionne une image pour guider le style du personnage ou de la scène
                </p>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                  {REFERENCE_IMAGES.map((img) => (
                    <button
                      key={img.path}
                      onClick={() => {
                        setSelectedReference(img.path)
                        setShowReferenceSelector(false)
                      }}
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedReference === img.path 
                          ? 'border-purple-500 ring-2 ring-purple-400' 
                          : 'border-transparent hover:border-white/30'
                      }`}
                    >
                      <img 
                        src={img.path} 
                        alt={img.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                        <span className="text-white text-[10px] leading-tight">{img.label}</span>
                      </div>
                      {img.character === currentImage.speaker.toLowerCase() && (
                        <div className="absolute top-1 right-1 bg-green-500 rounded-full w-3 h-3" title="Même personnage" />
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Filtres rapides */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="text-white/40 text-xs">Filtrer:</span>
                  {['alex', 'lieu', 'educateur', 'police'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => {
                        const match = REFERENCE_IMAGES.find(i => i.character === filter)
                        if (match) setSelectedReference(match.path)
                      }}
                      className="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20 text-white/70"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Preview de l'image actuelle */}
          {currentImage.imagePath && currentImage.status === 'done' && (
            <div className="mb-4">
              <label className="block text-white/60 text-sm mb-2">Image générée:</label>
              <img 
                src={currentImage.imagePath} 
                alt="Generated"
                className="w-full max-h-64 object-contain rounded-lg border border-white/20"
                onError={(e) => {
                  e.currentTarget.src = '/images/jeune_reflechi.webp'
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30"
            >
              ← Précédent
            </button>
            
            <button
              onClick={skipImage}
              className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30"
            >
              ⏭️ Passer (placeholder)
            </button>
            
            <button
              onClick={generateSingleImage}
              disabled={isGenerating || currentImage.status === 'done'}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {isGenerating ? '⏳ Génération...' : 
               currentImage.status === 'done' ? '✅ Déjà générée' :
               '🎨 Générer cette image'}
            </button>
            
            <button
              onClick={goNext}
              disabled={currentIndex === imageList.length - 1}
              className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Liste des images (mini) */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <h3 className="text-white font-semibold mb-3">📋 Toutes les images ({imageList.length})</h3>
        <div className="grid grid-cols-6 md:grid-cols-10 gap-2 max-h-32 overflow-y-auto">
          {imageList.map((img, idx) => (
            <button
              key={`${img.sceneKey}-${img.lineIndex}`}
              onClick={() => {
                setCurrentIndex(idx)
                setEditingPrompt(null)
              }}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                idx === currentIndex ? 'ring-2 ring-purple-400' : ''
              } ${
                img.status === 'done' ? 'bg-green-500/30 text-green-300' :
                img.status === 'error' ? 'bg-red-500/30 text-red-300' :
                'bg-white/10 text-white/60'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Actions finales */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20"
        >
          ← Retour au scénario
        </button>
        <button
          onClick={onSave}
          className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg"
        >
          💾 Sauvegarder le chapitre ({doneCount}/{imageList.length} images)
        </button>
      </div>
    </motion.div>
  )
}

// Composant pour générer les audios (ElevenLabs) une ligne à la fois
function AudioGeneratorStep({
  chapter,
  onBack,
  onUpdateChapter,
  onSave,
}: {
  chapter: Partial<Chapter>
  onBack: () => void
  onUpdateChapter: (chapter: Partial<Chapter>) => void
  onSave: () => void
}) {
  const chapterSlug = chapter.metadata?.slug || chapter.metadata?.id || 'chapter'

  const [audioList, setAudioList] = useState<Array<{
    sceneKey: string
    lineIndex: number
    speaker: string
    text: string
    emotion?: string
    status: 'pending' | 'generating' | 'done' | 'error'
    audioFile?: string | null
  }>>(() => {
    const list: any[] = []
    if (chapter.dialogue) {
      Object.entries(chapter.dialogue).forEach(([sceneKey, lines]) => {
        ;(lines as any[]).forEach((line, lineIndex) => {
          list.push({
            sceneKey,
            lineIndex,
            speaker: line.speaker,
            text: line.text,
            emotion: line.emotion,
            status: line.audioFile ? 'done' : 'pending',
            audioFile: line.audioFile ?? null,
          })
        })
      })
    }
    return list
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const currentAudio = audioList[currentIndex]
  const doneCount = audioList.filter(a => a.status === 'done').length

  const generateSingleAudio = async () => {
    if (!currentAudio || isGenerating) return
    setIsGenerating(true)

    const nextList = [...audioList]
    nextList[currentIndex].status = 'generating'
    setAudioList(nextList)

    try {
      const response = await fetch('/api/generate/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentAudio.text,
          speaker: currentAudio.speaker,
          emotion: currentAudio.emotion,
          chapterSlug,
          sceneKey: currentAudio.sceneKey,
          lineIndex: currentAudio.lineIndex,
        }),
      })

      const data = await response.json()
      const updated = [...audioList]

      if (data.success && data.audioPath) {
        updated[currentIndex].status = 'done'
        updated[currentIndex].audioFile = data.audioPath

        if (chapter.dialogue) {
          const updatedDialogue = { ...chapter.dialogue }
          const scene = updatedDialogue[currentAudio.sceneKey] as any[]
          if (scene && scene[currentAudio.lineIndex]) {
            scene[currentAudio.lineIndex].audioFile = data.audioPath
          }
          onUpdateChapter({ ...chapter, dialogue: updatedDialogue })
        }
      } else {
        updated[currentIndex].status = 'error'
      }

      setAudioList(updated)
    } catch {
      const updated = [...audioList]
      updated[currentIndex].status = 'error'
      setAudioList(updated)
    } finally {
      setIsGenerating(false)
    }
  }

  const goNext = () => {
    if (currentIndex < audioList.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const skipAudio = () => {
    const updated = [...audioList]
    updated[currentIndex].status = 'done'
    updated[currentIndex].audioFile = null
    setAudioList(updated)
    goNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">🎤 Génération des audios</h2>
          <span className="text-white/60">
            {currentIndex + 1} / {audioList.length} ({doneCount} générés)
          </span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
            style={{ width: `${audioList.length > 0 ? (doneCount / audioList.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {currentAudio && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="px-2 py-1 bg-blue-500/30 rounded text-blue-300 text-sm font-semibold">
              {currentAudio.sceneKey}
            </span>
            <span className="px-2 py-1 bg-yellow-500/30 rounded text-yellow-300 text-sm">
              {currentAudio.speaker}
            </span>
            {currentAudio.emotion && (
              <span className="px-2 py-1 bg-purple-500/30 rounded text-purple-300 text-sm">
                {currentAudio.emotion}
              </span>
            )}
            <span
              className={`ml-auto px-2 py-1 rounded text-sm font-semibold ${
                currentAudio.status === 'done'
                  ? 'bg-green-500/30 text-green-300'
                  : currentAudio.status === 'generating'
                    ? 'bg-yellow-500/30 text-yellow-300'
                    : currentAudio.status === 'error'
                      ? 'bg-red-500/30 text-red-300'
                      : 'bg-white/10 text-white/60'
              }`}
            >
              {currentAudio.status === 'done'
                ? '✅ Fait'
                : currentAudio.status === 'generating'
                  ? '⏳ En cours...'
                  : currentAudio.status === 'error'
                    ? '❌ Erreur'
                    : '⏸️ En attente'}
            </span>
          </div>

          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <p className="text-white/80 italic">"{currentAudio.text}"</p>
          </div>

          {currentAudio.audioFile && (
            <div className="mb-4">
              <label className="block text-white/60 text-sm mb-2">Audio généré:</label>
              <audio controls className="w-full">
                <source src={currentAudio.audioFile} type="audio/mpeg" />
              </audio>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30"
            >
              ← Précédent
            </button>

            <button
              onClick={skipAudio}
              className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30"
            >
              ⏭️ Passer (sans audio)
            </button>

            <button
              onClick={generateSingleAudio}
              disabled={isGenerating || currentAudio.status === 'done'}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {isGenerating
                ? '⏳ Génération...'
                : currentAudio.status === 'done'
                  ? '✅ Déjà généré'
                  : '🎤 Générer cet audio'}
            </button>

            <button
              onClick={goNext}
              disabled={currentIndex === audioList.length - 1}
              className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <h3 className="text-white font-semibold mb-3">📋 Tous les audios ({audioList.length})</h3>
        <div className="grid grid-cols-6 md:grid-cols-10 gap-2 max-h-32 overflow-y-auto">
          {audioList.map((a, idx) => (
            <button
              key={`${a.sceneKey}-${a.lineIndex}`}
              onClick={() => setCurrentIndex(idx)}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                idx === currentIndex ? 'ring-2 ring-cyan-400' : ''
              } ${
                a.status === 'done'
                  ? 'bg-green-500/30 text-green-300'
                  : a.status === 'error'
                    ? 'bg-red-500/30 text-red-300'
                    : 'bg-white/10 text-white/60'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20"
        >
          ← Retour aux images
        </button>
        <button
          onClick={onSave}
          className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg"
        >
          💾 Sauvegarder le chapitre ({doneCount}/{audioList.length} audios)
        </button>
      </div>
    </motion.div>
  )
}

