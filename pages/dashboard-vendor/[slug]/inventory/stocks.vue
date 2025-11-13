<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Gestion des stocks</h1>
      <p class="text-gray-600">Suivez et mettez à jour vos niveaux de stock</p>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="bg-white rounded-lg p-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement des stocks...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="bg-white rounded-lg p-12 text-center">
      <div class="text-red-500 mb-4">
        <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="loadProducts" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary">
        Réessayer
      </button>
    </div>

    <!-- Contenu -->
    <div v-else>
      <!-- Filtres et recherche -->
      <div class="bg-white p-4 mb-6 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Catégorie</label>
            <select 
              id="category" 
              v-model="filters.subcategory"
              @change="loadProducts"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"
            >
              <option value="">Toutes</option>
              <option v-for="sub in subcategories" :key="sub.id" :value="sub.id">
                {{ sub.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
            <select 
              id="status" 
              v-model="filters.stockStatus"
              @change="filterProducts"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"
            >
              <option value="">Tous</option>
              <option value="in_stock">En stock</option>
              <option value="low_stock">Stock bas</option>
              <option value="out_of_stock">Épuisé</option>
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
              id="search"
              v-model="filters.search"
              @input="filterProducts"
              type="text" 
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary" 
              placeholder="Rechercher..."
            />
          </div>
        </div>
      </div>

      <!-- Message si aucun produit -->
      <div v-if="filteredProducts.length === 0" class="bg-white rounded-lg p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <p class="text-gray-500">Aucun produit trouvé</p>
      </div>

      <!-- Liste des stocks -->
      <div v-else class="bg-white rounded-lg">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock actuel</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in filteredProducts" :key="product.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img 
                      :src="getProductImage(product)" 
                      :alt="product.name"
                      class="w-10 h-10 rounded object-cover"
                    />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ product.subcategory?.name || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ product.stock_quantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStockStatusClass(product.stock_quantity)"
                  >
                    {{ getStockStatus(product.stock_quantity) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="openUpdateModal(product)" 
                    class="text-primary hover:text-secondary"
                  >
                    Mettre à jour
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Modal de mise à jour du stock -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container rounded-md">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Mettre à jour le stock - {{ currentProduct?.name }}</h2>
              <button @click="closeModal" class="px-3 py-1 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary rounded">
                Fermer
              </button>
            </div>
            
            <form @submit.prevent="updateStock" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Produit</label>
                  <div class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded">{{ currentProduct?.name }}</div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Stock actuel</label>
                  <div class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded">{{ currentProduct?.stock_quantity }}</div>
                </div>
                
                <div class="sm:col-span-2">
                  <label for="new-stock" class="block text-sm font-medium text-gray-700">Nouveau stock</label>
                  <input 
                    type="number" 
                    v-model.number="newStock" 
                    name="new-stock" 
                    id="new-stock" 
                    min="0"
                    required
                    class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary rounded"
                  >
                </div>
              </div>
              
              <div>
                <label for="reason" class="block text-sm font-medium text-gray-700">Raison de la mise à jour</label>
                <select 
                  id="reason" 
                  v-model="updateReason" 
                  class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary rounded"
                >
                  <option value="">Sélectionner une raison</option>
                  <option value="Vente">Vente</option>
                  <option value="Réapprovisionnement">Réapprovisionnement</option>
                  <option value="Retour">Retour</option>
                  <option value="Perte/Dommage">Perte/Dommage</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
                <textarea 
                  id="notes" 
                  v-model="updateNotes" 
                  rows="3" 
                  class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary rounded"
                ></textarea>
              </div>
              
              <div v-if="updateError" class="p-3 bg-red-50 border border-red-200 rounded-md">
                <p class="text-sm text-red-800">{{ updateError }}</p>
              </div>
              
              <div class="flex justify-end">
                <button 
                  type="button" 
                  @click="closeModal" 
                  class="px-4 rounded-md py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  :disabled="isUpdating"
                  class="ml-3 px-4 py-2 bg-primary rounded-md text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isUpdating ? 'Mise à jour...' : 'Mettre à jour le stock' }}
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
  layout: 'dashboard',
  middleware: ['shop-access']
})

const route = useRoute()
const config = useRuntimeConfig()
const shopSlug = route.params.slug as string

const { fetchShops, shops } = useShops()
const { products, isLoading, error, fetchShopProducts } = useProducts()
const { token } = useAuth()

// Filtres
const filters = ref({
  subcategory: '',
  stockStatus: '',
  search: ''
})

// Produits filtrés - computed pour mise à jour automatique
const filteredProducts = computed(() => {
  let result = [...(products.value || [])]
  
  // Filtre par sous-catégorie
  if (filters.value.subcategory) {
    result = result.filter(p => p.subcategory?.id == filters.value.subcategory)
  }
  
  // Filtre par statut de stock
  if (filters.value.stockStatus) {
    result = result.filter(p => {
      const stock = p.stock_quantity || 0
      if (filters.value.stockStatus === 'in_stock') return stock > 10
      if (filters.value.stockStatus === 'low_stock') return stock > 0 && stock <= 10
      if (filters.value.stockStatus === 'out_of_stock') return stock === 0
      return true
    })
  }
  
  // Filtre par recherche
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(search)
    )
  }
  
  return result
})

