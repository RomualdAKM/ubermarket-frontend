<template>
  <div class="min-h-screen bg-white">
    <!-- Header simple -->
    <header class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-light text-gray-900">Mon Compte</h1>
          <div class="flex items-center space-x-4">
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

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user: currentUser, fetchUser, logout, token } = useAuth()
const user = ref({
  name: 'Client'
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