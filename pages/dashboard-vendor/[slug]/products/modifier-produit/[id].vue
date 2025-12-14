<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-4">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-bold text-gray-900">Modifier le produit</h1>
        <button 
          type="button"
          @click="showShopInfo = !showShopInfo"
          class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          :title="showShopInfo ? 'Masquer les informations' : 'Voir les informations de la boutique'"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Message de chargement -->
    <div v-if="isLoadingProduct" class="bg-white border border-gray-200 p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p class="mt-2 text-gray-600">Chargement du produit...</p>
    </div>

    <!-- Informations boutique (repliable) -->
    <transition name="slide-fade">
      <div v-if="showShopInfo && currentShop" class="mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-700">Informations de la boutique</h3>
        </div>
        <div class="p-4">
          <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide">Boutique</dt>
              <dd class="mt-1 text-sm text-gray-900 font-medium">{{ currentShop.name }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide">Type de produits</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ isPhysicalShop ? 'Produits physiques' : 'Produits numériques' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide">Catégorie</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ shopCategory?.name || 'Non définie' }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </transition>

    <!-- Formulaire de modification -->
    <div v-if="!isLoadingProduct" class="bg-white overflow-hidden">
      <div>
        <form @submit.prevent="submitForm">
          <!-- Informations de base -->
          <div class="border-b border-gray-200 pb-6 mb-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label for="nom-produit" class="block text-sm font-medium text-gray-700 mb-1">
                  Nom du produit<span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nom-produit"
                  v-model="productForm.name"
                  required
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Ex. : T-shirt bleu"
                />
              </div>
              
              <div class="sm:col-span-2">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                  Description<span class="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  v-model="productForm.description"
                  rows="4"
                  maxlength="1000"
                  required
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Décrivez votre produit en détail..."
                ></textarea>
                <div class="text-right text-sm text-gray-500 mt-1">
                  {{ productForm.description.length }}/1000
                </div>
              </div>
              
              <div>
                <label for="sous-categorie" class="block text-sm font-medium text-gray-700 mb-1">
                  Sous-catégorie <span class="text-red-500">*</span>
                </label>
                <select
                  id="sous-categorie"
                  v-model="productForm.subcategory_id"
                  required
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  :disabled="subcategories.length === 0"
                >
                  <option value="0">Sélectionnez une sous-catégorie</option>
                  <option 
                    v-for="subcategory in subcategories" 
                    :key="subcategory.id" 
                    :value="subcategory.id"
                  >
                    {{ subcategory.name }}
                  </option>
                </select>
                <p v-if="subcategories.length === 0" class="text-sm text-gray-500 mt-1">
                  Aucune sous-catégorie disponible pour la catégorie "{{ shopCategory?.name }}"
                </p>
              </div>
            </div>
          </div>

          <!-- Informations de prix et stock -->
          <div class="border-b border-gray-200 pb-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Prix et stock</h2>
            
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="prix-normal" class="block text-sm font-medium text-gray-700 mb-1">
                  Prix normal ({{ currentShop?.currency || 'EUR' }})<span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="prix-normal"
                  v-model.number="productForm.price"
                  step="0.01"
                  min="0"
                  required
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Ex. : 29.99"
                />
              </div>
              
              <div>
                <label for="prix-promo" class="block text-sm font-medium text-gray-700 mb-1">
                  Prix promotionnel ({{ currentShop?.currency || 'EUR' }})
                </label>
                <input
                  type="number"
                  id="prix-promo"
                  v-model.number="productForm.promotional_price"
                  step="0.01"
                  min="0"
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Ex. : 19.99"
                />
              </div>
              
              <!-- Dates de promotion -->
              <div v-if="productForm.promotional_price" class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="date-debut-promo" class="block text-sm font-medium text-gray-700 mb-1">
                    Date de début de promotion
                  </label>
                  <input
                    type="date"
                    id="date-debut-promo"
                    v-model="productForm.promotion_start_date"
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label for="date-fin-promo" class="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin de promotion
                  </label>
                  <input
                    type="date"
                    id="date-fin-promo"
                    v-model="productForm.promotion_end_date"
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  />
                </div>
              </div>
              
              <!-- Champs spécifiques selon le type de boutique -->
              <template v-if="isPhysicalShop">
                <div>
                  <label for="stock" class="block text-sm font-medium text-gray-700 mb-1">
                    Stock<span class="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    v-model.number="productForm.stock_quantity"
                    min="0"
                    required
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                    placeholder="Ex. : 50"
                  />
                </div>
              </template>
            </div>
          </div>

          <!-- Statut du produit -->
          <div class="pb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Statut du produit</h2>
            
            <div class="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <button
                type="button"
                @click="productForm.status = 'active'"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  productForm.status === 'active' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                Actif
              </button>
              <button
                type="button"
                @click="productForm.status = 'inactive'"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  productForm.status === 'inactive' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                Inactif
              </button>
            </div>
            <p class="mt-2 text-sm text-gray-500">
              {{ productForm.status === 'active' 
                ? 'Le produit sera visible et disponible à l\'achat' 
                : 'Le produit sera masqué pour les acheteurs' }}
            </p>
          </div>

          <!-- Message d'erreur -->
          <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
            {{ error }}
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="router.back()"
              class="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              :disabled="isLoading"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="!isFormValid || isLoading"
              :class="[
                'px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                isFormValid && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-300 cursor-not-allowed'
              ]"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mise à jour...
              </span>
              <span v-else>Mettre à jour le produit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ProductData } from '~/types/product'
