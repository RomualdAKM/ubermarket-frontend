<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b border-gray-200 sticky top-0 bg-white z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <img v-if="shop?.logo" :src="logoUrl" :alt="shop.name" class="h-8 w-8 object-cover rounded" />
            <span class="text-xl font-medium text-gray-900">{{ shop?.name }}</span>
          </div>
          <nav class="hidden md:flex space-x-6">
            <button
              v-for="page in publishedPages"
              :key="page.id"
              @click="loadPageContent(page)"
              class="text-sm font-medium transition-colors pb-1"
              :class="currentPage?.id === page.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'"
            >
              {{ page.title }}
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Contenu -->
    <main>
      <div v-if="isLoadingPage" class="flex justify-center py-24">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <template v-else-if="currentPageContent">
        <div
          v-for="section in currentPageContent.sections"
          :key="section.id"
          :style="{
            backgroundColor: section.style?.backgroundColor || '#ffffff',
            color: section.style?.textColor || '#000000',
            paddingTop: (section.style?.padding?.top || 40) + 'px',
            paddingBottom: (section.style?.padding?.bottom || 40) + 'px',
          }"
        >
          <div
            class="mx-auto px-4 sm:px-6 lg:px-8"
            :style="{ maxWidth: section.style?.maxWidth || '1280px' }"
          >

            <!-- Section HERO -->
            <div
              v-if="section.type === 'hero'"
              :style="{ textAlign: section.style?.alignment || 'center' }"
            >
              <h1
                class="font-bold mb-4"
                :class="`text-${section.typography?.titleSize || '4xl'}`"
              >
                {{ section.content.title }}
              </h1>
              <p
                class="mb-8 opacity-80"
                :class="`text-${section.typography?.subtitleSize || 'xl'}`"
              >
                {{ section.content.subtitle }}
              </p>
              
                <NuxtLink
                    v-if="section.content.button?.text"
                    :to="section.content.button.url"
                    :target="section.content.button.target || '_self'"
                    class="inline-block px-6 py-3 rounded-lg font-medium transition-colors"
                    :class="section.content.button.style === 'primary'
                    ? 'bg-primary text-white hover:opacity-90'
                    : 'border border-current hover:bg-black/5'"
                >
                    {{ section.content.button.text }}
                </NuxtLink>
            </div>

            <!-- Section COUNTDOWN -->
            <div
              v-else-if="section.type === 'countdown'"
              :style="{ textAlign: section.style?.alignment || 'center' }"
            >
              <h2 class="text-2xl font-bold mb-2">{{ section.content.title }}</h2>
              <p class="opacity-75 mb-8">{{ section.content.subtitle }}</p>
              <div class="flex justify-center gap-6 mb-8">
                <div v-for="unit in countdownUnits" :key="unit.label" class="text-center">
                  <div class="text-4xl font-bold">{{ unit.value }}</div>
                  <div class="text-sm opacity-60 mt-1">{{ unit.label }}</div>
                </div>
              </div>
              
                <NuxtLink
                    v-if="section.content.buttonText"
                    :to="section.content.buttonUrl || '#'"
                    class="inline-block px-6 py-3 rounded-lg font-medium border border-current hover:bg-white/10 transition-colors"
                >
                    {{ section.content.buttonText }}
                </NuxtLink>
            </div>

            <!-- Section TEXTE -->
            <div
              v-else-if="section.type === 'text'"
              v-html="section.content"
              class="prose max-w-none"
            />

            <!-- Section IMAGE -->
            <div v-else-if="section.type === 'image'" class="text-center">
              <img
                :src="section.content.url"
                :alt="section.content.alt || ''"
                class="mx-auto max-w-full rounded"
              />
            </div>

            <!-- Fallback -->
            <div v-else class="text-center opacity-50 text-sm py-8">
              Section "{{ section.type }}" — rendu non disponible
            </div>

          </div>
        </div>

        <!-- Page sans sections -->
        <div v-if="!currentPageContent.sections?.length" class="text-center py-24 text-gray-400">
          Cette page n'a pas encore de contenu.
        </div>
      </template>

      <div v-else class="text-center py-24 text-gray-400">
        Ce site est en cours de construction.
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  shop: any
  pages: any[]
}>(), {
  pages: () => []
})

const config = useRuntimeConfig()
const subdomain = computed(() => props.shop?.subdomain || props.shop?.slug)

const publishedPages = computed(() => props.pages)
const currentPage = ref<any>(null)
const currentPageContent = ref<any>(null)
const isLoadingPage = ref(false)

// Countdown
const countdownUnits = ref([
  { label: 'Jours', value: '00' },
  { label: 'Heures', value: '00' },
  { label: 'Minutes', value: '00' },
  { label: 'Secondes', value: '00' },
])

const updateCountdown = (endDate: string) => {
  const end = new Date(endDate).getTime()
  const now = Date.now()
  const diff = Math.max(0, end - now)

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  countdownUnits.value = [
    { label: 'Jours', value: String(days).padStart(2, '0') },
    { label: 'Heures', value: String(hours).padStart(2, '0') },
    { label: 'Minutes', value: String(minutes).padStart(2, '0') },
    { label: 'Secondes', value: String(seconds).padStart(2, '0') },
  ]
}

let countdownInterval: ReturnType<typeof setInterval> | null = null

const startCountdown = (sections: any[]) => {
  if (countdownInterval) clearInterval(countdownInterval)
  const countdown = sections?.find(s => s.type === 'countdown')
  if (countdown?.content?.endDate) {
    updateCountdown(countdown.content.endDate)
    countdownInterval = setInterval(() => updateCountdown(countdown.content.endDate), 1000)
  }
}

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

const loadPageContent = async (page: any) => {
  currentPage.value = page
  isLoadingPage.value = true
  currentPageContent.value = null

  try {
    const response = await fetch(
      `${config.public.apiBase}/shop/${subdomain.value}/pages/${page.slug}`
    )
    const data = await response.json()
    const pageData = data.data || data
    currentPageContent.value = pageData
    startCountdown(pageData.sections)
  } catch (err) {
    console.error('Erreur chargement page:', err)
  } finally {
    isLoadingPage.value = false
  }
}

watch(publishedPages, (newPages) => {
  if (newPages.length > 0 && !currentPage.value) {
    const homepage = newPages.find(p => p.is_homepage) || newPages[0]
    loadPageContent(homepage)
  }
}, { immediate: true })

const logoUrl = computed(() => {
  if (!props.shop?.logo) return ''
  return `${config.public.apiBase.replace('/api', '')}/storage/${props.shop.logo}`
})
</script>