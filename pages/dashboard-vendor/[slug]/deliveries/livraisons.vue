<template>
  <div class="space-y-6">
    <h1 class="text-xl font-bold text-gray-900">Gestion des livraisons</h1>

    <!-- Onglets -->
    <div class="flex gap-2 border-b border-gray-200">
      <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
        class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === tab.value ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'">
        {{ tab.label }}
      </button>
    </div>

    <!-- ===== ZONES DE LIVRAISON ===== -->
    <div v-if="activeTab === 'zones'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-semibold text-gray-800">Zones de livraison (livreurs indépendants)</h2>
        <button @click="showZoneModal = true"
          class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary">
          + Ajouter une zone
        </button>
      </div>

      <div v-if="zones.length === 0" class="text-center py-8 text-gray-400">
        Aucune zone configurée.
      </div>

      <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <tr>
              <th class="px-5 py-3 text-left">Zone</th>
              <th class="px-5 py-3 text-left">Frais</th>
              <th class="px-5 py-3 text-left">Délai</th>
              <th class="px-5 py-3 text-left">Statut</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="zone in zones" :key="zone.id" class="hover:bg-gray-50">
              <td class="px-5 py-3 font-medium text-gray-900">{{ zone.city }}, {{ zone.country }}</td>
              <td class="px-5 py-3 text-gray-600">{{ zone.shipping_cost }} FCFA</td>
              <td class="px-5 py-3 text-gray-600">{{ zone.estimated_days }}</td>
              <td class="px-5 py-3">
                <button @click="toggleZone(zone)"
                  :class="zone.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                  class="px-2 py-0.5 text-xs rounded-full font-medium hover:opacity-80 transition-opacity">
                  {{ zone.is_active ? 'Active' : 'Inactive' }}
                </button>
              </td>
              <td class="px-5 py-3 text-right">
                <button @click="editZone(zone)" class="text-xs text-indigo-600 mr-3">Modifier</button>
                <button @click="deleteZoneItem(zone.id)" class="text-xs text-red-500">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== TARIFS DISTANCE (PRO) ===== -->
    <div v-if="activeTab === 'pricing'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-semibold text-gray-800">Tarifs à la distance (livreurs pro)</h2>
        <button @click="showPricingModal = true"
          class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary">
          + Ajouter un tarif
        </button>
      </div>

      <div v-if="pricing.length === 0" class="text-center py-8 text-gray-400">
        Aucun tarif configuré.
      </div>

      <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <tr>
              <th class="px-5 py-3 text-left">Distance</th>
              <th class="px-5 py-3 text-left">Standard</th>
              <th class="px-5 py-3 text-left">Express</th>
              <th class="px-5 py-3 text-left">Sur devis</th>
              <th class="px-5 py-3 text-left">Statut</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="p in pricing" :key="p.id" class="hover:bg-gray-50">
              <td class="px-5 py-3 font-medium text-gray-900">
                {{ p.min_km }} – {{ p.max_km ?? '+∞' }} km
              </td>
              <td class="px-5 py-3 text-gray-600">{{ p.is_on_quote ? '—' : p.standard_price + ' FCFA' }}</td>
              <td class="px-5 py-3 text-gray-600">{{ p.is_on_quote ? '—' : p.express_price + ' FCFA' }}</td>
              <td class="px-5 py-3">
                <span :class="p.is_on_quote ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'"
                  class="px-2 py-0.5 text-xs rounded-full">
                  {{ p.is_on_quote ? 'Oui' : 'Non' }}
                </span>
              </td>
              <td class="px-5 py-3">
                <button @click="togglePricingItem(p)"
                  :class="p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                  class="px-2 py-0.5 text-xs rounded-full font-medium hover:opacity-80">
                  {{ p.is_active ? 'Actif' : 'Inactif' }}
                </button>
              </td>
              <td class="px-5 py-3 text-right">
                <button @click="editPricing(p)" class="text-xs text-indigo-600 mr-3">Modifier</button>
                <button @click="deletePricingItem(p.id)" class="text-xs text-red-500">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tableau de référence -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-500">
        <p class="font-medium text-gray-700 mb-2">Grille tarifaire de référence :</p>
        <table class="w-full">
          <tr class="font-medium text-gray-600">
            <td class="pr-4">Distance</td><td class="pr-4">Standard</td><td>Express</td>
          </tr>
          <tr v-for="ref in refPricing" :key="ref.d">
            <td class="pr-4 py-0.5">{{ ref.d }}</td>
            <td class="pr-4">{{ ref.s }}</td>
            <td>{{ ref.e }}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- ===== FRAIS ADDITIONNELS ===== -->
    <div v-if="activeTab === 'fees'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-semibold text-gray-800">Frais additionnels</h2>
        <button @click="showFeeModal = true"
          class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary">
          + Ajouter un frais
        </button>
      </div>

      <div v-if="fees.length === 0" class="text-center py-8 text-gray-400">
        Aucun frais additionnel configuré.
      </div>

      <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <tr>
              <th class="px-5 py-3 text-left">Libellé</th>
              <th class="px-5 py-3 text-left">Montant</th>
              <th class="px-5 py-3 text-left">Type</th>
              <th class="px-5 py-3 text-left">Statut</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="fee in fees" :key="fee.id" class="hover:bg-gray-50">
              <td class="px-5 py-3 font-medium text-gray-900">{{ fee.label }}</td>
              <td class="px-5 py-3" :class="fee.type === 'discount' ? 'text-red-600' : 'text-green-600'">
                {{ fee.type === 'discount' ? '-' : '+' }}{{ fee.amount }} FCFA
              </td>
              <td class="px-5 py-3 text-gray-500 capitalize">{{ fee.type === 'discount' ? 'Déduction' : 'Supplément' }}</td>
              <td class="px-5 py-3">
                <button @click="toggleFeeItem(fee)"
                  :class="fee.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                  class="px-2 py-0.5 text-xs rounded-full font-medium hover:opacity-80">
                  {{ fee.is_active ? 'Actif' : 'Inactif' }}
                </button>
              </td>
              <td class="px-5 py-3 text-right">
                <button @click="editFee(fee)" class="text-xs text-indigo-600 mr-3">Modifier</button>
                <button @click="deleteFeeItem(fee.id)" class="text-xs text-red-500">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== LIVRAISONS EN COURS ===== -->
    <div v-if="activeTab === 'deliveries'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-semibold text-gray-800">Livraisons</h2>
        <select v-model="deliveryFilter" @change="loadDeliveries"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="assigned">Assignée</option>
          <option value="picked_up">Prise en charge</option>
          <option value="in_transit">En transit</option>
          <option value="delivered">Livrée</option>
          <option value="failed">Échec</option>
        </select>
      </div>

      <!-- Alerte livraisons non prises -->
      <div v-if="pendingAlerts > 0"
        class="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">⚠️</span>
          <div>
            <p class="text-sm font-semibold text-amber-800">
              {{ pendingAlerts }} livraison(s) non prise(s) en charge depuis plus de 10 min
            </p>
            <p class="text-xs text-amber-600">Assignez manuellement un livreur</p>
          </div>
        </div>
      </div>

      <div v-if="deliveries.length === 0" class="text-center py-8 text-gray-400">
        Aucune livraison.
      </div>

      <div v-else class="space-y-3">
        <div v-for="d in deliveries" :key="d.id"
          class="bg-white border border-gray-200 rounded-xl p-5">
          <div class="flex items-start justify-between mb-3">
            <div>
              <span class="font-mono text-sm font-bold text-gray-900">{{ d.tracking_code }}</span>
              <span :class="statusClass(d.status)"
                class="ml-3 px-2 py-0.5 text-xs rounded-full font-medium">
                {{ statusLabel(d.status) }}
              </span>
            </div>
            <span class="text-xs text-gray-400">{{ formatDate(d.created_at) }}</span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
            <div>
              <span class="text-xs text-gray-400 block">Commande</span>
              #{{ d.order_id }}
            </div>
            <div>
              <span class="text-xs text-gray-400 block">Livreur</span>
              {{ d.courier?.name || '—' }}
            </div>
            <div>
              <span class="text-xs text-gray-400 block">Type</span>
              {{ d.delivery_type === 'express' ? 'Express' : 'Standard' }}
            </div>
            <div>
              <span class="text-xs text-gray-400 block">Distance</span>
              {{ d.distance_km ? d.distance_km + ' km' : '—' }}
            </div>
          </div>
          <!-- Assigner livreur si pending -->
          <div v-if="d.status === 'pending'" class="flex gap-2 mt-3">
            <select v-model="assignCourierMap[d.id]"
              class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">Choisir un livreur</option>
              <option v-for="c in couriers" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.courier_type === 'pro' ? 'Pro' : 'Indép.' }})
              </option>
            </select>
            <button @click="doAssign(d.id)"
              class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-secondary transition-colors">
              Assigner
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODALES ===== -->

    <!-- Zone Modal -->
    <Teleport to="body">
      <div v-if="showZoneModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showZoneModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 class="text-lg font-semibold mb-4">{{ editingZone ? 'Modifier la zone' : 'Ajouter une zone' }}</h3>
          <form @submit.prevent="saveZone" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                <input v-model="zoneForm.country" required type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ville/Région *</label>
                <input v-model="zoneForm.city" required type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Frais (FCFA) *</label>
                <input v-model.number="zoneForm.shipping_cost" required type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Délai</label>
                <select v-model="zoneForm.estimated_days"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="10mn-1H">10mn-1H</option>
                  <option value="01-02H">01-02H</option>
                  <option value="02-04H">02-04H</option>
                  <option value="04-06H">04-06H</option>
                  <option value="06-12H">06-12H</option>
                  <option value="12-24H">12-24H</option>
                  <option value="24-48H">24-48H</option>
                  <option value="2-3 jours">2-3 jours</option>
                  <option value="3-5 jours">3-5 jours</option>
                  <option value="1 semaine">1 semaine</option>
                  <option value="Sur devis">Sur devis</option>
                </select>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="zoneForm.is_active" type="checkbox" id="zone-active" class="text-primary rounded" />
              <label for="zone-active" class="text-sm text-gray-700">Zone active</label>
            </div>
            <div class="flex justify-end gap-3">
              <button type="button" @click="showZoneModal = false"
                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Annuler</button>
              <button type="submit"
                class="px-4 py-2 text-sm text-white bg-primary hover:bg-secondary rounded-lg">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Pricing Modal -->
    <Teleport to="body">
      <div v-if="showPricingModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showPricingModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 class="text-lg font-semibold mb-4">{{ editingPricing ? 'Modifier le tarif' : 'Ajouter un tarif' }}</h3>
          <form @submit.prevent="savePricing" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Distance min (km) *</label>
                <input v-model.number="pricingForm.min_km" required type="number" step="0.1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Distance max (km)</label>
                <input v-model.number="pricingForm.max_km" type="number" step="0.1" placeholder="Laisser vide = illimité"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="pricingForm.is_on_quote" type="checkbox" id="on-quote" class="text-primary rounded" />
              <label for="on-quote" class="text-sm text-gray-700">Sur devis (pas de tarif fixe)</label>
            </div>
            <template v-if="!pricingForm.is_on_quote">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tarif standard (FCFA)</label>
                  <input v-model.number="pricingForm.standard_price" type="number"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tarif express (FCFA)</label>
                  <input v-model.number="pricingForm.express_price" type="number"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </template>
            <div class="flex justify-end gap-3">
              <button type="button" @click="showPricingModal = false"
                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Annuler</button>
              <button type="submit"
                class="px-4 py-2 text-sm text-white bg-primary hover:bg-secondary rounded-lg">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Fee Modal -->
    <Teleport to="body">
      <div v-if="showFeeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showFeeModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 class="text-lg font-semibold mb-4">{{ editingFee ? 'Modifier le frais' : 'Ajouter un frais' }}</h3>
          <form @submit.prevent="saveFee" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
              <input v-model="feeForm.label" required type="text"
                placeholder="ex: Attente client (>20 min)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Clé unique *</label>
              <input v-model="feeForm.trigger_key" required type="text"
                placeholder="ex: waiting_client"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA) *</label>
                <input v-model.number="feeForm.amount" required type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select v-model="feeForm.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="surcharge">Supplément (+)</option>
                  <option value="discount">Déduction (-)</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end gap-3">
              <button type="button" @click="showFeeModal = false"
                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Annuler</button>
              <button type="submit"
                class="px-4 py-2 text-sm text-white bg-primary hover:bg-secondary rounded-lg">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const slug  = computed(() => route.params.slug as string)
