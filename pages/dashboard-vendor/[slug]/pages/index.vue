<template>
  <div>
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pages du site</h1>
        <p class="text-gray-500 mt-1">Gérez les pages de votre site web</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouvelle page
      </button>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Message si aucune page -->
    <div v-else-if="!pages || pages.length === 0" class="text-center py-16 bg-gray-50 rounded-xl">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune page créée</h3>
      <p class="text-gray-500 mb-6">Commencez par créer votre première page</p>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Créer ma première page
      </button>
    </div>

    <!-- Liste des pages -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
            <th class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Accueil</th>
            <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="page in pages" :key="page.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ page.title }}</div>
                  <div class="text-xs text-gray-500">
                    Modifiée {{ formatDate(page.updated_at) }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm text-gray-600 font-mono">/{{ page.slug }}</span>
            </td>
            <td class="px-6 py-4 text-center">
              <span 
                :class="[
                  'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                  page.is_published 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                ]"
              >
                {{ page.is_published ? 'Publiée' : 'Brouillon' }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <span v-if="page.is_homepage" class="inline-flex items-center text-primary">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </span>
              <button
                v-else
                @click="handleSetHomepage(page.id)"
                class="text-gray-400 hover:text-primary transition-colors"
                title="Définir comme page d'accueil"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <!-- Éditer -->
                <NuxtLink
                  :to="getEditLink(page.id)"
                  class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  title="Éditer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </NuxtLink>
                
                <!-- Toggle Publication -->
                <button
                  @click="handleTogglePublish(page.id)"
                  :class="[
                    'p-2 rounded-lg transition-colors',
                    page.is_published 
                      ? 'text-green-500 hover:text-green-700 hover:bg-green-50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  ]"
                  :title="page.is_published ? 'Dépublier' : 'Publier'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="page.is_published" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path v-if="page.is_published" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
                
                <!-- Dupliquer -->
                <button
                  @click="handleDuplicate(page.id)"
                  class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Dupliquer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                
                <!-- Supprimer -->
                <button
                  @click="confirmDelete(page)"
                  class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

    <!-- Modal de création -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showCreateModal = false"></div>
          
          <div class="relative bg-white rounded-xl shadow-xl transform transition-all sm:max-w-lg sm:w-full mx-auto z-10">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Créer une nouvelle page</h3>
            </div>
            
            <form @submit.prevent="handleCreate" class="p-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Titre de la page</label>
                  <input
                    v-model="newPageTitle"
                    type="text"
                    required
                    placeholder="Ex: À propos"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL)
                    <span class="text-gray-400 font-normal ml-1">(optionnel)</span>
                  </label>
                  <div class="flex items-center">
                    <span class="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">/</span>
                    <input
                      v-model="newPageSlug"
                      type="text"
                      placeholder="a-propos"
                      class="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Laissez vide pour générer automatiquement</p>
                </div>
                
                <div class="flex items-center">
                  <input
                    v-model="newPageIsHomepage"
                    type="checkbox"
                    id="isHomepage"
                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label for="isHomepage" class="ml-2 text-sm text-gray-700">
                    Définir comme page d'accueil
                  </label>
                </div>
              </div>
              
              <div class="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  @click="showCreateModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  :disabled="isSaving || !newPageTitle"
                  class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {{ isSaving ? 'Création...' : 'Créer la page' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de confirmation de suppression -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showDeleteModal = false"></div>
          
          <div class="relative bg-white rounded-xl shadow-xl transform transition-all sm:max-w-md sm:w-full mx-auto z-10">
            <div class="p-6 text-center">
              <div class="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Supprimer cette page ?</h3>
              <p class="text-gray-500 mb-6">
                Vous êtes sur le point de supprimer la page "<strong>{{ pageToDelete?.title }}</strong>". Cette action est irréversible.
              </p>
              <div class="flex justify-center gap-3">
                <button
                  @click="showDeleteModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  @click="handleDelete"
                  :disabled="isSaving"
                  class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {{ isSaving ? 'Suppression...' : 'Supprimer' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { WebsitePage } from '~/composables/useWebsiteBuilder'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { currentShop } = useShops()
const { 
  pages, 
  isLoading, 
  isSaving, 
  fetchPages, 
  createPage, 
  deletePage, 
  togglePublish, 
  setAsHomepage, 
  duplicatePage 
} = useWebsiteBuilder()

// États locaux
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const newPageTitle = ref('')
const newPageSlug = ref('')
const newPageIsHomepage = ref(false)
const pageToDelete = ref<WebsitePage | null>(null)

// Charger les pages
const loadPages = async () => {
  if (currentShop.value?.id) {
    await fetchPages(currentShop.value.id)
  }
}

// Charger au montage
onMounted(() => {
  loadPages()
})

// Recharger si la boutique change
watch(() => currentShop.value?.id, (newId) => {
  if (newId) {
    loadPages()
  }
})

// Obtenir le lien d'édition
const getEditLink = (pageId: number) => {
  const shopSlug = currentShop.value?.slug || currentShop.value?.id
  return `/dashboard-vendor/${shopSlug}/pages/${pageId}`
}

// Formater la date
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // Moins d'une minute
  if (diff < 60000) return 'à l\'instant'
  // Moins d'une heure
  if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)} min`
  // Moins d'un jour
  if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)}h`
  // Moins d'une semaine
  if (diff < 604800000) return `il y a ${Math.floor(diff / 86400000)}j`
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// Créer une nouvelle page
const handleCreate = async () => {
  if (!currentShop.value?.id || !newPageTitle.value) return
  
  try {
    const newPage = await createPage(currentShop.value.id, {
      title: newPageTitle.value,
      slug: newPageSlug.value || undefined,
      is_homepage: newPageIsHomepage.value
    })
    
    if (newPage) {
      showCreateModal.value = false
      newPageTitle.value = ''
      newPageSlug.value = ''
      newPageIsHomepage.value = false
      
      // Rediriger vers l'éditeur de la nouvelle page
      router.push(getEditLink(newPage.id))
    }
  } catch (error) {
    console.error('Erreur lors de la création:', error)
  }
}

// Confirmer la suppression
const confirmDelete = (page: WebsitePage) => {
  pageToDelete.value = page
  showDeleteModal.value = true
}

// Supprimer une page
const handleDelete = async () => {
  if (!currentShop.value?.id || !pageToDelete.value) return
  
  try {
    const success = await deletePage(currentShop.value.id, pageToDelete.value.id)
    if (success) {
      showDeleteModal.value = false
      pageToDelete.value = null
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

// Basculer la publication
const handleTogglePublish = async (pageId: number) => {
  if (!currentShop.value?.id) return
  
  try {
    await togglePublish(currentShop.value.id, pageId)
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error)
  }
}

// Définir comme page d'accueil
const handleSetHomepage = async (pageId: number) => {
  if (!currentShop.value?.id) return
  
  try {
    await setAsHomepage(currentShop.value.id, pageId)
  } catch (error) {
    console.error('Erreur lors de la définition de la page d\'accueil:', error)
  }
}

// Dupliquer une page
const handleDuplicate = async (pageId: number) => {
  if (!currentShop.value?.id) return
  
  try {
    await duplicatePage(currentShop.value.id, pageId)
  } catch (error) {
    console.error('Erreur lors de la duplication:', error)
  }
}
</script>
