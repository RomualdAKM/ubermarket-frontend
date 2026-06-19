<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Abonnement</h1>
      <p class="text-gray-600">Choisissez l'abonnement qui correspond à vos besoins</p>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- Abonnement actuel -->
      <div v-if="currentSubscription" class="bg-white p-6 border border-gray-200 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">Votre abonnement actuel</h2>
          <span class="px-3 py-1 text-sm font-medium bg-primary/10 text-primary">
            {{ currentSubscription.plan?.name }}
          </span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-500">Statut</p>
            <p class="font-medium" :class="statusColor">{{ statusLabel }}</p>
          </div>
          <div v-if="currentSubscription.trial_ends_at">
            <p class="text-sm text-gray-500">Essai gratuit jusqu'au</p>
            <p class="font-medium text-gray-900">{{ formatDate(currentSubscription.trial_ends_at) }}</p>
          </div>
          <div v-if="currentSubscription.expires_at">
            <p class="text-sm text-gray-500">Prochaine facturation</p>
            <p class="font-medium text-gray-900">{{ formatDate(currentSubscription.expires_at) }}</p>
          </div>
          <div v-if="currentSubscription.plan?.commission_rate > 0">
            <p class="text-sm text-gray-500">Commission plateforme</p>
            <p class="font-medium text-orange-600">{{ currentSubscription.plan.commission_rate }}%</p>
          </div>
        </div>
      </div>

      <!-- Plans d'abonnement -->
      <div class="bg-white p-6 border border-gray-200 mb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-6">Plans d'abonnement</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div 
            v-for="plan in plans" 
            :key="plan.code"
            class="border border-gray-200 p-5 flex flex-col relative transition-all"
            :class="{ 
              'ring-2 ring-primary': isCurrentPlan(plan),
              'hover:border-primary/50': !isCurrentPlan(plan)
            }"
          >
            <!-- Badge populaire -->
            <div v-if="plan.is_popular" class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="bg-primary text-white text-xs font-semibold px-3 py-1">Populaire</span>
            </div>
            
            <!-- Badge plan actuel -->
            <div v-if="isCurrentPlan(plan)" class="absolute top-2 right-2">
              <span class="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5">Actuel</span>
            </div>

            <div class="mb-3">
              <h3 class="text-lg font-medium text-gray-900">{{ plan.name }}</h3>
              <p class="text-sm text-gray-500">{{ plan.description }}</p>
            </div>

            <div class="mb-4">
              <p class="text-2xl font-bold text-gray-900">
                <template v-if="plan.code === 'elite'">Sur mesure</template>
                <template v-else>{{ plan.price }} €</template>
              </p>
              <p v-if="plan.code !== 'elite'" class="text-sm text-gray-500">par mois</p>
              <p v-if="plan.code === 'gratuit'" class="text-xs text-orange-600 mt-1">
                Après 7 jours d'essai gratuit
              </p>
              <p v-if="plan.commission_rate > 0" class="text-xs text-orange-600 mt-1">
                {{ plan.commission_rate }}% de commission
              </p>
            </div>

            <!-- Limites -->
            <ul class="space-y-2 flex-1 text-sm">
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-600">
                  {{ plan.max_shops === -1 ? 'Boutiques illimitées' : `${plan.max_shops} boutique${plan.max_shops > 1 ? 's' : ''}` }}
                </span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-600">
                  {{ plan.max_products === -1 ? 'Produits illimités' : `${plan.max_products} produits` }}
                </span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-600">
                  {{ plan.max_pages === -1 ? 'Pages illimitées' : `${plan.max_pages} page${plan.max_pages > 1 ? 's' : ''} web` }}
                </span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-600">126+ templates</span>
              </li>
              <li class="flex items-center gap-2">
                <svg v-if="plan.max_collaborators !== 0" class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <svg v-else class="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
                <span :class="plan.max_collaborators !== 0 ? 'text-gray-600' : 'text-gray-400'">
                  {{ plan.max_collaborators === -1 ? 'Collaborateurs illimités' : (plan.max_collaborators === 0 ? 'Pas de collaborateurs' : `${plan.max_collaborators} collaborateur${plan.max_collaborators > 1 ? 's' : ''}`) }}
                </span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-600">Retrait 3 jours</span>
              </li>
            </ul>

            <!-- Modules -->
            <div class="mt-3 pt-3 border-t border-gray-100">
              <p class="text-xs font-medium text-gray-500 mb-2">Modules inclus</p>
              <ul class="space-y-1.5 text-sm">
                <li class="flex items-center gap-2">
                  <svg v-if="plan.has_delivery_module" class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <svg v-else class="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                  <span :class="plan.has_delivery_module ? 'text-gray-600' : 'text-gray-400'">Livraisons</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg v-if="plan.has_promo_module" class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <svg v-else class="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                  <span :class="plan.has_promo_module ? 'text-gray-600' : 'text-gray-400'">Codes Promo</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg v-if="plan.has_marketing_module" class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <svg v-else class="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                  <span :class="plan.has_marketing_module ? 'text-gray-600' : 'text-gray-400'">Marketing</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg v-if="plan.has_custom_payment_keys" class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <svg v-else class="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                  <span :class="plan.has_custom_payment_keys ? 'text-gray-600' : 'text-gray-400'">Clés paiement perso</span>
                </li>
              </ul>
            </div>

            <!-- Bouton -->
            <button 
              v-if="plan.code !== 'elite'"
              @click="openPaymentModal(plan)"
              :disabled="isCurrentPlan(plan) || processing"
              class="mt-4 w-full py-2 px-4 text-sm font-medium transition-colors"
              :class="isCurrentPlan(plan) 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary/90'"
            >
              {{ isCurrentPlan(plan) ? 'Plan actuel' : (canUpgrade(plan) ? 'Passer à ce plan' : 'Choisir ce plan') }}
            </button>
            <a 
              v-else
              href="mailto:contact@ubermarket.com?subject=Demande devis Elite"
              class="mt-4 w-full py-2 px-4 text-sm font-medium text-center bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>

      <!-- Historique des paiements -->
      <div class="bg-white p-6 border border-gray-200">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Historique des paiements</h2>
        
        <div v-if="payments.length === 0" class="text-center py-8 text-gray-500">
          Aucun paiement enregistré
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="payment in payments" :key="payment.id">
                <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(payment.created_at) }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ payment.plan_name || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ payment.amount }} €</td>
                <td class="px-4 py-3 text-sm text-gray-600 capitalize">{{ payment.payment_method }}</td>
                <td class="px-4 py-3">
                  <span 
                    class="px-2 py-0.5 text-xs font-medium"
                    :class="getPaymentStatusClass(payment.status)"
                  >
                    {{ getPaymentStatusLabel(payment.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Modal de paiement -->
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white w-full max-w-md mx-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Confirmer l'abonnement</h3>
          <button @click="closePaymentModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div v-if="selectedPlan" class="mb-6">
          <div class="bg-gray-50 p-4 mb-4">
            <p class="font-medium text-gray-900">{{ selectedPlan.name }}</p>
            <p class="text-2xl font-bold text-primary mt-1">{{ selectedPlan.price }} € <span class="text-sm font-normal text-gray-500">/ mois</span></p>
          </div>

          <p class="text-sm text-gray-600 mb-4">Choisissez votre méthode de paiement :</p>

          <div class="space-y-3">
            <button 
              @click="initiatePayment('moneroo')"
              :disabled="processing"
              class="w-full flex items-center justify-between p-4 border border-gray-200 hover:border-primary transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-600 font-bold text-sm">M</span>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900">Moneroo</p>
                  <p class="text-xs text-gray-500">Mobile Money, Carte bancaire</p>
                </div>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <!-- PAYPAL TEMPORAIREMENT DÉSACTIVÉ - DO NOT REMOVE -->
            <button 
              v-if="false"
              @click="initiatePayment('paypal')"
              :disabled="processing"
              class="w-full flex items-center justify-between p-4 border border-gray-200 hover:border-primary transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-yellow-100 flex items-center justify-center">
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
        </div>

        <div v-if="processing" class="flex items-center justify-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span class="ml-2 text-gray-600">Redirection en cours...</span>
        </div>
      </div>
    </div>

    <!-- Message de succès/erreur -->
    <div v-if="message" class="fixed bottom-4 right-4 z-50">
      <div 
        class="px-4 py-3 shadow-lg"
        :class="messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  //import { ref, computed, onMounted } from 'vue'
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import { useSubscription } from '~/composables/useSubscription'

  definePageMeta({
    layout: 'dashboard'
  })

  const route = useRoute()
  const { 
    plans, 
    currentSubscription, 
    paymentHistory: payments,
    loading, 
    error,
    fetchPlans, 
    fetchCurrentSubscription,
    fetchPaymentHistory,
    initiatePayment: initPayment,
    verifyPayment,
    changePlan
  } = useSubscription()

  const showPaymentModal = ref(false)
  const selectedPlan = ref<any>(null)
  const processing = ref(false)
  const message = ref('')
  const messageType = ref<'success' | 'error'>('success')

  // Labels des modules
  const moduleLabels: Record<string, string> = {
    delivery: 'Livraisons',
    promo: 'Codes Promo',
    marketing: 'Marketing',
    analytics: 'Analyses avancées',
    customization: 'Personnalisation avancée',
    custom_payment_keys: 'Clés paiement perso'
  }

  const getModuleLabel = (module: string) => moduleLabels[module] || module

  // Status de l'abonnement
  const statusLabel = computed(() => {
    if (!currentSubscription.value) return ''
    const status = currentSubscription.value.status
    const labels: Record<string, string> = {
      active: 'Actif',
      trial: 'Essai gratuit',
      expired: 'Expiré',
      cancelled: 'Annulé'
    }
    return labels[status] || status
  })

  const statusColor = computed(() => {
    if (!currentSubscription.value) return ''
    const status = currentSubscription.value.status
    const colors: Record<string, string> = {
      active: 'text-green-600',
      trial: 'text-blue-600',
      expired: 'text-red-600',
      cancelled: 'text-gray-600'
    }
    return colors[status] || 'text-gray-600'
  })

  // Vérifications
  const isCurrentPlan = (plan: any) => {
    return currentSubscription.value?.plan?.code === plan.code
  }

  const canUpgrade = (plan: any) => {
    if (!currentSubscription.value) return false
    const currentPlanCode = currentSubscription.value.plan?.code
    const currentPlanData = plans.value.find((p: any) => p.code === currentPlanCode)
    if (!currentPlanData) return false
    return plan.price > currentPlanData.price
  }

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Status des paiements
  const getPaymentStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Payé',
      pending: 'En attente',
      failed: 'Échoué'
    }
    return labels[status] || status
  }

  // Actions
  const openPaymentModal = (plan: any) => {
    if (plan.price === 0) {
      selectFreePlan(plan)
      return
    }
    selectedPlan.value = plan
    showPaymentModal.value = true
  }

  const closePaymentModal = () => {
    showPaymentModal.value = false
    selectedPlan.value = null
  }

  const selectFreePlan = async (plan: any) => {
    processing.value = true
    try {
      // Pour les plans gratuits (Welcome, début Gratuit), utiliser changePlan
      await changePlan(plan.code)
      showMessage('Plan activé avec succès !', 'success')
      await fetchCurrentSubscription()
    } catch (err: any) {
      showMessage(err.message || 'Erreur lors de l\'activation', 'error')
    } finally {
      processing.value = false
    }
  }

  const initiatePayment = async (method: 'moneroo' | 'paypal') => {
    if (!selectedPlan.value) return
    processing.value = true
    
    try {
      const returnUrl = `${window.location.origin}${route.path}?payment=callback`
      const cancelUrl = `${window.location.origin}${route.path}?payment=cancelled`
      
      // Mapper moneroo vers mobile_money pour le backend
      const backendMethod = method === 'moneroo' ? 'mobile_money' : method
      const result = await initPayment(selectedPlan.value.code, backendMethod, returnUrl, cancelUrl)
      
      if (result.checkout_url) {
        window.location.href = result.checkout_url
      }
    } catch (err: any) {
      showMessage(err.message || 'Erreur lors du paiement', 'error')
      processing.value = false
    }
  }

  const showMessage = (msg: string, type: 'success' | 'error') => {
    message.value = msg
    messageType.value = type
    setTimeout(() => { message.value = '' }, 5000)
  }

  // Vérification callback paiement
  const checkPaymentCallback = async () => {
    const query = route.query
    
    if (query.payment === 'callback') {
      // Le backend retourne subscription_payment_id dans l'URL
      const paymentId = query.subscription_payment_id as string
      const gatewayId = query.token as string // PayPal utilise 'token'
      
      if (paymentId) {
        try {
          await verifyPayment(parseInt(paymentId), gatewayId)
          showMessage('Paiement effectué avec succès !', 'success')
          await fetchCurrentSubscription()
          await fetchPaymentHistory()
        } catch (err: any) {
          showMessage(err.message || 'Erreur de vérification du paiement', 'error')
        }
      }
      
      // Nettoyer l'URL
      window.history.replaceState({}, '', route.path)
    } else if (query.payment === 'cancelled') {
      showMessage('Paiement annulé', 'error')
      window.history.replaceState({}, '', route.path)
    } else if (query.payment === 'success') {
      showMessage('Plan activé avec succès !', 'success')
      window.history.replaceState({}, '', route.path)
    }
  }

  /*onMounted(async () => {
    await Promise.all([
      fetchPlans(),
      fetchCurrentSubscription(),
      fetchPaymentHistory()
    ])
    await checkPaymentCallback()
  })

  // Dans le script de la page abonnement
  onMounted(() => {
    const themeSlug  = route.query.theme as string
    const themeName  = route.query.theme_name as string
    const themePrice = route.query.theme_price as string

    if (themeSlug && themeName && themePrice) {
      // Ouvrir directement la modale de paiement pour ce thème
      openPaymentModal({
        code:  `theme_${themeSlug}`,
        name:  themeName,
        price: parseFloat(themePrice),
        description: `Thème ${themeName}`,
        // Marquer comme achat de thème pour le backend
        type: 'theme',
        theme_slug: themeSlug,
      })
    }
  })*/

  onMounted(async () => {
    // Charger les données en parallèle
    await Promise.all([
      fetchPlans(),
      fetchCurrentSubscription(),
      fetchPaymentHistory()
    ])

    // Vérifier callback paiement
    await checkPaymentCallback()

    // ✅ Détecter achat thème APRÈS chargement des données depuis personaliser
    const themeSlug  = route.query.theme as string
    const themeName  = decodeURIComponent(route.query.theme_name as string || '')
    const themePrice = route.query.theme_price as string

    if (themeSlug && themeName && themePrice) {
      // Petit délai pour s'assurer que le DOM est prêt
      await nextTick()
      openPaymentModal({
        code:        `theme_${themeSlug}`,
        name:        `Thème ${themeName}`,
        price:       parseFloat(themePrice),
        description: `Achat du thème ${themeName}`,
      })
    }
  })
</script>
