<template>
  <div class="builder-editor">
    <!-- En-tête avec type de section -->
    <div class="px-5 py-4 border-b border-neutral-100">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
          <component :is="getSectionIcon(section.type)" class="w-4 h-4 text-neutral-600" />
        </div>
        <div>
          <h3 class="text-sm font-semibold text-neutral-900 capitalize">{{ getSectionLabel(section.type) }}</h3>
          <p class="text-[11px] text-neutral-400">Modifiez le contenu et le style</p>
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
              <CollapsibleGroup title="Bouton d'action">
                <InputField label="Texte" :value="section.content?.button?.text" @update="updateButton('text', $event)" placeholder="Ex: Découvrir" />
                <InputField label="Lien" :value="section.content?.button?.url" @update="updateButton('url', $event)" placeholder="Ex: #contact" />
              </CollapsibleGroup>
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
              <CollapsibleGroup title="Bouton">
                <InputField label="Texte" :value="section.content?.button?.text" @update="updateButton('text', $event)" />
                <InputField label="Lien" :value="section.content?.button?.url" @update="updateButton('url', $event)" />
              </CollapsibleGroup>
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
              <CollapsibleGroup title="Bouton">
                <InputField label="Texte" :value="section.content?.button?.text" @update="updateButton('text', $event)" />
                <InputField label="Lien" :value="section.content?.button?.url" @update="updateButton('url', $event)" />
              </CollapsibleGroup>
            </template>

            <!-- Divider -->
            <template v-else-if="section.type === 'divider'">
              <div class="text-center py-6 text-neutral-400 text-sm">
                Séparateur simple, aucun contenu éditable
              </div>
            </template>

            <!-- Spacer -->
            <template v-else-if="section.type === 'spacer'">
              <div class="text-center py-6 text-neutral-400 text-sm">
                Espace vide, ajustez la hauteur dans Style
              </div>
            </template>

            <!-- Default -->
            <template v-else>
              <div class="text-center py-6 text-neutral-400 text-sm">
                Éditeur non disponible pour "{{ section.type }}"
              </div>
            </template>
          </div>
        </template>
      </Accordion>

      <!-- STYLE -->
      <Accordion :defaultOpen="false">
        <template #trigger="{ isOpen }">
          <div class="accordion-trigger">
            <span class="accordion-label">Style</span>
            <ChevronIcon :class="['accordion-chevron', isOpen && 'rotate-180']" />
          </div>
        </template>
        <template #content>
          <div class="accordion-content">
            <!-- Couleurs -->
            <div class="space-y-4">
              <ColorPicker 
                label="Arrière-plan" 
                :value="section.style?.backgroundColor || '#ffffff'" 
                @update="updateStyle('backgroundColor', $event)" 
              />
              <ColorPicker 
                label="Texte" 
                :value="section.style?.textColor || '#171717'" 
                @update="updateStyle('textColor', $event)" 
              />
            </div>

            <!-- Alignement -->
            <div class="mt-5">
              <span class="field-label mb-2 block">Alignement</span>
              <div class="flex gap-1 p-1 bg-neutral-100 rounded-lg">
                <button
                  v-for="align in ['left', 'center', 'right']"
                  :key="align"
                  @click="updateStyle('alignment', align)"
                  :class="[
                    'flex-1 py-2 rounded-md text-xs font-medium transition-all',
                    (section.style?.alignment || 'center') === align 
                      ? 'bg-white shadow-sm text-neutral-900' 
                      : 'text-neutral-500 hover:text-neutral-700'
                  ]"
                >
                  {{ align === 'left' ? 'Gauche' : align === 'center' ? 'Centre' : 'Droite' }}
                </button>
              </div>
            </div>

            <!-- Largeur -->
            <div class="mt-5">
              <span class="field-label mb-2 block">Largeur du contenu</span>
              <select
                :value="section.style?.maxWidth || '1024px'"
                @change="handleWidthChange"
                class="w-full px-3 py-2 text-sm bg-neutral-50 border-0 rounded-lg focus:ring-2 focus:ring-primary/20"
              >
                <option value="600px">Étroit</option>
                <option value="800px">Moyen</option>
                <option value="1024px">Large</option>
                <option value="1280px">Très large</option>
                <option value="100%">Pleine largeur</option>
              </select>
            </div>
          </div>
        </template>
      </Accordion>

      <!-- ESPACEMENT -->
      <Accordion :defaultOpen="false">
        <template #trigger="{ isOpen }">
          <div class="accordion-trigger">
            <span class="accordion-label">Espacement</span>
            <ChevronIcon :class="['accordion-chevron', isOpen && 'rotate-180']" />
          </div>
        </template>
        <template #content>
          <div class="accordion-content">
            <!-- Presets -->
            <div>
              <span class="field-label mb-2 block">Préréglages</span>
              <div class="flex gap-1 p-1 bg-neutral-100 rounded-lg">
                <button
                  v-for="preset in spacingPresets"
                  :key="preset.name"
                  @click="applySpacingPreset(preset)"
                  :class="[
                    'flex-1 py-2 rounded-md text-xs font-medium transition-all',
                    isPresetActive(preset) 
                      ? 'bg-white shadow-sm text-neutral-900' 
                      : 'text-neutral-500 hover:text-neutral-700'
                  ]"
                >
                  {{ preset.name }}
                </button>
              </div>
            </div>

            <!-- Custom -->
            <div class="mt-5 grid grid-cols-2 gap-3">
              <div>
                <span class="field-label mb-1 block">Haut</span>
                <div class="relative">
                  <input
                    type="number"
                    :value="section.style?.padding?.top || 60"
                    @input="handlePaddingTop"
                    min="0"
                    step="10"
                    class="w-full px-3 py-2 pr-8 text-sm bg-neutral-50 border-0 rounded-lg focus:ring-2 focus:ring-primary/20"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">px</span>
                </div>
              </div>
              <div>
                <span class="field-label mb-1 block">Bas</span>
                <div class="relative">
                  <input
                    type="number"
                    :value="section.style?.padding?.bottom || 60"
                    @input="handlePaddingBottom"
                    min="0"
                    step="10"
                    class="w-full px-3 py-2 pr-8 text-sm bg-neutral-50 border-0 rounded-lg focus:ring-2 focus:ring-primary/20"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">px</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, h, defineComponent } from 'vue'

