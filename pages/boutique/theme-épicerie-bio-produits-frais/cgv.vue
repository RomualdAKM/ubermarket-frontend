<template>
  <!--
    pages/boutique/theme-organic/cgv.vue
    ─────────────────────────────────────
    Page CGV (Conditions Générales de Vente) du thème Organic.

    Le contenu est entièrement éditable dans :
      Dashboard vendeur → Personnalisation → onglet "CGV"
      → customizations.cgv.content (HTML ou texte brut)

    Structure standard (si non personnalisé) :
      Art. 1 Objet / Art. 2 Prix / Art. 3 Commandes /
      Art. 4 Paiement / Art. 5 Livraison / Art. 6 Retours /
      Art. 7 Garanties / Art. 8 Droit applicable
  -->
  <div class="min-h-screen bg-gray-50" :style="{ fontFamily }">
    <HeaderOrganic :shop="shop" :primaryColor="primaryColor" :cartCount="0" />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

      <!-- En-tête -->
      <div class="mb-10">
        <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <NuxtLink :to="`/boutique/${shop?.subdomain}`" class="hover:text-gray-600">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-gray-700">CGV</span>
        </nav>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {{ cgvTitle || "Conditions Générales de Vente" }}
        </h1>
        <p class="text-sm text-gray-500">Dernière mise à jour : {{ lastUpdated }}</p>
        <div class="mt-4 h-1 w-16 rounded-full" :style="{ backgroundColor: primaryColor }"></div>
      </div>

      <!-- Contenu CGV -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

        <!-- Contenu personnalisé par le vendeur -->
        <div v-if="cgvContent"
          class="prose prose-sm md:prose max-w-none text-gray-700 leading-relaxed"
          v-html="cgvContent">
        </div>

        <!-- Contenu générique par défaut -->
        <div v-else class="prose prose-sm md:prose max-w-none text-gray-700 leading-relaxed">
          <h2>Article 1 — Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente s'appliquent à toutes les ventes conclues sur
            la boutique <strong>{{ shop?.name }}</strong>. Toute commande implique l'acceptation de
            ces conditions.
          </p>

          <h2>Article 2 — Prix</h2>
          <p>
            Les prix affichés sont en <strong>{{ shop?.currency || 'XOF' }}</strong> et s'entendent
            toutes taxes comprises. <strong>{{ shop?.name }}</strong> se réserve le droit de modifier
            ses prix à tout moment, étant entendu que le prix applicable à la commande sera celui en
            vigueur au moment de la validation.
          </p>

          <h2>Article 3 — Commandes</h2>
          <p>
            La commande n'est définitive qu'après confirmation par email. Nous nous réservons le droit
            d'annuler toute commande en cas de rupture de stock, avec remboursement intégral.
          </p>

          <h2>Article 4 — Paiement</h2>
          <p>
            Le paiement est exigible à la commande. Les moyens de paiement acceptés sont précisés lors
            du processus de commande. Tout paiement non reçu dans les délais entraîne l'annulation
            automatique de la commande.
          </p>

          <h2>Article 5 — Livraison</h2>
          <p>
            Les délais de livraison sont indiqués à titre indicatif sur la
            <NuxtLink :to="`/boutique/${shop?.subdomain}/livraison`" class="text-green-700 hover:underline">
              page livraison
            </NuxtLink>.
            En cas de retard, le client sera informé par email.
          </p>

          <h2>Article 6 — Retours & Remboursements</h2>
          <p>
            Le client dispose d'un délai de 7 jours à compter de la réception pour retourner un article
            défectueux ou non conforme. Les articles retournés doivent être dans leur état d'origine.
          </p>

          <h2>Article 7 — Droit applicable</h2>
          <p>
            Ces CGV sont soumises au droit en vigueur dans le pays d'établissement de
            <strong>{{ shop?.name }}</strong>.
          </p>
        </div>
      </div>

      <!-- Liens légaux -->
      <div class="mt-8 flex flex-wrap gap-3 justify-center">
        <NuxtLink :to="`/boutique/${shop?.subdomain}/cgu`"
          class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:border-gray-400 transition-colors">
          ← Voir les CGU
        </NuxtLink>
        <NuxtLink :to="`/boutique/${shop?.subdomain}/livraison`"
          class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:border-gray-400 transition-colors">
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

    const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#2d9b5c')
    const fontFamily   = computed(() => props.customizations?.home?.fonts?.family   || 'sans-serif')
    const footerText   = computed(() => props.customizations?.footer?.text || `© ${new Date().getFullYear()} ${props.shop?.name}`)
    const socialLinks  = computed(() => props.customizations?.footer?.socialLinks || {})

    // ── Contenu CGV depuis customizations.cgv (édité dans le dashboard) ──
    const cgvTitle   = computed(() => props.customizations?.cgv?.title   || '')
    const cgvContent = computed(() => props.customizations?.cgv?.content || '')
    const lastUpdated = computed(() => {
    const d = props.customizations?.cgv?.updated_at
    return d
        ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    })
</script>

<style scoped>
    .prose h2 { font-size: 1.125rem; font-weight: 700; color: #111827; margin-top: 2rem; margin-bottom: 0.75rem; }
    .prose p  { margin-bottom: 1rem; line-height: 1.75; }
    .prose strong { color: #111827; }
</style>
