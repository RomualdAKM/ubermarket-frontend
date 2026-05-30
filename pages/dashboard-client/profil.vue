<template>
  <div>
    <div class="bg-white rounded-lg p-6">
      <h2 class="text-xl font-light text-gray-900 mb-6">Mes Informations Personnelles</h2>
      
      <!-- Message de succès -->
      <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
        <p class="text-sm text-green-800">{{ successMessage }}</p>
      </div>
      
      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-800">{{ errorMessage }}</p>
      </div>
      
      <!-- Chargement -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Chargement...</p>
      </div>
      
      <form v-else @submit.prevent="updateProfile" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
          <input 
            v-model="profile.name" 
            type="text" 
            required
            class="w-full px-4 py-3 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            v-model="profile.email" 
            type="email" 
            required
            class="w-full px-4 py-3 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
          <input 
            v-model="profile.phone" 
            type="tel" 
            class="w-full px-4 py-3 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Pays</label>
          <input 
            v-model="profile.country" 
            type="text" 
            class="w-full px-4 py-3 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
        </div>

        <div class="flex justify-end space-x-4">
          <button 
            type="button"
            @click="loadProfile"
            class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            :disabled="isSaving"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'Enregistrement...' : 'Sauvegarder' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'dashboard-client'
})

const router = useRouter()
const { user, fetchUser, token } = useAuth()

const profile = ref({
  name: '',
  email: '',
  phone: '',
  country: ''
})

const isLoading = ref(false)
const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Charger le profil
const loadProfile = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const userData = await fetchUser()
    if (userData) {
      profile.value = {
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        country: userData.country || ''
      }
    }
  } catch (err: any) {
    errorMessage.value = 'Erreur lors du chargement du profil'
  } finally {
    isLoading.value = false
  }
}

// Mettre à jour le profil
const updateProfile = async () => {
  isSaving.value = true
  successMessage.value = ''
  errorMessage.value = ''
  
  try {
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBase}/client/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify(profile.value)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la mise à jour')
    }
    
    if (data.success) {
      successMessage.value = 'Profil mis à jour avec succès'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Une erreur est survenue'
  } finally {
    isSaving.value = false
  }
}

// Charger au montage
onMounted(async () => {
  if (!token.value) {
    //router.push('/connexion')
    router.push(`/connexion?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }
  
  await loadProfile()
})
</script>