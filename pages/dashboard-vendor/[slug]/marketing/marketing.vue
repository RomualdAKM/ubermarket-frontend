<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Marketing</h1>
      <p class="text-gray-600">Connectez vos outils de suivi marketing</p>
    </div>

    <!-- Avertissement si module non disponible -->
    <div v-if="!hasMarketingAccess" class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p class="text-sm font-medium text-amber-800">Module 'Marketing' non disponible</p>
          <p class="text-sm text-amber-700 mt-1">Les intégrations marketing ne sont pas incluses dans votre plan actuel. Mettez à niveau votre abonnement pour accéder à cette fonctionnalité.</p>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
      {{ successMessage }}
    </div>
    
    <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
      {{ errorMessage }}
    </div>

    <!-- Loading state -->
    <div v-if="isLoading && !integrations.length" class="bg-white p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      <p class="mt-2 text-gray-600">Chargement...</p>
    </div>

    <!-- Outils de suivi -->
    <div v-else class="bg-white p-6 mb-6">
      <h2 class="text-lg font-medium text-gray-900 mb-6">Outils de suivi</h2>
      
      <div class="space-y-4">
        <!-- Facebook Pixel -->
        <div class="border border-gray-200 rounded overflow-hidden">
          <div class="flex items-center justify-between p-4 bg-gray-50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center">
                <span class="text-sm font-semibold text-gray-700">FB</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Facebook Pixel</p>
                <p class="text-xs text-gray-500">Suivez les conversions et optimisez vos campagnes</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="getIntegrationByPlatform('facebook_pixel')" :class="[
                'text-xs font-medium px-2 py-1 rounded',
                getIntegrationByPlatform('facebook_pixel')?.is_active 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              ]">
                {{ getIntegrationByPlatform('facebook_pixel')?.is_active ? 'Connecté' : 'Inactif' }}
              </span>
              <button 
                @click="togglePlatformForm('facebook_pixel')"
                :disabled="!hasMarketingAccess"
                :class="[
                  'text-sm font-medium transition-colors',
                  !hasMarketingAccess 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:text-gray-900'
                ]"
              >
                {{ showForms.facebook_pixel ? 'Masquer' : 'Configurer' }}
              </button>
            </div>
          </div>
          
          <div v-if="showForms.facebook_pixel" class="p-4 bg-white border-t border-gray-200">
            <form @submit.prevent="handleConnect('facebook_pixel')" class="space-y-4">
              <div>
                <label for="pixel-id" class="block text-sm font-medium text-gray-700 mb-2">ID du Pixel Facebook</label>
                <input 
                  type="text" 
                  id="pixel-id" 
                  v-model="formData.facebook_pixel.pixel_id"
                  class="mt-1 block w-full px-2 py-1 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
                  placeholder="Ex: 123456789012345"
                  required
                >
              </div>
              <div class="flex justify-end gap-2">
                <button 
                  v-if="getIntegrationByPlatform('facebook_pixel')"
                  type="button"
                  @click="handleDisconnect('facebook_pixel')"
                  :disabled="isLoading"
                  class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Déconnecter
                </button>
                <button 
                  type="submit"
                  :disabled="isLoading"
                  class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
                >
                  {{ isLoading ? 'Connexion...' : 'Connecter' }}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Google Analytics -->
        <div class="border border-gray-200 rounded overflow-hidden">
          <div class="flex items-center justify-between p-4 bg-gray-50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center">
                <span class="text-sm font-semibold text-gray-700">GA</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Google Analytics</p>
                <p class="text-xs text-gray-500">Analysez le trafic et le comportement des visiteurs</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="getIntegrationByPlatform('google_analytics')" :class="[
                'text-xs font-medium px-2 py-1 rounded',
                getIntegrationByPlatform('google_analytics')?.is_active 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              ]">
                {{ getIntegrationByPlatform('google_analytics')?.is_active ? 'Connecté' : 'Inactif' }}
              </span>
              <button 
                @click="togglePlatformForm('google_analytics')"
                :disabled="!hasMarketingAccess"
                :class="[
                  'text-sm font-medium transition-colors',
                  !hasMarketingAccess 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:text-gray-900'
                ]"
              >
                {{ showForms.google_analytics ? 'Masquer' : 'Configurer' }}
              </button>
            </div>
          </div>
          
          <div v-if="showForms.google_analytics" class="p-4 bg-white border-t border-gray-200">
            <form @submit.prevent="handleConnect('google_analytics')" class="space-y-4">
              <div>
                <label for="ga-id" class="block text-sm font-medium text-gray-700 mb-2">ID de suivi Google Analytics</label>
                <input 
                  type="text" 
                  id="ga-id" 
                  v-model="formData.google_analytics.tracking_id"
                  class="mt-1 block w-full px-2 py-1 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
                  placeholder="Ex: G-XXXXXXXXXX ou UA-XXXXXX-X"
                  required
                >
              </div>
              <div class="flex justify-end gap-2">
                <button 
                  v-if="getIntegrationByPlatform('google_analytics')"
                  type="button"
                  @click="handleDisconnect('google_analytics')"
                  :disabled="isLoading"
                  class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Déconnecter
                </button>
                <button 
                  type="submit"
                  :disabled="isLoading"
                  class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
                >
                  {{ isLoading ? 'Connexion...' : 'Connecter' }}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Système.io -->
        <div class="border border-gray-200 rounded overflow-hidden">
          <div class="flex items-center justify-between p-4 bg-gray-50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center">
                <span class="text-sm font-semibold text-gray-700">SI</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Système.io</p>
                <p class="text-xs text-gray-500">Automatisez vos campagnes email et marketing</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="getIntegrationByPlatform('systeme_io')" :class="[
                'text-xs font-medium px-2 py-1 rounded',
                getIntegrationByPlatform('systeme_io')?.is_active 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              ]">
                {{ getIntegrationByPlatform('systeme_io')?.is_active ? 'Connecté' : 'Inactif' }}
              </span>
              <button 
                @click="togglePlatformForm('systeme_io')"
                :disabled="!hasMarketingAccess"
                :class="[
                  'text-sm font-medium transition-colors',
                  !hasMarketingAccess 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:text-gray-900'
                ]"
              >
                {{ showForms.systeme_io ? 'Masquer' : 'Configurer' }}
              </button>
            </div>
          </div>
          
          <div v-if="showForms.systeme_io" class="p-4 bg-white border-t border-gray-200">
            <form @submit.prevent="handleConnect('systeme_io')" class="space-y-4">
              <div>
                <label for="system-io-key" class="block text-sm font-medium text-gray-700 mb-2">Clé API Système.io</label>
                <input 
                  type="password" 
                  id="system-io-key" 
                  v-model="formData.systeme_io.api_key"
                  class="mt-1 block w-full px-2 py-1 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
                  placeholder="Entrez votre clé API"
                  required
                >
              </div>
              <div class="flex justify-end gap-2">
                <button 
                  v-if="getIntegrationByPlatform('systeme_io')"
                  type="button"
                  @click="handleDisconnect('systeme_io')"
                  :disabled="isLoading"
                  class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Déconnecter
                </button>
                <button 
                  type="submit"
                  :disabled="isLoading"
                  class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
                >
                  {{ isLoading ? 'Connexion...' : 'Connecter' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MarketingIntegration } from '~/types/marketing'

definePageMeta({
  layout: 'dashboard',
  middleware: 'shop-access'
})

const route = useRoute()
const { integrations, isLoading, error, fetchIntegrations, createIntegration, updateIntegration, deleteIntegration } = useMarketing()

// Vérification de l'abonnement
const { hasModule } = useSubscription()
const hasMarketingAccess = computed(() => hasModule('marketing'))

// État pour les formulaires
const showForms = reactive({
  facebook_pixel: false,
  google_analytics: false,
  systeme_io: false
})

// Données des formulaires
const formData = reactive({
  facebook_pixel: {
    pixel_id: ''
  },
  google_analytics: {
    tracking_id: ''
  },
  systeme_io: {
    api_key: ''
  }
})

const successMessage = ref('')
const errorMessage = ref('')

// Charger les intégrations au montage
onMounted(async () => {
  const shopSlug = route.params.slug as string
  await fetchIntegrations(shopSlug)
  
  // Pré-remplir les formulaires avec les données existantes
  integrations.value.forEach((integration: MarketingIntegration) => {
    if (integration.platform === 'facebook_pixel') {
      formData.facebook_pixel.pixel_id = (integration.credentials as any).pixel_id || ''
    } else if (integration.platform === 'google_analytics') {
      formData.google_analytics.tracking_id = (integration.credentials as any).tracking_id || ''
    } else if (integration.platform === 'systeme_io') {
      formData.systeme_io.api_key = (integration.credentials as any).api_key || ''
    }
  })
})

// Basculer l'affichage d'un formulaire
const togglePlatformForm = (platform: 'facebook_pixel' | 'google_analytics' | 'systeme_io') => {
  // Ne pas ouvrir si le module n'est pas disponible
  if (!hasMarketingAccess.value) return
  
  showForms[platform] = !showForms[platform]
  clearMessages()
}

// Récupérer une intégration par plateforme
const getIntegrationByPlatform = (platform: string) => {
  return integrations.value.find((int: MarketingIntegration) => int.platform === platform)
}

// Effacer les messages
const clearMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
}

