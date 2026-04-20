export interface CourierUser {
  id: number
  name: string
  email: string
  phone: string
  coverage_zones: string[]
  status: string
  courier_type: 'independent' | 'partner_employee' | 'delivery_partner'
  role?: string
  partner_id?: number
  partner_name?: string
  created_at?: string
}

export interface Delivery {
  id: number
  order_id: number
  order_reference: string
  pickup_address: string
  delivery_address: string
  status: string
  estimated_distance?: string
  estimated_time?: string
  amount?: number
  created_at: string
  updated_at?: string
  picked_up_at?: string
  delivered_at?: string
  customer_name?: string
  customer_phone?: string
}

export interface CourierEarnings {
  total_earnings: number
  pending_earnings: number
  completed_deliveries: number
  earnings_history: Array<{
    id: number
    amount: number
    status: string
    date: string
    order_reference: string
  }>
}

export interface CourierStats {
  total_deliveries: number
  completed_deliveries: number
  acceptance_rate: number
  average_delivery_time: string
  active_deliveries: number
}

export const useCourierDashboard = () => {
  const config = useRuntimeConfig()
  const courierUser = useState<CourierUser | null>('courier.user', () => null)
  const courierToken = useState<string | null>('courier.token', () => null)
  const isAuthenticated = computed(() => !!courierToken.value)

  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<any> => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    if (courierToken.value) {
      headers['Authorization'] = `Bearer ${courierToken.value}`
    }

    try {
      const response = await fetch(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          courierToken.value = null
          courierUser.value = null
          if (process.client) {
            localStorage.removeItem('courier_token')
          }
          throw new Error('Session expirée. Veuillez vous reconnecter.')
        }
        if (response.status === 403) {
          throw new Error(data.message || 'Accès non autorisé')
        }
        if (response.status === 422) {
          const err: any = new Error(data.message || 'Erreurs de validation')
          err.errors = data.errors
          throw err
        }
        throw new Error(data.message || 'Une erreur est survenue')
      }

      return data
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion au serveur')
    }
  }

  // Connexion livreur
  const courierLogin = async (email: string, password: string) => {
    const response = await apiRequest('/courier/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    if (response.success && response.token && response.user) {
      courierToken.value = response.token
      courierUser.value = response.user
      if (process.client) {
        localStorage.setItem('courier_token', response.token)
      }
    }

    return response
  }

  // Déconnexion livreur
  const courierLogout = async () => {
    try {
      if (courierToken.value) {
        await apiRequest('/courier/logout', { method: 'POST' })
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      courierToken.value = null
      courierUser.value = null
      if (process.client) {
        localStorage.removeItem('courier_token')
      }
    }
  }

  // Inscription livreur
  const courierRegister = async (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
    phone: string
    zones: string[]
  }) => {
    const response = await apiRequest('/courier/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })

    if (response.success && response.token && response.user) {
      courierToken.value = response.token
      courierUser.value = response.user
      if (process.client) {
        localStorage.setItem('courier_token', response.token)
      }
    }

    return response
  }

  // Récupérer le profil livreur
  const getCourierProfile = async () => {
    const response = await apiRequest('/courier/profile')
    if (response.success && response.data) {
      courierUser.value = response.data
    }
    return response
  }

  // Récupérer les livraisons par statut
  const getDeliveries = async (status: 'available' | 'active' | 'completed') => {
    return await apiRequest(`/courier/deliveries?status=${status}`)
  }

  // Accepter une livraison
  const acceptDelivery = async (id: number) => {
    return await apiRequest(`/courier/deliveries/${id}/accept`, { method: 'POST' })
  }

  // Refuser une livraison
  const declineDelivery = async (id: number) => {
    return await apiRequest(`/courier/deliveries/${id}/decline`, { method: 'POST' })
  }

  // Mettre à jour le statut d'une livraison
  const updateDeliveryStatus = async (id: number, status: 'picked_up' | 'in_transit' | 'delivered') => {
    return await apiRequest(`/courier/deliveries/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status })
    })
  }

  // Récupérer les revenus (uniquement livreurs indépendants)
  const getCourierEarnings = async () => {
    return await apiRequest('/courier/earnings')
  }

  // Récupérer les statistiques
  const getCourierStats = async () => {
    return await apiRequest('/courier/stats')
  }

  // Soumettre la signature de livraison
  const submitDeliverySignature = async (id: number, signature: string) => {
    return await apiRequest(`/courier/deliveries/${id}/signature`, {
      method: 'POST',
      body: JSON.stringify({ signature })
    })
  }

  // Initialiser l'authentification depuis le localStorage
  const initCourierAuth = async () => {
    if (process.client) {
      const storedToken = localStorage.getItem('courier_token')
      if (storedToken) {
        courierToken.value = storedToken
        try {
          await getCourierProfile()
        } catch {
          courierToken.value = null
          courierUser.value = null
          localStorage.removeItem('courier_token')
        }
      }
    }
  }

  return {
    courierUser: readonly(courierUser),
    courierToken: readonly(courierToken),
    isAuthenticated,
    courierLogin,
    courierLogout,
    courierRegister,
    getCourierProfile,
    getDeliveries,
    acceptDelivery,
    declineDelivery,
    updateDeliveryStatus,
    submitDeliverySignature,
    getCourierEarnings,
    getCourierStats,
    initCourierAuth
  }
}
