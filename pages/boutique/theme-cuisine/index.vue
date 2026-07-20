<template>
  <div class="theme-cuisine" :style="cssVars">

    <HeaderCuisine :shop="shop" :primaryColor="primaryColor" />

    <main>

      <!-- ===== HERO ===== -->
      <section id="accueil" class="cuisine-hero">
        <!-- Fond slider -->
        <div class="cuisine-hero__slides">
          <div
            v-for="(img, i) in heroImages"
            :key="i"
            class="cuisine-hero__slide"
            :class="{ 'is-active': currentSlide === i }"
            :style="{ backgroundImage: `url(${img})` }"
          ></div>
        </div>
        <div class="cuisine-hero__overlay"></div>

        <!-- Contenu -->
        <div class="cuisine-hero__content">
          <p class="cuisine-hero__eyebrow">
            <span class="cuisine-hero__line"></span>
            {{ bannerEyebrow }}
            <span class="cuisine-hero__line"></span>
          </p>
          <h1 class="cuisine-hero__title">{{ bannerTitle }}</h1>
          <p class="cuisine-hero__subtitle">{{ bannerSubtitle }}</p>
          <div class="cuisine-hero__ctas">
            <a href="#menu" @click.prevent="scrollTo('#menu')" class="cuisine-btn cuisine-btn--primary">
              Voir le menu
            </a>
            <a href="#apropos" @click.prevent="scrollTo('#apropos')" class="cuisine-btn cuisine-btn--ghost">
              Notre histoire
            </a>
          </div>
        </div>

        <!-- Indicateurs slider -->
        <div class="cuisine-hero__dots">
          <button
            v-for="(_, i) in heroImages"
            :key="i"
            class="cuisine-hero__dot"
            :class="{ 'is-active': currentSlide === i }"
            @click="goToSlide(i)"
          ></button>
        </div>

        <!-- Scroll indicator -->
        <div class="cuisine-hero__scroll">
          <span>Défiler</span>
          <div class="cuisine-hero__scroll-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19 9-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- ===== BANDEAU STATS ===== -->
      <section class="cuisine-stats">
        <div class="cuisine-stats__inner">
          <div class="cuisine-stats__item" v-for="stat in stats" :key="stat.label">
            <span class="cuisine-stats__number">{{ stat.value }}</span>
            <span class="cuisine-stats__label">{{ stat.label }}</span>
          </div>
        </div>
      </section>

      <!-- ===== APERÇU DU MENU ===== -->
      <section id="menu" class="cuisine-menu">
        <div class="cuisine-container">
          <div class="cuisine-section-header">
            <p class="cuisine-eyebrow">Votre</p>
            <h2 class="cuisine-section-title">Voyage Culinaire</h2>
            <div class="cuisine-divider">
              <span class="cuisine-divider__ornament">✦</span>
            </div>
            <p class="cuisine-section-desc">
              Des saveurs authentiques préparées avec passion, des ingrédients frais sélectionnés avec soin.
            </p>
          </div>

          <div class="cuisine-menu__cta">
            <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`" class="cuisine-filter">Notre Menu Complet</NuxtLink>
          </div>

          <!-- Message d'erreur ajout panier -->
          <div v-if="addToCartError" class="cuisine-cart-error">{{ addToCartError }}</div>

          <!-- Grille de 5 produits maximum, sélection aléatoire, avec carte "voir plus" -->
          <div v-if="randomProducts.length === 0" class="cuisine-empty">
            <p>Aucun plat disponible pour le moment.</p>
          </div>

          <div v-else class="cuisine-grid">
            <NuxtLink
              v-for="product in randomProducts"
              :key="product.id"
              :to="`/boutique/${shop?.subdomain}/produit/${product.id}`"
              class="cuisine-card"
            >
              <!-- Image -->
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

                <!-- Overlay photo -->
                <div class="cuisine-card__img-overlay">
                  <div class="absolute inset-0 z-10" @contextmenu.prevent></div>
                </div>

                <!-- Badge promo -->
                <div v-if="product.promotional_price" class="cuisine-card__badge">Promo</div>

                <!-- Catégorie -->
                <div v-if="product.subcategory" class="cuisine-card__cat">
                  {{ product.subcategory.name }}
                </div>
              </div>

              <!-- Contenu -->
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
                    @click.prevent="handleQuickAddToCart(product)"
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

            <!-- Carte "voir plus" si la boutique a plus de produits que ceux affichés ici -->
            <NuxtLink
              v-if="allProducts.length > randomProducts.length"
              :to="`/boutique/${shop?.subdomain}/produits`"
              class="cuisine-card cuisine-card--more"
            >
              <div class="cuisine-card--more__inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                </svg>
                <span>Voir tout le menu</span>
                <span class="cuisine-card--more__count">{{ allProducts.length }} plats au total</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- ===== SECTION SPÉCIALITÉS (catégories du menu) ===== -->
      <section id="specialites" class="cuisine-specialites">
        <div class="cuisine-specialites__bg"></div>
        <div class="cuisine-container cuisine-specialites__inner">

          <!-- Gauche : texte -->
          <div class="cuisine-specialites__text">
            <p class="cuisine-eyebrow cuisine-eyebrow--light">À la une</p>
            <h2 class="cuisine-specialites__title">{{ specialitesTitle }}</h2>
            <div class="cuisine-divider cuisine-divider--light">
              <span class="cuisine-divider__ornament">✦</span>
            </div>
            <p class="cuisine-specialites__desc">
              {{ specialitesText }}
            </p>
            <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`" class="cuisine-btn cuisine-btn--gold mt-8 inline-flex">
              Voir tout le menu
            </NuxtLink>
          </div>

          <!-- Droite : catégories de produits avec compteur -->
          <div class="cuisine-specialites__list">
            <NuxtLink
              v-for="cat in categoriesWithCount"
              :key="cat.name"
              :to="`/boutique/${shop?.subdomain}/produits?categorie=${encodeURIComponent(cat.name)}`"
              class="cuisine-specialite-item"
            >
              <div class="cuisine-specialite-item__img">
                <img
                  v-if="cat.image"
                  :src="cat.image"
                  :alt="cat.name"
                  loading="lazy"
                  @contextmenu.prevent
                  @dragstart.prevent
                  draggable="false"
                />
                <span v-else>🍽️</span>
                <div class="absolute inset-0 z-10" @contextmenu.prevent></div>
              </div>
              <div class="cuisine-specialite-item__info">
                <div class="cuisine-specialite-item__top">
                  <h3 class="cuisine-specialite-item__name">{{ cat.name }}</h3>
                  <span class="cuisine-specialite-item__dots"></span>
                  <span class="cuisine-specialite-item__price">
                    {{ cat.count }} plat{{ cat.count > 1 ? 's' : '' }}
                  </span>
                </div>
                <p class="cuisine-specialite-item__desc">
                  Découvrez notre sélection {{ cat.name.toLowerCase() }}
                </p>
              </div>
            </NuxtLink>

            <div v-if="categoriesWithCount.length === 0" class="cuisine-specialites__empty">
              Les catégories de plats apparaîtront ici une fois votre menu organisé.
            </div>
          </div>
        </div>
      </section>

      <!-- ===== SECTION À PROPOS ===== -->
      <section id="apropos" class="cuisine-apropos">
        <div class="cuisine-container cuisine-apropos__inner">

          <!-- Image -->
          <div class="cuisine-apropos__img-col">
            <div class="cuisine-apropos__img-frame">
              <img
                v-if="aboutImage"
                :src="aboutImage"
                :alt="`À propos de ${shop?.name}`"
                class="cuisine-apropos__img"
                loading="lazy"
                @contextmenu.prevent
                @dragstart.prevent
                draggable="false"
              />
              <div v-else class="cuisine-apropos__img-placeholder">
                <span>👨‍🍳</span>
              </div>
              <!-- Décoration -->
              <div class="cuisine-apropos__img-deco"></div>
            </div>
          </div>

          <!-- Texte -->
          <div class="cuisine-apropos__text-col">
            <p class="cuisine-eyebrow">Notre histoire</p>
            <h2 class="cuisine-section-title cuisine-section-title--left">
              {{ shop?.name }}
            </h2>
            <div class="cuisine-divider cuisine-divider--left">
              <span class="cuisine-divider__ornament">✦</span>
            </div>
            <div class="cuisine-apropos__content" v-if="aboutText">
              <p v-for="(para, i) in aboutParagraphs" :key="i">{{ para }}</p>
            </div>
            <p v-else class="cuisine-apropos__content">
              Bienvenue dans notre cuisine, un lieu où la passion de la gastronomie rencontre le respect des traditions. Nous vous proposons une expérience culinaire authentique, préparée avec amour et les meilleurs ingrédients locaux.
            </p>

            <!-- Valeurs -->
            <div class="cuisine-apropos__values">
              <div class="cuisine-apropos__value" v-for="v in values" :key="v.label">
                <span class="cuisine-apropos__value-icon">{{ v.icon }}</span>
                <div>
                  <strong>{{ v.label }}</strong>
                  <p>{{ v.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== SECTION TEMOIGNAGES ===== -->
      <section class="cuisine-temoignages">
        <div class="cuisine-container">
          <div class="cuisine-section-header">
            <p class="cuisine-eyebrow">Ils nous font confiance</p>
            <h2 class="cuisine-section-title">Avis de nos clients</h2>
            <div class="cuisine-divider"><span class="cuisine-divider__ornament">✦</span></div>
          </div>

          <div class="cuisine-temoignages__grid">
            <div
              v-for="temo in temoignages"
              :key="temo.name"
              class="cuisine-temo"
            >
              <div class="cuisine-temo__stars">
                <span v-for="s in 5" :key="s">★</span>
              </div>
              <p class="cuisine-temo__text">« {{ temo.text }} »</p>
              <div class="cuisine-temo__author">
                <div class="cuisine-temo__avatar">{{ temo.name[0] }}</div>
                <div>
                  <strong class="cuisine-temo__name">{{ temo.name }}</strong>
                  <span class="cuisine-temo__role">{{ temo.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== SECTION CGU / CGV si elles existent ===== -->
      <section v-if="termsText" class="cuisine-legal">
        <div class="cuisine-container">
          <h2 class="cuisine-legal__title">Conditions Générales d'Utilisation</h2>
          <div class="cuisine-legal__content">{{ termsText }}</div>
        </div>
      </section>

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
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { getCleanDescription } from '~/utils/string'
  import HeaderCuisine from '@/components/theme_cuisine/HeaderCuisine.vue'
  import FooterCuisine from '@/components/theme_cuisine/FooterCuisine.vue'
  import { useCart } from '~/composables/useCart'

  // ============================
  // RÈGLES DE LA PLATEFORME
  // Chaque thème doit accepter ces props
  // ============================
  interface Props {
    shop?: any
    customizations?: any
  }
  const props = defineProps<Props>()

  definePageMeta({ layout: false })

  // ============================
  // COULEURS (depuis les customizations vendeur)
  // ============================
  const primaryColor   = computed(() => props.customizations?.home?.colors?.primary    || '#8B1A1A')
  const secondaryColor = computed(() => props.customizations?.home?.colors?.secondary  || '#C9A84C')
  const bgColor        = computed(() => props.customizations?.home?.colors?.background || '#FAF7F2')
  const textColor      = computed(() => props.customizations?.home?.colors?.text       || '#1C1C1C')
  const fontFamily     = computed(() => props.customizations?.home?.fonts?.family      || "'Cormorant Garamond', Georgia, serif")

  // CSS Variables injectées dynamiquement
  const cssVars = computed(() => ({
    '--c-primary':    primaryColor.value,
    '--c-secondary':  secondaryColor.value,
    '--c-bg':         bgColor.value,
    '--c-text':       textColor.value,
    '--c-font':       fontFamily.value,
  }))

  // ============================
  // CONTENU (depuis les customizations)
  // ============================
  const config     = useRuntimeConfig()
  const backendUrl = config.public.backendUrl || config.public.apiBase?.replace('/api', '')

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${backendUrl}/storage/${path}`
  }

  const shop = computed(() => props.shop)
  const shopSubdomain = computed(() => props.shop?.subdomain || '')

  const bannerEyebrow  = computed(() => 'Bienvenue')
  const bannerTitle    = computed(() =>
    props.customizations?.home?.banner?.title    || props.shop?.name || 'Cuisine Authentique'
  )
  const bannerSubtitle = computed(() =>
    props.customizations?.home?.banner?.subtitle || props.shop?.description || 'Une expérience gastronomique inoubliable'
  )

  const heroImages = computed(() => {
    const imgs = props.customizations?.home?.banner?.images
    if (imgs && imgs.length > 0) return imgs.map((p: string) => getImageUrl(p))
    return [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&auto=format&fit=crop&q=80',
    ]
  })

  const aboutText   = computed(() => props.customizations?.about?.text || '')
  const aboutImage  = computed(() => {
    const img = props.customizations?.about?.image
    return img ? getImageUrl(img) : 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80'
  })
  const aboutParagraphs = computed(() =>
    aboutText.value.split('\n').filter((p: string) => p.trim())
  )

  const footerText = computed(() =>
    props.customizations?.footer?.text ||
    `© ${new Date().getFullYear()} ${props.shop?.name || 'Restaurant'}. Tous droits réservés.`
  )
  const socialLinks = computed(() => props.customizations?.footer?.socialLinks || {})
  const termsText   = computed(() => props.customizations?.terms?.text || '')

  // ── Section Spécialités (personnalisable depuis le dashboard) ──
  const specialitesTitle = computed(() =>
    props.customizations?.specialites?.title || 'Nos Spécialités de la Maison'
  )
  const specialitesText = computed(() =>
    props.customizations?.specialites?.text ||
    'Chaque plat est une invitation au voyage, une expérience culinaire unique préparée avec les meilleurs ingrédients de saison.'
  )

  // ============================
  // PRODUITS
  // ============================
  const allProducts = computed(() => props.shop?.products || [])

  // ── Sélection aléatoire de 5 produits pour l'aperçu du menu ──
  // Se recalcule uniquement quand la liste de produits change (pas à
  // chaque re-render), pour éviter que la grille "saute" sans raison.
  const randomProducts = computed(() => {
    const list = allProducts.value
    if (list.length <= 5) return list
    const shuffled = [...list].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 5)
  })

  // ── Catégories du menu avec nombre de plats et image représentative ──
  const categoriesWithCount = computed(() => {
    const map = new Map<string, { name: string; count: number; image: string | null }>()
    allProducts.value.forEach((p: any) => {
      const catName = p.subcategory?.name
      if (!catName) return
      if (!map.has(catName)) {
        map.set(catName, {
          name: catName,
          count: 0,
          image: p.preview_image ? getImageUrl(p.preview_image) : null
        })
      }
      map.get(catName)!.count++
    })
    return Array.from(map.values()).slice(0, 5)
  })

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
  // AJOUT RAPIDE AU PANIER (depuis la grille d'aperçu)
  //
  // Comme il n'y a pas de sélecteur de variantes sur une carte produit,
  // on ajoute automatiquement la PREMIÈRE combinaison en stock si le
  // produit a des variantes. Si aucune combinaison n'a de stock,
  // ou si le produit n'a pas de variantes mais un stock global à 0,
  // on affiche une erreur plutôt que d'ajouter un article invalide.
  // Pour un choix précis de variante, le client passe par la page produit.
  // ============================
  const { addToCart } = useCart()
  const addingProductId = ref<number | null>(null)
  const addToCartError = ref('')

  const handleQuickAddToCart = async (product: any) => {
    if (!shopSubdomain.value) return
    addToCartError.value = ''

    const variants = product.productVariants || product.product_variants || []
    let variantIds: number[] | null = null

    if (variants.length > 0) {
      // Regrouper par dimension pour ne prendre qu'UNE valeur par dimension
      // (ex: si Couleur+Taille, on veut 1 combinaison complète, pas toutes les lignes)
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
      const success = await addToCart(shopSubdomain.value, product.id, 1, variantIds)
      if (!success) {
        addToCartError.value = `Erreur lors de l'ajout de "${product.name}" au panier.`
      }
    } catch (err: any) {
      addToCartError.value = err.message || "Erreur lors de l'ajout au panier"
    } finally {
      addingProductId.value = null
    }
  }

  // ============================
  // SLIDER HERO
  // ============================
  const currentSlide = ref(0)
  let slideTimer: ReturnType<typeof setInterval>

  const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % heroImages.value.length
  }
  const goToSlide = (i: number) => {
    currentSlide.value = i
  }

  // ============================
  // SCROLL vers ancre (utilisé par les CTA internes du hero)
  // ============================
  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ============================
  // DONNÉES STATIQUES
  // ============================
  const stats = computed(() => [
    { value: '10+', label: "Années d'expérience" },
    { value: `${allProducts.value.length}+`, label: 'Plats au menu' },
    { value: '1k+', label: 'Clients satisfaits' },
    { value: '100%', label: 'Ingrédients frais' },
  ])

  const values = [
    { icon: '🌿', label: 'Fraîcheur',    desc: 'Ingrédients sélectionnés chaque matin' },
    { icon: '👨‍🍳', label: 'Savoir-faire', desc: 'Recettes transmises de génération en génération' },
    { icon: '❤️', label: 'Passion',      desc: 'Chaque plat préparé avec amour' },
  ]

  const temoignages = [
    { name: 'Aminata K.',  role: 'Cliente fidèle',      text: 'Une expérience gastronomique exceptionnelle. Les saveurs sont authentiques et le service impeccable.' },
    { name: 'Moussa D.',   role: 'Gourmand amateur',     text: 'Les spécialités de la maison sont à couper le souffle. Je recommande vivement !' },
    { name: 'Fatou S.',    role: 'Blogueuse culinaire',  text: 'Enfin une cuisine qui respecte les traditions tout en proposant une présentation moderne et soignée.' },
  ]

  // ============================
  // LIFECYCLE
  // ============================
  onMounted(() => {
    slideTimer = setInterval(nextSlide, 5500)
  })

  onUnmounted(() => {
    clearInterval(slideTimer)
  })
