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
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" />
              <InputField label="Sous-titre" :value="section.content?.subtitle" @update="updateContent('subtitle', $event)" multiline />
              <SegmentedControl 
                label="Alignement du contenu"
                :options="alignmentOptions"
                :value="section.style?.alignment || 'center'"
                @update="updateStyle('alignment', $event)"
              />
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

            <!-- Testimonials -->
            <template v-else-if="section.type === 'testimonials'">
              <InputField label="Titre" :value="section.content?.title" @update="updateContent('title', $event)" />
              <div class="mt-4">
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
              <div class="grid grid-cols-2 gap-3">
                <InputField label="Prix" :value="section.content?.price" @update="updateContent('price', $event)" placeholder="99€" />
                <InputField label="Période" :value="section.content?.period" @update="updateContent('period', $event)" placeholder="/mois" />
              </div>
              <InputField label="Description" :value="section.content?.description" @update="updateContent('description', $event)" multiline />
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
            <div class="grid grid-cols-2 gap-3 mt-4">
              <ColorPickerField 
                label="Couleur"
                :value="section.content?.button?.color || '#10B981'"
                @update="updateButton('color', $event)"
              />
              <ColorPickerField 
                label="Couleur texte"
                :value="section.content?.button?.textColor || '#ffffff'"
                @update="updateButton('textColor', $event)"
              />
            </div>
            <div class="grid grid-cols-2 gap-3 mt-4">
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
              class="mt-4"
            />
            <SegmentedControl 
              label="Alignement boutons"
              :options="alignmentOptions"
              :value="section.content?.button?.alignment || 'center'"
              @update="updateButton('alignment', $event)"
              class="mt-4"
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
              class="mt-4"
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
                class="mt-4"
              />
            </template>
            
            <SelectField 
              label="Hauteur section"
              :options="heightOptions"
              :value="section.style?.height || 'auto'"
              @update="updateStyle('height', $event)"
              class="mt-4"
            />
            
            <div class="grid grid-cols-2 gap-3 mt-4">
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
            <div class="grid grid-cols-2 gap-3 mt-4">
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
              class="mt-4"
            />
            <div class="grid grid-cols-2 gap-3 mt-4">
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
              label="Interligne titre"
              :options="lineHeightOptions"
              :value="section.typography?.titleLineHeight || 'normal'"
              @update="updateTypography('titleLineHeight', $event)"
              class="mt-4"
            />
            
            <!-- Sous-titre -->
            <div class="border-t border-neutral-100 mt-5 pt-5">
              <SelectField 
                label="Police sous-titre"
                :options="subtitleFontOptions"
                :value="section.typography?.subtitleFont || 'same'"
                @update="updateTypography('subtitleFont', $event)"
              />
              <div class="grid grid-cols-2 gap-3 mt-4">
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
                label="Couleur sous-titre"
                :value="section.typography?.subtitleColor || section.style?.textColor || '#171717'"
                :showAuto="true"
                @update="updateTypography('subtitleColor', $event)"
                class="mt-4"
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
            <div class="grid grid-cols-2 gap-3 mt-4">
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
              class="mt-4"
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
            <div class="grid grid-cols-2 gap-3">
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
              class="mt-4"
            />
            <InputField 
              label="Classes CSS personnalisées"
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
    return () => h('div', { class: 'mb-4' }, [
      h('label', { class: 'field-label mb-1.5 block' }, props.label),
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
    return () => h('div', { class: 'mb-4' }, [
      h('label', { class: 'field-label mb-1.5 block' }, props.label),
      h('select', { value: props.value, onChange: (e: Event) => emit('update', (e.target as HTMLSelectElement).value), class: 'input-field' },
        props.options.map((opt: { value: string; label: string }) => h('option', { value: opt.value }, opt.label)))
    ])
  }
})

// SegmentedControl
const SegmentedControl = defineComponent({
  props: { label: String, options: { type: Array as () => { value: string; label: string }[], default: () => [] }, value: String },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('div', { class: 'mb-4' }, [
      h('label', { class: 'field-label mb-2 block' }, props.label),
      h('div', { class: 'flex gap-1 p-1 bg-neutral-100 rounded-lg' },
        props.options.map((opt: { value: string; label: string }) => h('button', {
          onClick: () => emit('update', opt.value),
          class: ['flex-1 py-2 rounded-md text-xs font-medium transition-all', props.value === opt.value ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700']
        }, opt.label)))
    ])
  }
})

// ColorPickerField
const ColorPickerField = defineComponent({
  props: { label: String, value: String, showAuto: Boolean },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('div', { class: 'mb-4' }, [
      h('label', { class: 'field-label mb-1.5 block' }, props.label),
      h('div', { class: 'flex items-center gap-2' }, [
        h('input', { type: 'color', value: props.value || '#000000', onInput: (e: Event) => emit('update', (e.target as HTMLInputElement).value), class: 'w-9 h-9 rounded-lg cursor-pointer border border-neutral-200 p-0.5' }),
        h('input', { type: 'text', value: props.value || '', onInput: (e: Event) => emit('update', (e.target as HTMLInputElement).value), class: 'flex-1 px-3 py-2 text-xs font-mono bg-neutral-50 border-0 rounded-lg' })
      ])
    ])
  }
})

