<template>
  <div>
    <h1 class="text-xl font-bold text-gray-900 mb-4">Mes livraisons</h1>

    <!-- Tabs -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
        :class="activeTab === tab.key
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'"
      >
        {{ tab.label }}
        <span
          v-if="tab.count > 0"
          class="ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold"
          :class="activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Available deliveries -->
    <div v-else-if="activeTab === 'available'">
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm text-gray-500">Actualisation automatique toutes les 30s</p>
        <button @click="loadDeliveries('available')" class="text-sm text-primary font-medium hover:underline flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/>
          </svg>
          Actualiser
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="availableDeliveries.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
        </svg>
        <p class="text-gray-500 font-medium">Aucune livraison disponible</p>
        <p class="text-gray-400 text-sm mt-1">Les nouvelles livraisons apparaîtront ici</p>
      </div>

      <!-- Delivery cards -->
      <div v-else class="space-y-3">
        <div
          v-for="delivery in availableDeliveries"
          :key="delivery.id"
          class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <span class="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                #{{ delivery.order_reference }}
              </span>
            </div>
            <div v-if="delivery.amount" class="text-sm font-bold text-gray-900">
              {{ formatPrice(delivery.amount) }}
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex items-start gap-2">
              <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div>
                <p class="text-xs text-gray-400">Récupération</p>
                <p class="text-sm text-gray-700">{{ delivery.pickup_address }}</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <div class="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <div>
                <p class="text-xs text-gray-400">Livraison</p>
                <p class="text-sm text-gray-700">{{ delivery.delivery_address }}</p>
              </div>
            </div>
          </div>

          <div v-if="delivery.estimated_distance || delivery.estimated_time" class="flex gap-4 mb-4 text-xs text-gray-500">
            <span v-if="delivery.estimated_distance" class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z"/>
              </svg>
              {{ delivery.estimated_distance }}
            </span>
            <span v-if="delivery.estimated_time" class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ delivery.estimated_time }}
            </span>
          </div>

          <div class="flex gap-2">
            <button
              @click="handleDecline(delivery.id)"
              :disabled="actionLoading === delivery.id"
              class="flex-1 py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-h-[48px] disabled:opacity-50"
            >
              Refuser
            </button>
            <button
              @click="handleAccept(delivery.id)"
              :disabled="actionLoading === delivery.id"
              class="flex-1 py-3 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg v-if="actionLoading === delivery.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active deliveries -->
    <div v-else-if="activeTab === 'active'">
      <div v-if="activeDeliveries.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-gray-500 font-medium">Aucune livraison en cours</p>
        <p class="text-gray-400 text-sm mt-1">Acceptez une livraison pour commencer</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="delivery in activeDeliveries"
          :key="delivery.id"
          class="bg-white border border-blue-200 rounded-xl p-4 shadow-sm"
        >
          <div class="flex items-start justify-between mb-3">
            <span class="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              #{{ delivery.order_reference }}
            </span>
            <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="getStatusBadgeClass(delivery.status)">
              {{ getStatusLabel(delivery.status) }}
            </span>
          </div>

          <!-- Status progression -->
          <div class="flex items-center gap-1 mb-4">
            <div v-for="(step, idx) in statusSteps" :key="step.key" class="flex items-center" :class="idx < statusSteps.length - 1 ? 'flex-1' : ''">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                :class="getStepIndex(delivery.status) >= idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'"
              >
                {{ idx + 1 }}
              </div>
              <div
                v-if="idx < statusSteps.length - 1"
                class="flex-1 h-1 mx-1 rounded"
                :class="getStepIndex(delivery.status) > idx ? 'bg-blue-600' : 'bg-gray-200'"
              ></div>
            </div>
          </div>
          <div class="flex justify-between mb-4 text-[10px] text-gray-500">
            <span v-for="step in statusSteps" :key="step.key">{{ step.label }}</span>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex items-start gap-2">
              <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <p class="text-sm text-gray-700">{{ delivery.pickup_address }}</p>
            </div>
            <div class="flex items-start gap-2">
              <div class="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <p class="text-sm text-gray-700">{{ delivery.delivery_address }}</p>
            </div>
          </div>

          <div v-if="delivery.customer_name || delivery.customer_phone" class="bg-gray-50 rounded-lg p-3 mb-4">
            <p class="text-xs text-gray-400 mb-1">Client</p>
            <p v-if="delivery.customer_name" class="text-sm text-gray-700 font-medium">{{ delivery.customer_name }}</p>
            <p v-if="delivery.customer_phone" class="text-sm text-gray-500">{{ delivery.customer_phone }}</p>
          </div>

          <!-- Action buttons based on status -->
          <button
            v-if="delivery.status === 'assigned'"
            @click="handleStatusUpdate(delivery.id, 'picked_up')"
            :disabled="actionLoading === delivery.id"
            class="w-full py-3 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="actionLoading === delivery.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            Commande récupérée
          </button>
          <button
            v-else-if="delivery.status === 'picked_up'"
            @click="handleStatusUpdate(delivery.id, 'in_transit')"
            :disabled="actionLoading === delivery.id"
            class="w-full py-3 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="actionLoading === delivery.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            En route vers le client
          </button>
          <button
            v-else-if="delivery.status === 'in_transit'"
            @click="openSignatureModal(delivery.id)"
            :disabled="actionLoading === delivery.id"
            class="w-full py-3 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="actionLoading === delivery.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            Livraison effectuée
          </button>
        </div>
      </div>
    </div>

    <!-- History -->
    <div v-else-if="activeTab === 'completed'">
      <div v-if="completedDeliveries.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-gray-500 font-medium">Aucun historique</p>
        <p class="text-gray-400 text-sm mt-1">Vos livraisons terminées apparaîtront ici</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="delivery in completedDeliveries"
          :key="delivery.id"
          class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
        >
          <div class="flex items-start justify-between mb-2">
            <span class="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              #{{ delivery.order_reference }}
            </span>
            <span
              class="text-xs font-medium px-2 py-0.5 rounded-full"
              :class="delivery.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ delivery.status === 'delivered' ? 'Livré' : 'Échoué' }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-1">{{ delivery.delivery_address }}</p>
          <p class="text-xs text-gray-400">{{ formatDate(delivery.delivered_at || delivery.updated_at || delivery.created_at) }}</p>
          <div v-if="delivery.amount" class="mt-2 text-sm font-semibold text-gray-700">{{ formatPrice(delivery.amount) }}</div>
        </div>
      </div>
    </div>

    <!-- Signature Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSignatureModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div class="absolute inset-0 bg-black/50" @click="closeSignatureModal"></div>
          <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">Confirmation de livraison</h2>
              <button @click="closeSignatureModal" class="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="p-5">
              <p class="text-sm text-gray-600 mb-4">Demandez au client de signer ci-dessous pour confirmer la réception.</p>
              <SignatureCanvas @signed="handleSignatureConfirm" />
              <div class="mt-4 pt-4 border-t border-gray-100">
                <button
                  @click="handleDeliverWithoutSignature"
                  :disabled="isConfirmingDelivery"
                  class="w-full py-2.5 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px]"
                >
                  Confirmer sans signature
                </button>
              </div>
              <!-- Loading overlay -->
              <div v-if="isConfirmingDelivery" class="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                <div class="flex flex-col items-center gap-2">
                  <svg class="animate-spin h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p class="text-sm text-gray-600 font-medium">Confirmation en cours...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, inject } from 'vue'
