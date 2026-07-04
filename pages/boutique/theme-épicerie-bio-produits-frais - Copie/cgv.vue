<template>
  <div class="min-h-screen" :style="{ backgroundColor: backgroundColor }">
    <HeaderEpure :shop="shop" :primaryColor="primaryColor" />
    
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-4 py-16">
      <h1 class="text-4xl font-bold mb-8 text-center section-title">Conditions Générales de Vente</h1>
      
      <div class="bg-white rounded-lg p-4">
        <div class="prose max-w-none" :style="{ color: textColor }">
          <p class="text-lg leading-relaxed whitespace-pre-wrap">{{ salesTermsText }}</p>
        </div>
      </div>
    </main>
    
    <FooterEpure 
      :backgroundColor="backgroundColor" 
      :primaryColor="primaryColor"
      :footerText="footerText"
      :socialLinks="footerSocialLinks"
    />
  </div>
</template>

<script setup lang="ts">
import FooterEpure from '@/components/theme_epure/FooterEpure.vue'
import HeaderEpure from '@/components/theme_epure/HeaderEpure.vue'

definePageMeta({
  layout: false
})

interface Props {
  shop?: any
  customizations?: any
}

const props = defineProps<Props>()

// Couleurs personnalisées
const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#e56a19')
const backgroundColor = computed(() => props.customizations?.home?.colors?.background || '#ffffff')
const textColor = computed(() => props.customizations?.home?.colors?.text || '#000000')
const fontFamily = computed(() => props.customizations?.home?.fonts?.family || 'sans-serif')

// Contenu CGV
const salesTermsText = computed(() => {
  return props.customizations?.sales_terms?.text || 'Conditions générales de vente de la boutique. Veuillez lire attentivement ces conditions avant d\'effectuer un achat.'
})

// Footer
const shopName = computed(() => props.shop?.name || 'Boutique')
const footerText = computed(() => {
  if (props.customizations?.footer?.text) {
    return props.customizations.footer.text
  }
  return `© ${new Date().getFullYear()} ${shopName.value}. Tous droits réservés.`
})

const footerSocialLinks = computed(() => {
  return props.customizations?.footer?.socialLinks || {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  }
})
</script>

<style scoped>
.section-title {
  font-family: v-bind(fontFamily);
  color: v-bind(textColor);
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -12px;
  width: 60px;
  height: 3px;
  background-color: v-bind(primaryColor);
}
</style>
