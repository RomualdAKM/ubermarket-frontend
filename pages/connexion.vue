<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-4 text-center text-xl font-extrabold text-gray-900">
          Connectez-vous à votre compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <NuxtLink to="/inscription" class="font-medium text-blue-600 hover:text-blue-500">
            créez un compte gratuitement
          </NuxtLink>
        </p>
      </div>
      
      <!-- Messages d'erreur -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-sm text-red-800">{{ errorMessage }}</p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input type="hidden" name="remember" value="true">
        <div class=" space-y-4">
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
              autocomplete="current-password" 
              required 
              v-model="password" 
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
              placeholder="Mot de passe"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              v-model="rememberMe" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Se souvenir de moi
            </label>
          </div>

          <div class="text-sm">
            <button type="button" @click="showForgotModal = true" class="font-medium text-blue-600 hover:text-blue-500">
              Mot de passe oublié?
            </button>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="!isLoading" class="h-5 w-5 text-blue-500 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <svg v-else class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Modal Mot de passe oublié -->
    <Teleport to="body">
      <div v-if="showForgotModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="closeForgotModal"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
          <button @click="closeForgotModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Mot de passe oublié</h3>
          <p class="text-sm text-gray-600 mb-4">Entrez votre adresse email pour recevoir un mot de passe temporaire.</p>
          
          <div v-if="forgotSuccess" class="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <p class="text-sm text-green-800">{{ forgotSuccess }}</p>
          </div>
          
          <div v-if="forgotError" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p class="text-sm text-red-800">{{ forgotError }}</p>
          </div>
          
          <form v-if="!forgotSuccess" @submit.prevent="handleForgotPassword">
            <input
              v-model="forgotEmail"
              type="email"
              required
              placeholder="Votre adresse email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <button
              type="submit"
              :disabled="isForgotLoading"
              class="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg v-if="isForgotLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isForgotLoading ? 'Envoi en cours...' : 'Envoyer' }}
            </button>
          </form>
          
          <button v-else @click="closeForgotModal" class="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Fermer
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { setToken, setUser } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Modal mot de passe oublié
const showForgotModal = ref(false)
const forgotEmail = ref('')
const isForgotLoading = ref(false)
const forgotError = ref('')
const forgotSuccess = ref('')

const closeForgotModal = () => {
  showForgotModal.value = false
  forgotEmail.value = ''
  forgotError.value = ''
  forgotSuccess.value = ''
}

const handleForgotPassword = async () => {
  isForgotLoading.value = true
  forgotError.value = ''
  forgotSuccess.value = ''
  
  try {
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBase}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email: forgotEmail.value })
    })
    
    const data = await response.json()
    
    if (data.success) {
      forgotSuccess.value = data.message
    } else {
      forgotError.value = data.message || 'Une erreur est survenue'
    }
  } catch (err: any) {
    forgotError.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    isForgotLoading.value = false
  }
}

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBase}/client/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la connexion')
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
      errorMessage.value = data.message || 'Identifiants invalides'
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}
</script>