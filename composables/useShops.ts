import type { ShopData, Shop, ApiResponse } from '~/types/auth'
import { useAuth } from '~/composables/useAuth'

export const useShops = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const shops = useState<Shop[]>('shops.list', () => [])
  const currentShop = useState<Shop | null>('shops.current', () => null)

  // Fonction utilitaire pour les requêtes API
  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
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

  // Définir la boutique courante
  const setCurrentShop = (shop: Shop | null) => {
    currentShop.value = shop
  }

  return {
    shops: readonly(shops),
    currentShop: readonly(currentShop),
    createShop,
    fetchShops,
    checkSubdomainAvailability,
    setCurrentShop
  }
}