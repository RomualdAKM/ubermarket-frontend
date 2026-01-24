<template>
  <div class="space-y-4">
    <!-- Onglet Contenu -->
    <template v-if="tab === 'content'">
      <!-- Hero -->
      <template v-if="section.type === 'hero'">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            :value="section.content?.title"
            @input="handleInput($event, 'title')"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
          <textarea
            :value="section.content?.subtitle"
            @input="handleInput($event, 'subtitle')"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          ></textarea>
        </div>
        <div class="border-t border-gray-200 pt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Bouton</label>
          <div class="space-y-3">
            <input
              :value="section.content?.button?.text"
              @input="handleButtonInput($event, 'text')"
              type="text"
              placeholder="Texte du bouton"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              :value="section.content?.button?.url"
              @input="handleButtonInput($event, 'url')"
              type="text"
              placeholder="URL (ex: #contact)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </template>

      <!-- Features -->
      <template v-else-if="section.type === 'features'">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            :value="section.content?.title"
            @input="handleInput($event, 'title')"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
          <input
            :value="section.content?.subtitle"
            @input="handleInput($event, 'subtitle')"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div class="border-t border-gray-200 pt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Caractéristiques</label>
          <div class="space-y-3">
            <div 
              v-for="(item, index) in (section.content?.items || [])" 
              :key="index"
              class="p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex gap-2 mb-2">
                <input
                  :value="item.icon"
                  @input="handleFeatureInput($event, index, 'icon')"
                  type="text"
                  placeholder="Emoji"
                  class="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  :value="item.title"
                  @input="handleFeatureInput($event, index, 'title')"
                  type="text"
                  placeholder="Titre"
                  class="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <textarea
                :value="item.description"
                @input="handleFeatureInput($event, index, 'description')"
                rows="2"
                placeholder="Description"
                class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              ></textarea>
            </div>
            <button
              @click="addFeatureItem"
              class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors"
            >
              + Ajouter une caractéristique
            </button>
          </div>
        </div>
      </template>

      <!-- Text -->
      <template v-else-if="section.type === 'text'">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Titre (optionnel)</label>
          <input
            :value="section.content?.title"
            @input="handleInput($event, 'title')"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
          <textarea
            :value="section.content?.content"
            @input="handleInput($event, 'content')"
            rows="6"
            placeholder="<p>Votre texte ici...</p>"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">Vous pouvez utiliser du HTML basique</p>
        </div>
      </template>

      <!-- CTA -->
      <template v-else-if="section.type === 'cta'">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            :value="section.content?.title"
            @input="handleInput($event, 'title')"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
          <input
            :value="section.content?.subtitle"
            @input="handleInput($event, 'subtitle')"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div class="border-t border-gray-200 pt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Bouton</label>
          <div class="space-y-3">
            <input
              :value="section.content?.button?.text"
              @input="handleButtonInput($event, 'text')"
              type="text"
              placeholder="Texte du bouton"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              :value="section.content?.button?.url"
              @input="handleButtonInput($event, 'url')"
              type="text"
              placeholder="URL"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </template>

      <!-- Contact -->
      <template v-else-if="section.type === 'contact'">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            :value="section.content?.title"
            @input="handleInput($event, 'title')"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            :value="section.content?.email"
            @input="handleInput($event, 'email')"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            :value="section.content?.phone"
            @input="handleInput($event, 'phone')"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <textarea
            :value="section.content?.address"
            @input="handleInput($event, 'address')"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          ></textarea>
        </div>
      </template>

      <!-- FAQ -->
      <template v-else-if="section.type === 'faq'">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            :value="section.content?.title"
            @input="handleInput($event, 'title')"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div class="border-t border-gray-200 pt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Questions</label>
          <div class="space-y-3">
            <div 
              v-for="(item, index) in (section.content?.items || [])" 
              :key="index"
              class="p-3 bg-gray-50 rounded-lg"
            >
              <input
                :value="item.question"
                @input="handleFaqInput($event, index, 'question')"
                type="text"
                placeholder="Question"
                class="w-full px-2 py-1 mb-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <textarea
                :value="item.answer"
                @input="handleFaqInput($event, index, 'answer')"
                rows="2"
                placeholder="Réponse"
                class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              ></textarea>
            </div>
            <button
              @click="addFaqItem"
              class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors"
            >
              + Ajouter une question
            </button>
          </div>
        </div>
      </template>

      <!-- Default / Autres types -->
      <template v-else>
        <div class="text-center py-8 text-gray-500">
          <p>Éditeur non disponible pour ce type de section</p>
          <p class="text-sm mt-1">Type: {{ section.type }}</p>
        </div>
      </template>
    </template>

    <!-- Onglet Style -->
    <template v-else-if="tab === 'style'">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Couleur de fond</label>
        <div class="flex gap-2">
          <input
            :value="section.style?.backgroundColor || '#ffffff'"
            @input="handleStyleInput($event, 'backgroundColor')"
            type="color"
            class="w-10 h-10 rounded cursor-pointer"
          />
          <input
            :value="section.style?.backgroundColor || '#ffffff'"
            @input="handleStyleInput($event, 'backgroundColor')"
            type="text"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
          />
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Couleur du texte</label>
        <div class="flex gap-2">
          <input
            :value="section.style?.textColor || '#000000'"
            @input="handleStyleInput($event, 'textColor')"
            type="color"
            class="w-10 h-10 rounded cursor-pointer"
          />
          <input
            :value="section.style?.textColor || '#000000'"
            @input="handleStyleInput($event, 'textColor')"
            type="text"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
          />
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Alignement</label>
        <div class="flex gap-2">
          <button
            @click="emit('update:style', { alignment: 'left' })"
            :class="[
              'flex-1 py-2 rounded-lg border transition-colors',
              section.style?.alignment === 'left' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 hover:border-gray-400'
            ]"
          >
            Gauche
          </button>
          <button
            @click="emit('update:style', { alignment: 'center' })"
            :class="[
              'flex-1 py-2 rounded-lg border transition-colors',
              (!section.style?.alignment || section.style?.alignment === 'center') ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 hover:border-gray-400'
            ]"
          >
            Centre
          </button>
          <button
            @click="emit('update:style', { alignment: 'right' })"
            :class="[
              'flex-1 py-2 rounded-lg border transition-colors',
              section.style?.alignment === 'right' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 hover:border-gray-400'
            ]"
          >
            Droite
          </button>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Espacement vertical</label>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-500">Haut (px)</label>
            <input
              :value="section.style?.padding?.top || 40"
              @input="handlePaddingInput($event, 'top')"
              type="number"
              min="0"
              step="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label class="text-xs text-gray-500">Bas (px)</label>
            <input
              :value="section.style?.padding?.bottom || 40"
              @input="handlePaddingInput($event, 'bottom')"
              type="number"
              min="0"
              step="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Largeur max du contenu</label>
        <select
          :value="section.style?.maxWidth || '1024px'"
          @change="handleSelectChange"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="600px">Étroit (600px)</option>
          <option value="800px">Moyen (800px)</option>
          <option value="1024px">Large (1024px)</option>
          <option value="1280px">Très large (1280px)</option>
          <option value="100%">Pleine largeur</option>
        </select>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PageSection, BlockContent, BlockStyle } from '~/composables/useWebsiteBuilder'

