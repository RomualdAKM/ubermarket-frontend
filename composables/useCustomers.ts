import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface Customer {
  id: number | null
  name: string
  email: string
  phone: string
  registered_at: string
  is_guest: boolean
  orders_count: number
  total_spent: number
  average_order: number
  last_order_date: string
}

export interface CustomerOrder {
  id: number
  order_number: string
  created_at: string
  status: string
  payment_status: string
  subtotal: number
  shipping_cost: number
  discount_amount: number
  total_amount: number
  currency: string
  items_count: number
  promo_code: string | null
  tracking_code: string | null
  items: CustomerOrderItem[]
}

export interface CustomerOrderItem {
  id: number
  product_name: string
  variant_name: string | null
  quantity: number
  unit_price: number
  total_price: number
}

export interface FetchCustomersParams {
  search?: string
  sort_by?: 'last_order' | 'orders_count' | 'total_spent' | 'name'
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export const useCustomers = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const customers: Ref<Customer[]> = ref([])
  const currentCustomer: Ref<Customer | null> = ref(null)
  const customerOrders: Ref<CustomerOrder[]> = ref([])
  const isLoading = ref(false)
  const error: Ref<string | null> = ref(null)
  const pagination = ref({
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1
  })

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
   * Récupérer tous les clients d'une boutique
   */
  const fetchCustomers = async (shopId: number, params: FetchCustomersParams = {}): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      
      if (params.search) queryParams.append('search', params.search)
      if (params.sort_by) queryParams.append('sort_by', params.sort_by)
      if (params.sort_order) queryParams.append('sort_order', params.sort_order)
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.per_page) queryParams.append('per_page', params.per_page.toString())

      const queryString = queryParams.toString()
      const endpoint = `/shops/${shopId}/customers${queryString ? `?${queryString}` : ''}`
      
      const response = await apiRequest<Customer[]>(endpoint)
      
      if (response.success && response.data) {
        customers.value = response.data
        
        if (response.meta) {
          pagination.value = response.meta
        }
        
        return true
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des clients')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchCustomers:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer les détails d'un client spécifique
   */
  const fetchCustomerDetails = async (shopId: number, customerId: number | string): Promise<Customer | null> => {
    isLoading.value = true
    error.value = null

    try {
      // Utiliser query parameters au lieu de l'URL
      const isEmail = typeof customerId === 'string' && customerId.includes('@')
      const queryParam = isEmail ? `customer_email=${encodeURIComponent(customerId)}` : `customer_id=${customerId}`
      
      const response = await apiRequest<Customer>(`/shops/${shopId}/customers/details?${queryParam}`)
      
      if (response.success && response.data) {
        currentCustomer.value = response.data
        return response.data
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des détails du client')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchCustomerDetails:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer l'historique des commandes d'un client
   */
  const fetchCustomerOrders = async (shopId: number, customerId: number | string): Promise<CustomerOrder[]> => {
    isLoading.value = true
    error.value = null

    try {
      // Utiliser query parameters au lieu de l'URL
      const isEmail = typeof customerId === 'string' && customerId.includes('@')
      const queryParam = isEmail ? `customer_email=${encodeURIComponent(customerId)}` : `customer_id=${customerId}`
      
      const response = await apiRequest<CustomerOrder[]>(`/shops/${shopId}/customers/orders?${queryParam}`)
      
      if (response.success && response.data) {
        customerOrders.value = response.data
        return response.data
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des commandes')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchCustomerOrders:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    customers,
    currentCustomer,
    customerOrders,
    isLoading,
    error,
    pagination,
    fetchCustomers,
    fetchCustomerDetails,
    fetchCustomerOrders
  }
}
