<template>
  <!--
    pages/boutique/theme-organic/produit.vue
    ─────────────────────────────────────────
    Page détail produit du thème Organic.
    
    Fonctionnalités :
      ✅ Galerie images avec miniatures cliquables
      ✅ Sélection de variantes (couleur, taille, etc.)
      ✅ Ajout au panier avec quantité
      ✅ Badges promo + stock
      ✅ Avis clients (validés par le vendeur)
      ✅ Produits similaires
      ✅ Protection images (no download, no drag)
  -->
  <div class="min-h-screen bg-gray-50" :style="{ fontFamily }">
    <HeaderOrganic :shop="shop" :primaryColor="primaryColor" :cartCount="cartCount" />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <NuxtLink :to="`/boutique/${shop?.subdomain}`" class="hover:text-gray-900">Accueil</NuxtLink>
        <span class="text-gray-300">/</span>
        <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`" class="hover:text-gray-900">Produits</NuxtLink>
        <span class="text-gray-300">/</span>
        <span v-if="product?.subcategory">
          <NuxtLink :to="`/boutique/${shop?.subdomain}/produits?cat=${product.subcategory.id}`"
            class="hover:text-gray-900">{{ product.subcategory.name }}</NuxtLink>
          <span class="text-gray-300 mx-2">/</span>
        </span>
        <span class="text-gray-900 font-medium truncate max-w-xs">{{ product?.name }}</span>
      </nav>

      <!-- Chargement -->
      <div v-if="isLoading" class="flex justify-center py-24">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2" :style="{ borderColor: primaryColor }"></div>
      </div>

      <!-- Produit non trouvé -->
      <div v-else-if="!product" class="text-center py-24">
        <span class="text-6xl block mb-4">🔍</span>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Produit introuvable</h2>
        <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`"
          class="inline-block mt-4 px-5 py-2.5 text-white rounded-full text-sm font-medium"
          :style="{ backgroundColor: primaryColor }">
          Voir tous les produits
        </NuxtLink>
      </div>

      <!-- ── Contenu produit ── -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

        <!-- ════════════════════════════
             Galerie images
             ════════════════════════════ -->
        <div class="space-y-4">
          <!-- Image principale -->
          <div class="relative bg-white rounded-2xl overflow-hidden aspect-square border border-gray-100 shadow-sm">
            <img
              :src="activeImage"
              :alt="product.name"
              class="w-full h-full object-cover select-none"
              @contextmenu.prevent @dragstart.prevent draggable="false"
            />
            <!-- Overlay protection -->
            <div class="absolute inset-0 z-10" @contextmenu.prevent @dragstart.prevent></div>

            <!-- Badge promo -->
            <div v-if="hasPromo"
              class="absolute top-4 left-4 z-20 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
              -{{ discountPercent }}%
            </div>
            <!-- Badge stock faible -->
            <div v-if="product.stock_quantity > 0 && product.stock_quantity <= 5"
              class="absolute top-4 right-4 z-20 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
              Plus que {{ product.stock_quantity }} !
            </div>
          </div>

          <!-- Miniatures -->
          <div v-if="allImages.length > 1" class="flex gap-3 overflow-x-auto pb-1">
            <button
              v-for="(img, i) in allImages" :key="i"
              @click="activeImageIndex = i"
              class="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all"
              :class="activeImageIndex === i ? 'shadow-md' : 'border-transparent opacity-60 hover:opacity-100'"
              :style="activeImageIndex === i ? { borderColor: primaryColor } : {}">
              <img :src="img" :alt="`${product.name} - vue ${i+1}`"
                class="w-full h-full object-cover select-none"
                @contextmenu.prevent @dragstart.prevent draggable="false" />
            </button>
          </div>
        </div>

        <!-- ════════════════════════════
             Informations produit
             ════════════════════════════ -->
        <div class="flex flex-col gap-5">

          <!-- Catégorie + nom -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest mb-1"
              :style="{ color: primaryColor }">
              {{ product.subcategory?.name || shop?.name }}
            </p>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {{ product.name }}
            </h1>
          </div>

          <!-- Note moyenne (si avis) -->
          <div v-if="reviews.length > 0" class="flex items-center gap-2">
            <div class="flex">
              <span v-for="s in 5" :key="s" class="text-xl"
                :class="s <= Math.round(averageRating) ? 'text-amber-400' : 'text-gray-200'">★</span>
            </div>
            <span class="text-sm text-gray-600">
              {{ averageRating.toFixed(1) }} ({{ reviews.length }} avis)
            </span>
          </div>

          <!-- Prix -->
          <div class="flex items-baseline gap-3">
            <span class="text-3xl font-bold" :style="{ color: primaryColor }">
              {{ formatPrice(hasPromo ? product.promotional_price : product.price) }}
            </span>
            <span v-if="hasPromo" class="text-lg text-gray-400 line-through">
              {{ formatPrice(product.price) }}
            </span>
            <span v-if="hasPromo"
              class="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              Économisez {{ formatPrice(product.price - product.promotional_price) }}
            </span>
          </div>

          <!-- Description courte -->
          <div class="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-xl p-4">
            <p v-html="shortDescription"></p>
          </div>

          <!-- ── Variantes (si présentes) ── -->
          <div v-if="product.productVariants && product.productVariants.length > 0" class="space-y-4">
            <!-- Grouper par nom de variante -->
            <div v-for="(group, gName) in variantGroups" :key="gName">
              <p class="text-sm font-semibold text-gray-700 mb-2">
                {{ gName }} :
                <span class="font-normal text-gray-500">{{ selectedVariants[gName] || 'Choisir' }}</span>
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="val in group" :key="val"
                  @click="selectVariant(gName, val)"
                  class="px-3 py-1.5 rounded-lg border text-sm font-medium transition-all"
                  :class="selectedVariants[gName] === val
                    ? 'text-white border-transparent shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:border-gray-400'"
                  :style="selectedVariants[gName] === val ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}">
                  {{ val }}
                </button>
              </div>
            </div>
          </div>

          <!-- ── Quantité + Panier ── -->
          <div v-if="shop?.shop_type !== 'website'" class="flex items-center gap-4">
            <!-- Sélecteur quantité -->
            <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button @click="qty = Math.max(1, qty - 1)"
                class="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors font-semibold">−</button>
              <span class="px-5 py-3 text-sm font-semibold min-w-[3rem] text-center border-x border-gray-200">
                {{ qty }}
              </span>
              <button @click="qty = Math.min(product.stock_quantity, qty + 1)"
                class="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors font-semibold">+</button>
            </div>

            <!-- Bouton Ajouter au panier -->
            <button
              @click="addToCart"
              :disabled="product.stock_quantity === 0 || cartAdded"
              class="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :style="{ backgroundColor: cartAdded ? '#22c55e' : primaryColor }">
              <svg v-if="!cartAdded" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ product.stock_quantity === 0 ? 'Rupture de stock' : cartAdded ? 'Ajouté !' : 'Ajouter au panier' }}
            </button>
          </div>

          <!-- Badges de réassurance -->
          <div class="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <span class="text-xl block mb-1">🚚</span>
              <span class="text-xs text-gray-600">Livraison rapide</span>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <span class="text-xl block mb-1">↩️</span>
              <span class="text-xs text-gray-600">Retour 7 jours</span>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <span class="text-xl block mb-1">🔒</span>
              <span class="text-xs text-gray-600">Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Description complète ── -->
      <div v-if="product" class="mt-14 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div class="border-b border-gray-100">
          <div class="flex">
            <button v-for="tab in ['Description', 'Avis clients']" :key="tab"
              @click="activeTab = tab"
              class="px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px"
              :class="activeTab === tab
                ? 'text-gray-900 border-current'
                : 'text-gray-500 border-transparent hover:text-gray-700'"
              :style="activeTab === tab ? { borderColor: primaryColor, color: primaryColor } : {}">
              {{ tab }}
              <span v-if="tab === 'Avis clients' && reviews.length"
                class="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {{ reviews.length }}
              </span>
            </button>
          </div>
        </div>

        <div class="p-6 md:p-8">
          <!-- Onglet description -->
          <div v-if="activeTab === 'Description'"
            class="prose prose-sm max-w-none text-gray-600 leading-relaxed"
            v-html="product.description"></div>

          <!-- Onglet avis clients -->
          <div v-else>
            <!-- Aucun avis -->
            <div v-if="reviews.length === 0" class="text-center py-8 text-gray-400">
              <span class="text-4xl block mb-3">💬</span>
              <p>Aucun avis pour ce produit.</p>
            </div>

            <!-- Liste des avis validés par le vendeur -->
            <div v-else class="space-y-5">
              <!-- Résumé note globale -->
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                <div class="text-center">
                  <p class="text-4xl font-bold" :style="{ color: primaryColor }">{{ averageRating.toFixed(1) }}</p>
                  <div class="flex justify-center mt-1">
                    <span v-for="s in 5" :key="s"
                      :class="s <= Math.round(averageRating) ? 'text-amber-400' : 'text-gray-200'">★</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">{{ reviews.length }} avis</p>
                </div>
                <!-- Barres par note -->
                <div class="flex-1 space-y-1.5">
                  <div v-for="n in [5,4,3,2,1]" :key="n" class="flex items-center gap-2 text-xs text-gray-500">
                    <span class="w-3">{{ n }}</span>
                    <span class="text-amber-400 text-[10px]">★</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div class="h-full rounded-full"
                        :style="{ width: `${ratingPercent(n)}%`, backgroundColor: primaryColor }"></div>
                    </div>
                    <span class="w-6 text-right">{{ ratingCount(n) }}</span>
                  </div>
                </div>
              </div>

              <!-- Cartes avis -->
              <div v-for="review in reviews" :key="review.id"
                class="border border-gray-100 rounded-xl p-4">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="font-semibold text-sm text-gray-900">{{ review.client_name || 'Client vérifié' }}</p>
                    <p class="text-xs text-gray-400">{{ formatDate(review.created_at) }}</p>
                  </div>
                  <div class="flex">
                    <span v-for="s in 5" :key="s"
                      class="text-sm"
                      :class="s <= review.rating ? 'text-amber-400' : 'text-gray-200'">★</span>
                  </div>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Produits similaires ── -->
      <div v-if="relatedProducts.length > 0" class="mt-14">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Vous aimerez aussi</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <NuxtLink v-for="p in relatedProducts" :key="p.id"
            :to="`/boutique/${shop?.subdomain}/produit/${p.id}`"
            class="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all">
            <div class="aspect-square overflow-hidden bg-gray-50">
              <img v-if="p.preview_image" :src="getImageUrl(p.preview_image)" :alt="p.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 select-none"
                @contextmenu.prevent @dragstart.prevent draggable="false" loading="lazy"/>
              <div v-else class="w-full h-full flex items-center justify-center text-gray-200">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
            <div class="p-3">
              <p class="text-xs font-semibold uppercase tracking-wide mb-1" :style="{ color: primaryColor }">
                {{ p.subcategory?.name }}
              </p>
              <h3 class="text-sm font-semibold text-gray-900 line-clamp-2">{{ p.name }}</h3>
              <p class="text-sm font-bold mt-1" :style="{ color: primaryColor }">
                {{ formatPrice(p.promotional_price || p.price) }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </main>

    <FooterOrganic :shop="shop" :primaryColor="primaryColor" :footerText="footerText" :socialLinks="socialLinks"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import HeaderOrganic from '@/components/theme_organic/HeaderOrganic.vue'
import FooterOrganic from '@/components/theme_organic/FooterOrganic.vue'

definePageMeta({ layout: false })

interface Props { shop?: any; customizations?: any }
const props  = defineProps<Props>()
const route  = useRoute()
const config = useRuntimeConfig()

// ── Couleurs ─────────────────────────────────────────────────────
const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#2d9b5c')
const fontFamily   = computed(() => props.customizations?.home?.fonts?.family    || 'sans-serif')
const footerText   = computed(() => props.customizations?.footer?.text || `© ${new Date().getFullYear()} ${props.shop?.name}`)
const socialLinks  = computed(() => props.customizations?.footer?.socialLinks || {})

// ── Produit courant (depuis shop.products + route param) ─────────
const isLoading = ref(true)
const productId = computed(() => Number(route.params.id || route.params.productId))
const product   = computed(() =>
  (props.shop?.products || []).find((p: any) => p.id === productId.value) || null
)

onMounted(() => { isLoading.value = false })
watch(() => props.shop, () => { isLoading.value = false })

// ── Galerie images ───────────────────────────────────────────────
const activeImageIndex = ref(0)

const allImages = computed((): string[] => {
  if (!product.value) return []
  const imgs: string[] = []
  if (product.value.preview_image) imgs.push(getImageUrl(product.value.preview_image))
  ;(product.value.productImages || []).forEach((img: any) => {
    const url = getImageUrl(img.image_path)
    if (!imgs.includes(url)) imgs.push(url)
  })
  return imgs.length ? imgs : ['https://placehold.co/600x600?text=Aucune+image']
})

const activeImage = computed(() => allImages.value[activeImageIndex.value] || '')

// Réinitialiser l'image active quand le produit change
watch(product, () => { activeImageIndex.value = 0 })

// ── Prix & promo ─────────────────────────────────────────────────
const hasPromo = computed((): boolean => {
  if (!product.value?.promotional_price) return false
  const now = new Date()
  if (product.value.promotion_start_date && new Date(product.value.promotion_start_date) > now) return false
  if (product.value.promotion_end_date   && new Date(product.value.promotion_end_date)   < now) return false
  return true
})

const discountPercent = computed(() =>
  product.value ? Math.round((1 - product.value.promotional_price / product.value.price) * 100) : 0
)

// ── Description courte (50 premiers mots) ────────────────────────
const shortDescription = computed(() => {
  if (!product.value?.description) return ''
  const text = product.value.description.replace(/<[^>]*>/g, '')
  const words = text.split(' ').slice(0, 50)
  return words.join(' ') + (text.split(' ').length > 50 ? '…' : '')
})

// ── Variantes groupées par nom ───────────────────────────────────
const variantGroups = computed((): Record<string, string[]> => {
  const groups: Record<string, Set<string>> = {}
  ;(product.value?.productVariants || []).forEach((v: any) => {
    if (!groups[v.name]) groups[v.name] = new Set()
    groups[v.name].add(v.value)
  })
  const result: Record<string, string[]> = {}
  Object.entries(groups).forEach(([k, s]) => { result[k] = Array.from(s) })
  return result
})

const selectedVariants = ref<Record<string, string>>({})
const selectVariant = (name: string, value: string) => {
  selectedVariants.value = { ...selectedVariants.value, [name]: value }
}

// ── Panier ───────────────────────────────────────────────────────
const qty      = ref(1)
const cartCount = ref(0)
const cartAdded = ref(false)

const addToCart = () => {
  if (!product.value || product.value.stock_quantity === 0) return
  cartCount.value += qty.value
  cartAdded.value = true
  setTimeout(() => { cartAdded.value = false }, 2500)
}

// ── Avis clients (validés = status approved) ─────────────────────
const reviews = computed((): any[] =>
  (product.value?.reviews || []).filter((r: any) => r.status === 'approved' || r.is_approved)
)

const averageRating = computed((): number => {
  if (!reviews.value.length) return 0
  return reviews.value.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.value.length
})

const ratingCount = (n: number) => reviews.value.filter((r: any) => Math.round(r.rating) === n).length
const ratingPercent = (n: number) => reviews.value.length ? (ratingCount(n) / reviews.value.length) * 100 : 0

// ── Produits similaires (même sous-catégorie) ────────────────────
const relatedProducts = computed(() => {
  if (!product.value) return []
  return (props.shop?.products || [])
    .filter((p: any) => p.id !== product.value.id && p.status === 'active' &&
      p.subcategory?.id === product.value.subcategory?.id)
    .slice(0, 4)
})

// ── Onglet description / avis ────────────────────────────────────
const activeTab = ref('Description')

// ── Helpers ──────────────────────────────────────────────────────
const getImageUrl = (path: string): string => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${config.public.apiBase.replace('/api', '')}/storage/${path}`
}

const formatPrice = (price: number): string =>
  price != null ? `${Number(price).toLocaleString('fr-FR')} ${props.shop?.currency || 'XOF'}` : ''

const formatDate = (d: string): string =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''
</script>

<style scoped>
img { -webkit-user-drag: none; user-select: none; -webkit-user-select: none; }
.prose { color: inherit; }
</style>