<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-xl font-semibold text-gray-800">Produits</h1>
      </div>
      <NuxtLink
        :to="getDashboardLink('products/ajouter-produit')"
        class="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
      >
        Ajouter un produit
      </NuxtLink>
    </div>

    <!-- ── Filtres ──────────────────────────────────────────────── -->
    <div class="bg-white p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div class="flex space-x-4">

          <!-- Filtre sous-catégorie -->
          <div>
            <label for="subcategory" class="block text-sm font-medium text-gray-700">Sous-catégorie</label>
            <select
              id="subcategory"
              v-model="filters.subcategory"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes</option>
              <option v-for="subcategory in availableSubcategories" :key="subcategory" :value="subcategory">
                {{ subcategory }}
              </option>
            </select>
          </div>

          <!-- Filtre statut -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
            <select
              id="status"
              v-model="filters.status"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
        </div>

        <!-- Recherche texte -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            v-model="filters.search"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Rechercher..."
          >
        </div>
      </div>
    </div>

    <!-- ── Loader ────────────────────────────────────────────────── -->
    <div v-if="isLoading" class="bg-white border border-gray-200 p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p class="mt-2 text-gray-600">Chargement des produits...</p>
    </div>

    <!-- ── Erreur ─────────────────────────────────────────────────── -->
    <div v-else-if="loadError" class="bg-white border border-gray-200 p-8 text-center">
      <div class="text-red-500 mb-2">
        <svg class="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-red-600">{{ loadError }}</p>
      <button @click="loadProducts" class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-secondary">
        Réessayer
      </button>
    </div>

    <!-- ── État vide ──────────────────────────────────────────────── -->
    <div v-else-if="filteredProducts.length === 0" class="bg-white border border-gray-200 p-8 text-center">
      <div class="text-gray-400 mb-4">
        <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
      <p class="text-gray-600 mb-4">
        {{ productsList.length === 0
          ? 'Vous n\'avez pas encore de produits.'
          : 'Aucun produit ne correspond à vos critères de recherche.' }}
      </p>
      <NuxtLink
        :to="getDashboardLink('products/ajouter-produit')"
        class="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
      >
        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter votre premier produit
      </NuxtLink>
    </div>

    <!-- ── Tableau des produits ────────────────────────────────────── -->
    <div v-else class="bg-white border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sous-catégorie</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <!--
                Colonne Stock : masquée pour les boutiques numériques.
                isDigitalShop est calculé depuis currentShop.product_type.
              -->
              <th
                v-if="!isDigitalShop"
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Stock</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!--
              CORRECTION clé v-for :
              On utilise product.id (stable, unique en base) comme clé.
              Avant : si product.id était undefined au 1er rendu (data chargée en async),
              Vue utilisait l'index → au rechargement les nœuds DOM étaient
              réassignés → erreur "can't access property parentNode, node is null".
            -->
            <tr v-for="product in paginatedProducts" :key="`product-${product.id}`">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="getProductImage(product)"
                      :src="getImageUrl(getProductImage(product))"
                      :alt="product.name"
                      class="h-10 w-10 rounded object-cover"
                      @contextmenu.prevent
                      @dragstart.prevent
                      draggable="false"
                    />
                    <div v-else class="bg-gray-200 border-2 border-dashed w-10 h-10 rounded flex items-center justify-center">
                      <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">
                      {{ getCleanDescription(product.description) }}
                    </div>
                    <!-- Badge fichier numérique si disponible -->
                    <span v-if="product.digital_file" class="inline-flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-full mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      {{ getFileExtension(product.digital_file) }}
                    </span>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.subcategory?.name || 'Non définie' }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span class="font-medium">{{ formatPrice(product.price) }}</span>
                <div v-if="product.promotional_price" class="text-xs text-green-600">
                  Promo : {{ formatPrice(product.promotional_price) }}
                </div>
              </td>

              <!-- Colonne stock (physique uniquement) -->
              <td v-if="!isDigitalShop" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span :class="getStockClass(product.stock_quantity)">
                  {{ product.stock_quantity ?? '—' }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(product.status)">
                  {{ getStatusLabel(product.status) }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="viewProduct(product)" class="text-blue-600 hover:text-blue-900 mr-3" title="Voir les détails">
                  Voir
                </button>
                <button @click="editProduct(product)" class="text-indigo-600 hover:text-indigo-900 mr-3" title="Modifier">
                  Modifier
                </button>
                <button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900" title="Supprimer">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Pagination ─────────────────────────────────────────── -->
      <div v-if="filteredProducts.length > itemsPerPage" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <p class="text-sm text-gray-700">
            <span class="font-medium">{{ startIndex + 1 }}</span>–<span class="font-medium">{{ Math.min(endIndex, filteredProducts.length) }}</span>
            sur <span class="font-medium">{{ filteredProducts.length }}</span>
          </p>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="currentPage === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-500 bg-white hover:bg-gray-50'"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium"
            >
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>

            <button
              v-for="page in visiblePages"
              :key="`page-${page}`"
              @click="goToPage(page)"
              :class="page === currentPage ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 hover:bg-gray-50'"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
            >
              {{ page }}
            </button>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="currentPage === totalPages ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-500 bg-white hover:bg-gray-50'"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium"
            >
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- ── Modal détails du produit ──────────────────────────────── -->
    <div v-if="showProductModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Détails du produit</h3>
            <button @click="closeProductModal" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedProduct" class="space-y-4">
            <!-- Images -->
            <div v-if="selectedProduct.product_images && selectedProduct.product_images.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <img
                v-for="image in selectedProduct.product_images"
                :key="`modal-img-${image.id}`"
                :src="getImageUrl(image.image_path)"
                :alt="selectedProduct.name"
                class="w-full h-32 object-cover rounded-lg border"
                @contextmenu.prevent
                draggable="false"
              />
            </div>

            <!-- Fichier numérique -->
            <div v-if="selectedProduct.digital_file" class="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span class="text-sm text-purple-800 font-medium">
                Fichier : {{ selectedProduct.digital_file.split('/').pop() }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedProduct.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Sous-catégorie</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedProduct.subcategory?.name || 'Non définie' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Prix</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatPrice(selectedProduct.price) }}</p>
              </div>
              <div v-if="selectedProduct.promotional_price">
                <label class="block text-sm font-medium text-gray-700">Prix promotionnel</label>
                <p class="mt-1 text-sm text-green-600">{{ formatPrice(selectedProduct.promotional_price) }}</p>
              </div>
              <div v-if="!isDigitalShop">
                <label class="block text-sm font-medium text-gray-700">Stock</label>
                <p class="mt-1 text-sm" :class="getStockClass(selectedProduct.stock_quantity)">
                  {{ selectedProduct.stock_quantity }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Statut</label>
                <span class="mt-1" :class="getStatusClass(selectedProduct.status)">
                  {{ getStatusLabel(selectedProduct.status) }}
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <div class="mt-1 text-sm text-gray-900 prose prose-sm max-w-none" v-html="selectedProduct.description"></div>
            </div>

            <!-- Variantes -->
            <div v-if="selectedProduct.product_variants && selectedProduct.product_variants.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">Variantes</label>
              <div class="space-y-2">
                <div
                  v-for="variant in selectedProduct.product_variants"
                  :key="`variant-${variant.id}`"
                  class="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span class="text-sm">{{ variant.name }} : {{ variant.value }}</span>
                  <span class="text-sm font-medium">
                    {{ formatPrice(Number(selectedProduct.price) + Number(variant.price_modifier || 0)) }}
                    <span v-if="variant.price_modifier" class="text-xs text-gray-500 ml-1">
                      ({{ Number(variant.price_modifier) > 0 ? '+' : '' }}{{ formatPrice(Number(variant.price_modifier)) }})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button @click="closeProductModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Modal confirmation suppression ────────────────────────── -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-2">Confirmer la suppression</h3>
          <p class="mt-2 px-7 text-sm text-gray-500">
            Êtes-vous sûr de vouloir supprimer
            <span class="font-medium">{{ productToDelete?.name }}</span> ?
            Cette action est irréversible.
          </p>
          <div class="flex justify-center space-x-4 mt-4">
            <button @click="closeDeleteModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              Annuler
            </button>
            <button @click="handleDelete" :disabled="isDeleting" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
              {{ isDeleting ? 'Suppression…' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { getCleanDescription } from '~/utils/string'
import type { Product } from '~/types/product'

definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})

const route  = useRoute()
const router = useRouter()

// ── Composables ───────────────────────────────────────────────────
const {
  isLoading,
  error: composableError,
  fetchProducts,        // CORRECTION : fetchShopProducts → fetchProducts
  deleteProduct,
  fetchProductDetails,
} = useProducts()

const { currentShop, shops, fetchShops } = useShops()

// ── État local ────────────────────────────────────────────────────

/**
 * productsList — tableau local extrait de la réponse API.
 *
 * CORRECTION : useProducts() retourne un ref, mais la réponse
 * Laravel paginate() renvoie { data: [...], meta: {...} }.
 * On stocke ici directement le tableau pour éviter que filteredProducts
 * travaille sur un objet au lieu d'un tableau → crash DOM Vue.
 */
const productsList    = ref<Product[]>([])
const loadError       = ref<string | null>(null)
const isDeleting      = ref(false)
const currentPage     = ref(1)
const itemsPerPage    = 10
const selectedProduct = ref<Product | null>(null)
const productToDelete = ref<Product | null>(null)
const showProductModal = ref(false)
const showDeleteModal  = ref(false)

const filters = ref({ subcategory: '', status: '', search: '' })

// ── Computed boutique ─────────────────────────────────────────────

/**
 * isDigitalShop — masque la colonne Stock et adapte l'UI
 * pour les boutiques avec product_type === 'digital'.
 */
const isDigitalShop = computed(() => currentShop.value?.product_type === 'digital')

// ── Computed filtres + pagination ─────────────────────────────────

const filteredProducts = computed(() => {
  // Garde-fou : s'assurer que c'est toujours un tableau
  const list = Array.isArray(productsList.value) ? productsList.value : []

  return list.filter(product => {
    const matchSub    = !filters.value.subcategory || product.subcategory?.name === filters.value.subcategory
    const matchStatus = !filters.value.status      || product.status === filters.value.status
    const matchSearch = !filters.value.search      || [
      product.name,
      product.description,
      product.subcategory?.name ?? ''
    ].some(s => s.toLowerCase().includes(filters.value.search.toLowerCase()))
    return matchSub && matchStatus && matchSearch
  })
})

const totalPages  = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage)))
const startIndex  = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex    = computed(() => startIndex.value + itemsPerPage)

