// Page En Développement - Affichée pour les fonctionnalités à venir
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function EnDeveloppementPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center"
      >
        {/* Icône */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-8xl mb-6"
        >
          🚧
        </motion.div>

        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          En développement
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-700 mb-6"
        >
          Cette section sera bientôt disponible !
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-8"
        >
          <p className="text-gray-700 mb-4">
            🎮 <strong>Version démo :</strong> Pour l'instant, seuls les <strong>droits 1, 2 et 3</strong> sont disponibles dans le jeu.
          </p>
          <p className="text-gray-600 text-sm">
            Les droits 4 à 12 seront ajoutés dans les prochaines mises à jour. Merci de votre patience !
          </p>
        </motion.div>

        {/* Boutons d'action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/jeu">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              ← Retour au jeu
            </motion.button>
          </Link>
          
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Accueil
            </motion.button>
          </Link>
        </motion.div>

        {/* Message encourageant */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-sm text-gray-500"
        >
          En attendant, découvre <Link href="/centre-jeunesse" className="text-purple-600 font-semibold hover:underline">Fouilles et Cafouillage</Link> ou écoute le <Link href="/videoclip" className="text-purple-600 font-semibold hover:underline">Bonus Musical</Link> !
        </motion.p>
      </motion.div>
    </main>
  )
}

