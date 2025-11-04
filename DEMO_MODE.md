# Guide : Mode Démo et Sections en Développement

## Philosophie

Pour une démo propre et professionnelle, certaines fonctionnalités sont **commentées** ou **marquées comme "en développement"** plutôt que complètement retirées.

Cela permet de :
- Montrer ce qui est fonctionnel **maintenant**
- Indiquer ce qui est **prévu** pour le futur
- Réactiver facilement les fonctionnalités commentées plus tard

---

## ✅ Ce qui est actif dans la démo

1. **Commencer l'aventure** - Jeu principal avec les 12 droits
2. **Fouilles et Cafouillage** - Dialogue interactif avec Jay et Alex
3. **Video Clip Rap** - Paroles synchronisées avec images
4. **Assistant Milo** - Assistant IA pour répondre aux questions
5. **Ressources** - Contacts et numéros d'urgence
6. **À propos** - Information sur le projet

---

## 🚧 Ce qui est désactivé (commenté)

### 1. Mode Aventure RPG
**Fichiers concernés :**
- `app/page.tsx` (lignes 75-85)
- `app/jeu/page.tsx` (lignes 143-154)

**État :** Commenté avec `/* ... */`

**Pour réactiver :** Décommenter les blocs

---

## 📦 Composant DevBadge

Un composant `<DevBadge />` a été créé pour marquer visuellement les sections en développement.

### Utilisation :

```tsx
import DevBadge from '@/components/DevBadge'

// Badge simple
<DevBadge />

// Badge personnalisé
<DevBadge text="Bientôt disponible" size="lg" />

// Dans un titre
<h2 className="flex items-center gap-2">
  Ma Section
  <DevBadge size="sm" />
</h2>
```

### Tailles disponibles :
- `sm` : Petit (pour badges inline)
- `md` : Moyen (par défaut)
- `lg` : Grand (pour titres principaux)

---

## 🎯 Stratégies pour marquer du contenu "en développement"

### Option 1 : Commenter complètement
Pour retirer une fonctionnalité de la démo sans la supprimer :

```tsx
{/* En développement - Désactivé pour la démo
<Link href="/nouvelle-feature">
  <button>Ma Feature</button>
</Link>
*/}
```

✅ **Avantages :** Propre, ne s'affiche pas du tout  
❌ **Inconvénients :** Les utilisateurs ne savent pas que ça existe

---

### Option 2 : Bouton désactivé avec badge
Pour montrer qu'une fonctionnalité existe mais n'est pas disponible :

```tsx
<div className="relative opacity-60 cursor-not-allowed">
  <button disabled className="...">
    Ma Feature
  </button>
  <DevBadge />
</div>
```

✅ **Avantages :** Montre ce qui est prévu  
❌ **Inconvénients :** Peut frustrer si trop visible

---

### Option 3 : Section avec badge dans le titre
Pour indiquer qu'une section est incomplète :

```tsx
<h2 className="flex items-center gap-2">
  Nouvelles Ressources
  <DevBadge text="À venir" size="sm" />
</h2>
```

✅ **Avantages :** Transparent, informatif  
❌ **Inconvénients :** Doit quand même avoir du contenu de base

---

## 📋 Recommandations pour votre démo

### Ce qu'on a fait :
1. ✅ Boutons RPG **commentés** (pas visibles)
2. ✅ Composant `DevBadge` créé (disponible si besoin)

### Ce que vous pourriez faire :

#### Si vous voulez montrer plus de fonctionnalités prévues :
- Ajouter un badge "Bientôt" sur l'assistant s'il n'est pas complètement fonctionnel
- Marquer certains droits dans le jeu comme "Version complète à venir"

#### Si vous voulez une démo minimaliste :
- Garder tel quel (RPG commenté)
- Tout ce qui est visible fonctionne à 100%

---

## 🔧 Comment appliquer ces changements

### Pour commenter d'autres sections :

1. **Identifiez la section** dans le code
2. **Enveloppez-la** dans un commentaire JSX :
```tsx
{/* Description de pourquoi c'est commenté
<MaSection />
*/}
```

### Pour ajouter un badge DevBadge :

1. **Importez le composant** :
```tsx
import DevBadge from '@/components/DevBadge'
```

2. **Ajoutez-le** où vous voulez :
```tsx
<DevBadge text="Version alpha" size="sm" />
```

---

## 🎨 Exemple d'utilisation complète

```tsx
import DevBadge from '@/components/DevBadge'

export default function MaPage() {
  return (
    <div>
      {/* Section active - Aucun badge */}
      <section>
        <h2>Fonctionnalité complète</h2>
        <p>Cette section est prête et fonctionnelle.</p>
      </section>

      {/* Section en développement - Badge visible */}
      <section className="opacity-80">
        <h2 className="flex items-center gap-2">
          Fonctionnalité partielle
          <DevBadge size="sm" />
        </h2>
        <p>Cette section fonctionne mais sera améliorée.</p>
      </section>

      {/* Fonctionnalité future - Commentée */}
      {/* À activer plus tard
      <section>
        <h2>Prochaine fonctionnalité</h2>
        <p>Pas encore implémentée.</p>
      </section>
      */}
    </div>
  )
}
```

---

## ✨ Conseils pour une bonne démo

1. **Moins, c'est mieux** : Montrez ce qui fonctionne parfaitement
2. **Soyez transparent** : Si quelque chose manque, dites-le clairement
3. **Gardez l'intérêt** : Mentionnez ce qui arrive bientôt sans surcharger
4. **Testez tout** : Assurez-vous que ce qui est visible fonctionne à 100%

---

## 🚀 Pour réactiver les fonctionnalités plus tard

Quand vous êtes prêt à réactiver le mode RPG ou d'autres sections :

1. Cherchez les commentaires `/* En développement */`
2. Décommentez le code
3. Testez que tout fonctionne
4. Retirez les `DevBadge` si nécessaire
5. Committez et déployez

---

**Bonne chance avec votre démo! 🎉**

