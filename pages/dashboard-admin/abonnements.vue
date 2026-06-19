<template>
  <div class="space-y-6">

    <!-- ===== EN-TÊTE ===== -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestion des abonnements</h1>
        <p class="text-sm text-gray-500 mt-1">
          Suivi des plans, expirations, scores d'engagement et segmentation
        </p>
      </div>
      <!-- Bouton recalcul scores -->
      <button
        @click="recalculateAllScores"
        :disabled="recalculating"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        <svg v-if="recalculating" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        {{ recalculating ? 'Calcul en cours...' : 'Recalculer tous les scores' }}
      </button>
    </div>

    <!-- ===== KPIs (5 cartes) ===== -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <!-- Par plan -->
      <div v-for="plan in planStats" :key="plan.plan" class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">
          Plan {{ plan.plan || 'Welcome' }}
        </p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ plan.total }}</p>
      </div>
    </div>

    <!-- ===== ALERTES (expirations + échecs) ===== -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

      <!-- Expirent dans 7 jours (Proposition 2) -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
        <div class="text-3xl">⏰</div>
        <div>
          <p class="text-sm font-semibold text-amber-800">Expirent dans 7 jours</p>
          <p class="text-2xl font-bold text-amber-600">{{ stats.expiring_this_week ?? 0 }}</p>
          <button @click="activeTab = 'expiring'; loadVendors()"
            class="text-xs text-amber-700 underline mt-1">Voir la liste →</button>
        </div>
      </div>

      <!-- Échecs de paiement (Proposition 1) -->
      <div class="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-4">
        <div class="text-3xl">💳</div>
        <div>
          <p class="text-sm font-semibold text-red-800">Échecs de paiement</p>
          <p class="text-2xl font-bold text-red-600">{{ stats.payment_failures ?? 0 }}</p>
          <button @click="filters.has_failures = true; activeTab = 'vendors'; loadVendors()"
            class="text-xs text-red-700 underline mt-1">Voir la liste →</button>
        </div>
      </div>

      <!-- Downgrades ce mois (Proposition 3) -->
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-4">
        <div class="text-3xl">⬇️</div>
        <div>
          <p class="text-sm font-semibold text-gray-700">Downgrades ce mois</p>
          <p class="text-2xl font-bold text-gray-600">{{ stats.downgraded_this_month ?? 0 }}</p>
        </div>
      </div>
    </div>

    <!-- ===== SCORE D'ENGAGEMENT — Distribution (Proposition 4) ===== -->
    <div class="bg-white border border-gray-200 rounded-xl p-5">
      <h2 class="text-base font-semibold text-gray-900 mb-4">Score d'engagement — Distribution</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="level in engagementLevels" :key="level.key"
          class="p-4 rounded-xl border cursor-pointer transition-all"
          :style="{ borderColor: filters.engagement_level === level.key ? level.color : '#e5e7eb',
                    backgroundColor: filters.engagement_level === level.key ? level.color + '15' : '' }"
          @click="filterByEngagement(level.key)">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium" :style="{ color: level.color }">{{ level.label }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full text-white font-bold"
              :style="{ backgroundColor: level.color }">
              {{ stats.engagement?.[level.key] ?? 0 }}
            </span>
          </div>
          <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all"
              :style="{
                width: totalVendors > 0
                  ? `${((stats.engagement?.[level.key] ?? 0) / totalVendors) * 100}%`
                  : '0%',
                backgroundColor: level.color
              }"></div>
          </div>
          <p class="text-xs text-gray-400 mt-1">{{ level.range }}</p>
        </div>
      </div>
    </div>

    <!-- ===== ONGLETS ===== -->
    <div class="border-b border-gray-200">
      <nav class="flex gap-6">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key; loadVendors()"
          class="py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
          :class="activeTab === tab.key
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'">
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- ===== FILTRES (Proposition 5 — Segmentation) ===== -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3">
      <select v-model="filters.plan" @change="loadVendors"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">Tous les plans</option>
        <option value="welcome">Welcome</option>
        <option value="gratuit">Gratuit</option>
        <option value="standard">Standard</option>
        <option value="premium">Premium</option>
        <option value="elite">Elite</option>
      </select>

      <select v-model="filters.engagement_level" @change="loadVendors"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">Tous niveaux d'engagement</option>
        <option value="high">🟢 Très engagé (75+)</option>
        <option value="medium">🔵 Engagé (50-74)</option>
        <option value="low">🟡 Peu actif (25-49)</option>
        <option value="inactive">🔴 Inactif (0-24)</option>
      </select>

      <select v-model="filters.inactive_since" @change="loadVendors"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">Toute activité</option>
        <option value="7">Inactif +7 jours</option>
        <option value="30">Inactif +30 jours</option>
        <option value="60">Inactif +60 jours</option>
        <option value="90">Inactif +90 jours</option>
      </select>

      <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input type="checkbox" v-model="filters.has_failures" @change="loadVendors"
          class="rounded border-gray-300 text-indigo-600" />
        Avec échecs de paiement
      </label>

      <!-- Réinitialiser les filtres -->
      <button @click="resetFilters"
        class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
        ✕ Réinitialiser
      </button>

      <!-- Envoi groupé (Proposition 5) -->
      <button v-if="vendors.data?.length" @click="openBulkMail"
        class="ml-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
        📧 Email groupé ({{ vendors.total }} vendeurs)
      </button>
    </div>

    <!-- ===== TABLEAU VENDEURS ===== -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="!vendors.data?.length" class="text-center py-12 text-gray-400">
        <p class="text-lg">Aucun vendeur ne correspond aux filtres sélectionnés.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th class="px-4 py-3 text-left">Vendeur</th>
              <th class="px-4 py-3 text-left">Plan</th>
              <th class="px-4 py-3 text-left">Expiration</th>
              <th class="px-4 py-3 text-left">Dernière connexion</th>
              <th class="px-4 py-3 text-left">Score engagement</th>
              <th class="px-4 py-3 text-left">Paiement</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="vendor in vendors.data" :key="vendor.id" class="hover:bg-gray-50 transition-colors">

              <!-- Vendeur -->
              <td class="px-4 py-3">
                <p class="font-medium text-gray-900">{{ vendor.name }}</p>
                <p class="text-xs text-gray-400">{{ vendor.email }}</p>
              </td>

              <!-- Plan -->
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold"
                  :class="planBadgeClass(vendor.subscription_plan)">
                  {{ vendor.subscription_plan || 'welcome' }}
                </span>
                <p v-if="vendor.plan_downgraded_at" class="text-xs text-gray-400 mt-0.5">
                  Dégradé le {{ formatDate(vendor.plan_downgraded_at) }}
                </p>
              </td>

              <!-- Expiration -->
              <td class="px-4 py-3">
                <span v-if="vendor.subscriptions?.[0]?.expires_at">
                  <p :class="expirationClass(vendor.subscriptions[0].expires_at)" class="font-medium">
                    {{ formatDate(vendor.subscriptions[0].expires_at) }}
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ daysUntil(vendor.subscriptions[0].expires_at) }}
                  </p>
                </span>
                <span v-else class="text-xs text-gray-400">—</span>
              </td>

              <!-- Dernière connexion -->
              <td class="px-4 py-3">
                <p v-if="vendor.last_login_at" class="text-gray-600">
                  {{ formatDate(vendor.last_login_at) }}
                </p>
                <p v-else class="text-xs text-red-400">Jamais connecté</p>
              </td>

              <!-- Score engagement (Proposition 4) -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-100 rounded-full h-1.5 max-w-16">
                    <div class="h-1.5 rounded-full transition-all"
                      :style="{
                        width: `${vendor.engagement_score}%`,
                        backgroundColor: engagementColor(vendor.engagement_score)
                      }"></div>
                  </div>
                  <span class="text-xs font-bold" :style="{ color: engagementColor(vendor.engagement_score) }">
                    {{ vendor.engagement_score }}/100
                  </span>
                </div>
                <p class="text-xs mt-0.5" :style="{ color: engagementColor(vendor.engagement_score) }">
                  {{ engagementLabel(vendor.engagement_score) }}
                </p>
              </td>

              <!-- Statut paiement (Proposition 1) -->
              <td class="px-4 py-3">
                <span v-if="vendor.payment_failure_count > 0"
                  class="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  {{ vendor.payment_failure_count }} échec(s)
                </span>
                <span v-else class="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  OK
                </span>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3">
                <div class="flex gap-1 flex-wrap">

                  <!-- Recalculer score -->
                  <button @click="recalculateScore(vendor)"
                    class="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
                    title="Recalculer le score">
                    📊
                  </button>

                  <!-- Réinitialiser échecs paiement -->
                  <button v-if="vendor.payment_failure_count > 0"
                    @click="resetPaymentFailures(vendor)"
                    class="px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100"
                    title="Réinitialiser les échecs">
                    💳 OK
                  </button>

                  <!-- Restaurer plan -->
                  <button v-if="vendor.plan_downgraded_at"
                    @click="openRestorePlan(vendor)"
                    class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                    title="Restaurer le plan">
                    ⬆️ Plan
                  </button>

                  <!-- Envoyer un email individuel -->
                  <button @click="openSingleMail(vendor)"
                    class="px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
                    title="Envoyer un email">
                    📧
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="vendors.last_page > 1" class="flex justify-center gap-2 p-4 border-t border-gray-100">
        <button v-for="p in vendors.last_page" :key="p" @click="loadVendors(p)"
          class="w-8 h-8 rounded-lg text-sm transition-colors"
          :class="vendors.current_page === p
            ? 'bg-indigo-600 text-white'
            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'">
          {{ p }}
        </button>
      </div>
    </div>

    <!-- ===== MODAL EMAIL (individuel ou groupé) ===== -->
    <Teleport to="body">
      <div v-if="showMailModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            {{ mailForm.isBulk ? 'Email groupé' : 'Email individuel' }}
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            {{ mailForm.isBulk
              ? `Envoi à ${vendors.total} vendeurs correspondant aux filtres`
              : `Envoi à : ${mailForm.userName}` }}
          </p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type d'email</label>
              <select v-model="mailForm.type"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="boost">📈 Email de boost — motivation à vendre</option>
                <option value="advice">💡 Conseils de vente</option>
                <option value="warning">⚠️ Relance CGU — mise en conformité</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Message personnalisé
                <span class="text-gray-400 font-normal">(optionnel — sinon template par défaut)</span>
              </label>
              <textarea v-model="mailForm.message" rows="4"
                placeholder="Laissez vide pour utiliser le contenu par défaut selon le type..."
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </textarea>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button @click="showMailModal = false"
              class="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50">
              Annuler
            </button>
            <button @click="sendMail" :disabled="sendingMail"
              class="flex-1 py-2.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-50">
              {{ sendingMail ? 'Envoi en cours...' : 'Envoyer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== MODAL RESTAURATION PLAN ===== -->
    <Teleport to="body">
      <div v-if="showRestoreModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">Restaurer un plan</h3>
          <p class="text-sm text-gray-500 mb-4">Vendeur : {{ restoreTarget?.name }}</p>

          <select v-model="restorePlan"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="gratuit">Gratuit</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="elite">Elite</option>
          </select>

          <div class="flex gap-3">
            <button @click="showRestoreModal = false"
              class="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50">
              Annuler
            </button>
            <button @click="confirmRestorePlan"
              class="flex-1 py-2.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700">
              Restaurer
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard-admin' })

const config    = useRuntimeConfig()
const { token } = useAuth()

// =============================================
// ÉTAT
// =============================================
const loading       = ref(false)
const recalculating = ref(false)
const sendingMail   = ref(false)
const activeTab     = ref('vendors')

const stats      = ref<any>({})
const vendors    = ref<any>({ data: [], total: 0, last_page: 1, current_page: 1 })
const planStats  = ref<any[]>([])

const showMailModal    = ref(false)
const showRestoreModal = ref(false)
const restoreTarget    = ref<any>(null)
const restorePlan      = ref('standard')

const mailForm = reactive({
  type: 'boost', message: '',
  userId: null as number | null,
  userName: '', isBulk: false,
})

// Filtres (Proposition 5 — segmentation)
const filters = reactive({
  plan:             '',
  engagement_level: '',
  inactive_since:   '',
  has_failures:     false,
})

// =============================================
// ONGLETS
// =============================================
const tabs = [
  { key: 'vendors',  label: 'Tous les vendeurs' },
  { key: 'expiring', label: '⏰ Expirent bientôt' },
  { key: 'failures', label: '💳 Échecs paiement' },
  { key: 'downgraded', label: '⬇️ Dégradés' },
]

// =============================================
// DONNÉES STATIQUES
// =============================================
const engagementLevels = [
  { key: 'high',     label: 'Très engagé',  color: '#10b981', range: 'Score 75-100' },
  { key: 'medium',   label: 'Engagé',        color: '#5B6AC5', range: 'Score 50-74' },
  { key: 'low',      label: 'Peu actif',     color: '#f59e0b', range: 'Score 25-49' },
  { key: 'inactive', label: 'Inactif',       color: '#ef4444', range: 'Score 0-24'  },
]

const totalVendors = computed(() =>
  Object.values(stats.value.engagement || {}).reduce((a: any, b: any) => a + b, 0) as number
)

// =============================================
// API HELPER
// =============================================
const api = async (path: string, opts: RequestInit = {}) => {
  const res = await fetch(`${config.public.apiBase}/admin${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token.value}`,
      Accept: 'application/json',
      ...(opts.headers || {}),
    },
  })
  return res.json()
}

