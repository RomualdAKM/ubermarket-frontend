<template>
  <div class="builder-editor">
    <!-- En-tête avec type de section -->
    <div class="px-5 py-4 border-b border-neutral-100">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
          <component :is="getSectionIcon(section.type)" class="w-4 h-4 text-neutral-600" />
        </div>
        <div>
          <h3 class="text-sm font-semibold text-neutral-900 uppercase">{{ getSectionLabel(section.type) }}</h3>
          <p class="text-[11px] text-neutral-400">Modifiez les propriétés</p>
        </div>
      </div>
    </div>

    <!-- Accordéons -->
    <div class="divide-y divide-neutral-100">
      <!-- CONTENU -->
      <Accordion :defaultOpen="true">
        <template #trigger="{ isOpen }">
          <div class="accordion-trigger">
            <span class="accordion-label">Contenu</span>
            <ChevronIcon :class="['accordion-chevron', isOpen && 'rotate-180']" />
          </div>
        </template>
        <template #content>
          <div class="accordion-content">
            <!-- Hero -->
            <template v-if="section.type === 'hero'">
              <!-- Options communes -->
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" />
              <InputField label="Sous-titre" :value="section.content?.subtitle" @update="updateContent('subtitle', $event)" multiline />
              
              <!-- Badge (pour certains templates) -->
              <InputField 
                v-if="['hero-editorial', 'hero-product-showcase', 'hero-countdown'].includes(section.template)"
                label="Badge"
                :value="section.content?.badge" 
                @update="updateContent('badge', $event)" 
                placeholder="NOUVEAU, BEST-SELLER..."
              />
              
              <!-- Options Slider -->
              <template v-if="section.content?.layout === 'slider' || section.template?.includes('slider')">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Configuration Slider</span>
                </div>
                <div class="flex items-center justify-between mb-3">
                  <span class="field-label">Slides</span>
                  <button @click="addSlide" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                </div>
                <div class="space-y-3">
                  <div 
                    v-for="(slide, index) in (section.content?.slides || [])" 
                    :key="index"
                    class="p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-semibold text-neutral-600">Slide {{ index + 1 }}</span>
                      <button @click="removeSlide(index)" class="text-xs text-red-500 hover:text-red-600">Supprimer</button>
                    </div>
                    <InputField label="Titre" :value="slide.title" @update="updateSlide(index, 'title', $event)" />
                    <InputField label="Sous-titre" :value="slide.subtitle" @update="updateSlide(index, 'subtitle', $event)" />
                    <InputField label="Image URL" :value="slide.image" @update="updateSlide(index, 'image', $event)" placeholder="https://..." />
                    <div class="grid grid-cols-2 gap-2">
                      <InputField label="Texte bouton" :value="slide.button?.text" @update="updateSlideButton(index, 'text', $event)" />
                      <InputField label="URL bouton" :value="slide.button?.url" @update="updateSlideButton(index, 'url', $event)" />
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3 mt-4">
                  <CheckboxField 
                    label="Lecture auto"
                    :value="section.content?.autoplay || false"
                    @update="updateContent('autoplay', $event)"
                  />
                  <CheckboxField 
                    label="Afficher flèches"
                    :value="section.content?.showArrows !== false"
                    @update="updateContent('showArrows', $event)"
                  />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <CheckboxField 
                    label="Afficher points"
                    :value="section.content?.showDots !== false"
                    @update="updateContent('showDots', $event)"
                  />
                  <NumberField 
                    v-if="section.content?.autoplay"
                    label="Intervalle (ms)"
                    :value="section.content?.autoplaySpeed || 5000"
                    @update="updateContent('autoplaySpeed', $event)"
                    :min="1000"
                    :max="10000"
                    :step="500"
                  />
                </div>
              </template>
              
              <!-- Options Split Image -->
              <template v-else-if="section.content?.layout === 'split' || section.template === 'hero-split-image'">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Image</span>
                </div>
                <InputField label="URL de l'image" :value="section.content?.image" @update="updateContent('image', $event)" placeholder="https://..." />
                <SelectField 
                  label="Position de l'image"
                  :options="imagePositionOptions"
                  :value="section.content?.imagePosition || 'right'"
                  @update="updateContent('imagePosition', $event)"
                />
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Bouton secondaire</span>
                </div>
                <InputField label="Texte" :value="section.content?.secondaryButton?.text" @update="updateSecondaryButton('text', $event)" placeholder="Optionnel" />
                <InputField label="URL" :value="section.content?.secondaryButton?.url" @update="updateSecondaryButton('url', $event)" />
              </template>
              
              <!-- Options Product Showcase -->
              <template v-else-if="section.content?.layout === 'product' || section.template === 'hero-product-showcase'">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Produit</span>
                </div>
                <InputField label="Image produit" :value="section.content?.image" @update="updateContent('image', $event)" placeholder="https://..." />
                <div class="grid grid-cols-2 gap-3">
                  <InputField label="Prix" :value="section.content?.price" @update="updateContent('price', $event)" placeholder="149\u20ac" />
                  <InputField label="Prix barr\u00e9" :value="section.content?.originalPrice" @update="updateContent('originalPrice', $event)" placeholder="199\u20ac" />
                </div>
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="field-label">Caract\u00e9ristiques</span>
                    <button @click="addProductFeature" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(feature, idx) in (section.content?.features || [])" :key="idx" class="flex gap-2">
                      <InputField 
                        :value="feature"
                        @update="updateProductFeature(idx, $event)"
                        placeholder="Avantage..."
                      />
                      <button @click="removeProductFeature(idx)" class="text-red-500 hover:text-red-600 px-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Options Stats -->
              <template v-else-if="section.content?.stats">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Statistiques</span>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <span class="field-label">Stats</span>
                  <button @click="addStat" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                </div>
                <div class="space-y-2">
                  <div v-for="(stat, idx) in (section.content?.stats || [])" :key="idx" class="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div class="flex justify-between mb-2">
                      <span class="text-xs text-neutral-500">Stat {{ idx + 1 }}</span>
                      <button @click="removeStat(idx)" class="text-xs text-red-500">Supprimer</button>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <InputField label="Valeur" :value="stat.value" @update="updateStat(idx, 'value', $event)" placeholder="10K+" />
                      <InputField label="Label" :value="stat.label" @update="updateStat(idx, 'label', $event)" placeholder="Clients" />
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Options Dual CTA -->
              <template v-else-if="section.content?.leftCta && section.content?.rightCta">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">CTA Gauche</span>
                </div>
                <InputField label="Titre" :value="section.content?.leftCta?.title" @update="updateLeftCta('title', $event)" />
                <InputField label="Description" :value="section.content?.leftCta?.description" @update="updateLeftCta('description', $event)" multiline />
                <InputField label="Texte bouton" :value="section.content?.leftCta?.button?.text" @update="updateLeftCtaButton('text', $event)" />
                <InputField label="URL" :value="section.content?.leftCta?.button?.url" @update="updateLeftCtaButton('url', $event)" />
                
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">CTA Droite</span>
                </div>
                <InputField label="Titre" :value="section.content?.rightCta?.title" @update="updateRightCta('title', $event)" />
                <InputField label="Description" :value="section.content?.rightCta?.description" @update="updateRightCta('description', $event)" multiline />
                <InputField label="Texte bouton" :value="section.content?.rightCta?.button?.text" @update="updateRightCtaButton('text', $event)" />
                <InputField label="URL" :value="section.content?.rightCta?.button?.url" @update="updateRightCtaButton('url', $event)" />
              </template>
              
              <!-- Options Countdown -->
              <template v-else-if="section.content?.showCountdown || section.template === 'hero-countdown'">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Compte \u00e0 rebours</span>
                </div>
                <div class="mb-3">
                  <span class="field-label mb-2 block">Date de lancement</span>
                  <input 
                    type="datetime-local"
                    :value="formatDateTimeLocal(section.content?.launchDate)"
                    @change="handleLaunchDateChange"
                    class="input-field"
                  />
                </div>
                <CheckboxField 
                  label="Afficher compte \u00e0 rebours"
                  :value="section.content?.showCountdown !== false"
                  @update="updateContent('showCountdown', $event)"
                />
                <CheckboxField 
                  label="Capture email"
                  :value="section.content?.emailCapture || false"
                  @update="updateContent('emailCapture', $event)"
                />
                <InputField 
                  v-if="section.content?.emailCapture"
                  label="Placeholder email"
                  :value="section.content?.placeholder" 
                  @update="updateContent('placeholder', $event)" 
                  placeholder="Votre email"
                />
              </template>
              
              <!-- Options par d\u00e9faut (templates centr\u00e9s) -->
              <template v-else>
                <SegmentedControl 
                  label="Alignement du contenu"
                  :options="alignmentOptions"
                  :value="section.style?.alignment || 'center'"
                  @update="updateStyle('alignment', $event)"
                />
              </template>
              
              <SelectField 
                label="Largeur max contenu"
                :options="widthOptions"
                :value="section.style?.maxWidth || '1024px'"
                @update="updateStyle('maxWidth', $event)"
              />
            </template>

            <!-- Features -->
            <template v-else-if="section.type === 'features'">
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" />
              <InputField label="Sous-titre" :value="section.content?.subtitle" @update="updateContent('subtitle', $event)" />
              
              <!-- Options spécifiques par layout -->
              
              <!-- Timeline -->
              <template v-if="section.content?.layout === 'timeline'">
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Étapes</span>
                    <button @click="addTimelineStep" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-3">
                    <div 
                      v-for="(item, index) in (section.content?.items || [])" 
                      :key="index"
                      class="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-neutral-400">Étape {{ item.step || index + 1 }}</span>
                        <button @click="removeFeatureItem(index)" class="text-neutral-500 hover:text-red-400">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <InputField label="Titre" :value="item.title" @update="updateFeatureItem(Number(index), 'title', $event)" />
                      <InputField label="Description" :value="item.description" @update="updateFeatureItem(Number(index), 'description', $event)" multiline :rows="2" />
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Process horizontal -->
              <template v-else-if="section.content?.layout === 'process'">
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Étapes du processus</span>
                    <button @click="addProcessStep" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-3">
                    <div 
                      v-for="(item, index) in (section.content?.items || [])" 
                      :key="index"
                      class="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-neutral-400">Processus {{ index + 1 }}</span>
                        <button @click="removeFeatureItem(index)" class="text-neutral-500 hover:text-red-400">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <InputField label="Titre" :value="item.title" @update="updateFeatureItem(Number(index), 'title', $event)" />
                      <InputField label="Description" :value="item.description" @update="updateFeatureItem(Number(index), 'description', $event)" />
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Comparison -->
              <template v-else-if="section.content?.layout === 'comparison'">
                <div class="mt-4 space-y-4">
                  <div class="p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                    <InputField label="Titre colonne gauche" :value="section.content?.leftColumn?.title" @update="updateComparisonColumn('left', 'title', $event)" />
                    <div class="mt-3">
                      <div class="flex items-center justify-between mb-2">
                        <span class="field-label text-xs">Éléments négatifs</span>
                        <button @click="addComparisonItem('left')" class="text-xs text-primary hover:text-primary/80">+ Ajouter</button>
                      </div>
                      <div class="space-y-2">
                        <div v-for="(item, idx) in (section.content?.leftColumn?.items || [])" :key="idx" class="flex items-center gap-2">
                          <InputField :value="item" @update="updateComparisonItem('left', Number(idx), $event)" class="flex-1" />
                          <button @click="removeComparisonItem('left', Number(idx))" class="text-neutral-500 hover:text-red-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="p-3 bg-green-900/20 rounded-lg border border-green-800/30">
                    <InputField label="Titre colonne droite" :value="section.content?.rightColumn?.title" @update="updateComparisonColumn('right', 'title', $event)" />
                    <div class="mt-3">
                      <div class="flex items-center justify-between mb-2">
                        <span class="field-label text-xs">Éléments positifs</span>
                        <button @click="addComparisonItem('right')" class="text-xs text-primary hover:text-primary/80">+ Ajouter</button>
                      </div>
                      <div class="space-y-2">
                        <div v-for="(item, idx) in (section.content?.rightColumn?.items || [])" :key="idx" class="flex items-center gap-2">
                          <InputField :value="item" @update="updateComparisonItem('right', Number(idx), $event)" class="flex-1" />
                          <button @click="removeComparisonItem('right', Number(idx))" class="text-neutral-500 hover:text-red-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Stats -->
              <template v-else-if="section.content?.layout === 'stats'">
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Statistiques</span>
                    <button @click="addStat" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(stat, idx) in (section.content?.stats || [])" :key="idx" class="flex items-center gap-2 p-2 bg-neutral-800/50 rounded">
                      <InputField :value="stat.value" @update="updateStat(Number(idx), 'value', $event)" placeholder="Valeur" class="w-24" />
                      <InputField :value="stat.label" @update="updateStat(Number(idx), 'label', $event)" placeholder="Label" class="flex-1" />
                      <button @click="removeStat(Number(idx))" class="text-neutral-500 hover:text-red-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Features associées</span>
                    <button @click="addStatsFeature" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-2">
                    <FeatureItem 
                      v-for="(item, index) in (section.content?.features || [])" 
                      :key="index"
                      :item="item"
                      :index="index"
                      @update="updateStatsFeature"
                      @remove="removeStatsFeature(index)"
                    />
                  </div>
                </div>
              </template>
              
              <!-- Alternating -->
              <template v-else-if="section.content?.layout === 'alternating'">
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Sections alternées</span>
                    <button @click="addAlternatingItem" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-3">
                    <div 
                      v-for="(item, index) in (section.content?.items || [])" 
                      :key="index"
                      class="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-neutral-400">Section {{ index + 1 }} ({{ Number(index) % 2 === 0 ? 'Image droite' : 'Image gauche' }})</span>
                        <button @click="removeAlternatingItem(index)" class="text-neutral-500 hover:text-red-400">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <InputField label="Titre" :value="item.title" @update="updateAlternatingItem(Number(index), 'title', $event)" />
                      <InputField label="Description" :value="item.description" @update="updateAlternatingItem(Number(index), 'description', $event)" multiline :rows="2" />
                      <InputField label="Image URL" :value="item.image" @update="updateAlternatingItem(Number(index), 'image', $event)" placeholder="https://..." />
                      <div class="grid grid-cols-2 gap-2 mt-2">
                        <InputField label="Bouton texte" :value="item.button?.text" @update="updateAlternatingItemButton(Number(index), 'text', $event)" />
                        <InputField label="Bouton URL" :value="item.button?.url" @update="updateAlternatingItemButton(Number(index), 'url', $event)" />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Showcase -->
              <template v-else-if="section.content?.layout === 'showcase'">
                <InputField label="Badge" :value="section.content?.badge" @update="updateContent('badge', $event)" placeholder="NOUVEAU" />
                <InputField label="Description" :value="section.content?.description" @update="updateContent('description', $event)" multiline :rows="3" />
                <InputField label="Image URL" :value="section.content?.image" @update="updateContent('image', $event)" placeholder="https://..." />
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Points clés</span>
                    <button @click="addShowcaseFeature" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(feature, idx) in (section.content?.features || [])" :key="idx" class="flex items-center gap-2">
                      <InputField :value="feature" @update="updateShowcaseFeature(Number(idx), $event)" class="flex-1" />
                      <button @click="removeShowcaseFeature(Number(idx))" class="text-neutral-500 hover:text-red-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Tabs -->
              <template v-else-if="section.content?.layout === 'tabs'">
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Onglets</span>
                    <button @click="addTab" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-3">
                    <div 
                      v-for="(tab, index) in (section.content?.tabs || [])" 
                      :key="index"
                      class="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-neutral-400">Onglet {{ index + 1 }}</span>
                        <button @click="removeTab(index)" class="text-neutral-500 hover:text-red-400">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <InputField label="Label onglet" :value="tab.label" @update="updateTab(Number(index), 'label', $event)" />
                      <InputField label="Titre" :value="tab.title" @update="updateTab(Number(index), 'title', $event)" />
                      <InputField label="Description" :value="tab.description" @update="updateTab(Number(index), 'description', $event)" multiline :rows="2" />
                      <InputField label="Image URL" :value="tab.image" @update="updateTab(Number(index), 'image', $event)" placeholder="https://..." />
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Bento Grid -->
              <template v-else-if="section.content?.layout === 'bento'">
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Éléments Bento</span>
                    <button @click="addBentoItem" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-3">
                    <div 
                      v-for="(item, index) in (section.content?.items || [])" 
                      :key="index"
                      class="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-neutral-400">Cellule {{ index + 1 }}</span>
                        <button @click="removeFeatureItem(index)" class="text-neutral-500 hover:text-red-400">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <SelectField 
                        label="Taille" 
                        :options="bentoSizeOptions" 
                        :value="item.size || 'small'" 
                        @update="updateFeatureItem(Number(index), 'size', $event)" 
                      />
                      <InputField label="Titre" :value="item.title" @update="updateFeatureItem(Number(index), 'title', $event)" />
                      <InputField label="Description" :value="item.description" @update="updateFeatureItem(Number(index), 'description', $event)" />
                      <SelectField label="Icône" :options="iconOptions" :value="item.icon || 'check'" @update="updateFeatureItem(Number(index), 'icon', $event)" />
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Checklist (string items) -->
              <template v-else-if="section.content?.items && typeof section.content.items[0] === 'string'">
                <SelectField 
                  label="Colonnes" 
                  :options="columnsOptions" 
                  :value="String(section.content?.columns || 2)" 
                  @update="updateContent('columns', Number($event))" 
                />
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Éléments de la liste</span>
                    <button @click="addChecklistItem" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(item, idx) in (section.content?.items || [])" :key="idx" class="flex items-center gap-2">
                      <InputField :value="item" @update="updateChecklistItem(Number(idx), $event)" class="flex-1" />
                      <button @click="removeChecklistItem(Number(idx))" class="text-neutral-500 hover:text-red-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Default: Grid (object items) -->
              <template v-else>
                <SelectField 
                  label="Colonnes" 
                  :options="columnsOptions" 
                  :value="String(section.content?.columns || 3)" 
                  @update="updateContent('columns', Number($event))" 
                />
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Caractéristiques</span>
                    <button @click="addFeatureItem" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-2">
                    <FeatureItem 
                      v-for="(item, index) in (section.content?.items || [])" 
                      :key="index"
                      :item="item"
                      :index="index"
                      @update="updateFeatureItem"
                      @remove="removeFeatureItem(index)"
                    />
                  </div>
                </div>
              </template>
            </template>

            <!-- Testimonials -->
            <template v-else-if="section.type === 'testimonials'">
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" />
              <InputField v-if="section.content?.subtitle !== undefined" label="Sous-titre" :value="section.content?.subtitle" @update="updateContent('subtitle', $event)" />
              
              <!-- Options Carousel -->
              <template v-if="section.content?.layout === 'carousel'">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Carousel</span>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <CheckboxField 
                    label="Lecture auto"
                    :value="section.content?.autoplay || false"
                    @update="updateContent('autoplay', $event)"
                  />
                  <CheckboxField 
                    label="Afficher flèches"
                    :value="section.content?.showArrows !== false"
                    @update="updateContent('showArrows', $event)"
                  />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <CheckboxField 
                    label="Afficher points"
                    :value="section.content?.showDots !== false"
                    @update="updateContent('showDots', $event)"
                  />
                  <NumberField 
                    v-if="section.content?.autoplay"
                    label="Intervalle (ms)"
                    :value="section.content?.autoplaySpeed || 5000"
                    @update="updateContent('autoplaySpeed', $event)"
                    :min="1000"
                    :max="10000"
                    :step="500"
                  />
                </div>
              </template>
              
              <!-- Options Wall (Masonry) -->
              <template v-else-if="section.content?.layout === 'wall'">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Grille</span>
                </div>
                <SelectField 
                  label="Colonnes"
                  :options="wallColumnsOptions"
                  :value="String(section.content?.columns || 3)"
                  @update="updateContent('columns', Number($event))"
                />
              </template>
              
              <!-- Options Video -->
              <template v-else-if="section.content?.layout === 'video'">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Vidéo</span>
                </div>
                <InputField label="URL vidéo (YouTube/Vimeo)" :value="section.content?.videoUrl" @update="updateContent('videoUrl', $event)" placeholder="https://youtube.com/..." />
                <InputField label="Miniature (optionnel)" :value="section.content?.videoThumbnail" @update="updateContent('videoThumbnail', $event)" placeholder="https://..." />
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Personne</span>
                </div>
                <InputField label="Nom" :value="section.content?.name" @update="updateContent('name', $event)" />
                <InputField label="Rôle" :value="section.content?.role" @update="updateContent('role', $event)" />
                <InputField label="Entreprise" :value="section.content?.company" @update="updateContent('company', $event)" />
                <InputField label="Citation" :value="section.content?.quote" @update="updateContent('quote', $event)" multiline />
              </template>
              
              <!-- Options Split -->
              <template v-else-if="section.content?.layout === 'split'">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Image</span>
                </div>
                <InputField label="URL de l'image" :value="section.content?.image" @update="updateContent('image', $event)" placeholder="https://..." />
                <SelectField 
                  label="Position de l'image"
                  :options="imagePositionOptions"
                  :value="section.content?.imagePosition || 'left'"
                  @update="updateContent('imagePosition', $event)"
                />
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Personne</span>
                </div>
                <InputField label="Nom" :value="section.content?.name" @update="updateContent('name', $event)" />
                <InputField label="Rôle" :value="section.content?.role" @update="updateContent('role', $event)" />
                <InputField label="Entreprise" :value="section.content?.company" @update="updateContent('company', $event)" />
                <InputField label="Témoignage" :value="section.content?.text" @update="updateContent('text', $event)" multiline :rows="4" />
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Statistiques</span>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <span class="field-label">Stats</span>
                  <button @click="addTestimonialStat" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                </div>
                <div class="space-y-2">
                  <div v-for="(stat, idx) in (section.content?.stats || [])" :key="idx" class="flex gap-2">
                    <InputField label="Valeur" :value="stat.value" @update="updateTestimonialStat(idx, 'value', $event)" placeholder="+45%" />
                    <InputField label="Label" :value="stat.label" @update="updateTestimonialStat(idx, 'label', $event)" placeholder="Satisfaction" />
                    <button @click="removeTestimonialStat(idx)" class="text-red-500 hover:text-red-600 px-2 mt-5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              </template>
              
              <!-- Options Rating -->
              <template v-else-if="section.content?.layout === 'rating'">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Notation globale</span>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <NumberField 
                    label="Note moyenne"
                    :value="section.content?.averageRating || 4.5"
                    @update="updateContent('averageRating', $event)"
                    :min="0"
                    :max="5"
                    :step="0.1"
                  />
                  <NumberField 
                    label="Nombre d'avis"
                    :value="section.content?.totalReviews || 100"
                    @update="updateContent('totalReviews', $event)"
                    :min="0"
                    :max="100000"
                    :step="1"
                  />
                </div>
              </template>
              
              <!-- Options Featured -->
              <template v-else-if="section.content?.layout === 'featured'">
                <InputField label="Badge" :value="section.content?.badge" @update="updateContent('badge', $event)" placeholder="TÉMOIGNAGE DU MOIS" />
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Personne</span>
                </div>
                <InputField label="Nom" :value="section.content?.name" @update="updateContent('name', $event)" />
                <InputField label="Rôle" :value="section.content?.role" @update="updateContent('role', $event)" />
                <InputField label="Entreprise" :value="section.content?.company" @update="updateContent('company', $event)" />
                <InputField label="Image" :value="section.content?.image" @update="updateContent('image', $event)" placeholder="https://..." />
                <InputField label="Témoignage" :value="section.content?.text" @update="updateContent('text', $event)" multiline :rows="4" />
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Métriques</span>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <span class="field-label">Métriques</span>
                  <button @click="addTestimonialMetric" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                </div>
                <div class="space-y-2">
                  <div v-for="(metric, idx) in (section.content?.metrics || [])" :key="idx" class="flex gap-2">
                    <InputField label="Valeur" :value="metric.value" @update="updateTestimonialMetric(idx, 'value', $event)" placeholder="3x" />
                    <InputField label="Label" :value="metric.label" @update="updateTestimonialMetric(idx, 'label', $event)" placeholder="Croissance" />
                    <button @click="removeTestimonialMetric(idx)" class="text-red-500 hover:text-red-600 px-2 mt-5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              </template>
              
              <!-- Options Quote -->
              <template v-else-if="section.content?.layout === 'quote'">
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Citation principale</span>
                </div>
                <div v-if="section.content?.items?.[0]" class="space-y-3">
                  <InputField label="Nom" :value="section.content.items[0].name" @update="updateQuoteItem('name', $event)" />
                  <InputField label="Rôle" :value="section.content.items[0].role" @update="updateQuoteItem('role', $event)" />
                  <InputField label="Entreprise" :value="section.content.items[0].company" @update="updateQuoteItem('company', $event)" />
                  <InputField label="Citation" :value="section.content.items[0].text" @update="updateQuoteItem('text', $event)" multiline :rows="4" />
                  <InputField label="Avatar URL" :value="section.content.items[0].avatar" @update="updateQuoteItem('avatar', $event)" placeholder="https://..." />
                  <InputField label="Logo entreprise" :value="section.content.items[0].logo" @update="updateQuoteItem('logo', $event)" placeholder="https://..." />
                </div>
              </template>
              
              <!-- Options Tweets -->
              <template v-else-if="section.content?.layout === 'tweets'">
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Tweets</span>
                    <button @click="addTweetItem" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(item, index) in (section.content?.items || [])" :key="index" class="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div class="flex justify-between mb-2">
                        <span class="text-xs text-neutral-500">Tweet {{ index + 1 }}</span>
                        <button @click="removeTweetItem(index)" class="text-xs text-red-500">Supprimer</button>
                      </div>
                      <InputField label="Nom" :value="item.name" @update="updateTweetItem(index, 'name', $event)" />
                      <InputField label="@username" :value="item.username" @update="updateTweetItem(index, 'username', $event)" placeholder="@user" />
                      <InputField label="Tweet" :value="item.text" @update="updateTweetItem(index, 'text', $event)" multiline />
                      <InputField label="Avatar URL" :value="item.avatar" @update="updateTweetItem(index, 'avatar', $event)" placeholder="https://..." />
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Options Avatars -->
              <template v-else-if="section.content?.layout === 'avatars'">
                <InputField label="Sous-titre" :value="section.content?.subtitle" @update="updateContent('subtitle', $event)" />
                <div class="section-divider mt-4 mb-3">
                  <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Call to Action</span>
                </div>
                <InputField label="Texte du bouton" :value="section.content?.cta?.text" @update="updateTestimonialsCta('text', $event)" />
                <InputField label="URL" :value="section.content?.cta?.url" @update="updateTestimonialsCta('url', $event)" />
              </template>
              
              <!-- Options Logos -->
              <template v-else-if="section.content?.layout === 'logos'">
                <CheckboxField 
                  label="Afficher les logos"
                  :value="section.content?.showLogos !== false"
                  @update="updateContent('showLogos', $event)"
                />
              </template>
              
              <!-- Liste de témoignages (pour layouts avec items: cards, carousel, wall, rating, logos) -->
              <div v-if="['cards', 'carousel', 'wall', 'rating', 'logos', 'minimal'].includes(section.content?.layout || 'cards')" class="mt-4">
                <div class="flex items-center justify-between mb-3">
                  <span class="field-label">Témoignages</span>
                  <button @click="addTestimonialItem" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                </div>
                <div class="space-y-2">
                  <TestimonialItem 
                    v-for="(item, index) in (section.content?.items || [])" 
                    :key="index"
                    :item="item"
                    :index="index"
                    :showRating="['cards', 'carousel', 'wall', 'rating', 'minimal'].includes(section.content?.layout || 'cards')"
                    :showLogo="section.content?.layout === 'logos'"
                    @update="updateTestimonialItem"
                    @remove="removeTestimonialItem(index)"
                  />
                </div>
              </div>
            </template>

            <!-- CTA -->
            <template v-else-if="section.type === 'cta'">
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" />
              <InputField label="Sous-titre" :value="section.content?.subtitle" @update="updateContent('subtitle', $event)" />
              
              <!-- Newsletter -->
              <template v-if="section.content?.layout === 'newsletter'">
                <InputField label="Placeholder email" :value="section.content?.inputPlaceholder" @update="updateContent('inputPlaceholder', $event)" placeholder="Votre email..." />
                <InputField label="Texte bouton" :value="section.content?.buttonText" @update="updateContent('buttonText', $event)" placeholder="S'abonner" />
              </template>
              
              <!-- Split (avec image) -->
              <template v-else-if="section.content?.layout === 'split'">
                <InputField label="URL de l'image" :value="section.content?.image" @update="updateContent('image', $event)" placeholder="https://..." />
                <SelectField 
                  label="Position image"
                  :options="[{value: 'left', label: 'Gauche'}, {value: 'right', label: 'Droite'}]"
                  :value="section.content?.imagePosition || 'right'"
                  @update="updateContent('imagePosition', $event)"
                />
              </template>
              
              <!-- Countdown -->
              <template v-else-if="section.content?.layout === 'countdown'">
                <div class="mt-3">
                  <span class="field-label mb-2 block">Date de fin</span>
                  <input 
                    type="datetime-local"
                    :value="formatDateTimeLocal(section.content?.endDate)"
                    @change="handleCtaEndDateChange"
                    class="input-field"
                  />
                </div>
                <InputField label="Texte urgence" :value="section.content?.urgencyText" @update="updateContent('urgencyText', $event)" placeholder="Offre limitée !" />
              </template>
              
              <!-- Dual Buttons -->
              <template v-else-if="section.content?.layout === 'dual'">
                <div class="field-group">
                  <span class="field-group-title">Bouton secondaire</span>
                  <InputField label="Texte" :value="section.content?.secondaryButton?.text" @update="updateSecondaryButton('text', $event)" placeholder="En savoir plus" />
                  <InputField label="URL" :value="section.content?.secondaryButton?.url" @update="updateSecondaryButton('url', $event)" placeholder="https://..." />
                </div>
              </template>
              
              <!-- Card flottante -->
              <template v-else-if="section.content?.layout === 'card'">
                <InputField label="Icône (emoji)" :value="section.content?.icon" @update="updateContent('icon', $event)" placeholder="🚀" />
              </template>
              
              <!-- Image Background -->
              <template v-else-if="section.content?.layout === 'image-bg'">
                <InputField label="URL image de fond" :value="section.content?.backgroundImage" @update="updateContent('backgroundImage', $event)" placeholder="https://..." />
                <SliderField 
                  label="Opacité overlay"
                  :min="0" :max="100" :step="5"
                  :value="section.content?.overlayOpacity || 50"
                  @update="updateContent('overlayOpacity', $event)"
                />
              </template>
              
              <!-- Social Proof -->
              <template v-else-if="section.content?.layout === 'social-proof'">
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="field-label">Statistiques</span>
                    <button @click="addCtaStat" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(stat, index) in (section.content?.stats || [])" :key="index" class="bg-neutral-800/50 rounded-lg p-2 border border-neutral-700/50">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-neutral-400">Stat {{ +index + 1 }}</span>
                        <button @click="removeCtaStat(+index)" class="text-red-400 hover:text-red-300 text-xs">Supprimer</button>
                      </div>
                      <div class="grid grid-cols-2 gap-2">
                        <InputField label="Valeur" :value="stat.value" @update="updateCtaStat(+index, 'value', $event)" placeholder="10K+" size="sm" />
                        <InputField label="Label" :value="stat.label" @update="updateCtaStat(+index, 'label', $event)" placeholder="Utilisateurs" size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- App Download -->
              <template v-else-if="section.content?.layout === 'app-download'">
                <InputField label="Lien App Store" :value="section.content?.appStoreUrl" @update="updateContent('appStoreUrl', $event)" placeholder="https://apps.apple.com/..." />
                <InputField label="Lien Play Store" :value="section.content?.playStoreUrl" @update="updateContent('playStoreUrl', $event)" placeholder="https://play.google.com/..." />
                <InputField label="Image mockup" :value="section.content?.mockupImage" @update="updateContent('mockupImage', $event)" placeholder="https://..." />
              </template>
              
              <!-- Banner -->
              <template v-else-if="section.content?.layout === 'banner'">
                <CheckboxField 
                  label="Afficher le bouton fermer"
                  :value="section.content?.dismissable || false"
                  @update="updateContent('dismissable', $event)"
                />
              </template>
            </template>

            <!-- Text -->
            <template v-else-if="section.type === 'text'">
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" placeholder="Optionnel" />
              <InputField label="Contenu" :value="section.content?.content" @update="updateContent('content', $event)" multiline :rows="6" placeholder="Votre texte ici..." />
            </template>

            <!-- Image -->
            <template v-else-if="section.type === 'image'">
              <InputField label="URL de l'image" :value="section.content?.src" @update="updateContent('src', $event)" placeholder="https://..." />
              <InputField label="Texte alternatif" :value="section.content?.alt" @update="updateContent('alt', $event)" placeholder="Description de l'image" />
              <InputField label="Légende" :value="section.content?.caption" @update="updateContent('caption', $event)" placeholder="Optionnel" />
            </template>

            <!-- FAQ -->
            <template v-else-if="section.type === 'faq'">
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" />
              <div class="mt-4">
                <div class="flex items-center justify-between mb-3">
                  <span class="field-label">Questions</span>
                  <button @click="addFaqItem" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                </div>
                <div class="space-y-2">
                  <FaqItem 
                    v-for="(item, index) in (section.content?.items || [])" 
                    :key="index"
                    :item="item"
                    :index="index"
                    @update="updateFaqItem"
                    @remove="removeFaqItem(index)"
                  />
                </div>
              </div>
            </template>

            <!-- Contact -->
            <template v-else-if="section.type === 'contact'">
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" />
              <InputField label="Email" :value="section.content?.email" @update="updateContent('email', $event)" type="email" />
              <InputField label="Téléphone" :value="section.content?.phone" @update="updateContent('phone', $event)" />
              <InputField label="Adresse" :value="section.content?.address" @update="updateContent('address', $event)" multiline />
            </template>

            <!-- Pricing -->
            <template v-else-if="section.type === 'pricing'">
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" />
              <InputField label="Sous-titre" :value="section.content?.subtitle" @update="updateContent('subtitle', $event)" />
              
              <!-- Single Plan -->
              <template v-if="section.content?.layout === 'single'">
                <div class="grid grid-cols-2 gap-3">
                  <InputField label="Prix" :value="section.content?.price" @update="updateContent('price', $event)" placeholder="99€" />
                  <InputField label="Période" :value="section.content?.period" @update="updateContent('period', $event)" placeholder="/mois" />
                </div>
                <InputField label="Description" :value="section.content?.description" @update="updateContent('description', $event)" multiline />
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="field-label">Fonctionnalités</span>
                    <button @click="addPricingFeature" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-1">
                    <div v-for="(feature, index) in (section.content?.features || [])" :key="index" class="flex items-center gap-2">
                      <input type="text" :value="feature" @input="handlePricingFeatureInput(+index, $event)" class="input-field flex-1 text-sm" />
                      <button @click="removePricingFeature(+index)" class="text-red-400 hover:text-red-300 p-1"><TrashIcon class="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Multi Plans (tiers, two-columns, table, highlighted, gradient, dark) -->
              <template v-else-if="['tiers', 'two-columns', 'table', 'highlighted', 'gradient', 'dark'].includes(section.content?.layout)">
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Plans tarifaires</span>
                    <button @click="addPricingPlan" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter un plan</button>
                  </div>
                  <div class="space-y-3">
                    <div v-for="(plan, index) in (section.content?.plans || [])" :key="index" class="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700/50">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-medium text-neutral-200">{{ plan.name || 'Plan ' + (+index + 1) }}</span>
                        <div class="flex items-center gap-2">
                          <CheckboxField 
                            label="Populaire"
                            :value="plan.popular || false"
                            @update="updatePricingPlan(+index, 'popular', $event)"
                            size="sm"
                          />
                          <button @click="removePricingPlan(+index)" class="text-red-400 hover:text-red-300 p-1"><TrashIcon class="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                      <div class="space-y-2">
                        <InputField label="Nom" :value="plan.name" @update="updatePricingPlan(+index, 'name', $event)" placeholder="Starter" size="sm" />
                        <div class="grid grid-cols-2 gap-2">
                          <InputField label="Prix" :value="plan.price" @update="updatePricingPlan(+index, 'price', $event)" placeholder="29€" size="sm" />
                          <InputField label="Période" :value="plan.period" @update="updatePricingPlan(+index, 'period', $event)" placeholder="/mois" size="sm" />
                        </div>
                        <InputField label="Description" :value="plan.description" @update="updatePricingPlan(+index, 'description', $event)" placeholder="Pour les petites équipes" size="sm" />
                        <div class="mt-2">
                          <div class="flex items-center justify-between mb-1">
                            <span class="text-xs text-neutral-400">Fonctionnalités</span>
                            <button @click="addPlanFeature(+index)" class="text-xs text-primary/70 hover:text-primary">+ Ajouter</button>
                          </div>
                          <div class="space-y-1">
                            <div v-for="(feature, fIndex) in (plan.features || [])" :key="fIndex" class="flex items-center gap-1">
                              <input type="text" :value="feature" @input="handlePlanFeatureInput(+index, +fIndex, $event)" class="input-field flex-1 text-xs py-1" />
                              <button @click="removePlanFeature(+index, +fIndex)" class="text-red-400/70 hover:text-red-300 p-0.5"><TrashIcon class="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Toggle (mensuel/annuel) -->
              <template v-else-if="section.content?.layout === 'toggle'">
                <div class="grid grid-cols-2 gap-3 mt-3">
                  <InputField label="Label mensuel" :value="section.content?.monthlyLabel" @update="updateContent('monthlyLabel', $event)" placeholder="Mensuel" />
                  <InputField label="Label annuel" :value="section.content?.yearlyLabel" @update="updateContent('yearlyLabel', $event)" placeholder="Annuel" />
                </div>
                <SliderField 
                  label="Réduction annuelle (%)"
                  :min="0" :max="50" :step="5"
                  :value="section.content?.yearlyDiscount || 20"
                  @update="updateContent('yearlyDiscount', $event)"
                />
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-3">
                    <span class="field-label">Plans</span>
                    <button @click="addPricingPlan" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-3">
                    <div v-for="(plan, index) in (section.content?.plans || [])" :key="index" class="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700/50">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-medium text-neutral-200">{{ plan.name || 'Plan ' + (+index + 1) }}</span>
                        <button @click="removePricingPlan(+index)" class="text-red-400 hover:text-red-300 p-1"><TrashIcon class="w-3.5 h-3.5" /></button>
                      </div>
                      <div class="space-y-2">
                        <InputField label="Nom" :value="plan.name" @update="updatePricingPlan(+index, 'name', $event)" placeholder="Pro" size="sm" />
                        <div class="grid grid-cols-2 gap-2">
                          <InputField label="Prix mensuel" :value="plan.monthlyPrice" @update="updatePricingPlan(+index, 'monthlyPrice', $event)" placeholder="29€" size="sm" />
                          <InputField label="Prix annuel" :value="plan.yearlyPrice" @update="updatePricingPlan(+index, 'yearlyPrice', $event)" placeholder="290€" size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Minimal -->
              <template v-else-if="section.content?.layout === 'minimal'">
                <div class="grid grid-cols-2 gap-3">
                  <InputField label="Prix" :value="section.content?.price" @update="updateContent('price', $event)" placeholder="19€" />
                  <InputField label="Période" :value="section.content?.period" @update="updateContent('period', $event)" placeholder="/mois" />
                </div>
              </template>
              
              <!-- Enterprise -->
              <template v-else-if="section.content?.layout === 'enterprise'">
                <InputField label="Texte prix" :value="section.content?.priceText" @update="updateContent('priceText', $event)" placeholder="Sur mesure" />
                <InputField label="Description" :value="section.content?.description" @update="updateContent('description', $event)" multiline />
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="field-label">Avantages</span>
                    <button @click="addPricingFeature" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-1">
                    <div v-for="(feature, index) in (section.content?.features || [])" :key="index" class="flex items-center gap-2">
                      <input type="text" :value="feature" @input="handlePricingFeatureInput(+index, $event)" class="input-field flex-1 text-sm" />
                      <button @click="removePricingFeature(+index)" class="text-red-400 hover:text-red-300 p-1"><TrashIcon class="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Lifetime -->
              <template v-else-if="section.content?.layout === 'lifetime'">
                <div class="grid grid-cols-2 gap-3">
                  <InputField label="Prix lifetime" :value="section.content?.price" @update="updateContent('price', $event)" placeholder="299€" />
                  <InputField label="Prix barré" :value="section.content?.originalPrice" @update="updateContent('originalPrice', $event)" placeholder="599€" />
                </div>
                <InputField label="Badge" :value="section.content?.badge" @update="updateContent('badge', $event)" placeholder="-50%" />
                <InputField label="Description" :value="section.content?.description" @update="updateContent('description', $event)" multiline />
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="field-label">Inclus</span>
                    <button @click="addPricingFeature" class="text-xs text-primary hover:text-primary/80 font-medium">+ Ajouter</button>
                  </div>
                  <div class="space-y-1">
                    <div v-for="(feature, index) in (section.content?.features || [])" :key="index" class="flex items-center gap-2">
                      <input type="text" :value="feature" @input="handlePricingFeatureInput(+index, $event)" class="input-field flex-1 text-sm" />
                      <button @click="removePricingFeature(+index)" class="text-red-400 hover:text-red-300 p-1"><TrashIcon class="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Default (ancien format) -->
              <template v-else>
                <div class="grid grid-cols-2 gap-3">
                  <InputField label="Prix" :value="section.content?.price" @update="updateContent('price', $event)" placeholder="99€" />
                  <InputField label="Période" :value="section.content?.period" @update="updateContent('period', $event)" placeholder="/mois" />
                </div>
                <InputField label="Description" :value="section.content?.description" @update="updateContent('description', $event)" multiline />
              </template>
            </template>

            <!-- Gallery -->
            <template v-else-if="section.type === 'gallery'">
              <SelectField 
                label="Colonnes"
                :options="columnsOptions"
                :value="String(section.content?.columns || 3)"
                @update="updateContent('columns', Number($event))"
              />
            </template>

            <!-- Video -->
            <template v-else-if="section.type === 'video'">
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" placeholder="Optionnel" />
              <InputField label="URL de la vidéo" :value="section.content?.url" @update="updateContent('url', $event)" placeholder="YouTube ou Vimeo" />
              <InputField label="Description" :value="section.content?.description" @update="updateContent('description', $event)" placeholder="Optionnel" multiline />
            </template>

            <!-- Countdown -->
            <template v-else-if="section.type === 'countdown'">
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" />
              <InputField label="Sous-titre" :value="section.content?.subtitle" @update="updateContent('subtitle', $event)" />
              <div class="mt-4">
                <span class="field-label mb-2 block">Date de fin</span>
                <input 
                  type="datetime-local"
                  :value="formatDateTimeLocal(section.content?.endDate)"
                  @change="handleEndDateChange"
                  class="input-field"
                />
              </div>
            </template>

            <!-- Social -->
            <template v-else-if="section.type === 'social'">
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" placeholder="Suivez-nous" />
              <div class="mt-4 space-y-3">
                <span class="field-label block">Liens des réseaux</span>
                <InputField label="Facebook" :value="section.content?.links?.facebook" @update="updateSocialLink('facebook', $event)" placeholder="https://facebook.com/..." />
                <InputField label="Instagram" :value="section.content?.links?.instagram" @update="updateSocialLink('instagram', $event)" placeholder="https://instagram.com/..." />
                <InputField label="Twitter/X" :value="section.content?.links?.twitter" @update="updateSocialLink('twitter', $event)" placeholder="https://x.com/..." />
                <InputField label="YouTube" :value="section.content?.links?.youtube" @update="updateSocialLink('youtube', $event)" placeholder="https://youtube.com/..." />
                <InputField label="LinkedIn" :value="section.content?.links?.linkedin" @update="updateSocialLink('linkedin', $event)" placeholder="https://linkedin.com/..." />
              </div>
            </template>

            <!-- Divider / Spacer / Default -->
            <template v-else>
              <div class="text-center py-6 text-neutral-400 text-sm">
                Aucun contenu éditable
              </div>
            </template>
          </div>
        </template>
      </Accordion>

      <!-- BOUTON PRINCIPAL (pour hero, cta, pricing) -->
      <Accordion v-if="hasButton" :defaultOpen="false">
        <template #trigger="{ isOpen }">
          <div class="accordion-trigger">
            <span class="accordion-label">Bouton principal</span>
            <ChevronIcon :class="['accordion-chevron', isOpen && 'rotate-180']" />
          </div>
        </template>
        <template #content>
          <div class="accordion-content">
            <InputField label="Texte" :value="section.content?.button?.text" @update="updateButton('text', $event)" placeholder="Ex: Acheter maintenant" />
            <InputField label="URL" :value="section.content?.button?.url" @update="updateButton('url', $event)" placeholder="https://..." />
            <SelectField 
              label="Ouvrir dans"
              :options="targetOptions"
              :value="section.content?.button?.target || '_self'"
              @update="updateButton('target', $event)"
            />
            <div class="grid grid-cols-2">
              <ColorPickerField 
                label="Fond"
                :value="section.content?.button?.color || '#10B981'"
                @update="updateButton('color', $event)"
              />
              <ColorPickerField 
                label="Texte"
                :value="section.content?.button?.textColor || '#ffffff'"
                @update="updateButton('textColor', $event)"
              />
            </div>
            <div class="grid grid-cols-2">
              <SelectField 
                label="Taille"
                :options="buttonSizeOptions"
                :value="section.content?.button?.size || 'medium'"
                @update="updateButton('size', $event)"
              />
              <SelectField 
                label="Largeur"
                :options="buttonWidthOptions"
                :value="section.content?.button?.width || 'auto'"
                @update="updateButton('width', $event)"
              />
            </div>
            <SelectField 
              label="Effet hover"
              :options="hoverEffectOptions"
              :value="section.content?.button?.hoverEffect || 'none'"
              @update="updateButton('hoverEffect', $event)"
            />
            <SegmentedControl 
              label="Alignement"
              :options="alignmentOptions"
              :value="section.content?.button?.alignment || 'center'"
              @update="updateButton('alignment', $event)"
            />
          </div>
        </template>
      </Accordion>

      <!-- APPARENCE -->
      <Accordion :defaultOpen="false">
        <template #trigger="{ isOpen }">
          <div class="accordion-trigger">
            <span class="accordion-label">Apparence</span>
            <ChevronIcon :class="['accordion-chevron', isOpen && 'rotate-180']" />
          </div>
        </template>
        <template #content>
          <div class="accordion-content">
            <SelectField 
              label="Type de fond"
              :options="backgroundTypeOptions"
              :value="section.style?.backgroundType || 'color'"
              @update="updateStyle('backgroundType', $event)"
            />
            
            <!-- Couleur de fond -->
            <ColorPickerField 
              v-if="(section.style?.backgroundType || 'color') === 'color'"
              label="Couleur de fond"
              :value="section.style?.backgroundColor || '#ffffff'"
              @update="updateStyle('backgroundColor', $event)"
            />
            
            <!-- Dégradé -->
            <InputField 
              v-if="section.style?.backgroundType === 'gradient'"
              label="Dégradé CSS"
              :value="section.style?.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'"
              @update="updateStyle('backgroundGradient', $event)"
              placeholder="linear-gradient(...)"
            />
            
            <!-- Image de fond -->
            <template v-if="section.style?.backgroundType === 'image'">
              <InputField 
                label="URL image de fond"
                :value="section.style?.backgroundImage || ''"
                @update="updateStyle('backgroundImage', $event)"
                placeholder="https://..."
              />
              <SliderField 
                label="Superposition sombre"
                :value="section.style?.backgroundOverlay || 0"
                :min="0"
                :max="100"
                suffix="%"
                @update="updateStyle('backgroundOverlay', $event)"
              />
            </template>
            
            <SelectField 
              label="Hauteur section"
              :options="heightOptions"
              :value="section.style?.height || 'auto'"
              @update="updateStyle('height', $event)"
            />
            
            <div class="grid grid-cols-2">
              <SelectField 
                label="Espacement vertical"
                :options="spacingOptions"
                :value="section.style?.verticalSpacing || 'large'"
                @update="updateStyle('verticalSpacing', $event)"
              />
              <SelectField 
                label="Espacement horizontal"
                :options="spacingOptions"
                :value="section.style?.horizontalSpacing || 'medium'"
                @update="updateStyle('horizontalSpacing', $event)"
              />
            </div>
          </div>
        </template>
      </Accordion>

      <!-- TYPOGRAPHIE -->
      <Accordion :defaultOpen="false">
        <template #trigger="{ isOpen }">
          <div class="accordion-trigger">
            <span class="accordion-label">Typographie</span>
            <ChevronIcon :class="['accordion-chevron', isOpen && 'rotate-180']" />
          </div>
        </template>
        <template #content>
          <div class="accordion-content">
            <SelectField 
              label="Police titre"
              :options="fontOptions"
              :value="section.typography?.titleFont || 'system'"
              @update="updateTypography('titleFont', $event)"
            />
            <div class="grid grid-cols-2">
              <SelectField 
                label="Taille titre"
                :options="titleSizeOptions"
                :value="section.typography?.titleSize || 'medium'"
                @update="updateTypography('titleSize', $event)"
              />
              <SelectField 
                label="Poids titre"
                :options="weightOptions"
                :value="section.typography?.titleWeight || '700'"
                @update="updateTypography('titleWeight', $event)"
              />
            </div>
            <ColorPickerField 
              label="Couleur titre"
              :value="section.typography?.titleColor || section.style?.textColor || '#171717'"
              :showAuto="true"
              @update="updateTypography('titleColor', $event)"
            />
            <div class="grid grid-cols-2">
              <SelectField 
                label="Espacement lettres"
                :options="letterSpacingOptions"
                :value="section.typography?.titleLetterSpacing || 'normal'"
                @update="updateTypography('titleLetterSpacing', $event)"
              />
              <SelectField 
                label="Transformation"
                :options="transformOptions"
                :value="section.typography?.titleTransform || 'none'"
                @update="updateTypography('titleTransform', $event)"
              />
            </div>
            <SelectField 
              label="Interligne"
              :options="lineHeightOptions"
              :value="section.typography?.titleLineHeight || 'normal'"
              @update="updateTypography('titleLineHeight', $event)"
            />
            
            <!-- Sous-titre -->
            <div class="border-t border-neutral-200 mt-3 pt-3">
              <span class="field-label block mb-2" style="color: #737373; font-size: 10px;">SOUS-TITRE</span>
              <SelectField 
                label="Police"
                :options="subtitleFontOptions"
                :value="section.typography?.subtitleFont || 'same'"
                @update="updateTypography('subtitleFont', $event)"
              />
              <div class="grid grid-cols-2">
                <SelectField 
                  label="Taille sous-titre"
                  :options="subtitleSizeOptions"
                  :value="section.typography?.subtitleSize || 'medium'"
                  @update="updateTypography('subtitleSize', $event)"
                />
                <SliderField 
                  label="Opacité"
                  :value="section.typography?.subtitleOpacity ?? 80"
                  :min="0"
                  :max="100"
                  suffix="%"
                  @update="updateTypography('subtitleOpacity', $event)"
                />
              </div>
              <ColorPickerField 
                label="Couleur"
                :value="section.typography?.subtitleColor || section.style?.textColor || '#171717'"
                :showAuto="true"
                @update="updateTypography('subtitleColor', $event)"
              />
            </div>
          </div>
        </template>
      </Accordion>

      <!-- ANIMATION -->
      <Accordion :defaultOpen="false">
        <template #trigger="{ isOpen }">
          <div class="accordion-trigger">
            <span class="accordion-label">Animation</span>
            <ChevronIcon :class="['accordion-chevron', isOpen && 'rotate-180']" />
          </div>
        </template>
        <template #content>
          <div class="accordion-content">
            <SelectField 
              label="Animation d'entrée"
              :options="animationOptions"
              :value="section.animation?.type || 'none'"
              @update="updateAnimation('type', $event)"
            />
            <div class="grid grid-cols-2">
              <NumberField 
                label="Durée animation"
                :value="section.animation?.duration || 500"
                :min="0"
                :max="3000"
                :step="50"
                suffix="ms"
                @update="updateAnimation('duration', $event)"
              />
              <NumberField 
                label="Délai animation"
                :value="section.animation?.delay || 0"
                :min="0"
                :max="2000"
                :step="50"
                suffix="ms"
                @update="updateAnimation('delay', $event)"
              />
            </div>
            <CheckboxField 
              label="Animer au scroll"
              :value="section.animation?.scrollTrigger || false"
              @update="updateAnimation('scrollTrigger', $event)"
            />
          </div>
        </template>
      </Accordion>

      <!-- AVANCÉ -->
      <Accordion :defaultOpen="false">
        <template #trigger="{ isOpen }">
          <div class="accordion-trigger">
            <span class="accordion-label">Avancé</span>
            <ChevronIcon :class="['accordion-chevron', isOpen && 'rotate-180']" />
          </div>
        </template>
        <template #content>
          <div class="accordion-content">
            <div class="grid grid-cols-2">
              <SelectField 
                label="Espacement éléments"
                :options="elementSpacingOptions"
                :value="section.advanced?.elementSpacing || 'medium'"
                @update="updateAdvanced('elementSpacing', $event)"
              />
              <SelectField 
                label="Alignement vertical"
                :options="verticalAlignOptions"
                :value="section.advanced?.verticalAlign || 'center'"
                @update="updateAdvanced('verticalAlign', $event)"
              />
            </div>
            <InputField 
              label="ID CSS (ancre)"
              :value="section.advanced?.cssId || ''"
              @update="updateAdvanced('cssId', $event)"
              placeholder="hero-section"
            />
            <InputField 
              label="Classes CSS"
              :value="section.advanced?.cssClasses || ''"
              @update="updateAdvanced('cssClasses', $event)"
              placeholder="my-class another-class"
            />
          </div>
        </template>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, h, defineComponent } from 'vue'

