<template>
  <div class="landing-page antialiased text-sm text-gray-900">
    <!-- Navbar -->
    <nav class="nav-animate fixed w-full top-0 z-50 px-4 md:px-16 lg:px-24 xl:px-32 py-4 border-b transition-all duration-300 border-neutral-300 bg-white/80 backdrop-blur">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <NuxtLink to="/">
          <img alt="UberMarket Logo" class="h-14 md:h-16" src="/uber-market.png">
        </NuxtLink>
        <div class="hidden md:flex gap-3">
          <NuxtLink to="/marketplace" class="py-1 px-3 hover:text-zinc-500">Marketplace</NuxtLink>
          <a href="#fonctionnalites" class="py-1 px-3 hover:text-zinc-500">Fonctionnalités</a>
          <a href="#temoignages" class="py-1 px-3 hover:text-zinc-500">Témoignages</a>
          <a href="#tarifs" class="py-1 px-3 hover:text-zinc-500">Tarifs</a>
        </div>
        <button @click="toggleMobileMenu" class="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6.5"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>
        </button>
        <NuxtLink to="/inscription-vendeur" class="hidden md:inline-block py-2.5 px-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] bg-primary text-white rounded-full hover:opacity-90 transition-opacity">
          Commencer gratuitement
        </NuxtLink>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div :class="['fixed top-0 right-0 z-50 w-full bg-white shadow-xl shadow-black/5 transition-all duration-300 ease-in-out overflow-hidden', mobileMenuOpen ? 'h-92' : 'h-0']">
      <div class="flex items-center justify-between p-4">
        <img alt="UberMarket Logo" class="h-14" src="/uber-market.png">
        <button @click="toggleMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6.5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>
      <div class="flex flex-col gap-4 p-4 text-base">
        <NuxtLink to="/marketplace" @click="closeMobileMenu" class="py-1 px-3">Marketplace</NuxtLink>
        <a href="#fonctionnalites" @click="closeMobileMenu" class="py-1 px-3">Fonctionnalités</a>
        <a href="#temoignages" @click="closeMobileMenu" class="py-1 px-3">Témoignages</a>
        <a href="#tarifs" @click="closeMobileMenu" class="py-1 px-3">Tarifs</a>
        <NuxtLink to="/inscription-vendeur" @click="closeMobileMenu" class="py-2.5 px-6 w-max text-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] bg-gradient-to-tl from-primary-dark to-primary text-white rounded-full">
          Commencer gratuitement
        </NuxtLink>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="bg-primary/10 px-4 md:px-16 lg:px-24 xl:px-32">
      <div class="max-w-7xl mx-auto flex flex-col items-center justify-center h-screen">
        <div class="hero-badge flex items-center gap-2 bg-white/50 backdrop-blur p-1 rounded-full">
          <div class="flex items-center -space-x-3">
            <img class="size-7 rounded-full border-2 border-white" alt="user1" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50">
            <img class="size-7 rounded-full border-2 border-white" alt="user2" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50">
          </div>
          <span>1000+</span>
          <div class="h-5 w-px mx-1 bg-white rounded-full"></div>
          <span>Vendeurs satisfaits</span>
          <div class="h-5 w-px mx-1 bg-white rounded-full"></div>
          <div class="flex items-center gap-1 pr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4.5 fill-primary stroke-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
            <span>4.9</span>
          </div>
        </div>
        <div class="relative">
          <h1 class="hero-title text-center font-urbanist text-5xl/15 md:text-6xl/18 mt-4 font-bold max-w-2xl">
            Créez et développez votre boutique en ligne.
          </h1>
          <div class="absolute -top-5 right-13 hidden md:block">
            <div class="icon-box bg-primary shadow-[inset_0_4px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.15)] p-2 aspect-square rounded-lg text-white rotate-15">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path></svg>
            </div>
          </div>
        </div>
        <p class="hero-desc text-center text-base/7 text-zinc-500 max-w-lg mt-4">Vendez vos produits physiques ou numériques en 1m30s. Paiements intégrés, livraison, analytics - tout inclus. Sans compétences techniques.</p>
        <div class="hero-buttons flex flex-col md:flex-row items-center gap-4 mt-6 w-full md:w-auto">
          <NuxtLink to="/inscription-vendeur" class="py-3 md:py-2.5 w-full md:w-auto px-8 border border-primary/20 bg-gradient-to-tl from-primary-dark to-primary text-white text-center rounded-full hover:opacity-90 transition-opacity">
            Commencer gratuitement
          </NuxtLink>
          <a href="#fonctionnalites" class="relative py-3 md:py-2.5 w-full md:w-auto px-8 bg-white/50 text-gray-600 font-medium text-center border border-white rounded-full hover:bg-white/70 transition-colors">
            Découvrir
            <div class="absolute size-8 pointer-events-none right-0 top-full -translate-y-1/2">
              <img alt="mouse-arrow" width="24" height="24" src="/landing/mouse-arrow.svg">
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="border-y border-gray-200 py-10 px-4 md:px-16 lg:px-24 xl:px-32">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="stat-item flex flex-col items-center gap-4 text-center">
          <h3 class="text-4xl font-semibold font-urbanist"><span class="counter">0</span>€</h3>
          <p class="text-gray-500">Pour démarrer votre boutique</p>
        </div>
        <div class="stat-item flex flex-col items-center gap-4 text-center">
          <h3 class="text-4xl font-semibold font-urbanist"><span class="counter">1</span>m30s</h3>
          <p class="text-gray-500">Pour créer votre boutique</p>
        </div>
        <div class="stat-item flex flex-col items-center gap-4 text-center">
          <h3 class="text-4xl font-semibold font-urbanist"><span class="counter">24</span>/7</h3>
          <p class="text-gray-500">Support client disponible</p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="fonctionnalites" class="px-4 md:px-16 lg:px-24 xl:px-32">
      <div class="grid grid-cols-1 md:grid-cols-2 border-x md:divide-x border-gray-200 divide-gray-200 max-w-7xl mx-auto">
        <div>
          <div class="p-4 pt-16 md:p-16 flex flex-col items-start md:sticky md:top-26">
            <div class="flex flex-col gap-6 md:items-start items-center">
              <div class="flex flex-col md:flex-row items-center gap-4">
                <div class="icon-box bg-primary shadow-[inset_0_4px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.15)] p-2 aspect-square rounded-lg text-white -rotate-15">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path></svg>
                </div>
                <h2 class="text-4xl font-semibold font-urbanist">Fonctionnalités</h2>
              </div>
              <p class="text-zinc-500 text-base/7 md:text-left text-center max-w-sm">
                Tout ce dont vous avez besoin pour créer, gérer et développer votre boutique en ligne avec succès.
              </p>
            </div>
            <div class="p-4 md:p-6 bg-primary w-full rounded-xl mt-12">
              <p class="text-lg text-white">Des milliers d'entrepreneurs font confiance à UberMarket.</p>
              <NuxtLink to="/inscription-vendeur" class="bg-white w-max hover:bg-gray-100 px-5 py-2 rounded-full mt-6 flex items-center gap-1 transition-colors">
                Créer ma boutique
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="p-4 pt-16 md:p-16 space-y-6">
          <!-- Création boutique -->
          <div class="feature-card bg-indigo-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-primary p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Création en 1m30s</p>
            <p class="text-sm text-gray-600 mt-2">Créez votre boutique en quelques clics. Vendez des produits physiques ou numériques avec votre sous-domaine personnalisé.</p>
          </div>
          <!-- Paiements -->
          <div class="feature-card bg-green-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-green-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"></rect><path d="M2 10h20"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Paiements Mobile Money, Carte & PayPal</p>
            <p class="text-sm text-gray-600 mt-2">Acceptez Orange Money, MTN, Wave, Visa, Mastercard et PayPal. Retirez vos gains à tout moment.</p>
          </div>
          <!-- Gestion produits -->
          <div class="feature-card bg-amber-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-amber-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Produits physiques & numériques</p>
            <p class="text-sm text-gray-600 mt-2">Vendez tout type de produit : physique avec variantes (taille, couleur) ou numérique (ebooks, formations, fichiers).</p>
          </div>
          <!-- Livraisons -->
          <div class="feature-card bg-purple-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-purple-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
            </div>
            <p class="text-base font-medium mt-4">Zones de livraison & Livreurs</p>
            <p class="text-sm text-gray-600 mt-2">Définissez vos zones, tarifs de livraison et gérez votre équipe de livreurs.</p>
          </div>
          <!-- Codes promo -->
          <div class="feature-card bg-rose-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-rose-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5"></path><path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Codes promo & Réductions</p>
            <p class="text-sm text-gray-600 mt-2">Créez des codes promo personnalisés avec dates de validité et limites d'utilisation.</p>
          </div>
          <!-- Website Builder -->
          <div class="feature-card bg-cyan-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-cyan-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Website Builder</p>
            <p class="text-sm text-gray-600 mt-2">Créez des pages personnalisées avec notre éditeur drag-and-drop intuitif.</p>
          </div>
          <!-- Thèmes -->
          <div class="feature-card bg-violet-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-violet-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Thèmes & Personnalisation</p>
            <p class="text-sm text-gray-600 mt-2">Choisissez parmi plusieurs thèmes et personnalisez couleurs, logo et bannières.</p>
          </div>
          <!-- Analytics -->
          <div class="feature-card bg-pink-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-pink-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Analytics & Tableau de bord</p>
            <p class="text-sm text-gray-600 mt-2">Ventes, clients, produits populaires, revenus - tout en temps réel avec graphiques.</p>
          </div>
          <!-- Marketing -->
          <div class="feature-card bg-lime-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-lime-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"></path><path d="m12 12 4 10 1.7-4.3L22 16Z"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Marketing & Tracking</p>
            <p class="text-sm text-gray-600 mt-2">Facebook Pixel, Google Analytics, TikTok Pixel pour suivre vos conversions.</p>
          </div>
          <!-- Avis clients -->
          <div class="feature-card bg-yellow-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-yellow-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Avis clients</p>
            <p class="text-sm text-gray-600 mt-2">Vos clients laissent des avis avec notes et photos pour renforcer la confiance.</p>
          </div>
          <!-- Collaboration -->
          <div class="feature-card bg-blue-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-blue-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Collaboration équipe</p>
            <p class="text-sm text-gray-600 mt-2">Invitez des collaborateurs avec des rôles : admin, gestionnaire, support.</p>
          </div>
          <!-- Commandes -->
          <div class="feature-card bg-orange-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-orange-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"></path><path d="M8 3H3v5"></path><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"></path><path d="m15 9 6-6"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Gestion des commandes</p>
            <p class="text-sm text-gray-600 mt-2">Suivi complet : en attente, confirmée, en livraison, livrée. Notifications en temps réel.</p>
          </div>
          <!-- Domaine personnalisé -->
          <div class="feature-card bg-gray-100 flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26">
            <div class="bg-gray-700 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
            </div>
            <p class="text-base font-medium mt-4">Domaine personnalisé</p>
            <p class="text-sm text-gray-600 mt-2">Connectez votre propre nom de domaine (maboutique.com) à partir du plan Standard.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="border-y border-gray-200">
      <div class="px-4 md:px-16 lg:px-24 xl:px-32">
        <div class="p-4 pt-20 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
          <div class="flex flex-col gap-6 items-center">
            <div class="icon-box bg-primary shadow-[inset_0_4px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.15)] p-2 aspect-square rounded-lg text-white -rotate-15">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
            </div>
            <h2 class="text-4xl font-semibold font-urbanist">Questions fréquentes</h2>
            <p class="text-zinc-500 text-base/7 text-center max-w-lg">
              Tout ce que vous devez savoir sur UberMarket et comment démarrer.
            </p>
          </div>
        </div>
      </div>
      <div class="px-4 md:px-16 lg:px-24 xl:px-32 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200 border-x border-gray-200 max-w-7xl mx-auto">
          <div class="p-4 pt-20 md:p-20 space-y-6">
            <details class="group bg-gray-50 border border-gray-200 rounded-xl" open>
              <summary class="flex items-center justify-between p-6 select-none cursor-pointer">
                <h3 class="font-medium text-base">Qu'est-ce qu'UberMarket ?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="group-open:rotate-180 transition-transform"><path d="m6 9 6 6 6-6"></path></svg>
              </summary>
              <p class="text-sm/6 text-zinc-500 max-w-md p-6 pt-0">
                UberMarket est une plateforme SaaS qui vous permet de créer votre boutique en ligne en quelques minutes. Vous bénéficiez d'un sous-domaine personnalisé, de paiements intégrés et de nombreuses fonctionnalités e-commerce.
              </p>
            </details>
            <details class="group bg-gray-50 border border-gray-200 rounded-xl">
              <summary class="flex items-center justify-between p-6 select-none cursor-pointer">
                <h3 class="font-medium text-base">Est-ce vraiment gratuit pour commencer ?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="group-open:rotate-180 transition-transform"><path d="m6 9 6 6 6-6"></path></svg>
              </summary>
              <p class="text-sm/6 text-zinc-500 max-w-md p-6 pt-0">
                Oui ! Le plan Welcome est 100% gratuit. Nous prenons uniquement 15% de commission sur vos ventes. Vous pouvez aussi essayer le plan Gratuit pendant 7 jours sans engagement.
              </p>
            </details>
            <details class="group bg-gray-50 border border-gray-200 rounded-xl">
              <summary class="flex items-center justify-between p-6 select-none cursor-pointer">
                <h3 class="font-medium text-base">Quels moyens de paiement sont acceptés ?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="group-open:rotate-180 transition-transform"><path d="m6 9 6 6 6-6"></path></svg>
              </summary>
              <p class="text-sm/6 text-zinc-500 max-w-md p-6 pt-0">
                Via notre partenaire de paiement, vous acceptez les cartes (Visa, Mastercard), Mobile Money (Orange, MTN, Wave), PayPal et autres méthodes locales.
              </p>
            </details>
            <details class="group bg-gray-50 border border-gray-200 rounded-xl">
              <summary class="flex items-center justify-between p-6 select-none cursor-pointer">
                <h3 class="font-medium text-base">Puis-je utiliser mon propre domaine ?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="group-open:rotate-180 transition-transform"><path d="m6 9 6 6 6-6"></path></svg>
              </summary>
              <p class="text-sm/6 text-zinc-500 max-w-md p-6 pt-0">
                Oui, à partir du plan Standard. Vous pouvez connecter votre propre domaine à votre boutique UberMarket.
              </p>
            </details>
            <details class="group bg-gray-50 border border-gray-200 rounded-xl">
              <summary class="flex items-center justify-between p-6 select-none cursor-pointer">
                <h3 class="font-medium text-base">Comment recevoir mes paiements ?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="group-open:rotate-180 transition-transform"><path d="m6 9 6 6 6-6"></path></svg>
              </summary>
              <p class="text-sm/6 text-zinc-500 max-w-md p-6 pt-0">
                Vos gains sont disponibles dans votre tableau de bord. Demandez un retrait vers votre compte bancaire ou Mobile Money à tout moment.
              </p>
            </details>
          </div>
          <div class="p-4 pt-20 md:p-20">
            <div class="sticky top-30 flex items-center justify-between gap-5 p-6 bg-violet-500 w-full rounded-xl mt-12">
              <h3 class="text-lg text-white text-balance">
                Encore des questions ? Notre équipe vous répond rapidement.
              </h3>
              <a href="mailto:contact@uber-market.com" class="bg-white w-max shrink-0 hover:bg-gray-100 px-5 py-2 rounded-full transition-colors">
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="tarifs" class="border-b border-gray-200 px-4 md:px-16 lg:px-24 xl:px-32">
      <div class="p-4 pt-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
        <div class="flex flex-col gap-6 items-center">
          <div class="flex flex-col md:flex-row items-center gap-4">
            <div class="icon-box bg-primary shadow-[inset_0_4px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.15)] p-2 aspect-square rounded-lg text-white -rotate-15">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>
            </div>
            <h2 class="text-4xl font-semibold font-urbanist">Tarifs simples et transparents</h2>
          </div>
          <p class="text-zinc-500 text-base/7 text-center max-w-lg">
            Choisissez le plan qui correspond à vos besoins. Évoluez quand vous voulez.
          </p>
        </div>
        <div class="flex flex-wrap items-start justify-center gap-10 md:gap-4 px-4 mt-12 pb-20">
          <!-- Plan Welcome -->
          <div class="pricing-card p-5 pb-8 w-full sm:max-w-64 rounded-xl border border-gray-200 bg-white">
            <div class="w-max border border-gray-200 p-2 aspect-square rounded-lg text-primary bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>
            </div>
            <h3 class="text-lg font-medium mt-6">Welcome</h3>
            <p class="text-zinc-500">Démarrez sans engagement.</p>
            <p class="text-3xl font-semibold mt-4">0€/mois</p>
            <p class="text-xs text-amber-600 mt-1">15% de commission</p>
            <NuxtLink to="/inscription-vendeur?plan=welcome" class="block text-center py-2.5 rounded-full mt-6 text-zinc-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
              Commencer
            </NuxtLink>
            <div class="space-y-2 mt-6">
              <div class="flex items-center gap-2"><svg class="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M20 6 9 17l-5-5"></path></svg><p class="text-zinc-500">1 boutique, 25 produits</p></div>
              <div class="flex items-center gap-2"><svg class="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M20 6 9 17l-5-5"></path></svg><p class="text-zinc-500">Support standard</p></div>
            </div>
          </div>
          <!-- Plan Gratuit -->
          <div class="pricing-card p-5 pb-8 w-full sm:max-w-64 rounded-xl border border-gray-200 bg-white">
            <div class="w-max border border-gray-200 p-2 aspect-square rounded-lg text-primary bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <h3 class="text-lg font-medium mt-6">Gratuit</h3>
            <p class="text-zinc-500">7 jours gratuits, puis 5€/mois.</p>
            <p class="text-3xl font-semibold mt-4">5€/mois</p>
            <p class="text-xs text-green-600 mt-1">7 jours d'essai gratuit</p>
            <NuxtLink to="/inscription-vendeur?plan=gratuit" class="block text-center py-2.5 rounded-full mt-6 text-zinc-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
              Essayer 7 jours
            </NuxtLink>
            <div class="space-y-2 mt-6">
              <div class="flex items-center gap-2"><svg class="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M20 6 9 17l-5-5"></path></svg><p class="text-zinc-500">1 boutique, 50 produits</p></div>
              <div class="flex items-center gap-2"><svg class="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M20 6 9 17l-5-5"></path></svg><p class="text-zinc-500">0% commission</p></div>
            </div>
          </div>
          <!-- Plan Standard -->
          <div class="pricing-card p-5 pb-8 w-full sm:max-w-64 rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-primary/10">
            <div class="w-max border border-gray-200 p-2 aspect-square rounded-lg text-primary bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M16 3.13a4 4 0 0 1 0 7.75"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path></svg>
            </div>
            <h3 class="text-lg font-medium mt-6">Standard</h3>
            <p class="text-zinc-500">Tous les modules essentiels.</p>
            <p class="text-3xl font-semibold mt-4">14,99€/mois</p>
            <NuxtLink to="/inscription-vendeur?plan=standard" class="block text-center py-2.5 rounded-full mt-6 text-zinc-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
              Choisir Standard
            </NuxtLink>
            <div class="space-y-2 mt-6">
              <div class="flex items-center gap-2"><svg class="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M20 6 9 17l-5-5"></path></svg><p class="text-zinc-500">3 boutiques, 200 produits</p></div>
              <div class="flex items-center gap-2"><svg class="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M20 6 9 17l-5-5"></path></svg><p class="text-zinc-500">Livraison, Promo, Marketing</p></div>
              <div class="flex items-center gap-2"><svg class="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M20 6 9 17l-5-5"></path></svg><p class="text-zinc-500">Domaine personnalisé</p></div>
            </div>
          </div>
          <!-- Plan Premium -->
          <div class="pricing-card p-5 pb-8 w-full sm:max-w-64 rounded-xl border border-gray-200 bg-primary text-white">
            <div class="w-max border border-gray-200 p-2 aspect-square rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>
            <h3 class="text-lg font-medium mt-6">Premium</h3>
            <p class="text-white/80">Toutes les fonctionnalités.</p>
            <p class="text-3xl font-semibold mt-4">24,99€/mois</p>
            <NuxtLink to="/inscription-vendeur?plan=premium" class="block text-center py-2.5 rounded-full mt-6 text-zinc-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
              Choisir Premium
            </NuxtLink>
            <div class="space-y-2 mt-6">
              <div class="flex items-center gap-2"><svg class="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M20 6 9 17l-5-5"></path></svg><p class="text-white">10 boutiques, 1000 produits</p></div>
              <div class="flex items-center gap-2"><svg class="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M20 6 9 17l-5-5"></path></svg><p class="text-white">Clés paiement perso</p></div>
              <div class="flex items-center gap-2"><svg class="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M20 6 9 17l-5-5"></path></svg><p class="text-white">Support prioritaire 24/7</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="temoignages" class="px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200">
      <div class="p-4 pt-20 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
        <div class="flex flex-col gap-6 items-center">
          <div class="flex flex-col md:flex-row items-center gap-4">
            <div class="icon-box bg-primary shadow-[inset_0_4px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.15)] p-2 aspect-square rounded-lg text-white -rotate-15">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
            </div>
            <h2 class="text-4xl font-semibold font-urbanist">Ce que disent nos vendeurs</h2>
          </div>
          <p class="text-zinc-500 text-base/7 text-center max-w-lg">
            Des milliers de vendeurs font confiance à UberMarket pour leur e-commerce.
          </p>
        </div>
        <div class="flex flex-wrap gap-8 items-center justify-center mt-24">
          <div class="testimonial-card p-6 rounded-xl max-w-80 shadow-[0_4px_20px_rgba(0,0,0,0.10)] bg-white">
            <div class="flex items-center gap-1">
              <svg v-for="i in 5" :key="i" class="size-5 fill-primary text-primary" viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
            </div>
            <p class="my-4 text-base/7 text-zinc-500">
              J'ai lancé ma boutique en moins d'une heure. Les paiements sont rapides et le support est très réactif. Je recommande !
            </p>
            <div class="flex items-center gap-2 pt-3">
              <img class="size-10 rounded-full object-cover" alt="Aminata" src="https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=100">
              <div>
                <p class="font-medium text-gray-800">Aminata K.</p>
                <p class="text-xs text-zinc-500">@aminata_mode</p>
              </div>
            </div>
          </div>
          <div class="testimonial-card p-6 rounded-xl max-w-80 shadow-[0_4px_20px_rgba(0,0,0,0.10)] bg-primary">
            <div class="flex items-center gap-1">
              <svg v-for="i in 5" :key="i" class="size-5 text-white fill-white" viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
            </div>
            <p class="my-4 text-base/7 text-white">
              Le module de livraison m'a fait gagner un temps fou. Je gère tout depuis mon téléphone. Parfait pour les entrepreneurs !
            </p>
            <div class="flex items-center gap-2 pt-3">
              <img class="size-10 rounded-full object-cover" alt="Moussa" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100">
              <div>
                <p class="font-medium text-white">Moussa D.</p>
                <p class="text-xs text-white/80">@moussa_tech</p>
              </div>
            </div>
          </div>
          <div class="testimonial-card p-6 rounded-xl max-w-80 shadow-[0_4px_20px_rgba(0,0,0,0.10)] bg-white">
            <div class="flex items-center gap-1">
              <svg v-for="i in 5" :key="i" class="size-5 fill-primary text-primary" viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
            </div>
            <p class="my-4 text-base/7 text-zinc-500">
              Les analytics m'aident à comprendre mes clients. J'ai doublé mes ventes en 3 mois grâce aux insights.
            </p>
            <div class="flex items-center gap-2 pt-3">
              <img class="size-10 rounded-full object-cover" alt="Fatou" src="https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?q=80&w=100">
              <div>
                <p class="font-medium text-gray-800">Fatou S.</p>
                <p class="text-xs text-zinc-500">@fatou_beauty</p>
              </div>
            </div>
          </div>
        </div>
        <NuxtLink to="/inscription-vendeur" class="mt-20 mb-12 px-8 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors">
          Rejoindre UberMarket
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-4 md:px-16 lg:px-24 xl:px-32">
      <div class="border-x border-gray-200 px-4 md:px-12 max-w-7xl mx-auto pt-40">
        <div class="flex flex-col md:flex-row items-start justify-between relative p-8 md:p-12 overflow-hidden pb-32 md:pb-42 bg-gradient-to-t from-primary/10 to-primary/20 rounded-t-2xl">
          <div class="max-w-72">
            <img alt="Logo" class="h-62 w-auto absolute -bottom-18 opacity-7 select-none pointer-events-none" src="/uber-market.png">
            <img alt="Logo" class="h-9" src="/uber-market.png">
            <p class="text-zinc-500 mt-4 pb-6">
              La plateforme e-commerce la plus simple pour lancer votre boutique en ligne. Créé avec amour en Afrique.
            </p>
          </div>
          <div>
            <p class="uppercase font-semibold text-primary text-base">Réseaux sociaux</p>
            <div class="flex flex-col mt-6 gap-3">
              <a href="#" class="flex items-center gap-2 text-primary hover:opacity-70 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                <p>Twitter</p>
              </a>
              <a href="#" class="flex items-center gap-2 text-primary hover:opacity-70 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                <p>Instagram</p>
              </a>
              <a href="mailto:contact@uber-market.com" class="flex items-center gap-2 text-primary hover:opacity-70 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                <p>Email</p>
              </a>
            </div>
          </div>
          <div>
            <p class="uppercase font-semibold text-primary text-base">Légal</p>
            <div class="flex flex-col mt-6 gap-3">
              <NuxtLink to="/conditions" class="flex items-center gap-2 text-primary hover:opacity-70 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                <p>CGU & CGI</p>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Animation on scroll
onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .stat-item').forEach((el) => {
    observer.observe(el)
  })
})

// SEO
useHead({
  title: 'UberMarket - Créez votre boutique en ligne gratuitement',
  meta: [
    { name: 'description', content: 'Lancez votre e-commerce en 5 minutes. Paiements intégrés, livraison, analytics - tout inclus. Commencez gratuitement.' },
    { property: 'og:title', content: 'UberMarket - Créez votre boutique en ligne gratuitement' },
    { property: 'og:description', content: 'Lancez votre e-commerce en 5 minutes. Paiements intégrés, livraison, analytics - tout inclus.' },
  ],
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap' }
  ]
})
</script>

<style scoped>
/* Import Urbanist font */
.landing-page {
  --color-primary: #5B6AC5;
  --color-primary-dark: #4a59b4;
}

.font-urbanist {
  font-family: 'Urbanist', sans-serif;
}

/* Primary color utilities */
.text-primary { color: var(--color-primary); }
.bg-primary { background-color: var(--color-primary); }
.bg-primary\/10 { background-color: rgba(91, 106, 197, 0.1); }
.border-primary { border-color: var(--color-primary); }
.fill-primary { fill: var(--color-primary); }
.stroke-primary { stroke: var(--color-primary); }
.from-primary-dark { --tw-gradient-from: var(--color-primary-dark); }
.to-primary { --tw-gradient-to: var(--color-primary); }

