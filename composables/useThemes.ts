import type { ApiResponse } from '~/types/auth'

export interface Theme {
  id: number
  name: string
  slug: string
  price: number
  description?: string
  preview_image?: string
}

export const useThemes = () => {
  const config = useRuntimeConfig()
  const themes = useState<Theme[]>('themes.list', () => [])
  const currentTheme = useState<Theme | null>('themes.current', () => null)
  const isLoading = useState<boolean>('themes.loading', () => false)

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

  // Récupérer tous les thèmes disponibles
  const fetchThemes = async (): Promise<void> => {
    isLoading.value = true
    try {
      const response = await apiRequest<Theme[]>('/themes')
      if (response.success && response.data) {
        themes.value = response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des thèmes:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Définir le thème courant
  const setCurrentTheme = (theme: Theme | null) => {
    currentTheme.value = theme
  }

  // Récupérer le thème par slug
  const getThemeBySlug = (slug: string): Theme | undefined => {
    return themes.value.find(theme => theme.slug === slug)
  }

  return {
    themes: readonly(themes),
    currentTheme: readonly(currentTheme),
    isLoading: readonly(isLoading),
    fetchThemes,
    setCurrentTheme,
    getThemeBySlug
  }
}
