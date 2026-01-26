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
