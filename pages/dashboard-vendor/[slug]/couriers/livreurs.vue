<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-900">Gestion des livreurs</h1>
      <button @click="showAddModal = true"
        class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors">
        + Ajouter un livreur
      </button>
    </div>

    <!-- Onglets type -->
    <div class="flex gap-2 border-b border-gray-200">
      <button v-for="tab in tabs" :key="tab.value"
        @click="activeTab = tab.value"
        class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === tab.value
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-500 hover:text-gray-700'">
        {{ tab.label }}
      </button>
    </div>

    <!-- Livreurs indépendants -->
    <div v-if="activeTab === 'independent'">

      <!-- Zones disponibles -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p class="text-sm font-medium text-blue-800 mb-2">
          💡 Pour ajouter un livreur indépendant, créez d'abord des zones de livraison dans
          <NuxtLink :to="`/dashboard-vendor/${slug}/deliveries/livraisons`" class="underline">
            Livraisons → Zones
          </NuxtLink>
        </p>
      </div>

      <!-- Liste -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="independentCouriers.length === 0" class="text-center py-12 text-gray-400">
        Aucun livreur indépendant configuré.
      </div>

      <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <tr>
              <th class="px-5 py-3 text-left">Nom</th>
              <th class="px-5 py-3 text-right">Contact</th>
              <th class="px-5 py-3 text-left"></th>
              <th class="px-5 py-3 text-left">Zones</th>
              <th class="px-5 py-3 text-left">Disponibilité</th>
              <th class="px-5 py-3 text-left">Statut</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="courier in independentCouriers" :key="courier.id" class="hover:bg-gray-50">
              <td class="px-5 py-3 font-medium text-gray-900">{{ courier.name }}</td>
              <td class="px-5 py-3 text-gray-500">
                <div>{{ courier.email }}</div>
              </td>
              <td class="px-5 py-3 text-gray-500">
                <div>{{ courier.phone }}</div>
              </td>
              <!--<td class="px-5 py-3 text-gray-500">
                <div>{{ courier.email }}</div>
                <div>{{ courier.phone }}</div>
              </td>-->
              <td class="px-5 py-3">
                <div class="flex flex-wrap gap-1">
                  <span v-for="zone in (courier.coverage_zones || [])" :key="zone"
                    class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {{ zone }}
                  </span>
                </div>
              </td>
              <td class="px-5 py-3">
                <span :class="availabilityClass(courier.availability)"
                  class="px-2 py-0.5 text-xs rounded-full font-medium">
                  {{ availabilityLabel(courier.availability) }}
                </span>
              </td>
              <td class="px-5 py-3">
                <span :class="courier.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  class="px-2 py-0.5 text-xs rounded-full font-medium">
                  {{ courier.status === 'active' ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <button @click="editCourier(courier)"
                  class="text-xs text-indigo-600 hover:text-indigo-800 mr-3">Modifier</button>
                <button @click="confirmDelete(courier)"
                  class="text-xs text-red-500 hover:text-red-700">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Livreurs pro -->
    <div v-if="activeTab === 'pro'">
      <div v-if="proCouriers.length === 0" class="text-center py-12 text-gray-400">
        Aucun livreur sous contrat configuré.
      </div>
      <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <tr>
              <th class="px-5 py-3 text-left">Nom</th>
              <th class="px-5 py-3 text-left">Contact</th>
              <th class="px-5 py-3 text-left">Ville</th>
              <th class="px-5 py-3 text-left">Disponibilité</th>
              <th class="px-5 py-3 text-left">Livraisons</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="courier in proCouriers" :key="courier.id" class="hover:bg-gray-50">
              <td class="px-5 py-3 font-medium text-gray-900">{{ courier.name }}</td>
              <td class="px-5 py-3 text-gray-500">
                <div>{{ courier.email }}</div>
                <div>{{ courier.phone }}</div>
              </td>
              <td class="px-5 py-3 text-gray-600">{{ courier.city || '—' }}</td>
              <td class="px-5 py-3">
                <span :class="availabilityClass(courier.availability)"
                  class="px-2 py-0.5 text-xs rounded-full font-medium">
                  {{ availabilityLabel(courier.availability) }}
                </span>
              </td>
              <td class="px-5 py-3 text-gray-600">
                {{ courier.deliveries_count ?? 0 }} livraisons
              </td>
              <td class="px-5 py-3 text-right">
                <button @click="editCourier(courier)"
                  class="text-xs text-indigo-600 hover:text-indigo-800 mr-3">Modifier</button>
                <button @click="confirmDelete(courier)"
                  class="text-xs text-red-500 hover:text-red-700">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal ajout/modification -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ editingCourier ? 'Modifier le livreur' : 'Ajouter un livreur' }}
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type de livreur</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.courier_type" value="independent" class="text-primary" />
                  <span class="text-sm">Indépendant (zones fixes)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.courier_type" value="pro" class="text-primary" />
                  <span class="text-sm">Pro / Sous-contrat</span>
                </label>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input v-model="form.name" required type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input v-model="form.email" required type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input v-model="form.phone" required type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            <!-- Ville (pro uniquement) -->
            <div v-if="form.courier_type === 'pro'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input v-model="form.city" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <!-- Zones de couverture (indépendant uniquement) -->
            <div v-if="form.courier_type === 'independent'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Zones de couverture
              </label>
              <div class="flex gap-2 mb-2">
                <input v-model="zoneSearch" @input="searchZones" type="text"
                  placeholder="Rechercher une zone..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <!-- Résultats recherche -->
              <div v-if="zoneResults.length" class="border border-gray-200 rounded-lg max-h-32 overflow-y-auto mb-2">
                <button type="button" v-for="zone in zoneResults" :key="zone.id"
                  @click="addZone(zone)"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between">
                  <span>{{ zone.city }}, {{ zone.country }}</span>
                  <span class="text-gray-400">{{ zone.shipping_cost }} FCFA</span>
                </button>
              </div>
              <!-- Zones sélectionnées -->
              <div class="flex flex-wrap gap-2">
                <span v-for="(zone, i) in selectedZones" :key="i"
                  class="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {{ zone.city }}, {{ zone.country }}
                  <button type="button" @click="removeZone(i)" class="ml-1 text-primary/60 hover:text-primary">×</button>
                </span>
                <span v-if="selectedZones.length === 0" class="text-sm text-gray-400 italic">
                  Aucune zone sélectionnée
                </span>
              </div>
            </div>

            <!-- Taux de commission -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Taux de commission (%)
              </label>
              <input v-model.number="form.commission_rate" type="number" min="0" max="100" step="0.5"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <!-- Disponibilité -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select v-model="form.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>

            <div v-if="formError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ formError }}
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeModal"
                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Annuler
              </button>
              <button type="submit" :disabled="saving"
                class="px-4 py-2 text-sm text-white bg-primary hover:bg-secondary rounded-lg transition-colors disabled:opacity-50">
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
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
const { fetchCouriers, createCourier, updateCourier, deleteCourier } = useDelivery(slug.value)