// =============================================
// CHARGEMENT DES DONNÉES
// =============================================
const loadStats = async () => {
  const d = await api('/subscriptions/stats')
  if (d.success) {
    stats.value     = d.data
    planStats.value = d.data.by_plan || []
  }
}

const loadVendors = async (page = 1) => {
  loading.value = true
  try {
    // Construire les paramètres selon l'onglet actif
    const params = new URLSearchParams({ page: String(page) })

    if (activeTab.value === 'expiring') params.set('expiring_days', '7')
    if (activeTab.value === 'failures') params.set('has_failures', 'true')
    if (activeTab.value === 'downgraded') params.set('downgraded', 'true')

    if (filters.plan)             params.set('plan', filters.plan)
    if (filters.engagement_level) params.set('engagement_level', filters.engagement_level)
    if (filters.inactive_since)   params.set('inactive_since', filters.inactive_since)
    if (filters.has_failures)     params.set('has_failures', 'true')

    const endpoint = activeTab.value === 'expiring'
      ? `/subscriptions/expiring?days=7&page=${page}`
      : `/subscriptions/vendors?${params}`

    const d = await api(endpoint)
    if (d.success) vendors.value = d.data
  } finally {
    loading.value = false
  }
}

// =============================================
// ACTIONS
// =============================================
const recalculateAllScores = async () => {
  recalculating.value = true
  try {
    const d = await api('/subscriptions/recalculate-all-scores', { method: 'POST' })
    if (d.success) {
      alert(`✅ ${d.data.processed} scores recalculés — Score moyen : ${d.data.avg_score}/100`)
      await Promise.all([loadStats(), loadVendors()])
    }
  } finally {
    recalculating.value = false
  }
}