// Type local (évite les problèmes de résolution de chemin)
interface PageSection {
  id: string
  type: string
  template: string
  order: number
  content: Record<string, any>
  style: {
    alignment?: 'left' | 'center' | 'right'
    maxWidth?: string
    backgroundColor?: string
    textColor?: string
    padding?: {
      top: number
      bottom: number
    }
  }
}

// Props & Emits
const props = defineProps<{
  section: PageSection
}>()

const emit = defineEmits<{
  'update:content': [content: Record<string, any>]
  'update:style': [style: Record<string, any>]
}>()

// Spacing presets
const spacingPresets = [
  { name: 'Compact', top: 40, bottom: 40 },
  { name: 'Normal', top: 60, bottom: 60 },
  { name: 'Large', top: 100, bottom: 100 }
]

const isPresetActive = (preset: typeof spacingPresets[0]) => {
  const top = props.section.style?.padding?.top || 60
  const bottom = props.section.style?.padding?.bottom || 60
  return top === preset.top && bottom === preset.bottom
}

const applySpacingPreset = (preset: typeof spacingPresets[0]) => {
  emit('update:style', { padding: { top: preset.top, bottom: preset.bottom } })
}

// Content updates
const updateContent = (key: string, value: string) => {
  emit('update:content', { [key]: value })
}

const updateButton = (key: string, value: string) => {
  const currentButton = props.section.content?.button || {}
  emit('update:content', { button: { ...currentButton, [key]: value } })
}

// Style updates
const updateStyle = (key: string, value: any) => {
  emit('update:style', { [key]: value })
}

const updatePadding = (key: string, value: number) => {
  emit('update:style', { 
    padding: { 
      ...props.section.style?.padding, 
      [key]: value 
    } 
  })
}

// Event handlers for template (avoid type assertions in template)
const handleWidthChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  updateStyle('maxWidth', target.value)
}

const handlePaddingTop = (event: Event) => {
  const target = event.target as HTMLInputElement
  updatePadding('top', Number(target.value))
}

const handlePaddingBottom = (event: Event) => {
  const target = event.target as HTMLInputElement
  updatePadding('bottom', Number(target.value))
}

// Feature items
const addFeatureItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ icon: 'check', title: 'Nouveau', description: 'Description' })
  emit('update:content', { items })
}

const updateFeatureItem = (index: string | number, key: string, value: string) => {
  const idx = Number(index)
  const items = [...(props.section.content?.items || [])]
  items[idx] = { ...items[idx], [key]: value }
  emit('update:content', { items })
}

const removeFeatureItem = (index: string | number) => {
  const idx = Number(index)
  const items = [...(props.section.content?.items || [])]
  items.splice(idx, 1)
  emit('update:content', { items })
}

// Testimonial items
const addTestimonialItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ text: 'Avis client...', name: 'Nom', role: 'Client' })
  emit('update:content', { items })
}

const updateTestimonialItem = (index: string | number, key: string, value: string) => {
  const idx = Number(index)
  const items = [...(props.section.content?.items || [])]
  items[idx] = { ...items[idx], [key]: value }
  emit('update:content', { items })
}