// Type local
interface PageSection {
  id: string
  type: string
  template: string
  order: number
  content: Record<string, any>
  style: Record<string, any>
  typography?: Record<string, any>
  animation?: Record<string, any>
  advanced?: Record<string, any>
}

// Props & Emits
const props = defineProps<{
  section: PageSection
}>()

const emit = defineEmits<{
  'update:content': [content: Record<string, any>]
  'update:style': [style: Record<string, any>]
  'update:typography': [typography: Record<string, any>]
  'update:animation': [animation: Record<string, any>]
  'update:advanced': [advanced: Record<string, any>]
}>()

// Computed
const hasButton = computed(() => ['hero', 'cta', 'pricing'].includes(props.section.type))

// Options
const alignmentOptions = [
  { value: 'left', label: 'Gauche' },
  { value: 'center', label: 'Centre' },
  { value: 'right', label: 'Droite' }
]

const widthOptions = [
  { value: '600px', label: 'Étroit (600px)' },
  { value: '800px', label: 'Moyen (800px)' },
  { value: '1024px', label: 'Grande (1024px)' },
  { value: '1280px', label: 'Très large (1280px)' },
  { value: '100%', label: 'Pleine largeur' }
]

const columnsOptions = [
  { value: '2', label: '2 colonnes' },
  { value: '3', label: '3 colonnes' },
  { value: '4', label: '4 colonnes' }
]

