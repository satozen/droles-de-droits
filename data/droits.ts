// Données sur les 12 droits des usagers dans le système de santé québécois
// Source: Charte des droits et libertés de la personne et Loi sur les services de santé

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
    titre: "Droit aux services de santé et sociaux",
    description: "Tu as le droit de recevoir des services appropriés, continus, sécuritaires et de qualité, peu importe où tu vis au Québec.",
    icone: "🏥",
    couleur: "bg-blue-500",
    scenarios: [
      {
        id: "1-1",
        situation: "Tu habites dans une région éloignée et tu as besoin de voir un spécialiste. L'hôpital local ne peut pas te donner un rendez-vous avant 6 mois.",
        question: "Que peux-tu faire?",
        options: [
          { id: "a", texte: "Attendre 6 mois, c'est normal" },
          { id: "b", texte: "Demander une référence ailleurs ou contacter le service de référence" },
          { id: "c", texte: "Renoncer aux soins" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit à des services appropriés. Si l'attente est trop longue, tu peux demander une référence ailleurs ou utiliser le service de référence médicale régional."
      }
    ]
  },
  {
    id: 2,
    titre: "Droit de choisir un professionnel",
    description: "Tu peux choisir le professionnel qui te soigne, autant que possible selon la disponibilité.",
    icone: "👨‍⚕️",
    couleur: "bg-green-500",
    scenarios: [
      {
        id: "2-1",
        situation: "Ton médecin habituel déménage et tu n'es pas à l'aise avec son remplaçant.",
        question: "Peux-tu changer de médecin?",
        options: [
          { id: "a", texte: "Non, je dois garder celui qui est là" },
          { id: "b", texte: "Oui, mais seulement si j'ai une bonne raison" },
          { id: "c", texte: "Oui, c'est mon droit de choisir un professionnel qui me convient" }
        ],
        bonneReponse: "c",
        explication: "Tu as le droit de choisir le professionnel qui te soigne. Si tu n'es pas à l'aise, tu peux chercher un autre médecin disponible."
      }
    ]
  },
  {
    id: 3,
    titre: "Droit à l'information",
    description: "Tu as le droit d'être informé·e de manière claire sur ton état de santé, les traitements proposés, leurs risques et bénéfices.",
    icone: "📋",
    couleur: "bg-purple-500",
    scenarios: [
      {
        id: "3-1",
        situation: "Un médecin veut te prescrire un médicament mais ne t'explique pas pourquoi ni comment il fonctionne.",
        question: "Que dois-tu faire?",
        options: [
          { id: "a", texte: "Prendre le médicament sans poser de questions" },
          { id: "b", texte: "Demander des explications avant de prendre une décision" },
          { id: "c", texte: "Refuser directement" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit à l'information. Tu peux et dois poser des questions sur ton traitement, ses effets, ses risques et ses alternatives avant de prendre une décision."
      }
    ]
  },
  {
    id: 4,
    titre: "Droit de consentir ou de refuser",
    description: "Personne ne peut te forcer à recevoir des soins ou un traitement contre ta volonté (sauf situations d'urgence extrêmes).",
    icone: "✋",
    couleur: "bg-red-500",
    scenarios: [
      {
        id: "4-1",
        situation: "Un traitement te semble trop invasif et tu préfères explorer d'autres options d'abord.",
        question: "Peux-tu refuser ce traitement?",
        options: [
          { id: "a", texte: "Non, le médecin sait mieux que moi" },
          { id: "b", texte: "Oui, mais seulement avec la permission de mes parents" },
          { id: "c", texte: "Oui, c'est mon droit de refuser ou de demander plus d'informations" }
        ],
        bonneReponse: "c",
        explication: "Tu as le droit de consentir ou de refuser un traitement. Tu peux demander des alternatives ou plus de temps pour réfléchir. Ton consentement est essentiel."
      }
    ]
  },
  {
    id: 5,
    titre: "Droit de participer aux décisions",
    description: "Tu as le droit d'être impliqué·e dans les décisions concernant tes soins, selon ton niveau de maturité et ta capacité.",
    icone: "🤝",
    couleur: "bg-orange-500",
    scenarios: [
      {
        id: "5-1",
        situation: "Le médecin discute de ton traitement uniquement avec tes parents, sans te consulter.",
        question: "Est-ce correct?",
        options: [
          { id: "a", texte: "Oui, mes parents décident pour moi" },
          { id: "b", texte: "Non, j'ai le droit d'être impliqué dans les décisions qui me concernent" },
          { id: "c", texte: "Ça dépend de mon âge" }
        ],
        bonneReponse: "b",
        explication: "Selon ton âge et ta maturité, tu as le droit de participer aux décisions concernant tes soins. Tes opinions et tes préférences doivent être considérées."
      }
    ]
  },
  {
    id: 6,
    titre: "Droit d'être accompagné·e",
    description: "Tu peux être accompagné·e par une personne de confiance lors de tes rendez-vous médicaux, si tu le souhaites.",
    icone: "👥",
    couleur: "bg-teal-500",
    scenarios: [
      {
        id: "6-1",
        situation: "Tu es nerveux·se pour ton rendez-vous médical et tu veux amener un ami ou un membre de ta famille.",
        question: "Peux-tu le faire?",
        options: [
          { id: "a", texte: "Non, je dois y aller seul·e" },
          { id: "b", texte: "Oui, c'est mon droit d'être accompagné·e" },
          { id: "c", texte: "Seulement si j'ai moins de 16 ans" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit d'être accompagné·e par une personne de confiance lors de tes rendez-vous. Cela peut t'aider à te sentir plus à l'aise et à mieux comprendre les informations."
      }
    ]
  },
  {
    id: 7,
    titre: "Droit de porter plainte",
    description: "Si tu estimes qu'un de tes droits n'a pas été respecté, tu peux porter plainte et être assisté·e dans cette démarche.",
    icone: "📢",
    couleur: "bg-pink-500",
    scenarios: [
      {
        id: "7-1",
        situation: "Tu penses qu'un professionnel ne t'a pas traité·e avec respect et que tes droits n'ont pas été respectés.",
        question: "Que peux-tu faire?",
        options: [
          { id: "a", texte: "Rien, je dois accepter" },
          { id: "b", texte: "Porter plainte au commissaire aux plaintes et à la qualité des services" },
          { id: "c", texte: "Juste en parler à mes amis" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de porter plainte si tes droits ne sont pas respectés. Chaque établissement a un commissaire aux plaintes qui peut t'aider dans cette démarche."
      }
    ]
  },
  {
    id: 8,
    titre: "Droit d'accéder à son dossier",
    description: "Tu as le droit de consulter ton dossier médical et d'obtenir une copie, sauf dans certains cas très précis.",
    icone: "📁",
    couleur: "bg-indigo-500",
    scenarios: [
      {
        id: "8-1",
        situation: "Tu veux voir ce qui est écrit dans ton dossier médical pour mieux comprendre ton historique de santé.",
        question: "Peux-tu y accéder?",
        options: [
          { id: "a", texte: "Non, c'est confidentiel même pour moi" },
          { id: "b", texte: "Oui, c'est mon droit d'accéder à mon propre dossier" },
          { id: "c", texte: "Seulement avec l'autorisation de mes parents" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit d'accéder à ton dossier médical. Tu peux demander à le consulter ou obtenir une copie. C'est ton information personnelle."
      }
    ]
  },
  {
    id: 9,
    titre: "Droit à la confidentialité",
    description: "Tes informations de santé sont confidentielles. Elles ne peuvent être partagées qu'avec ton consentement ou dans des situations prévues par la loi.",
    icone: "🔒",
    couleur: "bg-cyan-500",
    scenarios: [
      {
        id: "9-1",
        situation: "Un employé de l'hôpital parle de ton état de santé à quelqu'un qui n'est pas impliqué dans tes soins.",
        question: "Est-ce acceptable?",
        options: [
          { id: "a", texte: "Oui, s'il travaille à l'hôpital" },
          { id: "b", texte: "Non, mes informations sont confidentielles" },
          { id: "c", texte: "Ça dépend" }
        ],
        bonneReponse: "b",
        explication: "Tes informations de santé sont strictement confidentielles. Elles ne peuvent être partagées que pour les besoins de tes soins ou avec ton consentement explicite."
      }
    ]
  },
  {
    id: 10,
    titre: "Droit à des soins de qualité",
    description: "Tu as le droit de recevoir des soins professionnels, sécuritaires et qui respectent les meilleures pratiques.",
    icone: "⭐",
    couleur: "bg-yellow-500",
    scenarios: [
      {
        id: "10-1",
        situation: "Tu remarques que l'établissement semble négligé et tu as des doutes sur la qualité des soins.",
        question: "Que peux-tu faire?",
        options: [
          { id: "a", texte: "Rien, accepter ce qui est offert" },
          { id: "b", texte: "Exprimer mes préoccupations et demander des garanties sur la qualité" },
          { id: "c", texte: "Changer d'établissement si possible" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit à des soins de qualité. Tu peux exprimer tes préoccupations et t'attendre à recevoir des soins sécuritaires et professionnels."
      }
    ]
  },
  {
    id: 11,
    titre: "Droit à l'aide et au soutien",
    description: "Tu as le droit de recevoir de l'aide et du soutien, notamment un interprète si nécessaire, et de l'information dans une langue que tu comprends.",
    icone: "💬",
    couleur: "bg-lime-500",
    scenarios: [
      {
        id: "11-1",
        situation: "Tu as de la difficulté à comprendre les explications médicales complexes ou tu ne parles pas bien le français.",
        question: "Que peux-tu demander?",
        options: [
          { id: "a", texte: "Rien, je dois me débrouiller" },
          { id: "b", texte: "Demander des explications simplifiées ou un interprète" },
          { id: "c", texte: "Amener quelqu'un qui comprend mieux" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit à l'aide et au soutien. Tu peux demander des explications plus simples, un interprète, ou tout autre support pour t'assurer de bien comprendre."
      }
    ]
  },
  {
    id: 12,
    titre: "Droit de ne pas être discriminé·e",
    description: "Tu ne peux pas être traité·e différemment à cause de ton origine, religion, orientation sexuelle, identité de genre, âge, ou handicap.",
    icone: "⚖️",
    couleur: "bg-rose-500",
    scenarios: [
      {
        id: "12-1",
        situation: "Un professionnel de la santé te traite différemment ou avec moins de respect à cause de ton origine, de ton apparence, ou de ton identité.",
        question: "Est-ce acceptable?",
        options: [
          { id: "a", texte: "Oui, certains préjugés sont normaux" },
          { id: "b", texte: "Non, tu as le droit à un traitement égal et respectueux" },
          { id: "c", texte: "Ça dépend du contexte" }
        ],
        bonneReponse: "b",
        explication: "Tu as le droit de ne pas être discriminé·e. Toute personne a droit à des soins égaux et respectueux, peu importe son origine, son identité, ou ses caractéristiques personnelles."
      }
    ]
  }
];
