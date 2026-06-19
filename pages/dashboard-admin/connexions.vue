<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Connexions & Comptes dormants</h1>
        <p class="text-sm text-gray-500 mt-1">Historique de connexion et gestion des inactifs</p>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Connexions 30j</p>
        <p class="text-3xl font-bold text-indigo-600 mt-2">{{ stats.total_logins_30d ?? 0 }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Échecs 30j</p>
        <p class="text-3xl font-bold text-red-500 mt-2">{{ stats.failed_logins_30d ?? 0 }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Comptes dormants</p>
        <p class="text-3xl font-bold text-amber-500 mt-2">{{ stats.dormant_count ?? 0 }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Désactivés auto</p>
        <p class="text-3xl font-bold text-gray-500 mt-2">{{ stats.deactivated_dormant ?? 0 }}</p>
      </div>
    </div>

    <!-- Onglets -->
    <div class="border-b border-gray-200">
      <nav class="flex gap-6">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
          class="py-3 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === tab.key
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'">
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Onglet : Historique connexions -->
    <div v-if="activeTab === 'history'">
      <!-- Filtres -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 mb-4">
        <select v-model="filters.status" @change="loadHistory" class="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Tous statuts</option>
          <option value="success">Succès</option>
          <option value="failed">Échec</option>
        </select>
        <select v-model="filters.device_type" @change="loadHistory" class="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Tous appareils</option>
          <option value="desktop">💻 Ordinateur</option>
          <option value="tablet">📟 Tablette</option>
          <option value="mobile">📱 Mobile</option>
        </select>
        <input v-model="filters.date_from" @change="loadHistory" type="date"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Du" />
        <input v-model="filters.date_to" @change="loadHistory" type="date"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Au" />
      </div>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div v-if="loadingHistory" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th class="px-4 py-3 text-left">Utilisateur</th>
                <th class="px-4 py-3 text-left">Date & Heure</th>
                <th class="px-4 py-3 text-left">Localisation</th>
                <th class="px-4 py-3 text-left">Appareil</th>
                <th class="px-4 py-3 text-left">Navigateur / OS</th>
                <th class="px-4 py-3 text-left">IP</th>
                <th class="px-4 py-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="log in history.data" :key="log.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900">{{ log.user?.name }}</p>
                  <p class="text-xs text-gray-400">{{ log.user?.email }}</p>
                </td>
                <td class="px-4 py-3 text-gray-600">{{ formatDate(log.logged_at) }}</td>
                <td class="px-4 py-3">
                  <span v-if="log.country">🌍 {{ log.city }}, {{ log.country }}</span>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-lg">{{ deviceIcon(log.device_type) }}</span>
                  <span class="text-xs text-gray-500 ml-1">{{ log.device_type }}</span>
                </td>
                <td class="px-4 py-3">
                  <p class="text-gray-700">{{ log.browser }}</p>
                  <p class="text-xs text-gray-400">{{ log.os }}</p>
                </td>
                <td class="px-4 py-3 font-mono text-xs text-gray-500">{{ log.ip_address }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="log.status === 'success'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'">
                    {{ log.status === 'success' ? '✓ Succès' : '✗ Échec' }}
                  </span>
                  <p v-if="log.failure_reason" class="text-xs text-red-400 mt-0.5">{{ log.failure_reason }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div v-if="history.last_page > 1" class="flex justify-center gap-2 p-4 border-t border-gray-100">
          <button v-for="p in history.last_page" :key="p" @click="loadHistory(p)"
            class="w-8 h-8 rounded-lg text-sm"
            :class="history.current_page === p ? 'bg-indigo-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'">
            {{ p }}
          </button>
        </div>
      </div>
    </div>

    <!-- Onglet : Comptes dormants -->
    <div v-if="activeTab === 'dormant'">
      <div class="flex items-center justify-between mb-4">
        <div class="flex gap-3">
          <select v-model="dormantMonths" @change="loadDormant" class="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option :value="1">Inactifs 1 mois</option>
            <option :value="2">Inactifs 2 mois</option>
            <option :value="3">Inactifs 3 mois</option>
            <option :value="6">Inactifs 6 mois</option>
          </select>
        </div>
        <!-- Actions en masse -->
        <div class="flex gap-3">
          <button @click="openBulkMail('boost')"
            class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            📧 Email de boost
          </button>
          <button @click="openBulkMail('advice')"
            class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            💡 Conseil de vente
          </button>
          <button @click="openBulkMail('warning')"
            class="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700">
            ⚠️ Email de relance
          </button>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th class="px-4 py-3 text-left">Vendeur</th>
                <th class="px-4 py-3 text-left">Dernière connexion</th>
                <th class="px-4 py-3 text-left">Plan</th>
                <th class="px-4 py-3 text-left">Avertissement</th>
                <th class="px-4 py-3 text-left">Statut</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="user in dormant.data" :key="user.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900">{{ user.name }}</p>
                  <p class="text-xs text-gray-400">{{ user.email }}</p>
                </td>
                <td class="px-4 py-3">
                  <span v-if="user.last_login_at" class="text-gray-600">
                    {{ formatDate(user.last_login_at) }}
                    <span class="text-xs text-amber-500 ml-1">({{ daysAgo(user.last_login_at) }})</span>
                  </span>
                  <span v-else class="text-red-400 text-xs">Jamais connecté</span>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {{ user.subscription_plan || 'welcome' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span v-if="user.dormant_notified_at" class="text-xs text-amber-600">
                    Averti le {{ formatDate(user.dormant_notified_at) }}
                  </span>
                  <span v-else class="text-xs text-gray-400">Non averti</span>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                    {{ user.status === 'active' ? 'Actif' : 'Désactivé' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button @click="sendMailToUser(user, 'boost')"
                      class="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
                      📧 Mail
                    </button>
                    <button v-if="user.status === 'active'" @click="deactivateUser(user)"
                      class="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100">
                      🔴 Désactiver
                    </button>
                    <button v-else @click="reactivateUser(user)"
                      class="px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100">
                      ✅ Réactiver
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal envoi mail -->
    <Teleport to="body">
      <div v-if="showMailModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-2xl w-full max-w-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Envoyer un email</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type d'email</label>
              <select v-model="mailForm.type" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="boost">📈 Email de boost (motivation à vendre)</option>
                <option value="advice">💡 Conseil de vente</option>
                <option value="warning">⚠️ Relance CGU</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
              <p class="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                {{ mailForm.isBulk ? `Tous les comptes ${mailForm.target}` : mailForm.userName }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message personnalisé (optionnel)</label>
              <textarea v-model="mailForm.message" rows="4" placeholder="Laissez vide pour utiliser le template par défaut..."
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"></textarea>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button @click="showMailModal = false"
              class="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50">
              Annuler
            </button>
            <button @click="sendMail" :disabled="sendingMail"
              class="flex-1 py-2.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-50">
              {{ sendingMail ? 'Envoi...' : 'Envoyer' }}
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

    const activeTab     = ref('history')
    const dormantMonths = ref(3)
    const loadingHistory = ref(false)

    const tabs = [
    { key: 'history', label: 'Historique connexions' },
    { key: 'dormant', label: 'Comptes dormants' },
    ]

    const stats   = ref<any>({})
    const history = ref<any>({ data: [], last_page: 1, current_page: 1 })
    const dormant = ref<any>({ data: [] })

    const filters = reactive({
    status: '', device_type: '', date_from: '', date_to: ''
    })

    const showMailModal = ref(false)
    const sendingMail   = ref(false)
    const mailForm      = reactive({
    type: 'boost', message: '', userId: null as number|null,
    userName: '', isBulk: false, target: 'dormant'
    })

    const api = (path: string, opts: RequestInit = {}) =>
    fetch(`${config.public.apiBase}/admin${path}`, {
        ...opts,
        headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json', ...(opts.headers || {}) }
    }).then(r => r.json())

    const loadStats   = async () => { const d = await api('/login-history/stats');   stats.value   = d.data }
    const loadHistory = async (page = 1) => {
    loadingHistory.value = true
    const p = new URLSearchParams({ page: String(page), ...Object.fromEntries(Object.entries(filters).filter(([,v]) => v)) })
    const d = await api(`/login-history?${p}`)
    history.value = d.data
    loadingHistory.value = false
    }
    const loadDormant = async () => {
    const d = await api(`/dormant-accounts?months=${dormantMonths.value}`)
    dormant.value = d.data
    }

    const deviceIcon = (type: string) => ({ desktop: '💻', tablet: '📟', mobile: '📱' }[type] || '🖥️')

    const formatDate = (d: string) => d ? new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

    const daysAgo = (d: string) => {
    const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
    return `il y a ${days} jours`
    }

    const sendMailToUser = (user: any, type: string) => {
    Object.assign(mailForm, { type, userId: user.id, userName: user.name, isBulk: false })
    showMailModal.value = true
    }
    const openBulkMail = (type: string) => {
    Object.assign(mailForm, { type, isBulk: true, target: 'dormant', userId: null })
    showMailModal.value = true
    }

    const sendMail = async () => {
    sendingMail.value = true
    try {
        const endpoint = mailForm.isBulk ? '/send-bulk-mail' : '/send-mail-to-user'
        const body = mailForm.isBulk
        ? { type: mailForm.type, target: mailForm.target, message: mailForm.message }
        : { user_id: mailForm.userId, type: mailForm.type, message: mailForm.message }

        const d = await api(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
        })
        if (d.success) { showMailModal.value = false; alert(d.message) }
    } finally { sendingMail.value = false }
    }

    const deactivateUser = async (user: any) => {
    if (!confirm(`Désactiver ${user.name} ?`)) return
    await api(`/users/${user.id}/deactivate`, { method: 'POST' })
    user.status = 'inactive'
    }
    const reactivateUser = async (user: any) => {
    await api(`/users/${user.id}/reactivate`, { method: 'POST' })
    user.status = 'active'
    user.dormant_deactivated_at = null
    }

    onMounted(async () => {
    await Promise.all([loadStats(), loadHistory(), loadDormant()])
    })
</script>