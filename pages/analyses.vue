<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- En-tete -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Analyses</h1>
        <p class="text-gray-600">Statistiques globales de vos {{ globalStats?.statistics.total_shops || 0 }} boutique(s)</p>
      </div>
      <button 
        @click="exportToPDF" 
        :disabled="isLoading || !globalStats"
        class="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Exporter en PDF
      </button>
    </div>

    <!-- Filtre Periode -->
    <div class="bg-white p-4 border border-gray-200 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
        <div>
          <label for="period" class="block text-sm font-medium text-gray-700">Periode</label>
          <select 
            id="period" 
            v-model="selectedPeriod" 
            @change="onPeriodChange"
            :disabled="isLoading"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette annee</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Etat de chargement -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center space-y-3">
        <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-500">Chargement des statistiques...</span>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 mb-6">
      <p>{{ error }}</p>
      <button @click="loadStats" class="mt-2 text-sm underline hover:no-underline">Reessayer</button>
    </div>

    <!-- Contenu principal -->
    <template v-else-if="globalStats">
      <!-- Statistiques cles -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Visites</h3>
              <p class="text-2xl font-semibold text-gray-900">{{ formatNumber(globalStats.statistics.total_visits) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-green-100">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Revenus</h3>
              <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(globalStats.statistics.total_revenue, globalStats.statistics.currency) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Taux de conversion</h3>
              <p class="text-2xl font-semibold text-gray-900">{{ globalStats.statistics.conversion_rate }}%</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Panier moyen</h3>
              <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(globalStats.statistics.average_cart, globalStats.statistics.currency) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats supplementaires -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-indigo-100">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Commandes</h3>
              <p class="text-2xl font-semibold text-gray-900">{{ formatNumber(globalStats.statistics.total_orders) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-pink-100">
              <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Clients</h3>
              <p class="text-2xl font-semibold text-gray-900">{{ formatNumber(globalStats.statistics.total_customers) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-teal-100">
              <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Produits</h3>
              <p class="text-2xl font-semibold text-gray-900">{{ formatNumber(globalStats.statistics.total_products) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Visites -->
        <div class="bg-white p-6 border border-gray-200">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Visites</h2>
          <div class="h-64">
            <div v-if="globalStats.visits_by_day.length > 0" class="flex items-end h-48 space-x-2 mt-4">
              <div 
                v-for="(visit, index) in globalStats.visits_by_day" 
                :key="index" 
                class="flex flex-col items-center flex-1"
              >
                <div 
                  class="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 min-h-[4px]"
                  :style="{ height: calculateBarHeight(visit.value, globalStats.visits_by_day) + '%' }"
                ></div>
                <span class="text-xs text-gray-500 mt-2">{{ visit.label }}</span>
              </div>
            </div>
            <div v-else class="h-48 flex items-center justify-center text-gray-400">
              Aucune donnee pour cette periode
            </div>
            <div class="border-t border-gray-200 mt-4 pt-4">
              <p class="text-sm text-gray-500">Estimation des visiteurs par {{ selectedPeriod === 'year' ? 'mois' : 'jour' }}</p>
            </div>
          </div>
        </div>
        
        <!-- Revenus -->
        <div class="bg-white p-6 border border-gray-200">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Revenus</h2>
          <div class="h-64">
            <div v-if="globalStats.revenue_by_day.length > 0" class="flex items-end h-48 space-x-2 mt-4">
              <div 
                v-for="(rev, index) in globalStats.revenue_by_day" 
                :key="index" 
                class="flex flex-col items-center flex-1"
              >
                <div 
                  class="w-full bg-green-500 hover:bg-green-600 transition-all duration-300 min-h-[4px]"
                  :style="{ height: calculateBarHeight(rev.value, globalStats.revenue_by_day) + '%' }"
                ></div>
                <span class="text-xs text-gray-500 mt-2">{{ rev.label }}</span>
              </div>
            </div>
            <div v-else class="h-48 flex items-center justify-center text-gray-400">
              Aucun revenu pour cette periode
            </div>
            <div class="border-t border-gray-200 mt-4 pt-4">
              <p class="text-sm text-gray-500">Revenus par {{ selectedPeriod === 'year' ? 'mois' : 'jour' }} ({{ globalStats.statistics.currency }})</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques par boutique -->
      <div v-if="globalStats.shops_stats.length > 0" class="bg-white p-6 border border-gray-200 mb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Performance par boutique</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boutique</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="shop in globalStats.shops_stats" :key="shop.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img 
                      v-if="shop.logo" 
                      :src="shop.logo" 
                      :alt="shop.name"
                      class="w-10 h-10 object-cover rounded"
                    >
                    <div v-else class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <span class="text-gray-500 text-sm font-medium">{{ shop.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ shop.name }}</div>
                      <div class="text-xs text-gray-500">{{ shop.slug }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatNumber(shop.orders) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(shop.revenue, shop.currency) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <NuxtLink 
                    :to="`/dashboard-vendor/${shop.slug}/dashboard`" 
                    class="text-primary hover:text-secondary text-sm font-medium"
                  >
                    Voir details
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Produits populaires -->
      <div class="bg-white p-6 border border-gray-200">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Produits populaires (toutes boutiques)</h2>
        <div v-if="globalStats.popular_products.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boutique</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventes</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in globalStats.popular_products" :key="product.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img 
                      v-if="product.preview_image" 
                      :src="product.preview_image" 
                      :alt="product.name"
                      class="w-10 h-10 object-cover rounded"
                    >
                    <div v-else class="w-10 h-10 bg-gray-200 rounded"></div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.shop_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.sales }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(product.revenue, globalStats.statistics.currency) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          Aucune vente enregistree pour le moment
        </div>
      </div>
    </template>

    <!-- Aucune boutique -->
    <div v-else class="bg-white p-12 border border-gray-200 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-700 mb-2">Aucune boutique</h3>
      <p class="text-gray-500 mb-4">Creez votre premiere boutique pour voir vos statistiques</p>
      <NuxtLink to="/creer-boutique" class="inline-block px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-secondary">
        Creer une boutique
      </NuxtLink>
    </div>
    
    <!-- Navigation vers les boutiques -->
    <div class="mt-8 flex justify-end">
      <NuxtLink to="/mes-boutiques" class="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary">
        Mes boutiques
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Le composable useGlobalStats est auto-importe par Nuxt
const { 
  globalStats, 
  isLoading, 
  error, 
  fetchGlobalStats, 
  formatCurrency, 
  formatNumber,
  calculateBarHeight 
} = useGlobalStats()

const selectedPeriod = ref('month')

const loadStats = async () => {
  await fetchGlobalStats(selectedPeriod.value)
}

const onPeriodChange = () => {
  loadStats()
}

const exportToPDF = () => {
  if (!globalStats.value) return
  
  alert('Export PDF en cours de developpement. Les statistiques seront bientot exportables.')
  console.log('Export PDF demande avec les parametres :', {
    period: selectedPeriod.value,
    statistics: globalStats.value.statistics
  })
}

onMounted(() => {
  loadStats()
})
</script>