/* Size utilities */
.size-4\.5 { width: 1.125rem; height: 1.125rem; }
.size-6\.5 { width: 1.625rem; height: 1.625rem; }

/* Height utility for mobile menu */
.h-92 { height: 23rem; }
.h-62 { height: 15.5rem; }

/* Top utilities */
.top-26 { top: 6.5rem; }
.top-30 { top: 7.5rem; }

/* Rotation */
.rotate-15 { rotate: 15deg; }
.-rotate-15 { rotate: -15deg; }

/* Bottom and Opacity */
.-bottom-18 { bottom: -4.5rem; }
.opacity-7 { opacity: 0.07; }
.pb-42 { padding-bottom: 10.5rem; }
.right-13 { right: 3.25rem; }

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Hero animations */
.nav-animate {
  animation: fadeIn 0.6s ease-out;
}

.hero-badge {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.hero-title {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.hero-desc {
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

.hero-buttons {
  animation: fadeInUp 0.6s ease-out 0.8s both;
}

.icon-box {
  animation: fadeIn 0.4s ease-out;
}

/* Scroll animations - initial state */
.feature-card,
.pricing-card,
.testimonial-card,
.stat-item {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.feature-card.animate-in,
.pricing-card.animate-in,
.testimonial-card.animate-in,
.stat-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger animation delay for cards */
.feature-card:nth-child(1) { transition-delay: 0s; }
.feature-card:nth-child(2) { transition-delay: 0.05s; }
.feature-card:nth-child(3) { transition-delay: 0.1s; }
.feature-card:nth-child(4) { transition-delay: 0.15s; }
.feature-card:nth-child(5) { transition-delay: 0.2s; }
.feature-card:nth-child(6) { transition-delay: 0.25s; }
.feature-card:nth-child(7) { transition-delay: 0.3s; }
.feature-card:nth-child(8) { transition-delay: 0.35s; }
.feature-card:nth-child(9) { transition-delay: 0.4s; }
.feature-card:nth-child(10) { transition-delay: 0.45s; }
.feature-card:nth-child(11) { transition-delay: 0.5s; }
.feature-card:nth-child(12) { transition-delay: 0.55s; }
.feature-card:nth-child(13) { transition-delay: 0.6s; }

.pricing-card:nth-child(1) { transition-delay: 0s; }
.pricing-card:nth-child(2) { transition-delay: 0.1s; }
.pricing-card:nth-child(3) { transition-delay: 0.2s; }
.pricing-card:nth-child(4) { transition-delay: 0.3s; }

.testimonial-card:nth-child(1) { transition-delay: 0s; }
.testimonial-card:nth-child(2) { transition-delay: 0.15s; }
.testimonial-card:nth-child(3) { transition-delay: 0.3s; }

.stat-item:nth-child(1) { transition-delay: 0s; }
.stat-item:nth-child(2) { transition-delay: 0.1s; }
.stat-item:nth-child(3) { transition-delay: 0.2s; }

/* Hover effects */
.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.testimonial-card:hover {
  transform: translateY(-3px);
}
</style>
