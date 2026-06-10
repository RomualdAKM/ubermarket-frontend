<template>
  <div class="min-h-screen flex items-center justify-center bg-white py-4 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-6">
      <div>
        <h2 class="mt-4 text-center text-2xl font-extrabold text-gray-900">Inscription vendeur</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <NuxtLink :to="connexionLink" class="font-medium text-primary hover:text-secondary">
            connectez-vous à votre compte vendeur
          </NuxtLink>
        </p>
      </div>

      <!-- Bannière affilié détecté automatiquement -->
      <div v-if="detectedAffiliate" class="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p class="text-sm font-medium text-primary">
          🎉 Vous avez été invité par <strong>{{ detectedAffiliate.name }}</strong>
        </p>
        <p class="text-xs text-gray-500 mt-1">
          Code : <span class="font-mono font-bold">{{ referralCode }}</span>
          <span class="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
            {{ detectedAffiliate.type === 'commercial' ? 'Affilié commercial' : 'Parrain' }}
          </span>
        </p>
      </div>

      <form class="mt-4 space-y-4" @submit.prevent="handleSignup">
        <div class="space-y-4">

          <!-- Prénom + Nom -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                id="first_name" type="text" autocomplete="given-name" required
                v-model="firstName" @blur="validateField('firstName')"
                :class="{'border-red-500': errors.firstName}"
                class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                placeholder="Jean"
              >
              <p v-if="errors.firstName" class="mt-1 text-xs text-red-600">{{ errors.firstName }}</p>
            </div>
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                id="last_name" type="text" autocomplete="family-name" required
                v-model="lastName" @blur="validateField('lastName')"
                :class="{'border-red-500': errors.lastName}"
                class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                placeholder="Dupont"
              >
              <p v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</p>
            </div>
          </div>

          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email-address" name="email" type="email" autocomplete="email" required
              v-model="email" @blur="validateField('email')"
              :class="{'border-red-500': errors.email}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="jean@example.com"
            >
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              id="phone" name="phone" type="tel" autocomplete="tel" required
              v-model="phone" @blur="validateField('phone')"
              :class="{'border-red-500': errors.phone}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="+22990000000"
            >
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <div>
            <label for="country" class="block text-sm font-medium text-gray-700">Pays</label>
            <select
              id="country" required v-model="country" @blur="validateField('country')"
              :class="{'border-red-500': errors.country}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary bg-white transition-colors duration-200"
            >
              <option value="">Sélectionnez un pays</option>
              <option v-for="c in countries" :key="c.code" :value="c.code">{{ c.name }}</option>
            </select>
            <p v-if="errors.country" class="mt-1 text-sm text-red-600">{{ errors.country }}</p>
          </div>

          <!-- Code parrainage / affiliation -->
          <div>
            <label for="referral-code" class="block text-sm font-medium text-gray-700">
              Code parrain / affilié
              <span class="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <div class="relative">
              <input
                id="referral-code" type="text"
                v-model="referralCode"
                @blur="validateReferralCode"
                @input="referralCode = referralCode.toUpperCase()"
                :readonly="!!refFromUrl"
                :class="{
                  'border-red-500': referralCodeError,
                  'border-green-500': referralCodeValid,
                  'bg-gray-50 cursor-not-allowed': !!refFromUrl
                }"
                class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200 uppercase"
                placeholder="Ex : 0UGIYNRC"
                maxlength="10"
              >
              <span v-if="isValidatingReferral" class="absolute right-2 top-1/2 -translate-y-1/2">
                <svg class="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </span>
              <span v-else-if="referralCodeValid" class="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </span>
            </div>
            <p v-if="referralCodeError" class="mt-1 text-sm text-red-600">{{ referralCodeError }}</p>
            <p v-else-if="referralCodeValid && referrerName" class="mt-1 text-sm text-green-600">
              ✓ {{ referralType === 'commercial' ? 'Affilié commercial' : 'Parrain' }} : {{ referrerName }}
            </p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              id="password" type="password" autocomplete="new-password" required
              v-model="password" @blur="validateField('password')"
              :class="{'border-red-500': errors.password}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Min. 8 caractères, majuscule, minuscule et chiffre"
            >
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <div>
            <label for="password-confirm" class="block text-sm font-medium text-gray-700">Confirmation du mot de passe</label>
            <input
              id="password-confirm" type="password" autocomplete="new-password" required
              v-model="passwordConfirm" @blur="validateField('passwordConfirm')"
              :class="{'border-red-500': errors.passwordConfirm}"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Confirmez votre mot de passe"
            >
            <p v-if="errors.passwordConfirm" class="mt-1 text-sm text-red-600">{{ errors.passwordConfirm }}</p>
          </div>
        </div>

        <div v-if="submitError" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative">
          {{ submitError }}
        </div>

        <div class="flex items-start">
          <input
            id="terms" type="checkbox" required v-model="acceptTerms"
            @change="validateField('acceptTerms')"
            :class="{'border-red-500': errors.acceptTerms}"
            class="h-4 w-4 mt-0.5 text-primary focus:ring-primary border-gray-300 rounded"
          >
          <div class="ml-3 text-sm">
            <label for="terms" class="font-medium text-gray-700">
              J'accepte les
              <NuxtLink to="/conditions" target="_blank" class="text-primary hover:text-secondary">
                conditions générales d'utilisation et d'inscription (CGU & CGI)
              </NuxtLink>
            </label>
            <p v-if="errors.acceptTerms" class="mt-1 text-sm text-red-600">{{ errors.acceptTerms }}</p>
          </div>
        </div>

        <button
          type="submit"
          :disabled="!isFormValid || isSubmitting"
          :class="{'opacity-50 cursor-not-allowed': !isFormValid || isSubmitting, 'hover:bg-secondary': isFormValid && !isSubmitting}"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md"
        >
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <svg v-else class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </span>
          {{ isSubmitting ? 'Inscription en cours...' : "S'inscrire" }}
        </button>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <NuxtLink :to="connexionLink" class="font-medium text-primary hover:text-secondary">
            connectez-vous à votre compte vendeur
          </NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import type { RegisterData } from '~/types/auth'
  import { useAuth } from '~/composables/useAuth'

  useHead({
    title: 'Inscription Vendeur - Lancez votre site en 1m30s | Uber-Market',
    meta: [
      { name: 'description', content: 'Lancer votre site en 1mn 30S — solution clé en main pour site web et e-commerce.' },
      { name: 'robots', content: 'index, follow' }
    ]
  })

  const config     = useRuntimeConfig()
  const route      = useRoute()
  const router     = useRouter()
  const { register } = useAuth()

  // Query params
  const redirectTo   = computed(() => route.query.redirect as string || '')
  const prefillEmail = computed(() => route.query.email as string || '')
  const refFromUrl   = computed(() => (route.query.ref as string || '').toUpperCase())

  const connexionLink = computed(() => {
    let link = '/connexion-vendeur'
    const params: string[] = []
    if (redirectTo.value) params.push(`redirect=${encodeURIComponent(redirectTo.value)}`)
    if (prefillEmail.value) params.push(`email=${encodeURIComponent(prefillEmail.value)}`)
    return params.length ? link + '?' + params.join('&') : link
  })

  // Champs formulaire
  const firstName      = ref('')
  const lastName       = ref('')
  const email          = ref('')
  const phone          = ref('')
  const country        = ref('')
  const password       = ref('')
  const passwordConfirm = ref('')
  const acceptTerms    = ref(false)
  const isSubmitting   = ref(false)
  const submitError    = ref('')

  // Parrainage
  const referralCode       = ref('')
  const referralCodeError  = ref('')
  const referralCodeValid  = ref(false)
  const referrerName       = ref('')
  const referralType       = ref<'standard' | 'commercial' | ''>('')
  const isValidatingReferral = ref(false)
  const detectedAffiliate  = ref<{ name: string; type: string } | null>(null)

  // Pré-remplir depuis URL
  watch(prefillEmail, v => { if (v && !email.value) email.value = v }, { immediate: true })

  // Détection automatique du code affilié depuis l'URL
  watch(refFromUrl, async (code) => {
    if (code) {
      referralCode.value = code
      await validateReferralCode()
    }
  }, { immediate: true })

  // Pays
  const countries = ref<{ code: string; name: string }[]>([])
  onMounted(async () => {
    try {
      const res  = await fetch(`${config.public.apiBase}/countries`)
      const data = await res.json()
      if (data.success) countries.value = data.countries
    } catch {}
  })

  // Erreurs
  const errors = reactive({
    firstName: '', lastName: '', email: '', phone: '',
    country: '', password: '', passwordConfirm: '', acceptTerms: ''
  })

  const isFormValid = computed(() =>
    firstName.value.trim() !== '' &&
    lastName.value.trim() !== '' &&
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

  const validateField = (field: string) => {
    switch (field) {
      case 'firstName':
        errors.firstName = firstName.value.trim() === '' ? 'Le prénom est requis.' : ''
        break
      case 'lastName':
        errors.lastName = lastName.value.trim() === '' ? 'Le nom est requis.' : ''
        break
      case 'email':
        if (!email.value.trim()) errors.email = 'L\'e-mail est requis.'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.email = 'E-mail invalide.'
        else errors.email = ''
        break
      case 'phone':
        if (!phone.value.trim()) errors.phone = 'Le téléphone est requis.'
        else if (!/^\+[1-9]\d{1,14}$/.test(phone.value)) errors.phone = 'Format international requis (ex: +22990000000).'
        else errors.phone = ''
        break
      case 'country':
        errors.country = !country.value ? 'Sélectionnez un pays.' : ''
        break
      case 'password':
        if (!password.value) errors.password = 'Le mot de passe est requis.'
        else if (password.value.length < 8) errors.password = 'Minimum 8 caractères.'
        else if (!/[A-Z]/.test(password.value)) errors.password = 'Au moins une majuscule.'
        else if (!/[a-z]/.test(password.value)) errors.password = 'Au moins une minuscule.'
        else if (!/[0-9]/.test(password.value)) errors.password = 'Au moins un chiffre.'
        else errors.password = ''
        if (passwordConfirm.value) {
          errors.passwordConfirm = password.value !== passwordConfirm.value ? 'Les mots de passe ne correspondent pas.' : ''
        }
        break
      case 'passwordConfirm':
        errors.passwordConfirm = !passwordConfirm.value ? 'Confirmez votre mot de passe.'
          : password.value !== passwordConfirm.value ? 'Les mots de passe ne correspondent pas.' : ''
        break
      case 'acceptTerms':
        errors.acceptTerms = !acceptTerms.value ? 'Vous devez accepter les CGU.' : ''
        break
    }
  }

  // Validation du code parrain/affilié
  const validateReferralCode = async () => {
    referralCodeError.value = ''
    referralCodeValid.value = false
    referrerName.value      = ''
    referralType.value      = ''
    detectedAffiliate.value = null

    if (!referralCode.value.trim()) return

    isValidatingReferral.value = true
    try {
      const res  = await fetch(`${config.public.apiBase}/referral/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ code: referralCode.value.trim() })
      })
      const data = await res.json()

      if (data.valid) {
        referralCodeValid.value = true
        referrerName.value      = data.referrer?.name || ''
        referralType.value      = data.type           // 'commercial' ou 'standard'
        detectedAffiliate.value = { name: data.referrer?.name || '', type: data.type }
      } else {
        referralCodeError.value = 'Code d\'affiliation invalide.'
      }
    } catch {
      // Silencieux si réseau down
    } finally {
      isValidatingReferral.value = false
    }
  }

  const validateForm = () => {
    validateField('firstName')
    validateField('lastName')
    validateField('email')
    validateField('phone')
    validateField('country')
    validateField('password')
    validateField('passwordConfirm')
    validateField('acceptTerms')
    return Object.values(errors).every(e => e === '')
  }

  const handleSignup = async () => {
    submitError.value = ''
    canUpgrade.value  = false
    if (!validateForm()) return
    if (password.value !== passwordConfirm.value) {
      errors.passwordConfirm = 'Les mots de passe ne correspondent pas.'
      return
    }

    isSubmitting.value = true
    try {
      // ✅ registerData avec UTM — remplace l'ancien registerData
      const registerData: any = {
        name:                  `${firstName.value} ${lastName.value}`.trim(),
        first_name:            firstName.value,
        last_name:             lastName.value,
        email:                 email.value,
        phone:                 phone.value,
        country:               country.value,
        password:              password.value,
        password_confirmation: passwordConfirm.value,
        // Tracking campagnes : récupère automatiquement ref, utm_source etc. depuis l'URL
        ...utmParams.value,
      }

      if (referralCode.value.trim()) {
        registerData.referral_code = referralCode.value.trim()
        registerData.ref           = referralCode.value.trim()
      }

      const response = await register(registerData)
      if (response.success) {
        await router.push(redirectTo.value || '/mes-boutiques')
      }
    } catch (err: any) {
      submitError.value = err.message || 'Une erreur est survenue.'
      if (err.canUpgrade) canUpgrade.value = true
    } finally {
      isSubmitting.value = false
    }
  }

  // UTM à l'inscription
  const utmParams = computed(() => ({
    ref:              (route.query.ref              as string) || null,
    utm_source:       (route.query.utm_source       as string) || null,
    utm_medium:       (route.query.utm_medium       as string) || null,
    utm_campaign:     (route.query.utm_campaign     as string) || null,
    utm_content:      (route.query.utm_content      as string) || null,
    landing_page:     (route.query.from             as string) || route.path || null,
    acquisition_source: (route.query.ref            as string) || null,
  }))
</script>