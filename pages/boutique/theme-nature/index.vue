<template>
  <div class="tn" :style="cssVars">

    <!-- ===== NAVIGATION ===== -->
    <header class="tn-nav" :class="{ 'tn-nav--scrolled': isScrolled, 'tn-nav--open': menuOpen }">
      <div class="tn-nav__inner">

        <!-- Logo + feuille déco -->
        <NuxtLink :to="`/boutique/${shop?.subdomain}`" class="tn-nav__logo">
          <span class="tn-nav__leaf">🌿</span>
          <img v-if="shop?.logo" :src="getUrl(shop.logo)" :alt="shop?.name" class="tn-nav__logo-img" />
          <span v-else class="tn-nav__logo-text">{{ shop?.name }}</span>
        </NuxtLink>

        <nav class="tn-nav__links">
          <a href="#produits"   @click.prevent="go('#produits')"   class="tn-nav__link">Produits</a>
          <a href="#bienfaits"  @click.prevent="go('#bienfaits')"  class="tn-nav__link">Bienfaits</a>
          <a href="#processus"  @click.prevent="go('#processus')"  class="tn-nav__link">Notre Processus</a>
          <a href="#apropos"    @click.prevent="go('#apropos')"    class="tn-nav__link">À propos</a>
        </nav>

        <div class="tn-nav__right">
          <NuxtLink v-if="shop?.shop_type !== 'website'" :to="`/boutique/${shop?.subdomain}/panier`" class="tn-nav__icon" aria-label="Panier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/></svg>
          </NuxtLink>
          <button class="tn-nav__burger" @click="menuOpen = !menuOpen" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile -->
      <div class="tn-nav__mobile" :class="{ 'is-open': menuOpen }">
        <a href="#produits"  @click="closeMenu('#produits')"  class="tn-nav__mobile-link">Produits</a>
        <a href="#bienfaits" @click="closeMenu('#bienfaits')" class="tn-nav__mobile-link">Bienfaits</a>
        <a href="#processus" @click="closeMenu('#processus')" class="tn-nav__mobile-link">Notre Processus</a>
        <a href="#apropos"   @click="closeMenu('#apropos')"   class="tn-nav__mobile-link">À propos</a>
      </div>
    </header>

    <main>

      <!-- ===== HERO ORGANIQUE ===== -->
      <section id="accueil" class="tn-hero">
        <div class="tn-hero__bg">
          <div class="tn-hero__slides">
            <div v-for="(img, i) in heroImages" :key="i"
              class="tn-hero__slide" :class="{ 'is-active': slide === i }"
              :style="{ backgroundImage: `url(${img})` }">
            </div>
          </div>
          <div class="tn-hero__overlay"></div>
        </div>

        <!-- Formes organiques décoratives -->
        <div class="tn-hero__shape tn-hero__shape--1"></div>
        <div class="tn-hero__shape tn-hero__shape--2"></div>

        <div class="tn-hero__content">
          <div class="tn-hero__badge">
            <span>🌱</span> {{ heroBadge }}
          </div>
          <h1 class="tn-hero__title">{{ heroTitle }}</h1>
          <p class="tn-hero__desc">{{ heroSubtitle }}</p>
          <div class="tn-hero__ctas">
            <a href="#produits" @click.prevent="go('#produits')" class="tn-btn tn-btn--primary">
              Découvrir nos produits
            </a>
            <a href="#processus" @click.prevent="go('#processus')" class="tn-btn tn-btn--outline">
              Notre engagement
            </a>
          </div>
          <!-- Certifications -->
          <div class="tn-hero__certs">
            <div v-for="c in certs" :key="c.label" class="tn-hero__cert">
              <span class="tn-hero__cert-icon">{{ c.icon }}</span>
              <span class="tn-hero__cert-label">{{ c.label }}</span>
            </div>
          </div>
        </div>

        <!-- Slider dots -->
        <div class="tn-hero__dots">
          <button v-for="(_, i) in heroImages" :key="i"
            class="tn-hero__dot" :class="{ 'is-active': slide === i }"
            @click="goSlide(i)"></button>
        </div>
      </section>

      <!-- ===== BIENFAITS / VALEURS ===== -->
      <section id="bienfaits" class="tn-benefits">
        <div class="tn-container">
          <div class="tn-section-head">
            <span class="tn-eyebrow">Pourquoi nous choisir</span>
            <h2 class="tn-section-title">{{ benefitsTitle }}</h2>
          </div>
          <div class="tn-benefits__grid">
            <div v-for="b in benefits" :key="b.title" class="tn-benefit">
              <div class="tn-benefit__icon">{{ b.icon }}</div>
              <h3 class="tn-benefit__title">{{ b.title }}</h3>
              <p class="tn-benefit__desc">{{ b.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== PRODUITS ===== -->
      <section id="produits" class="tn-products">
        <div class="tn-container">
          <div class="tn-section-head">
            <span class="tn-eyebrow">Notre sélection</span>
            <h2 class="tn-section-title">{{ productsTitle }}</h2>
            <p class="tn-section-desc">{{ productsDesc }}</p>
          </div>

          <!-- Filtres -->
          <div class="tn-filters">
            <button class="tn-filter" :class="{ 'is-active': activeCat === 'all' }" @click="activeCat = 'all'">
              Tout
            </button>
            <button v-for="cat in categories" :key="cat"
              class="tn-filter" :class="{ 'is-active': activeCat === cat }"
              @click="activeCat = cat">
              {{ cat }}
            </button>
          </div>

          <div v-if="!filteredProducts.length" class="tn-empty">
            Aucun produit disponible pour le moment.
          </div>

          <div v-else class="tn-grid">
            <NuxtLink v-for="p in filteredProducts" :key="p.id"
              :to="`/boutique/${shop?.subdomain}/produit/${p.id}`"
              class="tn-card">
              <div class="tn-card__img-wrap">
                <img v-if="p.preview_image" :src="getUrl(p.preview_image)" :alt="p.name"
                  class="tn-card__img"
                  @contextmenu.prevent @dragstart.prevent draggable="false" loading="lazy" />
                <div v-else class="tn-card__placeholder"><span>🌿</span></div>
                <div class="tn-card__img-overlay">
                  <div class="absolute inset-0 z-10" @contextmenu.prevent></div>
                </div>
                <div v-if="p.promotional_price" class="tn-card__badge">Promo</div>
                <div v-if="p.stock_quantity === 0" class="tn-card__oos">Épuisé</div>
              </div>
              <div class="tn-card__body">
                <span v-if="p.subcategory" class="tn-card__cat">{{ p.subcategory.name }}</span>
                <h3 class="tn-card__name">{{ p.name }}</h3>
                <p class="tn-card__desc">{{ cleanDesc(p.description, 80) }}</p>
                <div class="tn-card__footer">
                  <div class="tn-card__prices">
                    <span v-if="p.promotional_price" class="tn-card__price-old">{{ fmtPrice(p.price) }}</span>
                    <span class="tn-card__price">{{ fmtPrice(p.promotional_price || p.price) }}</span>
                  </div>
                  <button v-if="shop?.shop_type !== 'website' && p.stock_quantity !== 0"
                    @click.prevent="addCart(p)" class="tn-card__btn" aria-label="Ajouter au panier">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h12"/></svg>
                  </button>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- ===== PROCESSUS ===== -->
      <section id="processus" class="tn-process">
        <div class="tn-container">
          <div class="tn-section-head">
            <span class="tn-eyebrow">De la nature à vous</span>
            <h2 class="tn-section-title">{{ processTitle }}</h2>
          </div>
          <div class="tn-process__steps">
            <div v-for="(step, i) in processSteps" :key="step.title" class="tn-step">
              <div class="tn-step__num">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="tn-step__icon">{{ step.icon }}</div>
              <h3 class="tn-step__title">{{ step.title }}</h3>
              <p class="tn-step__desc">{{ step.desc }}</p>
              <div v-if="i < processSteps.length - 1" class="tn-step__connector"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== À PROPOS ===== -->
      <section id="apropos" class="tn-about">
        <div class="tn-container tn-about__inner">
          <div class="tn-about__img-col">
            <div class="tn-about__img-frame">
              <img v-if="aboutImage" :src="aboutImage" :alt="`À propos de ${shop?.name}`"
                class="tn-about__img"
                @contextmenu.prevent @dragstart.prevent draggable="false" loading="lazy" />
              <div v-else class="tn-about__img-placeholder"><span>🌱</span></div>
              <!-- Badge flottant -->
              <div class="tn-about__badge-float">
                <span class="tn-about__badge-icon">🌿</span>
                <span class="tn-about__badge-text">100% Naturel</span>
              </div>
            </div>
          </div>
          <div class="tn-about__text-col">
            <span class="tn-eyebrow">Notre histoire</span>
            <h2 class="tn-section-title tn-section-title--left">{{ shop?.name }}</h2>
            <div class="tn-about__divider"></div>
            <div class="tn-about__body">
              <p v-if="aboutText">{{ aboutText }}</p>
              <p v-else>
                Née d'une conviction profonde que la nature offre tout ce dont nous avons besoin, notre marque sélectionne et propose des produits biologiques et éco-responsables pour un mode de vie plus sain et respectueux de l'environnement.
              </p>
            </div>
            <!-- Stats -->
            <div class="tn-about__stats">
              <div v-for="stat in aboutStats" :key="stat.label" class="tn-about__stat">
                <span class="tn-about__stat-value">{{ stat.value }}</span>
                <span class="tn-about__stat-label">{{ stat.label }}</span>
              </div>
            </div>
            <a href="#produits" @click.prevent="go('#produits')" class="tn-btn tn-btn--primary mt-8">
              Découvrir nos produits
            </a>
          </div>
        </div>
      </section>

      <!-- ===== TÉMOIGNAGES ===== -->
      <section class="tn-testimonials">
        <div class="tn-container">
          <div class="tn-section-head">
            <span class="tn-eyebrow">Avis clients</span>
            <h2 class="tn-section-title">Ils nous font confiance</h2>
          </div>
          <div class="tn-testimonials__grid">
            <div v-for="t in testimonials" :key="t.name" class="tn-testi">
              <div class="tn-testi__stars">★★★★★</div>
              <p class="tn-testi__text">« {{ t.text }} »</p>
              <div class="tn-testi__author">
                <div class="tn-testi__avatar">{{ t.name[0] }}</div>
                <div>
                  <strong>{{ t.name }}</strong>
                  <span>{{ t.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== NEWSLETTER ===== -->
      <section class="tn-newsletter">
        <div class="tn-container tn-newsletter__inner">
          <div class="tn-newsletter__text">
            <span class="tn-newsletter__icon">🌿</span>
            <h2 class="tn-newsletter__title">Rejoignez notre communauté</h2>
            <p class="tn-newsletter__desc">Recevez nos conseils bien-être, nos offres exclusives et nos actualités nature.</p>
          </div>
          <div class="tn-newsletter__form">
            <input type="email" v-model="email" placeholder="Votre adresse email" class="tn-newsletter__input" />
            <button @click="subscribe" class="tn-btn tn-btn--primary">S'abonner</button>
          </div>
        </div>
      </section>

    </main>

    <!-- ===== FOOTER ===== -->
    <footer class="tn-footer">
      <div class="tn-container tn-footer__grid">
        <div class="tn-footer__brand">
          <div class="tn-footer__logo">
            <span class="tn-footer__leaf">🌿</span>
            <img v-if="shop?.logo" :src="getUrl(shop.logo)" :alt="shop?.name" />
            <span v-else class="tn-footer__name">{{ shop?.name }}</span>
          </div>
          <p class="tn-footer__desc">{{ shop?.description || 'Pour un mode de vie naturel et responsable.' }}</p>
          <div class="tn-footer__social">
            <a v-if="social.instagram" :href="social.instagram" target="_blank" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a v-if="social.facebook" :href="social.facebook" target="_blank" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        <div class="tn-footer__col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#produits"  @click.prevent="go('#produits')">Nos produits</a></li>
            <li><a href="#bienfaits" @click.prevent="go('#bienfaits')">Bienfaits</a></li>
            <li><a href="#processus" @click.prevent="go('#processus')">Notre processus</a></li>
            <li><a href="#apropos"   @click.prevent="go('#apropos')">À propos</a></li>
          </ul>
        </div>

        <div class="tn-footer__col">
          <h4>Légal</h4>
          <ul>
            <li><a href="#cgu">CGU</a></li>
            <li><a href="#cgv">CGV</a></li>
            <li><a href="mailto:contact@uber-market.com">Contact</a></li>
          </ul>
        </div>

        <div class="tn-footer__col">
          <h4>Certifications</h4>
          <div class="tn-footer__certs">
            <div v-for="c in certs" :key="c.label" class="tn-footer__cert">
              {{ c.icon }} {{ c.label }}
            </div>
          </div>
        </div>
      </div>

      <div class="tn-footer__bottom">
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
  const name = props.shop?.name || 'Boutique Nature'
  const desc = props.shop?.description || `Découvrez les produits naturels et bio de ${name}`
  const url  = `https://uber-market.com/boutique/${props.shop?.subdomain}`
  return {
    title: `${name} — Produits Naturels & Bio | UberMarket`,
    meta: [
      { name: 'description', content: desc.slice(0, 155) },
      { name: 'robots', content: 'index, follow' },
      { name: 'keywords', content: `${name}, produits naturels, bio, organique, éco-responsable, Afrique` },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: `${name} — Produits Naturels & Bio` },
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
const primaryColor   = computed(() => props.customizations?.home?.colors?.primary    || '#2d6a4f')
const secondaryColor = computed(() => props.customizations?.home?.colors?.secondary  || '#f4a261')
const bgColor        = computed(() => props.customizations?.home?.colors?.background || '#fefae0')
const textColor      = computed(() => props.customizations?.home?.colors?.text       || '#1b4332')

const cssVars = computed(() => ({
  '--tn-green':  primaryColor.value,
  '--tn-orange': secondaryColor.value,
  '--tn-cream':  bgColor.value,
  '--tn-dark':   textColor.value,
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

const heroBadge     = computed(() => props.customizations?.home?.nature?.hero_badge     || '100% Naturel & Bio')
const heroTitle     = computed(() => props.customizations?.home?.banner?.title           || 'La Nature à votre service')
const heroSubtitle  = computed(() => props.customizations?.home?.banner?.subtitle        || 'Produits biologiques sélectionnés avec soin pour votre bien-être')
const benefitsTitle = computed(() => props.customizations?.home?.nature?.benefits_title  || 'Nos engagements')
const productsTitle = computed(() => props.customizations?.home?.nature?.products_title  || 'Nos Produits')
const productsDesc  = computed(() => props.customizations?.home?.nature?.products_desc   || 'Chaque produit est soigneusement sélectionné pour sa qualité et son respect de l\'environnement.')
const processTitle  = computed(() => props.customizations?.home?.nature?.process_title   || 'De la Nature à Vous')

const heroImages = computed(() => {
  const imgs = props.customizations?.home?.banner?.images
  if (imgs?.length) return imgs.map((p: string) => getUrl(p))
  return [
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1600&auto=format&fit=crop&q=80',
  ]
})

const aboutText = computed(() => props.customizations?.about?.text || '')
const aboutImage = computed(() => {
  const img = props.customizations?.about?.image
  return img ? getUrl(img) : 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80'
})
const footerText = computed(() =>
  props.customizations?.footer?.text || `© ${new Date().getFullYear()} ${props.shop?.name}. Tous droits réservés.`
)
const social = computed(() => props.customizations?.footer?.socialLinks || {})

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

const fmtPrice = (price: number) =>
  `${Number(price).toLocaleString('fr-FR')} ${props.shop?.currency || 'XOF'}`

const cleanDesc = (text: string, max: number) => {
  if (!text) return ''
  const clean = text.replace(/<[^>]+>/g, '')
  return clean.length > max ? clean.slice(0, max) + '…' : clean
}

const addCart = (product: any) => console.log('Ajout au panier:', product.name)

// =============================================
// NEWSLETTER
// =============================================
const email = ref('')
const subscribe = () => {
  if (email.value) { alert('Merci pour votre inscription ! 🌿'); email.value = '' }
}

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
const certs = [
  { icon: '🌿', label: 'Bio certifié' },
  { icon: '♻️', label: 'Éco-emballage' },
  { icon: '💚', label: 'Commerce équitable' },
  { icon: '🌱', label: 'Sans pesticides' },
]

const benefits = [
  { icon: '🌱', title: '100% Naturel', desc: 'Tous nos produits sont issus de l\'agriculture biologique certifiée, sans produits chimiques.' },
  { icon: '♻️', title: 'Éco-responsable', desc: 'Emballages biodégradables et processus de production respectueux de l\'environnement.' },
  { icon: '💚', title: 'Commerce équitable', desc: 'Nous travaillons directement avec les producteurs locaux pour garantir une rémunération juste.' },
  { icon: '🔬', title: 'Testé & Certifié', desc: 'Chaque produit passe par des contrôles qualité rigoureux avant de vous être proposé.' },
]

const processSteps = [
  { icon: '🌱', title: 'Sélection', desc: 'Nous sélectionnons rigoureusement nos matières premières auprès de producteurs locaux certifiés.' },
  { icon: '🤝', title: 'Partenariat', desc: 'Nous établissons des relations durables basées sur le respect et l\'équité avec nos partenaires.' },
  { icon: '⚗️', title: 'Transformation', desc: 'Transformation artisanale qui préserve toutes les propriétés naturelles des ingrédients.' },
  { icon: '📦', title: 'Livraison', desc: 'Expédition dans des emballages écologiques pour minimiser notre impact environnemental.' },
]

const aboutStats = [
  { value: '100%', label: 'Bio certifié' },
  { value: '50+', label: 'Producteurs locaux' },
  { value: '0', label: 'Additifs chimiques' },
]

const testimonials = [
  { name: 'Mariam S.', role: 'Cliente', text: 'Des produits de qualité exceptionnelle. Je sens vraiment la différence sur ma peau et ma santé.' },
  { name: 'Kofi A.', role: 'Naturopathe', text: 'Je recommande ces produits à tous mes patients. La qualité bio est irréprochable.' },
  { name: 'Fatou D.', role: 'Maman de 3 enfants', text: 'Enfin des produits que je peux utiliser pour toute ma famille sans inquiétude.' },
]

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  timer = setInterval(next, 5500)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  clearInterval(timer)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ==========================================
   VARIABLES & BASE
   ========================================== */
.tn {
  --tn-green:  #2d6a4f;
  --tn-light:  #52b788;
  --tn-orange: #f4a261;
  --tn-cream:  #fefae0;
  --tn-warm:   #f5ebe0;
  --tn-dark:   #1b4332;
  --tn-gray:   #6b7280;
  --tn-white:  #ffffff;

  font-family: 'DM Sans', sans-serif;
  background: var(--tn-cream);
  color: var(--tn-dark);
  overflow-x: hidden;
}

.tn-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

/* ==========================================
   NAVIGATION
   ========================================== */
.tn-nav {
  position: fixed; inset: 0 0 auto;
  z-index: 100; padding: 0 24px;
  transition: all 0.4s;
}
.tn-nav__inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; height: 76px; gap: 24px;
}
.tn-nav--scrolled {
  background: rgba(254, 250, 224, 0.97);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 20px rgba(0,0,0,0.06);
}

.tn-nav__logo { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
.tn-nav__leaf { font-size: 1.2rem; }
.tn-nav__logo-img { height: 40px; width: auto; object-fit: contain; }
.tn-nav__logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem; font-weight: 600; color: var(--tn-dark);
}

.tn-nav__links { display: flex; gap: 32px; margin: 0 auto; }
@media (max-width: 900px) { .tn-nav__links { display: none; } }

.tn-nav__link {
  font-size: 0.85rem; font-weight: 500;
  color: var(--tn-dark); text-decoration: none; transition: color 0.2s;
  position: relative; padding-bottom: 4px;
}
.tn-nav__link::after {
  content: ''; position: absolute; bottom: 0; left: 0;
  width: 0; height: 2px; background: var(--tn-green); transition: width 0.3s;
  border-radius: 1px;
}
.tn-nav__link:hover { color: var(--tn-green); }
.tn-nav__link:hover::after { width: 100%; }

.tn-nav__right { display: flex; align-items: center; gap: 16px; margin-left: auto; }
.tn-nav__icon {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  color: var(--tn-dark); text-decoration: none; transition: color 0.2s;
}
.tn-nav__icon svg { width: 20px; height: 20px; }
.tn-nav__icon:hover { color: var(--tn-green); }

.tn-nav__burger {
  display: none; flex-direction: column; gap: 4px;
  background: none; border: none; cursor: pointer; padding: 4px;
}
.tn-nav__burger span {
  display: block; width: 22px; height: 1.5px;
  background: var(--tn-dark); transition: all 0.3s;
}
@media (max-width: 900px) { .tn-nav__burger { display: flex; } }

.tn-nav__mobile {
  display: none; flex-direction: column;
  background: var(--tn-cream); max-height: 0; overflow: hidden; transition: max-height 0.4s;
  border-top: 1px solid rgba(45,106,79,0.1);
}
.tn-nav__mobile.is-open { max-height: 280px; }
@media (max-width: 900px) { .tn-nav__mobile { display: flex; } }

.tn-nav__mobile-link {
  display: block; padding: 14px 24px;
  font-size: 0.9rem; color: var(--tn-dark); text-decoration: none;
  border-bottom: 1px solid rgba(45,106,79,0.08); transition: color 0.2s;
}
.tn-nav__mobile-link:hover { color: var(--tn-green); }

/* ==========================================
   BOUTONS
   ========================================== */
.tn-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px; border-radius: 50px;
  font-size: 0.85rem; font-weight: 600; text-decoration: none;
  transition: all 0.3s; border: 2px solid transparent; cursor: pointer;
}
.tn-btn--primary {
  background: var(--tn-green); color: white; border-color: var(--tn-green);
}
.tn-btn--primary:hover {
  background: color-mix(in srgb, var(--tn-green) 85%, black);
  transform: translateY(-2px); box-shadow: 0 8px 20px rgba(45,106,79,0.25);
}
.tn-btn--outline {
  background: transparent; color: var(--tn-green); border-color: var(--tn-green);
}
.tn-btn--outline:hover { background: var(--tn-green); color: white; }
.mt-8 { margin-top: 2rem; }

/* ==========================================
   HERO
   ========================================== */
.tn-hero {
  position: relative; height: 100vh; min-height: 600px;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.tn-hero__bg { position: absolute; inset: 0; }
.tn-hero__slides { position: absolute; inset: 0; }
.tn-hero__slide {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0; transform: scale(1.04);
  transition: opacity 1s ease, transform 6s ease;
}
.tn-hero__slide.is-active { opacity: 1; transform: scale(1); }
.tn-hero__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(27,67,50,0.75) 0%, rgba(0,0,0,0.3) 100%);
  z-index: 1;
}

/* Formes organiques */
.tn-hero__shape {
  position: absolute; border-radius: 50%; z-index: 2;
  pointer-events: none; opacity: 0.08;
}
.tn-hero__shape--1 {
  width: 600px; height: 600px;
  background: var(--tn-orange);
  top: -200px; right: -150px;
}
.tn-hero__shape--2 {
  width: 400px; height: 400px;
  background: var(--tn-green);
  bottom: -100px; left: -100px;
}

.tn-hero__content {
  position: relative; z-index: 3; text-align: center;
  padding: 0 24px; max-width: 780px;
  animation: fadeUp 0.8s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.tn-hero__badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.25); border-radius: 50px;
  padding: 8px 20px; font-size: 0.8rem; font-weight: 500; color: white;
  margin-bottom: 24px;
}

.tn-hero__title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 600; line-height: 1.1;
  color: white; margin-bottom: 20px;
}

.tn-hero__desc {
  font-size: 1rem; font-weight: 300;
  color: rgba(255,255,255,0.85); margin-bottom: 36px;
  line-height: 1.7;
}

.tn-hero__ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px; }

.tn-hero__certs {
  display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;
  padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.15);
}
.tn-hero__cert { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.8); font-size: 0.8rem; }
.tn-hero__cert-icon { font-size: 1.1rem; }

