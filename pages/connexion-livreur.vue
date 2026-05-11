<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-2xl font-extrabold text-gray-900">
          Connexion Livreur
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Accédez à votre espace de livraison
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
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
              class="mt-1 block w-full px-3 py-3 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200 text-base"
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
              class="mt-1 block w-full px-3 py-3 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200 text-base"
              placeholder="Mot de passe"
            >
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isSubmitting"
            :class="{'opacity-50 cursor-not-allowed': isSubmitting, 'hover:bg-secondary': !isSubmitting}"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md min-h-[48px]"
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
                class="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
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
            <h3 class="text-sm font-medium text-red-800">{{ loginError }}</h3>
          </div>
        </div>
      </div>

      <!-- Lien inscription -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Pas encore inscrit ?
          <NuxtLink to="/inscription-livreur" class="font-medium text-primary hover:text-secondary">
            Créer un compte
          </NuxtLink>
        </p>
      </div>

      <!-- Lien retour -->
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-gray-500 hover:text-primary transition-colors">
          ← Retour à l'accueil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const router = useRouter()
const { courierLogin, isAuthenticated } = useCourierDashboard()

// Rediriger si déjà connecté
onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/dashboard-courier/livraisons')
  }
})

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const loginError = ref('')

const errors = reactive({
  email: '',
  password: ''
})

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

const validateForm = () => {
  validateField('email')
  validateField('password')
  return Object.values(errors).every(error => error === '')
}

const handleLogin = async () => {
  loginError.value = ''
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    const response = await courierLogin(email.value, password.value)
    if (response.success) {
      await router.push('/dashboard-courier/livraisons')
    }
  } catch (error: any) {
    loginError.value = error.message || 'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
