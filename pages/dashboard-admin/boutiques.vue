<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des sites/boutiques</h1>
      <p class="mt-1 text-sm text-gray-500">Toutes les sites et boutiques de la plateforme sont géré içi.</p>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Recherche -->
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un site / une boutique..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Type -->
        <select
          v-model="filterType"
          class="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          @change="loadShops(1)"
        >
          <option value="">Tous les types</option>
          <option value="e-commerce">E-commerce</option>
          <option value="website">Website</option>
        </select>

        <!-- Statut -->
        <select
          v-model="filterStatus"
          class="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          @change="loadShops(1)"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-12">
      <div class="flex flex-col items-center justify-center gap-3">
        <div class="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="text-sm text-gray-500">Chargement des sites & boutiques...</p>
      </div>
    </div>

    <!-- Table -->
    <div v-else-if="shops.length > 0" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <!-- Desktop table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50">
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom du projet</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Propriétaire</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Abonnement</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date création</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="shop in shops"
              :key="shop.id"
              class="hover:bg-gray-50/50 transition-colors cursor-pointer"
              @click="openDetail(shop)"
            >
              <td class="px-5 py-4">
                <p class="text-sm font-medium text-gray-900">{{ shop.name }}</p>
              </td>
              <td class="px-5 py-4">
                <p class="text-sm text-gray-600">{{ shop.user?.name || '—' }}</p>
                <p class="text-xs text-gray-400">{{ shop.user?.email || '' }}</p>
              </td>
              <td class="px-5 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                  {{ shop.shop_type === 'e-commerce' ? 'E-commerce' : shop.shop_type === 'website' ? 'Website' : shop.shop_type }}
                </span>
              </td>
              <td class="px-5 py-4">
                <p class="text-sm text-gray-600">{{ shop.subscription?.plan || 'Aucun' }}</p>
              </td>
              <td class="px-5 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="shop.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full mr-1.5"
                    :class="shop.status === 'active' ? 'bg-green-500' : 'bg-red-500'"
                  ></span>
                  {{ shop.status === 'active' ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-5 py-4">
                <p class="text-sm text-gray-500">{{ formatDate(shop.created_at) }}</p>
              </td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-2" @click.stop>
                  <button
                    @click="openDetail(shop)"
                    class="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    Voir
                  </button>
                  <button
                    @click="confirmToggle(shop)"
                    class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                    :class="shop.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'"
                  >
                    {{ shop.status === 'active' ? 'Désactiver' : 'Activer' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards -->
      <div class="md:hidden divide-y divide-gray-100">
        <div
          v-for="shop in shops"
          :key="'m-' + shop.id"
          class="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
          @click="openDetail(shop)"
        >
          <div class="flex items-start justify-between mb-2">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ shop.name }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ shop.user?.name || '—' }}</p>
            </div>
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="shop.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
            >
              {{ shop.status === 'active' ? 'Actif' : 'Inactif' }}
            </span>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-500">
            <span>{{ shop.shop_type === 'e-commerce' ? 'E-commerce' : shop.shop_type === 'website' ? 'Website' : shop.shop_type }}</span>
            <span>·</span>
            <span>{{ shop.subscription?.plan || 'Aucun' }}</span>
            <span>·</span>
            <span>{{ formatDate(shop.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Page {{ currentPage }} sur {{ lastPage }} — {{ total }} site{{ total > 1 ? 's' : '' }}
        </p>
        <div class="flex items-center gap-2">
          <button
            @click="loadShops(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Précédent
          </button>
          <button
            @click="loadShops(currentPage + 1)"
            :disabled="currentPage >= lastPage"
            class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="bg-white rounded-xl border border-gray-200 p-12">
      <div class="flex flex-col items-center justify-center gap-3 text-center">
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-900">Aucun projet trouvée</p>
        <p class="text-sm text-gray-500">Modifiez vos filtres pour voir plus de résultats</p>
      </div>
    </div>

    <!-- Confirmation toggle modal -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50" @click="showConfirmModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Confirmer l'action</h3>
          <p class="text-sm text-gray-600 mb-6">
            Êtes-vous sûr de vouloir
            <strong>{{ shopToToggle?.status === 'active' ? 'désactiver' : 'activer' }}</strong>
            le site <strong>{{ shopToToggle?.name }}</strong> ?
          </p>
          <div class="flex items-center justify-end gap-3">
            <button
              @click="showConfirmModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              @click="handleToggle"
              :disabled="toggling"
              class="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
              :class="shopToToggle?.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
            >
              {{ toggling ? 'En cours...' : (shopToToggle?.status === 'active' ? 'Désactiver' : 'Activer') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Detail modal -->
    <Teleport to="body">
      <div v-if="showDetailModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50" @click="closeDetail"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <!-- Loading detail -->
          <div v-if="loadingDetail" class="p-12 flex flex-col items-center justify-center gap-3">
            <div class="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p class="text-sm text-gray-500">Chargement des détails...</p>
          </div>

          <template v-else-if="shopDetail">
            <!-- Header modal -->
            <div class="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">{{ shopDetail.name }}</h2>
                <p class="text-sm text-gray-500 mt-0.5">{{ shopDetail.description || 'Aucune description' }}</p>
              </div>
              <button @click="closeDetail" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="p-6 space-y-6">
              <!-- Infos boutique -->
              <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Informations projet</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-500 mb-1">Type</p>
                    <p class="text-sm font-medium text-gray-900">{{ shopDetail.shop_type === 'e-commerce' ? 'E-commerce' : shopDetail.shop_type === 'website' ? 'Website' : shopDetail.shop_type }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-500 mb-1">Sous-domaine</p>
                    <p class="text-sm font-medium text-gray-900">{{ shopDetail.subdomain || '—' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-500 mb-1">Statut</p>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="shopDetail.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
                    >
                      {{ shopDetail.status === 'active' ? 'Actif' : 'Inactif' }}
                    </span>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-500 mb-1">Date de création</p>
                    <p class="text-sm font-medium text-gray-900">{{ formatDate(shopDetail.created_at) }}</p>
                  </div>
                </div>
              </div>

              <!-- Propriétaire -->
              <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Propriétaire</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-500 mb-1">Nom</p>
                    <p class="text-sm font-medium text-gray-900">{{ shopDetail.user?.name || '—' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-500 mb-1">Email</p>
                    <p class="text-sm font-medium text-gray-900">{{ shopDetail.user?.email || '—' }}</p>
                  </div>
                </div>
              </div>

              <!-- Statistiques -->
              <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Statistiques</h3>
                <div class="grid grid-cols-3 gap-4">
                  <div class="bg-indigo-50 rounded-lg p-3 text-center">
                    <p class="text-2xl font-bold text-indigo-700">{{ shopDetail.products_count ?? 0 }}</p>
                    <p class="text-xs text-indigo-600 mt-1">Produits</p>
                  </div>
                  <div class="bg-emerald-50 rounded-lg p-3 text-center">
                    <p class="text-2xl font-bold text-emerald-700">{{ shopDetail.orders_count ?? 0 }}</p>
                    <p class="text-xs text-emerald-600 mt-1">Commandes</p>
                  </div>
                  <div class="bg-amber-50 rounded-lg p-3 text-center">
                    <p class="text-2xl font-bold text-amber-700">{{ formatPrice(shopDetail.total_revenue ?? 0) }}</p>
                    <p class="text-xs text-amber-600 mt-1">Revenu total</p>
                  </div>
                </div>
              </div>

              <!-- Abonnement -->
              <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Abonnement</h3>
                <div v-if="shopDetail.subscription" class="bg-gray-50 rounded-lg p-4">
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Plan</p>
                      <p class="text-sm font-medium text-gray-900">{{ shopDetail.subscription.plan }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Statut</p>
                      <p class="text-sm font-medium text-gray-900">{{ shopDetail.subscription.status || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Expiration</p>
                      <p class="text-sm font-medium text-gray-900">{{ formatDate(shopDetail.subscription.expires_at) }}</p>
                    </div>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-500">Aucun abonnement actif</p>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <a
                  v-if="shopDetail.subdomain"
                  :href="getShopUrl(shopDetail.subdomain)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                  </svg>
                  Visiter le site.
                </a>
                <button
                  @click="confirmToggleFromDetail"
                  class="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                  :class="shopDetail.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                >
                  {{ shopDetail.status === 'active' ? 'Désactiver le site' : 'Activer le site' }}
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard-admin'
})

const { fetchShops, fetchShopDetails, toggleShop } = useAdminDashboard()
const config = useRuntimeConfig()

// State
const shops = ref<any[]>([])
const loading = ref(true)
const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)

// Filters
const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')

// Detail modal
const showDetailModal = ref(false)
const loadingDetail = ref(false)
const shopDetail = ref<any>(null)

// Toggle confirmation
const showConfirmModal = ref(false)
const shopToToggle = ref<any>(null)
const toggling = ref(false)

// Debounce timer
let searchTimer: ReturnType<typeof setTimeout> | null = null

const debouncedSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    loadShops(1)
  }, 400)
}

const loadShops = async (page: number = 1) => {
  loading.value = true
  try {
    const params: any = { page }
    if (searchQuery.value) params.search = searchQuery.value
    if (filterType.value) params.type = filterType.value
    if (filterStatus.value) params.status = filterStatus.value

    const response = await fetchShops(params)
    shops.value = response.shops?.data || []
    currentPage.value = response.shops?.current_page || 1
    lastPage.value = response.shops?.last_page || 1
    total.value = response.shops?.total || 0
  } catch (error: any) {
    console.error('Erreur chargement sites:', error)
  } finally {
    loading.value = false
  }
}

const openDetail = async (shop: any) => {
  showDetailModal.value = true
  loadingDetail.value = true
  shopDetail.value = null
  try {
    const response = await fetchShopDetails(shop.id)
    shopDetail.value = response.shop || response
    if (response.total_revenue !== undefined) {
      shopDetail.value.total_revenue = response.total_revenue
    }
    if (response.subscription !== undefined) {
      shopDetail.value.subscription = response.subscription
    }
  } catch (error: any) {
    console.error('Erreur chargement détails:', error)
  } finally {
    loadingDetail.value = false
  }
}

const closeDetail = () => {
  showDetailModal.value = false
  shopDetail.value = null
}

const confirmToggle = (shop: any) => {
  shopToToggle.value = shop
  showConfirmModal.value = true
}

const confirmToggleFromDetail = () => {
  if (shopDetail.value) {
    shopToToggle.value = shopDetail.value
    showConfirmModal.value = true
  }
}

const handleToggle = async () => {
  if (!shopToToggle.value) return
  toggling.value = true
  try {
    await toggleShop(shopToToggle.value.id)
    showConfirmModal.value = false
    shopToToggle.value = null
    // Refresh list and detail if open
    await loadShops(currentPage.value)
    if (showDetailModal.value && shopDetail.value) {
      const response = await fetchShopDetails(shopDetail.value.id)
      shopDetail.value = response.shop || response
      if (response.total_revenue !== undefined) {
        shopDetail.value.total_revenue = response.total_revenue
      }
      if (response.subscription !== undefined) {
        shopDetail.value.subscription = response.subscription
      }
    }
  } catch (error: any) {
    console.error('Erreur toggle boutique:', error)
  } finally {
    toggling.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' FCFA'
}

const getShopUrl = (subdomain: string) => {
  const baseUrl = config.public.appUrl || window.location.origin
  // Build subdomain URL
  try {
    const url = new URL(baseUrl)
    return `${url.protocol}//${subdomain}.${url.host}`
  } catch {
    return `https://${subdomain}.uber-market.fr`
  }
}

onMounted(() => {
  loadShops()
})
</script>
