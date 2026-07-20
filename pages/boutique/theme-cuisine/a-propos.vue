<template>
  <div class="theme-cuisine" :style="cssVars">
    <HeaderCuisine :shop="shop" :primaryColor="primaryColor" force-scrolled-style />

    <main class="cuisine-apropos-page">
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
            <div class="cuisine-apropos__img-deco"></div>
          </div>
        </div>

        <!-- Texte -->
        <div class="cuisine-apropos__text-col">
          <p class="cuisine-eyebrow">Notre histoire</p>
          <h1 class="cuisine-section-title cuisine-section-title--left">
            {{ shop?.name }}
          </h1>
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

          <NuxtLink :to="`/boutique/${shopSubdomain}/produits`" class="cuisine-btn cuisine-btn--gold mt-8 inline-flex">
            Découvrir notre menu
          </NuxtLink>
        </div>
      </div>

      <!-- Bandeau stats -->
      <section class="cuisine-stats">
        <div class="cuisine-stats__inner">
          <div class="cuisine-stats__item" v-for="stat in stats" :key="stat.label">
            <span class="cuisine-stats__number">{{ stat.value }}</span>
            <span class="cuisine-stats__label">{{ stat.label }}</span>
          </div>
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
import { computed } from 'vue'
import HeaderCuisine from '@/components/theme_cuisine/HeaderCuisine.vue'
import FooterCuisine from '@/components/theme_cuisine/FooterCuisine.vue'

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
// CONTENU "À PROPOS" (customizations vendeur)
// ============================
const aboutText = computed(() => props.customizations?.about?.text || '')
const aboutImage = computed(() => {
  const img = props.customizations?.about?.image
  return img ? getImageUrl(img) : 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80'
})
const aboutParagraphs = computed(() =>
  aboutText.value.split('\n').filter((p: string) => p.trim())
)

const stats = [
  { value: '10+', label: "Années d'expérience" },
  { value: '50+', label: 'Plats au menu' },
  { value: '1k+', label: 'Clients satisfaits' },
  { value: '100%', label: 'Ingrédients frais' },
]

const values = [
  { icon: '🌿', label: 'Fraîcheur',    desc: 'Ingrédients sélectionnés chaque matin' },
  { icon: '👨‍🍳', label: 'Savoir-faire', desc: 'Recettes transmises de génération en génération' },
  { icon: '❤️', label: 'Passion',      desc: 'Chaque plat préparé avec amour' },
]
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
  --c-dark:      #111111;
  --c-gold:      #C9A84C;

  font-family: 'Jost', sans-serif;
  background-color: var(--c-bg);
  color: var(--c-text);
  min-height: 100vh;
}

.cuisine-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.cuisine-apropos-page { padding-top: 140px; }

.cuisine-eyebrow {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--c-gold); margin-bottom: 12px;
}
.cuisine-section-title { font-family: var(--c-font); font-size: clamp(2rem, 4vw, 3rem); font-weight: 600; margin-bottom: 16px; }
.cuisine-section-title--left { text-align: left; }

.cuisine-divider { display: flex; align-items: center; gap: 12px; }
.cuisine-divider::before, .cuisine-divider::after { content: ''; width: 60px; height: 1px; background: var(--c-gold); }
.cuisine-divider--left::before { display: none; }
.cuisine-divider__ornament { color: var(--c-gold); font-size: 0.65rem; }

.cuisine-apropos__inner {
  display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; padding-bottom: 100px;
}
@media (max-width: 900px) { .cuisine-apropos__inner { grid-template-columns: 1fr; gap: 48px; } }

.cuisine-apropos__img-col { position: relative; }
.cuisine-apropos__img-frame { position: relative; aspect-ratio: 4/5; max-width: 460px; }
.cuisine-apropos__img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; user-select: none; -webkit-user-drag: none; }
.cuisine-apropos__img-placeholder {
  width: 100%; height: 100%; background: var(--c-cream); display: flex; align-items: center; justify-content: center; font-size: 4rem;
}
.cuisine-apropos__img-deco {
  position: absolute; bottom: -20px; right: -20px; width: 60%; height: 60%; border: 2px solid var(--c-gold); z-index: -1; pointer-events: none;
}

.cuisine-apropos__content { font-size: 0.95rem; line-height: 1.9; color: #666; margin-top: 20px; }
.cuisine-apropos__content p + p { margin-top: 12px; }

.cuisine-apropos__values { margin-top: 32px; display: flex; flex-direction: column; gap: 16px; }
.cuisine-apropos__value { display: flex; align-items: flex-start; gap: 16px; }
.cuisine-apropos__value-icon { font-size: 1.3rem; margin-top: 2px; flex-shrink: 0; }
.cuisine-apropos__value strong { display: block; font-weight: 600; font-size: 0.9rem; color: var(--c-text); margin-bottom: 2px; }
.cuisine-apropos__value p { font-size: 0.8rem; color: #888; margin: 0; }

.cuisine-btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px;
  font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
  text-decoration: none; cursor: pointer; transition: all 0.3s ease; border: none;
}
.cuisine-btn--gold { background: var(--c-gold); color: white; }
.cuisine-btn--gold:hover { background: color-mix(in srgb, var(--c-gold) 85%, black); transform: translateY(-2px); }
.mt-8 { margin-top: 2rem; }

.cuisine-stats { background: var(--c-dark); }
.cuisine-stats__inner {
  max-width: 1200px; margin: 0 auto; padding: 40px 24px; display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px; background: rgba(255,255,255,0.08);
}
@media (max-width: 700px) { .cuisine-stats__inner { grid-template-columns: repeat(2, 1fr); } }
.cuisine-stats__item {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  padding: 32px 16px; background: var(--c-dark); text-align: center;
}
.cuisine-stats__number { font-family: var(--c-font); font-size: 2.2rem; font-weight: 600; color: var(--c-gold); }
.cuisine-stats__label { font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
</style>
