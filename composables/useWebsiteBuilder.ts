import type { ApiResponse } from '~/types/auth'

// ========== TYPES ==========

export interface BlockContent {
  [key: string]: any
}

export interface BlockStyle {
  // Layout
  alignment?: 'left' | 'center' | 'right'
  maxWidth?: string
  height?: 'auto' | 'small' | 'medium' | 'large' | 'full'
  verticalSpacing?: 'none' | 'small' | 'medium' | 'large'
  horizontalSpacing?: 'none' | 'small' | 'medium' | 'large'
  // Couleurs
  backgroundColor?: string
  textColor?: string
  // Background
  backgroundType?: 'color' | 'gradient' | 'image'
  backgroundGradient?: string
  backgroundImage?: string
  backgroundOverlay?: number
  // Padding
  padding?: {
    top: number
    bottom: number
    left?: number
    right?: number
  }
}

export interface BlockTypography {
  // Titre
  titleFont?: string
  titleSize?: 'small' | 'medium' | 'large' | 'xlarge'
  titleWeight?: '400' | '500' | '600' | '700' | '800'
  titleColor?: string
  titleLetterSpacing?: 'tight' | 'normal' | 'wide'
  titleTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  titleLineHeight?: 'tight' | 'normal' | 'relaxed'
  // Sous-titre
  subtitleFont?: string
  subtitleSize?: 'small' | 'medium' | 'large'
  subtitleOpacity?: number
  subtitleColor?: string
  // Texte general
  textSize?: string
}

export interface BlockAnimation {
  type: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'bounce'
  duration?: number
  delay?: number
  scrollTrigger?: boolean
}

export interface BlockAdvanced {
  cssId?: string
  cssClasses?: string
  elementSpacing?: 'none' | 'small' | 'medium' | 'large'
  verticalAlign?: 'top' | 'center' | 'bottom'
}

export interface ButtonConfig {
  text?: string
  url?: string
  target?: '_self' | '_blank'
  color?: string
  textColor?: string
  size?: 'small' | 'medium' | 'large'
  width?: 'auto' | 'full'
  hoverEffect?: 'none' | 'lift' | 'glow' | 'scale'
  alignment?: 'left' | 'center' | 'right'
}

export interface PageSection {
  id: string
  type: BlockType
  template: string
  order: number
  content: BlockContent
  style: BlockStyle
  typography?: BlockTypography
  animation?: BlockAnimation
  advanced?: BlockAdvanced
}

export interface PageSettings {
  seo?: {
    title?: string
    description?: string
  }
  global?: {
    primaryColor?: string
    fontFamily?: string
    containerWidth?: string
  }
}

