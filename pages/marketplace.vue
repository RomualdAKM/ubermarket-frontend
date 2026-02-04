<template>
  <div class="landing-page antialiased text-sm text-gray-900">
    <!-- Navbar (même que landing page) -->
    <nav class="fixed w-full top-0 z-50 px-4 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-neutral-300 bg-white/80 backdrop-blur">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <NuxtLink to="/">
          <img alt="UberMarket Logo" class="h-14 md:h-16" src="/uber-market.png">
        </NuxtLink>
        <div class="hidden md:flex gap-3">
          <NuxtLink to="/marketplace" class="py-1 px-3 text-primary font-medium">Marketplace</NuxtLink>
          <NuxtLink to="/#fonctionnalites" class="py-1 px-3 hover:text-zinc-500">Fonctionnalités</NuxtLink>
          <NuxtLink to="/#tarifs" class="py-1 px-3 hover:text-zinc-500">Tarifs</NuxtLink>
        </div>
        <button @click="toggleMobileMenu" class="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>
        </button>
        <NuxtLink to="/inscription-vendeur" class="hidden md:inline-block py-2.5 px-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] bg-primary text-white rounded-full hover:opacity-90 transition-opacity">
          Commencer gratuitement
        </NuxtLink>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div :class="['fixed top-0 right-0 z-50 w-full bg-white shadow-xl shadow-black/5 transition-all duration-300 ease-in-out overflow-hidden', mobileMenuOpen ? 'h-72' : 'h-0']">
      <div class="flex items-center justify-between p-4">
        <img alt="UberMarket Logo" class="h-14" src="/uber-market.png">
        <button @click="toggleMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>
      <div class="flex flex-col gap-4 p-4 text-base">
        <NuxtLink to="/marketplace" @click="closeMobileMenu" class="py-1 px-3 text-primary font-medium">Marketplace</NuxtLink>
        <NuxtLink to="/#fonctionnalites" @click="closeMobileMenu" class="py-1 px-3">Fonctionnalités</NuxtLink>
        <NuxtLink to="/#tarifs" @click="closeMobileMenu" class="py-1 px-3">Tarifs</NuxtLink>
        <NuxtLink to="/inscription-vendeur" @click="closeMobileMenu" class="py-2.5 px-6 w-max text-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] bg-primary text-white rounded-full">
          Commencer gratuitement
        </NuxtLink>
      </div>
    </div>

    <!-- Contenu principal -->
    <main class="pt-24 pb-16">
      <!-- Section héro -->
      <section class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 xl:px-32 py-12">
          <div class="text-center max-w-2xl mx-auto">
            <h1 class="text-3xl md:text-4xl font-urbanist font-semibold text-gray-900 mb-4">
              Découvrez nos produits
            </h1>
            <p class="text-gray-500 mb-8">
              {{ filters?.stats?.total_products || 0 }} produits de {{ filters?.stats?.total_shops || 0 }} boutiques
            </p>
            
            <!-- Barre de recherche -->
            <div class="relative max-w-xl mx-auto">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un produit, une boutique..."
                class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                @keyup.enter="handleSearch"
              >
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <button 
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Contenu -->
      <div class="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 xl:px-32 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar filtres (desktop) -->
          <aside class="hidden lg:block w-56 flex-shrink-0">
            <div class="sticky top-28 space-y-6">
              <!-- Catégories -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Catégories</h3>
                <div class="space-y-1">
                  <button
                    @click="selectCategory(null)"
                    :class="['w-full text-left px-3 py-2 text-sm rounded-lg transition-colors', !selectedCategory ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100']"
                  >
                    Toutes
                  </button>
                  <button
                    v-for="category in filters?.categories"
                    :key="category.id"
                    @click="selectCategory(category.id)"
                    :class="['w-full text-left px-3 py-2 text-sm rounded-lg transition-colors', selectedCategory === category.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100']"
                  >
                    {{ category.name }}
                  </button>
                </div>
              </div>

              <!-- Boutiques -->
              <div v-if="filters?.shops?.length">
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Boutiques</h3>
                <div class="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    @click="selectShop(null)"
                    :class="['w-full text-left px-3 py-2 text-sm rounded-lg transition-colors', !selectedShop ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100']"
                  >
                    Toutes
                  </button>
                  <button
                    v-for="shop in filters?.shops"
                    :key="shop.id"
                    @click="selectShop(shop.id)"
                    :class="['w-full text-left px-3 py-2 text-sm rounded-lg transition-colors truncate', selectedShop === shop.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100']"
                  >
                    {{ shop.name }}
                  </button>
                </div>
              </div>

              <!-- Tri -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trier par</h3>
                <select
                  v-model="sortOption"
                  @change="handleSort"
                  class="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="created_at:desc">Plus récents</option>
                  <option value="price:asc">Prix croissant</option>
                  <option value="price:desc">Prix décroissant</option>
                  <option value="name:asc">Nom A-Z</option>
                </select>
              </div>

              <!-- Réinitialiser -->
              <button
                v-if="hasActiveFilters"
                @click="clearAllFilters"
                class="w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </aside>

          <!-- Filtres mobile -->
          <div class="lg:hidden mb-4">
            <button
              @click="showMobileFilters = true"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              Filtres
              <span v-if="activeFiltersCount" class="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">{{ activeFiltersCount }}</span>
            </button>
          </div>

          <!-- Grille de produits -->
          <div class="flex-1">
            <!-- Chargement -->
            <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              <div v-for="i in 8" :key="i" class="animate-pulse">
                <div class="bg-gray-200 aspect-square rounded-xl mb-3"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>

            <!-- Aucun résultat -->
            <div v-else-if="products.length === 0" class="text-center py-16">
              <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-1">Aucun produit trouvé</h3>
              <p class="text-gray-500 text-sm">Essayez de modifier vos critères</p>
              <button @click="clearAllFilters" class="mt-4 px-4 py-2 text-sm text-primary hover:underline">
                Voir tous les produits
              </button>
            </div>

            <!-- Produits -->
            <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              <article v-for="product in products" :key="product.id" class="group">
                <a :href="getProductUrl(product)" class="block relative aspect-square mb-3 overflow-hidden rounded-xl bg-gray-100">
                  <img
                    :src="getProductImageUrl(product)"
                    :alt="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  >
                  <span v-if="product.has_promotion" class="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    Promo
                  </span>
                </a>
                <div class="space-y-1">
                  <a :href="getShopUrl(product.shop)" class="text-xs text-gray-400 hover:text-primary transition-colors truncate block">
                    {{ product.shop.name }}
                  </a>
                  <a :href="getProductUrl(product)">
                    <h3 class="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                      {{ product.name }}
                    </h3>
                  </a>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-gray-900">{{ formatPrice(product.effective_price, product.shop.currency) }}</span>
                    <span v-if="product.has_promotion" class="text-xs text-gray-400 line-through">{{ formatPrice(product.price, product.shop.currency) }}</span>
                  </div>
                </div>
              </article>
            </div>

            <!-- Pagination -->
            <nav v-if="pagination.lastPage > 1" class="mt-12 flex justify-center">
              <div class="flex items-center gap-1">
                <button
                  @click="goToPage(pagination.currentPage - 1)"
                  :disabled="pagination.currentPage === 1"
                  class="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <template v-for="(page, index) in visiblePages">
                  <span v-if="page === '...'" :key="'dots-' + index" class="px-2 text-gray-400">...</span>
                  <button
                    v-else
                    :key="'page-' + index"
                    @click="goToPage(Number(page))"
                    :class="['w-10 h-10 rounded-lg text-sm font-medium transition-colors', pagination.currentPage === page ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100']"
                  >
                    {{ page }}
                  </button>
                </template>
                <button
                  @click="goToPage(pagination.currentPage + 1)"
                  :disabled="pagination.currentPage === pagination.lastPage"
                  class="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal filtres mobile -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showMobileFilters" class="fixed inset-0 z-50 lg:hidden">
          <div class="absolute inset-0 bg-black/30" @click="showMobileFilters = false"></div>
          <div class="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
            <div class="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 class="text-lg font-medium text-gray-900">Filtres</h2>
              <button @click="showMobileFilters = false" class="p-2 text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="p-4 space-y-6 overflow-y-auto" style="max-height: calc(100vh - 120px);">
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Catégories</h3>
                <div class="space-y-1">
                  <button
                    @click="selectCategory(null); showMobileFilters = false"
                    :class="['w-full text-left px-3 py-2 text-sm rounded-lg', !selectedCategory ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600']"
                  >
                    Toutes
                  </button>
                  <button
                    v-for="category in filters?.categories"
                    :key="category.id"
                    @click="selectCategory(category.id); showMobileFilters = false"
                    :class="['w-full text-left px-3 py-2 text-sm rounded-lg', selectedCategory === category.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600']"
                  >
                    {{ category.name }}
                  </button>
                </div>
              </div>
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trier par</h3>
                <select
                  v-model="sortOption"
                  @change="handleSort(); showMobileFilters = false"
                  class="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg"
                >
                  <option value="created_at:desc">Plus récents</option>
                  <option value="price:asc">Prix croissant</option>
                  <option value="price:desc">Prix décroissant</option>
                  <option value="name:asc">Nom A-Z</option>
                </select>
              </div>
            </div>
            <div class="p-4 border-t border-gray-100">
              <button @click="clearAllFilters(); showMobileFilters = false" class="w-full py-2 text-sm text-gray-500 hover:text-gray-700">
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Footer (même que landing page) -->
    <footer class="px-4 md:px-16 lg:px-24 xl:px-32 border-t border-gray-200">
      <div class="border-x border-gray-200 px-4 md:px-12 max-w-7xl mx-auto pt-16">
        <div class="flex flex-col md:flex-row items-start justify-between gap-8 p-8 md:p-12 bg-gradient-to-t from-primary/10 to-primary/5 rounded-t-2xl">
          <div class="max-w-72">
            <img alt="Logo" class="h-9" src="/uber-market.png">
            <p class="text-zinc-500 mt-4 pb-6">
              La plateforme e-commerce la plus simple pour lancer votre boutique en ligne.
            </p>
          </div>
          <div>
            <p class="uppercase font-semibold text-primary text-sm">Réseaux sociaux</p>
            <div class="flex flex-col mt-4 gap-2">
              <a href="#" class="flex items-center gap-2 text-primary hover:opacity-70 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                Twitter
              </a>
              <a href="#" class="flex items-center gap-2 text-primary hover:opacity-70 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                Instagram
              </a>
              <a href="mailto:contact@uber-market.com" class="flex items-center gap-2 text-primary hover:opacity-70 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                Email
              </a>
            </div>
          </div>
          <div>
            <p class="uppercase font-semibold text-primary text-sm">Légal</p>
            <div class="flex flex-col mt-4 gap-2">
              <NuxtLink to="/conditions" class="flex items-center gap-2 text-primary hover:opacity-70 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                CGU & CGI
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="py-6 text-center text-sm text-gray-500">
          © {{ new Date().getFullYear() }} Uber-Market. Tous droits réservés.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useMarketplace } from '~/composables/useMarketplace'

