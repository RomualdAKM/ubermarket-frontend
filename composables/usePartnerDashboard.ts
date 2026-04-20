export interface PartnerCourier {
  id: number
  name: string
  email: string
  phone: string
  coverage_zones: string[]
  status: 'active' | 'inactive'
  is_active: boolean
  deliveries_count: number
  total_earnings: number
  created_at: string
}

export interface PartnerFinances {
  total_earnings: number
  pending_earnings: number
  available_balance: number
  commission_rate: number
  total_deliveries: number
  couriers_breakdown: Array<{
    courier_id: number
    courier_name: string
    deliveries_count: number
    earnings: number
  }>
  monthly_summary: Array<{
    month: string
    earnings: number
    deliveries: number
  }>
  withdrawals: Array<{
    id: number
    amount: number
    status: 'pending' | 'approved' | 'rejected' | 'completed'
    created_at: string
  }>
}

export interface PartnerStats {
  total_couriers: number
  active_couriers: number
  monthly_deliveries: number
  monthly_earnings: number
  total_earnings: number
}

export const usePartnerDashboard = () => {
  const config = useRuntimeConfig()
  const { courierUser, courierToken } = useCourierDashboard()

  const isPartner = computed(() => {
    return courierUser.value?.courier_type === 'delivery_partner' || courierUser.value?.role === 'delivery_partner'
  })

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

    const response = await fetch(`${config.public.apiBase}${endpoint}`, {
      ...options,
      headers
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
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
  }

  // Récupérer les statistiques partenaire
  const getPartnerStats = async (): Promise<PartnerStats> => {
    const response = await apiRequest('/courier/partner/stats')
    return response.data || response
  }

  // Récupérer les livreurs du partenaire
  const getPartnerCouriers = async (): Promise<PartnerCourier[]> => {
    const response = await apiRequest('/courier/partner/couriers')
    return response.data || response.couriers || []
  }

  // Ajouter un livreur au partenaire
  const addPartnerCourier = async (data: {
    name: string
    email: string
    phone: string
    password: string
    zones: string[]
  }) => {
    return await apiRequest('/courier/partner/couriers', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Activer/Désactiver un livreur
  const togglePartnerCourier = async (id: number) => {
    return await apiRequest(`/courier/partner/couriers/${id}/toggle`, {
      method: 'PUT'
    })
  }

  // Récupérer les finances du partenaire
  const getPartnerFinances = async (): Promise<PartnerFinances> => {
    const response = await apiRequest('/courier/partner/finances')
    return response.data || response
  }

  // Demander un retrait
  const requestPartnerWithdrawal = async (amount: number) => {
    return await apiRequest('/courier/partner/withdrawals', {
      method: 'POST',
      body: JSON.stringify({ amount })
    })
  }

  return {
    isPartner,
    getPartnerStats,
    getPartnerCouriers,
    addPartnerCourier,
    togglePartnerCourier,
    getPartnerFinances,
    requestPartnerWithdrawal
  }
}
