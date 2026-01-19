<template>
  <header class="border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <NuxtLink :to="homeUrl" class="flex items-center">
          <img v-if="shopLogo" :src="shopLogo" :alt="shopName" class="h-10 w-auto">
          <div v-else class="bg-primary w-8 h-8 rounded-lg" />
          <span class="ml-3 text-xl font-medium text-gray-900">{{ shopName }}</span>
        </NuxtLink>

        <!-- Navigation desktop -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink :to="homeUrl" class="text-gray-900 font-medium border-b-2 border-primary">Accueil</NuxtLink>
          <NuxtLink :to="productsUrl" class="text-gray-600 hover:text-gray-900">Produits</NuxtLink>
          <NuxtLink :to="`${homeUrl}/a-propos`" class="text-gray-600 hover:text-gray-900">À propos</NuxtLink>
          <NuxtLink :to="`${homeUrl}/cgu`" class="text-gray-600 hover:text-gray-900">CGU</NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center space-x-2">
          <!-- Bouton Connexion (utilisateur non connecté) -->
          <NuxtLink 
            v-if="!user"
            to="/connexion"
            class="hidden md:flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Connexion
          </NuxtLink>

          <!-- Menu utilisateur (utilisateur connecté) -->
          <div v-else class="relative group">
            <button class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span class="hidden md:inline">{{ user.name }}</span>
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <!-- Dashboard Vendeur (si vendor) -->
              <NuxtLink
                v-if="user.role === 'vendor'"
                to="/mes-boutiques"
                class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <span class="font-medium">Mon Dashboard Vendeur</span>
                </div>
              </NuxtLink>

              <!-- Mes Commandes (tous les utilisateurs) -->
              <NuxtLink
                to="/dashboard-client/commandes"
                class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  Mes Commandes
                </div>
              </NuxtLink>

              <!-- Devenir Vendeur (si client) -->
              <NuxtLink
                v-if="user.role === 'client'"
                to="/devenir-vendeur"
                class="block px-4 py-3 text-sm text-white bg-primary hover:bg-opacity-90 border-b border-gray-100"
              >
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <span class="font-medium">⭐ Devenir Vendeur</span>
                </div>
              </NuxtLink>

              <!-- Mon Profil -->
              <NuxtLink
                to="/dashboard-client/profil"
                class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Mon Profil
                </div>
              </NuxtLink>

              <!-- Déconnexion -->
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Déconnexion
                </div>
              </button>
            </div>
          </div>

          <!-- Bouton Panier (masqué pour les boutiques vitrine) -->
          <NuxtLink 
            v-if="props.shop?.shop_type !== 'website'"
            :to="cartUrl" 
            class="p-2 text-gray-600 hover:text-gray-900 relative transition-colors"
            :title="`Panier (${cartCount} article${cartCount > 1 ? 's' : ''})`"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span 
              v-if="cartCount > 0"
              class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full animate-badge"
            >
              {{ cartCount }}
            </span>
          </NuxtLink>
          
          <!-- Menu mobile -->
          <button 
            @click="toggleMobileMenu" 
            class="ml-4 md:hidden text-gray-600"
            :aria-label="isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          >
            <svg v-if="!isMobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu mobile (affiché en bas du header) -->
    <div 
      v-if="isMobileMenuOpen" 
      class="md:hidden border-t border-gray-200 bg-white"
    >
      <nav class="px-4 py-4 space-y-2">
        <NuxtLink 
          :to="homeUrl" 
          @click="closeMobileMenu"
          class="block px-3 py-2 text-gray-900 font-medium bg-gray-100 rounded-md"
        >
          Accueil
        </NuxtLink>
        <NuxtLink 
          :to="productsUrl" 
          @click="closeMobileMenu"
          class="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          Produits
        </NuxtLink>
        <NuxtLink 
          :to="`${homeUrl}/a-propos`" 
          @click="closeMobileMenu"
          class="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          À propos
        </NuxtLink>
        <NuxtLink 
          :to="`${homeUrl}/cgu`" 
          @click="closeMobileMenu"
          class="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          CGU
        </NuxtLink>
        
        <!-- Séparateur -->
        <div class="border-t border-gray-200 my-2"></div>
        
        <!-- Connexion / Profil -->
        <NuxtLink 
          v-if="!user"
          to="/connexion"
          @click="closeMobileMenu"
          class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Connexion
        </NuxtLink>
        
        <!-- Menu utilisateur connecté -->
        <template v-else>
          <div class="px-3 py-2 text-sm font-medium text-gray-900">
            {{ user.name }}
          </div>
          
          <NuxtLink
            v-if="user.role === 'vendor'"
            to="/mes-boutiques"
            @click="closeMobileMenu"
            class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Mon Dashboard Vendeur
          </NuxtLink>
          
          <NuxtLink
            to="/dashboard-client/commandes"
            @click="closeMobileMenu"
            class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Mes Commandes
          </NuxtLink>
          
          <NuxtLink
            v-if="user.role === 'client'"
            to="/devenir-vendeur"
            @click="closeMobileMenu"
            class="flex items-center px-3 py-2 text-white bg-primary hover:bg-opacity-90 rounded-md"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            ⭐ Devenir Vendeur
          </NuxtLink>
          
          <NuxtLink
            to="/dashboard-client/profil"
            @click="closeMobileMenu"
            class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Mon Profil
          </NuxtLink>
          
          <button
            @click="handleLogout"
            class="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Déconnexion
          </button>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { useRuntimeConfig, useRouter } from '#app'