const props = defineProps<{
  section: PageSection
  tab: 'content' | 'style'
}>()

const emit = defineEmits<{
  'update:content': [content: BlockContent]
  'update:style': [style: Partial<BlockStyle>]
}>()

// Helper pour obtenir la valeur de l'input
const getInputValue = (event: Event): string => {
  return (event.target as HTMLInputElement).value
}

// Helper général pour les inputs de contenu
const handleInput = (event: Event, key: string) => {
  emit('update:content', { [key]: getInputValue(event) })
}

// Helper pour les inputs de style
const handleStyleInput = (event: Event, key: string) => {
  emit('update:style', { [key]: getInputValue(event) })
}

// Helper pour les boutons
const handleButtonInput = (event: Event, key: string) => {
  const currentButton = props.section.content?.button || {}
  emit('update:content', { 
    button: { ...currentButton, [key]: getInputValue(event) }
  })
}

// Helper pour les features
const handleFeatureInput = (event: Event, index: number, key: string) => {
  const items = [...(props.section.content?.items || [])]
  items[index] = { ...items[index], [key]: getInputValue(event) }
  emit('update:content', { items })
}

// Helper pour les FAQ
const handleFaqInput = (event: Event, index: number, key: string) => {
  const items = [...(props.section.content?.items || [])]
  items[index] = { ...items[index], [key]: getInputValue(event) }
  emit('update:content', { items })
}

// Helper pour le padding
const handlePaddingInput = (event: Event, key: string) => {
  emit('update:style', { 
    padding: { 
      ...props.section.style?.padding, 
      [key]: Number(getInputValue(event)) 
    } 
  })
}

// Helper pour le select
const handleSelectChange = (event: Event) => {
  emit('update:style', { maxWidth: (event.target as HTMLSelectElement).value })
}

// Helper pour ajouter une caractéristique
const addFeatureItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ icon: '✓', title: 'Nouveau', description: 'Description' })
  emit('update:content', { items })
}

// Helper pour ajouter une question FAQ
const addFaqItem = () => {
  const items = [...(props.section.content?.items || [])]
  items.push({ question: 'Nouvelle question ?', answer: 'Réponse...' })
  emit('update:content', { items })
}
</script>
