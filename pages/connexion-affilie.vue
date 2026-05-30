<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900">Espace affilié</h2>
        <p class="mt-2 text-sm text-gray-600">Connectez-vous à votre dashboard d'affiliation</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="votre@email.com" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input v-model="password" type="password" required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••" />
        </div>

        <!-- Se souvenir de moi + Mot de passe oublié -->
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="rememberMe" type="checkbox"
              class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
            <span class="text-sm text-gray-700">Se souvenir de moi</span>
          </label>
          <button type="button" @click="showForgotModal = true"
            class="text-sm font-medium text-primary hover:text-secondary">
            Mot de passe oublié ?
          </button>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading"
          class="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-secondary transition-colors disabled:opacity-50">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <!-- Modal mot de passe oublié -->
      <Teleport to="body">
        <div v-if="showForgotModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" @click="closeForgotModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <button @click="closeForgotModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <h3 class="text-lg font-semibold text-gray-900 mb-2">Mot de passe oublié</h3>
            <p class="text-sm text-gray-500 mb-4">
              Entrez votre adresse email pour recevoir un nouveau mot de passe temporaire.
            </p>

            <div v-if="forgotSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-green-800">{{ forgotSuccess }}</p>
            </div>

            <div v-if="forgotError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-red-800">{{ forgotError }}</p>
            </div>

            <form v-if="!forgotSuccess" @submit.prevent="handleForgotPassword" class="space-y-4">
              <input v-model="forgotEmail" type="email" required
                placeholder="votre@email.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
              <button type="submit" :disabled="forgotLoading"
                class="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                <svg v-if="forgotLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ forgotLoading ? 'Envoi...' : 'Envoyer' }}
              </button>
            </form>

            <button v-else @click="closeForgotModal"
              class="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-secondary transition-colors">
              Fermer
            </button>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const router = useRouter()
const config = useRuntimeConfig()

const email    = ref('')
const password = ref('')
const loading  = ref(false)
const error    = ref('')
const rememberMe = ref(false)

// Pré-remplir si "se souvenir de moi" était coché
onMounted(() => {
  const saved = localStorage.getItem('affiliate_remember_email')
  if (saved) {
    email.value = saved
    rememberMe.value = true
  }
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${config.public.apiBase}/affiliate/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const data = await response.json()
    if (!data.success) throw new Error(data.message)

    // Gérer "se souvenir de moi"
    if (rememberMe.value) {
      localStorage.setItem('affiliate_remember_email', email.value)
    } else {
      localStorage.removeItem('affiliate_remember_email')
    }

    localStorage.setItem('affiliate_token', data.token)
    localStorage.setItem('affiliate_data', JSON.stringify(data.affiliate))
    router.push('/dashboard-affiliate')
  } catch (err: any) {
    error.value = err.message || 'Identifiants invalides'
  } finally {
    loading.value = false
  }
}

// Mot de passe oublié
const showForgotModal = ref(false)
const forgotEmail     = ref('')
const forgotLoading   = ref(false)
const forgotError     = ref('')
const forgotSuccess   = ref('')

const closeForgotModal = () => {
  showForgotModal.value = false
  forgotEmail.value   = ''
  forgotError.value   = ''
  forgotSuccess.value = ''
}

const handleForgotPassword = async () => {
  forgotLoading.value = true
  forgotError.value   = ''
  forgotSuccess.value = ''
  try {
    const response = await fetch(`${config.public.apiBase}/affiliate/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: forgotEmail.value })
    })
    const data = await response.json()
    if (!data.success) throw new Error(data.message)
    forgotSuccess.value = data.message || 'Un nouveau mot de passe vous a été envoyé par email.'
  } catch (err: any) {
    forgotError.value = err.message || 'Aucun compte affilié trouvé avec cet email.'
  } finally {
    forgotLoading.value = false
  }
}
</script>