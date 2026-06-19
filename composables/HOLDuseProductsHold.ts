import type { ApiResponse } from '~/types/auth'
import type { Product, ProductData } from '~/types/product'

interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export const useProducts = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const products = useState<Product[]>('products', () => [])
  const isLoading = useState<boolean>('products.loading', () => false)
  const error = useState<string | null>('products.error', () => null)

  // Fonction utilitaire pour les requêtes API avec authentification
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

  // Créer un produit
  const createProduct = async (shopId: number, productData: ProductData): Promise<Product | null> => {
    isLoading.value = true
    error.value = null

    try {
      // Créer FormData pour gérer les fichiers
      const formData = new FormData()
      
      // Ajouter les données de base
      formData.append('name', productData.name)
      formData.append('description', productData.description)
      formData.append('subcategory_id', productData.subcategory_id.toString())
      formData.append('price', productData.price.toString())
      formData.append('status', productData.status)
      formData.append('show_sales_count', productData.show_sales_count ? '1' : '0')

      // Ajouter les données optionnelles
      if (productData.promotional_price) {
        formData.append('promotional_price', productData.promotional_price.toString())
      }
      if (productData.promotion_start_date) {
        formData.append('promotion_start_date', productData.promotion_start_date)
      }
      if (productData.promotion_end_date) {
        formData.append('promotion_end_date', productData.promotion_end_date)
      }
      // stock_quantity est maintenant obligatoire
      formData.append('stock_quantity', productData.stock_quantity.toString())

      // Champs précommande
      if (productData.availability_type) {
        formData.append('availability_type', productData.availability_type)
      }
      if (productData.availability_type === 'preorder' && productData.preorder_payment_type) {
        formData.append('preorder_payment_type', productData.preorder_payment_type)
        if (productData.preorder_payment_type === 'deposit') {
          if (productData.deposit_amount) {
            formData.append('deposit_amount', productData.deposit_amount.toString())
          }
          if (productData.deposit_percentage) {
            formData.append('deposit_percentage', productData.deposit_percentage.toString())
          }
        }
      }

      // Ajouter le fichier numérique si présent
      if (productData.digital_file) {
        formData.append('digital_file', productData.digital_file)
      }

      // Ajouter les images et identifier l'image principale
      let primaryImageIndex = -1
      productData.images.forEach((image, index) => {
        if (image.file) {
          formData.append(`images[${index}]`, image.file)
          if (image.preview) {
            primaryImageIndex = index
          }
        }
      })
      
      // Envoyer l'index de l'image principale
      if (primaryImageIndex >= 0) {
        formData.append('primary_image_index', primaryImageIndex.toString())
      }

      // Ajouter les variantes
      productData.variants.forEach((variant, index) => {
        formData.append(`variants[${index}][name]`, variant.name)
        formData.append(`variants[${index}][value]`, variant.value)
        if (variant.price_modifier !== undefined) {
          formData.append(`variants[${index}][price_modifier]`, variant.price_modifier.toString())
        }
        if (variant.stock_quantity !== undefined) {
          formData.append(`variants[${index}][stock_quantity]`, variant.stock_quantity.toString())
        }
      })

      const response = await fetch(`${config.public.apiBase}/shops/${shopId}/products`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du produit')
      }

      if (data.success && data.data) {
        // Ajouter le nouveau produit à la liste
        products.value.unshift(data.data)
        return data.data
      } else {
        throw new Error(data.message || 'Erreur lors de la création du produit')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors de la création du produit:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Récupérer les produits d'une boutique
  const fetchShopProducts = async (shopId: number): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<PaginatedResponse<Product> | Product[]>(`/shops/${shopId}/products`)
      
      if (response.success && response.data) {
        // Laravel retourne une structure paginée, les produits sont dans data.data
        // Ou directement un tableau de produits
        const productsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data as PaginatedResponse<Product>).data
        products.value = productsData
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des produits')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors de la récupération des produits:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Obtenir un produit par son ID
  const getProductById = (id: number): Product | undefined => {
    return products.value.find(product => product.id === id)
  }

  // Récupérer les détails d'un produit spécifique
  const fetchProductDetails = async (shopId: number, productId: number): Promise<Product | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<Product>(`/shops/${shopId}/products/${productId}`)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération du produit')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors de la récupération du produit:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Supprimer un produit
  const deleteProduct = async (shopId: number, productId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/shops/${shopId}/products/${productId}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        // Retirer le produit de la liste locale
        products.value = products.value.filter(product => product.id !== productId)
        return true
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression du produit')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors de la suppression du produit:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Mettre à jour un produit
  const updateProduct = async (shopId: number, productId: number, productData: Partial<ProductData>): Promise<Product | null> => {
    isLoading.value = true
    error.value = null

    try {
      // Toujours utiliser FormData pour gérer correctement les images existantes vs nouvelles
      const formData = new FormData()
      formData.append('_method', 'PUT')
      
      // Ajouter les données de base
      if (productData.name) formData.append('name', productData.name)
      if (productData.description) formData.append('description', productData.description)
      if (productData.subcategory_id) formData.append('subcategory_id', productData.subcategory_id.toString())
      if (productData.price !== undefined) formData.append('price', productData.price.toString())
      if (productData.status) formData.append('status', productData.status)
      if (productData.stock_quantity !== undefined) formData.append('stock_quantity', productData.stock_quantity.toString())
      formData.append('show_sales_count', productData.show_sales_count ? '1' : '0')
      
      // Ajouter les données optionnelles
      if (productData.promotional_price) {
        formData.append('promotional_price', productData.promotional_price.toString())
      }
      if (productData.promotion_start_date) {
        formData.append('promotion_start_date', productData.promotion_start_date)
      }
      if (productData.promotion_end_date) {
        formData.append('promotion_end_date', productData.promotion_end_date)
      }

      // Champs précommande
      if (productData.availability_type) {
        formData.append('availability_type', productData.availability_type)
      }
      if (productData.availability_type === 'preorder' && productData.preorder_payment_type) {
        formData.append('preorder_payment_type', productData.preorder_payment_type)
        if (productData.preorder_payment_type === 'deposit') {
          if (productData.deposit_amount) {
            formData.append('deposit_amount', productData.deposit_amount.toString())
          }
          if (productData.deposit_percentage) {
            formData.append('deposit_percentage', productData.deposit_percentage.toString())
          }
        }
      }

      // Ajouter le fichier numérique si présent
      if (productData.digital_file) {
        formData.append('digital_file', productData.digital_file)
      }

      // Séparer les images existantes des nouvelles images
      let newImageIndex = 0
      let primaryImagePath: string | null = null
      let primaryNewImageIndex: number | null = null

      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image) => {
          if (image.file) {
            // Nouvelle image (fichier uploadé)
            formData.append(`images[${newImageIndex}]`, image.file)
            if (image.is_primary) {
              primaryNewImageIndex = newImageIndex
            }
            newImageIndex++
          } else if (image.id) {
            // Image existante - envoyer uniquement l'ID
            formData.append('existing_image_ids[]', image.id.toString())
            if (image.is_primary && image.image_path) {
              primaryImagePath = image.image_path
            }
          }
        })
      }

      // Envoyer l'info sur l'image principale
      if (primaryImagePath) {
        formData.append('preview_image', primaryImagePath)
      } else if (primaryNewImageIndex !== null) {
        formData.append('primary_image_index', primaryNewImageIndex.toString())
      }

      // Ajouter les variantes
      if (productData.variants && productData.variants.length > 0) {
        productData.variants.forEach((variant, index) => {
          formData.append(`variants[${index}][name]`, variant.name)
          formData.append(`variants[${index}][value]`, variant.value)
          if (variant.price_modifier !== undefined) {
            formData.append(`variants[${index}][price_modifier]`, variant.price_modifier.toString())
          }
          if (variant.stock_quantity !== undefined) {
            formData.append(`variants[${index}][stock_quantity]`, variant.stock_quantity.toString())
          }
        })
      }

      const response = await fetch(`${config.public.apiBase}/shops/${shopId}/products/${productId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du produit')
      }

      if (data.success && data.data) {
        // Mettre à jour le produit dans la liste
        const index = products.value.findIndex(p => p.id === productId)
        if (index !== -1) {
          products.value[index] = data.data
        }
        return data.data
      } else {
        throw new Error(data.message || 'Erreur lors de la mise à jour du produit')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erreur lors de la mise à jour du produit:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Réinitialiser les produits
  const resetProducts = (): void => {
    products.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    // État
    products: readonly(products),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Actions
    createProduct,
    updateProduct,
    fetchShopProducts,
    fetchProductDetails,
    deleteProduct,
    getProductById,
    resetProducts
  }
}