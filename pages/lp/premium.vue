<template>
  <div class="min-h-screen bg-primary/5">

    <!-- Header minimal -->
    <header class="py-4 px-6 flex justify-center border-b border-gray-100 bg-white">
      <NuxtLink to="/">
        <img alt="UberMarket" src="/uber-market.png" class="h-12" loading="eager" />
      </NuxtLink>
    </header>

    <!-- Hero -->
    <section class="text-center px-6 py-20 max-w-2xl mx-auto">
      <span class="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
        ⚡ Le plan le plus populaire
      </span>
      <h1 class="text-4xl font-bold mb-4">
        Tout ce qu'il vous faut pour vendre en ligne — à partir de 24,99€/mois
      </h1>
      <p class="text-gray-600 text-lg mb-6">
        3 boutiques, 1000 produits, livraison intégrée, codes promo, marketing et domaine personnalisé.
        Zéro commission sur vos ventes.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink to="/inscription-vendeur?plan=premium&ref=lp-premium"
          class="inline-block py-3 px-10 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-lg">
          Commencer avec Premium
        </NuxtLink>
        <NuxtLink to="/inscription-vendeur?ref=lp-premium-free"
          class="inline-block py-3 px-8 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors">
          Essayer gratuitement d'abord
        </NuxtLink>
      </div>
      <p class="text-sm text-gray-400 mt-3">Sans engagement. Annulable à tout moment.</p>
    </section>

    <!-- Ce qui est inclus -->
    <section class="max-w-4xl mx-auto px-6 py-10">
      <h2 class="text-2xl font-bold text-center mb-10">Tout ce qui est inclus dans le plan Sremium</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="feature in features" :key="feature.title"
          class="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="feature.color">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-gray-900">{{ feature.title }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparaison rapide -->
    <section class="max-w-3xl mx-auto px-6 py-10">
      <h2 class="text-2xl font-bold text-center mb-8">Pourquoi choisir Premium plutôt que Gratuit ?</h2>
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-primary text-white">
            <tr>
              <th class="px-5 py-3 text-left">Fonctionnalité</th>
              <th class="px-5 py-3 text-center">Gratuit</th>
              <th class="px-5 py-3 text-center">Standard</th>
              <th class="px-5 py-3 text-center">Premium</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="row in comparison" :key="row.feature" class="hover:bg-gray-50">
              <td class="px-5 py-3 text-gray-700">{{ row.feature }}</td>
              <td class="px-5 py-3 text-center text-gray-400">{{ row.free }}</td>
              <td class="px-5 py-3 text-center font-semibold text-primary">{{ row.premium }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- CTA final -->
    <section class="text-center py-16 px-6 bg-primary/5">
      <h2 class="text-3xl font-bold mb-3">Prêt à passer au niveau supérieur ?</h2>
      <p class="text-gray-500 mb-8">24,99€/mois. Zéro commission. Annulable à tout moment.</p>
      <NuxtLink to="/inscription-vendeur?plan=premium&ref=lp-premium-bottom"
        class="inline-block py-3 px-12 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-lg">
        Choisir le plan Premium
      </NuxtLink>
    </section>

    <!-- Footer minimal -->
    <footer class="text-center py-6 text-sm text-gray-400 border-t border-gray-100">
      <p>
        © 2025 UberMarket ·
        <NuxtLink to="/conditions" class="hover:text-gray-600">CGU</NuxtLink> ·
        <a href="mailto:contact@uber-market.com" class="hover:text-gray-600">Contact</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Plan Premium UberMarket — 10 boutiques, 1000 produits, domaine perso',
  meta: [
    { name: 'description', content: 'Plan Premium UberMarket à 24,99€/mois. 10 boutiques, 1000 produits, livraison, codes promo, domaine personnalisé. Zéro commission sur vos ventes.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Plan Premium UberMarket — Vendez sans limites' },
    { property: 'og:description', content: '10 boutiques, 1000 produits, livraison et marketing inclus. À partir de 24,99€/mois.' },
  ],
  link: [{ rel: 'canonical', href: 'https://uber-market.com/lp/premium' }]
})

const features = [
  { title: '10 boutiques', desc: 'Gérez jusqu\'à 3 boutiques distinctes depuis un seul compte.', color: 'bg-indigo-500' },
  { title: '1000 produits', desc: 'Publiez jusqu\'à 200 produits physiques ou numériques.', color: 'bg-green-500' },
  { title: '0% de commission', desc: 'Gardez 100% de vos revenus. Aucune commission sur vos ventes.', color: 'bg-primary' },
  { title: 'Domaine personnalisé', desc: 'Connectez votre propre nom de domaine (maboutique.com).', color: 'bg-purple-500' },
  { title: 'Module livraison', desc: 'Gérez vos zones, livreurs et tarifs directement depuis votre dashboard.', color: 'bg-amber-500' },
  { title: 'Codes promo', desc: 'Créez des codes de réduction avec durée et limite d\'utilisation.', color: 'bg-rose-500' },
  { title: 'Marketing & Tracking', desc: 'Facebook Pixel, Google Analytics, TikTok Pixel intégrés.', color: 'bg-blue-500' },
  { title: 'Collaborateurs', desc: 'Invitez jusqu\'à 5 membres d\'équipe avec des rôles définis.', color: 'bg-teal-500' },
]

const comparison = [
  { feature: 'Boutiques',          free: '1',    premium: '10' },
  { feature: 'Produits',           free: '50',   premium: '1000' },
  { feature: 'Commission',         free: '0%',   premium: '0%' },
  { feature: 'Domaine perso',      free: '✗',    premium: '✓' },
  { feature: 'Module livraison',   free: '✗',    premium: '✓' },
  { feature: 'Codes promo',        free: '✗',    premium: '✓' },
  { feature: 'Facebook Pixel',     free: '✗',    premium: '✓' },
  { feature: 'Collaborateurs',     free: '0',    premium: '5' },
  { feature: 'Support',            free: 'Premium', premium: 'Prioritaire' },
]
</script>