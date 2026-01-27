<template>
  <div class="flex h-screen bg-white">
    <!-- Sidebar -->
    <aside 
      class="bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-lg lg:shadow-none"
      :class="[
        'fixed lg:relative z-30 h-full',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        isSidebarOpen ? 'w-64' : 'lg:w-20'
      ]"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center" :class="isSidebarOpen ? 'opacity-100' : 'lg:opacity-100 opacity-0'">
          <div v-if="currentShop?.logo" class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img 
              :src="getLogoUrl(currentShop.logo)" 
              :alt="`Logo ${currentShop.name}`"
              class="w-full h-full object-cover"
            />
          </div>
          <div v-else class="bg-gradient-to-br from-primary to-secondary rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0">
            <span class="text-white font-bold text-lg">{{ getShopInitials(currentShop?.name) }}</span>
          </div>
          <span 
            class="ml-3 text-xl font-bold text-gray-900 transition-opacity duration-300 truncate"
            :class="isSidebarOpen ? 'opacity-100' : 'lg:opacity-0 opacity-100'"
            :title="currentShop?.name || 'Ma boutique'"
          >
            {{ currentShop?.name || 'Ma boutique' }}
          </span>
        </div>
        <button 
          @click="closeSidebar" 
          class="lg:hidden text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Fermer le menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <nav class="mt-6 overflow-y-auto h-[calc(100vh-80px)]">
        <div class="px-4">
          <h3 
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider transition-opacity duration-300"
            :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
          >
            Navigation
          </h3>
          <ul class="mt-2 space-y-1">
            <li>
              <NuxtLink 
                :to="getDashboardLink()" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Tableau de bord
                </span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/mes-boutiques" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Mes boutiques
                </span>
              </NuxtLink>
            </li>
            <!-- Pages du site web - uniquement pour type website -->
            <li v-if="isWebsiteShop">
              <NuxtLink 
                :to="getDashboardLink('pages')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Pages
                </span>
              </NuxtLink>
            </li>
            <!-- Produits - uniquement pour e-commerce -->
            <li v-if="!isWebsiteShop">
              <NuxtLink 
                :to="getDashboardLink('products/produits')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Produits
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
        
        <!-- Section Gestion - uniquement pour e-commerce -->
        <div v-if="!isWebsiteShop" class="px-4 mt-8">
          <h3 
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider transition-opacity duration-300"
            :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
          >
            Gestion
          </h3>
          <ul class="mt-2 space-y-1">
            <li>
              <NuxtLink 
                :to="getDashboardLink('orders/commandes')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Commandes
                </span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                :to="getDashboardLink('customers/clients')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Clients
                </span>
              </NuxtLink>
            </li>
            <!-- <li>
              <NuxtLink 
                :to="getDashboardLink('analytics/analyses')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Analyses
                </span>
              </NuxtLink>
            </li> -->
            <li>
              <NuxtLink 
                :to="getDashboardLink('discount-code/codes-promo')" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 transition-all duration-200"
                :class="[
                  isSidebarOpen ? '' : 'justify-center',
                  hasPromoModule ? 'text-gray-700' : 'text-gray-400'
                ]"
                @click="(e) => handleRestrictedClick('promo', 'Codes Promo', e)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300 flex items-center gap-2"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Codes promo
                  <span v-if="!hasPromoModule" class="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700">PRO</span>
                </span>
              </NuxtLink>
            </li>
            <li v-if="isPhysicalShop">
              <NuxtLink 
                :to="getDashboardLink('inventory/stocks')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Stocks
                </span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                :to="getDashboardLink('feedback/avis')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Avis clients
                </span>
              </NuxtLink>
            </li>
            <!-- <li>
              <NuxtLink 
                :to="getDashboardLink('returns/retours')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Retours produits
                </span>
              </NuxtLink>
            </li> -->
          </ul>
        </div>
        
        <!-- Section Livraison - uniquement pour boutiques physiques e-commerce (pas website) -->
        <div v-if="isPhysicalShop && !isWebsiteShop" class="px-4 mt-8">
          <h3 
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider transition-opacity duration-300"
            :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
          >
            Livraison
          </h3>
          <ul class="mt-2 space-y-1">
            <li>
              <NuxtLink 
                :to="getDashboardLink('deliveries/livraisons')" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 transition-all duration-200"
                :class="[
                  isSidebarOpen ? '' : 'justify-center',
                  hasDeliveryModule ? 'text-gray-700' : 'text-gray-400'
                ]"
                @click="(e) => handleRestrictedClick('delivery', 'Livraisons', e)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300 flex items-center gap-2"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Livraisons
                  <span v-if="!hasDeliveryModule" class="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700">PRO</span>
                </span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                :to="getDashboardLink('couriers/livreurs')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Gestion des livreurs
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
        
        <div class="px-4 mt-8">
          <h3 
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider transition-opacity duration-300"
            :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
          >
            Paramètres
          </h3>
          <ul class="mt-2 space-y-1">
            <li>
              <NuxtLink 
                :to="getDashboardLink('customizations/personnalisation')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Personnalisation
                </span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                :to="getDashboardLink('subscription/abonnement')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Abonnement
                </span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                :to="getDashboardLink('marketing/marketing')" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 transition-all duration-200"
                :class="[
                  isSidebarOpen ? '' : 'justify-center',
                  hasMarketingModule ? 'text-gray-700' : 'text-gray-400'
                ]"
                @click="(e) => handleRestrictedClick('marketing', 'Marketing', e)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300 flex items-center gap-2"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Marketing
                  <span v-if="!hasMarketingModule" class="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700">PRO</span>
                </span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                :to="getDashboardLink('withdrawal/retraits')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Retraits
                </span>
              </NuxtLink>
            </li>
            <!-- Équipe / Collaborateurs -->
            <li>
              <NuxtLink 
                :to="getDashboardLink('team/collaborateurs')" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 transition-all duration-200"
                :class="[
                  isSidebarOpen ? '' : 'justify-center',
                  hasCollaboratorsAccess ? 'text-gray-700' : 'text-gray-400'
                ]"
                @click="(e) => handleCollaboratorsClick(e)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300 flex items-center gap-2"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Équipe
                  <span v-if="!hasCollaboratorsAccess" class="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700">PRO</span>
                </span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                :to="getDashboardLink('settings/parametres')" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200"
                :class="isSidebarOpen ? '' : 'justify-center'"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span 
                  class="ml-3 transition-opacity duration-300"
                  :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'"
                >
                  Paramètres
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- Overlay pour mobile -->
    <div 
      v-if="isSidebarOpen && !isLargeScreen" 
      class="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Main content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Top bar -->
      <header class="bg-white border-b border-gray-200">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center">
            <button @click="toggleSidebar" class="text-gray-500 focus:outline-none mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div class="relative mx-4 lg:mx-0">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input class="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary" type="text" placeholder="Rechercher...">
            </div>
          </div>

          <div class="flex items-center">
            <div class="relative">
              <button class="flex mx-4 text-gray-600 focus:outline-none">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>
            </div>

            <div class="relative">
              <button class="relative block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none">
                <img class="object-cover w-full h-full" src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=80" alt="Your avatar">
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6 bg-white">
        <slot />
      </main>
    </div>

    <!-- Modal d'upgrade -->
    <UpgradeModal 
      :is-open="showUpgradeModal"
      :message="upgradeMessage"
      :feature="upgradeFeature"
      @close="showUpgradeModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSubscription } from '~/composables/useSubscription'