// Sous-catégories extraites des produits
const subcategories = computed(() => {
  const uniqueSubcats = new Map()
  if (!products.value || !Array.isArray(products.value)) return []
  products.value.forEach(p => {
    if (p.subcategory) {
      uniqueSubcats.set(p.subcategory.id, p.subcategory)
    }
  })
  return Array.from(uniqueSubcats.values())
})

// Modal état
const showModal = ref(false)
const currentProduct = ref<any>(null)
const newStock = ref(0)
const updateReason = ref('')
const updateNotes = ref('')
const isUpdating = ref(false)
const updateError = ref('')

// Computed pour l'ID de la boutique
const currentShopId = computed(() => {
  if (!shops.value || !Array.isArray(shops.value)) {
    return undefined
  }
  const shop = shops.value.find(s => s.subdomain === shopSlug || s.slug === shopSlug)
  return shop?.id
})

// Charger les produits
const loadProducts = async () => {
  if (!currentShopId.value) {
    await fetchShops()
    if (!currentShopId.value) return
  }
  
  await fetchShopProducts(currentShopId.value)
}

// Obtenir l'image du produit
const getProductImage = (product: any) => {
  const backendUrl = config.public.apiBase.replace('/api', '')
  
  if (product.preview_image) {
    return `${backendUrl}/storage/${product.preview_image}`
  }
  
  if (product.product_images && product.product_images.length > 0) {
    return `${backendUrl}/storage/${product.product_images[0].image_path}`
  }
  
  return 'https://placehold.co/100x100?text=No+Image'
}

// Obtenir le statut du stock
const getStockStatus = (stock: number): string => {
  if (stock === 0) return 'Épuisé'
  if (stock <= 10) return 'Stock bas'
  return 'En stock'
}

// Obtenir la classe CSS du statut
const getStockStatusClass = (stock: number): string => {
  if (stock === 0) return 'bg-red-100 text-red-800'
  if (stock <= 10) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

// Ouvrir le modal de mise à jour
const openUpdateModal = (product: any) => {
  currentProduct.value = product
  newStock.value = product.stock_quantity || 0
  updateReason.value = ''
  updateNotes.value = ''
  updateError.value = ''
  showModal.value = true
}

// Fermer le modal
const closeModal = () => {
  showModal.value = false
  currentProduct.value = null
  newStock.value = 0
  updateReason.value = ''
  updateNotes.value = ''
  updateError.value = ''
}

// Mettre à jour le stock
const updateStock = async () => {
  if (!currentProduct.value || !currentShopId.value) return
  
  if (!token.value) {
    updateError.value = 'Vous devez être connecté'
    return
  }
  
  isUpdating.value = true
  updateError.value = ''
  
  try {
    const response = await fetch(
      `${config.public.apiBase}/shops/${currentShopId.value}/products/${currentProduct.value.id}/stock`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          stock_quantity: newStock.value,
          reason: updateReason.value,
          notes: updateNotes.value
        })
      }
    )
    
    const data = await response.json()
    
    if (data.success) {
      // Recharger les produits pour rafraîchir la liste
      await loadProducts()
      closeModal()
    } else {
      updateError.value = data.message || 'Erreur lors de la mise à jour'
    }
  } catch (err: any) {
    updateError.value = err.message || 'Erreur lors de la mise à jour'
  } finally {
    isUpdating.value = false
  }
}

// Chargement initial
onMounted(async () => {
  await fetchShops()
  await loadProducts()
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
