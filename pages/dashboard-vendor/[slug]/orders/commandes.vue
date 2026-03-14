<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Commandes</h1>
      <p class="text-gray-600">Gérez les commandes de vos clients</p>
    </div>

    <!-- Messages -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
      <p class="text-sm text-green-800">{{ successMessage }}</p>
    </div>

    <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-800">{{ errorMessage }}</p>
    </div>

    <!-- Filtres -->
    <div class="bg-white p-4 mb-6 rounded-md">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Statut commande</label>
          <select 
            v-model="filters.status" 
            @change="loadOrders"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"
          >
            <option value="">Tous</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="processing">En traitement</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
        
        <div>
          <label for="payment_status" class="block text-sm font-medium text-gray-700">Statut paiement</label>
          <select 
            v-model="filters.payment_status" 
            @change="loadOrders"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"
          >
            <option value="">Tous</option>
            <option value="pending">En attente</option>
            <option value="partially_paid">Partiellement payé</option>
            <option value="paid">Payé</option>
            <option value="failed">Échoué</option>
            <option value="refunded">Remboursé</option>
          </select>
        </div>

        <div>
          <label for="order_type" class="block text-sm font-medium text-gray-700">Type</label>
          <select 
            v-model="filters.order_type" 
            @change="loadOrders"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"
          >
            <option value="">Tous</option>
            <option value="standard">Standard</option>
            <option value="preorder">Précommande</option>
          </select>
        </div>

        <div>
          <label for="sort" class="block text-sm font-medium text-gray-700">Trier par</label>
          <select 
            v-model="filters.sort_by" 
            @change="loadOrders"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"
          >
            <option value="created_at">Date de création</option>
            <option value="total_amount">Montant</option>
            <option value="order_number">Numéro</option>
          </select>
        </div>
        
        <div class="relative">
          <label for="search" class="block text-sm font-medium text-gray-700">Rechercher</label>
          <div class="absolute inset-y-0 left-0 pl-3 mt-6 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input 
            v-model="filters.search" 
            @input="debouncedSearch"
            type="text" 
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary" 
            placeholder="N°, nom, email..."
          >
        </div>
      </div>
    </div>

    <!-- Chargement -->
    <div v-if="isLoading && !orders.length" class="bg-white p-12 rounded-md text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement des commandes...</p>
    </div>

    <!-- Liste des commandes -->
    <div v-else-if="orders.length > 0" class="bg-white rounded-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div class="flex items-center gap-2">
                  {{ order.order_number }}
                  <span v-if="order.is_preorder" class="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Précommande
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.customer_name }}</div>
                <div class="text-sm text-gray-500">{{ order.customer_email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{{ formatPrice(order.total_amount, order.currency) }}</div>
                <div v-if="order.amount_remaining > 0" class="text-xs text-orange-600">
                  Reste: {{ formatPrice(order.amount_remaining, order.currency) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPaymentStatusClass(order.payment_status)">
                  {{ getPaymentStatusLabel(order.payment_status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getOrderStatusClass(order.order_status)">
                  {{ getOrderStatusLabel(order.order_status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="viewOrderDetails(order.id)" 
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
      <div v-if="ordersMeta" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="goToPage(ordersMeta.current_page - 1)"
            :disabled="ordersMeta.current_page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Précédent
          </button>
          <button 
            @click="goToPage(ordersMeta.current_page + 1)"
            :disabled="ordersMeta.current_page >= ordersMeta.last_page"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Affichage de <span class="font-medium">{{ ((ordersMeta.current_page - 1) * ordersMeta.per_page) + 1 }}</span>
              à <span class="font-medium">{{ Math.min(ordersMeta.current_page * ordersMeta.per_page, ordersMeta.total) }}</span>
              sur <span class="font-medium">{{ ordersMeta.total }}</span> résultats
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button 
                @click="goToPage(ordersMeta.current_page - 1)"
                :disabled="ordersMeta.current_page <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="goToPage(page)"
                :class="page === ordersMeta.current_page ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
              >
                {{ page }}
              </button>
              
              <button 
                @click="goToPage(ordersMeta.current_page + 1)"
                :disabled="ordersMeta.current_page >= ordersMeta.last_page"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Aucune commande -->
    <div v-else class="bg-white p-12 rounded-md text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
      <p class="mt-1 text-sm text-gray-500">Aucune commande ne correspond à vos critères</p>
    </div>

    <!-- Modal détails commande -->
    <Teleport to="body">
      <div 
        v-if="showOrderDetailsModal && selectedOrder" 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Commande {{ selectedOrder.order_number }}</h2>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 py-4">
            <!-- Informations générales -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="border border-gray-200 p-4 rounded-md">
                <h3 class="text-sm font-medium text-gray-900 mb-3">Informations client</h3>
                <p class="text-sm text-gray-600">{{ selectedOrder.customer_name }}</p>
                <p class="text-sm text-gray-600">{{ selectedOrder.customer_email }}</p>
                <p class="text-sm text-gray-600">{{ selectedOrder.customer_phone }}</p>
              </div>
              
              <div class="border border-gray-200 p-4 rounded-md">
                <h3 class="text-sm font-medium text-gray-900 mb-3">Livraison</h3>
                <p class="text-sm text-gray-600 mb-1">
                  Mode: {{ getDeliveryMethodLabel(selectedOrder.delivery_method) }}
                </p>
                <div v-if="selectedOrder.delivery_method !== 'pickup' && selectedOrder.shipping_address">
                  <p class="text-sm text-gray-600">{{ selectedOrder.shipping_address.address }}</p>
                  <p class="text-sm text-gray-600">{{ selectedOrder.shipping_address.city }}</p>
                  <p class="text-sm text-gray-600">{{ selectedOrder.shipping_address.country }}</p>
                </div>
                <p v-if="selectedOrder.tracking_code" class="text-sm text-gray-600 mt-2">
                  Suivi: <span class="font-medium">{{ selectedOrder.tracking_code }}</span>
                </p>
              </div>
              
              <div class="border border-gray-200 p-4 rounded-md">
                <h3 class="text-sm font-medium text-gray-900 mb-3">Livreur</h3>
                
                <!-- Livreur actuel -->
                <div v-if="currentCourier" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p class="text-sm font-medium text-gray-900">{{ currentCourier.name }}</p>
                  <p class="text-xs text-gray-600">{{ currentCourier.phone }}</p>
                  <p v-if="currentCourier.is_platform" class="text-xs text-blue-600 mt-1">Livreur de la plateforme</p>
                </div>
                
                <!-- Message si commande livrée/annulée -->
                <div v-if="!canAssignCourier" class="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p class="text-sm text-gray-600">
                    Impossible de {{ currentCourier ? 'changer' : 'assigner' }} un livreur : commande {{ selectedOrder.order_status === 'delivered' ? 'livrée' : 'annulée' }}
                  </p>
                </div>
                
                <!-- Formulaire d'assignation -->
                <div v-else class="space-y-2">
                  <select 
                    v-model="selectedCourierId"
                    :disabled="isAssigningCourier"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                  >
                    <option :value="null">{{ currentCourier ? 'Changer de livreur' : 'Sélectionner un livreur' }}</option>
                    <option v-for="courier in couriers" :key="courier.id" :value="courier.id">
                      {{ courier.name }} {{ courier.is_platform ? '(Plateforme)' : '' }}
                    </option>
                  </select>
                  <button 
                    @click="handleAssignCourier"
                    :disabled="isAssigningCourier || !selectedCourierId"
                    class="w-full px-3 py-2 bg-primary text-white text-sm rounded-md hover:bg-secondary disabled:opacity-50"
                  >
                    {{ isAssigningCourier ? 'Assignation...' : (currentCourier ? 'Changer' : 'Assigner') }}
                  </button>
                </div>
              </div>
              
              <div class="border border-gray-200 p-4 rounded-md">
                <h3 class="text-sm font-medium text-gray-900 mb-3">Statut</h3>
                <select 
                  v-model="selectedOrder.order_status"
                  @change="updateStatus"
                  :disabled="isUpdating"
                  class="w-full mb-2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="processing">En traitement</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
                
                <div class="mt-3">
                  <label class="block text-xs font-medium text-gray-700 mb-1">Code de suivi</label>
                  <div class="flex gap-2">
                    <input 
                      v-model="trackingCodeInput"
                      type="text"
                      placeholder="Code de suivi"
                      class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    >
                    <button 
                      @click="updateTrackingCode"
                      :disabled="isUpdating || !trackingCodeInput"
                      class="px-3 py-2 bg-primary text-white text-sm rounded-md hover:bg-secondary disabled:opacity-50"
                    >
                      {{ isUpdating ? '...' : 'OK' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Produits -->
            <div class="border border-gray-200 rounded-md mb-6">
              <h3 class="text-sm font-medium text-gray-900 p-4 border-b border-gray-200">Produits commandés</h3>
              <div class="divide-y divide-gray-200">
                <div 
                  v-for="item in selectedOrder.order_items" 
                  :key="item.id"
                  class="p-4 flex items-center gap-4"
                >
                  <img 
                    v-if="item.product && item.product.product_images && item.product.product_images.length > 0" 
                    :src="getProductImage(item.product)" 
                    :alt="item.product_name"
                    class="w-16 h-16 object-cover rounded"
                  >
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ item.product_name }}</p>
                    <p v-if="item.variant_name" class="text-xs text-gray-500">{{ item.variant_name }}</p>
                    <p class="text-sm text-gray-600">Quantité: {{ item.quantity }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{{ formatPrice(item.total_price, selectedOrder.currency) }}</p>
                    <p class="text-xs text-gray-500">{{ formatPrice(item.unit_price, selectedOrder.currency) }} / unité</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Totaux -->
            <div class="border border-gray-200 rounded-md p-4">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Sous-total</span>
                  <span class="text-gray-900">{{ formatPrice(selectedOrder.subtotal, selectedOrder.currency) }}</span>
                </div>
                <div v-if="selectedOrder.shipping_cost > 0" class="flex justify-between text-sm">
                  <span class="text-gray-600">Frais de livraison</span>
                  <span class="text-gray-900">{{ formatPrice(selectedOrder.shipping_cost, selectedOrder.currency) }}</span>
                </div>
                <div v-if="selectedOrder.discount_amount > 0" class="flex justify-between text-sm text-green-600">
                  <span>Réduction</span>
                  <span>-{{ formatPrice(selectedOrder.discount_amount, selectedOrder.currency) }}</span>
                </div>
                <div class="flex justify-between text-base font-medium border-t border-gray-200 pt-2">
                  <span class="text-gray-900">Total</span>
                  <span class="text-gray-900">{{ formatPrice(selectedOrder.total_amount, selectedOrder.currency) }}</span>
                </div>
                <!-- Infos précommande -->
                <div v-if="selectedOrder.is_preorder" class="mt-3 pt-3 border-t border-gray-200">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Précommande</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Montant payé</span>
                    <span class="text-green-600 font-medium">{{ formatPrice(selectedOrder.amount_paid || 0, selectedOrder.currency) }}</span>
                  </div>
                  <div v-if="selectedOrder.amount_remaining > 0" class="flex justify-between text-sm mt-1">
                    <span class="text-gray-600">Reste à payer</span>
                    <span class="text-orange-600 font-medium">{{ formatPrice(selectedOrder.amount_remaining, selectedOrder.currency) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="selectedOrder.notes" class="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 class="text-sm font-medium text-gray-900 mb-1">Notes</h4>
              <p class="text-sm text-gray-600">{{ selectedOrder.notes }}</p>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button 
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const config = useRuntimeConfig()
const shopSlug = route.params.slug as string

const { fetchShopOrders, fetchOrderDetails, updateOrderStatus, updateTracking, orders, ordersMeta, currentOrder, isLoading, error } = useVendorOrders()
const { shops, currentShop, fetchShops } = useShops()
const { couriers, fetchCouriers, assignToOrder } = useCouriers()

// Computed pour obtenir l'ID de la boutique actuelle (utilise currentShop du composable)
const currentShopId = computed(() => currentShop.value?.id)

// Etat
const filters = ref({
  status: '',
  payment_status: '',
  order_type: '',
  search: '',
  sort_by: 'created_at',
  sort_order: 'desc' as 'asc' | 'desc',
  page: 1,
  per_page: 20
})

const showOrderDetailsModal = ref(false)
const selectedOrder = ref<any>(null)
const isUpdating = ref(false)
const trackingCodeInput = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const selectedCourierId = ref<number | null>(null)
const isAssigningCourier = ref(false)
const currentCourier = ref<any>(null)

// Computed pour déterminer si on peut assigner/changer un livreur
const canAssignCourier = computed(() => {
  if (!selectedOrder.value) return false
  // On ne peut pas assigner/changer si la commande est livrée ou annulée
  return !['delivered', 'cancelled'].includes(selectedOrder.value.order_status)
})

// Chargement des commandes
const loadOrders = async () => {
  if (!currentShopId.value) return
  
  errorMessage.value = ''
  const success = await fetchShopOrders(currentShopId.value, filters.value)
  if (!success && error.value) {
    errorMessage.value = error.value
  }
}

// Recherche avec debounce
let searchTimeout: any = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.value.page = 1
    loadOrders()
  }, 500)
}

// Voir les détails d'une commande
const viewOrderDetails = async (orderId: number) => {
  if (!currentShopId.value) return
  
  const result: any = await fetchOrderDetails(currentShopId.value, orderId)
  if (result) {
    // result peut être soit l'order directement, soit un objet avec order et courier
    if (result.order) {
      // Nouveau format du backend avec courier
      selectedOrder.value = result.order
      trackingCodeInput.value = result.order.tracking_code || ''
      currentCourier.value = result.courier || null
    } else {
      // Ancien format
      selectedOrder.value = result
      trackingCodeInput.value = result.tracking_code || ''
      currentCourier.value = null
    }
    
    selectedCourierId.value = null
    
    // Charger les livreurs disponibles
    await fetchCouriers(currentShopId.value)
    
    showOrderDetailsModal.value = true
  }
}

// Fermer le modal
const closeModal = () => {
  showOrderDetailsModal.value = false
  selectedOrder.value = null
  trackingCodeInput.value = ''
  currentCourier.value = null
  selectedCourierId.value = null
}

// Mettre à jour le statut
const updateStatus = async () => {
  if (!selectedOrder.value || isUpdating.value || !currentShopId.value) return
  
  isUpdating.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  const success = await updateOrderStatus(currentShopId.value, selectedOrder.value.id, selectedOrder.value.order_status)
  
  if (success) {
    successMessage.value = 'Statut mis à jour avec succès'
    setTimeout(() => successMessage.value = '', 3000)
  } else {
    errorMessage.value = error.value || 'Erreur lors de la mise à jour'
  }
  
  isUpdating.value = false
}

// Mettre à jour le code de suivi
const updateTrackingCode = async () => {
  if (!selectedOrder.value || !trackingCodeInput.value || isUpdating.value || !currentShopId.value) return
  
  isUpdating.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  const success = await updateTracking(currentShopId.value, selectedOrder.value.id, trackingCodeInput.value)
  
  if (success) {
    selectedOrder.value.tracking_code = trackingCodeInput.value
    successMessage.value = 'Code de suivi mis à jour'
    setTimeout(() => successMessage.value = '', 3000)
  } else {
    errorMessage.value = error.value || 'Erreur lors de la mise à jour'
  }
  
  isUpdating.value = false
}

// Assigner un livreur à la commande
const handleAssignCourier = async () => {
  if (!selectedOrder.value || !selectedCourierId.value || isAssigningCourier.value) return
  
  isAssigningCourier.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  const result: any = await assignToOrder(selectedOrder.value.id, selectedCourierId.value)
  
  if (result) {
    // Mettre à jour le livreur actuel avec les informations retournées
    if (result.courier) {
      currentCourier.value = result.courier
    }
    
    successMessage.value = currentCourier.value ? 'Livreur changé avec succès' : 'Livreur assigné avec succès'
    selectedCourierId.value = null
    setTimeout(() => successMessage.value = '', 3000)
  } else {
    errorMessage.value = 'Erreur lors de l\'assignation du livreur'
  }
  
  isAssigningCourier.value = false
}

// Pagination
const goToPage = (page: number) => {
  if (page < 1 || (ordersMeta.value && page > ordersMeta.value.last_page)) return
  filters.value.page = page
  loadOrders()
}

const visiblePages = computed(() => {
  if (!ordersMeta.value) return []
  
  const current = ordersMeta.value.current_page
  const last = ordersMeta.value.last_page
  const pages: number[] = []
  
  let start = Math.max(1, current - 2)
  let end = Math.min(last, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Utilitaires
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatPrice = (price: number, currency: string = 'XOF') => {
  return `${price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency}`
}

const getProductImage = (product: any) => {
  const backendUrl = config.public.apiBase.replace('/api', '')
  if (product.preview_image) {
    return `${backendUrl}/storage/${product.preview_image}`
  }
  if (product.product_images && product.product_images.length > 0) {
    return `${backendUrl}/storage/${product.product_images[0].image_path}`
  }
  return 'https://placehold.co/400x400?text=Produit'
}

const getOrderStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En traitement',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const getOrderStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    confirmed: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    processing: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800',
    shipped: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800',
    delivered: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    cancelled: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
  }
  return classes[status] || classes.pending
}

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    partially_paid: 'Partiellement payé',
    paid: 'Payé',
    failed: 'Échoué',
    refunded: 'Remboursé'
  }
  return labels[status] || status
}

const getPaymentStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    partially_paid: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800',
    paid: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    failed: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
    refunded: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
  return classes[status] || classes.pending
}

const getDeliveryMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    pickup: 'Retrait en boutique',
    delivery: 'Livraison à domicile',
    partner: 'Livraison partenaire'
  }
  return labels[method] || method
}

// Chargement initial
onMounted(async () => {
  await fetchShops()
  loadOrders()
})
</script>
