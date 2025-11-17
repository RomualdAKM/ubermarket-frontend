<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { getSubdomain } = useSubdomainDetection()
const route = useRoute()
const router = useRouter()

// Détecter le sous-domaine et rediriger si nécessaire
onMounted(() => {
  const subdomain = getSubdomain()
  
  if (subdomain) {
    // On est sur un sous-domaine de boutique
    // Vérifier qu'on n'est pas déjà sur la page boutique
    if (!route.path.startsWith('/boutique/')) {
      // Rediriger vers la page de la boutique
      router.push(`/boutique/${subdomain}`)
    }
  }
})
</script>