<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mes Achats</h1>
        <p class="mt-2 text-sm text-gray-600">
          Retrouvez l'historique de toutes vos commandes
        </p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <svg class="animate-spin h-12 w-12 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-gray-600">Chargement de vos commandes...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="!orders || orders.length === 0" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        <h2 class="mt-4 text-xl font-medium text-gray-900">Aucune commande</h2>
        <p class="mt-2 text-gray-600">Vous n'avez pas encore passé de commande.</p>
        <NuxtLink to="/boutique" class="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
          Découvrir les boutiques
        </NuxtLink>
      </div>

      <!-- Orders list -->
      <div v-else class="space-y-4">
        <div v-for="order in orders" :key="order.id" class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Commande #{{ order.order_number }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">{{ formatPrice(order.total_amount, order.currency) }}</p>
                <span :class="getStatusClass(order.order_status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ getStatusLabel(order.order_status) }}
                </span>
              </div>
            </div>

            <div class="mt-4 border-t border-gray-200 pt-4">
              <p class="text-sm text-gray-600">
                <span class="font-medium">Boutique :</span> {{ order.shop?.name || 'N/A' }}
              </p>
              <p class="text-sm text-gray-600 mt-1">
                <span class="font-medium">Paiement :</span> 
                <span :class="getPaymentStatusClass(order.payment_status)">
                  {{ getPaymentStatusLabel(order.payment_status) }}
                </span>
              </p>
            </div>

            <div class="mt-4 flex gap-2">
              <NuxtLink 
                :to="`/mes-achats/${order.id}`"
                class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50"
              >
                Voir les détails
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user } = useAuth()
const config = useRuntimeConfig()

const orders = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Rediriger si non connecté
onMounted(async () => {
  if (!user.value) {
    router.push('/connexion')
    return
  }
  
  await fetchOrders()
})

const fetchOrders = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const token = process.client ? localStorage.getItem('auth_token') : null
    
    if (!token) {
      throw new Error('Non authentifié')
    }
    
    const response = await fetch(`${config.public.apiBase}/my-orders`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors du chargement des commandes')
    }
    
    orders.value = data.orders || []
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPrice = (amount: number, currency: string) => {
  return `${amount.toLocaleString('fr-FR')} ${currency}`
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'En attente',
    'confirmed': 'Confirmée',
    'processing': 'En traitement',
    'shipped': 'Expédiée',
    'delivered': 'Livrée',
    'cancelled': 'Annulée'
  }
  return labels[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'processing': 'bg-indigo-100 text-indigo-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'En attente',
    'paid': 'Payé',
    'failed': 'Échoué',
    'refunded': 'Remboursé'
  }
  return labels[status] || status
}

const getPaymentStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'text-yellow-600',
    'paid': 'text-green-600',
    'failed': 'text-red-600',
    'refunded': 'text-blue-600'
  }
  return classes[status] || 'text-gray-600'
}
</script>