definePageMeta({ layout: false })

useHead({
  title: 'Marketplace - Découvrez tous les produits | Uber-Market',
  meta: [
    { name: 'description', content: 'Découvrez des milliers de produits de nos boutiques partenaires sur la marketplace Uber-Market.' }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap' }
  ]
})

const {
  products,
  filters,
  pagination,
  isLoading,
  fetchProducts,
  fetchFilters,
  goToPage,
  formatPrice,
  getProductImageUrl,
  getShopUrl,
  getProductUrl
} = useMarketplace()

// Menu mobile
const mobileMenuOpen = ref(false)
const toggleMobileMenu = () => { mobileMenuOpen.value = !mobileMenuOpen.value }
const closeMobileMenu = () => { mobileMenuOpen.value = false }

// États filtres
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const selectedShop = ref<number | null>(null)
const sortOption = ref('created_at:desc')
const showMobileFilters = ref(false)

onMounted(async () => {
  await Promise.all([fetchFilters(), fetchProducts()])
})

const hasActiveFilters = computed(() => searchQuery.value || selectedCategory.value || selectedShop.value)
const activeFiltersCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (selectedCategory.value) count++
  if (selectedShop.value) count++
  return count
})

const visiblePages = computed(() => {
  const current = pagination.value.currentPage
  const last = pagination.value.lastPage
  const pages: (number | string)[] = []
  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) pages.push(i)
    if (current < last - 2) pages.push('...')
    pages.push(last)
  }
  return pages
})

