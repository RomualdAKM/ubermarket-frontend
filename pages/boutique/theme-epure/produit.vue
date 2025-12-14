<template>
  <div class="min-h-screen bg-white">
    <!-- En-tête -->
    <HeaderEpure :shop="shop" :primaryColor="primaryColor" />

    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Navigation breadcrumb -->
        <nav class="flex mb-8" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <NuxtLink :to="`/boutique/${shopSubdomain}`" class="text-gray-500 hover:text-gray-700">Accueil</NuxtLink>
            </li>
            <li>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </li>
            <li>
              <span class="text-gray-500">{{ categoryName }}</span>
            </li>
            <li>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </li>
            <li>
              <span class="text-gray-900">{{ productName }}</span>
            </li>
          </ol>
        </nav>

        <div class="flex flex-col md:flex-row">
          <!-- Galerie d'images -->
          <div class="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <div class="bg-gray-100 w-full h-96 flex rounded-md items-center justify-center">
              <img :src="images[selectedImage].src" :alt="images[selectedImage].alt" class="h-full w-full object-contain" />
            </div>
            <div class="grid grid-cols-4 gap-4 mt-4">
              <div 
                v-for="(image, index) in images" 
                :key="index" 
                @click="selectImage(index)"
                class="bg-gray-200 w-full h-24 rounded-md flex items-center justify-center cursor-pointer border-2 transition-all"
                :class="selectedImage === index ? 'border-primary' : 'border-transparent'"
              >
                <img :src="image.src" :alt="image.alt" class="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Informations produit -->
          <div class="md:w-1/2">
            <div class="border-b border-gray-200 pb-6">
              <h1 class="text-2xl font-medium text-gray-900">{{ productName }}</h1>
              <div class="mt-2 flex items-center">
                <div class="flex">
                  <svg v-for="i in 5" :key="i" :class="i <= parseFloat(averageRating) ? 'w-5 h-5 text-yellow-400' : 'w-5 h-5 text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="ml-2 text-gray-600">{{ averageRating }} ({{ totalReviews }} avis)</span>
              </div>
              
              <!-- Prix avec gestion des promotions -->
              <div class="mt-4">
                <div v-if="isOnPromotion && totalOriginalPrice" class="flex items-center gap-3">
                  <p class="text-3xl font-medium text-primary">{{ formattedCalculatedPrice }}</p>
                  <p class="text-xl text-gray-400 line-through">{{ totalOriginalPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) }} {{ shop?.currency }}</p>
                  <span class="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">PROMO</span>
                </div>
                <p v-else class="text-3xl font-medium text-gray-900">{{ formattedCalculatedPrice }}</p>
              </div>
              
              <!-- Compte à rebours de la promotion -->
              <div v-if="isOnPromotion && product?.promotion_end_date" class="mt-3 flex items-center gap-2 text-sm">
                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 font-medium">Fin de la promo dans :</span>
                <div class="flex gap-1">
                  <span v-if="countdown.days > 0" class="px-2 py-1 bg-red-50 text-red-700 rounded font-semibold">{{ countdown.days }}j</span>
                  <span class="px-2 py-1 bg-red-50 text-red-700 rounded font-semibold">{{ String(countdown.hours).padStart(2, '0') }}h</span>
                  <span class="px-2 py-1 bg-red-50 text-red-700 rounded font-semibold">{{ String(countdown.minutes).padStart(2, '0') }}m</span>
                  <span class="px-2 py-1 bg-red-50 text-red-700 rounded font-semibold">{{ String(countdown.seconds).padStart(2, '0') }}s</span>
                </div>
              </div>
              
              <p class="mt-4 text-gray-600">{{ productDescription }}</p>
            </div>

            <!-- Variantes (uniquement pour produits physiques) -->
            <div v-if="!isDigitalProduct && Object.keys(groupedVariants).length > 0" class="border-b border-gray-200 py-6">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Options</h2>
              
              <!-- Boucle sur chaque type de variante (Taille, Couleur, etc.) -->
              <div v-for="(variants, variantName) in groupedVariants" :key="variantName" class="mb-4">
                <span class="text-gray-700 block mb-2">{{ variantName }}:</span>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="variant in variants"
                    :key="variant.id"
                    @click="selectVariant(variantName, variant)"
                    class="px-4 py-2 border-2 rounded transition-all"
                    :class="selectedVariants[variantName]?.id === variant.id 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-gray-300 hover:border-primary'"
                  >
                    {{ variant.value }}
                    <span v-if="variant.price_modifier && parseFloat(variant.price_modifier) !== 0" class="text-xs ml-1">
                      ({{ parseFloat(variant.price_modifier) > 0 ? '+' : '' }}{{ parseFloat(variant.price_modifier).toLocaleString('fr-FR') }} {{ shop?.currency }})
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Quantité (uniquement pour produits physiques) -->
            <div v-if="!isDigitalProduct" class="border-b border-gray-200 py-6">
              <div class="flex items-center">
                <span class="text-gray-700 mr-4">Quantité:</span>
                <div class="inline-flex items-center border border-gray-300">
                  <button @click="decreaseQuantity" class="px-3 py-2 text-gray-600 hover:bg-gray-100">-</button>
                  <span class="px-4 py-2 border-l border-r border-gray-300">{{ quantity }}</span>
                  <button @click="increaseQuantity" class="px-3 py-2 text-gray-600 hover:bg-gray-100">+</button>
                </div>
                <span v-if="availableStock < 10 && availableStock > 0" class="ml-4 text-sm text-orange-600">
                  Plus que {{ availableStock }} en stock
                </span>
                <span v-else-if="availableStock === 0" class="ml-4 text-sm text-red-600">
                  Rupture de stock
                </span>
              </div>
            </div>
            
            <!-- Message pour produits digitaux -->
            <div v-else class="border-b border-gray-200 py-6">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
                Produit numérique - Téléchargement instantané après achat
              </div>
            </div>

            <!-- Code promo -->
            <div class="border-b border-gray-200 py-6">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Code promo</h3>
              
              <!-- Message de succès -->
              <div v-if="promoApplied" class="mb-3 p-3 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm text-green-800">
                    Code <strong>{{ appliedPromoCode?.code }}</strong> appliqué (-{{ appliedPromoCode?.discount_amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) }} {{ shop?.currency }})
                  </span>
                </div>
                <button @click="removePromoCode" class="text-red-600 hover:text-red-800 text-sm font-medium">
                  Retirer
                </button>
              </div>
              
              <!-- Message d'erreur -->
              <div v-if="promoError" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p class="text-sm text-red-800">{{ promoError }}</p>
              </div>
              
              <!-- Formulaire de saisie -->
              <div v-if="!promoApplied" class="flex gap-2">
                <input 
                  type="text" 
                  v-model="promoCodeInput"
                  placeholder="Entrez votre code"
                  class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  @keyup.enter="applyPromoCode"
                >
                <button 
                  @click="applyPromoCode"
                  :disabled="!promoCodeInput || isValidatingPromo"
                  class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isValidatingPromo ? 'Vérification...' : 'Appliquer' }}
                </button>
              </div>
            </div>

            <div class="py-6">
              <!-- Message de succès ajout panier -->
              <div v-if="addToCartSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p class="text-sm text-green-800 font-medium">✓ Produit ajouté au panier</p>
              </div>
              
              <!-- Message d'erreur ajout panier -->
              <div v-if="addToCartError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p class="text-sm text-red-800">{{ addToCartError }}</p>
              </div>
              
              <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <button 
                  @click="handleAddToCart"
                  :disabled="isAddingToCart || availableStock === 0"
                  class="flex-1 px-6 py-3 bg-primary text-white font-medium hover:bg-secondary transition-all rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg v-if="isAddingToCart" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isAddingToCart ? 'Ajout en cours...' : (availableStock === 0 ? 'Rupture de stock' : 'Ajouter au panier') }}
                </button>
                <NuxtLink 
                  :to="getCartUrl(props.shop)"
                  class="flex-1 px-6 py-3 border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition-all rounded-md text-center"
                >
                  Voir le panier
                </NuxtLink>
              </div>
              <div class="mt-4">
                <button 
                  @click="toggleWishlist"
                  :disabled="isTogglingWishlist"
                  class="w-full px-6 py-3 border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="isInWishlist(product?.id) ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' : ''"
                >
                  <svg 
                    class="w-5 h-5 mr-2" 
                    :fill="isInWishlist(product?.id) ? 'currentColor' : 'none'" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  {{ isTogglingWishlist ? 'Chargement...' : (isInWishlist(product?.id) ? 'Retirer de la liste d\'envies' : 'Ajouter à la liste d\'envies') }}
                </button>
              </div>
            </div>
          </div>
        </div>


        <!-- Section Avis Clients -->
        <div class="mt-16">
          <h2 class="text-2xl font-medium text-gray-900 mb-8">Avis clients</h2>
          
          <!-- État de chargement -->
          <div v-if="isLoadingReviews" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-gray-600">Chargement des avis...</p>
          </div>
          
          <!-- Pas d'avis -->
          <div v-else-if="!productReviews || productReviews.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p class="text-gray-500">Aucun avis pour ce produit</p>
            <p class="text-sm text-gray-400 mt-2">Soyez le premier à donner votre avis</p>
          </div>
          
          <!-- Liste des avis -->
          <div v-else>
            <!-- Résumé des avis -->
            <div class="flex items-center mb-8">
              <div class="flex items-center">
                <span class="text-4xl font-bold text-gray-900 mr-4">{{ averageRating }}</span>
                <div>
                  <div class="flex">
                    <svg v-for="i in 5" :key="i" :class="i <= parseFloat(averageRating) ? 'w-5 h-5 text-yellow-400' : 'w-5 h-5 text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p class="text-sm text-gray-600">Basé sur {{ totalReviews }} avis</p>
                </div>
              </div>
            </div>
            
            <!-- Liste des avis -->
            <div class="space-y-8">
              <div v-for="review in productReviews" :key="review.id" class="border-b border-gray-200 pb-8">
                <div class="flex justify-between mb-2">
                  <div class="flex items-center">
                    <h3 class="font-medium text-gray-900">{{ review.user?.name || 'Client' }}</h3>
                    <span v-if="review.is_verified_purchase" class="ml-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      ✓ Achat vérifié
                    </span>
                  </div>
                  <span class="text-sm text-gray-500">{{ formatReviewDate(review.created_at) }}</span>
                </div>
                <div class="flex mb-3">
                  <svg v-for="(isFilled, index) in stars(review.rating)" :key="index" :class="isFilled ? 'w-4 h-4 text-yellow-400' : 'w-4 h-4 text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p v-if="review.comment" class="text-gray-700">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </main>

    <FooterEpure 
      :backgroundColor="backgroundColor" 
      :primaryColor="primaryColor"
      :footerText="footerText"
      :socialLinks="footerSocialLinks"
    />
  </div>
