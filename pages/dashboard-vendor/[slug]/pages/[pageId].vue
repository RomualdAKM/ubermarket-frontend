<template>
  <div class="h-screen flex flex-col overflow-hidden bg-gray-100">
    <!-- Header du Builder -->
    <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-4">
        <NuxtLink
          :to="backLink"
          class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </NuxtLink>
        <div class="h-6 w-px bg-gray-200"></div>
        <div>
          <input
            v-model="pageTitle"
            type="text"
            class="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 -ml-2"
            @change="handleTitleChange"
          />
          <div class="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
            <span class="font-mono">/{{ currentPage?.slug }}</span>
            <span v-if="hasUnsavedChanges" class="text-amber-600">• Modifications non enregistrées</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Prévisualisation -->
        <div class="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            @click="previewMode = 'desktop'"
            :class="[
              'p-1.5 rounded transition-colors',
              previewMode === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            ]"
            title="Desktop"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            @click="previewMode = 'tablet'"
            :class="[
              'p-1.5 rounded transition-colors',
              previewMode === 'tablet' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            ]"
            title="Tablette"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            @click="previewMode = 'mobile'"
            :class="[
              'p-1.5 rounded transition-colors',
              previewMode === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            ]"
            title="Mobile"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        
        <!-- Actions -->
        <button
          @click="handleSave"
          :disabled="isSaving || !hasUnsavedChanges"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Enregistrer
        </button>
        
        <button
          @click="handlePublish"
          :disabled="isSaving"
          :class="[
            'px-4 py-2 rounded-lg transition-colors flex items-center gap-2',
            currentPage?.is_published
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              : 'bg-primary text-white hover:bg-primary/90'
          ]"
        >
          {{ currentPage?.is_published ? 'Dépublier' : 'Publier' }}
        </button>
      </div>
    </header>
    
    <!-- Corps principal : Layout 3 colonnes -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Colonne gauche : Sections -->
      <aside class="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div class="p-4 border-b border-gray-200">
          <h2 class="font-semibold text-gray-900">Sections</h2>
          <p class="text-xs text-gray-500 mt-1">Glissez pour réorganiser</p>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Liste des sections -->
          <div v-if="currentPage?.sections?.length" class="space-y-2">
            <div
              v-for="(section, index) in currentPage.sections"
              :key="section.id"
              @click="selectedSectionId = section.id"
              :class="[
                'group p-3 rounded-lg border cursor-pointer transition-all',
                selectedSectionId === section.id
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400 font-mono">{{ index + 1 }}</span>
                  <span class="text-sm font-medium text-gray-700 capitalize">{{ section.type }}</span>
                </div>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click.stop="moveSection(section.id, 'up')"
                    :disabled="index === 0"
                    class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    @click.stop="moveSection(section.id, 'down')"
                    :disabled="index === currentPage.sections.length - 1"
                    class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    @click.stop="duplicateSection(section.id)"
                    class="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    @click.stop="removeSection(section.id)"
                    class="p-1 text-gray-400 hover:text-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <p v-else class="text-sm text-gray-500 text-center py-8">
            Aucune section. Ajoutez-en une !
          </p>
        </div>
        
        <!-- Bouton ajouter section -->
        <div class="p-4 border-t border-gray-200">
          <button
            @click="showAddBlockModal = true"
            class="w-full py-2.5 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une section
          </button>
        </div>
      </aside>
      
      <!-- Colonne centrale : Prévisualisation -->
      <main class="flex-1 overflow-hidden flex flex-col bg-gray-200">
        <div class="flex-1 overflow-auto p-6 flex justify-center">
          <div
            :class="[
              'bg-white shadow-xl transition-all duration-300 overflow-auto',
              previewMode === 'desktop' ? 'w-full max-w-6xl' : '',
              previewMode === 'tablet' ? 'w-[768px]' : '',
              previewMode === 'mobile' ? 'w-[375px]' : ''
            ]"
            :style="{ minHeight: '600px' }"
          >
            <!-- Rendu des sections -->
            <div v-if="currentPage?.sections?.length">
              <div
                v-for="section in currentPage.sections"
                :key="section.id"
                @click="selectedSectionId = section.id"
                :class="[
                  'relative transition-all cursor-pointer',
                  selectedSectionId === section.id ? 'ring-2 ring-primary ring-inset' : 'hover:ring-2 hover:ring-gray-300 hover:ring-inset'
                ]"
              >
                <!-- Indicateur de sélection -->
                <div
                  v-if="selectedSectionId === section.id"
                  class="absolute top-2 left-2 z-10 px-2 py-1 bg-primary text-white text-xs font-medium rounded"
                >
                  {{ section.type }}
                </div>
                
                <!-- Rendu du bloc -->
                <BuilderBlock :section="section" />
              </div>
            </div>
            
            <!-- État vide -->
            <div v-else class="flex flex-col items-center justify-center h-full py-20 text-gray-400">
              <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p class="text-lg mb-2">Page vide</p>
              <p class="text-sm">Ajoutez votre première section</p>
            </div>
          </div>
        </div>
      </main>
      
      <!-- Colonne droite : Éditeur de section -->
      <aside 
        v-if="selectedSection"
        class="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0"
      >
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="font-semibold text-gray-900 capitalize">{{ selectedSection.type }}</h2>
          <button
            @click="selectedSectionId = null"
            class="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Onglets Contenu / Style -->
          <div class="flex mb-4 bg-gray-100 rounded-lg p-1">
            <button
              @click="editTab = 'content'"
              :class="[
                'flex-1 py-1.5 text-sm font-medium rounded transition-colors',
                editTab === 'content' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              ]"
            >
              Contenu
            </button>
            <button
              @click="editTab = 'style'"
              :class="[
                'flex-1 py-1.5 text-sm font-medium rounded transition-colors',
                editTab === 'style' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              ]"
            >
              Style
            </button>
          </div>
          
          <!-- Éditeur dynamique -->
          <BuilderEditor
            v-if="selectedSection"
            :section="selectedSection"
            :tab="editTab"
            @update:content="handleContentUpdate"
            @update:style="handleStyleUpdate"
          />
        </div>
      </aside>
      
      <!-- Message si aucune section sélectionnée -->
      <aside 
        v-else
        class="w-80 bg-gray-50 border-l border-gray-200 flex flex-col items-center justify-center text-gray-400 flex-shrink-0"
      >
        <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <p class="text-sm">Sélectionnez une section</p>
        <p class="text-xs mt-1">pour la modifier</p>
      </aside>
    </div>
    
    <!-- Modal d'ajout de bloc -->
    <Teleport to="body">
      <div v-if="showAddBlockModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showAddBlockModal = false"></div>
          
          <div class="relative bg-white rounded-xl shadow-xl transform transition-all max-w-4xl w-full mx-auto z-10 max-h-[80vh] overflow-hidden flex flex-col">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 class="text-lg font-semibold text-gray-900">Ajouter une section</h3>
              <button @click="showAddBlockModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="p-6 overflow-y-auto flex-1">
              <div class="grid grid-cols-3 gap-4">
                <button
                  v-for="block in blockDefinitions"
                  :key="block.type"
                  @click="handleAddBlock(block.type)"
                  class="p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                >
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                    <span class="text-xl">{{ getBlockIcon(block.type) }}</span>
                  </div>
                  <h4 class="font-medium text-gray-900 mb-1">{{ block.name }}</h4>
                  <p class="text-xs text-gray-500">{{ block.description }}</p>
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
import { ref, computed, onMounted, watch } from 'vue'
import { BLOCK_DEFINITIONS } from '~/types/websiteBuilder'
import type { BlockType, PageSection, BlockContent, BlockStyle } from '~/composables/useWebsiteBuilder'