const targetOptions = [
  { value: '_self', label: 'Même onglet' },
  { value: '_blank', label: 'Nouvel onglet' }
]

const buttonSizeOptions = [
  { value: 'small', label: 'Petit' },
  { value: 'medium', label: 'Moyen' },
  { value: 'large', label: 'Grand' }
]

const buttonWidthOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'full', label: 'Pleine largeur' }
]

const hoverEffectOptions = [
  { value: 'none', label: 'Aucun' },
  { value: 'lift', label: 'Élévation' },
  { value: 'glow', label: 'Brillance' },
  { value: 'scale', label: 'Zoom' }
]

const backgroundTypeOptions = [
  { value: 'color', label: 'Couleur' },
  { value: 'gradient', label: 'Dégradé' },
  { value: 'image', label: 'Image' }
]

const heightOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'small', label: 'Petit' },
  { value: 'medium', label: 'Moyen' },
  { value: 'large', label: 'Grand' },
  { value: 'full', label: 'Plein écran' }
]

const spacingOptions = [
  { value: 'none', label: 'Aucun' },
  { value: 'small', label: 'Petit' },
  { value: 'medium', label: 'Moyen' },
  { value: 'large', label: 'Grand' }
]

const fontOptions = [
  { value: 'system', label: 'Par défaut (System)' },
  { value: 'inter', label: 'Inter' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'montserrat', label: 'Montserrat' }
]