</template>

<script setup lang="ts">
import FooterEpure from '@/components/theme_epure/FooterEpure.vue'
import HeaderEpure from '@/components/theme_epure/HeaderEpure.vue'
definePageMeta({
  layout: false
})

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useReviews } from '~/composables/useReviews'
import { useWishlist } from '~/composables/useWishlist'

// Props pour recevoir les données
interface Props {
  shop?: any
  product?: any
  customizations?: any
}

const props = defineProps<Props>()

// Variables locales pour le template
const shop = computed(() => props.shop)

// Données dynamiques du produit
const productName = computed(() => props.product?.name || 'Produit')

// Vérifier si le produit est en promotion (période active)
const isOnPromotion = computed(() => {
  if (!props.product?.promotional_price) return false
  
  const now = new Date()
  const startDate = props.product.promotion_start_date ? new Date(props.product.promotion_start_date) : null
  const endDate = props.product.promotion_end_date ? new Date(props.product.promotion_end_date) : null
  
  // Si pas de dates définies, la promo est active
  if (!startDate && !endDate) return true
  
  // Vérifier que la date actuelle est dans la période de promotion
  const afterStart = !startDate || now >= startDate
  const beforeEnd = !endDate || now <= endDate
  
  return afterStart && beforeEnd
})

// Prix de base (avec ou sans promotion)
const basePrice = computed(() => {
  if (isOnPromotion.value && props.product?.promotional_price) {
    return parseFloat(props.product.promotional_price)
  }
  return parseFloat(props.product?.price || 0)
})

