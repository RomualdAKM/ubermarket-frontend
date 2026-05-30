<template>
  <div class="website-page">
    <!-- Header / Navigation du site -->
    <header v-if="showNavigation && pages && pages.length > 1" class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav class="max-w-6xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo / Nom du site -->
          <NuxtLink to="/" class="flex items-center gap-3">
            <img 
              v-if="shop?.logo" 
              :src="getLogoUrl(shop.logo)" 
              :alt="shop.name"
              class="w-10 h-10 rounded-lg object-cover"
            />
            <div 
              v-else 
              class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              :style="{ backgroundColor: shop?.primary_color || '#10B981' }"
            >
              {{ getInitials(shop?.name) }}
            </div>
            <span class="font-semibold text-gray-900 hidden sm:block">{{ shop?.name }}</span>
          </NuxtLink>
          
          <!-- Menu navigation -->
          <div class="hidden md:flex items-center gap-1">
            <NuxtLink
              v-for="navPage in pages"
              :key="navPage.id"
              :to="getPageUrl(navPage)"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                isCurrentPage(navPage) 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              ]"
              :style="isCurrentPage(navPage) ? { backgroundColor: shop?.primary_color || '#10B981' } : {}"
            >
              {{ navPage.title }}
            </NuxtLink>
          </div>
          
          <!-- Menu mobile -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Menu mobile déroulant -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200">
          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="navPage in pages"
              :key="navPage.id"
              :to="getPageUrl(navPage)"
              :class="[
                'px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isCurrentPage(navPage) 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              ]"
              :style="isCurrentPage(navPage) ? { backgroundColor: shop?.primary_color || '#10B981' } : {}"
              @click="mobileMenuOpen = false"
            >
              {{ navPage.title }}
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>
    
    <!-- Contenu de la page -->
    <main v-if="currentPage">
      <!-- Rendu des sections avec BuilderBlock (mêmes layouts que le builder) -->
      <div v-for="section in currentPage.sections" :key="section.id">
        <BuilderBlock :section="section" />
      </div>
    </main>
    
    <!-- État vide si pas de contenu -->
    <div v-else-if="!isLoading" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center max-w-md mx-auto px-6">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-xl font-medium text-gray-900 mb-2">Page en construction</h2>
        <p class="text-gray-500">Cette page n'a pas encore de contenu.</p>
      </div>
    </div>
    
    <!-- Footer -->
    <footer v-if="showFooter" class="bg-gray-900 text-white py-8 mt-auto">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <p class="text-gray-400 text-sm">
          &copy; {{ new Date().getFullYear() }} {{ shop?.name }}. Tous droits réservés.
        </p>
        <p class="text-gray-500 text-xs mt-2">
          Propulsé par <a href="https://uber-market.com" class="hover:text-white transition-colors">UberMarket</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WebsitePage } from '~/composables/useWebsiteBuilder'

interface Props {
  shop: any
  pages: WebsitePage[]
  currentPage: WebsitePage | null
  currentSlug?: string
  subdomain?: string  
  showNavigation?: boolean
  showFooter?: boolean
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showNavigation: true,
  showFooter: true,
  isLoading: false,
  subdomain: '' 
})

const config = useRuntimeConfig()
const mobileMenuOpen = ref(false)

// Obtenir l'URL du logo
const getLogoUrl = (logoPath: string) => {
  if (!logoPath) return ''
  return `${config.public.apiBase.replace('/api', '')}/storage/${logoPath}`
}

// Obtenir les initiales
const getInitials = (name?: string) => {
  if (!name) return 'MB'
  const words = name.trim().split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Vérifier si c'est la page courante
const isCurrentPage = (page: WebsitePage) => {
  if (page.is_homepage && !props.currentSlug) return true
  if (page.slug === props.currentSlug) return true
  return false
}

const getPageUrl = (page: any) => {
  const base = `/site/${props.subdomain || props.shop?.subdomain || props.shop?.slug}`
  if (page.is_homepage) return base
  return `${base}/${page.slug}`
}
</script>

<style scoped>
.website-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
