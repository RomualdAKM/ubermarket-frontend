<template>
  <div class="flex h-screen bg-white">
    <!-- Sidebar -->
    <aside 
      class="bg-slate-50 border-r border-slate-200/80 transition-all duration-300 ease-in-out"
      :class="[
        'fixed lg:relative z-30 h-full',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        isSidebarOpen ? 'w-64' : 'lg:w-20'
      ]"
    >
      <!-- Header -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-slate-200/80">
        <div class="flex items-center gap-3 min-w-0" :class="isSidebarOpen ? 'opacity-100' : 'lg:opacity-100 opacity-0'">
          <div v-if="currentShop?.logo" class="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-slate-200">
            <img :src="getLogoUrl(currentShop.logo)" :alt="currentShop.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span class="text-white font-semibold text-sm">{{ getShopInitials(currentShop?.name) }}</span>
          </div>
          <div class="min-w-0 transition-opacity duration-200" :class="isSidebarOpen ? 'opacity-100' : 'lg:opacity-0'">
            <p class="text-sm font-semibold text-slate-900 truncate">{{ currentShop?.name || 'Ma boutique' }}</p>
            <p class="text-xs text-slate-500 truncate">{{ currentShop?.shop_type === 'website' ? 'Site web' : 'E-commerce' }}</p>
          </div>
        </div>
        <button @click="closeSidebar" class="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      
      <nav class="h-[calc(100vh-4rem)] overflow-y-auto py-4 px-3">
        <!-- Menu principal -->
        <div class="space-y-1">
          <!-- Tableau de bord -->
          <NuxtLink 
            v-if="canViewDashboard"
            :to="getDashboardLink()" 
            class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
            @click="closeSidebar"
          >
            <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
            </svg>
            <span :class="isSidebarOpen ? '' : 'lg:hidden'">Tableau de bord</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/mes-boutiques" 
            class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
            @click="closeSidebar"
          >
            <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/>
            </svg>
            <span :class="isSidebarOpen ? '' : 'lg:hidden'">Mes sites</span>
          </NuxtLink>

          <!-- Pages (Website) -->
          <NuxtLink 
            v-if="isWebsiteShop && canViewPages"
            :to="getDashboardLink('pages')" 
            class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
            @click="closeSidebar"
          >
            <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
            </svg>
            <span :class="isSidebarOpen ? '' : 'lg:hidden'">Pages</span>
          </NuxtLink>

          <!-- Produits (E-commerce) -->
          <NuxtLink 
            v-if="!isWebsiteShop && canViewProducts"
            :to="getDashboardLink('products/produits')" 
            class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
            @click="closeSidebar"
          >
            <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>
            </svg>
            <span :class="isSidebarOpen ? '' : 'lg:hidden'">Produits</span>
          </NuxtLink>
        </div>
        
        <!-- Section Gestion (Accordéon) -->
        <div v-if="!isWebsiteShop" class="mt-6">
          <button 
            @click="toggleSection('gestion')"
            class="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
            :class="isSidebarOpen ? '' : 'lg:hidden'"
          >
            <span>Gestion</span>
            <svg 
              class="w-4 h-4 transition-transform duration-200" 
              :class="expandedSections.gestion ? 'rotate-180' : ''"
              fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7"/>
            </svg>
          </button>
          <div 
            class="overflow-hidden transition-all duration-200"
            :class="expandedSections.gestion ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="space-y-1 pt-1">
              <!-- Commandes -->
              <NuxtLink 
                v-if="canViewOrders"
                :to="getDashboardLink('orders/commandes')" 
                class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                </svg>
                <span :class="isSidebarOpen ? '' : 'lg:hidden'">Commandes</span>
              </NuxtLink>

              <!-- Clients -->
              <NuxtLink 
                v-if="canViewCustomers"
                :to="getDashboardLink('customers/clients')" 
                class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
                </svg>
                <span :class="isSidebarOpen ? '' : 'lg:hidden'">Clients</span>
              </NuxtLink>

              <!-- Codes promo -->
              <NuxtLink 
                v-if="canViewPromoCodes"
                :to="getDashboardLink('discount-code/codes-promo')" 
                class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[isSidebarOpen ? '' : 'justify-center', hasPromoModule ? 'text-slate-600 hover:text-slate-900 hover:bg-white' : 'text-slate-400']"
                @click="(e) => handleRestrictedClick('promo', 'Codes Promo', e)"
              >
                <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"/>
                </svg>
                <span :class="isSidebarOpen ? '' : 'lg:hidden'" class="flex items-center gap-2">
                  Codes promo
                  <span v-if="!hasPromoModule" class="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">PRO</span>
                </span>
              </NuxtLink>

              <!-- Stocks -->
              <NuxtLink 
                v-if="isPhysicalShop && canViewStock"
                :to="getDashboardLink('inventory/stocks')" 
                class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/>
                </svg>
                <span :class="isSidebarOpen ? '' : 'lg:hidden'">Stocks</span>
              </NuxtLink>

              <!-- Avis clients -->
              <NuxtLink 
                v-if="canViewReviews"
                :to="getDashboardLink('feedback/avis')" 
                class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                </svg>
                <span :class="isSidebarOpen ? '' : 'lg:hidden'">Avis clients</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <!-- Section Livraison (Accordéon) -->
        <div v-if="isPhysicalShop && !isWebsiteShop" class="mt-6">
          <button 
            @click="toggleSection('livraison')"
            class="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
            :class="isSidebarOpen ? '' : 'lg:hidden'"
          >
            <span>Livraison</span>
            <svg 
              class="w-4 h-4 transition-transform duration-200" 
              :class="expandedSections.livraison ? 'rotate-180' : ''"
              fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7"/>
            </svg>
          </button>
          <div 
            class="overflow-hidden transition-all duration-200"
            :class="expandedSections.livraison ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="space-y-1 pt-1">
              <!-- Livraisons -->
              <NuxtLink 
                v-if="canViewDeliveries"
                :to="getDashboardLink('deliveries/livraisons')" 
                class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[isSidebarOpen ? '' : 'justify-center', hasDeliveryModule ? 'text-slate-600 hover:text-slate-900 hover:bg-white' : 'text-slate-400']"
                @click="(e) => handleRestrictedClick('delivery', 'Livraisons', e)"
              >
                <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                </svg>
                <span :class="isSidebarOpen ? '' : 'lg:hidden'" class="flex items-center gap-2">
                  Livraisons
                  <span v-if="!hasDeliveryModule" class="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">PRO</span>
                </span>
              </NuxtLink>

              <!-- Livreurs -->
              <NuxtLink 
                v-if="canViewCouriers"
                :to="getDashboardLink('couriers/livreurs')" 
                class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
                @click="closeSidebar"
              >
                <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
                </svg>
                <span :class="isSidebarOpen ? '' : 'lg:hidden'">Livreurs</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <!-- Section Paramètres (Accordéon) -->
        <div class="mt-6 pb-4">
          <button 
            @click="toggleSection('parametres')"
            class="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
            :class="isSidebarOpen ? '' : 'lg:hidden'"
          >
            <span>Paramètres</span>
            <svg 
              class="w-4 h-4 transition-transform duration-200" 
              :class="expandedSections.parametres ? 'rotate-180' : ''"
              fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7"/>
            </svg>
          </button>
          <div 
            class="overflow-hidden transition-all duration-200"
            :class="expandedSections.parametres ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="space-y-1 pt-1">
            <!-- Personnalisation -->
            <NuxtLink 
              v-if="canViewCustomization"
              :to="getDashboardLink('customizations/personnalisation')" 
              class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
              @click="closeSidebar"
            >
              <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"/>
              </svg>
              <span :class="isSidebarOpen ? '' : 'lg:hidden'">Personnalisation</span>
            </NuxtLink>

            <!-- Abonnement (propriétaire uniquement) -->
            <NuxtLink 
              v-if="canViewSubscription"
              :to="getDashboardLink('subscription/abonnement')" 
              class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
              @click="closeSidebar"
            >
              <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/>
              </svg>
              <span :class="isSidebarOpen ? '' : 'lg:hidden'">Abonnement</span>
            </NuxtLink>

            <!-- Marketing -->
            <NuxtLink 
              v-if="canViewMarketing"
              :to="getDashboardLink('marketing/marketing')" 
              class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="[isSidebarOpen ? '' : 'justify-center', hasMarketingModule ? 'text-slate-600 hover:text-slate-900 hover:bg-white' : 'text-slate-400']"
              @click="(e) => handleRestrictedClick('marketing', 'Marketing', e)"
            >
              <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
              </svg>
              <span :class="isSidebarOpen ? '' : 'lg:hidden'" class="flex items-center gap-2">
                Marketing
                <span v-if="!hasMarketingModule" class="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">PRO</span>
              </span>
            </NuxtLink>

            <!-- Retraits -->
            <NuxtLink 
              v-if="canViewWithdrawals"
              :to="getDashboardLink('withdrawal/retraits')" 
              class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
              @click="closeSidebar"
            >
              <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"/>
              </svg>
              <span :class="isSidebarOpen ? '' : 'lg:hidden'">Retraits</span>
            </NuxtLink>

            <!-- Affiliation (propriétaire uniquement) -->
            <NuxtLink 
              v-if="canViewAffiliation"
              :to="getDashboardLink('affiliation')"
              class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
              @click="closeSidebar"
            >
              <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
              </svg>
              <span :class="isSidebarOpen ? '' : 'lg:hidden'">Parrainage</span>
            </NuxtLink>

            <!-- Équipe -->
            <NuxtLink 
              v-if="canViewTeam"
              :to="getDashboardLink('team/collaborateurs')" 
              class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="[isSidebarOpen ? '' : 'justify-center', hasCollaboratorsAccess ? 'text-slate-600 hover:text-slate-900 hover:bg-white' : 'text-slate-400']"
              @click="(e) => handleCollaboratorsClick(e)"
            >
              <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
              </svg>
              <span :class="isSidebarOpen ? '' : 'lg:hidden'" class="flex items-center gap-2">
                Équipe
                <span v-if="!hasCollaboratorsAccess" class="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">PRO</span>
              </span>
            </NuxtLink>

            <!-- Paramètres -->
            <NuxtLink 
              v-if="canViewSettings"
              :to="getDashboardLink('settings/parametres')" 
              class="sidebar-link group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="[isSidebarOpen ? '' : 'justify-center', 'text-slate-600 hover:text-slate-900 hover:bg-white']"
              @click="closeSidebar"
            >
              <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
              </svg>
              <span :class="isSidebarOpen ? '' : 'lg:hidden'">Paramètres</span>
            </NuxtLink>
            </div>
          </div>
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
      <header class="h-16 bg-white border-b border-slate-200/80 flex-shrink-0">
        <div class="h-full flex items-center justify-between px-4 lg:px-6">
          <button @click="toggleSidebar" class="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
          </button>

          <div class="flex items-center gap-3">
            <!-- Bouton Voir mon site -->
            <NuxtLink 
              v-if="currentShop?.subdomain || currentShop?.slug"
              :to="isWebsiteShop 
                ? `/site/${currentShop.subdomain || currentShop.slug}` 
                : `/boutique/${currentShop.subdomain || currentShop.slug}`"
              target="_blank"
              class="flex items-center gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
              </svg>
              <span class="hidden sm:inline">Voir mon site</span>
            </NuxtLink>

            <!-- Notifications -->
            <button class="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
              </svg>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Menu utilisateur -->
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ getUserInitials() }}</span>
                </div>
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7"/>
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
              >
                <div class="px-4 py-3 border-b border-slate-100">
                  <p class="text-sm font-medium text-slate-900">{{ user?.name }}</p>
                  <p class="text-xs text-slate-500 truncate">{{ user?.email }}</p>
                </div>
                <NuxtLink 
                  :to="getDashboardLink('settings/parametres')" 
                  class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  @click="showUserMenu = false"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                  Parametres
                </NuxtLink>
                <button 
                  @click="handleLogout"
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                  </svg>
                  Se deconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto bg-white">
        <div class="p-4 lg:p-6">
          <slot />
        </div>
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useSubscription } from '~/composables/useSubscription'

