<template>
  <div class="min-h-screen bg-white">
    <!-- Header simple -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-light text-gray-900">Mon Compte</h1>
          <div class="flex items-center space-x-4">
            <!-- Bouton Continuer mes achats -->
            <NuxtLink 
              v-if="shopUrl" 
              :to="shopUrl"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Continuer mes achats
            </NuxtLink>
            <span class="text-sm text-gray-600">Bonjour, {{ user.name }}</span>
            <button @click="handleLogout" class="text-sm text-gray-500 hover:text-gray-700">Déconnexion</button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <nav class="space-y-2">
            <NuxtLink 
              to="/dashboard-client/profil" 
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path.includes('profil') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mes Informations
            </NuxtLink>

            <NuxtLink 
              to="/dashboard-client/commandes" 
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path.includes('commandes') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Mes Commandes
            </NuxtLink>

            <NuxtLink 
              to="/dashboard-client/souhaits" 
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path.includes('souhaits') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Liste de Souhaits
            </NuxtLink>
          </nav>
        </div>

        <!-- Contenu principal -->
        <div class="lg:col-span-3">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { user: currentUser, fetchUser, logout, token } = useAuth()
const user = ref({
  name: 'Client'
})

// Détecter l'URL de la boutique depuis le paramètre redirect ou localStorage
const shopUrl = computed(() => {
  // Vérifier dans le query param redirect
  const redirect = route.query.redirect as string
  if (redirect && redirect.includes('/boutique/')) {
    const match = redirect.match(/(\/boutique\/[^\/]+)/)
    if (match) {
      return match[1]
    }
  }
  
  // Vérifier dans le localStorage
  if (process.client) {
    const lastShop = localStorage.getItem('last_shop_url')
    if (lastShop) {
      return lastShop
    }
  }
  
  // Par défaut, retourner vers la marketplace
  return '/'
})

// Charger les informations de l'utilisateur
onMounted(async () => {
  if (!token.value) {
    router.push('/connexion')
    return
  }
  
  const userData = await fetchUser()
  if (userData) {
    user.value = userData
  }
})

// Déconnexion
const handleLogout = async () => {
  await logout()
  router.push('/connexion')
}
</script>