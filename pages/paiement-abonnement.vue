<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full space-y-6">

      <!-- ── En-tête ──────────────────────────────────────────── -->
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Compte créé avec succès !</h1>
        <p class="mt-2 text-gray-600">
          Il ne reste plus qu'à activer votre abonnement <strong>{{ planName }}</strong>.
        </p>
      </div>

      <!-- ── Loader initial (chargement du plan) ──────────────── -->
      <div v-if="loadingPlan" class="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-3 text-gray-500 text-sm">Chargement de votre plan…</p>
      </div>

      <!-- ── Erreur : plan introuvable ────────────────────────── -->
      <div v-else-if="planError" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-700 font-medium">{{ planError }}</p>
        <button @click="goToDashboard"
          class="mt-4 px-4 py-2 bg-primary text-white text-sm rounded hover:bg-secondary transition-colors"
        >
          Accéder au dashboard
        </button>
      </div>

      <!-- ── Carte du plan sélectionné ────────────────────────── -->
      <div v-else-if="selectedPlan" class="bg-white rounded-lg border border-gray-200 overflow-hidden">

        <!-- Récapitulatif du plan -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ selectedPlan.name }}</h2>
              <p class="text-sm text-gray-500 mt-0.5">{{ selectedPlan.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-gray-900">{{ selectedPlan.price }} €</p>
              <p class="text-xs text-gray-400">par mois</p>
            </div>
          </div>

          <!-- Avantages clés du plan (résumé compact) -->
          <div class="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              {{ selectedPlan.max_shops === -1 ? 'Boutiques illimitées' : `${selectedPlan.max_shops} boutique(s)` }}
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              {{ selectedPlan.max_products === -1 ? 'Produits illimités' : `${selectedPlan.max_products} produits` }}
            </div>
            <div v-if="selectedPlan.commission_rate > 0" class="flex items-center gap-1.5 col-span-2">
              <svg class="w-4 h-4 text-orange-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <span class="text-orange-600">{{ selectedPlan.commission_rate }}% de commission plateforme</span>
            </div>
          </div>
        </div>

        <!-- ── Choix de la méthode de paiement ──────────────── -->
        <div class="p-6">
          <p class="text-sm font-medium text-gray-700 mb-4">Choisissez votre méthode de paiement :</p>

          <div class="space-y-3">
            <!--
              Bouton Moneroo — Mobile Money, carte bancaire.
              Mappe vers 'mobile_money' côté backend (même logique que abonnement.vue).
            -->
            <button
              @click="initiatePayment('moneroo')"
              :disabled="processing"
              class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="text-blue-600 font-bold text-sm">M</span>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900">Moneroo</p>
                  <p class="text-xs text-gray-500">Mobile Money, Carte bancaire</p>
                </div>
              </div>
              <svg v-if="!processing" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </button>

            <!-- PAYPAL TEMPORAIREMENT DÉSACTIVÉ — NE PAS SUPPRIMER -->
            <button v-if="false"
              @click="initiatePayment('paypal')"
              :disabled="processing"
              class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span class="text-yellow-600 font-bold text-sm">P</span>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900">PayPal</p>
                  <p class="text-xs text-gray-500">Carte bancaire, Solde PayPal</p>
                </div>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <!-- Indicateur de redirection en cours -->
          <div v-if="processing" class="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Redirection vers le paiement…
          </div>

          <!-- Lien de secours : passer et payer plus tard -->
          <div class="mt-6 pt-4 border-t border-gray-100 text-center">
            <button
              @click="skipPayment"
              :disabled="processing"
              class="text-sm text-gray-400 hover:text-gray-600 underline disabled:opacity-50"
            >
              Payer plus tard — accéder au dashboard avec le plan de base
            </button>
          </div>
        </div>
      </div>

      <!-- ── Message erreur paiement ───────────────────────────── -->
      <div v-if="paymentError" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-sm text-red-700">{{ paymentError }}</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSubscription } from '~/composables/useSubscription'

// ── SEO minimal — page de paiement post-inscription ──────────
useHead({
  title: 'Activation de votre abonnement | Uber-Market',
  meta: [
    // Ne pas indexer cette page de transition
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// ── Pas de layout dashboard (l'utilisateur n'a pas encore de boutique) ──
// On utilise le layout par défaut (layout public simple)
definePageMeta({
  layout: 'default'
})

const router = useRouter()
const route  = useRoute()

const {
  plans,
  fetchPlans,
  initiatePayment: initPayment,
  verifyPayment,
  fetchCurrentSubscription,
} = useSubscription()

// ── État local ────────────────────────────────────────────────
const loadingPlan  = ref(true)
const processing   = ref(false)
const planError    = ref('')
const paymentError = ref('')

/**
 * planCode — code du plan extrait du query param ?plan=xxx.
 * Transmis depuis inscription-vendeur.vue après la création du compte.
 * Exemple : /paiement-abonnement?plan=premium
 */
const planCode = computed(() => (route.query.plan as string || '').toLowerCase())

/**
 * selectedPlan — objet plan complet chargé depuis l'API.
 * Null si le plan n'a pas encore été chargé ou introuvable.
 */
const selectedPlan = computed(() =>
  plans.value.find((p: any) => p.code === planCode.value) || null
)

/** Nom affiché dans le titre de la page */
const planName = computed(() => selectedPlan.value?.name || planCode.value || 'votre plan')

// ─────────────────────────────────────────────────────────────
// INITIALISATION
// ─────────────────────────────────────────────────────────────

onMounted(async () => {
  // Si pas de plan dans l'URL, rediriger vers le dashboard directement
  if (!planCode.value) {
    await goToDashboard()
    return
  }

  // Vérifier si on revient d'un callback de paiement Moneroo
  const paymentQuery = route.query.payment as string
  if (paymentQuery === 'callback') {
    await handlePaymentCallback()
    return
  }
  if (paymentQuery === 'cancelled') {
    paymentError.value = 'Paiement annulé. Vous pouvez réessayer ou continuer avec le plan de base.'
    // Nettoyer l'URL sans navigation
    window.history.replaceState({}, '', route.path + '?plan=' + planCode.value)
  }

  // Charger la liste des plans pour retrouver le plan sélectionné
  try {
    await fetchPlans()

    // Vérifier que le plan existe bien
    if (!selectedPlan.value) {
      planError.value = `Le plan "${planCode.value}" est introuvable. Vérifiez le lien ou contactez le support.`
    }
  } catch (err) {
    planError.value = 'Impossible de charger les informations du plan. Veuillez réessayer.'
  } finally {
    loadingPlan.value = false
  }
})

// ─────────────────────────────────────────────────────────────
// DÉCLENCHEMENT DU PAIEMENT
//
// Réutilise exactement la même logique que abonnement.vue :
//   - initiatePayment() du composable useSubscription
//   - mapping 'moneroo' → 'mobile_money' pour le backend
//   - returnUrl / cancelUrl pointent vers cette même page
// ─────────────────────────────────────────────────────────────

const initiatePayment = async (method: 'moneroo' | 'paypal') => {
  if (!selectedPlan.value) return

  processing.value   = true
  paymentError.value = ''

  try {
    // Les URLs de retour pointent vers cette page avec le plan en param
    // pour pouvoir vérifier le paiement et afficher le bon état
    const baseUrl   = `${window.location.origin}/paiement-abonnement?plan=${planCode.value}`
    const returnUrl = `${baseUrl}&payment=callback`
    const cancelUrl = `${baseUrl}&payment=cancelled`

    // Mapper moneroo → mobile_money (même mapping que abonnement.vue)
    const backendMethod = method === 'moneroo' ? 'mobile_money' : method

    const result = await initPayment(selectedPlan.value.code, backendMethod, returnUrl, cancelUrl)

    if (result.checkout_url) {
      // Redirection vers la passerelle de paiement (Moneroo, etc.)
      window.location.href = result.checkout_url
    }
  } catch (err: any) {
    paymentError.value = err.message || 'Erreur lors de l\'initiation du paiement. Veuillez réessayer.'
    processing.value = false
  }
}

// ─────────────────────────────────────────────────────────────
// VÉRIFICATION DU CALLBACK DE PAIEMENT
//
// Même logique que abonnement.vue → checkPaymentCallback().
// Appelé quand Moneroo redirige vers ?payment=callback.
// ─────────────────────────────────────────────────────────────

const handlePaymentCallback = async () => {
  loadingPlan.value = false

  // Moneroo passe subscription_payment_id dans l'URL de retour
  const paymentId = route.query.subscription_payment_id as string
  const gatewayId = route.query.token as string // PayPal utilise 'token'

  if (!paymentId) {
    // Callback sans ID → considérer comme succès si le backend a confirmé
    await goToDashboard()
    return
  }

  processing.value = true
  try {
    await verifyPayment(parseInt(paymentId), gatewayId)

    // Paiement vérifié → nettoyer le sessionStorage et aller au dashboard
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('pending_subscription_plan')
    }

    // Recharger l'abonnement pour mettre à jour le composable
    await fetchCurrentSubscription()

    // Rediriger vers /mes-boutiques avec un indicateur de succès
    await router.push('/mes-boutiques?subscription=activated')
  } catch (err: any) {
    paymentError.value = err.message || 'Erreur de vérification du paiement. Contactez le support.'
  } finally {
    processing.value = false
    // Nettoyer les params de callback de l'URL
    window.history.replaceState({}, '', route.path + '?plan=' + planCode.value)
  }
}

// ─────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────

/**
 * goToDashboard — redirige vers /mes-boutiques.
 * Utilisé en cas d'erreur ou si le plan est introuvable.
 * L'utilisateur garde le plan de base (welcome) assigné à la création
 * du compte et pourra mettre à niveau depuis le menu Abonnement.
 */
const goToDashboard = async () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('pending_subscription_plan')
  }
  await router.push('/mes-boutiques')
}

/**
 * skipPayment — permet à l'utilisateur de différer le paiement.
 * Il restera sur le plan de base et pourra mettre à niveau plus tard
 * depuis le menu Abonnement de son dashboard (déjà fonctionnel).
 */
const skipPayment = async () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('pending_subscription_plan')
  }
  await router.push('/mes-boutiques')
}
</script>