// Prix original (pour afficher barré si promo)
const originalPrice = computed(() => {
  return parseFloat(props.product?.price || 0)
})

const productDescription = computed(() => props.product?.description || '')
const categoryName = computed(() => props.product?.subcategory?.category?.name || 'Produits')
const subcategoryName = computed(() => props.product?.subcategory?.name || '')
const shopSubdomain = computed(() => props.shop?.subdomain || '')

// Couleurs personnalisées
const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#e56a19')
const secondaryColor = computed(() => props.customizations?.home?.colors?.secondary || '#5b6ac5')
const backgroundColor = computed(() => props.customizations?.home?.colors?.background || '#ffffff')

// Footer (pied de page)
const footerText = computed(() => {
  if (props.customizations?.footer?.text) {
    return props.customizations.footer.text
  }
  return `© ${new Date().getFullYear()} ${shop.value?.name || 'Boutique'}. Tous droits réservés.`
})

const footerSocialLinks = computed(() => {
  return props.customizations?.footer?.socialLinks || {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  }
})

// Images du produit
const images = computed(() => {
  const productImages = []
  const config = useRuntimeConfig()
  const backendUrl = config.public.apiBase.replace('/api', '')
  
  // Image principale (preview_image)
  if (props.product?.preview_image) {
    productImages.push({
      src: `${backendUrl}/storage/${props.product.preview_image}`,
      alt: `${productName.value} - Image principale`
    })
  }
  
  // Images de la galerie (product_images)
  if (props.product?.product_images && props.product.product_images.length > 0) {
    props.product.product_images.forEach((img: any, index: number) => {
      productImages.push({
        src: `${backendUrl}/storage/${img.image_path}`,
        alt: img.alt_text || `${productName.value} - Image ${index + 1}`
      })
    })
  }
  
  // Si aucune image, utiliser un placeholder
  if (productImages.length === 0) {
    productImages.push({
      src: 'https://placehold.co/800x800?text=Aucune+image',
      alt: 'Aucune image disponible'
    })
  }
  
  return productImages
})

