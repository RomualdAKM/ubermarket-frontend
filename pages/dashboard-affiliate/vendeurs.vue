<template>
  <div>
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Mes vendeurs parrainés</h1>
        <p class="mt-1 text-sm text-gray-500">Suivez les vendeurs que vous avez parrainés et leur activité.</p>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <!-- Total vendeurs -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Total vendeurs</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalVendeurs }}</p>
            </div>
          </div>
        </div>

        <!-- Vendeurs actifs -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Vendeurs actifs</p>
              <p class="text-2xl font-bold text-gray-900">{{ vendeursActifs }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center">
        <div class="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p class="mt-3 text-sm text-gray-500">Chargement des vendeurs...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="referrals.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">Aucun vendeur parrainé</h3>
        <p class="text-sm text-gray-500 max-w-md mx-auto">
          Aucun vendeur parrainé pour le moment. Partagez votre code de parrainage pour commencer.
        </p>
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <!-- Desktop table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Nom</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Email</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Date d'inscription</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Plan abonnement</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Statut abonnement</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="vendor in referrals" :key="vendor.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900">{{ vendor.name }}</div>
                  <div class="text-xs text-gray-500 sm:hidden">{{ vendor.email }}</div>
                </td>
                <td class="px-4 py-3 text-gray-600 hidden sm:table-cell">{{ vendor.email }}</td>
                <td class="px-4 py-3 text-gray-600 hidden md:table-cell">{{ formatDate(vendor.created_at) }}</td>
                <td class="px-4 py-3 text-gray-600 hidden lg:table-cell">{{ vendor.subscription_plan || '—' }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    :class="statusBadgeClass(vendor.subscription_status)"
                  >
                    {{ statusLabel(vendor.subscription_status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.lastPage > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p class="text-sm text-gray-600">
            Page {{ pagination.currentPage }} sur {{ pagination.lastPage }}
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="goToPage(pagination.currentPage - 1)"
              :disabled="pagination.currentPage <= 1"
              class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <button
              @click="goToPage(pagination.currentPage + 1)"
              :disabled="pagination.currentPage >= pagination.lastPage"
              class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard-affiliate'
})

const { fetchReferrals } = useAffiliateDashboard()

const loading = ref(true)
const referrals = ref<any[]>([])
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  total: 0
})

const totalVendeurs = computed(() => pagination.value.total)
const vendeursActifs = computed(() =>
  referrals.value.filter((v: any) => v.subscription_status === 'active').length
)

const loadReferrals = async (page: number = 1) => {
  loading.value = true
  try {
    const response = await fetchReferrals({ page })
    referrals.value = response.data || []
    pagination.value = {
      currentPage: response.current_page || 1,
      lastPage: response.last_page || 1,
      total: response.total || 0
    }
  } catch (error) {
    console.error('Erreur lors du chargement des vendeurs parrainés:', error)
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    loadReferrals(page)
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700 border border-green-200'
    case 'expired':
      return 'bg-red-100 text-red-700 border border-red-200'
    default:
      return 'bg-gray-100 text-gray-600 border border-gray-200'
  }
}

const statusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Actif'
    case 'expired':
      return 'Expiré'
    default:
      return 'Aucun'
  }
}

onMounted(() => {
  loadReferrals()
})
</script>
