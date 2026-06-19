<template>
  <div class="tf" :style="cssVars">

    <!-- ===== NAVIGATION ===== -->
    <header class="tf-nav" :class="{ 'tf-nav--scrolled': isScrolled, 'tf-nav--open': menuOpen }">
      <div class="tf-nav__inner">

        <NuxtLink :to="`/boutique/${shop?.subdomain}`" class="tf-nav__logo">
          <img v-if="shop?.logo" :src="getUrl(shop.logo)" :alt="shop?.name" class="tf-nav__logo-img" />
          <span v-else class="tf-nav__logo-text">{{ shop?.name }}</span>
        </NuxtLink>

        <nav class="tf-nav__links">
          <a href="#collection" @click.prevent="go('#collection')" class="tf-nav__link">Collection</a>
          <a href="#lookbook"   @click.prevent="go('#lookbook')"   class="tf-nav__link">Lookbook</a>
          <a href="#nouveautes" @click.prevent="go('#nouveautes')" class="tf-nav__link">Nouveautés</a>
          <a href="#apropos"    @click.prevent="go('#apropos')"    class="tf-nav__link">À propos</a>
        </nav>

        <div class="tf-nav__right">
          <NuxtLink v-if="shop?.shop_type !== 'website'" :to="`/boutique/${shop?.subdomain}/panier`" class="tf-nav__icon" aria-label="Panier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/></svg>
          </NuxtLink>
          <button class="tf-nav__burger" @click="menuOpen = !menuOpen" aria-label="Menu">
            <span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div class="tf-nav__mobile" :class="{ 'is-open': menuOpen }">
        <a href="#collection" @click="closeMenu('#collection')" class="tf-nav__mobile-link">Collection</a>
        <a href="#lookbook"   @click="closeMenu('#lookbook')"   class="tf-nav__mobile-link">Lookbook</a>
        <a href="#nouveautes" @click="closeMenu('#nouveautes')" class="tf-nav__mobile-link">Nouveautés</a>
        <a href="#apropos"    @click="closeMenu('#apropos')"    class="tf-nav__mobile-link">À propos</a>
      </div>
    </header>

    <main>

      <!-- ===== HERO PLEIN ÉCRAN ===== -->
      <section id="collection" class="tf-hero">
        <div class="tf-hero__slides">
          <div v-for="(img, i) in heroImages" :key="i"
            class="tf-hero__slide" :class="{ 'is-active': slide === i }"
            :style="{ backgroundImage: `url(${img})` }">
          </div>
        </div>
        <div class="tf-hero__overlay"></div>

        <div class="tf-hero__content">
          <p class="tf-hero__season">{{ season }}</p>
          <h1 class="tf-hero__title">{{ heroTitle }}</h1>
          <p class="tf-hero__tagline">{{ heroSubtitle }}</p>
          <div class="tf-hero__ctas">
            <a href="#collection" @click.prevent="go('#nouveautes')" class="tf-btn tf-btn--white">
              Découvrir
            </a>
            <a href="#lookbook" @click.prevent="go('#lookbook')" class="tf-btn tf-btn--outline">
              Lookbook
            </a>
          </div>
        </div>

        <!-- Scroll hint -->
        <div class="tf-hero__scroll">
          <div class="tf-hero__scroll-line"></div>
          <span>Scroll</span>
        </div>

        <!-- Slider bullets -->
        <div class="tf-hero__bullets">
          <button v-for="(_, i) in heroImages" :key="i"
            class="tf-hero__bullet" :class="{ 'is-active': slide === i }"
            @click="goSlide(i)"></button>
        </div>
      </section>

      <!-- ===== BANDE DÉFILANTE ===== -->
      <div class="tf-ticker">
        <div class="tf-ticker__track">
          <span v-for="n in 6" :key="n">
            Nouvelle Collection &nbsp;·&nbsp; {{ shop?.name || 'FASHION' }} &nbsp;·&nbsp; Style Exclusif &nbsp;·&nbsp;
          </span>
        </div>
      </div>

      <!-- ===== GRILLE LOOKBOOK ===== -->
      <section id="lookbook" class="tf-lookbook">
        <div class="tf-container">
          <div class="tf-section-head">
            <span class="tf-label">Lookbook</span>
            <h2 class="tf-section-title">{{ lookbookTitle }}</h2>
          </div>

          <div class="tf-lookbook__grid">
            <NuxtLink v-for="(product, i) in lookbookProducts" :key="product.id"
              :to="`/boutique/${shop?.subdomain}/produit/${product.id}`"
              class="tf-lookbook__item"
              :class="{ 'tf-lookbook__item--tall': i === 0 || i === 4 }">
              <div class="tf-lookbook__img-wrap">
                <img v-if="product.preview_image" :src="getUrl(product.preview_image)"
                  :alt="product.name" class="tf-lookbook__img"
                  @contextmenu.prevent @dragstart.prevent draggable="false" loading="lazy" />
                <div v-else class="tf-lookbook__placeholder">
                  <span>✦</span>
                </div>
                <div class="tf-lookbook__overlay">
                  <div class="absolute inset-0 z-10" @contextmenu.prevent></div>
                </div>
              </div>
              <div class="tf-lookbook__info">
                <p class="tf-lookbook__name">{{ product.name }}</p>
                <p class="tf-lookbook__price">{{ fmtPrice(product.promotional_price || product.price) }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- ===== SECTION NOUVEAUTÉS ===== -->
      <section id="nouveautes" class="tf-new">
        <div class="tf-container">
          <div class="tf-section-head">
            <span class="tf-label">{{ newArrivalsLabel }}</span>
            <h2 class="tf-section-title">{{ newArrivalsTitle }}</h2>
          </div>

          <!-- Filtres catégories -->
          <div class="tf-filters">
            <button class="tf-filter" :class="{ 'is-active': activeCat === 'all' }" @click="activeCat = 'all'">
              Tout
            </button>
            <button v-for="cat in categories" :key="cat"
              class="tf-filter" :class="{ 'is-active': activeCat === cat }"
              @click="activeCat = cat">
              {{ cat }}
            </button>
          </div>

          <div v-if="!filteredProducts.length" class="tf-empty">
            Aucun produit disponible.
          </div>

          <div v-else class="tf-grid">
            <NuxtLink v-for="p in filteredProducts" :key="p.id"
              :to="`/boutique/${shop?.subdomain}/produit/${p.id}`"
              class="tf-card">
              <div class="tf-card__img-wrap">
                <img v-if="p.preview_image" :src="getUrl(p.preview_image)" :alt="p.name"
                  class="tf-card__img"
                  @contextmenu.prevent @dragstart.prevent draggable="false" loading="lazy" />
                <div v-else class="tf-card__placeholder"><span>✦</span></div>
                <div class="tf-card__overlay"><div class="absolute inset-0 z-10" @contextmenu.prevent></div></div>
                <div v-if="p.promotional_price" class="tf-card__badge">Sale</div>
                <div class="tf-card__quick">
                  <button v-if="shop?.shop_type !== 'website'" @click.prevent="addCart(p)" class="tf-card__quick-btn">
                    + Ajouter
                  </button>
                </div>
              </div>
              <div class="tf-card__info">
                <span v-if="p.subcategory" class="tf-card__cat">{{ p.subcategory.name }}</span>
                <h3 class="tf-card__name">{{ p.name }}</h3>
                <div class="tf-card__prices">
                  <span v-if="p.promotional_price" class="tf-card__price-old">{{ fmtPrice(p.price) }}</span>
                  <span class="tf-card__price">{{ fmtPrice(p.promotional_price || p.price) }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- ===== SECTION À PROPOS ===== -->
      <section id="apropos" class="tf-about">
        <div class="tf-about__img-col">
          <div class="tf-about__img-wrap">
            <img v-if="aboutImage" :src="aboutImage" :alt="`À propos de ${shop?.name}`"
              class="tf-about__img"
              @contextmenu.prevent @dragstart.prevent draggable="false" loading="lazy" />
            <div v-else class="tf-about__placeholder">{{ shop?.name?.[0] }}</div>
          </div>
        </div>
        <div class="tf-about__text-col">
          <span class="tf-label">Notre Histoire</span>
          <h2 class="tf-section-title tf-section-title--left">{{ shop?.name }}</h2>
          <div class="tf-about__body">
            <p v-if="aboutText">{{ aboutText }}</p>
            <p v-else>
              Une vision audacieuse de la mode contemporaine. Chaque pièce est conçue pour celles et ceux qui osent s'affirmer à travers leur style.
            </p>
          </div>
          <a href="#nouveautes" @click.prevent="go('#nouveautes')" class="tf-btn tf-btn--dark mt-8">
            Explorer la collection
          </a>
        </div>
      </section>

      <!-- ===== TÉMOIGNAGES ===== -->
      <section class="tf-reviews">
        <div class="tf-container">
          <div class="tf-section-head">
            <span class="tf-label">Avis</span>
            <h2 class="tf-section-title">Ce qu'ils disent</h2>
          </div>
          <div class="tf-reviews__grid">
            <div v-for="r in reviews" :key="r.name" class="tf-review">
              <div class="tf-review__stars">★★★★★</div>
              <p class="tf-review__text">« {{ r.text }} »</p>
              <div class="tf-review__author">
                <div class="tf-review__avatar">{{ r.name[0] }}</div>
                <div>
                  <strong>{{ r.name }}</strong>
                  <span>{{ r.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ===== FOOTER ===== -->
    <footer class="tf-footer">
      <div class="tf-container tf-footer__grid">
        <div class="tf-footer__brand">
          <div class="tf-footer__logo">
            <img v-if="shop?.logo" :src="getUrl(shop.logo)" :alt="shop?.name" />
            <span v-else>{{ shop?.name }}</span>
          </div>
          <p class="tf-footer__desc">{{ shop?.description || 'Mode audacieuse. Style affirmé.' }}</p>
          <div class="tf-footer__social">
            <a v-if="social.instagram" :href="social.instagram" target="_blank" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a v-if="social.twitter" :href="social.twitter" target="_blank" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a v-if="social.facebook" :href="social.facebook" target="_blank" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        <div class="tf-footer__col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#collection" @click.prevent="go('#collection')">Collection</a></li>
            <li><a href="#lookbook"   @click.prevent="go('#lookbook')">Lookbook</a></li>
            <li><a href="#nouveautes" @click.prevent="go('#nouveautes')">Nouveautés</a></li>
            <li><a href="#apropos"    @click.prevent="go('#apropos')">À propos</a></li>
          </ul>
        </div>

        <div class="tf-footer__col">
          <h4>Légal</h4>
          <ul>
            <li v-if="termsText"><a href="#cgu">CGU</a></li>
            <li v-if="salesTermsText"><a href="#cgv">CGV</a></li>
          </ul>
        </div>
      </div>

      <div class="tf-footer__bottom">
        <p>{{ footerText }}</p>
        <p>Propulsé par <a href="https://uber-market.com" target="_blank">UberMarket</a></p>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// =============================================
// RÈGLES PLATEFORME — Props obligatoires
// =============================================
interface Props { shop?: any; customizations?: any }
const props = defineProps<Props>()
definePageMeta({ layout: false })

// =============================================
// SEO dynamique
// =============================================
useHead(() => {
  const name = props.shop?.name || 'Boutique Fashion'
  const desc = props.shop?.description || `Découvrez la collection fashion de ${name}`
  const url  = `https://uber-market.com/boutique/${props.shop?.subdomain}`
  return {
    title: `${name} — Collection Fashion | UberMarket`,
    meta: [
      { name: 'description', content: desc.slice(0, 155) },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: `${name} — Collection Fashion` },
      { property: 'og:description', content: desc.slice(0, 155) },
      { property: 'og:url', content: url },
    ],
    link: [{ rel: 'canonical', href: url }],
    script: [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Store',
        name, description: desc, url,
        image: props.shop?.logo_url || '',
      })
    }]
  }
})

