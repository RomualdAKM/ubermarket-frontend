<template>
  <div v-if="isOnShopSubdomain()">
    <!-- Page de maintenance -->
    <div v-if="isInMaintenance" class="min-h-screen flex items-center justify-center" :style="maintenancePageStyle">
      <div class="text-center max-w-md mx-auto px-6">
        <!-- Logo de la boutique -->
        <div class="mb-6">
          <img 
            v-if="maintenanceData.shop_logo" 
            :src="maintenanceData.shop_logo" 
            :alt="maintenanceData.shop_name"
            class="w-20 h-20 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
          >
          <div v-else class="w-20 h-20 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
        </div>
        
        <!-- Nom de la boutique -->
        <h1 class="text-2xl font-bold text-white mb-4">
          {{ maintenanceData.shop_name || 'Boutique' }}
        </h1>
        
        <!-- Icône maintenance -->
        <div class="mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
        </div>
        
        <!-- Message de maintenance -->
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h2 class="text-lg font-semibold text-white mb-2">Maintenance en cours</h2>
          <p class="text-white/90">
            {{ maintenanceData.maintenance_message || 'Cette boutique est temporairement indisponible.' }}
          </p>
        </div>
        
        <!-- Date de fin -->
        <div v-if="maintenanceData.maintenance_end_date" class="text-white/80 text-sm">
          <p class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Retour prévu : {{ formatMaintenanceEndDate(maintenanceData.maintenance_end_date) }}
          </p>
        </div>
        
        <!-- Lien vers UberMarket -->
        <div class="mt-8 pt-6 border-t border-white/20">
          <a href="https://uber-market.com" class="text-white/60 text-xs hover:text-white transition-colors">
            Propulsé par UberMarket
          </a>
        </div>
      </div>
    </div>
    
    <!-- Page boutique fermée (inactive) -->
    <div v-else-if="isInactive" class="min-h-screen flex items-center justify-center" :style="inactivePageStyle">
      <div class="text-center max-w-md mx-auto px-6">
        <!-- Logo de la boutique -->
        <div class="mb-6">
          <img 
            v-if="inactiveData.shop_logo" 
            :src="inactiveData.shop_logo" 
            :alt="inactiveData.shop_name"
            class="w-20 h-20 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
          >
          <div v-else class="w-20 h-20 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        </div>
        
        <!-- Nom de la boutique -->
        <h1 class="text-2xl font-bold text-white mb-4">
          {{ inactiveData.shop_name || 'Boutique' }}
        </h1>
        
        <!-- Icône boutique fermée -->
        <div class="mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
        </div>
        
        <!-- Message boutique fermée -->
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h2 class="text-lg font-semibold text-white mb-2">Boutique fermée</h2>
          <p class="text-white/90">
            Cette boutique est actuellement fermée. Veuillez revenir plus tard.
          </p>
        </div>
        
        <!-- Lien vers UberMarket -->
        <div class="mt-8 pt-6 border-t border-white/20">
          <a href="https://uber-market.com" class="text-white/60 text-xs hover:text-white transition-colors">
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
        :isLoading="isLoading"
      />
    </div>
    
    <!-- ===== RENDU POUR LES BOUTIQUES E-COMMERCE ===== -->
    <component v-else-if="!isWebsiteType && !isLoading && !error" :is="themeComponent" :shop="shop" :customizations="customizations" />
    
    <!-- Écran de chargement -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement de la boutique...</p>
      </div>
    </div>
    
    <!-- Écran d'erreur -->
    <div v-if="error && !isInMaintenance && !isInactive" class="min-h-screen flex items-center justify-center bg-white">
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
    <LandingPage />
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

// États pour le Website Builder
const isWebsiteType = ref(false)
const websitePages = ref<any[]>([])
const currentWebsitePage = ref<any>(null)

// États pour maintenance et boutique inactive
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

// Charger la boutique si on est sur un sous-domaine
const loadShop = async () => {
  if (!subdomain) return
  
  isLoading.value = true
  error.value = ''

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
    }
  } catch (err: any) {
    console.error('Erreur lors du chargement de la boutique:', err)
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
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
  } catch (err: any) {
    console.error('Erreur lors du chargement des pages:', err)
    error.value = err.message || 'Une erreur est survenue'
  }
}

// Charger la boutique au montage si on est sur un sous-domaine
onMounted(() => {
  if (subdomain) {
    loadShop()
  }
})

// Metadata pour SEO
useHead(() => {
  // Si on est sur une boutique
  if (shop.value) {
    return {
      title: `${shop.value.name} - Boutique`,
      meta: [
        {
          name: 'description',
          content: shop.value?.description || 'Découvrez notre boutique en ligne'
        },
        {
          property: 'og:title',
          content: `${shop.value.name} - Boutique`
        },
        {
          property: 'og:description',
          content: shop.value?.description || 'Découvrez notre boutique en ligne'
        }
      ]
    }
  }
  
  // Page d'accueil principale Uber-Market
  return {
    title: 'Uber-Market - Créez votre boutique en ligne en 1m30s',
    meta: [
      {
        name: 'description',
        content: 'Uber-market une plate-forme intuitive, une solution clé en main qui vous permet de créer ou de développer votre activité en ligne sans aucune connaissance en programmation.'
      },
      {
        name: 'keywords',
        content: 'créer boutique en ligne, e-commerce, site web, marketplace, sans code, solution clé en main'
      },
      {
        property: 'og:title',
        content: 'Uber-Market - Créez votre boutique en ligne en 1m30s'
      },
      {
        property: 'og:description',
        content: 'Uber-market une plate-forme intuitive, une solution clé en main qui vous permet de créer ou de développer votre activité en ligne sans aucune connaissance en programmation.'
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: 'Uber-Market - Créez votre boutique en ligne en 1m30s'
      },
      {
        name: 'twitter:description',
        content: 'Uber-market une plate-forme intuitive, une solution clé en main qui vous permet de créer ou de développer votre activité en ligne sans aucune connaissance en programmation.'
      }
    ]
  }
})
</script>