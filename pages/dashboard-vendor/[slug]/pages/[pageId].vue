<template>
  <div class="h-screen flex flex-col overflow-hidden bg-neutral-100">
    <!-- Header du Builder -->
    <header class="bg-white border-b border-neutral-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-4">
        <NuxtLink
          :to="backLink"
          class="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Retour</span>
        </NuxtLink>
        <div class="h-5 w-px bg-neutral-200"></div>
        <div>
          <input
            v-model="pageTitle"
            type="text"
            class="text-base font-semibold text-neutral-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/30 rounded px-1.5 py-0.5 -ml-1.5"
            @change="handleTitleChange"
          />
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[11px] font-mono text-neutral-400">/{{ currentPage?.slug }}</span>
            <span v-if="hasUnsavedChanges" class="text-[11px] text-amber-600 font-medium">• Non enregistré</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Prévisualisation -->
        <div class="flex items-center bg-neutral-100 rounded-lg p-0.5 mr-2">
          <button
            @click="previewMode = 'desktop'"
            :class="[
              'p-1.5 rounded-md transition-all',
              previewMode === 'desktop' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
            ]"
            title="Desktop"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            @click="previewMode = 'tablet'"
            :class="[
              'p-1.5 rounded-md transition-all',
              previewMode === 'tablet' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
            ]"
            title="Tablette"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            @click="previewMode = 'mobile'"
            :class="[
              'p-1.5 rounded-md transition-all',
              previewMode === 'mobile' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
            ]"
            title="Mobile"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        
        <!-- Actions -->
        <button
          @click="handleSave"
          :disabled="isSaving || !hasUnsavedChanges"
          class="px-3.5 py-1.5 text-sm font-medium bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
        >
          <svg v-if="isSaving" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Enregistrer
        </button>
        
        <button
          @click="handlePublish"
          :disabled="isSaving"
          :class="[
            'px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5',
            currentPage?.is_published
              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              : 'bg-neutral-900 text-white hover:bg-neutral-800'
          ]"
        >
          <svg v-if="!currentPage?.is_published" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ currentPage?.is_published ? 'Dépublier' : 'Publier' }}
        </button>
      </div>
    </header>
    
    <!-- Corps principal : Layout 3 colonnes -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Colonne gauche : Sections -->
      <aside class="w-72 bg-white border-r border-neutral-200 flex flex-col flex-shrink-0">
        <div class="px-4 py-3 border-b border-neutral-100">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Sections</h2>
        </div>
        
        <div class="flex-1 overflow-y-auto p-3">
          <!-- Liste des sections -->
          <div v-if="currentPage?.sections?.length" class="space-y-1.5">
            <div
              v-for="(section, index) in currentPage.sections"
              :key="section.id"
              @click="selectedSectionId = section.id"
              :class="[
                'group relative rounded-lg cursor-pointer transition-all duration-150',
                selectedSectionId === section.id
                  ? 'bg-primary/5 ring-1 ring-primary/30'
                  : 'hover:bg-neutral-50'
              ]"
            >
              <div class="p-3">
                <div class="flex items-start gap-3">
                  <!-- Icône de section -->
                  <div 
                    :class="[
                      'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                      selectedSectionId === section.id
                        ? 'bg-primary/10 text-primary'
                        : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
                    ]"
                  >
                    <component :is="getSectionIconComponent(section.type)" class="w-4 h-4" />
                  </div>
                  
                  <!-- Infos section -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-neutral-800">{{ getSectionLabel(section.type) }}</span>
                    </div>
                    <p class="text-[11px] text-neutral-400 truncate mt-0.5">
                      {{ getSectionPreview(section) }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Actions flottantes -->
              <div 
                :class="[
                  'absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 transition-opacity',
                  'opacity-0 group-hover:opacity-100',
                  selectedSectionId === section.id ? 'opacity-100' : ''
                ]"
              >
                <button
                  @click.stop="moveSection(section.id, 'up')"
                  :disabled="index === 0"
                  class="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Monter"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  @click.stop="moveSection(section.id, 'down')"
                  :disabled="index === currentPage.sections.length - 1"
                  class="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Descendre"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  @click.stop="duplicateSection(section.id)"
                  class="p-1.5 rounded-md text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Dupliquer"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  @click.stop="removeSection(section.id)"
                  class="p-1.5 rounded-md text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Supprimer"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- État vide -->
          <div v-else class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p class="text-sm font-medium text-neutral-600 mb-1">Aucune section</p>
            <p class="text-xs text-neutral-400">Ajoutez votre première section</p>
          </div>
        </div>
        
        <!-- Bouton ajouter section -->
        <div class="p-3 border-t border-neutral-100">
          <button
            @click="showAddBlockModal = true"
            class="w-full py-2.5 px-4 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une section
          </button>
        </div>
      </aside>
      
      <!-- Colonne centrale : Prévisualisation -->
      <main class="flex-1 overflow-hidden flex flex-col bg-neutral-100">
        <div class="flex-1 overflow-auto p-6 flex justify-center">
          <div
            :class="[
              'bg-white shadow-lg rounded-lg transition-all duration-300 overflow-auto',
              previewMode === 'desktop' ? 'w-full max-w-5xl' : '',
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
                  selectedSectionId === section.id ? 'ring-2 ring-primary ring-inset' : 'hover:ring-2 hover:ring-neutral-300 hover:ring-inset'
                ]"
              >
                <!-- Indicateur de sélection -->
                <div
                  v-if="selectedSectionId === section.id"
                  class="absolute top-2 left-2 z-10 px-2 py-1 bg-neutral-900 text-white text-[10px] font-semibold uppercase tracking-wide rounded-md shadow-sm"
                >
                  {{ getSectionLabel(section.type) }}
                </div>
                
                <!-- Rendu du bloc -->
                <BuilderBlock :section="section" />
              </div>
            </div>
            
            <!-- État vide -->
            <div v-else class="flex flex-col items-center justify-center h-full py-20">
              <div class="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p class="text-base font-medium text-neutral-600 mb-1">Page vide</p>
              <p class="text-sm text-neutral-400">Ajoutez votre première section</p>
            </div>
          </div>
        </div>
      </main>
      
      <!-- Colonne droite : Éditeur de section -->
      <aside 
        v-if="selectedSection"
        class="w-80 bg-white border-l border-neutral-200 flex flex-col flex-shrink-0"
      >
        <!-- Utiliser BuilderEditor qui a maintenant son propre header -->
        <BuilderEditor
          :section="selectedSection"
          @update:content="handleContentUpdate"
          @update:style="handleStyleUpdate"
        />
      </aside>
      
      <!-- Message si aucune section sélectionnée -->
      <aside 
        v-else
        class="w-80 bg-neutral-50 border-l border-neutral-200 flex flex-col items-center justify-center flex-shrink-0"
      >
        <div class="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <p class="text-sm font-medium text-neutral-600">Sélectionnez une section</p>
        <p class="text-xs text-neutral-400 mt-0.5">pour la modifier</p>
      </aside>
    </div>
    
    <!-- Modal d'ajout de bloc -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-150"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="showAddBlockModal" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen p-4">
            <!-- Backdrop -->
            <div 
              class="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" 
              @click="showAddBlockModal = false"
            ></div>
            
            <!-- Modal -->
            <Transition
              enter-active-class="transition-all duration-200"
              leave-active-class="transition-all duration-150"
              enter-from-class="opacity-0 scale-95"
              leave-to-class="opacity-0 scale-95"
            >
              <div 
                v-if="showAddBlockModal"
                class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto z-10 overflow-hidden"
              >
                <!-- Header -->
                <div class="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-neutral-900">Ajouter une section</h3>
                    <p class="text-xs text-neutral-400 mt-0.5">Choisissez un type de bloc à ajouter</p>
                  </div>
                  <button 
                    @click="closeAddBlockModal" 
                    class="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- Content -->
                <div class="p-6 max-h-[65vh] overflow-y-auto">
                  <!-- Vue sélection de templates -->
                  <template v-if="selectedBlockType && getSelectedBlockDefinition()">
                    <button 
                      @click="selectedBlockType = null" 
                      class="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Retour aux blocs
                    </button>
                    
                    <div class="mb-4">
                      <h4 class="text-base font-semibold text-neutral-800">{{ getSelectedBlockDefinition()?.name }}</h4>
                      <p class="text-sm text-neutral-500 mt-1">Choisissez un style pour ce bloc</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <button
                        v-for="template in getSelectedBlockDefinition()?.templates"
                        :key="template.id"
                        @click="handleAddBlockWithTemplate(template.id)"
                        class="group text-left rounded-xl border border-neutral-200 hover:border-primary/40 hover:shadow-md transition-all overflow-hidden"
                      >
                        <!-- Preview du template -->
                        <div 
                          class="h-24 flex items-center justify-center"
                          :style="{
                            backgroundColor: template.defaultStyle.backgroundColor?.startsWith('linear') 
                              ? '#667eea' 
                              : template.defaultStyle.backgroundColor || '#f5f5f5',
                            color: template.defaultStyle.textColor || '#262626'
                          }"
                        >
                          <div class="text-center px-4">
                            <div class="text-xs font-medium opacity-80">{{ template.name }}</div>
                          </div>
                        </div>
                        <!-- Nom du template -->
                        <div class="p-3 bg-white">
                          <span class="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">{{ template.name }}</span>
                        </div>
                      </button>
                    </div>
                  </template>
                  
                  <!-- Vue sélection de type de bloc -->
                  <template v-else>
                    <!-- Catégorie: Basique -->
                    <div class="mb-6">
                      <h4 class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3">Basique</h4>
                      <div class="grid grid-cols-4 gap-3">
                        <button
                          v-for="block in getBlocksByCategory('basic')"
                          :key="block.type"
                          @click="handleSelectBlockType(block.type)"
                          class="group p-4 bg-neutral-50 rounded-xl hover:bg-primary/5 hover:ring-1 hover:ring-primary/20 transition-all text-center"
                        >
                          <div class="w-10 h-10 mx-auto bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm group-hover:shadow group-hover:scale-105 transition-all">
                            <component :is="getSectionIconComponent(block.type)" class="w-5 h-5 text-neutral-600 group-hover:text-primary" />
                          </div>
                          <span class="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">{{ block.name }}</span>
                          <span v-if="block.templates.length > 1" class="block text-[10px] text-neutral-400 mt-0.5">{{ block.templates.length }} styles</span>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Catégorie: Engagement -->
                    <div class="mb-6">
                      <h4 class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3">Engagement</h4>
                      <div class="grid grid-cols-4 gap-3">
                        <button
                          v-for="block in getBlocksByCategory('engagement')"
                          :key="block.type"
                          @click="handleSelectBlockType(block.type)"
                          class="group p-4 bg-neutral-50 rounded-xl hover:bg-primary/5 hover:ring-1 hover:ring-primary/20 transition-all text-center"
                        >
                          <div class="w-10 h-10 mx-auto bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm group-hover:shadow group-hover:scale-105 transition-all">
                            <component :is="getSectionIconComponent(block.type)" class="w-5 h-5 text-neutral-600 group-hover:text-primary" />
                          </div>
                          <span class="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">{{ block.name }}</span>
                          <span v-if="block.templates.length > 1" class="block text-[10px] text-neutral-400 mt-0.5">{{ block.templates.length }} styles</span>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Catégorie: Conversion -->
                    <div class="mb-6">
                      <h4 class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3">Conversion</h4>
                      <div class="grid grid-cols-4 gap-3">
                        <button
                          v-for="block in getBlocksByCategory('conversion')"
                          :key="block.type"
                          @click="handleSelectBlockType(block.type)"
                          class="group p-4 bg-neutral-50 rounded-xl hover:bg-primary/5 hover:ring-1 hover:ring-primary/20 transition-all text-center"
                        >
                          <div class="w-10 h-10 mx-auto bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm group-hover:shadow group-hover:scale-105 transition-all">
                            <component :is="getSectionIconComponent(block.type)" class="w-5 h-5 text-neutral-600 group-hover:text-primary" />
                          </div>
                          <span class="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">{{ block.name }}</span>
                          <span v-if="block.templates.length > 1" class="block text-[10px] text-neutral-400 mt-0.5">{{ block.templates.length }} styles</span>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Catégorie: Structure -->
                    <div>
                      <h4 class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3">Structure</h4>
                      <div class="grid grid-cols-4 gap-3">
                        <button
                          v-for="block in getBlocksByCategory('structure')"
                          :key="block.type"
                          @click="handleSelectBlockType(block.type)"
                          class="group p-4 bg-neutral-50 rounded-xl hover:bg-primary/5 hover:ring-1 hover:ring-primary/20 transition-all text-center"
                        >
                          <div class="w-10 h-10 mx-auto bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm group-hover:shadow group-hover:scale-105 transition-all">
                            <component :is="getSectionIconComponent(block.type)" class="w-5 h-5 text-neutral-600 group-hover:text-primary" />
                          </div>
                          <span class="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">{{ block.name }}</span>
                          <span v-if="block.templates.length > 1" class="block text-[10px] text-neutral-400 mt-0.5">{{ block.templates.length }} styles</span>
                        </button>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, h } from 'vue'
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
const showAddBlockModal = ref(false)
const selectedBlockType = ref<BlockType | null>(null)
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

