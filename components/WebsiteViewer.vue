<template>
  <WebsitePagePublic
    :shop="shop"
    :pages="pages"
    :current-page="currentPageData"
    :current-slug="currentSlug"
    :show-navigation="true"
    :show-footer="true"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  shop: any
  pages: any[]
}>(), {
  pages: () => []
})

const route = useRoute()

// Slug de la page courante depuis l'URL (ex: /site/maison-elan/contact → 'contact')
const currentSlug = computed(() => {
  const segments = route.path.split('/')
  const last = segments[segments.length - 1]
  const subdomain = props.shop?.subdomain || props.shop?.slug
  return last !== subdomain ? last : undefined
})

// Page courante selon le slug ou la homepage
const currentPageData = computed(() => {
  if (!props.pages.length) return null
  if (currentSlug.value) {
    return props.pages.find(p => p.slug === currentSlug.value) || null
  }
  return props.pages.find(p => p.is_homepage) || props.pages[0] || null
})
</script>