export interface WebsitePage {
  id: number
  shop_id: number
  title: string
  slug: string
  sections: PageSection[]
  settings: PageSettings | null
  is_homepage: boolean
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

// Types de blocs disponibles
export type BlockType = 
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'cta'
  | 'text'
  | 'image'
  | 'gallery'
  | 'video'
  | 'faq'
  | 'contact'
  | 'countdown'
  | 'social'
  | 'spacer'
  | 'divider'

// Templates par type de bloc
export interface BlockTemplate {
  id: string
  name: string
  preview?: string
  defaultContent: BlockContent
  defaultStyle: BlockStyle
  defaultTypography?: Record<string, any>
}

export interface BlockDefinition {
  type: BlockType
  name: string
  icon: string
  description: string
  templates: BlockTemplate[]
}

// ========== COMPOSABLE ==========

export const useWebsiteBuilder = () => {
  const config = useRuntimeConfig()
  
  // États
  const pages = useState<WebsitePage[]>('website.pages', () => [])
  const currentPage = useState<WebsitePage | null>('website.currentPage', () => null)
  const isLoading = useState<boolean>('website.loading', () => false)
  const isSaving = useState<boolean>('website.saving', () => false)
  const error = useState<string | null>('website.error', () => null)
  
  // État du builder
  const selectedSectionId = useState<string | null>('builder.selectedSection', () => null)
  const isDragging = useState<boolean>('builder.isDragging', () => false)
  const hasUnsavedChanges = useState<boolean>('builder.unsavedChanges', () => false)

  // Fonction utilitaire pour les requêtes API authentifiées
  const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    const token = process.client ? localStorage.getItem('auth_token') : null

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

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
    } catch (err: any) {
      throw new Error(err.message || 'Erreur de connexion au serveur')
    }
  }

  // ========== CRUD PAGES ==========

  /**
   * Récupérer toutes les pages d'une boutique
   */
  const fetchPages = async (shopId: number): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiRequest<WebsitePage[]>(`/shops/${shopId}/pages`)
      if (response.success && response.data) {
        pages.value = response.data
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors du chargement des pages:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer une page spécifique
   */
  const fetchPage = async (shopId: number, pageId: number): Promise<WebsitePage | null> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiRequest<WebsitePage>(`/shops/${shopId}/pages/${pageId}`)
      if (response.success && response.data) {
        currentPage.value = response.data
        return response.data
      }
      return null
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors du chargement de la page:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Créer une nouvelle page
   */
  const createPage = async (
    shopId: number,
    data: { title: string; slug?: string; is_homepage?: boolean }
  ): Promise<WebsitePage | null> => {
    isSaving.value = true
    error.value = null
    try {
      const response = await apiRequest<WebsitePage>(`/shops/${shopId}/pages`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      if (response.success && response.data) {
        // Ajouter la nouvelle page à la liste
        pages.value = [...pages.value, response.data]
        return response.data
      }
      return null
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Mettre à jour une page
   */
  const updatePage = async (
    shopId: number,
    pageId: number,
    data: Partial<WebsitePage>
  ): Promise<WebsitePage | null> => {
    isSaving.value = true
    error.value = null
    try {
      const response = await apiRequest<WebsitePage>(`/shops/${shopId}/pages/${pageId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      
      if (response.success && response.data) {
        // Mettre à jour dans la liste
        const index = pages.value.findIndex(p => p.id === pageId)
        if (index !== -1) {
          pages.value[index] = response.data
        }
        if (currentPage.value?.id === pageId) {
          currentPage.value = response.data
        }
        hasUnsavedChanges.value = false
        return response.data
      }
      return null
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Mettre à jour uniquement les sections d'une page
   */
  const updateSections = async (
    shopId: number,
    pageId: number,
    sections: PageSection[]
  ): Promise<boolean> => {
    isSaving.value = true
    error.value = null
    try {
      const response = await apiRequest<WebsitePage>(`/shops/${shopId}/pages/${pageId}/sections`, {
        method: 'PUT',
        body: JSON.stringify({ sections })
      })
      
      if (response.success && response.data) {
        // Mettre à jour dans la liste
        const index = pages.value.findIndex(p => p.id === pageId)
        if (index !== -1) {
          pages.value[index] = response.data
        }
        if (currentPage.value?.id === pageId) {
          currentPage.value = response.data
        }
        hasUnsavedChanges.value = false
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Supprimer une page
   */
  const deletePage = async (shopId: number, pageId: number): Promise<boolean> => {
    isSaving.value = true
    error.value = null
    try {
      const response = await apiRequest<any>(`/shops/${shopId}/pages/${pageId}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        // Retirer de la liste
        pages.value = pages.value.filter(p => p.id !== pageId)
        if (currentPage.value?.id === pageId) {
          currentPage.value = null
        }
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Basculer le statut de publication
   */
  const togglePublish = async (shopId: number, pageId: number): Promise<WebsitePage | null> => {
    isSaving.value = true
    error.value = null
    try {
      const response = await apiRequest<WebsitePage>(`/shops/${shopId}/pages/${pageId}/toggle-publish`, {
        method: 'POST'
      })
      
      if (response.success && response.data) {
        // Mettre à jour dans la liste
        const index = pages.value.findIndex(p => p.id === pageId)
        if (index !== -1) {
          pages.value[index] = response.data
        }
        if (currentPage.value?.id === pageId) {
          currentPage.value = response.data
        }
        return response.data
      }
      return null
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Définir comme page d'accueil
   */
  const setAsHomepage = async (shopId: number, pageId: number): Promise<boolean> => {
    isSaving.value = true
    error.value = null
    try {
      const response = await apiRequest<WebsitePage>(`/shops/${shopId}/pages/${pageId}/set-homepage`, {
        method: 'POST'
      })
      
      if (response.success) {
        // Mettre à jour toutes les pages (une seule peut être homepage)
        pages.value = pages.value.map(p => ({
          ...p,
          is_homepage: p.id === pageId
        }))
        if (currentPage.value?.id === pageId) {
          currentPage.value = { ...currentPage.value, is_homepage: true }
        }
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Dupliquer une page
   */
  const duplicatePage = async (shopId: number, pageId: number): Promise<WebsitePage | null> => {
    isSaving.value = true
    error.value = null
    try {
      const response = await apiRequest<WebsitePage>(`/shops/${shopId}/pages/${pageId}/duplicate`, {
        method: 'POST'
      })
      
      if (response.success && response.data) {
        pages.value = [...pages.value, response.data]
        return response.data
      }
      return null
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Uploader une image
   */
  const uploadImage = async (shopId: number, file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await apiRequest<{ path: string; url: string }>(`/shops/${shopId}/pages-upload`, {
        method: 'POST',
        body: formData
      })
      
      if (response.success && response.data) {
        return response.data.url
      }
      return null
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // ========== GESTION DES SECTIONS ==========

  /**
   * Générer un ID unique pour une section
   */
  const generateSectionId = (): string => {
    return crypto.randomUUID ? crypto.randomUUID() : 
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
  }

  /**
   * Ajouter une section à la page courante
   */
  const addSection = (type: BlockType, template: BlockTemplate, afterSectionId?: string): void => {
    if (!currentPage.value) return

    const newSection: PageSection = {
      id: generateSectionId(),
      type,
      template: template.id,
      order: currentPage.value.sections.length,
      content: { ...template.defaultContent },
      style: { ...template.defaultStyle },
      animation: { type: 'none' }
    }

    let sections = [...currentPage.value.sections]
    
    if (afterSectionId) {
      const index = sections.findIndex(s => s.id === afterSectionId)
      if (index !== -1) {
        sections.splice(index + 1, 0, newSection)
      } else {
        sections.push(newSection)
      }
    } else {
      sections.push(newSection)
    }

    // Réordonner
    sections = sections.map((s, i) => ({ ...s, order: i }))
    
    currentPage.value = {
      ...currentPage.value,
      sections
    }
    hasUnsavedChanges.value = true
    selectedSectionId.value = newSection.id
  }

  /**
   * Supprimer une section
   */
  const removeSection = (sectionId: string): void => {
    if (!currentPage.value) return

    const sections = currentPage.value.sections
      .filter(s => s.id !== sectionId)
      .map((s, i) => ({ ...s, order: i }))

    currentPage.value = {
      ...currentPage.value,
      sections
    }
    hasUnsavedChanges.value = true
    
    if (selectedSectionId.value === sectionId) {
      selectedSectionId.value = null
    }
  }

  /**
   * Dupliquer une section
   */
  const duplicateSection = (sectionId: string): void => {
    if (!currentPage.value) return

    const originalSection = currentPage.value.sections.find(s => s.id === sectionId)
    if (!originalSection) return

    const newSection: PageSection = {
      ...JSON.parse(JSON.stringify(originalSection)),
      id: generateSectionId()
    }

    const index = currentPage.value.sections.findIndex(s => s.id === sectionId)
    const sections = [...currentPage.value.sections]
    sections.splice(index + 1, 0, newSection)

    currentPage.value = {
      ...currentPage.value,
      sections: sections.map((s, i) => ({ ...s, order: i }))
    }
    hasUnsavedChanges.value = true
    selectedSectionId.value = newSection.id
  }

  /**
   * Déplacer une section (haut/bas)
   */
  const moveSection = (sectionId: string, direction: 'up' | 'down'): void => {
    if (!currentPage.value) return

    const sections = [...currentPage.value.sections]
    const index = sections.findIndex(s => s.id === sectionId)
    
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === sections.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const [removed] = sections.splice(index, 1)
    sections.splice(newIndex, 0, removed)

    currentPage.value = {
      ...currentPage.value,
      sections: sections.map((s, i) => ({ ...s, order: i }))
    }
    hasUnsavedChanges.value = true
  }

  /**
   * Réorganiser les sections (drag & drop)
   */
  const reorderSections = (newOrder: string[]): void => {
    if (!currentPage.value) return

    const sectionsMap = new Map(currentPage.value.sections.map(s => [s.id, s]))
    const reordered = newOrder
      .map(id => sectionsMap.get(id))
      .filter((s): s is PageSection => s !== undefined)
      .map((s, i) => ({ ...s, order: i }))

    currentPage.value = {
      ...currentPage.value,
      sections: reordered
    }
    hasUnsavedChanges.value = true
  }

  /**
   * Mettre à jour le contenu d'une section
   */
  const updateSectionContent = (sectionId: string, content: BlockContent): void => {
    if (!currentPage.value) return

    currentPage.value = {
      ...currentPage.value,
      sections: currentPage.value.sections.map(s =>
        s.id === sectionId ? { ...s, content: { ...s.content, ...content } } : s
      )
    }
    hasUnsavedChanges.value = true
  }

  /**
   * Mettre à jour le style d'une section
   */
  const updateSectionStyle = (sectionId: string, style: Partial<BlockStyle>): void => {
    if (!currentPage.value) return

    currentPage.value = {
      ...currentPage.value,
      sections: currentPage.value.sections.map(s =>
        s.id === sectionId ? { ...s, style: { ...s.style, ...style } } : s
      )
    }
    hasUnsavedChanges.value = true
  }

  /**
   * Mettre à jour la typographie d'une section
   */
  const updateSectionTypography = (sectionId: string, typography: Partial<BlockTypography>): void => {
    if (!currentPage.value) return

    currentPage.value = {
      ...currentPage.value,
      sections: currentPage.value.sections.map(s =>
        s.id === sectionId ? { ...s, typography: { ...s.typography, ...typography } } : s
      )
    }
    hasUnsavedChanges.value = true
  }

  /**
   * Mettre à jour l'animation d'une section
   */
  const updateSectionAnimation = (sectionId: string, animation: Partial<BlockAnimation>): void => {
    if (!currentPage.value) return

    currentPage.value = {
      ...currentPage.value,
      sections: currentPage.value.sections.map(s =>
        s.id === sectionId ? { ...s, animation: { ...s.animation, ...animation } } : s
      )
    }
    hasUnsavedChanges.value = true
  }

  /**
   * Mettre à jour les options avancées d'une section
   */
  const updateSectionAdvanced = (sectionId: string, advanced: Partial<BlockAdvanced>): void => {
    if (!currentPage.value) return

    currentPage.value = {
      ...currentPage.value,
      sections: currentPage.value.sections.map(s =>
        s.id === sectionId ? { ...s, advanced: { ...s.advanced, ...advanced } } : s
      )
    }
    hasUnsavedChanges.value = true
  }

  /**
   * Récupérer la section sélectionnée
   */
  const getSelectedSection = computed((): PageSection | null => {
    if (!currentPage.value || !selectedSectionId.value) return null
    return currentPage.value.sections.find(s => s.id === selectedSectionId.value) || null
  })

  // ========== ROUTES PUBLIQUES ==========

  /**
   * Récupérer les pages publiées d'une boutique (route publique)
   */
  const fetchPublicPages = async (subdomain: string): Promise<WebsitePage[]> => {
    try {
      const response = await fetch(`${config.public.apiBase}/shop/${subdomain}/pages`)
      const data = await response.json()
      
      if (data.success && data.data) {
        return data.data
      }
      return []
    } catch (err) {
      console.error('Erreur lors du chargement des pages publiques:', err)
      return []
    }
  }

  /**
   * Récupérer une page publique par slug
   */
  const fetchPublicPage = async (subdomain: string, slug: string): Promise<WebsitePage | null> => {
    try {
      const response = await fetch(`${config.public.apiBase}/shop/${subdomain}/pages/${slug}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        return data.data
      }
      return null
    } catch (err) {
      console.error('Erreur lors du chargement de la page publique:', err)
      return null
    }
  }

  // ========== RESET ==========

  const resetBuilder = (): void => {
    currentPage.value = null
    selectedSectionId.value = null
    hasUnsavedChanges.value = false
  }

  return {
    // États
    pages: readonly(pages),
    currentPage,
    isLoading: readonly(isLoading),
    isSaving: readonly(isSaving),
    error: readonly(error),
    selectedSectionId,
    isDragging,
    hasUnsavedChanges: readonly(hasUnsavedChanges),
    
    // CRUD Pages
    fetchPages,
    fetchPage,
    createPage,
    updatePage,
    updateSections,
    deletePage,
    togglePublish,
    setAsHomepage,
    duplicatePage,
    uploadImage,
    
    // Gestion sections
    generateSectionId,
    addSection,
    removeSection,
    duplicateSection,
    moveSection,
    reorderSections,
    updateSectionContent,
    updateSectionStyle,
    updateSectionTypography,
    updateSectionAnimation,
    updateSectionAdvanced,
    getSelectedSection,
    
    // Routes publiques
    fetchPublicPages,
    fetchPublicPage,
    
    // Utils
    resetBuilder
  }
}
