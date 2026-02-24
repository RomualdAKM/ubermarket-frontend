<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div class="w-full max-w-md">
      <!-- Chargement -->
      <div v-if="isLoading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
        <p class="mt-4 text-gray-600">Vérification de l'invitation...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 class="text-xl font-semibold text-gray-900 mb-2">Invitation invalide</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink 
          to="/connexion-vendeur" 
          class="inline-block px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
        >
          Retour à la connexion
        </NuxtLink>
      </div>

      <!-- Invitation valide -->
      <div v-else-if="invitation" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- En-tête -->
        <div class="bg-gray-50 border-b border-gray-200 p-6 text-center">
          <div v-if="invitation.shop.logo" class="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border border-gray-200">
            <img :src="invitation.shop.logo" :alt="invitation.shop.name" class="w-full h-full object-cover">
          </div>
          <div v-else class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-2xl font-semibold text-gray-600">{{ invitation.shop.name.charAt(0) }}</span>
          </div>
          <h1 class="text-xl font-semibold text-gray-900">{{ invitation.shop.name }}</h1>
          <p class="text-sm text-gray-500 mt-1">Vous invite à rejoindre son équipe</p>
        </div>

        <!-- Contenu -->
        <div class="p-6">
          <!-- Infos invitation -->
          <div class="space-y-4 mb-6">
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm text-gray-500">Invité par</span>
              <span class="text-sm font-medium text-gray-900">{{ invitation.invited_by }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm text-gray-500">Rôle proposé</span>
              <span class="text-sm font-medium text-gray-900">{{ invitation.role.name }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm text-gray-500">Email invité</span>
              <span class="text-sm font-medium text-gray-900">{{ invitation.invited_email }}</span>
            </div>
            <div class="flex items-center justify-between py-3">
              <span class="text-sm text-gray-500">Expire le</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(invitation.expires_at) }}</span>
            </div>
          </div>

          <!-- Message d'erreur acceptation -->
          <div v-if="acceptError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-800">{{ acceptError }}</p>
          </div>

          <!-- Si connecté -->
          <div v-if="isAuthenticated">
            <p class="text-sm text-gray-600 mb-4 text-center">
              Vous êtes connecté en tant que <strong>{{ user?.email }}</strong>
            </p>
            
            <!-- Vérification email -->
            <div v-if="user?.email !== invitation.invited_email" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p class="text-sm text-amber-800">
                <strong>Attention :</strong> Cette invitation a été envoyée à {{ invitation.invited_email }}. 
                Vous êtes connecté avec un email différent.
              </p>
            </div>

            <button 
              @click="acceptInvitation"
              :disabled="isAccepting"
              class="w-full py-3 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isAccepting" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Acceptation en cours...
              </span>
              <span v-else>Accepter l'invitation</span>
            </button>
          </div>

          <!-- Si non connecté -->
          <div v-else>
            <p class="text-sm text-gray-600 mb-4 text-center">
              Connectez-vous ou créez un compte pour accepter cette invitation.
            </p>
            
            <div class="space-y-3">
              <NuxtLink 
                :to="`/connexion-vendeur?redirect=/invitation/${token}&email=${encodeURIComponent(invitation.invited_email)}`"
                class="block w-full py-3 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors text-center"
              >
                Se connecter
              </NuxtLink>
              <NuxtLink 
                :to="`/inscription-vendeur?redirect=/invitation/${token}&email=${encodeURIComponent(invitation.invited_email)}`"
                class="block w-full py-3 bg-white text-gray-900 font-medium rounded border border-gray-300 hover:bg-gray-50 transition-colors text-center"
              >
                Créer un compte
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { user, token: authToken, isAuthenticated } = useAuth()

const token = computed(() => route.params.token as string)

const isLoading = ref(true)
const error = ref('')
const invitation = ref<{
  shop: { name: string; logo: string | null }
  role: { code: string; name: string }
  invited_by: string
  invited_email: string
  expires_at: string
} | null>(null)

const isAccepting = ref(false)
const acceptError = ref('')

// Formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Vérifier l'invitation au chargement
const checkInvitation = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response: any = await $fetch(`${config.public.apiBase}/collaborations/check-invitation`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: { token: token.value }
    })

    if (response.success) {
      invitation.value = response.data
    } else {
      error.value = response.message || 'Invitation invalide'
    }
  } catch (e: any) {
    if (e.data?.message) {
      error.value = e.data.message
    } else if (e.statusCode === 404) {
      error.value = 'Cette invitation n\'existe pas ou a déjà été utilisée.'
    } else if (e.statusCode === 410) {
      error.value = 'Cette invitation a expiré. Demandez au propriétaire de vous renvoyer une nouvelle invitation.'
    } else {
      error.value = 'Une erreur est survenue lors de la vérification de l\'invitation.'
    }
  } finally {
    isLoading.value = false
  }
}

// Accepter l'invitation
const acceptInvitation = async () => {
  if (!isAuthenticated.value || !authToken.value) {
    router.push(`/connexion-vendeur?redirect=/invitation/${token.value}`)
    return
  }

  isAccepting.value = true
  acceptError.value = ''

  try {
    const response: any = await $fetch(`${config.public.apiBase}/collaborations/accept`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken.value}`
      },
      body: { token: token.value }
    })

    if (response.success) {
      // Rediriger vers le dashboard de la boutique
      router.push(`/dashboard-vendor/${response.data.shop.slug}`)
    } else {
      acceptError.value = response.message || 'Erreur lors de l\'acceptation'
    }
  } catch (e: any) {
    acceptError.value = e.data?.message || e.message || 'Une erreur est survenue lors de l\'acceptation.'
  } finally {
    isAccepting.value = false
  }
}

onMounted(() => {
  checkInvitation()
})
</script>
