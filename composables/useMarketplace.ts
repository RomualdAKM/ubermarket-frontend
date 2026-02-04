/**
 * Composable pour gérer la marketplace
 */
import type { Product } from '~/types/product'

export interface MarketplaceShop {
  id: number
  name: string
  subdomain: string
  logo: string | null
  currency: string
  primary_color: string | null
}

export interface MarketplaceProduct extends Product {
  shop: MarketplaceShop
  effective_price: number
  has_promotion: boolean
}

export interface MarketplaceFilters {
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  shops: Array<{
    id: number
    name: string
    subdomain: string
    logo: string | null
  }>
  stats: {
    total_products: number
    total_shops: number
  }
}

export interface MarketplaceSearchParams {
  search?: string
  category_id?: number
  subcategory_id?: number
  shop_id?: number
  shop?: string
  min_price?: number
  max_price?: number
  sort?: 'created_at' | 'price' | 'name' | 'sales_count'
  order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

interface PaginatedResponse {
  data: MarketplaceProduct[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export const useMarketplace = () => {
  const config = useRuntimeConfig()
  
  // État
  const products = ref<MarketplaceProduct[]>([])
  const filters = ref<MarketplaceFilters | null>(null)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
    from: 0,
    to: 0
  })
  const isLoading = ref(false)
  const isLoadingFilters = ref(false)
  const error = ref<string | null>(null)
  const searchParams = ref<MarketplaceSearchParams>({})

  // Requête API
  const apiRequest = async <T>(endpoint: string): Promise<{ success: boolean; data: T; message?: string }> => {
    const response = await fetch(`${config.public.apiBase}${endpoint}`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue')
    }
    
    return data
  }

  // Construire l'URL avec les paramètres de recherche
  const buildQueryString = (params: MarketplaceSearchParams): string => {
    const queryParts: string[] = []
    
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`)
    if (params.category_id) queryParts.push(`category_id=${params.category_id}`)
    if (params.subcategory_id) queryParts.push(`subcategory_id=${params.subcategory_id}`)
    if (params.shop_id) queryParts.push(`shop_id=${params.shop_id}`)
    if (params.shop) queryParts.push(`shop=${encodeURIComponent(params.shop)}`)
    if (params.min_price !== undefined) queryParts.push(`min_price=${params.min_price}`)
    if (params.max_price !== undefined) queryParts.push(`max_price=${params.max_price}`)
    if (params.sort) queryParts.push(`sort=${params.sort}`)
    if (params.order) queryParts.push(`order=${params.order}`)
    if (params.page) queryParts.push(`page=${params.page}`)
    if (params.per_page) queryParts.push(`per_page=${params.per_page}`)
    
    return queryParts.length > 0 ? `?${queryParts.join('&')}` : ''
  }

  // Récupérer les produits de la marketplace
  const fetchProducts = async (params: MarketplaceSearchParams = {}): Promise<void> => {
    isLoading.value = true
    error.value = null
    searchParams.value = params

    try {
      const queryString = buildQueryString(params)
      const response = await apiRequest<PaginatedResponse>(`/marketplace/products${queryString}`)
      
      if (response.success && response.data) {
        products.value = response.data.data
        pagination.value = {
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          perPage: response.data.per_page,
          total: response.data.total,
          from: response.data.from || 0,
          to: response.data.to || 0
        }
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur marketplace:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Récupérer les filtres disponibles
  const fetchFilters = async (): Promise<void> => {
    if (filters.value) return // Déjà chargés
    
    isLoadingFilters.value = true

    try {
      const response = await apiRequest<MarketplaceFilters>('/marketplace/filters')
      
      if (response.success && response.data) {
        filters.value = response.data
      }
    } catch (err: any) {
      console.error('Erreur chargement filtres:', err)
    } finally {
      isLoadingFilters.value = false
    }
  }

  // Récupérer un produit spécifique
  const fetchProduct = async (productId: number): Promise<MarketplaceProduct | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<MarketplaceProduct>(`/marketplace/products/${productId}`)
      
      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Changer de page
  const goToPage = async (page: number): Promise<void> => {
    await fetchProducts({ ...searchParams.value, page })
  }

  // Mettre à jour les filtres et rechercher
  const search = async (params: Partial<MarketplaceSearchParams>): Promise<void> => {
    await fetchProducts({ ...params, page: 1 })
  }

  // Réinitialiser les filtres
  const resetFilters = async (): Promise<void> => {
    searchParams.value = {}
    await fetchProducts({})
  }

  // Formater le prix avec la devise
  const formatPrice = (price: number, currency: string = 'XOF'): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Obtenir l'URL de l'image du produit
  const getProductImageUrl = (product: MarketplaceProduct): string => {
    const baseUrl = config.public.storageUrl || config.public.apiBase.replace('/api', '')
    
    // Priorité: preview_image > première image > placeholder
    if (product.preview_image) {
      return `${baseUrl}/storage/${product.preview_image}`
    }
    
    if (product.product_images && product.product_images.length > 0) {
      return `${baseUrl}/storage/${product.product_images[0].image_path}`
    }
    
    return '/placeholder-product.png'
  }

  // Obtenir l'URL de la boutique (sous-domaine)
  const getShopUrl = (shop: MarketplaceShop): string => {
    // Construire l'URL du sous-domaine
    if (process.client) {
      const currentHost = window.location.host
      // Extraire le domaine principal (ex: uber-market.com ou fga-numerik.fr)
      const mainDomain = currentHost.replace(/^[^.]+\./, '')
      const protocol = window.location.protocol
      return `${protocol}//${shop.subdomain}.${mainDomain}`
    }
    // Fallback pour SSR
    return `https://${shop.subdomain}.uber-market.com`
  }

  // Obtenir l'URL du produit dans sa boutique (sous-domaine)
  const getProductUrl = (product: MarketplaceProduct): string => {
    // Construire l'URL du sous-domaine avec le produit
    if (process.client) {
      const currentHost = window.location.host
      const mainDomain = currentHost.replace(/^[^.]+\./, '')
      const protocol = window.location.protocol
      return `${protocol}//${product.shop.subdomain}.${mainDomain}/produit/${product.id}`
    }
    // Fallback pour SSR
    return `https://${product.shop.subdomain}.uber-market.com/produit/${product.id}`
  }

  // Tronquer la description
  const truncateDescription = (description: string, maxLength: number = 100): string => {
    if (!description) return ''
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength).trim() + '...'
  }

  return {
    // État
    products: readonly(products),
    filters: readonly(filters),
    pagination: readonly(pagination),
    isLoading: readonly(isLoading),
    isLoadingFilters: readonly(isLoadingFilters),
    error: readonly(error),
    searchParams: readonly(searchParams),
    
    // Actions
    fetchProducts,
    fetchFilters,
    fetchProduct,
    goToPage,
    search,
    resetFilters,
    
    // Helpers
    formatPrice,
    getProductImageUrl,
    getShopUrl,
    getProductUrl,
    truncateDescription
  }
}
