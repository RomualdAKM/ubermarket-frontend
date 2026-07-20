<template>
  <div class="theme-cuisine" :style="cssVars">
    <HeaderCuisine :shop="shop" :primaryColor="primaryColor" force-scrolled-style />

    <main class="cuisine-legal-page">
      <div class="cuisine-container">
        <div class="cuisine-section-header">
          <p class="cuisine-eyebrow">Informations légales</p>
          <h1 class="cuisine-section-title">Conditions Générales d'Utilisation</h1>
          <div class="cuisine-divider"><span class="cuisine-divider__ornament">✦</span></div>
        </div>

        <div v-if="termsText" class="cuisine-legal__content">{{ termsText }}</div>
        <div v-else class="cuisine-legal__empty">
          <p>Les conditions générales d'utilisation de cette boutique n'ont pas encore été renseignées.</p>
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
import { computed } from 'vue'
import HeaderCuisine from '@/components/theme_cuisine/HeaderCuisine.vue'
import FooterCuisine from '@/components/theme_cuisine/FooterCuisine.vue'

interface Props {
  shop?: any
  customizations?: any
}
const props = defineProps<Props>()

definePageMeta({ layout: false })

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

const footerText = computed(() =>
  props.customizations?.footer?.text ||
  `© ${new Date().getFullYear()} ${props.shop?.name || 'Restaurant'}. Tous droits réservés.`
)
const socialLinks = computed(() => props.customizations?.footer?.socialLinks || {})

const termsText = computed(() => props.customizations?.terms?.text || '')
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

.theme-cuisine {
  --c-primary:   #8B1A1A;
  --c-secondary: #C9A84C;
  --c-bg:        #FAF7F2;
  --c-text:      #1C1C1C;
  --c-font:      'Cormorant Garamond', Georgia, serif;
  --c-gold:      #C9A84C;

  font-family: 'Jost', sans-serif;
  background-color: var(--c-bg);
  color: var(--c-text);
  min-height: 100vh;
}

.cuisine-container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
.cuisine-legal-page { padding-top: 140px; padding-bottom: 100px; }

.cuisine-eyebrow {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--c-gold); margin-bottom: 12px;
}
.cuisine-section-header { text-align: center; margin-bottom: 48px; }
.cuisine-section-title { font-family: var(--c-font); font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 600; margin-bottom: 16px; }
.cuisine-divider { display: flex; align-items: center; justify-content: center; gap: 12px; }
.cuisine-divider::before, .cuisine-divider::after { content: ''; width: 60px; height: 1px; background: var(--c-gold); }
.cuisine-divider__ornament { color: var(--c-gold); font-size: 0.65rem; }

.cuisine-legal__content {
  font-size: 0.9rem; line-height: 1.9; color: #555; white-space: pre-wrap; background: white; padding: 40px;
}
.cuisine-legal__empty {
  text-align: center; padding: 60px 20px; color: #999; background: white;
}
</style>
