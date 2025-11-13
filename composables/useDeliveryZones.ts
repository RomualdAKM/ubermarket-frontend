import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface DeliveryZone {
  id: number
  shop_id: number
  country: string
  city: string
  shipping_cost: number
  estimated_days: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateDeliveryZoneData {
  country: string
  city: string
  shipping_cost: number
  estimated_days?: string
  is_active?: boolean
}

export const useDeliveryZones = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  
  const deliveryZones = useState<DeliveryZone[]>('deliveryZones', () => [])
  const isLoading = ref(false)
  const error: Ref<string | null> = ref(null)

  /**
   * Fonction utilitaire pour les requêtes API
   */
  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<any> => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const response = await fetch(`${config.public.apiBase}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue')
    }

    return data
  }

  /**
   * Récupérer toutes les zones de livraison d'une boutique
   */
  const fetchDeliveryZones = async (shopId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<DeliveryZone[]>(`/shops/${shopId}/delivery-zones`)
      
      if (response.success) {
        deliveryZones.value = response.data || []
        return true
      } else {
        error.value = response.message || 'Erreur lors du chargement des zones de livraison'
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des zones de livraison'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Créer une nouvelle zone de livraison
   */
  const createDeliveryZone = async (shopId: number, data: CreateDeliveryZoneData): Promise<DeliveryZone | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/shops/${shopId}/delivery-zones`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      if (response.success && response.data) {
        // Ajouter la nouvelle zone à la liste
        deliveryZones.value.push(response.data)
        return response.data
      } else {
        error.value = response.message || 'Erreur lors de la création de la zone'
        return null
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de la zone'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mettre à jour une zone de livraison
   */
  const updateDeliveryZone = async (shopId: number, zoneId: number, data: CreateDeliveryZoneData): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/shops/${shopId}/delivery-zones/${zoneId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      
      if (response.success && response.data) {
        // Mettre à jour la zone dans la liste
        const index = deliveryZones.value.findIndex(z => z.id === zoneId)
        if (index !== -1) {
          deliveryZones.value[index] = response.data
        }
        return true
      } else {
        error.value = response.message || 'Erreur lors de la mise à jour de la zone'
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de la zone'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Supprimer une zone de livraison
   */
  const deleteDeliveryZone = async (shopId: number, zoneId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/shops/${shopId}/delivery-zones/${zoneId}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        // Retirer la zone de la liste
        deliveryZones.value = deliveryZones.value.filter(z => z.id !== zoneId)
        return true
      } else {
        error.value = response.message || 'Erreur lors de la suppression de la zone'
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de la zone'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    deliveryZones,
    isLoading,
    error,
    fetchDeliveryZones,
    createDeliveryZone,
    updateDeliveryZone,
    deleteDeliveryZone
  }
}
