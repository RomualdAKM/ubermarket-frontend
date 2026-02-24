<template>
  <div class="p-6 max-w-5xl mx-auto">
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-slate-900">Programme d'affiliation</h1>
      <p class="mt-1 text-sm text-slate-500">Parrainez de nouveaux vendeurs et gagnez des commissions sur leurs abonnements</p>
    </div>

    <!-- Chargement -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <template v-else>
      <!-- Carte Code d'affiliation -->
      <div class="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p class="text-white/80 text-sm font-medium mb-1">Votre code d'affiliation</p>
            <div class="flex items-center gap-3">
              <span class="text-3xl font-bold tracking-wider">{{ referralData?.code || '--------' }}</span>
              <button 
                @click="copyCode"
                class="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                title="Copier le code"
              >
                <svg v-if="!codeCopied" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                </svg>
                <svg v-else class="w-5 h-5 text-green-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="text-right">
            <p class="text-white/80 text-sm font-medium mb-1">Taux de commission</p>
            <span class="text-3xl font-bold">{{ referralData?.commission_rate || 10 }}%</span>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white border border-slate-200 rounded-xl p-4">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Filleuls inscrits</p>
          <p class="mt-2 text-2xl font-semibold text-slate-900">{{ referralData?.referral_count || 0 }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-4">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Filleuls actifs</p>
          <p class="mt-2 text-2xl font-semibold text-slate-900">{{ referralData?.active_referrals || 0 }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-4">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Total gagné</p>
          <p class="mt-2 text-2xl font-semibold text-green-600">{{ formatCurrency(referralData?.total_earnings || 0) }}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-4">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Solde disponible</p>
          <p class="mt-2 text-2xl font-semibold text-primary">{{ formatCurrency(referralData?.available_balance || 0) }}</p>
        </div>
      </div>

      <!-- Comment ça marche -->
      <div class="bg-slate-50 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Comment ça marche ?</h2>
        <div class="grid sm:grid-cols-3 gap-6">
          <div class="flex gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">1</div>
            <div>
              <p class="font-medium text-slate-900">Partagez votre code</p>
              <p class="text-sm text-slate-500 mt-1">Envoyez votre code à vos contacts intéressés par la création d'une boutique</p>
            </div>
          </div>
          <div class="flex gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">2</div>
            <div>
              <p class="font-medium text-slate-900">Ils s'inscrivent</p>
              <p class="text-sm text-slate-500 mt-1">Vos filleuls utilisent votre code lors de leur inscription</p>
            </div>
          </div>
          <div class="flex gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">3</div>
            <div>
              <p class="font-medium text-slate-900">Vous gagnez</p>
              <p class="text-sm text-slate-500 mt-1">Recevez {{ referralData?.commission_rate || 10 }}% de commission sur chaque abonnement payant</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Historique des commissions -->
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200">
          <h2 class="text-lg font-semibold text-slate-900">Historique des commissions</h2>
        </div>
        
        <div v-if="commissions.length === 0" class="px-6 py-12 text-center">
          <svg class="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"/>
          </svg>
          <p class="text-slate-500">Aucune commission pour le moment</p>
          <p class="text-sm text-slate-400 mt-1">Partagez votre code pour commencer à gagner</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Filleul</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Taux</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Commission</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="commission in commissions" :key="commission.id" class="hover:bg-slate-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-slate-900">{{ commission.referred?.name || 'Utilisateur' }}</div>
                  <div class="text-xs text-slate-500">{{ commission.referred?.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ commission.subscription_payment?.plan_name || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ commission.rate }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  +{{ formatCurrency(commission.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {{ formatDate(commission.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const config = useRuntimeConfig()
const route = useRoute()

const isLoading = ref(true)
const codeCopied = ref(false)

// Données d'affiliation
const referralData = ref<{
  code: string
  commission_rate: number
  referral_count: number
  active_referrals: number
  total_earnings: number
  available_balance: number
  currency: string
} | null>(null)

const commissions = ref<any[]>([])

// Charger les données
const loadReferralData = async () => {
  isLoading.value = true
  
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    // Charger les infos d'affiliation
    const response = await fetch(`${config.public.apiBase}/vendor/referral`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    const data = await response.json()
    if (data.success) {
      referralData.value = data.referral
    }

    // Charger l'historique des commissions
    const commissionsResponse = await fetch(`${config.public.apiBase}/vendor/referral/commissions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    const commissionsData = await commissionsResponse.json()
    if (commissionsData.success) {
      commissions.value = commissionsData.commissions?.data || []
    }

  } catch (error) {
    console.error('Erreur chargement affiliation:', error)
  } finally {
    isLoading.value = false
  }
}

// Copier le code
const copyCode = async () => {
  if (!referralData.value?.code) return
  
  try {
    await navigator.clipboard.writeText(referralData.value.code)
    codeCopied.value = true
    setTimeout(() => {
      codeCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Erreur copie:', error)
  }
}

// Formatage monétaire
const formatCurrency = (amount: number) => {
  const currency = referralData.value?.currency || 'EUR'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Formatage date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(() => {
  loadReferralData()
})
</script>
