<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestion des livraisons</h1>
        <p class="text-sm text-gray-500 mt-1">Zones, tarifs et suivi des livraisons</p>
      </div>
    </div>

    <!-- KPIs globaux -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div v-for="kpi in kpis" :key="kpi.label"
        class="bg-white border border-gray-200 rounded-xl p-4 text-center">
        <p class="text-2xl font-bold" :class="kpi.color">{{ kpi.value }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ kpi.label }}</p>
      </div>
    </div>

    <!-- Onglets -->
    <div class="flex gap-1 border-b border-gray-200">
      <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
        class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === tab.value
          ? 'border-indigo-600 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'">
        {{ tab.label }}
      </button>
    </div>

    <!-- ===== ZONES INDÉPENDANTS ===== -->
    <div v-if="activeTab === 'zones'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-semibold text-gray-800">Zones de livraison — Livreurs indépendants</h2>
        <button @click="showZoneModal = true"
          class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
          + Ajouter une zone
        </button>
      </div>

      <!-- Filtres zones -->
      <div class="flex gap-3">
        <input v-model="zoneSearch" @input="loadZones" type="text" placeholder="Rechercher ville, pays..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        <select v-model="zoneActiveFilter" @change="loadZones"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">Tous les statuts</option>
          <option value="1">Actives</option>
          <option value="0">Inactives</option>
        </select>
      </div>

      <div v-if="zonesLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="zones.length === 0" class="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400">
        Aucune zone configurée
      </div>

      <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b">
            <tr>
              <th class="px-4 py-3 text-left">Zone</th>
              <th class="px-4 py-3 text-left">Boutique</th>
              <th class="px-4 py-3 text-left">Frais</th>
              <th class="px-4 py-3 text-left">Délai</th>
              <th class="px-4 py-3 text-left">Statut</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="zone in zones" :key="zone.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-900">{{ zone.city }}, {{ zone.country }}</td>
              <td class="px-4 py-3 text-gray-500">{{ zone.shop?.name || '—' }}</td>
              <td class="px-4 py-3 text-gray-700">{{ zone.shipping_cost }} FCFA</td>
              <td class="px-4 py-3 text-gray-600">{{ zone.estimated_days }}</td>
              <td class="px-4 py-3">
                <button @click="toggleZone(zone)"
                  :class="zone.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                  class="px-2 py-0.5 text-xs rounded-full font-medium hover:opacity-80">
                  {{ zone.is_active ? 'Active' : 'Inactive' }}
                </button>
              </td>
              <td class="px-4 py-3 text-right flex justify-end gap-2">
                <button @click="editZone(zone)" class="text-xs text-indigo-600 hover:text-indigo-800">Modifier</button>
                <button @click="deleteZone(zone.id)" class="text-xs text-red-500 hover:text-red-700">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="zonesPagination.lastPage > 1" class="px-4 py-3 border-t flex justify-between items-center">
          <p class="text-sm text-gray-500">Page {{ zonesPagination.currentPage }} / {{ zonesPagination.lastPage }}</p>
          <div class="flex gap-2">
            <button @click="loadZones(zonesPagination.currentPage - 1)" :disabled="zonesPagination.currentPage <= 1"
              class="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40">Précédent</button>
            <button @click="loadZones(zonesPagination.currentPage + 1)" :disabled="zonesPagination.currentPage >= zonesPagination.lastPage"
              class="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40">Suivant</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== COMPTES PRO ===== -->
    <div v-if="activeTab === 'pro'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-semibold text-gray-800">Comptes pro — Tarifs & Frais</h2>
        <select v-model="selectedProShop" @change="loadProData"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">Toutes les boutiques</option>
          <option v-for="shop in proShops" :key="shop.id" :value="shop.id">{{ shop.name }}</option>
        </select>
      </div>

      <!-- Tarifs distance -->
      <div>
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Tarifs à la distance</h3>
        <div v-if="pricingLoading" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
        <div v-else-if="allPricing.length === 0" class="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
          Aucun tarif distance configuré
        </div>
        <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b">
              <tr>
                <th class="px-4 py-3 text-left">Boutique</th>
                <th class="px-4 py-3 text-left">Distance</th>
                <th class="px-4 py-3 text-left">Standard</th>
                <th class="px-4 py-3 text-left">Express</th>
                <th class="px-4 py-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="p in allPricing" :key="p.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-600">{{ p.shop?.name || '—' }}</td>
                <td class="px-4 py-3 font-medium text-gray-900">{{ p.min_km }} – {{ p.max_km ?? '+∞' }} km</td>
                <td class="px-4 py-3 text-gray-700">{{ p.is_on_quote ? 'Sur devis' : p.standard_price + ' FCFA' }}</td>
                <td class="px-4 py-3 text-gray-700">{{ p.is_on_quote ? 'Sur devis' : p.express_price + ' FCFA' }}</td>
                <td class="px-4 py-3">
                  <span :class="p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                    class="px-2 py-0.5 text-xs rounded-full font-medium">
                    {{ p.is_active ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Frais additionnels -->
      <div>
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Frais additionnels</h3>
        <div v-if="allFees.length === 0" class="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
          Aucun frais additionnel configuré
        </div>
        <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b">
              <tr>
                <th class="px-4 py-3 text-left">Boutique</th>
                <th class="px-4 py-3 text-left">Libellé</th>
                <th class="px-4 py-3 text-left">Montant</th>
                <th class="px-4 py-3 text-left">Type</th>
                <th class="px-4 py-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="fee in allFees" :key="fee.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-600">{{ fee.shop?.name || '—' }}</td>
                <td class="px-4 py-3 font-medium text-gray-900">{{ fee.label }}</td>
                <td class="px-4 py-3" :class="fee.type === 'discount' ? 'text-red-600' : 'text-green-600'">
                  {{ fee.type === 'discount' ? '-' : '+' }}{{ fee.amount }} FCFA
                </td>
                <td class="px-4 py-3 text-gray-500">{{ fee.type === 'discount' ? 'Déduction' : 'Supplément' }}</td>
                <td class="px-4 py-3">
                  <span :class="fee.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                    class="px-2 py-0.5 text-xs rounded-full font-medium">
                    {{ fee.is_active ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== TOUTES LES LIVRAISONS ===== -->
    <div v-if="activeTab === 'deliveries'" class="space-y-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <select v-model="deliveryStatusFilter" @change="loadDeliveries(1)"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="assigned">Assignée</option>
          <option value="picked_up">Prise en charge</option>
          <option value="in_transit">En transit</option>
          <option value="delivered">Livrée</option>
          <option value="failed">Échec</option>
        </select>
        <select v-model="deliveryTypeFilter" @change="loadDeliveries(1)"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">Tous les types</option>
          <option value="independent">Indépendants</option>
          <option value="pro">Pro</option>
        </select>
        <input v-model="deliveryDateFrom" type="date" @change="loadDeliveries(1)"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        <input v-model="deliveryDateTo" type="date" @change="loadDeliveries(1)"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
      </div>

      <div v-if="deliveriesLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="deliveries.length === 0" class="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400">
        Aucune livraison trouvée
      </div>

      <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b">
              <tr>
                <th class="px-4 py-3 text-left">Code suivi</th>
                <th class="px-4 py-3 text-left">Boutique</th>
                <th class="px-4 py-3 text-left">Livreur</th>
                <th class="px-4 py-3 text-left">Type</th>
                <th class="px-4 py-3 text-left">Montant</th>
                <th class="px-4 py-3 text-left">Statut</th>
                <th class="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="d in deliveries" :key="d.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-mono text-xs font-bold text-gray-900">{{ d.tracking_code }}</td>
                <td class="px-4 py-3 text-gray-600">{{ d.order?.shop?.name || '—' }}</td>
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900">{{ d.courier?.name || '—' }}</div>
                  <div class="text-xs text-gray-400 capitalize">{{ d.courier?.courier_type === 'pro' ? 'Pro' : 'Indép.' }}</div>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 text-xs rounded-full"
                    :class="d.delivery_type === 'express' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'">
                    {{ d.delivery_type === 'express' ? 'Express' : 'Standard' }}
                  </span>
                </td>
                <td class="px-4 py-3 font-medium text-gray-900">
                  {{ d.total_price ? formatCurrency(d.total_price) : '—' }}
                </td>
                <td class="px-4 py-3">
                  <span :class="statusClass(d.status)" class="px-2 py-0.5 text-xs rounded-full font-medium">
                    {{ statusLabel(d.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-400 text-xs">{{ formatDate(d.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="deliveriesPagination.lastPage > 1" class="px-4 py-3 border-t flex justify-between items-center">
          <p class="text-sm text-gray-500">
            Page {{ deliveriesPagination.currentPage }} / {{ deliveriesPagination.lastPage }}
            — {{ deliveriesPagination.total }} livraisons
          </p>
          <div class="flex gap-2">
            <button @click="loadDeliveries(deliveriesPagination.currentPage - 1)"
              :disabled="deliveriesPagination.currentPage <= 1"
              class="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40">Précédent</button>
            <button @click="loadDeliveries(deliveriesPagination.currentPage + 1)"
              :disabled="deliveriesPagination.currentPage >= deliveriesPagination.lastPage"
              class="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40">Suivant</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL ZONE ===== -->
    <Teleport to="body">
      <div v-if="showZoneModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="closeZoneModal"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ editingZone ? 'Modifier la zone' : 'Ajouter une zone' }}
          </h3>
          <form @submit.prevent="saveZone" class="space-y-4">
            <!-- Sélection boutique -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Boutique *</label>
              <select v-model="zoneForm.shop_id" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="">Sélectionner une boutique</option>
                <option v-for="shop in allShops" :key="shop.id" :value="shop.id">{{ shop.name }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                <input v-model="zoneForm.country" required type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                <input v-model="zoneForm.city" required type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Frais (FCFA) *</label>
                <input v-model.number="zoneForm.shipping_cost" required type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Délai</label>
                <select v-model="zoneForm.estimated_days"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="24-48H">24-48H</option>
                  <option value="2-3 jours">2-3 jours</option>
                  <option value="3-5 jours">3-5 jours</option>
                  <option value="1 semaine">1 semaine</option>
                  <option value="Sur devis">Sur devis</option>
                </select>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="zoneForm.is_active" type="checkbox" id="zone-active" class="rounded text-indigo-600" />
              <label for="zone-active" class="text-sm text-gray-700">Zone active</label>
            </div>
            <div class="flex justify-end gap-3">
              <button type="button" @click="closeZoneModal"
                class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
              <button type="submit"
                class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard-admin' })

const config = useRuntimeConfig()
const { token } = useAuth()

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${config.public.apiBase}${endpoint}`, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`,
      ...(options.headers as any || {})
    }
  })
  const data = await response.json()
  if (!response.ok || !data.success) throw new Error(data.message || 'Erreur')
  return data
}

// ===== TABS =====
const activeTab = ref('zones')
const tabs = [
  { value: 'zones',      label: 'Zones (Indépendants)' },
  { value: 'pro',        label: 'Comptes Pro' },
  { value: 'deliveries', label: 'Toutes les livraisons' },
]

// ===== KPIs =====
const kpis = ref([
  { label: 'Total livraisons', value: 0, color: 'text-gray-900' },
  { label: 'En attente',       value: 0, color: 'text-yellow-600' },
  { label: 'En transit',       value: 0, color: 'text-blue-600' },
  { label: 'Livrées',          value: 0, color: 'text-green-600' },
  { label: 'Échouées',         value: 0, color: 'text-red-600' },
])

const loadKpis = async () => {
  try {
    const data = await apiRequest('/admin/deliveries/stats')
    const d = data.data
    kpis.value = [
      { label: 'Total livraisons', value: d.total,      color: 'text-gray-900' },
      { label: 'En attente',       value: d.pending,    color: 'text-yellow-600' },
      { label: 'En transit',       value: d.in_transit, color: 'text-blue-600' },
      { label: 'Livrées',          value: d.delivered,  color: 'text-green-600' },
      { label: 'Échouées',         value: d.failed,     color: 'text-red-600' },
    ]
  } catch {}
}

// ===== ZONES =====
const zones         = ref<any[]>([])
const zonesLoading  = ref(false)
const zoneSearch    = ref('')
const zoneActiveFilter = ref('')
const zonesPagination  = reactive({ currentPage: 1, lastPage: 1 })
const showZoneModal = ref(false)
const editingZone   = ref<any>(null)
const allShops      = ref<any[]>([])
const zoneForm      = reactive({
  shop_id: '', country: '', city: '',
  shipping_cost: 0, estimated_days: '24-48H', is_active: true
})

const loadZones = async (page = 1) => {
  zonesLoading.value = true
  try {
    let url = `/admin/delivery-zones?page=${page}`
    if (zoneSearch.value)      url += `&search=${zoneSearch.value}`
    if (zoneActiveFilter.value !== '') url += `&is_active=${zoneActiveFilter.value}`
    const data = await apiRequest(url)
    zones.value = data.data.data || []
    zonesPagination.currentPage = data.data.current_page
    zonesPagination.lastPage    = data.data.last_page
  } catch {} finally { zonesLoading.value = false }
}

const loadAllShops = async () => {
  try {
    const data = await apiRequest('/admin/shops?per_page=100')
    allShops.value = data.shops.data || []
  } catch {}
}

const editZone = (zone: any) => {
  editingZone.value = zone
  Object.assign(zoneForm, {
    shop_id: zone.shop_id, country: zone.country, city: zone.city,
    shipping_cost: zone.shipping_cost, estimated_days: zone.estimated_days, is_active: zone.is_active
  })
  showZoneModal.value = true
}

const toggleZone = async (zone: any) => {
  try {
    await apiRequest(`/admin/delivery-zones/${zone.id}/toggle`, { method: 'PATCH' })
    await loadZones(zonesPagination.currentPage)
  } catch {}
}

const deleteZone = async (id: number) => {
  if (!confirm('Supprimer cette zone ?')) return
  try {
    await apiRequest(`/admin/delivery-zones/${id}`, { method: 'DELETE' })
    await loadZones(zonesPagination.currentPage)
  } catch {}
}

const saveZone = async () => {
  try {
    if (editingZone.value) {
      await apiRequest(`/admin/delivery-zones/${editingZone.value.id}`, {
        method: 'PUT', body: JSON.stringify(zoneForm)
      })
    } else {
      await apiRequest('/admin/delivery-zones', { method: 'POST', body: JSON.stringify(zoneForm) })
    }
    await loadZones()
    closeZoneModal()
  } catch {}
}

const closeZoneModal = () => {
  showZoneModal.value = false
  editingZone.value   = null
  Object.assign(zoneForm, { shop_id:'', country:'', city:'', shipping_cost:0, estimated_days:'24-48H', is_active:true })
}

// ===== PRO =====
const allPricing      = ref<any[]>([])
const allFees         = ref<any[]>([])
const pricingLoading  = ref(false)
const proShops        = ref<any[]>([])
const selectedProShop = ref('')

const loadProData = async () => {
  pricingLoading.value = true
  try {
    const pUrl = `/admin/distance-pricing${selectedProShop.value ? `?shop_id=${selectedProShop.value}` : ''}`
    const fUrl = `/admin/delivery-fees${selectedProShop.value ? `?shop_id=${selectedProShop.value}` : ''}`
    const [pData, fData] = await Promise.all([apiRequest(pUrl), apiRequest(fUrl)])
    allPricing.value = pData.data || []
    allFees.value    = fData.data || []
  } catch {} finally { pricingLoading.value = false }
}

const loadProShops = async () => {
  try {
    const data = await apiRequest('/admin/delivery-shops')
    proShops.value = data.data || []
  } catch {}
}

// ===== LIVRAISONS =====
const deliveries       = ref<any[]>([])
const deliveriesLoading = ref(false)
const deliveryStatusFilter = ref('')
const deliveryTypeFilter   = ref('')
const deliveryDateFrom = ref('')
const deliveryDateTo   = ref('')
const deliveriesPagination = reactive({ currentPage: 1, lastPage: 1, total: 0 })

const loadDeliveries = async (page = 1) => {
  deliveriesLoading.value = true
  try {
    let url = `/admin/deliveries?page=${page}`
    if (deliveryStatusFilter.value) url += `&status=${deliveryStatusFilter.value}`
    if (deliveryTypeFilter.value)   url += `&courier_type=${deliveryTypeFilter.value}`
    if (deliveryDateFrom.value)     url += `&date_from=${deliveryDateFrom.value}`
    if (deliveryDateTo.value)       url += `&date_to=${deliveryDateTo.value}`
    const data = await apiRequest(url)
    deliveries.value = data.data.data || []
    deliveriesPagination.currentPage = data.data.current_page
    deliveriesPagination.lastPage    = data.data.last_page
    deliveriesPagination.total       = data.data.total
  } catch {} finally { deliveriesLoading.value = false }
}

// Helpers
const statusClass = (s: string) => ({
  pending:    'bg-yellow-100 text-yellow-700',
  assigned:   'bg-blue-100 text-blue-700',
  picked_up:  'bg-indigo-100 text-indigo-700',
  in_transit: 'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  failed:     'bg-red-100 text-red-700',
}[s] || 'bg-gray-100 text-gray-600')

const statusLabel = (s: string) => ({
  pending:    'En attente',
  assigned:   'Assignée',
  picked_up:  'Prise en charge',
  in_transit: 'En transit',
  delivered:  'Livrée',
  failed:     'Échec',
}[s] || s)

const formatCurrency = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'

// Chargement selon onglet actif
watch(activeTab, (tab) => {
  if (tab === 'zones')      loadZones()
  if (tab === 'pro')        loadProData()
  if (tab === 'deliveries') loadDeliveries()
})

onMounted(async () => {
  await Promise.all([loadKpis(), loadAllShops(), loadProShops(), loadZones()])
})
</script>