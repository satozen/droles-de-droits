# Droits de Droits 🎮

Jeu interactif éducatif sur les **12 droits des usagers** dans le système de santé québécois, conçu spécialement pour les adolescents dans les centres jeunesse.

## 📖 Description

Ce jeu permet aux jeunes d'apprendre leurs droits et responsabilités en tant qu'usagers du système de santé de manière engageante et interactive. Le jeu présente des scénarios réalistes où les joueurs doivent faire des choix pour comprendre comment leurs droits s'appliquent dans différentes situations.

## ✨ Fonctionnalités

- **12 droits couverts** : Chaque droit est expliqué avec des scénarios interactifs
- **Système de progression** : Suivi automatique de la progression du joueur
- **Interface moderne** : Design coloré et accueillant pour les adolescents
- **Quiz interactifs** : Scénarios à choix multiples avec explications détaillées
- **Responsive** : Fonctionne sur mobile, tablette et ordinateur

## 🚀 Installation et Déploiement

### Développement local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Déploiement sur Vercel (GRATUIT)

1. Va sur [vercel.com](https://vercel.com)
2. Connecte-toi avec ton compte GitHub
3. Clique sur "Add New Project"
4. Sélectionne le repo `droles-de-droits`
5. Clique "Deploy" - **C'est tout!** ✨

Ton site sera live à: `https://droles-de-droits.vercel.app`

### API LLM (Optionnel - pour assistant IA)

Pour activer l'assistant IA avec OpenAI ou Anthropic:

1. Obtiens une clé API:
   - **OpenAI**: https://platform.openai.com/api-keys
   - **Anthropic**: https://console.anthropic.com/

2. Dans Vercel Dashboard:
   - Va dans Project Settings > Environment Variables
   - Ajoute `OPENAI_API_KEY` ou `ANTHROPIC_API_KEY`
   - Redéploie

3. Dans `app/api/chat/route.ts`, décommente la section du LLM choisi

**Note**: Le MVP fonctionne parfaitement SANS API LLM (mode mock activé)

## 🏗️ Architecture

- **Next.js 14** (App Router) - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne
- **Framer Motion** - Animations fluides
- **LocalStorage** - Sauvegarde de la progression

## 📁 Structure du projet

```
/
├── app/
│   ├── page.tsx          # Page d'accueil
│   ├── jeu/
│   │   └── page.tsx      # Page principale du jeu
│   ├── layout.tsx        # Layout global
│   └── globals.css       # Styles globaux
├── data/
│   └── droits.ts         # Données des 12 droits et scénarios
├── hooks/
│   └── useProgress.ts    # Hook de gestion de progression
└── package.json
```

## 🎯 Les 12 Droits

1. Droit aux services de santé et sociaux
2. Droit de choisir un professionnel
3. Droit à l'information
4. Droit de consentir ou de refuser
5. Droit de participer aux décisions
6. Droit d'être accompagné·e
7. Droit de porter plainte
8. Droit d'accéder à son dossier
9. Droit à la confidentialité
10. Droit à des soins de qualité
11. Droit à l'aide et au soutien
12. Droit de ne pas être discriminé·e

## 🔧 Développement

```bash
# Build de production
npm run build

# Démarrer en mode production
npm start

# Linter
npm run lint
```

## 📝 Notes

- La progression est sauvegardée localement dans le navigateur (localStorage)
- Les scénarios peuvent être facilement ajoutés ou modifiés dans `data/droits.ts`
- Le design est adapté pour être accessible et engageant pour les adolescents

## 📄 Licence

Ce projet est conçu pour un usage éducatif dans les centres jeunesse.
