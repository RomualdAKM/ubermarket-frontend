<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Retraits</h1>
      <p class="text-gray-600">Gérez vos demandes de retrait de commissions</p>
    </div>

    <!-- Soldes -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <!-- Solde disponible -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-medium text-gray-500">Solde disponible</h2>
            <p class="text-2xl font-bold text-emerald-600 mt-1">
              {{ balance ? formatAmount(balance.available) : '---' }}
            </p>
            <p class="text-xs text-gray-400 mt-1">{{ balance?.currency || 'FCFA' }}</p>
          </div>
          <div class="p-3 bg-emerald-100 rounded-full">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Solde en attente -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-medium text-gray-500">Solde en attente</h2>
            <p class="text-2xl font-bold text-orange-600 mt-1">
              {{ balance ? formatAmount(balance.pending) : '---' }}
            </p>
            <p class="text-xs text-gray-400 mt-1">Libéré après {{ withdrawalConfig?.release_delay_days || 3 }} jours</p>
          </div>
          <div class="p-3 bg-orange-100 rounded-full">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulaire de retrait -->
    <div class="bg-white rounded-lg border border-gray-200 mb-6">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900">Demander un retrait</h2>
        <button
          @click="showForm = !showForm"
          class="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          {{ showForm ? 'Masquer' : 'Nouveau retrait' }}
        </button>
      </div>

      <Transition name="slide-down">
        <div v-if="showForm" class="p-6">
          <!-- Message succès -->
          <div v-if="successMessage" class="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ successMessage }}
          </div>

          <!-- Message erreur -->
          <div v-if="errorMessage" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <!-- Montant -->
              <div>
                <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
                  Montant ({{ balance?.currency || 'FCFA' }})
                </label>
                <input
                  v-model.number="form.amount"
                  type="number"
                  id="amount"
                  :min="withdrawalConfig?.min_amount || 1000"
                  :max="balance?.available || 0"
                  step="1"
                  required
                  class="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  :placeholder="`Minimum ${withdrawalConfig?.min_amount || 1000} ${balance?.currency || 'FCFA'}`"
                >
                <p v-if="balance" class="mt-1 text-xs text-gray-500">
                  Disponible : {{ formatAmount(balance.available) }} {{ balance.currency || 'FCFA' }}
                </p>
              </div>

              <!-- Méthode -->
              <div>
                <label for="method" class="block text-sm font-medium text-gray-700 mb-1">Méthode de retrait</label>
                <select
                  v-model="form.method"
                  id="method"
                  required
                  class="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Sélectionnez une méthode</option>
                  <template v-if="withdrawalConfig?.methods">
                    <option
                      v-for="(method, key) in withdrawalConfig.methods"
                      :key="key"
                      :value="key"
                      :disabled="!method.enabled"
                    >
                      {{ method.name }}
                    </option>
                  </template>
                  <template v-else>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Virement bancaire</option>
                  </template>
                </select>
              </div>
            </div>

            <!-- Champs dynamiques selon méthode -->
            <div v-if="form.method === 'mobile_money'">
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone Mobile Money</label>
              <input
                v-model="form.account_details.phone"
                type="tel"
                id="phone"
                required
                class="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="+229 XX XX XX XX"
              >
            </div>

            <div v-if="form.method === 'paypal'">
              <label for="paypal_email" class="block text-sm font-medium text-gray-700 mb-1">Email PayPal</label>
              <input
                v-model="form.account_details.email"
                type="email"
                id="paypal_email"
                required
                class="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="email@paypal.com"
              >
            </div>

            <div v-if="form.method === 'bank_transfer'" class="space-y-4">
              <div>
                <label for="bank_name" class="block text-sm font-medium text-gray-700 mb-1">Nom de la banque</label>
                <input
                  v-model="form.account_details.bank_name"
                  type="text"
                  id="bank_name"
                  required
                  class="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Nom de votre banque"
                >
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="iban" class="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                  <input
                    v-model="form.account_details.iban"
                    type="text"
                    id="iban"
                    required
                    class="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="FR76 XXXX XXXX XXXX XXXX XXX"
                  >
                </div>
                <div>
                  <label for="bic" class="block text-sm font-medium text-gray-700 mb-1">BIC (optionnel)</label>
                  <input
                    v-model="form.account_details.bic"
                    type="text"
                    id="bic"
                    class="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="XXXXXXXX"
                  >
                </div>
              </div>
            </div>

            <!-- Aperçu des frais -->
            <div v-if="form.amount > 0 && feesPreview" class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Récapitulatif</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Montant demandé :</span>
                  <span class="font-medium">{{ formatAmount(feesPreview.amount) }} {{ balance?.currency || 'FCFA' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Frais agrégateur :</span>
                  <span class="text-red-600">- {{ formatAmount(feesPreview.aggregator_fee) }} {{ balance?.currency || 'FCFA' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Frais plateforme :</span>
                  <span class="text-red-600">- {{ formatAmount(feesPreview.platform_fee) }} {{ balance?.currency || 'FCFA' }}</span>
                </div>
                <div class="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span class="font-medium text-gray-700">Vous recevrez :</span>
                  <span class="font-bold text-emerald-600">{{ formatAmount(feesPreview.net_amount) }} {{ balance?.currency || 'FCFA' }}</span>
                </div>
              </div>
            </div>

            <div v-if="feesLoading && form.amount > 0" class="text-sm text-gray-400 flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Calcul des frais en cours...
            </div>

            <!-- Boutons -->
            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="showForm = false"
                class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="submitting || !isFormValid"
                class="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="submitting" class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Traitement...
                </span>
                <span v-else>Demander un retrait</span>
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>

    <!-- Historique des retraits -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Historique des retraits</h2>
      </div>

      <!-- Loading -->
      <div v-if="pageLoading" class="p-12 text-center">
        <svg class="animate-spin h-8 w-8 mx-auto text-emerald-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p class="mt-3 text-sm text-gray-500">Chargement...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="!withdrawals.length" class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-3 text-sm font-medium text-gray-900">Aucun retrait</h3>
        <p class="mt-1 text-sm text-gray-500">Vous n'avez pas encore effectué de demande de retrait.</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frais</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant net</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="w in withdrawals" :key="w.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(w.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatAmount(w.amount) }} {{ w.currency || 'FCFA' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                -{{ formatAmount((w.aggregator_fee || 0) + (w.platform_fee || 0)) }} {{ w.currency || 'FCFA' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                {{ formatAmount(w.net_amount) }} {{ w.currency || 'FCFA' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getMethodLabel(w.method) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(w.status)" class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusLabel(w.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  v-if="w.status === 'pending'"
                  @click="openCancelModal(w.id)"
                  class="text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Annuler
                </button>
                <span v-else-if="w.rejected_reason" class="text-gray-400 cursor-help underline decoration-dotted" :title="w.rejected_reason">
                  Voir raison
                </span>
                <span v-else class="text-gray-400">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.lastPage > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Page {{ pagination.currentPage }} sur {{ pagination.lastPage }}
        </p>
        <div class="flex gap-2">
          <button
            @click="loadWithdrawals(pagination.currentPage - 1)"
            :disabled="pagination.currentPage <= 1"
            class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Précédent
          </button>
          <button
            @click="loadWithdrawals(pagination.currentPage + 1)"
            :disabled="pagination.currentPage >= pagination.lastPage"
            class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- Modal confirmation annulation -->
    <Teleport to="body">
      <div v-if="showCancelModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/40" @click="showCancelModal = false"></div>
          <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Confirmer l'annulation</h3>
            <p class="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir annuler cette demande de retrait ? Le montant sera recrédité sur votre solde disponible.
            </p>
            <div class="flex justify-end gap-3">
              <button
                @click="showCancelModal = false"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Non, garder
              </button>
              <button
                @click="confirmCancel"
                :disabled="cancelling"
                class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors"
              >
                <span v-if="cancelling" class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Annulation...
                </span>
                <span v-else>Oui, annuler</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useAffiliateDashboard } from '~/composables/useAffiliateDashboard'

definePageMeta({
  layout: 'dashboard-affiliate'
})

const {
  fetchBalance: apiFetchBalance,
  fetchWithdrawals: apiFetchWithdrawals,
  fetchWithdrawalConfig: apiFetchConfig,
  calculateFees: apiCalculateFees,
  requestWithdrawal: apiRequestWithdrawal,
  cancelWithdrawal: apiCancelWithdrawal
} = useAffiliateDashboard()

// État
const pageLoading = ref(true)
const submitting = ref(false)
const cancelling = ref(false)
const feesLoading = ref(false)
const showForm = ref(false)
const showCancelModal = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const balance = ref<any>(null)
const withdrawalConfig = ref<any>(null)
const withdrawals = ref<any[]>([])
const feesPreview = ref<any>(null)
const withdrawalToCancel = ref<number | null>(null)
const feesTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const pagination = reactive({
  currentPage: 1,
  lastPage: 1
})

const form = reactive({
  amount: 0,
  method: '' as string,
  account_details: {
    phone: '',
    email: '',
    bank_name: '',
    iban: '',
    bic: ''
  }
})

// Validation
const isFormValid = computed(() => {
  if (!form.amount || !form.method) return false
  const minAmount = withdrawalConfig.value?.min_amount || 1000
  const maxAmount = withdrawalConfig.value?.max_amount || Infinity
  if (form.amount < minAmount) return false
  if (form.amount > maxAmount) return false
  if (balance.value && form.amount > balance.value.available) return false

  switch (form.method) {
    case 'mobile_money':
      return !!form.account_details.phone
    case 'paypal':
      return !!form.account_details.email
    case 'bank_transfer':
      return !!form.account_details.bank_name && !!form.account_details.iban
    default:
      return false
  }
})

// Helpers
const formatAmount = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return '0'
  return new Intl.NumberFormat('fr-FR').format(amount)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    mobile_money: 'Mobile Money',
    paypal: 'PayPal',
    bank_transfer: 'Virement bancaire'
  }
  return labels[method] || method
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    approved: 'Approuvé',
    completed: 'Complété',
    rejected: 'Rejeté',
    cancelled: 'Annulé'
  }
  return labels[status] || status
}

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Calcul frais (debounced)
watch(() => form.amount, (newAmount) => {
  if (feesTimeout.value) clearTimeout(feesTimeout.value)

  if (newAmount > 0) {
    feesLoading.value = true
    feesTimeout.value = setTimeout(async () => {
      try {
        const res = await apiCalculateFees(newAmount)
        feesPreview.value = res
      } catch {
        feesPreview.value = null
      } finally {
        feesLoading.value = false
      }
    }, 400)
  } else {
    feesPreview.value = null
    feesLoading.value = false
  }
})

