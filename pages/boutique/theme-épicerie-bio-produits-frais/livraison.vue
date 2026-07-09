<template>
  <!--
    pages/boutique/theme-organic/livraison.vue
    ───────────────────────────────────────────
    Page "Livraison & Retours" du thème Organic. Page NOUVELLE.

    Contenu depuis customizations.livraison :
      - Modes de livraison (tableau)
      - Délais et tarifs
      - Politique de retours
      - FAQ livraison
    
    Si non configuré → contenu générique lisible affiché.
    Configurable via Dashboard → Personnalisation → onglet "Livraison".
  -->
  <div class="min-h-screen bg-gray-50" :style="{ fontFamily }">
    <HeaderOrganic :shop="shop" :primaryColor="primaryColor" :cartCount="0" />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

      <!-- En-tête -->
      <div class="mb-10">
        <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <NuxtLink :to="`/boutique/${shop?.subdomain}`" class="hover:text-gray-600">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-gray-700">Livraison & Retours</span>
        </nav>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {{ livraisonTitle || 'Livraison & Retours' }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ livraisonSubtitle || 'Toutes les informations sur nos modes de livraison et notre politique de retour.' }}
        </p>
        <div class="mt-4 h-1 w-16 rounded-full" :style="{ backgroundColor: primaryColor }"></div>
      </div>

      <!-- ── Badges de réassurance ── -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div v-for="badge in badges" :key="badge.title"
          class="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
          <span class="text-2xl block mb-2">{{ badge.icon }}</span>
          <p class="text-xs font-semibold text-gray-800">{{ badge.title }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ badge.desc }}</p>
        </div>
      </div>

      <!-- Contenu personnalisé par le vendeur (HTML depuis éditeur) -->
      <div v-if="livraisonContent"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12
               prose prose-sm md:prose max-w-none text-gray-700 leading-relaxed"
        v-html="livraisonContent">
      </div>

      <!-- ── Contenu générique si non configuré ── -->
      <div v-else class="space-y-6">

        <!-- Tableau des modes de livraison -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100" :style="{ backgroundColor: primaryColor + '10' }">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>🚚</span> Modes de livraison
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th class="px-6 py-3 text-left">Mode</th>
                  <th class="px-6 py-3 text-left">Délai estimé</th>
                  <th class="px-6 py-3 text-left">Tarif</th>
                  <th class="px-6 py-3 text-left">Zone</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="mode in deliveryModes" :key="mode.name"
                  class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900">
                    {{ mode.icon }} {{ mode.name }}
                  </td>
                  <td class="px-6 py-4 text-gray-600">{{ mode.delay }}</td>
                  <td class="px-6 py-4">
                    <span class="font-semibold" :style="{ color: primaryColor }">{{ mode.price }}</span>
                  </td>
                  <td class="px-6 py-4 text-gray-600">{{ mode.zone }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-3 bg-green-50 border-t border-green-100">
            <p class="text-xs text-green-700 font-medium">
              🎁 Livraison gratuite pour toute commande supérieure à
              <strong>{{ freeDeliveryThreshold }}</strong>
            </p>
          </div>
        </div>

        <!-- Politique de retours -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100" :style="{ backgroundColor: primaryColor + '10' }">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>↩️</span> Politique de retours
            </h2>
          </div>
          <div class="p-6 md:p-8 space-y-4 text-sm text-gray-600 leading-relaxed">
            <div v-for="step in returnSteps" :key="step.title"
              class="flex gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                :style="{ backgroundColor: primaryColor }">
                {{ step.num }}
              </div>
              <div>
                <p class="font-semibold text-gray-900 mb-1">{{ step.title }}</p>
                <p>{{ step.text }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ livraison -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100" :style="{ backgroundColor: primaryColor + '10' }">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>❓</span> Questions fréquentes
            </h2>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="(faq, i) in faqs" :key="i">
              <button @click="openFaq = openFaq === i ? null : i"
                class="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                <span class="font-medium text-sm text-gray-900">{{ faq.q }}</span>
                <svg class="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform"
                  :class="openFaq === i ? 'rotate-180' : ''"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div v-show="openFaq === i" class="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                {{ faq.a }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA contact -->
      <div class="mt-10 text-center p-6 rounded-2xl border border-gray-200 bg-white">
        <p class="text-sm text-gray-600 mb-3">
          Une question sur votre livraison ? Notre équipe est disponible pour vous aider.
        </p>
        <NuxtLink :to="`/boutique/${shop?.subdomain}/contact`"
          class="inline-block px-5 py-2.5 text-white text-sm font-semibold rounded-full transition-all hover:opacity-90"
          :style="{ backgroundColor: primaryColor }">
          Nous contacter
        </NuxtLink>
      </div>
    </main>

    <FooterOrganic :shop="shop" :primaryColor="primaryColor"
      :footerText="footerText" :socialLinks="socialLinks"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

// ── Contenu depuis customizations.livraison ───────────────────────
// Configurable via Dashboard → Personnalisation → onglet "Livraison"
const livraisonTitle    = computed(() => props.customizations?.livraison?.title    || '')
const livraisonSubtitle = computed(() => props.customizations?.livraison?.subtitle || '')
const livraisonContent  = computed(() => props.customizations?.livraison?.content  || '')
const freeDeliveryThreshold = computed(() =>
  props.customizations?.livraison?.free_threshold || `25 000 ${props.shop?.currency || 'XOF'}`
)

// ── Données par défaut si non configurées ─────────────────────────
const badges = [
  { icon: '🚚', title: 'Livraison rapide',    desc: '24h à 48h' },
  { icon: '📦', title: 'Emballage soigné',    desc: 'Protection garantie' },
  { icon: '↩️', title: 'Retour 7 jours',     desc: 'Sans question' },
  { icon: '🔔', title: 'Suivi en temps réel', desc: 'Notification SMS/Email' },
]

const deliveryModes = computed(() =>
  props.customizations?.livraison?.modes || [
    { icon: '🏍️', name: 'Livraison express', delay: '2-4h',       price: `2 000 ${props.shop?.currency || 'XOF'}`, zone: 'Ville' },
    { icon: '🚚', name: 'Livraison standard', delay: '24-48h',     price: `1 000 ${props.shop?.currency || 'XOF'}`, zone: 'Nationale' },
    { icon: '🏪', name: 'Retrait en boutique', delay: '1h',        price: 'Gratuit',                                zone: 'Sur place' },
    { icon: '📦', name: 'Livraison internationale', delay: '5-10j', price: 'Sur devis',                            zone: 'International' },
  ]
)

const returnSteps = [
  { num: '1', title: 'Contactez-nous', text: "Envoyez-nous un message via la page contact en précisant votre numéro de commande et la raison du retour." },
  { num: '2', title: 'Préparez le colis', text: "Remettez l'article dans son emballage d'origine, avec tous ses accessoires et la facture." },
  { num: '3', title: 'Renvoyez l\'article', text: "Déposez le colis à l'adresse indiquée par notre équipe. Les frais de retour sont à votre charge sauf article défectueux." },
  { num: '4', title: 'Remboursement', text: "Après vérification de l'article reçu, le remboursement est effectué sous 5 jours ouvrés via le moyen de paiement initial." },
]

const faqs = [
  { q: "Comment suivre ma commande ?", a: "Vous recevez un email de confirmation avec un lien de suivi dès l'expédition de votre commande." },
  { q: "Que faire si mon colis est endommagé ?", a: "Photographiez le colis et le produit endommagé, puis contactez-nous immédiatement. Nous organiserons un remplacement ou un remboursement." },
  { q: "Puis-je modifier mon adresse de livraison ?", a: "Vous pouvez modifier l'adresse dans les 2 heures suivant votre commande en nous contactant par message." },
  { q: "La livraison gratuite est-elle disponible ?", a: `Oui, la livraison est offerte pour toute commande supérieure à ${freeDeliveryThreshold.value}.` },
]

const openFaq = ref<number | null>(null)
</script>