const titleSizeOptions = [
  { value: 'small', label: 'Petit' },
  { value: 'medium', label: 'Moyen' },
  { value: 'large', label: 'Grand' },
  { value: 'xlarge', label: 'Très grand' }
]

const weightOptions = [
  { value: '400', label: 'Normal (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semi-gras (600)' },
  { value: '700', label: 'Gras (700)' },
  { value: '800', label: 'Extra-gras (800)' }
]

const letterSpacingOptions = [
  { value: 'tight', label: 'Serré' },
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Large' }
]

const transformOptions = [
  { value: 'none', label: 'Aucune' },
  { value: 'uppercase', label: 'MAJUSCULES' },
  { value: 'lowercase', label: 'minuscules' },
  { value: 'capitalize', label: 'Capitalisé' }
]

const lineHeightOptions = [
  { value: 'tight', label: 'Serré (1.1)' },
  { value: 'normal', label: 'Normal (1.3)' },
  { value: 'relaxed', label: 'Aéré (1.5)' }
]

const subtitleFontOptions = [
  { value: 'same', label: 'Comme le titre' },
  { value: 'system', label: 'Système' }
]

const subtitleSizeOptions = [
  { value: 'small', label: 'Petit' },
  { value: 'medium', label: 'Moyen' },
  { value: 'large', label: 'Grand' }
]

