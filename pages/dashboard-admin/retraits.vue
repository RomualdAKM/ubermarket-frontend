<template>
  <div>
    <NuxtLayout name="dashboard-admin">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Gestion des retraits</h1>
        <p class="text-sm text-gray-500 mt-1">Gérez les demandes de retrait des vendeurs</p>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">En attente</p>
              <p class="text-xl font-bold text-gray-900">{{ stats.pending ?? 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Approuvés</p>
              <p class="text-xl font-bold text-gray-900">{{ stats.approved ?? 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Complétés</p>
              <p class="text-xl font-bold text-gray-900">{{ stats.completed ?? 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Total montants</p>
              <p class="text-xl font-bold text-gray-900">{{ formatCurrency(stats.total_amount ?? 0) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <label class="text-sm font-medium text-gray-700">Filtrer par statut :</label>
          <select
            v-model="selectedStatus"
            @change="loadWithdrawals(1)"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="">Tous</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="completed">Complétés</option>
            <option value="rejected">Rejetés</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <!-- Loading -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-flex items-center gap-2 text-gray-500">
            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Chargement...</span>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="withdrawals.length === 0" class="p-8 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"/></svg>
          <p class="text-gray-500 text-sm">Aucune demande de retrait trouvée</p>
        </div>

        <!-- Table content -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Vendeur</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Montant</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Méthode</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="withdrawal in withdrawals" :key="withdrawal.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <span class="font-medium text-gray-900">{{ withdrawal.user?.name || withdrawal.vendor_name || '—' }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="font-semibold text-gray-900">{{ formatCurrency(withdrawal.amount) }}</span>
                </td>
                <td class="px-4 py-3 text-gray-600">
                  {{ withdrawal.payment_method || '—' }}
                </td>
                <td class="px-4 py-3">
                  <span :class="statusBadgeClass(withdrawal.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ statusLabel(withdrawal.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-500">
                  {{ formatDate(withdrawal.created_at) }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <!-- Pending actions -->
                    <template v-if="withdrawal.status === 'pending'">
                      <button
                        @click="confirmAction('approve', withdrawal)"
                        :disabled="actionLoading"
                        class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
                      >
                        Approuver
                      </button>
                      <button
                        @click="openRejectModal(withdrawal)"
                        :disabled="actionLoading"
                        class="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        Rejeter
                      </button>
                    </template>
                    <!-- Approved actions -->
                    <template v-else-if="withdrawal.status === 'approved'">
                      <button
                        @click="confirmAction('complete', withdrawal)"
                        :disabled="actionLoading"
                        class="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                      >
                        Marquer complété
                      </button>
                    </template>
                    <!-- No actions for completed/rejected -->
                    <template v-else>
                      <span class="text-xs text-gray-400">—</span>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.lastPage > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            Page {{ pagination.currentPage }} sur {{ pagination.lastPage }}
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="loadWithdrawals(pagination.currentPage - 1)"
              :disabled="pagination.currentPage <= 1"
              class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <button
              @click="loadWithdrawals(pagination.currentPage + 1)"
              :disabled="pagination.currentPage >= pagination.lastPage"
              class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <Teleport to="body">
        <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeConfirmModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ confirmModalTitle }}</h3>
            <p class="text-sm text-gray-600 mb-4">{{ confirmModalMessage }}</p>
            <div class="flex items-center justify-end gap-3">
              <button
                @click="closeConfirmModal"
                :disabled="actionLoading"
                class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                @click="executeAction"
                :disabled="actionLoading"
                class="px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50"
                :class="confirmActionColor"
              >
                <span v-if="actionLoading" class="inline-flex items-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </span>
                <span v-else>Confirmer</span>
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Reject Modal -->
      <Teleport to="body">
        <div v-if="showRejectModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeRejectModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Rejeter la demande de retrait</h3>
            <p class="text-sm text-gray-600 mb-4">Veuillez indiquer la raison du rejet :</p>
            <textarea
              v-model="rejectReason"
              rows="3"
              placeholder="Raison du rejet..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            ></textarea>
            <div class="flex items-center justify-end gap-3 mt-4">
              <button
                @click="closeRejectModal"
                :disabled="actionLoading"
                class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                @click="executeReject"
                :disabled="actionLoading || !rejectReason.trim()"
                class="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <span v-if="actionLoading" class="inline-flex items-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </span>
                <span v-else>Confirmer le rejet</span>
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Toast notification -->
      <Teleport to="body">
        <Transition name="toast">
          <div v-if="toast.show" class="fixed top-4 right-4 z-[110] max-w-sm">
            <div :class="toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'" class="rounded-lg border px-4 py-3 shadow-lg">
              <p class="text-sm font-medium">{{ toast.message }}</p>
            </div>
          </div>
        </Transition>
      </Teleport>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

definePageMeta({
  layout: false
})

const { fetchWithdrawals, fetchWithdrawalStats, approveWithdrawal, completeWithdrawal, rejectWithdrawal } = useAdminDashboard()

// State
const loading = ref(true)
const actionLoading = ref(false)
const withdrawals = ref<any[]>([])
const selectedStatus = ref('')
const stats = reactive({
  pending: 0,
  approved: 0,
  completed: 0,
  total_amount: 0
})
const pagination = reactive({
  currentPage: 1,
  lastPage: 1
})

// Modals
const showConfirmModal = ref(false)
const confirmModalTitle = ref('')
const confirmModalMessage = ref('')
const confirmActionColor = ref('bg-indigo-600 hover:bg-indigo-700')
const pendingAction = ref<{ type: string; withdrawal: any } | null>(null)

const showRejectModal = ref(false)
const rejectReason = ref('')
const rejectTarget = ref<any>(null)

// Toast
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.show = true
  toast.message = message
  toast.type = type
  setTimeout(() => { toast.show = false }, 3000)
}

// Format helpers
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

const formatDate = (date: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    approved: 'Approuvé',
    completed: 'Complété',
    rejected: 'Rejeté'
  }
  return labels[status] || status
}

const statusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Data loading
const loadStats = async () => {
  try {
    const data = await fetchWithdrawalStats()
    if (data?.stats) {
      stats.pending = data.stats.pending_count ?? 0
      stats.approved = data.stats.approved_count ?? 0
      stats.completed = data.stats.total_completed ?? 0
      stats.total_amount = data.stats.total_completed_amount ?? 0
    }
  } catch (e: any) {
    console.error('Erreur chargement stats:', e)
  }
}

const loadWithdrawals = async (page: number = 1) => {
  loading.value = true
  try {
    const params: any = { page }
    if (selectedStatus.value) params.status = selectedStatus.value
    const data = await fetchWithdrawals(params)
    const paginated = data.withdrawals || data
    withdrawals.value = paginated.data || []
    pagination.currentPage = paginated.current_page || page
    pagination.lastPage = paginated.last_page || 1
  } catch (e: any) {
    showToast('Erreur lors du chargement des retraits', 'error')
  } finally {
    loading.value = false
  }
}

// Actions
const confirmAction = (type: string, withdrawal: any) => {
  pendingAction.value = { type, withdrawal }
  if (type === 'approve') {
    confirmModalTitle.value = 'Approuver le retrait'
    confirmModalMessage.value = `Voulez-vous approuver le retrait de ${formatCurrency(withdrawal.amount)} pour ${withdrawal.user?.name || withdrawal.vendor_name || 'ce vendeur'} ?`
    confirmActionColor.value = 'bg-blue-600 hover:bg-blue-700'
  } else if (type === 'complete') {
    confirmModalTitle.value = 'Marquer comme complété'
    confirmModalMessage.value = `Voulez-vous marquer ce retrait de ${formatCurrency(withdrawal.amount)} comme complété ?`
    confirmActionColor.value = 'bg-green-600 hover:bg-green-700'
  }
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  pendingAction.value = null
}

const executeAction = async () => {
  if (!pendingAction.value) return
  actionLoading.value = true
  try {
    const { type, withdrawal } = pendingAction.value
    if (type === 'approve') {
      await approveWithdrawal(withdrawal.id)
      showToast('Retrait approuvé avec succès')
    } else if (type === 'complete') {
      await completeWithdrawal(withdrawal.id)
      showToast('Retrait marqué comme complété')
    }
    closeConfirmModal()
    await loadWithdrawals(pagination.currentPage)
    await loadStats()
  } catch (e: any) {
    showToast(e.message || 'Une erreur est survenue', 'error')
  } finally {
    actionLoading.value = false
  }
}

const openRejectModal = (withdrawal: any) => {
  rejectTarget.value = withdrawal
  rejectReason.value = ''
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  rejectTarget.value = null
  rejectReason.value = ''
}

const executeReject = async () => {
  if (!rejectTarget.value || !rejectReason.value.trim()) return
  actionLoading.value = true
  try {
    await rejectWithdrawal(rejectTarget.value.id, rejectReason.value.trim())
    showToast('Retrait rejeté avec succès')
    closeRejectModal()
    await loadWithdrawals(pagination.currentPage)
    await loadStats()
  } catch (e: any) {
    showToast(e.message || 'Une erreur est survenue', 'error')
  } finally {
    actionLoading.value = false
  }
}

// Init
onMounted(async () => {
  await Promise.all([loadStats(), loadWithdrawals()])
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
