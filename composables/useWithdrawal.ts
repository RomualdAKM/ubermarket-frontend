/**
 * Composable pour gérer les retraits vendeur
 */
export interface Withdrawal {
  id: number
  user_id: number
  amount: number
  aggregator_fee: number
  platform_fee: number
  net_amount: number
  currency: string
  method: 'mobile_money' | 'paypal' | 'bank_transfer'
  account_details: Record<string, string>
  status: 'pending' | 'approved' | 'completed' | 'rejected' | 'cancelled'
  admin_notes?: string
  rejected_reason?: string
  approved_at?: string
  processed_at?: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
  }
  approver?: {
    id: number
    name: string
  }
}

export interface WithdrawalBalance {
  currency: string
  available: number
  pending: number
  total_earned: number
  total_withdrawn: number
}

export interface WithdrawalConfig {
  aggregator_fee_percent: number
  aggregator_fee_fixed: number
  platform_fee_percent: number
  platform_fee_fixed: number
  min_amount: number
  release_delay_days: number
  methods: {
    [key: string]: {
      name: string
      enabled: boolean
      fields: string[]
    }
  }
}

export interface WithdrawalFees {
  amount: number
  aggregator_fee: number
  platform_fee: number
  total_fees: number
  net_amount: number
}

export interface WithdrawalRequest {
  amount: number
  currency?: string
  method: 'mobile_money' | 'paypal' | 'bank_transfer'
  account_details: {
    phone?: string
    email?: string
    bank_name?: string
    iban?: string
    bic?: string
  }
}

export const useWithdrawal = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  // États
  const balance = ref<WithdrawalBalance | null>(null)
  const withdrawalConfig = ref<WithdrawalConfig | null>(null)
  const withdrawals = ref<Withdrawal[]>([])
  const currentWithdrawal = ref<Withdrawal | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fonction utilitaire pour les requêtes API
  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
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

  // Récupérer le solde du vendeur
  const fetchBalance = async (currency?: string): Promise<WithdrawalBalance> => {
    loading.value = true
    error.value = null
    try {
      // Utiliser la devise passée en paramètre, sinon pas de filtre (le backend utilisera sa config)
      const queryParam = currency ? `?currency=${currency}` : ''
      const response = await apiRequest<{ success: boolean, balance: WithdrawalBalance }>(
        `/vendor/withdrawals/balance${queryParam}`
      )
      balance.value = response.balance
      return response.balance
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Récupérer la configuration des retraits
  const fetchConfig = async (): Promise<WithdrawalConfig> => {
    loading.value = true
    error.value = null
    try {
      const response = await apiRequest<{ success: boolean, config: WithdrawalConfig }>(
        '/vendor/withdrawals/config'
      )
      withdrawalConfig.value = response.config
      return response.config
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Calculer les frais pour un montant donné
  const calculateFees = async (amount: number): Promise<WithdrawalFees> => {
    try {
      const response = await apiRequest<{ success: boolean, fees: WithdrawalFees }>(
        '/vendor/withdrawals/calculate-fees',
        {
          method: 'POST',
          body: JSON.stringify({ amount })
        }
      )
      return response.fees
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  // Récupérer la liste des retraits
  const fetchWithdrawals = async (perPage: number = 15): Promise<Withdrawal[]> => {
    loading.value = true
    error.value = null
    try {
      const response = await apiRequest<{ success: boolean, withdrawals: { data: Withdrawal[] } }>(
        `/vendor/withdrawals?per_page=${perPage}`
      )
      withdrawals.value = response.withdrawals.data
      return response.withdrawals.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Créer une demande de retrait
  const requestWithdrawal = async (data: WithdrawalRequest): Promise<Withdrawal> => {
    loading.value = true
    error.value = null
    try {
      const response = await apiRequest<{ success: boolean, withdrawal: Withdrawal, message: string }>(
        '/vendor/withdrawals',
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      )
      // Ajouter à la liste locale
      withdrawals.value = [response.withdrawal, ...withdrawals.value]
      // Rafraîchir le solde avec la devise du retrait
      await fetchBalance(data.currency)
      return response.withdrawal
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Récupérer un retrait spécifique
  const fetchWithdrawal = async (id: number): Promise<Withdrawal> => {
    loading.value = true
    error.value = null
    try {
      const response = await apiRequest<{ success: boolean, withdrawal: Withdrawal }>(
        `/vendor/withdrawals/${id}`
      )
      currentWithdrawal.value = response.withdrawal
      return response.withdrawal
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Annuler une demande de retrait
  const cancelWithdrawal = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      await apiRequest<{ success: boolean, message: string }>(
        `/vendor/withdrawals/${id}`,
        { method: 'DELETE' }
      )
      // Mettre à jour localement
      const index = withdrawals.value.findIndex(w => w.id === id)
      if (index !== -1) {
        withdrawals.value[index].status = 'cancelled'
      }
      // Rafraîchir le solde
      if (balance.value) {
        await fetchBalance(balance.value.currency)
      }
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Helper: Formater le montant
  const formatAmount = (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  // Helper: Obtenir le libellé du statut
  const getStatusLabel = (status: Withdrawal['status']): string => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      approved: 'Approuvé',
      completed: 'Complété',
      rejected: 'Rejeté',
      cancelled: 'Annulé'
    }
    return labels[status] || status
  }

  // Helper: Obtenir la couleur du statut
  const getStatusColor = (status: Withdrawal['status']): string => {
    const colors: Record<string, string> = {
      pending: 'orange',
      approved: 'blue',
      completed: 'green',
      rejected: 'red',
      cancelled: 'gray'
    }
    return colors[status] || 'gray'
  }

  // Helper: Obtenir le libellé de la méthode
  const getMethodLabel = (method: Withdrawal['method']): string => {
    const labels: Record<string, string> = {
      mobile_money: 'Mobile Money',
      paypal: 'PayPal',
      bank_transfer: 'Virement bancaire'
    }
    return labels[method] || method
  }

  // Helper: Vérifier si le retrait peut être annulé
  const canCancel = (withdrawal: Withdrawal): boolean => {
    return withdrawal.status === 'pending'
  }

  // Helper: Vérifier si le solde est suffisant
  const hasSufficientBalance = (amount: number): boolean => {
    return balance.value ? balance.value.available >= amount : false
  }

  return {
    // États
    balance: readonly(balance),
    withdrawalConfig: readonly(withdrawalConfig),
    withdrawals: readonly(withdrawals),
    currentWithdrawal: readonly(currentWithdrawal),
    loading: readonly(loading),
    error: readonly(error),

    // Actions
    fetchBalance,
    fetchConfig,
    calculateFees,
    fetchWithdrawals,
    requestWithdrawal,
    fetchWithdrawal,
    cancelWithdrawal,

    // Helpers
    formatAmount,
    getStatusLabel,
    getStatusColor,
    getMethodLabel,
    canCancel,
    hasSufficientBalance
  }
}
