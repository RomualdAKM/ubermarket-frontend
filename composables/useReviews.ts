import type { ApiResponse } from '~/types/auth'

export interface Review {
  id: number
  product_id: number
  user_id: number
  order_item_id: number
  rating: number
  comment: string | null
  is_verified_purchase: boolean
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
  }
  product: {
    id: number
    name: string
    price: number
  }
}

export interface ReviewStats {
  total_reviews: number
  average_rating: number
  positive_percentage: number
  average_response_time: string
}

export const useReviews = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const reviews = useState<Review[]>('reviews.list', () => [])
  const stats = useState<ReviewStats | null>('reviews.stats', () => null)
  const isLoading = useState<boolean>('reviews.loading', () => false)
  const error = useState<string | null>('reviews.error', () => null)

  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    const authToken = token.value
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...(options.headers as Record<string, string> || {})
    }

    try {
      const response = await fetch(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue')
      }

      return data
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion au serveur')
    }
  }

  /**
   * Récupérer tous les avis d'une boutique
   */
  const fetchShopReviews = async (shopSlug: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shops/${shopSlug}/reviews`)

      if (response.success) {
        reviews.value = response.data || []
        stats.value = (response as any).stats || null
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchShopReviews:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer les avis d'un produit spécifique (route publique)
   */
  const fetchProductReviews = async (productId: number) => {
    try {
      const response = await fetch(`${config.public.apiBase}/products/${productId}/reviews`)
      const data = await response.json()

      if (data.success) {
        return {
          reviews: data.reviews || [],
          average_rating: data.average_rating || 0,
          total_reviews: data.total_reviews || 0
        }
      }

      return null
    } catch (err) {
      console.error('Erreur fetchProductReviews:', err)
      return null
    }
  }

  return {
    reviews,
    stats,
    isLoading,
    error,
    fetchShopReviews,
    fetchProductReviews
  }
}
