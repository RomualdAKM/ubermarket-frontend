<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement des produits...</p>
    </div>
  </div>

  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <svg class="h-12 w-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h2 class="mt-4 text-xl font-medium text-gray-900">Erreur</h2>
      <p class="mt-2 text-gray-600">{{ error }}</p>
      <NuxtLink :to="`/boutique/${subdomain}`" class="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-secondary">
        Retour à la boutique
      </NuxtLink>
    </div>
  </div>

  <component v-else :is="themeComponent" :shop="shop" :customizations="customizations" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const route = useRoute()
const subdomain = route.params.subdomain as string
const { fetchCustomizations } = useCustomization()

const shop = ref<any>(null)
const customizations = ref<any>({})
const isLoading = ref(true)
const error = ref('')
const themeComponent = ref<any>(null)

// Charger les données de la boutique et des produits
const loadProductsPage = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const config = useRuntimeConfig()
    
    // Charger les données de la boutique
    const shopResponse = await fetch(`${config.public.apiBase}/shop/${subdomain}`)
    const shopData = await shopResponse.json()

    if (!shopResponse.ok || !shopData.success) {
      throw new Error(shopData.message || 'Boutique non trouvée')
    }

    shop.value = shopData.data
    
    // Charger les customizations de la boutique
    await fetchCustomizations(subdomain)
    const customizationData = useState('shop.customizations')
    customizations.value = customizationData.value || {}

    // Charger le composant de thème dynamiquement
    if (shop.value.theme && shop.value.theme.slug) {
      const themeSlug = shop.value.theme.slug
      
      try {
        themeComponent.value = defineAsyncComponent(() => 
          import(`~/pages/boutique/${themeSlug}/produits.vue`)
        )
      } catch (err) {
        console.error(`Erreur lors du chargement du thème ${themeSlug}:`, err)
        error.value = `Le thème "${shop.value.theme.name}" n'est pas disponible`
      }
    } else {
      error.value = 'Cette boutique n\'a pas de thème configuré'
    }
  } catch (err: any) {
    console.error('Erreur lors du chargement:', err)
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProductsPage()
})

useHead(() => ({
  title: shop.value ? `Produits - ${shop.value.name}` : 'Chargement...',
  meta: [
    {
      name: 'description',
      content: 'Découvrez tous nos produits'
    }
  ]
}))
</script>
