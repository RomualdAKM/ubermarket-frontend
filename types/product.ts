export interface Subcategory {
  id: number
  name: string
  slug: string
  category_id: number
}

export interface ProductVariant {
  id?: number
  name: string
  value: string // DOIT correspondre exactement au champ DB
  price_modifier?: number // DOIT correspondre exactement au champ DB
  stock_quantity?: number // DOIT correspondre exactement au champ DB
}

export interface ProductImage {
  id?: number
  product_id?: number
  image_path: string
  alt_text?: string
  sort_order?: number
  created_at?: string
  updated_at?: string
  file?: File
  preview?: string
  is_primary?: boolean
}

export interface ProductData {
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
  // Champs supprimés car inexistants en DB: sku, weight, dimensions, download_limit, download_expiry_days, show_reviews
  variants: ProductVariant[]
  images: ProductImage[] // Pour le formulaire, on garde images pour la compatibilité
}

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