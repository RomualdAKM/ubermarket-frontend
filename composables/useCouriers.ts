import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface Courier {
  id: number
  name: string
  email: string
  phone: string
  coverage_zones: string[]
  status: 'active' | 'inactive'
  is_platform: boolean
  is_own?: boolean
  deliveries_count: number
  type: 'plateforme' | 'boutique'
}

export const useCouriers = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  
  const couriers = useState<Courier[]>('couriers', () => [])
  const platformCouriers = useState<Courier[]>('platformCouriers', () => [])
  const isLoading = ref(false)
  const error: Ref<string | null> = ref(null)

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
   * Récupérer tous les livreurs accessibles pour une boutique
   * (ses propres livreurs + livreurs plateforme)
   */
  const fetchCouriers = async (shopId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shops/${shopId}/couriers`)

      if (response.success && response.data) {
        couriers.value = response.data
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchCouriers:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Rechercher les livreurs de la plateforme
   */
  const searchPlatformCouriers = async (searchParams?: { search?: string; zone?: string }): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (searchParams?.search) params.append('search', searchParams.search)
      if (searchParams?.zone) params.append('zone', searchParams.zone)

      const queryString = params.toString() ? `?${params.toString()}` : ''
      const response = await apiRequest<any>(`/couriers/search-platform${queryString}`)

      if (response.success && response.data) {
        platformCouriers.value = response.data
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur searchPlatformCouriers:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Créer un livreur pour la boutique
   */
  const createCourier = async (shopId: number, courierData: {
    name: string
    email: string
    phone: string
    coverage_zones?: string[]
    status: 'active' | 'inactive'
  }): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shops/${shopId}/couriers`, {
        method: 'POST',
        body: JSON.stringify(courierData)
      })

      if (response.success) {
        // Recharger la liste
        await fetchCouriers(shopId)
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur createCourier:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mettre à jour un livreur
   */
  const updateCourier = async (shopId: number, courierId: number, courierData: Partial<{
    name: string
    email: string
    phone: string
    coverage_zones: string[]
    status: 'active' | 'inactive'
  }>): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shops/${shopId}/couriers/${courierId}`, {
        method: 'PUT',
        body: JSON.stringify(courierData)
      })

      if (response.success) {
        // Recharger la liste
        await fetchCouriers(shopId)
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur updateCourier:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Supprimer un livreur
   */
  const deleteCourier = async (shopId: number, courierId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shops/${shopId}/couriers/${courierId}`, {
        method: 'DELETE'
      })

      if (response.success) {
        // Recharger la liste
        await fetchCouriers(shopId)
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur deleteCourier:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Assigner un livreur à une commande
   */
  const assignToOrder = async (orderId: number, courierId: number): Promise<any> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/couriers/assign`, {
        method: 'POST',
        body: JSON.stringify({
          order_id: orderId,
          courier_id: courierId
        })
      })

      if (response.success) {
        return response // Retourner toute la réponse (avec courier)
      }

      return null
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur assignToOrder:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Ajouter un livreur de la plateforme à la boutique
   */
  const addPlatformCourier = async (shopId: number, courierId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shops/${shopId}/couriers/add-platform`, {
        method: 'POST',
        body: JSON.stringify({
          courier_id: courierId
        })
      })

      if (response.success) {
        // Recharger la liste des livreurs
        await fetchCouriers(shopId)
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur addPlatformCourier:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Retirer un livreur de la plateforme de la boutique
   */
  const removePlatformCourier = async (shopId: number, courierId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<any>(`/shops/${shopId}/couriers/platform/${courierId}`, {
        method: 'DELETE'
      })

      if (response.success) {
        // Recharger la liste des livreurs
        await fetchCouriers(shopId)
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur removePlatformCourier:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obtenir le badge de statut
   */
  const getStatusBadge = (status: string): { label: string; class: string } => {
    const statusMap: Record<string, { label: string; class: string }> = {
      'active': { label: 'Disponible', class: 'bg-green-100 text-green-800' },
      'inactive': { label: 'Indisponible', class: 'bg-red-100 text-red-800' }
    }

    return statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-800' }
  }

  /**
   * Obtenir le badge de type
   */
  const getTypeBadge = (type: string): { label: string; class: string } => {
    const typeMap: Record<string, { label: string; class: string }> = {
      'plateforme': { label: 'Plateforme', class: 'bg-blue-100 text-blue-800' },
      'boutique': { label: 'Ma boutique', class: 'bg-purple-100 text-purple-800' }
    }

    return typeMap[type] || { label: type, class: 'bg-gray-100 text-gray-800' }
  }

  const resetCouriers = (): void => {
    couriers.value = []
    platformCouriers.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    couriers,
    platformCouriers,
    isLoading,
    error,
    fetchCouriers,
    searchPlatformCouriers,
    createCourier,
    updateCourier,
    deleteCourier,
    assignToOrder,
    addPlatformCourier,
    removePlatformCourier,
    getStatusBadge,
    getTypeBadge,
    resetCouriers
  }
}
