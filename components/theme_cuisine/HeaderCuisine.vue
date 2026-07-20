<template>
  <header
    class="cuisine-nav"
    :class="{ 'cuisine-nav--scrolled': isScrolled || forceScrolledStyle, 'cuisine-nav--open': menuOpen }"
  >
    <div class="cuisine-nav__inner">

      <!-- Logo -->
      <NuxtLink :to="`/boutique/${shop?.subdomain}`" class="cuisine-nav__logo">
        <img
          v-if="shop?.logo"
          :src="getImageUrl(shop.logo)"
          :alt="shop?.name"
          class="cuisine-nav__logo-img"
        />
        <span v-else class="cuisine-nav__logo-text">{{ shop?.name }}</span>
      </NuxtLink>

      <!-- Navigation desktop -->
      <nav class="cuisine-nav__links">
        <NuxtLink :to="homeLink('accueil')" class="cuisine-nav__link">Accueil</NuxtLink>
        <NuxtLink :to="homeLink('menu')" class="cuisine-nav__link">Notre Menu</NuxtLink>
        <NuxtLink :to="homeLink('specialites')" class="cuisine-nav__link">Nos Spécialités</NuxtLink>
        <NuxtLink :to="`/boutique/${shop?.subdomain}/a-propos`" class="cuisine-nav__link">À propos</NuxtLink>
        <NuxtLink :to="`/boutique/${shop?.subdomain}/contact`" class="cuisine-nav__link">Contact</NuxtLink>
        <!--<NuxtLink :to="homeLink('contact')" class="cuisine-nav__link">Contact</NuxtLink>-->
      </nav>

      <!-- CTA panier -->
      <div class="cuisine-nav__actions">
        <NuxtLink
          v-if="shop?.shop_type !== 'website'"
          :to="cartUrl"
          class="cuisine-nav__cart"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
          </svg>
        </NuxtLink>

        <!-- Burger mobile -->
        <button class="cuisine-nav__burger" @click="menuOpen = !menuOpen" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Menu mobile -->
    <div class="cuisine-nav__mobile" :class="{ 'is-open': menuOpen }">
      <NuxtLink :to="homeLink('accueil')" @click="menuOpen = false" class="cuisine-nav__mobile-link">Accueil</NuxtLink>
      <NuxtLink :to="homeLink('menu')" @click="menuOpen = false" class="cuisine-nav__mobile-link">Notre Menu</NuxtLink>
      <NuxtLink :to="homeLink('specialites')" @click="menuOpen = false" class="cuisine-nav__mobile-link">Nos Spécialités</NuxtLink>
      <NuxtLink :to="`/boutique/${shop?.subdomain}/a-propos`" @click="menuOpen = false" class="cuisine-nav__mobile-link">À propos</NuxtLink>
      <NuxtLink :to="homeLink('contact')" @click="menuOpen = false" class="cuisine-nav__mobile-link">Contact</NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ─────────────────────────────────────────────────────────────
// HeaderCuisine — nav partagée entre toutes les pages du thème.
//
// Les liens "Accueil", "Notre Menu", "Nos Spécialités", "Contact"
// pointent vers des ANCRES de la page d'accueil (#menu, #specialites,
// #contact). Depuis une autre page (produit, à propos...), le lien
// redirige d'abord vers l'accueil PUIS scrolle jusqu'à l'ancre une
// fois la page chargée (géré par onMounted qui lit window.location.hash).
//
// "À propos" est une vraie page séparée (a-propos.vue) donc lien direct.
//
// forceScrolledStyle : permet aux pages secondaires (produit, panier...)
// qui n'ont pas de hero plein écran de forcer le style "scrolled"
// (fond blanc) dès le chargement, plutôt que d'attendre un scroll.
// ─────────────────────────────────────────────────────────────
interface Props {
  shop?: any
  primaryColor?: string
  forceScrolledStyle?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  forceScrolledStyle: false
})

const config = useRuntimeConfig()
const backendUrl = config.public.backendUrl || config.public.apiBase?.replace('/api', '')

