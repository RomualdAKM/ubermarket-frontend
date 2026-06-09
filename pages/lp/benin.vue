<!-- pages/lp/benin.vue -->
<template>
  <div class="min-h-screen bg-primary/5">

    <!-- Header minimal (pas de menu distrayant) -->
    <header class="py-4 px-6 flex justify-center">
      <img alt="UberMarket Bénin" src="/uber-market.png" class="h-12" />
    </header>

    <!-- Hero ciblé Bénin -->
    <section class="text-center px-6 py-20 max-w-2xl mx-auto">
      <span class="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
        🇧🇯 Disponible au Bénin
      </span>
      <h1 class="text-4xl font-bold font-urbanist mb-4">
        Lancez votre boutique en ligne au Bénin en 1m30s
      </h1>
      <p class="text-gray-600 text-lg mb-8">
        Acceptez Mobile Money, Moov monney, celtis cash et cartes bancaires. Gérez vos livraisons à Cotonou, Porto-Novo, Parakou et partout au Bénin.
      </p>
      <NuxtLink to="/inscription-vendeur?ref=lp-benin&utm_source=facebook&utm_medium=paid&utm_campaign=benin-2025"
        class="inline-block py-3 px-10 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-lg">
        Commencer gratuitement — 0 FCFA
      </NuxtLink>
      <p class="text-sm text-gray-400 mt-3">Sans carte bancaire requise. Annulable à tout moment.</p>
    </section>

    <!-- Preuves sociales locales -->
    <section class="max-w-3xl mx-auto px-6 py-10">
      <p class="text-center text-sm font-medium text-gray-500 mb-8 uppercase tracking-wide">
        Des vendeurs béninois nous font confiance
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl p-5 shadow-sm">
          <p class="text-gray-600 text-sm">"J'ai lancé ma boutique de pagnes en 2 jours. Orange Money marche parfaitement."</p>
          <p class="font-semibold text-sm mt-3">Adjoua M. — Cotonou</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm">
          <p class="text-gray-600 text-sm">"Je vends mes formations en ligne. Les paiements MTN arrivent directement."</p>
          <p class="font-semibold text-sm mt-3">Koffi D. — Porto-Novo</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm">
          <p class="text-gray-600 text-sm">"Le module livraison m'a permis de couvrir tout Cotonou avec mes livreurs."</p>
          <p class="font-semibold text-sm mt-3">Aicha T. — Parakou</p>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="text-center py-16 px-6">
      <h2 class="text-2xl font-bold mb-4">Prêt à vendre en ligne au Bénin ?</h2>
      <NuxtLink to="/inscription-vendeur?ref=lp-benin"
        class="inline-block py-3 px-10 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity">
        Créer ma boutique — C'est gratuit
      </NuxtLink>
    </section>

    <!-- Footer minimal -->
    <footer class="text-center py-6 text-sm text-gray-400">
      <p>© 2025 UberMarket · <NuxtLink to="/conditions" class="hover:text-gray-600">CGU</NuxtLink> · <a href="mailto:contact@uber-market.com" class="hover:text-gray-600">Contact</a></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// ✅ Pas de layout pour garder la page épurée (pas de nav distrayante)
definePageMeta({ layout: false })

// ✅ SEO ultra-ciblé pour cette landing
useHead({
  title: 'Créer une boutique en ligne au Bénin — UberMarket',
  meta: [
    { name: 'description', content: 'Créez votre boutique en ligne au Bénin en 1m30s. Paiements Orange Money, MTN, Wave. Livraison à Cotonou, Porto-Novo. Commencez gratuitement.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Boutique en ligne au Bénin — UberMarket' },
    { property: 'og:description', content: 'Vendez en ligne au Bénin avec Orange Money et MTN. Gratuit pour démarrer.' },
    { name: 'geo.region', content: 'BJ' },
    { name: 'geo.placename', content: 'Cotonou, Bénin' },
  ],
  link: [
    { rel: 'canonical', href: 'https://uber-market.com/lp/benin' }
  ]
})

// ✅ Tracker d'où vient le visiteur pour analyser les campagnes
const route = useRoute()
onMounted(() => {
  if (process.client) {
    // Stocker la source de la campagne
    sessionStorage.setItem('utm_source', route.query.utm_source as string || 'lp-benin')
  }
})
</script>