// Recuperation de la boutique courante et de l'utilisateur
const { currentShop, currentAccess, hasPermission, hasAnyPermission } = useShops()
const { user, logout } = useAuth()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

// ===== Vérifications de permissions pour les menus =====
// Le propriétaire a accès à tout, les collaborateurs selon leurs permissions

const canViewDashboard = computed(() => hasAnyPermission(['analytics.view', 'orders.view']))
const canViewProducts = computed(() => hasPermission('products.view'))
const canViewOrders = computed(() => hasPermission('orders.view'))
const canViewCustomers = computed(() => hasPermission('customers.view'))
const canViewPromoCodes = computed(() => hasPermission('promos.view'))
const canViewStock = computed(() => hasPermission('products.view')) // Stock lié aux produits
const canViewReviews = computed(() => hasPermission('reviews.view'))
const canViewDeliveries = computed(() => hasPermission('deliveries.view'))
const canViewCouriers = computed(() => hasPermission('deliveries.view'))
const canViewCustomization = computed(() => hasPermission('settings.view'))
const canViewSubscription = computed(() => currentAccess.value?.is_owner ?? false) // Propriétaire uniquement
const canViewMarketing = computed(() => hasPermission('settings.view'))
const canViewWithdrawals = computed(() => hasPermission('withdrawals.view'))
const canViewAffiliation = computed(() => currentAccess.value?.is_owner ?? false) // Propriétaire uniquement
const canViewTeam = computed(() => hasPermission('collaborators.view'))
const canViewSettings = computed(() => hasPermission('settings.view'))
const canViewPages = computed(() => hasPermission('pages.view'))

