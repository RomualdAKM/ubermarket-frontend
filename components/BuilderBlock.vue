<template>
  <div 
    :id="section.advanced?.cssId || undefined"
    :class="section.advanced?.cssClasses || undefined"
    :style="sectionStyle"
  >
    <!-- Background overlay pour images -->
    <div 
      v-if="(section.style?.backgroundType === 'image' || section.style?.backgroundType === 'video') && section.style?.backgroundOverlay" 
      class="absolute inset-0 pointer-events-none z-[1]"
      :style="{ backgroundColor: `rgba(0, 0, 0, ${(section.style.backgroundOverlay || 0) / 100})` }"
    ></div>
    
    <!-- Contenu de la section avec z-index relatif -->
    <div class="relative z-10">
    
    <!-- ==================== HERO ==================== -->
    <template v-if="section.type === 'hero'">
      
      <!-- HERO: Layout Slider -->
      <template v-if="section.content?.layout === 'slider'">
        <div class="hero-slider relative overflow-hidden" :style="{ minHeight: getHeroHeight }">
          <!-- Slides -->
          <div 
            class="flex transition-transform duration-500 ease-out h-full"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div 
              v-for="(slide, index) in (section.content?.slides || [])"
              :key="index"
              class="w-full flex-shrink-0 relative flex items-center justify-center"
              :style="{ 
                minHeight: getHeroHeight,
                backgroundImage: slide.image ? `url(${slide.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: slide.backgroundColor || '#0a0a0a'
              }"
            >
              <div 
                v-if="slide.image" 
                class="absolute inset-0" 
                :style="{ backgroundColor: `rgba(0,0,0,${(section.style?.backgroundOverlay || 50) / 100})` }"
              ></div>
              <div class="relative z-10 text-center px-4" :style="{ maxWidth: section.style?.maxWidth || '900px' }">
                <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" :style="{ color: section.style?.textColor || '#ffffff' }">
                  {{ slide.title }}
                </h2>
                <p class="text-lg md:text-xl mb-8 opacity-90" :style="{ color: section.style?.textColor || '#ffffff' }">
                  {{ slide.subtitle }}
                </p>
                <a
                  v-if="slide.button"
                  :href="slide.button.url || '#'"
                  class="inline-block px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                  :style="getButtonStyle"
                >
                  {{ slide.button.text }}
                </a>
              </div>
            </div>
          </div>
          
          <!-- Navigation Arrows -->
          <template v-if="section.content?.showArrows !== false && (section.content?.slides?.length || 0) > 1">
            <button 
              @click="prevSlide" 
              class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all z-20"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              @click="nextSlide" 
              class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all z-20"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </template>
          
          <!-- Dots -->
          <div v-if="section.content?.showDots !== false && (section.content?.slides?.length || 0) > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            <button 
              v-for="(slide, idx) in (section.content?.slides || [])" 
              :key="idx"
              @click="currentSlide = Number(idx)"
              class="w-3 h-3 rounded-full transition-all"
              :class="currentSlide === Number(idx) ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'"
            ></button>
          </div>
        </div>
      </template>
      
      <!-- HERO: Layout Split Image -->
      <template v-else-if="section.content?.layout === 'split'">
        <div 
          class="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]"
          :class="section.content?.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''"
        >
          <div class="flex flex-col justify-center p-8 lg:p-16" :style="{ backgroundColor: section.style?.backgroundColor }">
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" :style="getTitleStyle">
              {{ section.content?.title || 'Titre' }}
            </h1>
            <p class="text-lg mb-8 opacity-80" :style="getSubtitleStyle">
              {{ section.content?.subtitle || 'Sous-titre' }}
            </p>
            <div class="flex flex-wrap gap-4">
              <a
                v-if="section.content?.button"
                :href="section.content.button.url || '#'"
                class="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                :style="getButtonStyle"
              >
                {{ section.content.button.text }}
              </a>
              <a
                v-if="section.content?.secondaryButton"
                :href="section.content.secondaryButton.url || '#'"
                class="inline-block px-6 py-3 rounded-lg font-semibold transition-all border-2 hover:scale-105"
                :style="{ borderColor: section.style?.textColor, color: section.style?.textColor }"
              >
                {{ section.content.secondaryButton.text }}
              </a>
            </div>
          </div>
          <div 
            class="relative min-h-[300px] lg:min-h-full bg-gray-100"
            :class="section.content?.imagePosition === 'left' ? 'order-first' : ''"
          >
            <img 
              v-if="section.content?.image"
              :src="section.content.image" 
              alt="" 
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </template>
      
      <!-- HERO: Layout Product Showcase -->
      <template v-else-if="section.content?.layout === 'product'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1.5rem' }">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="relative">
              <img 
                v-if="section.content?.image"
                :src="section.content.image" 
                alt="" 
                class="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div v-else class="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
                <svg class="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div>
              <span 
                v-if="section.content?.badge" 
                class="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4"
                :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"
              >
                {{ section.content.badge }}
              </span>
              <h1 class="text-3xl md:text-4xl font-bold mb-4" :style="getTitleStyle">
                {{ section.content?.title || 'Produit' }}
              </h1>
              <p class="text-lg mb-6 opacity-80" :style="getSubtitleStyle">
                {{ section.content?.subtitle }}
              </p>
              <div class="flex items-baseline gap-3 mb-6">
                <span class="text-4xl font-bold" :style="{ color: section.style?.textColor }">
                  {{ section.content?.price }}
                </span>
                <span v-if="section.content?.originalPrice" class="text-xl line-through opacity-50" :style="{ color: section.style?.textColor }">
                  {{ section.content?.originalPrice }}
                </span>
              </div>
              <ul v-if="section.content?.features" class="space-y-2 mb-8">
                <li 
                  v-for="(feature, i) in section.content.features" 
                  :key="i"
                  class="flex items-center gap-2"
                  :style="{ color: section.style?.textColor }"
                >
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ feature }}
                </li>
              </ul>
              <a
                v-if="section.content?.button"
                :href="section.content.button.url || '#'"
                class="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-xl"
                :style="getButtonStyle"
              >
                {{ section.content.button.text }}
              </a>
            </div>
          </div>
        </div>
      </template>
      
      <!-- HERO: Layout Stats -->
      <template v-else-if="section.content?.stats">
        <div :style="{ maxWidth: section.style?.maxWidth || '1100px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold mb-4" :style="getTitleStyle">
              {{ section.content?.title || 'Titre' }}
            </h1>
            <p v-if="section.content?.subtitle" class="text-xl opacity-80" :style="getSubtitleStyle">
              {{ section.content.subtitle }}
            </p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div 
              v-for="(stat, index) in section.content.stats" 
              :key="index"
              class="text-center"
            >
              <div class="text-4xl md:text-5xl font-bold mb-2" :style="{ color: section.style?.textColor }">
                {{ stat.value }}
              </div>
              <div class="text-sm opacity-70" :style="{ color: section.style?.textColor }">
                {{ stat.label }}
              </div>
            </div>
          </div>
          <div v-if="section.content?.button" class="text-center">
            <a
              :href="section.content.button.url || '#'"
              class="inline-block px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              :style="getButtonStyle"
            >
              {{ section.content.button.text }}
            </a>
          </div>
        </div>
      </template>
      
      <!-- HERO: Layout Dual CTA -->
      <template v-else-if="section.content?.leftCta && section.content?.rightCta">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold mb-4" :style="getTitleStyle">
              {{ section.content?.title || 'Titre' }}
            </h1>
            <p v-if="section.content?.subtitle" class="text-xl opacity-80" :style="getSubtitleStyle">
              {{ section.content.subtitle }}
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              class="p-8 rounded-2xl border-2 transition-all hover:shadow-xl hover:-translate-y-1"
              :style="{ borderColor: section.style?.textColor + '20', backgroundColor: section.style?.textColor + '05' }"
            >
              <div class="w-16 h-16 rounded-xl mb-6 flex items-center justify-center" :style="{ backgroundColor: section.style?.textColor + '15' }">
                <svg class="w-8 h-8" :style="{ color: section.style?.textColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold mb-3" :style="{ color: section.style?.textColor }">
                {{ section.content.leftCta.title }}
              </h3>
              <p class="mb-6 opacity-70" :style="{ color: section.style?.textColor }">
                {{ section.content.leftCta.description }}
              </p>
              <a
                :href="section.content.leftCta.button?.url || '#'"
                class="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                :style="getButtonStyle"
              >
                {{ section.content.leftCta.button?.text || 'Action' }}
              </a>
            </div>
            <div 
              class="p-8 rounded-2xl border-2 transition-all hover:shadow-xl hover:-translate-y-1"
              :style="{ borderColor: section.style?.textColor + '20', backgroundColor: section.style?.textColor + '05' }"
            >
              <div class="w-16 h-16 rounded-xl mb-6 flex items-center justify-center" :style="{ backgroundColor: section.style?.textColor + '15' }">
                <svg class="w-8 h-8" :style="{ color: section.style?.textColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold mb-3" :style="{ color: section.style?.textColor }">
                {{ section.content.rightCta.title }}
              </h3>
              <p class="mb-6 opacity-70" :style="{ color: section.style?.textColor }">
                {{ section.content.rightCta.description }}
              </p>
              <a
                :href="section.content.rightCta.button?.url || '#'"
                class="inline-block px-6 py-3 rounded-lg font-semibold border-2 transition-all hover:scale-105"
                :style="{ borderColor: section.style?.textColor, color: section.style?.textColor }"
              >
                {{ section.content.rightCta.button?.text || 'Action' }}
              </a>
            </div>
          </div>
        </div>
      </template>
      
      <!-- HERO: Layout Slider Cards -->
      <template v-else-if="section.content?.layout === 'slider-cards'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1400px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8" :style="{ color: section.style?.textColor }">
            {{ section.content.title }}
          </h2>
          <div class="relative">
            <div class="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              <a 
                v-for="(card, index) in (section.content?.cards || [])" 
                :key="index"
                :href="card.url || '#'"
                class="flex-shrink-0 w-72 snap-start group"
              >
                <div class="relative h-80 rounded-2xl overflow-hidden mb-4">
                  <img 
                    v-if="card.image"
                    :src="card.image" 
                    :alt="card.title" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div class="absolute bottom-4 left-4 right-4">
                    <h3 class="text-xl font-bold text-white">{{ card.title }}</h3>
                    <p class="text-white/80">{{ card.subtitle }}</p>
                  </div>
                </div>
              </a>
            </div>
            <button 
              v-if="section.content?.showArrows"
              class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-all"
              :style="{ color: section.style?.textColor }"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              v-if="section.content?.showArrows"
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-all"
              :style="{ color: section.style?.textColor }"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </template>
      
      <!-- HERO: Layout Countdown/Launch -->
      <template v-else-if="section.content?.showCountdown">
        <div :style="{ maxWidth: section.style?.maxWidth || '700px', margin: '0 auto', padding: '0 1rem' }" class="text-center">
          <span 
            v-if="section.content?.badge" 
            class="inline-block px-4 py-1 text-sm font-bold rounded-full mb-6 tracking-wider"
            :style="{ backgroundColor: section.style?.textColor + '20', color: section.style?.textColor }"
          >
            {{ section.content.badge }}
          </span>
          <h1 class="text-4xl md:text-5xl font-bold mb-4" :style="getTitleStyle">
            {{ section.content?.title || 'Titre' }}
          </h1>
          <p v-if="section.content?.subtitle" class="text-xl mb-10 opacity-80" :style="getSubtitleStyle">
            {{ section.content.subtitle }}
          </p>
          <div class="flex justify-center gap-4 md:gap-8 mb-10">
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownDays }}</div>
              <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Jours</div>
            </div>
            <div class="text-2xl font-bold opacity-30" :style="{ color: section.style?.textColor }">:</div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownHours }}</div>
              <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Heures</div>
            </div>
            <div class="text-2xl font-bold opacity-30" :style="{ color: section.style?.textColor }">:</div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownMinutes }}</div>
              <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Minutes</div>
            </div>
            <div class="text-2xl font-bold opacity-30" :style="{ color: section.style?.textColor }">:</div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownSeconds }}</div>
              <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Secondes</div>
            </div>
          </div>
          <div v-if="section.content?.emailCapture" class="flex gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              :placeholder="section.content?.placeholder || 'Votre email'" 
              class="flex-1 px-4 py-3 rounded-lg border-0 bg-white/10 backdrop-blur-sm"
              :style="{ color: section.style?.textColor }"
            />
            <button 
              class="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              :style="getButtonStyle"
            >
              {{ section.content?.button?.text || 'Notifier' }}
            </button>
          </div>
        </div>
      </template>
      
      <!-- HERO: Layout par défaut (centré) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '1024px', margin: '0 auto', padding: '0 1rem' }">
          <div :style="{ textAlign: section.style?.alignment || 'center' }">
            <span 
              v-if="section.content?.badge" 
              class="inline-block px-4 py-1 text-sm font-semibold rounded-full mb-6"
              :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"
            >
              {{ section.content.badge }}
            </span>
            <h1 
              class="mb-4"
              :style="getTitleStyle"
            >
              {{ section.content?.title || 'Titre principal' }}
            </h1>
            <p 
              class="mb-8"
              :style="getSubtitleStyle"
            >
              {{ section.content?.subtitle || 'Sous-titre' }}
            </p>
            <div v-if="section.content?.button" class="flex flex-wrap gap-4" :style="{ justifyContent: section.style?.alignment === 'left' ? 'flex-start' : section.style?.alignment === 'right' ? 'flex-end' : 'center' }">
              <a
                :href="section.content.button.url || '#'"
                :target="section.content.button.target || '_self'"
                class="inline-block rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
                :class="getButtonClasses"
                :style="getButtonStyle"
              >
                {{ section.content.button.text || 'Bouton' }}
              </a>
              <a
                v-if="section.content?.secondaryButton"
                :href="section.content.secondaryButton.url || '#'"
                class="inline-block px-6 py-3 rounded-lg font-semibold transition-all border-2 hover:scale-105"
                :style="{ borderColor: section.style?.textColor, color: section.style?.textColor }"
              >
                {{ section.content.secondaryButton.text }}
              </a>
            </div>
          </div>
        </div>
      </template>
      
    </template>
    
    <!-- ==================== FEATURES ==================== -->
    <template v-else-if="section.type === 'features'">
      
      <!-- FEATURES: Layout Bento Grid -->
      <template v-if="section.content?.layout === 'bento'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl md:text-4xl font-bold text-center mb-12" :style="{ color: section.style?.textColor }">
            {{ section.content.title }}
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            <div 
              v-for="(item, index) in (section.content?.items || [])" 
              :key="index"
              class="rounded-2xl p-6 flex flex-col justify-end transition-transform hover:scale-[1.02]"
              :class="[
                item.size === 'large' ? 'col-span-2 row-span-2' : '',
                item.size === 'medium' ? 'col-span-2' : '',
                item.size === 'small' ? 'col-span-1' : ''
              ]"
              :style="{ backgroundColor: section.style?.textColor + '10' }"
            >
              <div class="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" :style="{ backgroundColor: section.style?.textColor + '20' }">
                <svg class="w-5 h-5" :style="{ color: section.style?.textColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="getIconPath(item.icon)" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-1" :style="{ color: section.style?.textColor }">{{ item.title }}</h3>
              <p class="text-sm opacity-70" :style="{ color: section.style?.textColor }">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FEATURES: Layout Timeline -->
      <template v-else-if="section.content?.layout === 'timeline'">
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold mb-4" :style="{ color: section.style?.textColor }">
              {{ section.content?.title || 'Comment \u00e7a marche' }}
            </h2>
            <p v-if="section.content?.subtitle" class="text-lg opacity-70" :style="{ color: section.style?.textColor }">
              {{ section.content.subtitle }}
            </p>
          </div>
          <div class="relative">
            <div class="absolute left-8 top-0 bottom-0 w-0.5" :style="{ backgroundColor: section.style?.textColor + '20' }"></div>
            <div class="space-y-8">
              <div 
                v-for="(item, index) in (section.content?.items || [])" 
                :key="index"
                class="relative flex gap-6 items-start"
              >
                <div 
                  class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 z-10"
                  :style="{ backgroundColor: section.style?.textColor, color: section.style?.backgroundColor || '#ffffff' }"
                >
                  {{ item.step || index + 1 }}
                </div>
                <div class="pt-3">
                  <h3 class="text-xl font-semibold mb-2" :style="{ color: section.style?.textColor }">{{ item.title }}</h3>
                  <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FEATURES: Layout Process Horizontal -->
      <template v-else-if="section.content?.layout === 'process'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl md:text-4xl font-bold text-center mb-12" :style="{ color: section.style?.textColor }">
            {{ section.content.title }}
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
            <div class="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5" :style="{ backgroundColor: section.style?.textColor + '20' }"></div>
            <div 
              v-for="(item, index) in (section.content?.items || [])" 
              :key="index"
              class="text-center relative"
            >
              <div 
                class="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center relative z-10"
                :style="{ backgroundColor: section.style?.textColor + '10' }"
              >
                <span class="text-3xl font-bold" :style="{ color: section.style?.textColor }">{{ item.step || index + 1 }}</span>
              </div>
              <h3 class="text-lg font-semibold mb-2" :style="{ color: section.style?.textColor }">{{ item.title }}</h3>
              <p class="text-sm opacity-70" :style="{ color: section.style?.textColor }">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FEATURES: Layout Comparison -->
      <template v-else-if="section.content?.layout === 'comparison'">
        <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold mb-4" :style="{ color: section.style?.textColor }">
              {{ section.content?.title || 'Comparatif' }}
            </h2>
            <p v-if="section.content?.subtitle" class="text-lg opacity-70" :style="{ color: section.style?.textColor }">
              {{ section.content.subtitle }}
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="p-8 rounded-2xl" :style="{ backgroundColor: '#fee2e2' }">
              <h3 class="text-xl font-bold mb-6 text-red-700">{{ section.content?.leftColumn?.title || 'Les autres' }}</h3>
              <ul class="space-y-4">
                <li v-for="(item, idx) in (section.content?.leftColumn?.items || [])" :key="idx" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-red-800">{{ item }}</span>
                </li>
              </ul>
            </div>
            <div class="p-8 rounded-2xl" :style="{ backgroundColor: '#dcfce7' }">
              <h3 class="text-xl font-bold mb-6 text-green-700">{{ section.content?.rightColumn?.title || 'Notre solution' }}</h3>
              <ul class="space-y-4">
                <li v-for="(item, idx) in (section.content?.rightColumn?.items || [])" :key="idx" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-green-800">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FEATURES: Layout Stats -->
      <template v-else-if="section.content?.layout === 'stats'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1100px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl md:text-4xl font-bold text-center mb-12" :style="{ color: section.style?.textColor }">
            {{ section.content.title }}
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div v-for="(stat, idx) in (section.content?.stats || [])" :key="idx" class="text-center">
              <div class="text-4xl md:text-5xl font-bold mb-2" :style="{ color: section.style?.textColor }">{{ stat.value }}</div>
              <div class="text-sm opacity-70" :style="{ color: section.style?.textColor }">{{ stat.label }}</div>
            </div>
          </div>
          <div v-if="section.content?.features" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="(item, idx) in section.content.features" 
              :key="idx"
              class="flex gap-4 p-6 rounded-xl"
              :style="{ backgroundColor: section.style?.textColor + '10' }"
            >
              <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: section.style?.textColor + '20' }">
                <svg class="w-6 h-6" :style="{ color: section.style?.textColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="getIconPath(item.icon)" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold mb-1" :style="{ color: section.style?.textColor }">{{ item.title }}</h3>
                <p class="text-sm opacity-70" :style="{ color: section.style?.textColor }">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FEATURES: Layout Alternating (Zigzag) -->
      <template v-else-if="section.content?.layout === 'alternating'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <div class="space-y-20">
            <div 
              v-for="(item, index) in (section.content?.items || [])" 
              :key="index"
              class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div :class="index % 2 === 1 ? 'lg:order-2' : ''">
                <h3 class="text-2xl md:text-3xl font-bold mb-4" :style="{ color: section.style?.textColor }">
                  {{ item.title }}
                </h3>
                <p class="text-lg opacity-80 mb-6" :style="{ color: section.style?.textColor }">
                  {{ item.description }}
                </p>
                <a 
                  v-if="item.button"
                  :href="item.button.url || '#'"
                  class="inline-flex items-center gap-2 font-semibold transition-all hover:gap-3"
                  :style="{ color: section.style?.textColor }"
                >
                  {{ item.button.text }}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
              <div :class="index % 2 === 1 ? 'lg:order-1' : ''">
                <img 
                  v-if="item.image"
                  :src="item.image" 
                  :alt="item.title" 
                  class="w-full rounded-2xl shadow-xl"
                />
                <div v-else class="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                  <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FEATURES: Layout Showcase -->
      <template v-else-if="section.content?.layout === 'showcase'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1100px', margin: '0 auto', padding: '0 1rem' }">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span 
                v-if="section.content?.badge" 
                class="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4"
                :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"
              >
                {{ section.content.badge }}
              </span>
              <h2 class="text-3xl md:text-4xl font-bold mb-4" :style="{ color: section.style?.textColor }">
                {{ section.content?.title }}
              </h2>
              <p class="text-lg opacity-80 mb-8" :style="{ color: section.style?.textColor }">
                {{ section.content?.description }}
              </p>
              <ul v-if="section.content?.features" class="space-y-3 mb-8">
                <li 
                  v-for="(feature, idx) in section.content.features" 
                  :key="idx"
                  class="flex items-center gap-3"
                  :style="{ color: section.style?.textColor }"
                >
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ feature }}
                </li>
              </ul>
              <a 
                v-if="section.content?.button"
                :href="section.content.button.url || '#'"
                class="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                :style="getButtonStyle"
              >
                {{ section.content.button.text }}
              </a>
            </div>
            <div>
              <img 
                v-if="section.content?.image"
                :src="section.content.image" 
                alt="" 
                class="w-full rounded-2xl shadow-2xl"
              />
              <div v-else class="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FEATURES: Layout Tabs -->
      <template v-else-if="section.content?.layout === 'tabs'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1100px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl md:text-4xl font-bold text-center mb-10" :style="{ color: section.style?.textColor }">
            {{ section.content.title }}
          </h2>
          <div class="flex justify-center gap-2 mb-10">
            <button 
              v-for="(tab, idx) in (section.content?.tabs || [])" 
              :key="idx"
              @click="activeTab = Number(idx)"
              class="px-6 py-3 rounded-lg font-medium transition-all"
              :style="activeTab === Number(idx) 
                ? { backgroundColor: section.style?.textColor, color: section.style?.backgroundColor || '#ffffff' }
                : { backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }"
            >
              {{ tab.label }}
            </button>
          </div>
          <div v-if="section.content?.tabs?.[activeTab]" class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 class="text-2xl font-bold mb-4" :style="{ color: section.style?.textColor }">
                {{ section.content.tabs[activeTab].title }}
              </h3>
              <p class="text-lg opacity-80 mb-6" :style="{ color: section.style?.textColor }">
                {{ section.content.tabs[activeTab].description }}
              </p>
              <ul v-if="section.content.tabs[activeTab].features" class="space-y-3">
                <li 
                  v-for="(feature, fidx) in section.content.tabs[activeTab].features" 
                  :key="fidx"
                  class="flex items-center gap-3"
                  :style="{ color: section.style?.textColor }"
                >
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ feature }}
                </li>
              </ul>
            </div>
            <div>
              <img 
                v-if="section.content.tabs[activeTab].image"
                :src="section.content.tabs[activeTab].image" 
                :alt="section.content.tabs[activeTab].title" 
                class="w-full rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </template>
      
      <!-- FEATURES: Layout Checklist -->
      <template v-else-if="section.content?.items && typeof section.content.items[0] === 'string'">
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-10">
            <h2 v-if="section.content?.title" class="text-3xl font-bold mb-3" :style="{ color: section.style?.textColor }">
              {{ section.content.title }}
            </h2>
            <p v-if="section.content?.subtitle" class="opacity-70" :style="{ color: section.style?.textColor }">
              {{ section.content.subtitle }}
            </p>
          </div>
          <div 
            class="grid gap-4"
            :style="{ gridTemplateColumns: `repeat(${section.content?.columns || 2}, 1fr)` }"
          >
            <div 
              v-for="(item, idx) in (section.content?.items || [])" 
              :key="idx"
              class="flex items-center gap-3 p-4 rounded-lg"
              :style="{ backgroundColor: section.style?.textColor + '05' }"
            >
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span :style="{ color: section.style?.textColor }">{{ item }}</span>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FEATURES: Layout par d\u00e9faut (Grille) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
          <div :style="{ textAlign: section.style?.alignment || 'center' }" class="mb-10">
            <h2 v-if="section.content?.title" class="text-3xl md:text-4xl font-bold mb-3" :style="getTitleStyle">
              {{ section.content.title }}
            </h2>
            <p v-if="section.content?.subtitle" :style="getSubtitleStyle">
              {{ section.content.subtitle }}
            </p>
          </div>
          <div 
            class="grid grid-cols-1 gap-8"
            :class="[
              (section.content?.columns || 3) === 2 ? 'md:grid-cols-2' : '',
              (section.content?.columns || 3) === 3 ? 'md:grid-cols-3' : '',
              (section.content?.columns || 3) === 4 ? 'md:grid-cols-4' : ''
            ]"
          >
            <div 
              v-for="(item, index) in (section.content?.items || [])" 
              :key="index"
              class="p-6 rounded-xl transition-all hover:shadow-lg"
              :style="{ backgroundColor: section.style?.textColor + '08' }"
            >
              <div 
                class="w-14 h-14 mb-5 rounded-xl flex items-center justify-center"
                :style="{ backgroundColor: section.style?.textColor + '15' }"
              >
                <svg class="w-7 h-7" :style="{ color: section.style?.textColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="getIconPath(item.icon)" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2" :style="{ color: section.style?.textColor }">{{ item.title }}</h3>
              <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </template>
      
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
        <h2 class="mb-4" :style="getTitleStyle">
          {{ section.content?.title || 'Prêt à commencer ?' }}
        </h2>
        <p v-if="section.content?.subtitle" class="mb-6" :style="getSubtitleStyle">
          {{ section.content.subtitle }}
        </p>
        <div v-if="section.content?.button" :style="{ textAlign: section.content.button?.alignment || 'center' }">
          <a
            :href="section.content.button.url || '#'"
            :target="section.content.button.target || '_self'"
            class="inline-block rounded-lg font-bold transition-all"
            :class="getButtonClasses"
            :style="getButtonStyle"
          >
            {{ section.content.button.text || 'Commencer' }}
          </a>
        </div>
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
          <div v-if="section.content?.button" :style="{ textAlign: section.content.button?.alignment || 'center' }">
            <a
              :href="section.content.button.url || '#'"
              :target="section.content.button.target || '_self'"
              class="block rounded-lg font-semibold transition-all"
              :class="[getButtonClasses, section.content.button?.width !== 'full' ? 'inline-block' : 'w-full']"
              :style="getButtonStyle"
            >
              {{ section.content.button.text || 'Commencer' }}
            </a>
          </div>
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
    
    <!-- Gallery -->
    <template v-else-if="section.type === 'gallery'">
      <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
        <div 
          class="grid gap-4"
          :style="{ gridTemplateColumns: `repeat(${section.content?.columns || 3}, 1fr)` }"
        >
          <div 
            v-for="(image, index) in (section.content?.images || [])" 
            :key="index"
            class="aspect-square bg-gray-100 rounded-lg overflow-hidden"
          >
            <img 
              v-if="image.src" 
              :src="image.src" 
              :alt="image.alt || 'Image'" 
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div v-if="!section.content?.images?.length" class="text-center py-12 text-gray-400">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Aucune image dans la galerie</p>
        </div>
      </div>
    </template>
    
    <!-- Video -->
    <template v-else-if="section.type === 'video'">
      <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem' }">
        <h3 v-if="section.content?.title" class="text-xl font-semibold mb-4 text-center" :style="{ color: section.style?.textColor }">
          {{ section.content.title }}
        </h3>
        <div class="aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <iframe
            v-if="section.content?.url"
            :src="getVideoEmbedUrl(section.content.url)"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p>Ajoutez une URL YouTube ou Vimeo</p>
            </div>
          </div>
        </div>
        <p v-if="section.content?.description" class="mt-3 text-sm text-center opacity-70" :style="{ color: section.style?.textColor }">
          {{ section.content.description }}
        </p>
      </div>
    </template>
    
    <!-- Countdown -->
    <template v-else-if="section.type === 'countdown'">
      <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
        <h2 class="text-2xl md:text-3xl font-bold mb-2" :style="{ color: section.style?.textColor }">
          {{ section.content?.title || 'Offre limitée' }}
        </h2>
        <p v-if="section.content?.subtitle" class="mb-6 opacity-80" :style="{ color: section.style?.textColor }">
          {{ section.content.subtitle }}
        </p>
        <div class="flex justify-center gap-4">
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">00</div>
            <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Jours</div>
          </div>
          <div class="text-3xl font-bold opacity-50" :style="{ color: section.style?.textColor }">:</div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">00</div>
            <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Heures</div>
          </div>
          <div class="text-3xl font-bold opacity-50" :style="{ color: section.style?.textColor }">:</div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">00</div>
            <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Minutes</div>
          </div>
          <div class="text-3xl font-bold opacity-50" :style="{ color: section.style?.textColor }">:</div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">00</div>
            <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Secondes</div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Social -->
    <template v-else-if="section.type === 'social'">
      <div :style="{ maxWidth: section.style?.maxWidth || '400px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
        <h3 v-if="section.content?.title" class="text-lg font-semibold mb-4" :style="{ color: section.style?.textColor }">
          {{ section.content.title }}
        </h3>
        <div class="flex justify-center gap-4">
          <a 
            v-if="section.content?.links?.facebook" 
            :href="section.content.links.facebook" 
            target="_blank"
            class="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a 
            v-if="section.content?.links?.instagram" 
            :href="section.content.links.instagram" 
            target="_blank"
            class="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a 
            v-if="section.content?.links?.twitter" 
            :href="section.content.links.twitter" 
            target="_blank"
            class="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a 
            v-if="section.content?.links?.youtube" 
            :href="section.content.links.youtube" 
            target="_blank"
            class="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a 
            v-if="section.content?.links?.linkedin" 
            :href="section.content.links.linkedin" 
            target="_blank"
            class="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>
        <div v-if="!hasAnySocialLink" class="py-8 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p class="text-sm">Ajoutez vos liens de réseaux sociaux</p>
        </div>
      </div>
    </template>
    
    <!-- Fallback pour types non implémentés -->
    <template v-else>
      <div class="p-8 text-center text-gray-500 bg-gray-100 rounded-lg mx-auto" style="max-width: 600px;">
        <p class="font-medium">Section: {{ section.type }}</p>
        <p class="text-sm mt-1">Ce type de bloc sera disponible prochainement</p>
      </div>
    </template>
    </div><!-- Fin du contenu z-10 -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

// Type local
interface PageSection {
  id: string
  type: string
  template: string
  order: number
  content?: Record<string, any>
  style?: {
    alignment?: 'left' | 'center' | 'right'
    maxWidth?: string
    backgroundColor?: string
    textColor?: string
    backgroundImage?: string
    backgroundType?: 'color' | 'gradient' | 'image' | 'video'
    backgroundGradient?: string
    backgroundOverlay?: number
    height?: 'auto' | 'small' | 'medium' | 'large' | 'full'
    verticalSpacing?: 'none' | 'small' | 'medium' | 'large'
    horizontalSpacing?: 'none' | 'small' | 'medium' | 'large'
    padding?: {
      top: number
      bottom: number
    }
  }
  typography?: {
    titleFont?: string
    titleSize?: 'small' | 'medium' | 'large' | 'xlarge'
    titleWeight?: '400' | '500' | '600' | '700' | '800'
    titleColor?: string
    titleLetterSpacing?: 'tight' | 'normal' | 'wide'
    titleTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    titleLineHeight?: 'tight' | 'normal' | 'relaxed'
    subtitleFont?: string
    subtitleSize?: 'small' | 'medium' | 'large'
    subtitleOpacity?: number
    subtitleColor?: string
  }
  animation?: {
    type?: string
    duration?: number
    delay?: number
    scrollTrigger?: boolean
  }
  advanced?: {
    cssId?: string
    cssClasses?: string
    elementSpacing?: 'none' | 'small' | 'medium' | 'large'
    verticalAlign?: 'top' | 'center' | 'bottom'
  }
}

const props = defineProps<{
  section: PageSection
}>()

// Slider state
const currentSlide = ref(0)
let slideInterval: ReturnType<typeof setInterval> | null = null

// Slider navigation
const prevSlide = () => {
  const slides = props.section.content?.slides || []
  currentSlide.value = currentSlide.value === 0 ? slides.length - 1 : currentSlide.value - 1
}

const nextSlide = () => {
  const slides = props.section.content?.slides || []
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

// Autoplay slider
onMounted(() => {
  if (props.section.content?.layout === 'slider' && props.section.content?.autoplay) {
    const speed = props.section.content?.autoplaySpeed || 5000
    slideInterval = setInterval(nextSlide, speed)
  }
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})

// Hero height
const getHeroHeight = computed(() => {
  const heightMap: Record<string, string> = {
    'auto': 'auto',
    'small': '400px',
    'medium': '550px',
    'large': '700px',
    'full': '100vh'
  }
  return heightMap[props.section.style?.height || 'large'] || '700px'
})

// Countdown
const countdownDays = ref('00')
const countdownHours = ref('00')
const countdownMinutes = ref('00')
const countdownSeconds = ref('00')
let countdownInterval: ReturnType<typeof setInterval> | null = null

// Active tab for tabbed content
const activeTab = ref(0)

const updateCountdown = () => {
  const launchDate = props.section.content?.launchDate
  if (!launchDate) return
  
  const target = new Date(launchDate).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  countdownDays.value = String(days).padStart(2, '0')
  countdownHours.value = String(hours).padStart(2, '0')
  countdownMinutes.value = String(minutes).padStart(2, '0')
  countdownSeconds.value = String(seconds).padStart(2, '0')
}

onMounted(() => {
  if (props.section.content?.showCountdown) {
    updateCountdown()
    countdownInterval = setInterval(updateCountdown, 1000)
  }
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

// Style calculé de la section
const sectionStyle = computed(() => {
  const style = props.section.style || {}
  const advanced = props.section.advanced
  
  // Calculer la hauteur basée sur la propriété height
  const heightMap: Record<string, string> = {
    'auto': 'auto',
    'small': '300px',
    'medium': '500px',
    'large': '700px',
    'full': '100vh'
  }
  
  // Calculer le padding vertical basé sur verticalSpacing
  const vSpacingMap: Record<string, number> = {
    'none': 0,
    'small': 24,
    'medium': 48,
    'large': 80
  }
  
  // Calculer le padding horizontal basé sur horizontalSpacing
  const hSpacingMap: Record<string, string> = {
    'none': '0',
    'small': '1rem',
    'medium': '2rem',
    'large': '4rem'
  }
  
  const verticalPadding = style.verticalSpacing 
    ? vSpacingMap[style.verticalSpacing] || 40
    : 40
  
  const horizontalPadding = style.horizontalSpacing 
    ? hSpacingMap[style.horizontalSpacing] || '1rem'
    : '1rem'
  
  // Déterminer le background en fonction du type
  const backgroundType = style.backgroundType || 'color'
  
  const result: Record<string, any> = {
    paddingTop: `${verticalPadding}px`,
    paddingBottom: `${verticalPadding}px`,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    position: 'relative',
    minHeight: heightMap[style.height || 'auto'] || 'auto',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
  
  // Appliquer le background selon le type
  if (backgroundType === 'gradient' && style.backgroundGradient) {
    result.background = style.backgroundGradient
  } else if (backgroundType === 'image' && style.backgroundImage) {
    result.backgroundImage = `url(${style.backgroundImage})`
    result.backgroundColor = style.backgroundColor || 'transparent'
  } else {
    // Type 'color' ou défaut
    result.backgroundColor = style.backgroundColor || 'transparent'
  }
  
  // Animation
  if (props.section.animation?.type && props.section.animation.type !== 'none') {
    result.animation = `${props.section.animation.type} ${props.section.animation.duration || 500}ms ease-out ${props.section.animation.delay || 0}ms both`
  }
  
  return result
})

// Vérifier si au moins un lien social est défini
const hasAnySocialLink = computed(() => {
  const links = props.section.content?.links as Record<string, string> | undefined
  if (!links) return false
  return Object.values(links).some((link: string) => link && link.trim() !== '')
})

// Convertir URL YouTube/Vimeo en URL d'embed
const getVideoEmbedUrl = (url: string): string => {
  if (!url) return ''
  
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  return url
}

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
    '6xl': '3.75rem',
    // Nouvelles tailles de typographie
    'small': '1.875rem',  // 3xl
    'medium': '2.25rem',  // 4xl
    'large': '3rem',      // 5xl
    'xlarge': '3.75rem'   // 6xl
  }
  return sizes[size] || size
}

// Taille des sous-titres
const getSubtitleSize = (size: string): string => {
  const sizes: Record<string, string> = {
    'small': '1rem',
    'medium': '1.25rem',
    'large': '1.5rem'
  }
  return sizes[size] || '1.25rem'
}

// Computed pour le style du titre
const getTitleStyle = computed(() => {
  const typo = props.section.typography || {}
  const style = props.section.style || {}
  
  const fontFamilies: Record<string, string> = {
    'system': 'system-ui, -apple-system, sans-serif',
    'inter': "'Inter', sans-serif",
    'poppins': "'Poppins', sans-serif",
    'roboto': "'Roboto', sans-serif",
    'playfair': "'Playfair Display', serif",
    'montserrat': "'Montserrat', sans-serif"
  }
  
  const letterSpacingMap: Record<string, string> = {
    'tight': '-0.025em',
    'normal': '0',
    'wide': '0.05em'
  }
  
  const lineHeightMap: Record<string, string> = {
    'tight': '1.1',
    'normal': '1.3',
    'relaxed': '1.5'
  }
  
  return {
    fontFamily: fontFamilies[typo.titleFont || 'system'],
    fontSize: getFontSize(typo.titleSize || 'medium'),
    fontWeight: typo.titleWeight || '700',
    color: typo.titleColor || style.textColor || '#171717',
    letterSpacing: letterSpacingMap[typo.titleLetterSpacing || 'normal'],
    lineHeight: lineHeightMap[typo.titleLineHeight || 'normal'],
    textTransform: typo.titleTransform || 'none'
  }
})

// Computed pour le style du sous-titre
const getSubtitleStyle = computed(() => {
  const typo = props.section.typography || {}
  const style = props.section.style || {}
  
  return {
    fontSize: getSubtitleSize(typo.subtitleSize || 'medium'),
    color: typo.subtitleColor || style.textColor || '#171717',
    opacity: (typo.subtitleOpacity ?? 80) / 100
  }
})

// Computed pour les classes du bouton
const getButtonClasses = computed(() => {
  const button = props.section.content?.button || {}
  const classes: string[] = []
  
  // Effet hover
  if (button.hoverEffect === 'lift') {
    classes.push('hover:-translate-y-1 hover:shadow-lg')
  } else if (button.hoverEffect === 'glow') {
    classes.push('hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]')
  } else if (button.hoverEffect === 'scale') {
    classes.push('hover:scale-105')
  } else {
    classes.push('hover:opacity-90')
  }
  
  // Largeur
  if (button.width === 'full') {
    classes.push('w-full')
  }
  
  return classes.join(' ')
})

// Computed pour le style du bouton
const getButtonStyle = computed(() => {
  const button = props.section.content?.button || {}
  
  // Tailles
  const sizeMap: Record<string, { px: string; py: string; fontSize: string }> = {
    'small': { px: '1rem', py: '0.5rem', fontSize: '0.875rem' },
    'medium': { px: '1.5rem', py: '0.75rem', fontSize: '1rem' },
    'large': { px: '2rem', py: '1rem', fontSize: '1.125rem' }
  }
  
  const size = sizeMap[button.size || 'medium'] || sizeMap.medium
  
  return {
    backgroundColor: button.color || '#10B981',
    color: button.textColor || '#ffffff',
    paddingLeft: size.px,
    paddingRight: size.px,
    paddingTop: size.py,
    paddingBottom: size.py,
    fontSize: size.fontSize
  }
})

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

<style scoped>
/* Animations */
@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-left {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slide-right {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes zoom {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes bounce {
  0% { opacity: 0; transform: translateY(-30px); }
  50% { transform: translateY(10px); }
  70% { transform: translateY(-5px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