const recalculateScore = async (vendor: any) => {
  const d = await api(`/subscriptions/vendors/${vendor.id}/recalculate-score`, { method: 'POST' })
  if (d.success) {
    vendor.engagement_score = d.score
    alert(`Score recalculé : ${d.score}/100 — ${d.level.label}`)
  }
}

const resetPaymentFailures = async (vendor: any) => {
  if (!confirm(`Réinitialiser les échecs de paiement pour ${vendor.name} ?`)) return
  const d = await api(`/subscriptions/vendors/${vendor.id}/reset-payment-failures`, { method: 'POST' })
  if (d.success) {
    vendor.payment_failure_count = 0
    alert('✅ Échecs de paiement réinitialisés')
    await loadStats()
  }
}

const openRestorePlan = (vendor: any) => {
  restoreTarget.value  = vendor
  restorePlan.value    = 'standard'
  showRestoreModal.value = true
}

const confirmRestorePlan = async () => {
  const d = await api(
    `/subscriptions/vendors/${restoreTarget.value.id}/restore-plan`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: restorePlan.value }),
    }
  )
  if (d.success) {
    showRestoreModal.value = false
    alert(`✅ Plan restauré : ${restorePlan.value}`)
    await loadVendors()
  }
}

const filterByEngagement = (level: string) => {
  filters.engagement_level = filters.engagement_level === level ? '' : level
  loadVendors()
}

