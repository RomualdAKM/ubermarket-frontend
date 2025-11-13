import type { ApiResponse } from '~/types/auth'
import type { Subcategory } from '~/types/product'

export const useSubcategories = () => {
  const config = useRuntimeConfig()
  const subcategories = useState<Subcategory[]>('subcategories', () => [])
  const isLoading = useState<boolean>('subcategories.loading', () => false)
  const error = useState<string | null>('subcategories.error', () => null)

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

  // Récupérer les sous-catégories d'une catégorie
  const fetchSubcategoriesByCategory = async (categoryId: number): Promise<Subcategory[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<Subcategory[]>(`/categories/${categoryId}/subcategories`)
      
      if (response.success && response.data) {
        // Mettre à jour le cache avec les nouvelles sous-catégories
        const existingSubcategories = subcategories.value.filter(sub => sub.category_id !== categoryId)
        subcategories.value = [...existingSubcategories, ...response.data]
        return response.data
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des sous-catégories')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors de la récupération des sous-catégories:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  // Obtenir les sous-catégories d'une catégorie depuis le cache
  const getSubcategoriesByCategory = (categoryId: number): Subcategory[] => {
    return subcategories.value.filter(subcategory => subcategory.category_id === categoryId)
  }

  // Obtenir une sous-catégorie par son ID
  const getSubcategoryById = (id: number): Subcategory | undefined => {
    return subcategories.value.find(subcategory => subcategory.id === id)
  }

  // Obtenir une sous-catégorie par son slug
  const getSubcategoryBySlug = (slug: string): Subcategory | undefined => {
    return subcategories.value.find(subcategory => subcategory.slug === slug)
  }

  // Réinitialiser les sous-catégories
  const resetSubcategories = (): void => {
    subcategories.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    // État
    subcategories: readonly(subcategories),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Actions
    fetchSubcategoriesByCategory,
    getSubcategoriesByCategory,
    getSubcategoryById,
    getSubcategoryBySlug,
    resetSubcategories
  }
}