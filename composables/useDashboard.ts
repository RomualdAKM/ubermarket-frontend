import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface DashboardStatistics {
  total_orders: number
  total_revenue: number
  total_products: number
  total_customers: number
  currency: string
}

export interface RecentOrder {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  total_amount: number
  currency: string
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  created_at: string
  items_count: number
}

export interface PopularProduct {
  id: number
  name: string
  price: number
  promotional_price: number | null
  sales_count: number
  stock_quantity: number
  category_name: string | null
  preview_image: string | null
  product_images: any[]
}

export interface DashboardData {
  statistics: DashboardStatistics
  recent_orders: RecentOrder[]
  popular_products: PopularProduct[]
}

export const useDashboard = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  
  const dashboardData = useState<DashboardData | null>('dashboardData', () => null)
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
   * Récupérer les statistiques du dashboard pour une boutique
   */
  const fetchDashboardStats = async (shopId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shops/${shopId}/dashboard/stats`)

      if (response.success && response.data) {
        dashboardData.value = response.data
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchDashboardStats:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Formater le montant avec la devise
   */
  const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
    const currencySymbols: Record<string, string> = {
      'EUR': '€',
      'USD': '$',
      'XOF': 'FCFA'
    }

    const symbol = currencySymbols[currency] || currency
    
    if (currency === 'XOF') {
      return `${amount.toLocaleString('fr-FR')} ${symbol}`
    }
    
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`
  }

  /**
   * Obtenir le badge de statut pour une commande
   */
  const getOrderStatusBadge = (status: string): { label: string; class: string } => {
    const statusMap: Record<string, { label: string; class: string }> = {
      'pending': { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
      'confirmed': { label: 'Confirmée', class: 'bg-blue-100 text-blue-800' },
      'processing': { label: 'Préparation', class: 'bg-purple-100 text-purple-800' },
      'shipped': { label: 'En transit', class: 'bg-blue-100 text-blue-800' },
      'delivered': { label: 'Livré', class: 'bg-green-100 text-green-800' },
      'cancelled': { label: 'Annulée', class: 'bg-red-100 text-red-800' }
    }

    return statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-800' }
  }

  /**
   * Formater la date
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  /**
   * Réinitialiser les données du dashboard
   */
  const resetDashboard = (): void => {
    dashboardData.value = null
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    dashboardData,
    isLoading,
    error,
    
    // Methods
    fetchDashboardStats,
    formatCurrency,
    getOrderStatusBadge,
    formatDate,
    resetDashboard
  }
}