const buildSearchParams = () => {
  const [sort, order] = sortOption.value.split(':')
  return {
    search: searchQuery.value || undefined,
    category_id: selectedCategory.value || undefined,
    shop_id: selectedShop.value || undefined,
    sort: sort as any,
    order: order as any
  }
}

const handleSearch = () => fetchProducts(buildSearchParams())
const clearSearch = () => { searchQuery.value = ''; handleSearch() }
const selectCategory = (id: number | null) => { selectedCategory.value = id; fetchProducts(buildSearchParams()) }
const selectShop = (id: number | null) => { selectedShop.value = id; fetchProducts(buildSearchParams()) }
const handleSort = () => fetchProducts(buildSearchParams())
const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
  selectedShop.value = null
  sortOption.value = 'created_at:desc'
  fetchProducts({})
}
</script>

<style scoped>
.landing-page { --color-primary: #5B6AC5; }
.font-urbanist { font-family: 'Urbanist', sans-serif; }
.text-primary { color: var(--color-primary); }
.bg-primary { background-color: var(--color-primary); }
.bg-primary\/10 { background-color: rgba(91, 106, 197, 0.1); }
.bg-primary\/5 { background-color: rgba(91, 106, 197, 0.05); }
.from-primary\/10 { --tw-gradient-from: rgba(91, 106, 197, 0.1); }
.to-primary\/5 { --tw-gradient-to: rgba(91, 106, 197, 0.05); }
.ring-primary\/20 { --tw-ring-color: rgba(91, 106, 197, 0.2); }
.size-6 { width: 1.5rem; height: 1.5rem; }
.h-72 { height: 18rem; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