</script>

<style scoped>
/* ==========================================
   IMPORTS GOOGLE FONTS
   Cormorant Garamond = display élégant
   Jost = body lisible et moderne
   ========================================== */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

/* ==========================================
   VARIABLES ET RESET
   ========================================== */
.theme-cuisine {
  --c-primary:   #8B1A1A;
  --c-secondary: #C9A84C;
  --c-bg:        #FAF7F2;
  --c-text:      #1C1C1C;
  --c-font:      'Cormorant Garamond', Georgia, serif;

  /* Dérivées */
  --c-primary-10: color-mix(in srgb, var(--c-primary) 10%, white);
  --c-cream:      #F5EFE6;
  --c-dark:       #111111;
  --c-gold:       #C9A84C;
  --c-gold-light: #E8D49F;

  font-family: 'Jost', sans-serif;
  background-color: var(--c-bg);
  color: var(--c-text);
  overflow-x: hidden;
}

/* ==========================================
   UTILITAIRES
   ========================================== */
.cuisine-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.cuisine-eyebrow {
  font-family: 'Jost', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--c-gold);
  margin-bottom: 12px;
}
.cuisine-eyebrow--light { color: var(--c-gold-light); }

.cuisine-section-header {
  text-align: center;
  margin-bottom: 60px;
}

