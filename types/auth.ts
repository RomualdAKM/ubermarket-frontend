export interface RegisterData {
  name: string
  email: string
  phone: string
  country: string
  password: string
  password_confirmation: string
}

export interface LoginData {
  email: string
  password: string
  remember?: boolean
}

export interface ShopData {
  name: string
  description?: string
  category_id: number  // Au lieu de 'category'
  shop_type: 'e-commerce' | 'website'  // Au lieu de 'type'
  product_type: 'physical' | 'digital'  // Type de produit
  theme_id?: number
  currency?: 'EUR' | 'USD' | 'XOF'
  subdomain?: string
  logo?: File
  primary_color?: string  // Au lieu de 'color'
}

export interface Shop {
  id: number
  user_id: number
  name: string
  slug: string
  subdomain: string
  description?: string
  logo?: string
  primary_color?: string
  category_id: number
  shop_type: 'e-commerce' | 'website'
  product_type: 'physical' | 'digital'
  is_ecommerce: boolean
  theme_id: number
  custom_domain?: string
  currency: 'EUR' | 'USD' | 'XOF'
  status: 'active' | 'inactive' | 'suspended'
  is_maintenance: boolean
  maintenance_message?: string
  maintenance_end_date?: string
  created_at: string
  updated_at: string
  // Relations
  category?: {
    id: number
    name: string
    slug: string
  }
  theme?: {
    id: number
    name: string
    slug: string
  }
  full_domain: string  // Computed attribute
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  country: string
  role: 'vendor' | 'client' | 'super_admin'
  status: 'active' | 'inactive'
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  user?: User
  token?: string
  errors?: Record<string, string[]>
  dns_config?: any 
}