const animationOptions = [
  { value: 'none', label: 'Aucune' },
  { value: 'fade', label: 'Fondu' },
  { value: 'slide-up', label: 'Glissement haut' },
  { value: 'slide-down', label: 'Glissement bas' },
  { value: 'slide-left', label: 'Glissement gauche' },
  { value: 'slide-right', label: 'Glissement droite' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'bounce', label: 'Rebond' }
]

const elementSpacingOptions = [
  { value: 'none', label: 'Aucun' },
  { value: 'small', label: 'Petit' },
  { value: 'medium', label: 'Moyen' },
  { value: 'large', label: 'Grand' }
]

const verticalAlignOptions = [
  { value: 'top', label: 'Haut' },
  { value: 'center', label: 'Centre' },
  { value: 'bottom', label: 'Bas' }
]

// Update functions
const updateContent = (key: string, value: any) => {
  emit('update:content', { [key]: value })
}

const updateButton = (key: string, value: any) => {
  const currentButton = props.section.content?.button || {}
  emit('update:content', { button: { ...currentButton, [key]: value } })
}

const updateStyle = (key: string, value: any) => {
  emit('update:style', { [key]: value })
}

const updateTypography = (key: string, value: any) => {
  emit('update:typography', { [key]: value })
}

const updateAnimation = (key: string, value: any) => {
  emit('update:animation', { [key]: value })
}