.cuisine-section-title {
  font-family: var(--c-font);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  line-height: 1.15;
  color: var(--c-text);
  margin-bottom: 16px;
}
.cuisine-section-title--left { text-align: left; }

.cuisine-section-desc {
  max-width: 560px;
  margin: 20px auto 0;
  font-size: 1rem;
  line-height: 1.8;
  color: #666;
}

.cuisine-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 auto 0;
}
.cuisine-divider::before,
.cuisine-divider::after {
  content: '';
  display: block;
  width: 60px;
  height: 1px;
  background: var(--c-gold);
}
.cuisine-divider--light::before,
.cuisine-divider--light::after { background: var(--c-gold-light); }
.cuisine-divider--left { justify-content: flex-start; }
.cuisine-divider--left::before { display: none; }
.cuisine-divider__ornament {
  color: var(--c-gold);
  font-size: 0.65rem;
}

/* Boutons */
.cuisine-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cuisine-btn--primary {
  background: var(--c-primary);
  color: white;
}
.cuisine-btn--primary:hover {
  background: color-mix(in srgb, var(--c-primary) 80%, black);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.cuisine-btn--ghost {
  background: transparent;
  color: white;
  border: 1.5px solid rgba(255,255,255,0.6);
}
.cuisine-btn--ghost:hover {
  background: rgba(255,255,255,0.1);
  border-color: white;
}

.cuisine-btn--gold {
  background: var(--c-gold);
  color: white;
}
.cuisine-btn--gold:hover {
  background: color-mix(in srgb, var(--c-gold) 85%, black);
  transform: translateY(-2px);
}

.mt-8 { margin-top: 2rem; }

/* ==========================================
   HERO
   ========================================== */
.cuisine-hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cuisine-hero__slides {
  position: absolute;
  inset: 0;
}

.cuisine-hero__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 1s ease, transform 6s ease;
}
.cuisine-hero__slide.is-active {
  opacity: 1;
  transform: scale(1);
}