// Gérer la connexion d'une plateforme
const handleConnect = async (platform: 'facebook_pixel' | 'google_analytics' | 'systeme_io') => {
  clearMessages()
  
  try {
    const shopSlug = route.params.slug as string
    
    // Préparer les credentials
    let credentials: Record<string, any> = {}
    if (platform === 'facebook_pixel') {
      credentials = { pixel_id: formData.facebook_pixel.pixel_id }
    } else if (platform === 'google_analytics') {
      credentials = { tracking_id: formData.google_analytics.tracking_id }
    } else if (platform === 'systeme_io') {
      credentials = { api_key: formData.systeme_io.api_key }
    }
    
    // Vérifier si l'intégration existe déjà
    const existingIntegration = getIntegrationByPlatform(platform)
    
    if (existingIntegration) {
      // Mettre à jour
      await updateIntegration(shopSlug, existingIntegration.id, {
        platform,
        credentials,
        is_active: true
      })
      successMessage.value = 'Intégration mise à jour avec succès'
    } else {
      // Créer
      await createIntegration(shopSlug, {
        platform,
        credentials,
        is_active: true
      })
      successMessage.value = 'Intégration connectée avec succès'
    }
    
    // Recharger les intégrations
    await fetchIntegrations(shopSlug)
    
    // Fermer le formulaire après 2 secondes
    setTimeout(() => {
      showForms[platform] = false
      successMessage.value = ''
    }, 2000)
    
  } catch (err: any) {
    errorMessage.value = err.message || 'Erreur lors de la connexion'
  }
}

