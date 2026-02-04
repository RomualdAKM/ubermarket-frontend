<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement...</p>
    </div>
  </div>

  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <h2 class="text-xl font-medium text-gray-900">Erreur</h2>
      <p class="mt-2 text-gray-600">{{ error }}</p>
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

const loadShop = async () => {
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
    
    await fetchCustomizations(subdomain)
    const customizationData = useState('shop.customizations')
    customizations.value = customizationData.value || {}

    if (shop.value.theme && shop.value.theme.slug) {
      const themeSlug = shop.value.theme.slug
      
      try {
        themeComponent.value = defineAsyncComponent(() => 
          import(`~/pages/boutique/${themeSlug}/cgv.vue`)
        )
      } catch (err) {
        console.error(`Erreur lors du chargement de la page:`, err)
        error.value = `La page n'est pas disponible pour ce thème`
      }
    } else {
      error.value = 'Cette boutique n\'a pas de thème configuré'
    }
  } catch (err: any) {
    console.error('Erreur:', err)
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadShop()
})

useHead(() => ({
  title: shop.value ? `CGV - ${shop.value.name}` : 'Chargement...'
}))
</script>
