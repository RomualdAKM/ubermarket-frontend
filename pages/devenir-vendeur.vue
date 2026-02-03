<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Devenez vendeur
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Complétez votre profil pour commencer à vendre
        </p>
      </div>

      <!-- Message de succès -->
      <div v-if="showSuccess" class="bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="ml-3 text-sm text-green-800">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Messages d'erreur -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-sm text-red-800">{{ errorMessage }}</p>
      </div>

      <!-- Formulaire -->
      <form class="mt-8 space-y-6" @submit.prevent="handleUpgrade">
        <div class="space-y-4">
          <!-- Téléphone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Numéro de téléphone <span class="text-red-500">*</span>
            </label>
            <input 
              id="phone" 
              v-model="phone"
              type="tel" 
              required
              :disabled="isUpgrading"
              :class="{'border-red-500': errors.phone}"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="+33612345678"
            >
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
            <p class="mt-1 text-xs text-gray-500">Format international (ex: +33612345678)</p>
          </div>

          <!-- Pays -->
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700">
              Pays <span class="text-red-500">*</span>
            </label>
            <select 
              id="country" 
              v-model="country"
              required
              :disabled="isUpgrading"
              :class="{'border-red-500': errors.country}"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Selectionnez un pays</option>
              <option v-for="c in countries" :key="c.code" :value="c.code">{{ c.name }}</option>
            </select>
            <p v-if="errors.country" class="mt-1 text-sm text-red-600">{{ errors.country }}</p>
          </div>
        </div>

        <!-- Informations -->
        <!-- <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">Devenir vendeur sur UberMarket</h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li>Créez votre boutique en ligne</li>
                  <li>Vendez vos produits physiques ou numériques</li>
                  <li>Gérez vos commandes et clients</li>
                  <li>Accédez aux statistiques de vente</li>
                </ul>
              </div>
            </div>
          </div>
        </div> -->

        <!-- Bouton de soumission -->
        <div>
          <button 
            type="submit"
            :disabled="isUpgrading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isUpgrading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </span>
            <span v-if="isUpgrading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isUpgrading ? 'Activation en cours...' : 'Activer mon compte vendeur' }}
          </button>
        </div>

        <!-- Lien retour -->
        <div class="text-center">
          <NuxtLink to="/dashboard-client/profil" class="text-sm text-blue-600 hover:text-blue-500">
            ← Retour à mon profil
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUpgrade } from '~/composables/useUpgrade'
import { useAuth } from '~/composables/useAuth'

const config = useRuntimeConfig()
const router = useRouter()
const { upgradeToVendor, canUpgrade } = useUpgrade()
const { user } = useAuth()

// Liste des pays
const countries = ref<{code: string, name: string}[]>([])

// Rediriger si l'utilisateur n'est pas un client + charger les pays
onMounted(async () => {
  if (!canUpgrade.value) {
    if (!user.value) {
      router.push('/connexion')
    } else if (user.value.role === 'vendor') {
      router.push('/mes-boutiques')
    }
  }
  
  // Charger les pays
  try {
    const response = await fetch(`${config.public.apiBase}/countries`)
    const data = await response.json()
    if (data.success) {
      countries.value = data.countries
    }
  } catch (error) {
    console.error('Erreur chargement pays:', error)
  }
})

const phone = ref('')
const country = ref('')
const isUpgrading = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)
const successMessage = ref('')

const errors = reactive({
  phone: '',
  country: ''
})

const handleUpgrade = async () => {
  // Réinitialiser les erreurs
  errorMessage.value = ''
  errors.phone = ''
  errors.country = ''
  showSuccess.value = false
  
  // Validation basique côté client
  if (!phone.value) {
    errors.phone = 'Le numéro de téléphone est requis.'
    return
  }
  
  if (!country.value) {
    errors.country = 'Veuillez sélectionner un pays.'
    return
  }
  
  isUpgrading.value = true
  
  try {
    const response = await upgradeToVendor({
      phone: phone.value,
      country: country.value
    })
    
    if (response.success) {
      successMessage.value = response.message || 'Votre compte a été converti avec succès !'
      showSuccess.value = true
      
      // Rediriger vers la création de boutique après 2 secondes
      setTimeout(() => {
        router.push('/mes-boutiques')
      }, 2000)
    } else {
      // Gérer les erreurs de validation
      if (response.errors) {
        if (response.errors.phone) {
          errors.phone = response.errors.phone[0]
        }
        if (response.errors.country) {
          errors.country = response.errors.country[0]
        }
      }
      errorMessage.value = response.message || 'Une erreur est survenue.'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Une erreur est survenue lors de la conversion du compte.'
  } finally {
    isUpgrading.value = false
  }
}
</script>