// Gérer la déconnexion d'une plateforme
const handleDisconnect = async (platform: 'facebook_pixel' | 'google_analytics' | 'systeme_io') => {
  clearMessages()
  
  if (!confirm('Voulez-vous vraiment déconnecter cette intégration ?')) {
    return
  }
  
  try {
    const shopSlug = route.params.slug as string
    const integration = getIntegrationByPlatform(platform)
    
    if (integration) {
      await deleteIntegration(shopSlug, integration.id)
      successMessage.value = 'Intégration déconnectée avec succès'
      
      // Recharger les intégrations
      await fetchIntegrations(shopSlug)
      
      // Réinitialiser le formulaire
      if (platform === 'facebook_pixel') {
        formData.facebook_pixel.pixel_id = ''
      } else if (platform === 'google_analytics') {
        formData.google_analytics.tracking_id = ''
      } else if (platform === 'systeme_io') {
        formData.systeme_io.api_key = ''
      }
      
      // Fermer le formulaire
      showForms[platform] = false
      
      setTimeout(() => {
        successMessage.value = ''
      }, 2000)
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Erreur lors de la déconnexion'
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  background-color: white;
  max-width: 56rem;
  width: 100%;
  z-index: 1000;
  max-height: 90vh;
  overflow-y: auto;
}
</style>