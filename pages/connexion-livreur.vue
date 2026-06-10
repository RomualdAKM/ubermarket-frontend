<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Espace livreur</h2>
        <p class="mt-2 text-sm text-gray-600">Connectez-vous à votre dashboard de livraison</p>
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
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Mot de passe oublié</h3>
            <p class="text-sm text-gray-500 mb-4">Un nouveau mot de passe vous sera envoyé par email.</p>
            <div v-if="forgotSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-green-800">{{ forgotSuccess }}</p>
            </div>
            <div v-if="forgotError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-red-800">{{ forgotError }}</p>
            </div>
            <form v-if="!forgotSuccess" @submit.prevent="handleForgotPassword" class="space-y-3">
              <input v-model="forgotEmail" type="email" required placeholder="votre@email.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <button type="submit" :disabled="forgotLoading"
                class="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-secondary disabled:opacity-50">
                {{ forgotLoading ? 'Envoi...' : 'Envoyer' }}
              </button>
            </form>
            <button v-else @click="closeForgotModal"
              class="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-secondary">
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

onMounted(() => {
  const saved = localStorage.getItem('courier_remember_email')
  if (saved) { email.value = saved; rememberMe.value = true }
})

const handleLogin = async () => {
  loading.value = true
  error.value   = ''
  try {
    const response = await fetch(`${config.public.apiBase}/courier/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const data = await response.json()
    if (!data.success) throw new Error(data.message)

    if (rememberMe.value) localStorage.setItem('courier_remember_email', email.value)
    else localStorage.removeItem('courier_remember_email')

    localStorage.setItem('courier_token', data.token)
    router.push('/dashboard-courier')
  } catch (err: any) {
    error.value = err.message || 'Identifiants invalides'
  } finally {
    loading.value = false
  }
}

const showForgotModal = ref(false)
const forgotEmail     = ref('')
const forgotLoading   = ref(false)
const forgotError     = ref('')
const forgotSuccess   = ref('')

const closeForgotModal = () => {
  showForgotModal.value = false
  forgotEmail.value = forgotError.value = forgotSuccess.value = ''
}

const handleForgotPassword = async () => {
  forgotLoading.value = true
  forgotError.value = forgotSuccess.value = ''
  try {
    const response = await fetch(`${config.public.apiBase}/courier/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: forgotEmail.value })
    })
    const data = await response.json()
    if (!data.success) throw new Error(data.message)
    forgotSuccess.value = data.message
  } catch (err: any) {
    forgotError.value = err.message || 'Email non trouvé'
  } finally {
    forgotLoading.value = false
  }
}
</script>