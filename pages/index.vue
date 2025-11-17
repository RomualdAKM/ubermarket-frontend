<template>
  <div v-if="isOnShopSubdomain">
    <!-- Afficher la boutique si on est sur un sous-domaine -->
    <component v-if="!isLoading && !error" :is="themeComponent" :shop="shop" :customizations="customizations" />
    
    <!-- Écran de chargement -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement de la boutique...</p>
      </div>
    </div>
    
    <!-- Écran d'erreur -->
    <div v-if="error" class="min-h-screen flex items-center justify-center bg-white">
      <div class="text-center">
        <svg class="h-12 w-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="mt-4 text-xl font-medium text-gray-900">Boutique introuvable</h2>
        <p class="mt-2 text-gray-600">{{ error }}</p>
      </div>
    </div>
  </div>
  
  <div v-else>
    <!-- Page d'accueil principale (domaine principal) -->
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const { getSubdomain, isOnShopSubdomain } = useSubdomainDetection()
const { fetchCustomizations } = useCustomization()

const subdomain = getSubdomain()
const shop = ref<any>(null)
const customizations = ref<any>({})
const isLoading = ref(false)
const error = ref('')
const themeComponent = ref<any>(null)

// Charger la boutique si on est sur un sous-domaine
const loadShop = async () => {
  if (!subdomain) return
  
  isLoading.value = true
  error.value = ''

  try {
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBase}/shop/${subdomain}`)
    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Boutique non trouvée')
    }

    shop.value = data.data
    
    // Charger les customizations de la boutique
    await fetchCustomizations(subdomain)
    const customizationData = useState('shop.customizations')
    customizations.value = customizationData.value || {}

    // Charger le composant de thème dynamiquement
    if (shop.value.theme && shop.value.theme.slug) {
      const themeSlug = shop.value.theme.slug
      
      try {
        themeComponent.value = defineAsyncComponent(() => 
          import(`~/pages/boutique/${themeSlug}/index.vue`)
        )
      } catch (err) {
        console.error(`Erreur lors du chargement du thème ${themeSlug}:`, err)
        error.value = `Le thème "${shop.value.theme.name}" n'est pas disponible`
      }
    } else {
      error.value = 'Cette boutique n\'a pas de thème configuré'
    }
  } catch (err: any) {
    console.error('Erreur lors du chargement de la boutique:', err)
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}

// Charger la boutique au montage si on est sur un sous-domaine
onMounted(() => {
  if (subdomain) {
    loadShop()
  }
})

// Metadata pour SEO
useHead(() => ({
  title: shop.value ? `${shop.value.name} - Boutique` : 'Accueil',
  meta: [
    {
      name: 'description',
      content: shop.value?.description || 'Découvrez notre boutique en ligne'
    }
  ]
}))
</script>