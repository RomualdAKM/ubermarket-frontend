import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface CartItem {
  id: number
  cart_id: number
  product_id: number
  variant_id: number | null
  quantity: number
  price: number
  created_at: string
  updated_at: string
  product: {
    id: number
    name: string
    price: number
    stock_quantity: number
    promotional_price: number | null
    preview_image: string | null
    product_images: any[]
    availability_type: string
    preorder_payment_type?: string
    deposit_percentage?: number
    deposit_amount?: number
  }
  variant: {
    id: number
    name: string
    value: string
    price_modifier: number
  } | null
  variants?: any[]
}

export interface Cart {
  id: number
  user_id: number | null
  session_id: string | null
  shop_id: number
  created_at: string
  updated_at: string
  cartItems: CartItem[]
}

export interface CartTotals {
  subtotal: number
  items_count: number
}

export const useCart = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  
  const cart = useState<Cart | null>('cart', () => null)
  const cartItems = useState<CartItem[]>('cartItems', () => [])
  const cartTotals = useState<CartTotals>('cartTotals', () => ({ subtotal: 0, items_count: 0 }))
  const isLoading = ref(false)
  const error: Ref<string | null> = ref(null)

  /**
   * Générer ou récupérer un session_id pour les invités
   */
  const getSessionId = (): string => {
    if (process.client) {
      let sessionId = localStorage.getItem('cart_session_id')
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('cart_session_id', sessionId)
      }
      return sessionId
    }
    return ''
  }

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
   * Récupérer le panier
   */
  const fetchCart = async (shopSubdomain: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const sessionId = getSessionId()
      const url = `${config.public.apiBase}/shop/${shopSubdomain}/cart`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token.value ? { 'Authorization': `Bearer ${token.value}` } : {})
        },
        body: JSON.stringify({ session_id: sessionId })
      })
      
      const data = await response.json()

      if (data.success) {
        cart.value = data.cart
        cartItems.value = data.items || []
        cartTotals.value = data.totals || { subtotal: 0, items_count: 0 }
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchCart:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Ajouter un article au panier
   */
  const addToCart = async (
    shopSubdomain: string, 
    productId: number, 
    quantity: number = 1, 
    variantIds: number[] | null = null
  ): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const sessionId = getSessionId()
      const response = await apiRequest<any>(`/shop/${shopSubdomain}/cart/add`, {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          variant_ids: variantIds, // Envoyer un tableau de variant_ids
          quantity: quantity,
          session_id: sessionId
        })
      })

      if (response.success) {
        // Recharger le panier après ajout
        await fetchCart(shopSubdomain)
        
        // Tracker l'ajout au panier pour le marketing
        if (process.client) {
          const { trackAddToCart } = useMarketingTracking()
          const addedItem = cartItems.value.find(item => item.product_id === productId)
          if (addedItem) {
            trackAddToCart(addedItem.product, quantity)
          }
        }
        
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur addToCart:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mettre à jour la quantité d'un article
   */
  const updateQuantity = async (
    shopSubdomain: string, 
    itemId: number, 
    quantity: number
  ): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const sessionId = getSessionId()
      const response = await apiRequest<any>(`/shop/${shopSubdomain}/cart/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({
          quantity: quantity,
          session_id: sessionId
        })
      })

      if (response.success) {
        // Recharger le panier après mise à jour
        await fetchCart(shopSubdomain)
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur updateQuantity:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Supprimer un article du panier
   */
  const removeItem = async (
    shopSubdomain: string, 
    itemId: number
  ): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const sessionId = getSessionId()
      const response = await apiRequest<any>(`/shop/${shopSubdomain}/cart/items/${itemId}`, {
        method: 'DELETE',
        body: JSON.stringify({ session_id: sessionId })
      })

      if (response.success) {
        // Recharger le panier après suppression
        await fetchCart(shopSubdomain)
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur removeItem:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Vider le panier
   */
  const clearCart = async (shopSubdomain: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const sessionId = getSessionId()
      const response = await apiRequest<any>(`/shop/${shopSubdomain}/cart`, {
        method: 'DELETE',
        body: JSON.stringify({ session_id: sessionId })
      })

      if (response.success) {
        cart.value = null
        cartItems.value = []
        cartTotals.value = { subtotal: 0, items_count: 0 }
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur clearCart:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Computed properties
   */
  const itemsCount = computed(() => cartTotals.value.items_count)
  const subtotal = computed(() => cartTotals.value.subtotal)

  return {
    // State
    cart,
    cartItems,
    cartTotals,
    isLoading,
    error,
    
    // Computed
    itemsCount,
    subtotal,
    
    // Methods
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getSessionId
  }
}