const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${backendUrl}/storage/${path}`
}

const cartUrl = computed(() => {
  const { getCartUrl } = useShopNavigation()
  return getCartUrl(props.shop)
})

// Construit un lien vers l'accueil avec ancre : /boutique/xxx#menu
const homeLink = (anchor: string) => `/boutique/${props.shop?.subdomain}#${anchor}`

const isScrolled = ref(false)
const menuOpen    = ref(false)

const onScroll = () => { isScrolled.value = window.scrollY > 60 }

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  // Si on arrive sur l'accueil avec une ancre dans l'URL (ex: après
  // avoir cliqué "Notre Menu" depuis la page produit), scroller jusqu'à
  // la section une fois le DOM prêt.
  if (window.location.hash) {
    setTimeout(() => {
      const el = document.querySelector(window.location.hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.cuisine-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.4s ease;
  padding: 0 24px;
}

.cuisine-nav__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 80px;
  gap: 32px;
  transition: height 0.3s ease;
}

.cuisine-nav--scrolled {
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 20px rgba(0,0,0,0.08);
}
.cuisine-nav--scrolled .cuisine-nav__inner { height: 64px; }
.cuisine-nav--scrolled .cuisine-nav__link { color: var(--c-text); }
.cuisine-nav--scrolled .cuisine-nav__link:hover,
.cuisine-nav--scrolled .cuisine-nav__link::after { color: var(--c-primary); }

.cuisine-nav__logo { text-decoration: none; flex-shrink: 0; }
.cuisine-nav__logo-img { height: 48px; width: auto; object-fit: contain; }
.cuisine-nav__logo-text {
  font-family: var(--c-font); font-size: 1.5rem; font-weight: 600; color: white; transition: color 0.3s;
}
.cuisine-nav--scrolled .cuisine-nav__logo-text { color: var(--c-primary); }

.cuisine-nav__links { display: flex; gap: 32px; margin: 0 auto; }
@media (max-width: 900px) { .cuisine-nav__links { display: none; } }

.cuisine-nav__link {
  font-size: 0.75rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(255,255,255,0.9); text-decoration: none; position: relative; padding-bottom: 4px; transition: color 0.2s;
}
.cuisine-nav__link::after {
  content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: var(--c-gold, #C9A84C);
  transition: width 0.3s ease;
}
.cuisine-nav__link:hover { color: var(--c-gold, #C9A84C); }
.cuisine-nav__link:hover::after { width: 100%; }

.cuisine-nav__actions { display: flex; align-items: center; gap: 16px; margin-left: auto; }

.cuisine-nav__cart {
  width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
  color: white; text-decoration: none; transition: color 0.2s;
}
.cuisine-nav__cart svg { width: 22px; height: 22px; }
.cuisine-nav--scrolled .cuisine-nav__cart { color: var(--c-text); }
.cuisine-nav__cart:hover { color: var(--c-gold, #C9A84C); }

.cuisine-nav__burger {
  display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px;
}
.cuisine-nav__burger span { display: block; width: 24px; height: 1.5px; background: white; transition: all 0.3s; }
.cuisine-nav--scrolled .cuisine-nav__burger span { background: var(--c-text); }
@media (max-width: 900px) { .cuisine-nav__burger { display: flex; } }

.cuisine-nav__mobile {
  display: none; flex-direction: column; background: white; padding: 16px 0;
  max-height: 0; overflow: hidden; transition: max-height 0.4s ease;
}
.cuisine-nav__mobile.is-open { max-height: 400px; }
@media (max-width: 900px) { .cuisine-nav__mobile { display: flex; } }

.cuisine-nav__mobile-link {
  display: block; padding: 12px 24px; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--c-text); text-decoration: none; border-bottom: 1px solid #f0f0f0;
  transition: color 0.2s, padding-left 0.2s;
}
.cuisine-nav__mobile-link:hover { color: var(--c-primary); padding-left: 32px; }
</style>
