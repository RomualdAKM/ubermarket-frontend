<template>
  <div class="container max-w-4xl mx-auto p-6">
    <div class="mb-4">
      <NuxtLink to="/mes-boutiques" class="inline-flex items-center text-primary hover:text-secondary mb-4">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Retour à mes boutiques
      </NuxtLink>
      <h1 class="text-xl font-bold text-gray-900">Créer une nouvelle boutique</h1>
      <!-- <p class="text-gray-600 mt-1">Remplissez les informations ci-dessous pour créer votre boutique</p> -->
    </div>

    <div class="bg-white">
      <form @submit.prevent="createBoutique" class="space-y-2">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
               <div>
            <label for="logo" class="block text-sm font-medium text-gray-700 mb-1">Logo de la boutique</label>
            <div class="mt-2 flex items-center gap-4">
              <div class="relative">
                <div v-if="boutiqueForm.logoPreview" class="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm">
                  <img :src="boutiqueForm.logoPreview" alt="Logo" class="w-full h-full object-cover">
                </div>
                <div v-else class="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <label for="logo-upload" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  {{ boutiqueForm.logoPreview ? 'Modifier' : 'Télécharger' }}
                </label>
                <input id="logo-upload" name="logo-upload" type="file" accept="image/png, image/jpeg" @change="handleLogoUpload" class="sr-only">
                <p class="mt-1.5 text-xs text-gray-500">PNG ou JPEG, max 2 Mo</p>
              </div>
            </div>
          </div>
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique <span class="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              v-model="boutiqueForm.name" 
              required 
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Nom de votre boutique"
            >
          </div>
          
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
              E-commerce ou site web <span class="text-red-500">*</span>
              <button 
                type="button" 
                @click="showTypeInfo = !showTypeInfo"
                class="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </label>
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
            <transition name="fade">
              <p v-if="showTypeInfo" class="mt-2 text-xs text-gray-600 bg-gray-50  p-2 rounded">
                <span v-if="boutiqueForm.type === 'e-commerce'" class="block">
                  <strong class="text-blue-700">E-commerce :</strong> Vos clients pourront passer commande et acheter en ligne ou payer à la livraison.
                </span>
                <span v-else class="block">
                  <strong class="text-blue-700">Site web :</strong> Site vitrine pour afficher vos produits sans fonction de commande.
                </span>
              </p>
            </transition>
          </div>
          
          <div>
            <label for="productType" class="block text-sm font-medium text-gray-700 mb-1">
              Type de produit <span class="text-red-500">*</span>
              <button 
                type="button" 
                @click="showProductTypeInfo = !showProductTypeInfo"
                class="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </label>
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
            <transition name="fade">
              <p v-if="showProductTypeInfo" class="mt-2 text-xs text-gray-600 bg-gray-50  p-2 rounded">
                <span v-if="boutiqueForm.productType === 'physical'" class="block">
                  <strong class="text-blue-700">Produits physiques :</strong> Articles nécessitant une livraison (vêtements, électronique, etc.).
                </span>
                <span v-else class="block">
                  <strong class="text-blue-700">Produits numériques :</strong> Fichiers téléchargeables uniquement (ebooks, logiciels, musique, etc.).
                </span>
              </p>
            </transition>
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
          
     
          
          <!-- <div>
            <label for="color" class="block text-sm font-medium text-gray-700 mb-1">Couleur principale</label>
            <div class="mt-1 flex items-center">
              <input type="color" id="color" name="color" v-model="boutiqueForm.color" class="h-10 w-16 border border-gray-300 rounded-md cursor-pointer">
              <span class="ml-3 text-sm text-gray-500">{{ boutiqueForm.color || '#FF0000' }}</span>
              <div v-if="boutiqueForm.color" class="ml-3 w-8 h-8 border border-gray-300 rounded-md" :style="{ backgroundColor: boutiqueForm.color }"></div>
            </div>
          </div> -->
          
          <div class="sm:col-span-2">
            <label for="domain" class="block text-sm font-medium text-gray-700 mb-1">Sous-domaine personnalisé</label>
            <div class="mt-1 flex items-center">
              <input 
                type="text" 
                name="domain" 
                id="domain" 
                v-model="boutiqueForm.domain" 
                @input="sanitizeSubdomain"
                placeholder="ex: jeansfashion" 
                pattern="[a-z0-9-]+"
                class="block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              >
              <span class="ml-2 text-gray-500 whitespace-nowrap">.uber-market.com</span>
            </div>
            <p class="mt-1 text-xs text-gray-500">Utilisez uniquement des lettres minuscules, chiffres et tirets</p>
            <p v-if="boutiqueForm.domain" class="mt-1 text-sm text-primary font-medium">Votre boutique sera accessible sur : <span class="font-semibold">{{ boutiqueForm.domain }}.uber-market.com</span></p>
          </div>
        </div>
        
        <!-- <div>
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
        </div> -->
        
        <div v-if="submitError" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg" role="alert">
          <span class="block sm:inline">{{ submitError }}</span>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <NuxtLink to="/mes-boutiques" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Annuler
          </NuxtLink>
          <button 
            type="submit" 
            :disabled="isSubmitting"
            :class="{'opacity-50 cursor-not-allowed': isSubmitting, 'hover:bg-secondary': !isSubmitting}"
            class="relative px-4 py-2 bg-primary text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span v-if="isSubmitting" class="inline-flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création en cours...
            </span>
            <span v-else>Créer la boutique</span>
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
const showTypeInfo = ref(false)
const showProductTypeInfo = ref(false)

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

const sanitizeSubdomain = () => {
  // Nettoyer la saisie : minuscules uniquement, remplacer espaces par tirets, supprimer caractères spéciaux
  boutiqueForm.domain = boutiqueForm.domain
    .toLowerCase()
    .replace(/\s+/g, '-')  // Remplacer espaces par tirets
    .replace(/[^a-z0-9-]/g, '')  // Supprimer tout sauf lettres, chiffres et tirets
    .replace(/-+/g, '-')  // Remplacer plusieurs tirets consécutifs par un seul
    .replace(/^-+|-+$/g, '')  // Supprimer tirets au début et à la fin
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>