import type { Delivery } from '~/composables/useCourierDashboard'

definePageMeta({ layout: 'dashboard-courier' })

const { getDeliveries, acceptDelivery, declineDelivery, updateDeliveryStatus, submitDeliverySignature } = useCourierDashboard()
const showToast = inject<(msg: string, type: 'success' | 'error') => void>('showToast', () => {})

const activeTab = ref<'available' | 'active' | 'completed'>('available')
const isLoading = ref(false)
const actionLoading = ref<number | null>(null)
const showSignatureModal = ref(false)
const signatureDeliveryId = ref<number | null>(null)
const isConfirmingDelivery = ref(false)

const availableDeliveries = ref<Delivery[]>([])
const activeDeliveries = ref<Delivery[]>([])
const completedDeliveries = ref<Delivery[]>([])

const tabs = computed(() => [
  { key: 'available' as const, label: 'Disponibles', count: availableDeliveries.value.length },
  { key: 'active' as const, label: 'En cours', count: activeDeliveries.value.length },
  { key: 'completed' as const, label: 'Historique', count: completedDeliveries.value.length }
])

const statusSteps = [
  { key: 'assigned', label: 'Assigné' },
  { key: 'picked_up', label: 'Récupéré' },
  { key: 'in_transit', label: 'En route' },
  { key: 'delivered', label: 'Livré' }
]

