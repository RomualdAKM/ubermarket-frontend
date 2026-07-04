<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement de la boutique...</p>
    </div>
  </div>

  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <svg class="h-12 w-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h2 class="mt-4 text-xl font-medium text-gray-900">Boutique introuvable</h2>
      <p class="mt-2 text-gray-600">{{ error }}</p>
      <NuxtLink to="/" class="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-secondary">
        Retour à l'accueil
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

// Charger les données de la boutique
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

    // ✅ Vérifier si un thème de prévisualisation est demandé
    const previewThemeSlug = route.query.preview_theme as string

    const themeSlug = previewThemeSlug || shop.value.theme?.slug

    if (themeSlug) {
      try {
        themeComponent.value = defineAsyncComponent(() =>
          import(`~/pages/boutique/${themeSlug}/index.vue`)
        )
      } catch (err) {
        error.value = `Thème "${themeSlug}" non disponible`
      }
    } else {
      error.value = 'Aucun thème configuré'
    }

    // Charger les customizations
    await fetchCustomizations(subdomain)
    const customizationData = useState('shop.customizations')
    customizations.value = customizationData.value || {}

  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}

// Charger la boutique au montage
onMounted(() => {
  loadShop()
})

// Metadata pour SEO
// Données de la boutique (après loadShop)
useHead(() => {
  if (!shop.value) return { title: 'Boutique — UberMarket' }

  const shopName        = shop.value.name || 'Boutique'
  const shopDesc        = shop.value.description || `Découvrez les produits de ${shopName} sur UberMarket`
  const shopImage       = shop.value.logo_url || shop.value.banner_url || 'https://uber-market.com/og-image.png'
  const shopUrl         = `https://uber-market.com/boutique/${subdomain}`
  const shopCategory    = shop.value.subcategory?.category?.name || shop.value.category?.name || ''

  return {
    title: `${shopName} — Boutique en ligne | UberMarket`,
    meta: [
      // SEO de base
      { name: 'description', content: `${shopDesc.slice(0, 155)}` },
      { name: 'robots', content: 'index, follow' },
      { name: 'keywords', content: `${shopName}, boutique en ligne, ${shopCategory}, acheter en ligne, UberMarket` },

      // Open Graph
      { property: 'og:type',        content: 'website' },
      { property: 'og:url',         content: shopUrl },
      { property: 'og:title',       content: `${shopName} — Boutique en ligne` },
      { property: 'og:description', content: shopDesc.slice(0, 155) },
      { property: 'og:image',       content: shopImage },
      { property: 'og:site_name',   content: 'UberMarket' },

      // Twitter
      { name: 'twitter:card',        content: 'summary_large_image' },
      { name: 'twitter:title',       content: `${shopName} — Boutique en ligne` },
      { name: 'twitter:description', content: shopDesc.slice(0, 155) },
      { name: 'twitter:image',       content: shopImage },
    ],
    link: [
      { rel: 'canonical', href: shopUrl }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: shopName,
          description: shopDesc,
          url: shopUrl,
          image: shopImage,
          '@id': shopUrl,
          ...(shop.value.phone && { telephone: shop.value.phone }),
          ...(shopCategory && {
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: shopCategory
            }
          })
        })
      }
    ]
  }
})
/*useHead(() => ({
  title: shop.value ? `${shop.value.name} - Boutique` : 'Chargement...',
  meta: [
    {
      name: 'description',
      content: shop.value?.description || 'Découvrez notre boutique en ligne'
    }
  ]
}))*/
</script>
