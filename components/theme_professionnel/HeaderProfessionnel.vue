<template>
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
          <a href="#" class="text-gray-900 font-medium border-b-2 border-gray-900">Accueil</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">Produits</a>
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
</template>

<script setup>
// Aucune logique nécessaire pour ce composant
</script>

<style scoped>
/* Les styles sont déjà inclus via Tailwind CSS */
</style>