import type { ApiResponse, User } from '~/types/auth'

export interface UpgradeData {
  phone: string
  country: string
}

export const useUpgrade = () => {
  const config = useRuntimeConfig()
  const { user, setUser, setToken } = useAuth()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Convertir un compte client en compte vendeur
   */
  const upgradeToVendor = async (upgradeData: UpgradeData): Promise<ApiResponse<{ user: User, token: string }>> => {
    isLoading.value = true
    error.value = null

    try {
      // Récupérer le token actuel
      const token = process.client ? localStorage.getItem('auth_token') : null
      
      if (!token) {
        throw new Error('Vous devez être connecté pour effectuer cette action.')
      }

      const response = await fetch(`${config.public.apiBase}/upgrade-to-vendor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(upgradeData)
      })

      const data = await response.json()

      if (!response.ok) {
        // Gérer les erreurs de validation (422)
        if (response.status === 422) {
          error.value = data.message || 'Erreurs de validation'
          return {
            success: false,
            message: data.message || 'Erreurs de validation',
            errors: data.errors
          }
        }
        
        throw new Error(data.message || 'Erreur lors de la conversion du compte')
      }

      if (data.success && data.token && data.user) {
        // Mettre à jour le token et l'utilisateur dans le state global
        setToken(data.token)
        setUser(data.user)
        
        // Mettre à jour le localStorage
        if (process.client) {
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('user_role', 'vendor')
        }
      }

      return data
    } catch (err: any) {
      error.value = err.message || 'Une erreur est survenue'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Vérifier si l'utilisateur peut devenir vendeur
   */
  const canUpgrade = computed(() => {
    return user.value && user.value.role === 'client' && user.value.status === 'active'
  })

  return {
    upgradeToVendor,
    canUpgrade,
    isLoading: readonly(isLoading),
    error: readonly(error)
  }
}
