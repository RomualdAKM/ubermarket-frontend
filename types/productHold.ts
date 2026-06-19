/*export interface Subcategory {
  id: number
  name: string
  slug: string
  category_id: number
}*/

export interface ProductVariant {
  id?: number
  name: string
  value: string // DOIT correspondre exactement au champ DB
  price_modifier?: number // DOIT correspondre exactement au champ DB
  stock_quantity?: number // DOIT correspondre exactement au champ DB
}

/*export interface ProductImage {
  id?: number
  product_id?: number
  image_path?: string
  alt_text?: string
  sort_order?: number
  created_at?: string
  updated_at?: string
  file?: File
  preview?: string
  is_primary?: boolean
}*/

/*export interface ProductData {
  name: string
  description: string
  subcategory_id: number // Pas de category_id direct en DB
  price: number
  promotional_price?: number // Nom exact de la DB
  promotion_start_date?: string // Nom exact de la DB
  promotion_end_date?: string // Nom exact de la DB
  stock_quantity: number // Nom exact de la DB - obligatoire avec valeur par défaut 0
  digital_file?: File
  preview_image?: string // Champ qui existe en DB
  status: 'active' | 'inactive' | 'draft'
  show_sales_count: boolean
  // Champs précommande
  availability_type?: 'in_stock' | 'preorder'
  preorder_payment_type?: 'none' | 'deposit' | 'full' | null
  deposit_amount?: number | null
  deposit_percentage?: number | null
  // Champs supprimes car inexistants en DB: sku, weight, dimensions, download_limit, download_expiry_days, show_reviews
  variants: ProductVariant[]
  images: ProductImage[] // Pour le formulaire, on garde images pour la compatibilité
}*/

export interface Product {
  id: number
  shop_id: number
  subcategory_id: number
  name: string
  description: string
  price: number
  promotional_price?: number // Nom exact de la DB
  promotion_start_date?: string // Nom exact de la DB
  promotion_end_date?: string // Nom exact de la DB
  stock_quantity: number // Nom exact de la DB
  digital_file?: string // Chemin du fichier en DB
  preview_image?: string // Champ qui existe en DB
  show_sales_count: boolean
  sales_count: number // Champ qui existe en DB
  status: 'active' | 'inactive' | 'draft'
  is_marketplace_approved: boolean // Champ qui existe en DB
  // Champs précommande
  availability_type: 'in_stock' | 'preorder'
  preorder_payment_type?: 'none' | 'deposit' | 'full' | null
  deposit_amount?: number | null
  deposit_percentage?: number | null
  minimum_deposit?: number | null // Calculé par le backend (accessor)
  created_at: string
  updated_at: string
  // Relations
  subcategory?: {
    id: number
    name: string
    slug: string
  }
  product_variants?: ProductVariant[]
  product_images?: ProductImage[]
}

// ============================================================
// types/product.ts
// Typage centralisé pour les produits, variantes et images
// Uber-Market — mise à jour : système de combinaisons de variantes
// ============================================================

// ------------------------------------------------------------
// IMAGE : représente une image produit (upload ou existante)
// ------------------------------------------------------------
export interface ProductImage {
  id?: number          // ID en base (undefined pour une nouvelle image non encore sauvegardée)
  file?: File          // Fichier brut (avant upload)
  preview?: string     // Data-URL pour l'aperçu local (FileReader)
  image_path?: string  // Chemin stocké côté serveur après upload
  is_primary: boolean  // L'image principale s'affiche en priorité dans les listings
  
  product_id?: number
  
  alt_text?: string
  sort_order?: number
  created_at?: string
  updated_at?: string
  
}

// ------------------------------------------------------------
// OPTION DE VARIANTE : une dimension d'un attribut (ex: Couleur)
// Contient les valeurs possibles pour cette dimension.
// ------------------------------------------------------------
export interface VariantOption {
  id?: number           // ID en base (undefined si non encore sauvegardé)
  name: string          // Nom de l'attribut : "Couleur", "Taille", "Matière"…
  values: VariantValue[] // Liste des valeurs possibles pour cet attribut
}

// ------------------------------------------------------------
// VALEUR D'UNE OPTION : une valeur spécifique d'un attribut
// Ex: Rouge, Bleu, M, L, Coton…
// ------------------------------------------------------------
export interface VariantValue {
  id?: number          // ID en base
  value: string        // Valeur textuelle : "Rouge", "M"…
  color?: string       // Code couleur hexadécimal (#FF0000) ou null si non applicable
  image?: string       // URL ou Data-URL d'une image représentant cette valeur
  imageFile?: File     // Fichier image avant upload (usage côté client uniquement)
}

// ------------------------------------------------------------
// COMBINAISON DE VARIANTES : un SKU unique issu du croisement
// de plusieurs attributs. Ex : Rouge + M → stock=10, prix+500
// C'est ce modèle qui porte le stock et le prix supplémentaire.
// ------------------------------------------------------------
export interface VariantCombination {
  id?: number          // ID en base (undefined si non encore sauvegardé)
  // Attributs de la combinaison — clés dynamiques : { Couleur: "Rouge", Taille: "M" }
  attributes: Record<string, string>
  price_modifier: number    // Prix supplémentaire par rapport au prix de base
  stock_quantity: number    // Stock disponible pour cette combinaison exacte
  sku?: string              // Code SKU optionnel pour la gestion d'inventaire
}

// ------------------------------------------------------------
// DONNÉES DU FORMULAIRE PRODUIT (création & modification)
// ------------------------------------------------------------
export interface ProductData {
  name: string
  description: string
  subcategory_id: number
  price: number
  promotional_price?: number
  promotion_start_date?: string
  promotion_end_date?: string
  stock_quantity: number        // Stock global (utilisé si pas de variantes)
  digital_file?: File           // Fichier numérique (produits digitaux uniquement)
  status: 'active' | 'inactive'
  show_sales_count: boolean

  // Disponibilité & précommande (produits physiques uniquement)
  availability_type: 'in_stock' | 'preorder'
  preorder_payment_type?: 'none' | 'deposit' | 'full' | null
  deposit_amount?: number | null
  deposit_percentage?: number | null

  // Nouveau système de variantes par dimensions + combinaisons
  variant_options: VariantOption[]      // Les dimensions (ex: Couleur, Taille)
  variant_combinations: VariantCombination[] // Les SKUs issus des combinaisons

  images: ProductImage[]
}

// ------------------------------------------------------------
// SOUS-CATÉGORIE (utilisée pour le select du formulaire)
// ------------------------------------------------------------
export interface Subcategory {
  id: number
  name: string
  category_id: number
  
  slug: string
}