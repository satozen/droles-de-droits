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
          <div className="text-center mb-12">
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
              Ce projet n'est pas né d'un <em>brainstorm</em> d'affaires. Il est né d'une frustration positive, directement sur le terrain.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Depuis des années, je présente mon spectacle-conférence <strong>« J'ai ben l'droit! »</strong> dans des dizaines d'organismes, notamment en Centres Jeunesse. La réaction est toujours incroyable. Les jeunes rient, participent, et une lumière s'allume.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              Le spectacle fait son travail : il sensibilise, il décloisonne, il inspire.
            </p>

            <p className="text-gray-700 leading-relaxed mb-10">
              Mais une opportunité s'est révélée : <strong>« Et si on pouvait prolonger cet élan? »</strong>
            </p>

            {/* Section Opportunité */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                L'Opportunité : Transformer l'inspiration en action
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Le spectacle crée une prise de conscience puissante et durable. Il brise la glace, démystifie, et donne confiance.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Mais le droit des usagers, c'est aussi complexe. C'est parfois intimidant. Un jeune qui se retrouve seul dans un bureau de médecin, confus et stressé, a besoin de plus qu'une compréhension théorique. Il a besoin de réflexes pratiques.
              </p>
              <p className="text-gray-700 leading-relaxed mb-2">Comment un jeune (ou n'importe quel usager) peut-il :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Se souvenir de son <strong>droit à l'information</strong> quand on lui parle en jargon?</li>
                <li>Oser exercer son <strong>droit de consentir</strong> quand il se sent pressé?</li>
                <li>Comprendre son <strong>droit d'accès au dossier</strong> sans avoir l'air "parano"?</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                La réponse n'est pas un autre pamphlet. <strong>La réponse, c'est la pratique.</strong>
              </p>
            </div>

            {/* Section Solution */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                La Solution : Un simulateur de vol pour tes droits
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                L'idée de <strong>« Drôles de Droits »</strong> (le jeu interactif) est simple : prolonger l'éveil créé par le spectacle en offrant une <strong>simulation active et pratique</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Au lieu de <em>parler</em> des droits, on les <em>vit</em>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Ce jeu de rôle est un "simulateur de vol" pour le système de santé. L'usager est le héros. Il est plongé dans des scénarios (drôles, frustrants, mais toujours réalistes) et doit faire des choix. Il apprend par l'essai-erreur, dans un environnement sécuritaire, sans jargon et sans jugement.
              </p>
            </div>

            {/* Section Pourquoi les jeunes */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Pourquoi cibler les jeunes d'abord?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Le système de santé est universel, mais l'autonomie, elle, s'apprend.
            </p>
            <p className="text-gray-700 leading-relaxed mb-10">
              Cette première version du jeu est pensée pour les <strong>jeunes en Centre Jeunesse</strong> parce qu'ils sont à un moment charnière. Apprendre à naviguer le système et à défendre ses droits est un outil d'autonomie (un <em>life skill</em>) aussi fondamental que de savoir faire un budget.
            </p>
            <p className="text-gray-700 leading-relaxed mb-10">
              Le jeu utilise <em>leur</em> langage, <em>leurs</em> plateformes (le mobile) et un ton qui respecte leur intelligence, tout en dédramatisant la situation.
            </p>

            {/* Section MVP */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-500 p-6 rounded-r-lg mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Vous êtes ici : La Phase Préliminaire (Le MVP)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ce que vous voyez sur ce site est le <strong>prototype (MVP)</strong>. C'est le cœur du réacteur.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                L'objectif est de prouver que l'on peut éduquer sur un sujet complexe de façon engageante, rapide et efficace.
              </p>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3">Notre vision :</h3>
              <ul className="space-y-4 mb-6">
                <li className="text-gray-700">
                  <strong className="text-purple-700">Pour les Centres Jeunesse :</strong> Offrir un outil d'intervention « toujours disponible » (24/7) pour vos intervenants. Une façon concrète de préparer un jeune à un rendez-vous ou de dédramatiser une situation de soins.
                </li>
                <li className="text-gray-700">
                  <strong className="text-blue-700">Pour les CAAP :</strong> Devenir un outil de première ligne incroyable pour éduquer les usagers <em>avant</em> même qu'ils n'aient besoin de porter plainte, démystifiant les droits et redonnant le pouvoir au citoyen.
                </li>
              </ul>

              <p className="text-gray-700 leading-relaxed">
                Nous sommes activement à la recherche de partenaires (CAAP, CIUSSS, Fondations, Centres Jeunesse) pour co-développer la suite, valider les scénarios et déployer cet outil à grande échelle.
              </p>
            </div>

            {/* CTA Final */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">
                Vous voyez un potentiel? Vous avez des idées?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Collaborons ensemble pour faire une différence dans la vie des jeunes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/jeu">
                  <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                    Essayer le jeu
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

