<template>
  <!-- Écran de chargement -->
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement de la boutique...</p>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════
       Page de MAINTENANCE
       Affichée uniquement quand is_maintenance = true côté backend.
       CORRECTION : avant ce fix, le bloc !data.success générique
       ci-dessous (error.value) traitait maintenance ET désactivée
       de la même façon, d'où le bug "comportement identique".
       ═══════════════════════════════════════════════════════════ -->
  <div v-else-if="isInMaintenance" class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="text-center max-w-sm mx-auto px-6">
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

      <h1 class="text-lg font-semibold text-slate-900 mb-2">
        {{ maintenanceData.shop_name || 'Boutique' }}
      </h1>

      <!-- Badge MAINTENANCE — ambre, distinct du badge "Fermée" -->
      <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Maintenance
      </div>

      <p class="text-slate-600 text-sm leading-relaxed mb-6">
        {{ maintenanceData.maintenance_message || 'Cette boutique est temporairement indisponible. Votre boutique est temporairement en maintenance. Nous serons bientôt de retour.' }}
      </p>

      <p v-if="maintenanceData.maintenance_end_date" class="text-slate-500 text-xs">
        Retour prévu le {{ formatMaintenanceEndDate(maintenanceData.maintenance_end_date) }}
      </p>

      <div class="mt-12 pt-6 border-t border-slate-200">
        <a href="https://uber-market.com" class="text-slate-400 text-xs hover:text-slate-600 transition-colors">
          Propulsé par UberMarket
        </a>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════
       Page BOUTIQUE FERMÉE (désactivée par le vendeur)
       Affichée uniquement quand is_inactive = true côté backend.
       ═══════════════════════════════════════════════════════════ -->
  <div v-else-if="isInactive" class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="text-center max-w-sm mx-auto px-6">
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

      <h1 class="text-lg font-semibold text-slate-900 mb-2">
        {{ inactiveData.shop_name || 'Boutique' }}
      </h1>

      <!-- Badge FERMÉE — gris, distinct du badge "Maintenance" -->
      <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        Fermée
      </div>

      <p class="text-slate-600 text-sm leading-relaxed">
        Cette boutique est actuellement fermée. Veuillez revenir plus tard.
      </p>

      <div class="mt-12 pt-6 border-t border-slate-200">
        <a href="https://uber-market.com" class="text-slate-400 text-xs hover:text-slate-600 transition-colors">
          Propulsé par UberMarket
        </a>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════
       Erreur générique (boutique introuvable, 404, etc.)
       Uniquement si ce n'est NI maintenance NI désactivée.
       ═══════════════════════════════════════════════════════════ -->
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

  <!-- Rendu normal de la boutique -->
  <component v-else :is="themeComponent" :shop="shop" :customizations="customizations" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const route      = useRoute()
const subdomain   = route.params.subdomain as string
const { fetchCustomizations } = useCustomization()

const shop             = ref<any>(null)
const customizations   = ref<any>({})
const isLoading         = ref(true)
const error             = ref('')
const themeComponent    = ref<any>(null)

// ── États maintenance / boutique désactivée ─────────────────────
// CORRECTION : ces deux états manquaient complètement dans ce fichier.
// Sans eux, toute réponse 503 (maintenance OU désactivée) tombait
// dans le même bloc d'erreur générique "Boutique introuvable",
// d'où le comportement identique observé entre les deux modes.
const isInMaintenance = ref(false)
const maintenanceData = ref<{
  shop_name?: string
  shop_logo?: string
  maintenance_message?: string
  maintenance_end_date?: string
  primary_color?: string
}>({})

const isInactive   = ref(false)
const inactiveData = ref<{
  shop_name?: string
  shop_logo?: string
  primary_color?: string
}>({})

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

// ── Charger les données de la boutique ───────────────────────────
const loadShop = async () => {
  isLoading.value = true
  error.value     = ''

  // Réinitialiser les états avant chaque chargement
  isInMaintenance.value = false
  isInactive.value      = false

  try {
    const config   = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBase}/shop/${subdomain}`)
    const data     = await response.json()

    // ✅ CORRECTION : distinguer maintenance (503 + is_maintenance)
    // de désactivée (503 + is_inactive) AVANT de traiter l'erreur générique.
    // Sans cette vérification, les deux cas tombaient dans le même
    // throw new Error() ci-dessous → écran générique pour les deux.
    if (response.status === 503 && data.is_maintenance) {
      isInMaintenance.value = true
      maintenanceData.value = {
        shop_name:            data.shop_name,
        shop_logo:            data.shop_logo,
        maintenance_message:  data.maintenance_message,
        maintenance_end_date: data.maintenance_end_date,
        primary_color:        data.primary_color,
      }
      return
    }

    if (response.status === 503 && data.is_inactive) {
      isInactive.value = true
      inactiveData.value = {
        shop_name:     data.shop_name,
        shop_logo:     data.shop_logo,
        primary_color: data.primary_color,
      }
      return
    }

    // Erreur générique (boutique inexistante, erreur serveur, etc.)
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Boutique non trouvée')
    }

    shop.value = data.data

    // Thème de prévisualisation éventuel (query param)
    const previewThemeSlug = route.query.preview_theme as string
    const themeSlug         = previewThemeSlug || shop.value.theme?.slug

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

onMounted(() => {
  loadShop()
})

// ── SEO ────────────────────────────────────────────────────────
useHead(() => {
  if (!shop.value) return { title: 'Boutique — UberMarket' }

  const shopName     = shop.value.name || 'Boutique'
  const shopDesc      = shop.value.description || `Découvrez les produits de ${shopName} sur UberMarket`
  const shopImage     = shop.value.logo_url || shop.value.banner_url || 'https://uber-market.com/og-image.png'
  const shopUrl        = `https://uber-market.com/boutique/${subdomain}`
  const shopCategory   = shop.value.subcategory?.category?.name || shop.value.category?.name || ''

  return {
    title: `${shopName} — Boutique en ligne | UberMarket`,
    meta: [
      { name: 'description', content: `${shopDesc.slice(0, 155)}` },
      { name: 'robots', content: 'index, follow' },
      { name: 'keywords', content: `${shopName}, boutique en ligne, ${shopCategory}, acheter en ligne, UberMarket` },
      { property: 'og:type',        content: 'website' },
      { property: 'og:url',         content: shopUrl },
      { property: 'og:title',       content: `${shopName} — Boutique en ligne` },
      { property: 'og:description', content: shopDesc.slice(0, 155) },
      { property: 'og:image',       content: shopImage },
      { property: 'og:site_name',   content: 'UberMarket' },
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
</script>