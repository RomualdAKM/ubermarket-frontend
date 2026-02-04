<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la marketplace -->
    <header class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">UM</span>
            </div>
            <span class="text-lg font-medium text-gray-900">Marketplace</span>
          </NuxtLink>
          
          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-6">
            <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Accueil
            </NuxtLink>
            <NuxtLink to="/devenir-vendeur" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Vendre
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Section héro -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center max-w-2xl mx-auto">
          <h1 class="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Découvrez nos <span class="font-medium">produits</span>
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
              class="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
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

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar filtres (desktop) -->
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <div class="sticky top-8 space-y-6">
            <!-- Catégories -->
            <div>
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Catégories
              </h3>
              <div class="space-y-1">
                <button
                  @click="selectCategory(null)"
                  :class="[
                    'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
                    !selectedCategory ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  Toutes les catégories
                </button>
                <button
                  v-for="category in filters?.categories"
                  :key="category.id"
                  @click="selectCategory(category.id)"
                  :class="[
                    'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
                    selectedCategory === category.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>

            <!-- Boutiques -->
            <div v-if="filters?.shops?.length">
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Boutiques
              </h3>
              <div class="space-y-1 max-h-64 overflow-y-auto">
                <button
                  @click="selectShop(null)"
                  :class="[
                    'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
                    !selectedShop ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  Toutes les boutiques
                </button>
                <button
                  v-for="shop in filters?.shops"
                  :key="shop.id"
                  @click="selectShop(shop.id)"
                  :class="[
                    'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2',
                    selectedShop === shop.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  <img 
                    v-if="shop.logo" 
                    :src="getLogoUrl(shop.logo)" 
                    :alt="shop.name"
                    class="w-5 h-5 rounded-full object-cover"
                  >
                  <span class="truncate">{{ shop.name }}</span>
                </button>
              </div>
            </div>

            <!-- Tri -->
            <div>
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Trier par
              </h3>
              <select
                v-model="sortOption"
                @change="handleSort"
                class="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="created_at:desc">Plus récents</option>
                <option value="created_at:asc">Plus anciens</option>
                <option value="price:asc">Prix croissant</option>
                <option value="price:desc">Prix décroissant</option>
                <option value="name:asc">Nom A-Z</option>
                <option value="name:desc">Nom Z-A</option>
              </select>
            </div>

            <!-- Réinitialiser -->
            <button
              v-if="hasActiveFilters"
              @click="clearAllFilters"
              class="w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Réinitialiser les filtres
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
            <span v-if="activeFiltersCount" class="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
              {{ activeFiltersCount }}
            </span>
          </button>
        </div>

        <!-- Grille de produits -->
        <div class="flex-1">
          <!-- État de chargement -->
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
            <p class="text-gray-500 text-sm">Essayez de modifier vos critères de recherche</p>
            <button
              @click="clearAllFilters"
              class="mt-4 px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Voir tous les produits
            </button>
          </div>

          <!-- Grille de produits -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <article 
              v-for="product in products" 
              :key="product.id"
              class="group"
            >
              <!-- Image du produit -->
              <NuxtLink :to="getProductUrl(product)" class="block relative aspect-square mb-3 overflow-hidden rounded-xl bg-gray-100">
                <img
                  :src="getProductImageUrl(product)"
                  :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                >
                <!-- Badge promo -->
                <span
                  v-if="product.has_promotion"
                  class="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full"
                >
                  Promo
                </span>
              </NuxtLink>

              <!-- Infos produit -->
              <div class="space-y-1">
                <!-- Boutique -->
                <NuxtLink 
                  :to="getShopUrl(product.shop)"
                  class="text-xs text-gray-400 hover:text-primary transition-colors truncate block"
                >
                  {{ product.shop.name }}
                </NuxtLink>

                <!-- Nom du produit -->
                <NuxtLink :to="getProductUrl(product)">
                  <h3 class="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                    {{ product.name }}
                  </h3>
                </NuxtLink>

                <!-- Prix -->
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-gray-900">
                    {{ formatPrice(product.effective_price, product.shop.currency) }}
                  </span>
                  <span
                    v-if="product.has_promotion"
                    class="text-xs text-gray-400 line-through"
                  >
                    {{ formatPrice(product.price, product.shop.currency) }}
                  </span>
                </div>
              </div>
            </article>
          </div>

          <!-- Pagination -->
          <nav v-if="pagination.lastPage > 1" class="mt-12 flex justify-center">
            <div class="flex items-center gap-1">
              <!-- Précédent -->
              <button
                @click="goToPage(pagination.currentPage - 1)"
                :disabled="pagination.currentPage === 1"
                class="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>

              <!-- Pages -->
              <template v-for="page in visiblePages" :key="page">
                <span v-if="page === '...'" class="px-2 text-gray-400">...</span>
                <button
                  v-else
                  @click="goToPage(page as number)"
                  :class="[
                    'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
                    pagination.currentPage === page 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  {{ page }}
                </button>
              </template>

              <!-- Suivant -->
              <button
                @click="goToPage(pagination.currentPage + 1)"
                :disabled="pagination.currentPage === pagination.lastPage"
                class="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </nav>
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
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="p-4 space-y-6 overflow-y-auto" style="max-height: calc(100vh - 120px);">
              <!-- Catégories -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Catégories</h3>
                <div class="space-y-1">
                  <button
                    @click="selectCategory(null); showMobileFilters = false"
                    :class="[
                      'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
                      !selectedCategory ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600'
                    ]"
                  >
                    Toutes
                  </button>
                  <button
                    v-for="category in filters?.categories"
                    :key="category.id"
                    @click="selectCategory(category.id); showMobileFilters = false"
                    :class="[
                      'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
                      selectedCategory === category.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600'
                    ]"
                  >
                    {{ category.name }}
                  </button>
                </div>
              </div>

              <!-- Tri -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trier par</h3>
                <select
                  v-model="sortOption"
                  @change="handleSort; showMobileFilters = false"
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
              <button
                @click="clearAllFilters; showMobileFilters = false"
                class="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Footer simple -->
    <footer class="bg-white border-t border-gray-100 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-400">
            © {{ new Date().getFullYear() }} Uber-Market. Tous droits réservés.
          </p>
          <div class="flex items-center gap-6">
            <NuxtLink to="/conditions" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              CGU
            </NuxtLink>
            <NuxtLink to="/" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Accueil
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useMarketplace } from '~/composables/useMarketplace'