definePageMeta({
  layout: false // Pas de layout dashboard, le builder a son propre layout
})

const route = useRoute()
const router = useRouter()
const { currentShop } = useShops()
const {
  currentPage,
  isLoading,
  isSaving,
  hasUnsavedChanges,
  selectedSectionId,
  fetchPage,
  updatePage,
  updateSections,
  togglePublish,
  addSection,
  removeSection,
  duplicateSection,
  moveSection,
  updateSectionContent,
  updateSectionStyle,
  getSelectedSection,
  resetBuilder
} = useWebsiteBuilder()

// États locaux
const previewMode = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const editTab = ref<'content' | 'style'>('content')
const showAddBlockModal = ref(false)
const pageTitle = ref('')
const blockDefinitions = BLOCK_DEFINITIONS

// Computed
const pageId = computed(() => Number(route.params.pageId))
const backLink = computed(() => {
  const shopSlug = currentShop.value?.slug || currentShop.value?.id
  return `/dashboard-vendor/${shopSlug}/pages`
})
const selectedSection = computed(() => getSelectedSection.value)

// Charger la page au montage
onMounted(async () => {
  resetBuilder()
  await loadPage()
})

// Recharger si la boutique change
watch(() => currentShop.value?.id, async (newId) => {
  if (newId && pageId.value) {
    await loadPage()
  }
})

// Fonction de chargement
const loadPage = async () => {
  if (currentShop.value?.id && pageId.value) {
    const page = await fetchPage(currentShop.value.id, pageId.value)
    if (page) {
      pageTitle.value = page.title
    } else {
      // Rediriger si page non trouvée
      router.push(backLink.value)
    }
  }
}

// Synchroniser le titre
watch(() => currentPage.value?.title, (newTitle) => {
  if (newTitle) pageTitle.value = newTitle
})

// Icônes des blocs
const getBlockIcon = (type: BlockType): string => {
  const icons: Record<BlockType, string> = {
    hero: '🎯',
    features: '✨',
    testimonials: '💬',
    pricing: '💰',
    cta: '👆',
    text: '📝',
    image: '🖼️',
    gallery: '🖼️',
    video: '🎬',
    faq: '❓',
    contact: '📧',
    countdown: '⏱️',
    social: '🔗',
    spacer: '↕️',
    divider: '➖'
  }
  return icons[type] || '📦'
}

// Handlers
const handleTitleChange = async () => {
  if (!currentShop.value?.id || !currentPage.value) return
  await updatePage(currentShop.value.id, currentPage.value.id, { title: pageTitle.value })
}

const handleSave = async () => {
  if (!currentShop.value?.id || !currentPage.value) return
  await updateSections(currentShop.value.id, currentPage.value.id, currentPage.value.sections)
}

const handlePublish = async () => {
  if (!currentShop.value?.id || !currentPage.value) return
  await togglePublish(currentShop.value.id, currentPage.value.id)
}

const handleAddBlock = (type: BlockType) => {
  const blockDef = blockDefinitions.find(b => b.type === type)
  if (blockDef && blockDef.templates.length > 0) {
    addSection(type, blockDef.templates[0])
    showAddBlockModal.value = false
  }
}

const handleContentUpdate = (content: BlockContent) => {
  if (selectedSectionId.value) {
    updateSectionContent(selectedSectionId.value, content)
  }
}

const handleStyleUpdate = (style: Partial<BlockStyle>) => {
  if (selectedSectionId.value) {
    updateSectionStyle(selectedSectionId.value, style)
  }
}
</script>
