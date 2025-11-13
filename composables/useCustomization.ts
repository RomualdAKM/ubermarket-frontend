import type { ApiResponse } from '~/types/auth'

export interface BannerCustomization {
  images: string[]
  title: string
  subtitle: string
  overlay_opacity?: number
}

export interface ColorsCustomization {
  primary: string
  secondary: string
  background: string
  text: string
}

export interface FontsCustomization {
  family: string
  size: string
  weight: string
}

export interface HomeCustomization {
  banner: BannerCustomization
  colors: ColorsCustomization
  fonts: FontsCustomization
  sections_visibility?: {
    products?: boolean
    categories?: boolean
  }
}

export interface AboutCustomization {
  text: string
  image: string
  cta: string
}

export interface FooterCustomization {
  text: string
  socialLinks: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
}

export interface ShopCustomizations {
  home?: HomeCustomization
  about?: AboutCustomization
  testimonials?: any
  terms?: { text: string }
  footer?: FooterCustomization
}

export const useCustomization = () => {
  const config = useRuntimeConfig()
  const customizations = useState<ShopCustomizations>('shop.customizations', () => ({}))
  const isLoading = useState<boolean>('customizations.loading', () => false)
  const isSaving = useState<boolean>('customizations.saving', () => false)

  // Fonction utilitaire pour les requêtes API authentifiées
  const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    // Récupérer le token depuis le localStorage (comme dans useAuth)
    const token = process.client ? localStorage.getItem('auth_token') : null

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Ne pas ajouter Content-Type si c'est un FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
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
   * Charger les customizations d'une boutique (route publique)
   */
  const fetchCustomizations = async (subdomain: string): Promise<void> => {
    isLoading.value = true
    try {
      const response = await fetch(`${config.public.apiBase}/shop/${subdomain}/customizations`)
      const data = await response.json()

      if (data.success && data.data) {
        customizations.value = data.data
      }
    } catch (error) {
      console.error('Erreur lors du chargement des customizations:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Charger les customizations d'une boutique par ID (route protégée)
   */
  const fetchCustomizationsByShopId = async (shopId: number): Promise<void> => {
    isLoading.value = true
    try {
      const response = await apiRequest<ShopCustomizations>(`/shops/${shopId}/customizations`)
      if (response.success && response.data) {
        customizations.value = response.data
      }
    } catch (error) {
      console.error('Erreur lors du chargement des customizations:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Sauvegarder une customization
   */
  const saveCustomization = async (
    shopId: number,
    pageType: 'home' | 'about' | 'testimonials' | 'terms' | 'footer',
    content: any,
    files?: { banner_images?: File[], about_image?: File }
  ): Promise<boolean> => {
    isSaving.value = true
    try {
      const formData = new FormData()
      formData.append('page_type', pageType)
      formData.append('content', JSON.stringify(content))

      // Ajouter les fichiers si présents
      if (files?.banner_images) {
        files.banner_images.forEach((file) => {
          formData.append('banner_images[]', file)
        })
      }

      if (files?.about_image) {
        formData.append('about_image', files.about_image)
      }

      const response = await apiRequest<any>(
        `/shops/${shopId}/customizations`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (response.success) {
        // Recharger les customizations après sauvegarde
        await fetchCustomizationsByShopId(shopId)
        return true
      }

      return false
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Supprimer une image du banner
   */
  const deleteBannerImage = async (shopId: number, imagePath: string): Promise<boolean> => {
    try {
      const response = await apiRequest<any>(
        `/shops/${shopId}/customizations/banner/image`,
        {
          method: 'DELETE',
          body: JSON.stringify({ image_path: imagePath })
        }
      )

      if (response.success) {
        // Recharger les customizations
        await fetchCustomizationsByShopId(shopId)
        return true
      }

      return false
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error)
      return false
    }
  }

  /**
   * Supprimer une customization complète
   */
  const deleteCustomization = async (
    shopId: number,
    pageType: 'home' | 'about' | 'testimonials' | 'terms' | 'footer'
  ): Promise<boolean> => {
    try {
      const response = await apiRequest<any>(
        `/shops/${shopId}/customizations/${pageType}`,
        {
          method: 'DELETE'
        }
      )

      if (response.success) {
        await fetchCustomizationsByShopId(shopId)
        return true
      }

      return false
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      return false
    }
  }

  return {
    customizations: readonly(customizations),
    isLoading: readonly(isLoading),
    isSaving: readonly(isSaving),
    fetchCustomizations,
    fetchCustomizationsByShopId,
    saveCustomization,
    deleteBannerImage,
    deleteCustomization
  }
}
