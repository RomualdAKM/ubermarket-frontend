<template>
  <div class="space-y-6">
    <h1 class="text-xl font-bold text-gray-900">Mes vendeurs parrainés</h1>

    <!-- Résumé -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total vendeurs</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ summary.total_vendors ?? 0 }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Commissions totales</p>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ formatCurrency(summary.total_commissions ?? 0) }}</p>
      </div>
    </div>

    <!-- Filtres -->
    <div class="flex flex-col sm:flex-row gap-3">
      <select v-model="period" @change="load"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="all">Toutes les périodes</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois</option>
        <option value="year">Cette année</option>
      </select>

      <select v-model="perPage" @change="load"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
        <option :value="10">10 par page</option>
        <option :value="50">50 par page</option>
        <option :value="100">100 par page</option>
      </select>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Tableau -->
    <div v-else-if="vendors.length > 0" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <tr>
              <th class="px-5 py-3 text-left">Vendeur</th>
              <th class="px-5 py-3 text-left">Plan</th>
              <th class="px-5 py-3 text-left">Inscrit le</th>
              <th class="px-5 py-3 text-left">Total payé</th>
              <th class="px-5 py-3 text-left">Ma commission</th>
              <th class="px-5 py-3 text-left">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="vendor in vendors" :key="vendor.id" class="hover:bg-gray-50">
              <td class="px-5 py-3">
                <div class="font-medium text-gray-900">{{ vendor.name }}</div>
                <div class="text-xs text-gray-400">{{ vendor.email }}</div>
              </td>
              <td class="px-5 py-3">
                <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium capitalize">
                  {{ vendor.plan_name || 'Welcome' }}
                </span>
              </td>
              <td class="px-5 py-3 text-gray-500 text-xs">{{ formatDate(vendor.created_at) }}</td>
              <td class="px-5 py-3 text-gray-700">{{ formatCurrency(vendor.total_paid ?? 0) }}</td>
              <td class="px-5 py-3 font-semibold text-green-600">{{ formatCurrency(vendor.commission_earned ?? 0) }}</td>
              <td class="px-5 py-3">
                <span :class="vendor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  class="px-2 py-0.5 text-xs rounded-full font-medium">
                  {{ vendor.status === 'active' ? 'Actif' : 'Suspendu' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1"
        class="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Page {{ pagination.current_page }} / {{ pagination.last_page }}
          — {{ pagination.total }} vendeur{{ pagination.total > 1 ? 's' : '' }}
        </p>
        <div class="flex gap-2">
          <button @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page <= 1"
            class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">
            Précédent
          </button>
          <button @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- Vide -->
    <div v-else class="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <p class="font-medium text-gray-600 mb-1">Aucun vendeur parrainé</p>
      <p class="text-sm">Partagez votre lien d'affiliation pour commencer à parrainer des vendeurs.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard-affiliate' })

const config = useRuntimeConfig()

const vendors    = ref<any[]>([])
const summary    = ref<any>({})
const loading    = ref(false)
const period     = ref('all')
const perPage    = ref(10)
const pagination = ref({ current_page: 1, last_page: 1, total: 0 })

const apiRequest = async (endpoint: string) => {
  const token = localStorage.getItem('affiliate_token')
  const response = await fetch(`${config.public.apiBase}${endpoint}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  return await response.json()
}

const load = async (page = 1) => {
  loading.value = true
  try {
    const data = await apiRequest(
      `/affiliate/referrals?period=${period.value}&per_page=${perPage.value}&page=${page}`
    )
    if (data.success) {
      vendors.value    = data.data.data || []
      summary.value    = data.summary || {}
      pagination.value = {
        current_page: data.data.current_page,
        last_page:    data.data.last_page,
        total:        data.data.total,
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page < 1 || page > pagination.value.last_page) return
  load(page)
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

onMounted(() => {
  const token = localStorage.getItem('affiliate_token')
  if (!token) { navigateTo('/connexion-affilie'); return }
  load()
})
</script>