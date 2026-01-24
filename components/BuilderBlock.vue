<template>
  <div :style="sectionStyle">
    <!-- Hero -->
    <template v-if="section.type === 'hero'">
      <div :style="{ maxWidth: section.style?.maxWidth || '1024px', margin: '0 auto', padding: '0 1rem' }">
        <div :style="{ textAlign: section.style?.alignment || 'center' }">
          <h1 
            class="font-bold mb-4"
            :style="{ 
              fontSize: getFontSize(section.typography?.titleSize || '4xl'),
              color: section.style?.textColor || '#000000'
            }"
          >
            {{ section.content?.title || 'Titre principal' }}
          </h1>
          <p 
            class="mb-6"
            :style="{ 
              fontSize: getFontSize(section.typography?.subtitleSize || 'xl'),
              color: section.style?.textColor || '#000000',
              opacity: 0.8
            }"
          >
            {{ section.content?.subtitle || 'Sous-titre' }}
          </p>
          <a
            v-if="section.content?.button"
            :href="section.content.button.url || '#'"
            class="inline-block px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
            :style="{ 
              backgroundColor: section.content.button.style === 'primary' ? '#10B981' : 'transparent',
              color: section.content.button.style === 'primary' ? '#ffffff' : section.style?.textColor,
              border: section.content.button.style === 'secondary' ? '2px solid currentColor' : 'none'
            }"
          >
            {{ section.content.button.text || 'Bouton' }}
          </a>
        </div>
      </div>
    </template>
    
    <!-- Features -->
    <template v-else-if="section.type === 'features'">
      <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
        <div :style="{ textAlign: section.style?.alignment || 'center' }" class="mb-8">
          <h2 class="text-3xl font-bold mb-2" :style="{ color: section.style?.textColor }">
            {{ section.content?.title || 'Nos avantages' }}
          </h2>
          <p v-if="section.content?.subtitle" class="text-lg opacity-80" :style="{ color: section.style?.textColor }">
            {{ section.content.subtitle }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="(item, index) in (section.content?.items || [])" 
            :key="index"
            class="p-6 rounded-lg bg-white/10"
          >
            <div class="w-12 h-12 mb-4 rounded-xl flex items-center justify-center" :style="{ backgroundColor: section.style?.textColor + '10' }">
              <svg class="w-6 h-6" :style="{ color: section.style?.textColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="getIconPath(item.icon)" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2" :style="{ color: section.style?.textColor }">{{ item.title }}</h3>
            <p class="opacity-80" :style="{ color: section.style?.textColor }">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Testimonials -->
    <template v-else-if="section.type === 'testimonials'">
      <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
        <h2 v-if="section.content?.title" class="text-3xl font-bold text-center mb-8" :style="{ color: section.style?.textColor }">
          {{ section.content.title }}
        </h2>
        <div v-if="section.content?.items" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="(item, index) in section.content.items" 
            :key="index"
            class="p-6 rounded-lg bg-white shadow-sm"
          >
            <p class="text-gray-600 mb-4 italic">"{{ item.text }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <p class="font-semibold text-gray-900">{{ item.name }}</p>
                <p class="text-sm text-gray-500">{{ item.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- CTA -->
    <template v-else-if="section.type === 'cta'">
      <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
        <h2 class="text-3xl font-bold mb-4" :style="{ color: section.style?.textColor }">
          {{ section.content?.title || 'Prêt à commencer ?' }}
        </h2>
        <p v-if="section.content?.subtitle" class="text-lg mb-6 opacity-90" :style="{ color: section.style?.textColor }">
          {{ section.content.subtitle }}
        </p>
        <a
          v-if="section.content?.button"
          :href="section.content.button.url || '#'"
          class="inline-block px-8 py-4 rounded-lg font-bold text-lg transition-transform hover:scale-105"
          :style="{ 
            backgroundColor: '#ffffff',
            color: section.style?.backgroundColor || '#10B981'
          }"
        >
          {{ section.content.button.text || 'Commencer' }}
        </a>
      </div>
    </template>
    
    <!-- Text -->
    <template v-else-if="section.type === 'text'">
      <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
        <h2 v-if="section.content?.title" class="text-2xl font-bold mb-4" :style="{ color: section.style?.textColor, textAlign: section.style?.alignment }">
          {{ section.content.title }}
        </h2>
        <div 
          class="prose max-w-none" 
          :style="{ color: section.style?.textColor, textAlign: section.style?.alignment }"
          v-html="section.content?.content || '<p>Votre texte ici...</p>'"
        ></div>
      </div>
    </template>
    
    <!-- Image -->
    <template v-else-if="section.type === 'image'">
      <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem', textAlign: section.style?.alignment || 'center' }">
        <img
          v-if="section.content?.src"
          :src="section.content.src"
          :alt="section.content.alt || 'Image'"
          class="max-w-full h-auto rounded-lg"
        />
        <div v-else class="bg-gray-200 rounded-lg py-20 px-10 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Aucune image</p>
        </div>
        <p v-if="section.content?.caption" class="mt-2 text-sm" :style="{ color: section.style?.textColor, opacity: 0.7 }">
          {{ section.content.caption }}
        </p>
      </div>
    </template>
    
    <!-- FAQ -->
    <template v-else-if="section.type === 'faq'">
      <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
        <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8" :style="{ color: section.style?.textColor, textAlign: section.style?.alignment }">
          {{ section.content.title }}
        </h2>
        <div class="space-y-4">
          <div 
            v-for="(item, index) in (section.content?.items || [])" 
            :key="index"
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div class="p-4 font-semibold bg-gray-50" :style="{ color: section.style?.textColor }">
              {{ item.question }}
            </div>
            <div class="p-4" :style="{ color: section.style?.textColor }">
              {{ item.answer }}
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Contact -->
    <template v-else-if="section.type === 'contact'">
      <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
        <h2 v-if="section.content?.title" class="text-3xl font-bold mb-6" :style="{ color: section.style?.textColor }">
          {{ section.content.title }}
        </h2>
        <div class="space-y-3" :style="{ color: section.style?.textColor }">
          <p v-if="section.content?.email" class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ section.content.email }}
          </p>
          <p v-if="section.content?.phone" class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {{ section.content.phone }}
          </p>
          <p v-if="section.content?.address" class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ section.content.address }}
          </p>
        </div>
      </div>
    </template>
    
    <!-- Pricing -->
    <template v-else-if="section.type === 'pricing'">
      <div :style="{ maxWidth: section.style?.maxWidth || '400px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h3 class="text-2xl font-bold mb-2" :style="{ color: section.style?.textColor }">
            {{ section.content?.title || 'Notre offre' }}
          </h3>
          <div class="my-6">
            <span class="text-5xl font-bold text-primary">
              {{ section.content?.price || '99€' }}
            </span>
            <span class="text-gray-500">{{ section.content?.period || '/mois' }}</span>
          </div>
          <p v-if="section.content?.description" class="text-gray-600 mb-6">
            {{ section.content.description }}
          </p>
          <ul v-if="section.content?.features" class="text-left space-y-3 mb-8">
            <li v-for="(feature, i) in section.content.features" :key="i" class="flex items-center gap-2">
              <svg class="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>
          <a
            v-if="section.content?.button"
            :href="section.content.button.url || '#'"
            class="block w-full py-3 rounded-lg font-semibold text-white bg-primary hover:opacity-90 transition-opacity"
          >
            {{ section.content.button.text || 'Commencer' }}
          </a>
        </div>
      </div>
    </template>
    
    <!-- Spacer -->
    <template v-else-if="section.type === 'spacer'">
      <div class="w-full"></div>
    </template>
    
    <!-- Divider -->
    <template v-else-if="section.type === 'divider'">
      <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
        <hr :style="{ 
          borderColor: section.content?.color || '#e5e7eb',
          borderStyle: section.content?.style || 'solid',
          width: section.content?.width || '100%'
        }" />
      </div>
    </template>
    
    <!-- Fallback pour types non implémentés -->
    <template v-else>
      <div class="p-8 text-center text-gray-500 bg-gray-100 rounded-lg mx-auto" style="max-width: 600px;">
        <p class="font-medium">Section: {{ section.type }}</p>
        <p class="text-sm mt-1">Ce type de bloc sera disponible prochainement</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PageSection } from '~/composables/useWebsiteBuilder'

const props = defineProps<{
  section: PageSection
}>()

// Style calculé de la section
const sectionStyle = computed(() => {
  const style = props.section.style || {}
  const padding = style.padding || { top: 40, bottom: 40 }
  
  return {
    backgroundColor: style.backgroundColor || 'transparent',
    paddingTop: `${padding.top}px`,
    paddingBottom: `${padding.bottom}px`,
    backgroundImage: style.backgroundImage ? `url(${style.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative' as const
  }
})

// Convertir les tailles de texte Tailwind en CSS
const getFontSize = (size: string): string => {
  const sizes: Record<string, string> = {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem'
  }
  return sizes[size] || size
}

// Mapping des icônes
const getIconPath = (icon: string): string => {
  const icons: Record<string, string> = {
    check: 'M5 13l4 4L19 7',
    star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    zap: 'M13 10V3L4 14h7v7l9-11h-7z',
    shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    box: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    layers: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    globe: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    truck: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
    refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    headphones: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
    default: 'M5 13l4 4L19 7'
  }
  return icons[icon] || icons.default
}
</script>