.cuisine-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.5) 0%,
    rgba(0,0,0,0.35) 40%,
    rgba(0,0,0,0.6) 100%
  );
  z-index: 1;
}

.cuisine-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 24px;
  max-width: 800px;
  animation: fadeInUp 1s ease both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.cuisine-hero__eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--c-gold);
  margin-bottom: 20px;
}
.cuisine-hero__line {
  display: block;
  width: 40px;
  height: 1px;
  background: var(--c-gold);
}

.cuisine-hero__title {
  font-family: var(--c-font);
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 600;
  line-height: 1.1;
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
}

.cuisine-hero__subtitle {
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-weight: 300;
  color: rgba(255,255,255,0.85);
  margin-bottom: 40px;
  line-height: 1.7;
}

.cuisine-hero__ctas {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.cuisine-hero__dots {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  gap: 8px;
}
.cuisine-hero__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}
.cuisine-hero__dot.is-active {
  background: var(--c-gold);
  width: 24px;
  border-radius: 3px;
}

.cuisine-hero__scroll {
  position: absolute;
  bottom: 40px;
  right: 40px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.6);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.cuisine-hero__scroll-icon {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2s infinite;
}
.cuisine-hero__scroll-icon svg { width: 14px; height: 14px; }
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(6px); }
}

/* ==========================================
   STATS
   ========================================== */
