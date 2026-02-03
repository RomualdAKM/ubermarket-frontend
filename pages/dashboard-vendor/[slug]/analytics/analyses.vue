<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Analyses</h1>
        <p class="text-gray-600">Statistiques et performances de votre boutique</p>
      </div>
      <button 
        @click="exportToPDF" 
        class="px-4 py-2 bg-primary rounded-md text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        Exporter en PDF
      </button>
    </div>

    <!-- Filtres -->
    <div class="bg-white p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
        <div>
          <label for="period" class="block text-sm font-medium text-gray-700">Période</label>
          <select 
            id="period" 
            v-model="selectedPeriod" 
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month" selected>Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
        
        <div>
          <label for="country" class="block text-sm font-medium text-gray-700">Pays</label>
          <select 
            id="country" 
            v-model="selectedCountry" 
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les pays</option>
            <option value="FR">France</option>
            <option value="BE">Belgique</option>
            <option value="CH">Suisse</option>
            <option value="CA">Canada</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Statistiques clés -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white p-6 border-r border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Visites</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ formatNumber(visits) }}</p>
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
            <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(revenue) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 border-r border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Taux de conversion</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ conversionRate }}%</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 border-r border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Panier moyen</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(averageCart) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Visites -->
      <div class="bg-white p-6 border border-gray-200 rounded-md">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Visites</h2>
        <div class="h-64">
          <div class="flex items-end h-48 space-x-2 mt-4">
            <div 
              v-for="(visit, index) in visitData" 
              :key="index" 
              class="flex flex-col items-center flex-1"
            >
              <div 
                class="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                :style="{ height: visit.height + '%' }"
              ></div>
              <span class="text-xs text-gray-500 mt-2">{{ visit.label }}</span>
            </div>
          </div>
          <div class="border-t border-gray-200 mt-4 pt-4">
            <p class="text-sm text-gray-500">Nombre de visiteurs par jour</p>
          </div>
        </div>
      </div>
      
      <!-- Revenus -->
      <div class="bg-white p-6 border border-gray-200 rounded-md">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Revenus</h2>
        <div class="h-64">
          <div class="flex items-end h-48 space-x-2 mt-4">
            <div 
              v-for="(revenue, index) in revenueData" 
              :key="index" 
              class="flex flex-col items-center flex-1"
            >
              <div 
                class="w-full bg-green-500 hover:bg-green-600 transition-all duration-300"
                :style="{ height: revenue.height + '%' }"
              ></div>
              <span class="text-xs text-gray-500 mt-2">{{ revenue.label }}</span>
            </div>
          </div>
          <div class="border-t border-gray-200 mt-4 pt-4">
            <p class="text-sm text-gray-500">Revenus générés par jour (€)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Produits populaires -->
    <div class="bg-white p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Produits populaires</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventes</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(product, index) in popularProducts" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="bg-gray-200 border-2 border-dashed w-10 h-10" />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.sales }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(product.revenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useShops } from '~/composables/useShops'

definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})

const route = useRoute()
const shopSlug = route.params.slug as string
const { shops, currentShop, fetchShops } = useShops()

// Donnees reactives
const selectedPeriod = ref('month')
const selectedCountry = ref('all')
const visits = ref(1242)
const revenue = ref(3420.50)
const conversionRate = ref(4.2)
const averageCart = ref(42.50)

// Données pour les graphiques
const visitData = ref([
  { label: 'Lun', height: 70 },
  { label: 'Mar', height: 45 },
  { label: 'Mer', height: 80 },
  { label: 'Jeu', height: 60 },
  { label: 'Ven', height: 90 },
  { label: 'Sam', height: 75 },
  { label: 'Dim', height: 85 }
])

const revenueData = ref([
  { label: 'Lun', height: 60 },
  { label: 'Mar', height: 40 },
  { label: 'Mer', height: 75 },
  { label: 'Jeu', height: 55 },
  { label: 'Ven', height: 85 },
  { label: 'Sam', height: 70 },
  { label: 'Dim', height: 80 }
])

// Produits populaires
const popularProducts = ref([
  { name: 'T-shirt casual', sales: 42, revenue: 1260.00 },
  { name: 'Casque audio', sales: 28, revenue: 2520.00 },
  { name: 'Lampe de bureau', sales: 19, revenue: 665.00 },
  { name: 'Chaussures de sport', sales: 15, revenue: 750.00 },
  { name: 'Sac à dos', sales: 12, revenue: 480.00 }
])

// Fonctions utilitaires
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const formatCurrency = (amount: number): string => {
  const currency = currentShop.value?.currency || 'XOF'
  if (currency === 'XOF') {
    return `${amount.toLocaleString('fr-FR')} FCFA`
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Fonction d'export PDF (simulation)
const exportToPDF = () => {
  alert('Fonction d\'export PDF simulée. Dans une vraie application, cela générerait un PDF avec les statistiques.')
  console.log('Export PDF demandé avec les paramètres :', {
    period: selectedPeriod.value,
    country: selectedCountry.value
  })
}

// Chargement initial
onMounted(async () => {
  await fetchShops()
})
</script>