// Image sélectionnée (par défaut la première)
const selectedImage = ref(0)

// Fonction pour changer l'image sélectionnée
const selectImage = (index: number) => {
  selectedImage.value = index
}

// Variantes du produit
const productVariants = computed(() => props.product?.productVariants || props.product?.product_variants || [])

// Vérifier si c'est un produit digital
const isDigitalProduct = computed(() => props.shop?.product_type === 'digital')

// Grouper les variantes par nom (ex: toutes les "Taille", toutes les "Couleur")
const groupedVariants = computed(() => {
  const groups: Record<string, any[]> = {}
  
  productVariants.value.forEach((variant: any) => {
    if (!groups[variant.name]) {
      groups[variant.name] = []
    }
    groups[variant.name].push(variant)
  })
  
  return groups
})

// Variantes sélectionnées (clé = nom de variante, valeur = variante complète)
const selectedVariants = ref<Record<string, any>>({})

// Prix calculé avec les modificateurs des variantes
const calculatedPrice = computed(() => {
  let price = basePrice.value // Commence avec le prix de base (promo ou normal)
  
  // Ajouter les modificateurs de prix des variantes sélectionnées
  Object.values(selectedVariants.value).forEach((variant: any) => {
    if (variant?.price_modifier) {
      price += parseFloat(variant.price_modifier) // ADDITION, pas concaténation
    }
  })
  
  return price
})

// Prix total (prix unitaire × quantité)
const totalPrice = computed(() => {
  return calculatedPrice.value * quantity.value
})

// Prix final après application du code promo
const finalPrice = computed(() => {
  if (promoApplied.value && appliedPromoCode.value) {
    return Math.max(0, totalPrice.value - appliedPromoCode.value.discount_amount)
  }
  return totalPrice.value
})