.cuisine-stats {
  background: var(--c-dark);
}
.cuisine-stats__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.08);
}
@media (max-width: 700px) {
  .cuisine-stats__inner { grid-template-columns: repeat(2, 1fr); }
}
.cuisine-stats__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 32px 16px;
  background: var(--c-dark);
  text-align: center;
}
.cuisine-stats__number {
  font-family: var(--c-font);
  font-size: 2.2rem;
  font-weight: 600;
  color: var(--c-gold);
}
.cuisine-stats__label {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}

/* ==========================================
   SECTION MENU
   ========================================== */
.cuisine-menu {
  padding: 100px 0;
  background: var(--c-bg);
}

.cuisine-menu__cta {
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
}

.cuisine-cart-error {
  max-width: 560px;
  margin: 0 auto 24px;
  padding: 12px 16px;
  background: #FDECEC;
  color: #A32020;
  font-size: 0.85rem;
  text-align: center;
}

/* Filtres / lien "Notre Menu Complet" */
.cuisine-filter {
  display: inline-block;
  padding: 8px 20px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: none;
  border: 1.5px solid #ddd;
  cursor: pointer;
  transition: all 0.25s;
  color: #666;
  text-decoration: none;
}
.cuisine-filter:hover { border-color: var(--c-primary); color: var(--c-primary); }

