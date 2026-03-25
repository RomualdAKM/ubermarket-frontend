<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement du produit...</p>
    </div>
  </div>

  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <h2 class="text-xl font-medium text-gray-900">Produit introuvable</h2>
      <p class="mt-2 text-gray-600">{{ error }}</p>
      <NuxtLink :to="`/boutique/${subdomain}`" class="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-secondary">
        Retour à la boutique
      </NuxtLink>
    </div>
  </div>

  <component v-else :is="themeComponent" :shop="shop" :product="product" :customizations="customizations" />
</template>

<script setup lang="ts">
import { stripHtml } from '~/utils/string'
import { defineAsyncComponent } from 'vue'

const route = useRoute()
const subdomain = route.params.subdomain as string
const productId = parseInt(route.params.id as string)
const { fetchCustomizations } = useCustomization()
const { trackViewContent } = useMarketingTracking()

const shop = ref<any>(null)
const product = ref<any>(null)
const customizations = ref<any>({})
const isLoading = ref(true)
const error = ref('')
const themeComponent = ref<any>(null)

const loadProductData = async () => {
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
    
    // Charger le produit spécifique via la route publique
    const productResponse = await fetch(`${config.public.apiBase}/shop/${subdomain}/products/${productId}`)
    const productData = await productResponse.json()

    if (!productResponse.ok || !productData.success) {
      throw new Error(productData.message || 'Produit non trouvé')
    }

    product.value = productData.data
    
    // Tracker la vue du produit pour le marketing
    trackViewContent(product.value)
    
    // Charger les customizations de la boutique
    await fetchCustomizations(subdomain)
    const customizationData = useState('shop.customizations')
    customizations.value = customizationData.value || {}

    // Charger le composant de thème dynamiquement
    if (shop.value.theme && shop.value.theme.slug) {
      const themeSlug = shop.value.theme.slug
      
      try {
        themeComponent.value = defineAsyncComponent(() => 
          import(`~/pages/boutique/${themeSlug}/produit.vue`)
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
  loadProductData()
})

useHead(() => ({
  title: product.value ? `${product.value.name} - ${shop.value?.name}` : 'Chargement...',
  meta: [
    {
      name: 'description',
      content: product.value ? stripHtml(product.value.description) : 'Découvrez ce produit'
    }
  ]
}))
</script>