const removeTestimonialItem = (index: string | number) => {
  const idx = Number(index)
  const items = [...(props.section.content?.items || [])]
  items.splice(idx, 1)
  emit('update:content', { items })
}

// FAQ items
const addFaqItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ question: 'Nouvelle question ?', answer: 'Réponse...' })
  emit('update:content', { items })
}

const updateFaqItem = (index: string | number, key: string, value: string) => {
  const idx = Number(index)
  const items = [...(props.section.content?.items || [])]
  items[idx] = { ...items[idx], [key]: value }
  emit('update:content', { items })
}

const removeFaqItem = (index: string | number) => {
  const idx = Number(index)
  const items = [...(props.section.content?.items || [])]
  items.splice(idx, 1)
  emit('update:content', { items })
}

// Section icons & labels
const getSectionLabel = (type: string) => {
  const labels: Record<string, string> = {
    hero: 'Hero',
    features: 'Caractéristiques',
    testimonials: 'Témoignages',
    cta: 'Appel à l\'action',
    text: 'Texte',
    image: 'Image',
    faq: 'FAQ',
    contact: 'Contact',
    pricing: 'Tarification',
    divider: 'Séparateur',
    spacer: 'Espace'
  }
  return labels[type] || type
}

const getSectionIcon = (type: string) => {
  // Returns icon component name
  const icons: Record<string, any> = {
    hero: HeroIcon,
    features: FeaturesIcon,
    testimonials: TestimonialsIcon,
    cta: CtaIcon,
    text: TextIcon,
    image: ImageIcon,
    faq: FaqIcon,
    contact: ContactIcon,
    pricing: PricingIcon,
    divider: DividerIcon,
    spacer: SpacerIcon
  }
  return icons[type] || TextIcon
}
</script>

<!-- Sub-components -->
<script lang="ts">
// Accordion Component
const Accordion = defineComponent({
  props: {
    defaultOpen: { type: Boolean, default: false }
  },
  setup(props, { slots }) {
    const isOpen = ref(props.defaultOpen)
    const toggle = () => { isOpen.value = !isOpen.value }
    
    return () => h('div', { class: 'accordion' }, [
      h('button', { 
        class: 'w-full', 
        onClick: toggle 
      }, slots.trigger?.({ isOpen: isOpen.value })),
      isOpen.value && slots.content?.()
    ])
  }
})

// ChevronIcon
const ChevronIcon = defineComponent({
  setup(_, { attrs }) {
    return () => h('svg', { 
      class: ['w-4 h-4 transition-transform', attrs.class],
      fill: 'none', 
      stroke: 'currentColor', 
      viewBox: '0 0 24 24' 
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M19 9l-7 7-7-7' 
      })
    ])
  }
})

// InputField Component
const InputField = defineComponent({
  props: {
    label: String,
    value: String,
    placeholder: String,
    type: { type: String, default: 'text' },
    multiline: Boolean,
    rows: { type: Number, default: 3 }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const onInput = (e: Event) => {
      emit('update', (e.target as HTMLInputElement).value)
    }
    
    return () => h('div', { class: 'mb-4' }, [
      h('label', { class: 'field-label mb-1 block' }, props.label),
      props.multiline
        ? h('textarea', {
            value: props.value || '',
            onInput,
            rows: props.rows,
            placeholder: props.placeholder,
            class: 'input-field resize-none'
          })
        : h('input', {
            type: props.type,
            value: props.value || '',
            onInput,
            placeholder: props.placeholder,
            class: 'input-field'
          })
    ])
  }
})

// CollapsibleGroup Component
const CollapsibleGroup = defineComponent({
  props: { title: String },
  setup(props, { slots }) {
    const isOpen = ref(false)
    return () => h('div', { class: 'mt-4 border border-neutral-100 rounded-lg overflow-hidden' }, [
      h('button', {
        class: 'w-full px-3 py-2 flex items-center justify-between text-xs font-medium text-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition-colors',
        onClick: () => { isOpen.value = !isOpen.value }
      }, [
        props.title,
        h(ChevronIcon, { class: isOpen.value ? 'rotate-180' : '' })
      ]),
      isOpen.value && h('div', { class: 'p-3 space-y-3' }, slots.default?.())
    ])
  }
})

// ColorPicker Component
const ColorPicker = defineComponent({
  props: { label: String, value: String },
  emits: ['update'],
  setup(props, { emit }) {
    return () => h('div', { class: 'flex items-center gap-3' }, [
      h('input', {
        type: 'color',
        value: props.value,
        onInput: (e: Event) => emit('update', (e.target as HTMLInputElement).value),
        class: 'w-8 h-8 rounded-lg cursor-pointer border-0 p-0'
      }),
      h('div', { class: 'flex-1' }, [
        h('span', { class: 'field-label' }, props.label),
        h('input', {
          type: 'text',
          value: props.value,
          onInput: (e: Event) => emit('update', (e.target as HTMLInputElement).value),
          class: 'w-full mt-1 px-2 py-1 text-xs font-mono bg-neutral-50 border-0 rounded focus:ring-2 focus:ring-primary/20'
        })
      ])
    ])
  }
})