// Prix original calculé (pour affichage barré)
const calculatedOriginalPrice = computed(() => {
  if (!isOnPromotion.value) return null
  
  let price = originalPrice.value
  
  // Ajouter les modificateurs de prix des variantes sélectionnées
  Object.values(selectedVariants.value).forEach((variant: any) => {
    if (variant?.price_modifier) {
      price += parseFloat(variant.price_modifier)
    }
  })
  
  return price
})

// Prix original total (pour affichage barré)
const totalOriginalPrice = computed(() => {
  if (!calculatedOriginalPrice.value) return null
  return calculatedOriginalPrice.value * quantity.value
})

// Prix formaté avec devise (prix total)
const formattedCalculatedPrice = computed(() => {
  const currency = props.shop?.currency || 'XOF'
  return `${finalPrice.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency}`
})

// Stock disponible basé sur les variantes sélectionnées
const availableStock = computed(() => {
  // Si produit digital, toujours disponible
  if (isDigitalProduct.value) {
    return 999999
  }
  
  // Si des variantes sont sélectionnées, prendre le stock de la dernière variante sélectionnée
  const selectedVariantsList = Object.values(selectedVariants.value)
  if (selectedVariantsList.length > 0) {
    const lastVariant = selectedVariantsList[selectedVariantsList.length - 1]
    return lastVariant?.stock_quantity || 0
  }
  
  // Sinon prendre le stock du produit principal
  return props.product?.stock_quantity || 0
})

// Sélectionner une variante
const selectVariant = (variantName: string, variant: any) => {
  selectedVariants.value[variantName] = variant
}

// Gestion des codes promo
const { validatePromoCode } = usePromoCodes()
const { addToCart, itemsCount } = useCart()
const { reviews: productReviews, fetchProductReviews, isLoading: isLoadingReviews } = useReviews()
const { addToWishlist, removeFromWishlist: removeFromWishlistAPI, isInWishlist } = useWishlist()
const { isAuthenticated } = useAuth()
const { getCartUrl } = useShopNavigation()

const promoCodeInput = ref('')
const promoApplied = ref(false)
const appliedPromoCode = ref<any>(null)
const promoError = ref('')
const isValidatingPromo = ref(false)

// Gestion de l'ajout au panier
const isAddingToCart = ref(false)
const addToCartSuccess = ref(false)
const addToCartError = ref('')

// Fonction pour ajouter au panier
const handleAddToCart = async () => {
  if (!props.product?.id || !shopSubdomain.value) return
  
  // Vérifier le stock
  if (availableStock.value === 0) {
    addToCartError.value = 'Produit en rupture de stock'
    return
  }
  
  // Pour les produits physiques avec variantes, récupérer TOUTES les variantes sélectionnées
  let variantIds: number[] | null = null
  if (!isDigitalProduct.value && Object.keys(groupedVariants.value).length > 0) {
    // Extraire les IDs de TOUTES les variantes sélectionnées
    const selectedVariantIds = Object.values(selectedVariants.value)
      .map((variant: any) => variant?.id)
      .filter((id): id is number => id !== null && id !== undefined)
    
    // Si des variantes sont sélectionnées, les envoyer
    if (selectedVariantIds.length > 0) {
      variantIds = selectedVariantIds
    }
  }
  
  isAddingToCart.value = true
  addToCartSuccess.value = false
  addToCartError.value = ''
  
  try {
    const success = await addToCart(
      shopSubdomain.value,
      props.product.id,
      quantity.value,
      variantIds
    )
    
    if (success) {
      addToCartSuccess.value = true
      // Masquer le message après 3 secondes
      setTimeout(() => {
        addToCartSuccess.value = false
      }, 3000)
    } else {
      addToCartError.value = 'Erreur lors de l\'ajout au panier'
    }
  } catch (err: any) {
    addToCartError.value = err.message || 'Erreur lors de l\'ajout au panier'
  } finally {
    isAddingToCart.value = false
  }
}