// Indicateur si c'est un collaborateur (pour afficher les restrictions)
const isCollaborator = computed(() => currentAccess.value?.is_collaborator ?? false)

// Menu utilisateur
const showUserMenu = ref(false)

// Fermer le menu si on clique ailleurs
const closeUserMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Obtenir les initiales de l'utilisateur
const getUserInitials = () => {
  if (!user.value?.name) return 'U'
  const words = user.value.name.trim().split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return user.value.name.substring(0, 2).toUpperCase()
}

// Gerer la deconnexion
const handleLogout = async () => {
  showUserMenu.value = false
  await logout()
  router.push('/connexion-vendeur')
}

// Abonnement
const { currentSubscription, fetchCurrentSubscription, hasModule } = useSubscription()
const showUpgradeModal = ref(false)
const upgradeMessage = ref('')
const upgradeFeature = ref('')

// Vérification modules
const hasDeliveryModule = computed(() => hasModule('delivery'))
const hasPromoModule = computed(() => hasModule('promo'))
const hasMarketingModule = computed(() => hasModule('marketing'))

// États des accordéons de la sidebar
const expandedSections = ref({
  gestion: true,
  livraison: true,
  parametres: true
})

const toggleSection = (section: 'gestion' | 'livraison' | 'parametres') => {
  expandedSections.value[section] = !expandedSections.value[section]
}

