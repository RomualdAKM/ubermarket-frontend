import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface GlobalStatistics {
  total_orders: number
  total_revenue: number
  total_products: number
  total_customers: number
  total_shops: number
  conversion_rate: number
  average_cart: number
  total_visits: number
  currency: string
}

export interface ShopStat {
  id: number
  name: string
  slug: string
  logo: string | null
  orders: number
  revenue: number
  currency: string
}

export interface ChartData {
  label: string
  value: number
}

export interface PopularProduct {
  id: number
  name: string
  shop_name: string
  sales: number
  revenue: number
  preview_image: string | null
}

export interface GlobalStatsData {
  statistics: GlobalStatistics
  shops_stats: ShopStat[]
  revenue_by_day: ChartData[]
  visits_by_day: ChartData[]
  popular_products: PopularProduct[]
  period: string
}

export const useGlobalStats = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  
  const globalStats = useState<GlobalStatsData | null>('globalStats', () => null)
  const isLoading = ref(false)
  const error: Ref<string | null> = ref(null)

  /**
   * Fonction utilitaire pour les requetes API
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
   * Recuperer les statistiques globales de toutes les boutiques
   */
  const fetchGlobalStats = async (period: string = 'month'): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/vendor/shops/global-stats?period=${period}`)

      if (response.success && response.data) {
        globalStats.value = response.data
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchGlobalStats:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Formater le montant avec la devise
   */
  const formatCurrency = (amount: number, currency: string = 'XOF'): string => {
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
   * Formater un nombre
   */
  const formatNumber = (num: number): string => {
    return num.toLocaleString('fr-FR')
  }

  /**
   * Calculer la hauteur pour les barres du graphique (en pourcentage)
   */
  const calculateBarHeight = (value: number, data: ChartData[]): number => {
    const maxValue = Math.max(...data.map(d => d.value), 1)
    return Math.round((value / maxValue) * 100)
  }

  /**
   * Reinitialiser les donnees
   */
  const resetStats = (): void => {
    globalStats.value = null
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    globalStats,
    isLoading,
    error,
    
    // Methods
    fetchGlobalStats,
    formatCurrency,
    formatNumber,
    calculateBarHeight,
    resetStats
  }
}
