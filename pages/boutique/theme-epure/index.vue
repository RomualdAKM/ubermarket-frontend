<template>
  <div class="min-h-screen" :style="{ backgroundColor: backgroundColor }">
    <!-- En-tête -->
    <HeaderEpure :shop="shop" :primaryColor="primaryColor" />

    <main>
      <!-- Section slider -->
      <div class="relative">
        <!-- Slider -->
        <div class="overflow-hidden">
          <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <!-- Slides dynamiques -->
            <div 
              v-for="(image, index) in bannerImages" 
              :key="index"
              class="w-full flex-shrink-0 relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]"
            >
              <img :src="image" :alt="`Slide ${Number(index) + 1}`" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent flex items-center">
                <div class="text-white max-w-xl pl-4 pr-4 sm:pl-8 md:pl-12 lg:pl-24">
                  <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">{{ bannerTitle }}</h2>
                  <p class="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-10">{{ bannerSubtitle }}</p>
                  <NuxtLink 
                    :to="`/boutique/${shop?.subdomain}/produits`"
                    class="inline-block px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-white text-sm sm:text-base md:text-lg font-medium transition-all rounded-md hover-secondary-btn"
                    :style="{ backgroundColor: primaryColor }"
                  >
                    {{ customizations?.home?.banner?.button_text || 'Explorer la collection' }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Contrôles du slider -->
        <button @click="prevSlide" class="absolute left-2 sm:left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-1.5 sm:p-2 md:p-3 hover:bg-opacity-100 transition-all rounded-full z-10">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button @click="nextSlide" class="absolute right-2 sm:right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-1.5 sm:p-2 md:p-3 hover:bg-opacity-100 transition-all rounded-full z-10">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        <!-- Indicateurs -->
        <div class="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 md:space-x-3 z-10">
          <button 
            v-for="(slide, index) in slides" 
            :key="index" 
            @click="goToSlide(Number(index))"
            class="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-white bg-opacity-50 hover:bg-opacity-100 transition-all rounded-full"
            :class="{ 'bg-opacity-100': currentSlide === index }"
          ></button>
        </div>
      </div>

      <!-- Catégories -->
      <!-- <div class="py-12 sm:py-16" :style="{ backgroundColor: backgroundColor }">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12 sm:mb-18">
            <h2 class="section-title">Nos catégories</h2>
          </div>
          
          <div class="mt-8 sm:hidden overflow-x-auto whitespace-nowrap pb-4 -mx-4 px-4">
            <div class="inline-flex space-x-6">
              <a href="#" class="flex-shrink-0 text-center px-4 py-3 border-b-2 border-primary hover:text-primary transition-all">
                <h3 class="text-lg font-medium">Mobilier</h3>
              </a>
              
              <a href="#" class="flex-shrink-0 text-center px-4 py-3 border-b-2 border-primary hover:text-primary transition-all">
                <h3 class="text-lg font-medium">Décoration</h3>
              </a>
              
              <a href="#" class="flex-shrink-0 text-center px-4 py-3 border-b-2 border-primary hover:text-primary transition-all">
                <h3 class="text-lg font-medium">Accessoires</h3>
              </a>
              
              <a href="#" class="flex-shrink-0 text-center px-4 py-3 border-b-2 border-primary hover:text-primary transition-all">
                <h3 class="text-lg font-medium">Luminaires</h3>
              </a>
            </div>
          </div>
          
          <div class="hidden sm:mt-12 sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-x-4 gap-y-6 sm:gap-y-8">
            <a href="#" class="text-center py-3 sm:py-4 border-r-2 sm:border-r-2 border-primary hover:text-primary transition-all">
              <h3 class="text-lg sm:text-xl font-medium">Mobilier</h3>
            </a>
            
            <a href="#" class="text-center py-3 sm:py-4 border-r-2 sm:border-r-2 border-primary hover:text-primary transition-all">
              <h3 class="text-lg sm:text-xl font-medium">Décoration</h3>
            </a>
            
            <a href="#" class="text-center py-3 sm:py-4 border-r-2 sm:border-r-2 border-primary hover:text-primary transition-all">
              <h3 class="text-lg sm:text-xl font-medium">Accessoires</h3>
            </a>
            
            <a href="#" class="text-center py-3 sm:py-4  sm:border-r-0 border-primary hover:text-primary transition-all">
              <h3 class="text-lg sm:text-xl font-medium">Luminaires</h3>
            </a>
          </div>
        </div>
      </div> -->

      <!-- Produits vedettes -->
      <div class="py-16" :style="{ backgroundColor: backgroundColor }">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="section-title">Produits vedettes</h2>
          </div>
          
          <!-- Message si aucun produit -->
          <div v-if="!featuredProducts || featuredProducts.length === 0" class="text-center py-12">
            <p class="text-gray-600 text-lg">Aucun produit disponible pour le moment.</p>
          </div>
          
          <!-- Grille de produits -->
          <div v-else class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <NuxtLink 
              v-for="product in featuredProducts" 
              :key="product.id"
              :to="`/boutique/${shop?.subdomain}/produit/${product.id}`" 
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
                <div class="flex justify-between">
                  <h3 class="text-lg font-medium text-gray-900 truncate">{{ product.name }}</h3>
                  <span v-if="product.category" class="text-sm text-gray-500 ml-2 flex-shrink-0">{{ product.category.name }}</span>
                </div>
                <p class="mt-1 text-gray-600 line-clamp-2">{{ getCleanDescription(product.description, 100) }}</p>
                
                <div class="mt-4 flex justify-between items-center">
                  <span class="text-lg font-medium text-gray-900">{{ formatPrice(product.price) }}</span>
                  <!-- Bouton panier masqué pour les boutiques vitrine -->
                  <button 
                    v-if="shop?.shop_type !== 'website'"
                    class="p-2 bg-primary text-white transition-all rounded-md"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>


    </main>

    <!-- Pied de page -->
    <FooterEpure 
      :backgroundColor="backgroundColor" 
      :primaryColor="primaryColor"
      :footerText="footerText"
      :socialLinks="footerSocialLinks"
    />
    
  </div>
</template>

<script setup lang="ts">
import { getCleanDescription } from '~/utils/string'
import FooterEpure from '@/components/theme_epure/FooterEpure.vue'
import HeaderEpure from '@/components/theme_epure/HeaderEpure.vue'
definePageMeta({
  layout: false
})

import { ref, onMounted, onUnmounted, computed } from 'vue'

// Props pour recevoir les données de la boutique et customizations
interface Props {
  shop?: any
  customizations?: any
}

const props = defineProps<Props>()

// Nom de la boutique (utilise les données de la prop ou une valeur par défaut)
const shopName = computed(() => props.shop?.name || 'Notre Boutique')
const shopDescription = computed(() => props.shop?.description || 'Découvrez nos produits')

// Customizations avec valeurs par défaut
const bannerTitle = computed(() => props.customizations?.home?.banner?.title || 'Collection Été 2023')
const bannerSubtitle = computed(() => props.customizations?.home?.banner?.subtitle || 'Découvrez nos nouvelles pièces exclusives')
const bannerImages = computed(() => {
  if (props.customizations?.home?.banner?.images && props.customizations.home.banner.images.length > 0) {
    const config = useRuntimeConfig()
    const backendUrl = config.public.apiBase.replace('/api', '')
    return props.customizations.home.banner.images.map((path: string) => `${backendUrl}/storage/${path}`)
  }
  return [
    'https://placehold.co/1200x550?text=Image+1',
    'https://placehold.co/1200x550?text=Image+2',
    'https://placehold.co/1200x550?text=Image+3'
  ]
})

// Couleurs personnalisées
const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#e56a19')
const secondaryColor = computed(() => props.customizations?.home?.colors?.secondary || '#5b6ac5')
const backgroundColor = computed(() => props.customizations?.home?.colors?.background || '#ffffff')
const textColor = computed(() => props.customizations?.home?.colors?.text || '#000000')

// Polices personnalisées
const fontFamily = computed(() => props.customizations?.home?.fonts?.family || 'sans-serif')
const fontSize = computed(() => props.customizations?.home?.fonts?.size || 'medium')
const fontWeight = computed(() => props.customizations?.home?.fonts?.weight || 'normal')

// Footer (pied de page)
const footerText = computed(() => {
  if (props.customizations?.footer?.text) {
    return props.customizations.footer.text
  }
  return `© ${new Date().getFullYear()} ${shopName.value}. Tous droits réservés.`
})

const footerSocialLinks = computed(() => {
  return props.customizations?.footer?.socialLinks || {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  }
})

// Produits de la boutique
const featuredProducts = computed(() => {
  // Limiter à 4 produits
  return props.shop?.products?.slice(0, 4) || []
})

// Fonction pour formater le prix
const formatPrice = (price: number) => {
  const currency = props.shop?.currency || 'XOF'
  return `${price.toLocaleString('fr-FR')} ${currency}`
}

// Fonction pour obtenir l'URL de l'image du produit
const getProductImageUrl = (imagePath: string) => {
  const config = useRuntimeConfig()
  const backendUrl = config.public.apiBase.replace('/api', '')
  return `${backendUrl}/storage/${imagePath}`
}

const currentSlide = ref(0)
const slides = computed(() => bannerImages.value.map((_, index) => ({ title: `Slide ${index + 1}`, subtitle: '' })))

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

let slideInterval: NodeJS.Timeout

onMounted(() => {
  slideInterval = setInterval(() => {
    nextSlide()
  }, 5000)
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<style scoped>
.bg-primary {
  background-color: v-bind(primaryColor);
}

.border-primary {
  border-color: v-bind(primaryColor);
}

.text-primary {
  color: v-bind(primaryColor);
}

.bg-secondary {
  background-color: v-bind(secondaryColor);
}

.border-secondary {
  border-color: v-bind(secondaryColor);
}

.text-secondary {
  color: v-bind(secondaryColor);
}

.hover\:bg-secondary:hover {
  background-color: v-bind(secondaryColor);
}

.hover\:text-secondary:hover {
  color: v-bind(secondaryColor);
}

/* Bouton avec hover secondaire */
.hover-secondary-btn:hover {
  background-color: v-bind(secondaryColor) !important;
}

/* Améliorations de design */
.section-title {
  font-size: 2.5rem;
  letter-spacing: -0.025em;
  font-weight: 600;
  position: relative;
  display: inline-block;
  font-family: v-bind(fontFamily);
  color: v-bind(textColor);
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -12px;
  width: 60px;
  height: 3px;
  background-color: v-bind(primaryColor);
}

/* Animation de survol pour les cartes */
.product-card {
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  border-color: v-bind(primaryColor);
  border-width: 2px;
}

/* Accent visuel */
.accent-left {
  position: relative;
}

.accent-left::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 40px;
  background-color: v-bind(secondaryColor);
}

/* Animation pour les icônes de la section "Notre philosophie" */
.feature-icon {
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.feature-icon:hover {
  transform: scale(1.1);
  background-color: v-bind(secondaryColor);
}

</style>