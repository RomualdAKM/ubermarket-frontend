<template>
  <div 
    :id="section.advanced?.cssId || undefined"
    :class="section.advanced?.cssClasses || undefined"
    :style="sectionStyle"
  >
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
                  {{ item.step || (+index + 1) }}
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
                <span class="text-3xl font-bold" :style="{ color: section.style?.textColor }">{{ item.step || (+index + 1) }}</span>
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
              <div :class="+index % 2 === 1 ? 'lg:order-2' : ''">
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
              <div :class="+index % 2 === 1 ? 'lg:order-1' : ''">
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
    
    <!-- ==================== TESTIMONIALS ==================== -->
    <template v-else-if="section.type === 'testimonials'">
      
      <!-- TESTIMONIALS: Layout Carousel -->
      <template v-if="section.content?.layout === 'carousel'">
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold text-center mb-10" :style="{ color: section.style?.textColor }">
            {{ section.content.title }}
          </h2>
          <div class="relative">
            <div class="overflow-hidden">
              <div 
                class="flex transition-transform duration-500"
                :style="{ transform: `translateX(-${currentTestimonial * 100}%)` }"
              >
                <div 
                  v-for="(item, idx) in (section.content?.items || [])" 
                  :key="idx"
                  class="w-full flex-shrink-0 text-center px-8"
                >
                  <div class="flex justify-center mb-4">
                    <svg v-for="star in 5" :key="star" class="w-5 h-5" :style="{ color: star <= (item.rating || 5) ? '#fbbf24' : '#e5e7eb' }" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p class="text-xl md:text-2xl italic mb-6 leading-relaxed" :style="{ color: section.style?.textColor }">
                    "{{ item.text }}"
                  </p>
                  <div class="flex items-center justify-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-semibold" :style="{ color: section.style?.textColor }">
                      {{ item.name?.charAt(0) }}
                    </div>
                    <div class="text-left">
                      <p class="font-semibold" :style="{ color: section.style?.textColor }">{{ item.name }}</p>
                      <p class="text-sm opacity-70" :style="{ color: section.style?.textColor }">{{ item.role }}<span v-if="item.company">, {{ item.company }}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template v-if="section.content?.showArrows !== false && (section.content?.items?.length || 0) > 1">
              <button @click="prevTestimonial" class="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20" :style="{ color: section.style?.textColor }">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button @click="nextTestimonial" class="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20" :style="{ color: section.style?.textColor }">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </template>
            <div v-if="section.content?.showDots !== false && (section.content?.items?.length || 0) > 1" class="flex justify-center gap-2 mt-8">
              <button 
                v-for="(_, idx) in (section.content?.items || [])" 
                :key="idx" 
                @click="currentTestimonial = Number(idx)"
                class="w-2 h-2 rounded-full transition-all"
                :style="{ backgroundColor: currentTestimonial === Number(idx) ? section.style?.textColor : (section.style?.textColor + '40') }"
              ></button>
            </div>
          </div>
        </div>
      </template>
      
      <!-- TESTIMONIALS: Layout Quote -->
      <template v-else-if="section.content?.layout === 'quote'">
        <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem' }" class="text-center">
          <svg class="w-16 h-16 mx-auto mb-8 opacity-20" :style="{ color: section.style?.textColor }" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p class="text-2xl md:text-3xl lg:text-4xl font-light italic leading-relaxed mb-10" :style="{ color: section.style?.textColor }">
            "{{ section.content?.items?.[0]?.text }}"
          </p>
          <div class="flex items-center justify-center gap-4">
            <div v-if="section.content?.items?.[0]?.avatar" class="w-16 h-16 rounded-full overflow-hidden">
              <img :src="section.content.items[0].avatar" class="w-full h-full object-cover" />
            </div>
            <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold" v-else :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }">
              {{ section.content?.items?.[0]?.name?.charAt(0) }}
            </div>
            <div class="text-left">
              <p class="text-xl font-semibold" :style="{ color: section.style?.textColor }">{{ section.content?.items?.[0]?.name }}</p>
              <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ section.content?.items?.[0]?.role }}<span v-if="section.content?.items?.[0]?.company">, {{ section.content.items[0].company }}</span></p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- TESTIMONIALS: Layout Wall (Masonry) -->
      <template v-else-if="section.content?.layout === 'wall'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold text-center mb-10" :style="{ color: section.style?.textColor }">
            {{ section.content.title }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="(item, idx) in (section.content?.items || [])" 
              :key="idx"
              class="p-5 rounded-xl"
              :style="{ backgroundColor: section.style?.textColor + '08' }"
            >
              <div class="flex mb-3">
                <svg v-for="star in 5" :key="star" class="w-4 h-4" :style="{ color: star <= (item.rating || 5) ? '#fbbf24' : '#e5e7eb' }" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p class="mb-3" :style="{ color: section.style?.textColor }">{{ item.text }}</p>
              <p class="text-sm font-medium" :style="{ color: section.style?.textColor }">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- TESTIMONIALS: Layout Split -->
      <template v-else-if="section.content?.layout === 'split'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div :class="section.content?.imagePosition === 'right' ? 'lg:order-2' : ''">
              <img 
                v-if="section.content?.image"
                :src="section.content.image" 
                class="w-full rounded-2xl shadow-xl"
              />
              <div v-else class="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
                <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div>
              <svg class="w-12 h-12 mb-6 opacity-20" :style="{ color: section.style?.textColor }" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p class="text-xl md:text-2xl leading-relaxed mb-8" :style="{ color: section.style?.textColor }">
                {{ section.content?.text }}
              </p>
              <div class="mb-6">
                <p class="text-lg font-semibold" :style="{ color: section.style?.textColor }">{{ section.content?.name }}</p>
                <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ section.content?.role }}<span v-if="section.content?.company">, {{ section.content.company }}</span></p>
              </div>
              <div v-if="section.content?.stats" class="flex gap-8">
                <div v-for="(stat, idx) in section.content.stats" :key="idx">
                  <p class="text-3xl font-bold" :style="{ color: section.style?.textColor }">{{ stat.value }}</p>
                  <p class="text-sm opacity-70" :style="{ color: section.style?.textColor }">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- TESTIMONIALS: Layout Rating -->
      <template v-else-if="section.content?.layout === 'rating'">
        <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-10">
            <h2 v-if="section.content?.title" class="text-3xl font-bold mb-4" :style="{ color: section.style?.textColor }">
              {{ section.content.title }}
            </h2>
            <div class="flex items-center justify-center gap-4">
              <div class="flex">
                <svg v-for="star in 5" :key="star" class="w-8 h-8" :style="{ color: '#fbbf24' }" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="text-2xl font-bold" :style="{ color: section.style?.textColor }">{{ section.content?.averageRating || '4.9' }}</span>
              <span class="opacity-70" :style="{ color: section.style?.textColor }">({{ section.content?.totalReviews || '0' }} avis)</span>
            </div>
          </div>
          <div class="space-y-4">
            <div 
              v-for="(item, idx) in (section.content?.items || [])" 
              :key="idx"
              class="p-6 rounded-xl border"
              :style="{ borderColor: section.style?.textColor + '20' }"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex">
                  <svg v-for="star in 5" :key="star" class="w-4 h-4" :style="{ color: star <= (item.rating || 5) ? '#fbbf24' : '#e5e7eb' }" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span v-if="item.date" class="text-sm opacity-50" :style="{ color: section.style?.textColor }">{{ item.date }}</span>
              </div>
              <p class="mb-2" :style="{ color: section.style?.textColor }">{{ item.text }}</p>
              <p class="text-sm font-medium" :style="{ color: section.style?.textColor }">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- TESTIMONIALS: Layout Tweets -->
      <template v-else-if="section.content?.layout === 'tweets'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1100px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold text-center mb-10" :style="{ color: section.style?.textColor }">
            {{ section.content.title }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              v-for="(item, idx) in (section.content?.items || [])" 
              :key="idx"
              class="p-5 rounded-xl bg-white shadow-sm border border-gray-100"
            >
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {{ item.name?.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ item.name }}</p>
                  <p class="text-sm text-gray-500">{{ item.username }}</p>
                </div>
                <svg class="w-5 h-5 ml-auto text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <p class="text-gray-700">{{ item.text }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- TESTIMONIALS: Layout Featured -->
      <template v-else-if="section.content?.layout === 'featured'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1000px', margin: '0 auto', padding: '0 1rem' }" class="text-center">
          <span 
            v-if="section.content?.badge" 
            class="inline-block px-4 py-1 text-sm font-bold rounded-full mb-6 tracking-wider"
            :style="{ backgroundColor: 'rgba(255,255,255,0.2)', color: section.style?.textColor }"
          >
            {{ section.content.badge }}
          </span>
          <p class="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-10" :style="{ color: section.style?.textColor }">
            "{{ section.content?.text }}"
          </p>
          <div class="flex items-center justify-center gap-4 mb-10">
            <div v-if="section.content?.image" class="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30">
              <img :src="section.content.image" class="w-full h-full object-cover" />
            </div>
            <div class="text-left">
              <p class="text-xl font-semibold" :style="{ color: section.style?.textColor }">{{ section.content?.name }}</p>
              <p class="opacity-80" :style="{ color: section.style?.textColor }">{{ section.content?.role }}<span v-if="section.content?.company">, {{ section.content.company }}</span></p>
            </div>
          </div>
          <div v-if="section.content?.metrics" class="flex justify-center gap-12">
            <div v-for="(metric, idx) in section.content.metrics" :key="idx" class="text-center">
              <p class="text-4xl font-bold" :style="{ color: section.style?.textColor }">{{ metric.value }}</p>
              <p class="text-sm opacity-70" :style="{ color: section.style?.textColor }">{{ metric.label }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- TESTIMONIALS: Layout par défaut (Cartes) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-10">
            <h2 v-if="section.content?.title" class="text-3xl font-bold mb-3" :style="{ color: section.style?.textColor }">
              {{ section.content.title }}
            </h2>
            <p v-if="section.content?.subtitle" class="opacity-70" :style="{ color: section.style?.textColor }">
              {{ section.content.subtitle }}
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(item, idx) in (section.content?.items || [])" 
              :key="idx"
              class="p-6 rounded-xl"
              :style="{ backgroundColor: section.style?.textColor + '08' }"
            >
              <div v-if="item.rating" class="flex mb-4">
                <svg v-for="star in 5" :key="star" class="w-4 h-4" :style="{ color: star <= item.rating ? '#fbbf24' : '#e5e7eb' }" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p class="mb-6 leading-relaxed" :style="{ color: section.style?.textColor }">"{{ item.text }}"</p>
              <div class="flex items-center gap-3">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
                  :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"
                >
                  {{ item.name?.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold" :style="{ color: section.style?.textColor }">{{ item.name }}</p>
                  <p class="text-sm opacity-70" :style="{ color: section.style?.textColor }">{{ item.role }}<span v-if="item.company">, {{ item.company }}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      
    </template>
    
    <!-- CTA -->
    <template v-else-if="section.type === 'cta'">
      
      <!-- CTA: Layout Newsletter -->
      <template v-if="section.content?.layout === 'newsletter'">
        <div :style="{ maxWidth: section.style?.maxWidth || '550px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h2 class="text-2xl md:text-3xl font-bold mb-3" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
          <p v-if="section.content?.subtitle" class="mb-6 opacity-80" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              :placeholder="section.content?.placeholder || 'Votre email'" 
              class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button class="px-6 py-3 rounded-lg font-semibold transition-all" :style="getButtonStyle">
              {{ section.content?.button?.text || 'S\'abonner' }}
            </button>
          </div>
          <p v-if="section.content?.privacyText" class="mt-4 text-xs opacity-60" :style="{ color: section.style?.textColor }">
            {{ section.content.privacyText }}
          </p>
        </div>
      </template>
      
      <!-- CTA: Layout Banner -->
      <template v-else-if="section.content?.layout === 'banner'">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4" :style="{ maxWidth: section.style?.maxWidth || '100%', margin: '0 auto', padding: '0 1rem' }">
          <div class="flex items-center gap-3">
            <span v-if="section.content?.icon" class="text-2xl">
              {{ section.content.icon === 'gift' ? '🎁' : section.content.icon === 'fire' ? '🔥' : '✨' }}
            </span>
            <div class="text-center sm:text-left">
              <span class="font-bold" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</span>
              <span class="ml-2 opacity-80" :style="{ color: section.style?.textColor }">{{ section.content?.subtitle }}</span>
            </div>
          </div>
          <a 
            v-if="section.content?.button"
            :href="section.content.button.url || '#'"
            class="px-4 py-2 rounded font-semibold text-sm transition-all whitespace-nowrap"
            :style="section.content.button.style === 'white' 
              ? { backgroundColor: '#ffffff', color: '#171717' } 
              : section.content.button.style === 'outline' 
                ? { border: '1px solid currentColor', color: section.style?.textColor } 
                : getButtonStyle"
          >
            {{ section.content.button.text }}
          </a>
        </div>
      </template>
      
      <!-- CTA: Layout Split Image -->
      <template v-else-if="section.content?.layout === 'split'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div :class="section.content?.imagePosition === 'left' ? 'order-2' : ''">
              <h2 class="text-3xl md:text-4xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
              <p class="text-lg mb-6 opacity-80" :style="{ color: section.style?.textColor }">{{ section.content?.subtitle }}</p>
              <ul v-if="section.content?.features" class="space-y-2 mb-8">
                <li v-for="(feat, i) in section.content.features" :key="i" class="flex items-center gap-2" :style="{ color: section.style?.textColor }">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  {{ feat }}
                </li>
              </ul>
              <div class="flex flex-wrap gap-4">
                <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="px-6 py-3 rounded-lg font-semibold transition-all" :style="getButtonStyle">{{ section.content.button.text }}</a>
                <a v-if="section.content?.secondaryButton" :href="section.content.secondaryButton.url || '#'" class="px-6 py-3 rounded-lg font-semibold transition-all border-2" :style="{ borderColor: section.style?.textColor, color: section.style?.textColor }">{{ section.content.secondaryButton.text }}</a>
              </div>
            </div>
            <div :class="section.content?.imagePosition === 'left' ? 'order-1' : ''">
              <img v-if="section.content?.image" :src="section.content.image" alt="" class="w-full rounded-2xl shadow-xl" />
              <div v-else class="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- CTA: Layout Countdown -->
      <template v-else-if="section.content?.layout === 'countdown'">
        <div :style="{ maxWidth: section.style?.maxWidth || '700px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <span v-if="section.content?.badge" class="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4" :style="{ backgroundColor: '#ef4444', color: '#ffffff' }">
            {{ section.content.badge }}
          </span>
          <h2 class="text-2xl md:text-3xl font-bold mb-2" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
          <p v-if="section.content?.subtitle" class="mb-6 opacity-80" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          <div class="flex justify-center gap-4 mb-8">
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownDays }}</div>
              <div class="text-xs uppercase opacity-60" :style="{ color: section.style?.textColor }">Jours</div>
            </div>
            <div class="text-3xl font-bold opacity-30" :style="{ color: section.style?.textColor }">:</div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownHours }}</div>
              <div class="text-xs uppercase opacity-60" :style="{ color: section.style?.textColor }">Heures</div>
            </div>
            <div class="text-3xl font-bold opacity-30" :style="{ color: section.style?.textColor }">:</div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownMinutes }}</div>
              <div class="text-xs uppercase opacity-60" :style="{ color: section.style?.textColor }">Minutes</div>
            </div>
            <div class="text-3xl font-bold opacity-30" :style="{ color: section.style?.textColor }">:</div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownSeconds }}</div>
              <div class="text-xs uppercase opacity-60" :style="{ color: section.style?.textColor }">Secondes</div>
            </div>
          </div>
          <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="inline-block px-8 py-4 rounded-lg font-bold text-lg transition-all" :style="getButtonStyle">{{ section.content.button.text }}</a>
        </div>
      </template>
      
      <!-- CTA: Layout Dual Buttons -->
      <template v-else-if="section.content?.layout === 'dual'">
        <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h2 class="text-2xl md:text-3xl font-bold mb-3" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
          <p v-if="section.content?.subtitle" class="mb-8 opacity-80" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a v-if="section.content?.primaryButton" :href="section.content.primaryButton.url || '#'" class="px-8 py-4 rounded-lg font-semibold transition-all" :style="getButtonStyle">{{ section.content.primaryButton.text }}</a>
            <a v-if="section.content?.secondaryButton" :href="section.content.secondaryButton.url || '#'" class="px-8 py-4 rounded-lg font-semibold transition-all border-2" :style="{ borderColor: section.style?.textColor, color: section.style?.textColor }">{{ section.content.secondaryButton.text }}</a>
          </div>
        </div>
      </template>
      
      <!-- CTA: Layout Card -->
      <template v-else-if="section.content?.layout === 'card'">
        <div :style="{ maxWidth: section.style?.maxWidth || '500px', margin: '0 auto', padding: '0 1rem' }">
          <div class="bg-white rounded-2xl shadow-xl p-8 text-center" :style="{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }">
            <div v-if="section.content?.icon" class="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="text-3xl">{{ section.content.icon === 'rocket' ? '🚀' : '✨' }}</span>
            </div>
            <h2 class="text-2xl font-bold mb-3 text-gray-900">{{ section.content?.title }}</h2>
            <p v-if="section.content?.subtitle" class="text-gray-600 mb-6">{{ section.content.subtitle }}</p>
            <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="block w-full px-6 py-4 rounded-lg font-semibold transition-all mb-4" :style="getButtonStyle">{{ section.content.button.text }}</a>
            <ul v-if="section.content?.features" class="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <li v-for="(feat, i) in section.content.features" :key="i" class="flex items-center gap-1">
                <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                {{ feat }}
              </li>
            </ul>
          </div>
        </div>
      </template>
      
      <!-- CTA: Layout Social Proof -->
      <template v-else-if="section.content?.layout === 'social-proof'">
        <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h2 class="text-2xl md:text-3xl font-bold mb-3" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
          <p v-if="section.content?.subtitle" class="mb-8 opacity-80" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          <div v-if="section.content?.stats" class="grid grid-cols-3 gap-6 mb-10">
            <div v-for="(stat, i) in section.content.stats" :key="i">
              <div class="text-3xl md:text-4xl font-bold" :style="{ color: section.style?.textColor }">{{ stat.value }}</div>
              <div class="text-sm opacity-60" :style="{ color: section.style?.textColor }">{{ stat.label }}</div>
            </div>
          </div>
          <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="inline-block px-8 py-4 rounded-lg font-semibold transition-all" :style="getButtonStyle">{{ section.content.button.text }}</a>
          <p v-if="section.content?.avatarsText" class="mt-6 text-sm opacity-60" :style="{ color: section.style?.textColor }">
            {{ section.content.avatarsText }}
          </p>
        </div>
      </template>
      
      <!-- CTA: Layout App Download -->
      <template v-else-if="section.content?.layout === 'app-download'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1000px', margin: '0 auto', padding: '0 1rem' }">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="text-center lg:text-left">
              <h2 class="text-3xl md:text-4xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
              <p class="text-lg mb-8 opacity-80" :style="{ color: section.style?.textColor }">{{ section.content?.subtitle }}</p>
              <div class="flex flex-wrap justify-center lg:justify-start gap-4">
                <a v-if="section.content?.appStoreUrl" :href="section.content.appStoreUrl" class="inline-block">
                  <div class="flex items-center gap-3 px-5 py-3 bg-black text-white rounded-xl">
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    <div class="text-left"><div class="text-xs">Télécharger sur</div><div class="font-semibold">App Store</div></div>
                  </div>
                </a>
                <a v-if="section.content?.playStoreUrl" :href="section.content.playStoreUrl" class="inline-block">
                  <div class="flex items-center gap-3 px-5 py-3 bg-black text-white rounded-xl">
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                    <div class="text-left"><div class="text-xs">Disponible sur</div><div class="font-semibold">Google Play</div></div>
                  </div>
                </a>
              </div>
            </div>
            <div v-if="section.content?.mockupImage" class="hidden lg:block">
              <img :src="section.content.mockupImage" alt="App" class="w-full max-w-sm mx-auto" />
            </div>
          </div>
        </div>
      </template>
      
      <!-- CTA: Layout par défaut (Simple/Gradient) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h2 class="text-2xl md:text-4xl font-bold mb-4" :style="{ color: section.style?.textColor }">
            {{ section.content?.title || 'Prêt à commencer ?' }}
          </h2>
          <p v-if="section.content?.subtitle" class="text-lg mb-8 opacity-80" :style="{ color: section.style?.textColor }">
            {{ section.content.subtitle }}
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="px-8 py-4 rounded-lg font-semibold transition-all"
              :style="section.content.button.style === 'white' ? { backgroundColor: '#ffffff', color: '#171717' } : getButtonStyle">
              {{ section.content.button.text || 'Commencer' }}
            </a>
            <a v-if="section.content?.secondaryButton" :href="section.content.secondaryButton.url || '#'" class="px-8 py-4 rounded-lg font-semibold transition-all border-2"
              :style="{ borderColor: section.style?.textColor + '50', color: section.style?.textColor }">
              {{ section.content.secondaryButton.text }}
            </a>
          </div>
        </div>
      </template>
      
    </template>
    
    <!-- Text -->
    <template v-else-if="section.type === 'text'">
      <!-- TEXT: Two Columns -->
      <template v-if="section.content?.layout === 'two-columns'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1000px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div :style="{ color: section.style?.textColor }" class="text-base leading-relaxed">{{ section.content?.leftContent }}</div>
            <div :style="{ color: section.style?.textColor }" class="text-base leading-relaxed">{{ section.content?.rightContent }}</div>
          </div>
        </div>
      </template>
      <!-- TEXT: Highlight -->
      <template v-else-if="section.content?.layout === 'highlight'">
        <div :style="{ maxWidth: section.style?.maxWidth || '700px', margin: '0 auto', padding: '0 1rem' }">
          <div class="rounded-xl p-6" :style="{ backgroundColor: section.style?.backgroundColor }">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: section.style?.textColor + '20' }">
                <svg class="w-5 h-5" :style="{ color: section.style?.textColor }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
              </div>
              <div>
                <h3 class="font-bold text-lg mb-2" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h3>
                <p :style="{ color: section.style?.textColor }" class="opacity-90">{{ section.content?.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- TEXT: Numbered List -->
      <template v-else-if="section.content?.layout === 'numbered'">
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="space-y-6">
            <div v-for="(item, index) in (section.content?.items || [])" :key="index" class="flex gap-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold" :style="{ backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }">{{ +index + 1 }}</div>
              <div>
                <h4 class="font-semibold mb-1" :style="{ color: section.style?.textColor }">{{ item.title }}</h4>
                <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- TEXT: Dropcap -->
      <template v-else-if="section.content?.layout === 'dropcap'">
        <div :style="{ maxWidth: section.style?.maxWidth || '700px', margin: '0 auto', padding: '0 1rem' }">
          <p :style="{ color: section.style?.textColor }" class="text-lg leading-relaxed">
            <span class="float-left text-6xl font-bold mr-3 mt-1" :style="{ color: section.style?.textColor }">{{ (section.content?.content || 'L')[0] }}</span>
            {{ (section.content?.content || '').substring(1) }}
          </p>
        </div>
      </template>
      <!-- TEXT: Quote -->
      <template v-else-if="section.content?.layout === 'quote'">
        <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-20" :style="{ color: section.style?.textColor }" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
          <blockquote class="text-2xl italic mb-4" :style="{ color: section.style?.textColor }">{{ section.content?.content }}</blockquote>
          <cite v-if="section.content?.author" class="text-sm font-medium opacity-70" :style="{ color: section.style?.textColor }">\u2014 {{ section.content.author }}</cite>
        </div>
      </template>
      <!-- TEXT: Article -->
      <template v-else-if="section.content?.layout === 'article'">
        <div :style="{ maxWidth: section.style?.maxWidth || '750px', margin: '0 auto', padding: '0 1rem' }">
          <div class="mb-6">
            <span v-if="section.content?.category" class="text-xs font-bold tracking-wider opacity-60" :style="{ color: section.style?.textColor }">{{ section.content.category }}</span>
            <h1 class="text-4xl font-bold mt-2 mb-3" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h1>
            <div class="flex items-center gap-4 text-sm opacity-60" :style="{ color: section.style?.textColor }">
              <span v-if="section.content?.date">{{ section.content.date }}</span>
              <span v-if="section.content?.author">Par {{ section.content.author }}</span>
            </div>
          </div>
          <div class="prose max-w-none" :style="{ color: section.style?.textColor }">{{ section.content?.content }}</div>
        </div>
      </template>
      <!-- TEXT: Default (Heading/Paragraph) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-2xl font-bold mb-4" :style="{ color: section.style?.textColor, textAlign: section.style?.alignment }">{{ section.content.title }}</h2>
          <div class="prose max-w-none" :style="{ color: section.style?.textColor, textAlign: section.style?.alignment }" v-html="section.content?.content || '<p>Votre texte ici...</p>'"></div>
        </div>
      </template>
    </template>
    
    <!-- Image -->
    <template v-else-if="section.type === 'image'">
      <!-- IMAGE: Parallax -->
      <template v-if="section.content?.layout === 'parallax'">
        <div class="relative overflow-hidden" :style="{ height: (section.content?.height || 400) + 'px' }">
          <div class="absolute inset-0 bg-cover bg-center bg-fixed" :style="{ backgroundImage: section.content?.src ? 'url(' + section.content.src + ')' : 'linear-gradient(45deg, #374151 25%, #1f2937 75%)' }"></div>
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 v-if="section.content?.overlayText" class="text-4xl font-bold text-white text-center px-4">{{ section.content.overlayText }}</h2>
          </div>
        </div>
      </template>
      <!-- IMAGE: Comparison -->
      <template v-else-if="section.content?.layout === 'comparison'">
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
          <div class="relative overflow-hidden rounded-xl">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="bg-gray-200 aspect-video rounded-lg flex items-center justify-center text-gray-500">{{ section.content?.beforeLabel || 'Avant' }}</div>
                <span class="text-sm mt-2 block" :style="{ color: section.style?.textColor }">{{ section.content?.beforeLabel || 'Avant' }}</span>
              </div>
              <div class="text-center">
                <div class="bg-gray-200 aspect-video rounded-lg flex items-center justify-center text-gray-500">{{ section.content?.afterLabel || 'Apr\u00e8s' }}</div>
                <span class="text-sm mt-2 block" :style="{ color: section.style?.textColor }">{{ section.content?.afterLabel || 'Apr\u00e8s' }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- IMAGE: Split Text -->
      <template v-else-if="section.content?.layout === 'split-text'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1100px', margin: '0 auto', padding: '0 1rem' }">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center" :class="section.content?.imagePosition === 'right' ? 'md:flex-row-reverse' : ''">
            <div :class="section.content?.imagePosition === 'right' ? 'md:order-2' : ''">
              <img v-if="section.content?.src" :src="section.content.src" :alt="section.content?.alt" class="w-full rounded-xl" />
              <div v-else class="bg-gray-200 aspect-video rounded-xl flex items-center justify-center text-gray-500">Image</div>
            </div>
            <div :class="section.content?.imagePosition === 'right' ? 'md:order-1' : ''">
              <h3 class="text-3xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h3>
              <p class="text-lg opacity-80" :style="{ color: section.style?.textColor }">{{ section.content?.content }}</p>
            </div>
          </div>
        </div>
      </template>
      <!-- IMAGE: Rounded -->
      <template v-else-if="section.content?.layout === 'rounded'">
        <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <img v-if="section.content?.src" :src="section.content.src" :alt="section.content?.alt" class="max-w-full h-auto" :style="{ borderRadius: (section.content?.borderRadius || 24) + 'px' }" />
          <div v-else class="bg-gray-200 py-20 text-gray-500" :style="{ borderRadius: (section.content?.borderRadius || 24) + 'px' }">Aucune image</div>
        </div>
      </template>
      <!-- IMAGE: Framed -->
      <template v-else-if="section.content?.layout === 'framed'">
        <div :style="{ maxWidth: section.style?.maxWidth || '700px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <div class="p-2" :style="{ backgroundColor: section.content?.frameColor || '#262626', borderRadius: '8px' }">
            <img v-if="section.content?.src" :src="section.content.src" :alt="section.content?.alt" class="max-w-full h-auto rounded" />
            <div v-else class="bg-gray-200 py-20 text-gray-500 rounded">Aucune image</div>
          </div>
        </div>
      </template>
      <!-- IMAGE: Default -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem', textAlign: section.style?.alignment || 'center' }">
          <img v-if="section.content?.src" :src="section.content.src" :alt="section.content?.alt || 'Image'" class="max-w-full h-auto rounded-lg" />
          <div v-else class="bg-gray-200 rounded-lg py-20 px-10 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p>Aucune image</p>
          </div>
          <p v-if="section.content?.caption" class="mt-2 text-sm" :style="{ color: section.style?.textColor, opacity: 0.7 }">{{ section.content.caption }}</p>
        </div>
      </template>
    </template>
    
    <!-- FAQ -->
    <template v-else-if="section.type === 'faq'">
      <!-- FAQ: Columns (2 colonnes) -->
      <template v-if="section.content?.layout === 'columns'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1100px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="(item, index) in (section.content?.items || [])" :key="index" class="p-6 rounded-xl" :style="{ backgroundColor: section.style?.textColor + '08' }">
              <h4 class="font-bold mb-2" :style="{ color: section.style?.textColor }">{{ item.question }}</h4>
              <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FAQ: Tabs -->
      <template v-else-if="section.content?.layout === 'tabs'">
        <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="flex flex-wrap justify-center gap-2 mb-8">
            <button 
              v-for="(category, index) in (section.content?.categories || [])" 
              :key="index" 
              @click="activeTab = Number(index)" 
              class="px-4 py-2 rounded-full font-medium transition-all" 
              :style="{ backgroundColor: activeTab === Number(index) ? (section.content?.accentColor || '#10B981') : section.style?.textColor + '10', color: activeTab === Number(index) ? '#ffffff' : section.style?.textColor }"
            >
              {{ typeof category === 'object' ? category.name : category }}
            </button>
          </div>
          <div class="space-y-4">
            <div 
              v-for="(item, index) in (typeof (section.content?.categories || [])[activeTab] === 'object' ? (section.content?.categories || [])[activeTab]?.items || [] : section.content?.items || [])" 
              :key="index" 
              class="border rounded-xl overflow-hidden" 
              :style="{ borderColor: section.style?.textColor + '15' }"
            >
              <div class="p-4 font-semibold" :style="{ backgroundColor: section.style?.textColor + '05', color: section.style?.textColor }">{{ item.question }}</div>
              <div class="p-4 opacity-80" :style="{ color: section.style?.textColor }">{{ item.answer }}</div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FAQ: Search -->
      <template v-else-if="section.content?.layout === 'search'">
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-4 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="relative mb-8">
            <input 
              v-model="faqSearchQuery"
              type="text" 
              :placeholder="section.content?.searchPlaceholder || 'Rechercher une question...'" 
              class="w-full px-6 py-4 rounded-xl border-2 text-lg bg-transparent focus:outline-none focus:ring-2 transition-all" 
              :style="{ borderColor: section.style?.textColor + '20', color: section.style?.textColor }" 
            />
            <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div v-if="filteredFaqItems.length === 0" class="text-center py-8 opacity-60" :style="{ color: section.style?.textColor }">
            <svg class="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>Aucun résultat trouvé pour "{{ faqSearchQuery }}"</p>
          </div>
          <div class="space-y-4">
            <div v-for="(item, index) in filteredFaqItems" :key="index" class="border-b pb-4 last:border-b-0" :style="{ borderColor: section.style?.textColor + '15' }">
              <h4 class="font-bold mb-2" :style="{ color: section.style?.textColor }">{{ item.question }}</h4>
              <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FAQ: Side (Titre à gauche) -->
      <template v-else-if="section.content?.layout === 'side'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1100px', margin: '0 auto', padding: '0 1rem' }">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <h2 class="text-3xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
              <p v-if="section.content?.subtitle" class="opacity-70 mb-6" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
              <a v-if="section.content?.contactLink" :href="section.content.contactLink" class="inline-flex items-center gap-2 font-medium" :style="{ color: section.content?.accentColor || '#10B981' }">
                Besoin d'aide ?
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
            <div class="lg:col-span-2 space-y-4">
              <div v-for="(item, index) in (section.content?.items || [])" :key="index" class="p-6 rounded-xl" :style="{ backgroundColor: section.style?.textColor + '05' }">
                <h4 class="font-bold mb-2" :style="{ color: section.style?.textColor }">{{ item.question }}</h4>
                <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FAQ: Minimal -->
      <template v-else-if="section.content?.layout === 'minimal'">
        <div :style="{ maxWidth: section.style?.maxWidth || '700px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-2xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="space-y-6">
            <div v-for="(item, index) in (section.content?.items || [])" :key="index">
              <h4 class="font-medium mb-1" :style="{ color: section.style?.textColor }">{{ item.question }}</h4>
              <p class="opacity-60 text-sm" :style="{ color: section.style?.textColor }">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FAQ: Cards -->
      <template v-else-if="section.content?.layout === 'cards'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(item, index) in (section.content?.items || [])" :key="index" class="p-6 rounded-2xl border" :style="{ borderColor: section.style?.textColor + '15' }">
              <div class="w-10 h-10 rounded-full mb-4 flex items-center justify-center text-white font-bold" :style="{ backgroundColor: section.content?.accentColor || '#10B981' }">{{ +index + 1 }}</div>
              <h4 class="font-bold mb-2" :style="{ color: section.style?.textColor }">{{ item.question }}</h4>
              <p class="text-sm opacity-70" :style="{ color: section.style?.textColor }">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FAQ: Numbered -->
      <template v-else-if="section.content?.layout === 'numbered'">
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="space-y-6">
            <div v-for="(item, index) in (section.content?.items || [])" :key="index" class="flex gap-6">
              <div class="flex-none w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-xl" :style="{ borderColor: section.content?.accentColor || '#10B981', color: section.content?.accentColor || '#10B981' }">{{ +index + 1 }}</div>
              <div class="flex-1">
                <h4 class="font-bold mb-1" :style="{ color: section.style?.textColor }">{{ item.question }}</h4>
                <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- FAQ: Default (Accordion) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8" :style="{ color: section.style?.textColor, textAlign: section.style?.alignment }">{{ section.content.title }}</h2>
          <div class="space-y-3">
            <div v-for="(item, index) in (section.content?.items || [])" :key="index" class="border rounded-xl overflow-hidden transition-all" :style="{ borderColor: section.style?.textColor + '20' }">
              <button 
                @click="toggleFaqItem(Number(index))" 
                class="w-full p-5 flex items-center justify-between text-left font-semibold transition-colors cursor-pointer"
                :style="{ backgroundColor: openFaqItems.has(Number(index)) ? section.style?.textColor + '08' : 'transparent', color: section.style?.textColor }"
              >
                <span>{{ item.question }}</span>
                <svg 
                  class="w-5 h-5 transition-transform duration-300 flex-shrink-0 ml-4" 
                  :class="{ 'rotate-180': openFaqItems.has(Number(index)) }"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                class="overflow-hidden transition-all duration-300"
                :style="{ maxHeight: openFaqItems.has(Number(index)) ? '500px' : '0px', opacity: openFaqItems.has(Number(index)) ? 1 : 0 }"
              >
                <div class="p-5 pt-0" :style="{ color: section.style?.textColor }">
                  <p class="opacity-80">{{ item.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    
    <!-- Contact -->
    <template v-else-if="section.type === 'contact'">
      <!-- CONTACT: Detailed -->
      <template v-if="section.content?.layout === 'detailed'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1100px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-2" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
            <p v-if="section.content?.subtitle" class="opacity-70" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6 rounded-xl" :style="{ backgroundColor: section.style?.textColor + '08' }">
              <div class="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" :style="{ backgroundColor: section.content?.accentColor || '#10B981' }">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h4 class="font-bold mb-1" :style="{ color: section.style?.textColor }">Email</h4>
              <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ section.content?.email }}</p>
            </div>
            <div class="text-center p-6 rounded-xl" :style="{ backgroundColor: section.style?.textColor + '08' }">
              <div class="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" :style="{ backgroundColor: section.content?.accentColor || '#10B981' }">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <h4 class="font-bold mb-1" :style="{ color: section.style?.textColor }">Téléphone</h4>
              <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ section.content?.phone }}</p>
            </div>
            <div class="text-center p-6 rounded-xl" :style="{ backgroundColor: section.style?.textColor + '08' }">
              <div class="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" :style="{ backgroundColor: section.content?.accentColor || '#10B981' }">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h4 class="font-bold mb-1" :style="{ color: section.style?.textColor }">Adresse</h4>
              <p class="opacity-70" :style="{ color: section.style?.textColor }">{{ section.content?.address }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- CONTACT: Split -->
      <template v-else-if="section.content?.layout === 'split'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1100px', margin: '0 auto', padding: '0 1rem' }">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 class="text-3xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
              <p class="opacity-70 mb-8" :style="{ color: section.style?.textColor }">{{ section.content?.description }}</p>
              <div class="space-y-4">
                <div v-if="section.content?.email" class="flex items-center gap-4" :style="{ color: section.style?.textColor }">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="{ backgroundColor: section.style?.textColor + '10' }">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <div class="text-sm opacity-60">Email</div>
                    <div class="font-medium">{{ section.content.email }}</div>
                  </div>
                </div>
                <div v-if="section.content?.phone" class="flex items-center gap-4" :style="{ color: section.style?.textColor }">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="{ backgroundColor: section.style?.textColor + '10' }">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <div class="text-sm opacity-60">Téléphone</div>
                    <div class="font-medium">{{ section.content.phone }}</div>
                  </div>
                </div>
                <div v-if="section.content?.address" class="flex items-center gap-4" :style="{ color: section.style?.textColor }">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="{ backgroundColor: section.style?.textColor + '10' }">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  </div>
                  <div>
                    <div class="text-sm opacity-60">Adresse</div>
                    <div class="font-medium">{{ section.content.address }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rounded-2xl p-8" :style="{ backgroundColor: section.style?.textColor + '05' }">
              <h3 class="text-xl font-bold mb-6" :style="{ color: section.style?.textColor }">Envoyez-nous un message</h3>
              <form class="space-y-4">
                <input type="text" placeholder="Votre nom" class="w-full px-4 py-3 rounded-lg border" :style="{ borderColor: section.style?.textColor + '20' }" />
                <input type="email" placeholder="Votre email" class="w-full px-4 py-3 rounded-lg border" :style="{ borderColor: section.style?.textColor + '20' }" />
                <textarea placeholder="Votre message" rows="4" class="w-full px-4 py-3 rounded-lg border" :style="{ borderColor: section.style?.textColor + '20' }"></textarea>
                <button type="submit" class="w-full py-3 rounded-lg font-semibold transition-all" :style="getButtonStyle">Envoyer</button>
              </form>
            </div>
          </div>
        </div>
      </template>
      
      <!-- CONTACT: Cards -->
      <template v-else-if="section.content?.layout === 'cards'">
        <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a v-if="section.content?.email" :href="'mailto:' + section.content.email" class="flex items-center gap-4 p-6 rounded-2xl border transition-all hover:shadow-lg" :style="{ borderColor: section.style?.textColor + '15' }">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center" :style="{ backgroundColor: section.content?.accentColor || '#10B981' }">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <div class="font-bold" :style="{ color: section.style?.textColor }">Email</div>
                <div class="opacity-70" :style="{ color: section.style?.textColor }">{{ section.content.email }}</div>
              </div>
            </a>
            <a v-if="section.content?.phone" :href="'tel:' + section.content.phone" class="flex items-center gap-4 p-6 rounded-2xl border transition-all hover:shadow-lg" :style="{ borderColor: section.style?.textColor + '15' }">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center" :style="{ backgroundColor: section.content?.accentColor || '#10B981' }">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <div class="font-bold" :style="{ color: section.style?.textColor }">Téléphone</div>
                <div class="opacity-70" :style="{ color: section.style?.textColor }">{{ section.content.phone }}</div>
              </div>
            </a>
          </div>
        </div>
      </template>
      
      <!-- CONTACT: Form -->
      <template v-else-if="section.content?.layout === 'form'">
        <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold mb-2" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
            <p v-if="section.content?.subtitle" class="opacity-70" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          </div>
          <form class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Prénom" class="px-4 py-3 rounded-lg border" :style="{ borderColor: section.style?.textColor + '20' }" />
              <input type="text" placeholder="Nom" class="px-4 py-3 rounded-lg border" :style="{ borderColor: section.style?.textColor + '20' }" />
            </div>
            <input type="email" placeholder="Email" class="w-full px-4 py-3 rounded-lg border" :style="{ borderColor: section.style?.textColor + '20' }" />
            <input type="tel" placeholder="Téléphone" class="w-full px-4 py-3 rounded-lg border" :style="{ borderColor: section.style?.textColor + '20' }" />
            <select class="w-full px-4 py-3 rounded-lg border" :style="{ borderColor: section.style?.textColor + '20' }">
              <option>Sélectionnez un sujet</option>
              <option>Support</option>
              <option>Commercial</option>
              <option>Autre</option>
            </select>
            <textarea placeholder="Votre message" rows="5" class="w-full px-4 py-3 rounded-lg border" :style="{ borderColor: section.style?.textColor + '20' }"></textarea>
            <button type="submit" class="w-full py-4 rounded-lg font-bold text-lg transition-all" :style="getButtonStyle">{{ section.content?.buttonText || 'Envoyer' }}</button>
          </form>
        </div>
      </template>
      
      <!-- CONTACT: Map -->
      <template v-else-if="section.content?.layout === 'map'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 h-[400px] rounded-2xl overflow-hidden bg-gray-200">
              <iframe v-if="section.content?.mapUrl" :src="section.content.mapUrl" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              </div>
            </div>
            <div class="p-8 rounded-2xl" :style="{ backgroundColor: section.style?.textColor + '08' }">
              <h3 class="text-xl font-bold mb-6" :style="{ color: section.style?.textColor }">{{ section.content?.title || 'Nos coordonnées' }}</h3>
              <div class="space-y-4">
                <p v-if="section.content?.address" class="flex items-start gap-3" :style="{ color: section.style?.textColor }">
                  <svg class="w-5 h-5 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {{ section.content.address }}
                </p>
                <p v-if="section.content?.phone" class="flex items-center gap-3" :style="{ color: section.style?.textColor }">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {{ section.content.phone }}
                </p>
                <p v-if="section.content?.email" class="flex items-center gap-3" :style="{ color: section.style?.textColor }">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {{ section.content.email }}
                </p>
                <p v-if="section.content?.hours" class="flex items-center gap-3" :style="{ color: section.style?.textColor }">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {{ section.content.hours }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- CONTACT: Minimal -->
      <template v-else-if="section.content?.layout === 'minimal'">
        <div :style="{ maxWidth: section.style?.maxWidth || '500px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h3 v-if="section.content?.title" class="text-2xl font-bold mb-6" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h3>
          <div class="space-y-2" :style="{ color: section.style?.textColor }">
            <p v-if="section.content?.email" class="opacity-80">{{ section.content.email }}</p>
            <p v-if="section.content?.phone" class="opacity-80">{{ section.content.phone }}</p>
            <p v-if="section.content?.address" class="opacity-60 text-sm">{{ section.content.address }}</p>
          </div>
        </div>
      </template>
      
      <!-- CONTACT: Social -->
      <template v-else-if="section.content?.layout === 'social'">
        <div :style="{ maxWidth: section.style?.maxWidth || '700px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h2 class="text-3xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
          <p v-if="section.content?.subtitle" class="opacity-70 mb-8" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          <div class="flex justify-center gap-4 mb-8">
            <a v-if="section.content?.links?.facebook" :href="section.content.links.facebook" target="_blank" class="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110" style="background: #1877F2;"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            <a v-if="section.content?.links?.instagram" :href="section.content.links.instagram" target="_blank" class="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110" style="background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
            <a v-if="section.content?.links?.twitter" :href="section.content.links.twitter" target="_blank" class="w-12 h-12 rounded-xl flex items-center justify-center bg-black transition-all hover:scale-110"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
            <a v-if="section.content?.links?.linkedin" :href="section.content.links.linkedin" target="_blank" class="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110" style="background: #0A66C2;"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
          </div>
          <div class="space-y-2" :style="{ color: section.style?.textColor }">
            <p v-if="section.content?.email" class="opacity-80">{{ section.content.email }}</p>
            <p v-if="section.content?.phone" class="opacity-80">{{ section.content.phone }}</p>
          </div>
        </div>
      </template>
      
      <!-- CONTACT: Default (Simple) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-6" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="space-y-3" :style="{ color: section.style?.textColor }">
            <p v-if="section.content?.email" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {{ section.content.email }}
            </p>
            <p v-if="section.content?.phone" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {{ section.content.phone }}
            </p>
            <p v-if="section.content?.address" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {{ section.content.address }}
            </p>
          </div>
        </div>
      </template>
    </template>
    
    <!-- Pricing -->
    <template v-else-if="section.type === 'pricing'">
      
      <!-- PRICING: Layout Tiers (3 colonnes) -->
      <template v-if="section.content?.layout === 'tiers' && section.content?.plans">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold mb-3" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
            <p v-if="section.content?.subtitle" class="text-lg opacity-70" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              v-for="(plan, idx) in section.content.plans" 
              :key="idx"
              class="rounded-2xl p-8 transition-all"
              :class="(plan.popular || plan.highlighted) ? 'ring-2 ring-primary scale-105 shadow-xl' : ''"
              :style="{ backgroundColor: (plan.popular || plan.highlighted) ? '#ffffff' : section.style?.textColor + '08' }"
            >
              <span v-if="plan.popular || plan.badge" class="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 bg-primary text-white">{{ plan.badge || 'POPULAIRE' }}</span>
              <h3 class="text-xl font-bold mb-1" :style="{ color: section.style?.textColor }">{{ plan.name }}</h3>
              <p v-if="plan.description" class="text-sm opacity-60 mb-4" :style="{ color: section.style?.textColor }">{{ plan.description }}</p>
              <div class="mb-6">
                <span class="text-4xl font-bold" :style="{ color: section.style?.textColor }">{{ plan.price }}</span>
                <span class="opacity-60" :style="{ color: section.style?.textColor }">{{ plan.period }}</span>
              </div>
              <ul class="space-y-3 mb-8">
                <li v-for="(feat, fi) in plan.features" :key="fi" class="flex items-center gap-2" :style="{ color: section.style?.textColor }">
                  <svg v-if="typeof feat === 'object' ? feat.included : true" class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  <svg v-else class="w-5 h-5 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                  <span :class="typeof feat === 'object' && !feat.included ? 'opacity-40' : ''">{{ typeof feat === 'object' ? feat.text : feat }}</span>
                </li>
              </ul>
              <a v-if="plan.button" :href="plan.button.url || '#'" class="block w-full py-3 rounded-lg font-semibold text-center transition-all"
                :style="(plan.popular || plan.highlighted) ? getButtonStyle : { backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }">
                {{ plan.button.text }}
              </a>
            </div>
          </div>
        </div>
      </template>
      
      <!-- PRICING: Layout Two Columns -->
      <template v-else-if="section.content?.layout === 'two-columns' && section.content?.plans">
        <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-3" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
            <p v-if="section.content?.subtitle" class="opacity-70" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              v-for="(plan, idx) in section.content.plans" 
              :key="idx"
              class="rounded-2xl p-8 border-2 transition-all"
              :style="{ borderColor: (plan.popular || plan.highlighted) ? '#10B981' : section.style?.textColor + '20', backgroundColor: (plan.popular || plan.highlighted) ? '#f0fdf4' : 'transparent' }"
            >
              <span v-if="plan.popular || plan.badge" class="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 bg-green-500 text-white">{{ plan.badge || 'POPULAIRE' }}</span>
              <h3 class="text-2xl font-bold mb-1" :style="{ color: section.style?.textColor }">{{ plan.name }}</h3>
              <p v-if="plan.description" class="text-sm opacity-60 mb-4" :style="{ color: section.style?.textColor }">{{ plan.description }}</p>
              <div class="mb-6">
                <span class="text-5xl font-bold" :style="{ color: section.style?.textColor }">{{ plan.price }}</span>
                <span class="opacity-60" :style="{ color: section.style?.textColor }">{{ plan.period }}</span>
              </div>
              <ul class="space-y-3 mb-8">
                <li v-for="(feat, fi) in plan.features" :key="fi" class="flex items-center gap-2" :style="{ color: section.style?.textColor }">
                  <svg v-if="typeof feat === 'object' ? feat.included : true" class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  <svg v-else class="w-5 h-5 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                  <span :class="typeof feat === 'object' && !feat.included ? 'opacity-40' : ''">{{ typeof feat === 'object' ? feat.text : feat }}</span>
                </li>
              </ul>
              <a v-if="plan.button" :href="plan.button.url || '#'" class="block w-full py-3 rounded-lg font-semibold text-center transition-all"
                :style="(plan.popular || plan.highlighted) ? getButtonStyle : { backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }">
                {{ plan.button.text }}
              </a>
            </div>
          </div>
        </div>
      </template>
      
      <!-- PRICING: Layout Minimal -->
      <template v-else-if="section.content?.layout === 'minimal' && section.content?.plans">
        <div :style="{ maxWidth: section.style?.maxWidth || '1000px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold text-center mb-10" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="flex flex-wrap justify-center gap-6">
            <div 
              v-for="(plan, idx) in section.content.plans" 
              :key="idx"
              class="w-64 p-6 rounded-xl text-center transition-all"
              :class="(plan.popular || plan.highlighted) ? 'ring-2 ring-primary shadow-lg' : ''"
              :style="{ backgroundColor: section.style?.textColor + '08' }"
            >
              <h3 class="text-lg font-bold mb-1" :style="{ color: section.style?.textColor }">{{ plan.name }}</h3>
              <p v-if="plan.description" class="text-sm opacity-60 mb-4" :style="{ color: section.style?.textColor }">{{ plan.description }}</p>
              <div class="text-3xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ plan.price }}<span class="text-base font-normal opacity-60">{{ plan.period }}</span></div>
              <a v-if="plan.button" :href="plan.button.url || '#'" class="block w-full py-2 rounded-lg font-semibold transition-all" :style="(plan.popular || plan.highlighted) ? getButtonStyle : { backgroundColor: 'transparent', border: '1px solid ' + section.style?.textColor + '30', color: section.style?.textColor }">{{ plan.button.text }}</a>
            </div>
          </div>
        </div>
      </template>
      
      <!-- PRICING: Layout Toggle (Mensuel/Annuel) -->
      <template v-else-if="section.content?.layout === 'toggle' && section.content?.plans">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-10">
            <h2 class="text-3xl md:text-4xl font-bold mb-3" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
            <p v-if="section.content?.subtitle" class="opacity-70 mb-6" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
            <div class="inline-flex items-center gap-3 p-1 rounded-full" :style="{ backgroundColor: section.style?.textColor + '10' }">
              <button 
                @click="selectedBillingPeriod = 'monthly'" 
                class="px-4 py-2 rounded-full font-medium transition-all cursor-pointer" 
                :style="{ backgroundColor: selectedBillingPeriod !== 'yearly' ? section.style?.textColor : 'transparent', color: selectedBillingPeriod !== 'yearly' ? '#ffffff' : section.style?.textColor }"
              >
                Mensuel
              </button>
              <button 
                @click="selectedBillingPeriod = 'yearly'" 
                class="px-4 py-2 rounded-full font-medium transition-all cursor-pointer" 
                :style="{ backgroundColor: selectedBillingPeriod === 'yearly' ? section.style?.textColor : 'transparent', color: selectedBillingPeriod === 'yearly' ? '#ffffff' : section.style?.textColor }"
              >
                Annuel <span class="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full ml-1">-{{ section.content?.discount || 20 }}%</span>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(plan, idx) in section.content.plans" :key="idx" class="rounded-2xl p-8" :class="(plan.popular || plan.highlighted) ? 'ring-2 ring-primary shadow-xl' : ''" :style="{ backgroundColor: (plan.popular || plan.highlighted) ? '#ffffff' : section.style?.textColor + '08' }">
              <span v-if="plan.popular || plan.badge" class="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 bg-primary text-white">{{ plan.badge || 'POPULAIRE' }}</span>
              <h3 class="text-xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ plan.name }}</h3>
              <div class="mb-6">
                <span class="text-4xl font-bold" :style="{ color: section.style?.textColor }">{{ selectedBillingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice }}</span>
                <span class="opacity-60" :style="{ color: section.style?.textColor }">{{ selectedBillingPeriod === 'yearly' ? '/an' : '/mois' }}</span>
              </div>
              <ul class="space-y-3 mb-8">
                <li v-for="(feat, fi) in plan.features" :key="fi" class="flex items-center gap-2" :style="{ color: section.style?.textColor }">
                  <svg v-if="typeof feat === 'object' ? feat.included : true" class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  <svg v-else class="w-5 h-5 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                  <span :class="typeof feat === 'object' && !feat.included ? 'opacity-40' : ''">{{ typeof feat === 'object' ? feat.text : feat }}</span>
                </li>
              </ul>
              <a v-if="plan.button" :href="plan.button.url || '#'" class="block w-full py-3 rounded-lg font-semibold text-center transition-all" :style="(plan.popular || plan.highlighted) ? getButtonStyle : { backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }">{{ plan.button.text }}</a>
            </div>
          </div>
        </div>
      </template>
      
      <!-- PRICING: Layout Highlighted (Focus) -->
      <template v-else-if="section.content?.layout === 'highlighted' && section.content?.mainPlan">
        <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-8">
            <h2 class="text-2xl md:text-3xl font-bold" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
          </div>
          <div class="rounded-3xl p-10 shadow-2xl" style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
            <span v-if="section.content.mainPlan.badge" class="inline-block px-4 py-1 text-sm font-bold rounded-full mb-4 bg-gradient-to-r from-primary to-purple-500 text-white">{{ section.content.mainPlan.badge }}</span>
            <h3 class="text-3xl font-bold mb-2 text-gray-900">{{ section.content.mainPlan.name }}</h3>
            <p v-if="section.content.mainPlan.description" class="text-gray-600 mb-6">{{ section.content.mainPlan.description }}</p>
            <div class="mb-8">
              <span class="text-6xl font-bold text-gray-900">{{ section.content.mainPlan.price }}{{ section.content.mainPlan.currency }}</span>
              <span class="text-gray-500">{{ section.content.mainPlan.period }}</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li v-for="(feat, fi) in section.content.mainPlan.features" :key="fi" class="flex items-center gap-3">
                <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                <span class="text-gray-700">{{ feat }}</span>
              </li>
            </ul>
            <a v-if="section.content.mainPlan.button" :href="section.content.mainPlan.button.url || '#'" class="block w-full py-4 rounded-xl font-bold text-lg text-center transition-all" :style="getButtonStyle">{{ section.content.mainPlan.button.text }}</a>
            <p v-if="section.content.mainPlan.guarantee" class="text-center text-sm text-gray-500 mt-4">{{ section.content.mainPlan.guarantee }}</p>
          </div>
          <a v-if="section.content?.otherPlansUrl" :href="section.content.otherPlansUrl" class="block text-center mt-6 font-medium hover:underline" :style="{ color: section.style?.textColor }">{{ section.content?.otherPlansText || 'Voir toutes les formules' }} →</a>
        </div>
      </template>
      
      <!-- PRICING: Layout Dark -->
      <template v-else-if="section.content?.layout === 'dark' && section.content?.plans">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold mb-3" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
            <p v-if="section.content?.subtitle" class="opacity-70" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(plan, idx) in section.content.plans" :key="idx" class="rounded-2xl p-8 border transition-all" :style="{ borderColor: (plan.popular || plan.highlighted) ? '#10B981' : 'rgba(255,255,255,0.1)', backgroundColor: (plan.popular || plan.highlighted) ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)' }">
              <span v-if="plan.popular || plan.badge" class="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 bg-green-500 text-white">{{ plan.badge || 'POPULAIRE' }}</span>
              <h3 class="text-xl font-bold mb-1" :style="{ color: section.style?.textColor }">{{ plan.name }}</h3>
              <div class="my-6"><span class="text-4xl font-bold" :style="{ color: section.style?.textColor }">{{ plan.price }}</span><span class="opacity-60" :style="{ color: section.style?.textColor }">{{ plan.period }}</span></div>
              <ul class="space-y-3 mb-8">
                <li v-for="(feat, fi) in plan.features" :key="fi" class="flex items-center gap-2 opacity-80" :style="{ color: section.style?.textColor }">
                  <svg v-if="typeof feat === 'object' ? feat.included : true" class="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  <svg v-else class="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                  <span :class="typeof feat === 'object' && !feat.included ? 'opacity-40' : ''">{{ typeof feat === 'object' ? feat.text : feat }}</span>
                </li>
              </ul>
              <a v-if="plan.button" :href="plan.button.url || '#'" class="block w-full py-3 rounded-lg font-semibold text-center transition-all" :style="(plan.popular || plan.highlighted) ? { backgroundColor: '#10B981', color: '#ffffff' } : { backgroundColor: 'rgba(255,255,255,0.1)', color: section.style?.textColor }">{{ plan.button.text }}</a>
            </div>
          </div>
        </div>
      </template>
      
      <!-- PRICING: Layout Enterprise -->
      <template v-else-if="section.content?.layout === 'enterprise'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1000px', margin: '0 auto', padding: '0 1rem' }">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span v-if="section.content?.badge" class="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4" :style="{ backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }">{{ section.content.badge }}</span>
              <h2 class="text-3xl md:text-4xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
              <p class="text-lg opacity-80 mb-8" :style="{ color: section.style?.textColor }">{{ section.content?.description }}</p>
              <ul v-if="section.content?.features" class="space-y-4 mb-8">
                <li v-for="(feat, fi) in section.content.features" :key="fi" class="flex items-center gap-3" :style="{ color: section.style?.textColor }">
                  <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  <span>{{ feat }}</span>
                </li>
              </ul>
            </div>
            <div v-if="section.content?.contact" class="rounded-2xl p-8" :style="{ backgroundColor: section.style?.textColor + '08' }">
              <h3 class="text-xl font-bold mb-2" :style="{ color: section.style?.textColor }">{{ section.content.contact.title }}</h3>
              <p class="opacity-70 mb-6" :style="{ color: section.style?.textColor }">{{ section.content.contact.description }}</p>
              <a v-if="section.content.contact.button" :href="section.content.contact.button.url || '#'" class="block w-full py-4 rounded-xl font-bold text-center transition-all mb-4" :style="getButtonStyle">{{ section.content.contact.button.text }}</a>
              <p v-if="section.content.contact.phone" class="text-center opacity-70" :style="{ color: section.style?.textColor }">
                ou appelez-nous : <strong>{{ section.content.contact.phone }}</strong>
              </p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- PRICING: Layout Lifetime -->
      <template v-else-if="section.content?.layout === 'lifetime'">
        <div :style="{ maxWidth: section.style?.maxWidth || '550px', margin: '0 auto', padding: '0 1rem' }">
          <div class="rounded-3xl p-10 text-center" :style="{ backgroundColor: '#fef3c7' }">
            <span v-if="section.content?.badge" class="inline-block px-4 py-1 text-sm font-bold rounded-full mb-4 bg-red-500 text-white animate-pulse">{{ section.content.badge }}</span>
            <h2 class="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{{ section.content?.title }}</h2>
            <p class="text-gray-600 mb-6">{{ section.content?.subtitle }}</p>
            <div class="mb-6">
              <span v-if="section.content?.originalPrice" class="text-2xl text-gray-400 line-through mr-3">{{ section.content.originalPrice }}{{ section.content?.currency }}</span>
              <span class="text-6xl font-bold text-gray-900">{{ section.content?.price }}{{ section.content?.currency }}</span>
              <span v-if="section.content?.discount" class="ml-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">-{{ section.content.discount }}</span>
            </div>
            <ul v-if="section.content?.features" class="text-left max-w-sm mx-auto space-y-3 mb-8">
              <li v-for="(feat, fi) in section.content.features" :key="fi" class="flex items-center gap-3 text-gray-700">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                <span>{{ feat }}</span>
              </li>
            </ul>
            <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="block w-full py-4 rounded-xl font-bold text-lg text-center transition-all bg-gray-900 text-white hover:bg-gray-800">{{ section.content.button.text }}</a>
            <p v-if="section.content?.spotsLeft" class="mt-4 text-sm text-red-600 font-medium">Plus que {{ section.content.spotsLeft }} places disponibles !</p>
            <p v-if="section.content?.guarantee" class="mt-4 text-sm text-gray-500">{{ section.content.guarantee }}</p>
          </div>
        </div>
      </template>
      
      <!-- PRICING: Layout par défaut (Single) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '450px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <span v-if="section.content?.badge" class="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 bg-primary text-white">{{ section.content.badge }}</span>
            <h3 class="text-2xl font-bold mb-2 text-gray-900">{{ section.content?.title || 'Notre offre' }}</h3>
            <p v-if="section.content?.description" class="text-gray-600 mb-6">{{ section.content.description }}</p>
            <div class="my-6">
              <span class="text-5xl font-bold text-gray-900">{{ section.content?.price || '49' }}{{ section.content?.currency || '€' }}</span>
              <span class="text-gray-500">{{ section.content?.period || '/mois' }}</span>
            </div>
            <ul v-if="section.content?.features" class="text-left space-y-3 mb-8">
              <li v-for="(feature, i) in section.content.features" :key="i" class="flex items-center gap-2 text-gray-700">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
            <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="block w-full py-4 rounded-lg font-bold text-center transition-all" :style="getButtonStyle">{{ section.content.button.text || 'Commencer' }}</a>
            <p v-if="section.content?.guarantee" class="mt-4 text-sm text-gray-500">{{ section.content.guarantee }}</p>
          </div>
        </div>
      </template>
      
    </template>
    
    <!-- Spacer -->
    <template v-else-if="section.type === 'spacer'">
      <!-- SPACER: Responsive -->
      <template v-if="section.content?.layout === 'responsive'">
        <div class="w-full" :style="{ height: (section.content?.mobileHeight || 40) + 'px' }" :class="'md:h-[' + (section.content?.height || 80) + 'px]'"></div>
      </template>
      
      <!-- SPACER: Colored -->
      <template v-else-if="section.content?.layout === 'colored'">
        <div class="w-full" :style="{ height: (section.content?.height || 60) + 'px', backgroundColor: section.content?.color || '#f3f4f6' }"></div>
      </template>
      
      <!-- SPACER: Small -->
      <template v-else-if="section.content?.layout === 'small'">
        <div class="w-full h-8"></div>
      </template>
      
      <!-- SPACER: Large -->
      <template v-else-if="section.content?.layout === 'large'">
        <div class="w-full h-32"></div>
      </template>
      
      <!-- SPACER: Default (Medium) -->
      <template v-else>
        <div class="w-full" :style="{ height: (section.content?.height || 60) + 'px' }"></div>
      </template>
    </template>
    
    <!-- Divider -->
    <template v-else-if="section.type === 'divider'">
      <!-- DIVIDER: Short -->
      <template v-if="section.content?.layout === 'short'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
          <div class="flex justify-center">
            <hr class="w-24" :style="{ borderColor: section.content?.color || '#e5e7eb', borderWidth: (section.content?.thickness || 2) + 'px' }" />
          </div>
        </div>
      </template>
      
      <!-- DIVIDER: Gradient -->
      <template v-else-if="section.content?.layout === 'gradient'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
          <div class="h-1 rounded-full" :style="{ background: section.content?.gradient || 'linear-gradient(90deg, transparent, #10B981, transparent)' }"></div>
        </div>
      </template>
      
      <!-- DIVIDER: Dots -->
      <template v-else-if="section.content?.layout === 'dots'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
          <div class="flex justify-center items-center gap-4">
            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: section.content?.color || '#d1d5db' }"></span>
            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: section.content?.color || '#d1d5db' }"></span>
            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: section.content?.color || '#d1d5db' }"></span>
          </div>
        </div>
      </template>
      
      <!-- DIVIDER: Icon -->
      <template v-else-if="section.content?.layout === 'icon'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
          <div class="flex items-center gap-4">
            <div class="flex-1 h-px" :style="{ backgroundColor: section.content?.color || '#e5e7eb' }"></div>
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :style="{ backgroundColor: section.content?.iconBgColor || '#f3f4f6' }">
              <svg v-if="section.content?.icon === 'star'" class="w-5 h-5" :style="{ color: section.content?.iconColor || '#6b7280' }" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <svg v-else-if="section.content?.icon === 'heart'" class="w-5 h-5" :style="{ color: section.content?.iconColor || '#6b7280' }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>
              <svg v-else class="w-5 h-5" :style="{ color: section.content?.iconColor || '#6b7280' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
            </div>
            <div class="flex-1 h-px" :style="{ backgroundColor: section.content?.color || '#e5e7eb' }"></div>
          </div>
        </div>
      </template>
      
      <!-- DIVIDER: Wave -->
      <template v-else-if="section.content?.layout === 'wave'">
        <div class="w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full" :style="{ height: (section.content?.height || 60) + 'px', fill: section.content?.color || '#f3f4f6' }">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </template>
      
      <!-- DIVIDER: Dashed -->
      <template v-else-if="section.content?.layout === 'dashed'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
          <hr :style="{ borderColor: section.content?.color || '#e5e7eb', borderStyle: 'dashed', borderWidth: (section.content?.thickness || 1) + 'px' }" />
        </div>
      </template>
      
      <!-- DIVIDER: Default (Line) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
          <hr :style="{ borderColor: section.content?.color || '#e5e7eb', borderStyle: section.content?.style || 'solid', width: section.content?.width || '100%', borderWidth: (section.content?.thickness || 1) + 'px' }" />
        </div>
      </template>
    </template>
    
    <!-- Gallery -->
    <template v-else-if="section.type === 'gallery'">
      <!-- GALLERY: Masonry -->
      <template v-if="section.content?.layout === 'masonry'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            <div v-for="(image, index) in (section.content?.images || [])" :key="index" class="break-inside-avoid">
              <div class="rounded-lg overflow-hidden bg-gray-100">
                <img v-if="image.src" :src="image.src" :alt="image.alt || 'Image'" class="w-full h-auto" />
              </div>
              <p v-if="image.caption" class="text-sm mt-2 opacity-70" :style="{ color: section.style?.textColor }">{{ image.caption }}</p>
            </div>
          </div>
        </div>
      </template>
      
      <!-- GALLERY: Carousel -->
      <template v-else-if="section.content?.layout === 'carousel'">
        <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="relative overflow-hidden rounded-xl">
            <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div v-for="(image, index) in (section.content?.images || [])" :key="index" class="flex-none w-full">
                <img v-if="image.src" :src="image.src" :alt="image.alt" class="w-full h-[500px] object-cover" />
              </div>
            </div>
            <button @click="prevSlide" class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button @click="nextSlide" class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div class="flex justify-center gap-2 mt-4">
            <button v-for="(_, index) in (section.content?.images || [])" :key="index" @click="currentSlide = index" class="w-2 h-2 rounded-full transition-all" :class="currentSlide === index ? 'bg-primary w-6' : 'bg-gray-300'"></button>
          </div>
        </div>
      </template>
      
      <!-- GALLERY: Featured -->
      <template v-else-if="section.content?.layout === 'featured'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="grid grid-cols-4 grid-rows-2 gap-4 h-[600px]">
            <div v-if="section.content?.images?.[0]" class="col-span-2 row-span-2 rounded-xl overflow-hidden bg-gray-100">
              <img :src="section.content.images[0].src" :alt="section.content.images[0].alt" class="w-full h-full object-cover" />
            </div>
            <div v-for="(image, index) in (section.content?.images || []).slice(1, 5)" :key="index" class="rounded-xl overflow-hidden bg-gray-100">
              <img v-if="image.src" :src="image.src" :alt="image.alt" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </template>
      
      <!-- GALLERY: Hover -->
      <template v-else-if="section.content?.layout === 'hover'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="(image, index) in (section.content?.images || [])" :key="index" class="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img v-if="image.src" :src="image.src" :alt="image.alt" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div class="text-center text-white p-4">
                  <p class="font-bold">{{ image.title || 'Image' }}</p>
                  <p v-if="image.caption" class="text-sm opacity-80 mt-1">{{ image.caption }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- GALLERY: Filmstrip -->
      <template v-else-if="section.content?.layout === 'filmstrip'">
        <div :style="{ maxWidth: section.style?.maxWidth || '100%', margin: '0 auto' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center px-4" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="flex gap-2 overflow-x-auto pb-4 px-4 scrollbar-hide">
            <div v-for="(image, index) in (section.content?.images || [])" :key="index" class="flex-none w-72 h-48 rounded-lg overflow-hidden bg-gray-100">
              <img v-if="image.src" :src="image.src" :alt="image.alt" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </template>
      
      <!-- GALLERY: Justified -->
      <template v-else-if="section.content?.layout === 'justified'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="flex flex-wrap gap-2">
            <div v-for="(image, index) in (section.content?.images || [])" :key="index" class="flex-grow h-48 min-w-[200px] max-w-[400px] rounded-lg overflow-hidden bg-gray-100">
              <img v-if="image.src" :src="image.src" :alt="image.alt" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </template>
      
      <!-- GALLERY: Lightbox -->
      <template v-else-if="section.content?.layout === 'lightbox'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div 
              v-for="(image, index) in (section.content?.images || [])" 
              :key="index" 
              @click="openLightbox(Number(index))"
              class="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-primary transition-all group"
            >
              <img v-if="image.src" :src="image.src" :alt="image.alt" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              </div>
            </div>
          </div>
          <p class="text-center text-sm opacity-60 mt-4" :style="{ color: section.style?.textColor }">Cliquez sur une image pour l'agrandir</p>
        </div>
        
        <!-- Lightbox Modal -->
        <Teleport to="body">
          <div v-if="lightboxOpen" class="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" @click.self="closeLightbox">
            <button @click="closeLightbox" class="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button @click="lightboxPrev" class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button @click="lightboxNext" class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            <div class="max-w-5xl max-h-[90vh] px-16">
              <img 
                v-if="section.content?.images?.[lightboxIndex]?.src" 
                :src="section.content.images[lightboxIndex].src" 
                :alt="section.content.images[lightboxIndex].alt || 'Image'" 
                class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <p v-if="section.content?.images?.[lightboxIndex]?.caption" class="text-white text-center mt-4 opacity-80">{{ section.content.images[lightboxIndex].caption }}</p>
            </div>
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {{ lightboxIndex + 1 }} / {{ section.content?.images?.length || 0 }}
            </div>
          </div>
        </Teleport>
      </template>
      
      <!-- GALLERY: Default (Grid) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '1280px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${section.content?.columns || 3}, 1fr)` }">
            <div v-for="(image, index) in (section.content?.images || [])" :key="index" class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img v-if="image.src" :src="image.src" :alt="image.alt || 'Image'" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>
          </div>
          <div v-if="!section.content?.images?.length" class="text-center py-12 text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p>Aucune image dans la galerie</p>
          </div>
        </div>
      </template>
    </template>
    
    <!-- Video -->
    <template v-else-if="section.type === 'video'">
      <!-- VIDEO: Hero (Full width) -->
      <template v-if="section.content?.layout === 'hero'">
        <div class="relative w-full" :style="{ height: (section.content?.height || 600) + 'px' }">
          <div class="absolute inset-0 bg-gray-900">
            <iframe v-if="section.content?.url" :src="getVideoEmbedUrl(section.content.url) + '?autoplay=1&mute=1&loop=1&controls=0'" class="w-full h-full" frameborder="0" allow="autoplay"></iframe>
          </div>
          <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div class="text-center text-white max-w-2xl px-4">
              <h2 v-if="section.content?.title" class="text-4xl md:text-5xl font-bold mb-4">{{ section.content.title }}</h2>
              <p v-if="section.content?.description" class="text-xl opacity-90 mb-8">{{ section.content.description }}</p>
              <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all" :style="getButtonStyle">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                {{ section.content.button.text }}
              </a>
            </div>
          </div>
        </div>
      </template>
      
      <!-- VIDEO: Split (Video + Texte) -->
      <template v-else-if="section.content?.layout === 'split'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="aspect-video bg-gray-900 rounded-xl overflow-hidden">
              <iframe v-if="section.content?.url" :src="getVideoEmbedUrl(section.content.url)" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div>
              <span v-if="section.content?.badge" class="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4" :style="{ backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }">{{ section.content.badge }}</span>
              <h2 class="text-3xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
              <p class="text-lg opacity-80 mb-6" :style="{ color: section.style?.textColor }">{{ section.content?.description }}</p>
              <ul v-if="section.content?.features" class="space-y-3 mb-8">
                <li v-for="(feat, i) in section.content.features" :key="i" class="flex items-center gap-3" :style="{ color: section.style?.textColor }">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  <span>{{ feat }}</span>
                </li>
              </ul>
              <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="inline-block px-6 py-3 rounded-lg font-semibold transition-all" :style="getButtonStyle">{{ section.content.button.text }}</a>
            </div>
          </div>
        </div>
      </template>
      
      <!-- VIDEO: Modal (Thumbnail avec play) -->
      <template v-else-if="section.content?.layout === 'modal'">
        <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group">
            <img v-if="section.content?.thumbnail" :src="section.content.thumbnail" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div v-else class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
            <div class="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-all">
              <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
          <p v-if="section.content?.description" class="text-center mt-4 opacity-70" :style="{ color: section.style?.textColor }">{{ section.content.description }}</p>
        </div>
      </template>
      
      <!-- VIDEO: Grid -->
      <template v-else-if="section.content?.layout === 'grid'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1200px', margin: '0 auto', padding: '0 1rem' }">
          <h2 v-if="section.content?.title" class="text-3xl font-bold mb-8 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(video, index) in (section.content?.videos || [])" :key="index" class="rounded-xl overflow-hidden bg-gray-100">
              <div class="aspect-video">
                <iframe v-if="video.url" :src="getVideoEmbedUrl(video.url)" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
              </div>
              <div v-if="video.title || video.description" class="p-4" :style="{ backgroundColor: section.style?.textColor + '08' }">
                <h4 v-if="video.title" class="font-bold" :style="{ color: section.style?.textColor }">{{ video.title }}</h4>
                <p v-if="video.description" class="text-sm opacity-70 mt-1" :style="{ color: section.style?.textColor }">{{ video.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- VIDEO: Description (avec texte à côté) -->
      <template v-else-if="section.content?.layout === 'description'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1000px', margin: '0 auto', padding: '0 1rem' }">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold mb-2" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
            <p v-if="section.content?.subtitle" class="text-lg opacity-70" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          </div>
          <div class="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <iframe v-if="section.content?.url" :src="getVideoEmbedUrl(section.content.url)" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <div v-if="section.content?.description" class="mt-8 text-center max-w-2xl mx-auto">
            <p class="text-lg" :style="{ color: section.style?.textColor }">{{ section.content.description }}</p>
          </div>
        </div>
      </template>
      
      <!-- VIDEO: Default (Centered) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem' }">
          <h3 v-if="section.content?.title" class="text-xl font-semibold mb-4 text-center" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h3>
          <div class="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <iframe v-if="section.content?.url" :src="getVideoEmbedUrl(section.content.url)" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
              <div class="text-center">
                <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <p>Ajoutez une URL YouTube ou Vimeo</p>
              </div>
            </div>
          </div>
          <p v-if="section.content?.description" class="mt-3 text-sm text-center opacity-70" :style="{ color: section.style?.textColor }">{{ section.content.description }}</p>
        </div>
      </template>
    </template>
    
    <!-- Countdown -->
    <template v-else-if="section.type === 'countdown'">
      <!-- COUNTDOWN: Elegant -->
      <template v-if="section.content?.layout === 'elegant'">
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <span v-if="section.content?.badge" class="inline-block px-4 py-1 text-sm font-medium rounded-full mb-4" :style="{ backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }">{{ section.content.badge }}</span>
          <h2 class="text-3xl md:text-4xl font-light mb-2" :style="{ color: section.style?.textColor }">{{ section.content?.title || 'Bientôt' }}</h2>
          <p v-if="section.content?.subtitle" class="text-lg opacity-60 mb-10" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          <div class="flex justify-center gap-8">
            <div class="text-center">
              <div class="text-6xl md:text-7xl font-extralight tracking-tight" :style="{ color: section.style?.textColor }">{{ countdownDays }}</div>
              <div class="text-sm uppercase tracking-widest opacity-50 mt-2" :style="{ color: section.style?.textColor }">Jours</div>
            </div>
            <div class="text-5xl font-extralight opacity-30" :style="{ color: section.style?.textColor }">:</div>
            <div class="text-center">
              <div class="text-6xl md:text-7xl font-extralight tracking-tight" :style="{ color: section.style?.textColor }">{{ countdownHours }}</div>
              <div class="text-sm uppercase tracking-widest opacity-50 mt-2" :style="{ color: section.style?.textColor }">Heures</div>
            </div>
            <div class="text-5xl font-extralight opacity-30" :style="{ color: section.style?.textColor }">:</div>
            <div class="text-center">
              <div class="text-6xl md:text-7xl font-extralight tracking-tight" :style="{ color: section.style?.textColor }">{{ countdownMinutes }}</div>
              <div class="text-sm uppercase tracking-widest opacity-50 mt-2" :style="{ color: section.style?.textColor }">Min</div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- COUNTDOWN: Launch -->
      <template v-else-if="section.content?.layout === 'launch'">
        <div :style="{ maxWidth: section.style?.maxWidth || '900px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <div class="inline-block px-4 py-2 rounded-full mb-6 animate-pulse" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
            <span class="text-white font-bold">🚀 {{ section.content?.badge || 'Lancement imminent' }}</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ section.content?.title || 'Lancement dans' }}</h2>
          <p v-if="section.content?.subtitle" class="text-xl opacity-70 mb-10" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          <div class="flex justify-center gap-4">
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex flex-col items-center justify-center" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
              <div class="text-4xl md:text-5xl font-bold text-white">{{ countdownDays }}</div>
              <div class="text-xs text-white/80 uppercase">Jours</div>
            </div>
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex flex-col items-center justify-center" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
              <div class="text-4xl md:text-5xl font-bold text-white">{{ countdownHours }}</div>
              <div class="text-xs text-white/80 uppercase">Heures</div>
            </div>
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex flex-col items-center justify-center" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
              <div class="text-4xl md:text-5xl font-bold text-white">{{ countdownMinutes }}</div>
              <div class="text-xs text-white/80 uppercase">Min</div>
            </div>
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex flex-col items-center justify-center" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
              <div class="text-4xl md:text-5xl font-bold text-white">{{ countdownSeconds }}</div>
              <div class="text-xs text-white/80 uppercase">Sec</div>
            </div>
          </div>
          <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="inline-block mt-10 px-8 py-4 rounded-full font-bold text-lg text-white transition-all hover:scale-105" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">{{ section.content.button.text }}</a>
        </div>
      </template>
      
      <!-- COUNTDOWN: Event -->
      <template v-else-if="section.content?.layout === 'event'">
        <div :style="{ maxWidth: section.style?.maxWidth || '1000px', margin: '0 auto', padding: '0 1rem' }">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span v-if="section.content?.date" class="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" :style="{ backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {{ section.content.date }}
              </span>
              <h2 class="text-3xl md:text-4xl font-bold mb-4" :style="{ color: section.style?.textColor }">{{ section.content?.title }}</h2>
              <p class="text-lg opacity-80 mb-6" :style="{ color: section.style?.textColor }">{{ section.content?.description }}</p>
              <div v-if="section.content?.location" class="flex items-center gap-2 opacity-70" :style="{ color: section.style?.textColor }">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                {{ section.content.location }}
              </div>
            </div>
            <div class="p-8 rounded-2xl" :style="{ backgroundColor: section.style?.textColor + '08' }">
              <div class="text-center mb-6">
                <p class="text-sm uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">L'événement commence dans</p>
              </div>
              <div class="grid grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-3xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownDays }}</div>
                  <div class="text-xs uppercase opacity-50" :style="{ color: section.style?.textColor }">Jours</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownHours }}</div>
                  <div class="text-xs uppercase opacity-50" :style="{ color: section.style?.textColor }">Heures</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownMinutes }}</div>
                  <div class="text-xs uppercase opacity-50" :style="{ color: section.style?.textColor }">Min</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownSeconds }}</div>
                  <div class="text-xs uppercase opacity-50" :style="{ color: section.style?.textColor }">Sec</div>
                </div>
              </div>
              <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="block w-full mt-8 py-4 rounded-xl font-bold text-center transition-all" :style="getButtonStyle">{{ section.content.button.text }}</a>
            </div>
          </div>
        </div>
      </template>
      
      <!-- COUNTDOWN: Promo -->
      <template v-else-if="section.content?.layout === 'promo'">
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem' }">
          <div class="rounded-2xl p-8 text-center" style="background: linear-gradient(135deg, #dc2626, #ea580c);">
            <span v-if="section.content?.badge" class="inline-block px-4 py-1 bg-white text-red-600 font-bold rounded-full mb-4">{{ section.content.badge }}</span>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">{{ section.content?.title || 'Offre spéciale' }}</h2>
            <p v-if="section.content?.subtitle" class="text-white/80 mb-8">{{ section.content.subtitle }}</p>
            <div class="flex justify-center gap-4 mb-8">
              <div class="w-20 h-20 bg-white/20 rounded-xl flex flex-col items-center justify-center">
                <div class="text-3xl font-bold text-white">{{ countdownDays }}</div>
                <div class="text-xs text-white/70">J</div>
              </div>
              <div class="w-20 h-20 bg-white/20 rounded-xl flex flex-col items-center justify-center">
                <div class="text-3xl font-bold text-white">{{ countdownHours }}</div>
                <div class="text-xs text-white/70">H</div>
              </div>
              <div class="w-20 h-20 bg-white/20 rounded-xl flex flex-col items-center justify-center">
                <div class="text-3xl font-bold text-white">{{ countdownMinutes }}</div>
                <div class="text-xs text-white/70">M</div>
              </div>
              <div class="w-20 h-20 bg-white/20 rounded-xl flex flex-col items-center justify-center">
                <div class="text-3xl font-bold text-white">{{ countdownSeconds }}</div>
                <div class="text-xs text-white/70">S</div>
              </div>
            </div>
            <a v-if="section.content?.button" :href="section.content.button.url || '#'" class="inline-block px-8 py-4 bg-white text-red-600 rounded-full font-bold text-lg transition-all hover:scale-105">{{ section.content.button.text }}</a>
          </div>
        </div>
      </template>
      
      <!-- COUNTDOWN: Minimal -->
      <template v-else-if="section.content?.layout === 'minimal'">
        <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h3 v-if="section.content?.title" class="text-lg font-medium mb-4 opacity-70" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h3>
          <div class="flex justify-center items-center gap-2">
            <span class="text-2xl font-mono font-bold" :style="{ color: section.style?.textColor }">{{ countdownDays }}j</span>
            <span class="opacity-30" :style="{ color: section.style?.textColor }">:</span>
            <span class="text-2xl font-mono font-bold" :style="{ color: section.style?.textColor }">{{ countdownHours }}h</span>
            <span class="opacity-30" :style="{ color: section.style?.textColor }">:</span>
            <span class="text-2xl font-mono font-bold" :style="{ color: section.style?.textColor }">{{ countdownMinutes }}m</span>
            <span class="opacity-30" :style="{ color: section.style?.textColor }">:</span>
            <span class="text-2xl font-mono font-bold" :style="{ color: section.style?.textColor }">{{ countdownSeconds }}s</span>
          </div>
        </div>
      </template>
      
      <!-- COUNTDOWN: Default (Urgent) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h2 class="text-2xl md:text-3xl font-bold mb-2" :style="{ color: section.style?.textColor }">{{ section.content?.title || 'Offre limitée' }}</h2>
          <p v-if="section.content?.subtitle" class="mb-6 opacity-80" :style="{ color: section.style?.textColor }">{{ section.content.subtitle }}</p>
          <div class="flex justify-center gap-4">
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownDays }}</div>
              <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Jours</div>
            </div>
            <div class="text-3xl font-bold opacity-50" :style="{ color: section.style?.textColor }">:</div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownHours }}</div>
              <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Heures</div>
            </div>
            <div class="text-3xl font-bold opacity-50" :style="{ color: section.style?.textColor }">:</div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownMinutes }}</div>
              <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Minutes</div>
            </div>
            <div class="text-3xl font-bold opacity-50" :style="{ color: section.style?.textColor }">:</div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold" :style="{ color: section.style?.textColor }">{{ countdownSeconds }}</div>
              <div class="text-xs uppercase tracking-wider opacity-60" :style="{ color: section.style?.textColor }">Secondes</div>
            </div>
          </div>
        </div>
      </template>
    </template>
    
    <!-- Social -->
    <template v-else-if="section.type === 'social'">
      <!-- SOCIAL: Footer -->
      <template v-if="section.content?.layout === 'footer'">
        <div :style="{ maxWidth: section.style?.maxWidth || '100%', margin: '0 auto', padding: '0 1rem' }">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p v-if="section.content?.copyright" class="text-sm opacity-60" :style="{ color: section.style?.textColor }">{{ section.content.copyright }}</p>
            <div class="flex gap-4">
              <a v-if="section.content?.links?.facebook" :href="section.content.links.facebook" target="_blank" class="opacity-60 hover:opacity-100 transition-opacity" :style="{ color: section.style?.textColor }">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a v-if="section.content?.links?.instagram" :href="section.content.links.instagram" target="_blank" class="opacity-60 hover:opacity-100 transition-opacity" :style="{ color: section.style?.textColor }">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a v-if="section.content?.links?.twitter" :href="section.content.links.twitter" target="_blank" class="opacity-60 hover:opacity-100 transition-opacity" :style="{ color: section.style?.textColor }">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a v-if="section.content?.links?.youtube" :href="section.content.links.youtube" target="_blank" class="opacity-60 hover:opacity-100 transition-opacity" :style="{ color: section.style?.textColor }">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a v-if="section.content?.links?.linkedin" :href="section.content.links.linkedin" target="_blank" class="opacity-60 hover:opacity-100 transition-opacity" :style="{ color: section.style?.textColor }">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </template>
      
      <!-- SOCIAL: Colored (boutons colorés) -->
      <template v-else-if="section.content?.layout === 'colored'">
        <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h3 v-if="section.content?.title" class="text-2xl font-bold mb-6" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h3>
          <div class="flex flex-wrap justify-center gap-4">
            <a v-if="section.content?.links?.facebook" :href="section.content.links.facebook" target="_blank" class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:scale-110" style="background: #1877F2;"><svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            <a v-if="section.content?.links?.instagram" :href="section.content.links.instagram" target="_blank" class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:scale-110" style="background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);"><svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
            <a v-if="section.content?.links?.twitter" :href="section.content.links.twitter" target="_blank" class="w-14 h-14 rounded-2xl flex items-center justify-center bg-black transition-transform hover:scale-110"><svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
            <a v-if="section.content?.links?.youtube" :href="section.content.links.youtube" target="_blank" class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:scale-110" style="background: #FF0000;"><svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            <a v-if="section.content?.links?.linkedin" :href="section.content.links.linkedin" target="_blank" class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:scale-110" style="background: #0A66C2;"><svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            <a v-if="section.content?.links?.tiktok" :href="section.content.links.tiktok" target="_blank" class="w-14 h-14 rounded-2xl flex items-center justify-center bg-black transition-transform hover:scale-110"><svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
          </div>
        </div>
      </template>
      
      <!-- SOCIAL: Buttons (avec texte) -->
      <template v-else-if="section.content?.layout === 'buttons'">
        <div :style="{ maxWidth: section.style?.maxWidth || '400px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h3 v-if="section.content?.title" class="text-2xl font-bold mb-6" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h3>
          <div class="space-y-3">
            <a v-if="section.content?.links?.facebook" :href="section.content.links.facebook" target="_blank" class="flex items-center justify-center gap-3 w-full py-3 rounded-lg text-white font-medium transition-all hover:opacity-90" style="background: #1877F2;"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Facebook</a>
            <a v-if="section.content?.links?.instagram" :href="section.content.links.instagram" target="_blank" class="flex items-center justify-center gap-3 w-full py-3 rounded-lg text-white font-medium transition-all hover:opacity-90" style="background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> Instagram</a>
            <a v-if="section.content?.links?.twitter" :href="section.content.links.twitter" target="_blank" class="flex items-center justify-center gap-3 w-full py-3 rounded-lg text-white font-medium bg-black transition-all hover:opacity-90"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X (Twitter)</a>
            <a v-if="section.content?.links?.linkedin" :href="section.content.links.linkedin" target="_blank" class="flex items-center justify-center gap-3 w-full py-3 rounded-lg text-white font-medium transition-all hover:opacity-90" style="background: #0A66C2;"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> LinkedIn</a>
          </div>
        </div>
      </template>
      
      <!-- SOCIAL: Stats (avec compteurs) -->
      <template v-else-if="section.content?.layout === 'stats'">
        <div :style="{ maxWidth: section.style?.maxWidth || '800px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h3 v-if="section.content?.title" class="text-2xl font-bold mb-8" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h3>
          <div class="flex flex-wrap justify-center gap-8">
            <div v-if="section.content?.stats?.followers" class="text-center">
              <div class="text-4xl font-bold mb-1" :style="{ color: section.style?.textColor }">{{ section.content.stats.followers }}</div>
              <div class="text-sm opacity-60" :style="{ color: section.style?.textColor }">Followers</div>
            </div>
            <div v-if="section.content?.stats?.subscribers" class="text-center">
              <div class="text-4xl font-bold mb-1" :style="{ color: section.style?.textColor }">{{ section.content.stats.subscribers }}</div>
              <div class="text-sm opacity-60" :style="{ color: section.style?.textColor }">Abonnés</div>
            </div>
            <div v-if="section.content?.stats?.posts" class="text-center">
              <div class="text-4xl font-bold mb-1" :style="{ color: section.style?.textColor }">{{ section.content.stats.posts }}</div>
              <div class="text-sm opacity-60" :style="{ color: section.style?.textColor }">Posts</div>
            </div>
          </div>
          <div class="flex justify-center gap-4 mt-8">
            <a v-if="section.content?.links?.facebook" :href="section.content.links.facebook" target="_blank" class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110" :style="{ backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            <a v-if="section.content?.links?.instagram" :href="section.content.links.instagram" target="_blank" class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110" :style="{ backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
            <a v-if="section.content?.links?.twitter" :href="section.content.links.twitter" target="_blank" class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110" :style="{ backgroundColor: section.style?.textColor + '10', color: section.style?.textColor }"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          </div>
        </div>
      </template>
      
      <!-- SOCIAL: CTA (avec message) -->
      <template v-else-if="section.content?.layout === 'cta'">
        <div :style="{ maxWidth: section.style?.maxWidth || '600px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h3 class="text-2xl font-bold mb-2" :style="{ color: section.style?.textColor }">{{ section.content?.title || 'Rejoignez-nous' }}</h3>
          <p class="opacity-70 mb-8" :style="{ color: section.style?.textColor }">{{ section.content?.subtitle || 'Suivez-nous sur les réseaux sociaux' }}</p>
          <div class="flex justify-center gap-4">
            <a v-if="section.content?.links?.facebook" :href="section.content.links.facebook" target="_blank" class="w-14 h-14 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110" style="background: #1877F2;"><svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            <a v-if="section.content?.links?.instagram" :href="section.content.links.instagram" target="_blank" class="w-14 h-14 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110" style="background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);"><svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
            <a v-if="section.content?.links?.twitter" :href="section.content.links.twitter" target="_blank" class="w-14 h-14 rounded-xl flex items-center justify-center text-white bg-black transition-all hover:scale-110"><svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
            <a v-if="section.content?.links?.youtube" :href="section.content.links.youtube" target="_blank" class="w-14 h-14 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110" style="background: #FF0000;"><svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
          </div>
        </div>
      </template>
      
      <!-- SOCIAL: Default (Centered) -->
      <template v-else>
        <div :style="{ maxWidth: section.style?.maxWidth || '400px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }">
          <h3 v-if="section.content?.title" class="text-lg font-semibold mb-4" :style="{ color: section.style?.textColor }">{{ section.content.title }}</h3>
          <div class="flex justify-center gap-4">
            <a v-if="section.content?.links?.facebook" :href="section.content.links.facebook" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70" :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            <a v-if="section.content?.links?.instagram" :href="section.content.links.instagram" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70" :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
            <a v-if="section.content?.links?.twitter" :href="section.content.links.twitter" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70" :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
            <a v-if="section.content?.links?.youtube" :href="section.content.links.youtube" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70" :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            <a v-if="section.content?.links?.linkedin" :href="section.content.links.linkedin" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70" :style="{ backgroundColor: section.style?.textColor + '15', color: section.style?.textColor }"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
          </div>
          <div v-if="!hasAnySocialLink" class="py-8 text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            <p class="text-sm">Ajoutez vos liens de réseaux sociaux</p>
          </div>
        </div>
      </template>
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

// Testimonials carousel state
const currentTestimonial = ref(0)
let testimonialInterval: ReturnType<typeof setInterval> | null = null

// Slider navigation
const prevSlide = () => {
  const slides = props.section.content?.slides || []
  currentSlide.value = currentSlide.value === 0 ? slides.length - 1 : currentSlide.value - 1
}

const nextSlide = () => {
  const slides = props.section.content?.slides || []
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

// Testimonials navigation
const prevTestimonial = () => {
  const items = props.section.content?.items || []
  currentTestimonial.value = currentTestimonial.value === 0 ? items.length - 1 : currentTestimonial.value - 1
}

const nextTestimonial = () => {
  const items = props.section.content?.items || []
  currentTestimonial.value = (currentTestimonial.value + 1) % items.length
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

// FAQ Accordion - open items tracking
const openFaqItems = ref<Set<number>>(new Set([0])) // First item open by default

const toggleFaqItem = (index: number) => {
  const newSet = new Set(openFaqItems.value)
  if (newSet.has(index)) {
    newSet.delete(index)
  } else {
    newSet.add(index)
  }
  openFaqItems.value = newSet
}

// FAQ Search query
const faqSearchQuery = ref('')

const filteredFaqItems = computed(() => {
  const items = props.section.content?.items || []
  if (!faqSearchQuery.value.trim()) return items
  const query = faqSearchQuery.value.toLowerCase()
  return items.filter((item: any) => 
    item.question?.toLowerCase().includes(query) || 
    item.answer?.toLowerCase().includes(query)
  )
})

// Gallery Lightbox
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const lightboxPrev = () => {
  const images = props.section.content?.images || []
  lightboxIndex.value = lightboxIndex.value === 0 ? images.length - 1 : lightboxIndex.value - 1
}

const lightboxNext = () => {
  const images = props.section.content?.images || []
  lightboxIndex.value = (lightboxIndex.value + 1) % images.length
}

// Pricing billing period toggle
const selectedBillingPeriod = ref<'monthly' | 'yearly'>('monthly')

// Initialize billing period from section content
onMounted(() => {
  if (props.section.content?.billingPeriod) {
    selectedBillingPeriod.value = props.section.content.billingPeriod as 'monthly' | 'yearly'
  }
})

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