const updateAdvanced = (key: string, value: any) => {
  emit('update:advanced', { [key]: value })
}

// Helpers
const formatDateTimeLocal = (dateStr: string | undefined): string => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toISOString().slice(0, 16)
  } catch {
    return ''
  }
}

const handleEndDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:content', { endDate: target.value })
}

const updateSocialLink = (platform: string, value: string) => {
  const currentLinks = props.section.content?.links || {}
  emit('update:content', { links: { ...currentLinks, [platform]: value } })
}

// Item handlers
const addFeatureItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ icon: 'check', title: 'Nouveau', description: 'Description' })
  emit('update:content', { items })
}

const updateFeatureItem = (index: number, key: string, value: string) => {
  const items = [...(props.section.content?.items || [])]
  items[index] = { ...items[index], [key]: value }
  emit('update:content', { items })
}

const removeFeatureItem = (index: number) => {
  const items = [...(props.section.content?.items || [])]
  items.splice(index, 1)
  emit('update:content', { items })
}

const addTestimonialItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ text: 'Avis client...', name: 'Nom', role: 'Client' })
  emit('update:content', { items })
}

const updateTestimonialItem = (index: number, key: string, value: string) => {
  const items = [...(props.section.content?.items || [])]
  items[index] = { ...items[index], [key]: value }
  emit('update:content', { items })
}

const removeTestimonialItem = (index: number) => {
  const items = [...(props.section.content?.items || [])]
  items.splice(index, 1)
  emit('update:content', { items })
}

// === TESTIMONIALS HANDLERS ===

// Stats for split layout
const addTestimonialStat = () => {
  const stats = [...(props.section.content?.stats || [])]
  stats.push({ value: '+25%', label: 'Amélioration' })
  emit('update:content', { stats })
}

const updateTestimonialStat = (index: number, key: string, value: string) => {
  const stats = [...(props.section.content?.stats || [])]
  stats[index] = { ...stats[index], [key]: value }
  emit('update:content', { stats })
}

const removeTestimonialStat = (index: number) => {
  const stats = [...(props.section.content?.stats || [])]
  stats.splice(index, 1)
  emit('update:content', { stats })
}

// Metrics for featured layout
const addTestimonialMetric = () => {
  const metrics = [...(props.section.content?.metrics || [])]
  metrics.push({ value: '2x', label: 'Croissance' })
  emit('update:content', { metrics })
}

const updateTestimonialMetric = (index: number, key: string, value: string) => {
  const metrics = [...(props.section.content?.metrics || [])]
  metrics[index] = { ...metrics[index], [key]: value }
  emit('update:content', { metrics })
}

const removeTestimonialMetric = (index: number) => {
  const metrics = [...(props.section.content?.metrics || [])]
  metrics.splice(index, 1)
  emit('update:content', { metrics })
}

// Quote layout (single item)
const updateQuoteItem = (key: string, value: any) => {
  const items = [...(props.section.content?.items || [])]
  if (items.length > 0) {
    items[0] = { ...items[0], [key]: value }
  } else {
    items.push({ [key]: value })
  }
  emit('update:content', { items })
}

// Tweets layout
const addTweetItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ name: 'Utilisateur', username: '@user', text: 'Tweet...', avatar: '', platform: 'twitter' })
  emit('update:content', { items })
}

const updateTweetItem = (index: number, key: string, value: string) => {
  const items = [...(props.section.content?.items || [])]
  items[index] = { ...items[index], [key]: value }
  emit('update:content', { items })
}

const removeTweetItem = (index: number) => {
  const items = [...(props.section.content?.items || [])]
  items.splice(index, 1)
  emit('update:content', { items })
}

// Avatars layout CTA
const updateTestimonialsCta = (key: string, value: any) => {
  const currentCta = props.section.content?.cta || {}
  emit('update:content', { cta: { ...currentCta, [key]: value } })
}

const addFaqItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ question: 'Nouvelle question ?', answer: 'Réponse...' })
  emit('update:content', { items })
}

const updateFaqItem = (index: number, key: string, value: string) => {
  const items = [...(props.section.content?.items || [])]
  items[index] = { ...items[index], [key]: value }
  emit('update:content', { items })
}

const removeFaqItem = (index: number) => {
  const items = [...(props.section.content?.items || [])]
  items.splice(index, 1)
  emit('update:content', { items })
}

// === HERO HANDLERS ===

// Slider handlers
const addSlide = () => {
  const slides = [...(props.section.content?.slides || [])]
  slides.push({
    title: 'Nouveau slide',
    subtitle: 'Description du slide',
    image: '',
    button: { text: 'Action', url: '#' }
  })
  emit('update:content', { slides })
}

const updateSlide = (index: number, key: string, value: any) => {
  const slides = [...(props.section.content?.slides || [])]
  slides[index] = { ...slides[index], [key]: value }
  emit('update:content', { slides })
}

const updateSlideButton = (index: number, key: string, value: any) => {
  const slides = [...(props.section.content?.slides || [])]
  const currentButton = slides[index]?.button || {}
  slides[index] = { ...slides[index], button: { ...currentButton, [key]: value } }
  emit('update:content', { slides })
}

const removeSlide = (index: number) => {
  const slides = [...(props.section.content?.slides || [])]
  slides.splice(index, 1)
  emit('update:content', { slides })
}

// Secondary button handler
const updateSecondaryButton = (key: string, value: any) => {
  const currentButton = props.section.content?.secondaryButton || {}
  emit('update:content', { secondaryButton: { ...currentButton, [key]: value } })
}

// Product features handlers
const addProductFeature = () => {
  const features = [...(props.section.content?.features || [])]
  features.push('Nouvelle fonctionnalit\u00e9')
  emit('update:content', { features })
}

const updateProductFeature = (index: number, value: string) => {
  const features = [...(props.section.content?.features || [])]
  features[index] = value
  emit('update:content', { features })
}

const removeProductFeature = (index: number) => {
  const features = [...(props.section.content?.features || [])]
  features.splice(index, 1)
  emit('update:content', { features })
}

// Stats handlers
const addStat = () => {
  const stats = [...(props.section.content?.stats || [])]
  stats.push({ value: '100+', label: 'Label' })
  emit('update:content', { stats })
}

const updateStat = (index: number, key: string, value: string) => {
  const stats = [...(props.section.content?.stats || [])]
  stats[index] = { ...stats[index], [key]: value }
  emit('update:content', { stats })
}

const removeStat = (index: number) => {
  const stats = [...(props.section.content?.stats || [])]
  stats.splice(index, 1)
  emit('update:content', { stats })
}

// Dual CTA handlers
const updateLeftCta = (key: string, value: any) => {
  const currentCta = props.section.content?.leftCta || {}
  emit('update:content', { leftCta: { ...currentCta, [key]: value } })
}

const updateLeftCtaButton = (key: string, value: any) => {
  const currentCta = props.section.content?.leftCta || {}
  const currentButton = currentCta.button || {}
  emit('update:content', { leftCta: { ...currentCta, button: { ...currentButton, [key]: value } } })
}

const updateRightCta = (key: string, value: any) => {
  const currentCta = props.section.content?.rightCta || {}
  emit('update:content', { rightCta: { ...currentCta, [key]: value } })
}

const updateRightCtaButton = (key: string, value: any) => {
  const currentCta = props.section.content?.rightCta || {}
  const currentButton = currentCta.button || {}
  emit('update:content', { rightCta: { ...currentCta, button: { ...currentButton, [key]: value } } })
}

// Countdown handler
const handleLaunchDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:content', { launchDate: new Date(target.value).toISOString() })
}

// === FEATURES HANDLERS ===

// Timeline/Process steps
const addTimelineStep = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ step: items.length + 1, title: 'Nouvelle \u00e9tape', description: 'Description de l\'\u00e9tape' })
  emit('update:content', { items })
}

const addProcessStep = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ step: items.length + 1, title: 'Processus', description: 'Description' })
  emit('update:content', { items })
}

// Comparison
const updateComparisonColumn = (side: 'left' | 'right', key: string, value: any) => {
  const columnKey = side === 'left' ? 'leftColumn' : 'rightColumn'
  const currentColumn = props.section.content?.[columnKey] || {}
  emit('update:content', { [columnKey]: { ...currentColumn, [key]: value } })
}

const addComparisonItem = (side: 'left' | 'right') => {
  const columnKey = side === 'left' ? 'leftColumn' : 'rightColumn'
  const currentColumn = props.section.content?.[columnKey] || { items: [] }
  const items = [...(currentColumn.items || [])]
  items.push('Nouvel \u00e9l\u00e9ment')
  emit('update:content', { [columnKey]: { ...currentColumn, items } })
}

const updateComparisonItem = (side: 'left' | 'right', index: number, value: string) => {
  const columnKey = side === 'left' ? 'leftColumn' : 'rightColumn'
  const currentColumn = props.section.content?.[columnKey] || { items: [] }
  const items = [...(currentColumn.items || [])]
  items[index] = value
  emit('update:content', { [columnKey]: { ...currentColumn, items } })
}

const removeComparisonItem = (side: 'left' | 'right', index: number) => {
  const columnKey = side === 'left' ? 'leftColumn' : 'rightColumn'
  const currentColumn = props.section.content?.[columnKey] || { items: [] }
  const items = [...(currentColumn.items || [])]
  items.splice(index, 1)
  emit('update:content', { [columnKey]: { ...currentColumn, items } })
}

// Stats Features (for stats layout)
const addStatsFeature = () => {
  const features = [...(props.section.content?.features || [])]
  features.push({ icon: 'check', title: 'Feature', description: 'Description' })
  emit('update:content', { features })
}

const updateStatsFeature = (index: number, key: string, value: string) => {
  const features = [...(props.section.content?.features || [])]
  features[index] = { ...features[index], [key]: value }
  emit('update:content', { features })
}

