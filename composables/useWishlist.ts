import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface WishlistItem {
  id: number
  user_id: number
  product_id: number
  created_at: string
  updated_at: string
  product?: {
    id: number
    name: string
    price: number
    promotional_price?: number
    preview_image?: string
    stock_quantity: number
    shop?: {
      id: number
      name: string
      subdomain: string
    }
    product_images?: Array<{
      id: number
      image_path: string
      alt_text?: string
    }>
    subcategory?: {
      id: number
      name: string
    }
  }
}

export const useWishlist = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  
  const wishlist = useState<WishlistItem[]>('wishlist', () => [])
  const isLoading = ref(false)
  const error: Ref<string | null> = ref(null)

  /**
   * Fonction utilitaire pour les requêtes API
   */
  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<any> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const response = await fetch(`${config.public.apiBase}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la requête')
    }

    return data
  }

  /**
   * Récupérer la wishlist de l'utilisateur
   */
  const fetchWishlist = async (): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<WishlistItem[]>('/client/wishlist')
      
      if (response.success) {
        wishlist.value = response.wishlist || []
        return true
      }
      
      error.value = response.message || 'Erreur lors du chargement de la wishlist'
      return false
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de la wishlist'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Ajouter un produit à la wishlist
   */
  const addToWishlist = async (productId: number): Promise<boolean> => {
    error.value = null

    try {
      const response = await apiRequest('/client/wishlist', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId })
      })
      
      if (response.success) {
        // Ajouter l'item à la liste locale
        if (response.wishlist_item) {
          wishlist.value.unshift(response.wishlist_item)
        }
        return true
      }
      
      error.value = response.message || 'Erreur lors de l\'ajout à la wishlist'
      return false
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'ajout à la wishlist'
      return false
    }
  }

  /**
   * Retirer un produit de la wishlist
   */
  const removeFromWishlist = async (productId: number): Promise<boolean> => {
    error.value = null

    try {
      const response = await apiRequest(`/client/wishlist/${productId}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        // Retirer l'item de la liste locale
        wishlist.value = wishlist.value.filter(item => item.product_id !== productId)
        return true
      }
      
      error.value = response.message || 'Erreur lors de la suppression'
      return false
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression'
      return false
    }
  }

  /**
   * Vérifier si un produit est dans la wishlist
   */
  const isInWishlist = (productId: number): boolean => {
    return wishlist.value.some(item => item.product_id === productId)
  }

  /**
   * Nombre d'items dans la wishlist
   */
  const wishlistCount = computed(() => wishlist.value.length)

  return {
    wishlist,
    isLoading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount
  }
}
