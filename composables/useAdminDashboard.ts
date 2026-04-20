import { useAuth } from '~/composables/useAuth'

export const useAdminDashboard = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  /**
   * Fonction utilitaire pour les requêtes API admin
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

  // ==================== STATS ====================

  const fetchAdminStats = async () => {
    return await apiRequest('/admin/stats')
  }

  // ==================== SHOPS ====================

  const fetchShops = async (params?: { search?: string; type?: string; status?: string; page?: number }) => {
    const query = new URLSearchParams()
    if (params?.search) query.append('search', params.search)
    if (params?.type) query.append('type', params.type)
    if (params?.status) query.append('status', params.status)
    if (params?.page) query.append('page', String(params.page))
    const qs = query.toString()
    return await apiRequest(`/admin/shops${qs ? `?${qs}` : ''}`)
  }

  const fetchShopDetails = async (id: number) => {
    return await apiRequest(`/admin/shops/${id}`)
  }

  const toggleShop = async (id: number) => {
    return await apiRequest(`/admin/shops/${id}/toggle`, { method: 'PUT' })
  }

  // ==================== USERS ====================

  const fetchUsers = async (params?: { search?: string; role?: string; status?: string; page?: number }) => {
    const query = new URLSearchParams()
    if (params?.search) query.append('search', params.search)
    if (params?.role) query.append('role', params.role)
    if (params?.status) query.append('status', params.status)
    if (params?.page) query.append('page', String(params.page))
    const qs = query.toString()
    return await apiRequest(`/admin/users${qs ? `?${qs}` : ''}`)
  }

  const fetchUserDetails = async (id: number) => {
    return await apiRequest(`/admin/users/${id}`)
  }

  const toggleUser = async (id: number) => {
    return await apiRequest(`/admin/users/${id}/toggle`, { method: 'PUT' })
  }

  // ==================== ORDERS ====================

  const fetchOrders = async (params?: { search?: string; status?: string; date_from?: string; date_to?: string; page?: number }) => {
    const query = new URLSearchParams()
    if (params?.search) query.append('search', params.search)
    if (params?.status) query.append('status', params.status)
    if (params?.date_from) query.append('date_from', params.date_from)
    if (params?.date_to) query.append('date_to', params.date_to)
    if (params?.page) query.append('page', String(params.page))
    const qs = query.toString()
    return await apiRequest(`/admin/orders${qs ? `?${qs}` : ''}`)
  }

  const fetchOrderStats = async () => {
    return await apiRequest('/admin/orders/stats')
  }

  // ==================== WITHDRAWALS ====================

  const fetchWithdrawals = async (params?: { status?: string; page?: number }) => {
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.page) query.append('page', String(params.page))
    const qs = query.toString()
    return await apiRequest(`/admin/withdrawals${qs ? `?${qs}` : ''}`)
  }

  const fetchWithdrawalStats = async () => {
    return await apiRequest('/admin/withdrawals/stats')
  }

  const approveWithdrawal = async (id: number) => {
    return await apiRequest(`/admin/withdrawals/${id}/approve`, { method: 'PUT' })
  }

  const completeWithdrawal = async (id: number) => {
    return await apiRequest(`/admin/withdrawals/${id}/complete`, { method: 'PUT' })
  }

  const rejectWithdrawal = async (id: number, reason: string) => {
    return await apiRequest(`/admin/withdrawals/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    })
  }

  return {
    // Stats
    fetchAdminStats,
    // Shops
    fetchShops,
    fetchShopDetails,
    toggleShop,
    // Users
    fetchUsers,
    fetchUserDetails,
    toggleUser,
    // Orders
    fetchOrders,
    fetchOrderStats,
    // Withdrawals
    fetchWithdrawals,
    fetchWithdrawalStats,
    approveWithdrawal,
    completeWithdrawal,
    rejectWithdrawal
  }
}
