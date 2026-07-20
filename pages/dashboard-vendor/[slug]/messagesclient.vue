<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Messages clients</h1>
      <p class="text-gray-600">Consultez et répondez aux messages reçus via le formulaire de contact</p>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- ═══ Colonne liste ═══ -->
      <div class="md:w-2/5 lg:w-1/3">
        <!-- Filtres -->
        <div class="flex gap-2 mb-4 flex-wrap">
          <button
            v-for="filter in statusFilters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="[
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              activeFilter === filter.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>

        <!-- Chargement -->
        <div v-if="isLoadingList" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>

        <!-- Liste vide -->
        <div v-else-if="messages.length === 0" class="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <svg class="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10.5h8m-8 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
          <p class="mt-3 text-sm text-gray-500">Aucun message pour le moment</p>
        </div>

        <!-- Liste -->
        <div v-else class="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          <button
            v-for="msg in messages"
            :key="msg.id"
            @click="selectMessage(msg)"
            class="w-full text-left p-4 rounded-lg border transition-colors"
            :class="[
              selectedMessage?.id === msg.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 bg-white hover:border-gray-300',
              msg.status === 'unread' ? 'font-semibold' : ''
            ]"
          >
            <div class="flex items-start justify-between gap-2">
              <span class="text-sm text-gray-900 truncate">{{ msg.name }}</span>
              <span
                v-if="msg.status === 'unread'"
                class="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"
              ></span>
            </div>
            <p class="text-xs text-gray-500 truncate mt-0.5">{{ msg.subject || msg.message }}</p>
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs text-gray-400">{{ formatDate(msg.created_at) }}</span>
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-medium"
                :class="statusBadgeClass(msg.status)"
              >
                {{ statusLabel(msg.status) }}
              </span>
            </div>
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="flex justify-center gap-2 mt-4">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page <= 1"
            class="px-3 py-1 text-xs border border-gray-300 rounded disabled:opacity-40"
          >Précédent</button>
          <span class="text-xs text-gray-500 self-center">{{ pagination.current_page }} / {{ pagination.last_page }}</span>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="px-3 py-1 text-xs border border-gray-300 rounded disabled:opacity-40"
          >Suivant</button>
        </div>
      </div>

      <!-- ═══ Colonne détail ═══ -->
      <div class="md:w-3/5 lg:w-2/3">
        <div v-if="!selectedMessage" class="h-full min-h-[400px] flex items-center justify-center bg-white border border-gray-200 rounded-lg">
          <p class="text-gray-400 text-sm">Sélectionnez un message pour l'afficher</p>
        </div>

        <div v-else class="bg-white border border-gray-200 rounded-lg">
          <!-- En-tête du message -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">{{ selectedMessage.subject || 'Sans sujet' }}</h2>
                <p class="text-sm text-gray-500 mt-1">
                  De <strong>{{ selectedMessage.name }}</strong> — {{ selectedMessage.email }}
                  <span v-if="selectedMessage.phone"> — {{ selectedMessage.phone }}</span>
                </p>
                <p class="text-xs text-gray-400 mt-1">{{ formatDate(selectedMessage.created_at, true) }}</p>
              </div>

              <div class="flex items-center gap-2">
                <select
                  v-model="selectedMessage.status"
                  @change="handleStatusChange"
                  class="text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="unread">Non lu</option>
                  <option value="read">Lu</option>
                  <option value="replied">Répondu</option>
                  <option value="closed">Clôturé</option>
                </select>
                <button
                  @click="confirmDelete"
                  class="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  title="Supprimer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Fil de conversation -->
          <div class="p-6 space-y-4 max-h-[45vh] overflow-y-auto">
            <!-- Message initial du visiteur -->
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-medium text-gray-600">
                {{ selectedMessage.name?.[0]?.toUpperCase() }}
              </div>
              <div class="flex-1 bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-800 whitespace-pre-line">{{ selectedMessage.message }}</p>
              </div>
            </div>

            <!-- Réponses -->
            <div
              v-for="reply in selectedMessage.replies"
              :key="reply.id"
              class="flex gap-3 flex-row-reverse"
            >
              <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-medium text-primary">
                V
              </div>
              <div class="flex-1 bg-primary/5 rounded-lg p-4">
                <p class="text-sm text-gray-800 whitespace-pre-line">{{ reply.body }}</p>
                <p class="text-[10px] text-gray-400 mt-2">{{ formatDate(reply.created_at, true) }}</p>
              </div>
            </div>
          </div>

          <!-- Formulaire de réponse -->
          <div class="p-6 border-t border-gray-200">
            <textarea
              v-model="replyBody"
              rows="3"
              placeholder="Écrivez votre réponse..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            ></textarea>
            <div v-if="replyError" class="mt-2 text-xs text-red-600">{{ replyError }}</div>
            <div class="flex justify-end mt-3">
              <button
                @click="sendReply"
                :disabled="!replyBody.trim() || isSendingReply"
                class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSendingReply ? 'Envoi...' : 'Envoyer la réponse' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { currentShop } = useShops()
const { token } = useAuth()
const config = useRuntimeConfig()

const shopId = computed(() => currentShop.value?.id)

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: 'unread' | 'read' | 'replied' | 'closed'
  created_at: string
  replies?: Array<{ id: number; body: string; created_at: string; sender_type: string }>
  replies_count?: number
}

const messages = ref<ContactMessage[]>([])
const pagination = ref<{ current_page: number; last_page: number } | null>(null)
const isLoadingList = ref(false)
const selectedMessage = ref<ContactMessage | null>(null)

const activeFilter = ref<'all' | 'unread' | 'read' | 'replied' | 'closed'>('all')
const currentPage = ref(1)

