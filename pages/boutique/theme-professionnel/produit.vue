<template>
  <div class="min-h-screen bg-white">
    <!-- En-tête -->
    <header class="border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="bg-gray-900 w-8 h-8" />
            <span class="ml-3 text-xl font-medium text-gray-900">{{ shop?.name || 'Boutique Pro' }}</span>
          </div>

          <!-- Navigation desktop -->
          <nav class="hidden md:flex space-x-8">
            <NuxtLink :to="`/boutique/${shop?.subdomain}`" class="text-gray-600 hover:text-gray-900">Accueil</NuxtLink>
            <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`" class="text-gray-600 hover:text-gray-900">Produits</NuxtLink>
            <a href="#" class="text-gray-600 hover:text-gray-900">À propos</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">Contact</a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center">
            <button class="p-2 text-gray-600 hover:text-gray-900">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            <button class="p-2 text-gray-600 hover:text-gray-900 ml-2 relative">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Navigation breadcrumb -->
        <nav class="flex mb-8" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2 text-sm">
            <li><NuxtLink :to="`/boutique/${shop?.subdomain}`" class="text-gray-500 hover:text-gray-700">Accueil</NuxtLink></li>
            <li><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></li>
            <li><span class="text-gray-900">{{ product?.name }}</span></li>
          </ol>
        </nav>

        <div class="flex flex-col md:flex-row gap-8">
          <!-- Galerie d'images -->
          <div class="md:w-1/2">
            <div class="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
              <img :src="mainImage" :alt="product?.name" class="w-full h-full object-contain" />
            </div>
            <div v-if="galleryImages.length > 0" class="grid grid-cols-5 gap-2">
              <div 
                v-for="(img, index) in galleryImages" 
                :key="index"
                @click="selectedImageIndex = index"
                class="aspect-square bg-gray-50 rounded border cursor-pointer overflow-hidden"
                :class="selectedImageIndex === index ? 'border-primary' : 'border-gray-200'"
              >
                <img :src="img" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Informations produit -->
          <div class="md:w-1/2">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product?.name }}</h1>
            <p class="text-2xl text-primary font-semibold mb-6">{{ formattedPrice }}</p>
            
            <div class="rich-description prose prose-sm max-w-none text-gray-600 mb-8 overflow-hidden" v-html="productDescription"></div>

            <div class="border-t border-gray-200 pt-6">
              <button class="w-full px-6 py-4 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors">
                AJOUTER AU PANIER
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-gray-900 text-white mt-16 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
        &copy; {{ new Date().getFullYear() }} {{ shop?.name }}. Tous droits réservés.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  shop?: any
  product?: any
  customizations?: any
}>()

const selectedImageIndex = ref(0)
const config = useRuntimeConfig()
const backendUrl = config.public.apiBase.replace('/api', '')

const productDescription = computed(() => props.product?.description || '')

const galleryImages = computed(() => {
  const imgs = []
  if (props.product?.preview_image) {
    imgs.push(`${backendUrl}/storage/${props.product.preview_image}`)
  }
  if (props.product?.product_images) {
    props.product.product_images.forEach((i: any) => {
      imgs.push(`${backendUrl}/storage/${i.image_path}`)
    })
  }
  return imgs
})

const mainImage = computed(() => galleryImages.value[selectedImageIndex.value] || 'https://placehold.co/600x600?text=Pas+d\'image')

const formattedPrice = computed(() => {
  const price = props.product?.price || 0
  const currency = props.shop?.currency || 'XOF'
  return `${parseFloat(price).toLocaleString('fr-FR')} ${currency}`
})
</script>

<style scoped>
.text-primary {
  color: #e56a19;
}
</style>