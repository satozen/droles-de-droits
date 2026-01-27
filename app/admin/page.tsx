/**
 * Dashboard Admin - Gestion des chapitres et suivi de création
 * Permet de voir, éditer et publier les chapitres générés
 */
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Chapter, ChapterSummary } from '@/types/chapter'

// Chapitres de démonstration (en attendant un vrai backend)
const DEMO_CHAPTERS: ChapterSummary[] = [
  {
    id: 'fouilles-cafouillage',
    slug: 'fouilles-cafouillage',
    title: 'Fouilles et Cafouillage',
    subtitle: 'Quand Jay propose quelque chose de louche...',
    description: 'Alex fait face à une offre de drogue et découvre ses droits lors des fouilles.',
    rightId: 9,
    rightTitle: 'Droit aux fouilles respectueuses',
    rightIcon: '🔍',
    thumbnail: '/images/jeune_offre_drogue.webp',
    estimatedDuration: 10,
    status: 'available',
    progress: 100
  },
  {
    id: 'la-fugue',
    slug: 'la-fugue',
    title: 'La Fugue',
    subtitle: 'Partir ou rester?',
    description: 'Alex envisage de fuguer et découvre son droit à un hébergement digne.',
    rightId: 8,
    rightTitle: 'Droit à l\'hébergement',
    rightIcon: '🏠',
    thumbnail: '/images/fugue_course.webp',
    estimatedDuration: 12,
    status: 'coming_soon',
    progress: 0
  }
]

// Stats de l'API
interface ApiStatus {
  scenario: { configured: boolean, model: string }
  image: { configured: boolean, model: string }
}

