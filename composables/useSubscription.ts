/**
 * Composable pour la gestion des abonnements
 */

export interface SubscriptionPlan {
  id: number
  code: string
  name: string
  description: string
  price: number
  commission_rate: number
  trial_days: number
  max_shops: number
  max_products: number
  max_pages: number
  max_collaborators: number
  has_custom_domain: boolean
  has_delivery_module: boolean
  has_promo_module: boolean
  has_marketing_module: boolean
  has_custom_payment_keys: boolean
  support_level: 'standard' | 'priority' | 'priority_24_7' | 'dedicated'
  display_order: number
  is_active: boolean
  is_popular: boolean
}

export interface SubscriptionInfo {
  plan: {
    code: string
    name: string
    price: number
    commission_rate: number
  } | null
  status: string
  is_active: boolean
  is_trial: boolean
  trial_ends_at: string | null
  expires_at: string | null
  started_at: string | null
  commission_balance: number
  limits: {
    shops: number
    products: number
    pages: number
    collaborators: number
  } | null
  modules: {
    custom_domain: boolean
    delivery: boolean
    promo: boolean
    marketing: boolean
    custom_payment_keys: boolean
  } | null
}

export interface SubscriptionPayment {
  id: number
  plan_code: string
  plan_name: string
  amount: number
  currency: string
  payment_method: string
  status: string
  period_start: string
  period_end: string
  invoice_number: string
  created_at: string
}

export const useSubscription = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  
  const plans = useState<SubscriptionPlan[]>('subscription.plans', () => [])
  const currentSubscription = useState<SubscriptionInfo | null>('subscription.current', () => null)
  const paymentHistory = useState<SubscriptionPayment[]>('subscription.payments', () => [])
  const loading = useState<boolean>('subscription.loading', () => false)
  const error = useState<string | null>('subscription.error', () => null)

  // Fonction utilitaire pour les requêtes API
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

  // Récupérer tous les plans disponibles
  const fetchPlans = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await apiRequest('/subscription/plans')
      if (response.success) {
        plans.value = response.plans
      }
      return response.plans
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Récupérer l'abonnement actuel de l'utilisateur
  const fetchCurrentSubscription = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await apiRequest('/subscription/current')
      if (response.success) {
        currentSubscription.value = response.subscription
      }
      return response.subscription
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Vérifier les limites pour une ressource
  const checkLimits = async (resource: string, currentCount: number) => {
    try {
      const response = await apiRequest('/subscription/check-limits', {
        method: 'POST',
        body: JSON.stringify({ resource, current_count: currentCount })
      })
      return response
    } catch (e: any) {
      throw e
    }
  }

  // Vérifier l'accès à un module
  const checkModuleAccess = async (module: string) => {
    try {
      const response = await apiRequest('/subscription/check-module', {
        method: 'POST',
        body: JSON.stringify({ module })
      })
      return response.has_access
    } catch (e: any) {
      throw e
    }
  }

  // Initier un paiement d'abonnement
  const initiatePayment = async (planCode: string, paymentMethod: string, returnUrl: string, cancelUrl?: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await apiRequest('/subscription/pay', {
        method: 'POST',
        body: JSON.stringify({
          plan_code: planCode,
          payment_method: paymentMethod,
          return_url: returnUrl,
          cancel_url: cancelUrl || returnUrl
        })
      })
      return response
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Vérifier et finaliser un paiement
  const verifyPayment = async (paymentId: number, gatewayId?: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await apiRequest('/subscription/verify', {
        method: 'POST',
        body: JSON.stringify({
          payment_id: paymentId,
          gateway_id: gatewayId
        })
      })
      
      // Rafraîchir l'abonnement si paiement réussi
      if (response.success && response.status === 'completed') {
        await fetchCurrentSubscription()
      }
      
      return response
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Changer de plan (pour plans sans paiement)
  const changePlan = async (planCode: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await apiRequest('/subscription/change-plan', {
        method: 'POST',
        body: JSON.stringify({ plan_code: planCode })
      })
      
      if (response.success) {
        currentSubscription.value = response.subscription
      }
      
      return response
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Récupérer l'historique des paiements
  const fetchPaymentHistory = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await apiRequest('/subscription/payments')
      if (response.success) {
        paymentHistory.value = response.payments
      }
      return response.payments
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Helpers
  const isUnlimited = (limit: number) => limit === -1
  
  const formatLimit = (limit: number) => {
    if (limit === -1) return 'Illimité'
    return limit.toString()
  }

  const getPlanByCode = (code: string) => {
    return plans.value.find(p => p.code === code)
  }

  const canCreate = (resource: string, currentCount: number) => {
    if (!currentSubscription.value?.limits) return false
    const limit = currentSubscription.value.limits[resource as keyof typeof currentSubscription.value.limits]
    if (limit === -1) return true
    return currentCount < limit
  }

  const hasModule = (module: string) => {
    if (!currentSubscription.value?.modules) return false
    return currentSubscription.value.modules[module as keyof typeof currentSubscription.value.modules]
  }

  return {
    plans: readonly(plans),
    currentSubscription: readonly(currentSubscription),
    paymentHistory: readonly(paymentHistory),
    loading: readonly(loading),
    error: readonly(error),
    
    fetchPlans,
    fetchCurrentSubscription,
    checkLimits,
    checkModuleAccess,
    initiatePayment,
    verifyPayment,
    changePlan,
    fetchPaymentHistory,
    
    // Helpers
    isUnlimited,
    formatLimit,
    getPlanByCode,
    canCreate,
    hasModule
  }
}
