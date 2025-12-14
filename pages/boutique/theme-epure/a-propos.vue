<template>
  <div class="min-h-screen" :style="{ backgroundColor: backgroundColor }">
    <HeaderEpure :shop="shop" :primaryColor="primaryColor" />
    
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-4 py-16">
      <h1 class="text-4xl font-bold max-w-4xl mx-auto px-4 sm:px-6 lg:px-4 py-2 text-center section-title">À propos</h1>
      
      <div class="bg-white rounded-lg p-4">
        <div v-if="aboutImage" class="mb-8">
          <img :src="aboutImage" alt="À propos" class="w-full h-64 object-cover rounded-lg">
        </div>
        
        <div class="prose max-w-none" :style="{ color: textColor }">
          <p class="text-lg leading-relaxed whitespace-pre-wrap">{{ aboutText }}</p>
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

// Debug: afficher les props
console.log('   Props a-propos:', props)
console.log('  - shop:', props.shop)
console.log('  - customizations:', props.customizations)
console.log('  - customizations.about:', props.customizations?.about)

// Couleurs personnalisées
const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#e56a19')
const backgroundColor = computed(() => props.customizations?.home?.colors?.background || '#ffffff')
const textColor = computed(() => props.customizations?.home?.colors?.text || '#000000')
const fontFamily = computed(() => props.customizations?.home?.fonts?.family || 'sans-serif')

// Contenu À propos
const aboutText = computed(() => {
  return props.customizations?.about?.text || 'Bienvenue dans notre boutique. Nous sommes passionnés par ce que nous faisons et nous nous engageons à vous offrir les meilleurs produits et services.'
})

const aboutImage = computed(() => {
  if (props.customizations?.about?.image) {
    const config = useRuntimeConfig()
    const backendUrl = config.public.apiBase.replace('/api', '')
    return `${backendUrl}/storage/${props.customizations.about.image}`
  }
  return null
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
  bottom: -5px;
  width: 60px;
  height: 3px;
  background-color: v-bind(primaryColor);
}
</style>
