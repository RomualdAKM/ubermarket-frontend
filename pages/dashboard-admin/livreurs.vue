<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestion des livreurs</h1>
        <p class="text-sm text-gray-500 mt-1">Tous les livreurs de la plateforme</p>
      </div>
      <button @click="showCreateModal = true"
        class="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Ajouter un livreur
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <p class="text-2xl font-bold text-gray-900">{{ stats.total ?? 0 }}</p>
        <p class="text-xs text-gray-500 mt-1">Total livreurs</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <p class="text-2xl font-bold text-blue-600">{{ stats.independent ?? 0 }}</p>
        <p class="text-xs text-gray-500 mt-1">Indépendants</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <p class="text-2xl font-bold text-purple-600">{{ stats.pro ?? 0 }}</p>
        <p class="text-xs text-gray-500 mt-1">Pro / Contrat</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <p class="text-2xl font-bold text-green-600">{{ stats.available ?? 0 }}</p>
        <p class="text-xs text-gray-500 mt-1">Disponibles</p>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1">
          <input v-model="search" type="text" placeholder="Rechercher par nom, email ou téléphone..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            @input="onSearchInput" />
        </div>
        <select v-model="selectedType" @change="loadCouriers(1)"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">Tous les types</option>
          <option value="independent">Indépendant</option>
          <option value="pro">Pro / Contrat</option>
        </select>
        <select v-model="selectedStatus" @change="loadCouriers(1)"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-400">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>

      <div v-else-if="couriers.length === 0" class="p-12 text-center text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25"/>
        </svg>
        <p class="text-sm">Aucun livreur trouvé</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Nom</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Ville</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Disponibilité</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="c in couriers" :key="c.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-900">{{ c.name }}</td>
              <td class="px-4 py-3 text-gray-500">
                <div>{{ c.email }}</div>
                <div class="text-xs">{{ c.phone }}</div>
              </td>
              <td class="px-4 py-3">
                <span :class="c.courier_type === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                  class="px-2 py-0.5 text-xs rounded-full font-medium">
                  {{ c.courier_type === 'pro' ? 'Pro' : 'Indépendant' }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ c.city || '—' }}</td>
              <td class="px-4 py-3">
                <span :class="{
                  'bg-green-100 text-green-700': c.availability === 'available',
                  'bg-yellow-100 text-yellow-700': c.availability === 'busy',
                  'bg-red-100 text-red-700': c.availability === 'unavailable' || !c.availability,
                }" class="px-2 py-0.5 text-xs rounded-full font-medium">
                  {{ c.availability === 'available' ? 'Disponible' : c.availability === 'busy' ? 'Occupé' : 'Indisponible' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-0.5 text-xs rounded-full font-medium">
                  {{ c.status === 'active' ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-4 py-3 flex items-center gap-2">
                <button @click="openDetail(c)"
                  class="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors">
                  Voir
                </button>
                <button @click="confirmToggle(c)"
                  :class="c.status === 'active' ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'"
                  class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors">
                  {{ c.status === 'active' ? 'Désactiver' : 'Activer' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.lastPage > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p class="text-sm text-gray-500">Page {{ pagination.currentPage }} / {{ pagination.lastPage }}</p>
        <div class="flex gap-2">
          <button @click="loadCouriers(pagination.currentPage - 1)" :disabled="pagination.currentPage <= 1"
            class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">Précédent</button>
          <button @click="loadCouriers(pagination.currentPage + 1)" :disabled="pagination.currentPage >= pagination.lastPage"
            class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">Suivant</button>
        </div>
      </div>
    </div>

    <!-- ===== MODAL CRÉATION ===== -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="closeCreateModal"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-start mb-5">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Ajouter un livreur</h3>
              <p class="text-sm text-gray-500">Les identifiants seront envoyés par email</p>
            </div>
            <button @click="closeCreateModal" class="p-1.5 text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleCreate" class="space-y-4">
            <!-- Type -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type de livreur</label>
                <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="createForm.courier_type" value="independent" class="text-indigo-600" />
                    <span class="text-sm">Indépendant</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="createForm.courier_type" value="pro" class="text-indigo-600" />
                    <span class="text-sm">Pro / Sous-contrat</span>
                </label>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <input v-model="createForm.first_name" required type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input v-model="createForm.last_name" required type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input v-model="createForm.email" required type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input v-model="createForm.phone" required type="tel" placeholder="+229 XX XX XX XX"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                <input v-model="createForm.city" required type="text" placeholder="Cotonou"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <!-- ✅ Pays (indépendant uniquement) -->
                <div v-if="createForm.courier_type === 'independent'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                <input v-model="createForm.country" required type="text" placeholder="Bénin"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>

            <!-- ✅ Boutique liée (pro uniquement) -->
            <div v-if="createForm.courier_type === 'pro'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Boutique / Entreprise liée *</label>
                <select v-model="createForm.shop_id" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="">Sélectionner une boutique</option>
                <option v-for="shop in allShops" :key="shop.id" :value="shop.id">{{ shop.name }}</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Taux de commission (%)</label>
                <input v-model.number="createForm.commission_rate" type="number" min="0" max="100" step="0.5"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div v-if="createError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {{ createError }}
            </div>

            <div class="flex justify-end gap-3 pt-2">
                <button type="button" @click="closeCreateModal"
                class="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Annuler
                </button>
                <button type="submit" :disabled="createLoading"
                class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                {{ createLoading ? 'Création...' : 'Créer le livreur' }}
                </button>
            </div>
            </form>
        </div>
      </div>
    </Teleport>

    <!-- ===== MODAL DÉTAIL ===== -->
    <Teleport to="body">
      <div v-if="showDetailModal && selectedCourier" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showDetailModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-start mb-5">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedCourier.name }}</h3>
              <p class="text-sm text-gray-500 capitalize">
                {{ selectedCourier.courier_type === 'pro' ? 'Livreur Pro' : 'Livreur Indépendant' }}
              </p>
            </div>
            <button @click="showDetailModal = false" class="p-1.5 text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 mb-1">Email</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCourier.email }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 mb-1">Téléphone</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCourier.phone }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 mb-1">Ville</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCourier.city || '—' }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 mb-1">Commission</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCourier.commission_rate ?? 0 }}%</p>
              </div>
            </div>

            <!-- Zones (indépendant) -->
            <div v-if="selectedCourier.courier_type === 'independent' && selectedCourier.coverage_zones?.length">
              <p class="text-sm font-medium text-gray-700 mb-2">Zones de couverture</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="zone in selectedCourier.coverage_zones" :key="zone"
                  class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{{ zone }}</span>
              </div>
            </div>

            <!-- Stats livraisons -->
            <div class="bg-indigo-50 rounded-lg p-4">
              <p class="text-sm font-semibold text-indigo-900 mb-3">Statistiques</p>
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p class="text-xl font-bold text-indigo-700">{{ courierStats.total ?? 0 }}</p>
                  <p class="text-xs text-indigo-500">Total</p>
                </div>
                <div>
                  <p class="text-xl font-bold text-green-600">{{ courierStats.delivered ?? 0 }}</p>
                  <p class="text-xs text-indigo-500">Livrées</p>
                </div>
                <div>
                  <p class="text-xl font-bold text-yellow-600">{{ courierStats.pending ?? 0 }}</p>
                  <p class="text-xs text-indigo-500">En cours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Confirm modal -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="closeConfirmModal"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ confirmTitle }}</h3>
          <p class="text-sm text-gray-600 mb-5">{{ confirmMessage }}</p>
          <div class="flex justify-end gap-3">
            <button @click="closeConfirmModal" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button @click="executeToggle" :disabled="actionLoading" :class="confirmColor"
              class="px-4 py-2 text-sm text-white rounded-lg disabled:opacity-50">
              {{ actionLoading ? 'Traitement...' : 'Confirmer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="fixed top-4 right-4 z-[120] max-w-sm">
          <div :class="toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'"
            class="rounded-lg border px-4 py-3 shadow-lg">
            <p class="text-sm font-medium">{{ toast.message }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
    definePageMeta({ layout: 'dashboard-admin' })

    const config = useRuntimeConfig()
    const { token } = useAuth()
    const { fetchCouriers, createCourier, toggleCourier } = useAdminDashboard()

    const loading       = ref(true)
    const actionLoading = ref(false)
    const createLoading = ref(false)
    const couriers      = ref<any[]>([])
    const search        = ref('')
    const selectedType  = ref('')
    const selectedStatus = ref('')
    const stats         = ref<any>({})
    let searchTimeout: ReturnType<typeof setTimeout> | null = null

    const pagination = reactive({ currentPage: 1, lastPage: 1 })

    // Formulaire création
    const showCreateModal = ref(false)
    const createError     = ref('')
    const createForm      = reactive({
    first_name: '', last_name: '', email: '',
    phone: '', city: '', country: '',
    courier_type: 'independent' as 'independent' | 'pro',
    shop_id: '' as number | '',
    commission_rate: 0,
    })

    // Détail
    const showDetailModal   = ref(false)
    const selectedCourier   = ref<any>(null)
    const courierStats      = ref<any>({})

    // Confirm
    const showConfirmModal = ref(false)
    const confirmTitle     = ref('')
    const confirmMessage   = ref('')
    const confirmColor     = ref('bg-red-600 hover:bg-red-700')
    const toggleTarget     = ref<any>(null)

    // Toast
    const toast = reactive({ show: false, message: '', type: 'success' as 'success'|'error' })
    const showToast = (message: string, type: 'success'|'error' = 'success') => {
    toast.show = true; toast.message = message; toast.type = type
    setTimeout(() => { toast.show = false }, 4000)
    }

    const onSearchInput = () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => loadCouriers(1), 400)
    }

    const loadCouriers = async (page = 1) => {
    loading.value = true
    try {
        const params: any = { page }
        if (search.value)        params.search = search.value
        if (selectedType.value)  params.courier_type = selectedType.value
        if (selectedStatus.value) params.status = selectedStatus.value
        const data = await fetchCouriers(params)
        const p = data.couriers || data
        couriers.value           = p.data || []
        pagination.currentPage   = p.current_page || page
        pagination.lastPage      = p.last_page || 1
    } catch { showToast('Erreur lors du chargement', 'error') }
    finally { loading.value = false }
    }

    const loadStats = async () => {
    try {
        const res  = await fetch(`${config.public.apiBase}/admin/deliveries/stats`, {
        headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' }
        })
        const data = await res.json()
        if (data.success) stats.value = data.data.couriers
    } catch {}
    }

    const openDetail = async (courier: any) => {
    selectedCourier.value = courier
    showDetailModal.value = true
    courierStats.value    = {}
    try {
        const res  = await fetch(`${config.public.apiBase}/admin/couriers/${courier.id}`, {
        headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' }
        })
        const data = await res.json()
        if (data.success) {
        // Compter les livraisons du livreur
        const total     = data.courier.deliveries_count ?? 0
        const delivered = data.courier.delivered_count  ?? 0
        courierStats.value = { total, delivered, pending: total - delivered }
        }
    } catch {}
    }

    const handleCreate = async () => {
    createLoading.value = true
    createError.value   = ''
    try {
        await createCourier({
        name:            `${createForm.first_name} ${createForm.last_name}`.trim(),
        first_name:      createForm.first_name,
        last_name:       createForm.last_name,
        email:           createForm.email,
        phone:           createForm.phone,
        city:            createForm.city,
        country:         createForm.country || null,
        courier_type:    createForm.courier_type,
        shop_id:         createForm.shop_id   || null,
        commission_rate: createForm.commission_rate,
        coverage_zones:  [],
        })
        showToast('Livreur créé — email de bienvenue envoyé ✓')
        closeCreateModal()
        await loadCouriers(1)
    } catch (e: any) {
        createError.value = e.message || 'Erreur lors de la création'
    } finally {
        createLoading.value = false
    }
    }

    const closeCreateModal = () => {
    showCreateModal.value = false
    createError.value     = ''
    Object.assign(createForm, {
        first_name:'', last_name:'', email:'', phone:'',
        city:'', country:'', courier_type:'independent',
        shop_id:'', commission_rate: 0
    })
    }

    const confirmToggle = (c: any) => {
    toggleTarget.value  = c
    const active        = c.status === 'active'
    confirmTitle.value  = active ? 'Désactiver le livreur' : 'Activer le livreur'
    confirmMessage.value = active
        ? `Désactiver ${c.name} ? Il ne pourra plus recevoir de livraisons.`
        : `Réactiver ${c.name} ?`
    confirmColor.value  = active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
    showConfirmModal.value = true
    }

    const closeConfirmModal = () => { showConfirmModal.value = false; toggleTarget.value = null }

    const executeToggle = async () => {
    if (!toggleTarget.value) return
    actionLoading.value = true
    try {
        await toggleCourier(toggleTarget.value.id)
        showToast(toggleTarget.value.status === 'active' ? 'Livreur désactivé' : 'Livreur activé')
        closeConfirmModal()
        await loadCouriers(pagination.currentPage)
    } catch (e: any) {
        showToast(e.message || 'Erreur', 'error')
    } finally { actionLoading.value = false }
    }

    // Après les autres refs, ajoutez :
    const allShops = ref<any[]>([])

    const loadAllShops = async () => {
    try {
        const res  = await fetch(`${config.public.apiBase}/admin/shops?per_page=100`, {
        headers: {
            'Authorization': `Bearer ${token.value}`,
            'Accept': 'application/json'
        }
        })
        const data = await res.json()
        allShops.value = data.shops?.data || []
    } catch (e) {
        console.error('Erreur chargement boutiques:', e)
    }
    }

    onMounted(async () => {
    await Promise.all([loadCouriers(), loadStats(), loadAllShops()])
    })
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(1rem); }
</style>