const statusFilters = [
  { value: 'all', label: 'Tous' },
  { value: 'unread', label: 'Non lus' },
  { value: 'read', label: 'Lus' },
  { value: 'replied', label: 'Répondus' },
  { value: 'closed', label: 'Clôturés' },
]

const apiHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token.value}`,
})

// ─────────────────────────────────────────────────────────
// Chargement de la liste
// ─────────────────────────────────────────────────────────
const fetchMessages = async () => {
  if (!shopId.value) return
  isLoadingList.value = true
  try {
    const params = new URLSearchParams({
      status: activeFilter.value,
      page: String(currentPage.value)
    })
    const res = await fetch(`${config.public.apiBase}/shops/${shopId.value}/contact-messages?${params}`, {
      headers: apiHeaders()
    })
    const data = await res.json()
    if (data.success) {
      messages.value = data.data.data
      pagination.value = {
        current_page: data.data.current_page,
        last_page: data.data.last_page
      }
    }
  } catch (err) {
    console.error('Erreur chargement messages:', err)
  } finally {
    isLoadingList.value = false
  }
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchMessages()
}

watch(activeFilter, () => {
  currentPage.value = 1
  fetchMessages()
})

// ─────────────────────────────────────────────────────────
// Sélection & détail d'un message
// ─────────────────────────────────────────────────────────
const selectMessage = async (msg: ContactMessage) => {
  if (!shopId.value) return
  try {
    const res = await fetch(`${config.public.apiBase}/shops/${shopId.value}/contact-messages/${msg.id}`, {
      headers: apiHeaders()
    })
    const data = await res.json()
    if (data.success) {
      selectedMessage.value = data.data

      // Met à jour le statut affiché dans la liste sans tout recharger
      const idx = messages.value.findIndex(m => m.id === msg.id)
      if (idx !== -1 && messages.value[idx].status === 'unread') {
        messages.value[idx].status = 'read'
      }
    }
  } catch (err) {
    console.error('Erreur chargement détail message:', err)
  }
}

// ─────────────────────────────────────────────────────────
// Changement de statut (select dans le détail)
// ─────────────────────────────────────────────────────────
const handleStatusChange = async () => {
  if (!selectedMessage.value || !shopId.value) return
  try {
    const res = await fetch(
      `${config.public.apiBase}/shops/${shopId.value}/contact-messages/${selectedMessage.value.id}/status`,
      {
        method: 'PATCH',
        headers: apiHeaders(),
        body: JSON.stringify({ status: selectedMessage.value.status })
      }
    )
    const data = await res.json()
    if (data.success) {
      const idx = messages.value.findIndex(m => m.id === selectedMessage.value?.id)
      if (idx !== -1) messages.value[idx].status = selectedMessage.value.status
    }
  } catch (err) {
    console.error('Erreur changement statut:', err)
  }
}

// ─────────────────────────────────────────────────────────
// Réponse
// ─────────────────────────────────────────────────────────
const replyBody = ref('')
const replyError = ref('')
const isSendingReply = ref(false)

const sendReply = async () => {
  if (!selectedMessage.value || !shopId.value || !replyBody.value.trim()) return
  replyError.value = ''
  isSendingReply.value = true

  try {
    const res = await fetch(
      `${config.public.apiBase}/shops/${shopId.value}/contact-messages/${selectedMessage.value.id}/reply`,
      {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({ body: replyBody.value })
      }
    )
    const data = await res.json()

    if (!data.success) {
      replyError.value = data.message || "Erreur lors de l'envoi de la réponse"
      return
    }

    selectedMessage.value = data.data
    replyBody.value = ''

    const idx = messages.value.findIndex(m => m.id === selectedMessage.value?.id)
    if (idx !== -1) messages.value[idx].status = 'replied'
  } catch (err: any) {
    replyError.value = err.message || "Erreur lors de l'envoi de la réponse"
  } finally {
    isSendingReply.value = false
  }
}

// ─────────────────────────────────────────────────────────
// Suppression
// ─────────────────────────────────────────────────────────
const confirmDelete = async () => {
  if (!selectedMessage.value || !shopId.value) return
  if (!confirm('Voulez-vous vraiment supprimer ce message ? Cette action est irréversible.')) return

  try {
    const res = await fetch(
      `${config.public.apiBase}/shops/${shopId.value}/contact-messages/${selectedMessage.value.id}`,
      { method: 'DELETE', headers: apiHeaders() }
    )
    const data = await res.json()
    if (data.success) {
      messages.value = messages.value.filter(m => m.id !== selectedMessage.value?.id)
      selectedMessage.value = null
    }
  } catch (err) {
    console.error('Erreur suppression:', err)
  }
}

// ─────────────────────────────────────────────────────────
// Utilitaires d'affichage
// ─────────────────────────────────────────────────────────
const statusLabel = (status: string) => {
  const map: Record<string, string> = { unread: 'Non lu', read: 'Lu', replied: 'Répondu', closed: 'Clôturé' }
  return map[status] || status
}

const statusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    unread: 'bg-primary/10 text-primary',
    read: 'bg-gray-100 text-gray-600',
    replied: 'bg-green-100 text-green-700',
    closed: 'bg-gray-200 text-gray-500'
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const formatDate = (dateString: string, withTime = false) => {
  const date = new Date(dateString)
  if (withTime) {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ─────────────────────────────────────────────────────────
// Initialisation
// ─────────────────────────────────────────────────────────
onMounted(async () => {
  if (!currentShop.value) {
    const { fetchShops } = useShops()
    await fetchShops()
  }
  await fetchMessages()
})
</script>
