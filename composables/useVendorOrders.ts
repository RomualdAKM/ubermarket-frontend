import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface VendorOrder {
  id: number
  order_number: string
  shop_id: number
  user_id: number | null
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: any
  subtotal: number
  shipping_cost: number
  discount_amount: number
  total_amount: number
  currency: string
  payment_status: 'pending' | 'partially_paid' | 'paid' | 'failed' | 'refunded'
  payment_method: string | null
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  delivery_method: 'pickup' | 'delivery' | 'partner'
  tracking_code: string | null
  notes: string | null
  promo_code_id: number | null
  // Précommande
  is_preorder: boolean
  amount_paid: number
  amount_remaining: number
  created_at: string
  updated_at: string
  order_items?: any[]
  user?: any
  promo_code?: any
}

export interface OrdersFilters {
  status?: string
  payment_status?: string
  order_type?: string
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export const useVendorOrders = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  
  const orders = useState<VendorOrder[]>('vendorOrders', () => [])
  const currentOrder = useState<VendorOrder | null>('currentVendorOrder', () => null)
  const ordersMeta = useState<any>('vendorOrdersMeta', () => null)
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
   * Récupérer les commandes d'une boutique avec filtres
   */
  const fetchShopOrders = async (shopId: number, filters: OrdersFilters = {}): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.payment_status) queryParams.append('payment_status', filters.payment_status)
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.sort_by) queryParams.append('sort_by', filters.sort_by)
      if (filters.sort_order) queryParams.append('sort_order', filters.sort_order)
      if (filters.page) queryParams.append('page', filters.page.toString())
      if (filters.per_page) queryParams.append('per_page', filters.per_page.toString())

      const queryString = queryParams.toString()
      const endpoint = `/shops/${shopId}/orders${queryString ? `?${queryString}` : ''}`
      
      const response = await apiRequest<any>(endpoint)

      if (response.success) {
        orders.value = response.orders || []
        ordersMeta.value = response.meta || null
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchShopOrders:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer les détails d'une commande
   */
  const fetchOrderDetails = async (shopId: number, orderId: number): Promise<any> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shops/${shopId}/orders/${orderId}`)

      if (response.success && response.order) {
        currentOrder.value = response.order
        // Retourner la réponse complète (order + courier)
        return response
      }

      return null
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchOrderDetails:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  const updateOrderStatus = async (
    shopId: number, 
    orderId: number, 
    orderStatus: string
  ): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shops/${shopId}/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ order_status: orderStatus })
      })

      if (response.success) {
        // Mettre à jour la commande dans la liste
        const index = orders.value.findIndex(o => o.id === orderId)
        if (index !== -1 && response.order) {
          orders.value[index] = response.order
        }
        
        // Mettre à jour currentOrder si c'est la même
        if (currentOrder.value?.id === orderId && response.order) {
          currentOrder.value = response.order
        }
        
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur updateOrderStatus:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mettre à jour le code de suivi
   */
  const updateTracking = async (
    shopId: number, 
    orderId: number, 
    trackingCode: string
  ): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shops/${shopId}/orders/${orderId}/tracking`, {
        method: 'POST',
        body: JSON.stringify({ tracking_code: trackingCode })
      })

      if (response.success) {
        // Mettre à jour la commande dans la liste
        const index = orders.value.findIndex(o => o.id === orderId)
        if (index !== -1 && response.order) {
          orders.value[index] = response.order
        }
        
        // Mettre à jour currentOrder si c'est la même
        if (currentOrder.value?.id === orderId && response.order) {
          currentOrder.value = response.order
        }
        
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur updateTracking:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    orders,
    currentOrder,
    ordersMeta,
    isLoading,
    error,
    
    // Methods
    fetchShopOrders,
    fetchOrderDetails,
    updateOrderStatus,
    updateTracking
  }
}
