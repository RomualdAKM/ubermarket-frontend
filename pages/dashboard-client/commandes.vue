<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="bg-white rounded-lg p-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement de vos commandes...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-white rounded-lg p-12 text-center">
      <div class="text-red-500 mb-4">
        <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="fetchMyOrders" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Réessayer
      </button>
    </div>

    <!-- Content -->
    <div v-else class="bg-white rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-light text-gray-900">Mes Commandes</h2>
        <div class="text-sm text-gray-600">
          {{ filteredOrders.length }} commande(s)
        </div>
      </div>
      
      <!-- Filtres et recherche -->
      <div class="mb-6 space-y-4">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-64">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Rechercher par numéro de commande..."
              class="w-full px-4 py-2 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <select 
            v-model="statusFilter" 
            class="px-4 py-2 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="processing">En traitement</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>
      
      <!-- Liste des commandes -->
      <div class="space-y-6">
        <div v-for="order in filteredOrders" :key="order.id" class="bg-gray-50 rounded-lg p-6">
          <!-- En-tête commande -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="font-medium text-gray-900">{{ order.order_number }}</h3>
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getOrderStatusClass(order.order_status)"
                >
                  {{ getOrderStatusLabel(order.order_status) }}
                </span>
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getPaymentStatusClass(order.payment_status)"
                >
                  {{ getPaymentStatusLabel(order.payment_status) }}
                </span>
                <span v-if="order.is_preorder" class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                  Précommande
                </span>
              </div>
              <div class="text-sm text-gray-600 space-y-1">
                <p>Boutique: <strong>{{ order.shop?.name || 'N/A' }}</strong></p>
                <p>Commandé le {{ formatDate(order.created_at) }}</p>
                <p v-if="order.tracking_code" class="flex items-center space-x-2">
                  <span>Suivi:</span>
                  <code class="bg-white px-2 py-1 rounded text-xs">{{ order.tracking_code }}</code>
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-medium text-gray-900 mb-1">{{ formatPrice(order.total_amount, order.currency) }}</div>
              <div class="text-sm text-gray-600">{{ order.order_items?.length || 0 }} article(s)</div>
              <div v-if="order.amount_remaining > 0" class="text-sm text-orange-600 mt-1">
                Reste à payer: {{ formatPrice(order.amount_remaining, order.currency) }}
              </div>
            </div>
          </div>
          
          <!-- Articles de la commande (aperçu simplifié) -->
          <div class="space-y-3" v-if="order.order_items && order.order_items.length > 0">
            <div v-for="item in order.order_items.slice(0, 2)" :key="item.id" class="flex items-start space-x-4 p-4 bg-white rounded-lg">
              <img 
                :src="getProductImage(item.product)" 
                :alt="item.product_name" 
                class="w-20 h-20 object-cover rounded-lg"
              >
              
              <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ item.product_name }}</h4>
                    <p v-if="item.variant_name" class="text-sm text-gray-600">{{ item.variant_name }}</p>
                    <p class="text-sm text-gray-600">Quantité: {{ item.quantity }}</p>
                    
                    <!-- Badge produit digital -->
                    <span v-if="isDigitalProduct(item)" class="inline-flex items-center mt-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                      </svg>
                      Produit numérique
                    </span>
                  </div>
                  <div class="text-right">
                    <div class="font-medium text-gray-900">{{ formatPrice(item.total_price, order.currency) }}</div>
                    
                    <!-- Bouton téléchargement pour produits digitaux -->
                    <button
                      v-if="isDigitalProduct(item) && order.payment_status === 'paid'"
                      @click="downloadDigitalFile(order.id, item.id)"
                      class="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
                    >
                      <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V10"></path>
                      </svg>
                      Télécharger
                    </button>
                    
                    <!-- Message paiement en attente -->
                    <p v-if="isDigitalProduct(item) && order.payment_status !== 'paid'" class="mt-2 text-xs text-orange-600">
                      Disponible après paiement
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="order.order_items.length > 2" class="text-sm text-gray-500 text-center">
              + {{ order.order_items.length - 2 }} autre(s) article(s)
            </p>
          </div>
          
          <!-- Actions -->
          <div class="mt-4 pt-4 border-t flex justify-between items-center">
            <div class="flex space-x-4">
              <button 
                v-if="order.order_status === 'pending'"
                @click="handleCancelOrder(order.id)"
                class="text-sm text-red-600 hover:text-red-800"
              >
                Annuler la commande
              </button>
              
              <button 
                @click="viewOrderDetails(order.id)"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Voir les détails
              </button>
            </div>
            
            <!-- Bouton payer le solde -->
            <button 
              v-if="order.amount_remaining > 0 && order.order_status !== 'cancelled'"
              @click="handlePayRemaining(order)"
              :disabled="isPayingRemaining"
              class="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payer le solde ({{ formatPrice(order.amount_remaining, order.currency) }})
            </button>
          </div>
        </div>
      </div>
      
      <!-- Message si aucune commande -->
      <div v-if="filteredOrders.length === 0 && !isLoading" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="text-gray-500 mb-2">{{ searchQuery || statusFilter ? 'Aucune commande trouvée' : 'Vous n\'avez pas encore de commandes' }}</p>
        <p v-if="searchQuery || statusFilter" class="text-sm text-gray-400">Essayez de modifier vos filtres</p>
      </div>
    </div>
    
    <!-- Modal détails commande -->
    <div v-if="showOrderDetailsModal && selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-xl font-medium text-gray-900">{{ selectedOrder.order_number }}</h3>
            <p class="text-sm text-gray-600">{{ formatDate(selectedOrder.created_at) }}</p>
          </div>
          <button @click="closeOrderDetails" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Statuts -->
        <div class="flex flex-wrap gap-2 mb-6">
          <span 
            class="px-3 py-1 text-sm font-medium rounded-full"
            :class="getOrderStatusClass(selectedOrder.order_status)"
          >
            {{ getOrderStatusLabel(selectedOrder.order_status) }}
          </span>
          <span 
            class="px-3 py-1 text-sm font-medium rounded-full"
            :class="getPaymentStatusClass(selectedOrder.payment_status)"
          >
            {{ getPaymentStatusLabel(selectedOrder.payment_status) }}
          </span>
          <span v-if="selectedOrder.is_preorder" class="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
            Précommande
          </span>
        </div>

        <!-- Informations boutique -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 mb-2">Boutique</h4>
          <p class="text-sm text-gray-600">{{ selectedOrder.shop?.name || 'N/A' }}</p>
          <p v-if="selectedOrder.shop?.description" class="text-sm text-gray-500 mt-1">{{ selectedOrder.shop.description }}</p>
        </div>

        <!-- Informations livraison -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 mb-2">Livraison</h4>
          <p class="text-sm text-gray-600">Mode: {{ getDeliveryMethodLabel(selectedOrder.delivery_method) }}</p>
          <div v-if="selectedOrder.shipping_address" class="text-sm text-gray-600 mt-2">
            <p>{{ selectedOrder.shipping_address.address }}</p>
            <p>{{ selectedOrder.shipping_address.city }}, {{ selectedOrder.shipping_address.postal_code }}</p>
            <p>{{ selectedOrder.shipping_address.country }}</p>
          </div>
          <p v-if="selectedOrder.tracking_code" class="text-sm text-gray-900 mt-2">
            Code de suivi: <code class="bg-white px-2 py-1 rounded">{{ selectedOrder.tracking_code }}</code>
          </p>
        </div>

        <!-- Produits -->
        <div class="mb-6">
          <h4 class="font-medium text-gray-900 mb-4">Produits commandés</h4>
          <div class="space-y-4">
            <div v-for="item in selectedOrder.order_items" :key="item.id" class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-start space-x-4 mb-3">
                <img 
                  :src="getProductImage(item.product)" 
                  :alt="item.product_name" 
                  class="w-16 h-16 object-cover rounded-lg"
                >
                <div class="flex-1">
                  <h5 class="font-medium text-gray-900">{{ item.product_name }}</h5>
                  <p v-if="item.variant_name" class="text-sm text-gray-600">{{ item.variant_name }}</p>
                  <p class="text-sm text-gray-600">Quantité: {{ item.quantity }} × {{ formatPrice(item.unit_price, selectedOrder.currency) }}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900">{{ formatPrice(item.total_price, selectedOrder.currency) }}</p>
                </div>
              </div>
              
              <!-- Section notation (visible seulement si commande livrée) -->
              <div v-if="selectedOrder.order_status === 'delivered'" class="pt-3 border-t">
                <!-- Bouton pour noter -->
                <div v-if="reviewingItemId !== item.id">
                  <button 
                    @click="startReview(item.id)"
                    class="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    <span>Laisser un avis</span>
                  </button>
                </div>
                
                <!-- Formulaire de notation -->
                <div v-else class="space-y-3">
                  <!-- Étoiles -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Note :</label>
                    <div class="flex space-x-1">
                      <button 
                        v-for="star in 5" 
                        :key="star"
                        @click="reviewRating = star"
                        class="focus:outline-none transition-colors"
                      >
                        <svg class="w-8 h-8" :class="star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Commentaire -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Votre avis (optionnel) :</label>
                    <textarea 
                      v-model="reviewComment" 
                      placeholder="Partagez votre expérience avec ce produit..."
                      class="w-full px-3 py-2 text-sm rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      maxlength="1000"
                    ></textarea>
                  </div>
                  
                  <!-- Actions -->
                  <div class="flex space-x-2">
                    <button 
                      @click="submitReview(item.id)" 
                      :disabled="reviewRating === 0 || isSubmittingReview"
                      class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {{ isSubmittingReview ? 'Publication...' : 'Publier l\'avis' }}
                    </button>
                    <button 
                      @click="cancelReview" 
                      :disabled="isSubmittingReview"
                      class="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">Sous-total</span>
            <span class="text-gray-900">{{ formatPrice(selectedOrder.subtotal, selectedOrder.currency) }}</span>
          </div>
          <div v-if="selectedOrder.shipping_cost > 0" class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">Frais de livraison</span>
            <span class="text-gray-900">{{ formatPrice(selectedOrder.shipping_cost, selectedOrder.currency) }}</span>
          </div>
          <div v-if="selectedOrder.discount_amount > 0" class="flex justify-between text-sm mb-2">
            <span class="text-green-600">Réduction</span>
            <span class="text-green-600">-{{ formatPrice(selectedOrder.discount_amount, selectedOrder.currency) }}</span>
          </div>
          <div class="flex justify-between font-medium text-lg pt-2 border-t">
            <span class="text-gray-900">Total</span>
            <span class="text-gray-900">{{ formatPrice(selectedOrder.total_amount, selectedOrder.currency) }}</span>
          </div>
          <!-- Infos précommande -->
          <div v-if="selectedOrder.is_preorder" class="mt-3 pt-3 border-t">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600">Montant payé</span>
              <span class="text-green-600 font-medium">{{ formatPrice(selectedOrder.amount_paid || 0, selectedOrder.currency) }}</span>
            </div>
            <div v-if="selectedOrder.amount_remaining > 0" class="flex justify-between text-sm">
              <span class="text-gray-600">Reste à payer</span>
              <span class="text-orange-600 font-medium">{{ formatPrice(selectedOrder.amount_remaining, selectedOrder.currency) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions modal -->
        <div class="mt-6 flex justify-end space-x-4">
          <button 
            v-if="selectedOrder.amount_remaining > 0 && selectedOrder.order_status !== 'cancelled'"
            @click="handlePayRemaining(selectedOrder)"
            :disabled="isPayingRemaining"
            class="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            {{ isPayingRemaining ? 'Traitement...' : `Payer le solde (${formatPrice(selectedOrder.amount_remaining, selectedOrder.currency)})` }}
          </button>
          <button 
            v-if="selectedOrder.order_status === 'pending'"
            @click="handleCancelOrder(selectedOrder.id)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Annuler la commande
          </button>
          <button 
            @click="closeOrderDetails"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/composables/useOrders'

definePageMeta({
  layout: 'dashboard-client'
})

const config = useRuntimeConfig()
const { orders, isLoading, error, fetchMyOrders, fetchOrderDetails, cancelOrder: cancelOrderAPI, completePayment } = useOrders()
const { createReview, updateReview, deleteReview } = useReviews()

// État réactif
const searchQuery = ref('')
const statusFilter = ref('')

// Modal détails commande
const showOrderDetailsModal = ref(false)
const selectedOrder = ref<Order | null>(null)

// État notation
const reviewingItemId = ref<number | null>(null)
const reviewRating = ref(0)
const reviewComment = ref('')
const isSubmittingReview = ref(false)
const isPayingRemaining = ref(false)

// Charger les commandes au montage
onMounted(async () => {
  await fetchMyOrders()
})

// Commandes filtrées
const filteredOrders = computed(() => {
  if (!orders.value) return []
  
  let filtered = [...orders.value]
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      order.order_number.toLowerCase().includes(query) ||
      order.customer_name.toLowerCase().includes(query) ||
      order.customer_email.toLowerCase().includes(query)
    )
  }
  
  // Filtre par statut
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.order_status === statusFilter.value)
  }
  
  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