const {
  fetchZones, createZone, updateZone, deleteZone,
  fetchPricing, createPricing, updatePricing, deletePricing, togglePricing,
  fetchFees, createFee, updateFee, deleteFee, toggleFee,
  fetchDeliveries, assignCourier, checkPendingAlerts,
  fetchCouriers,
} = useDelivery(slug.value)

const activeTab = ref('zones')
const tabs = [
  { value: 'zones',      label: 'Zones (Indépendants)' },
  { value: 'pricing',    label: 'Tarifs distance (Pro)' },
  { value: 'fees',       label: 'Frais additionnels' },
  { value: 'deliveries', label: 'Livraisons' },
]

// Référence tarifaire
const refPricing = [
  { d: '0 – 2 km',    s: '1 000 FCFA',       e: '2 000 FCFA' },
  { d: '2 – 5 km',    s: '1 500 FCFA',       e: '2 500 FCFA' },
  { d: '5 – 10 km',   s: '2 000 FCFA',       e: '3 500 FCFA' },
  { d: '10 – 20 km',  s: '3 000 FCFA',       e: '5 000 FCFA' },
  { d: '20 – 50 km',  s: '4 000-7 000 FCFA', e: '6 000-10 000 FCFA' },
  { d: '+50 km',      s: 'Sur devis',        e: 'Sur devis' },
]

