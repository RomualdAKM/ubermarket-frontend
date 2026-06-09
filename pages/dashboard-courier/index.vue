<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span class="text-white text-sm font-bold">L</span>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ courier?.name }}</p>
            <p class="text-xs text-gray-500 capitalize">
              {{ courier?.courier_type === 'pro' ? 'Livreur pro' : 'Livreur indépendant' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <!-- Disponibilité -->
          <select v-model="availability" @change="updateAvailability"
            class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none"
            :class="availability === 'available' ? 'border-green-300 text-green-700 bg-green-50' :
                    availability === 'busy' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                    'border-red-300 text-red-700 bg-red-50'">
            <option value="available">🟢 Disponible</option>
            <option value="busy">🟡 Occupé</option>
            <option value="unavailable">🔴 Indisponible</option>
          </select>
          <button @click="handleLogout"
            class="text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50">
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-6 space-y-6">

      <!-- KPIs -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-gray-900">{{ stats?.total_deliveries ?? 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Total livraisons</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ stats?.delivered ?? 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Livrées</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-blue-600">{{ stats?.pending ?? 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">En cours</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-purple-600">
            {{ formatCurrency(stats?.total_commissions ?? 0) }}
          </p>
          <p class="text-xs text-gray-500 mt-1">Commissions</p>
        </div>
      </div>

      <!-- Livraisons en cours -->
      <div>
        <h2 class="text-base font-semibold text-gray-900 mb-3">Livraisons en cours</h2>
        <div v-if="activeDeliveries.length === 0"
          class="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400">
          Aucune livraison en cours
        </div>
        <div v-else class="space-y-3">
          <div v-for="d in activeDeliveries" :key="d.id"
            class="bg-white border border-gray-200 rounded-xl p-5">
            <div class="flex items-start justify-between mb-3">
              <div>
                <span class="font-mono text-sm font-bold text-gray-900">{{ d.tracking_code }}</span>
                <span :class="statusClass(d.status)"
                  class="ml-2 px-2 py-0.5 text-xs rounded-full font-medium">
                  {{ statusLabel(d.status) }}
                </span>
              </div>
              <span class="text-xs text-gray-400">{{ formatDate(d.assigned_at) }}</span>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
              <div>
                <span class="text-xs text-gray-400 block">Commande</span>
                #{{ d.order_id }}
              </div>
              <div>
                <span class="text-xs text-gray-400 block">Type</span>
                {{ d.delivery_type === 'express' ? '⚡ Express' : '🚚 Standard' }}
              </div>
              <div v-if="d.distance_km">
                <span class="text-xs text-gray-400 block">Distance</span>
                {{ d.distance_km }} km
              </div>
              <div v-if="d.total_price">
                <span class="text-xs text-gray-400 block">Montant</span>
                {{ formatCurrency(d.total_price) }}
              </div>
            </div>

            <!-- Actions selon statut -->
            <div class="flex gap-2">
              <button v-if="d.status === 'assigned'"
                @click="acceptDelivery(d.id)"
                class="flex-1 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors">
                ✓ Prendre en charge
              </button>
              <button v-if="d.status === 'picked_up'"
                @click="markInTransit(d.id)"
                class="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                🚚 Marquer en transit
              </button>
              <button v-if="d.status === 'in_transit'"
                @click="openConfirmModal(d)"
                class="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                ✓ Valider la livraison
              </button>
              <!-- Partage GPS -->
              <button v-if="['assigned','picked_up','in_transit'].includes(d.status)"
                @click="shareLocation"
                class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                📍 Partager position
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Historique -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-semibold text-gray-900">Historique</h2>
          <select v-model="period" @change="loadStats"
            class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs">
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>

        <div v-if="completedDeliveries.length === 0"
          class="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400">
          Aucune livraison terminée
        </div>

        <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
              <tr>
                <th class="px-4 py-3 text-left">Code</th>
                <th class="px-4 py-3 text-left">Statut</th>
                <th class="px-4 py-3 text-left">Distance</th>
                <th class="px-4 py-3 text-left">Montant</th>
                <th class="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="d in completedDeliveries" :key="d.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-mono text-xs font-medium text-gray-900">{{ d.tracking_code }}</td>
                <td class="px-4 py-3">
                  <span :class="statusClass(d.status)" class="px-2 py-0.5 text-xs rounded-full font-medium">
                    {{ statusLabel(d.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-600">{{ d.distance_km ? d.distance_km + ' km' : '—' }}</td>
                <td class="px-4 py-3 text-gray-900">{{ d.total_price ? formatCurrency(d.total_price) : '—' }}</td>
                <td class="px-4 py-3 text-gray-500 text-xs">{{ formatDate(d.delivered_at || d.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal validation réception -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showConfirmModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Valider la livraison</h3>
          <p class="text-sm text-gray-500 mb-4">
            Demandez au client son code de réception à 6 chiffres.
          </p>
          <input v-model="receptionCode" type="text" maxlength="6"
            placeholder="Code à 6 chiffres"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary mb-4" />
          <div v-if="confirmError" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
            {{ confirmError }}
          </div>
          <div class="flex gap-3">
            <button @click="showConfirmModal = false"
              class="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button @click="confirmDelivery" :disabled="confirming"
              class="flex-1 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50">
              {{ confirming ? 'Validation...' : 'Valider' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const router = useRouter()
const config = useRuntimeConfig()

const courier   = ref<any>(null)
const stats     = ref<any>(null)
const deliveries = ref<any[]>([])
const period    = ref('month')
const availability = ref('available')

const activeDeliveries    = computed(() => deliveries.value.filter(d => ['assigned','picked_up','in_transit'].includes(d.status)))
const completedDeliveries = computed(() => deliveries.value.filter(d => ['delivered','failed'].includes(d.status)))

// Confirmation
const showConfirmModal = ref(false)
const confirmingDelivery = ref<any>(null)
const receptionCode = ref('')
const confirmError  = ref('')
const confirming    = ref(false)

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('courier_token')
  const response = await fetch(`${config.public.apiBase}${endpoint}`, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers as any || {})
    }
  })
  const data = await response.json()
  if (!response.ok || !data.success) throw new Error(data.message || 'Erreur')
  return data
}

const loadCourier = async () => {
  try {
    const data = await apiRequest('/courier/me')
    courier.value = data.courier
    availability.value = courier.value.availability || 'available'
  } catch {
    router.push('/connexion-livreur')
  }
}

const loadDeliveries = async () => {
  try {
    const data = await apiRequest('/courier/deliveries')
    deliveries.value = data.data?.data || data.data || []
  } catch {}
}

const loadStats = async () => {
  try {
    const data = await apiRequest(`/courier/stats?period=${period.value}`)
    stats.value = data.data
  } catch {}
}

const updateAvailability = async () => {
  try {
    await apiRequest('/courier/me', {
      method: 'PUT',
      body: JSON.stringify({ availability: availability.value })
    })
  } catch {}
}

// Partage GPS
let gpsInterval: ReturnType<typeof setInterval> | null = null

const shareLocation = () => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      await apiRequest('/courier/location', {
        method: 'POST',
        body: JSON.stringify({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        })
      })
    } catch {}
  })
}

const startGpsSharing = () => {
  shareLocation()
  gpsInterval = setInterval(shareLocation, 120000) // toutes les 2min
}

const acceptDelivery = async (id: number) => {
  try {
    await apiRequest(`/courier/deliveries/${id}/accept`, { method: 'POST' })
    await loadDeliveries()
    startGpsSharing()
  } catch {}
}

const markInTransit = async (id: number) => {
  try {
    await apiRequest(`/courier/deliveries/${id}/transit`, { method: 'POST' })
    await loadDeliveries()
  } catch {}
}

const openConfirmModal = (delivery: any) => {
  confirmingDelivery.value = delivery
  receptionCode.value = ''
  confirmError.value  = ''
  showConfirmModal.value = true
}

const confirmDelivery = async () => {
  if (!confirmingDelivery.value || !receptionCode.value) return
  confirming.value   = true
  confirmError.value = ''
  try {
    await apiRequest(`/courier/deliveries/${confirmingDelivery.value.id}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ reception_code: receptionCode.value })
    })
    showConfirmModal.value = false
    if (gpsInterval) clearInterval(gpsInterval)
    await loadDeliveries()
    await loadStats()
  } catch (err: any) {
    confirmError.value = err.message
  } finally {
    confirming.value = false
  }
}

const handleLogout = async () => {
  try { await apiRequest('/courier/logout', { method: 'POST' }) } catch {}
  localStorage.removeItem('courier_token')
  router.push('/connexion-livreur')
}

const formatCurrency = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—'

const statusClass = (s: string) => ({
  pending:    'bg-yellow-100 text-yellow-700',
  assigned:   'bg-blue-100 text-blue-700',
  picked_up:  'bg-indigo-100 text-indigo-700',
  in_transit: 'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  failed:     'bg-red-100 text-red-700',
}[s] || 'bg-gray-100 text-gray-700')

const statusLabel = (s: string) => ({
  pending:    'En attente',
  assigned:   'Assignée',
  picked_up:  'Prise en charge',
  in_transit: 'En transit',
  delivered:  'Livrée',
  failed:     'Échec',
}[s] || s)

onMounted(async () => {
  const token = localStorage.getItem('courier_token')
  if (!token) { router.push('/connexion-livreur'); return }
  await Promise.all([loadCourier(), loadDeliveries(), loadStats()])
})

onUnmounted(() => {
  if (gpsInterval) clearInterval(gpsInterval)
})
</script>