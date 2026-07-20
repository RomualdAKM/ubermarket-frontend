<template>
  <div class="theme-cuisine" :style="cssVars">
    <HeaderCuisine :shop="shop" :primaryColor="primaryColor" />

    <main class="cuisine-products-page">
      <div class="cuisine-container">

        <!-- En-tête de page -->
        <div class="cuisine-section-header">
          <p class="cuisine-eyebrow">Découvrez</p>
          <h1 class="cuisine-section-title">Notre Menu Complet</h1>
          <div class="cuisine-divider">
            <span class="cuisine-divider__ornament">✦</span>
          </div>
          <p class="cuisine-section-desc">
            Des saveurs authentiques préparées avec passion, des ingrédients frais sélectionnés avec soin.
          </p>
        </div>

        <!-- Filtres catégories -->
        <div class="cuisine-filters">
          <button
            class="cuisine-filter"
            :class="{ 'is-active': activeCategory === 'all' }"
            @click="activeCategory = 'all'"
          >Tout</button>
          <button
            v-for="cat in categories"
            :key="cat"
            class="cuisine-filter"
            :class="{ 'is-active': activeCategory === cat }"
            @click="activeCategory = cat"
          >{{ cat }}</button>
        </div>

        <!-- Barre de recherche + tri -->
        <div class="cuisine-toolbar">
          <div class="cuisine-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher un plat..."
            />
          </div>
          <select v-model="sortBy" class="cuisine-sort">
            <option value="default">Tri par défaut</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="name_asc">Nom (A-Z)</option>
          </select>
        </div>

        <!-- Résultats -->
        <div v-if="addToCartError" class="cuisine-cart-error">{{ addToCartError }}</div>

        <p class="cuisine-results-count">
          {{ filteredProducts.length }} plat{{ filteredProducts.length > 1 ? 's' : '' }} trouvé{{ filteredProducts.length > 1 ? 's' : '' }}
        </p>

        <div v-if="filteredProducts.length === 0" class="cuisine-empty">
          <p>Aucun plat ne correspond à votre recherche.</p>
        </div>

        <div v-else class="cuisine-grid">
          <NuxtLink
            v-for="product in filteredProducts"
            :key="product.id"
            :to="`/boutique/${shop?.subdomain}/produit/${product.id}`"
            class="cuisine-card"
          >
            <div class="cuisine-card__img-wrap">
              <div class="cuisine-card__img-inner">
                <img
                  v-if="product.preview_image"
                  :src="getImageUrl(product.preview_image)"
                  :alt="product.name"
                  class="cuisine-card__img"
                  loading="lazy"
                  @contextmenu.prevent
                  @dragstart.prevent
                  draggable="false"
                />
                <div v-else class="cuisine-card__img-placeholder">
                  <span>🍽️</span>
                </div>
              </div>
              <div class="cuisine-card__img-overlay">
                <div class="absolute inset-0 z-10" @contextmenu.prevent></div>
              </div>
              <div v-if="product.promotional_price" class="cuisine-card__badge">Promo</div>
              <div v-if="product.subcategory" class="cuisine-card__cat">
                {{ product.subcategory.name }}
              </div>
            </div>

            <div class="cuisine-card__body">
              <h3 class="cuisine-card__name">{{ product.name }}</h3>
              <p class="cuisine-card__desc">{{ getCleanDesc(product.description, 90) }}</p>
              <div class="cuisine-card__footer">
                <div class="cuisine-card__price">
                  <span v-if="product.promotional_price" class="cuisine-card__price-old">
                    {{ formatPrice(product.price) }}
                  </span>
                  <span class="cuisine-card__price-main">
                    {{ formatPrice(product.promotional_price || product.price) }}
                  </span>
                </div>
                <button
                  v-if="shop?.shop_type !== 'website'"
                  class="cuisine-card__btn"
                  @click.prevent="addToCart(product)"
                  :disabled="addingProductId === product.id"
                  aria-label="Commander"
                >
                  {{ addingProductId === product.id ? '...' : 'Commander' }}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                  </svg>
                </button>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="cuisine-pagination">
          <button
            class="cuisine-pagination__btn"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >Précédent</button>
          <span class="cuisine-pagination__info">Page {{ currentPage }} / {{ totalPages }}</span>
          <button
            class="cuisine-pagination__btn"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >Suivant</button>
        </div>

      </div>
    </main>

    <FooterCuisine
      :shop="shop"
      :backgroundColor="bgColor"
      :primaryColor="primaryColor"
      :footerText="footerText"
      :socialLinks="socialLinks"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import HeaderCuisine from '@/components/theme_cuisine/HeaderCuisine.vue'
