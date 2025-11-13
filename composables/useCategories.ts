import type { ApiResponse } from '~/types/auth'

export interface Category {
  id: number
  name: string
  slug: string
}

export const useCategories = () => {
  const config = useRuntimeConfig()
  const categories = useState<Category[]>('categories', () => [])
  const isLoading = useState<boolean>('categories.loading', () => false)
  const error = useState<string | null>('categories.error', () => null)

  // Fonction utilitaire pour les requêtes API
  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
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

  // Récupérer toutes les catégories
  const fetchCategories = async (): Promise<void> => {
    if (categories.value.length > 0) {
      // Les catégories sont déjà chargées
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<Category[]>('/categories')
      
      if (response.success && response.data) {
        categories.value = response.data
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des catégories')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors de la récupération des catégories:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Obtenir une catégorie par son ID
  const getCategoryById = (id: number): Category | undefined => {
    return categories.value.find(category => category.id === id)
  }

  // Obtenir une catégorie par son slug
  const getCategoryBySlug = (slug: string): Category | undefined => {
    return categories.value.find(category => category.slug === slug)
  }

  // Réinitialiser les catégories (utile pour les tests ou le rechargement)
  const resetCategories = (): void => {
    categories.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    // État
    categories: readonly(categories),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Actions
    fetchCategories,
    getCategoryById,
    getCategoryBySlug,
    resetCategories
  }
}