.tn-hero__dots {
  position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
  z-index: 3; display: flex; gap: 8px;
}
.tn-hero__dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,0.35); border: none; cursor: pointer; transition: all 0.3s; padding: 0;
}
.tn-hero__dot.is-active { background: var(--tn-orange); width: 24px; border-radius: 4px; }

/* ==========================================
   BIENFAITS
   ========================================== */
.tn-benefits { padding: 100px 0; background: var(--tn-white); }
.tn-benefits__grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 32px;
}
.tn-benefit {
  text-align: center; padding: 40px 24px;
  border: 1px solid rgba(45,106,79,0.1); border-radius: 16px;
  transition: all 0.3s;
}
.tn-benefit:hover {
  border-color: var(--tn-green); box-shadow: 0 8px 32px rgba(45,106,79,0.1);
  transform: translateY(-4px);
}
.tn-benefit__icon { font-size: 2.5rem; margin-bottom: 16px; }
.tn-benefit__title {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem; font-weight: 600; color: var(--tn-dark); margin-bottom: 12px;
}
.tn-benefit__desc { font-size: 0.9rem; line-height: 1.7; color: var(--tn-gray); }

/* ==========================================
   UTILITAIRES SECTIONS
   ========================================== */
.tn-section-head { text-align: center; margin-bottom: 48px; }
.tn-eyebrow {
  display: block; font-size: 0.7rem; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--tn-green);
  margin-bottom: 12px;
}
.tn-section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 600; color: var(--tn-dark); line-height: 1.2;
}
.tn-section-title--left { text-align: left; }
.tn-section-desc {
  max-width: 560px; margin: 16px auto 0;
  font-size: 0.95rem; line-height: 1.8; color: var(--tn-gray);
}