// Fonctions utilitaires
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatPrice = (price: number, currency: string = 'XOF') => {
  return `${price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
}

const getProductImage = (product: any) => {
  if (!product) return 'https://placehold.co/400x400?text=Produit'
  
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
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Paiement en attente',
    partially_paid: 'Partiellement payé',
    paid: 'Payé',
    failed: 'Échec paiement',
    refunded: 'Remboursé'
  }
  return labels[status] || status
}

const getPaymentStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-800',
    partially_paid: 'bg-amber-100 text-amber-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getDeliveryMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    pickup: 'Retrait en boutique',
    delivery: 'Livraison à domicile',
    partner: 'Livraison partenaire'
  }
  return labels[method] || method
}

// Actions
const viewOrderDetails = async (orderId: number) => {
  const order = await fetchOrderDetails(orderId)
  if (order) {
    selectedOrder.value = order
    showOrderDetailsModal.value = true
  }
}

const closeOrderDetails = () => {
  showOrderDetailsModal.value = false
  selectedOrder.value = null
}

const handleCancelOrder = async (orderId: number) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
    const success = await cancelOrderAPI(orderId)
    if (success) {
      alert('Commande annulée avec succès')
      closeOrderDetails()
    } else {
      alert('Erreur lors de l\'annulation de la commande')
    }
  }
}

// Payer le solde restant
const handlePayRemaining = async (order: Order) => {
  if (!order.amount_remaining || order.amount_remaining <= 0) return
  
  isPayingRemaining.value = true
  
  try {
    const result = await completePayment(order.id)
    if (result && result.payment_url) {
      // Rediriger vers la page de paiement
      window.location.href = result.payment_url
    } else if (result) {
      alert('Paiement initié avec succès')
      await fetchMyOrders()
      closeOrderDetails()
    } else {
      alert('Erreur lors de l\'initialisation du paiement')
    }
  } catch (err) {
    console.error('Erreur paiement:', err)
    alert('Erreur lors du paiement')
  } finally {
    isPayingRemaining.value = false
  }
}

// Vérifier si un produit est digital
const isDigitalProduct = (item: any) => {
  return item.product && item.product.digital_file
}

// Télécharger un fichier digital
const downloadDigitalFile = async (orderId: number, orderItemId: number) => {
  try {
    const config = useRuntimeConfig()
    const token = process.client ? localStorage.getItem('auth_token') : null
    
    if (!token) {
      alert('Vous devez être connecté pour télécharger le fichier')
      return
    }
    
    // Créer une URL de téléchargement
    const url = `${config.public.apiBase}/client/orders/${orderId}/items/${orderItemId}/download`
    
    // Ouvrir dans un nouvel onglet pour déclencher le téléchargement
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', '')
    link.target = '_blank'
    
    // Ajouter le token dans les headers via fetch puis download
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/octet-stream'
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      alert(errorData.message || 'Erreur lors du téléchargement')
      return
    }
    
    // Récupérer le nom du fichier depuis les headers
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = 'fichier_telechargement'
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }
    
    // Créer un blob et déclencher le téléchargement
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    
    const downloadLink = document.createElement('a')
    downloadLink.href = blobUrl
    downloadLink.download = filename
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    
    // Libérer l'URL du blob
    window.URL.revokeObjectURL(blobUrl)
    
  } catch (err: any) {
    console.error('Erreur téléchargement:', err)
    alert('Erreur lors du téléchargement du fichier')
  }
}

// Fonctions de notation
const startReview = (itemId: number) => {
  reviewingItemId.value = itemId
  reviewRating.value = 0
  reviewComment.value = ''
}

const cancelReview = () => {
  reviewingItemId.value = null
  reviewRating.value = 0
  reviewComment.value = ''
}

const submitReview = async (itemId: number) => {
  if (reviewRating.value === 0) return
  
  isSubmittingReview.value = true
  
  try {
    const review = await createReview({
      order_item_id: itemId,
      rating: reviewRating.value,
      comment: reviewComment.value || undefined
    })
    
    if (review) {
      alert('⭐ Merci ! Votre avis a été publié avec succès')
      cancelReview()
      // Recharger les détails de la commande pour voir l'avis
      if (selectedOrder.value) {
        await viewOrderDetails(selectedOrder.value.id)
      }
    } else {
      alert('❌ Erreur lors de la publication de l\'avis')
    }
  } catch (err) {
    alert('❌ Erreur lors de la publication de l\'avis')
  } finally {
    isSubmittingReview.value = false
  }
}
</script>
