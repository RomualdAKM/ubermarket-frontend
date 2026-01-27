<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Équipe</h1>
      <p class="text-gray-600">Gérez les collaborateurs de votre boutique</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-medium text-gray-500">Total</h2>
            <p class="text-2xl font-bold text-gray-700">{{ stats?.total || 0 }}</p>
          </div>
          <div class="p-3 bg-gray-100 rounded-full">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-medium text-gray-500">Actifs</h2>
            <p class="text-2xl font-bold text-green-600">{{ stats?.active || 0 }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-medium text-gray-500">En attente</h2>
            <p class="text-2xl font-bold text-orange-600">{{ stats?.pending || 0 }}</p>
          </div>
          <div class="p-3 bg-orange-100 rounded-full">
            <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-medium text-gray-500">Limite</h2>
            <p class="text-2xl font-bold text-gray-700">
              {{ isUnlimited ? '∞' : `${stats?.total || 0}/${limits?.limit || 0}` }}
            </p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton inviter -->
    <div class="mb-6 flex justify-between items-center">
      <div v-if="!canAddMore && !isUnlimited" class="text-sm text-orange-600">
        Limite atteinte. Passez à un plan supérieur pour inviter plus de collaborateurs.
      </div>
      <div v-else></div>
      <button 
        @click="showInviteModal = true"
        :disabled="!canAddMore && !isUnlimited"
        class="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Inviter un collaborateur
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Liste des collaborateurs -->
    <div v-else-if="collaborators.length > 0" class="bg-white border-t border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collaborateur</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ajouté le</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="collab in collaborators" :key="collab.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-gray-600 font-medium">
                    {{ getInitials(collab.user?.name || collab.invited_email || '?') }}
                  </span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ collab.user?.name || 'Invitation en attente' }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ collab.user?.email || collab.invited_email }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ collab.role.name }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(collab.status, collab.is_expired)"
              >
                {{ getStatusLabel(collab.status, collab.is_expired) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(collab.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <!-- Renvoyer invitation -->
                <button 
                  v-if="collab.status === 'pending'"
                  @click="handleResend(collab.id)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Renvoyer l'invitation"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <!-- Modifier rôle -->
                <button 
                  v-if="collab.status !== 'pending'"
                  @click="openEditModal(collab)"
                  class="text-gray-600 hover:text-gray-900"
                  title="Modifier le rôle"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <!-- Activer/Désactiver -->
                <button 
                  v-if="collab.status !== 'pending'"
                  @click="handleToggle(collab.id)"
                  :class="collab.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                  :title="collab.status === 'active' ? 'Désactiver' : 'Activer'"
                >
                  <svg v-if="collab.status === 'active'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <!-- Supprimer -->
                <button 
                  @click="handleRemove(collab.id)"
                  class="text-red-600 hover:text-red-900"
                  title="Supprimer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Aucun collaborateur -->
    <div v-else class="bg-white p-12 text-center border-t border-gray-200">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun collaborateur</h3>
      <p class="mt-1 text-sm text-gray-500">Commencez par inviter un membre de votre équipe.</p>
    </div>

    <!-- Modal d'invitation -->
    <Teleport to="body">
      <div v-if="showInviteModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showInviteModal = false"></div>
          
          <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Inviter un collaborateur</h2>
            
            <form @submit.prevent="handleInvite" class="space-y-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  v-model="inviteForm.email"
                  type="email"
                  id="email"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"
                  placeholder="email@exemple.com"
                >
              </div>
              
              <div>
                <label for="role" class="block text-sm font-medium text-gray-700">Rôle</label>
                <select 
                  v-model="inviteForm.role"
                  id="role"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"
                >
                  <option value="">Sélectionnez un rôle</option>
                  <option v-for="role in roles" :key="role.code" :value="role.code">
                    {{ role.name }} - {{ role.description }}
                  </option>
                </select>
              </div>
              
              <div class="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  @click="showInviteModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-secondary disabled:bg-gray-300"
                >
                  {{ loading ? 'Envoi...' : 'Envoyer l\'invitation' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de modification -->
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showEditModal = false"></div>
          
          <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Modifier le rôle</h2>
            
            <form @submit.prevent="handleUpdateRole" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Collaborateur</label>
                <p class="text-gray-900">{{ editingCollab?.user?.name || editingCollab?.invited_email }}</p>
              </div>
              
              <div>
                <label for="edit-role" class="block text-sm font-medium text-gray-700">Nouveau rôle</label>
                <select 
                  v-model="editForm.role"
                  id="edit-role"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"
                >
                  <option v-for="role in roles" :key="role.code" :value="role.code">
                    {{ role.name }}
                  </option>
                </select>
              </div>
              
              <div class="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  @click="showEditModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-secondary disabled:bg-gray-300"
                >
                  {{ loading ? 'Mise à jour...' : 'Enregistrer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Messages -->
    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ successMessage }}
    </div>
    <div v-if="error" class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCollaborators, type Collaborator } from '~/composables/useCollaborators'
import { useShops } from '~/composables/useShops'

definePageMeta({
  layout: 'dashboard'
})

const { currentShop } = useShops()
const {
  collaborators,
  stats,
  limits,
  roles,
  loading,
  error,
  canAddMore,
  isUnlimited,
  fetchCollaborators,
  fetchRoles,
  invite,
  resendInvitation,
  updateRole,
  toggleStatus,
  remove
} = useCollaborators()

// State local
const showInviteModal = ref(false)
const showEditModal = ref(false)
const editingCollab = ref<Collaborator | null>(null)
const successMessage = ref('')

const inviteForm = reactive({
  email: '',
  role: ''
})

const editForm = reactive({
  role: ''
})

// Chargement initial
onMounted(async () => {
  if (currentShop.value?.id) {
    await Promise.all([
      fetchCollaborators(currentShop.value.id),
      fetchRoles()
    ])
  }
})

// Helpers
const getInitials = (name: string) => {
  const parts = name.split(/[@\s]/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const getStatusClass = (status: string, isExpired: boolean) => {
  if (isExpired) return 'bg-red-100 text-red-800'
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-orange-100 text-orange-800'
    case 'inactive': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string, isExpired: boolean) => {
  if (isExpired) return 'Expiré'
  switch (status) {
    case 'active': return 'Actif'
    case 'pending': return 'En attente'
    case 'inactive': return 'Inactif'
    default: return status
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const showSuccess = (msg: string) => {
  successMessage.value = msg
  setTimeout(() => { successMessage.value = '' }, 3000)
}

// Actions
const handleInvite = async () => {
  if (!currentShop.value?.id) return
  try {
    await invite(currentShop.value.id, inviteForm)
    showInviteModal.value = false
    inviteForm.email = ''
    inviteForm.role = ''
    showSuccess('Invitation envoyée avec succès')
  } catch (e) {
    // L'erreur est gérée par le composable
  }
}

const handleResend = async (collaboratorId: number) => {
  if (!currentShop.value?.id) return
  try {
    await resendInvitation(currentShop.value.id, collaboratorId)
    showSuccess('Invitation renvoyée')
  } catch (e) {
    // L'erreur est gérée par le composable
  }
}

const openEditModal = (collab: Collaborator) => {
  editingCollab.value = collab
  editForm.role = collab.role.code
  showEditModal.value = true
}

const handleUpdateRole = async () => {
  if (!currentShop.value?.id || !editingCollab.value) return
  try {
    await updateRole(currentShop.value.id, editingCollab.value.id, { role: editForm.role })
    showEditModal.value = false
    editingCollab.value = null
    showSuccess('Rôle mis à jour')
  } catch (e) {
    // L'erreur est gérée par le composable
  }
}

const handleToggle = async (collaboratorId: number) => {
  if (!currentShop.value?.id) return
  try {
    await toggleStatus(currentShop.value.id, collaboratorId)
    showSuccess('Statut modifié')
  } catch (e) {
    // L'erreur est gérée par le composable
  }
}

const handleRemove = async (collaboratorId: number) => {
  if (!currentShop.value?.id) return
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce collaborateur ?')) return
  try {
    await remove(currentShop.value.id, collaboratorId)
    showSuccess('Collaborateur supprimé')
  } catch (e) {
    // L'erreur est gérée par le composable
  }
}
</script>
