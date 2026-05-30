<template>
  <div>
    <!-- Avertissement si module non disponible -->
    <div v-if="!hasDeliveryAccess" class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
      <p class="text-sm text-amber-800">Le module 'Livraisons' n'est pas disponible avec votre plan actuel.</p>
    </div>
    
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Livraisons</h1>
      <p class="text-gray-600">Gérez les zones de livraison et les frais</p>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="bg-white rounded-lg p-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement des zones de livraison...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="bg-white rounded-lg p-12 text-center">
      <div class="text-red-500 mb-4">
        <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="loadZones" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary">
        Réessayer
      </button>
    </div>

    <!-- Zones de livraison -->
    <div v-else class="bg-white p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-900">Zones de livraison</h2>
        <button 
          @click="openAddModal" 
          :disabled="!hasDeliveryAccess"
          :class="!hasDeliveryAccess ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-primary hover:bg-secondary'"
          class="px-4 py-2 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          Ajouter une zone
        </button>
      </div>
      
      <!-- Message si aucune zone -->
      <div v-if="deliveryZones.length === 0" class="text-center py-12">
        <svg class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
        </svg>
        <p class="text-gray-600 mb-4">Aucune zone de livraison configurée</p>
        <button 
          @click="openAddModal" 
          :disabled="!hasDeliveryAccess"
          :class="!hasDeliveryAccess ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-primary hover:bg-secondary'"
          class="px-4 py-2 text-white rounded-md"
        >
          Ajouter la première zone
        </button>
      </div>
      
      <!-- Tableau des zones -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville/Région</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frais de livraison</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Délai estimé</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="zone in deliveryZones" :key="zone.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ zone.country }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ zone.city }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatPrice(zone.shipping_cost) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ zone.estimated_days || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="zone.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ zone.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openEditModal(zone)" class="text-primary hover:text-secondary mr-3">Modifier</button>
                <button @click="confirmDelete(zone)" class="text-red-600 hover:text-red-900">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal pour ajouter une zone de livraison -->
    <Teleport to="body">
      <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
        <div class="modal-container rounded-md">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Ajouter une zone de livraison</h2>
              <button @click="closeAddModal" class="px-3 py-1 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                Fermer
              </button>
            </div>
            
            <div v-if="formError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-600">{{ formError }}</p>
            </div>
            
            <form @submit.prevent="handleAddZone" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="country" class="block text-sm font-medium text-gray-700">Pays *</label>
                  <input v-model="formData.country" type="text" id="country" required class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" placeholder="Benin, France, Belgique, Atlanta, etc.">
                </div>
                
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700">Ville/Région *</label>
                  <input v-model="formData.city" type="text" id="city" required class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" placeholder="Cotonou, Paris, Province, etc.">
                </div>
                
                <div>
                  <label for="shipping_cost" class="block text-sm font-medium text-gray-700">Frais de livraison (€) *</label>
                  <input v-model.number="formData.shipping_cost" type="number" step="0.01" min="0" id="shipping_cost" required class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="estimated_days" class="block text-sm font-medium text-gray-700">Délai estimé</label>
                  <input v-model="formData.estimated_days" type="text" id="estimated_days" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" placeholder="24-48h, 2-3 jours, etc.">
                </div>
              </div>
              
              <div class="flex items-center">
                <input v-model="formData.is_active" type="checkbox" id="is_active" class="h-4 w-4 text-primary focus:ring-secondary border-gray-300 rounded">
                <label for="is_active" class="ml-2 block text-sm text-gray-900">
                  Zone active
                </label>
              </div>
              
              <div class="flex justify-end">
                <button type="button" @click="closeAddModal" class="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                  Annuler
                </button>
                <button type="submit" :disabled="isSubmitting" class="ml-3 px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isSubmitting ? 'Ajout...' : 'Ajouter la zone' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Modal pour modifier une zone de livraison -->
    <Teleport to="body">
      <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-container rounded-md">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Modifier la zone de livraison</h2>
              <button @click="closeEditModal" class="px-3 py-1 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                Fermer
              </button>
            </div>
            
            <div v-if="formError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-600">{{ formError }}</p>
            </div>
            
            <form @submit.prevent="handleUpdateZone" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="edit-country" class="block text-sm font-medium text-gray-700">Pays *</label>
                  <input v-model="formData.country" type="text" id="edit-country" required class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="edit-city" class="block text-sm font-medium text-gray-700">Ville/Région *</label>
                  <input v-model="formData.city" type="text" id="edit-city" required class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="edit-shipping_cost" class="block text-sm font-medium text-gray-700">Frais de livraison (€) *</label>
                  <input v-model.number="formData.shipping_cost" type="number" step="0.01" min="0" id="edit-shipping_cost" required class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="edit-estimated_days" class="block text-sm font-medium text-gray-700">Délai estimé</label>
                  <input v-model="formData.estimated_days" type="text" id="edit-estimated_days" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" placeholder="24-48h, 2-3 jours, etc.">
                </div>
              </div>
              
              <div class="flex items-center">
                <input v-model="formData.is_active" type="checkbox" id="edit-is_active" class="h-4 w-4 text-primary focus:ring-secondary border-gray-300 rounded">
                <label for="edit-is_active" class="ml-2 block text-sm text-gray-900">
                  Zone active
                </label>
              </div>
              
              <div class="flex justify-end">
                <button type="button" @click="closeEditModal" class="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                  Annuler
                </button>
                <button type="submit" :disabled="isSubmitting" class="ml-3 px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isSubmitting ? 'Mise à jour...' : 'Enregistrer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { DeliveryZone, CreateDeliveryZoneData } from '~/composables/useDeliveryZones'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const shopSlug = route.params.slug as string

