<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Clients</h1>
      <p class="text-gray-600">Gérez vos clients ({{ pagination.total }} client(s))</p>
    </div>

    <!-- Message de succès -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
      <p class="text-sm text-green-800">{{ successMessage }}</p>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-800">{{ error }}</p>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Recherche -->
        <div class="relative md:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
          <div class="absolute inset-y-0 left-0 pl-3 mt-6 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input 
            type="text" 
            id="search"
            v-model="searchQuery"
            @input="handleSearch"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
            placeholder="Rechercher par nom, email ou téléphone..."
          >
        </div>

        <!-- Tri par -->
        <div>
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
          <select 
            id="sort"
            v-model="sortBy"
            @change="handleSort"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="last_order">Dernière commande</option>
            <option value="orders_count">Nb de commandes</option>
            <option value="total_spent">Total dépensé</option>
            <option value="name">Nom</option>
          </select>
        </div>

        <!-- Ordre -->
        <div>
          <label for="order" class="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
          <select 
            id="order"
            v-model="sortOrder"
            @change="handleSort"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="desc">Décroissant</option>
            <option value="asc">Croissant</option>
          </select>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading && !customers.length" class="bg-white p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-600">Chargement des clients...</p>
    </div>

    <!-- Liste vide -->
    <div v-else-if="!isLoading && !customers.length" class="bg-white p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Aucun client</h3>
      <p class="mt-2 text-sm text-gray-500">
        {{ searchQuery ? 'Aucun client ne correspond à votre recherche.' : 'Vous n\'avez pas encore de clients.' }}
      </p>
    </div>

    <!-- Liste des clients -->
    <div v-else class="bg-white">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscrit le</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total dépensé</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="customer in customers" :key="customer.email" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary text-white rounded-full font-medium">
                    {{ getInitials(customer.name) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 flex items-center">
                      {{ customer.name }}
                      <span v-if="customer.is_guest" class="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded-full">Invité</span>
                      <span v-else class="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Inscrit</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.phone || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(customer.registered_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ customer.orders_count }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(customer.total_spent) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="openCustomerDetails(customer)" 
                  class="text-primary hover:text-secondary"
                >
                  Voir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="goToPage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <button 
            @click="goToPage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Affichage de 
              <span class="font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span> 
              à 
              <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span> 
              sur 
              <span class="font-medium">{{ pagination.total }}</span> 
              résultats
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                @click="goToPage(pagination.current_page - 1)"
                :disabled="pagination.current_page === 1"
                class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
              >
                <span class="sr-only">Précédent</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <button
                v-for="page in paginationPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === pagination.current_page
                    ? 'z-10 bg-primary border-primary text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>

              <button
                @click="goToPage(pagination.current_page + 1)"
                :disabled="pagination.current_page === pagination.last_page"
                class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md"
              >
                <span class="sr-only">Suivant</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal pour les détails du client -->
    <Teleport to="body">
      <div v-if="showClientDetails && selectedCustomer" class="modal-overlay" @click.self="closeCustomerDetails">
        <div class="modal-container">
          <div class="p-6">
            <!-- En-tête -->
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-medium text-gray-900 flex items-center">
                Détails du client - {{ selectedCustomer.name }}
                <span v-if="selectedCustomer.is_guest" class="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">Invité</span>
                <span v-else class="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Inscrit</span>
              </h2>
              <button 
                @click="closeCustomerDetails" 
                class="px-3 py-1 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary rounded-md"
              >
                Fermer
              </button>
            </div>
            
            <!-- Informations -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="border border-gray-200 p-4 rounded-md">
                <h3 class="text-md font-medium text-gray-900 mb-3">Informations personnelles</h3>
                <div class="space-y-2">
                  <p class="text-sm"><span class="font-medium">Nom:</span> {{ selectedCustomer.name }}</p>
                  <p class="text-sm"><span class="font-medium">Email:</span> {{ selectedCustomer.email }}</p>
                  <p class="text-sm"><span class="font-medium">Téléphone:</span> {{ selectedCustomer.phone || 'Non renseigné' }}</p>
                  <p class="text-sm"><span class="font-medium">Date d'inscription:</span> {{ formatDate(selectedCustomer.registered_at) }}</p>
                  <p class="text-sm"><span class="font-medium">Dernière commande:</span> {{ formatDate(selectedCustomer.last_order_date) }}</p>
                </div>
              </div>
              
              <div class="border border-gray-200 p-4 rounded-md">
                <h3 class="text-md font-medium text-gray-900 mb-3">Statistiques</h3>
                <div class="space-y-2">
                  <p class="text-sm"><span class="font-medium">Nombre de commandes:</span> {{ selectedCustomer.orders_count }}</p>
                  <p class="text-sm"><span class="font-medium">Total dépensé:</span> {{ formatCurrency(selectedCustomer.total_spent) }}</p>
                  <p class="text-sm"><span class="font-medium">Panier moyen:</span> {{ formatCurrency(selectedCustomer.average_order) }}</p>
                </div>
              </div>
            </div>
            
            <!-- Historique des commandes -->
            <div class="border border-gray-200 p-4 rounded-md">
              <h3 class="text-md font-medium text-gray-900 mb-3">Historique des commandes</h3>
              
              <!-- Chargement -->
              <div v-if="isLoadingOrders" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p class="mt-2 text-sm text-gray-600">Chargement des commandes...</p>
              </div>

              <!-- Liste vide -->
              <div v-else-if="!customerOrders.length" class="text-center py-8">
                <p class="text-sm text-gray-600">Aucune commande</p>
              </div>

              <!-- Tableau des commandes -->
              <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="order in customerOrders" :key="order.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.order_number }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(order.created_at) }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.items_count }} article(s)</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(order.total_amount) }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getOrderStatusClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                          {{ formatOrderStatus(order.status) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Customer } from '~/composables/useCustomers'

definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})

