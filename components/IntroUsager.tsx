// Introduction ludique au concept d'usager - Premier écran du jeu
'use client'

import { motion } from 'framer-motion'

interface IntroUsagerProps {
  onComplete: () => void
}

export default function IntroUsager({ onComplete }: IntroUsagerProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-6 md:p-10 relative my-8"
      >
        {/* Éléments décoratifs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl" />

        <div className="relative z-10">
          {/* Titre principal */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Savais-tu que tu es un usager?
            </h1>
            <p className="text-lg text-gray-600">
              (Non, on ne parle pas des vieilles affaires usées!)
            </p>
          </motion.div>

          {/* Illustration humoristique */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="flex justify-center gap-4 md:gap-8 mb-6"
          >
            {/* Usagé (vieille affaire) */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-2xl p-4 mb-2 relative">
                <div className="text-5xl md:text-6xl">🛋️</div>
                <div className="absolute top-1 right-1 text-3xl rotate-12">❌</div>
              </div>
              <p className="font-bold text-gray-700 text-sm md:text-base">Usagé</p>
              <p className="text-xs text-gray-500">Vieux sofa sur Marketplace</p>
            </div>

            {/* VS */}
            <div className="flex items-center text-2xl md:text-3xl font-bold text-purple-600">
              ≠
            </div>

            {/* Usager (système de santé) */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-4 mb-2 relative">
                <div className="text-5xl md:text-6xl">🏥</div>
                <div className="absolute top-1 right-1 text-3xl">✓</div>
              </div>
              <p className="font-bold text-gray-700 text-sm md:text-base">Usager</p>
              <p className="text-xs text-gray-500">Toi dans le système!</p>
            </div>
          </motion.div>

          {/* Explication */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mb-6 border-2 border-purple-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              C'est quoi un usager?
            </h2>
            <div className="space-y-2 text-gray-700 leading-relaxed text-sm md:text-base">
              <p>
                <strong>Un usager</strong>, c'est simplement une personne qui utilise les services de santé et sociaux. 
              </p>
              <p>
                Que tu consultes un médecin, un psychologue, que tu sois en centre jeunesse ou à l'hôpital... 
                <strong className="text-purple-700"> tu es un usager!</strong>
              </p>
              <p className="bg-white rounded-lg p-3 border-l-4 border-purple-500">
                <strong>Et devines quoi?</strong> En tant qu'usager, tu as des droits. 
                <strong className="text-purple-700"> 12 droits</strong> pour être exact. 
                C'est ce que tu vas découvrir dans ce jeu!
              </p>
            </div>
          </motion.div>

          {/* Points clés */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-2xl md:text-3xl mb-1">🎯</div>
              <p className="font-semibold text-gray-800 text-sm">12 droits</p>
              <p className="text-xs text-gray-600">à découvrir</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <div className="text-2xl md:text-3xl mb-1">🎮</div>
              <p className="font-semibold text-gray-800 text-sm">12 scénarios</p>
              <p className="text-xs text-gray-600">interactifs</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-3 text-center">
              <div className="text-2xl md:text-3xl mb-1">⏱️</div>
              <p className="font-semibold text-gray-800 text-sm">~10 minutes</p>
              <p className="text-xs text-gray-600">de plaisir</p>
            </div>
          </motion.div>

          {/* Bouton commencer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <button
              onClick={onComplete}
              className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              J'ai compris! Let's go! 🚀
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Prêt·e à découvrir tes droits?
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