/* Empty state */
.cuisine-empty {
  text-align: center;
  padding: 80px 20px;
  color: #999;
  font-size: 1.1rem;
}

/* Grille produits */
.cuisine-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

/* Carte produit */
.cuisine-card {
  background: white;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.cuisine-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.12);
}

.cuisine-card__img-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4/3;
}
.cuisine-card__img-inner {
  width: 100%;
  height: 100%;
}
.cuisine-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}
.cuisine-card:hover .cuisine-card__img { transform: scale(1.06); }

.cuisine-card__img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 50%);
  z-index: 1;
}
.cuisine-card__img-placeholder {
  width: 100%;
  height: 100%;
  background: var(--c-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.cuisine-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  background: var(--c-primary);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
}

.cuisine-card__cat {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 2;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  color: rgba(255,255,255,0.9);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
}

.cuisine-card__body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cuisine-card__name {
  font-family: var(--c-font);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--c-text);
  margin-bottom: 8px;
  line-height: 1.3;
}

.cuisine-card__desc {
  font-size: 0.875rem;
  line-height: 1.7;
  color: #777;
  flex: 1;
  margin-bottom: 16px;
}

.cuisine-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.cuisine-card__price {
  display: flex;
  flex-direction: column;
}
.cuisine-card__price-old {
  font-size: 0.8rem;
  color: #aaa;
  text-decoration: line-through;
}
.cuisine-card__price-main {
  font-family: var(--c-font);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--c-primary);
}

