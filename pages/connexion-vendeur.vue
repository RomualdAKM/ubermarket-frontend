<template>
  <div class="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-2xl font-extrabold text-gray-900">
          Connexion vendeur
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <NuxtLink :to="inscriptionLink" class="font-medium text-primary hover:text-secondary">
            créez un compte vendeur
          </NuxtLink>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input type="hidden" name="remember" value="true">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700">Adresse e-mail</label>
            <input 
              id="email-address" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              v-model="email" 
              :class="{'border-red-500': errors.email}" 
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Adresse e-mail"
            >
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              v-model="password" 
              :class="{'border-red-500': errors.password}" 
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Mot de passe"
            >
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              v-model="rememberMe" 
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Se souvenir de moi
            </label>
          </div>

          <div class="text-sm">
            <button type="button" @click="showForgotModal = true" class="font-medium text-primary hover:text-secondary">
              Mot de passe oublié?
            </button>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="isSubmitting" 
            :class="{'opacity-50 cursor-not-allowed': isSubmitting, 'hover:bg-secondary': !isSubmitting}"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg 
                v-if="isSubmitting" 
                class="h-5 w-5 text-white animate-spin" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg 
                v-else 
                class="h-5 w-5 text-white group-hover:text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </span>
            Se connecter
          </button>
        </div>
      </form>
      
      <!-- Messages d'erreur -->
      <div v-if="loginError" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ loginError }}
            </h3>
          </div>
        </div>
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
              <button
                type="submit"
                :disabled="isForgotLoading"
                class="mt-4 w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg v-if="isForgotLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isForgotLoading ? 'Envoi en cours...' : 'Envoyer' }}
              </button>
            </form>
            
            <button v-else @click="closeForgotModal" class="mt-4 w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-secondary">
              Fermer
            </button>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import type { LoginData } from '~/types/auth'

const route = useRoute()
const router = useRouter()
const { login } = useAuth()

// Récupérer l'URL de redirection et l'email depuis les query params
const redirectTo = computed(() => route.query.redirect as string || '')
const prefillEmail = computed(() => route.query.email as string || '')

// Lien inscription qui préserve les query params
const inscriptionLink = computed(() => {
  let link = '/inscription-vendeur'
  const params: string[] = []
  if (redirectTo.value) params.push(`redirect=${encodeURIComponent(redirectTo.value)}`)
  if (prefillEmail.value) params.push(`email=${encodeURIComponent(prefillEmail.value)}`)
  if (params.length) link += '?' + params.join('&')
  return link
})

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isSubmitting = ref(false)
const loginError = ref('')

// Pré-remplir l'email depuis les query params (après hydration)
watch(prefillEmail, (newVal) => {
  if (newVal && !email.value) {
    email.value = newVal
  }
}, { immediate: true })

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

// Erreurs de validation
const errors = reactive({
  email: '',
  password: ''
})

// Validation des champs individuels
const validateField = (field: string) => {
  switch (field) {
    case 'email':
      if (email.value.trim() === '') {
        errors.email = 'L\'adresse e-mail est requise.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = 'Veuillez entrer une adresse e-mail valide.'
      } else {
        errors.email = ''
      }
      break
    case 'password':
      errors.password = password.value.trim() === '' ? 'Le mot de passe est requis.' : ''
      break
  }
}

// Valider tous les champs
const validateForm = () => {
  validateField('email')
  validateField('password')
  
  // Retourner true si aucune erreur
  return Object.values(errors).every(error => error === '')
}

const handleLogin = async () => {
  // Réinitialiser les erreurs
  loginError.value = ''
  
  // Valider le formulaire
  if (!validateForm()) {
    return
  }
  
  // Activer l'état de soumission
  isSubmitting.value = true
  
  try {
    const loginData: LoginData = {
      email: email.value,
      password: password.value,
      remember: rememberMe.value
    }
    
    const response = await login(loginData)
    
    if (response.success) {
      // Redirection vers l'URL de redirection ou la page des boutiques
      const destination = redirectTo.value || '/mes-boutiques'
      await router.push(destination)
    }
  } catch (error: any) {
    loginError.value = error.message || 'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
  } finally {
    // Désactiver l'état de soumission
    isSubmitting.value = false
  }
}
</script>