// Récupération de la boutique courante
const { currentShop } = useShops()
const config = useRuntimeConfig()

// Abonnement
const { currentSubscription, fetchCurrentSubscription, hasModule } = useSubscription()
const showUpgradeModal = ref(false)
const upgradeMessage = ref('')
const upgradeFeature = ref('')

// Vérification modules
const hasDeliveryModule = computed(() => hasModule('delivery'))
const hasPromoModule = computed(() => hasModule('promo'))
const hasMarketingModule = computed(() => hasModule('marketing'))

// Vérification collaborateurs (plans Standard+ ont accès)
const hasCollaboratorsAccess = computed(() => {
  const plan = currentSubscription.value?.plan?.code
  return plan && !['welcome', 'gratuit'].includes(plan)
})

// Vérifier si on peut ajouter des collaborateurs (limite non atteinte)
const canAddCollaborators = computed(() => {
  if (!currentSubscription.value) return false
  const limit = currentSubscription.value.limits?.collaborators ?? 0
  return limit === -1 || limit > 0
})

// Fonction pour gérer le clic sur le module Collaborateurs
const handleCollaboratorsClick = (event: Event) => {
  if (!hasCollaboratorsAccess.value) {
    event.preventDefault()
    upgradeMessage.value = 'La gestion d\'équipe nécessite un abonnement Standard ou supérieur.'
    upgradeFeature.value = 'collaborators'
    showUpgradeModal.value = true
  }
}

// Fonction pour gérer le clic sur un module restreint
const handleRestrictedClick = (module: string, label: string, event: Event) => {
  if (!hasModule(module)) {
    event.preventDefault()
    upgradeMessage.value = `Le module "${label}" nécessite un abonnement supérieur`
    upgradeFeature.value = module
    showUpgradeModal.value = true
  }
}

// Computed pour déterminer si c'est une boutique physique
const isPhysicalShop = computed(() => currentShop.value?.product_type === 'physical')

// Computed pour déterminer si c'est un site web (pas e-commerce)
const isWebsiteShop = computed(() => currentShop.value?.shop_type === 'website')

// Fonction pour obtenir l'URL du logo
const getLogoUrl = (logoPath: string) => {
  if (!logoPath) return undefined
  return `${config.public.apiBase.replace('/api', '')}/storage/${logoPath}`
}

// Fonction pour obtenir les initiales de la boutique
const getShopInitials = (name?: string) => {
  if (!name) return 'MB'
  const words = name.trim().split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// État du menu hamburger - Fermé par défaut sur mobile
const isSidebarOpen = ref(false)
const isLargeScreen = ref(true) // true par défaut pour éviter le flash

// Fonction pour générer les liens dynamiques
const getDashboardLink = (path: string = '') => {
  console.log('getDashboardLink called:', { 
    path, 
    currentShop: currentShop.value,
    slug: currentShop.value?.slug,
    id: currentShop.value?.id 
  })
  
  if (!currentShop.value?.id && !currentShop.value?.slug) {
    return '/mes-boutiques'
  }
  
  // Utiliser l'ID si le slug n'existe pas
  const shopIdentifier = currentShop.value.slug || currentShop.value.id
  const basePath = `/dashboard-vendor/${shopIdentifier}`
  return path ? `${basePath}/${path}` : basePath
}

// Fonction pour basculer l'état du menu
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  if (!isLargeScreen.value) {
    isSidebarOpen.value = false
  }
}

// Vérifier la taille de l'écran
const checkScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1024
  // Sur grand écran, ouvrir le sidebar par défaut
  // Sur petit écran, le garder fermé
  isSidebarOpen.value = isLargeScreen.value
}

// Gérer le redimensionnement de la fenêtre
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  // Charger l'abonnement de l'utilisateur
  fetchCurrentSubscription().catch(() => {})
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>