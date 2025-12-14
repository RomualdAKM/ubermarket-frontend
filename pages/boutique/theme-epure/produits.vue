<template>
  <div class="min-h-screen bg-white">
    <!-- En-tête -->
    <HeaderEpure :shop="shop" :primaryColor="primaryColor" />

    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Titre et barre de recherche -->
        <div class="mb-8">
          <div class="text-center mb-6">
            <h1 class="text-3xl font-medium text-gray-900">Nos produits</h1>
            <p class="mt-2 text-gray-600">Découvrez notre collection complète</p>
          </div>
          
          <!-- Barre de recherche -->
          <div class="max-w-xl mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un produit..."
                class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Message de chargement -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p class="mt-4 text-gray-600">Chargement des produits...</p>
        </div>

        <!-- Message si aucun produit -->
        <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="mt-4 text-gray-600 text-lg">
            {{ searchQuery ? 'Aucun produit ne correspond à votre recherche' : 'Aucun produit disponible pour le moment' }}
          </p>
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
          >
            Réinitialiser la recherche
          </button>
        </div>

        <!-- Grille de produits -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <NuxtLink 
            v-for="product in filteredProducts" 
            :key="product.id"
            :to="getProductUrl(product.id, shop)"
            class="bg-white border border-gray-200 rounded-md group hover:border-primary transition-all duration-300 product-card block"
          >
            <!-- Image du produit -->
            <div class="bg-gray-100 w-full h-64 flex items-center justify-center overflow-hidden">
              <img 
                v-if="product.preview_image" 
                :src="getProductImageUrl(product.preview_image)" 
                :alt="product.name" 
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-400 text-sm">Aucune image</span>
              </div>
            </div>
            
            <!-- Détails du produit -->
            <div class="p-5">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-medium text-gray-900 truncate flex-1">{{ product.name }}</h3>
                <span v-if="product.category" class="text-sm text-gray-500 ml-2 flex-shrink-0">{{ product.category.name }}</span>
              </div>
              <p class="mt-1 text-gray-600 line-clamp-2">{{ product.short_description || 'Aucune description' }}</p>
              
              <div class="mt-4 flex justify-between items-center">
                <!-- Prix avec promotion si disponible -->
                <div class="flex flex-col">
                  <span v-if="product.promotional_price" class="text-lg font-medium text-primary">{{ formatPrice(product.promotional_price) }}</span>
                  <span 
                    :class="product.promotional_price ? 'text-sm text-gray-500 line-through' : 'text-lg font-medium text-gray-900'"
                  >
                    {{ formatPrice(product.price) }}
                  </span>
                </div>
                
                <button 
                  class="p-2 bg-primary text-white transition-all rounded-md hover:bg-secondary"
                  @click.prevent="() => {}"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Compteur de résultats -->
        <div v-if="!isLoading && filteredProducts.length > 0" class="mt-8 text-center text-gray-600">
          <p>{{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }} trouvé{{ filteredProducts.length > 1 ? 's' : '' }}</p>
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
import { computed, ref } from 'vue'
import { useShopNavigation } from '~/composables/useShopNavigation'

definePageMeta({
  layout: false
})

// Props pour recevoir les données de la boutique et customizations
interface Props {
  shop?: any
  customizations?: any
}

const props = defineProps<Props>()
const config = useRuntimeConfig()

// Variables locales pour le template
const shop = computed(() => props.shop)

// Composable de navigation
const { getProductUrl } = useShopNavigation()

// Couleurs personnalisées
const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#e56a19')
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

// Données des produits
const allProducts = computed(() => props.shop?.products || [])
const isLoading = ref(false)
const searchQuery = ref('')

// Filtrage des produits par recherche
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) {
    return allProducts.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return allProducts.value.filter((product: any) => {
    const name = product.name?.toLowerCase() || ''
    const description = product.short_description?.toLowerCase() || ''
    const category = product.category?.name?.toLowerCase() || ''
    
    return name.includes(query) || description.includes(query) || category.includes(query)
  })
})

// Fonction pour formater le prix
const formatPrice = (price: number) => {
  const currency = shop.value?.currency || 'XOF'
  return `${price.toLocaleString('fr-FR')} ${currency}`
}

// Fonction pour obtenir l'URL de l'image du produit
const getProductImageUrl = (imagePath: string) => {
  const backendUrl = config.public.apiBase.replace('/api', '')
  return `${backendUrl}/storage/${imagePath}`
}
</script>

<style scoped>
/* Animation de survol pour les cartes produits */
.product-card {
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  border-color: v-bind(primaryColor);
  border-width: 2px;
}

/* Styles pour le bouton hover */
.hover\:bg-secondary:hover {
  background-color: #5b6ac5;
}

/* Couleur primaire dynamique */
.focus\:ring-primary:focus {
  --tw-ring-color: v-bind(primaryColor);
}

/* Troncature du texte sur 2 lignes */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>