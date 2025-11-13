<template>
  <div class="min-h-screen bg-white">
    <!-- En-tête -->
    <HeaderProfessionnel />

    <main>
      <!-- Section héros avec slider -->
<div class="relative">
  <!-- Slider -->
  <div class="overflow-hidden">
    <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      <!-- Slide 1 -->
      <div class="w-full flex-shrink-0 relative h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px]">
        <img src="https://placehold.co/1920x600?text=72H+Chrono+Immersion+Linguistique" alt="Slide 1" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
          <div class="text-center">
            <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-3">72H CHRONO</h2>
            <p class="text-xl sm:text-2xl mb-4">Immersion Linguistique</p>
          </div>
        </div>
      </div>
      <!-- Slide 2 -->
      <div class="w-full flex-shrink-0 relative h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px]">
        <img src="https://placehold.co/1920x600?text=Innovation+Technologique" alt="Slide 2" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
          <div class="text-center">
            <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-3">Innovation Technologique</h2>
            <p class="text-xl sm:text-2xl mb-4">Des outils modernes pour booster votre productivité</p>
          </div>
        </div>
      </div>
      <!-- Slide 3 -->
      <div class="w-full flex-shrink-0 relative h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px]">
        <img src="https://placehold.co/1920x600?text=Service+Client" alt="Slide 3" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
          <div class="text-center">
            <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-3">Service client exceptionnel</h2>
            <p class="text-xl sm:text-2xl mb-4">Support technique disponible 24h/24 et 7j/7</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contrôles du slider (déplacés en bas) -->
    <div class="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-10">
      <!-- Boutons de navigation -->
      <button @click="prevSlide" class="bg-white bg-opacity-80 p-2 hover:bg-opacity-100 transition-all rounded-full">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <!-- Indicateurs de slide -->
      <button 
        v-for="(slide, index) in slides" 
        :key="index" 
        @click="goToSlide(index)"
        class="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-white bg-opacity-50 hover:bg-opacity-100 transition-all rounded-full"
        :class="{ 'bg-opacity-100': currentSlide === index }"
      ></button>
      
      <!-- Bouton nextSlide -->
      <button @click="nextSlide" class="bg-white bg-opacity-80 p-2 hover:bg-opacity-100 transition-all rounded-full">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  </div>
</div>

      <!-- Catégories -->
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12 sm:mb-18">
            <h2 class="text-2xl sm:text-3xl font-medium text-gray-900">Nos catégories</h2>
            <p class="mt-2 text-gray-600 max-w-2xl mx-auto">Découvrez notre large sélection de produits professionnels</p>
          </div>
          
          <!-- Version mobile avec défilement horizontal -->
          <div class="mt-8 sm:hidden overflow-x-auto whitespace-nowrap pb-4 -mx-4 px-4">
            <div class="inline-flex space-x-6">
              <a href="#" class="flex-shrink-0 text-center px-4 py-3  hover:text-gray-900 transition-all">
                <h3 class="text-lg font-medium">Technologie</h3>
              </a>
              
              <a href="#" class="flex-shrink-0 text-center px-4 py-3  hover:text-gray-900 transition-all">
                <h3 class="text-lg font-medium">Mobilier</h3>
              </a>
              
              <a href="#" class="flex-shrink-0 text-center px-4 py-3  hover:text-gray-900 transition-all">
                <h3 class="text-lg font-medium">Sécurité</h3>
              </a>
              
              <a href="#" class="flex-shrink-0 text-center px-4 py-3  hover:text-gray-900 transition-all">
                <h3 class="text-lg font-medium">Fournitures</h3>
              </a>
            </div>
          </div>
          
          <!-- Version desktop/tablette avec grille -->
          <div class="hidden sm:mt-12 sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-x-4 gap-y-6 sm:gap-y-8">
            <a href="#" class="text-center py-3 sm:py-4  hover:text-gray-900 transition-all">
              <h3 class="text-lg sm:text-xl font-medium">Technologie</h3>
            </a>
            
            <a href="#" class="text-center py-3 sm:py-4  hover:text-gray-900 transition-all">
              <h3 class="text-lg sm:text-xl font-medium">Mobilier</h3>
            </a>
            
            <a href="#" class="text-center py-3 sm:py-4  hover:text-gray-900 transition-all">
              <h3 class="text-lg sm:text-xl font-medium">Sécurité</h3>
            </a>
            
            <a href="#" class="text-center py-3 sm:py-4  sm:border-r-0 border-gray-900 hover:text-gray-900 transition-all">
              <h3 class="text-lg sm:text-xl font-medium">Fournitures</h3>
            </a>
          </div>
        </div>
      </section>

      <!-- Produits vedettes -->
      <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>

          <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            <div class="group relative">
              <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg" alt="Front of men&#039;s Basic Tee in black." class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
              <div class="mt-4 flex justify-between">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      Basic Tee
                    </a>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">Black</p>
                </div>
                <p class="text-sm font-medium text-gray-900">$35</p>
              </div>
            </div>
            <div class="group relative">
              <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg" alt="Front of men&#039;s Basic Tee in white." class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
              <div class="mt-4 flex justify-between">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      Basic Tee
                    </a>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">Aspen White</p>
                </div>
                <p class="text-sm font-medium text-gray-900">$35</p>
              </div>
            </div>
            <div class="group relative">
              <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg" alt="Front of men&#039;s Basic Tee in dark gray." class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
              <div class="mt-4 flex justify-between">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      Basic Tee
                    </a>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">Charcoal</p>
                </div>
                <p class="text-sm font-medium text-gray-900">$35</p>
              </div>
            </div>
            <div class="group relative">
              <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg" alt="Front of men&#039;s Artwork Tee in peach with white and brown dots forming an isometric cube." class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
              <div class="mt-4 flex justify-between">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      Artwork Tee
                    </a>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">Iso Dots</p>
                </div>
                <p class="text-sm font-medium text-gray-900">$35</p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </main>

    <!-- Pied de page -->
    <FooterProfessionnel />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

import { ref, onMounted, onUnmounted, computed } from 'vue'

// Props pour recevoir les données de la boutique
interface Props {
  shop?: any
}

const props = defineProps<Props>()

// Nom de la boutique (utilise les données de la prop ou une valeur par défaut)
const shopName = computed(() => props.shop?.name || 'Boutique Professionnelle')
const shopDescription = computed(() => props.shop?.description || 'Solutions professionnelles de qualité')

// Données du slider
const slides = ref([
  { id: 1, title: "Solutions professionnelles de qualité" },
  { id: 2, title: "Innovation technologique" },
  { id: 3, title: "Service client exceptionnel" }
])

const currentSlide = ref(0)
let slideInterval = null

// Navigation du slider
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// Démarrage du slider automatique
onMounted(() => {
  slideInterval = setInterval(() => {
    nextSlide()
  }, 5000)
})

// Nettoyage de l'intervalle lors du démontage
onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>

<style scoped>
.bg-primary {
  background-color: #e56a19;
}

.hover\:bg-secondary:hover {
  background-color: #5b6ac5;
}

.text-primary {
  color: #e56a19;
}

.hover\:text-secondary:hover {
  color: #5b6ac5;
}
</style>