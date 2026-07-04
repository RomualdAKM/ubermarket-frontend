<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement du site...</p>
    </div>
  </div>
  <!--maintenance-->
  <div
      v-else-if="isInMaintenance"
      class="min-h-screen flex items-center justify-center bg-slate-50"
  >
      <div class="text-center max-w-sm mx-auto px-6">

          <img
              v-if="maintenanceData.shop_logo"
              :src="maintenanceData.shop_logo"
              class="w-16 h-16 rounded-full mx-auto mb-6 object-cover"
          >

          <h1 class="text-xl font-semibold mb-3">
              {{ maintenanceData.shop_name }}
          </h1>

          <div
              class="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm mb-5"
          >
              Maintenance
          </div>

          <p class="text-gray-600">
              {{ maintenanceData.maintenance_message }}
          </p>

          <p
              v-if="maintenanceData.maintenance_end_date"
              class="text-sm text-gray-400 mt-4"
          >
              Retour prévu le
              {{ formatMaintenanceEndDate(maintenanceData.maintenance_end_date) }}
          </p>

      </div>
  </div>

  <div
      v-else-if="isInactive"
      class="min-h-screen flex items-center justify-center bg-slate-50"
  >
      <div class="text-center max-w-sm mx-auto px-6">

          <img
              v-if="inactiveData.shop_logo"
              :src="inactiveData.shop_logo"
              class="w-16 h-16 rounded-full mx-auto mb-6 grayscale opacity-60 object-cover"
          >

          <h1 class="text-xl font-semibold mb-3">
              {{ inactiveData.shop_name }}
          </h1>

          <div
              class="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm mb-5"
          >
              Site fermé
          </div>

          <p class="text-gray-600">
              Ce site est actuellement indisponible.
          </p>

      </div>
  </div>

  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <svg class="h-12 w-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h2 class="mt-4 text-xl font-medium text-gray-900">Site introuvable</h2>
      <p class="mt-2 text-gray-600">{{ error }}</p>
      <NuxtLink to="/" class="mt-4 inline-block px-4 py-2 bg-primary text-white rounded">
        Retour à l'accueil
      </NuxtLink>
    </div>
  </div>

  <div v-else-if="isEcommerce" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <p class="text-gray-600">Redirection en cours...</p>
    </div>
  </div>

  <WebsiteViewer v-else :shop="shop" :pages="pages" />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const subdomain = route.params.subdomain as string

const shop = ref<any>(null)
const pages = ref<any[]>([])
const isLoading = ref(true)
const error = ref('')
const isEcommerce = ref(false)

// Etat maintenance
const isInMaintenance = ref(false)

const maintenanceData = ref({
  shop_name: '',
  shop_logo: '',
  maintenance_message: '',
  maintenance_end_date: '',
  primary_color: ''
})

// Etat boutique fermée
const isInactive = ref(false)

const inactiveData = ref({
  shop_name: '',
  shop_logo: '',
  primary_color: ''
})

const formatMaintenanceEndDate = (dateString: string) => {
  const date = new Date(dateString)

  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadSite = async () => {
  isLoading.value = true
  error.value = ''

  isInMaintenance.value = false
  isInactive.value = false

  try {
    const config = useRuntimeConfig()

    // 1. Charger les infos de la boutique
    const response = await fetch(`${config.public.apiBase}/shop/${subdomain}`)
    const data = await response.json()

    // =========================
    // Maintenance
    // =========================

    if (response.status === 503 && data.is_maintenance) {

        isInMaintenance.value = true

        maintenanceData.value = {
            shop_name: data.shop_name,
            shop_logo: data.shop_logo,
            maintenance_message: data.maintenance_message,
            maintenance_end_date: data.maintenance_end_date,
            primary_color: data.primary_color
        }

        return
    }

    // =========================
    // Site désactivé
    // =========================

    if (response.status === 503 && data.is_inactive) {

        isInactive.value = true

        inactiveData.value = {
            shop_name: data.shop_name,
            shop_logo: data.shop_logo,
            primary_color: data.primary_color
        }

        return
    }

    // =========================
    // Erreurs classiques
    // =========================

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Site introuvable')
    }

    shop.value = data.data

    // 2. Si e-commerce → rediriger
    if (shop.value.shop_type !== 'website') {
      isEcommerce.value = true
      await router.replace(`/boutique/${subdomain}`)
      return
    }

    // 3. Charger la liste des pages
    const pagesResponse = await fetch(`${config.public.apiBase}/shop/${subdomain}/pages`)
    const pagesData = await pagesResponse.json()

    if (!pagesData.success || !pagesData.data?.length) {
      pages.value = []
      return
    }

    // 4. Charger le contenu complet de chaque page
    const pagesWithContent = await Promise.all(
      pagesData.data.map(async (page: any) => {
        try {
          const pageRes = await fetch(
            `${config.public.apiBase}/shop/${subdomain}/pages/${page.slug}`
          )
          const pageDetail = await pageRes.json()
          return pageDetail.data || page
        } catch {
          return page
        }
      })
    )

    pages.value = pagesWithContent

  } catch (err: any) {
    console.error('Erreur:', err)
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSite()
})

useHead(() => {
  if (!shop.value) return { title: 'Site — UberMarket' }

  const shopName = shop.value.name
  const shopDesc = shop.value.description || `Site officiel de ${shopName}`
  const shopUrl  = `https://www.uber-market.com/site/${subdomain}`

  return {
    title: `${shopName} — Site officiel`,
    meta: [
      { name: 'description', content: shopDesc.slice(0, 155) },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type',        content: 'website' },
      { property: 'og:url',         content: shopUrl },
      { property: 'og:title',       content: `${shopName} — Site officiel` },
      { property: 'og:description', content: shopDesc.slice(0, 155) },
      { property: 'og:image',       content: shop.value.logo_url || 'https://uber-market.com/og-image.png' },
    ],
    link: [{ rel: 'canonical', href: shopUrl }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: shopName,
          url: shopUrl,
          description: shopDesc,
        })
      }
    ]
  }
})

/*useHead(() => ({
  title: shop.value?.name || 'Chargement...',
  meta: [{ name: 'description', content: shop.value?.description || 'Site vitrine' }]
}))*/
</script>