// FeatureItem Component
const FeatureItem = defineComponent({
  props: { item: Object, index: [Number, String] },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    return () => h('div', { class: 'p-3 bg-neutral-50 rounded-lg group relative' }, [
      h('button', {
        class: 'absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs',
        onClick: () => emit('remove')
      }, '×'),
      h('div', { class: 'flex gap-2 mb-2' }, [
        h('input', {
          value: props.item?.icon,
          onInput: (e: Event) => emit('update', props.index, 'icon', (e.target as HTMLInputElement).value),
          class: 'w-12 px-2 py-1 text-center text-lg bg-white border-0 rounded focus:ring-2 focus:ring-primary/20'
        }),
        h('input', {
          value: props.item?.title,
          onInput: (e: Event) => emit('update', props.index, 'title', (e.target as HTMLInputElement).value),
          placeholder: 'Titre',
          class: 'flex-1 px-2 py-1 text-sm bg-white border-0 rounded focus:ring-2 focus:ring-primary/20'
        })
      ]),
      h('textarea', {
        value: props.item?.description,
        onInput: (e: Event) => emit('update', props.index, 'description', (e.target as HTMLInputElement).value),
        rows: 2,
        placeholder: 'Description',
        class: 'w-full px-2 py-1 text-xs bg-white border-0 rounded focus:ring-2 focus:ring-primary/20 resize-none'
      })
    ])
  }
})

// TestimonialItem Component
const TestimonialItem = defineComponent({
  props: { item: Object, index: [Number, String] },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    return () => h('div', { class: 'p-3 bg-neutral-50 rounded-lg group relative' }, [
      h('button', {
        class: 'absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs',
        onClick: () => emit('remove')
      }, '×'),
      h('textarea', {
        value: props.item?.text,
        onInput: (e: Event) => emit('update', props.index, 'text', (e.target as HTMLInputElement).value),
        rows: 2,
        placeholder: 'Témoignage',
        class: 'w-full px-2 py-1 text-sm bg-white border-0 rounded focus:ring-2 focus:ring-primary/20 resize-none mb-2'
      }),
      h('div', { class: 'grid grid-cols-2 gap-2' }, [
        h('input', {
          value: props.item?.name,
          onInput: (e: Event) => emit('update', props.index, 'name', (e.target as HTMLInputElement).value),
          placeholder: 'Nom',
          class: 'px-2 py-1 text-xs bg-white border-0 rounded focus:ring-2 focus:ring-primary/20'
        }),
        h('input', {
          value: props.item?.role,
          onInput: (e: Event) => emit('update', props.index, 'role', (e.target as HTMLInputElement).value),
          placeholder: 'Rôle',
          class: 'px-2 py-1 text-xs bg-white border-0 rounded focus:ring-2 focus:ring-primary/20'
        })
      ])
    ])
  }
})

// FaqItem Component  
const FaqItem = defineComponent({
  props: { item: Object, index: [Number, String] },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    return () => h('div', { class: 'p-3 bg-neutral-50 rounded-lg group relative' }, [
      h('button', {
        class: 'absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs',
        onClick: () => emit('remove')
      }, '×'),
      h('input', {
        value: props.item?.question,
        onInput: (e: Event) => emit('update', props.index, 'question', (e.target as HTMLInputElement).value),
        placeholder: 'Question',
        class: 'w-full px-2 py-1 text-sm bg-white border-0 rounded focus:ring-2 focus:ring-primary/20 mb-2'
      }),
      h('textarea', {
        value: props.item?.answer,
        onInput: (e: Event) => emit('update', props.index, 'answer', (e.target as HTMLInputElement).value),
        rows: 2,
        placeholder: 'Réponse',
        class: 'w-full px-2 py-1 text-xs bg-white border-0 rounded focus:ring-2 focus:ring-primary/20 resize-none'
      })
    ])
  }
})

// Section Icons
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
const FaqIcon = createIcon('M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z')
const ContactIcon = createIcon('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z')
const PricingIcon = createIcon('M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z')
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
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: rgb(163 163 163);
}

.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: rgb(250 250 250);
  border: none;
  border-radius: 0.5rem;
  transition: all 150ms;
  outline: none;
}

.input-field:focus {
  background-color: white;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.input-field::placeholder {
  color: rgb(212 212 212);
}
</style>
