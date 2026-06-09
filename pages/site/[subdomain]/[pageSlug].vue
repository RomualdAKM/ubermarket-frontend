<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  </div>

  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <h2 class="text-xl font-medium text-gray-900">Page introuvable</h2>
      <p class="mt-2 text-gray-600">{{ error }}</p>
      <NuxtLink :to="`/site/${subdomain}`" class="mt-4 inline-block px-4 py-2 bg-primary text-white rounded">
        Retour à l'accueil
      </NuxtLink>
    </div>
  </div>

  <WebsiteViewer v-else :shop="shop" :pages="pages" />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const subdomain = route.params.subdomain as string
const pageSlug = route.params.pageSlug as string

const shop = ref<any>(null)
const pages = ref<any[]>([])
const isLoading = ref(true)
const error = ref('')

const loadSite = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const config = useRuntimeConfig()

    // Charger la boutique
    const response = await fetch(`${config.public.apiBase}/shop/${subdomain}`)
    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Site introuvable')
    }

    shop.value = data.data

    // Charger toutes les pages avec leur contenu
    const pagesResponse = await fetch(`${config.public.apiBase}/shop/${subdomain}/pages`)
    const pagesData = await pagesResponse.json()

    if (!pagesData.success || !pagesData.data?.length) {
      pages.value = []
      return
    }

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

    // Vérifier que la page demandée existe
    const targetPage = pagesWithContent.find(p => p.slug === pageSlug)
    if (!targetPage) {
      error.value = `La page "${pageSlug}" n'existe pas.`
    }

  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSite()
})

useHead(() => {
  if (!page.value) return { title: 'Page — UberMarket' }

  const pageTitle = page.value.title
  const pageDesc  = page.value.meta_description
    || page.value.sections?.[0]?.content?.text?.slice(0, 155)
    || `${pageTitle} — ${shop.value?.name}`
  const pageUrl   = `https://www.uber-market.com/site/${subdomain}/${pageSlug}`

  return {
    title: `${pageTitle} — ${shop.value?.name}`,
    meta: [
      { name: 'description', content: pageDesc },
      { name: 'robots', content: page.value.is_published ? 'index, follow' : 'noindex, nofollow' },
      { property: 'og:type',        content: 'article' },
      { property: 'og:url',         content: pageUrl },
      { property: 'og:title',       content: `${pageTitle} — ${shop.value?.name}` },
      { property: 'og:description', content: pageDesc },
    ],
    link: [{ rel: 'canonical', href: pageUrl }]
  }
})

/*seHead(() => ({
  title: shop.value?.name || 'Chargement...',
}))*/
</script>