const getStepIndex = (status: string) => {
  const idx = statusSteps.findIndex(s => s.key === status)
  return idx >= 0 ? idx : 0
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'assigned': 'Assigné',
    'picked_up': 'Récupéré',
    'in_transit': 'En route',
    'delivered': 'Livré'
  }
  return map[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    'assigned': 'bg-yellow-100 text-yellow-700',
    'picked_up': 'bg-blue-100 text-blue-700',
    'in_transit': 'bg-indigo-100 text-indigo-700',
    'delivered': 'bg-green-100 text-green-700'
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const loadDeliveries = async (status: 'available' | 'active' | 'completed') => {
  try {
    const response = await getDeliveries(status)
    if (response.success) {
      const data = response.data || response.deliveries || []
      if (status === 'available') availableDeliveries.value = data
      else if (status === 'active') activeDeliveries.value = data
      else completedDeliveries.value = data
    }
  } catch (err: any) {
    console.error(`Erreur chargement ${status}:`, err)
  }
}

const loadAll = async () => {
  isLoading.value = true
  await Promise.all([
    loadDeliveries('available'),
    loadDeliveries('active'),
    loadDeliveries('completed')
  ])
  isLoading.value = false
}

const handleAccept = async (id: number) => {
  actionLoading.value = id
  try {
    const response = await acceptDelivery(id)
    if (response.success) {
      showToast('Livraison acceptée !', 'success')
      await loadAll()
    }
  } catch (err: any) {
    showToast(err.message || 'Erreur lors de l\'acceptation', 'error')
  } finally {
    actionLoading.value = null
  }
}

const handleDecline = async (id: number) => {
  actionLoading.value = id
  try {
    const response = await declineDelivery(id)
    if (response.success) {
      showToast('Livraison refusée', 'success')
      await loadDeliveries('available')
    }
  } catch (err: any) {
    showToast(err.message || 'Erreur lors du refus', 'error')
  } finally {
    actionLoading.value = null
  }
}

const handleStatusUpdate = async (id: number, status: 'picked_up' | 'in_transit' | 'delivered') => {
  actionLoading.value = id
  try {
    const response = await updateDeliveryStatus(id, status)
    if (response.success) {
      const labels: Record<string, string> = {
        'picked_up': 'Commande marquée comme récupérée',
        'in_transit': 'En route vers le client',
        'delivered': 'Livraison effectuée !'
      }
      showToast(labels[status], 'success')
      await loadAll()
    }
  } catch (err: any) {
    showToast(err.message || 'Erreur lors de la mise à jour', 'error')
  } finally {
    actionLoading.value = null
  }
}

// Signature flow
const openSignatureModal = (deliveryId: number) => {
  signatureDeliveryId.value = deliveryId
  showSignatureModal.value = true
}

const closeSignatureModal = () => {
  showSignatureModal.value = false
  signatureDeliveryId.value = null
  isConfirmingDelivery.value = false
}

const handleSignatureConfirm = async (signatureDataUrl: string) => {
  if (!signatureDeliveryId.value) return
  isConfirmingDelivery.value = true
  const deliveryId = signatureDeliveryId.value
  try {
    // Submit both: status update + signature
    await Promise.all([
      updateDeliveryStatus(deliveryId, 'delivered'),
      submitDeliverySignature(deliveryId, signatureDataUrl)
    ])
    showToast('Livraison confirmée avec signature !', 'success')
    closeSignatureModal()
    await loadAll()
  } catch (err: any) {
    showToast(err.message || 'Erreur lors de la confirmation', 'error')
    isConfirmingDelivery.value = false
  }
}

const handleDeliverWithoutSignature = async () => {
  if (!signatureDeliveryId.value) return
  isConfirmingDelivery.value = true
  const deliveryId = signatureDeliveryId.value
  try {
    await updateDeliveryStatus(deliveryId, 'delivered')
    showToast('Livraison confirmée (sans signature)', 'success')
    closeSignatureModal()
    await loadAll()
  } catch (err: any) {
    showToast(err.message || 'Erreur lors de la confirmation', 'error')
    isConfirmingDelivery.value = false
  }
}

// Auto-refresh every 30 seconds for available
let pollingInterval: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  await loadAll()
  pollingInterval = setInterval(() => {
    loadDeliveries('available')
    loadDeliveries('active')
  }, 30000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<style scoped>
.modal-enter-active { transition: all 0.3s ease-out; }
.modal-leave-active { transition: all 0.2s ease-in; }
.modal-enter-from { opacity: 0; }
.modal-leave-to { opacity: 0; }
</style>