// SliderField
const SliderField = defineComponent({
  props: { label: String, value: { type: Number, default: 0 }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 }, suffix: { type: String, default: '' } },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('div', { class: 'mb-4' }, [
      h('div', { class: 'flex items-center justify-between mb-1.5' }, [
        h('label', { class: 'field-label' }, props.label),
        h('span', { class: 'text-xs text-neutral-500' }, `${props.value}${props.suffix}`)
      ]),
      h('input', { type: 'range', min: props.min, max: props.max, value: props.value, onInput: (e: Event) => emit('update', Number((e.target as HTMLInputElement).value)), class: 'w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary' })
    ])
  }
})

// NumberField
const NumberField = defineComponent({
  props: { label: String, value: { type: Number, default: 0 }, min: { type: Number, default: 0 }, max: { type: Number, default: 9999 }, step: { type: Number, default: 1 }, suffix: { type: String, default: '' } },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('div', { class: 'mb-4' }, [
      h('label', { class: 'field-label mb-1.5 block' }, props.label),
      h('div', { class: 'relative' }, [
        h('input', { type: 'number', min: props.min, max: props.max, step: props.step, value: props.value, onInput: (e: Event) => emit('update', Number((e.target as HTMLInputElement).value)), class: 'input-field pr-10' }),
        h('span', { class: 'absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400' }, props.suffix)
      ])
    ])
  }
})

// CheckboxField
const CheckboxField = defineComponent({
  props: { label: String, value: Boolean },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('label', { class: 'flex items-center gap-3 cursor-pointer' }, [
      h('input', { type: 'checkbox', checked: props.value, onChange: (e: Event) => emit('update', (e.target as HTMLInputElement).checked), class: 'w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary/20' }),
      h('span', { class: 'text-sm text-neutral-700' }, props.label)
    ])
  }
})

// Item Components
const FeatureItem = defineComponent({
  props: { item: Object, index: Number },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    return () => h('div', { class: 'p-3 bg-neutral-50 rounded-lg group relative' }, [
      h('button', { class: 'absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs', onClick: () => emit('remove') }, '×'),
      h('div', { class: 'flex gap-2 mb-2' }, [
        h('input', { value: props.item?.icon, onInput: (e: Event) => emit('update', props.index, 'icon', (e.target as HTMLInputElement).value), class: 'w-12 px-2 py-1 text-center text-sm bg-white border-0 rounded' }),
        h('input', { value: props.item?.title, onInput: (e: Event) => emit('update', props.index, 'title', (e.target as HTMLInputElement).value), placeholder: 'Titre', class: 'flex-1 px-2 py-1 text-sm bg-white border-0 rounded' })
      ]),
      h('textarea', { value: props.item?.description, onInput: (e: Event) => emit('update', props.index, 'description', (e.target as HTMLTextAreaElement).value), rows: 2, placeholder: 'Description', class: 'w-full px-2 py-1 text-xs bg-white border-0 rounded resize-none' })
    ])
  }
})

const TestimonialItem = defineComponent({
  props: { item: Object, index: Number },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    return () => h('div', { class: 'p-3 bg-neutral-50 rounded-lg group relative' }, [
      h('button', { class: 'absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs', onClick: () => emit('remove') }, '×'),
      h('textarea', { value: props.item?.text, onInput: (e: Event) => emit('update', props.index, 'text', (e.target as HTMLTextAreaElement).value), rows: 2, placeholder: 'Témoignage', class: 'w-full px-2 py-1 text-sm bg-white border-0 rounded resize-none mb-2' }),
      h('div', { class: 'grid grid-cols-2 gap-2' }, [
        h('input', { value: props.item?.name, onInput: (e: Event) => emit('update', props.index, 'name', (e.target as HTMLInputElement).value), placeholder: 'Nom', class: 'px-2 py-1 text-xs bg-white border-0 rounded' }),
        h('input', { value: props.item?.role, onInput: (e: Event) => emit('update', props.index, 'role', (e.target as HTMLInputElement).value), placeholder: 'Rôle', class: 'px-2 py-1 text-xs bg-white border-0 rounded' })
      ])
    ])
  }
})

const FaqItem = defineComponent({
  props: { item: Object, index: Number },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    return () => h('div', { class: 'p-3 bg-neutral-50 rounded-lg group relative' }, [
      h('button', { class: 'absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs', onClick: () => emit('remove') }, '×'),
      h('input', { value: props.item?.question, onInput: (e: Event) => emit('update', props.index, 'question', (e.target as HTMLInputElement).value), placeholder: 'Question', class: 'w-full px-2 py-1 text-sm bg-white border-0 rounded mb-2' }),
      h('textarea', { value: props.item?.answer, onInput: (e: Event) => emit('update', props.index, 'answer', (e.target as HTMLTextAreaElement).value), rows: 2, placeholder: 'Réponse', class: 'w-full px-2 py-1 text-xs bg-white border-0 rounded resize-none' })
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

<style scoped>
.builder-editor {
  background-color: white;
  height: 100%;
  overflow-y: auto;
}

.accordion-trigger {
  width: 100%;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  transition: background-color 150ms;
}

.accordion-trigger:hover {
  background-color: rgb(250 250 250);
}

.accordion-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(115 115 115);
}

.accordion-chevron {
  color: rgb(163 163 163);
}

.accordion-content {
  padding: 0 1.25rem 1.25rem 1.25rem;
}

.field-label {
  font-size: 11px;
  font-weight: 500;
  color: rgb(115 115 115);
}

.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: rgb(250 250 250);
  border: 1px solid rgb(229 229 229);
  border-radius: 0.5rem;
  transition: all 150ms;
  outline: none;
}

.input-field:focus {
  background-color: white;
  border-color: rgb(99 102 241);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-field::placeholder {
  color: rgb(163 163 163);
}
</style>
