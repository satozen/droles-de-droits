// Page d'accueil - hero avec vidéo
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Banner Démo */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white py-2 sm:py-3 px-3 sm:px-4 text-center shadow-lg">
        <p className="text-xs sm:text-sm md:text-base font-bold">
          🚧 VERSION DÉMO PROTOTYPE | Cette démo présente une fraction du projet complet.{' '}
          <Link href="/a-propos" className="underline hover:text-yellow-100 transition-colors">
            → Découvrez la vision complète
          </Link>
        </p>
      </div>
      
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-16">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto min-h-[calc(100vh-12rem)]">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              whileHover={{ rotate: [0, -2, 2, -1, 1, 0], transition: { duration: 0.8 } }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide"
            >
              DRÔLES DE DROITS
            </motion.h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-4 md:mb-6">
              Un jeu pour sensibiliser les jeunes à leurs 12 droits d'usagers
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl"
            >
              Une plateforme interactive qui permet aux jeunes en centre jeunesse de découvrir leurs droits à travers des scénarios engageants qui leur ressemblent. 
              Un outil pédagogique qui transforme l'apprentissage passif des droits en expérience captivante.
            </motion.p>
            
            {/* Stats rapides */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 sm:gap-6 justify-center md:justify-start mb-6 md:mb-8 flex-wrap"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">12</div>
                <div className="text-xs sm:text-sm text-gray-600">Droits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">18</div>
                <div className="text-xs sm:text-sm text-gray-600">Scénarios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-pink-600">~15</div>
                <div className="text-xs sm:text-sm text-gray-600">Minutes</div>
              </div>
            </motion.div>

            {/* Boutons d'action principaux */}
            <div className="flex flex-col gap-3 md:gap-4 justify-center md:justify-start">
              <Link href="/centre-jeunesse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full md:w-auto bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-3 rounded-xl text-base sm:text-lg md:text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow border-4 border-black whitespace-nowrap"
                >
                  Démarrer l'aventure 🎮
                </motion.button>
              </Link>
              <Link href="/jeu">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-3 rounded-xl text-base sm:text-lg md:text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap"
                >
                  Quiz Interactif 📝
                </motion.button>
              </Link>
              <Link href="/videoclip">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-3 rounded-xl text-base sm:text-lg md:text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow border-4 border-black whitespace-nowrap"
                >
                  Bonus Musical 🎵
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Vidéo hero */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: 'center bottom'
                }}
                onError={(e) => {
                  // Fallback vers l'image si la vidéo ne charge pas
                  const target = e.target as HTMLVideoElement
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = '<img src="/images/hero_centre_jeunesse_sourire.webp" alt="Jeune avec son chien devant le centre jeunesse" class="absolute inset-0 w-full h-full object-cover" />'
                  }
                }}
              >
                <source src="/videos/hero_video.mp4" type="video/mp4" />
                {/* Fallback si vidéo non supportée */}
                <img 
                  src="/images/hero_centre_jeunesse_sourire.webp" 
                  alt="Jeune avec son chien devant le centre jeunesse"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </video>
            </div>
            {/* Éléments décoratifs */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-50 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-50 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </main>
  )
}
