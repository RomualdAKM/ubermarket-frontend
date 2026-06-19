// ============================================================
// composables/useProducts.ts
// Gère le CRUD des produits — envoi en FormData (multipart)
// pour supporter les fichiers (images, PDF, MP3, MP4, ZIP…).
//
// CORRECTION "Unable to decode input" :
//   Les requêtes FormData ne doivent avoir QUE Authorization
//   dans les headers. Ajouter Accept ou Content-Type empêche
//   le navigateur d'injecter le boundary multipart → Laravel
//   ne peut pas décoder le body.
// ============================================================

import { ref } from 'vue'

export const useProducts = () => {
  const config    = useRuntimeConfig()
  const { token } = useAuth()

  const isLoading = ref(false)
  const error     = ref<string | null>(null)

  // Headers pour requêtes JSON normales (GET, DELETE)
  const jsonHeaders = () => ({
    'Content-Type':  'application/json',
    'Accept':        'application/json',
    'Authorization': `Bearer ${token.value}`,
  })

  // Headers pour requêtes FormData (POST avec fichiers)
  // UNIQUEMENT Authorization — le navigateur gère Content-Type + boundary
  const formDataHeaders = () => ({
    'Authorization': `Bearer ${token.value}`,
  })

  // ─────────────────────────────────────────────────────────────
  // buildFormData — convertit productData en FormData multipart
  // ─────────────────────────────────────────────────────────────
  const buildFormData = (productData: any): FormData => {
    const fd = new FormData()

    // Champs texte/numériques simples
    const simpleFields = [
      'name', 'description', 'subcategory_id', 'price',
      'promotional_price', 'promotion_start_date', 'promotion_end_date',
      'stock_quantity', 'status',
      'availability_type', 'preorder_payment_type',
      'deposit_amount', 'deposit_percentage',
      'primary_image_index', 'preview_image',
    ]
    for (const field of simpleFields) {
      const val = productData[field]
      if (val !== null && val !== undefined && val !== '') {
        fd.append(field, String(val))
      }
    }

    // Booléen : '1'/'0' car Laravel rejette 'true'/'false' en multipart
    fd.append('show_sales_count', productData.show_sales_count ? '1' : '0')

    // Images produit
    if (Array.isArray(productData.images)) {
      let imgIndex = 0
      productData.images.forEach((img: any) => {
        if (img.file instanceof File) {
          fd.append(`images[${imgIndex}]`, img.file)
          imgIndex++
        }
      })
    }

    // Fichier numérique (PDF, MP3, MP4, ZIP…)
    if (productData.digital_file instanceof File) {
      fd.append('digital_file', productData.digital_file)
    }

    // Variantes v1
    if (Array.isArray(productData.variants)) {
      productData.variants.forEach((v: any, i: number) => {
        if (v.name && v.value) {
          fd.append(`variants[${i}][name]`,           String(v.name))
          fd.append(`variants[${i}][value]`,          String(v.value))
          fd.append(`variants[${i}][price_modifier]`, String(v.price_modifier ?? 0))
          fd.append(`variants[${i}][stock_quantity]`, String(v.stock_quantity ?? 0))
          if (v.id) fd.append(`variants[${i}][id]`,  String(v.id))
        }
      })
    }

    // Variantes v2
    if (Array.isArray(productData.variant_options) && productData.variant_options.length > 0) {
      fd.append('variant_options_json', JSON.stringify(productData.variant_options))
    }
    if (Array.isArray(productData.variant_combinations) && productData.variant_combinations.length > 0) {
      fd.append('variant_combinations_json', JSON.stringify(productData.variant_combinations))
    }

    return fd
  }

  // ─────────────────────────────────────────────────────────────
  // fetchProducts — liste des produits d'une boutique
  // ─────────────────────────────────────────────────────────────
  const fetchProducts = async (shopId: number | string, params?: Record<string, any>) => {
    isLoading.value = true
    error.value     = null
    try {
      const query = params
        ? '?' + new URLSearchParams(params as Record<string, string>).toString()
        : ''
      const res  = await fetch(`${config.public.apiBase}/shops/${shopId}/products${query}`, {
        headers: jsonHeaders()
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Erreur chargement produits')
      return data.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Alias pour compatibilité
  const fetchShopProducts = fetchProducts

  // ─────────────────────────────────────────────────────────────
  // fetchProductDetails
  // ─────────────────────────────────────────────────────────────
  const fetchProductDetails = async (shopId: number | string, productId: number) => {
    isLoading.value = true
    error.value     = null
    try {
      const res  = await fetch(`${config.public.apiBase}/shops/${shopId}/products/${productId}`, {
        headers: jsonHeaders()
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Produit introuvable')
      return data.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ─────────────────────────────────────────────────────────────
  // createProduct — FormData, headers SANS Content-Type
  // ─────────────────────────────────────────────────────────────
  const createProduct = async (shopId: number | string, productData: any) => {
    isLoading.value = true
    error.value     = null
    try {
      const fd  = buildFormData(productData)
      const res = await fetch(`${config.public.apiBase}/shops/${shopId}/products`, {
        method:  'POST',
        headers: formDataHeaders(), // ← CORRECTION : pas de Content-Type
        body:    fd
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        const msg = data.message
          || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Erreur création')
        throw new Error(String(msg))
      }
      return data.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ─────────────────────────────────────────────────────────────
  // updateProduct — POST + _method=PUT, headers SANS Content-Type
  // ─────────────────────────────────────────────────────────────
  const updateProduct = async (shopId: number | string, productId: number, productData: any) => {
    isLoading.value = true
    error.value     = null
    try {
      const fd = buildFormData(productData)
      fd.append('_method', 'PUT')
      const res  = await fetch(`${config.public.apiBase}/shops/${shopId}/products/${productId}`, {
        method:  'POST',
        headers: formDataHeaders(), // ← CORRECTION : pas de Content-Type
        body:    fd
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Erreur mise à jour')
      return data.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ─────────────────────────────────────────────────────────────
  // deleteProduct
  // ─────────────────────────────────────────────────────────────
  const deleteProduct = async (shopId: number | string, productId: number) => {
    isLoading.value = true
    error.value     = null
    try {
      const res  = await fetch(`${config.public.apiBase}/shops/${shopId}/products/${productId}`, {
        method:  'DELETE',
        headers: jsonHeaders()
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Erreur suppression')
      return true
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    fetchProducts,
    fetchShopProducts,
    fetchProductDetails,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}