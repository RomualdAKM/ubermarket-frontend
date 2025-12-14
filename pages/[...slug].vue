<template>
  <div v-if="isOnShopSubdomain">
    <!-- Afficher la boutique si on est sur un sous-domaine -->
    
    <!-- Page d'accueil de la boutique -->
    <div v-if="isHome">
      <component v-if="!isLoading && !error" :is="themeComponent" :shop="shop" :customizations="customizations" />
    </div>
    
    <!-- Page produit -->
    <div v-else-if="isProduct">
      <component v-if="!isLoading && !error" :is="themeComponent" :shop="shop" :product="product" :customizations="customizations" />
    </div>
    
    <!-- Page panier -->
    <div v-else-if="isCart">
      <component v-if="!isLoading && !error" :is="themeComponent" :shop="shop" :customizations="customizations" />
    </div>
    
    <!-- Page produits -->
    <div v-else-if="isProducts">
      <component v-if="!isLoading && !error" :is="themeComponent" :shop="shop" :customizations="customizations" />
    </div>
    
    <!-- Pages statiques (à-propos, CGU, etc.) -->
    <div v-else>
      <component v-if="!isLoading && !error" :is="themeComponent" :shop="shop" :customizations="customizations" :page="currentPage" />
    </div>
    
    <!-- Écran de chargement -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement...</p>
      </div>
    </div>
    
    <!-- Écran d'erreur -->
    <div v-if="error" class="min-h-screen flex items-center justify-center bg-white">
      <div class="text-center">
        <svg class="h-12 w-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="mt-4 text-xl font-medium text-gray-900">Page introuvable</h2>
        <p class="mt-2 text-gray-600">{{ error }}</p>
        <NuxtLink to="/" class="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-secondary">
          Retour à la boutique
        </NuxtLink>
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

const route = useRoute()
const { getSubdomain, isOnShopSubdomain } = useSubdomainDetection()
const { fetchCustomizations } = useCustomization()

const subdomain = getSubdomain()
const slug = route.params.slug as string[] | undefined

// État
const shop = ref<any>(null)
const product = ref<any>(null)
const customizations = ref<any>({})
const isLoading = ref(false)
const error = ref('')
const themeComponent = ref<any>(null)
const currentPage = ref<string>('')

// Déterminer la page actuelle
const isHome = computed(() => !slug || slug.length === 0)
const isProduct = computed(() => slug && slug[0] === 'produit' && slug.length === 2 && !isNaN(parseInt(slug[1])))
const isCart = computed(() => slug && slug[0] === 'panier' && slug.length === 1)
const isProducts = computed(() => slug && slug[0] === 'produits' && slug.length === 1)

// Charger la boutique
const loadShop = async () => {
  if (!subdomain) return
  
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
        if (isProduct.value) {
          themeComponent.value = defineAsyncComponent(() => 
            import(`~/pages/boutique/${themeSlug}/produit.vue`)
          )
        } else if (isCart.value) {
          themeComponent.value = defineAsyncComponent(() => 
            import(`~/pages/boutique/${themeSlug}/panier.vue`)
          )
        } else if (isProducts.value) {
          themeComponent.value = defineAsyncComponent(() => 
            import(`~/pages/boutique/${themeSlug}/produits.vue`)
          )
        } else {
          themeComponent.value = defineAsyncComponent(() => 
            import(`~/pages/boutique/${themeSlug}/index.vue`)
          )
        }
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
  }
}

// Charger le produit
const loadProduct = async () => {
  if (!subdomain || !slug || !isProduct.value) return
  
  const productId = parseInt(slug[1])
  
  try {
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBase}/shop/${subdomain}/products/${productId}`)
    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Produit non trouvé')
    }

    product.value = data.data
  } catch (err: any) {
    console.error('Erreur lors du chargement du produit:', err)
    error.value = err.message || 'Une erreur est survenue'
  }
}

// Charger les données
const loadData = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await loadShop()
    
    if (isProduct.value) {
      await loadProduct()
    } else if (isCart.value) {
      // Charger le panier via le composable useCart
      const { fetchCart } = useCart()
      if (subdomain) {
        await fetchCart(subdomain)
      }
    } else if (slug && slug.length > 0) {
      currentPage.value = slug[0]
    }
  } finally {
    isLoading.value = false
  }
}

// Charger au montage et à chaque changement de route
onMounted(() => {
  if (subdomain) {
    loadData()
  }
})

watch(() => route.path, () => {
  if (subdomain) {
    loadData()
  }
})

// Metadata pour SEO
useHead(() => {
  let title = 'Accueil'
  let description = 'Découvrez notre boutique en ligne'
  
  if (product.value) {
    title = `${product.value.name} - ${shop.value?.name}`
    description = product.value?.description || 'Découvrez ce produit'
  } else if (shop.value && !isHome.value) {
    title = `${shop.value.name} - ${currentPage.value}`
    description = shop.value?.description || 'Découvrez notre boutique en ligne'
  } else if (shop.value) {
    title = `${shop.value.name}`
    description = shop.value?.description || 'Découvrez notre boutique en ligne'
  }
  
  return {
    title,
    meta: [
      {
        name: 'description',
        content: description
      }
    ]
  }
})
</script>