// ===== ZONES =====
const zones        = ref<any[]>([])
const showZoneModal = ref(false)
const editingZone  = ref<any>(null)
const zoneForm     = ref({ country: '', city: '', shipping_cost: 0, estimated_days: '24-48H', is_active: true })

const loadZones = async () => {
  try { const d = await fetchZones(); zones.value = d.data || [] } catch {}
}
const editZone = (zone: any) => {
  editingZone.value = zone
  zoneForm.value = { ...zone }
  showZoneModal.value = true
}
const toggleZone = async (zone: any) => {
  try { await updateZone(zone.id, { ...zone, is_active: !zone.is_active }); await loadZones() } catch {}
}
const deleteZoneItem = async (id: number) => {
  if (!confirm('Supprimer cette zone ?')) return
  try { await deleteZone(id); await loadZones() } catch {}
}
const saveZone = async () => {
  try {
    if (editingZone.value) await updateZone(editingZone.value.id, zoneForm.value)
    else await createZone(zoneForm.value)
    await loadZones()
    showZoneModal.value = false
    editingZone.value   = null
    zoneForm.value = { country: '', city: '', shipping_cost: 0, estimated_days: '24-48H', is_active: true }
  } catch {}
}

// ===== PRICING =====
const pricing         = ref<any[]>([])
const showPricingModal = ref(false)
const editingPricing  = ref<any>(null)
const pricingForm     = ref({ min_km: 0, max_km: null as number | null, standard_price: 0, express_price: 0, is_on_quote: false })