// Vérification collaborateurs (vérifie la limite réelle du plan)
const hasCollaboratorsAccess = computed(() => {
  if (!currentSubscription.value?.limits) return false
  const limit = currentSubscription.value.limits.collaborators
  // -1 = illimité, > 0 = accès autorisé
  return limit === -1 || limit > 0
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
    closeSidebar()
    upgradeMessage.value = 'La gestion d\'équipe nécessite un abonnement Standard ou supérieur.'
    upgradeFeature.value = 'collaborators'
    showUpgradeModal.value = true
  } else {
    closeSidebar()
  }
}

// Fonction pour gérer le clic sur un module restreint
const handleRestrictedClick = (module: string, label: string, event: Event) => {
  if (!hasModule(module)) {
    event.preventDefault()
    closeSidebar()
    upgradeMessage.value = `Le module "${label}" nécessite un abonnement supérieur`
    upgradeFeature.value = module
    showUpgradeModal.value = true
  } else {
    closeSidebar()
  }
}

// Computed pour déterminer si c'est une boutique physique
const isPhysicalShop = computed(() => currentShop.value?.product_type === 'physical')

// Computed pour déterminer si c'est un site web (pas e-commerce)
const isWebsiteShop = computed(() => currentShop.value?.shop_type === 'website')

// Fonction pour obtenir l'URL publique du site de la boutique
const getShopPublicUrl = (): string => {
  if (!currentShop.value?.subdomain) return '#'
  return `/boutique/${currentShop.value.subdomain}`
}

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

// Gerer le redimensionnement de la fenetre
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  window.addEventListener('click', closeUserMenu)
  // Charger l'abonnement de l'utilisateur
  fetchCurrentSubscription().catch(() => {})
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  window.removeEventListener('click', closeUserMenu)
})

// Fermer la sidebar mobile automatiquement lors d'un changement de route
watch(() => route.path, () => {
  if (!isLargeScreen.value) {
    isSidebarOpen.value = false
  }
})
</script>

<style scoped>
/* Sidebar link active state */
.sidebar-link.router-link-active,
.sidebar-link.router-link-exact-active {
  background-color: white;
  color: #1e293b;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.sidebar-link.router-link-active svg,
.sidebar-link.router-link-exact-active svg {
  color: #5B6AC5;
}

/* Scrollbar styling */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>