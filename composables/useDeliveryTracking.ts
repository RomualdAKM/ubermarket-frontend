import { ref, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface DeliveryStatusHistory {
  status: string
  changed_at: string
  note: string | null
}

export interface DeliveryInfo {
  current_status: string
  courier_name: string | null
  estimated_days: number | null
  assigned_at: string | null
  picked_up_at: string | null
  in_transit_at: string | null
  delivered_at: string | null
}

export interface DeliveryStatusResponse {
  order: {
    id: number
    order_number: string
    order_status: string
    payment_status: string
  }
  delivery: DeliveryInfo
  status_history: DeliveryStatusHistory[]
}

export const useDeliveryTracking = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const deliveryStatus = ref<DeliveryStatusResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdatedAt = ref<Date | null>(null)
  const secondsSinceUpdate = ref(0)

  let pollingInterval: ReturnType<typeof setInterval> | null = null
  let tickInterval: ReturnType<typeof setInterval> | null = null

  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<any> => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const response = await fetch(`${config.public.apiBase}${endpoint}`, {
      ...options,
      headers
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue')
    }

    return data
  }

  /**
   * Récupérer le statut de livraison d'une commande
   */
  const fetchDeliveryStatus = async (orderId: number): Promise<DeliveryStatusResponse | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/client/orders/${orderId}/delivery-status`)

      if (response.success) {
        deliveryStatus.value = {
          order: response.order,
          delivery: response.delivery,
          status_history: response.status_history || []
        }
        lastUpdatedAt.value = new Date()
        secondsSinceUpdate.value = 0
        return deliveryStatus.value
      }

      return null
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchDeliveryStatus:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Confirmer la réception de la commande
   */
  const confirmReception = async (orderId: number): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/client/orders/${orderId}/confirm-reception`, {
        method: 'POST'
      })

      if (response.success) {
        // Rafraîchir le statut après confirmation
        await fetchDeliveryStatus(orderId)
        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur confirmReception:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Démarrer le polling automatique (toutes les 30s)
   */
  const startPolling = (orderId: number) => {
    stopPolling()

    // Polling principal
    pollingInterval = setInterval(async () => {
      if (deliveryStatus.value?.delivery?.current_status === 'delivered') {
        stopPolling()
        return
      }
      await fetchDeliveryStatus(orderId)
    }, 30000)

    // Tick pour le compteur "il y a Xs"
    tickInterval = setInterval(() => {
      if (lastUpdatedAt.value) {
        secondsSinceUpdate.value = Math.floor((Date.now() - lastUpdatedAt.value.getTime()) / 1000)
      }
    }, 1000)
  }

  /**
   * Arrêter le polling
   */
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
    if (tickInterval) {
      clearInterval(tickInterval)
      tickInterval = null
    }
  }

  /**
   * Réinitialiser l'état
   */
  const reset = () => {
    stopPolling()
    deliveryStatus.value = null
    loading.value = false
    error.value = null
    lastUpdatedAt.value = null
    secondsSinceUpdate.value = 0
  }

  // Nettoyage au démontage du composant
  onUnmounted(() => {
    stopPolling()
  })

  return {
    deliveryStatus,
    loading,
    error,
    lastUpdatedAt,
    secondsSinceUpdate,
    fetchDeliveryStatus,
    confirmReception,
    startPolling,
    stopPolling,
    reset
  }
}
