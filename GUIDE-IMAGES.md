# Guide pour l'image d'accueil 🎨

## Options recommandées

### 1. **Illustrations gratuites en ligne**

#### Sites recommandés :
- **Undraw.co** (https://undraw.co/)
  - Illustrations modernes et personnalisables
  - Recherchez : "healthcare", "youth", "education", "rights"
  - Format SVG ou PNG

- **Freepik** (https://www.freepik.com/)
  - Illustrations de jeunes en situations de santé
  - Recherchez : "young people healthcare", "teen consultation", "patient rights"

- **Pexels / Unsplash** (photos gratuites)
  - Photos de jeunes souriants et confiants
  - Recherchez : "diverse teens", "young people confident", "healthcare youth"

### 2. **Créer une illustration IA**

Utilisez **DALL-E, Midjourney ou Stable Diffusion** avec ce prompt :

```
"Illustration moderne et colorée de jeunes ados diversifiés souriants et confiants, 
style flat design, tons bleu, violet et rose, représentant l'autonomie et les droits 
en santé, convivial et éducatif"
```

### 3. **Commissionnez un artiste**

- Style "flat design" moderne
- Palette : bleu, violet, rose (comme le thème du site)
- Représentation diverse de jeunes
- Atmosphère positive et rassurante

## Comment ajouter votre image

### Étape 1 : Placez l'image
Copiez votre image dans le dossier `/public/images/` et convertissez-la en WebP :
```
/public/images/hero-image.webp
```

**Note** : Toutes les images du site sont converties en format WebP pour de meilleures performances. Utilisez le script de conversion :
```bash
node scripts/convert-to-webp.js
```

### Étape 2 : Modifiez le code
Dans `app/page.tsx`, décommentez et modifiez ces lignes (autour de la ligne 72) :

```typescript
// Importez Image en haut du fichier
import Image from 'next/image'

// Puis remplacez le placeholder par :
<Image
  src="/images/hero-image.webp"
  alt="Jeunes apprenant leurs droits"
  fill
  className="object-cover"
  priority
/>
```

### Étape 3 : Supprimez le placeholder
Supprimez le div avec le gradient et les icônes (lignes 55-70 dans `app/page.tsx`)

## Spécifications techniques

- **Format** : WebP (recommandé pour de meilleures performances), PNG ou JPG
- **Dimensions recommandées** : 800x800px minimum (carré)
- **Poids** : < 500KB pour des performances optimales
- **Style** : Moderne, coloré, adapté aux ados

## Suggestions créatives alternatives

Si vous n'avez pas d'image :

1. **Gardez le placeholder actuel** - Il est déjà visuellement attrayant avec les icônes animées

2. **Vidéo courte** - Remplacez par une courte animation ou vidéo

3. **Illustration CSS** - Créez une composition avec des formes géométriques animées

4. **Collage d'émojis** - Utilisez les 12 émojis des droits de manière créative

## Besoin d'aide ?

Le placeholder actuel avec les 9 icônes animées est déjà très attractif et fonctionnel. 
Vous n'avez pas besoin de le remplacer immédiatement !