const resetFilters = () => {
  Object.assign(filters, { plan: '', engagement_level: '', inactive_since: '', has_failures: false })
  activeTab.value = 'vendors'
  loadVendors()
}

// Emails
const openSingleMail = (vendor: any) => {
  Object.assign(mailForm, { userId: vendor.id, userName: vendor.name, isBulk: false, message: '' })
  showMailModal.value = true
}

const openBulkMail = () => {
  Object.assign(mailForm, { userId: null, isBulk: true, message: '' })
  showMailModal.value = true
}

const sendMail = async () => {
  sendingMail.value = true
  try {
    const endpoint = mailForm.isBulk ? '/send-bulk-mail' : '/send-mail-to-user'
    const body     = mailForm.isBulk
      ? { type: mailForm.type, target: 'all_vendors', message: mailForm.message, ...filters }
      : { user_id: mailForm.userId, type: mailForm.type, message: mailForm.message }

    const d = await api(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (d.success) {
      showMailModal.value = false
      alert(d.message || 'Email(s) envoyé(s) avec succès')
    }
  } finally {
    sendingMail.value = false
  }
}

// =============================================
// UTILITAIRES D'AFFICHAGE
// =============================================
const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const daysUntil = (d: string) => {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
  if (diff < 0)  return `Expiré il y a ${Math.abs(diff)} jours`
  if (diff === 0) return 'Expire aujourd\'hui'
  return `Dans ${diff} jour${diff > 1 ? 's' : ''}`
}

const expirationClass = (d: string) => {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
  if (diff <= 1)  return 'text-red-600'
  if (diff <= 7)  return 'text-amber-600'
  return 'text-gray-700'
}

const engagementColor = (score: number) => {
  if (score >= 75) return '#10b981'
  if (score >= 50) return '#5B6AC5'
  if (score >= 25) return '#f59e0b'
  return '#ef4444'
}

const engagementLabel = (score: number) => {
  if (score >= 75) return 'Très engagé'
  if (score >= 50) return 'Engagé'
  if (score >= 25) return 'Peu actif'
  return 'Inactif'
}

const planBadgeClass = (plan: string) => {
  const classes: Record<string, string> = {
    welcome:  'bg-gray-100 text-gray-600',
    gratuit:  'bg-blue-100 text-blue-700',
    standard: 'bg-indigo-100 text-indigo-700',
    premium:  'bg-purple-100 text-purple-700',
    elite:    'bg-amber-100 text-amber-700',
  }
  return classes[plan] || classes.welcome
}

// =============================================
// INITIALISATION
// =============================================
onMounted(async () => {
  await Promise.all([loadStats(), loadVendors()])
})
</script>