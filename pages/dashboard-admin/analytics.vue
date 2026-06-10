<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Analytics & Campagnes</h1>
        <p class="text-sm text-gray-500 mt-1">Sources d'acquisition et performance des campagnes</p>
      </div>
      <select v-model="period" @change="load"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois</option>
        <option value="year">Cette année</option>
      </select>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total inscriptions</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ data.total_period ?? 0 }}</p>
        <p class="text-xs text-gray-400 mt-1">sur la période sélectionnée</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Organique</p>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ data.organic ?? 0 }}</p>
        <p class="text-xs text-gray-400 mt-1">sans campagne trackée</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Via campagnes</p>
        <p class="text-3xl font-bold text-indigo-600 mt-2">
          {{ (data.total_period ?? 0) - (data.organic ?? 0) }}
        </p>
        <p class="text-xs text-gray-400 mt-1">trackées via UTM ou ref</p>
      </div>
    </div>

    <!-- Tableau par source -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h2 class="text-base font-semibold text-gray-900">Inscriptions par source</h2>
        <p class="text-xs text-gray-400 mt-0.5">Quel canal génère le plus d'inscriptions</p>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="!data.by_source?.length" class="p-8 text-center text-gray-400 text-sm">
        Aucune donnée de campagne pour cette période.
        <p class="mt-2 text-xs">Les inscriptions via les pages /lp/ apparaîtront ici.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th class="px-5 py-3 text-left">Source</th>
              <th class="px-5 py-3 text-left">Inscriptions</th>
              <th class="px-5 py-3 text-left">Payants</th>
              <th class="px-5 py-3 text-left">Taux conversion</th>
              <th class="px-5 py-3 text-left">Part</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="row in data.by_source" :key="row.acquisition_source" class="hover:bg-gray-50">
              <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: getSourceColor(row.acquisition_source) }"></span>
                  <span class="font-medium text-gray-900">{{ formatSource(row.acquisition_source) }}</span>
                </div>
              </td>
              <td class="px-5 py-3 font-semibold text-gray-900">{{ row.total }}</td>
              <td class="px-5 py-3 text-green-600 font-medium">{{ row.paid }}</td>
              <td class="px-5 py-3 text-gray-600">
                {{ row.total > 0 ? Math.round((row.paid / row.total) * 100) : 0 }}%
              </td>
              <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-100 rounded-full h-2 max-w-24">
                    <div class="h-2 rounded-full transition-all"
                      :style="{
                        width: data.total_period > 0 ? `${(row.total / data.total_period) * 100}%` : '0%',
                        backgroundColor: getSourceColor(row.acquisition_source)
                      }">
                    </div>
                  </div>
                  <span class="text-xs text-gray-500">
                    {{ data.total_period > 0 ? Math.round((row.total / data.total_period) * 100) : 0 }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tableau par campagne UTM -->
    <div v-if="data.by_campaign?.length" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h2 class="text-base font-semibold text-gray-900">Détail par campagne UTM</h2>
        <p class="text-xs text-gray-400 mt-0.5">Google Ads, Facebook Ads, etc.</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th class="px-5 py-3 text-left">Campagne</th>
              <th class="px-5 py-3 text-left">Source</th>
              <th class="px-5 py-3 text-left">Medium</th>
              <th class="px-5 py-3 text-left">Inscriptions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="row in data.by_campaign" :key="row.utm_campaign" class="hover:bg-gray-50">
              <td class="px-5 py-3 font-medium text-gray-900">{{ row.utm_campaign }}</td>
              <td class="px-5 py-3 text-gray-600">{{ row.utm_source || '—' }}</td>
              <td class="px-5 py-3 text-gray-600">{{ row.utm_medium || '—' }}</td>
              <td class="px-5 py-3 font-bold text-indigo-600">{{ row.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pages de destination -->
    <div v-if="data.by_landing_page?.length" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h2 class="text-base font-semibold text-gray-900">Pages de destination les plus efficaces</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th class="px-5 py-3 text-left">Page</th>
              <th class="px-5 py-3 text-left">Inscriptions générées</th>
              <th class="px-5 py-3 text-left">Part</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="row in data.by_landing_page" :key="row.landing_page" class="hover:bg-gray-50">
              <td class="px-5 py-3 font-mono text-xs font-medium text-indigo-600">{{ row.landing_page }}</td>
              <td class="px-5 py-3 font-bold text-gray-900">{{ row.total }}</td>
              <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-100 rounded-full h-2 max-w-24">
                    <div class="h-2 rounded-full bg-indigo-500"
                      :style="{ width: data.total_period > 0 ? `${(row.total / data.total_period) * 100}%` : '0%' }">
                    </div>
                  </div>
                  <span class="text-xs text-gray-500">
                    {{ data.total_period > 0 ? Math.round((row.total / data.total_period) * 100) : 0 }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Message si aucune donnée -->
    <div v-if="!loading && !data.by_source?.length && !data.by_campaign?.length"
      class="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <h3 class="text-sm font-semibold text-blue-800 mb-2">Comment utiliser ce module</h3>
      <div class="text-sm text-blue-700 space-y-1">
        <p>1. Créez une page de campagne dans <code class="bg-blue-100 px-1 rounded">/lp/</code> (ex: /lp/benin)</p>
        <p>2. Ajoutez <code class="bg-blue-100 px-1 rounded">?ref=lp-benin</code> dans vos liens de pub</p>
        <p>3. Ajoutez <code class="bg-blue-100 px-1 rounded">?utm_source=facebook&utm_campaign=benin-2025</code> pour le SEA</p>
        <p>4. Les inscriptions apparaîtront ici automatiquement</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard-admin' })

const config  = useRuntimeConfig()
const { token } = useAuth()

const period  = ref('month')
const loading = ref(false)
const data    = ref<any>({})

const load = async () => {
  loading.value = true
  try {
    const response = await fetch(
      `${config.public.apiBase}/admin/analytics/campaigns?period=${period.value}`,
      { headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' } }
    )
    const json = await response.json()
    if (json.success) data.value = json.data
  } catch (err) {
    console.error('Erreur analytics:', err)
  } finally {
    loading.value = false
  }
}

// Couleur par source
const sourceColors: Record<string, string> = {
  'lp-benin':    '#10b981',
  'lp-senegal':  '#3b82f6',
  'lp-gratuit':  '#8b5cf6',
  'lp-standard': '#f59e0b',
  'lp-premium':  '#ef4444',
  'facebook':    '#1877f2',
  'google':      '#ea4335',
  'twitter':     '#1da1f2',
}

const getSourceColor = (source: string) => {
  return sourceColors[source] || '#6b7280'
}

const formatSource = (source: string) => {
  const labels: Record<string, string> = {
    'lp-benin':    '🇧🇯 Landing Bénin',
    'lp-senegal':  '🇸🇳 Landing Sénégal',
    'lp-gratuit':  '🆓 Landing Gratuit',
    'lp-standard': '⚡ Landing Standard',
    'lp-premium':  '⭐ Landing Premium',
    'facebook':    '📘 Facebook',
    'google':      '🔍 Google',
    'twitter':     '🐦 Twitter',
  }
  return labels[source] || source
}

onMounted(load)
</script>