import FooterCuisine from '@/components/theme_cuisine/FooterCuisine.vue'
import { useCart } from '~/composables/useCart'

interface Props {
  shop?: any
  customizations?: any
}
const props = defineProps<Props>()

definePageMeta({ layout: false })

// ============================
// COULEURS
// ============================
const primaryColor   = computed(() => props.customizations?.home?.colors?.primary    || '#8B1A1A')
const secondaryColor = computed(() => props.customizations?.home?.colors?.secondary  || '#C9A84C')
const bgColor        = computed(() => props.customizations?.home?.colors?.background || '#FAF7F2')
const textColor      = computed(() => props.customizations?.home?.colors?.text       || '#1C1C1C')
const fontFamily     = computed(() => props.customizations?.home?.fonts?.family      || "'Cormorant Garamond', Georgia, serif")

const cssVars = computed(() => ({
  '--c-primary':   primaryColor.value,
  '--c-secondary': secondaryColor.value,
  '--c-bg':        bgColor.value,
  '--c-text':      textColor.value,
  '--c-font':      fontFamily.value,
}))

const shop = computed(() => props.shop)
const shopSubdomain = computed(() => props.shop?.subdomain || '')
const route = useRoute()

const config = useRuntimeConfig()
const backendUrl = config.public.backendUrl || config.public.apiBase?.replace('/api', '')
const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${backendUrl}/storage/${path}`
}

const footerText = computed(() =>
  props.customizations?.footer?.text ||
  `© ${new Date().getFullYear()} ${props.shop?.name || 'Restaurant'}. Tous droits réservés.`
)
const socialLinks = computed(() => props.customizations?.footer?.socialLinks || {})

// ============================
// PRODUITS / FILTRES / TRI
// ============================
const allProducts = computed(() => props.shop?.products || [])

const activeCategory = ref('all')
const searchQuery = ref('')
const sortBy = ref('default')
const currentPage = ref(1)
const perPage = 12

// Pré-remplir le filtre catégorie si on arrive depuis un lien
// du type /produits?categorie=Entrées (ex: section "Nos Spécialités" de l'accueil)
onMounted(() => {
  const catFromUrl = route.query.categorie
  if (typeof catFromUrl === 'string' && catFromUrl.trim()) {
    activeCategory.value = catFromUrl
  }
})

const categories = computed(() => {
  const cats = new Set<string>()
  allProducts.value.forEach((p: any) => {
    if (p.subcategory?.name) cats.add(p.subcategory.name)
  })
  return Array.from(cats)
})

const searchedAndFilteredProducts = computed(() => {
  let list = allProducts.value

  if (activeCategory.value !== 'all') {
    list = list.filter((p: any) => p.subcategory?.name === activeCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((p: any) => p.name.toLowerCase().includes(q))
  }

  const sorted = [...list]
  if (sortBy.value === 'price_asc') {
    sorted.sort((a: any, b: any) => (a.promotional_price || a.price) - (b.promotional_price || b.price))
  } else if (sortBy.value === 'price_desc') {
    sorted.sort((a: any, b: any) => (b.promotional_price || b.price) - (a.promotional_price || a.price))
  } else if (sortBy.value === 'name_asc') {
    sorted.sort((a: any, b: any) => a.name.localeCompare(b.name))
  }

  return sorted
})

const totalPages = computed(() => Math.max(1, Math.ceil(searchedAndFilteredProducts.value.length / perPage)))

const filteredProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return searchedAndFilteredProducts.value.slice(start, start + perPage)
})

// Revenir à la page 1 si les filtres changent et rendent la page courante invalide
watch([activeCategory, searchQuery, sortBy], () => { currentPage.value = 1 })

const formatPrice = (price: number) => {
  const currency = props.shop?.currency || 'XOF'
  return `${Number(price).toLocaleString('fr-FR')} ${currency}`
}

const getCleanDesc = (text: string, max: number) => {
  if (!text) return ''
  const clean = text.replace(/<[^>]+>/g, '')
  return clean.length > max ? clean.slice(0, max) + '…' : clean
}

// ============================
// AJOUT RAPIDE AU PANIER
// Même logique que index.vue : prend la première combinaison de
// variantes en stock s'il y en a, sinon ajout simple.
// ============================
const { addToCart: addToCartApi } = useCart()
const addingProductId = ref<number | null>(null)
const addToCartError = ref('')

const addToCart = async (product: any) => {
  if (!shopSubdomain.value) return
  addToCartError.value = ''

  const variants = product.productVariants || product.product_variants || []
  let variantIds: number[] | null = null

  if (variants.length > 0) {
    const firstInStock = variants.find((v: any) => (v.stock_quantity ?? 0) > 0)
    if (!firstInStock) {
      addToCartError.value = `"${product.name}" n'a plus de stock disponible pour le moment.`
      return
    }
    variantIds = [firstInStock.id]
  } else if (product.availability_type !== 'preorder' && (product.stock_quantity ?? 0) <= 0) {
    addToCartError.value = `"${product.name}" est en rupture de stock.`
    return
  }

  addingProductId.value = product.id
  try {
    const success = await addToCartApi(shopSubdomain.value, product.id, 1, variantIds)
    if (!success) {
      addToCartError.value = `Erreur lors de l'ajout de "${product.name}" au panier.`
    }
  } catch (err: any) {
    addToCartError.value = err.message || "Erreur lors de l'ajout au panier"
  } finally {
    addingProductId.value = null
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

.theme-cuisine {
  --c-primary:   #8B1A1A;
  --c-secondary: #C9A84C;
  --c-bg:        #FAF7F2;
  --c-text:      #1C1C1C;
  --c-font:      'Cormorant Garamond', Georgia, serif;
  --c-cream:     #F5EFE6;
  --c-gold:      #C9A84C;

  font-family: 'Jost', sans-serif;
  background-color: var(--c-bg);
  color: var(--c-text);
  min-height: 100vh;
}

.cuisine-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.cuisine-products-page { padding-top: 140px; padding-bottom: 80px; }

.cuisine-eyebrow {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--c-gold); margin-bottom: 12px;
}
.cuisine-section-header { text-align: center; margin-bottom: 48px; }
.cuisine-section-title { font-family: var(--c-font); font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 600; margin-bottom: 16px; }
.cuisine-section-desc { max-width: 560px; margin: 20px auto 0; font-size: 1rem; line-height: 1.8; color: #666; }
.cuisine-divider { display: flex; align-items: center; justify-content: center; gap: 12px; }
.cuisine-divider::before, .cuisine-divider::after { content: ''; width: 60px; height: 1px; background: var(--c-gold); }
.cuisine-divider__ornament { color: var(--c-gold); font-size: 0.65rem; }

.cuisine-filters {
  display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px;
}
.cuisine-filter {
  padding: 8px 20px; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
  background: none; border: 1.5px solid #ddd; cursor: pointer; transition: all 0.25s; color: #666;
}
.cuisine-filter:hover { border-color: var(--c-primary); color: var(--c-primary); }
.cuisine-filter.is-active { background: var(--c-primary); border-color: var(--c-primary); color: white; }

.cuisine-toolbar {
  display: flex; gap: 16px; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap;
}
.cuisine-search {
  flex: 1; min-width: 220px; max-width: 380px; display: flex; align-items: center; gap: 10px;
  border: 1.5px solid #ddd; padding: 10px 16px; background: white;
}
.cuisine-search svg { width: 18px; height: 18px; color: #999; flex-shrink: 0; }
.cuisine-search input { border: none; outline: none; font-size: 0.85rem; width: 100%; font-family: 'Jost', sans-serif; }

.cuisine-sort {
  border: 1.5px solid #ddd; padding: 10px 16px; font-size: 0.8rem; background: white; font-family: 'Jost', sans-serif; cursor: pointer;
}

.cuisine-results-count { font-size: 0.85rem; color: #888; margin-bottom: 24px; }

.cuisine-cart-error {
  padding: 12px 16px; background: #FDECEC; color: #A32020; font-size: 0.85rem; margin-bottom: 20px;
}

.cuisine-empty { text-align: center; padding: 80px 20px; color: #999; font-size: 1.1rem; }

.cuisine-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px;
}

.cuisine-card {
  background: white; text-decoration: none; color: inherit; display: flex; flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease; box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.cuisine-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }

.cuisine-card__img-wrap { position: relative; overflow: hidden; aspect-ratio: 4/3; }
.cuisine-card__img-inner { width: 100%; height: 100%; }
.cuisine-card__img {
  width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease;
  pointer-events: none; user-select: none; -webkit-user-drag: none;
}
.cuisine-card:hover .cuisine-card__img { transform: scale(1.06); }
.cuisine-card__img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 50%); z-index: 1; }
.cuisine-card__img-placeholder { width: 100%; height: 100%; background: var(--c-cream); display: flex; align-items: center; justify-content: center; font-size: 3rem; }

.cuisine-card__badge {
  position: absolute; top: 12px; left: 12px; z-index: 2; background: var(--c-primary); color: white;
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px;
}
.cuisine-card__cat {
  position: absolute; bottom: 12px; right: 12px; z-index: 2; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  color: rgba(255,255,255,0.9); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 10px;
}

.cuisine-card__body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.cuisine-card__name { font-family: var(--c-font); font-size: 1.25rem; font-weight: 600; color: var(--c-text); margin-bottom: 8px; line-height: 1.3; }
.cuisine-card__desc { font-size: 0.875rem; line-height: 1.7; color: #777; flex: 1; margin-bottom: 16px; }
.cuisine-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.cuisine-card__price { display: flex; flex-direction: column; }
.cuisine-card__price-old { font-size: 0.8rem; color: #aaa; text-decoration: line-through; }
.cuisine-card__price-main { font-family: var(--c-font); font-size: 1.1rem; font-weight: 600; color: var(--c-primary); }

.cuisine-card__btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--c-primary); color: white;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border: none; cursor: pointer; transition: all 0.25s;
}
.cuisine-card__btn svg { width: 14px; height: 14px; }
.cuisine-card__btn:hover:not(:disabled) { background: color-mix(in srgb, var(--c-primary) 80%, black); gap: 10px; }
.cuisine-card__btn:disabled { opacity: 0.6; cursor: not-allowed; }

.cuisine-pagination {
  display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 60px;
}
.cuisine-pagination__btn {
  padding: 10px 24px; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  background: white; border: 1.5px solid #ddd; cursor: pointer; transition: all 0.2s;
}
.cuisine-pagination__btn:hover:not(:disabled) { border-color: var(--c-primary); color: var(--c-primary); }
.cuisine-pagination__btn:disabled { opacity: 0.4; cursor: not-allowed; }
.cuisine-pagination__info { font-size: 0.85rem; color: #888; }
</style>