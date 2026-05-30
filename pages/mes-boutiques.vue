<template>
  <div class="max-w-7xl mx-auto p-6">
    <NuxtLink to="/">
        <img alt="UberMarket Logo" class="h-34 md:h-36" src="/uber-market.png">
        <!-- Le bouton de déconnexion sorti du lien et placé en haut à droite -->
        <button 
          @click="handleLogout"
          class="absolute top-2 right-2 flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
          </svg>
          <span>Se déconnecter</span>
        </button>
    </NuxtLink>
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Content de te revoir, {{ user?.name }}
            <div class="px-4 py-3 border-b border-slate-100">
              <!--<p class="text-sm font-medium text-slate-900">{{ user?.name }}</p>-->
              <p class="text-xs text-slate-500 truncate">{{ user?.email }}</p>
            </div>
        </h1>
        <!-- <p class="text-gray-600 mt-1">Gérez vos boutiques en ligne</p> -->
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mes sites /  Boutiques </h1>
        <!-- <p class="text-gray-600 mt-1">Gérez vos boutiques en ligne</p> -->
      </div>
      <NuxtLink to="/creer-boutique" class="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md transition-colors duration-200">
        + Nouveau projet
      </NuxtLink>
    </div>

    <!-- Message de chargement -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-3 text-gray-600">Chargement de vos sites/boutiques...</span>
    </div>

    <!-- Message si aucune boutique -->
    <div v-else-if="shops.length === 0 && collaborations.length === 0 && !loading" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune site/boutique trouvée</h3>
      <p class="text-gray-500 mb-6">Commencez par créer votre première site/boutique en ligne</p>
      <NuxtLink to="/creer-boutique" class="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200">
        Créer mon premier projet
      </NuxtLink>
    </div>

    <!-- Liste des boutiques propriétaires -->
    <div v-else>
      <!-- Filtres -->
      <div v-if="shops.length > 0" class="mb-6 flex gap-2">
        <button
          @click="activeFilter = 'all'"
          :class="activeFilter === 'all' 
            ? 'bg-primary text-white' 
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          Tous ({{ shops.length }})
        </button>
        <button
          @click="activeFilter = 'e-commerce'"
          :class="activeFilter === 'e-commerce' 
            ? 'bg-primary text-white' 
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          Boutiques ({{ shops.filter(s => s.shop_type === 'e-commerce').length }})
        </button>
        <button
          @click="activeFilter = 'website'"
          :class="activeFilter === 'website' 
            ? 'bg-primary text-white' 
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          Sites vitrines ({{ shops.filter(s => s.shop_type === 'website').length }})
        </button>
      </div>
      <!-- Section Mes boutiques -->
      <div v-if="shops.length > 0" class="mb-10">
        <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Mes sites/boutiques</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="shop in filteredShops" :key="shop.id" class="bg-white border border-gray-200 rounded-lg">
            <div class="p-6">
              <div class="flex items-start">
                <!-- Logo de la boutique -->
                <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    v-if="shop.logo" 
                    :src="getLogoUrl(shop.logo)" 
                    :alt="`Logo ${shop.name}`"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ shop.name }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ getShopTypeLabel(shop.shop_type) }}</p>
                  <div class="mt-3">
                    <span :class="getStatusClass(shop.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ getStatusLabel(shop.status) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 flex space-x-3">
                <NuxtLink 
                  :to="`/dashboard-vendor/${shop.slug}`"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 text-center"
                >
                  Gérer
                </NuxtLink>
                <NuxtLink 
                  :to="getShopUrl(shop)"
                  target="_blank"
                  class="flex-1 px-3 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 text-center"
                >
                  Voir
                </NuxtLink>
              </div>
            </div>
            
            <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 rounded-b-lg">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Catégorie</span>
                <span class="font-medium text-gray-900">{{ shop.category?.name || 'Non définie' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Boutiques collaboratives -->
      <div v-if="collaborations.length > 0" class="mb-10">
        <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Boutiques collaboratives</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="collab in collaborations" :key="collab.id" class="bg-white border border-gray-200 rounded-lg">
            <div class="p-6">
              <div class="flex items-start">
                <!-- Logo de la boutique -->
                <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    v-if="collab.shop.logo" 
                    :src="getLogoUrl(collab.shop.logo)" 
                    :alt="`Logo ${collab.shop.name}`"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ collab.shop.name }}</h3>
                  <p class="text-sm text-gray-500 mt-1">Collaborateur</p>
                  <div class="mt-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ collab.role.name }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="mt-6">
                <NuxtLink 
                  :to="`/dashboard-vendor/${collab.shop.slug}`"
                  class="w-full block px-3 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 text-center"
                >
                  Accéder
                </NuxtLink>
              </div>
            </div>
            
            <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 rounded-b-lg">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Invité par</span>
                <span class="font-medium text-gray-900">{{ collab.invited_by || 'Propriétaire' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucune boutique (ni propriétaire ni collaborateur) -->
      <div v-if="shops.length === 0 && collaborations.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun(e) site/boutique trouvée</h3>
        <p class="text-gray-500 mb-6">Commencez par créer votre premier/première, site/boutique en ligne</p>
        <NuxtLink to="/creer-boutique" class="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200">
          Créer mon premier projet
        </NuxtLink>
      </div>
      
      <!-- Carte pour créer une nouvelle boutique (si au moins une boutique existe) -->
      <div v-if="shops.length > 0 || collaborations.length > 0" class="mt-6">
        <div class="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 text-center hover:border-primary transition-colors duration-200 cursor-pointer max-w-sm">
          <div class="text-gray-400 text-3xl mb-3">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Nouveau projet</h3>
          <p class="text-gray-500 text-sm mt-1">Créer une autre site/boutique</p>
          <div class="mt-4">
            <NuxtLink to="/creer-boutique" class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200">
              Créer
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Navigation vers les analyses -->
    <div class="mt-10 flex justify-center">
      <NuxtLink to="/analyses" class="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md transition-colors duration-200">
        Voir les analyses
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
//import { ref, onMounted } from 'vue'
import { useShops } from '~/composables/useShops'
import { useAuth } from '~/composables/useAuth'
import { useCollaborators } from '~/composables/useCollaborators'
import { ref, onMounted, computed } from 'vue'

// Redirection si non authentifié
const { isAuthenticated } = useAuth()
if (!isAuthenticated.value) {
  await navigateTo('/connexion-vendeur')
}

// Recuperation de la boutique courante et de l'utilisateur
//const { currentShop, currentAccess, hasPermission, hasAnyPermission } = useShops()
const { user, logout } = useAuth()

// Composables
const { shops, fetchShops } = useShops()
const { myCollaborations: collaborations, fetchMyCollaborations } = useCollaborators()
const config = useRuntimeConfig()

// États locaux
const loading = ref(true)
// Filtre actif : 'all' | 'e-commerce' | 'website'
const activeFilter = ref<'all' | 'e-commerce' | 'website'>('all')

const filteredShops = computed(() => {
  if (activeFilter.value === 'all') return shops.value
  return shops.value.filter(s => s.shop_type === activeFilter.value)
})
const showSuccessMessage = ref(false)

// Fonctions utilitaires
const getLogoUrl = (logoPath: string) => {
  if (!logoPath) return undefined
  return `${config.public.apiBase.replace('/api', '')}/storage/${logoPath}`
}

const getShopTypeLabel = (shopType: string) => {
  const labels = {
    'e-commerce': 'Boutique e-commerce',
    'website': 'Site vitrine'
  }
  return labels[shopType as keyof typeof labels] || shopType
}

const getStatusLabel = (status: string) => {
  const labels = {
    'active': 'Active',
    'inactive': 'Inactive',
    'draft': 'Brouillon'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusClass = (status: string) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-red-100 text-red-800',
    'draft': 'bg-yellow-100 text-yellow-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getShopUrl = (shop: any) => {
  const identifier = shop.subdomain || shop.slug
  if (!identifier) return '#'
  return shop.shop_type === 'website'
    ? `/site/${identifier}`
    : `/boutique/${identifier}`
}

// Chargement des données au montage
onMounted(async () => {
  try {
    // Charger les boutiques propriétaires et les collaborations en parallèle
    await Promise.all([
      fetchShops(),
      fetchMyCollaborations()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loading.value = false
  }
})


</script>