const removeStatsFeature = (index: number) => {
  const features = [...(props.section.content?.features || [])]
  features.splice(index, 1)
  emit('update:content', { features })
}

// Alternating items
const addAlternatingItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ 
    title: 'Nouvelle section', 
    description: 'Description de la section',
    image: '',
    button: { text: 'En savoir plus', url: '#' }
  })
  emit('update:content', { items })
}

const updateAlternatingItem = (index: number, key: string, value: any) => {
  const items = [...(props.section.content?.items || [])]
  items[index] = { ...items[index], [key]: value }
  emit('update:content', { items })
}

const updateAlternatingItemButton = (index: number, key: string, value: any) => {
  const items = [...(props.section.content?.items || [])]
  const currentButton = items[index]?.button || {}
  items[index] = { ...items[index], button: { ...currentButton, [key]: value } }
  emit('update:content', { items })
}

const removeAlternatingItem = (index: number) => {
  const items = [...(props.section.content?.items || [])]
  items.splice(index, 1)
  emit('update:content', { items })
}

// Showcase features (string array)
const addShowcaseFeature = () => {
  const features = [...(props.section.content?.features || [])]
  features.push('Nouvelle fonctionnalit\u00e9')
  emit('update:content', { features })
}

const updateShowcaseFeature = (index: number, value: string) => {
  const features = [...(props.section.content?.features || [])]
  features[index] = value
  emit('update:content', { features })
}

const removeShowcaseFeature = (index: number) => {
  const features = [...(props.section.content?.features || [])]
  features.splice(index, 1)
  emit('update:content', { features })
}

// Tabs
const addTab = () => {
  const tabs = [...(props.section.content?.tabs || [])]
  tabs.push({ 
    id: `tab${tabs.length + 1}`,
    label: 'Nouvel onglet',
    title: 'Titre',
    description: 'Description de l\'onglet',
    image: '',
    features: []
  })
  emit('update:content', { tabs })
}

const updateTab = (index: number, key: string, value: any) => {
  const tabs = [...(props.section.content?.tabs || [])]
  tabs[index] = { ...tabs[index], [key]: value }
  emit('update:content', { tabs })
}

const removeTab = (index: number) => {
  const tabs = [...(props.section.content?.tabs || [])]
  tabs.splice(index, 1)
  emit('update:content', { tabs })
}

// Bento Grid
const addBentoItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ icon: 'zap', title: 'Nouveau', description: 'Description', size: 'small' })
  emit('update:content', { items })
}

// Checklist (string items)
const addChecklistItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push('Nouvel \u00e9l\u00e9ment')
  emit('update:content', { items })
}

const updateChecklistItem = (index: number, value: string) => {
  const items = [...(props.section.content?.items || [])]
  items[index] = value
  emit('update:content', { items })
}

const removeChecklistItem = (index: number) => {
  const items = [...(props.section.content?.items || [])]
  items.splice(index, 1)
  emit('update:content', { items })
}

// Bento size options
const bentoSizeOptions = [
  { value: 'small', label: 'Petit (1x1)' },
  { value: 'medium', label: 'Moyen (2x1)' },
  { value: 'large', label: 'Grand (2x2)' }
]

// Icon options for features
const iconOptions = [
  { value: 'zap', label: 'Éclair' },
  { value: 'shield', label: 'Bouclier' },
  { value: 'star', label: 'Étoile' },
  { value: 'check', label: 'Check' },
  { value: 'box', label: 'Bo\u00eete' },
  { value: 'layers', label: 'Calques' },
  { value: 'globe', label: 'Globe' },
  { value: 'settings', label: 'Param\u00e8tres' },
  { value: 'truck', label: 'Camion' },
  { value: 'refresh', label: 'Rafra\u00eechir' },
  { value: 'lock', label: 'Cadenas' },
  { value: 'headphones', label: 'Casque' },
  { value: 'search', label: 'Recherche' },
  { value: 'heart', label: 'Coeur' },
  { value: 'clock', label: 'Horloge' },
  { value: 'mail', label: 'Email' },
  { value: 'phone', label: 'T\u00e9l\u00e9phone' },
  { value: 'user', label: 'Utilisateur' }
]

// Image position options
const imagePositionOptions = [
  { value: 'left', label: 'Gauche' },
  { value: 'right', label: 'Droite' }
]

// Wall columns options (testimonials)
const wallColumnsOptions = [
  { value: '2', label: '2 colonnes' },
  { value: '3', label: '3 colonnes' },
  { value: '4', label: '4 colonnes' }
]

// === PRICING HANDLERS ===

// Single plan features
const addPricingFeature = () => {
  const features = [...(props.section.content?.features || [])]
  features.push('Nouvelle fonctionnalité')
  emit('update:content', { features })
}

const updatePricingFeature = (index: number, value: string) => {
  const features = [...(props.section.content?.features || [])]
  features[index] = value
  emit('update:content', { features })
}

const handlePricingFeatureInput = (index: number, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  updatePricingFeature(index, value)
}

const removePricingFeature = (index: number) => {
  const features = [...(props.section.content?.features || [])]
  features.splice(index, 1)
  emit('update:content', { features })
}

// Multi-plan management
const addPricingPlan = () => {
  const plans = [...(props.section.content?.plans || [])]
  plans.push({
    name: 'Nouveau plan',
    price: '29€',
    period: '/mois',
    description: 'Description du plan',
    features: ['Fonctionnalité 1', 'Fonctionnalité 2'],
    popular: false
  })
  emit('update:content', { plans })
}

const updatePricingPlan = (index: number, key: string, value: any) => {
  const plans = [...(props.section.content?.plans || [])]
  plans[index] = { ...plans[index], [key]: value }
  emit('update:content', { plans })
}

const removePricingPlan = (index: number) => {
  const plans = [...(props.section.content?.plans || [])]
  plans.splice(index, 1)
  emit('update:content', { plans })
}

// Plan features
const addPlanFeature = (planIndex: number) => {
  const plans = [...(props.section.content?.plans || [])]
  const features = [...(plans[planIndex]?.features || [])]
  features.push('Nouvelle fonctionnalité')
  plans[planIndex] = { ...plans[planIndex], features }
  emit('update:content', { plans })
}

const updatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
  const plans = [...(props.section.content?.plans || [])]
  const features = [...(plans[planIndex]?.features || [])]
  features[featureIndex] = value
  plans[planIndex] = { ...plans[planIndex], features }
  emit('update:content', { plans })
}

const handlePlanFeatureInput = (planIndex: number, featureIndex: number, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  updatePlanFeature(planIndex, featureIndex, value)
}

const removePlanFeature = (planIndex: number, featureIndex: number) => {
  const plans = [...(props.section.content?.plans || [])]
  const features = [...(plans[planIndex]?.features || [])]
  features.splice(featureIndex, 1)
  plans[planIndex] = { ...plans[planIndex], features }
  emit('update:content', { plans })
}

// === CTA HANDLERS ===

// CTA countdown date
const handleCtaEndDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:content', { endDate: new Date(target.value).toISOString() })
}

// CTA Stats (social-proof layout)
const addCtaStat = () => {
  const stats = [...(props.section.content?.stats || [])]
  stats.push({ value: '0', label: 'Label' })
  emit('update:content', { stats })
}

const updateCtaStat = (index: number, key: string, value: string) => {
  const stats = [...(props.section.content?.stats || [])]
  stats[index] = { ...stats[index], [key]: value }
  emit('update:content', { stats })
}

const removeCtaStat = (index: number) => {
  const stats = [...(props.section.content?.stats || [])]
  stats.splice(index, 1)
  emit('update:content', { stats })
}

// Section labels & icons
const getSectionLabel = (type: string) => {
  const labels: Record<string, string> = {
    hero: 'Hero Section',
    features: 'Caractéristiques',
    testimonials: 'Témoignages',
    cta: 'Appel à l\'action',
    text: 'Texte',
    image: 'Image',
    gallery: 'Galerie',
    video: 'Vidéo',
    faq: 'FAQ',
    contact: 'Contact',
    pricing: 'Tarification',
    countdown: 'Compte à rebours',
    social: 'Réseaux sociaux',
    divider: 'Séparateur',
    spacer: 'Espace'
  }
  return labels[type] || type
}

const getSectionIcon = (type: string) => {
  const icons: Record<string, any> = {
    hero: HeroIcon,
    features: FeaturesIcon,
    testimonials: TestimonialsIcon,
    cta: CtaIcon,
    text: TextIcon,
    image: ImageIcon,
    gallery: ImageIcon,
    video: VideoIcon,
    faq: FaqIcon,
    contact: ContactIcon,
    pricing: PricingIcon,
    countdown: ClockIcon,
    social: ShareIcon,
    divider: DividerIcon,
    spacer: SpacerIcon
  }
  return icons[type] || TextIcon
}
</script>

<!-- Sub-components -->
<script lang="ts">
// Accordion
const Accordion = defineComponent({
  props: { defaultOpen: { type: Boolean, default: false } },
  setup(props, { slots }) {
    const isOpen = ref(props.defaultOpen)
    return () => h('div', { class: 'accordion' }, [
      h('button', { class: 'w-full', onClick: () => { isOpen.value = !isOpen.value } }, 
        slots.trigger?.({ isOpen: isOpen.value })),
      isOpen.value && slots.content?.()
    ])
  }
})

// ChevronIcon
const ChevronIcon = defineComponent({
  setup(_, { attrs }) {
    return () => h('svg', { class: ['w-4 h-4 transition-transform', attrs.class], fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 9l-7 7-7-7' })
    ])
  }
})

// InputField
const InputField = defineComponent({
  props: { label: String, value: String, placeholder: String, type: { type: String, default: 'text' }, multiline: Boolean, rows: { type: Number, default: 3 } },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('div', { class: 'mb-3' }, [
      h('label', { class: 'field-label mb-2 block' }, props.label),
      props.multiline
        ? h('textarea', { value: props.value || '', onInput: (e: Event) => emit('update', (e.target as HTMLTextAreaElement).value), rows: props.rows, placeholder: props.placeholder, class: 'input-field resize-none' })
        : h('input', { type: props.type, value: props.value || '', onInput: (e: Event) => emit('update', (e.target as HTMLInputElement).value), placeholder: props.placeholder, class: 'input-field' })
    ])
  }
})

// SelectField
const SelectField = defineComponent({
  props: { label: String, options: { type: Array as () => { value: string; label: string }[], default: () => [] }, value: String },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('div', { class: 'mb-3' }, [
      h('label', { class: 'field-label mb-2 block' }, props.label),
      h('select', { value: props.value, onChange: (e: Event) => emit('update', (e.target as HTMLSelectElement).value), class: 'select-field' },
        props.options.map((opt: { value: string; label: string }) => h('option', { value: opt.value }, opt.label)))
    ])
  }
})

// SegmentedControl
const SegmentedControl = defineComponent({
  props: { label: String, options: { type: Array as () => { value: string; label: string }[], default: () => [] }, value: String },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('div', { class: 'mb-3' }, [
      h('label', { class: 'field-label mb-2 block' }, props.label),
      h('div', { class: 'segmented-control' },
        props.options.map((opt: { value: string; label: string }) => h('button', {
          onClick: () => emit('update', opt.value),
          class: ['segment-btn', props.value === opt.value && 'active']
        }, opt.label)))
    ])
  }
})

// ColorPickerField
const ColorPickerField = defineComponent({
  props: { label: String, value: String, showAuto: Boolean },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('div', { class: 'mb-3' }, [
      h('label', { class: 'field-label mb-2 block' }, props.label),
      h('div', { class: 'color-picker-wrapper' }, [
        h('input', { 
          type: 'color', 
          value: props.value || '#000000', 
          onInput: (e: Event) => emit('update', (e.target as HTMLInputElement).value), 
          class: 'color-swatch' 
        }),
        h('input', { 
          type: 'text', 
          value: props.value || '', 
          onInput: (e: Event) => emit('update', (e.target as HTMLInputElement).value), 
          placeholder: '#000000',
          class: 'color-hex-input' 
        })
      ])
    ])
  }
})

