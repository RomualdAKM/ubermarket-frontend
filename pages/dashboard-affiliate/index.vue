<template>
  <div class="space-y-6">
    <!-- Accueil personnalisé -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <h1 class="text-xl font-semibold text-gray-900">
        Bienvenue {{ affiliate?.first_name }} 👋
      </h1>
      <p class="text-gray-500 mt-1">
        Pour rappel, votre code est :
        <span class="font-mono font-bold text-primary text-lg ml-2">{{ affiliate?.referral_code }}</span>
      </p>

      <!-- Lien d'affiliation principal -->
      <div class="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p class="text-sm font-medium text-gray-700 mb-2">Votre lien d'affiliation :</p>
        <div class="flex items-center gap-3">
          <code class="flex-1 text-sm text-primary break-all bg-white px-3 py-2 rounded border border-primary/20">
            {{ affiliateLink }}
          </code>
          <button @click="copyLink(affiliateLink)"
            class="px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-secondary transition-colors whitespace-nowrap">
            {{ copied ? '✓ Copié' : 'Copier' }}
          </button>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Clics totaux</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats?.total_clicks ?? 0 }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Clients</p>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ stats?.total_clients ?? 0 }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Réservations</p>
        <p class="text-3xl font-bold text-blue-600 mt-2">0</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Commissions payées</p>
        <p class="text-3xl font-bold text-purple-600 mt-2">
          {{ formatCurrency(stats?.total_commissions ?? 0) }}
        </p>
      </div>
    </div>

    <!-- Liens par pack -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <h2 class="text-base font-semibold text-gray-900 mb-4">Liens d'affiliation par pack</h2>
      <div class="space-y-3">
        <div v-for="pack in packs" :key="pack.code"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <span class="text-sm font-medium text-gray-900">{{ pack.name }}</span>
            <code class="ml-3 text-xs text-gray-500 break-all">{{ getPackLink(pack.code) }}</code>
          </div>
          <button @click="copyLink(getPackLink(pack.code))"
            class="ml-3 px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-secondary transition-colors whitespace-nowrap flex-shrink-0">
            Copier
          </button>
        </div>
      </div>
    </div>

    <!-- Filtre période + Performance -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 class="text-base font-semibold text-gray-900">📊 Performance par pack</h2>
        <div class="flex items-center gap-3">
          <select v-model="period" @change="loadStats"
            class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
          <select v-model="perPage"
            class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option :value="10">10 lignes</option>
            <option :value="50">50 lignes</option>
            <option :value="100">100 lignes</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <th class="pb-3 pr-4">Pack</th>
              <th class="pb-3 pr-4">Clics</th>
              <th class="pb-3 pr-4">Clients</th>
              <th class="pb-3 pr-4">Revenu</th>
              <th class="pb-3">Commissions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="row in paginatedPerformance" :key="row.pack_code">
              <td class="py-3 pr-4 font-medium text-gray-900">{{ row.pack }}</td>
              <td class="py-3 pr-4 text-gray-600">{{ row.clicks }}</td>
              <td class="py-3 pr-4 text-gray-600">{{ row.clients }}</td>
              <td class="py-3 pr-4 text-gray-600">{{ formatCurrency(row.revenue) }}</td>
              <td class="py-3 font-medium text-green-600">{{ formatCurrency(row.commission) }}</td>
            </tr>
            <tr v-if="!stats?.performance?.length" class="text-gray-400">
              <td colspan="5" class="py-6 text-center">Aucune donnée pour cette période</td>
            </tr>
          </tbody>
          <tfoot v-if="stats?.performance?.length" class="border-t-2 border-gray-200">
            <tr class="font-semibold text-gray-900">
              <td class="py-3 pr-4">Total</td>
              <td class="py-3 pr-4">{{ stats?.total_clicks ?? 0 }}</td>
              <td class="py-3 pr-4">{{ stats?.total_clients ?? 0 }}</td>
              <td class="py-3 pr-4">{{ formatCurrency(stats?.total_revenue ?? 0) }}</td>
              <td class="py-3 text-green-600">{{ formatCurrency(stats?.total_commissions ?? 0) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard-affiliate' })

const config = useRuntimeConfig()
const router = useRouter()

const affiliate = ref<any>(null)
const stats = ref<any>(null)
const loading = ref(false)
const period = ref('month')
const perPage = ref(10)
const copied = ref(false)

const packs = [
  { name: 'Welcome', code: 'welcome' },
  { name: 'Gratuit', code: 'gratuit' },
  { name: 'Standard', code: 'standard' },
  { name: 'Premium', code: 'premium' },
]

const affiliateLink = computed(() => {
  if (!affiliate.value?.referral_code) return ''
  return `${window.location.origin}/inscription-vendeur?ref=${affiliate.value.referral_code}`
})

const getPackLink = (packCode: string) => {
  if (!affiliate.value?.referral_code) return ''
  return `${config.public.apiBase.replace('/api', '')}/api/affiliate/track/${affiliate.value.referral_code}?pack=${packCode}`
}

const paginatedPerformance = computed(() => {
  return (stats.value?.performance || []).slice(0, perPage.value)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const copyLink = async (link: string) => {
  await navigator.clipboard.writeText(link)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const loadStats = async () => {
  loading.value = true
  const token = localStorage.getItem('affiliate_token')
  if (!token) { router.push('/connexion-affilie'); return }
  try {
    const response = await fetch(
      `${config.public.apiBase}/affiliate/stats?period=${period.value}`,
      { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }
    )
    const data = await response.json()
    if (data.success) stats.value = data.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const token = localStorage.getItem('affiliate_token')
  const data = localStorage.getItem('affiliate_data')
  if (!token) { router.push('/connexion-affilie'); return }
  if (data) affiliate.value = JSON.parse(data)
  loadStats()
})
</script>