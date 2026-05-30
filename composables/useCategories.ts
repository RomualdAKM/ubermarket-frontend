import type { ApiResponse } from '~/types/auth'

export interface Category {
  id: number
  name: string
  slug: string
}

// ✅ NOUVEAU : interface pour les sous-catégories
export interface Subcategory {
  id: number
  name: string
  slug: string
  category_id: number
}

export const useCategories = () => {
  const config = useRuntimeConfig()
  const categories = useState<Category[]>('categories', () => [])
  const isLoading = useState<boolean>('categories.loading', () => false)
  const error = useState<string | null>('categories.error', () => null)

  // ✅ NOUVEAU : états pour les sous-catégories
  const subcategories = useState<Subcategory[]>('subcategories', () => [])
  const subcategoriesLoading = useState<boolean>('subcategories.loading', () => false)

  // Fonction utilitaire pour les requêtes API (inchangée)
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

  // Récupérer toutes les catégories (inchangée)
  const fetchCategories = async (): Promise<void> => {
    if (categories.value.length > 0) return
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

  // ✅ NOUVEAU : récupérer les sous-catégories d'une catégorie
  const fetchSubcategories = async (categoryId: number): Promise<void> => {
    subcategories.value = []
    subcategoriesLoading.value = true
    try {
      const response = await apiRequest<Subcategory[]>(`/categories/${categoryId}/subcategories`)
      if (response.success && response.data) {
        subcategories.value = response.data
      }
    } catch (err: any) {
      console.error('Erreur sous-catégories:', err)
    } finally {
      subcategoriesLoading.value = false
    }
  }

  // Obtenir une catégorie par son ID (inchangée)
  const getCategoryById = (id: number): Category | undefined => {
    return categories.value.find(category => category.id === id)
  }

  // Obtenir une catégorie par son slug (inchangée)
  const getCategoryBySlug = (slug: string): Category | undefined => {
    return categories.value.find(category => category.slug === slug)
  }

  // Réinitialiser les catégories (inchangée)
  const resetCategories = (): void => {
    categories.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    // États existants
    categories: readonly(categories),
    isLoading: readonly(isLoading),
    error: readonly(error),
    // Actions existantes
    fetchCategories,
    getCategoryById,
    getCategoryBySlug,
    resetCategories,
    // ✅ NOUVEAU
    subcategories: readonly(subcategories),
    subcategoriesLoading: readonly(subcategoriesLoading),
    fetchSubcategories,
  }
}