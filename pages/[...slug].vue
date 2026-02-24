<template>
  <div v-if="isOnShopSubdomain">
    <!-- Page de maintenance -->
    <div v-if="isInMaintenance" class="min-h-screen flex items-center justify-center bg-slate-50">
      <div class="text-center max-w-sm mx-auto px-6">
        <!-- Logo de la boutique -->
        <div class="mb-8">
          <img 
            v-if="maintenanceData.shop_logo" 
            :src="maintenanceData.shop_logo" 
            :alt="maintenanceData.shop_name"
            class="w-16 h-16 mx-auto rounded-full object-cover ring-2 ring-slate-200"
          >
          <div v-else class="w-16 h-16 mx-auto rounded-full bg-white ring-2 ring-slate-200 flex items-center justify-center">
            <svg class="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
          </div>
        </div>
        
        <!-- Nom de la boutique -->
        <h1 class="text-lg font-semibold text-slate-900 mb-2">
          {{ maintenanceData.shop_name || 'Boutique' }}
        </h1>
        
        <!-- Statut maintenance -->
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Maintenance
        </div>
        
        <!-- Message -->
        <p class="text-slate-600 text-sm leading-relaxed mb-6">
          {{ maintenanceData.maintenance_message || 'Cette boutique est temporairement indisponible. Nous serons bientôt de retour.' }}
        </p>
        
        <!-- Date de fin -->
        <p v-if="maintenanceData.maintenance_end_date" class="text-slate-500 text-xs">
          Retour prévu le {{ formatMaintenanceEndDate(maintenanceData.maintenance_end_date) }}
        </p>
        
        <!-- Lien vers UberMarket -->
        <div class="mt-12 pt-6 border-t border-slate-200">
          <a href="https://uber-market.com" class="text-slate-400 text-xs hover:text-slate-600 transition-colors">
            Propulsé par UberMarket
          </a>
        </div>
      </div>
    </div>
    
    <!-- Page boutique fermée (inactive) -->
    <div v-else-if="isInactive" class="min-h-screen flex items-center justify-center bg-slate-50">
      <div class="text-center max-w-sm mx-auto px-6">
        <!-- Logo de la boutique -->
        <div class="mb-8">
          <img 
            v-if="inactiveData.shop_logo" 
            :src="inactiveData.shop_logo" 
            :alt="inactiveData.shop_name"
            class="w-16 h-16 mx-auto rounded-full object-cover ring-2 ring-slate-200 grayscale opacity-60"
          >
          <div v-else class="w-16 h-16 mx-auto rounded-full bg-white ring-2 ring-slate-200 flex items-center justify-center">
            <svg class="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
          </div>
        </div>
        
        <!-- Nom de la boutique -->
        <h1 class="text-lg font-semibold text-slate-900 mb-2">
          {{ inactiveData.shop_name || 'Boutique' }}
        </h1>
        
        <!-- Statut fermée -->
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Fermée
        </div>
        
        <!-- Message -->
        <p class="text-slate-600 text-sm leading-relaxed">
          Cette boutique est actuellement fermée. Veuillez revenir plus tard.
        </p>
        
        <!-- Lien vers UberMarket -->
        <div class="mt-12 pt-6 border-t border-slate-200">
          <a href="https://uber-market.com" class="text-slate-400 text-xs hover:text-slate-600 transition-colors">
            Propulsé par UberMarket
          </a>
        </div>
      </div>
    </div>
    
    <!-- ===== RENDU POUR LES BOUTIQUES DE TYPE "WEBSITE" (Website Builder) ===== -->
    <div v-else-if="isWebsiteType && !isLoading && !error">
      <WebsitePagePublic
        :shop="shop"
        :pages="websitePages"
        :currentPage="currentWebsitePage"
        :currentSlug="slug && slug.length > 0 ? slug[0] : undefined"
        :isLoading="isLoading"
      />
    </div>
    
    <!-- ===== RENDU POUR LES BOUTIQUES E-COMMERCE ===== -->
    <!-- Page d'accueil de la boutique -->
    <div v-else-if="!isWebsiteType && isHome">
      <component v-if="!isLoading && !error" :is="themeComponent" :shop="shop" :customizations="customizations" />
    </div>
    
    <!-- Page produit -->
    <div v-else-if="!isWebsiteType && isProduct">
      <component v-if="!isLoading && !error" :is="themeComponent" :shop="shop" :product="product" :customizations="customizations" />
    </div>
    
    <!-- Page panier (uniquement pour e-commerce) -->
    <div v-else-if="!isWebsiteType && isCart">
      <!-- Redirection pour boutiques vitrine -->
      <div v-if="shop?.shop_type === 'website'" class="min-h-screen flex items-center justify-center bg-white">
        <div class="text-center max-w-md mx-auto px-6">
          <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-xl font-medium text-gray-900 mb-2">Site vitrine</h2>
          <p class="text-gray-600 mb-6">Cette boutique est un site vitrine. La fonction panier n'est pas disponible.</p>
          <NuxtLink to="/" class="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary transition-colors">
            Retour à la boutique
          </NuxtLink>
        </div>
      </div>
      <!-- Panier normal pour e-commerce -->
      <component v-else-if="!isLoading && !error" :is="themeComponent" :shop="shop" :customizations="customizations" />
    </div>
    
    <!-- Page produits -->
    <div v-else-if="!isWebsiteType && isProducts">
      <component v-if="!isLoading && !error" :is="themeComponent" :shop="shop" :customizations="customizations" />
    </div>
    
    <!-- Pages statiques (à-propos, CGU, etc.) - uniquement e-commerce -->
    <div v-else-if="!isWebsiteType">
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
const isInMaintenance = ref(false)
const maintenanceData = ref<{
  shop_name?: string
  shop_logo?: string
  maintenance_message?: string
  maintenance_end_date?: string
  primary_color?: string
}>({})
const isInactive = ref(false)
const inactiveData = ref<{
  shop_name?: string
  shop_logo?: string
  primary_color?: string
}>({})