/* ==========================================
   PRODUITS
   ========================================== */
.tn-products { padding: 100px 0; background: var(--tn-cream); }

.tn-filters {
  display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 48px;
}
.tn-filter {
  padding: 8px 22px; border-radius: 50px;
  font-size: 0.8rem; font-weight: 500;
  background: none; border: 1.5px solid rgba(45,106,79,0.2);
  color: var(--tn-gray); cursor: pointer; transition: all 0.25s;
}
.tn-filter:hover { border-color: var(--tn-green); color: var(--tn-green); }
.tn-filter.is-active { background: var(--tn-green); border-color: var(--tn-green); color: white; }

.tn-empty { text-align: center; padding: 80px; color: var(--tn-gray); font-size: 1.1rem; }

.tn-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 28px;
}

.tn-card {
  background: var(--tn-white); text-decoration: none; color: inherit;
  border-radius: 16px; overflow: hidden;
  transition: all 0.3s; box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.tn-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }

.tn-card__img-wrap { position: relative; overflow: hidden; aspect-ratio: 4/3; }
.tn-card__img {
  width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s;
  pointer-events: none; user-select: none; -webkit-user-drag: none;
}
.tn-card:hover .tn-card__img { transform: scale(1.05); }
.tn-card__img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(27,67,50,0.1) 0%, transparent 60%);
  z-index: 1;
}
.tn-card__placeholder {
  width: 100%; height: 100%; background: var(--tn-warm);
  display: flex; align-items: center; justify-content: center; font-size: 3rem;
}
.tn-card__badge {
  position: absolute; top: 12px; left: 12px; z-index: 2;
  background: var(--tn-orange); color: white;
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.05em;
  text-transform: uppercase; padding: 4px 10px; border-radius: 50px;
}
.tn-card__oos {
  position: absolute; top: 12px; right: 12px; z-index: 2;
  background: rgba(0,0,0,0.5); color: white;
  font-size: 0.65rem; font-weight: 600; padding: 4px 10px; border-radius: 50px;
}

