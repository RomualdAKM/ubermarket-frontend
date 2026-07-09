<template>
  <!--
    pages/boutique/theme-organic/cgu.vue
    ─────────────────────────────────────
    Page CGU (Conditions Générales d'Utilisation) du thème Organic.

    Le contenu est entièrement éditable dans :
      Dashboard vendeur → Personnalisation → onglet "CGU"
      → customizations.cgu.content (HTML ou texte brut)

    Si aucun contenu n'est configuré, un texte générique est affiché
    avec le nom de la boutique injecté automatiquement.
  -->
  <div class="min-h-screen bg-gray-50" :style="{ fontFamily }">
    <HeaderOrganic :shop="shop" :primaryColor="primaryColor" :cartCount="0" />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

      <!-- En-tête de la page -->
      <div class="mb-10">
        <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <NuxtLink :to="`/boutique/${shop?.subdomain}`" class="hover:text-gray-600 transition-colors">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-gray-700">CGU</span>
        </nav>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {{ cguTitle || "Conditions Générales d'Utilisation" }}
        </h1>
        <p class="text-sm text-gray-500">
          Dernière mise à jour : {{ lastUpdated }}
        </p>
        <div class="mt-4 h-1 w-16 rounded-full" :style="{ backgroundColor: primaryColor }"></div>
      </div>

      <!-- ── Contenu CGU ────────────────────────────────────────
           Priorité :
           1. customizations.cgu.content (configuré par le vendeur)
           2. Contenu générique avec le nom de la boutique
      ────────────────────────────────────────────────────────── -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

        <!-- Contenu personnalisé (HTML depuis l'éditeur riche) -->
        <div v-if="cguContent"
          class="prose prose-sm md:prose max-w-none text-gray-700 leading-relaxed"
          v-html="cguContent">
        </div>

        <!-- Contenu générique si aucun contenu configuré -->
        <div v-else class="prose prose-sm md:prose max-w-none text-gray-700 leading-relaxed">
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
            de la boutique en ligne <strong>{{ shop?.name }}</strong>, accessible via la plateforme UberMarket.
          </p>

          <h2>2. Accès à la boutique</h2>
          <p>
            La boutique <strong>{{ shop?.name }}</strong> est accessible à tout utilisateur disposant
            d'un accès Internet. Tous les frais relatifs à l'accès au service, que ce soient les frais
            matériels, logiciels ou d'accès à Internet, sont à la charge exclusive de l'utilisateur.
          </p>

          <h2>3. Propriété intellectuelle</h2>
          <p>
            Tout le contenu présent sur cette boutique (images, textes, logos, descriptions de produits)
            est la propriété de <strong>{{ shop?.name }}</strong> et est protégé par les lois relatives
            à la propriété intellectuelle. Toute reproduction est interdite sans autorisation préalable.
          </p>

          <h2>4. Responsabilité</h2>
          <p>
            <strong>{{ shop?.name }}</strong> ne saurait être tenu responsable des dommages directs ou
            indirects résultant de l'utilisation de cette boutique ou de l'impossibilité d'y accéder.
          </p>

          <h2>5. Protection des données</h2>
          <p>
            Les données personnelles collectées (nom, email, adresse) sont utilisées uniquement pour
            le traitement des commandes et ne sont pas cédées à des tiers.
          </p>

          <h2>6. Droit applicable</h2>
          <p>
            Les présentes CGU sont soumises au droit en vigueur dans le pays d'établissement de
            <strong>{{ shop?.name }}</strong>. Tout litige sera soumis aux tribunaux compétents.
          </p>

          <h2>7. Contact</h2>
          <p>
            Pour toute question concernant ces CGU, vous pouvez nous contacter via la
            <NuxtLink :to="`/boutique/${shop?.subdomain}/contact`" class="text-green-700 hover:underline">
              page de contact
            </NuxtLink>.
          </p>
        </div>
      </div>

      <!-- Navigation entre les pages légales -->
      <div class="mt-8 flex flex-wrap gap-3 justify-center">
        <NuxtLink :to="`/boutique/${shop?.subdomain}/cgv`"
          class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600
                 hover:border-gray-400 hover:text-gray-900 transition-colors">
          Voir les CGV →
        </NuxtLink>
        <NuxtLink :to="`/boutique/${shop?.subdomain}/livraison`"
          class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600
                 hover:border-gray-400 hover:text-gray-900 transition-colors">
          Livraison & retours →
        </NuxtLink>
      </div>
    </main>

    <FooterOrganic :shop="shop" :primaryColor="primaryColor"
      :footerText="footerText" :socialLinks="socialLinks"/>
  </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import HeaderOrganic from '@/components/theme_organic/HeaderOrganic.vue'
    import FooterOrganic from '@/components/theme_organic/FooterOrganic.vue'

    definePageMeta({ layout: false })

    interface Props { shop?: any; customizations?: any }
    const props = defineProps<Props>()

    // ── Couleurs / polices ────────────────────────────────────────────
    const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#2d9b5c')
    const fontFamily   = computed(() => props.customizations?.home?.fonts?.family   || 'sans-serif')
    const footerText   = computed(() => props.customizations?.footer?.text || `© ${new Date().getFullYear()} ${props.shop?.name}`)
    const socialLinks  = computed(() => props.customizations?.footer?.socialLinks || {})

    // ── Contenu CGU depuis customizations.cgu ────────────────────────
    // Le vendeur peut personnaliser ce contenu via le dashboard →
    // Personnalisation → onglet "CGU"
    const cguTitle   = computed(() => props.customizations?.cgu?.title   || '')
    const cguContent = computed(() => props.customizations?.cgu?.content || '')
    const lastUpdated = computed(() => {
    const d = props.customizations?.cgu?.updated_at
    return d
        ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    })
</script>

<style scoped>
    /* ── Styles prose pour le contenu HTML riche ── */
    .prose h2 { font-size: 1.125rem; font-weight: 700; color: #111827; margin-top: 2rem; margin-bottom: 0.75rem; }
    .prose p  { margin-bottom: 1rem; line-height: 1.75; }
    .prose strong { color: #111827; }
</style>
