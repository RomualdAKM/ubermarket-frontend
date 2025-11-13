<template>
  <div class="min-h-screen bg-white">
    <!-- En-tête -->
    <header class="border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="bg-primary w-8 h-8" />
            <span class="ml-3 text-xl font-medium text-gray-900">Boutique Thèmes</span>
          </div>

          <!-- Navigation desktop -->
          <nav class="hidden md:flex space-x-8">
            <a href="#" class="text-gray-900 font-medium border-b-2 border-primary">Accueil</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">Thèmes</a>
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
            <button class="ml-4 md:hidden text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main>
      <!-- Section héros -->
      <div class="bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div class="text-center">
            <h1 class="text-3xl md:text-4xl font-medium text-gray-900">Choisissez votre thème</h1>
            <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Découvrez nos deux thèmes élégants et professionnels pour votre boutique en ligne</p>
          </div>
        </div>
      </div>

      <!-- Sélection des thèmes -->
      <div class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Thème Professionnel -->
            <div class="border border-gray-200 group hover:border-primary transition-colors">
              <div class="bg-gray-100 w-full h-64 flex items-center justify-center">
                <span class="text-5xl font-medium text-gray-900">Pro</span>
              </div>
              <div class="p-8">
                <h2 class="text-2xl font-medium text-gray-900">Thème Professionnel</h2>
                <p class="mt-4 text-gray-600">Un design sobre et élégant, parfait pour les entreprises et les professionnels qui souhaitent transmettre une image sérieuse et fiable.</p>
                <ul class="mt-6 space-y-2">
                  <li class="flex items-center">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="ml-2 text-gray-600">Design sobre et professionnel</span>
                  </li>
                  <li class="flex items-center">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="ml-2 text-gray-600">Idéal pour les B2B</span>
                  </li>
                  <li class="flex items-center">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="ml-2 text-gray-600">Navigation intuitive</span>
                  </li>
                </ul>
                <div class="mt-8">
                  <NuxtLink to="/boutique/theme-professionnel" class="px-6 py-3 bg-primary text-white font-medium hover:bg-secondary">
                    Voir le thème
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Thème Épuré -->
            <div class="border border-gray-200 group hover:border-primary transition-colors">
              <div class="bg-gray-100 w-full h-64 flex items-center justify-center">
                <span class="text-5xl font-medium text-gray-900">Épuré</span>
              </div>
              <div class="p-8">
                <h2 class="text-2xl font-medium text-gray-900">Thème Épuré</h2>
                <p class="mt-4 text-gray-600">Un design minimaliste et raffiné, idéal pour les marques qui privilégient l'essentiel et la simplicité dans leur communication.</p>
                <ul class="mt-6 space-y-2">
                  <li class="flex items-center">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="ml-2 text-gray-600">Design minimaliste et épuré</span>
                  </li>
                  <li class="flex items-center">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="ml-2 text-gray-600">Idéal pour le B2C</span>
                  </li>
                  <li class="flex items-center">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="ml-2 text-gray-600">Mise en valeur des produits</span>
                  </li>
                </ul>
                <div class="mt-8">
                  <NuxtLink to="/boutique/theme-epure" class="px-6 py-3 bg-primary text-white font-medium hover:bg-secondary">
                    Voir le thème
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section caractéristiques -->
      <div class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-2xl font-medium text-gray-900">Pourquoi choisir nos thèmes ?</h2>
            <p class="mt-4 text-gray-600 max-w-2xl mx-auto">Chacun de nos thèmes est conçu pour offrir une expérience utilisateur optimale</p>
          </div>
          <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 bg-primary text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="mt-5 text-lg font-medium text-gray-900">Responsive</h3>
              <p class="mt-2 text-gray-600">Parfait sur tous les appareils, du mobile au desktop</p>
            </div>
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 bg-primary text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="mt-5 text-lg font-medium text-gray-900">Rapide</h3>
              <p class="mt-2 text-gray-600">Optimisé pour des temps de chargement ultra-rapides</p>
            </div>
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 bg-primary text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 class="mt-5 text-lg font-medium text-gray-900">Sécurisé</h3>
              <p class="mt-2 text-gray-600">Paiement sécurisé et protection des données</p>
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
              <div class="bg-primary w-6 h-6" />
              <span class="ml-2 text-lg font-medium text-gray-900">Boutique Thèmes</span>
            </div>
            <p class="mt-4 text-gray-600 text-sm">Solutions de e-commerce professionnelles et élégantes.</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 uppercase tracking-wider">Thèmes</h3>
            <ul class="mt-4 space-y-2">
              <li><NuxtLink to="/boutique/theme-professionnel" class="text-gray-600 hover:text-gray-900 text-sm">Professionnel</NuxtLink></li>
              <li><NuxtLink to="/boutique/theme-epure" class="text-gray-600 hover:text-gray-900 text-sm">Épuré</NuxtLink></li>
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
              <li class="text-gray-600 text-sm">contact@boutiquethemes.com</li>
              <li class="text-gray-600 text-sm">+33 1 23 45 67 89</li>
              <li class="text-gray-600 text-sm">Du lundi au vendredi</li>
              <li class="text-gray-600 text-sm">9h - 18h</li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-200 text-center">
          <p class="text-gray-600 text-sm">&copy; 2023 Boutique Thèmes. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
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