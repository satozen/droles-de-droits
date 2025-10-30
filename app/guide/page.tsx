// Guide de référence imprimable des 12 droits
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { droits } from '@/data/droits'

export default function GuidePage() {
  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    // Pour l'instant, utilise la fonction d'impression du navigateur
    // qui permet de sauvegarder en PDF
    window.print()
  }

  return (
    <>
      {/* Boutons d'action - cachés à l'impression */}
      <div className="print:hidden min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link href="/">
            <button className="text-gray-700 hover:text-gray-900 font-semibold mb-4">
              ← Retour
            </button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Guide de référence
            </h1>
            <p className="text-gray-700 mb-6">
              Télécharge ou imprime ce guide pour avoir tes 12 droits toujours à portée de main!
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                📄 Télécharger (PDF)
              </button>
              <button
                onClick={handlePrint}
                className="bg-white border-2 border-purple-400 text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all flex items-center gap-2"
              >
                🖨️ Imprimer
              </button>
            </div>
            
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-gray-700">
                <strong>💡 Astuce :</strong> Sur mobile, clique sur "Télécharger (PDF)" puis sélectionne "Sauvegarder en tant que PDF" pour garder une copie sur ton téléphone!
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contenu imprimable */}
      <div className="print:block hidden print:m-0">
        <div className="max-w-4xl mx-auto p-8">
          {/* En-tête du document */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              MES 12 DROITS
            </h1>
            <p className="text-xl text-gray-700 mb-2">
              En tant qu'usager·ère du système de santé québécois
            </p>
            <p className="text-sm text-gray-600">
              Source : Loi sur les services de santé et les services sociaux
            </p>
          </div>

          {/* Les 12 droits */}
          <div className="space-y-6">
            {droits.map((droit) => (
              <div
                key={droit.id}
                className="border-2 border-gray-200 rounded-lg p-4 break-inside-avoid"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl">{droit.icone}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {droit.id}. {droit.titre}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-12">
                  {droit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer du document */}
          <div className="mt-8 pt-6 border-t-2 border-gray-300 text-center">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Besoin d'aide?</strong>
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
              <div>
                <strong>Tel-Jeunes (24/7)</strong><br />
                📞 1 800 263-2266<br />
                💬 TEXTO: 514 600-1002
              </div>
              <div>
                <strong>Info-Santé</strong><br />
                📞 811
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Pour plus d'informations : drolesde droits.ca
            </p>
          </div>
        </div>
      </div>

      {/* Aperçu du document (non imprimable) */}
      <div className="print:hidden container mx-auto px-4 pb-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Aperçu du document</h2>
          
          <div className="space-y-4 border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
            {droits.map((droit) => (
              <motion.div
                key={droit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: droit.id * 0.05 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{droit.icone}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {droit.id}. {droit.titre}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {droit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              📄 Télécharger maintenant
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

