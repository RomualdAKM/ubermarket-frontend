import { ref } from 'vue'
import { useAuth } from './useAuth'

export interface CommercialAffiliate {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  referral_code: string
  commission_rate: number
  status: 'active' | 'suspended'
  referrals_count: number
  total_commissions: number
  referrals?: AffiliateReferral[]
  created_at: string
}

export interface AffiliateReferral {
  id: number
  name: string
  email: string
  phone: string
  created_at: string
}

export interface CreateAffiliatePayload {
  first_name: string
  last_name: string
  email: string
  phone: string
  commission_rate: number
}

export function useAdminAffiliates() {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const apiBase = config.public.apiBase

  const affiliates = ref<CommercialAffiliate[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<{ current_page: number; last_page: number; total: number }>({
    current_page: 1,
    last_page: 1,
    total: 0,
  })

  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue')
    }

    return data
  }

  /**
   * Lister les affiliés commerciaux (paginé)
   */
  const fetchAffiliates = async (page = 1): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const data = await apiRequest<any>(`/admin/referral/affiliates?page=${page}`)
      affiliates.value = data.data?.data || data.affiliates?.data || data.data || []
      if (data.data?.current_page) {
        pagination.value = {
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          total: data.data.total,
        }
      } else if (data.affiliates?.current_page) {
        pagination.value = {
          current_page: data.affiliates.current_page,
          last_page: data.affiliates.last_page,
          total: data.affiliates.total,
        }
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * Créer un affilié commercial
   */
  const createAffiliate = async (payload: CreateAffiliatePayload): Promise<CommercialAffiliate | null> => {
    loading.value = true
    error.value = null

    try {
      const data = await apiRequest<any>('/admin/referral/affiliates', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      await fetchAffiliates(pagination.value.current_page)
      return data.affiliate || data.data || data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Voir les détails d'un affilié (avec filleuls)
   */
  const fetchAffiliateDetails = async (id: number): Promise<CommercialAffiliate | null> => {
    error.value = null

    try {
      const data = await apiRequest<any>(`/admin/referral/affiliates/${id}`)
      return data.affiliate || data.data || data
    } catch (err: any) {
      error.value = err.message
      return null
    }
  }

  /**
   * Modifier le taux de commission
   */
  const updateCommissionRate = async (id: number, commission_rate: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await apiRequest<any>(`/admin/referral/affiliates/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ commission_rate }),
      })
      await fetchAffiliates(pagination.value.current_page)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Désactiver (soft-delete) un affilié
   */
  const disableAffiliate = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await apiRequest<any>(`/admin/referral/affiliates/${id}`, {
        method: 'DELETE',
      })
      await fetchAffiliates(pagination.value.current_page)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    affiliates,
    loading,
    error,
    pagination,
    fetchAffiliates,
    createAffiliate,
    fetchAffiliateDetails,
    updateCommissionRate,
    disableAffiliate,
  }
}
