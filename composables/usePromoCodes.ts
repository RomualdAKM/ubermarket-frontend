import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface PromoCode {
  id: number
  shop_id: number
  code: string
  type: 'percentage' | 'fixed_amount'
  value: number
  minimum_amount: number | null
  usage_limit: number | null
  used_count: number
  start_date: string
  end_date: string | null
  applicable_products: number[] | null
  status: 'active' | 'inactive' | 'expired'
  created_at: string
  updated_at: string
}

export interface CreatePromoCodeData {
  code: string
  type: 'percentage' | 'fixed_amount'
  value: number
  minimum_amount?: number
  usage_limit?: number
  start_date: string
  end_date?: string
  applicable_products?: number[]
}

export interface ValidatePromoCodeData {
  code: string
  cart_total: number
  product_ids?: number[]
}

export interface ValidatePromoCodeResponse {
  promo_code_id: number
  code: string
  type: 'percentage' | 'fixed_amount'
  value: number
  discount_amount: number
  new_total: number
}

export const usePromoCodes = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const promoCodes: Ref<PromoCode[]> = ref([])
  const isLoading = ref(false)
  const error: Ref<string | null> = ref(null)

  /**
   * Fonction utilitaire pour les requêtes API
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
   * Récupérer tous les codes promo d'une boutique
   */
  const fetchPromoCodes = async (shopId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<PromoCode[]>(`/shops/${shopId}/promo-codes`)
      
      if (response.success && response.data) {
        promoCodes.value = response.data
        return true
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des codes promo')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur fetchPromoCodes:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Créer un nouveau code promo
   */
  const createPromoCode = async (shopId: number, data: CreatePromoCodeData): Promise<PromoCode | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<PromoCode>(`/shops/${shopId}/promo-codes`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      if (response.success && response.data) {
        // Ajouter le nouveau code à la liste
        promoCodes.value.unshift(response.data)
        return response.data
      } else {
        throw new Error(response.message || 'Erreur lors de la création du code promo')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur createPromoCode:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mettre à jour un code promo
   */
  const updatePromoCode = async (
    shopId: number, 
    promoCodeId: number, 
    data: Partial<CreatePromoCodeData>
  ): Promise<PromoCode | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<PromoCode>(`/shops/${shopId}/promo-codes/${promoCodeId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      
      if (response.success && response.data) {
        // Mettre à jour dans la liste
        const index = promoCodes.value.findIndex(pc => pc.id === promoCodeId)
        if (index !== -1) {
          promoCodes.value[index] = response.data
        }
        return response.data
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour du code promo')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur updatePromoCode:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Supprimer un code promo
   */
  const deletePromoCode = async (shopId: number, promoCodeId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/shops/${shopId}/promo-codes/${promoCodeId}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        // Retirer de la liste
        promoCodes.value = promoCodes.value.filter(pc => pc.id !== promoCodeId)
        return true
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression du code promo')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur deletePromoCode:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Valider un code promo (route publique)
   */
  const validatePromoCode = async (
    shopSubdomain: string, 
    data: ValidatePromoCodeData
  ): Promise<ValidatePromoCodeResponse | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<ValidatePromoCodeResponse>(
        `/shop/${shopSubdomain}/promo-codes/validate`, 
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      )
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Code promo invalide')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur validatePromoCode:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    promoCodes,
    isLoading,
    error,
    fetchPromoCodes,
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    validatePromoCode
  }
}