.tn-card__body { padding: 20px; }
.tn-card__cat {
  font-size: 0.65rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--tn-green); display: block; margin-bottom: 6px;
}
.tn-card__name {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem; font-weight: 600; color: var(--tn-dark); margin-bottom: 6px;
}
.tn-card__desc { font-size: 0.8rem; line-height: 1.6; color: var(--tn-gray); margin-bottom: 14px; }
.tn-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.tn-card__prices { display: flex; flex-direction: column; gap: 2px; }
.tn-card__price { font-size: 1rem; font-weight: 700; color: var(--tn-green); }
.tn-card__price-old { font-size: 0.8rem; color: var(--tn-gray); text-decoration: line-through; }
.tn-card__btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--tn-green); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: white; transition: all 0.25s; flex-shrink: 0;
}
.tn-card__btn svg { width: 16px; height: 16px; }
.tn-card__btn:hover {
  background: color-mix(in srgb, var(--tn-green) 85%, black);
  transform: scale(1.1);
}

/* ==========================================
   PROCESSUS
   ========================================== */
.tn-process { padding: 100px 0; background: var(--tn-dark); }
.tn-process .tn-eyebrow { color: var(--tn-orange); }
.tn-process .tn-section-title { color: var(--tn-white); }

.tn-process__steps {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0; position: relative;
}