const { fetchShops, shops, currentShop } = useShops()
const { deliveryZones, isLoading, error, fetchDeliveryZones, createDeliveryZone, updateDeliveryZone, deleteDeliveryZone } = useDeliveryZones()

// Vérification de l'abonnement
const { hasModule } = useSubscription()
const hasDeliveryAccess = computed(() => hasModule('delivery'))

// État
const showAddModal = ref(false)
const showEditModal = ref(false)
const isSubmitting = ref(false)
const formError = ref('')
const currentZone = ref<DeliveryZone | null>(null)

const formData = ref<CreateDeliveryZoneData>({
  country: '',
  city: '',
  shipping_cost: 0,
  estimated_days: '',
  is_active: true
})

// Utiliser currentShop du composable
const currentShopId = computed(() => currentShop.value?.id)

// Charger les zones
const loadZones = async () => {
  if (!currentShopId.value) {
    await fetchShops()
    if (!currentShopId.value) return
  }
  
  await fetchDeliveryZones(currentShopId.value)
}

// Ouvrir modal ajout
const openAddModal = () => {
  // Bloquer si le module n'est pas disponible
  if (!hasDeliveryAccess.value) return
  
  formData.value = {
    country: '',
    city: '',
    shipping_cost: 0,
    estimated_days: '',
    is_active: true
  }
  formError.value = ''
  showAddModal.value = true
}

// Fermer modal ajout
const closeAddModal = () => {
  showAddModal.value = false
  formError.value = ''
}

// Ouvrir modal édition
const openEditModal = (zone: DeliveryZone) => {
  currentZone.value = zone
  formData.value = {
    country: zone.country,
    city: zone.city,
    shipping_cost: zone.shipping_cost,
    estimated_days: zone.estimated_days || '',
    is_active: zone.is_active
  }
  formError.value = ''
  showEditModal.value = true
}

// Fermer modal édition
const closeEditModal = () => {
  showEditModal.value = false
  currentZone.value = null
  formError.value = ''
}

// Ajouter une zone
const handleAddZone = async () => {
  if (!currentShopId.value) return
  
  isSubmitting.value = true
  formError.value = ''
  
  const zone = await createDeliveryZone(currentShopId.value, formData.value)
  
  if (zone) {
    closeAddModal()
  } else if (error.value) {
    formError.value = error.value
  }
  
  isSubmitting.value = false
}

// Mettre à jour une zone
const handleUpdateZone = async () => {
  if (!currentShopId.value || !currentZone.value) return
  
  isSubmitting.value = true
  formError.value = ''
  
  const success = await updateDeliveryZone(currentShopId.value, currentZone.value.id, formData.value)
  
  if (success) {
    closeEditModal()
  } else if (error.value) {
    formError.value = error.value
  }
  
  isSubmitting.value = false
}

// Confirmer suppression
const confirmDelete = async (zone: DeliveryZone) => {
  if (!currentShopId.value) return
  
  if (confirm(`Êtes-vous sûr de vouloir supprimer la zone "${zone.city}, ${zone.country}" ?`)) {
    const success = await deleteDeliveryZone(currentShopId.value, zone.id)
    
    if (!success && error.value) {
      alert(error.value)
    }
  }
}

// Formater le prix avec la devise de la boutique
const formatPrice = (price: number) => {
  const currency = currentShop.value?.currency || 'XOF'
  if (currency === 'XOF') {
    return `${price.toLocaleString('fr-FR')} FCFA`
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(price)
}

// Chargement initial
onMounted(async () => {
  await fetchShops()
  await loadZones()
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  background-color: white;
  max-width: 56rem;
  width: 100%;
  z-index: 1000;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
