<template>
  <div class="min-h-screen bg-white">
    <!-- En-tête -->
    <HeaderEpure />

    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 class="text-2xl font-medium text-gray-900">Nos produits</h1>
            <p class="mt-1 text-gray-600">Découvrez notre collection épurée d'articles de qualité</p>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="flex space-x-4">
              <select class="border border-gray-300 px-3 py-2 text-sm">
                <option>Trier par: Popularité</option>
                <option>Prix: Croissant</option>
                <option>Prix: Décroissant</option>
                <option>Nouveautés</option>
              </select>
              <select class="border border-gray-300 px-3 py-2 text-sm">
                <option>Filtrer par: Tous</option>
                <option>Mobilier</option>
                <option>Décoration</option>
                <option>Accessoires</option>
                <option>Luminaires</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Filtres mobile -->
        <div class="md:hidden mb-6">
          <button class="w-full flex items-center justify-between px-4 py-3 bg-gray-100 text-gray-900 font-medium">
            <span>Filtres</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </button>
        </div>

        <div class="flex flex-col md:flex-row">
          <!-- Filtres desktop -->
          <div class="md:w-64 md:pr-8 mb-8 md:mb-0">
            <div class="hidden md:block">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Filtres</h2>
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Catégories</h3>
                  <ul class="mt-2 space-y-2">
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Mobilier (12)</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Décoration (8)</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Accessoires (15)</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Luminaires (9)</a></li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Prix</h3>
                  <ul class="mt-2 space-y-2">
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Moins de 50 €</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">50 € - 150 €</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">150 € - 300 €</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Plus de 300 €</a></li>
                  </ul>
                </div>
         
              </div>
            </div>
          </div>

          <!-- Liste des produits -->
          <div class="flex-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             <!-- Produit 1 -->
            <div class="bg-white border border-gray-200 rounded-md group hover:border-primary transition-all duration-300 product-card">
              <div class="bg-gray-100 w-full h-64 flex items-center justify-center">
                <img src="https://placehold.co/120x550" alt="Slide 3" class="w-full h-full object-cover">
              </div>
              <div class="p-5">
                <div class="flex justify-between">
                  <h3 class="text-lg font-medium text-gray-900">Chaise minimaliste</h3>
                  <span class="text-sm text-gray-500">Mobilier</span>
                </div>
                <p class="mt-1 text-gray-600">Design épuré et confortable</p>
                <div class="mt-4 flex justify-between items-center">
                  <span class="text-lg font-medium text-gray-900">299,00 €</span>
                  <button class="p-2 bg-primary text-white  transition-all rounded-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Produit 2 -->
            <div class="bg-white border border-gray-200 rounded-md group hover:border-primary transition-all duration-300 product-card">
              <div class="bg-gray-100 w-full h-64 flex items-center justify-center">
                <img src="https://placehold.co/120x550" alt="Slide 3" class="w-full h-full object-cover">
              </div>
              <div class="p-5">
                <div class="flex justify-between">
                  <h3 class="text-lg font-medium text-gray-900">Lampe de bureau</h3>
                  <span class="text-sm text-gray-500">Luminaire</span>
                </div>
                <p class="mt-1 text-gray-600">Éclairage fonctionnel et sobre</p>
                <div class="mt-4 flex justify-between items-center">
                  <span class="text-lg font-medium text-gray-900">149,00 €</span>
                  <button class="p-2 bg-primary text-white  transition-all rounded-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Produit 3 -->
            <div class="bg-white border border-gray-200 rounded-md group hover:border-primary transition-all duration-300 product-card">
              <div class="bg-gray-100 w-full h-64 flex items-center justify-center">
                <img src="https://placehold.co/120x550" alt="Slide 3" class="w-full h-full object-cover">
              </div>
              <div class="p-5">
                <div class="flex justify-between">
                  <h3 class="text-lg font-medium text-gray-900">Cadre photo</h3>
                  <span class="text-sm text-gray-500">Décoration</span>
                </div>
                <p class="mt-1 text-gray-600">Simplicité dans sa forme pure</p>
                <div class="mt-4 flex justify-between items-center">
                  <span class="text-lg font-medium text-gray-900">39,00 €</span>
                  <button class="p-2 bg-primary text-white  transition-all rounded-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

              <!-- Produit 4 -->
               <div class="bg-white border border-gray-200 rounded-md group hover:border-primary transition-all duration-300 product-card">
              <div class="bg-gray-100 w-full h-64 flex items-center justify-center">
                <img src="https://placehold.co/120x550" alt="Slide 3" class="w-full h-full object-cover">
              </div>
              <div class="p-5">
                <div class="flex justify-between">
                  <h3 class="text-lg font-medium text-gray-900">Cadre photo</h3>
                  <span class="text-sm text-gray-500">Décoration</span>
                </div>
                <p class="mt-1 text-gray-600">Simplicité dans sa forme pure</p>
                <div class="mt-4 flex justify-between items-center">
                  <span class="text-lg font-medium text-gray-900">39,00 €</span>
                  <button class="p-2 bg-primary text-white  transition-all rounded-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

              <!-- Produit 5 -->
           <div class="bg-white border border-gray-200 rounded-md group hover:border-primary transition-all duration-300 product-card">
              <div class="bg-gray-100 w-full h-64 flex items-center justify-center">
                <img src="https://placehold.co/120x550" alt="Slide 3" class="w-full h-full object-cover">
              </div>
              <div class="p-5">
                <div class="flex justify-between">
                  <h3 class="text-lg font-medium text-gray-900">Cadre photo</h3>
                  <span class="text-sm text-gray-500">Décoration</span>
                </div>
                <p class="mt-1 text-gray-600">Simplicité dans sa forme pure</p>
                <div class="mt-4 flex justify-between items-center">
                  <span class="text-lg font-medium text-gray-900">39,00 €</span>
                  <button class="p-2 bg-primary text-white  transition-all rounded-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

              <!-- Produit 6 -->
             <div class="bg-white border border-gray-200 rounded-md group hover:border-primary transition-all duration-300 product-card">
              <div class="bg-gray-100 w-full h-64 flex items-center justify-center">
                <img src="https://placehold.co/120x550" alt="Slide 3" class="w-full h-full object-cover">
              </div>
              <div class="p-5">
                <div class="flex justify-between">
                  <h3 class="text-lg font-medium text-gray-900">Cadre photo</h3>
                  <span class="text-sm text-gray-500">Décoration</span>
                </div>
                <p class="mt-1 text-gray-600">Simplicité dans sa forme pure</p>
                <div class="mt-4 flex justify-between items-center">
                  <span class="text-lg font-medium text-gray-900">39,00 €</span>
                  <button class="p-2 bg-primary text-white  transition-all rounded-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            </div>

            <!-- Pagination -->
            <div class="mt-12 flex justify-center">
              <nav class="flex items-center space-x-2">
                <a href="#" class="px-3 py-2 text-gray-500 hover:text-gray-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </a>
                <a href="#" class="px-3 py-2 bg-primary text-white">1</a>
                <a href="#" class="px-3 py-2 text-gray-700 hover:bg-gray-100">2</a>
                <a href="#" class="px-3 py-2 text-gray-700 hover:bg-gray-100">3</a>
                <span class="px-3 py-2 text-gray-500">...</span>
                <a href="#" class="px-3 py-2 text-gray-700 hover:bg-gray-100">8</a>
                <a href="#" class="px-3 py-2 text-gray-500 hover:text-gray-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterEpure />

  </div>
</template>

<script setup lang="ts">
import FooterEpure from '@/components/theme_epure/FooterEpure.vue'
import HeaderEpure from '@/components/theme_epure/HeaderEpure.vue'
definePageMeta({
  layout: false
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