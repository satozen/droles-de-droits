// Page Ressources & Contacts - Informations cruciales pour les jeunes
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function RessourcesPage() {
  const urgences = [
    {
      nom: "Tel-Jeunes",
      numero: "1 800 263-2266",
      description: "Service gratuit et confidentiel 24/7 pour les jeunes",
      texte: "TEXTO: 514 600-1002",
      icone: "📞"
    },
    {
      nom: "Jeunesse, J'écoute",
      numero: "1 800 668-6868",
      description: "Counseling et soutien pour les jeunes",
      texte: "TEXTO: 686868",
      icone: "💬"
    },
    {
      nom: "Ligne Parents",
      numero: "1 800 361-5085",
      description: "Pour les parents et les proches",
      icone: "👨‍👩‍👧"
    },
    {
      nom: "Info-Santé 811",
      numero: "811",
      description: "Conseils de santé 24/7 avec une infirmière",
      icone: "🏥"
    },
    {
      nom: "Urgence",
      numero: "911",
      description: "Situation d'urgence médicale ou danger immédiat",
      icone: "🚨"
    }
  ]

  const organismes = [
    {
      nom: "Numéro ton comité des usagers",
      description: "Trouve le comité des usagers de ton établissement de santé",
      site: "https://www.quebec.ca/sante/systeme-et-services-de-sante/organisation-des-services/comites-des-usagers-et-comites-de-residents",
      icone: "📞"
    },
    {
      nom: "Commission des droits de la personne",
      description: "Pour les cas de discrimination",
      site: "https://www.cdpdj.qc.ca",
      icone: "🛡️"
    },
    {
      nom: "DPJ - Directeur de la protection de la jeunesse",
      description: "Pour signaler une situation préoccupante",
      numero: "1 800 361-8665",
      icone: "👶"
    },
    {
      nom: "Curateur public",
      description: "Protection des droits des personnes inaptes",
      site: "https://www.curateur.gouv.qc.ca",
      icone: "📋"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <button className="text-gray-700 hover:text-gray-900 font-semibold mb-4">
              ← Retour
            </button>
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Ressources & Contacts
          </motion.h1>
          <p className="text-lg text-gray-700">
            Tu n'es pas seul·e. Voici des ressources pour t'aider.
          </p>
        </div>

        {/* Urgences - Section importante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center gap-2">
              <span className="text-3xl">🚨</span>
              Besoin d'aide immédiate?
            </h2>
            <p className="text-gray-700">
              Si tu es en danger ou en détresse, contacte ces services 24/7 :
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {urgences.map((urgence, index) => (
              <motion.div
                key={urgence.nom}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-red-200"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{urgence.icone}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {urgence.nom}
                    </h3>
                    <a
                      href={`tel:${urgence.numero.replace(/\s/g, '')}`}
                      className="text-2xl font-bold text-red-600 hover:text-red-700 block mb-2"
                    >
                      {urgence.numero}
                    </a>
                    {urgence.texte && (
                      <p className="text-sm font-semibold text-purple-600 mb-2">
                        {urgence.texte}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">{urgence.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Porter plainte - Guide étape par étape */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">📢</span>
            Comment porter plainte?
          </h2>
          <p className="text-gray-700 mb-6">
            Si un de tes droits n'a pas été respecté, voici les étapes :
          </p>
          
          <div className="space-y-4">
            {[
              {
                num: 1,
                titre: "Note les faits",
                desc: "Quoi, quand, où, qui était là? Garde des preuves si possible."
              },
              {
                num: 2,
                titre: "Parles-en d'abord au personnel",
                desc: "Souvent, une discussion peut résoudre la situation."
              },
              {
                num: 3,
                titre: "Contacte ton comité des usagers",
                desc: "Chaque établissement a un comité des usagers. C'est gratuit et confidentiel."
              },
              {
                num: 4,
                titre: "Fais-toi accompagner",
                desc: "Tu as le droit d'être accompagné par quelqu'un de confiance."
              }
            ].map((etape) => (
              <div key={etape.num} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                  {etape.num}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{etape.titre}</h4>
                  <p className="text-sm text-gray-600">{etape.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Organismes officiels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Organismes officiels
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {organismes.map((org, index) => (
              <motion.div
                key={org.nom}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{org.icone}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {org.nom}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{org.description}</p>
                {org.numero && (
                  <a
                    href={`tel:${org.numero.replace(/\s/g, '')}`}
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm block mb-2"
                  >
                    📞 {org.numero}
                  </a>
                )}
                {org.site && (
                  <a
                    href={org.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-1"
                  >
                    🌐 Visiter le site →
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">
            Rappelle-toi : connaître tes droits, c'est pouvoir
          </h3>
          <p className="mb-6 opacity-90">
            N'hésite jamais à demander de l'aide. C'est ton droit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jeu">
              <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Rejouer au jeu
              </button>
            </Link>
            <Link href="/assistant">
              <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                Poser une question
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

