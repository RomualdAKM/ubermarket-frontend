<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Gestion des livreurs</h1>
        <p class="text-gray-600">Gérez vos livreurs</p>
      </div>
      <div class="flex gap-2">
        <button @click="openSearchModal" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
          Rechercher un livreur
        </button>
        <button @click="openAddForm" class="px-4 py-2 bg-primary rounded-md text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
          Ajouter un livreur
        </button>
      </div>
    </div>

    <!-- Liste des livreurs -->
    <div class="bg-white mb-6">
      <!-- Loading -->
      <div v-if="isLoading" class="p-8 text-center">
        <p class="text-gray-500">Chargement...</p>
      </div>
      
      <!-- Erreur -->
      <div v-else-if="error" class="p-8 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Liste vide -->
      <div v-else-if="couriers.length === 0" class="p-8 text-center">
        <p class="text-gray-500">Aucun livreur pour le moment</p>
        <button @click="openAddForm" class="mt-4 px-4 py-2 bg-primary rounded-md text-white text-sm font-medium hover:bg-secondary">
          Ajouter votre premier livreur
        </button>
      </div>
      
      <!-- Tableau des livreurs -->
      <div v-else class="overflow-x-auto">
        <!-- Mes livreurs -->
        <div v-if="ownCouriers.length > 0" class="mb-6">
          <h3 class="px-6 py-3 bg-gray-50 text-sm font-semibold text-gray-700">Mes livreurs ({{ ownCouriers.length }})</h3>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livreur</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zones</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livraisons</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="courier in ownCouriers" :key="courier.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ courier.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ courier.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ courier.phone }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <div v-if="courier.coverage_zones.length > 0" class="flex flex-wrap gap-1">
                    <span v-for="(zone, index) in courier.coverage_zones.slice(0, 2)" :key="index" class="px-2 py-1 bg-gray-100 rounded text-xs">
                      {{ zone }}
                    </span>
                    <span v-if="courier.coverage_zones.length > 2" class="px-2 py-1 bg-gray-100 rounded text-xs">
                      +{{ courier.coverage_zones.length - 2 }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ courier.deliveries_count }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadge(courier.status).class" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getStatusBadge(courier.status).label }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openEditForm(courier)" class="text-primary hover:text-secondary mr-3">Modifier</button>
                  <button @click="handleDelete(courier.id)" class="text-red-600 hover:text-red-900">Supprimer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Livreurs de la plateforme -->
        <div v-if="platformCouriersAvailable.length > 0">
          <h3 class="px-6 py-3 bg-blue-50 text-sm font-semibold text-blue-700">Livreurs de la plateforme ({{ platformCouriersAvailable.length }})</h3>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livreur</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zones</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livraisons</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="courier in platformCouriersAvailable" :key="courier.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="bg-blue-200 border-2 border-dashed rounded-xl w-8 h-8" />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ courier.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ courier.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ courier.phone }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <div v-if="courier.coverage_zones.length > 0" class="flex flex-wrap gap-1">
                    <span v-for="(zone, index) in courier.coverage_zones.slice(0, 2)" :key="index" class="px-2 py-1 bg-gray-100 rounded text-xs">
                      {{ zone }}
                    </span>
                    <span v-if="courier.coverage_zones.length > 2" class="px-2 py-1 bg-gray-100 rounded text-xs">
                      +{{ courier.coverage_zones.length - 2 }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ courier.deliveries_count }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeBadge(courier.type).class" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getTypeBadge(courier.type).label }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="handleRemovePlatformCourier(courier.id)" class="text-red-600 hover:text-red-900">Retirer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Modal pour ajouter/modifier un livreur -->
    <Teleport to="body">
      <div v-if="showAddForm" class="modal-overlay" @click.self="showAddForm = false">
        <div class="modal-container rounded-md">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">
                {{ editingCourier ? 'Modifier le livreur' : 'Ajouter un nouveau livreur' }}
              </h2>
              <button @click="showAddForm = false" class="px-3 py-1 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                Fermer
              </button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">Nom complet *</label>
                  <input v-model="formData.name" type="text" name="name" id="name" required class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email *</label>
                  <input v-model="formData.email" type="email" name="email" id="email" required class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone *</label>
                  <input v-model="formData.phone" type="text" name="phone" id="phone" required class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700">Statut *</label>
                  <select v-model="formData.status" id="status" name="status" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label for="zone_input" class="block text-sm font-medium text-gray-700">Zones de couverture</label>
                <div class="flex gap-2 mt-1">
                  <input v-model="formData.zone_input" @keydown.enter.prevent="addZone" type="text" id="zone_input" placeholder="Ex: Paris, Lyon..." class="flex-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                  <button @click.prevent="addZone" type="button" class="px-4 py-2 bg-gray-200 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-300">
                    Ajouter
                  </button>
                </div>
                
                <!-- Liste des zones -->
                <div v-if="formData.coverage_zones.length > 0" class="mt-2 flex flex-wrap gap-2">
                  <span v-for="(zone, index) in formData.coverage_zones" :key="index" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                    {{ zone }}
                    <button @click.prevent="removeZone(index)" type="button" class="text-blue-600 hover:text-blue-800 font-bold">
                      ×
                    </button>
                  </span>
                </div>
              </div>
              
              <!-- Message d'erreur -->
              <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md">
                <p class="text-sm text-red-600">{{ error }}</p>
              </div>
              
              <div class="flex justify-end">
                <button type="button" @click="showAddForm = false" class="px-4 rounded-md py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                  Annuler
                </button>
                <button type="submit" :disabled="isLoading" class="ml-3 px-4 py-2 bg-primary rounded-md text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50">
                  {{ isLoading ? 'Enregistrement...' : (editingCourier ? 'Modifier' : 'Ajouter') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Modal de recherche des livreurs plateforme -->
    <Teleport to="body">
      <div v-if="showSearchModal" class="modal-overlay" @click.self="showSearchModal = false">
        <div class="modal-container rounded-md">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Rechercher un livreur de la plateforme</h2>
              <button @click="showSearchModal = false" class="px-3 py-1 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                Fermer
              </button>
            </div>
            
            <!-- Barre de recherche -->
            <div class="mb-4">
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-3">
                <input v-model="searchQuery" @keydown.enter="handleSearch" type="text" placeholder="Rechercher par nom, email, téléphone..." class="block w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-secondary focus:border-secondary">
                <input v-model="searchZone" @keydown.enter="handleSearch" type="text" placeholder="Filtrer par zone (Paris, Lyon...)" class="block w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-secondary focus:border-secondary">
              </div>
              <button @click="handleSearch" class="w-full px-4 py-2 bg-primary rounded-md text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                Rechercher
              </button>
            </div>
            
            <!-- Résultats -->
            <div v-if="isLoading" class="text-center py-8">
              <p class="text-gray-500">Recherche en cours...</p>
            </div>
            
            <div v-else-if="platformCouriers.length === 0" class="text-center py-8">
              <p class="text-gray-500">Aucun livreur trouvé</p>
            </div>
            
            <div v-else class="space-y-2 max-h-96 overflow-y-auto">
              <div v-for="courier in platformCouriers" :key="courier.id" class="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900">{{ courier.name }}</h3>
                    <p class="text-sm text-gray-600">{{ courier.email }} | {{ courier.phone }}</p>
                    <div class="mt-2 flex flex-wrap gap-1">
                      <span v-for="(zone, index) in courier.coverage_zones" :key="index" class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                        {{ zone }}
                      </span>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">{{ courier.deliveries_count }} livraisons effectuées</p>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      Plateforme
                    </span>
                    <button 
                      @click="handleAddPlatformCourier(courier.id)"
                      :disabled="isLoading"
                      class="px-3 py-1 bg-primary text-white rounded text-xs font-medium hover:bg-secondary disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                      Ajouter à ma boutique
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p class="text-sm text-blue-800">
                <strong>Info :</strong> Une fois ajouté à votre boutique, vous pourrez assigner ce livreur à vos commandes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useShops } from '~/composables/useShops'
import { useCouriers } from '~/composables/useCouriers'

const route = useRoute()
const slug = route.params.slug as string

const { shops, currentShop, fetchShops } = useShops()
const {
  couriers,
  platformCouriers,
  isLoading,
  error,
  fetchCouriers,
  searchPlatformCouriers,
  createCourier,
  updateCourier,
  deleteCourier,
  addPlatformCourier,
  removePlatformCourier,
  getStatusBadge,
  getTypeBadge
} = useCouriers()

const showAddForm = ref(false)
const showSearchModal = ref(false)
const editingCourier = ref<any>(null)

const formData = ref({
  name: '',
  email: '',
  phone: '',
  coverage_zones: [] as string[],
  status: 'active' as 'active' | 'inactive',
  zone_input: '' // Pour ajouter des zones
})

const searchQuery = ref('')
const searchZone = ref('')

// Separer les livreurs par type
const ownCouriers = computed(() => {
  return couriers.value.filter(c => c.is_own === true)
})

const platformCouriersAvailable = computed(() => {
  return couriers.value.filter(c => c.is_platform === true)
})

const loadCouriers = async () => {
  // S'assurer que les boutiques sont chargees
  if (shops.value.length === 0) {
    await fetchShops()
  }
  
  // currentShop est defini par le middleware
  if (currentShop.value) {
    await fetchCouriers(currentShop.value.id)
  }
}

const openAddForm = () => {
  editingCourier.value = null
  formData.value = {
    name: '',
    email: '',
    phone: '',
    coverage_zones: [],
    status: 'active',
    zone_input: ''
  }
  showAddForm.value = true
}

const openEditForm = (courier: any) => {
  editingCourier.value = courier
  formData.value = {
    name: courier.name,
    email: courier.email,
    phone: courier.phone,
    coverage_zones: [...courier.coverage_zones],
    status: courier.status,
    zone_input: ''
  }
  showAddForm.value = true
}

const addZone = () => {
  if (formData.value.zone_input.trim()) {
    formData.value.coverage_zones.push(formData.value.zone_input.trim())
    formData.value.zone_input = ''
  }
}

const removeZone = (index: number) => {
  formData.value.coverage_zones.splice(index, 1)
}

const handleSubmit = async () => {
  if (!currentShop.value) return

  const data = {
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    coverage_zones: formData.value.coverage_zones,
    status: formData.value.status
  }

  let success = false
  
  if (editingCourier.value) {
    success = await updateCourier(currentShop.value.id, editingCourier.value.id, data)
  } else {
    success = await createCourier(currentShop.value.id, data)
  }

  if (success) {
    showAddForm.value = false
    editingCourier.value = null
  }
}

const handleDelete = async (courierId: number) => {
  if (!currentShop.value) return
  
  if (confirm('Êtes-vous sûr de vouloir supprimer ce livreur ?')) {
    await deleteCourier(currentShop.value.id, courierId)
  }
}

const openSearchModal = async () => {
  await searchPlatformCouriers()
  showSearchModal.value = true
}

const handleSearch = async () => {
  await searchPlatformCouriers({ search: searchQuery.value, zone: searchZone.value })
}

const handleAddPlatformCourier = async (courierId: number) => {
  if (!currentShop.value) return
  
  const success = await addPlatformCourier(currentShop.value.id, courierId)
  
  if (success) {
    // Fermer le modal
    showSearchModal.value = false
    // Recharger la liste
    await loadCouriers()
  }
}

const handleRemovePlatformCourier = async (courierId: number) => {
  if (!currentShop.value) return
  
  if (confirm('Êtes-vous sûr de vouloir retirer ce livreur de votre boutique ?')) {
    const success = await removePlatformCourier(currentShop.value.id, courierId)
    
    if (success) {
      await loadCouriers()
    }
  }
}

onMounted(() => {
  loadCouriers()
})

definePageMeta({
  layout: 'dashboard'
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
