<template>
  <!--
    HeaderOrganic.vue
    ─────────────────
    En-tête partagé pour toutes les pages du thème Organic.
    Inclut :
      - Barre d'annonce promo
      - Logo + barre de recherche fonctionnelle + panier
      - Navigation desktop avec badges qualité
      - Menu mobile déroulant
    
    Props :
      shop         → objet boutique complet
      primaryColor → couleur primaire (hex) depuis customizations
      cartCount    → nombre d'articles dans le panier (optionnel)
  -->
  <div>
    <!-- ── Barre d'annonce promotionnelle ───────────────────── -->
    <div class="promo-bar text-white text-xs sm:text-sm text-center py-2.5 px-4">
      <span class="font-medium">🌿 Livraison gratuite dès 25 000 XOF d'achat</span>
      <span class="hidden sm:inline mx-3 opacity-40">|</span>
      <span class="hidden sm:inline">Commande traitée sous 24h · Du lundi au samedi</span>
    </div>

    <!-- ── Header principal ─────────────────────────────────── -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 md:h-20 gap-4">

          <!-- Logo + Nom boutique -->
          <NuxtLink :to="`/boutique/${shop?.subdomain}`"
            class="flex-shrink-0 flex items-center gap-3">
            <img v-if="shop?.logo" :src="getImageUrl(shop.logo)" :alt="shop?.name"
              class="h-10 w-10 object-contain rounded-full flex-shrink-0" />
            <div v-else
              class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              :style="{ backgroundColor: primaryColor }">
              {{ shop?.name?.[0]?.toUpperCase() || 'B' }}
            </div>
            <span class="font-bold text-gray-900 text-lg hidden sm:block truncate max-w-[160px]">
              {{ shop?.name }}
            </span>
          </NuxtLink>

          <!-- Barre de recherche desktop — fonctionnelle (redirige vers /produits?q=...) -->
          <form class="hidden md:flex flex-1 max-w-xl mx-6"
            @submit.prevent="submitSearch">
            <div class="relative w-full">
              <input
                v-model="localSearch"
                type="text"
                placeholder="Rechercher un produit..."
                class="w-full pl-4 pr-12 py-2.5 rounded-full border-2 text-sm focus:outline-none transition-colors"
                :style="{ borderColor: searchFocused ? primaryColor : '#e5e7eb' }"
                @focus="searchFocused = true"
                @blur="searchFocused = false"
              />
              <button
                type="submit"
                class="absolute right-0 top-0 h-full px-4 rounded-r-full text-white transition-colors hover:opacity-90"
                :style="{ backgroundColor: primaryColor }">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>
          </form>

          <!-- Actions : compte + panier + menu mobile -->
          <div class="flex items-center gap-2 sm:gap-4">

            <!-- Mon compte (masqué sur mobile) -->
            <button
              class="hidden sm:flex items-center gap-1.5 text-gray-700 hover:text-gray-900 transition-colors text-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>Mon compte</span>
            </button>

            <!-- Icône panier avec compteur -->
            <NuxtLink v-if="shop?.shop_type !== 'website'"
              :to="`/boutique/${shop?.subdomain}/panier`"
              class="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 transition-colors relative">
              <div class="relative">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <!-- Badge compteur panier -->
                <span v-if="cartCount > 0"
                  class="absolute -top-2 -right-2 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  :style="{ backgroundColor: primaryColor }">
                  {{ cartCount }}
                </span>
              </div>
              <span class="hidden sm:block text-sm font-medium">Panier</span>
            </NuxtLink>

            <!-- Bouton menu mobile -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 text-gray-700"
              aria-label="Menu">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation desktop -->
        <nav class="hidden md:flex items-center gap-6 border-t border-gray-100 py-3">
          <NuxtLink :to="`/boutique/${shop?.subdomain}`"
            class="text-sm font-semibold transition-colors"
            :style="{ color: primaryColor }">Accueil</NuxtLink>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Tous les produits
          </NuxtLink>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/a-propos`"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            À propos
          </NuxtLink>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/contact`"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Contact
          </NuxtLink>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/livraison`"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Livraison
          </NuxtLink>

          <!-- Badges qualité (côté droit) -->
          <div class="ml-auto flex items-center gap-4">
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <span>🌿</span><span>100% Naturel</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <span>🚚</span><span>Livraison rapide</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <span>✅</span><span>Qualité garantie</span>
            </div>
          </div>
        </nav>
      </div>

      <!-- Menu mobile déroulant -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen"
          class="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <!-- Recherche mobile -->
          <form class="relative mb-4" @submit.prevent="submitSearch">
            <input v-model="localSearch" type="text" placeholder="Rechercher..."
              class="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-green-400"/>
            <button type="submit" class="absolute right-3 top-3">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </form>
          <NuxtLink :to="`/boutique/${shop?.subdomain}`"
            @click="mobileMenuOpen=false"
            class="block py-2 font-semibold" :style="{ color: primaryColor }">Accueil</NuxtLink>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`"
            @click="mobileMenuOpen=false" class="block py-2 text-gray-700">Tous les produits</NuxtLink>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/a-propos`"
            @click="mobileMenuOpen=false" class="block py-2 text-gray-700">À propos</NuxtLink>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/contact`"
            @click="mobileMenuOpen=false" class="block py-2 text-gray-700">Contact</NuxtLink>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/livraison`"
            @click="mobileMenuOpen=false" class="block py-2 text-gray-700">Livraison & retours</NuxtLink>
        </div>
      </Transition>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// ── Props ───────────────────────────────────────────────────────
interface Props {
  shop?: any
  primaryColor?: string
  cartCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#2d9b5c',
  cartCount: 0,
})

const router       = useRouter()
const config       = useRuntimeConfig()
const localSearch  = ref('')
const searchFocused = ref(false)
const mobileMenuOpen = ref(false)

// ── Helpers ─────────────────────────────────────────────────────

/** Construit l'URL complète d'une image depuis son chemin storage */
const getImageUrl = (path: string): string => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${config.public.apiBase.replace('/api', '')}/storage/${path}`
}

/**
 * Soumet la recherche → redirige vers la page produits avec ?q=...
 * La page produits.vue lit ce paramètre pour filtrer automatiquement.
 */
const submitSearch = () => {
  if (!localSearch.value.trim()) return
  router.push(`/boutique/${props.shop?.subdomain}/produits?q=${encodeURIComponent(localSearch.value.trim())}`)
  mobileMenuOpen.value = false
}
</script>

<style scoped>
/* Barre d'annonce — couleur dynamique via prop */
.promo-bar { background-color: v-bind('props.primaryColor'); }

/* Animation menu mobile */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>