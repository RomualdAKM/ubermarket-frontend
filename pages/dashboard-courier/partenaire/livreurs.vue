<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <NuxtLink to="/dashboard-courier/partenaire" class="text-indigo-600 hover:text-indigo-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
            </svg>
          </NuxtLink>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">Espace Partenaire</span>
        </div>
        <h1 class="text-xl font-bold text-gray-900">Mes livreurs</h1>
      </div>
      <button
        @click="showAddForm = true"
        class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors min-h-[44px]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Ajouter un livreur
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <template v-else>
      <!-- Error state -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <p class="text-sm text-red-700">{{ error }}</p>
        <button @click="loadCouriers" class="mt-2 text-sm text-red-600 font-medium hover:underline">Réessayer</button>
      </div>

      <!-- Empty state -->
      <div v-if="couriers.length === 0 && !error" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
        </svg>
        <p class="text-gray-500 font-medium">Aucun livreur pour le moment</p>
        <p class="text-gray-400 text-sm mt-1">Ajoutez votre premier livreur pour commencer</p>
      </div>

      <!-- Couriers list -->
      <div v-else class="space-y-3">
        <div
          v-for="courier in couriers"
          :key="courier.id"
          class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold text-indigo-600">{{ getInitials(courier.name) }}</span>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ courier.name }}</p>
                <p class="text-xs text-gray-500">{{ courier.phone }}</p>
              </div>
            </div>
            <span
              class="text-xs font-medium px-2 py-0.5 rounded-full"
              :class="courier.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
            >
              {{ courier.is_active ? 'Actif' : 'Inactif' }}
            </span>
          </div>

          <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
              </svg>
              {{ courier.email }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
              </svg>
              {{ courier.deliveries_count }} livraisons
            </span>
          </div>

          <div class="mt-3 pt-3 border-t border-gray-100 flex justify-end">
            <button
              @click="handleToggle(courier.id, courier.is_active)"
              :disabled="toggleLoading === courier.id"
              class="text-sm font-medium px-4 py-2 rounded-lg transition-colors min-h-[40px] flex items-center gap-2"
              :class="courier.is_active
                ? 'text-red-600 hover:bg-red-50'
                : 'text-green-600 hover:bg-green-50'"
            >
              <svg v-if="toggleLoading === courier.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ courier.is_active ? 'Désactiver' : 'Activer' }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Add Courier Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAddForm" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div class="absolute inset-0 bg-black/50" @click="closeAddForm"></div>
          <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">Ajouter un livreur</h2>
              <button @click="closeAddForm" class="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleAddCourier" class="p-5 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nom du livreur"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="06 00 00 00 00"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  v-model="form.password"
                  type="password"
                  required
                  minlength="8"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Minimum 8 caractères"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Zones de couverture</label>
                <input
                  v-model="zonesInput"
                  type="text"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Paris, Lyon, Marseille (séparées par des virgules)"
                />
                <p class="text-xs text-gray-400 mt-1">Séparées par des virgules</p>
              </div>

              <!-- Validation errors -->
              <div v-if="formErrors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-3">
                <ul class="text-sm text-red-700 space-y-1">
                  <li v-for="(err, i) in formErrors" :key="i">{{ err }}</li>
                </ul>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full py-3 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ajouter le livreur
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, onMounted } from 'vue'
import type { PartnerCourier } from '~/composables/usePartnerDashboard'

definePageMeta({ layout: 'dashboard-courier' })

const router = useRouter()
const { isPartner, getPartnerCouriers, addPartnerCourier, togglePartnerCourier } = usePartnerDashboard()
const { courierUser } = useCourierDashboard()
const showToast = inject<(msg: string, type: 'success' | 'error') => void>('showToast', () => {})

const isLoading = ref(true)
const error = ref('')
const couriers = ref<PartnerCourier[]>([])
const toggleLoading = ref<number | null>(null)
const showAddForm = ref(false)
const isSubmitting = ref(false)
const formErrors = ref<string[]>([])
const zonesInput = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: ''
})

const getInitials = (name: string) => {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const loadCouriers = async () => {
  isLoading.value = true
  error.value = ''
  try {
    couriers.value = await getPartnerCouriers()
  } catch (err: any) {
    error.value = err.message || 'Impossible de charger les livreurs'
  } finally {
    isLoading.value = false
  }
}

const handleToggle = async (id: number, currentlyActive: boolean) => {
  toggleLoading.value = id
  try {
    await togglePartnerCourier(id)
    showToast(currentlyActive ? 'Livreur désactivé' : 'Livreur activé', 'success')
    await loadCouriers()
  } catch (err: any) {
    showToast(err.message || 'Erreur lors de la mise à jour', 'error')
  } finally {
    toggleLoading.value = null
  }
}

const closeAddForm = () => {
  showAddForm.value = false
  formErrors.value = []
  form.name = ''
  form.email = ''
  form.phone = ''
  form.password = ''
  zonesInput.value = ''
}

const handleAddCourier = async () => {
  formErrors.value = []
  isSubmitting.value = true

  const zones = zonesInput.value.split(',').map(z => z.trim()).filter(Boolean)

  try {
    await addPartnerCourier({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      zones
    })
    showToast('Livreur ajouté avec succès', 'success')
    closeAddForm()
    await loadCouriers()
  } catch (err: any) {
    if (err.errors) {
      formErrors.value = ([] as string[]).concat(...Object.values(err.errors) as string[][])
    } else {
      formErrors.value = [err.message || 'Erreur lors de l\'ajout']
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  if (courierUser.value && !isPartner.value) {
    router.push('/dashboard-courier/livraisons')
    return
  }
  await loadCouriers()
})
</script>

<style scoped>
.modal-enter-active { transition: all 0.3s ease-out; }
.modal-leave-active { transition: all 0.2s ease-in; }
.modal-enter-from { opacity: 0; }
.modal-leave-to { opacity: 0; }
</style>