// Appliquer un code promo
const applyPromoCode = async () => {
  if (!promoCodeInput.value || !shopSubdomain.value) return
  
  promoError.value = ''
  isValidatingPromo.value = true
  
  try {
    const result = await validatePromoCode(shopSubdomain.value, {
      code: promoCodeInput.value.toUpperCase(),
      cart_total: totalPrice.value,
      product_ids: [props.product?.id]
    })
    
    if (result) {
      promoApplied.value = true
      appliedPromoCode.value = result
      promoCodeInput.value = ''
    }
  } catch (err: any) {
    promoError.value = err.message || 'Code promo invalide'
  } finally {
    isValidatingPromo.value = false
  }
}

// Retirer le code promo
const removePromoCode = () => {
  promoApplied.value = false
  appliedPromoCode.value = null
  promoError.value = ''
  promoCodeInput.value = ''
}

// Quantité sélectionnée
const quantity = ref(1)

const decreaseQuantity = () => {
  // Produits digitaux : quantité fixe = 1
  if (isDigitalProduct.value) {
    quantity.value = 1
    return
  }
  
  if (quantity.value > 1) quantity.value--
}

const increaseQuantity = () => {
  // Produits digitaux : quantité fixe = 1
  if (isDigitalProduct.value) {
    quantity.value = 1
    return
  }
  
  const stock = availableStock.value
  if (quantity.value < stock) quantity.value++
}

// S'assurer que la quantité est 1 pour les produits digitaux
watch(isDigitalProduct, (isDigital) => {
  if (isDigital) {
    quantity.value = 1
  }
})

// Compte à rebours pour la promotion
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

const countdownInterval = ref<NodeJS.Timeout | null>(null)

// Calculer le temps restant jusqu'à la fin de la promotion
const updateCountdown = () => {
  if (!isOnPromotion.value || !props.product?.promotion_end_date) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }
  
  const now = new Date().getTime()
  const endDate = new Date(props.product.promotion_end_date).getTime()
  const timeLeft = endDate - now
  
  if (timeLeft <= 0) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    if (countdownInterval.value) {
      clearInterval(countdownInterval.value)
    }
    return
  }
  
  countdown.value = {
    days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
    hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeLeft % (1000 * 60)) / 1000)
  }
}

// Démarrer le compte à rebours
onMounted(() => {
  if (isOnPromotion.value && props.product?.promotion_end_date) {
    updateCountdown()
    countdownInterval.value = setInterval(updateCountdown, 1000)
  }
  
  // Charger les avis du produit
  if (props.product?.id) {
    fetchProductReviews(props.product.id)
  }
})

// Nettoyer l'intervalle
onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})

// Avis clients - Computed properties pour statistiques
const averageRating = computed(() => {
  if (!productReviews.value || productReviews.value.length === 0) return 0
  const sum = productReviews.value.reduce((acc, review) => acc + review.rating, 0)
  return (sum / productReviews.value.length).toFixed(1)
})

const totalReviews = computed(() => productReviews.value?.length || 0)

// Nombre d'étoiles pour l'affichage des avis
const stars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => i < rating)
}

// Formater la date d'un avis
const formatReviewDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Gestion de la wishlist
const isTogglingWishlist = ref(false)

const toggleWishlist = async () => {
  if (!props.product?.id) return
  
  // Vérifier si l'utilisateur est connecté
  if (!isAuthenticated.value) {
    alert('Vous devez être connecté pour ajouter des produits à votre wishlist')
    return
  }
  
  isTogglingWishlist.value = true
  
  try {
    if (isInWishlist(props.product.id)) {
      // Retirer de la wishlist
      const success = await removeFromWishlistAPI(props.product.id)
      if (success) {
        // Message de succès optionnel
      }
    } else {
      // Ajouter à la wishlist
      const success = await addToWishlist(props.product.id)
      if (success) {
        // Message de succès optionnel
      }
    }
  } catch (err: any) {
    alert(err.message || 'Erreur lors de l\'opération')
  } finally {
    isTogglingWishlist.value = false
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: v-bind(primaryColor);
}

.hover\:bg-secondary:hover {
  background-color: v-bind(secondaryColor);
}

.text-primary {
  color: v-bind(primaryColor);
}

.hover\:text-secondary:hover {
  color: v-bind(secondaryColor);
}
</style>