.cuisine-card__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--c-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.25s;
}
.cuisine-card__btn:disabled { opacity: 0.6; cursor: not-allowed; }
.cuisine-card__btn svg { width: 14px; height: 14px; }
.cuisine-card__btn:hover:not(:disabled) {
  background: color-mix(in srgb, var(--c-primary) 80%, black);
  gap: 10px;
}

/* Carte "voir plus" */
.cuisine-card--more {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-cream);
  border: 2px dashed #ddd;
  box-shadow: none;
  min-height: 260px;
}
.cuisine-card--more:hover {
  border-color: var(--c-primary);
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.08);
}
.cuisine-card--more__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--c-primary);
  text-align: center;
  padding: 24px;
}
.cuisine-card--more__inner svg { width: 28px; height: 28px; }
.cuisine-card--more__inner span:nth-child(2) {
  font-family: var(--c-font);
  font-size: 1.1rem;
  font-weight: 600;
}
.cuisine-card--more__count {
  font-size: 0.78rem;
  color: #888;
}

/* ==========================================
   SECTION SPÉCIALITÉS
   ========================================== */
.cuisine-specialites {
  position: relative;
  padding: 100px 0;
  overflow: hidden;
}

.cuisine-specialites__bg {
  position: absolute;
  inset: 0;
  background: var(--c-dark);
}
/* Motif texture légère */
.cuisine-specialites__bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(139,26,26,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 30%, rgba(201,168,76,0.08) 0%, transparent 40%);
}

.cuisine-specialites__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
@media (max-width: 900px) {
  .cuisine-specialites__inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

.cuisine-specialites__title {
  font-family: var(--c-font);
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 600;
  color: white;
  line-height: 1.2;
  margin-bottom: 16px;
}

.cuisine-specialites__desc {
  color: rgba(255,255,255,0.65);
  font-size: 0.95rem;
  line-height: 1.8;
  margin-top: 20px;
}

.cuisine-specialites__empty {
  color: rgba(255,255,255,0.45);
  font-size: 0.9rem;
  padding: 20px 0;
}

/* Items liste */
.cuisine-specialites__list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.cuisine-specialite-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  transition: background 0.2s;
  text-decoration: none;
}
.cuisine-specialite-item:first-child { border-top: 1px solid rgba(255,255,255,0.08); }
.cuisine-specialite-item:hover { background: rgba(255,255,255,0.03); }

