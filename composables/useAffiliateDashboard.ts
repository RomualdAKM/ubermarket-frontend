import { useAuth } from '~/composables/useAuth'

export const useAffiliateDashboard = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  /**
   * Fonction utilitaire pour les requêtes API affilié
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

  // ==================== REFERRAL INFO ====================

  const fetchReferralInfo = async () => {
    const res = await apiRequest('/vendor/referral')
    return res.referral || res
  }

  const fetchCommissions = async (params?: { page?: number }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', String(params.page))
    const qs = query.toString()
    const res = await apiRequest(`/vendor/referral/commissions${qs ? `?${qs}` : ''}`)
    return res.commissions || res
  }

  const fetchReferrals = async (params?: { page?: number }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', String(params.page))
    const qs = query.toString()
    const res = await apiRequest(`/vendor/referral/referrals${qs ? `?${qs}` : ''}`)
    return res.referrals || res
  }

  // ==================== WITHDRAWALS ====================

  const fetchBalance = async (currency?: string) => {
    const query = new URLSearchParams()
    if (currency) query.append('currency', currency)
    const qs = query.toString()
    const res = await apiRequest(`/vendor/withdrawals/balance${qs ? `?${qs}` : ''}`)
    return res.balance || res
  }

  const fetchWithdrawals = async (params?: { page?: number }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', String(params.page))
    const qs = query.toString()
    const res = await apiRequest(`/vendor/withdrawals${qs ? `?${qs}` : ''}`)
    return res.withdrawals || res
  }

  const fetchWithdrawalConfig = async () => {
    const res = await apiRequest('/vendor/withdrawals/config')
    return res.config || res
  }

  const calculateFees = async (amount: number) => {
    const res = await apiRequest('/vendor/withdrawals/calculate-fees', {
      method: 'POST',
      body: JSON.stringify({ amount })
    })
    return res.fees || res
  }

  const requestWithdrawal = async (data: {
    amount: number
    currency?: string
    method: string
    account_details: object
  }) => {
    return await apiRequest('/vendor/withdrawals', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  const cancelWithdrawal = async (id: number) => {
    return await apiRequest(`/vendor/withdrawals/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    // Referral
    fetchReferralInfo,
    fetchCommissions,
    fetchReferrals,
    // Withdrawals
    fetchBalance,
    fetchWithdrawals,
    fetchWithdrawalConfig,
    calculateFees,
    requestWithdrawal,
    cancelWithdrawal
  }
}