// Charger les retraits
const loadWithdrawals = async (page: number = 1) => {
  try {
    const res = await apiFetchWithdrawals({ page })
    withdrawals.value = res.data || []
    pagination.currentPage = res.current_page || page
    pagination.lastPage = res.last_page || 1
  } catch (err: any) {
    console.error('Erreur chargement retraits:', err)
  }
}

// Soumettre
const handleSubmit = async () => {
  if (!isFormValid.value) return
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await apiRequestWithdrawal({
      amount: form.amount,
      currency: balance.value?.currency,
      method: form.method,
      account_details: form.account_details
    })

    successMessage.value = 'Demande de retrait créée avec succès !'
    form.amount = 0
    form.method = ''
    form.account_details = { phone: '', email: '', bank_name: '', iban: '', bic: '' }
    feesPreview.value = null

    // Recharger données
    await Promise.all([
      loadWithdrawals(1),
      apiFetchBalance().then(res => { balance.value = res })
    ])
  } catch (err: any) {
    errorMessage.value = err.message || 'Une erreur est survenue lors de la demande de retrait.'
  } finally {
    submitting.value = false
  }
}

// Annulation
const openCancelModal = (id: number) => {
  withdrawalToCancel.value = id
  showCancelModal.value = true
}

const confirmCancel = async () => {
  if (!withdrawalToCancel.value) return
  cancelling.value = true

  try {
    await apiCancelWithdrawal(withdrawalToCancel.value)
    showCancelModal.value = false
    withdrawalToCancel.value = null

    await Promise.all([
      loadWithdrawals(pagination.currentPage),
      apiFetchBalance().then(res => { balance.value = res })
    ])
  } catch (err: any) {
    errorMessage.value = err.message || 'Erreur lors de l\'annulation.'
  } finally {
    cancelling.value = false
  }
}

// Init
onMounted(async () => {
  pageLoading.value = true
  try {
    const [balanceRes, configRes] = await Promise.all([
      apiFetchBalance(),
      apiFetchConfig()
    ])
    balance.value = balanceRes
    withdrawalConfig.value = configRes

    await loadWithdrawals(1)
  } catch (err: any) {
    console.error('Erreur initialisation:', err)
  } finally {
    pageLoading.value = false
  }
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
