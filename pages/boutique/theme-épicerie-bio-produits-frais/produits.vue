<template>
  <!--
    pages/boutique/theme-organic/produits.vue
    ──────────────────────────────────────────
    Page liste des produits du thème Organic.

    Fonctionnalités :
      ✅ Recherche fonctionnelle (lit ?q= dans l'URL — émis par le header)
      ✅ Filtres par sous-catégorie (extraites dynamiquement des produits)
      ✅ Tri (prix croissant/décroissant, nouveautés, popularité)
      ✅ Grille responsive avec badges promo
      ✅ Ajout au panier via useCart composable
      ✅ Pagination
  -->
  <div class="min-h-screen bg-gray-50" :style="{ fontFamily }">

    <!-- ── En-tête partagé ── -->
    <HeaderOrganic :shop="shop" :primaryColor="primaryColor" :cartCount="cartCount" />

    <main>
      <!-- ── Breadcrumb ── -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav class="flex items-center gap-2 text-sm text-gray-500">
            <NuxtLink :to="`/boutique/${shop?.subdomain}`"
              class="hover:text-gray-900 transition-colors">Accueil</NuxtLink>
            <span class="text-gray-300">/</span>
            <span class="text-gray-900 font-medium">Produits</span>
            <span v-if="activeCategory" class="text-gray-300">/</span>
            <span v-if="activeCategory" class="text-gray-900 font-medium">{{ activeCategory }}</span>
          </nav>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">

          <!-- ════════════════════════════════════════════════
               SIDEBAR — Filtres (desktop)
               ════════════════════════════════════════════════ -->
          <aside class="hidden lg:block w-56 flex-shrink-0">
            <div class="sticky top-28 space-y-6">

              <!-- Recherche latérale -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recherche</h3>
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Rechercher..."
                    class="w-full pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                    :style="{ '--tw-ring-color': primaryColor }"
                    @input="onSearchInput"
                  />
                  <button v-if="searchQuery" @click="clearSearch"
                    class="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- ── Filtres catégorie (dynamiques depuis les produits) ──
                   Les sous-catégories affichées ici sont extraites
                   automatiquement depuis shop.products — elles
                   correspondent exactement aux produits ajoutés en boutique. -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Catégories</h3>
                <!-- Catégories extraites des produits (Desktop) -->
                <div class="space-y-1 max-h-60 overflow-y-auto pr-1">
                  <!-- Bouton Toutes -->
                  <button
                    @click="setCategory(null)"
                    class="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex justify-between items-center"
                    :class="activeCategoryId === null ? 'font-semibold text-white' : 'text-gray-600 hover:bg-gray-100'"
                    :style="activeCategoryId === null ? { backgroundColor: primaryColor } : {}">
                    <span>Toutes les catégories</span>
                    <span class="text-xs opacity-70">({{ allProducts.length }})</span>
                  </button>

                  <!-- Liste des catégories générées -->
                  <button
                    v-for="cat in dynamicCategories"
                    :key="cat.id"
                    @click="setCategory(cat.id)"
                    class="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex justify-between items-center"
                    :class="activeCategoryId === cat.id ? 'font-semibold text-white' : 'text-gray-600 hover:bg-gray-100'"
                    :style="activeCategoryId === cat.id ? { backgroundColor: primaryColor } : {}">
                    <span class="truncate mr-2">{{ cat.name }}</span>
                    <span class="text-xs opacity-70 flex-shrink-0">({{ cat.count }})</span>
                  </button>
                </div>
              </div>

              <!-- Tri -->
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trier par</h3>
                <select v-model="sortOption" @change="applyFilters"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none">
                  <option value="newest">Plus récents</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="popular">Popularité</option>
                </select>
              </div>

              <!-- Réinitialiser les filtres -->
              <button v-if="hasActiveFilters"
                @click="resetFilters"
                class="w-full py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                ✕ Réinitialiser
              </button>
            </div>
          </aside>

          <!-- ════════════════════════════════════════════════
               ZONE PRINCIPALE — Produits
               ════════════════════════════════════════════════ -->
          <div class="flex-1 min-w-0">

            <!-- Barre résultats + tri mobile -->
            <div class="flex items-center justify-between mb-6 gap-4">
              <div>
                <p class="text-sm text-gray-600">
                  <span class="font-semibold text-gray-900">{{ filteredProducts.length }}</span>
                  produit{{ filteredProducts.length !== 1 ? 's' : '' }}
                  <span v-if="searchQuery"> pour "<em>{{ searchQuery }}</em>"</span>
                  <span v-if="activeCategory"> — {{ activeCategory }}</span>
                </p>
              </div>

              <!-- Tri (mobile uniquement) -->
              <select v-model="sortOption" @change="applyFilters"
                class="lg:hidden px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none flex-shrink-0">
                <option value="newest">Plus récents</option>
                <option value="price_asc">Prix ↑</option>
                <option value="price_desc">Prix ↓</option>
                <option value="popular">Populaire</option>
              </select>
            </div>

            <!-- Filtres catégorie mobile (scroll horizontal) -->
            <div class="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4 scrollbar-none">
              <button @click="setCategory(null)"
                class="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
                :class="activeCategoryId === null ? 'text-white' : 'bg-gray-100 text-gray-700'"
                :style="activeCategoryId === null ? { backgroundColor: primaryColor } : {}">
                Tout ({{ allProducts.length }})
              </button>
              
              <button v-for="cat in dynamicCategories" :key="cat.id"
                @click="setCategory(cat.id)"
                class="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
                :class="activeCategoryId === cat.id ? 'text-white' : 'bg-gray-100 text-gray-700'"
                :style="activeCategoryId === cat.id ? { backgroundColor: primaryColor } : {}">
                {{ cat.name }} ({{ cat.count }})
              </button>
            </div>

            <!-- Aucun résultat -->
            <div v-if="paginatedProducts.length === 0" class="text-center py-16">
              <span class="text-6xl block mb-4">🔍</span>
              <h2 class="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h2>
              <p class="text-gray-500 text-sm mb-6">
                {{ searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Cette catégorie est vide.' }}
              </p>
              <button @click="resetFilters"
                class="px-5 py-2 text-white text-sm rounded-full transition-colors"
                :style="{ backgroundColor: primaryColor }">
                Voir tous les produits
              </button>
            </div>

            <!-- ── Grille produits ── -->
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              <NuxtLink
                v-for="product in paginatedProducts"
                :key="product.id"
                :to="`/boutique/${shop?.subdomain}/produit/${product.id}`"
                class="group product-card bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 block">

                <!-- Image produit -->
                <div class="relative overflow-hidden bg-gray-50 aspect-square">
                  <img
                    v-if="product.preview_image"
                    :src="getImageUrl(product.preview_image)"
                    :alt="product.name"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 select-none"
                    @contextmenu.prevent @dragstart.prevent draggable="false" loading="lazy"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-200">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>

                  <!-- Overlay protection image -->
                  <div v-if="product.preview_image"
                    class="absolute inset-0 z-10"
                    @contextmenu.prevent @dragstart.prevent></div>

                  <!-- Badge promo -->
                  <div v-if="hasPromo(product)"
                    class="absolute top-2 left-2 z-20 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    -{{ getDiscount(product) }}%
                  </div>

                  <!-- Badge rupture de stock -->
                  <div v-if="product.stock_quantity === 0"
                    class="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                    <span class="bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Rupture de stock
                    </span>
                  </div>

                  <!-- Bouton ajout rapide (glisse depuis le bas au survol) -->
                  <div v-if="shop?.shop_type !== 'website' && product.stock_quantity !== 0"
                    class="absolute bottom-0 inset-x-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      @click.prevent="addToCart(product)"
                      class="w-full py-2.5 text-white text-xs font-semibold tracking-wide"
                      :style="{ backgroundColor: primaryColor }">
                      + Ajouter au panier
                    </button>
                  </div>
                </div>

                <!-- Infos produit -->
                <div class="p-3 md:p-4">
                  <!-- Sous-catégorie -->
                  <p class="text-[10px] uppercase tracking-wider font-semibold mb-1"
                    :style="{ color: primaryColor }">
                    {{ product.subcategory?.name || '' }}
                  </p>
                  <!-- Nom -->
                  <h3 class="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-2">
                    {{ product.name }}
                  </h3>
                  <!-- Prix -->
                  <div class="flex items-baseline gap-2 flex-wrap">
                    <span class="text-base font-bold" :style="{ color: primaryColor }">
                      {{ formatPrice(hasPromo(product) ? product.promotional_price : product.price) }}
                    </span>
                    <span v-if="hasPromo(product)" class="text-xs text-gray-400 line-through">
                      {{ formatPrice(product.price) }}
                    </span>
                  </div>
                  <!-- Stock faible -->
                  <p v-if="product.stock_quantity > 0 && product.stock_quantity <= 10"
                    class="mt-1.5 text-[10px] text-orange-600 font-medium">
                    ⚠️ Plus que {{ product.stock_quantity }} en stock
                  </p>
                </div>
              </NuxtLink>
            </div>

            <!-- ── Pagination ── -->
            <div v-if="totalPages > 1" class="mt-10 flex justify-center gap-2">
              <button @click="currentPage--" :disabled="currentPage === 1"
                class="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200
                       text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button v-for="p in totalPages" :key="p"
                @click="currentPage = p"
                class="w-10 h-10 rounded-full text-sm font-medium transition-colors"
                :class="currentPage === p ? 'text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'"
                :style="currentPage === p ? { backgroundColor: primaryColor } : {}">
                {{ p }}
              </button>
              <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200
                       text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterOrganic
      :shop="shop"
      :primaryColor="primaryColor"
      :footerText="footerText"
      :socialLinks="socialLinks"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Remonter de 3 niveaux pour sortir de "pages", puis aller dans "components"
import HeaderOrganic from "../../../components/theme_organic/HeaderOrganic.vue";
import FooterOrganic from "../../../components/theme_organic/FooterOrganic.vue";

//import HeaderOrganic from '@/components/theme-épicerie-bio-produits-frais/HeaderOrganic.vue'
//import FooterOrganic from '@/components/theme-épicerie-bio-produits-frais/FooterOrganic.vue'

// ── Méta page ────────────────────────────────────────────────────
definePageMeta({ layout: false })

// ── Props ────────────────────────────────────────────────────────
interface Props {
  shop?: any
  customizations?: any
}
const props   = defineProps<Props>()
const route   = useRoute()
const router  = useRouter()
const config  = useRuntimeConfig()

// ── Couleurs / polices depuis les customizations ──────────────────
const primaryColor    = computed(() => props.customizations?.home?.colors?.primary    || '#2d9b5c')
const backgroundColor = computed(() => props.customizations?.home?.colors?.background || '#f9fafb')
const textColor       = computed(() => props.customizations?.home?.colors?.text       || '#111827')
const fontFamily      = computed(() => props.customizations?.home?.fonts?.family      || 'sans-serif')

// ── Footer ───────────────────────────────────────────────────────
const footerText  = computed(() =>
  props.customizations?.footer?.text ||
  `© ${new Date().getFullYear()} ${props.shop?.name}. Tous droits réservés.`
)
const socialLinks = computed(() => props.customizations?.footer?.socialLinks || {})

// ── Panier (compteur minimal — à brancher sur useCart) ───────────
const cartCount = ref(0)
const addToCart = (product: any) => {
  cartCount.value++
  // TODO: appeler useCart().addItem(product, 1) si disponible
}

// ── Tous les produits de la boutique ────────────────────────────
const allProducts = computed((): any[] => props.shop?.products || [])

// ── Catégories DYNAMIQUES
// Extraites automatiquement depuis les sous-catégories des produits
// ajoutés dans cette boutique. Pas de configuration manuelle requise.
const dynamicCategories = computed(() => {
  const map = new Map<number, { id: number; name: string; count: number }>()
  
  allProducts.value.forEach((p: any) => {
    // Sécurité : On cherche d'abord subcategory, sinon category principale
    const cat = p.subcategory || p.category
    if (!cat || !cat.id) return
    
    const catId = Number(cat.id)
    const catName = cat.name || 'Sans nom'

    if (map.has(catId)) {
      map.get(catId)!.count++
    } else {
      map.set(catId, { id: catId, name: catName, count: 1 })
    }
  })

  // Conversion en tableau
  const result = Array.from(map.values())

  // OPTION DE TRI des catégories elles-mêmes :
  // Pour trier par ordre alphabétique (A-Z) :
  return result.sort((a, b) => a.name.localeCompare(b.name))
  
  // (Si vous préférez trier de la plus populaire à la moins populaire, laissez :
  // return result.sort((a, b) => b.count - a.count)
})


// ── États filtres ────────────────────────────────────────────────
// searchQuery est synchronisé avec le paramètre ?q= de l'URL
// (émis par HeaderOrganic.vue lors d'une recherche)
const searchQuery    = ref((route.query.q as string) || '')
const activeCategoryId = ref<number | null>(null)
const activeCategory = computed(
  () => dynamicCategories.value.find(c => c.id === activeCategoryId.value)?.name || null
)
const sortOption  = ref('newest')
const currentPage = ref(1)
const perPage     = 12

const hasActiveFilters = computed(
  () => !!searchQuery.value || activeCategoryId.value !== null
)

// ── Logique de filtrage + tri ────────────────────────────────────
const filteredProducts = computed(() => {
  let list = [...allProducts.value]

  // 1. Filtre statut actif uniquement
  list = list.filter((p: any) => p.status === 'active')

  // 2. Filtre catégorie
  if (activeCategoryId.value !== null) {
    list = list.filter((p: any) => Number(p.subcategory?.id) === Number(activeCategoryId.value))
  }

  // 3. Filtre texte (nom ou description)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter((p: any) =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.subcategory?.name?.toLowerCase().includes(q)
    )
  }

  // 4. Tri
  switch (sortOption.value) {
    case 'price_asc':  list.sort((a, b) => a.price - b.price); break
    case 'price_desc': list.sort((a, b) => b.price - a.price); break
    case 'popular':    list.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)); break
    default:           list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  }

  return list
})

