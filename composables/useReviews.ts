import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

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
  user?: {
    id: number
    name: string
    email: string
  }
}

export interface CreateReviewData {
  order_item_id: number
  rating: number
  comment?: string
}

export const useReviews = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  
  const reviews = useState<Review[]>('reviews', () => [])
  const isLoading = ref(false)
  const error: Ref<string | null> = ref(null)

  /**
   * Fonction utilitaire pour les requêtes API
   */
  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<any> => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
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
   * Créer un avis
   */
  const createReview = async (reviewData: CreateReviewData): Promise<Review | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>('/client/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
      })

      if (response.success && response.review) {
        return response.review
      }

      return null
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur createReview:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mettre à jour un avis
   */
  const updateReview = async (reviewId: number, reviewData: { rating: number, comment?: string }): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/client/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData)
      })

      if (response.success) {
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur updateReview:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Supprimer un avis
   */
  const deleteReview = async (reviewId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/client/reviews/${reviewId}`, {
        method: 'DELETE'
      })

      if (response.success) {
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur deleteReview:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer les avis d'un produit
   */
  const fetchProductReviews = async (productId: number): Promise<{ reviews: Review[], average: number, total: number } | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/products/${productId}/reviews`)

      if (response.success) {
        reviews.value = response.reviews || []
        return {
          reviews: response.reviews || [],
          average: response.average_rating || 0,
          total: response.total_reviews || 0
        }
      }

      return null
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchProductReviews:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    reviews,
    isLoading,
    error,
    
    // Methods
    createReview,
    updateReview,
    deleteReview,
    fetchProductReviews
  }
}
