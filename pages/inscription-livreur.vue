<template>
  <div class="min-h-screen flex items-center justify-center bg-white py-4 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-6">
      <div>
        <h2 class="mt-4 text-center text-2xl font-extrabold text-gray-900">
          Inscription Livreur
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Rejoignez la flotte UberMarket
        </p>
      </div>

      <!-- Message de succès -->
      <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ successMessage }}</span>
      </div>

      <form v-if="!successMessage" class="mt-4 space-y-4" @submit.prevent="handleSignup">
        <div class="space-y-4">
          <div>
            <label for="last_name" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              autocomplete="family-name"
              required
              v-model="lastName"
              @blur="validateField('lastName')"
              :class="{'border-red-500': errors.lastName}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Votre nom de famille"
            >
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
          </div>

          <div>
            <label for="first_name" class="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              autocomplete="given-name"
              required
              v-model="firstName"
              @blur="validateField('firstName')"
              :class="{'border-red-500': errors.firstName}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Votre prénom"
            >
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
          </div>

          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              @blur="validateField('email')"
              :class="{'border-red-500': errors.email}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Adresse e-mail valide (ex. : jean@example.com)"
            >
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autocomplete="tel"
              required
              v-model="phone"
              @blur="validateField('phone')"
              :class="{'border-red-500': errors.phone}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Numéro de téléphone (ex. : +33612345678)"
            >
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <div>
            <label for="city" class="block text-sm font-medium text-gray-700">Ville</label>
            <input
              id="city"
              name="city"
              type="text"
              autocomplete="address-level2"
              required
              v-model="city"
              @blur="validateField('city')"
              :class="{'border-red-500': errors.city}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Votre ville de livraison"
            >
            <p v-if="errors.city" class="mt-1 text-sm text-red-600">{{ errors.city }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              v-model="password"
              @blur="validateField('password')"
              :class="{'border-red-500': errors.password}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Minimum 8 caractères"
            >
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <div>
            <label for="password-confirm" class="block text-sm font-medium text-gray-700">Confirmation du mot de passe</label>
            <input
              id="password-confirm"
              name="password-confirm"
              type="password"
              autocomplete="new-password"
              required
              v-model="passwordConfirm"
              @blur="validateField('passwordConfirm')"
              :class="{'border-red-500': errors.passwordConfirm}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Confirmez votre mot de passe"
            >
            <p v-if="errors.passwordConfirm" class="mt-1 text-sm text-red-600">{{ errors.passwordConfirm }}</p>
          </div>
        </div>

        <div v-if="submitError" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ submitError }}</span>
        </div>

        <div>
          <button
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            :class="{'opacity-50 cursor-not-allowed': !isFormValid || isSubmitting, 'hover:bg-secondary': isFormValid && !isSubmitting}"
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </span>
            {{ isSubmitting ? 'Inscription en cours...' : "S'inscrire" }}
          </button>
        </div>
      </form>

      <!-- Lien connexion -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Déjà inscrit ?
          <NuxtLink to="/connexion-livreur" class="font-medium text-primary hover:text-secondary">
            Se connecter
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

useHead({
  title: 'Inscription Livreur - UberMarket',
  meta: [
    {
      name: 'description',
      content: 'Inscrivez-vous en tant que livreur sur UberMarket et rejoignez notre flotte de livraison.'
    }
  ]
})

const config = useRuntimeConfig()
const router = useRouter()

// Données du formulaire
const lastName = ref('')
const firstName = ref('')
const email = ref('')
const phone = ref('')
const city = ref('')
const password = ref('')
const passwordConfirm = ref('')
const isSubmitting = ref(false)
const submitError = ref('')
const successMessage = ref('')

// Erreurs de validation
const errors = reactive({
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
  city: '',
  password: '',
  passwordConfirm: ''
})

// Validation du formulaire
const isFormValid = computed(() => {
  return (
    lastName.value.trim() !== '' &&
    firstName.value.trim() !== '' &&
    email.value.trim() !== '' &&
    phone.value.trim() !== '' &&
    city.value.trim() !== '' &&
    password.value.length >= 8 &&
    password.value === passwordConfirm.value
  )
})

// Validation des champs individuels
const validateField = (field: string) => {
  switch (field) {
    case 'lastName':
      errors.lastName = lastName.value.trim() === '' ? 'Le nom est requis.' : ''
      break
    case 'firstName':
      errors.firstName = firstName.value.trim() === '' ? 'Le prénom est requis.' : ''
      break
    case 'email':
      if (email.value.trim() === '') {
        errors.email = 'L\'adresse e-mail est requise.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = 'Veuillez entrer une adresse e-mail valide.'
      } else {
        errors.email = ''
      }
      break
    case 'phone':
      errors.phone = phone.value.trim() === '' ? 'Le numéro de téléphone est requis.' : ''
      break
    case 'city':
      errors.city = city.value.trim() === '' ? 'La ville est requise.' : ''
      break
    case 'password':
      if (password.value.length === 0) {
        errors.password = 'Le mot de passe est requis.'
      } else if (password.value.length < 8) {
        errors.password = 'Le mot de passe doit contenir au moins 8 caractères.'
      } else {
        errors.password = ''
      }
      if (passwordConfirm.value && password.value !== passwordConfirm.value) {
        errors.passwordConfirm = 'Les mots de passe ne correspondent pas.'
      } else if (password.value === passwordConfirm.value) {
        errors.passwordConfirm = ''
      }
      break
    case 'passwordConfirm':
      if (passwordConfirm.value.length === 0) {
        errors.passwordConfirm = 'Veuillez confirmer votre mot de passe.'
      } else if (password.value !== passwordConfirm.value) {
        errors.passwordConfirm = 'Les mots de passe ne correspondent pas.'
      } else {
        errors.passwordConfirm = ''
      }
      break
  }
}

// Valider tous les champs
const validateForm = () => {
  validateField('lastName')
  validateField('firstName')
  validateField('email')
  validateField('phone')
  validateField('city')
  validateField('password')
  validateField('passwordConfirm')
  return Object.values(errors).every(error => error === '')
}

const handleSignup = async () => {
  submitError.value = ''

  if (!validateForm()) return

  if (password.value !== passwordConfirm.value) {
    errors.passwordConfirm = 'Les mots de passe ne correspondent pas.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await fetch(`${config.public.apiBase}/courier/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        last_name: lastName.value,
        first_name: firstName.value,
        email: email.value,
        phone: phone.value,
        city: city.value,
        password: password.value,
        password_confirmation: passwordConfirm.value
      })
    })

    const data = await response.json()

    if (response.ok && data.success !== false) {
      successMessage.value = 'Inscription réussie ! Redirection vers la page de connexion...'
      setTimeout(() => {
        router.push('/connexion-livreur')
      }, 2000)
    } else {
      // Gérer les erreurs de validation du serveur
      if (data.errors) {
        const serverErrors = data.errors
        if (serverErrors.last_name) errors.lastName = serverErrors.last_name[0]
        if (serverErrors.first_name) errors.firstName = serverErrors.first_name[0]
        if (serverErrors.email) errors.email = serverErrors.email[0]
        if (serverErrors.phone) errors.phone = serverErrors.phone[0]
        if (serverErrors.city) errors.city = serverErrors.city[0]
        if (serverErrors.password) errors.password = serverErrors.password[0]
      }
      submitError.value = data.message || 'Une erreur est survenue lors de l\'inscription.'
    }
  } catch (error: any) {
    submitError.value = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