const config = useRuntimeConfig()
const { token } = useAuth()

const couriers     = ref<any[]>([])
const loading      = ref(false)
const showAddModal = ref(false)
const editingCourier = ref<any>(null)
const saving       = ref(false)
const formError    = ref('')
const activeTab    = ref<'independent' | 'pro'>('independent')

const tabs = [
  { value: 'independent', label: 'Livreurs indépendants' },
  { value: 'pro', label: 'Livreurs pro / sous-contrat' },
]

const independentCouriers = computed(() => couriers.value.filter(c => c.courier_type === 'independent'))
const proCouriers         = computed(() => couriers.value.filter(c => c.courier_type === 'pro'))

// Formulaire
const defaultForm = () => ({
  name: '', email: '', phone: '', city: '',
  courier_type: 'independent' as 'independent' | 'pro',
  status: 'active', commission_rate: 0,
  coverage_zones: [] as string[],
})

const form         = ref(defaultForm())
const selectedZones = ref<any[]>([])
const zoneSearch   = ref('')
const zoneResults  = ref<any[]>([])

// Recherche zones
let zoneTimer: ReturnType<typeof setTimeout> | null = null
const searchZones = () => {
  if (zoneTimer) clearTimeout(zoneTimer)
  zoneTimer = setTimeout(async () => {
    if (!zoneSearch.value.trim()) { zoneResults.value = []; return }
    try {
      const res = await fetch(
        `${config.public.apiBase}/delivery-zones/search?q=${zoneSearch.value}`,
        { headers: { 'Authorization': `Bearer ${token.value}` } }
      )
      const data = await res.json()
      zoneResults.value = data.data || []
    } catch {}
  }, 300)
}

const addZone = (zone: any) => {
  if (!selectedZones.value.find(z => z.id === zone.id)) {
    selectedZones.value.push(zone)
    form.value.coverage_zones.push(`${zone.city}, ${zone.country}`)
  }
  zoneSearch.value  = ''
  zoneResults.value = []
}

const removeZone = (index: number) => {
  selectedZones.value.splice(index, 1)
  form.value.coverage_zones.splice(index, 1)
}

const availabilityClass = (av: string) => ({
  available:   'bg-green-100 text-green-700',
  unavailable: 'bg-red-100 text-red-700',
  busy:        'bg-yellow-100 text-yellow-700',
}[av] || 'bg-gray-100 text-gray-700')

const availabilityLabel = (av: string) => ({
  available:   'Disponible',
  unavailable: 'Indisponible',
  busy:        'Occupé',
}[av] || av)

const load = async () => {
  loading.value = true
  try {
    const data = await fetchCouriers()
    couriers.value = data.data || data.couriers || []
  } catch {} finally { loading.value = false }
}

const editCourier = (courier: any) => {
  editingCourier.value = courier
  form.value = { ...defaultForm(), ...courier }
  selectedZones.value = []
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value   = false
  editingCourier.value = null
  form.value           = defaultForm()
  selectedZones.value  = []
  zoneSearch.value     = ''
  zoneResults.value    = []
  formError.value      = ''
}

const handleSubmit = async () => {
  saving.value    = true
  formError.value = ''
  try {
    if (editingCourier.value) {
      await updateCourier(editingCourier.value.id, form.value)
    } else {
      await createCourier(form.value)
    }
    await load()
    closeModal()
  } catch (err: any) {
    formError.value = err.message
  } finally { saving.value = false }
}

const confirmDelete = async (courier: any) => {
  if (!confirm(`Supprimer ${courier.name} ?`)) return
  try {
    await deleteCourier(courier.id)
    await load()
  } catch {}
}

onMounted(load)
</script>