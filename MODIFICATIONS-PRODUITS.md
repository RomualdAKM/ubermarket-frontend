# Modifications du système de gestion des produits

## Résumé des changements

Ce document décrit les modifications apportées au système de gestion des produits pour intégrer la logique de boutique et améliorer la structure des données.

## Nouveaux fichiers créés

### 1. Types TypeScript (`types/product.ts`)
- **Subcategory** : Interface pour les sous-catégories
- **ProductVariant** : Interface pour les variantes de produits
- **ProductImage** : Interface pour les images de produits
- **ProductData** : Interface pour les données de création de produit
- **Product** : Interface complète pour un produit

### 2. Composables

#### `composables/useSubcategories.ts`
- Gestion des sous-catégories par catégorie
- Cache des données pour optimiser les performances
- Fonctions : `fetchSubcategoriesByCategory()`, `resetSubcategories()`

#### `composables/useProducts.ts`
- Gestion complète des produits
- Création, récupération et gestion d'état
- Support des produits physiques et numériques
- Fonctions : `createProduct()`, `fetchShopProducts()`, `getProductById()`, `getProductBySlug()`

## Modifications principales

### Page `ajouter-produit.vue`

#### Changements structurels :
1. **Suppression de la sélection du type de boutique** - Utilise maintenant la boutique actuelle
2. **Intégration des sous-catégories** - Filtrage automatique basé sur la catégorie de la boutique
3. **Adaptation aux types de produits** - Champs conditionnels selon le type (physique/numérique)

#### Nouveaux champs et fonctionnalités :
- **SKU** pour les produits physiques
- **Stock par variante** pour une gestion plus précise
- **Devise dynamique** basée sur la boutique
- **Validation améliorée** selon le type de produit
- **Gestion d'erreurs** avec affichage des messages
- **État de chargement** pendant la création

#### Améliorations UX :
- **Informations de boutique** affichées en haut du formulaire
- **Champs adaptatifs** selon le type de boutique
- **Validation en temps réel** du formulaire
- **Messages d'erreur** clairs et informatifs
- **Indicateur de chargement** sur le bouton de soumission

## Structure des données

### Produit physique
```typescript
{
  name: string
  description: string
  price: number
  subcategory_id: number
  stock: number
  sku?: string
  variants: ProductVariant[]
  images: ProductImage[]
  // ... autres champs
}
```

### Produit numérique
```typescript
{
  name: string
  description: string
  price: number
  subcategory_id: number
  digital_file: File
  images: ProductImage[]
  // ... autres champs
}
```

### Variante de produit
```typescript
{
  name: string      // ex: "Couleur", "Taille"
  value: string     // ex: "Rouge", "M"
  price: number     // prix supplémentaire
  stock?: number    // stock spécifique à cette variante
}
```

## Validation du formulaire

### Champs obligatoires communs :
- Nom du produit
- Description (min 10 caractères)
- Prix (> 0)
- Sous-catégorie
- Au moins une image

### Champs spécifiques aux produits physiques :
- Stock (> 0)

### Champs spécifiques aux produits numériques :
- Fichier numérique (obligatoire)

## Intégration API

La page utilise maintenant le composable `useProducts` pour :
1. **Créer des produits** via l'API
2. **Gérer les états** (chargement, erreur)
3. **Rediriger** vers la liste des produits après création
4. **Valider** les données avant envoi

## Tests recommandés

1. **Test de création de produit physique** avec variantes et stock
2. **Test de création de produit numérique** avec fichier
3. **Test de validation** des champs obligatoires
4. **Test de gestion d'erreurs** API
5. **Test de redirection** après création réussie

## Notes techniques

- Les images supportent maintenant le format WebP
- La première image est automatiquement définie comme principale
- Les variantes incluent maintenant un champ stock individuel
- La devise est dynamique selon la boutique
- La validation est adaptée au type de boutique

## Prochaines étapes

1. Tester la création de produits en conditions réelles
2. Implémenter les tests unitaires pour les composables
3. Ajouter la gestion des erreurs spécifiques par champ
4. Optimiser le cache des sous-catégories
5. Ajouter la prévisualisation des images avant upload