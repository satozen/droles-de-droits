// Page À Propos - Mission et genèse du projet Drôles de Droits
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* En-tête Hero avec photo spectacle en fond */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative overflow-hidden rounded-3xl"
        >
          {/* Photo spectacle en filigrane */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/j'ai ben l'droit.png" 
              alt="Le spectacle J'ai ben l'droit"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 35%' }}
            />
            {/* Filtre de couleur violet-rose */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 mix-blend-multiply"></div>
            {/* Gradients de luminosité */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/50 to-white/70"></div>
          </div>

          {/* Contenu du titre */}
          <div className="relative z-10 py-16">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Du Show au Jeu
            </motion.h1>
            <p className="text-2xl text-gray-500 font-light">
              La Genèse de Drôles de droits
            </p>
          </div>
        </motion.div>

        {/* Section Créateur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-24"
        >
          <div className="flex flex-col md:flex-row gap-12 items-center max-w-4xl mx-auto">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl blur-2xl opacity-20"></div>
                <img 
                  src="/images/Casting_2024_dominic.png" 
                  alt="Dominic St-Laurent"
                  className="relative w-64 h-64 object-cover rounded-2xl shadow-2xl"
                  style={{ objectPosition: 'center 65%' }}
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Dominic St-Laurent
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Comédien, chanteur et humoriste, Dominic a présenté son spectacle-conférence 
                <strong className="text-gray-900"> « J'ai ben l'droit! »</strong> partout au Québec et même jusqu'au Yukon. 
                Avec passion et dévouement, il sensibilise les jeunes à leurs droits fondamentaux 
                à travers des dizaines d'organismes et de Centres Jeunesse.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto space-y-20">
          
          {/* Introduction */}
          <section>
            <p className="text-xl text-gray-700 leading-relaxed">
              Depuis des années, je présente mon spectacle-conférence <strong className="text-gray-900">« J'ai ben l'droit! »</strong> dans des dizaines d'organismes, notamment en Centres Jeunesse. Le spectacle sensibilise, décloisonne et inspire. Mais une question s'est imposée : <strong className="text-gray-900">« Et si on pouvait prolonger cet élan? »</strong>
            </p>
          </section>

          {/* Section Le Problème */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Le Problème
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Trop de jeunes en centre jeunesse ne connaissent pas leurs droits fondamentaux. <strong className="text-gray-900">Vous vous réinventez constamment pour accrocher vos jeunes</strong>, vous essayez différentes approches avec dévouement. Mais force est de constater que les méthodes traditionnelles, malgré tous vos efforts, ne donnent pas toujours les résultats espérés :
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-gray-300 pl-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">📹 Vidéos éducatives</p>
                <p className="text-gray-600">Visionnement passif, souvent oublié après</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">📚 Livres & Pamphlets</p>
                <p className="text-gray-600">Rarement lus, jamais retenus en situation de stress</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">🎓 Formations statiques</p>
                <p className="text-gray-600">Une seule fois, aucune répétition possible</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">📖 Approches théoriques</p>
                <p className="text-gray-600">Aucune mise en situation concrète</p>
              </div>
            </div>
          </section>

          {/* Section Solution */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Notre Approche : L'Apprentissage Actif
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              <strong className="text-gray-900">« Drôles de Droits »</strong> prolonge l'éveil créé par le spectacle avec une approche radicalement différente. Au lieu de <em>parler</em> des droits, on les <em>vit</em>.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border-l-4 border-purple-500 pl-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">🎮 Engageant</p>
                <p className="text-gray-600">Les jeunes JOUENT et participent activement, pas juste écoutent</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">🔄 Répétable</p>
                <p className="text-gray-600">On peut rejouer, essayer d'autres choix, pratiquer à volonté</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">💪 Pratique</p>
                <p className="text-gray-600">Scénarios réalistes avec conséquences, comme dans la vraie vie</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">🛡️ Sécuritaire</p>
                <p className="text-gray-600">Apprendre par l'essai-erreur sans risque, sans jargon, sans jugement</p>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-900 p-6 rounded-r-lg">
              <p className="text-lg text-gray-700">
                <strong className="text-gray-900">Résultat :</strong> Les jeunes retiennent leurs droits parce qu'ils les ont <em>expérimentés</em>, pas seulement entendus.
              </p>
            </div>
          </section>

          {/* Section État actuel */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Où en sommes-nous?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Cette démo présente <strong className="text-gray-900">1 scénario complet</strong> (Fouilles et Cafouillage) pour valider l'approche. La version complète couvrira les <strong className="text-gray-900">12 droits</strong> avec 18+ situations interactives.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              <strong className="text-gray-900">Vision :</strong> Application accessible 24/7 pour les jeunes en centre jeunesse, avec tableau de bord pour intervenants et adaptation possible pour hôpitaux et CLSC.
            </p>

            {/* Carte Preview Fouilles et Cafouillage - Style BD */}
            <div className="mt-8">
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
            </section>

          {/* Section Partenaires */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Partenaires Recherchés
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Pour les <strong className="text-gray-900">Comités des Usagers</strong>, les <strong className="text-gray-900">CAAPs</strong> (Centres d'Assistance et d'Accompagnement aux Plaintes), les <strong className="text-gray-900">CIUSSS</strong>, les <strong className="text-gray-900">Centres Jeunesse</strong> et les <strong className="text-gray-900">Fondations</strong> : nous recherchons des partenaires pour co-développer la version complète et déployer cet outil à grande échelle.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Les premiers partenaires bénéficieront du statut de <strong className="text-gray-900">"Partenaire Fondateur"</strong> avec reconnaissance permanente et participation au développement.
            </p>
          </section>

        </div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-32 mb-16 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Vous voyez un potentiel?
            </h3>
            <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
              Collaborons ensemble pour faire une différence dans la vie des jeunes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/centre-jeunesse">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
                  Essayer la démo
                </button>
              </Link>
              <a href="mailto:dstl.st.laurent@gmail.com" className="bg-transparent border-3 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all hover:scale-105">
                Nous contacter
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
