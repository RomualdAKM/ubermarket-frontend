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
      <!--<span class="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
        ⚡ Le plan le plus populaire
      </span>-->
      <h1 class="text-4xl font-bold mb-4">
        Tout ce qu'il vous faut pour vendre en ligne — à partir de 5,00€/mois
      </h1>
      <p class="text-gray-600 text-lg mb-6">
        3 boutiques, 50 produits, 1 collaborateur.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink to="/inscription-vendeur?plan=gratuit&ref=lp-gratuit"
          class="inline-block py-3 px-10 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-lg">
          Commencer avec Gratuit
        </NuxtLink>
        <NuxtLink to="/inscription-vendeur?ref=lp-gratuit-free"
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
      <h2 class="text-2xl font-bold text-center mb-8">Pourquoi choisir Gratuit ?</h2>
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-primary text-white">
            <tr>
              <th class="px-5 py-3 text-left">Fonctionnalité</th>
              <th class="px-5 py-3 text-center">Gratuit</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="row in comparison" :key="row.feature" class="hover:bg-gray-50">
              <td class="px-5 py-3 text-gray-700">{{ row.feature }}</td>
              <td class="px-5 py-3 text-center text-gray-400">{{ row.free }}</td>
              <td class="px-5 py-3 text-center font-semibold text-primary">{{ row.gratuit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- CTA final -->
    <section class="text-center py-16 px-6 bg-primary/5">
      <h2 class="text-3xl font-bold mb-3">Prêt à passer au niveau supérieur ?</h2>
      <p class="text-gray-500 mb-8">5,00€/mois. Zéro commission. Annulable à tout moment.</p>
      <NuxtLink to="/inscription-vendeur?plan=gratuit&ref=lp-gratuit-bottom"
        class="inline-block py-3 px-12 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-lg">
        Choisir le plan Gratuit
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
  title: 'Plan Gratuit UberMarket — 03 boutiques, 50 produits',
  meta: [
    { name: 'description', content: 'Plan Gratuit UberMarket à 5,00€/mois. 03 boutiques, 50 produits, 15% de commission sur vos ventes.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Plan Gratuit UberMarket — Vendez sans limites' },
    { property: 'og:description', content: '10 boutiques, 1000 produits, livraison et marketing inclus. À partir de 5,00€/mois.' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.uber-market.com/lp/gratuit' }]
})

const features = [
  { title: '03 boutiques', desc: 'Gérez jusqu\'à 3 boutiques distinctes depuis un seul compte.', color: 'bg-indigo-500' },
  { title: '50 produits', desc: 'Publiez jusqu\'à 200 produits physiques ou numériques.', color: 'bg-green-500' },
  { title: '15% de commission', desc: 'Gardez 85% de vos revenus. Aucune commission supplémentaire sur vos ventes.', color: 'bg-primary' },
  { title: 'Collaborateurs', desc: 'Invitez jusqu\'à 1 membres d\'équipe avec des rôles définis.', color: 'bg-teal-500' },
]

const comparison = [
  { feature: 'Boutiques',          free: '1',    gratuit: '03' },
  { feature: 'Produits',           free: '50',   gratuit: '50' },
  { feature: 'Commission',         free: '0%',   gratuit: '15%' },
  { feature: 'Domaine perso',      free: '✗',    gratuit: '✘' },
  { feature: 'Module livraison',   free: '✗',    gratuit: '✘' },
  { feature: 'Codes promo',        free: '✗',    gratuit: '✘' },
  { feature: 'Facebook Pixel',     free: '✗',    gratuit: '✘' },
  { feature: 'Collaborateurs',     free: '0',    gratuit: '1' },
  { feature: 'Support',            free: 'Gratuit', gratuit: 'Sur tchat' },
]
</script>