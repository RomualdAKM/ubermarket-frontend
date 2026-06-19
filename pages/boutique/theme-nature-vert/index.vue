<template>
  <!-- Navigation -->
  <GreenNavbar />

  <main>

    <!-- Hero -->
    <HeroSection
      :shop="shop"
      :banner-title="bannerTitle"
      :banner-subtitle="bannerSubtitle"
      :hero-images="heroImages"
    />

    <!-- Services -->
    <ServicesSection />

    <!-- Produits vedettes -->
    <FeaturedProducts
      :products="featuredProducts"
      :shop="shop"
    />

    <!-- Catalogue -->
    <ProductsCatalog
      :products="filteredProducts"
      :categories="categories"
      :active-category="activeCategory"
    />

    <!-- A propos -->
    <AboutSection
      :shop="shop"
      :about-image="aboutImage"
      :about-text="aboutText"
    />

    <!-- Statistiques -->
    <StatsSection :stats="stats" />

    <!-- Témoignages -->
    <TestimonialsSection
      :items="temoignages"
    />

    <!-- CTA -->
    <CallToAction />

    <!-- CGU -->
    <TermsSection
      v-if="termsText"
      :content="termsText"
    />

  </main>

  <!-- Footer -->
  <FooterSection
    :shop="shop"
    :social-links="socialLinks"
    :footer-text="footerText"
  />
</template>

<script setup lang="ts">
    import { getCleanDescription } from '~/utils/string'
    import FooterEpure from '@/components/theme_epure/FooterEpure.vue'
    import HeaderEpure from '@/components/theme_epure/HeaderEpure.vue'
    definePageMeta({
    layout: false
    })

    import { ref, onMounted, onUnmounted, computed } from 'vue'

    // Props pour recevoir les données de la boutique et customizations
    interface Props {
    shop?: any
    customizations?: any
    }

    const props = defineProps<Props>()

    // Nom de la boutique (utilise les données de la prop ou une valeur par défaut)
    const shopName = computed(() => props.shop?.name || 'Notre Boutique')
    const shopDescription = computed(() => props.shop?.description || 'Découvrez nos produits')

    // Customizations avec valeurs par défaut
    const bannerTitle = computed(() => props.customizations?.home?.banner?.title || 'Collection Été 2023')
    const bannerSubtitle = computed(() => props.customizations?.home?.banner?.subtitle || 'Découvrez nos nouvelles pièces exclusives')
    const bannerImages = computed(() => {
    if (props.customizations?.home?.banner?.images && props.customizations.home.banner.images.length > 0) {
        const config = useRuntimeConfig()
        const backendUrl = config.public.apiBase.replace('/api', '')
        return props.customizations.home.banner.images.map((path: string) => `${backendUrl}/storage/${path}`)
    }
    return [
        'https://placehold.co/1200x550?text=Image+1',
        'https://placehold.co/1200x550?text=Image+2',
        'https://placehold.co/1200x550?text=Image+3'
    ]
    })

    // Couleurs personnalisées
    const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#e56a19')
    const secondaryColor = computed(() => props.customizations?.home?.colors?.secondary || '#5b6ac5')
    const backgroundColor = computed(() => props.customizations?.home?.colors?.background || '#ffffff')
    const textColor = computed(() => props.customizations?.home?.colors?.text || '#000000')

    // Polices personnalisées
    const fontFamily = computed(() => props.customizations?.home?.fonts?.family || 'sans-serif')
    const fontSize = computed(() => props.customizations?.home?.fonts?.size || 'medium')
    const fontWeight = computed(() => props.customizations?.home?.fonts?.weight || 'normal')

    // Footer (pied de page)
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

    // Produits de la boutique
    const featuredProducts = computed(() => {
    // Limiter à 4 produits
    return props.shop?.products?.slice(0, 4) || []
    })

    // Fonction pour formater le prix
    const formatPrice = (price: number) => {
    const currency = props.shop?.currency || 'XOF'
    return `${price.toLocaleString('fr-FR')} ${currency}`
    }

    // Fonction pour obtenir l'URL de l'image du produit
    const getProductImageUrl = (imagePath: string) => {
    const config = useRuntimeConfig()
    const backendUrl = config.public.apiBase.replace('/api', '')
    return `${backendUrl}/storage/${imagePath}`
    }

    const currentSlide = ref(0)
    const slides = computed(() => bannerImages.value.map((_, index) => ({ title: `Slide ${index + 1}`, subtitle: '' })))

    const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length
    }

    const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
    }

    const goToSlide = (index: number) => {
    currentSlide.value = index
    }

    let slideInterval: NodeJS.Timeout

    onMounted(() => {
    slideInterval = setInterval(() => {
        nextSlide()
    }, 5000)
    })

    onUnmounted(() => {
    if (slideInterval) clearInterval(slideInterval)
    })
</script>

<style scoped src="./theme.css">
.bg-primary {
  background-color: #e56a19;
}

.hover\:bg-secondary:hover {
  background-color: #5b6ac5;
}

.text-primary {
  color: #e56a19;
}

.hover\:text-secondary:hover {
  color: #5b6ac5;
}
</style>