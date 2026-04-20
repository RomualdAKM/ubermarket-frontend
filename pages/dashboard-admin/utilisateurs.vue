<template>
  <div>
    <NuxtLayout name="dashboard-admin">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <p class="text-sm text-gray-500 mt-1">Gérez tous les utilisateurs de la plateforme</p>
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
            v-model="selectedRole"
            @change="loadUsers(1)"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="">Tous les rôles</option>
            <option value="vendor">Vendeur</option>
            <option value="client">Client</option>
            <option value="courier">Livreur</option>
            <option value="super_admin">Admin</option>
          </select>
          <select
            v-model="selectedStatus"
            @change="loadUsers(1)"
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
        <div v-else-if="users.length === 0" class="p-8 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg>
          <p class="text-gray-500 text-sm">Aucun utilisateur trouvé</p>
        </div>

        <!-- Table content -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Nom</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Rôle</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Date inscription</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50 transition-colors cursor-pointer" @click="openDetail(u)">
                <td class="px-4 py-3">
                  <span class="font-medium text-gray-900">{{ u.name || '—' }}</span>
                </td>
                <td class="px-4 py-3 text-gray-600">{{ u.email || '—' }}</td>
                <td class="px-4 py-3">
                  <span :class="roleBadgeClass(u.role)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ roleLabel(u.role) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span :class="u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ u.status === 'active' ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-500">{{ formatDate(u.created_at) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2" @click.stop>
                    <button
                      @click="openDetail(u)"
                      class="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                    >
                      Voir
                    </button>
                    <button
                      @click="confirmToggle(u)"
                      :disabled="actionLoading"
                      :class="u.status === 'active' ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'"
                      class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {{ u.status === 'active' ? 'Désactiver' : 'Activer' }}
                    </button>
                  </div>
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
              @click="loadUsers(pagination.currentPage - 1)"
              :disabled="pagination.currentPage <= 1"
              class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <button
              @click="loadUsers(pagination.currentPage + 1)"
              :disabled="pagination.currentPage >= pagination.lastPage"
              class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <Teleport to="body">
        <div v-if="showDetailModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeDetailModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <!-- Loading detail -->
            <div v-if="detailLoading" class="p-8 text-center">
              <div class="inline-flex items-center gap-2 text-gray-500">
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Chargement...</span>
              </div>
            </div>

            <!-- Detail content -->
            <div v-else-if="userDetail" class="p-6">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ userDetail.name || '—' }}</h3>
                  <p class="text-sm text-gray-500 mt-0.5">{{ userDetail.email }}</p>
                </div>
                <button @click="closeDetailModal" class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <!-- Info grid -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p class="text-xs text-gray-500 font-medium mb-1">Téléphone</p>
                  <p class="text-sm text-gray-900">{{ userDetail.phone || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-medium mb-1">Rôle</p>
                  <span :class="roleBadgeClass(userDetail.role)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ roleLabel(userDetail.role) }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-medium mb-1">Statut</p>
                  <span :class="userDetail.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ userDetail.status === 'active' ? 'Actif' : 'Inactif' }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-medium mb-1">Date d'inscription</p>
                  <p class="text-sm text-gray-900">{{ formatDate(userDetail.created_at) }}</p>
                </div>
                <div v-if="userDetail.orders_count !== undefined">
                  <p class="text-xs text-gray-500 font-medium mb-1">Nombre de commandes</p>
                  <p class="text-sm font-semibold text-gray-900">{{ userDetail.orders_count }}</p>
                </div>
              </div>

              <!-- Vendor shops -->
              <div v-if="userDetail.role === 'vendor' && userDetail.shops && userDetail.shops.length > 0" class="mb-6">
                <p class="text-xs text-gray-500 font-medium mb-2">Boutiques</p>
                <div class="space-y-2">
                  <div v-for="shop in userDetail.shops" :key="shop.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ shop.name }}</p>
                      <p v-if="shop.shop_type" class="text-xs text-gray-500">{{ shop.shop_type }}</p>
                    </div>
                    <span :class="shop.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                      {{ shop.status === 'active' ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Toggle button -->
              <div class="pt-4 border-t border-gray-200">
                <button
                  @click="confirmToggle(userDetail)"
                  :disabled="actionLoading"
                  :class="userDetail.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                  class="w-full px-4 py-2.5 text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50"
                >
                  {{ userDetail.status === 'active' ? 'Désactiver cet utilisateur' : 'Activer cet utilisateur' }}
                </button>
              </div>
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

const { fetchUsers, fetchUserDetails, toggleUser } = useAdminDashboard()

// State
const loading = ref(true)
const actionLoading = ref(false)
const detailLoading = ref(false)
const users = ref<any[]>([])
const search = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const pagination = reactive({
  currentPage: 1,
  lastPage: 1
})

// Detail modal
const showDetailModal = ref(false)
const userDetail = ref<any>(null)

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
  setTimeout(() => { toast.show = false }, 3000)
}

// Helpers
const roleLabel = (role: string) => {
  const labels: Record<string, string> = {
    vendor: 'Vendeur',
    client: 'Client',
    courier: 'Livreur',
    super_admin: 'Admin'
  }
  return labels[role] || role
}

const roleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    vendor: 'bg-blue-100 text-blue-800',
    client: 'bg-green-100 text-green-800',
    courier: 'bg-orange-100 text-orange-800',
    super_admin: 'bg-purple-100 text-purple-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const isUserActive = (u: any) => u.status === 'active'

// Search debounce
const onSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadUsers(1)
  }, 400)
}

