import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  variant_id: number | null
  product_name: string
  variant_name: string | null
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
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
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: string
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  delivery_method: 'pickup' | 'delivery' | 'partner'
  tracking_code: string | null
  notes: string | null
  promo_code_id: number | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
  shop?: any
  promo_code?: any
}

export interface CreateOrderData {
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_method: 'pickup' | 'delivery' | 'partner'
  shipping_address?: any
  promo_code_id?: number
  discount_amount?: number
  session_id?: string
  notes?: string
}

export const useOrders = () => {
  const config = useRuntimeConfig()
  const { token, user } = useAuth()
  
  const orders = useState<Order[]>('orders', () => [])
  const currentOrder = useState<Order | null>('currentOrder', () => null)
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
   * Créer une nouvelle commande
   */
  const createOrder = async (shopSubdomain: string, orderData: CreateOrderData): Promise<Order | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shop/${shopSubdomain}/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData)
      })

      if (response.success && response.order) {
        currentOrder.value = response.order
        return response.order
      }

      return null
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur createOrder:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer les commandes du client connecté
   */
  const fetchMyOrders = async (): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>('/client/orders')

      if (response.success && response.orders) {
        orders.value = response.orders
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchMyOrders:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer les détails d'une commande
   */
  const fetchOrderDetails = async (orderId: number): Promise<Order | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/client/orders/${orderId}`)

      if (response.success && response.order) {
        currentOrder.value = response.order
        return response.order
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
   * Annuler une commande
   */
  const cancelOrder = async (orderId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/client/orders/${orderId}/cancel`, {
        method: 'POST'
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
      console.error('Erreur cancelOrder:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    orders,
    currentOrder,
    isLoading,
    error,
    
    // Methods
    createOrder,
    fetchMyOrders,
    fetchOrderDetails,
    cancelOrder
  }
}