// Labels des sections
const getSectionLabel = (type: string): string => {
  const labels: Record<string, string> = {
    hero: 'Hero',
    features: 'Caractéristiques',
    testimonials: 'Témoignages',
    pricing: 'Tarification',
    cta: 'Appel à l\'action',
    text: 'Texte',
    image: 'Image',
    gallery: 'Galerie',
    video: 'Vidéo',
    faq: 'FAQ',
    contact: 'Contact',
    countdown: 'Compte à rebours',
    social: 'Réseaux sociaux',
    spacer: 'Espace',
    divider: 'Séparateur'
  }
  return labels[type] || type
}

// Preview du contenu de la section
const getSectionPreview = (section: PageSection): string => {
  const content = section.content || {}
  
  if (content.title) return content.title
  if (content.content) return content.content.substring(0, 50)
  if (content.items?.length) return `${content.items.length} élément${content.items.length > 1 ? 's' : ''}`
  if (section.type === 'spacer') return 'Espace vertical'
  if (section.type === 'divider') return 'Ligne de séparation'
  if (content.email) return content.email
  if (content.src) return 'Image ajoutée'
  
  return 'Cliquez pour modifier'
}

// Icône SVG par type de section
const getSectionIconComponent = (type: string) => {
  return {
    functional: true,
    render() {
      const paths: Record<string, string> = {
        hero: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z',
        features: 'M4 6h16M4 10h16M4 14h16M4 18h16',
        testimonials: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
        pricing: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        cta: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
        text: 'M4 6h16M4 12h16M4 18h7',
        image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
        gallery: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
        video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
        faq: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        contact: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        countdown: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        social: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
        spacer: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4',
        divider: 'M20 12H4'
      }
      
      const d = paths[type] || paths.text
      return h('svg', { 
        class: 'w-4 h-4', 
        fill: 'none', 
        stroke: 'currentColor', 
        viewBox: '0 0 24 24'
      }, [
        h('path', { 
          'stroke-linecap': 'round', 
          'stroke-linejoin': 'round', 
          'stroke-width': '1.5', 
          d 
        })
      ])
    }
  }
}

