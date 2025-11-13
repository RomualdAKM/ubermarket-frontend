<template>
  <div class="min-h-screen bg-white">
    <!-- En-tête -->
    <header class="border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="bg-gray-900 w-8 h-8" />
            <span class="ml-3 text-xl font-medium text-gray-900">Boutique Pro</span>
          </div>

          <!-- Navigation desktop -->
          <nav class="hidden md:flex space-x-8">
            <a href="#" class="text-gray-600 hover:text-gray-900">Accueil</a>
            <a href="#" class="text-gray-900 font-medium border-b-2 border-gray-900">Produits</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">Collections</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">À propos</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">Contact</a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center">
            <button class="p-2 text-gray-600 hover:text-gray-900">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            <button class="p-2 text-gray-600 hover:text-gray-900 ml-2 relative">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary">3</span>
            </button>
            <button class="ml-4 md:hidden text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 class="text-2xl font-medium text-gray-900">Nos produits</h1>
            <p class="mt-1 text-gray-600">Découvrez notre gamme complète d'équipements professionnels</p>
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
                <option>Technologie</option>
                <option>Mobilier</option>
                <option>Sécurité</option>
                <option>Fournitures</option>
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
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Technologie (24)</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Mobilier (18)</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Sécurité (12)</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Fournitures (36)</a></li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Prix</h3>
                  <ul class="mt-2 space-y-2">
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Moins de 100 €</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">100 € - 300 €</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">300 € - 500 €</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-gray-900">Plus de 500 €</a></li>
                  </ul>
                </div>
                
              </div>
            </div>
          </div>

          <!-- Liste des produits -->
          <div class="flex-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

            <!-- Pagination -->
            <div class="mt-12 flex justify-center">
              <nav class="flex items-center space-x-2">
                <a href="#" class="px-3 py-2 text-gray-500 hover:text-gray-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </a>
                <a href="#" class="px-3 py-2 bg-gray-900 text-white">1</a>
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

    <!-- Pied de page -->
    <footer class="bg-gray-100 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center">
              <div class="bg-gray-900 w-6 h-6" />
              <span class="ml-2 text-lg font-medium text-gray-900">Boutique Pro</span>
            </div>
            <p class="mt-4 text-gray-600 text-sm">Solutions professionnelles de qualité supérieure pour votre activité.</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 uppercase tracking-wider">Produits</h3>
            <ul class="mt-4 space-y-2">
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Nouveautés</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Best-sellers</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Promotions</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Collections</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 uppercase tracking-wider">Support</h3>
            <ul class="mt-4 space-y-2">
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Contact</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">FAQ</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Livraison</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Retours</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 uppercase tracking-wider">Contact</h3>
            <ul class="mt-4 space-y-2">
              <li class="text-gray-600 text-sm">contact@boutiquepro.com</li>
              <li class="text-gray-600 text-sm">+33 1 23 45 67 89</li>
              <li class="text-gray-600 text-sm">Du lundi au vendredi</li>
              <li class="text-gray-600 text-sm">9h - 18h</li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-200 text-center">
          <p class="text-gray-600 text-sm">&copy; 2023 Boutique Pro. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
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