.tn-step {
  padding: 40px 32px; text-align: center; position: relative;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.tn-step:last-child { border-right: none; }
@media (max-width: 700px) { .tn-step { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); } }

.tn-step__num {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.3em;
  color: var(--tn-orange); margin-bottom: 16px;
}
.tn-step__icon { font-size: 2.5rem; margin-bottom: 16px; }
.tn-step__title {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem; font-weight: 600; color: var(--tn-white); margin-bottom: 12px;
}
.tn-step__desc { font-size: 0.85rem; line-height: 1.7; color: rgba(255,255,255,0.5); }
.tn-step__connector {
  display: none; /* Les bordures font office de connecteurs */
}

/* ==========================================
   À PROPOS
   ========================================== */
.tn-about { padding: 100px 0; background: var(--tn-white); }
.tn-about__inner {
  display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
}
@media (max-width: 900px) { .tn-about__inner { grid-template-columns: 1fr; gap: 48px; } }

.tn-about__img-frame { position: relative; border-radius: 24px; overflow: hidden; aspect-ratio: 4/5; }
.tn-about__img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; user-select: none; -webkit-user-drag: none; }
.tn-about__img-placeholder {
  width: 100%; height: 100%; background: var(--tn-warm);
  display: flex; align-items: center; justify-content: center; font-size: 4rem;
}

