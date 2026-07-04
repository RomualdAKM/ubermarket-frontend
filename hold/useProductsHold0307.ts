// ============================================================
// composables/useProducts.ts
// Gère le CRUD des produits via FormData (multipart/form-data)
// pour supporter les fichiers (images, PDF, MP3, MP4, ZIP…).
//
// RÈGLE ABSOLUE POUR FORMDATA :
//   Headers = UNIQUEMENT Authorization
//   Jamais Content-Type ni Accept avec FormData
//   → le navigateur injecte automatiquement le boundary multipart
//   → Laravel peut décoder le body sans erreur
// ============================================================

import { ref } from 'vue'

export const useProducts = () => {
  const config    = useRuntimeConfig()
  const { token } = useAuth()

  const isLoading = ref(false)
  const error     = ref<string | null>(null)

  // ── Headers requêtes JSON (GET, DELETE sans body) ────────
  const jsonHeaders = () => ({
    'Content-Type':  'application/json',
    'Accept':        'application/json',
    'Authorization': `Bearer ${token.value}`,
  })

  // ── Headers requêtes FormData (POST/PUT avec fichiers) ───
  // ✅ CORRECTION : SEULEMENT Authorization
  // Ne jamais ajouter Content-Type ni Accept ici :
  //   - Content-Type doit être injecté par le navigateur avec le boundary
  //   - Accept: application/json déclenche "Unable to decode input" sur Laravel
  const formDataHeaders = () => ({
    'Authorization': `Bearer ${token.value}`,
  })

  // ─────────────────────────────────────────────────────────
  // buildFormData — convertit productData en FormData multipart
  //
  // Points importants :
  //   - Booléens → '1'/'0' (Laravel rejette 'true'/'false' en multipart)
  //   - Objets (variantes) → JSON.stringify (décodé par json_decode côté PHP)
  //   - Files → File objects (gérés nativement par FormData)
  // ─────────────────────────────────────────────────────────
  const buildFormData = (productData: any): FormData => {
    const fd = new FormData()

    // Champs texte/numériques simples
    const simpleFields = [
      'name', 'description', 'subcategory_id', 'price',
      'promotional_price', 'promotion_start_date', 'promotion_end_date',
      'stock_quantity', 'status',
      'availability_type', 'preorder_payment_type',
      'deposit_amount', 'deposit_percentage',
    ]

    for (const field of simpleFields) {
      const val = productData[field]
      if (val !== null && val !== undefined && val !== '') {
        fd.append(field, String(val))
      }
    }

    // ✅ Booléen : '1'/'0' car Laravel rejette 'true'/'false' en multipart
    fd.append('show_sales_count', productData.show_sales_count ? '1' : '0')

    // ── Images produit ──────────────────────────────────────
    // ✅ CORRECTION B : envoyer is_primary pour chaque image
    if (Array.isArray(productData.images)) {
      let imgIndex = 0
      productData.images.forEach((img: any) => {
        if (img.file instanceof File) {
          fd.append(`images[${imgIndex}]`,         img.file)
          // Indique au backend quelle image est la principale
          fd.append(`images_primary[${imgIndex}]`, img.is_primary ? '1' : '0')
          imgIndex++
        }
      })
    }

    // ── Fichier numérique (boutiques digitales) ──────────────
    if (productData.digital_file instanceof File) {
      fd.append('digital_file', productData.digital_file)
    }

    // ── Variantes v1 (rétrocompatibilité) ───────────────────
    if (Array.isArray(productData.variants)) {
      productData.variants.forEach((v: any, i: number) => {
        if (v.name && v.value) {
          fd.append(`variants[${i}][name]`,           String(v.name))
          fd.append(`variants[${i}][value]`,          String(v.value))
          fd.append(`variants[${i}][price_modifier]`, String(v.price_modifier ?? 0))
          fd.append(`variants[${i}][stock_quantity]`, String(v.stock_quantity ?? 0))
          if (v.id) fd.append(`variants[${i}][id]`, String(v.id))
        }
      })
    }

    // ── Variantes v2 (dimensions + combinaisons) ─────────────
    // ✅ CORRECTION A : noms de champs cohérents avec le backend
    // Côté Laravel : $request->input('variant_options') → json_decode(...)
    if (Array.isArray(productData.variant_options) && productData.variant_options.length > 0) {
      fd.append('variant_options', JSON.stringify(productData.variant_options))
    }
    if (Array.isArray(productData.variant_combinations) && productData.variant_combinations.length > 0) {
      fd.append('variant_combinations', JSON.stringify(productData.variant_combinations))
    }

    return fd
  }

  // ─────────────────────────────────────────────────────────
  // fetchProducts — liste paginée des produits d'une boutique
  // ─────────────────────────────────────────────────────────
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

  // Alias pour compatibilité avec certaines pages
  const fetchShopProducts = fetchProducts

  // ─────────────────────────────────────────────────────────
  // fetchProductDetails — détail d'un produit
  // ─────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────
  // createProduct — POST en FormData
  // ✅ formDataHeaders() = seulement Authorization
  // ─────────────────────────────────────────────────────────
  const createProduct = async (shopId: number | string, productData: any) => {
    isLoading.value = true
    error.value     = null
    try {
      const fd  = buildFormData(productData)
      const res = await fetch(`${config.public.apiBase}/shops/${shopId}/products`, {
        method:  'POST',
        headers: formDataHeaders(), // ← JAMAIS de Content-Type ici
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

  // ─────────────────────────────────────────────────────────
  // updateProduct — POST + _method=PUT (Laravel method spoofing)
  // ✅ formDataHeaders() = seulement Authorization
  // ─────────────────────────────────────────────────────────
  const updateProduct = async (shopId: number | string, productId: number, productData: any) => {
    isLoading.value = true
    error.value     = null
    try {
      const fd = buildFormData(productData)
      // Laravel method spoofing : PUT via POST avec _method=PUT
      fd.append('_method', 'PUT')
      const res  = await fetch(`${config.public.apiBase}/shops/${shopId}/products/${productId}`, {
        method:  'POST',
        headers: formDataHeaders(), // ← JAMAIS de Content-Type ici
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

  // ─────────────────────────────────────────────────────────
  // deleteProduct — DELETE avec headers JSON (pas de body)
  // ─────────────────────────────────────────────────────────
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