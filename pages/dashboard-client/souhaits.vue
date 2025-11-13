<template>
  <div>
    <!-- État de chargement -->
    <div v-if="isLoading" class="bg-white rounded-lg p-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement de votre wishlist...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="bg-white rounded-lg p-12 text-center">
      <div class="text-red-500 mb-4">
        <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="loadWishlist" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Réessayer
      </button>
    </div>

    <!-- Contenu -->
    <div v-else class="bg-white rounded-lg p-6">
      <h2 class="text-xl font-light text-gray-900 mb-6">Ma Liste de Souhaits</h2>
      
      <div v-if="wishlist.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <p class="text-gray-500 mb-2">Votre liste de souhaits est vide</p>
        <p class="text-sm text-gray-400">Ajoutez vos produits préférés pour les retrouver facilement</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in wishlist" :key="item.id" class="bg-gray-50 rounded-lg p-4 group">
          <div class="relative mb-4">
            <img 
              :src="getProductImage(item.product)" 
              :alt="item.product?.name" 
              class="w-full h-48 object-cover rounded-lg"
            >
            <button 
              @click="handleRemoveFromWishlist(item.product_id)" 
              class="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            >
              <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Badge promo -->
            <span v-if="isOnPromotion(item.product)" class="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
              PROMO
            </span>
          </div>
          
          <h3 class="font-medium text-gray-900 mb-2">{{ item.product?.name }}</h3>
          
          <!-- Prix -->
          <div class="mb-3">
            <div v-if="isOnPromotion(item.product)" class="flex items-center gap-2">
              <p class="text-lg font-medium text-red-600">{{ formatPrice(item.product?.promotional_price) }}</p>
              <p class="text-sm text-gray-400 line-through">{{ formatPrice(item.product?.price) }}</p>
            </div>
            <p v-else class="text-lg font-medium text-gray-900">{{ formatPrice(item.product?.price) }}</p>
          </div>
          
          <!-- Boutique -->
          <p v-if="item.product?.shop" class="text-sm text-gray-500 mb-3">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            {{ item.product.shop.name }}
          </p>
          
          <div class="space-y-2">
            <button 
              @click="handleAddToCart(item.product)" 
              :disabled="isAddingToCart || item.product?.stock_quantity === 0"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ item.product?.stock_quantity === 0 ? 'Rupture de stock' : 'Ajouter au panier' }}
            </button>
            <button 
              @click="handleRemoveFromWishlist(item.product_id)" 
              class="w-full px-4 py-2 text-gray-600 hover:text-red-600 transition-colors text-sm"
            >
              Retirer de la liste
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WishlistItem } from '~/composables/useWishlist'

definePageMeta({
  layout: 'dashboard-client'
})

const config = useRuntimeConfig()
const { wishlist, isLoading, error, fetchWishlist, removeFromWishlist } = useWishlist()
const { addToCart } = useCart()

const isAddingToCart = ref(false)

// Charger la wishlist au montage
const loadWishlist = async () => {
  await fetchWishlist()
}

onMounted(() => {
  loadWishlist()
})

// Obtenir l'image du produit
const getProductImage = (product: any) => {
  if (!product) return 'https://placehold.co/300x300?text=Aucune+image'
  
  const backendUrl = config.public.apiBase.replace('/api', '')
  
  if (product.preview_image) {
    return `${backendUrl}/storage/${product.preview_image}`
  }
  
  if (product.product_images && product.product_images.length > 0) {
    return `${backendUrl}/storage/${product.product_images[0].image_path}`
  }
  
  return 'https://placehold.co/300x300?text=Aucune+image'
}

// Vérifier si un produit est en promotion
const isOnPromotion = (product: any): boolean => {
  if (!product?.promotional_price) return false
  
  const now = new Date()
  const startDate = product.promotion_start_date ? new Date(product.promotion_start_date) : null
  const endDate = product.promotion_end_date ? new Date(product.promotion_end_date) : null
  
  if (!startDate && !endDate) return true
  
  const afterStart = !startDate || now >= startDate
  const beforeEnd = !endDate || now <= endDate
  
  return afterStart && beforeEnd
}

// Formater le prix
const formatPrice = (price: any): string => {
  if (!price) return '0 FCFA'
  return `${parseFloat(price).toLocaleString('fr-FR')} FCFA`
}

// Retirer de la wishlist
const handleRemoveFromWishlist = async (productId: number) => {
  if (confirm('Êtes-vous sûr de vouloir retirer ce produit de votre wishlist ?')) {
    const success = await removeFromWishlist(productId)
    if (!success && error.value) {
      alert(error.value)
    }
  }
}

// Ajouter au panier
const handleAddToCart = async (product: any) => {
  if (!product?.shop?.subdomain) {
    alert('Impossible d\'ajouter ce produit au panier')
    return
  }
  
  isAddingToCart.value = true
  
  try {
    const success = await addToCart(
      product.shop.subdomain,
      product.id,
      1, // Quantité
      null // Pas de variante pour l'instant
    )
    
    if (success) {
      alert('✓ Produit ajouté au panier')
    } else {
      alert('Erreur lors de l\'ajout au panier')
    }
  } catch (err: any) {
    alert(err.message || 'Erreur lors de l\'ajout au panier')
  } finally {
    isAddingToCart.value = false
  }
}
</script>