// États pour les boutiques de type "website" (Website Builder)
const isWebsiteType = ref(false)
const websitePages = ref<any[]>([])
const currentWebsitePage = ref<any>(null)

// Style dynamique de la page de maintenance
const maintenancePageStyle = computed(() => {
  const primaryColor = maintenanceData.value.primary_color || '#4F46E5'
  return {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, -30)} 100%)`
  }
})

// Style dynamique de la page boutique fermée
const inactivePageStyle = computed(() => {
  const primaryColor = inactiveData.value.primary_color || '#6B7280'
  return {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, -30)} 100%)`
  }
})

// Ajuster la luminosité d'une couleur
const adjustColor = (color: string, amount: number): string => {
  const clamp = (val: number) => Math.min(255, Math.max(0, val))
  
  // Convertir hex en RGB
  let hex = color.replace('#', '')
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }
  
  const num = parseInt(hex, 16)
  const r = clamp((num >> 16) + amount)
  const g = clamp(((num >> 8) & 0x00FF) + amount)
  const b = clamp((num & 0x0000FF) + amount)
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// Formater la date de fin de maintenance
const formatMaintenanceEndDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

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

    // Gérer le mode maintenance (code 503)
    if (response.status === 503 && data.is_maintenance) {
      isInMaintenance.value = true
      isInactive.value = false
      maintenanceData.value = {
        shop_name: data.shop_name,
        shop_logo: data.shop_logo,
        maintenance_message: data.maintenance_message,
        maintenance_end_date: data.maintenance_end_date,
        primary_color: data.primary_color
      }
      return
    }

    // Gérer la boutique inactive (code 503 avec is_inactive)
    if (response.status === 503 && data.is_inactive) {
      isInactive.value = true
      isInMaintenance.value = false
      inactiveData.value = {
        shop_name: data.shop_name,
        shop_logo: data.shop_logo,
        primary_color: data.primary_color
      }
      return
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Boutique non trouvée')
    }

    // Réinitialiser les états si la boutique est accessible
    isInMaintenance.value = false
    isInactive.value = false
    maintenanceData.value = {}
    inactiveData.value = {}
    
    shop.value = data.data
    
    // Vérifier si c'est une boutique de type "website"
    isWebsiteType.value = shop.value.shop_type === 'website'
    
    if (isWebsiteType.value) {
      // Charger les pages du Website Builder
      await loadWebsitePages()
    } else {
      // Charger les customizations de la boutique (pour e-commerce)
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

// Charger les pages du Website Builder
const loadWebsitePages = async () => {
  if (!subdomain) return
  
  try {
    const config = useRuntimeConfig()
    
    // Charger toutes les pages publiées
    const pagesResponse = await fetch(`${config.public.apiBase}/shop/${subdomain}/pages`)
    const pagesData = await pagesResponse.json()
    
    if (pagesData.success && pagesData.data) {
      websitePages.value = pagesData.data
      
      // Déterminer quelle page afficher
      const pageSlug = slug && slug.length > 0 ? slug[0] : null
      
      if (pageSlug) {
        // Charger la page spécifique par son slug
        const pageResponse = await fetch(`${config.public.apiBase}/shop/${subdomain}/pages/${pageSlug}`)
        const pageData = await pageResponse.json()
        
        if (pageData.success && pageData.data) {
          currentWebsitePage.value = pageData.data
        } else {
          // Page non trouvée
          error.value = 'Page non trouvée'
        }
      } else {
        // Afficher la page d'accueil
        const homePage = websitePages.value.find((p: any) => p.is_homepage)
        if (homePage) {
          // Charger le contenu complet de la page d'accueil
          const pageResponse = await fetch(`${config.public.apiBase}/shop/${subdomain}/pages/${homePage.slug}`)
          const pageData = await pageResponse.json()
          
          if (pageData.success && pageData.data) {
            currentWebsitePage.value = pageData.data
          }
        } else if (websitePages.value.length > 0) {
          // Si pas de homepage définie, prendre la première page
          const firstPage = websitePages.value[0]
          const pageResponse = await fetch(`${config.public.apiBase}/shop/${subdomain}/pages/${firstPage.slug}`)
          const pageData = await pageResponse.json()
          
          if (pageData.success && pageData.data) {
            currentWebsitePage.value = pageData.data
          }
        }
      }
    }
  } catch (err: any) {
    console.error('Erreur lors du chargement des pages:', err)
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
  
  // SEO pour Website Builder
  if (isWebsiteType.value && currentWebsitePage.value) {
    title = currentWebsitePage.value.settings?.seo?.title || 
            `${currentWebsitePage.value.title} - ${shop.value?.name}`
    description = currentWebsitePage.value.settings?.seo?.description || 
                  shop.value?.description || 
                  'Découvrez notre site'
  }
  // SEO pour E-commerce
  else if (product.value) {
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
