/**
 * Types pour le système de chapitres modulaires
 * Permet de créer des chapitres de jeu narratif de façon standardisée
 * Compatible avec le générateur automatique (Claude + Nano Banana Pro)
 */

// Personnages disponibles dans un chapitre
export type Speaker = 'alex' | 'narrateur' | string; // string permet des personnages custom

// Émotions/états pour les effets visuels et le ton
export type Emotion = 
  | 'neutre'
  | 'nerveux'
  | 'confiant'
  | 'triste'
  | 'en_colere'
  | 'peur'
  | 'determine'
  | 'hesitant'
  | 'soulage'
  | 'choque'
  | 'frustre'
  | 'complice'
  | 'tension'
  | 'victoire'
  | 'lecon'
  | 'info'
  | 'conseil'
  | 'action'
  | 'resolution'
  | 'grave'
  | 'decouverte';

// Une ligne de dialogue
export interface DialogueLine {
  speaker: Speaker;
  text: string;
  image: string; // Chemin vers l'image ou URL placeholder
  emotion?: Emotion;
  choices?: string[]; // Options de choix pour le joueur
  audioFile?: string; // Chemin vers le fichier audio voice-over (optionnel)
}

// Script de dialogue pour une scène
export interface DialogueScript {
  [sceneKey: string]: DialogueLine[];
}

// Mapping des choix vers les scènes suivantes
export interface ChoiceMapping {
  sceneKey: string;
  choiceIndex: number;
  targetScene: string;
  // Optionnel: action spéciale (redirection externe, etc.)
  action?: 'navigate' | 'redirect' | 'end';
  actionTarget?: string; // URL ou route pour redirect
}

// Personnage du chapitre
export interface Character {
  id: string;
  name: string;
  displayName: string; // Nom affiché avec emoji ex: "😈 JAY"
  color: {
    bg: string;      // ex: "bg-red-500"
    text: string;    // ex: "text-white"
    border: string;  // ex: "border-black"
  };
  audioPrefix?: string; // Préfixe pour les fichiers audio ex: "karim"
}

// Droit associé au chapitre
export interface ChapterRight {
  id: number;
  title: string;
  description: string;
  icon: string;
}

// Droits à débloquer pendant le chapitre
export interface UnlockableRight {
  id: number;
  text: string;
  unlockCondition: {
    scene: string;
    lineIndex: number;
  };
}

// Image générée pour une scène
export interface SceneImage {
  sceneKey: string;
  lineIndex: number;
  prompt: string; // Prompt utilisé pour générer l'image
  imagePath: string; // Chemin local après génération
  isPlaceholder: boolean; // true si c'est une image temporaire
  generatedAt?: string; // Date de génération ISO
}

// Métadonnées du chapitre
export interface ChapterMetadata {
  id: string; // ex: "la-fugue"
  slug: string; // URL slug
  title: string; // ex: "La Fugue"
  subtitle?: string;
  description: string;
  right: ChapterRight; // Droit principal abordé
  characters: Character[];
  estimatedDuration: number; // en minutes
  difficulty: 'facile' | 'moyen' | 'difficile';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isGenerated: boolean; // true si généré automatiquement
  status: 'draft' | 'review' | 'published';
}

// Structure complète d'un chapitre
export interface Chapter {
  metadata: ChapterMetadata;
  dialogue: DialogueScript;
  choiceMappings: ChoiceMapping[];
  unlockableRights: UnlockableRight[];
  images: SceneImage[];
  // Configuration optionnelle
  config?: {
    backgroundMusic?: string;
    startScene: string;
    endScreens: {
      [endType: string]: {
        title: string;
        message: string;
        color: string;
      };
    };
  };
}

// Requête pour générer un scénario
export interface GenerateScenarioRequest {
  chapterTitle: string;
  rightId: number;
  rightTitle: string;
  rightDescription: string;
  context: string; // Description du contexte/situation
  characters: {
    name: string;
    role: string;
    personality: string;
  }[];
  desiredBranches: number; // Nombre de branches narratives souhaitées
  tone: 'serieux' | 'leger' | 'dramatique';
}

// Réponse de génération de scénario
export interface GenerateScenarioResponse {
  success: boolean;
  chapter?: Partial<Chapter>;
  error?: string;
  tokensUsed?: number;
}

// Requête pour générer une image
export interface GenerateImageRequest {
  prompt: string;
  sceneContext: string;
  style: 'centre_jeunesse' | 'cafeteria' | 'chambre' | 'bureau' | 'urbain' | 'exterieur' | 'fugue';
  aspectRatio: '16:9' | '4:3' | '1:1';
  characters?: string[]; // Noms des personnages à inclure (pour charger leurs images de référence)
  referenceImages?: string[]; // Chemins vers des images de référence additionnelles pour le style
  emotion?: string; // Émotion dominante de la scène
  shotType?: 'establishing' | 'medium' | 'closeup_character' | 'closeup_object' | 'two_shot' | 'over_shoulder' | 'pov'; // Type de plan (auto-détecté si non fourni)
}

// Réponse de génération d'image
export interface GenerateImageResponse {
  success: boolean;
  imageData?: string; // Base64
  imagePath?: string; // Chemin après sauvegarde
  error?: string;
}

// État de progression d'un chapitre
export interface ChapterProgress {
  chapterId: string;
  currentScene: string;
  currentLineIndex: number;
  unlockedRights: number[];
  choicesMade: {
    scene: string;
    choiceIndex: number;
    timestamp: string;
  }[];
  completed: boolean;
  completedAt?: string;
}

// Résumé d'un chapitre pour l'affichage dans les listes
export interface ChapterSummary {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  rightId: number;
  rightTitle: string;
  rightIcon: string;
  thumbnail: string;
  estimatedDuration: number;
  status: 'available' | 'coming_soon' | 'locked';
  progress?: number; // 0-100
}

