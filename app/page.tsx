// Page d'accueil - hero et appel à l'action principal
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
              Découvre tes 12 droits en tant qu'usager·ère du système de santé
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 mb-8"
            >
              À travers 12 scénarios interactifs, apprends tes droits et comment les faire respecter
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
                <div className="text-3xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">Scénarios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">~10</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
            </motion.div>

            <Link href="/jeu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                Commencer l'aventure 🎮
              </motion.button>
            </Link>
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
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster="/images/hero image.png"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
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