.tn-about__badge-float {
  position: absolute; bottom: 24px; left: 24px;
  background: var(--tn-green); color: white; border-radius: 12px;
  padding: 12px 20px; display: flex; align-items: center; gap: 8px;
  box-shadow: 0 8px 24px rgba(45,106,79,0.3);
}
.tn-about__badge-icon { font-size: 1.4rem; }
.tn-about__badge-text { font-weight: 600; font-size: 0.85rem; }

.tn-about__divider {
  width: 48px; height: 3px; background: var(--tn-green);
  border-radius: 2px; margin: 16px 0 20px;
}
.tn-about__body { font-size: 0.95rem; line-height: 1.9; color: var(--tn-gray); }

.tn-about__stats {
  display: flex; gap: 32px; margin-top: 32px; padding-top: 24px;
  border-top: 1px solid rgba(45,106,79,0.1);
}
.tn-about__stat { text-align: center; }
.tn-about__stat-value {
  display: block; font-family: 'Playfair Display', serif;
  font-size: 1.8rem; font-weight: 700; color: var(--tn-green);
}
.tn-about__stat-label { font-size: 0.75rem; color: var(--tn-gray); margin-top: 4px; display: block; }

/* ==========================================
   TÉMOIGNAGES
   ========================================== */
.tn-testimonials { padding: 100px 0; background: var(--tn-cream); }
.tn-testimonials__grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
.tn-testi {
  background: var(--tn-white); padding: 32px; border-radius: 16px;
  position: relative; box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  transition: all 0.3s;
}
.tn-testi:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
.tn-testi__stars { color: var(--tn-orange); font-size: 0.85rem; letter-spacing: 3px; margin-bottom: 12px; }
.tn-testi__text { font-size: 0.9rem; line-height: 1.8; color: var(--tn-gray); margin-bottom: 20px; font-style: italic; }
.tn-testi__author { display: flex; align-items: center; gap: 12px; }
.tn-testi__avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--tn-green); color: white;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; flex-shrink: 0;
}
.tn-testi__author strong { display: block; font-size: 0.85rem; color: var(--tn-dark); }
.tn-testi__author span { font-size: 0.75rem; color: var(--tn-gray); }

