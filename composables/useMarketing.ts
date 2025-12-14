import type { ApiResponse } from '~/types/auth'
import type { MarketingIntegration, MarketingIntegrationData } from '~/types/marketing'

export const useMarketing = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const integrations = useState<MarketingIntegration[]>('marketing.integrations', () => [])
  const isLoading = useState<boolean>('marketing.loading', () => false)
  const error = useState<string | null>('marketing.error', () => null)

  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    const authToken = token.value
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...(options.headers as Record<string, string> || {})
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

  const fetchIntegrations = async (shopId: number): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<MarketingIntegration[]>(`/shops/${shopId}/marketing`)
      
      if (response.success && response.data) {
        integrations.value = Array.isArray(response.data) ? response.data : []
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des intégrations')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors de la récupération des intégrations:', err)
    } finally {
      isLoading.value = false
    }
  }

  const connectIntegration = async (shopId: number, data: MarketingIntegrationData): Promise<MarketingIntegration | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<MarketingIntegration>(`/shops/${shopId}/marketing`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      if (response.success && response.data) {
        const existingIndex = integrations.value.findIndex(i => i.platform === response.data!.platform)
        if (existingIndex !== -1) {
          integrations.value[existingIndex] = response.data
        } else {
          integrations.value.push(response.data)
        }
        return response.data
      } else {
        throw new Error(response.message || 'Erreur lors de la connexion')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors de la connexion de l\'intégration:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateIntegration = async (shopId: number, integrationId: number, data: Partial<MarketingIntegrationData>): Promise<MarketingIntegration | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<MarketingIntegration>(`/shops/${shopId}/marketing/${integrationId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      
      if (response.success && response.data) {
        const index = integrations.value.findIndex(i => i.id === integrationId)
        if (index !== -1) {
          integrations.value[index] = response.data
        }
        return response.data
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors de la mise à jour de l\'intégration:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const toggleIntegration = async (shopId: number, integrationId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<MarketingIntegration>(`/shops/${shopId}/marketing/${integrationId}/toggle`, {
        method: 'PATCH'
      })
      
      if (response.success && response.data) {
        const index = integrations.value.findIndex(i => i.id === integrationId)
        if (index !== -1) {
          integrations.value[index] = response.data
        }
        return true
      } else {
        throw new Error(response.message || 'Erreur lors du changement de statut')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors du changement de statut:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const deleteIntegration = async (shopId: number, integrationId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/shops/${shopId}/marketing/${integrationId}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        integrations.value = integrations.value.filter(i => i.id !== integrationId)
        return true
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors de la suppression de l\'intégration:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getIntegrationByPlatform = (platform: string): MarketingIntegration | undefined => {
    return integrations.value.find(i => i.platform === platform)
  }

  const resetIntegrations = (): void => {
    integrations.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    integrations: readonly(integrations),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    fetchIntegrations,
    connectIntegration,
    updateIntegration,
    toggleIntegration,
    deleteIntegration,
    getIntegrationByPlatform,
    resetIntegrations
  }
}
