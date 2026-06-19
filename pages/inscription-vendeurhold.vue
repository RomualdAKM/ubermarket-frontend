<template>
  <div class="min-h-screen flex items-center justify-center bg-white py-4 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-6">

      <!-- Titre + lien vers la connexion -->
      <div>
        <h2 class="mt-4 text-center text-2xl font-extrabold text-gray-900">Inscription vendeur</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <NuxtLink :to="connexionLink" class="font-medium text-primary hover:text-secondary">
            connectez-vous à votre compte vendeur
          </NuxtLink>
        </p>
      </div>

      <!--
        Bannière plan sélectionné — affichée si un plan est passé en query param (?plan=standard).
        Permet à l'utilisateur de confirmer visuellement son choix avant de s'inscrire.
        Le nom du plan est chargé depuis l'API via loadSelectedPlanName().
      -->
      <div v-if="selectedPlanCode" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm font-medium text-blue-800">
          📋 Plan sélectionné :
          <strong>{{ selectedPlanName || selectedPlanCode }}</strong>
        </p>
        <p class="text-xs text-blue-600 mt-1">
          Vous serez redirigé vers le paiement après la création de votre compte.
        </p>
      </div>

      <!--
        Bannière affilié — affichée si un code de parrainage valide a été détecté.
        detectedAffiliate est peuplé après validation via POST /api/referral/validate.
      -->
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

          <!-- Prénom + Nom côte à côte -->
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

          <!-- E-mail -->
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

          <!-- Téléphone (format international E.164) -->
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

          <!-- Pays — chargé dynamiquement depuis GET /api/countries -->
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

          <!--
            Code parrainage / affiliation.
            - Si présent dans l'URL (?ref=XXXXX), pré-rempli et en lecture seule.
            - Validé en temps réel via POST /api/referral/validate au @blur.
            - L'indicateur visuel (spinner / check vert) s'affiche pendant/après validation.
          -->
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
              <!-- Spinner pendant la validation API -->
              <span v-if="isValidatingReferral" class="absolute right-2 top-1/2 -translate-y-1/2">
                <svg class="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </span>
              <!-- Icône succès si code valide -->
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

          <!-- Mot de passe -->
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

          <!-- Confirmation du mot de passe -->
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

        <!--
          Bloc d'erreur global.
          canUpgrade=true → réponse 409 : compte client existant pouvant passer en vendeur.
          Dans ce cas, un lien de mise à niveau est proposé.
        -->
        <div v-if="submitError" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative">
          {{ submitError }}
          <div v-if="canUpgrade" class="mt-2">
            <NuxtLink to="/upgrade-vendeur" class="text-sm font-medium text-primary underline">
              Mettre à niveau mon compte client en compte vendeur →
            </NuxtLink>
          </div>
        </div>

        <!-- Acceptation des CGU -->
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

        <!-- Bouton de soumission — désactivé si formulaire invalide ou envoi en cours -->
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

  // ── SEO ────────────────────────────────────────────────────
  useHead({
    title: 'Inscription Vendeur - Lancez votre site en 1m30s | Uber-Market',
    meta: [
      { name: 'description', content: 'Lancer votre site en 1mn 30S — solution clé en main pour site web et e-commerce.' },
      { name: 'robots', content: 'index, follow' }
    ]
  })

  const config       = useRuntimeConfig()
  const route        = useRoute()
  const router       = useRouter()
  const { register } = useAuth()

  // ─────────────────────────────────────────────────────────────
  // QUERY PARAMS — extraits de l'URL à l'arrivée sur la page
  // ─────────────────────────────────────────────────────────────
  const redirectTo   = computed(() => route.query.redirect as string || '')
  const prefillEmail = computed(() => route.query.email as string || '')
  // Code affilié/parrain dans l'URL (?ref=XXXXX)
  const refFromUrl   = computed(() => (route.query.ref as string || '').toUpperCase())

  /**
   * selectedPlanCode — code du plan passé dans l'URL lors du choix depuis la page tarifaire.
   * Exemple : /inscription-vendeur?plan=standard
   * Ce code est transmis au backend lors de l'inscription pour assigner le bon plan.
   *
   * BUG CORRIGÉ : ce param était ignoré dans handleSignup — il n'était ni lu ni envoyé.
   * Le backend recevait donc toujours le plan par défaut ("welcome").
   */
  const selectedPlanCode = computed(() => (route.query.plan as string || '').toLowerCase())

  /**
   * selectedPlanName — nom lisible du plan, chargé depuis l'API des plans.
   * Affiché dans la bannière "Plan sélectionné" pour confirmation visuelle.
   * Chargé dans onMounted() si selectedPlanCode est présent.
   */
  const selectedPlanName = ref<string>('')

  // Lien vers la page connexion en conservant les paramètres utiles
  const connexionLink = computed(() => {
    let link = '/connexion-vendeur'
    const params: string[] = []
    if (redirectTo.value) params.push(`redirect=${encodeURIComponent(redirectTo.value)}`)
    if (prefillEmail.value) params.push(`email=${encodeURIComponent(prefillEmail.value)}`)
    return params.length ? link + '?' + params.join('&') : link
  })

  // ─────────────────────────────────────────────────────────────
  // ÉTAT DU FORMULAIRE
  // ─────────────────────────────────────────────────────────────
  const firstName       = ref('')
  const lastName        = ref('')
  const email           = ref('')
  const phone           = ref('')
  const country         = ref('')
  const password        = ref('')
  const passwordConfirm = ref('')
  const acceptTerms     = ref(false)
  const isSubmitting    = ref(false)
  const submitError     = ref('')

  /**
   * canUpgrade — true si l'API répond 409 avec can_upgrade=true.
   * Signifie qu'un compte client existe avec cet e-mail et peut passer en vendeur.
   */
  const canUpgrade = ref(false)

  // ─────────────────────────────────────────────────────────────
  // PARRAINAGE & AFFILIATION
  // ─────────────────────────────────────────────────────────────
  const referralCode         = ref('')
  const referralCodeError    = ref('')
  const referralCodeValid    = ref(false)
  const referrerName         = ref('')
  const referralType         = ref<'standard' | 'commercial' | ''>('')
  const isValidatingReferral = ref(false)
  // Peuplé si un code valide est détecté — affiche la bannière jaune
  const detectedAffiliate    = ref<{ name: string; type: string } | null>(null)

  // Pré-remplir l'e-mail depuis le query param
  watch(prefillEmail, v => { if (v && !email.value) email.value = v }, { immediate: true })

  // Auto-valider le code affilié si présent dans l'URL
  watch(refFromUrl, async (code) => {
    if (code) {
      referralCode.value = code
      await validateReferralCode()
    }
  }, { immediate: true })

  // ─────────────────────────────────────────────────────────────
  // PAYS — chargés depuis GET /api/countries au montage
  // ─────────────────────────────────────────────────────────────
  const countries = ref<{ code: string; name: string }[]>([])

  // ─────────────────────────────────────────────────────────────
  // INITIALISATION — onMounted
  // ─────────────────────────────────────────────────────────────
  onMounted(async () => {
    // Charger la liste des pays
    try {
      const res  = await fetch(`${config.public.apiBase}/countries`)
      const data = await res.json()
      if (data.success) countries.value = data.countries
    } catch {
      // Échec silencieux — le select restera vide
    }

    // Charger le nom du plan sélectionné pour l'afficher dans la bannière
    // Cela évite d'afficher un code brut ("standard") à l'utilisateur
    if (selectedPlanCode.value) {
      await loadSelectedPlanName(selectedPlanCode.value)
    }
  })

  /**
   * loadSelectedPlanName — charge le nom lisible du plan sélectionné depuis l'API.
   * Route : GET /api/subscription/plans (ou /api/plans selon le backend)
   * Utilisé uniquement pour l'affichage dans la bannière de confirmation.
   */
  const loadSelectedPlanName = async (planCode: string) => {
    try {
      const res  = await fetch(`${config.public.apiBase}/subscription/plans`, {
        headers: { 'Accept': 'application/json' }
      })
      const data = await res.json()
      // L'API retourne un tableau de plans avec code et name
      const plans = data.data || data.plans || data || []
      const found = plans.find((p: any) => p.code === planCode)
      if (found) selectedPlanName.value = found.name
    } catch {
      // Silencieux : le code brut sera affiché dans la bannière comme fallback
    }
  }

  // ─────────────────────────────────────────────────────────────
  // VALIDATION DES CHAMPS
  // ─────────────────────────────────────────────────────────────
  const errors = reactive({
    firstName: '', lastName: '', email: '', phone: '',
    country: '', password: '', passwordConfirm: '', acceptTerms: ''
  })

  /**
   * isFormValid — active/désactive le bouton submit.
   * Vérifie tous les champs sans déclencher les messages d'erreur.
   * Les messages sont gérés par validateField() au @blur.
   */
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

  /**
   * validateField — valide un champ individuel à la perte de focus (@blur).
   * Écrit le message d'erreur dans l'objet réactif `errors`.
   */
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
        // Format E.164 : +indicatif puis 7-14 chiffres
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
        // Revalider la confirmation si déjà saisie
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

  /**
   * validateReferralCode — vérifie le code via POST /api/referral/validate.
   * Peuple referrerName, referralType et detectedAffiliate si valide.
   * Appelé automatiquement si le code vient de l'URL, ou au @blur du champ.
   */
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
        referralType.value      = data.type  // 'commercial' | 'standard'
        detectedAffiliate.value = { name: data.referrer?.name || '', type: data.type }
      } else {
        referralCodeError.value = 'Code d\'affiliation invalide.'
      }
    } catch {
      // Silencieux : le code sera vérifié côté serveur à la soumission
    } finally {
      isValidatingReferral.value = false
    }
  }

  /**
   * validateForm — déclenche la validation complète avant soumission.
   * Retourne true si aucun champ n'a d'erreur.
   */
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

  // ─────────────────────────────────────────────────────────────
  // PARAMÈTRES UTM — tracking campagne
  // Envoyés avec le payload d'inscription pour alimenter
  // les analytics de conversion (GET /admin/analytics/campaigns).
  // ─────────────────────────────────────────────────────────────
  const utmParams = computed(() => ({
    ref:               (route.query.ref              as string) || null,
    utm_source:        (route.query.utm_source       as string) || null,
    utm_medium:        (route.query.utm_medium       as string) || null,
    utm_campaign:      (route.query.utm_campaign     as string) || null,
    utm_content:       (route.query.utm_content      as string) || null,
    landing_page:      (route.query.from             as string) || route.path || null,
    acquisition_source:(route.query.ref              as string) || null,
  }))

  // ─────────────────────────────────────────────────────────────
  // SOUMISSION DU FORMULAIRE
  // ─────────────────────────────────────────────────────────────

  /**
   * handleSignup — soumet l'inscription et gère la redirection post-inscription.
   *
   * FLUX AVEC PLAN PAYANT :
   *  1. Créer le compte → backend assigne le plan via `subscription_plan`
   *  2. Rediriger vers /mes-boutiques?pending_plan=standard
   *  3. Un middleware ou la page /mes-boutiques détecte pending_plan
   *     et redirige vers /dashboard-vendor/[slug]/subscription/abonnement
   *     où le paiement est déclenché automatiquement (déjà fonctionnel via
   *     la logique openPaymentModal de abonnement.vue)
   *
   * ALTERNATIVE (plus directe) : rediriger directement vers la page
   * abonnement avec ?plan=standard&autostart=1 pour déclencher le modal
   * de paiement immédiatement après connexion.
   *
   * BUGS CORRIGÉS :
   *  1. selectedPlanCode n'était pas envoyé dans le payload → le backend
   *     assignait toujours "welcome" par défaut.
   *  2. La redirection post-inscription ignorait le plan → l'utilisateur
   *     atterrissait sur /mes-boutiques sans jamais payer.
   */
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
      // Construction du payload complet
      const registerData: any = {
        name:                  `${firstName.value} ${lastName.value}`.trim(),
        first_name:            firstName.value,
        last_name:             lastName.value,
        email:                 email.value,
        phone:                 phone.value,
        country:               country.value,
        password:              password.value,
        password_confirmation: passwordConfirm.value,
        // ── FIX 1 : envoyer le plan sélectionné au backend ──────────
        // Le backend doit lire ce champ dans RegisterVendorRequest
        // et l'utiliser dans VendorRegistrationService pour initialiser
        // la subscription avec le bon plan au lieu du plan "welcome".
        // Champ attendu : subscription_plan (string, ex: "standard")
        subscription_plan: selectedPlanCode.value || null,
        // ── Tracking UTM ──────────────────────────────────────────────
        ...utmParams.value,
      }

      // Code de parrainage si présent
      if (referralCode.value.trim()) {
        registerData.referral_code = referralCode.value.trim()
        registerData.ref           = referralCode.value.trim()
      }

      const response = await register(registerData)

      if (response.success) {
        // ── FIX 2 : redirection intelligente selon le plan ─────────────
        //
        // Cas A — plan gratuit ou aucun plan → dashboard classique
        // Cas B — plan payant → page abonnement avec autostart du paiement
        //
        // La page abonnement.vue supporte déjà le query param ?plan=xxx
        // via openPaymentModal() dans son onMounted().
        // On ajoute autostart=1 pour déclencher automatiquement le modal.
        //
        // IMPORTANT : la boutique n'existe pas encore à ce stade (elle sera
        // créée dans /mes-boutiques). On redirige donc vers /mes-boutiques
        // avec pending_plan pour que le workflow de création de boutique
        // s'enchaîne avant le paiement.
        //
        if (selectedPlanCode.value && selectedPlanCode.value !== 'welcome' && selectedPlanCode.value !== 'gratuit') {
          // Plan payant : stocker le plan en sessionStorage pour le récupérer
          // dans /mes-boutiques ou après création de la première boutique
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('pending_subscription_plan', selectedPlanCode.value)
          }
          await router.push(redirectTo.value || '/mes-boutiques?pending_plan=' + selectedPlanCode.value)
        } else {
          // Plan gratuit ou non spécifié → dashboard normal
          await router.push(redirectTo.value || '/mes-boutiques')
        }
      }
    } catch (err: any) {
      submitError.value = err.message || 'Une erreur est survenue.'
      // 409 avec can_upgrade=true → le compte client peut devenir vendeur
      if (err.canUpgrade) canUpgrade.value = true
    } finally {
      isSubmitting.value = false
    }
  }
</script>