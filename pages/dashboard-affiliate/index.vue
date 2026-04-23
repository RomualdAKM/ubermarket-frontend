<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div v-for="i in 5" :key="i" class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div class="h-7 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-3 bg-gray-100 rounded w-1/3"></div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div class="h-5 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="h-10 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Page title -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Tableau de bord</h1>
          <p class="text-sm text-gray-500 mt-0.5">Vue d'ensemble de votre activité d'affiliation</p>
        </div>
        <NuxtLink
          to="/dashboard-affiliate/retraits"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
          </svg>
          Demander un retrait
        </NuxtLink>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <!-- Code parrainage -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Code parrainage</p>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-emerald-700 font-mono tracking-wide">{{ referralInfo?.code || '—' }}</span>
            <button
              v-if="referralInfo?.code"
              @click="copyCode"
              class="p-1.5 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              :title="copied ? 'Copié !' : 'Copier le code'"
            >
              <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              <svg v-else class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-1">Partagez ce code</p>
        </div>

        <!-- Taux de commission -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Taux de commission</p>
          <p class="text-2xl font-bold text-gray-900">{{ referralInfo?.commission_rate ?? 0 }}%</p>
          <p class="text-xs text-gray-400 mt-1">Sur chaque vente</p>
        </div>

        <!-- Vendeurs parrainés -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Vendeurs parrainés</p>
          <p class="text-2xl font-bold text-gray-900">{{ referralInfo?.referral_count ?? 0 }}</p>
          <p class="text-xs text-gray-400 mt-1">
            {{ referralInfo?.active_referrals ?? 0 }} actif{{ (referralInfo?.active_referrals ?? 0) > 1 ? 's' : '' }}
          </p>
        </div>

        <!-- Gains totaux -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Gains totaux</p>
          <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(referralInfo?.total_earnings) }}</p>
          <p class="text-xs text-gray-400 mt-1">Depuis le début</p>
        </div>

        <!-- Solde disponible -->
        <div class="bg-white rounded-xl border border-emerald-200 p-5 bg-emerald-50/50">
          <p class="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-2">Solde disponible</p>
          <p class="text-2xl font-bold text-emerald-700">{{ formatCurrency(referralInfo?.available_balance) }}</p>
          <p class="text-xs text-emerald-500 mt-1">Retirable maintenant</p>
        </div>
      </div>

      <!-- Commissions récentes -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-base font-semibold text-gray-900">Commissions récentes</h2>
          <span class="text-xs text-gray-400">5 dernières</span>
        </div>

        <!-- Table -->
        <div v-if="commissions.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vendeur</th>
                <th class="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th class="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="commission in commissions.slice(0, 5)" :key="commission.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-3 text-gray-600 whitespace-nowrap">{{ formatDate(commission.created_at) }}</td>
                <td class="px-5 py-3 text-gray-900 font-medium">{{ commission.vendor_name || commission.referred?.name || '—' }}</td>
                <td class="px-5 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{{ formatCurrency(commission.amount) }}</td>
                <td class="px-5 py-3 text-center">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    :class="statusClass(commission.status)"
                  >
                    {{ statusLabel(commission.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div v-else class="px-5 py-12 text-center">
          <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
          </div>
          <p class="text-sm font-medium text-gray-900 mb-1">Aucune commission pour le moment</p>
          <p class="text-xs text-gray-500">Vos commissions apparaîtront ici dès que vos vendeurs parrainés réaliseront des ventes.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard-affiliate'
})

const { fetchReferralInfo, fetchCommissions, fetchBalance } = useAffiliateDashboard()

const loading = ref(true)
const referralInfo = ref<any>(null)
const commissions = ref<any[]>([])
const copied = ref(false)

// Fetch all data
onMounted(async () => {
  try {
    const [infoRes, commissionsRes] = await Promise.all([
      fetchReferralInfo(),
      fetchCommissions({ page: 1 })
    ])

    referralInfo.value = infoRes
    commissions.value = commissionsRes.data || []

    // Also fetch balance to enrich available_balance
    try {
      const balanceRes = await fetchBalance()
      if (balanceRes?.available !== undefined) {
        referralInfo.value = {
          ...referralInfo.value,
          available_balance: balanceRes.available,
          currency: balanceRes.currency
        }
      }
    } catch (e) {
      // Balance already in referral info, ignore
    }
  } catch (error) {
    console.error('Erreur chargement tableau de bord affilié:', error)
  } finally {
    loading.value = false
  }
})

// Copy referral code
const copyCode = async () => {
  if (!referralInfo.value?.code) return
  try {
    await navigator.clipboard.writeText(referralInfo.value.code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback
    const el = document.createElement('textarea')
    el.value = referralInfo.value.code
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

// Format currency
const formatCurrency = (value: number | undefined | null) => {
  const num = Number(value) || 0
  const currency = referralInfo.value?.currency || 'FCFA'
  return `${num.toLocaleString('fr-FR')} ${currency}`
}

// Format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Status badge styling
const statusClass = (status: string) => {
  switch (status) {
    case 'credited':
    case 'paid':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    case 'pending':
      return 'bg-amber-100 text-amber-700 border border-amber-200'
    case 'cancelled':
    case 'rejected':
      return 'bg-red-100 text-red-700 border border-red-200'
    default:
      return 'bg-gray-100 text-gray-600 border border-gray-200'
  }
}

// Status label in French
const statusLabel = (status: string) => {
  switch (status) {
    case 'credited': return 'Créditée'
    case 'paid': return 'Payée'
    case 'pending': return 'En attente'
    case 'cancelled': return 'Annulée'
    case 'rejected': return 'Rejetée'
    default: return status || '—'
  }
}
</script>
