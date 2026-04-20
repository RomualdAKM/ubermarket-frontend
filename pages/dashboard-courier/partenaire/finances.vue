<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-1">
        <NuxtLink to="/dashboard-courier/partenaire" class="text-indigo-600 hover:text-indigo-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
          </svg>
        </NuxtLink>
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">Espace Partenaire</span>
      </div>
      <h1 class="text-xl font-bold text-gray-900">Finances</h1>
      <p class="text-sm text-gray-500 mt-1">Vue d'ensemble de vos revenus et retraits</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <template v-else>
      <!-- Error -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <p class="text-sm text-red-700">{{ error }}</p>
        <button @click="loadFinances" class="mt-2 text-sm text-red-600 font-medium hover:underline">Réessayer</button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p class="text-xs text-gray-500 mb-1">Revenus totaux</p>
          <p class="text-2xl font-bold text-gray-900">{{ formatPrice(finances.total_earnings) }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p class="text-xs text-gray-500 mb-1">En attente</p>
          <p class="text-2xl font-bold text-yellow-600">{{ formatPrice(finances.pending_earnings) }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p class="text-xs text-gray-500 mb-1">Solde disponible</p>
          <p class="text-2xl font-bold text-green-600">{{ formatPrice(finances.available_balance) }}</p>
          <button
            v-if="finances.available_balance > 0"
            @click="showWithdrawModal = true"
            class="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Demander un retrait →
          </button>
        </div>
      </div>

      <!-- Commission rate info -->
      <div v-if="finances.commission_rate" class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 flex items-center gap-3">
        <svg class="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
        </svg>
        <p class="text-sm text-indigo-700">
          Votre taux de commission : <strong>{{ finances.commission_rate }}%</strong> sur chaque livraison
        </p>
      </div>

      <!-- Breakdown by Courier -->
      <div class="mb-6">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Détail par livreur</h2>
        <div v-if="finances.couriers_breakdown.length === 0" class="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p class="text-sm text-gray-400">Aucune donnée disponible</p>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="item in finances.couriers_breakdown"
            :key="item.courier_id"
            class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">{{ item.courier_name }}</p>
              <p class="text-xs text-gray-500">{{ item.deliveries_count }} livraisons</p>
            </div>
            <p class="text-sm font-bold text-gray-900">{{ formatPrice(item.earnings) }}</p>
          </div>
        </div>
      </div>

      <!-- Monthly Summary -->
      <div class="mb-6">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Résumé mensuel</h2>
        <div v-if="finances.monthly_summary.length === 0" class="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p class="text-sm text-gray-400">Aucune donnée disponible</p>
        </div>
        <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mois</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Livraisons</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Revenus</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="month in finances.monthly_summary" :key="month.month">
                <td class="px-4 py-3 font-medium text-gray-900">{{ month.month }}</td>
                <td class="px-4 py-3 text-right text-gray-600">{{ month.deliveries }}</td>
                <td class="px-4 py-3 text-right font-semibold text-gray-900">{{ formatPrice(month.earnings) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Withdrawal History -->
      <div>
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Historique des retraits</h2>
        <div v-if="finances.withdrawals.length === 0" class="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p class="text-sm text-gray-400">Aucun retrait effectué</p>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="w in finances.withdrawals"
            :key="w.id"
            class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">{{ formatPrice(w.amount) }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(w.created_at) }}</p>
            </div>
            <span
              class="text-xs font-medium px-2 py-0.5 rounded-full"
              :class="getWithdrawalStatusClass(w.status)"
            >
              {{ getWithdrawalLabel(w.status) }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Withdrawal Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showWithdrawModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div class="absolute inset-0 bg-black/50" @click="showWithdrawModal = false"></div>
          <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl">
            <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">Demander un retrait</h2>
              <button @click="showWithdrawModal = false" class="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form @submit.prevent="handleWithdrawal" class="p-5 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
                <input
                  v-model.number="withdrawAmount"
                  type="number"
                  min="1"
                  :max="finances.available_balance"
                  step="0.01"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  :placeholder="`Maximum : ${formatPrice(finances.available_balance)}`"
                />
                <p class="text-xs text-gray-400 mt-1">Solde disponible : {{ formatPrice(finances.available_balance) }}</p>
              </div>
              <div v-if="withdrawError" class="bg-red-50 border border-red-200 rounded-lg p-3">
                <p class="text-sm text-red-700">{{ withdrawError }}</p>
              </div>
              <button
                type="submit"
                :disabled="isWithdrawing || !withdrawAmount || withdrawAmount <= 0"
                class="w-full py-3 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg v-if="isWithdrawing" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Demander le retrait
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import type { PartnerFinances } from '~/composables/usePartnerDashboard'

definePageMeta({ layout: 'dashboard-courier' })

const router = useRouter()
const { isPartner, getPartnerFinances, requestPartnerWithdrawal } = usePartnerDashboard()
const { courierUser } = useCourierDashboard()
const showToast = inject<(msg: string, type: 'success' | 'error') => void>('showToast', () => {})

const isLoading = ref(true)
const error = ref('')
const finances = ref<PartnerFinances>({
  total_earnings: 0,
  pending_earnings: 0,
  available_balance: 0,
  commission_rate: 0,
  total_deliveries: 0,
  couriers_breakdown: [],
  monthly_summary: [],
  withdrawals: []
})

const showWithdrawModal = ref(false)
const withdrawAmount = ref<number>(0)
const isWithdrawing = ref(false)
const withdrawError = ref('')

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

const getWithdrawalLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Refusé',
    completed: 'Effectué'
  }
  return map[status] || status
}

const getWithdrawalStatusClass = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700'
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

const loadFinances = async () => {
  isLoading.value = true
  error.value = ''
  try {
    finances.value = await getPartnerFinances()
  } catch (err: any) {
    error.value = err.message || 'Impossible de charger les données financières'
  } finally {
    isLoading.value = false
  }
}

const handleWithdrawal = async () => {
  if (!withdrawAmount.value || withdrawAmount.value <= 0) return
  isWithdrawing.value = true
  withdrawError.value = ''
  try {
    await requestPartnerWithdrawal(withdrawAmount.value)
    showToast('Demande de retrait envoyée avec succès', 'success')
    showWithdrawModal.value = false
    withdrawAmount.value = 0
    await loadFinances()
  } catch (err: any) {
    withdrawError.value = err.message || 'Erreur lors de la demande de retrait'
  } finally {
    isWithdrawing.value = false
  }
}

onMounted(async () => {
  if (courierUser.value && !isPartner.value) {
    router.push('/dashboard-courier/livraisons')
    return
  }
  await loadFinances()
})
</script>

<style scoped>
.modal-enter-active { transition: all 0.3s ease-out; }
.modal-leave-active { transition: all 0.2s ease-in; }
.modal-enter-from { opacity: 0; }
.modal-leave-to { opacity: 0; }
</style>
