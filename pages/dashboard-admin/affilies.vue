<template>
  <div class="p-6 max-w-6xl mx-auto">
    <!-- En-tête -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Gestion des affiliés commerciaux</h1>
        <p class="mt-1 text-sm text-slate-500">Gérez les affiliés et leurs taux de commission</p>
      </div>
      <button
        @click="showCreateForm = true"
        class="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Créer un affilié
      </button>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Total affiliés</p>
        <p class="mt-2 text-3xl font-semibold text-slate-900">{{ pagination.total }}</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Affiliés actifs</p>
        <p class="mt-2 text-3xl font-semibold text-green-600">{{ activeCount }}</p>
      </div>
    </div>

    <!-- Erreur -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      {{ error }}
    </div>

    <!-- Chargement -->
    <div v-if="loading && affiliates.length === 0" class="flex items-center justify-center py-20">
      <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Table des affiliés -->
    <div v-else class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div v-if="affiliates.length === 0" class="px-6 py-12 text-center">
        <svg class="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
        </svg>
        <p class="text-slate-500">Aucun affilié pour le moment</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Code parrainage</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Taux commission</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date création</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="affiliate in affiliates" :key="affiliate.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-slate-900">{{ affiliate.first_name }} {{ affiliate.last_name }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ affiliate.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <code class="text-sm bg-slate-100 px-2 py-0.5 rounded font-mono">{{ affiliate.referral_code }}</code>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">{{ affiliate.commission_rate }}%</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="affiliate.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ affiliate.status === 'active' ? 'Actif' : 'Suspendu' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{{ formatDate(affiliate.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(affiliate)"
                    class="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100 transition-colors"
                    title="Modifier le taux"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"/>
                    </svg>
                  </button>
                  <button
                    @click="confirmDisable(affiliate)"
                    class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Désactiver"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <p class="text-sm text-slate-500">
          Page {{ pagination.current_page }} sur {{ pagination.last_page }} ({{ pagination.total }} résultats)
        </p>
        <div class="flex gap-2">
          <button
            :disabled="pagination.current_page <= 1"
            @click="fetchAffiliates(pagination.current_page - 1)"
            class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <button
            :disabled="pagination.current_page >= pagination.last_page"
            @click="fetchAffiliates(pagination.current_page + 1)"
            class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Créer un affilié -->
    <Teleport to="body">
      <div v-if="showCreateForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showCreateForm = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Créer un affilié</h3>
          <form @submit.prevent="handleCreate" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                <input v-model="createForm.first_name" type="text" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                <input v-model="createForm.last_name" type="text" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input v-model="createForm.email" type="email" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <input v-model="createForm.phone" type="tel" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Taux de commission (%)</label>
              <input v-model.number="createForm.commission_rate" type="number" min="1" max="100" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="showCreateForm = false" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                Annuler
              </button>
              <button type="submit" :disabled="loading" class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50">
                {{ loading ? 'Création...' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Modifier commission -->
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showEditModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Modifier le taux de commission</h3>
          <p class="text-sm text-slate-500 mb-4">{{ editingAffiliate?.first_name }} {{ editingAffiliate?.last_name }}</p>
          <form @submit.prevent="handleUpdateCommission" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nouveau taux (%)</label>
              <input v-model.number="editCommissionRate" type="number" min="1" max="100" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="showEditModal = false" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                Annuler
              </button>
              <button type="submit" :disabled="loading" class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50">
                {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Confirmation désactivation -->
    <Teleport to="body">
      <div v-if="showDisableConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showDisableConfirm = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-2">Confirmer la désactivation</h3>
          <p class="text-sm text-slate-500 mb-6">
            Êtes-vous sûr de vouloir désactiver l'affilié <strong>{{ disablingAffiliate?.first_name }} {{ disablingAffiliate?.last_name }}</strong> ? Cette action peut être annulée ultérieurement.
          </p>
          <div class="flex justify-end gap-3">
            <button @click="showDisableConfirm = false" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              Annuler
            </button>
            <button @click="handleDisable" :disabled="loading" class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50">
              {{ loading ? 'Désactivation...' : 'Désactiver' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminAffiliates, type CommercialAffiliate, type CreateAffiliatePayload } from '~/composables/useAdminAffiliates'

definePageMeta({
  layout: 'dashboard-admin'
})

const { affiliates, loading, error, pagination, fetchAffiliates, createAffiliate, updateCommissionRate, disableAffiliate } = useAdminAffiliates()

// Stats
const activeCount = computed(() => affiliates.value.filter(a => a.status === 'active').length)

// Formulaire création
const showCreateForm = ref(false)
const createForm = ref<CreateAffiliatePayload>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  commission_rate: 10,
})

const handleCreate = async () => {
  try {
    await createAffiliate(createForm.value)
    showCreateForm.value = false
    createForm.value = { first_name: '', last_name: '', email: '', phone: '', commission_rate: 10 }
  } catch (e) {
    // error is already set in composable
  }
}

// Édition commission
const showEditModal = ref(false)
const editingAffiliate = ref<CommercialAffiliate | null>(null)
const editCommissionRate = ref(10)

const openEditModal = (affiliate: CommercialAffiliate) => {
  editingAffiliate.value = affiliate
  editCommissionRate.value = affiliate.commission_rate
  showEditModal.value = true
}

const handleUpdateCommission = async () => {
  if (!editingAffiliate.value) return
  try {
    await updateCommissionRate(editingAffiliate.value.id, editCommissionRate.value)
    showEditModal.value = false
  } catch (e) {
    // error is already set in composable
  }
}

// Désactivation
const showDisableConfirm = ref(false)
const disablingAffiliate = ref<CommercialAffiliate | null>(null)

const confirmDisable = (affiliate: CommercialAffiliate) => {
  disablingAffiliate.value = affiliate
  showDisableConfirm.value = true
}

const handleDisable = async () => {
  if (!disablingAffiliate.value) return
  try {
    await disableAffiliate(disablingAffiliate.value.id)
    showDisableConfirm.value = false
  } catch (e) {
    // error is already set in composable
  }
}

// Formatage date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Charger au montage
onMounted(() => {
  fetchAffiliates()
})
</script>