const route = useRoute()
const shopSlug = route.params.slug as string

// Récupérer la boutique actuelle
const { currentShop, shops, fetchShops, setCurrentShop } = useShops()
const shopId = computed(() => currentShop.value?.id)

const {
  customers,
  customerOrders,
  isLoading,
  error,
  pagination,
  fetchCustomers,
  fetchCustomerOrders
} = useCustomers()

// État local
const searchQuery = ref('')
const sortBy = ref('last_order')
const sortOrder = ref('desc')
const showClientDetails = ref(false)
const selectedCustomer = ref<Customer | null>(null)
const successMessage = ref('')
const isLoadingOrders = ref(false)
let searchTimeout: NodeJS.Timeout | null = null

// Charger les données au montage
onMounted(async () => {
  // Charger les boutiques si necessaire
  if (shops.value.length === 0) {
    await fetchShops()
  }
  
  // Charger les clients (currentShop est deja defini par le middleware)
  if (shopId.value) {
    await loadCustomers()
  }
})

// Charger les clients avec les filtres
const loadCustomers = async (page: number = 1) => {
  if (!shopId.value) return
  
  await fetchCustomers(shopId.value, {
    search: searchQuery.value,
    sort_by: sortBy.value as any,
    sort_order: sortOrder.value as any,
    page,
    per_page: 20
  })
}

// Gestion de la recherche (debounce)
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    loadCustomers(1)
  }, 500)
}

// Gestion du tri
const handleSort = () => {
  loadCustomers(1)
}

// Pagination
const goToPage = (page: number) => {
  if (page < 1 || page > pagination.value.last_page) return
  loadCustomers(page)
}

// Pages de pagination à afficher
const paginationPages = computed(() => {
  const pages = []
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  
  // Afficher max 5 pages
  let start = Math.max(1, current - 2)
  let end = Math.min(last, current + 2)
  
  // Ajuster si on est au début ou à la fin
  if (current <= 3) {
    end = Math.min(5, last)
  }
  if (current >= last - 2) {
    start = Math.max(1, last - 4)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Ouvrir les détails d'un client
const openCustomerDetails = async (customer: Customer) => {
  selectedCustomer.value = customer
  showClientDetails.value = true
  isLoadingOrders.value = true
  
  if (shopId.value) {
    const customerId = customer.is_guest ? customer.email : customer.id!
    await fetchCustomerOrders(shopId.value, customerId)
  }
  
  isLoadingOrders.value = false
}

// Fermer les détails
const closeCustomerDetails = () => {
  showClientDetails.value = false
  selectedCustomer.value = null
}

// Fonctions d'aide
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatDate = (date: string): string => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatCurrency = (amount: number): string => {
  const currency = currentShop.value?.currency || 'XOF'
  return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency}`
}

const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En préparation',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return statusMap[status] || status
}

const getOrderStatusClass = (status: string): string => {
  const classMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  background-color: white;
  max-width: 64rem;
  width: 100%;
  z-index: 1000;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