export default function AdminDashboard() {
  const [chapters, setChapters] = useState<ChapterSummary[]>(DEMO_CHAPTERS)
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'generate' | 'settings'>('overview')
  const [isLoading, setIsLoading] = useState(true)

  // Vérifier le status des APIs au chargement
  useEffect(() => {
    const checkApis = async () => {
      try {
        const [scenarioRes, imageRes] = await Promise.all([
          fetch('/api/generate/scenario'),
          fetch('/api/generate/image')
        ])
        
        const scenarioData = await scenarioRes.json()
        const imageData = await imageRes.json()
        
        setApiStatus({
          scenario: { 
            configured: scenarioData.apiConfigured, 
            model: scenarioData.model || 'Claude Sonnet 4.5' 
          },
          image: { 
            configured: imageData.apiConfigured, 
            model: imageData.model || 'Nano Banana Pro' 
          }
        })
      } catch (err) {
        console.error('Erreur vérification APIs:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkApis()
  }, [])

  // Stats globales
  const stats = {
    totalChapters: chapters.length,
    published: chapters.filter(c => c.status === 'available').length,
    inProgress: chapters.filter(c => c.status === 'coming_soon').length,
    totalRights: 12,
    coveredRights: new Set(chapters.filter(c => c.status === 'available').map(c => c.rightId)).size
  }

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              ← Site
            </Link>
            <h1 className="text-xl font-bold text-white">🎮 Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Status APIs */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1.5">
              <span className="text-xs text-gray-400">Claude:</span>
              <span className={`w-2 h-2 rounded-full ${apiStatus?.scenario.configured ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-400 ml-2">Nano:</span>
              <span className={`w-2 h-2 rounded-full ${apiStatus?.image.configured ? 'bg-green-500' : 'bg-yellow-500'}`} />
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            {[
              { id: 'overview', label: '📊 Vue d\'ensemble', icon: '📊' },
              { id: 'chapters', label: '📚 Chapitres', icon: '📚' },
              { id: 'generate', label: '✨ Générer', icon: '✨' },
              { id: 'settings', label: '⚙️ Paramètres', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-purple-500'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="text-3xl font-bold text-white">{stats.totalChapters}</div>
                <div className="text-gray-400 text-sm">Chapitres total</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="text-3xl font-bold text-green-400">{stats.published}</div>
                <div className="text-gray-400 text-sm">Publiés</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="text-3xl font-bold text-yellow-400">{stats.inProgress}</div>
                <div className="text-gray-400 text-sm">En développement</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="text-3xl font-bold text-purple-400">{stats.coveredRights}/12</div>
                <div className="text-gray-400 text-sm">Droits couverts</div>
              </div>
            </div>

            {/* Status des APIs */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-bold text-white mb-4">🔌 Status des APIs</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${apiStatus?.scenario.configured ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${apiStatus?.scenario.configured ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="text-white font-semibold">Claude Sonnet 4.5</div>
                      <div className="text-sm text-gray-400">Génération de scénarios</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {apiStatus?.scenario.configured ? '✅ Configuré et prêt' : '❌ ANTHROPIC_API_KEY manquante'}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${apiStatus?.image.configured ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${apiStatus?.image.configured ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div>
                      <div className="text-white font-semibold">Nano Banana Pro</div>
                      <div className="text-sm text-gray-400">Génération d'images</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {apiStatus?.image.configured ? '✅ Configuré et prêt' : '⚠️ GEMINI_API_KEY manquante (placeholders utilisés)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Progression des 12 droits */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-bold text-white mb-4">📋 Couverture des 12 Droits</h2>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {[...Array(12)].map((_, i) => {
                  const rightId = i + 1
                  const chapter = chapters.find(c => c.rightId === rightId)
                  const status = chapter?.status || 'locked'
                  
                  return (
                    <div
                      key={rightId}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 border-2 transition-all ${
                        status === 'available' 
                          ? 'bg-green-500/20 border-green-500 text-green-400' 
                          : status === 'coming_soon'
                          ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                          : 'bg-gray-800 border-gray-700 text-gray-500'
                      }`}
                    >
                      <span className="text-2xl mb-1">
                        {status === 'available' ? '✅' : status === 'coming_soon' ? '🔨' : '🔒'}
                      </span>
                      <span className="text-xs font-bold">Droit #{rightId}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/admin/studio" className="block">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-500/20 transition-all">
                  <h3 className="text-xl font-bold text-white mb-2">🎨 Studio d'images</h3>
                  <p className="text-white/70">Créer des images avec Nano Banana Pro</p>
                </div>
              </Link>
              
              <Link href="/admin/generer" className="block">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                  <h3 className="text-xl font-bold text-white mb-2">✨ Créer un chapitre</h3>
                  <p className="text-white/70">Générer un scénario et des images</p>
                </div>
              </Link>
              
              <Link href="/centre-jeunesse" className="block">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                  <h3 className="text-xl font-bold text-white mb-2">🎮 Tester le jeu</h3>
                  <p className="text-white/70">Joue à "Fouilles et Cafouillage"</p>
                </div>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Liste des chapitres */}
        {activeTab === 'chapters' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">📚 Tous les chapitres</h2>
              <Link
                href="/admin/generer"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-500 transition-colors"
              >
                + Nouveau chapitre
              </Link>
            </div>

            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
                >
                  <div className="flex">
                    {/* Thumbnail */}
                    <div className="w-48 h-32 flex-shrink-0 bg-gray-800">
                      <img
                        src={chapter.thumbnail}
                        alt={chapter.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/jeune_reflechi.webp'
                        }}
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              chapter.status === 'available' 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {chapter.status === 'available' ? 'Publié' : 'En développement'}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {chapter.rightIcon} Droit #{chapter.rightId}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white">{chapter.title}</h3>
                          <p className="text-gray-400 text-sm mt-1">{chapter.description}</p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          {chapter.status === 'available' ? (
                            <Link
                              href={`/chapitre/${chapter.slug}`}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-500"
                            >
                              ▶ Jouer
                            </Link>
                          ) : (
                            <Link
                              href="/admin/generer"
                              className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-500"
                            >
                              ✨ Générer
                            </Link>
                          )}
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progression</span>
                          <span>{chapter.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              chapter.progress === 100 ? 'bg-green-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${chapter.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Onglet Générer - Redirect */}
        {activeTab === 'generate' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <h2 className="text-2xl font-bold text-white mb-4">✨ Générateur de Chapitres</h2>
            <p className="text-gray-400 mb-8">Crée de nouveaux chapitres avec l'aide de l'IA</p>
            <Link
              href="/admin/generer"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Ouvrir le générateur →
            </Link>
          </motion.div>
        )}

        {/* Paramètres */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-white">⚙️ Paramètres</h2>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">🔑 Clés API</h3>
              <p className="text-gray-400 text-sm mb-4">
                Les clés API sont configurées dans le fichier <code className="text-purple-400">.env.local</code>
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <div className="text-white font-medium">ANTHROPIC_API_KEY</div>
                    <div className="text-gray-500 text-xs">Pour Claude Sonnet 4.5</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    apiStatus?.scenario.configured ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {apiStatus?.scenario.configured ? 'Configurée' : 'Manquante'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <div className="text-white font-medium">GEMINI_API_KEY</div>
                    <div className="text-gray-500 text-xs">Pour Nano Banana Pro (images)</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    apiStatus?.image.configured ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {apiStatus?.image.configured ? 'Configurée' : 'Optionnelle'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">📁 Structure des fichiers</h3>
              <pre className="text-sm text-gray-400 bg-gray-800 p-4 rounded-lg overflow-x-auto">
{`data/
  chapters/
    la-fugue.json        # Chapitres générés
    fouilles-cafouillage.json

public/
  images/
    chapitres/
      generated/         # Images générées par Nano Banana
      la-fugue/          # Images par chapitre

  audio/
    alex/                # Voice-overs Alex
    karim/               # Voice-overs autres personnages`}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}

