<template>
  <div>
    <!-- Page title -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Tableau de bord</h1>
      <p class="text-sm text-gray-500 mt-1">Vue d'ensemble de la plateforme</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-gray-200 p-5 h-64 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div class="h-full bg-gray-100 rounded"></div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5 h-64 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div class="space-y-3">
            <div v-for="j in 5" :key="j" class="h-6 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="stats" class="space-y-6">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Boutiques actives -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-500">Boutiques actives</p>
            <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72"/>
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.shops?.active ?? 0 }}</p>
          <p class="text-xs text-gray-400 mt-1">sur {{ stats.shops?.total ?? 0 }} au total</p>
        </div>

        <!-- Utilisateurs totaux -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-500">Utilisateurs totaux</p>
            <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.users?.total ?? 0 }}</p>
          <p class="text-xs text-gray-400 mt-1">+{{ stats.this_month?.new_users ?? 0 }} ce mois</p>
        </div>

        <!-- Commandes du mois -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-500">Commandes du mois</p>
            <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.this_month?.orders ?? 0 }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ stats.orders?.total ?? 0 }} au total</p>
        </div>

        <!-- Revenus du mois -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-500">Revenus du mois</p>
            <div class="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatCurrency(stats.revenue?.this_month ?? 0) }}</p>
          <p class="text-xs text-gray-400 mt-1">Total : {{ formatCurrency(stats.revenue?.total ?? 0) }}</p>
        </div>
      </div>

      <!-- Pending withdrawals alert -->
      <div v-if="stats.pending_withdrawals > 0" class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-amber-800">{{ stats.pending_withdrawals }} demande(s) de retrait en attente</p>
            <p class="text-xs text-amber-600">Des vendeurs attendent la validation de leurs retraits</p>
          </div>
        </div>
        <NuxtLink to="/dashboard-admin/retraits" class="text-sm font-medium text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
          Voir les retraits
        </NuxtLink>
      </div>

      <!-- Charts + Recent sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weekly orders chart -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Commandes des 7 derniers jours</h3>
          <div class="flex items-end justify-between gap-2 h-40">
            <div
              v-for="(day, index) in weeklyOrders"
              :key="index"
              class="flex flex-col items-center flex-1 gap-1"
            >
              <span class="text-xs font-medium text-gray-600">{{ day.count }}</span>
              <div
                class="w-full rounded-t-md bg-indigo-500 transition-all duration-300"
                :style="{ height: getBarHeight(day.count) + '%', minHeight: day.count > 0 ? '8px' : '2px' }"
              ></div>
              <span class="text-[10px] text-gray-400 mt-1">{{ day.label }}</span>
            </div>
          </div>
        </div>

        <!-- Recent users -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Derniers utilisateurs inscrits</h3>
          <div class="space-y-3">
            <div
              v-for="user in recentUsers"
              :key="user.id"
              class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span class="text-xs font-semibold text-gray-600">{{ getInitials(user.name) }}</span>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ user.name }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ user.email }}</p>
                </div>
              </div>
              <div class="text-right flex-shrink-0 ml-2">
                <span class="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full" :class="getRoleBadgeClass(user.role)">
                  {{ getRoleLabel(user.role) }}
                </span>
                <p class="text-[10px] text-gray-400 mt-0.5">{{ formatDate(user.created_at) }}</p>
              </div>
            </div>
            <p v-if="!recentUsers.length" class="text-sm text-gray-400 text-center py-4">Aucun utilisateur récent</p>
          </div>
        </div>
      </div>

      <!-- Recent orders -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Dernières commandes</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm" v-if="recentOrders.length">
            <thead>
              <tr class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <th class="pb-3 pr-4">Réf.</th>
                <th class="pb-3 pr-4">Client</th>
                <th class="pb-3 pr-4 hidden sm:table-cell">Boutique</th>
                <th class="pb-3 pr-4">Montant</th>
                <th class="pb-3 pr-4">Statut</th>
                <th class="pb-3">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="py-2.5 pr-4 font-medium text-gray-900">#{{ order.order_number || order.id }}</td>
                <td class="py-2.5 pr-4 text-gray-600">{{ order.customer_name || order.user?.name || '—' }}</td>
                <td class="py-2.5 pr-4 text-gray-600 hidden sm:table-cell">{{ order.shop_name || order.shop?.name || '—' }}</td>
                <td class="py-2.5 pr-4 font-medium text-gray-900">{{ formatCurrency(order.total_amount || 0) }}</td>
                <td class="py-2.5 pr-4">
                  <span class="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full" :class="getStatusBadgeClass(order.order_status)">
                    {{ getStatusLabel(order.order_status) }}
                  </span>
                </td>
                <td class="py-2.5 text-gray-400 text-xs">{{ formatDate(order.created_at) }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-sm text-gray-400 text-center py-4">Aucune commande récente</p>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-700 font-medium">{{ error }}</p>
      <button @click="loadStats" class="mt-3 text-sm text-red-600 hover:text-red-800 underline">Réessayer</button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-admin'
})

const { fetchAdminStats } = useAdminDashboard()

const loading = ref(true)
const error = ref('')
const stats = ref<any>(null)

const recentUsers = computed(() => stats.value?.recent_users || [])
const recentOrders = computed(() => stats.value?.recent_orders || [])

// Weekly orders — derive from recent orders or use placeholder data
const weeklyOrders = computed(() => {
  if (stats.value?.weekly_orders) {
    return stats.value.weekly_orders
  }
  // Fallback: generate last 7 days labels with 0 counts
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    result.push({ label: days[d.getDay()], count: 0 })
  }
  return result
})

const getBarHeight = (count: number) => {
  const max = Math.max(...weeklyOrders.value.map((d: any) => d.count), 1)
  return Math.round((count / max) * 100)
}

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1).replace('.', ',') + 'M FCFA'
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1).replace('.', ',') + 'k FCFA'
  }
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getInitials = (name: string) => {
  if (!name) return '?'
  const words = name.trim().split(' ')
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    vendor: 'Vendeur',
    client: 'Client',
    courier: 'Livreur',
    super_admin: 'Admin'
  }
  return labels[role] || role
}

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    vendor: 'bg-indigo-50 text-indigo-700',
    client: 'bg-emerald-50 text-emerald-700',
    courier: 'bg-amber-50 text-amber-700',
    super_admin: 'bg-rose-50 text-rose-700'
  }
  return classes[role] || 'bg-gray-50 text-gray-700'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En cours',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    refunded: 'Remboursée'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    processing: 'bg-indigo-50 text-indigo-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
    refunded: 'bg-gray-100 text-gray-700'
  }
  return classes[status] || 'bg-gray-50 text-gray-700'
}

const loadStats = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchAdminStats()
    stats.value = data.stats
  } catch (e: any) {
    error.value = e.message || 'Impossible de charger les statistiques'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>