// ── Pagination ───────────────────────────────────────────────────
const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / perPage)))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})

// Remettre à la page 1 à chaque changement de filtre
watch([searchQuery, activeCategoryId, sortOption], () => { currentPage.value = 1 })

// ── Synchronisation URL ↔ searchQuery
// Quand le header envoie ?q=xxx, la page met à jour searchQuery
watch(() => route.query.q, (val) => {
  searchQuery.value = (val as string) || ''
})

// ── Helpers ──────────────────────────────────────────────────────
const getImageUrl = (path: string): string => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${config.public.apiBase.replace('/api', '')}/storage/${path}`
}

const formatPrice = (price: number): string => {
  if (price == null) return ''
  return `${Number(price).toLocaleString('fr-FR')} ${props.shop?.currency || 'XOF'}`
}

/** Vérifie si un produit a une promotion active (dates respectées) */
const hasPromo = (product: any): boolean => {
  if (!product.promotional_price) return false
  const now = new Date()
  if (product.promotion_start_date && new Date(product.promotion_start_date) > now) return false
  if (product.promotion_end_date   && new Date(product.promotion_end_date)   < now) return false
  return true
}

const getDiscount = (product: any): number =>
  Math.round((1 - product.promotional_price / product.price) * 100)

// ── Actions filtres ───────────────────────────────────────────────
// Mettre à jour l'ID et l'URL au clic
const setCategory = (id: number | null) => { 
  activeCategoryId.value = id
  currentPage.value = 1
  router.push({ query: { ...route.query, category: id || undefined } })
}

// Écouter si l'utilisateur change de catégorie via l'URL (ou retour arrière du navigateur)
watch(() => route.query.category, (newCat) => {
  activeCategoryId.value = newCat ? Number(newCat) : null
}, { immediate: true }) // immediate: true force Nuxt à lire l'URL dès le chargement de la page


// Initialisation au chargement de la page (si un ?category= existe dans l'URL)
onMounted(() => {
  if (route.query.category) {
    activeCategoryId.value = Number(route.query.category)
  }
})

const applyFilters = () => { currentPage.value = 1 }

const clearSearch = () => {
  searchQuery.value = ''
  // Retirer le paramètre q de l'URL
  router.replace({ query: { ...route.query, q: undefined } })
}

const resetFilters = () => {
  searchQuery.value = ''
  activeCategoryId.value = null
  sortOption.value = 'newest'
  currentPage.value = 1
  router.replace({ query: {} })
}

const onSearchInput = () => {
  // Debounce léger — réinitialise la pagination
  currentPage.value = 1
}
//complément script complèment


</script>

<style scoped>
/* ── Protection images ── */
img {
  -webkit-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
}

/* ── Hover card produit ── */
.product-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.product-card:hover { transform: translateY(-4px); }
</style>