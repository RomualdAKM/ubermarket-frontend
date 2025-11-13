<template>
  <div class="container max-w-4xl mx-auto p-6">
    <div class="mb-8">
      <NuxtLink to="/mes-boutiques" class="inline-flex items-center text-primary hover:text-secondary mb-4">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Retour à mes boutiques
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Créer une nouvelle boutique</h1>
      <p class="text-gray-600 mt-1">Remplissez les informations ci-dessous pour créer votre boutique</p>
    </div>

    <div class="bg-white">
      <form @submit.prevent="createBoutique" class="space-y-4">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique <span class="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              v-model="boutiqueForm.name" 
              required 
              class="block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary"
              placeholder="Nom de votre boutique"
            >
          </div>
          
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-1">E-commerce ou site web <span class="text-red-500">*</span></label>
            <select 
              id="type" 
              name="type" 
              v-model="boutiqueForm.type" 
              required 
              class="block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary bg-white"
            >
              <option value="e-commerce">E-commerce</option>
              <option value="website">Site web</option>
            </select>
          </div>
          
          <div>
            <label for="productType" class="block text-sm font-medium text-gray-700 mb-1">Type de produit <span class="text-red-500">*</span></label>
            <select 
              id="productType" 
              name="productType" 
              v-model="boutiqueForm.productType" 
              required 
              class="block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary bg-white"
            >
              <option value="physical">Produits physiques</option>
              <option value="digital">Produits numériques</option>
            </select>
          </div>
          
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Catégorie principale <span class="text-red-500">*</span></label>
            <select 
              id="category" 
              name="category" 
              v-model="boutiqueForm.category_id" 
              required 
              class="block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary bg-white"
              :disabled="categoriesLoading"
            >
              <option value="" disabled>{{ categoriesLoading ? 'Chargement...' : 'Sélectionnez une catégorie' }}</option>
              <option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="logo" class="block text-sm font-medium text-gray-700 mb-1">Logo (PNG ou JPEG, max 2 Mo)</label>
            <div class="mt-1 flex items-center">
              <div v-if="boutiqueForm.logoPreview" class="w-16 h-16 border border-gray-300 rounded-md overflow-hidden">
                <img :src="boutiqueForm.logoPreview" alt="Aperçu du logo" class="w-full h-full object-cover">
              </div>
              <div v-else class="w-16 h-16 border border-gray-300 rounded-md flex items-center justify-center bg-gray-100">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <label for="logo-upload" class="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  Choisir un fichier
                </label>
                <input id="logo-upload" name="logo-upload" type="file" accept="image/png, image/jpeg" @change="handleLogoUpload" class="sr-only">
                <p v-if="!boutiqueForm.logoPreview" class="mt-1 text-xs text-gray-500">Logo par défaut utilisé</p>
              </div>
            </div>
          </div>
          
          <div>
            <label for="color" class="block text-sm font-medium text-gray-700 mb-1">Couleur principale</label>
            <div class="mt-1 flex items-center">
              <input type="color" id="color" name="color" v-model="boutiqueForm.color" class="h-10 w-16 border border-gray-300 rounded-md cursor-pointer">
              <span class="ml-3 text-sm text-gray-500">{{ boutiqueForm.color || '#FF0000' }}</span>
              <div v-if="boutiqueForm.color" class="ml-3 w-8 h-8 border border-gray-300 rounded-md" :style="{ backgroundColor: boutiqueForm.color }"></div>
            </div>
          </div>
          
          <div class="sm:col-span-2">
            <label for="domain" class="block text-sm font-medium text-gray-700 mb-1">Domaine personnalisé</label>
            <input 
              type="text" 
              name="domain" 
              id="domain" 
              v-model="boutiqueForm.domain" 
              placeholder="ex: jeansfashion.uber-market.com" 
              class="block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary"
            >
          </div>
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description <span class="text-gray-500">(max 500 caractères, facultatif)</span></label>
          <textarea 
            id="description" 
            name="description" 
            v-model="boutiqueForm.description" 
            rows="3" 
            maxlength="500" 
            class="block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary"
            placeholder="Décrivez votre boutique en quelques mots..."
          ></textarea>
          <div class="text-right text-sm text-gray-500 mt-1">{{ boutiqueForm.description.length }}/500</div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <NuxtLink to="/mes-boutiques" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Annuler
          </NuxtLink>
          <button type="submit" class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Créer la boutique
          </button>
        </div>
      </form>
    </div>
    
    <!-- Message de confirmation -->
    <div v-if="showSuccessMessage" class="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-green-800">
            Votre boutique est prête !
          </h3>
          <div class="mt-2 text-sm text-green-700">
            <p>Commencez à ajouter des produits.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { ShopData } from '~/types/auth'