// SliderField
const SliderField = defineComponent({
  props: { label: String, value: { type: Number, default: 0 }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 }, suffix: { type: String, default: '' } },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('div', { class: 'mb-3 slider-wrapper' }, [
      h('div', { class: 'slider-header' }, [
        h('label', { class: 'field-label' }, props.label),
        h('span', { class: 'slider-value' }, `${props.value}${props.suffix}`)
      ]),
      h('input', { 
        type: 'range', 
        min: props.min, 
        max: props.max, 
        value: props.value, 
        onInput: (e: Event) => emit('update', Number((e.target as HTMLInputElement).value)), 
        class: 'slider-track' 
      })
    ])
  }
})

// NumberField
const NumberField = defineComponent({
  props: { label: String, value: { type: Number, default: 0 }, min: { type: Number, default: 0 }, max: { type: Number, default: 9999 }, step: { type: Number, default: 1 }, suffix: { type: String, default: '' } },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('div', { class: 'mb-3' }, [
      h('label', { class: 'field-label mb-2 block' }, props.label),
      h('div', { class: 'number-field-wrapper' }, [
        h('input', { 
          type: 'number', 
          min: props.min, 
          max: props.max, 
          step: props.step, 
          value: props.value, 
          onInput: (e: Event) => emit('update', Number((e.target as HTMLInputElement).value)), 
          class: 'number-field' 
        }),
        h('span', { class: 'number-field-suffix' }, props.suffix)
      ])
    ])
  }
})

// CheckboxField - Toggle style
const CheckboxField = defineComponent({
  props: { label: String, value: Boolean },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('label', { class: 'toggle-wrapper' }, [
      h('div', { 
        class: ['toggle-switch', props.value && 'active'],
        onClick: () => emit('update', !props.value)
      }),
      h('span', { class: 'toggle-label' }, props.label)
    ])
  }
})

// Item Components
const FeatureItem = defineComponent({
  props: { item: Object, index: Number },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    return () => h('div', { class: 'item-card' }, [
      h('div', { class: 'flex items-center justify-between mb-2' }, [
        h('span', { class: 'text-xs font-medium text-neutral-500' }, `#${(props.index || 0) + 1}`),
        h('button', { class: 'item-delete-btn', onClick: () => emit('remove') }, 'Supprimer')
      ]),
      h('div', { class: 'flex gap-2 mb-2' }, [
        h('input', { value: props.item?.icon, onInput: (e: Event) => emit('update', props.index, 'icon', (e.target as HTMLInputElement).value), class: 'item-card-input', style: 'width: 60px; text-align: center;', placeholder: 'icon' }),
        h('input', { value: props.item?.title, onInput: (e: Event) => emit('update', props.index, 'title', (e.target as HTMLInputElement).value), placeholder: 'Titre', class: 'item-card-input flex-1' })
      ]),
      h('textarea', { value: props.item?.description, onInput: (e: Event) => emit('update', props.index, 'description', (e.target as HTMLTextAreaElement).value), rows: 2, placeholder: 'Description...', class: 'item-card-input resize-none' })
    ])
  }
})

const TestimonialItem = defineComponent({
  props: { item: Object, index: Number },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    return () => h('div', { class: 'item-card' }, [
      h('div', { class: 'flex items-center justify-between mb-2' }, [
        h('span', { class: 'text-xs font-medium text-neutral-500' }, `#${(props.index || 0) + 1}`),
        h('button', { class: 'item-delete-btn', onClick: () => emit('remove') }, 'Supprimer')
      ]),
      h('textarea', { value: props.item?.text, onInput: (e: Event) => emit('update', props.index, 'text', (e.target as HTMLTextAreaElement).value), rows: 2, placeholder: 'Témoignage...', class: 'item-card-input resize-none mb-2' }),
      h('div', { class: 'grid grid-cols-2 gap-2' }, [
        h('input', { value: props.item?.name, onInput: (e: Event) => emit('update', props.index, 'name', (e.target as HTMLInputElement).value), placeholder: 'Nom', class: 'item-card-input' }),
        h('input', { value: props.item?.role, onInput: (e: Event) => emit('update', props.index, 'role', (e.target as HTMLInputElement).value), placeholder: 'Rôle', class: 'item-card-input' })
      ])
    ])
  }
})

const FaqItem = defineComponent({
  props: { item: Object, index: Number },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    return () => h('div', { class: 'item-card' }, [
      h('div', { class: 'flex items-center justify-between mb-2' }, [
        h('span', { class: 'text-xs font-medium text-neutral-500' }, `#${(props.index || 0) + 1}`),
        h('button', { class: 'item-delete-btn', onClick: () => emit('remove') }, 'Supprimer')
      ]),
      h('input', { value: props.item?.question, onInput: (e: Event) => emit('update', props.index, 'question', (e.target as HTMLInputElement).value), placeholder: 'Question ?', class: 'item-card-input mb-2' }),
      h('textarea', { value: props.item?.answer, onInput: (e: Event) => emit('update', props.index, 'answer', (e.target as HTMLTextAreaElement).value), rows: 2, placeholder: 'Réponse...', class: 'item-card-input resize-none' })
    ])
  }
})

// Icons
const createIcon = (d: string) => defineComponent({
  setup() {
    return () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d })
    ])
  }
})

const HeroIcon = createIcon('M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z')
const FeaturesIcon = createIcon('M4 6h16M4 10h16M4 14h16M4 18h16')
const TestimonialsIcon = createIcon('M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z')
const CtaIcon = createIcon('M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122')
const TextIcon = createIcon('M4 6h16M4 12h16M4 18h7')
const ImageIcon = createIcon('M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z')
const VideoIcon = createIcon('M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z')
const FaqIcon = createIcon('M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z')
const ContactIcon = createIcon('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z')
const PricingIcon = createIcon('M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z')
const ClockIcon = createIcon('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z')
const ShareIcon = createIcon('M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z')
const DividerIcon = createIcon('M20 12H4')
const SpacerIcon = createIcon('M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4')
</script>

<style>
.builder-editor {
  background-color: #ffffff;
  height: 100%;
  overflow-y: auto;
}

/* Accordions - Style LeekPay minimal */
.builder-editor .accordion-trigger {
  width: 100%;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  background: transparent;
  transition: none;
  border-bottom: 1px solid #e5e7eb;
}

.builder-editor .accordion-trigger:hover {
  background-color: #f9fafb;
}

.builder-editor .accordion-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.builder-editor .accordion-label::before {
  display: none;
}

.builder-editor .accordion-chevron {
  color: #9ca3af;
  width: 16px;
  height: 16px;
}

.builder-editor .accordion-content {
  padding: 20px;
  background: transparent;
}

/* Labels */
.builder-editor .field-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 6px;
}

/* Inputs */
.builder-editor .input-field {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: border-color 150ms, box-shadow 150ms;
  outline: none;
}

.builder-editor .input-field:hover {
  border-color: #9ca3af;
}

.builder-editor .input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.builder-editor .input-field::placeholder {
  color: #9ca3af;
}

/* Select */
.builder-editor .select-field {
  width: 100%;
  padding: 10px 36px 10px 12px;
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 10px center;
  background-repeat: no-repeat;
  background-size: 20px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: border-color 150ms, box-shadow 150ms;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.builder-editor .select-field:hover {
  border-color: #9ca3af;
}

.builder-editor .select-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Number input */
.builder-editor .number-field-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.builder-editor .number-field {
  width: 100%;
  padding: 10px 40px 10px 12px;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  color: #111827;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: border-color 150ms, box-shadow 150ms;
  outline: none;
  appearance: textfield;
  -moz-appearance: textfield;
}

.builder-editor .number-field::-webkit-outer-spin-button,
.builder-editor .number-field::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.builder-editor .number-field:hover {
  border-color: #9ca3af;
}

.builder-editor .number-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.builder-editor .number-field-suffix {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  pointer-events: none;
}

/* Color picker */
.builder-editor .color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.builder-editor .color-swatch {
  width: 48px;
  height: 42px;
  padding: 4px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  background: white;
  flex-shrink: 0;
}

.builder-editor .color-swatch::-webkit-color-swatch-wrapper {
  padding: 0;
}

.builder-editor .color-swatch::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
}

.builder-editor .color-hex-input {
  flex: 1;
  padding: 10px 12px;
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, 'Cascadia Mono', monospace;
  font-weight: 500;
  color: #111827;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: border-color 150ms, box-shadow 150ms;
}

.builder-editor .color-hex-input:hover {
  border-color: #9ca3af;
}

.builder-editor .color-hex-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Checkbox */
.builder-editor .toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
  cursor: pointer;
}

.builder-editor .toggle-switch {
  width: 18px;
  height: 18px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: all 150ms;
}

.builder-editor .toggle-switch:hover {
  border-color: #9ca3af;
}

.builder-editor .toggle-switch.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.builder-editor .toggle-switch.active::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.builder-editor .toggle-label {
  font-size: 14px;
  font-weight: 400;
  color: #374151;
  cursor: pointer;
}

/* Slider */
.builder-editor .slider-wrapper {
  padding: 0;
}

.builder-editor .slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.builder-editor .slider-value {
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
  font-variant-numeric: tabular-nums;
}

.builder-editor .slider-track {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.builder-editor .slider-track::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.builder-editor .slider-track::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #3b82f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Segmented Control */
.builder-editor .segmented-control {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: #f3f4f6;
  border-radius: 6px;
}

.builder-editor .segment-btn {
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 150ms;
}

.builder-editor .segment-btn:hover {
  color: #374151;
}

.builder-editor .segment-btn.active {
  background: #ffffff;
  color: #111827;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Items */
.builder-editor .item-card {
  position: relative;
  padding: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 10px;
}

.builder-editor .item-card-input {
  width: 100%;
  padding: 8px 10px;
  font-size: 14px;
  color: #111827;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  outline: none;
  transition: border-color 150ms, box-shadow 150ms;
}

.builder-editor .item-card-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.builder-editor .item-card-input::placeholder {
  color: #9ca3af;
}

.builder-editor .item-delete-btn {
  position: static;
  padding: 0;
  background: transparent;
  color: #ef4444;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.builder-editor .item-delete-btn:hover {
  color: #dc2626;
  text-decoration: underline;
}

/* Spacing utilities */
.builder-editor .mb-3 { margin-bottom: 16px; }
.builder-editor .mb-2 { margin-bottom: 8px; }
.builder-editor .mt-3 { margin-top: 16px; }
.builder-editor .pt-3 { padding-top: 16px; }
.builder-editor .space-y-2 > * + * { margin-top: 8px; }

/* Flex utilities */
.builder-editor .flex { display: flex; }
.builder-editor .items-center { align-items: center; }
.builder-editor .justify-between { justify-content: space-between; }

/* Text utilities */
.builder-editor .text-xs { font-size: 12px; }
.builder-editor .font-medium { font-weight: 500; }
.builder-editor .text-neutral-500 { color: #6b7280; }

/* Grid */
.builder-editor .grid.grid-cols-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* Borders */
.builder-editor .border-t {
  border-top: 1px solid #e5e7eb;
}

.builder-editor .border-neutral-200 {
  border-color: #e5e7eb;
}

/* Divider */
.builder-editor .divide-y > * {
  border-bottom: 1px solid #e5e7eb;
}

.builder-editor .divide-y > *:last-child {
  border-bottom: none;
}
</style>
