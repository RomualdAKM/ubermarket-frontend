// ============================================================
// types/product.ts
// Typage centralisé pour les produits, variantes et images.
// Uber-Market — v2 : système de combinaisons de variantes
//
// HISTORIQUE DES CHANGEMENTS :
//  v1 → variantes plates (ProductVariant : name + value + stock + prix)
//  v2 → variantes par dimensions (VariantOption) + combinaisons (VariantCombination)
//       Les deux coexistent pendant la période de migration backend.
//       ProductData conserve `variants` pour la rétrocompatibilité avec useProducts().
// ============================================================

// ─────────────────────────────────────────────────────────────
// SOUS-CATÉGORIE
// Utilisée dans les selects du formulaire produit.
// `slug` est conservé car retourné par l'API dans les relations.
// ─────────────────────────────────────────────────────────────
export interface Subcategory {
  id: number
  name: string
  slug: string          // retourné par l'API — ne pas supprimer
  category_id: number
}

// ─────────────────────────────────────────────────────────────
// VARIANTE PLATE — format v1 (toujours utilisé en base de données)
// Maintenu pour la rétrocompatibilité avec useProducts() et le backend
// tant que la migration vers VariantCombination n'est pas terminée.
// ─────────────────────────────────────────────────────────────
export interface ProductVariant {
  id?: number
  name: string           // nom de l'attribut : "Couleur", "Taille"…
  value: string          // correspond exactement au champ DB `value`
  price_modifier?: number // correspond exactement au champ DB `price_modifier`
  stock_quantity?: number // correspond exactement au champ DB `stock_quantity`
}

// ─────────────────────────────────────────────────────────────
// IMAGE PRODUIT
// Représente une image en cours d'upload (file + preview)
// ou une image déjà persistée côté serveur (image_path).
// `is_primary` doit rester optionnel car les images venant de
// l'API n'ont pas toujours ce champ explicite (on le déduit de
// preview_image sur Product).
// ─────────────────────────────────────────────────────────────
export interface ProductImage {
  id?: number
  product_id?: number
  image_path?: string    // chemin relatif stocké en DB
  alt_text?: string
  sort_order?: number
  created_at?: string
  updated_at?: string
  // Champs côté client uniquement (non persistés directement)
  file?: File            // fichier brut avant upload
  preview?: string       // Data-URL générée par FileReader pour l'aperçu
  is_primary?: boolean   // optionnel : déduit de Product.preview_image au chargement
}

// ─────────────────────────────────────────────────────────────
// OPTION DE VARIANTE — format v2
// Une dimension d'un attribut produit, ex : "Couleur".
// Contient toutes les valeurs possibles pour cet attribut.
// ─────────────────────────────────────────────────────────────
export interface VariantOption {
  id?: number            // ID en base (undefined avant première sauvegarde)
  name: string           // ex : "Couleur", "Taille", "Matière"
  values: VariantValue[] // valeurs disponibles pour cette dimension
}

// ─────────────────────────────────────────────────────────────
// VALEUR D'OPTION — format v2
// Une valeur spécifique d'un attribut : "Rouge", "M", "Coton"…
// color et image sont optionnels (usage UI uniquement pour l'instant).
// ─────────────────────────────────────────────────────────────
export interface VariantValue {
  id?: number
  value: string          // valeur textuelle : "Rouge", "M"…
  color?: string         // code hex (#FF0000) — null si non applicable
  image?: string         // URL ou Data-URL de l'image représentant cette valeur
  imageFile?: File       // fichier avant upload (client uniquement)
}

// ─────────────────────────────────────────────────────────────
// COMBINAISON DE VARIANTES — format v2
// Un SKU unique issu du croisement de plusieurs dimensions.
// Ex : { Couleur: "Rouge", Taille: "M" } → stock=10, prix+500
// C'est ce modèle qui porte le stock et le prix supplémentaire.
// ─────────────────────────────────────────────────────────────
export interface VariantCombination {
  id?: number
  // Clés dynamiques correspondant aux noms des VariantOption
  // ex : { "Couleur": "Rouge", "Taille": "M" }
  attributes: Record<string, string>
  price_modifier: number  // supplément par rapport au prix de base du produit
  stock_quantity: number  // stock dédié à cette combinaison exacte
  sku?: string            // code SKU optionnel pour la gestion d'inventaire
}

// ─────────────────────────────────────────────────────────────
// DONNÉES DU FORMULAIRE PRODUIT (création & modification)
//
// Contient à la fois :
//  - `variants`             → format v1, maintenu pour useProducts()
//  - `variant_options`      → format v2, nouvelles dimensions
//  - `variant_combinations` → format v2, nouveaux SKUs
//
// Le backend utilise encore v1 ; v2 sera activé après migration.
// `status` accepte 'draft' car l'API peut le retourner.
// ─────────────────────────────────────────────────────────────
export interface ProductData {
  name: string
  description: string
  subcategory_id: number  // pas de category_id direct en DB
  price: number
  promotional_price?: number         // nom exact du champ DB
  promotion_start_date?: string      // nom exact du champ DB
  promotion_end_date?: string        // nom exact du champ DB
  stock_quantity: number             // stock global (ignoré si variant_combinations non vide)
  digital_file?: File                // produits digitaux uniquement
  preview_image?: string             // champ existant en DB
  status: 'active' | 'inactive' | 'draft'  // 'draft' retourné par l'API
  show_sales_count: boolean

  // Disponibilité & précommande (produits physiques uniquement)
  availability_type?: 'in_stock' | 'preorder'
  preorder_payment_type?: 'none' | 'deposit' | 'full' | null
  deposit_amount?: number | null
  deposit_percentage?: number | null

  // v1 — maintenu pour la rétrocompatibilité avec useProducts() et le backend actuel
  variants: ProductVariant[]

  // v2 — nouvelles dimensions et combinaisons (activées progressivement)
  variant_options: VariantOption[]
  variant_combinations: VariantCombination[]

  images: ProductImage[]
}

// ─────────────────────────────────────────────────────────────
// PRODUIT COMPLET — structure retournée par l'API
// Inclut les relations (subcategory, variants, images).
// ─────────────────────────────────────────────────────────────
export interface Product {
  id: number
  shop_id: number
  subcategory_id: number
  name: string
  description: string
  price: number
  promotional_price?: number
  promotion_start_date?: string
  promotion_end_date?: string
  stock_quantity: number
  digital_file?: string         // chemin du fichier en DB (string, pas File)
  preview_image?: string
  show_sales_count: boolean
  sales_count: number
  status: 'active' | 'inactive' | 'draft'
  is_marketplace_approved: boolean
  // Précommande
  availability_type: 'in_stock' | 'preorder'
  preorder_payment_type?: 'none' | 'deposit' | 'full' | null
  deposit_amount?: number | null
  deposit_percentage?: number | null
  minimum_deposit?: number | null   // calculé par un accessor Laravel (non stocké en DB)
  created_at: string
  updated_at: string
  // Relations chargées par l'API (with())
  subcategory?: {
    id: number
    name: string
    slug: string
  }
  product_variants?: ProductVariant[]    // format v1
  product_images?: ProductImage[]
  // v2 — retournés après migration backend
  variant_options?: VariantOption[]
  variant_combinations?: VariantCombination[]
}
