<template>
  <div class="min-h-screen flex items-center justify-center bg-white py-4 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-6">
      <div>
        <h2 class="mt-4 text-center text-2xl font-extrabold text-gray-900">
          Inscription vendeur
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <NuxtLink to="/connexion-vendeur" class="font-medium text-primary hover:text-secondary">
            connectez-vous à votre compte vendeur
          </NuxtLink>
        </p>
      </div>
      <form class="mt-4 space-y-4" @submit.prevent="handleSignup">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nom complet</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              autocomplete="name" 
              required 
              v-model="name" 
              @blur="validateField('name')" 
              :class="{'border-red-500': errors.name}" 
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
              placeholder="Prénom et nom (ex. : Jean Dupont)"
            >
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
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
            <label for="phone" class="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
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
              placeholder="Format international (ex. : +33612345678)"
            >
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>
          
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700">Pays</label>
            <select 
              id="country" 
              name="country" 
              required 
              v-model="country" 
              @blur="validateField('country')" 
              :class="{'border-red-500': errors.country}" 
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary bg-white transition-colors duration-200"
            >
              <option value="">Sélectionnez un pays</option>
              <option v-for="countryOption in countries" :key="countryOption.code" :value="countryOption.code">
                {{ countryOption.name }}
              </option>
            </select>
            <p v-if="errors.country" class="mt-1 text-sm text-red-600">{{ errors.country }}</p>
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
              placeholder="Minimum 8 caractères, avec majuscule, minuscule et chiffre"
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

        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input 
              id="terms" 
              name="terms" 
              type="checkbox" 
              required 
              v-model="acceptTerms" 
              @change="validateField('acceptTerms')" 
              :class="{'border-red-500': errors.acceptTerms}" 
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            >
          </div>
          <div class="ml-3 text-sm">
            <label for="terms" class="font-medium text-gray-700">
              J'accepte les <a href="#" class="text-primary hover:text-secondary">conditions générales d'utilisation</a>
            </label>
            <p v-if="errors.acceptTerms" class="mt-1 text-sm text-red-600">{{ errors.acceptTerms }}</p>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="!isFormValid || isSubmitting" 
            :class="{'opacity-50 cursor-not-allowed': !isFormValid || isSubmitting, 'hover:bg-secondary': isFormValid && !isSubmitting}"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md"
          >
            <span v-if="!isSubmitting" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </span>
            <span v-if="isSubmitting" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isSubmitting ? 'Inscription en cours...' : "S'inscrire" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { RegisterData } from '~/types/auth'
import { useAuth } from '~/composables/useAuth'

const config = useRuntimeConfig()
const router = useRouter()
const { register } = useAuth()

// Données du formulaire
const name = ref('')
const email = ref('')
const phone = ref('')
const country = ref('')
const password = ref('')
const passwordConfirm = ref('')
const acceptTerms = ref(false)
const isSubmitting = ref(false)
const submitError = ref('')

// Erreurs de validation
const errors = reactive({
  name: '',
  email: '',
  phone: '',
  country: '',
  password: '',
  passwordConfirm: '',
  acceptTerms: ''
})

// Liste des pays (chargee depuis l'API)
const countries = ref<{code: string, name: string}[]>([])

// Charger les pays au montage
onMounted(async () => {
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

// Validation du formulaire
const isFormValid = computed(() => {
  return (
    name.value.trim() !== '' &&
    email.value.trim() !== '' &&
    phone.value.trim() !== '' &&
    country.value !== '' &&
    password.value.length >= 8 &&
    /[A-Z]/.test(password.value) &&
    /[a-z]/.test(password.value) &&
    /[0-9]/.test(password.value) &&
    password.value === passwordConfirm.value &&
    acceptTerms.value === true
  )
})

// Validation des champs individuels
const validateField = (field: string) => {
  switch (field) {
    case 'name':
      errors.name = name.value.trim() === '' ? 'Le nom complet est requis.' : ''
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
      if (phone.value.trim() === '') {
        errors.phone = 'Le numéro de téléphone est requis.'
      } else if (!/^\+[1-9]\d{1,14}$/.test(phone.value)) {
        errors.phone = 'Veuillez entrer un numéro de téléphone au format international (ex. : +33612345678).'
      } else {
        errors.phone = ''
      }
      break
    case 'country':
      errors.country = country.value === '' ? 'Veuillez sélectionner un pays.' : ''
      break
    case 'password':
      if (password.value.length === 0) {
        errors.password = 'Le mot de passe est requis.'
      } else if (password.value.length < 8) {
        errors.password = 'Le mot de passe doit contenir au moins 8 caractères.'
      } else if (!/[A-Z]/.test(password.value)) {
        errors.password = 'Le mot de passe doit contenir au moins une majuscule.'
      } else if (!/[a-z]/.test(password.value)) {
        errors.password = 'Le mot de passe doit contenir au moins une minuscule.'
      } else if (!/[0-9]/.test(password.value)) {
        errors.password = 'Le mot de passe doit contenir au moins un chiffre.'
      } else {
        errors.password = ''
      }
      // Vérifier la confirmation du mot de passe si elle a déjà été remplie
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
    case 'acceptTerms':
      errors.acceptTerms = !acceptTerms.value ? 'Vous devez accepter les conditions d\'utilisation.' : ''
      break
  }
}

// Valider tous les champs
const validateForm = () => {
  validateField('name')
  validateField('email')
  validateField('phone')
  validateField('country')
  validateField('password')
  validateField('passwordConfirm')
  validateField('acceptTerms')
  
  // Retourner true si aucune erreur
  return Object.values(errors).every(error => error === '')
}

const handleSignup = async () => {
  // Réinitialiser les erreurs
  submitError.value = ''
  
  // Valider le formulaire
  if (!validateForm()) {
    return
  }
  
  // Vérifier que les mots de passe correspondent
  if (password.value !== passwordConfirm.value) {
    errors.passwordConfirm = 'Les mots de passe ne correspondent pas.'
    return
  }
  
  isSubmitting.value = true
  
  try {
    const registerData: RegisterData = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      country: country.value,
      password: password.value,
      password_confirmation: passwordConfirm.value
    }
    
    const response = await register(registerData)
    
    if (response.success) {
      // Redirection vers la page des boutiques
      await router.push('/mes-boutiques')
    }
  } catch (error: any) {
    submitError.value = error.message || 'Une erreur est survenue lors de l\'inscription.'
    
    // Gérer les erreurs de validation du serveur
    if (error.response?.data?.errors) {
      const serverErrors = error.response.data.errors
      Object.keys(serverErrors).forEach(field => {
        if (errors.hasOwnProperty(field)) {
          errors[field as keyof typeof errors] = serverErrors[field][0]
        }
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>