const paginatedProducts = computed(() =>
  filteredProducts.value.slice(startIndex.value, endIndex.value)
)

const visiblePages = computed(() => {
  const pages: number[] = []
  const max   = 5
  let   start = Math.max(1, currentPage.value - Math.floor(max / 2))
  let   end   = Math.min(totalPages.value, start + max - 1)
  if (end - start + 1 < max) start = Math.max(1, end - max + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const availableSubcategories = computed(() => {
  const names = new Set<string>()
  productsList.value.forEach(p => { if (p.subcategory?.name) names.add(p.subcategory.name) })
  return Array.from(names).sort()
})

// ── Utilitaires ───────────────────────────────────────────────────

const getDashboardLink = (path = '') => `/dashboard-vendor/${route.params.slug}/${path}`

/**
 * getProductImage — retourne le chemin de l'image à afficher.
 * Priorité : preview_image > première image du tableau product_images.
 */
const getProductImage = (product: any): string => {
  if (product.preview_image) return product.preview_image
  if (product.product_images?.length > 0) return product.product_images[0].image_path
  return ''
}

const getImageUrl = (url: string): string => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = useRuntimeConfig().public.apiBase.replace('/api', '')
  return `${base}/storage/${url}`
}

/** Extrait l'extension du fichier numérique pour l'afficher en badge */
const getFileExtension = (filePath: string): string => {
  if (!filePath) return 'Fichier'
  return filePath.split('.').pop()?.toUpperCase() || 'Fichier'
}

const formatPrice = (price: number): string => {
  const currency = currentShop.value?.currency || 'XOF'
  if (currency === 'XOF') return `${Number(price).toLocaleString('fr-FR')} FCFA`
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(price)
}

const getStatusClass = (status: string) => ({
  active:   'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
  inactive: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
  draft:    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
}[status] || 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800')

const getStatusLabel = (status: string) => ({
  active: 'Actif', inactive: 'Inactif', draft: 'Brouillon', out_of_stock: 'Rupture'
}[status] || 'Inconnu')

const getStockClass = (stock: number) => {
  if (stock === 0) return 'text-red-600 font-medium'
  if (stock <= 5)  return 'text-orange-600 font-medium'
  return 'text-gray-900'
}

// ── Pagination ────────────────────────────────────────────────────

const goToPage     = (p: number) => { if (p >= 1 && p <= totalPages.value) currentPage.value = p }
const previousPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage     = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

// Réinitialiser la page à chaque changement de filtre
watch(filters, () => { currentPage.value = 1 }, { deep: true })

// ── Chargement ────────────────────────────────────────────────────

/**
 * loadProducts — charge la liste des produits de la boutique courante.
 *
 * CORRECTION :
 *   - Appelle fetchProducts() (et non fetchShopProducts() inexistant)
 *   - Extrait le tableau depuis la réponse paginée Laravel :
 *     response peut être { data: [...], meta: {...} } ou directement [...]
 */
const loadProducts = async () => {
  loadError.value = null

  // Charger les boutiques si nécessaire
  if (!shops.value?.length) await fetchShops()
  if (!currentShop.value) return

  try {
    const response = await fetchProducts(currentShop.value.id)

    // Unwrap la pagination Laravel si nécessaire
    // fetchProducts retourne data.data (le niveau déjà unwrappé dans useProducts)
    // mais si la structure est {data: [...], meta: {...}} on prend .data
    if (Array.isArray(response)) {
      productsList.value = response
    } else if (response?.data && Array.isArray(response.data)) {
      productsList.value = response.data
    } else {
      productsList.value = []
    }
  } catch (err: any) {
    loadError.value = err.message || 'Erreur lors du chargement des produits'
  }
}

// ── Actions produits ──────────────────────────────────────────────

const viewProduct = async (product: any) => {
  if (!currentShop.value) return
  try {
    selectedProduct.value = await fetchProductDetails(currentShop.value.id, product.id)
    showProductModal.value = true
  } catch (err) {
    console.error('Erreur chargement détails:', err)
  }
}

const editProduct   = (product: any) => router.push(getDashboardLink(`products/modifier-produit/${product.id}`))
const confirmDelete = (product: any) => { productToDelete.value = product as Product; showDeleteModal.value = true }
const closeDeleteModal  = () => { showDeleteModal.value = false; productToDelete.value = null }
const closeProductModal = () => { showProductModal.value = false; selectedProduct.value = null }

const handleDelete = async () => {
  if (!productToDelete.value || !currentShop.value) return
  isDeleting.value = true
  try {
    await deleteProduct(currentShop.value.id, productToDelete.value.id)
    // Retirer de la liste locale sans recharger
    productsList.value = productsList.value.filter(p => p.id !== productToDelete.value!.id)
    closeDeleteModal()
    // Reculer d'une page si la page courante est vide
    if (paginatedProducts.value.length === 0 && currentPage.value > 1) currentPage.value--
  } catch (err: any) {
    console.error('Erreur suppression:', err)
  } finally {
    isDeleting.value = false
  }
}

// ── Init ──────────────────────────────────────────────────────────

onMounted(() => { loadProducts() })
</script>