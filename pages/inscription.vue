<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-4 text-center text-xl font-extrabold text-gray-900">
          Créez votre compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <NuxtLink to="/connexion" class="font-medium text-blue-600 hover:text-blue-500">
            connectez-vous à votre compte existant
          </NuxtLink>
        </p>
      </div>
      
      <!-- Messages d'erreur -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-sm text-red-800">{{ errorMessage }}</p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div class="space-y-4">
          <div>
            <label for="name" class="sr-only">Nom complet</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              autocomplete="name" 
              required 
              v-model="name" 
             class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
              placeholder="Nom complet"
            >
          </div>
          <div>
            <label for="email-address" class="sr-only">Adresse e-mail</label>
            <input 
              id="email-address" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              v-model="email" 
             class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
              placeholder="Adresse e-mail"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="new-password" 
              required 
              v-model="password" 
             class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
              placeholder="Mot de passe (min. 8 caractères)"
            >
            <p class="mt-1 text-xs text-gray-500">Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.</p>
          </div>
          <div>
            <label for="password-confirm" class="sr-only">Confirmez le mot de passe</label>
            <input 
              id="password-confirm" 
              name="password-confirm" 
              type="password" 
              autocomplete="new-password" 
              required 
              v-model="passwordConfirm" 
             class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
              placeholder="Confirmez le mot de passe"
            >
          </div>
        </div>

        <div class="flex items-center">
          <input 
            id="terms" 
            name="terms" 
            type="checkbox" 
            required 
            v-model="acceptTerms" 
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          >
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            J'accepte les 
            <NuxtLink 
              v-if="shopSubdomain" 
              :to="`/boutique/${shopSubdomain}/cgu`" 
              target="_blank"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              CGU
            </NuxtLink>
            <span v-else class="font-medium text-gray-600">CGU</span>
            <!-- et 
            <NuxtLink 
              v-if="shopSubdomain" 
              :to="`/boutique/${shopSubdomain}/cgv`" 
              target="_blank"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              CGV
            </NuxtLink>
            <span v-else class="font-medium text-gray-600">CGV</span> -->
            <span v-if="shopSubdomain"> de la boutique</span>
          </label>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="!isLoading" class="h-5 w-5 text-blue-500 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              <svg v-else class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Inscription en cours...' : 'S\'inscrire' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { setToken, setUser } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const acceptTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Extraire le subdomain depuis le paramètre redirect
const shopSubdomain = computed(() => {
  const redirect = route.query.redirect as string
  if (!redirect) return null
  
  // Chercher le pattern /boutique/{subdomain}
  const match = redirect.match(/\/boutique\/([^\/]+)/)
  return match ? match[1] : null
})

const handleSignup = async () => {
  // Vérifier que les mots de passe correspondent
  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  
  if (!acceptTerms.value) {
    errorMessage.value = 'Vous devez accepter les conditions générales.'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBase}/client/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: passwordConfirm.value
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'inscription')
    }
    
    if (data.success) {
      // Stocker le token
      setToken(data.token)
      
      // Stocker l'utilisateur
      setUser(data.user)
      
      // Récupérer l'URL de redirection depuis les query params
      const redirectTo = route.query.redirect as string
      
      // Sauvegarder l'URL de la boutique dans le localStorage si applicable
      if (redirectTo && redirectTo.includes('/boutique/')) {
        const match = redirectTo.match(/(\/boutique\/[^\/]+)/)
        if (match && process.client) {
          localStorage.setItem('last_shop_url', match[1])
        }
      }
      
      // Redirection vers l'URL demandée ou vers le dashboard client
      await router.push(redirectTo || '/dashboard-client/profil')
    } else {
      errorMessage.value = data.message || 'Erreur lors de l\'inscription'
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}
</script>