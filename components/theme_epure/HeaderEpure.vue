<template>
  <header class="border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <NuxtLink :to="homeUrl" class="flex items-center">
          <img v-if="shopLogo" :src="shopLogo" :alt="shopName" class="h-10 w-auto">
          <div v-else class="bg-primary w-8 h-8 rounded-lg" />
          <span class="ml-3 text-xl font-medium text-gray-900">{{ shopName }}</span>
        </NuxtLink>

        <!-- Navigation desktop -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink :to="homeUrl" class="text-gray-900 font-medium border-b-2 border-primary">Accueil</NuxtLink>
          <NuxtLink :to="homeUrl" class="text-gray-600 hover:text-gray-900">Produits</NuxtLink>
          <NuxtLink :to="`${homeUrl}/a-propos`" class="text-gray-600 hover:text-gray-900">À propos</NuxtLink>
          <NuxtLink :to="`${homeUrl}/cgu`" class="text-gray-600 hover:text-gray-900">CGU</NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center">
          <button class="p-2 text-gray-600 hover:text-gray-900 ml-2 relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">3</span>
          </button>
          <button class="ml-4 md:hidden text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  shop?: any
  primaryColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#e56a19'
})

const shopName = computed(() => props.shop?.name || 'Boutique')
const shopLogo = computed(() => {
  if (props.shop?.logo) {
    const config = useRuntimeConfig()
    const backendUrl = config.public.apiBase.replace('/api', '')
    return `${backendUrl}/storage/${props.shop.logo}`
  }
  return null
})

const homeUrl = computed(() => `/boutique/${props.shop?.subdomain || ''}`)
</script>

<style scoped>
/* Les styles sont déjà inclus via Tailwind CSS */
</style>