// Métadonnées SEO
useHead({
  title: 'Marketplace - Découvrez tous les produits | Uber-Market',
  meta: [
    {
      name: 'description',
      content: 'Découvrez des milliers de produits de nos boutiques partenaires. Trouvez ce que vous cherchez sur la marketplace Uber-Market.'
    }
  ]
})

const config = useRuntimeConfig()

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

// États locaux
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const selectedShop = ref<number | null>(null)
const sortOption = ref('created_at:desc')
const showMobileFilters = ref(false)

// Chargement initial
onMounted(async () => {
  await Promise.all([
    fetchFilters(),
    fetchProducts()
  ])
})

// Filtres actifs
const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value || selectedShop.value
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (selectedCategory.value) count++
  if (selectedShop.value) count++
  return count
})

// Pages visibles pour la pagination
const visiblePages = computed(() => {
  const current = pagination.value.currentPage
  const last = pagination.value.lastPage
  const pages: (number | string)[] = []

  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i)
  } else {
    pages.push(1)
    
    if (current > 3) pages.push('...')
    
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
      pages.push(i)
    }
    
    if (current < last - 2) pages.push('...')
    
    pages.push(last)
  }

  return pages
})

// Actions
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

const handleSearch = () => {
  fetchProducts(buildSearchParams())
}

const clearSearch = () => {
  searchQuery.value = ''
  handleSearch()
}

const selectCategory = (categoryId: number | null) => {
  selectedCategory.value = categoryId
  fetchProducts(buildSearchParams())
}

const selectShop = (shopId: number | null) => {
  selectedShop.value = shopId
  fetchProducts(buildSearchParams())
}

const handleSort = () => {
  fetchProducts(buildSearchParams())
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
  selectedShop.value = null
  sortOption.value = 'created_at:desc'
  fetchProducts({})
}

// Helper pour l'URL du logo
const getLogoUrl = (logo: string) => {
  const baseUrl = config.public.storageUrl || config.public.apiBase.replace('/api', '')
  return `${baseUrl}/storage/${logo}`
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