// =============================================
// COULEURS depuis customizations vendeur
// =============================================
const primaryColor   = computed(() => props.customizations?.home?.colors?.primary    || '#1a1a1a')
const secondaryColor = computed(() => props.customizations?.home?.colors?.secondary  || '#c9a84c')
const bgColor        = computed(() => props.customizations?.home?.colors?.background || '#0d0d0d')
const textColor      = computed(() => props.customizations?.home?.colors?.text       || '#ffffff')

const cssVars = computed(() => ({
  '--tf-primary':   primaryColor.value,
  '--tf-gold':      secondaryColor.value,
  '--tf-bg':        bgColor.value,
  '--tf-text':      textColor.value,
}))

// =============================================
// CONTENU depuis customizations
// =============================================
const config     = useRuntimeConfig()
const backendUrl = config.public.backendUrl || config.public.apiBase?.replace('/api', '')

const getUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${backendUrl}/storage/${path}`
}

const heroTitle     = computed(() => props.customizations?.home?.banner?.title    || 'Nouvelle Collection')
const heroSubtitle  = computed(() => props.customizations?.home?.banner?.subtitle || 'Mode audacieuse, style affirmé')
const season        = computed(() => props.customizations?.home?.fashion?.season  || 'Collection 2025')
const lookbookTitle = computed(() => props.customizations?.home?.fashion?.lookbook_title || 'Lookbook')
const newArrivalsLabel = computed(() => props.customizations?.home?.fashion?.new_arrivals_label || 'Nouveautés')
const newArrivalsTitle = computed(() => props.customizations?.home?.fashion?.new_arrivals_title || 'Pièces Exclusives')

const heroImages = computed(() => {
  const imgs = props.customizations?.home?.banner?.images
  if (imgs?.length) return imgs.map((p: string) => getUrl(p))
  return [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&auto=format&fit=crop&q=80',
  ]
})

const aboutText = computed(() => props.customizations?.about?.text || '')
const aboutImage = computed(() => {
  const img = props.customizations?.about?.image
  return img ? getUrl(img) : 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80'
})
const footerText = computed(() =>
  props.customizations?.footer?.text || `© ${new Date().getFullYear()} ${props.shop?.name}. Tous droits réservés.`
)
const social = computed(() => props.customizations?.footer?.socialLinks || {})
const termsText = computed(() => props.customizations?.terms?.text || '')
const salesTermsText = computed(() => props.customizations?.sales_terms?.text || '')

// =============================================
// PRODUITS
// =============================================
const allProducts = computed(() => props.shop?.products || [])
const activeCat   = ref('all')

const categories = computed(() => {
  const s = new Set<string>()
  allProducts.value.forEach((p: any) => { if (p.subcategory?.name) s.add(p.subcategory.name) })
  return Array.from(s)
})

const filteredProducts = computed(() =>
  activeCat.value === 'all'
    ? allProducts.value
    : allProducts.value.filter((p: any) => p.subcategory?.name === activeCat.value)
)

const lookbookProducts = computed(() => allProducts.value.slice(0, 6))

const fmtPrice = (price: number) =>
  `${Number(price).toLocaleString('fr-FR')} ${props.shop?.currency || 'XOF'}`

const addCart = (product: any) => console.log('Ajout au panier:', product.name)

// =============================================
// SLIDER
// =============================================
const slide = ref(0)
let timer: ReturnType<typeof setInterval>

const goSlide = (i: number) => { slide.value = i }
const next = () => { slide.value = (slide.value + 1) % heroImages.value.length }

// =============================================
// SCROLL & NAV
// =============================================
const isScrolled = ref(false)
const menuOpen   = ref(false)

const onScroll = () => { isScrolled.value = window.scrollY > 60 }
const go = (hash: string) => {
  menuOpen.value = false
  document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
}
const closeMenu = (hash: string) => go(hash)

// =============================================
// DONNÉES STATIQUES
// =============================================
const reviews = [
  { name: 'Sofia M.', role: 'Styliste', text: 'Des pièces uniques qui transforment chaque tenue en déclaration de style.' },
  { name: 'Kenzo L.', role: 'Influenceur mode', text: 'La qualité est exceptionnelle, chaque détail est pensé. Je commande régulièrement.' },
  { name: 'Aïcha B.', role: 'Directrice artistique', text: 'Enfin une marque qui comprend l\'esthétique contemporaine africaine.' },
]

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  timer = setInterval(next, 5000)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  clearInterval(timer)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

/* ==========================================
   VARIABLES
   ========================================== */
.tf {
  --tf-primary:  #1a1a1a;
  --tf-gold:     #c9a84c;
  --tf-bg:       #0d0d0d;
  --tf-text:     #ffffff;
  --tf-gray:     #888;
  --tf-border:   rgba(255,255,255,0.08);

  font-family: 'Jost', sans-serif;
  background: var(--tf-bg);
  color: var(--tf-text);
  overflow-x: hidden;
}

.tf-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ==========================================
   NAVIGATION
   ========================================== */
.tf-nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  padding: 0 24px;
  transition: background 0.4s, backdrop-filter 0.4s;
}
.tf-nav__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 72px;
  gap: 24px;
}
.tf-nav--scrolled {
  background: rgba(10,10,10,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--tf-border);
}

.tf-nav__logo { text-decoration: none; flex-shrink: 0; }
.tf-nav__logo-img { height: 40px; width: auto; filter: brightness(0) invert(1); }
.tf-nav__logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--tf-text);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.tf-nav__links {
  display: flex;
  gap: 32px;
  margin: 0 auto;
}
@media (max-width: 900px) { .tf-nav__links { display: none; } }

.tf-nav__link {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  transition: color 0.2s;
  position: relative;
  padding-bottom: 3px;
}
.tf-nav__link::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 0; height: 1px;
  background: var(--tf-gold);
  transition: width 0.3s;
}
.tf-nav__link:hover { color: var(--tf-gold); }
.tf-nav__link:hover::after { width: 100%; }

.tf-nav__right { display: flex; align-items: center; gap: 16px; margin-left: auto; }
.tf-nav__icon {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s;
}
.tf-nav__icon svg { width: 20px; height: 20px; }
.tf-nav__icon:hover { color: var(--tf-gold); }

.tf-nav__burger {
  display: none;
  flex-direction: column; gap: 6px;
  background: none; border: none; cursor: pointer; padding: 4px;
}
.tf-nav__burger span {
  display: block; width: 22px; height: 1px;
  background: rgba(255,255,255,0.8); transition: all 0.3s;
}
@media (max-width: 900px) { .tf-nav__burger { display: flex; } }

.tf-nav__mobile {
  display: none;
  flex-direction: column;
  background: #0a0a0a;
  max-height: 0; overflow: hidden; transition: max-height 0.4s;
  border-top: 1px solid var(--tf-border);
}
.tf-nav__mobile.is-open { max-height: 300px; }
@media (max-width: 900px) { .tf-nav__mobile { display: flex; } }

.tf-nav__mobile-link {
  display: block; padding: 14px 24px;
  font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(255,255,255,0.7); text-decoration: none;
  border-bottom: 1px solid var(--tf-border); transition: color 0.2s;
}
.tf-nav__mobile-link:hover { color: var(--tf-gold); }

/* ==========================================
   BOUTONS
   ========================================== */
.tf-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 36px;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
  text-decoration: none; transition: all 0.3s; border: 1px solid transparent; cursor: pointer;
}
.tf-btn--white { background: white; color: #0a0a0a; border-color: white; }
.tf-btn--white:hover { background: transparent; color: white; }
.tf-btn--outline { background: transparent; color: white; border-color: rgba(255,255,255,0.5); }
.tf-btn--outline:hover { border-color: white; }
.tf-btn--dark { background: var(--tf-text); color: var(--tf-bg); border-color: var(--tf-text); }
.tf-btn--dark:hover { background: transparent; color: var(--tf-text); }
.mt-8 { margin-top: 2rem; }

/* ==========================================
   HERO
   ========================================== */
.tf-hero {
  position: relative; height: 100vh; min-height: 600px;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.tf-hero__slides { position: absolute; inset: 0; }
.tf-hero__slide {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0; transform: scale(1.03);
  transition: opacity 1.2s ease, transform 7s ease;
}
.tf-hero__slide.is-active { opacity: 1; transform: scale(1); }
.tf-hero__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%);
  z-index: 1;
}
.tf-hero__content {
  position: relative; z-index: 2; text-align: center;
  padding: 0 24px; max-width: 720px;
  animation: fadeUp 1s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tf-hero__season {
  font-size: 0.65rem; font-weight: 600; letter-spacing: 0.35em;
  text-transform: uppercase; color: var(--tf-gold); margin-bottom: 16px;
}
.tf-hero__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 8vw, 6.5rem);
  font-weight: 300; line-height: 1.05;
  color: white; margin-bottom: 16px; letter-spacing: 0.02em;
}
.tf-hero__tagline {
  font-size: 0.9rem; font-weight: 300;
  color: rgba(255,255,255,0.7); margin-bottom: 40px; letter-spacing: 0.05em;
}
.tf-hero__ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

.tf-hero__scroll {
  position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
  z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: rgba(255,255,255,0.4); font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
}
.tf-hero__scroll-line {
  width: 1px; height: 48px; background: rgba(255,255,255,0.3);
  animation: scrollPulse 2s infinite;
}
@keyframes scrollPulse {
  0%, 100% { transform: scaleY(1); opacity: 0.3; }
  50%       { transform: scaleY(0.5); opacity: 0.8; }
}

.tf-hero__bullets {
  position: absolute; right: 32px; top: 50%; transform: translateY(-50%);
  z-index: 2; display: flex; flex-direction: column; gap: 8px;
}
.tf-hero__bullet {
  width: 4px; height: 24px; background: rgba(255,255,255,0.2);
  border: none; cursor: pointer; transition: all 0.3s; padding: 0;
}
.tf-hero__bullet.is-active { background: var(--tf-gold); height: 36px; }

/* ==========================================
   TICKER
   ========================================== */
.tf-ticker {
  background: var(--tf-gold);
  overflow: hidden; height: 40px; display: flex; align-items: center;
}
.tf-ticker__track {
  display: flex; white-space: nowrap;
  animation: ticker 20s linear infinite;
  font-size: 0.65rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: #0a0a0a;
}
@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ==========================================
   UTILITAIRES SECTIONS
   ========================================== */
.tf-section-head { text-align: center; margin-bottom: 48px; }
.tf-label {
  display: block; font-size: 0.65rem; font-weight: 600;
  letter-spacing: 0.3em; text-transform: uppercase; color: var(--tf-gold); margin-bottom: 12px;
}
.tf-section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 300; color: var(--tf-text); line-height: 1.2;
}
.tf-section-title--left { text-align: left; }

/* ==========================================
   LOOKBOOK GRILLE
   ========================================== */
.tf-lookbook { padding: 100px 0; background: #111; }
.tf-lookbook__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 12px;
}
@media (max-width: 700px) { .tf-lookbook__grid { grid-template-columns: repeat(2, 1fr); } }

.tf-lookbook__item { position: relative; text-decoration: none; display: block; }
.tf-lookbook__item--tall { grid-row: span 2; }

.tf-lookbook__img-wrap { position: relative; overflow: hidden; aspect-ratio: 3/4; }
.tf-lookbook__item--tall .tf-lookbook__img-wrap { aspect-ratio: auto; height: 100%; }

.tf-lookbook__img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.7s ease;
  pointer-events: none; user-select: none; -webkit-user-drag: none;
}
.tf-lookbook__item:hover .tf-lookbook__img { transform: scale(1.04); }

.tf-lookbook__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
  z-index: 1;
}
.tf-lookbook__placeholder {
  width: 100%; height: 100%; background: #1a1a1a;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; color: var(--tf-gold);
}
.tf-lookbook__info {
  position: absolute; bottom: 16px; left: 16px; z-index: 2;
  opacity: 0; transform: translateY(8px); transition: all 0.3s;
}
.tf-lookbook__item:hover .tf-lookbook__info { opacity: 1; transform: translateY(0); }
.tf-lookbook__name { font-size: 0.8rem; font-weight: 500; color: white; }
.tf-lookbook__price { font-size: 0.75rem; color: var(--tf-gold); margin-top: 2px; }

/* ==========================================
   GRILLE PRODUITS
   ========================================== */
.tf-new { padding: 100px 0; background: var(--tf-bg); }

.tf-filters {
  display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 48px;
}
.tf-filter {
  padding: 6px 20px; font-size: 0.65rem; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase;
  background: none; border: 1px solid var(--tf-border);
  color: var(--tf-gray); cursor: pointer; transition: all 0.25s;
}
.tf-filter:hover { border-color: rgba(255,255,255,0.4); color: white; }
.tf-filter.is-active { background: white; border-color: white; color: #0a0a0a; }

.tf-empty { text-align: center; padding: 80px; color: var(--tf-gray); }

.tf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.tf-card { display: block; text-decoration: none; color: inherit; }
.tf-card__img-wrap {
  position: relative; overflow: hidden;
  aspect-ratio: 3/4; background: #111;
  margin-bottom: 16px;
}
.tf-card__img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.6s ease;
  pointer-events: none; user-select: none; -webkit-user-drag: none;
}
.tf-card:hover .tf-card__img { transform: scale(1.05); }
.tf-card__overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0);
  transition: background 0.3s;
  z-index: 1;
}
.tf-card:hover .tf-card__overlay { background: rgba(0,0,0,0.2); }
.tf-card__placeholder {
  width: 100%; height: 100%; background: #1a1a1a;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; color: var(--tf-gold);
}
.tf-card__badge {
  position: absolute; top: 12px; left: 12px; z-index: 2;
  background: var(--tf-gold); color: #0a0a0a;
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; padding: 4px 10px;
}
.tf-card__quick {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
  transform: translateY(100%); transition: transform 0.3s;
}
.tf-card:hover .tf-card__quick { transform: translateY(0); }
.tf-card__quick-btn {
  width: 100%; padding: 12px;
  background: white; color: #0a0a0a;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em;
  text-transform: uppercase; border: none; cursor: pointer; transition: background 0.2s;
}
.tf-card__quick-btn:hover { background: var(--tf-gold); }

.tf-card__info {}
.tf-card__cat {
  font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--tf-gray); display: block; margin-bottom: 4px;
}
.tf-card__name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem; font-weight: 400; color: var(--tf-text); margin-bottom: 6px;
}
.tf-card__prices { display: flex; gap: 8px; align-items: baseline; }
.tf-card__price { font-size: 0.9rem; font-weight: 500; color: var(--tf-text); }
.tf-card__price-old { font-size: 0.8rem; color: var(--tf-gray); text-decoration: line-through; }

/* ==========================================
   À PROPOS
   ========================================== */
.tf-about {
  display: grid; grid-template-columns: 1fr 1fr;
  min-height: 80vh; overflow: hidden;
}
@media (max-width: 768px) { .tf-about { grid-template-columns: 1fr; } }

.tf-about__img-col { position: relative; min-height: 500px; }
.tf-about__img-wrap { position: absolute; inset: 0; }
.tf-about__img {
  width: 100%; height: 100%; object-fit: cover;
  pointer-events: none; user-select: none; -webkit-user-drag: none;
}
.tf-about__placeholder {
  width: 100%; height: 100%; background: #1a1a1a;
  display: flex; align-items: center; justify-content: center;
  font-size: 4rem; font-family: 'Cormorant Garamond', serif; color: var(--tf-gold);
}

.tf-about__text-col {
  background: #111; padding: 80px 60px;
  display: flex; flex-direction: column; justify-content: center;
}
@media (max-width: 768px) { .tf-about__text-col { padding: 48px 24px; } }

.tf-about__body {
  margin-top: 20px; font-size: 0.95rem; line-height: 1.9;
  color: rgba(255,255,255,0.6);
}

/* ==========================================
   TÉMOIGNAGES
   ========================================== */
.tf-reviews { padding: 100px 0; background: var(--tf-bg); }
.tf-reviews__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px; margin-top: 0;
}
.tf-review {
  border: 1px solid var(--tf-border);
  padding: 32px;
  position: relative;
}
.tf-review::before {
  content: '"';
  position: absolute; top: 16px; left: 24px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 4rem; color: var(--tf-gold); opacity: 0.2; line-height: 1;
}
.tf-review__stars { color: var(--tf-gold); font-size: 0.8rem; letter-spacing: 3px; margin-bottom: 12px; }
.tf-review__text { font-size: 0.9rem; line-height: 1.8; color: rgba(255,255,255,0.6); margin-bottom: 20px; font-style: italic; }
.tf-review__author { display: flex; align-items: center; gap: 12px; }
.tf-review__avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--tf-gold); color: #0a0a0a;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; flex-shrink: 0;
}
.tf-review__author strong { display: block; font-size: 0.85rem; color: var(--tf-text); }
.tf-review__author span { font-size: 0.75rem; color: var(--tf-gray); }

/* ==========================================
   FOOTER
   ========================================== */
.tf-footer { background: #050505; border-top: 1px solid var(--tf-border); }
.tf-footer__grid {
  display: grid; grid-template-columns: 2fr 1fr 1fr;
  gap: 48px; padding: 60px 24px;
}
@media (max-width: 700px) {
  .tf-footer__grid { grid-template-columns: 1fr; gap: 32px; }
}
.tf-footer__logo { margin-bottom: 16px; }
.tf-footer__logo img { height: 36px; filter: brightness(0) invert(1); opacity: 0.8; }
.tf-footer__logo span {
  font-family: 'Cormorant Garamond', serif; font-size: 1.3rem;
  font-weight: 600; color: var(--tf-text); letter-spacing: 0.15em; text-transform: uppercase;
}
.tf-footer__desc { font-size: 0.85rem; line-height: 1.8; color: var(--tf-gray); margin-bottom: 20px; }
.tf-footer__social { display: flex; gap: 12px; }
.tf-footer__social a {
  width: 32px; height: 32px; border: 1px solid var(--tf-border);
  display: flex; align-items: center; justify-content: center;
  color: var(--tf-gray); text-decoration: none; transition: all 0.25s;
}
.tf-footer__social a svg { width: 14px; height: 14px; }
.tf-footer__social a:hover { border-color: var(--tf-gold); color: var(--tf-gold); }

.tf-footer__col h4 {
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.25em;
  text-transform: uppercase; color: var(--tf-gold); margin-bottom: 16px;
}
.tf-footer__col ul { list-style: none; padding: 0; margin: 0; }
.tf-footer__col li { margin-bottom: 8px; }
.tf-footer__col a {
  font-size: 0.85rem; color: var(--tf-gray); text-decoration: none; transition: color 0.2s;
}
.tf-footer__col a:hover { color: var(--tf-text); }

.tf-footer__bottom {
  border-top: 1px solid var(--tf-border);
  padding: 16px 24px; max-width: 1280px; margin: 0 auto;
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;
  font-size: 0.75rem; color: rgba(255,255,255,0.25);
}
.tf-footer__bottom a { color: var(--tf-gold); text-decoration: none; }
</style>
