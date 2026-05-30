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
      // 1. Récupérer la liste des boutiques
      const shopsResponse = await apiRequest<any>('/shops')
      if (!shopsResponse.success || !shopsResponse.data) {
        throw new Error('Impossible de récupérer les boutiques')
      }

      // 💡Filtre pour ne garder que les e-commerce
      const shops = shopsResponse.data.filter((shop: any) => shop.shop_type === 'e-commerce')

      if (shops.length === 0) {
        globalStats.value = {
          statistics: {
            total_orders: 0, total_revenue: 0, total_products: 0,
            total_customers: 0, total_shops: 0, conversion_rate: 0,
            average_cart: 0, total_visits: 0, currency: 'XOF'
          },
          shops_stats: [],
          revenue_by_day: [],
          visits_by_day: [],
          popular_products: [],
          period
        }
        return true
      }

      // 2. Récupérer les stats de chaque boutique en parallèle
      const shopsStatsResults = await Promise.allSettled(
        shops.map((shop: any) =>
          apiRequest<any>(`/shops/${shop.id}/dashboard/stats?period=${period}`)
        )
      )

      // 3. Agréger les résultats
      let totalOrders = 0
      let totalRevenue = 0
      let totalProducts = 0
      let totalCustomers = 0
      let totalVisits = 0
      const shopsStats: ShopStat[] = []
      const revenueByDay: Record<string, number> = {}
      const visitsByDay: Record<string, number> = {}
      const popularProductsMap: Record<number, PopularProduct> = {}
      const currency = shops[0]?.currency || 'XOF'

      shopsStatsResults.forEach((result, index) => {
        const shop = shops[index]
        if (result.status === 'rejected' || !result.value?.success) return

        const stats = result.value.data

        const shopOrders = stats.orders_count || stats.total_orders || 0
        const shopRevenue = stats.total_revenue || stats.revenue || 0
        const shopProducts = stats.products_count || stats.total_products || 0
        const shopCustomers = stats.customers_count || stats.total_customers || 0

        totalOrders += shopOrders
        totalRevenue += shopRevenue
        totalProducts += shopProducts
        totalCustomers += shopCustomers

        shopsStats.push({
          id: shop.id,
          name: shop.name,
          slug: shop.slug,
          logo: shop.logo || null,
          orders: shopOrders,
          revenue: shopRevenue,
          currency: shop.currency || 'XOF'
        })

        // Agréger les revenus par jour
        if (stats.revenue_by_day || stats.revenue_chart) {
          const revData = stats.revenue_by_day || stats.revenue_chart || []
          revData.forEach((item: any) => {
            const label = item.label || item.date || item.day
            const value = item.value || item.revenue || item.amount || 0
            revenueByDay[label] = (revenueByDay[label] || 0) + value
          })
        }

        // Agréger les visites
        if (stats.visits_by_day || stats.visits_chart) {
          const visitsData = stats.visits_by_day || stats.visits_chart || []
          visitsData.forEach((item: any) => {
            const label = item.label || item.date || item.day
            const value = item.value || item.visits || item.count || 0
            visitsByDay[label] = (visitsByDay[label] || 0) + value
            totalVisits += value
          })
        }

        // Produits populaires
        if (stats.popular_products) {
          stats.popular_products.forEach((product: any) => {
            if (popularProductsMap[product.id]) {
              popularProductsMap[product.id].sales += product.sales_count || product.sales || 0
              popularProductsMap[product.id].revenue += product.revenue || 0
            } else {
              popularProductsMap[product.id] = {
                id: product.id,
                name: product.name,
                shop_name: shop.name,
                sales: product.sales_count || product.sales || 0,
                revenue: product.revenue || 0,
                preview_image: product.preview_image || product.image || null
              }
            }
          })
        }
      })

      const conversionRate = totalVisits > 0
        ? Math.round((totalOrders / totalVisits) * 100 * 100) / 100
        : 0

      const averageCart = totalOrders > 0
        ? Math.round(totalRevenue / totalOrders)
        : 0

      globalStats.value = {
        statistics: {
          total_orders: totalOrders,
          total_revenue: totalRevenue,
          total_products: totalProducts,
          total_customers: totalCustomers,
          total_shops: shops.length,
          conversion_rate: conversionRate,
          average_cart: averageCart,
          total_visits: totalVisits,
          currency
        },
        shops_stats: shopsStats,
        revenue_by_day: Object.entries(revenueByDay)
          .map(([label, value]) => ({ label, value }))
          .slice(-30),
        visits_by_day: Object.entries(visitsByDay)
          .map(([label, value]) => ({ label, value }))
          .slice(-30),
        popular_products: Object.values(popularProductsMap)
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 10),
        period
      }

      return true
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
