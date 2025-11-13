<template>
  <div>
    <!-- Messages de notification -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
      <p class="text-sm text-green-800">{{ successMessage }}</p>
    </div>
    
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-800">{{ error }}</p>
    </div>

    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Codes promo</h1>
        <p class="text-gray-600">Gérez vos codes de réduction</p>
      </div>
      <button @click="openCreateModal" class="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary rounded-md focus:ring-offset-2">
        Créer un code promo
      </button>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading && !promoCodes.length" class="bg-white p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-600">Chargement des codes promo...</p>
    </div>

    <!-- Liste vide -->
    <div v-else-if="!isLoading && !promoCodes.length" class="bg-white p-12 text-center">
      <p class="text-gray-600">Aucun code promo pour le moment.</p>
      <button @click="openCreateModal" class="mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-secondary">
        Créer votre premier code promo
      </button>
    </div>

    <!-- Liste des codes promo -->
    <div v-else class="bg-white mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validité</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisations</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="promoCode in promoCodes" :key="promoCode.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ promoCode.code }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatType(promoCode.type) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatValue(promoCode) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDates(promoCode) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatUsage(promoCode) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded"
                  :class="getStatusClass(promoCode.status)"
                >
                  {{ formatStatus(promoCode.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openEditModal(promoCode)" class="text-primary hover:text-secondary mr-3">Modifier</button>
                <button @click="confirmDelete(promoCode)" class="text-red-600 hover:text-red-900">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal pour créer/modifier un code promo -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container rounded-md">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">{{ isEditMode ? 'Modifier le code promo' : 'Créer un nouveau code promo' }}</h2>
              <button @click="closeModal" class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Fermer
              </button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="code" class="block text-sm font-medium text-gray-700">Code promo *</label>
                  <input 
                    type="text" 
                    v-model="formData.code" 
                    id="code" 
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 uppercase"
                    placeholder="ex: PROMO10"
                  >
                </div>
                
                <div>
                  <label for="type" class="block text-sm font-medium text-gray-700">Type de réduction *</label>
                  <select v-model="formData.type" id="type" required class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="percentage">Pourcentage</option>
                    <option value="fixed_amount">Montant fixe</option>
                  </select>
                </div>
                
                <div>
                  <label for="value" class="block text-sm font-medium text-gray-700">
                    {{ formData.type === 'percentage' ? 'Pourcentage (%)' : 'Montant' }} *
                  </label>
                  <input 
                    type="number" 
                    v-model.number="formData.value" 
                    id="value" 
                    required
                    :min="0"
                    :max="formData.type === 'percentage' ? 100 : undefined"
                    step="0.01"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                </div>
                
                <div>
                  <label for="minimum_amount" class="block text-sm font-medium text-gray-700">Montant minimum (optionnel)</label>
                  <input 
                    type="number" 
                    v-model.number="formData.minimum_amount" 
                    id="minimum_amount"
                    min="0"
                    step="0.01"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="0"
                  >
                </div>
                
                <div>
                  <label for="usage_limit" class="block text-sm font-medium text-gray-700">Limite d'utilisation (optionnel)</label>
                  <input 
                    type="number" 
                    v-model.number="formData.usage_limit" 
                    id="usage_limit"
                    min="1"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Illimité si vide"
                  >
                </div>
                
                <div>
                  <label for="start_date" class="block text-sm font-medium text-gray-700">Date de début *</label>
                  <input 
                    type="date" 
                    v-model="formData.start_date" 
                    id="start_date" 
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                </div>
                
                <div>
                  <label for="end_date" class="block text-sm font-medium text-gray-700">Date de fin (optionnel)</label>
                  <input 
                    type="date" 
                    v-model="formData.end_date" 
                    id="end_date"
                    :min="formData.start_date"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                </div>

                <div v-if="isEditMode">
                  <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
                  <select v-model="formData.status" id="status" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="expired">Expiré</option>
                  </select>
                </div>
              </div>
              
              <div class="flex justify-end gap-3">
                <button type="button" @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Annuler
                </button>
                <button 
                  type="submit" 
                  :disabled="isLoading"
                  class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-secondary disabled:opacity-50"
                >
                  {{ isLoading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Créer') }}
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
definePageMeta({
  layout: 'dashboard'
})

import { ref, reactive, onMounted } from 'vue'
import type { PromoCode } from '~/composables/usePromoCodes'

const route = useRoute()
const shopSlug = route.params.slug as string

// Récupérer la boutique actuelle via le composable useShops
const { currentShop, shops, fetchShops, setCurrentShop } = useShops()
const shopId = computed(() => currentShop.value?.id)

const { promoCodes, isLoading, error, fetchPromoCodes, createPromoCode, updatePromoCode, deletePromoCode } = usePromoCodes()

const showModal = ref(false)
const isEditMode = ref(false)
const currentPromoCode = ref<PromoCode | null>(null)
const successMessage = ref('')

const formData = reactive({
  code: '',
  type: 'percentage' as 'percentage' | 'fixed_amount',
  value: 0,
  minimum_amount: null as number | null,
  usage_limit: null as number | null,
  start_date: '',
  end_date: '',
  status: 'active' as 'active' | 'inactive' | 'expired'
})

// Charger les codes promo au montage
onMounted(async () => {
  // Charger les boutiques si elles ne sont pas déjà chargées
  if (shops.value.length === 0) {
    await fetchShops()
  }
  
  // Trouver la boutique correspondant au slug
  const shop = shops.value.find(s => s.subdomain === shopSlug || s.slug === shopSlug)
  if (shop) {
    setCurrentShop(shop)
    console.log('Boutique trouvée:', shop)
  } else {
    console.error('Boutique non trouvée pour le slug:', shopSlug)
  }
  
  // Charger les codes promo
  if (shopId.value) {
    await fetchPromoCodes(shopId.value)
  }
})

// Formatage des données
const formatType = (type: string) => {
  return type === 'percentage' ? 'Pourcentage' : 'Montant fixe'
}

const formatValue = (promo: PromoCode) => {
  if (promo.type === 'percentage') {
    return `${promo.value}%`
  }
  return `${promo.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} XOF`
}

const formatDates = (promo: PromoCode) => {
  const start = new Date(promo.start_date).toLocaleDateString('fr-FR')
  const end = promo.end_date ? new Date(promo.end_date).toLocaleDateString('fr-FR') : '∞'
  return `${start} - ${end}`
}

const formatUsage = (promo: PromoCode) => {
  const used = promo.used_count
  const limit = promo.usage_limit || '∞'
  return `${used}/${limit}`
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Actif',
    inactive: 'Inactif',
    expired: 'Expiré'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    expired: 'bg-yellow-100 text-yellow-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// Gestion des modals
const openCreateModal = () => {
  isEditMode.value = false
  currentPromoCode.value = null
  resetForm()
  showModal.value = true
}

const openEditModal = (promo: PromoCode) => {
  isEditMode.value = true
  currentPromoCode.value = promo
  
  // Remplir le formulaire
  formData.code = promo.code
  formData.type = promo.type
  formData.value = promo.value
  formData.minimum_amount = promo.minimum_amount
  formData.usage_limit = promo.usage_limit
  formData.start_date = new Date(promo.start_date).toISOString().split('T')[0]
  formData.end_date = promo.end_date ? new Date(promo.end_date).toISOString().split('T')[0] : ''
  formData.status = promo.status
  
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.code = ''
  formData.type = 'percentage'
  formData.value = 0
  formData.minimum_amount = null
  formData.usage_limit = null
  formData.start_date = ''
  formData.end_date = ''
  formData.status = 'active'
}

// Soumission du formulaire
const handleSubmit = async () => {
  console.log('shopId:', shopId.value)
  console.log('currentShop:', currentShop.value)
  
  if (!shopId.value) {
    alert('Erreur : Impossible de récupérer l\'ID de la boutique. Veuillez recharger la page.')
    return
  }
  
  successMessage.value = ''
  
  const data = {
    code: formData.code.toUpperCase(),
    type: formData.type,
    value: formData.value,
    ...(formData.minimum_amount && { minimum_amount: formData.minimum_amount }),
    ...(formData.usage_limit && { usage_limit: formData.usage_limit }),
    start_date: formData.start_date,
    ...(formData.end_date && { end_date: formData.end_date }),
    ...(isEditMode.value && { status: formData.status })
  }
  
  console.log('Data à envoyer:', data)
  
  if (isEditMode.value && currentPromoCode.value) {
    const result = await updatePromoCode(shopId.value, currentPromoCode.value.id, data)
    if (result) {
      successMessage.value = 'Code promo mis à jour avec succès'
      closeModal()
      setTimeout(() => successMessage.value = '', 3000)
    }
  } else {
    const result = await createPromoCode(shopId.value, data)
    if (result) {
      successMessage.value = 'Code promo créé avec succès'
      closeModal()
      setTimeout(() => successMessage.value = '', 3000)
    }
  }
}

// Suppression
const confirmDelete = async (promo: PromoCode) => {
  if (!shopId.value) return
  
  if (confirm(`Êtes-vous sûr de vouloir supprimer le code promo "${promo.code}" ?`)) {
    const success = await deletePromoCode(shopId.value, promo.id)
    if (success) {
      successMessage.value = 'Code promo supprimé avec succès'
      setTimeout(() => successMessage.value = '', 3000)
    }
  }
}
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
