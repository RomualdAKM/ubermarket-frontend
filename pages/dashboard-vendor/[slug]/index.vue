<template>
  <div class="bg-white">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Tableau de bord vendeur</h1>
      <p class="text-gray-600">Bienvenue sur votre espace de gestion</p>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
      <button @click="loadDashboard" class="mt-2 text-red-600 hover:text-red-800 text-sm font-medium">
        Réessayer
      </button>
    </div>

    <!-- Contenu du dashboard -->
    <div v-else-if="dashboardData">
      <!-- Statistiques générales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white p-6 border-r border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Commandes</h3>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardData.statistics.total_orders }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 border-r border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-green-100">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Revenus</h3>
              <p class="text-2xl font-semibold text-primary">{{ formatCurrency(dashboardData.statistics.total_revenue, dashboardData.statistics.currency) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 border-r border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Produits</h3>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardData.statistics.total_products }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 border-r border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Clients</h3>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardData.statistics.total_customers }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Commandes récentes -->
      <div class="bg-white p-6 border-t border-gray-200 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Commandes récentes</h2>
          <NuxtLink :to="getDashboardLink('orders/commandes')" class="text-sm font-medium text-blue-600 hover:text-blue-800">
            Voir toutes les commandes
          </NuxtLink>
        </div>
        
        <div v-if="dashboardData.recent_orders.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in dashboardData.recent_orders" :key="order.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.order_number }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.customer_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(order.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(order.total_amount, order.currency) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="['px-2 inline-flex text-xs leading-5 font-semibold', getOrderStatusBadge(order.order_status).class]">
                    {{ getOrderStatusBadge(order.order_status).label }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p>Aucune commande récente</p>
        </div>
      </div>

      <!-- Produits populaires -->
      <div class="bg-white p-6 border-t border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Produits populaires</h2>
          <NuxtLink :to="getDashboardLink('products/produits')" class="text-sm font-medium text-blue-600 hover:text-blue-800">
            Gérer les produits
          </NuxtLink>
        </div>
        
        <div v-if="dashboardData.popular_products.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventes</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in dashboardData.popular_products" :key="product.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div v-if="product.preview_image" class="w-10 h-10 flex-shrink-0">
                      <!--<img :src="getImageUrl(product.preview_image)" :alt="product.name" class="w-10 h-10 object-cover rounded">-->
                      <!-- Wrapper qui bloque le téléchargement -->
                      <div class="relative overflow-hidden select-none">
                        <img
                          :src="getImageUrl(product.preview_image)"
                          :alt="product.name"
                          class="w-full h-full object-cover"
                          @contextmenu.prevent
                          @dragstart.prevent
                          draggable="false"
                          loading="lazy"
                        />
                        <!-- Overlay transparent qui intercepte le clic droit -->
                        <div
                          class="absolute inset-0 z-10"
                          @contextmenu.prevent
                          @dragstart.prevent
                        ></div>
                      </div>
                    </div>
                    <div v-else class="bg-gray-200 border-2 border-dashed w-10 h-10 flex-shrink-0" />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.category_name || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span v-if="product.promotional_price" class="line-through text-gray-400 mr-2">{{ formatCurrency(product.price, dashboardData.statistics.currency) }}</span>
                  <span :class="product.promotional_price ? 'text-red-600 font-semibold' : ''">{{ formatCurrency(product.promotional_price || product.price, dashboardData.statistics.currency) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.sales_count }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span :class="product.stock_quantity <= 5 ? 'text-red-600 font-semibold' : ''">{{ product.stock_quantity }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p>Aucun produit populaire pour le moment</p>
          <NuxtLink :to="getDashboardLink('products/ajouter-produit')" class="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium">
            Ajouter votre premier produit
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useShops } from '~/composables/useShops'
import { useDashboard } from '~/composables/useDashboard'

const route = useRoute()
const slug = route.params.slug as string
const config = useRuntimeConfig()

const { shops, currentShop, fetchShops } = useShops()
const { 
  dashboardData, 
  isLoading, 
  error, 
  fetchDashboardStats, 
  formatCurrency, 
  getOrderStatusBadge, 
  formatDate 
} = useDashboard()

const getDashboardLink = (path: string = '') => {
  return `/dashboard-vendor/${slug}/${path}`
}

const getImageUrl = (path: string | null) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${config.public.backendUrl}/storage/${path}`
}

const loadDashboard = async () => {
  // Recuperer les boutiques si pas deja chargees
  if (shops.value.length === 0) {
    await fetchShops()
  }
  
  // Utiliser currentShop du composable (defini par le middleware)
  if (currentShop.value) {
    await fetchDashboardStats(currentShop.value.id)
  }
}

onMounted(() => {
  loadDashboard()
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})
</script>