import { useCart } from '~/composables/useCart'
import { useAuth } from '~/composables/useAuth'
import { useShopNavigation } from '~/composables/useShopNavigation'

interface Props {
  shop?: any
  primaryColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#e56a19'
})

const router = useRouter()

// Composable pour gérer le panier
const { itemsCount, fetchCart } = useCart()

// Composable pour gérer l'authentification
const { user, logout } = useAuth()

// Composable pour la navigation adaptative
const { getHomeUrl, getCartUrl, getLoginUrl, getSignupUrl, getProductsUrl } = useShopNavigation()

const shopName = computed(() => props.shop?.name || 'Boutique')
const shopLogo = computed(() => {
  if (props.shop?.logo) {
    const config = useRuntimeConfig()
    const backendUrl = config.public.apiBase.replace('/api', '')
    return `${backendUrl}/storage/${props.shop.logo}`
  }
  return null
})

// URL de la page d'accueil (s'adapte automatiquement aux domaines personnalisés)
const homeUrl = computed(() => getHomeUrl(props.shop))

// URL du panier (s'adapte automatiquement aux domaines personnalisés)
const cartUrl = computed(() => getCartUrl(props.shop))

// URL de la page produits (s'adapte automatiquement aux domaines personnalisés)
const productsUrl = computed(() => getProductsUrl(props.shop))

// Nombre d'articles dans le panier (reactive)
const cartCount = computed(() => itemsCount.value || 0)

// État du menu mobile
const isMobileMenuOpen = ref(false)

// Fonction pour basculer le menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Fonction pour fermer le menu mobile
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Fonction de déconnexion
const handleLogout = async () => {
  await logout()
  // Recharger la page pour rafraîchir le state
  router.go(0)
}

// Charger le panier au montage du composant
onMounted(async () => {
  if (props.shop?.subdomain) {
    await fetchCart(props.shop.subdomain)
  }
})

// Recharger le panier si le shop change
watch(() => props.shop?.subdomain, async (newSubdomain) => {
  if (newSubdomain) {
    await fetchCart(newSubdomain)
  }
})
</script>

<style scoped>
/* Animation pour le badge du panier */
@keyframes badge-pop {
  0% {
    transform: translate(50%, -50%) scale(1);
  }
  50% {
    transform: translate(50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(50%, -50%) scale(1);
  }
}

.animate-badge {
  animation: badge-pop 0.3s ease-in-out;
}

/* Effet hover sur le bouton panier */
a[title]:hover svg {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}
</style>