const loadPricing = async () => {
  try { const d = await fetchPricing(); pricing.value = d.data || [] } catch {}
}
const editPricing = (p: any) => {
  editingPricing.value = p
  pricingForm.value = { ...p }
  showPricingModal.value = true
}
const togglePricingItem = async (p: any) => {
  try { await togglePricing(p.id); await loadPricing() } catch {}
}
const deletePricingItem = async (id: number) => {
  if (!confirm('Supprimer ce tarif ?')) return
  try { await deletePricing(id); await loadPricing() } catch {}
}
const savePricing = async () => {
  try {
    if (editingPricing.value) await updatePricing(editingPricing.value.id, pricingForm.value)
    else await createPricing(pricingForm.value)
    await loadPricing()
    showPricingModal.value = false
    editingPricing.value   = null
    pricingForm.value = { min_km: 0, max_km: null, standard_price: 0, express_price: 0, is_on_quote: false }
  } catch {}
}

// ===== FEES =====
const fees        = ref<any[]>([])
const showFeeModal = ref(false)
const editingFee  = ref<any>(null)
const feeForm     = ref({ label: '', trigger_key: '', amount: 0, type: 'surcharge' })

const loadFees = async () => {
  try { const d = await fetchFees(); fees.value = d.data || [] } catch {}
}
const editFee = (fee: any) => {
  editingFee.value = fee
  feeForm.value = { ...fee }
  showFeeModal.value = true
}
const toggleFeeItem = async (fee: any) => {
  try { await toggleFee(fee.id); await loadFees() } catch {}
}
const deleteFeeItem = async (id: number) => {
  if (!confirm('Supprimer ce frais ?')) return
  try { await deleteFee(id); await loadFees() } catch {}
}
const saveFee = async () => {
  try {
    if (editingFee.value) await updateFee(editingFee.value.id, feeForm.value)
    else await createFee(feeForm.value)
    await loadFees()
    showFeeModal.value = false
    editingFee.value   = null
    feeForm.value = { label: '', trigger_key: '', amount: 0, type: 'surcharge' }
  } catch {}
}

// ===== LIVRAISONS =====
const deliveries      = ref<any[]>([])
const deliveryFilter  = ref('')
const pendingAlerts   = ref(0)
const assignCourierMap = ref<Record<number, number>>({})
const couriers        = ref<any[]>([])

const loadDeliveries = async () => {
  try {
    const d = await fetchDeliveries(deliveryFilter.value)
    deliveries.value = d.data?.data || d.data || []
    const alerts = await checkPendingAlerts()
    pendingAlerts.value = alerts.count || 0
  } catch {}
}
const loadCouriers = async () => {
  try { const d = await fetchCouriers(); couriers.value = d.data || d.couriers || [] } catch {}
}
const doAssign = async (deliveryId: number) => {
  const courierId = assignCourierMap.value[deliveryId]
  if (!courierId) return
  try { await assignCourier(deliveryId, courierId); await loadDeliveries() } catch {}
}

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

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

watch(activeTab, (tab) => {
  if (tab === 'zones') loadZones()
  else if (tab === 'pricing') loadPricing()
  else if (tab === 'fees') loadFees()
  else if (tab === 'deliveries') { loadDeliveries(); loadCouriers() }
})

onMounted(() => loadZones())
</script>