import type { Subcategory } from '~/types/product'

definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})

const router = useRouter()
const route = useRoute()
const { currentShop } = useShops()
const { categories, fetchCategories } = useCategories()
const { fetchSubcategoriesByCategory } = useSubcategories()
const { updateProduct, fetchProductDetails, isLoading: isLoadingProducts, error: productError } = useProducts()

const isLoading = ref(false)
const isLoadingProduct = ref(true)
const error = ref<string | null>(null)
const subcategories = ref<Subcategory[]>([])
const showShopInfo = ref(false)
const productId = computed(() => parseInt(route.params.id as string))

const productForm = reactive<ProductData>({
  name: '',
  description: '',
  subcategory_id: 0,
  price: 0,
  promotional_price: undefined,
  promotion_start_date: '',
  promotion_end_date: '',
  stock_quantity: 0,
  digital_file: undefined,
  status: 'active',
  show_sales_count: false,
  variants: [],
  images: []
})

const isPhysicalShop = computed(() => {
  return currentShop.value?.product_type === 'physical'
})

const isDigitalShop = computed(() => {
  return currentShop.value?.product_type === 'digital'
})

const shopCategory = computed(() => {
  return currentShop.value?.category
})

const loadSubcategories = async (categoryId: number) => {
  try {
    const subs = await fetchSubcategoriesByCategory(categoryId)
    subcategories.value = subs
  } catch (err) {
    console.error('Erreur lors du chargement des sous-catégories:', err)
  }
}

watch(currentShop, async (newShop) => {
  if (newShop && newShop.category_id) {
    await loadSubcategories(newShop.category_id)
  }
}, { immediate: true })

const isFormValid = computed(() => {
  if (!productForm.name || !productForm.description || productForm.subcategory_id <= 0 || productForm.price <= 0) {
    return false
  }
  
  if (productForm.description.length > 1000) {
    return false
  }
  
  if (isPhysicalShop.value) {
    if (productForm.stock_quantity < 0) {
      return false
    }
  }
  
  return true
})

const loadProductData = async () => {
  if (!currentShop.value) {
    console.error('Boutique non trouvée')
    return
  }

  isLoadingProduct.value = true
  error.value = null

  try {
    const product = await fetchProductDetails(currentShop.value.id, productId.value)
    
    if (product) {
      productForm.name = product.name
      productForm.description = product.description
      productForm.subcategory_id = product.subcategory_id
      productForm.price = product.price
      productForm.promotional_price = product.promotional_price || undefined
      productForm.promotion_start_date = product.promotion_start_date ? new Date(product.promotion_start_date).toISOString().split('T')[0] : ''
      productForm.promotion_end_date = product.promotion_end_date ? new Date(product.promotion_end_date).toISOString().split('T')[0] : ''
      productForm.stock_quantity = product.stock_quantity
      productForm.status = product.status
      productForm.show_sales_count = product.show_sales_count
    } else {
      throw new Error('Produit introuvable')
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement du produit'
    console.error('Erreur:', err)
  } finally {
    isLoadingProduct.value = false
  }
}

onMounted(async () => {
  if (categories.value.length === 0) {
    await fetchCategories()
  }
  
  await loadProductData()
})

const submitForm = async () => {
  if (!isFormValid.value) {
    alert('Veuillez remplir correctement tous les champs obligatoires.')
    return
  }
  
  if (!currentShop.value) {
    alert('Aucune boutique sélectionnée.')
    return
  }
  
  isLoading.value = true
  error.value = null
  
  try {
    const productData: Partial<ProductData> = {
      name: productForm.name,
      description: productForm.description,
      subcategory_id: productForm.subcategory_id,
      price: productForm.price,
      promotional_price: productForm.promotional_price,
      promotion_start_date: productForm.promotion_start_date,
      promotion_end_date: productForm.promotion_end_date,
      stock_quantity: productForm.stock_quantity,
      status: productForm.status
    }
    
    const updatedProduct = await updateProduct(currentShop.value.id, productId.value, productData)
    
    if (updatedProduct) {
      alert('Produit mis à jour avec succès !')
      router.push(`/dashboard-vendor/${currentShop.value.subdomain}/products/produits`)
    } else {
      throw new Error('Erreur lors de la mise à jour du produit')
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue lors de la mise à jour du produit'
    alert(error.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
