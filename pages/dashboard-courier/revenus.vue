<template>
  <div>
    <h1 class="text-xl font-bold text-gray-900 mb-6">Mes revenus</h1>

    <!-- Message pour les employés partenaire -->
    <div v-if="isPartnerEmployee" class="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
      <svg class="w-12 h-12 text-blue-400 mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
      </svg>
      <p class="text-blue-800 font-medium">Les informations financières sont gérées par votre partenaire.</p>
      <p class="text-blue-600 text-sm mt-2">Contactez votre responsable pour plus de détails.</p>
    </div>

    <!-- Contenu pour livreurs indépendants -->
    <div v-else>
      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else>
        <!-- Stats cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500">Total des revenus</p>
                <p class="text-lg font-bold text-gray-900">{{ formatPrice(earnings?.total_earnings || 0) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500">En attente</p>
                <p class="text-lg font-bold text-gray-900">{{ formatPrice(earnings?.pending_earnings || 0) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500">Livraisons terminées</p>
                <p class="text-lg font-bold text-gray-900">{{ earnings?.completed_deliveries || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Earnings history -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div class="px-4 py-3 border-b border-gray-100">
            <h2 class="text-sm font-semibold text-gray-900">Historique des gains</h2>
          </div>

          <div v-if="!earnings?.earnings_history || earnings.earnings_history.length === 0" class="p-8 text-center">
            <p class="text-gray-400 text-sm">Aucun historique de gains</p>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="entry in earnings.earnings_history"
              :key="entry.id"
              class="px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p class="text-sm font-medium text-gray-700">#{{ entry.order_reference }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(entry.date) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-green-600">+{{ formatPrice(entry.amount) }}</p>
                <span
                  class="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  :class="entry.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                >
                  {{ entry.status === 'paid' ? 'Payé' : 'En attente' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CourierEarnings } from '~/composables/useCourierDashboard'

definePageMeta({ layout: 'dashboard-courier' })

const { courierUser, getCourierEarnings } = useCourierDashboard()

const isLoading = ref(false)
const earnings = ref<CourierEarnings | null>(null)
const isPartnerEmployee = computed(() => courierUser.value?.courier_type === 'partner_employee')

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

onMounted(async () => {
  if (!isPartnerEmployee.value) {
    isLoading.value = true
    try {
      const response = await getCourierEarnings()
      if (response.success) {
        earnings.value = response.data || response
      }
    } catch (err: any) {
      console.error('Erreur chargement revenus:', err)
    } finally {
      isLoading.value = false
    }
  }
})
</script>
