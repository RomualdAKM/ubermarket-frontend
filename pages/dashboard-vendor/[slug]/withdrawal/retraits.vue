<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Retraits</h1>
      <p class="text-gray-600">Gérez vos demandes de retrait de fonds</p>
    </div>

    <!-- Soldes (disponible + en attente) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- Solde disponible -->
      <div class="bg-white p-6 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-medium text-gray-500">Solde disponible</h2>
            <p class="text-2xl font-bold text-green-600 mt-1">
              {{ balance ? formatAmount(balance.available, balance.currency) : '---' }}
            </p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Solde en attente -->
      <div class="bg-white p-6 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-medium text-gray-500">En attente de libération</h2>
            <p class="text-2xl font-bold text-orange-600 mt-1">
              {{ balance ? formatAmount(balance.pending, balance.currency) : '---' }}
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

      <!-- Total retiré -->
      <div class="bg-white p-6 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-medium text-gray-500">Total retiré</h2>
            <p class="text-2xl font-bold text-gray-700 mt-1">
              {{ balance ? formatAmount(balance.total_withdrawn, balance.currency) : '---' }}
            </p>
          </div>
          <div class="p-3 bg-gray-100 rounded-full">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton demander un retrait -->
    <div class="mb-6 flex justify-end">
      <button 
        @click="showWithdrawalForm = !showWithdrawalForm"
        :disabled="!balance || balance.available < (withdrawalConfig?.min_amount || 10)"
        class="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {{ showWithdrawalForm ? 'Annuler' : 'Demander un retrait' }}
      </button>
    </div>

    <!-- Formulaire de demande de retrait -->
    <Transition name="slide-down">
      <div v-if="showWithdrawalForm" class="bg-white p-6 border-t border-gray-200 mb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Nouvelle demande de retrait</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Montant -->
            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700">
                Montant ({{ balance?.currency || 'EUR' }})
              </label>
              <input 
                v-model.number="form.amount" 
                type="number" 
                id="amount" 
                :min="withdrawalConfig?.min_amount || 10"
                :max="balance?.available || 0"
                step="0.01"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" 
                :placeholder="`Minimum ${withdrawalConfig?.min_amount || 10} ${balance?.currency || 'EUR'}`"
              >
              <p v-if="balance" class="mt-1 text-xs text-gray-500">
                Disponible: {{ formatAmount(balance.available, balance.currency) }}
              </p>
            </div>
            
            <!-- Méthode -->
            <div>
              <label for="method" class="block text-sm font-medium text-gray-700">Méthode de retrait</label>
              <select 
                v-model="form.method" 
                id="method" 
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"
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
              </select>
            </div>
          </div>
          
          <!-- Champs dynamiques selon la méthode -->
          <div v-if="form.method === 'mobile_money'">
            <label for="phone" class="block text-sm font-medium text-gray-700">Numéro de téléphone Mobile Money</label>
            <input 
              v-model="form.account_details.phone" 
              type="tel" 
              id="phone" 
              required
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" 
              placeholder="+229 XX XX XX XX"
            >
          </div>

          <div v-if="form.method === 'paypal'">
            <label for="paypal_email" class="block text-sm font-medium text-gray-700">Email PayPal</label>
            <input 
              v-model="form.account_details.email" 
              type="email" 
              id="paypal_email" 
              required
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" 
              placeholder="email@paypal.com"
            >
          </div>

          <div v-if="form.method === 'bank_transfer'" class="space-y-4">
            <div>
              <label for="bank_name" class="block text-sm font-medium text-gray-700">Nom de la banque</label>
              <input 
                v-model="form.account_details.bank_name" 
                type="text" 
                id="bank_name" 
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" 
                placeholder="Nom de votre banque"
              >
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="iban" class="block text-sm font-medium text-gray-700">IBAN</label>
                <input 
                  v-model="form.account_details.iban" 
                  type="text" 
                  id="iban" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" 
                  placeholder="FR76 XXXX XXXX XXXX XXXX XXX"
                >
              </div>
              <div>
                <label for="bic" class="block text-sm font-medium text-gray-700">BIC (optionnel)</label>
                <input 
                  v-model="form.account_details.bic" 
                  type="text" 
                  id="bic" 
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" 
                  placeholder="XXXXXXXX"
                >
              </div>
            </div>
          </div>

          <!-- Aperçu des frais -->
          <div v-if="form.amount && feesPreview" class="bg-gray-50 p-4 rounded-md">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Récapitulatif</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Montant demandé:</span>
                <span class="font-medium">{{ formatAmount(feesPreview.amount, balance?.currency || 'EUR') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Frais agrégateur:</span>
                <span class="text-red-600">- {{ formatAmount(feesPreview.aggregator_fee, balance?.currency || 'EUR') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Frais plateforme:</span>
                <span class="text-red-600">- {{ formatAmount(feesPreview.platform_fee, balance?.currency || 'EUR') }}</span>
              </div>
              <div class="flex justify-between border-t border-gray-200 pt-1 mt-1">
                <span class="font-medium text-gray-700">Vous recevrez:</span>
                <span class="font-bold text-green-600">{{ formatAmount(feesPreview.net_amount, balance?.currency || 'EUR') }}</span>
              </div>
            </div>
          </div>

          <!-- Message d'erreur -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showWithdrawalForm = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              :disabled="loading || !isFormValid"
              class="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Traitement...
              </span>
              <span v-else>Confirmer le retrait</span>
            </button>
          </div>
        </form>
      </div>
    </Transition>

    <!-- Historique des retraits -->
    <div class="bg-white border-t border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Historique des retraits</h2>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading && !withdrawals.length" class="p-8 text-center">
        <svg class="animate-spin h-8 w-8 mx-auto text-primary" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p class="mt-2 text-gray-500">Chargement...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="!withdrawals.length" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun retrait</h3>
        <p class="mt-1 text-sm text-gray-500">Vous n'avez pas encore effectué de demande de retrait.</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frais</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="withdrawal in withdrawals" :key="withdrawal.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(withdrawal.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {{ formatAmount(withdrawal.amount, withdrawal.currency) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                -{{ formatAmount(withdrawal.aggregator_fee + withdrawal.platform_fee, withdrawal.currency) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                {{ formatAmount(withdrawal.net_amount, withdrawal.currency) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getMethodLabel(withdrawal.method) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(withdrawal.status)">
                  {{ getStatusLabel(withdrawal.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button 
                  v-if="canCancel(withdrawal)"
                  @click="handleCancel(withdrawal.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Annuler
                </button>
                <span v-else-if="withdrawal.rejected_reason" class="text-gray-400 cursor-help" :title="withdrawal.rejected_reason">
                  Voir raison
                </span>
                <span v-else class="text-gray-400">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de confirmation d'annulation -->
    <Teleport to="body">
      <div v-if="showCancelModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black bg-opacity-30" @click="showCancelModal = false"></div>
          <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmer l'annulation</h3>
            <p class="text-gray-500 mb-6">Êtes-vous sûr de vouloir annuler cette demande de retrait ? Le montant sera recrédité sur votre solde disponible.</p>
            <div class="flex justify-end space-x-3">
              <button 
                @click="showCancelModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Non, garder
              </button>
              <button 
                @click="confirmCancel"
                :disabled="loading"
                class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:bg-gray-300"
              >
                Oui, annuler
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
import { useWithdrawal, type WithdrawalFees, type Withdrawal } from '~/composables/useWithdrawal'

definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})

const {
  balance,
  withdrawalConfig,
  withdrawals,
  loading,
  error,
  fetchBalance,
  fetchConfig,
  calculateFees,
  fetchWithdrawals,
  requestWithdrawal,
  cancelWithdrawal,
  formatAmount,
  getStatusLabel,
  getMethodLabel,
  canCancel
} = useWithdrawal()

// États locaux
const showWithdrawalForm = ref(false)
const showCancelModal = ref(false)
const withdrawalToCancel = ref<number | null>(null)
const feesPreview = ref<WithdrawalFees | null>(null)
const feesTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const form = reactive({
  amount: 0,
  method: '' as 'mobile_money' | 'paypal' | 'bank_transfer' | '',
  account_details: {
    phone: '',
    email: '',
    bank_name: '',
    iban: '',
    bic: ''
  }
})

// Validation du formulaire
const isFormValid = computed(() => {
  if (!form.amount || !form.method) return false
  if (form.amount < (withdrawalConfig.value?.min_amount || 10)) return false
  if (!balance.value || form.amount > balance.value.available) return false

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

// Formater la date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Classes CSS pour le statut
const getStatusClass = (status: Withdrawal['status']): string => {
  const classes: Record<string, string> = {
    pending: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    approved: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    completed: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    rejected: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
    cancelled: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
  return classes[status] || classes.pending
}

// Calculer les frais quand le montant change (avec debounce manuel)
watch(() => form.amount, async (newAmount) => {
  // Clear previous timeout
  if (feesTimeout.value) {
    clearTimeout(feesTimeout.value)
  }
  
  if (newAmount > 0) {
    // Debounce 300ms
    feesTimeout.value = setTimeout(async () => {
      try {
        feesPreview.value = await calculateFees(newAmount)
      } catch {
        feesPreview.value = null
      }
    }, 300)
  } else {
    feesPreview.value = null
  }
})

// Soumettre la demande de retrait
const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    await requestWithdrawal({
      amount: form.amount,
      currency: balance.value?.currency,
      method: form.method as 'mobile_money' | 'paypal' | 'bank_transfer',
      account_details: form.account_details
    })

    // Reset form
    form.amount = 0
    form.method = ''
    form.account_details = { phone: '', email: '', bank_name: '', iban: '', bic: '' }
    feesPreview.value = null
    showWithdrawalForm.value = false

    // Notification de succès (pourrait être une toast)
    alert('Demande de retrait créée avec succès !')
  } catch (err: any) {
    console.error('Erreur:', err)
  }
}

// Gérer l'annulation
const handleCancel = (id: number) => {
  withdrawalToCancel.value = id
  showCancelModal.value = true
}

const confirmCancel = async () => {
  if (!withdrawalToCancel.value) return

  try {
    await cancelWithdrawal(withdrawalToCancel.value)
    showCancelModal.value = false
    withdrawalToCancel.value = null
  } catch (err: any) {
    console.error('Erreur:', err)
  }
}

// Charger les données au montage
onMounted(async () => {
  await Promise.all([
    fetchBalance(),
    fetchConfig(),
    fetchWithdrawals()
  ])
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
