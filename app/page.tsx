// Page d'accueil - hero et appel à l'action principal
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Banner Démo */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white py-3 px-4 text-center shadow-lg">
        <p className="text-sm md:text-base font-bold">
          🚧 VERSION DÉMO PROTOTYPE | Cette démo présente une fraction du projet complet.{' '}
          <Link href="/a-propos" className="underline hover:text-yellow-100 transition-colors">
            → Découvrez la vision complète
          </Link>
        </p>
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto min-h-[calc(100vh-12rem)]">
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
              className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide"
            >
              DRÔLES DE DROITS
            </motion.h1>
            <p className="text-2xl text-gray-700 mb-6">
              Découvre tes 12 droits en tant qu'usager du système de santé
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 mb-8 max-w-2xl"
            >
              Que tu sois en centre jeunesse, à l'hôpital ou dans un CLSC, tu as des droits. 
              À travers des scénarios interactifs, apprends à les connaître et à les faire respecter. 
              Connaître tes droits, c'est avoir du pouvoir.
            </motion.p>
            
            {/* Stats rapides */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-6 justify-center md:justify-start mb-8 flex-wrap"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">12</div>
                <div className="text-sm text-gray-600">Droits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">18</div>
                <div className="text-sm text-gray-600">Scénarios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">~15</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
            </motion.div>

            {/* Boutons d'action principaux */}
            <div className="flex gap-4 justify-center md:justify-start flex-wrap">
              <Link href="/jeu">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  Commencer l'aventure 🎮
                </motion.button>
              </Link>
              {/* Mode RPG - En développement - Désactivé pour la démo
              <Link href="/rpg">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  Mode Aventure RPG 🎭
                </motion.button>
              </Link>
              */}
              <Link href="/centre-jeunesse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-10 py-5 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow border-4 border-black"
                >
                  Fouilles et Cafouillage 💊
                </motion.button>
              </Link>
              <Link href="/videoclip">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-10 py-5 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow border-4 border-black"
                >
                  Video Clip Rap 🎵
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
              <img
                src="/images/hero_mauve_couleurs.png"
                alt="Jeune avec son chien devant le centre jeunesse"
                className="absolute inset-0 w-full h-full object-cover"
              />
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