/* ==========================================
   NEWSLETTER
   ========================================== */
.tn-newsletter {
  padding: 80px 0; background: var(--tn-green);
}
.tn-newsletter__inner {
  display: flex; align-items: center; justify-content: space-between;
  gap: 40px; flex-wrap: wrap;
}
.tn-newsletter__text { flex: 1; min-width: 280px; }
.tn-newsletter__icon { font-size: 2rem; display: block; margin-bottom: 12px; }
.tn-newsletter__title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem; font-weight: 600; color: white; margin-bottom: 8px;
}
.tn-newsletter__desc { font-size: 0.9rem; color: rgba(255,255,255,0.75); }
.tn-newsletter__form { display: flex; gap: 8px; flex: 0 0 auto; }
.tn-newsletter__input {
  padding: 14px 20px; border-radius: 50px; border: 2px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.15); color: white; font-size: 0.9rem; outline: none;
  transition: border-color 0.2s; min-width: 240px;
}
.tn-newsletter__input::placeholder { color: rgba(255,255,255,0.6); }
.tn-newsletter__input:focus { border-color: rgba(255,255,255,0.7); }
.tn-newsletter .tn-btn--primary {
  background: white; color: var(--tn-green); border-color: white;
}
.tn-newsletter .tn-btn--primary:hover { background: var(--tn-cream); }

