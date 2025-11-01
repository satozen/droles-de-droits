// Données sur les 12 droits des usagers dans le système de santé québécois
// Source: Loi sur les services de santé et les services sociaux (LSSSS)

export interface Droit {
  id: number;
  titre: string;
  description: string;
  icone: string;
  couleur: string;
  scenarios: Scenario[];
}

export interface Scenario {
  id: string;
  situation: string;
  question: string;
  options: Option[];
  bonneReponse: string;
  explication: string;
}

export interface Option {
  id: string;
  texte: string;
}

export const droits: Droit[] = [
  {
    id: 1,
    titre: "Droit à l'information",
    description: "Tu as le droit d'être informé de manière claire sur ton état de santé, les traitements proposés, leurs risques et bénéfices.",
    icone: "📋",
    couleur: "bg-purple-500",
    scenarios: [
      {
        id: "1-1",
        situation: "Tu es en rencontre avec ton éducateur et ton intervenant de la DPJ pour réviser ton plan d'intervention. Ils discutent entre eux de nouveaux objectifs et de changements à ton horaire, mais utilisent beaucoup de termes comme 'plan de transition', 'mesures de soutien', 'objectifs comportementaux'. Tu ne comprends pas vraiment ce que ça veut dire concrètement pour toi et comment ça va changer ton quotidien.",
        question: "Comment devrais-tu réagir dans cette situation?",
        options: [
          { id: "a", texte: "Hocher la tête et signer les papiers sans poser de questions" },
          { id: "b", texte: "Demander qu'on t'explique en mots simples ce que chaque changement signifie pour ton quotidien" },
          { id: "c", texte: "Attendre la fin et demander à un ami au centre de t'expliquer" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de comprendre ce qui se passe dans ton plan d'intervention. C'est ta vie, tes objectifs. Les intervenants doivent t'expliquer dans des mots que tu comprends ce que ça change concrètement pour toi : tes sorties, ton école, tes activités. N'aie pas peur de dire 'Je ne comprends pas, peux-tu m'expliquer autrement?'"
      },
      {
        id: "1-2",
        situation: "L'infirmière du centre te remet un nouveau médicament prescrit par le psychiatre que tu as vu la semaine dernière. Elle te dit 'C'est pour ton anxiété, le doc veut que tu commences aujourd'hui'. Tu ne te souviens pas d'avoir vraiment parlé d'anxiété avec le psychiatre et tu ne sais pas ce que ce médicament va te faire ressentir. Tu as entendu d'autres jeunes parler d'effets secondaires désagréables.",
        question: "Que fais-tu dans cette situation?",
        options: [
          { id: "a", texte: "Prendre le médicament, l'infirmière sait ce qu'elle fait" },
          { id: "b", texte: "Demander à parler au psychiatre ou avoir plus d'explications sur le médicament, ses effets et pourquoi il a été prescrit" },
          { id: "c", texte: "Cacher le médicament et ne pas le prendre" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de savoir ce qu'on te donne et pourquoi. Même si le psychiatre l'a prescrit, tu peux demander des explications : à quoi ça sert exactement, quels sont les effets secondaires possibles, combien de temps tu vas le prendre. Tu as aussi le droit de poser des questions au psychiatre directement avant de commencer. C'est ton corps, ton droit de comprendre."
      },
      {
        id: "1-3",
        situation: "On t'annonce que tu vas passer une 'évaluation psychologique complète' la semaine prochaine. Ton éducateur te dit que c'est 'standard' et 'pour ton bien', mais ne t'explique pas vraiment pourquoi maintenant, qui va la faire, combien de temps ça va prendre, et surtout ce qui va se passer avec les résultats. Tu te sens anxieux et tu ne sais pas à quoi t'attendre.",
        question: "Qu'est-ce que tu devrais faire?",
        options: [
          { id: "a", texte: "Accepter sans question, c'est probablement obligatoire de toute façon" },
          { id: "b", texte: "Demander des détails: pourquoi cette évaluation, qui va la voir, comment elle va être utilisée, et ce qu'on va te demander" },
          { id: "c", texte: "Refuser d'y aller jusqu'à ce qu'on t'explique" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de savoir ce qui se passe avec toi. Une évaluation psychologique, c'est important et ça peut avoir des impacts sur ton dossier et ton plan. Tu peux demander : pourquoi cette évaluation? Qui va voir les résultats? Comment ça va être utilisé? Est-ce que tu vas avoir une copie? Ces questions sont normales et légitimes. Comprendre ce qui t'arrive, c'est ton droit."
      }
    ]
  },
  {
    id: 2,
    titre: "Droit aux services",
    description: "Tu as le droit de recevoir des services appropriés, continus, sécuritaires et de qualité, peu importe où tu vis au Québec.",
    icone: "🏥",
    couleur: "bg-blue-500",
    scenarios: [
      {
        id: "2-1",
        situation: "Tu as demandé à voir le psychologue du centre parce que tu passes des moments difficiles. Ton éducateur te répond qu'il y a une liste d'attente et que 'tout le monde veut voir le psy, il faut attendre ton tour'. Ça fait maintenant 3 semaines et tu n'as pas de nouvelles. Tu sens que ton anxiété empire et tu as de plus en plus de difficulté à dormir. Tu te demandes si c'est normal d'attendre aussi longtemps.",
        question: "Que peux-tu faire dans cette situation?",
        options: [
          { id: "a", texte: "Continuer d'attendre sans rien dire, tout le monde attend" },
          { id: "b", texte: "Parler à ton intervenant de la DPJ ou à la direction pour demander qu'on accélère le rendez-vous vu que ton état se détériore" },
          { id: "c", texte: "Laisser tomber et gérer ça tout seul" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit à des services appropriés dans des délais raisonnables, surtout si ton état se détériore. Le centre doit t'offrir un accès à des services psychologiques adaptés. Si l'attente est trop longue et que ça t'affecte, tu peux en parler à ton intervenant de la DPJ, à la direction ou même demander un suivi externe si nécessaire. Ne laisse pas ta santé mentale se dégrader en attendant."
      },
      {
        id: "2-2",
        situation: "Ton éducateur préféré, avec qui tu as développé une vraie relation de confiance depuis 6 mois, est transféré dans une autre unité. On t'annonce ça un vendredi soir et dès lundi, tu as un nouvel éducateur que tu ne connais pas du tout. Personne ne t'a préparé à ce changement et tu te sens abandonné. Tu avais commencé à parler de choses importantes avec ton ancien éducateur.",
        question: "Qu'est-ce que tu peux exiger?",
        options: [
          { id: "a", texte: "Accepter la situation, c'est comme ça dans les centres" },
          { id: "b", texte: "Demander une rencontre de transition avec ton ancien éducateur et le nouveau pour assurer la continuité, et exprimer tes besoins" },
          { id: "c", texte: "Fermer et ne plus faire confiance à personne" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit à la continuité des services. Les changements d'intervenants devraient être faits avec une période de transition pour préserver ta stabilité. Tu peux demander une rencontre de transition, que ton ancien éducateur transmette les informations importantes au nouveau, et exprimer comment ce changement t'affecte. Tes besoins de stabilité comptent."
      },
      {
        id: "2-3",
        situation: "Tu as une crise d'anxiété sévère un soir au centre. Tu as de la difficulté à respirer et tu paniques. L'éducateur de garde te dit 'Calme-toi, c'est juste du stress' et te suggère d'aller dans ta chambre. Tu sens que c'est plus grave que ça et tu as peur, mais l'éducateur ne semble pas prendre ça au sérieux.",
        question: "Que devrais-tu faire?",
        options: [
          { id: "a", texte: "Écouter l'éducateur et aller dans ma chambre" },
          { id: "b", texte: "Insister pour voir l'infirmière ou demander d'appeler Info-Santé/aller à l'urgence si mes symptômes sont inquiétants" },
          { id: "c", texte: "Essayer de gérer seul dans ma chambre" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit à des services sécuritaires et adaptés à ton état. Si tu sens que quelque chose ne va pas avec ta santé physique ou mentale, tu as le droit de demander une évaluation par l'infirmière ou un professionnel de la santé. Ne laisse personne minimiser ce que tu ressens. Si nécessaire, tu peux demander qu'on contacte Info-Santé ou qu'on t'amène à l'urgence."
      }
    ]
  },
  {
    id: 3,
    titre: "Droit de choisir son professionnel ou l'établissement",
    description: "Tu peux choisir le professionnel qui te soigne et l'établissement où tu veux recevoir des soins, autant que possible selon la disponibilité.",
    icone: "👨‍⚕️",
    couleur: "bg-green-500",
    scenarios: [
      {
        id: "3-1",
        situation: "Le centre t'assigne automatiquement un nouveau psychologue pour ta thérapie. Lors de ta première rencontre, tu ne te sens pas du tout à l'aise : le courant ne passe pas, tu as l'impression qu'il ne te comprend pas vraiment. Tu sais qu'il y a deux autres psychologues au centre. Ton éducateur te dit 'Tu ne peux pas choisir, on t'a assigné celui-là, il faut que tu t'adaptes.'",
        question: "Que devrais-tu faire dans cette situation?",
        options: [
          { id: "a", texte: "M'adapter et continuer avec ce psychologue même si je ne suis pas à l'aise" },
          { id: "b", texte: "Expliquer mon malaise et demander à rencontrer les autres psychologues pour voir si le courant passe mieux avec quelqu'un d'autre" },
          { id: "c", texte: "Abandonner la thérapie complètement" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de choisir le professionnel avec qui tu te sens à l'aise, dans la mesure du possible. La relation de confiance est essentielle en thérapie. Tu peux demander à rencontrer d'autres psychologues disponibles au centre ou même demander un suivi externe si aucun ne te convient. Ne laisse personne te dire que tu 'dois' travailler avec quelqu'un avec qui tu ne te sens pas en sécurité."
      },
      {
        id: "3-2",
        situation: "Tu as besoin de rencontrer un psychiatre pour ton suivi. Il y en a un qui vient au centre une fois par mois, mais tu as entendu parler d'un autre psychiatre externe qui se spécialise dans les traumas et qui pourrait mieux t'aider. La coordinatrice te dit que c'est plus compliqué d'aller voir quelqu'un à l'externe et que tu devrais prendre celui du centre.",
        question: "As-tu le droit de demander à voir le spécialiste externe?",
        options: [
          { id: "a", texte: "Non, je dois voir celui qui vient au centre, c'est plus simple pour eux" },
          { id: "b", texte: "Oui, je peux demander à voir un spécialiste externe si je pense que c'est mieux pour mes besoins" },
          { id: "c", texte: "Seulement si mes parents paient" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de choisir le professionnel qui correspond le mieux à tes besoins, même si c'est plus compliqué logistiquement pour le centre. Si tu penses qu'un spécialiste externe serait mieux adapté à ta situation, tu peux le demander. Le centre devrait faciliter ce choix, pas le compliquer. Tes besoins de santé passent avant la simplicité administrative."
      },
      {
        id: "3-3",
        situation: "On t'assigne un médecin de famille pour ton suivi médical au CLSC. Après deux rendez-vous, tu réalises que tu ne te sens pas à l'aise avec cette personne pour parler de sujets intimes. Tu préférerais un médecin avec qui tu te sens plus en confiance, mais tu as peur de passer pour quelqu'un de difficile.",
        question: "Peux-tu demander à changer de médecin?",
        options: [
          { id: "a", texte: "Non, on m'a assigné ce médecin, je dois rester avec" },
          { id: "b", texte: "Oui, je peux exprimer mon malaise et demander un changement de médecin" },
          { id: "c", texte: "Je dois avoir une raison médicale sérieuse pour changer" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de choisir un professionnel avec qui tu te sens en confiance. Ton confort et ta capacité à parler ouvertement sont essentiels pour ta santé. Tu n'as pas à justifier en détail pourquoi tu ne te sens pas à l'aise. Tu peux demander à changer de médecin, et ce n'est pas être difficile - c'est prendre soin de toi."
      }
    ]
  },
  {
    id: 4,
    titre: "Droit de recevoir les soins que requiert son état",
    description: "Tu as le droit de recevoir des soins professionnels, sécuritaires et qui correspondent aux besoins de ton état de santé.",
    icone: "⭐",
    couleur: "bg-yellow-500",
    scenarios: [
      {
        id: "4-1",
        situation: "Tu as mentionné plusieurs fois à ton éducateur que tu as des migraines fréquentes qui t'empêchent de te concentrer à l'école et de dormir. Il te dit de prendre des Tylenol et que 'ça va passer'. Ça fait maintenant 3 semaines et les migraines empirent. Tu sens que ce n'est pas normal et qu'il te faudrait peut-être voir un médecin pour un vrai diagnostic, mais ton éducateur ne semble pas prendre ça au sérieux.",
        question: "Que peux-tu faire?",
        options: [
          { id: "a", texte: "Continuer à prendre des Tylenol et espérer que ça passe" },
          { id: "b", texte: "Insister pour voir un médecin et faire évaluer tes migraines sérieusement" },
          { id: "c", texte: "Arrêter d'en parler pour ne pas déranger" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de recevoir des soins adaptés à ton état. Des migraines persistantes nécessitent une évaluation médicale sérieuse. Tu peux et tu dois insister pour voir un médecin, même si ton éducateur minimise la situation. Parle à ton intervenant DPJ, à l'infirmière du centre ou à la direction si nécessaire. Ta santé est prioritaire."
      }
    ]
  },
  {
    id: 5,
    titre: "Droit de consentir à des soins ou de les refuser",
    description: "Personne ne peut te forcer à recevoir des soins ou un traitement contre ta volonté (sauf situations d'urgence extrêmes).",
    icone: "✋",
    couleur: "bg-red-500",
    scenarios: [
      {
        id: "5-1",
        situation: "Le psychiatre te propose de commencer un nouveau médicament pour 'stabiliser ton humeur'. Tu as entendu parler d'effets secondaires lourds et tu n'es pas certain de vouloir le prendre. Ton éducateur te dit que 'le doc sait ce qu'il fait' et qu'il faut que tu le prennes. Tu sens une pression pour accepter, mais tu as des réserves et tu aimerais d'abord en savoir plus sur les alternatives.",
        question: "Peux-tu refuser ce traitement?",
        options: [
          { id: "a", texte: "Non, si le psychiatre et mon éducateur le disent, je dois le prendre" },
          { id: "b", texte: "Oui, je peux refuser et demander plus d'informations ou explorer d'autres options avant de décider" },
          { id: "c", texte: "Je peux refuser seulement si mes parents sont d'accord" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de consentir ou de refuser un traitement, même si un psychiatre le recommande. Personne ne peut te forcer à prendre un médicament. Tu peux demander des explications complètes, explorer les alternatives (thérapie, autre médication, etc.), et prendre le temps de réfléchir. Ton consentement doit être libre et éclairé, pas sous pression."
      }
    ]
  },
  {
    id: 6,
    titre: "Droit de participer aux décisions",
    description: "Tu as le droit d'être impliqué dans les décisions concernant tes soins, selon ton niveau de maturité et ta capacité.",
    icone: "🤝",
    couleur: "bg-orange-500",
    scenarios: [
      {
        id: "6-1",
        situation: "Tu es convoqué à une rencontre de plan d'intervention au centre. Quand tu arrives, ton intervenant DPJ, ton éducateur, le psychologue et la direction parlent entre eux de ton plan, de tes objectifs et de tes horaires. Ils te demandent juste de signer à la fin. Tu as l'impression d'être un spectateur de ta propre vie. Personne ne t'a vraiment demandé ton avis ou ce que toi tu voulais.",
        question: "Est-ce correct?",
        options: [
          { id: "a", texte: "Oui, ce sont les adultes qui décident de mon plan" },
          { id: "b", texte: "Non, j'ai le droit de participer activement et de donner mon opinion sur mon plan" },
          { id: "c", texte: "Ça dépend de mon âge" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de participer aux décisions qui te concernent. Un plan d'intervention, c'est TON plan, pas juste un document administratif. Tu as le droit d'exprimer tes besoins, tes objectifs, ce qui fonctionne ou pas pour toi. Même si tu es jeune, ton opinion compte et doit être prise au sérieux."
      }
    ]
  },
  {
    id: 7,
    titre: "Droit d'être accompagné, assisté et représenté",
    description: "Tu peux être accompagné et assisté par une personne de confiance lors de tes rendez-vous médicaux et démarches.",
    icone: "👥",
    couleur: "bg-teal-500",
    scenarios: [
      {
        id: "7-1",
        situation: "Tu as un rendez-vous important avec le psychiatre pour discuter de ton plan de traitement. Tu es stressé et tu aimerais que ton éducateur préféré ou un ami du centre t'accompagne pour te soutenir et t'aider à comprendre. L'infirmière te dit que 'ce n'est pas nécessaire' et que tu dois y aller seul parce que 'c'est confidentiel'.",
        question: "Peux-tu insister pour être accompagné?",
        options: [
          { id: "a", texte: "Non, je dois y aller seul si c'est confidentiel" },
          { id: "b", texte: "Oui, j'ai le droit d'être accompagné par quelqu'un de confiance" },
          { id: "c", texte: "Seulement si j'ai moins de 16 ans" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit d'être accompagné et assisté par une personne de confiance lors de tes rendez-vous médicaux. C'est TON choix, pas celui de l'infirmière. Être accompagné peut t'aider à te sentir plus en sécurité, à mieux comprendre les informations et à te rappeler ce qui a été dit. Tu peux demander que ton éducateur, un ami ou même ton intervenant DPJ t'accompagne."
      }
    ]
  },
  {
    id: 8,
    titre: "Droit à l'hébergement",
    description: "Si ton état le requiert, tu as le droit d'être hébergé dans un établissement qui offre des services adaptés à tes besoins.",
    icone: "🏠",
    couleur: "bg-indigo-500",
    scenarios: [
      {
        id: "8-1",
        situation: "Tu es actuellement dans une unité du centre jeunesse qui accueille des jeunes avec des problématiques très différentes des tiennes. Tu trouves l'environnement difficile, bruyant et ça t'empêche de te concentrer sur ton cheminement. Tu as entendu parler d'une autre unité plus calme, avec un programme mieux adapté à tes besoins, mais on te dit qu'il n'y a pas de place et que 'tu dois t'adapter où tu es'.",
        question: "Que peux-tu faire?",
        options: [
          { id: "a", texte: "Accepter la situation et essayer de m'adapter" },
          { id: "b", texte: "Demander officiellement à être transféré dans une unité mieux adaptée à mes besoins" },
          { id: "c", texte: "Demander à retourner chez moi même si ce n'est pas la meilleure option" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit à un hébergement adapté à tes besoins spécifiques. Si l'environnement actuel nuit à ton bien-être et ton cheminement, tu peux demander un transfert vers une unité plus appropriée. Parle-en à ton intervenant DPJ et fais une demande écrite si nécessaire. Tes besoins d'un environnement adapté sont légitimes."
      }
    ]
  },
  {
    id: 9,
    titre: "Droit à la langue anglaise",
    description: "Si tu es anglophone, tu as le droit de recevoir des services de santé et des services sociaux en anglais dans les établissements reconnus.",
    icone: "🗣️",
    couleur: "bg-lime-500",
    scenarios: [
      {
        id: "9-1",
        situation: "Tu es anglophone et tu es placé dans un centre jeunesse dans une région majoritairement francophone. Lors de ta rencontre avec le psychologue, il te parle en français et tu as beaucoup de difficulté à comprendre et à t'exprimer. Tu voudrais avoir des services en anglais, mais on te dit que 'c'est au Québec ici, il faut parler français'.",
        question: "Que peux-tu demander?",
        options: [
          { id: "a", texte: "Rien, je dois apprendre le français et me débrouiller" },
          { id: "b", texte: "Demander si l'établissement est reconnu bilingue et exiger des services en anglais" },
          { id: "c", texte: "Amener quelqu'un pour traduire à chaque fois" }
        ],
        bonneReponse: "b",
        explication: "Si tu es anglophone, tu as le droit de recevoir des services en anglais dans les établissements reconnus par la loi. Vérifie si ton centre est désigné bilingue et demande un psychologue ou intervenant anglophone. C'est essentiel que tu comprennes bien pour ta santé et ton cheminement. Ne laisse personne minimiser ce besoin."
      }
    ]
  },
  {
    id: 10,
    titre: "Droit au dossier d'usager",
    description: "Tu as le droit de consulter ton dossier médical et d'obtenir une copie, sauf dans certains cas très précis.",
    icone: "📁",
    couleur: "bg-cyan-500",
    scenarios: [
      {
        id: "10-1",
        situation: "Tu entends parler de ton 'dossier DPJ' et tu es curieux de savoir ce qui est écrit dedans. Tu veux comprendre ce qui a été noté sur toi, ton historique, les évaluations et les rapports. Quand tu demandes à le voir, ton éducateur te dit que 'c'est pas pour toi, c'est des affaires d'adultes' et que de toute façon 'tu ne comprendrais pas'.",
        question: "Peux-tu exiger d'y accéder?",
        options: [
          { id: "a", texte: "Non, mon dossier DPJ est confidentiel même pour moi" },
          { id: "b", texte: "Oui, j'ai le droit de consulter mon dossier et de comprendre ce qui y est écrit" },
          { id: "c", texte: "Seulement si j'ai 18 ans" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit d'accéder à ton dossier d'usager, incluant ton dossier DPJ (avec certaines exceptions limitées). C'est TON dossier, tes informations. Tu peux demander à le consulter et même obtenir une copie. Si certains termes sont compliqués, tu peux demander qu'on te les explique. Ne laisse personne te dire que tu n'as pas le droit de savoir ce qui est écrit sur toi."
      }
    ]
  },
  {
    id: 11,
    titre: "Droit à la confidentialité",
    description: "Tes informations de santé sont confidentielles. Elles ne peuvent être partagées qu'avec ton consentement ou dans des situations prévues par la loi.",
    icone: "🔒",
    couleur: "bg-pink-500",
    scenarios: [
      {
        id: "11-1",
        situation: "Tu apprends par un autre jeune du centre que ton éducateur a parlé de ta situation personnelle et de ton diagnostic lors d'une pause café avec d'autres éducateurs. Des détails intimes de ta vie ont été partagés et maintenant tout le monde au centre semble être au courant. Tu te sens trahi et exposé.",
        question: "Est-ce acceptable?",
        options: [
          { id: "a", texte: "Oui, les éducateurs peuvent parler entre eux" },
          { id: "b", texte: "Non, mes informations personnelles et médicales sont confidentielles" },
          { id: "c", texte: "C'est normal dans un centre, tout se sait" }
        ],
        bonneReponse: "b",
        explication: "Tes informations personnelles et médicales sont strictement confidentielles. Elles ne peuvent être partagées qu'avec les personnes directement impliquées dans tes soins et ton suivi, et seulement si c'est nécessaire. Parler de ta situation lors d'une pause café est une violation de ta confidentialité. Tu peux porter plainte pour ça."
      }
    ]
  },
  {
    id: 12,
    titre: "Droit de porter plainte",
    description: "Si tu estimes qu'un de tes droits n'a pas été respecté, tu peux porter plainte et être assisté dans cette démarche.",
    icone: "📢",
    couleur: "bg-rose-500",
    scenarios: [
      {
        id: "12-1",
        situation: "Un éducateur t'a parlé de façon irrespectueuse devant les autres jeunes et a ignoré ta demande de voir l'infirmière quand tu te sentais vraiment mal. Tu penses que tes droits n'ont pas été respectés, mais tu as peur que porter plainte empire la situation et que l'éducateur te traite encore plus mal après.",
        question: "Que peux-tu faire?",
        options: [
          { id: "a", texte: "Rien, c'est trop risqué de se plaindre" },
          { id: "b", texte: "Porter plainte au commissaire aux plaintes, c'est confidentiel et il y a des protections contre les représailles" },
          { id: "c", texte: "Juste en parler à mes amis et espérer que ça change" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de porter plainte si tes droits ne sont pas respectés, et tu es protégé contre les représailles. Le commissaire aux plaintes est indépendant et neutre. Tu peux aussi demander de l'aide pour faire ta plainte (intervenant DPJ, avocat, organisme de défense des droits). Porter plainte n'est pas être 'difficile', c'est faire respecter tes droits."
      }
    ]
  }
];