// Catégories de blocs
const blockCategories: Record<string, BlockType[]> = {
  basic: ['hero', 'text', 'image', 'video'],
  engagement: ['features', 'testimonials', 'faq', 'gallery'],
  conversion: ['cta', 'pricing', 'contact', 'countdown'],
  structure: ['divider', 'spacer', 'social']
}

// Récupérer les blocs par catégorie
const getBlocksByCategory = (category: string) => {
  const types = blockCategories[category] || []
  return blockDefinitions.filter(b => types.includes(b.type))
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

const handleSelectBlockType = (type: BlockType) => {
  const blockDef = blockDefinitions.find(b => b.type === type)
  if (blockDef) {
    if (blockDef.templates.length === 1) {
      // Un seul template, ajouter directement
      addSection(type, blockDef.templates[0])
      closeAddBlockModal()
    } else {
      // Plusieurs templates, afficher la sélection
      selectedBlockType.value = type
    }
  }
}

const handleAddBlockWithTemplate = (templateId: string) => {
  if (!selectedBlockType.value) return
  const blockDef = blockDefinitions.find(b => b.type === selectedBlockType.value)
  const template = blockDef?.templates.find(t => t.id === templateId)
  if (template) {
    addSection(selectedBlockType.value, template)
    closeAddBlockModal()
  }
}

const closeAddBlockModal = () => {
  showAddBlockModal.value = false
  selectedBlockType.value = null
}

const getSelectedBlockDefinition = () => {
  if (!selectedBlockType.value) return null
  return blockDefinitions.find(b => b.type === selectedBlockType.value)
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
