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

// En se basant sur le faite que product est un ref chargé depuis l'API
useHead(() => {
  if (!product.value) return { title: 'Produit — UberMarket' }

  const p            = product.value
  const productName  = p.name
  const productDesc  = p.description?.replace(/<[^>]+>/g, '').slice(0, 155) || ''
  const productPrice = p.price
  const productImage = p.product_images?.[0]?.image_url || p.preview_image || ''
  const category     = p.subcategory?.name || ''
  const parentCat    = p.subcategory?.category?.name || ''
  const shopName     = shop.value?.name || 'Boutique'
  const productUrl   = `https://uber-market.com/boutique/${subdomain}/produit/${p.id}`

  // Mots-clés extraits de la description
  const descWords = productDesc
    .split(/\s+/)
    .filter(w => w.length > 4)
    .slice(0, 10)
    .join(', ')

  return {
    title: `${productName} — ${shopName} | UberMarket`,
    meta: [
      { name: 'description', content: `${productDesc} — Disponible sur ${shopName}. Commandez en ligne avec livraison.` },
      { name: 'robots', content: 'index, follow' },
      { name: 'keywords', content: `${productName}, ${category}, ${parentCat}, ${descWords}, ${shopName}, acheter en ligne` },

      // Open Graph Product
      { property: 'og:type',              content: 'product' },
      { property: 'og:url',               content: productUrl },
      { property: 'og:title',             content: `${productName} — ${shopName}` },
      { property: 'og:description',       content: productDesc },
      { property: 'og:image',             content: productImage },
      { property: 'product:price:amount', content: String(productPrice) },
      { property: 'product:price:currency', content: 'XOF' },

      // Twitter
      { name: 'twitter:card',        content: 'summary_large_image' },
      { name: 'twitter:title',       content: `${productName} — ${shopName}` },
      { name: 'twitter:description', content: productDesc },
      { name: 'twitter:image',       content: productImage },
    ],
    link: [
      { rel: 'canonical', href: productUrl }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: productName,
          description: productDesc,
          image: productImage,
          url: productUrl,
          brand: { '@type': 'Brand', name: shopName },
          ...(category && {
            category: parentCat ? `${parentCat} > ${category}` : category
          }),
          offers: {
            '@type': 'Offer',
            price: productPrice,
            priceCurrency: 'XOF',
            availability: p.stock_quantity > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: productUrl,
            seller: { '@type': 'Organization', name: shopName }
          },
          ...(p.reviews_count > 0 && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: p.average_rating || 5,
              reviewCount: p.reviews_count
            }
          })
        })
      }
    ]
  }
})

/*useHead(() => ({
  title: product.value ? `${product.value.name} - ${shop.value?.name}` : 'Chargement...',
  meta: [
    {
      name: 'description',
      content: product.value ? stripHtml(product.value.description) : 'Découvrez ce produit'
    }
  ]
}))*/
</script>
