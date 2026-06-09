<template>
  <div>
    <NuxtLayout name="dashboard-admin">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestion des livreurs</h1>
          <p class="text-sm text-gray-500 mt-1">Gérez tous les livreurs de la plateforme</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          Ajouter un livreur
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <div class="flex-1">
            <input
              v-model="search"
              type="text"
              placeholder="Rechercher par nom ou email..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              @input="onSearchInput"
            />
          </div>
          <select
            v-model="selectedType"
            @change="loadCouriers(1)"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="">Tous les types</option>
            <option value="independent">Indépendant</option>
            <option value="partner_employee">Partenaire</option>
          </select>
          <select
            v-model="selectedStatus"
            @change="loadCouriers(1)"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
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
        <div v-else-if="couriers.length === 0" class="p-8 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
          <p class="text-gray-500 text-sm">Aucun livreur trouvé</p>
        </div>

        <!-- Table content -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Nom</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Téléphone</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Date inscription</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="c in couriers" :key="c.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <span class="font-medium text-gray-900">{{ c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || '—' }}</span>
                </td>
                <td class="px-4 py-3 text-gray-600">{{ c.email || '—' }}</td>
                <td class="px-4 py-3 text-gray-600">{{ c.phone || '—' }}</td>
                <td class="px-4 py-3">
                  <span :class="getCourierTypeClass(c)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getCourierTypeLabel(c) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span :class="c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ c.status === 'active' ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-500">{{ formatDate(c.created_at) }}</td>
                <td class="px-4 py-3">
                  <button
                    @click="confirmToggle(c)"
                    :disabled="actionLoading"
                    :class="c.status === 'active' ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'"
                    class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {{ c.status === 'active' ? 'Désactiver' : 'Activer' }}
                  </button>
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
              @click="loadCouriers(pagination.currentPage - 1)"
              :disabled="pagination.currentPage <= 1"
              class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <button
              @click="loadCouriers(pagination.currentPage + 1)"
              :disabled="pagination.currentPage >= pagination.lastPage"
              class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      <!-- Create Modal -->
      <Teleport to="body">
        <div v-if="showCreateModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeCreateModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Ajouter un livreur</h3>
                  <p class="text-sm text-gray-500 mt-0.5">Un mot de passe temporaire sera envoyé par email</p>
                </div>
                <button @click="closeCreateModal" class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <form @submit.prevent="handleCreate" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      v-model="createForm.first_name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      v-model="createForm.last_name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Nom"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    v-model="createForm.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    v-model="createForm.phone"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    v-model="createForm.city"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Cotonou"
                  />
                </div>

                <div v-if="createError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-sm text-red-700">{{ createError }}</p>
                </div>

                <div class="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    @click="closeCreateModal"
                    :disabled="createLoading"
                    class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    :disabled="createLoading"
                    class="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    <span v-if="createLoading" class="inline-flex items-center gap-2">
                      <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Création...
                    </span>
                    <span v-else>Créer le livreur</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Confirmation Modal -->
      <Teleport to="body">
        <div v-if="showConfirmModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeConfirmModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ confirmTitle }}</h3>
            <p class="text-sm text-gray-600 mb-4">{{ confirmMessage }}</p>
            <div class="flex items-center justify-end gap-3">
              <button
                @click="closeConfirmModal"
                :disabled="actionLoading"
                class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                @click="executeToggle"
                :disabled="actionLoading"
                :class="confirmColor"
                class="px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50"
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

      <!-- Toast notification -->
      <Teleport to="body">
        <Transition name="toast">
          <div v-if="toast.show" class="fixed top-4 right-4 z-[120] max-w-sm">
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

const { fetchCouriers, createCourier, toggleCourier } = useAdminDashboard()

// State
const loading = ref(true)
const actionLoading = ref(false)
const createLoading = ref(false)
const couriers = ref<any[]>([])
const search = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const pagination = reactive({
  currentPage: 1,
  lastPage: 1
})

// Create modal
const showCreateModal = ref(false)
const createError = ref('')
const createForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  city: ''
})

// Confirm modal
const showConfirmModal = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmColor = ref('bg-red-600 hover:bg-red-700')
const toggleTarget = ref<any>(null)

// Toast
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.show = true
  toast.message = message
  toast.type = type
  setTimeout(() => { toast.show = false }, 4000)
}

// Helpers
const getCourierTypeLabel = (c: any) => {
  const courierType = c.courier?.courier_type || 'independent'
  return courierType === 'partner_employee' ? 'Partenaire' : 'Indépendant'
}

const getCourierTypeClass = (c: any) => {
  const courierType = c.courier?.courier_type || 'independent'
  return courierType === 'partner_employee' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
}

const formatDate = (date: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Search debounce
const onSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadCouriers(1)
  }, 400)
}

// Data loading
const loadCouriers = async (page: number = 1) => {
  loading.value = true
  try {
    const params: any = { page }
    if (search.value.trim()) params.search = search.value.trim()
    if (selectedType.value) params.courier_type = selectedType.value
    if (selectedStatus.value) params.status = selectedStatus.value
    const data = await fetchCouriers(params)
    const paginatedCouriers = data.couriers || data
    couriers.value = paginatedCouriers.data || []
    pagination.currentPage = paginatedCouriers.current_page || page
    pagination.lastPage = paginatedCouriers.last_page || 1
  } catch (e: any) {
    showToast('Erreur lors du chargement des livreurs', 'error')
  } finally {
    loading.value = false
  }
}

// Create courier
const handleCreate = async () => {
  createLoading.value = true
  createError.value = ''
  try {
    await createCourier({
      first_name: createForm.first_name,
      last_name: createForm.last_name,
      email: createForm.email,
      phone: createForm.phone,
      city: createForm.city
    })
    showToast('Livreur créé avec succès. Le mot de passe temporaire a été envoyé par email.')
    closeCreateModal()
    await loadCouriers(1)
  } catch (e: any) {
    createError.value = e.message || 'Une erreur est survenue lors de la création'
  } finally {
    createLoading.value = false
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  createError.value = ''
  createForm.first_name = ''
  createForm.last_name = ''
  createForm.email = ''
  createForm.phone = ''
  createForm.city = ''
}

// Toggle
const confirmToggle = (c: any) => {
  toggleTarget.value = c
  const active = c.status === 'active'
  confirmTitle.value = active ? 'Désactiver le livreur' : 'Activer le livreur'
  confirmMessage.value = active
    ? `Voulez-vous vraiment désactiver ${c.name || 'ce livreur'} ? Il ne pourra plus recevoir de livraisons.`
    : `Voulez-vous réactiver ${c.name || 'ce livreur'} ?`
  confirmColor.value = active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  toggleTarget.value = null
}

const executeToggle = async () => {
  if (!toggleTarget.value) return
  actionLoading.value = true
  try {
    await toggleCourier(toggleTarget.value.id)
    const wasActive = toggleTarget.value.status === 'active'
    showToast(wasActive ? 'Livreur désactivé avec succès' : 'Livreur activé avec succès')
    closeConfirmModal()
    await loadCouriers(pagination.currentPage)
  } catch (e: any) {
    showToast(e.message || 'Une erreur est survenue', 'error')
  } finally {
    actionLoading.value = false
  }
}

// Init
onMounted(async () => {
  await loadCouriers()
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
