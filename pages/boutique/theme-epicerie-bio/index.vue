<template>
  <div class="min-h-screen font-sans" :style="{ fontFamily, color: textColor }">

    <!-- ══════════════════════════════════════════════════
         BARRE D'ANNONCE (promo du moment)
         ══════════════════════════════════════════════════ -->
    <div class="promo-bar text-white text-xs sm:text-sm text-center py-2.5 px-4">
      <span class="font-medium">🌿 Livraison gratuite dès 25 000 XOF d'achat</span>
      <span class="hidden sm:inline mx-3 opacity-40">|</span>
      <span class="hidden sm:inline">Commande traitée sous 24h · Du lundi au samedi</span>
    </div>

    <!-- ══════════════════════════════════════════════════
         HEADER
         ══════════════════════════════════════════════════ -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 md:h-20 gap-4">

          <!-- Logo -->
          <NuxtLink :to="`/boutique/${shop?.subdomain}`" class="flex-shrink-0 flex items-center gap-3">
            <img v-if="shop?.logo" :src="getImageUrl(shop.logo)" :alt="shop?.name"
              class="h-10 w-10 object-contain rounded-full" />
            <div v-else class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              :style="{ backgroundColor: primaryColor }">
              {{ shop?.name?.[0]?.toUpperCase() || 'B' }}
            </div>
            <span class="font-bold text-gray-900 text-lg hidden sm:block truncate max-w-[160px]">{{ shop?.name }}</span>
          </NuxtLink>

          <!-- Barre de recherche (desktop) -->
          <div class="hidden md:flex flex-1 max-w-xl mx-6">
            <div class="relative w-full">
              <input v-model="searchQuery"
                type="text"
                placeholder="Rechercher un produit..."
                class="w-full pl-4 pr-12 py-2.5 rounded-full border-2 text-sm focus:outline-none transition-colors"
                :style="{ borderColor: searchFocused ? primaryColor : '#e5e7eb' }"
                @focus="searchFocused = true"
                @blur="searchFocused = false"
              />
              <button class="absolute right-0 top-0 h-full px-4 rounded-r-full text-white transition-colors"
                :style="{ backgroundColor: primaryColor }">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Actions header -->
          <div class="flex items-center gap-2 sm:gap-4">
            <!-- Mon compte -->
            <NuxtLink :to="`/boutique/${shop?.subdomain}/connexion`"
              class="hidden sm:flex items-center gap-1.5 text-gray-700 hover:text-green-600 transition-colors text-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>Mon compte</span>
            </NuxtLink>

            <!-- Panier -->
            <NuxtLink v-if="shop?.shop_type !== 'website'" :to="`/boutique/${shop?.subdomain}/panier`"
              class="flex items-center gap-1.5 text-gray-700 hover:text-green-600 transition-colors relative">
              <div class="relative">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span v-if="cartCount > 0"
                  class="absolute -top-2 -right-2 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  :style="{ backgroundColor: primaryColor }">{{ cartCount }}</span>
              </div>
              <span class="hidden sm:block text-sm font-medium">Panier</span>
            </NuxtLink>

            <!-- Menu mobile toggle -->
            <button @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 text-gray-700" aria-label="Menu">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation desktop -->
        <nav class="hidden md:flex items-center gap-6 border-t border-gray-100 py-3">
          <NuxtLink :to="`/boutique/${shop?.subdomain}`"
            class="text-sm font-semibold transition-colors"
            :style="{ color: primaryColor }">Accueil</NuxtLink>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Tous les produits</NuxtLink>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/a-propos`"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">À propos</NuxtLink>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/contact`"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Contact</NuxtLink>

          <!-- Badges qualité -->
          <div class="ml-auto flex items-center gap-4">
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <span class="text-base">🌿</span>
              <span>100% Naturel</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <span class="text-base">🚚</span>
              <span>Livraison rapide</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <span class="text-base">✅</span>
              <span>Qualité garantie</span>
            </div>
          </div>
        </nav>
      </div>

      <!-- Menu mobile déroulant -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
        <div class="relative mb-4">
          <input v-model="searchQuery" type="text" placeholder="Rechercher..."
            class="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-green-400"/>
          <svg class="absolute right-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <NuxtLink :to="`/boutique/${shop?.subdomain}`" @click="mobileMenuOpen=false"
          class="block py-2 font-semibold" :style="{ color: primaryColor }">Accueil</NuxtLink>
        <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`" @click="mobileMenuOpen=false"
          class="block py-2 text-gray-700">Tous les produits</NuxtLink>
        <NuxtLink :to="`/boutique/${shop?.subdomain}/a-propos`" @click="mobileMenuOpen=false"
          class="block py-2 text-gray-700">À propos</NuxtLink>
      </div>
    </header>

    <main>
      <!-- ══════════════════════════════════════════════════
           HERO SLIDER
           ══════════════════════════════════════════════════ -->
      <section class="relative overflow-hidden hero-section">
        <!-- Slides -->
        <div class="flex transition-transform duration-700 ease-in-out h-full"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div v-for="(image, index) in bannerImages" :key="index"
            class="w-full flex-shrink-0 relative h-[420px] sm:h-[520px] md:h-[600px]">
            <img :src="image" :alt="`Slide ${index + 1}`"
              class="w-full h-full object-cover select-none"
              @contextmenu.prevent @dragstart.prevent draggable="false" loading="lazy" />
            <div class="absolute inset-0 flex items-center" style="background: linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);">
              <div class="text-white max-w-2xl px-8 md:px-16 lg:px-24">
                <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 bg-white/20 backdrop-blur-sm">
                  🌱 Produits frais & naturels
                </span>
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  {{ bannerTitle }}
                </h1>
                <p class="text-base sm:text-lg md:text-xl mb-8 text-white/90 max-w-lg">
                  {{ bannerSubtitle }}
                </p>
                <div class="flex flex-wrap gap-3">
                  <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`"
                    class="inline-block px-6 py-3 text-white text-sm font-semibold rounded-full transition-all hover:scale-105 shadow-lg"
                    :style="{ backgroundColor: primaryColor }">
                    {{ bannerButtonText }}
                  </NuxtLink>
                  <NuxtLink :to="`/boutique/${shop?.subdomain}/a-propos`"
                    class="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full hover:bg-white/30 transition-all border border-white/40">
                    En savoir plus
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contrôles slider -->
        <button @click="prevSlide"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all z-10">
          <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button @click="nextSlide"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all z-10">
          <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Indicateurs -->
        <div class="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <button v-for="(_, i) in bannerImages" :key="i"
            @click="currentSlide = i"
            class="transition-all rounded-full"
            :class="currentSlide === i ? 'w-8 h-2.5' : 'w-2.5 h-2.5 bg-white/50'"
            :style="currentSlide === i ? { backgroundColor: primaryColor } : {}"></button>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           BADGES DE CONFIANCE
           ══════════════════════════════════════════════════ -->
      <section class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            <div v-for="badge in trustBadges" :key="badge.title"
              class="flex flex-col sm:flex-row items-center gap-3 py-5 px-4 sm:px-6">
              <span class="text-3xl flex-shrink-0">{{ badge.icon }}</span>
              <div class="text-center sm:text-left">
                <p class="text-sm font-semibold text-gray-900">{{ badge.title }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ badge.subtitle }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           CATÉGORIES POPULAIRES
           ══════════════════════════════════════════════════ -->
      <section class="py-14 md:py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-10">
            <span class="section-tag">Nos rayons</span>
            <h2 class="section-title mt-2">Explorez nos catégories</h2>
            <p class="text-gray-500 mt-3 text-sm max-w-md mx-auto">
              Des produits frais, naturels et de qualité, sélectionnés avec soin pour vous.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div v-for="cat in displayCategories" :key="cat.id || cat.name"
              class="group cursor-pointer text-center">
              <div class="aspect-square rounded-2xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all duration-300 relative"
                :style="{ backgroundColor: cat.color + '20' }">
                <div class="absolute inset-0 flex flex-col items-center justify-center p-3">
                  <span class="text-4xl mb-1">{{ cat.emoji }}</span>
                  <span class="text-xs font-semibold text-gray-700 text-center leading-tight">{{ cat.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           PRODUITS VEDETTES
           ══════════════════════════════════════════════════ -->
      <section class="py-14 md:py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-end justify-between mb-10">
            <div>
              <span class="section-tag">Sélection du moment</span>
              <h2 class="section-title mt-2">Nos produits vedettes</h2>
            </div>
            <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`"
              class="hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors"
              :style="{ color: primaryColor }">
              Voir tout
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>

          <!-- Pas de produits -->
          <div v-if="!featuredProducts.length" class="text-center py-16">
            <span class="text-6xl block mb-4">🛒</span>
            <p class="text-gray-500 text-lg">Aucun produit disponible pour le moment.</p>
          </div>

          <!-- Grille produits -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <NuxtLink v-for="product in featuredProducts" :key="product.id"
              :to="`/boutique/${shop?.subdomain}/produit/${product.id}`"
              class="group product-card bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 block">

              <!-- Image -->
              <div class="relative overflow-hidden bg-gray-50 aspect-square">
                <img v-if="product.preview_image"
                  :src="getImageUrl(product.preview_image)"
                  :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 select-none"
                  @contextmenu.prevent @dragstart.prevent draggable="false" loading="lazy" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <!-- Protection overlay -->
                <div v-if="product.preview_image" class="absolute inset-0 z-10" @contextmenu.prevent @dragstart.prevent></div>

                <!-- Badge promo -->
                <div v-if="hasPromotion(product)"
                  class="absolute top-2 left-2 z-20 px-2 py-0.5 text-white text-xs font-bold rounded-full"
                  style="background: #ef4444">
                  {{ getDiscountPercent(product) }}% OFF
                </div>

                <!-- Bouton ajout rapide -->
                <div v-if="shop?.shop_type !== 'website'"
                  class="absolute bottom-0 inset-x-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    class="w-full py-2.5 text-white text-xs font-semibold tracking-wide transition-colors"
                    :style="{ backgroundColor: primaryColor }"
                    @click.prevent="addToCart(product)">
                    + Ajouter au panier
                  </button>
                </div>
              </div>

              <!-- Infos produit -->
              <div class="p-3 md:p-4">
                <p class="text-[10px] uppercase tracking-wider font-medium mb-1"
                  :style="{ color: primaryColor }">
                  {{ product.subcategory?.category?.name || product.subcategory?.name || shop?.name }}
                </p>
                <h3 class="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-2">
                  {{ product.name }}
                </h3>

                <!-- Prix -->
                <div class="flex items-baseline gap-2 flex-wrap">
                  <span class="text-base font-bold" :style="{ color: primaryColor }">
                    {{ formatPrice(hasPromotion(product) ? product.promotional_price : product.price) }}
                  </span>
                  <span v-if="hasPromotion(product)" class="text-xs text-gray-400 line-through">
                    {{ formatPrice(product.price) }}
                  </span>
                </div>

                <!-- Stock indicator -->
                <div v-if="product.stock_quantity !== null && product.stock_quantity <= 10 && product.stock_quantity > 0"
                  class="mt-2 text-[10px] text-orange-600 font-medium">
                  ⚠️ Plus que {{ product.stock_quantity }} en stock
                </div>
                <div v-else-if="product.stock_quantity === 0"
                  class="mt-2 text-[10px] text-red-500 font-medium">
                  Rupture de stock
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Bouton voir tout mobile -->
          <div class="mt-8 text-center sm:hidden">
            <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`"
              class="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full transition-all"
              :style="{ backgroundColor: primaryColor }">
              Voir tous les produits
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           BANNIÈRE PROMOTIONNELLE INTERMÉDIAIRE
           ══════════════════════════════════════════════════ -->
      <section class="py-14 md:py-20" :style="{ backgroundColor: primaryColor + '10' }">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-2 gap-6">

            <!-- Bannière 1 -->
            <div class="relative overflow-hidden rounded-2xl h-48 md:h-56 flex items-center"
              :style="{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }">
              <div class="px-8 z-10 text-white">
                <p class="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">Offre spéciale</p>
                <h3 class="text-2xl md:text-3xl font-bold mb-3">Nouveautés<br>de la semaine</h3>
                <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`"
                  class="inline-block px-5 py-2 bg-white text-sm font-semibold rounded-full transition-all hover:shadow-md"
                  :style="{ color: primaryColor }">
                  Découvrir →
                </NuxtLink>
              </div>
              <div class="absolute right-0 bottom-0 text-8xl opacity-20 pr-6 pb-2">🥬</div>
            </div>

            <!-- Bannière 2 -->
            <div class="relative overflow-hidden rounded-2xl h-48 md:h-56 flex items-center bg-gray-900">
              <div class="px-8 z-10 text-white">
                <p class="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">Livraison express</p>
                <h3 class="text-2xl md:text-3xl font-bold mb-3">Commandez<br>avant 14h</h3>
                <p class="text-sm opacity-70">Reçu le jour même</p>
              </div>
              <div class="absolute right-0 bottom-0 text-8xl opacity-20 pr-6 pb-2">🚚</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           SECTION À PROPOS (si contenu customization)
           ══════════════════════════════════════════════════ -->
      <section v-if="aboutText || shop?.description" class="py-14 md:py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span class="section-tag">Notre histoire</span>
              <h2 class="section-title mt-2">{{ shop?.name }}</h2>
              <p class="text-gray-600 mt-4 leading-relaxed whitespace-pre-line">
                {{ aboutText || shop?.description }}
              </p>
              <div class="grid grid-cols-3 gap-4 mt-8">
                <div v-for="stat in shopStats" :key="stat.label" class="text-center">
                  <p class="text-2xl font-bold" :style="{ color: primaryColor }">{{ stat.value }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ stat.label }}</p>
                </div>
              </div>
            </div>
            <div class="relative">
              <div v-if="aboutImage"
                class="rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                <img :src="aboutImage" :alt="`À propos de ${shop?.name}`"
                  class="w-full h-full object-cover" />
              </div>
              <div v-else
                class="rounded-2xl aspect-[4/3] flex items-center justify-center text-8xl"
                :style="{ backgroundColor: primaryColor + '15' }">
                🌿
              </div>
              <!-- Décoration -->
              <div class="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl -z-10 opacity-20"
                :style="{ backgroundColor: primaryColor }"></div>
              <div class="absolute -top-4 -right-4 w-16 h-16 rounded-full -z-10 opacity-10"
                :style="{ backgroundColor: primaryColor }"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           NEWSLETTER
           ══════════════════════════════════════════════════ -->
      <section class="py-14 md:py-20 newsletter-section text-white">
        <div class="max-w-2xl mx-auto text-center px-4 sm:px-6">
          <span class="text-3xl block mb-3">📩</span>
          <h2 class="text-2xl md:text-3xl font-bold mb-2">Restez informé(e)</h2>
          <p class="text-white/80 text-sm mb-8">
            Recevez nos offres exclusives, nouveautés et conseils directement dans votre boîte mail.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input v-model="newsletterEmail" type="email" placeholder="votre@email.com"
              class="flex-1 px-4 py-3 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"/>
            <button @click="subscribeNewsletter"
              class="px-6 py-3 bg-white font-semibold text-sm rounded-full transition-all hover:shadow-lg whitespace-nowrap"
              :style="{ color: primaryColor }">
              {{ newsletterSent ? '✓ Inscrit !' : "S'abonner" }}
            </button>
          </div>
          <p class="text-white/50 text-xs mt-4">Pas de spam. Désinscription en 1 clic.</p>
        </div>
      </section>

    </main>

    <!-- ══════════════════════════════════════════════════
         FOOTER
         ══════════════════════════════════════════════════ -->
    <footer class="bg-gray-900 text-gray-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <!-- Colonne 1 : Identité -->
          <div class="lg:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <div v-if="shop?.logo" class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img :src="getImageUrl(shop.logo)" :alt="shop?.name" class="w-full h-full object-contain"/>
              </div>
              <div v-else class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                :style="{ backgroundColor: primaryColor }">
                {{ shop?.name?.[0]?.toUpperCase() }}
              </div>
              <span class="font-bold text-white text-lg">{{ shop?.name }}</span>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed max-w-sm">{{ footerText }}</p>
            <!-- Réseaux sociaux -->
            <div class="flex gap-3 mt-6">
              <a v-if="socialLinks.facebook" :href="socialLinks.facebook" target="_blank" rel="noopener"
                class="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a v-if="socialLinks.instagram" :href="socialLinks.instagram" target="_blank" rel="noopener"
                class="w-9 h-9 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a v-if="socialLinks.twitter" :href="socialLinks.twitter" target="_blank" rel="noopener"
                class="w-9 h-9 rounded-full bg-gray-800 hover:bg-sky-500 flex items-center justify-center transition-colors">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Colonne 2 : Liens rapides -->
          <div>
            <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Navigation</h4>
            <ul class="space-y-2.5">
              <li><NuxtLink :to="`/boutique/${shop?.subdomain}`" class="text-sm hover:text-white transition-colors">Accueil</NuxtLink></li>
              <li><NuxtLink :to="`/boutique/${shop?.subdomain}/produits`" class="text-sm hover:text-white transition-colors">Tous les produits</NuxtLink></li>
              <li><NuxtLink :to="`/boutique/${shop?.subdomain}/a-propos`" class="text-sm hover:text-white transition-colors">À propos</NuxtLink></li>
              <li><NuxtLink :to="`/boutique/${shop?.subdomain}/contact`" class="text-sm hover:text-white transition-colors">Contact</NuxtLink></li>
              <li v-if="shop?.shop_type !== 'website'">
                <NuxtLink :to="`/boutique/${shop?.subdomain}/panier`" class="text-sm hover:text-white transition-colors">Panier</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Colonne 3 : Informations légales -->
          <div>
            <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Informations</h4>
            <ul class="space-y-2.5">
              <li><NuxtLink :to="`/boutique/${shop?.subdomain}/cgu`" class="text-sm hover:text-white transition-colors">CGU</NuxtLink></li>
              <li><NuxtLink :to="`/boutique/${shop?.subdomain}/cgv`" class="text-sm hover:text-white transition-colors">CGV</NuxtLink></li>
              <li><NuxtLink :to="`/boutique/${shop?.subdomain}/confidentialite`" class="text-sm hover:text-white transition-colors">Politique de confidentialité</NuxtLink></li>
              <li><NuxtLink :to="`/boutique/${shop?.subdomain}/livraison`" class="text-sm hover:text-white transition-colors">Livraison & retours</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Barre de copyright -->
      <div class="border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-xs text-gray-500">
            © {{ new Date().getFullYear() }} {{ shop?.name }}. Tous droits réservés.
          </p>
          <a href="https://uber-market.com" target="_blank"
            class="text-xs text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1.5">
            <span>Propulsé par</span>
            <span class="font-semibold text-gray-400">UberMarket</span>
          </a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { getCleanDescription } from '~/utils/string'

// ── Méta page — pas de layout wrapper (même pattern que theme-epure) ──
definePageMeta({ layout: false })

// ── Props ─────────────────────────────────────────────────────────────
interface Props {
  shop?: any
  customizations?: any
}
const props = defineProps<Props>()
const config = useRuntimeConfig()

// ── Helpers image ──────────────────────────────────────────────────────
// Construit l'URL complète depuis un chemin storage Laravel
const getImageUrl = (path: string): string => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = config.public.apiBase.replace('/api', '')
  return `${base}/storage/${path}`
}

// ── Couleurs (depuis customizations ou valeurs par défaut) ─────────────
const primaryColor   = computed(() => props.customizations?.home?.colors?.primary   || '#2d9b5c')
const secondaryColor = computed(() => props.customizations?.home?.colors?.secondary || '#f4a261')
const backgroundColor = computed(() => props.customizations?.home?.colors?.background || '#ffffff')
const textColor      = computed(() => props.customizations?.home?.colors?.text       || '#1a1a1a')
const fontFamily     = computed(() => props.customizations?.home?.fonts?.family       || 'sans-serif')

// ── Contenu bannière ──────────────────────────────────────────────────
const bannerTitle  = computed(() => props.customizations?.home?.banner?.title  || props.shop?.name || 'Produits frais & naturels')
const bannerSubtitle = computed(() => props.customizations?.home?.banner?.subtitle || 'Découvrez notre sélection de produits de qualité, issus de l\'agriculture responsable.')
const bannerButtonText = computed(() => props.customizations?.home?.banner?.button_text || 'Découvrir notre boutique')

const bannerImages = computed(() => {
  const imgs = props.customizations?.home?.banner?.images
  if (imgs && imgs.length > 0) {
    return imgs.map((p: string) => getImageUrl(p))
  }
  // Placeholders si aucune image configurée
  return [
    'https://placehold.co/1400x600/2d9b5c/ffffff?text=Bienvenue+dans+notre+boutique',
    'https://placehold.co/1400x600/3ba868/ffffff?text=Produits+frais+%26+naturels',
    'https://placehold.co/1400x600/1a7a43/ffffff?text=Qualité+garantie',
  ]
})

// ── Contenu À propos ──────────────────────────────────────────────────
const aboutText  = computed(() => props.customizations?.about?.text || '')
const aboutImage = computed(() => {
  const img = props.customizations?.about?.image
  return img ? getImageUrl(img) : ''
})

// ── Footer ────────────────────────────────────────────────────────────
const footerText = computed(() =>
  props.customizations?.footer?.text ||
  `© ${new Date().getFullYear()} ${props.shop?.name || 'Notre Boutique'}. Tous droits réservés.`
)
const socialLinks = computed(() => props.customizations?.footer?.socialLinks || {
  facebook: '', instagram: '', twitter: '', linkedin: ''
})

// ── Produits ──────────────────────────────────────────────────────────
const featuredProducts = computed(() => (props.shop?.products || []).slice(0, 10))

const formatPrice = (price: number): string => {
  if (price == null) return ''
  const currency = props.shop?.currency || 'XOF'
  return `${Number(price).toLocaleString('fr-FR')} ${currency}`
}

// Vérifie si un produit est en promotion (prix promo défini et valide)
const hasPromotion = (product: any): boolean => {
  if (!product.promotional_price) return false
  const now = new Date()
  if (product.promotion_start_date && new Date(product.promotion_start_date) > now) return false
  if (product.promotion_end_date   && new Date(product.promotion_end_date)   < now) return false
  return true
}

const getDiscountPercent = (product: any): number =>
  Math.round((1 - product.promotional_price / product.price) * 100)

// ── Panier (mock — à connecter à useCart si disponible) ───────────────
const cartCount = ref(0)
const addToCart = (product: any) => {
  cartCount.value++
  // À connecter à useCart composable si disponible dans le projet
}

// ── Slider ────────────────────────────────────────────────────────────
const currentSlide = ref(0)
let slideTimer: ReturnType<typeof setInterval>

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % bannerImages.value.length
}
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + bannerImages.value.length) % bannerImages.value.length
}

onMounted(() => { slideTimer = setInterval(nextSlide, 5500) })
onUnmounted(() => { clearInterval(slideTimer) })

// ── Navigation header ─────────────────────────────────────────────────
const mobileMenuOpen = ref(false)
const searchQuery    = ref('')
const searchFocused  = ref(false)

// ── Newsletter ────────────────────────────────────────────────────────
const newsletterEmail = ref('')
const newsletterSent  = ref(false)
const subscribeNewsletter = () => {
  if (!newsletterEmail.value) return
  newsletterSent.value = true
  newsletterEmail.value = ''
  setTimeout(() => { newsletterSent.value = false }, 5000)
}

// ── Badges de confiance ───────────────────────────────────────────────
const trustBadges = [
  { icon: '🚚', title: 'Livraison rapide',   subtitle: 'Sous 24h à 48h' },
  { icon: '🌿', title: '100% Naturel',        subtitle: 'Sans produits chimiques' },
  { icon: '🔒', title: 'Paiement sécurisé',  subtitle: 'Vos données protégées' },
  { icon: '↩️', title: 'Retours faciles',    subtitle: 'Sous 7 jours' },
]

// ── Catégories affichées (depuis les produits ou des emojis par défaut) ──
const defaultCategories = [
  { id: 'f', name: 'Fruits',      emoji: '🍎', color: '#ef4444' },
  { id: 'v', name: 'Légumes',     emoji: '🥦', color: '#22c55e' },
  { id: 'p', name: 'Produits frais', emoji: '🥛', color: '#3b82f6' },
  { id: 'c', name: 'Céréales',    emoji: '🌾', color: '#f59e0b' },
  { id: 'e', name: 'Épices',      emoji: '🌶️', color: '#ef4444' },
  { id: 'b', name: 'Boissons',    emoji: '🍵', color: '#10b981' },
]

const displayCategories = computed(() => {
  // Essayer de déduire les catégories depuis les produits
  const cats = new Map()
  ;(props.shop?.products || []).forEach((p: any) => {
    const cat = p.subcategory?.category || p.subcategory
    if (cat && !cats.has(cat.id)) {
      cats.set(cat.id, {
        id: cat.id,
        name: cat.name,
        emoji: '📦',
        color: primaryColor.value
      })
    }
  })
  return cats.size > 0
    ? Array.from(cats.values()).slice(0, 6)
    : defaultCategories
})

// ── Stats boutique (visuelles) ────────────────────────────────────────
const shopStats = [
  { value: `${(props.shop?.products?.length || 0)}+`, label: 'Produits' },
  { value: '100%',  label: 'Naturel' },
  { value: '24h',   label: 'Livraison' },
]
</script>

<style scoped>
/* ── Couleurs dynamiques ── */
.promo-bar     { background-color: v-bind(primaryColor); }
.hero-section  { background-color: #f3f4f6; }
.newsletter-section {
  background: linear-gradient(135deg, v-bind(primaryColor) 0%, color-mix(in srgb, v-bind(primaryColor) 70%, black) 100%);
}

/* ── Typographie sections ── */
.section-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: v-bind(primaryColor);
}
.section-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  font-family: v-bind(fontFamily);
}

/* ── Cards produit ── */
.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.product-card:hover {
  transform: translateY(-4px);
}

/* ── Protection images ── */
img {
  -webkit-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
}

/* ── Transitions menu mobile ── */
</style>