.cuisine-specialite-item__img {
  width: 72px;
  height: 72px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  position: relative;
}
.cuisine-specialite-item__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.cuisine-specialite-item__info { flex: 1; min-width: 0; }

.cuisine-specialite-item__top {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}

.cuisine-specialite-item__name {
  font-family: var(--c-font);
  font-size: 1.05rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cuisine-specialite-item__dots {
  flex: 1;
  min-width: 16px;
  border-bottom: 1px dashed rgba(255,255,255,0.15);
  margin-bottom: 4px;
}

.cuisine-specialite-item__price {
  font-family: var(--c-font);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--c-gold);
  white-space: nowrap;
}

.cuisine-specialite-item__desc {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.45);
  line-height: 1.5;
}

/* ==========================================
   SECTION À PROPOS
   ========================================== */
.cuisine-apropos {
  padding: 100px 0;
  background: var(--c-bg);
}

.cuisine-apropos__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
@media (max-width: 900px) {
  .cuisine-apropos__inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

.cuisine-apropos__img-col { position: relative; }

.cuisine-apropos__img-frame {
  position: relative;
  aspect-ratio: 4/5;
  max-width: 460px;
}

.cuisine-apropos__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}
.cuisine-apropos__img-placeholder {
  width: 100%;
  height: 100%;
  background: var(--c-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}

/* Cadre décoratif */
.cuisine-apropos__img-deco {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 60%;
  height: 60%;
  border: 2px solid var(--c-gold);
  z-index: -1;
  pointer-events: none;
}

.cuisine-apropos__content {
  font-size: 0.95rem;
  line-height: 1.9;
  color: #666;
  margin-top: 20px;
}
.cuisine-apropos__content p + p { margin-top: 12px; }

.cuisine-apropos__values {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cuisine-apropos__value {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.cuisine-apropos__value-icon {
  font-size: 1.3rem;
  margin-top: 2px;
  flex-shrink: 0;
}
.cuisine-apropos__value strong {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--c-text);
  margin-bottom: 2px;
}
.cuisine-apropos__value p {
  font-size: 0.8rem;
  color: #888;
  margin: 0;
}

/* ==========================================
   TÉMOIGNAGES
   ========================================== */
.cuisine-temoignages {
  padding: 100px 0;
  background: var(--c-cream);
}

.cuisine-temoignages__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 0;
}

.cuisine-temo {
  background: white;
  padding: 32px;
  position: relative;
}
.cuisine-temo::before {
  content: '"';
  position: absolute;
  top: 16px;
  left: 24px;
  font-family: var(--c-font);
  font-size: 4rem;
  color: var(--c-gold);
  opacity: 0.3;
  line-height: 1;
}

.cuisine-temo__stars {
  color: var(--c-gold);
  font-size: 0.9rem;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.cuisine-temo__text {
  font-size: 0.9rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
  font-style: italic;
}

.cuisine-temo__author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cuisine-temo__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--c-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}
.cuisine-temo__name {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--c-text);
}
.cuisine-temo__role {
  display: block;
  font-size: 0.75rem;
  color: #999;
}

/* ==========================================
   SECTION LÉGALE
   ========================================== */
.cuisine-legal {
  padding: 60px 0;
  background: white;
}
.cuisine-legal__title {
  font-family: var(--c-font);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--c-text);
}
.cuisine-legal__content {
  font-size: 0.85rem;
  line-height: 1.9;
  color: #666;
  white-space: pre-wrap;
}

/* ==========================================
   RESPONSIVE GÉNÉRAL
   ========================================== */
@media (max-width: 600px) {
  .cuisine-hero__scroll { display: none; }
  .cuisine-btn { padding: 12px 24px; font-size: 0.75rem; }
  .cuisine-hero__ctas { gap: 12px; }
  .cuisine-hero__ctas .cuisine-btn { flex: 1; justify-content: center; }
}
</style>