import { useShops } from '~/composables/useShops'
import type { Category } from '~/composables/useCategories'
import { useCategories } from '~/composables/useCategories'

const router = useRouter()
const { createShop } = useShops()
const { categories, fetchCategories, isLoading: categoriesLoading } = useCategories()
const showSuccessMessage = ref(false)
const isSubmitting = ref(false)
const submitError = ref('')

// Charger les catégories au montage du composant
onMounted(async () => {
  await fetchCategories()
})

const boutiqueForm = reactive({
  name: '',
  type: 'e-commerce' as 'e-commerce' | 'website',
  productType: 'physical' as 'physical' | 'digital',
  category_id: null as number | null,
  logo: null as File | null,
  logoPreview: '',
  color: '#FF0000',
  description: '',
  domain: '',
  themeId: 1,
  currency: 'XOF' as 'EUR' | 'USD' | 'XOF'
})

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Vérifier la taille du fichier (max 2 Mo)
    if (file.size > 2 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale : 2 Mo.')
      return
    }
    
    // Vérifier le type de fichier
    if (!file.type.match('image/png') && !file.type.match('image/jpeg')) {
      alert('Format de fichier non supporté. Formats acceptés : PNG, JPEG.')
      return
    }
    
    boutiqueForm.logo = file
    const reader = new FileReader()
    reader.onload = (e) => {
      boutiqueForm.logoPreview = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const createBoutique = async () => {
  // Réinitialiser les erreurs
  submitError.value = ''
  
  // Validation des champs obligatoires
  if (!boutiqueForm.name) {
    submitError.value = 'Le nom de la boutique est obligatoire.'
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Validation des champs obligatoires
    if (!boutiqueForm.category_id) {
      submitError.value = 'Veuillez sélectionner une catégorie.'
      return
    }

    const shopData: ShopData = {
      name: boutiqueForm.name,
      shop_type: boutiqueForm.type,
      product_type: boutiqueForm.productType,
      category_id: boutiqueForm.category_id,
      description: boutiqueForm.description,
      primary_color: boutiqueForm.color,
      logo: boutiqueForm.logo || undefined,
      theme_id: boutiqueForm.themeId,
      currency: boutiqueForm.currency,
      subdomain: boutiqueForm.domain || undefined
    }
    
    console.log('Données à envoyer:', shopData)
    const response = await createShop(shopData)
    
    if (response.success) {
      // Afficher le message de succès
      showSuccessMessage.value = true
      
      // Réinitialiser le formulaire
      Object.assign(boutiqueForm, {
        name: '',
        type: 'e-commerce',
        productType: 'physical',
        category_id: null,
        logo: null,
        logoPreview: '',
        color: '#FF0000',
        description: '',
        domain: ''
      })
      
      // Rediriger vers la page des boutiques après 2 secondes
      setTimeout(() => {
        router.push('/mes-boutiques')
      }, 2000)
    }
  } catch (error: any) {
    console.error('Erreur:', error)
    submitError.value = error.message || 'Une erreur est survenue lors de la création de la boutique.'
  } finally {
    isSubmitting.value = false
  }
}
</script>