import type { ShopData, Shop, ApiResponse } from '~/types/auth'
import { useAuth } from '~/composables/useAuth'

// Type pour les infos d'accès
interface ShopAccess {
  is_owner: boolean
  is_collaborator: boolean
  role: string | null
  permissions: string[]
}

export const useShops = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const shops = useState<Shop[]>('shops.list', () => [])
  const currentShop = useState<Shop | null>('shops.current', () => null)
  const currentAccess = useState<ShopAccess | null>('shops.access', () => null)

  // Fonction utilitaire pour les requêtes API
  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }

    // Ajouter Content-Type: application/json si le corps est une chaîne (JSON)
    if (typeof options.body === 'string') {
      headers['Content-Type'] = 'application/json'
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

  // Créer une boutique
  const createShop = async (shopData: ShopData): Promise<ApiResponse<Shop>> => {
    try {
      const formData = new FormData()

      // Ajouter les données texte
      Object.entries(shopData).forEach(([key, value]) => {
        if (key !== 'logo' && value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })

      // Ajouter le logo s'il existe
      if (shopData.logo) {
        formData.append('logo', shopData.logo)
      }

      const response = await apiRequest<Shop>('/shops', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })

      if (response.success && response.data) {
        shops.value.push(response.data)
        currentShop.value = response.data
      }

      return response
    } catch (error: any) {
      throw error
    }
  }

  // Récupérer les boutiques de l'utilisateur
  const fetchShops = async (): Promise<void> => {
    try {
      const response = await apiRequest<Shop[]>('/shops')
      if (response.success && response.data) {
        shops.value = response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des boutiques:', error)
    }
  }

  // Vérifier la disponibilité d'un sous-domaine
  const checkSubdomainAvailability = async (subdomain: string): Promise<boolean> => {
    try {
      const response = await apiRequest<{ available: boolean }>('/shops/check-subdomain', {
        method: 'POST',
        body: JSON.stringify({ subdomain })
      })
      return response.data?.available || false
    } catch (error) {
      console.error('Erreur lors de la vérification du sous-domaine:', error)
      return false
    }
  }

  // Vérifier la disponibilité d'un domaine personnalisé
  const checkCustomDomainAvailability = async (customDomain: string, shopId?: number): Promise<{ available: boolean; message: string }> => {
    try {
      const body: any = { custom_domain: customDomain }
      if (shopId) {
        body.shop_id = shopId
      }

      const response = await apiRequest<{ available: boolean; message: string }>('/shops/check-domain', {
        method: 'POST',
        body: JSON.stringify(body)
      })

      return {
        available: response.data?.available || false,
        message: response.message || ''
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification du domaine:', error)
      return {
        available: false,
        message: error.message || 'Erreur lors de la vérification'
      }
    }
  }

  // Mettre à jour une boutique
  const updateShop = async (shopId: number, data: Partial<Shop>): Promise<ApiResponse<Shop>> => {
    try {
      const response = await apiRequest<Shop>(`/shops/${shopId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })

      if (response.success && response.data) {
        // Mettre à jour dans la liste
        const index = shops.value.findIndex(s => s.id === shopId)
        if (index !== -1) {
          shops.value[index] = response.data
        }

        // Mettre à jour currentShop si c'est la même boutique
        if (currentShop.value?.id === shopId) {
          currentShop.value = response.data
        }
      }

      return response
    } catch (error: any) {
      throw error
    }
  }

  // Récupérer les détails d'une boutique avec les permissions
  const fetchShopDetails = async (shopIdOrSlug: string | number): Promise<boolean> => {
    try {
      const response = await apiRequest<Shop>(`/shops/${shopIdOrSlug}`)
      if (response.success && response.data) {
        currentShop.value = response.data
        // Stocker les infos d'accès si présentes
        if ((response as any).access) {
          currentAccess.value = (response as any).access
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la boutique:', error)
      // Propager l'erreur pour que le middleware puisse la gérer
      throw error
    }
  }

  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permission: string): boolean => {
    if (!currentAccess.value) return false
    // Le propriétaire a toutes les permissions
    if (currentAccess.value.is_owner) return true
    return currentAccess.value.permissions.includes(permission)
  }

  // Vérifier si l'utilisateur a au moins une des permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!currentAccess.value) return false
    if (currentAccess.value.is_owner) return true
    return permissions.some(p => currentAccess.value!.permissions.includes(p))
  }

  // Définir la boutique courante
  const setCurrentShop = (shop: Shop | null, access?: ShopAccess) => {
    currentShop.value = shop
    if (access) {
      currentAccess.value = access
    } else if (shop === null) {
      currentAccess.value = null
    }
  }

  // Réinitialiser l'accès (pour les propriétaires)
  const setOwnerAccess = () => {
    currentAccess.value = {
      is_owner: true,
      is_collaborator: false,
      role: 'owner',
      permissions: [] // Vide car le propriétaire a tout
    }
  }

  return {
    shops: readonly(shops),
    currentShop: readonly(currentShop),
    currentAccess: readonly(currentAccess),
    createShop,
    fetchShops,
    fetchShopDetails,
    checkSubdomainAvailability,
    checkCustomDomainAvailability,
    updateShop,
    setCurrentShop,
    setOwnerAccess,
    hasPermission,
    hasAnyPermission
  }
}