/* ==========================================
   FOOTER
   ========================================== */
.tn-footer { background: var(--tn-dark); }
.tn-footer__grid {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px; padding: 64px 24px;
}
@media (max-width: 900px) { .tn-footer__grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
@media (max-width: 600px) { .tn-footer__grid { grid-template-columns: 1fr; } }

.tn-footer__logo { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.tn-footer__leaf { font-size: 1.2rem; }
.tn-footer__logo img { height: 36px; filter: brightness(0) invert(1); opacity: 0.9; }
.tn-footer__name {
  font-family: 'Playfair Display', serif; font-size: 1.2rem;
  font-weight: 600; color: white;
}
.tn-footer__desc { font-size: 0.85rem; line-height: 1.8; color: rgba(255,255,255,0.45); margin-bottom: 20px; }
.tn-footer__social { display: flex; gap: 12px; }
.tn-footer__social a {
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5); text-decoration: none; transition: all 0.25s;
}
.tn-footer__social a svg { width: 16px; height: 16px; }
.tn-footer__social a:hover { border-color: var(--tn-orange); color: var(--tn-orange); }

.tn-footer__col h4 {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--tn-orange); margin-bottom: 16px;
}
.tn-footer__col ul { list-style: none; padding: 0; margin: 0; }
.tn-footer__col li { margin-bottom: 8px; }
.tn-footer__col a {
  font-size: 0.85rem; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s;
}
.tn-footer__col a:hover { color: white; }

.tn-footer__certs { display: flex; flex-direction: column; gap: 8px; }
.tn-footer__cert { font-size: 0.8rem; color: rgba(255,255,255,0.5); }

.tn-footer__bottom {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 16px 24px; max-width: 1200px; margin: 0 auto;
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;
  font-size: 0.75rem; color: rgba(255,255,255,0.25);
}
.tn-footer__bottom a { color: var(--tn-orange); text-decoration: none; }
</style>
