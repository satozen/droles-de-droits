// Page À Propos - Mission et genèse du projet Drôles de Droits
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* En-tête */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Du Show au Jeu
            </motion.h1>
            <p className="text-xl text-gray-600">
              La Genèse de « J'ai ben l'droit! » 🎮
            </p>
          </div>

          {/* Contenu */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Depuis des années, je présente mon spectacle-conférence <strong>« J'ai ben l'droit! »</strong> dans des dizaines d'organismes, notamment en Centres Jeunesse. Le spectacle sensibilise, décloisonne et inspire. Mais une question s'est imposée : <strong>« Et si on pouvait prolonger cet élan? »</strong>
            </p>

            {/* Section Le Problème */}
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Le Problème
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Trop de jeunes en centre jeunesse ne connaissent pas leurs droits fondamentaux. <strong>Vous vous réinventez constamment pour accrocher vos jeunes</strong>, vous essayez différentes approches avec dévouement. Mais force est de constater que les méthodes traditionnelles, malgré tous vos efforts, ne donnent pas toujours les résultats espérés :
              </p>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-white border-2 border-red-300 rounded-lg p-3">
                  <p className="text-red-700 font-bold mb-1">📹 Vidéos éducatives</p>
                  <p className="text-sm text-gray-600">Visionnement passif, souvent oublié après</p>
                </div>
                <div className="bg-white border-2 border-red-300 rounded-lg p-3">
                  <p className="text-red-700 font-bold mb-1">📚 Livres & Pamphlets</p>
                  <p className="text-sm text-gray-600">Rarement lus, jamais retenus en situation de stress</p>
                </div>
                <div className="bg-white border-2 border-red-300 rounded-lg p-3">
                  <p className="text-red-700 font-bold mb-1">🎓 Formations statiques</p>
                  <p className="text-sm text-gray-600">Une seule fois, aucune répétition possible</p>
                </div>
                <div className="bg-white border-2 border-red-300 rounded-lg p-3">
                  <p className="text-red-700 font-bold mb-1">📖 Approches théoriques</p>
                  <p className="text-sm text-gray-600">Aucune mise en situation concrète</p>
                </div>
              </div>
            </div>

            {/* Section Solution */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Notre Approche : L'Apprentissage Actif
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>« Drôles de Droits »</strong> prolonge l'éveil créé par le spectacle avec une approche radicalement différente. Au lieu de <em>parler</em> des droits, on les <em>vit</em>.
              </p>
              
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3">
                  <p className="text-green-800 font-bold mb-1">🎮 Engageant</p>
                  <p className="text-sm text-gray-700">Les jeunes JOUENT et participent activement, pas juste écoutent</p>
                </div>
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3">
                  <p className="text-green-800 font-bold mb-1">🔄 Répétable</p>
                  <p className="text-sm text-gray-700">On peut rejouer, essayer d'autres choix, pratiquer à volonté</p>
                </div>
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3">
                  <p className="text-green-800 font-bold mb-1">💪 Pratique</p>
                  <p className="text-sm text-gray-700">Scénarios réalistes avec conséquences, comme dans la vraie vie</p>
                </div>
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3">
                  <p className="text-green-800 font-bold mb-1">🛡️ Sécuritaire</p>
                  <p className="text-sm text-gray-700">Apprendre par l'essai-erreur sans risque, sans jargon, sans jugement</p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed bg-purple-100 border-l-4 border-purple-600 p-4 rounded-r">
                <strong>Résultat :</strong> Les jeunes retiennent leurs droits parce qu'ils les ont <em>expérimentés</em>, pas seulement entendus.
              </p>
            </div>

            {/* Section État actuel */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Où en sommes-nous?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cette démo présente <strong>1 scénario complet</strong> (Fouilles et Cafouillage) pour valider l'approche. La version complète couvrira les <strong>12 droits</strong> avec 18+ situations interactives.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>Vision :</strong> Application accessible 24/7 pour les jeunes en centre jeunesse, avec tableau de bord pour intervenants et adaptation possible pour hôpitaux et CLSC.
              </p>

              {/* Carte Preview Fouilles et Cafouillage - Style BD */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  🎮 Essayez la démo maintenant
                </h3>
                <Link href="/centre-jeunesse">
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: -0.5 }}
                    className="relative border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer overflow-hidden bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    {/* Titre en haut */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 border-b-4 border-black">
                      <h3 className="font-black text-2xl md:text-3xl text-white text-center" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                        FOUILLES ET CAFOUILLAGE
                      </h3>
                      <div className="absolute top-3 right-3">
                        <span className="text-xs bg-lime-400 border-2 border-black px-2 py-1 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">DISPONIBLE</span>
                      </div>
                    </div>

                    {/* Grille d'images style BD */}
                    <div className="grid grid-cols-2 gap-0">
                      {/* Image 1 - L'offre */}
                      <div className="relative border-r-2 border-b-2 border-black h-48 overflow-hidden group">
                        <img 
                          src="/images/jeune_offre_drogue.jpg" 
                          alt="L'offre"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-red-500 border-t-2 border-black p-1.5">
                          <p className="text-xs font-black text-white text-center">L'OFFRE</p>
                        </div>
                      </div>

                      {/* Image 2 - La fouille */}
                      <div className="relative border-b-2 border-black h-48 overflow-hidden group">
                        <img 
                          src="/images/police_centre_jeunesse.jpg" 
                          alt="La fouille"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-orange-500 border-t-2 border-black p-1.5">
                          <p className="text-xs font-black text-white text-center">LA FOUILLE</p>
                        </div>
                      </div>

                      {/* Image 3 - L'intervenante */}
                      <div className="relative border-r-2 border-black h-48 overflow-hidden group">
                        <img 
                          src="/images/intervenante_arrive_lieu_echange_drogues.jpg" 
                          alt="L'intervenante"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-purple-600 border-t-2 border-black p-1.5">
                          <p className="text-xs font-black text-white text-center">L'INTERVENANTE</p>
                        </div>
                      </div>

                      {/* Image 4 - Tes choix */}
                      <div className="relative h-48 overflow-hidden group">
                        <img 
                          src="/images/jeune_reflechi.jpg" 
                          alt="Tes choix"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-green-600 border-t-2 border-black p-1.5">
                          <p className="text-xs font-black text-white text-center">TES CHOIX</p>
                        </div>
                      </div>
                    </div>

                    {/* Bas avec description */}
                    <div className="bg-yellow-300 border-t-4 border-black p-3">
                      <p className="text-sm text-black font-bold text-center mb-1">
                        🔍 Le droit au respect lors d'une fouille
                      </p>
                      <p className="text-xs text-black font-semibold text-center">
                        Découvre tes droits dans une situation concrète
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Section Partenaires */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 border-l-4 border-orange-500 p-6 rounded-r-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Partenaires Recherchés
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour les <strong>Comités des Usagers</strong>, les <strong>CAAPs</strong> (Centres d'Assistance et d'Accompagnement aux Plaintes), les <strong>CIUSSS</strong>, les <strong>Centres Jeunesse</strong> et les <strong>Fondations</strong> : nous recherchons des partenaires pour co-développer la version complète et déployer cet outil à grande échelle.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Les premiers partenaires bénéficieront du statut de <strong>"Partenaire Fondateur"</strong> avec reconnaissance permanente et participation au développement.
              </p>
            </div>

            {/* CTA Final */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 text-center mt-8">
              <h3 className="text-2xl font-bold mb-4">
                Vous voyez un potentiel?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Collaborons ensemble pour faire une différence dans la vie des jeunes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/centre-jeunesse">
                  <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                    Essayer la démo
                  </button>
                </Link>
                <a href="mailto:dstl.st.laurent@gmail.com" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