// Data loading
const loadUsers = async (page: number = 1) => {
  loading.value = true
  try {
    const params: any = { page }
    if (search.value.trim()) params.search = search.value.trim()
    if (selectedRole.value) params.role = selectedRole.value
    if (selectedStatus.value) params.status = selectedStatus.value
    const data = await fetchUsers(params)
    const paginatedUsers = data.users || data
    users.value = paginatedUsers.data || []
    pagination.currentPage = paginatedUsers.current_page || page
    pagination.lastPage = paginatedUsers.last_page || 1
  } catch (e: any) {
    showToast('Erreur lors du chargement des utilisateurs', 'error')
  } finally {
    loading.value = false
  }
}

// Detail
const openDetail = async (u: any) => {
  showDetailModal.value = true
  detailLoading.value = true
  userDetail.value = null
  try {
    const data = await fetchUserDetails(u.id)
    userDetail.value = data.user || data
  } catch (e: any) {
    showToast('Erreur lors du chargement du détail', 'error')
    showDetailModal.value = false
  } finally {
    detailLoading.value = false
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  userDetail.value = null
}

// Toggle
const confirmToggle = (u: any) => {
  toggleTarget.value = u
  const active = isUserActive(u)
  confirmTitle.value = active ? 'Désactiver l\'utilisateur' : 'Activer l\'utilisateur'
  confirmMessage.value = active
    ? `Voulez-vous vraiment désactiver ${u.name || 'cet utilisateur'} ? Il ne pourra plus se connecter.`
    : `Voulez-vous réactiver ${u.name || 'cet utilisateur'} ?`
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
    await toggleUser(toggleTarget.value.id)
    const wasActive = isUserActive(toggleTarget.value)
    showToast(wasActive ? 'Utilisateur désactivé avec succès' : 'Utilisateur activé avec succès')
    closeConfirmModal()
    // Refresh detail if open
    if (showDetailModal.value && userDetail.value?.id === toggleTarget.value.id) {
      try {
        const data = await fetchUserDetails(userDetail.value.id)
        userDetail.value = data.user || data
      } catch {}
    }
    await loadUsers(pagination.currentPage)
  } catch (e: any) {
    showToast(e.message || 'Une erreur est survenue', 'error')
  } finally {
    actionLoading.value = false
  }
}

// Init
onMounted(async () => {
  await loadUsers()
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
