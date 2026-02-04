<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Header simple -->
    <header class="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">UM</span>
          </div>
          <span class="text-xl font-semibold text-gray-900">Uber-Market</span>
        </NuxtLink>
        <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
          ← Retour à l'accueil
        </NuxtLink>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-4xl mx-auto px-6 py-16">
      <!-- En-tête de page -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center px-4 py-1.5 bg-blue-50 rounded-full mb-6">
          <svg class="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <span class="text-sm font-medium text-blue-600">Cadre juridique</span>
        </div>
        
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Conditions Générales<br/>d'Utilisation & d'Inscription
        </h1>
        
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Plateforme Uber-Market.com
        </p>
        
        <div class="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Version 1.0
          </span>
          <span class="text-gray-300">•</span>
          <span>Dernière mise à jour : {{ lastUpdate }}</span>
        </div>
      </div>

      <!-- Navigation des sections -->
      <nav class="mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Sommaire</h2>
        <div class="grid md:grid-cols-2 gap-3">
          <a 
            v-for="section in sections" 
            :key="section.id"
            :href="`#${section.id}`"
            class="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <svg class="w-4 h-4 mr-3 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            {{ section.title }}
          </a>
        </div>
      </nav>

      <!-- Préambule -->
      <section class="mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Préambule</h2>
            <div class="prose prose-blue max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                La plateforme <strong>Uber-Market.com</strong> est une solution numérique de type marketplace permettant la mise en relation entre vendeurs (professionnels, PME, créateurs, artisans) et acheteurs, en vue de la commercialisation de produits et services.
              </p>
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) et Conditions Générales d'Inscription (CGI) sont établies conformément :
              </p>
              <ul class="space-y-2 ml-6">
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>au Code du numérique de la République du Bénin (Loi n°2017-20 et textes subséquents),</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>au droit OHADA,</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>au droit français applicable au commerce électronique (LCEN, RGPD à titre de référence),</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>et aux principes généraux du droit des contrats.</span>
                </li>
              </ul>
              <div class="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                <p class="text-sm font-medium text-blue-900">
                  ⚠️ L'utilisation et/ou l'inscription sur la plateforme implique l'acceptation pleine et entière des présentes conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PARTIE I - CGU -->
      <section id="cgu" class="mb-16">
        <div class="flex items-center mb-8">
          <div class="flex-grow border-t border-gray-300"></div>
          <div class="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full text-sm font-bold uppercase tracking-wider">
            Partie I – CGU
          </div>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Articles CGU -->
        <div class="space-y-8">
          <article id="definitions" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">1</span>
              Définitions
            </h3>
            <dl class="space-y-3 text-gray-700">
              <div class="flex">
                <dt class="font-semibold min-w-[140px]">Plateforme :</dt>
                <dd>site web et services numériques Uber-Market.com</dd>
              </div>
              <div class="flex">
                <dt class="font-semibold min-w-[140px]">Utilisateur :</dt>
                <dd>toute personne accédant à la plateforme</dd>
              </div>
              <div class="flex">
                <dt class="font-semibold min-w-[140px]">Vendeur :</dt>
                <dd>utilisateur proposant des produits ou services</dd>
              </div>
              <div class="flex">
                <dt class="font-semibold min-w-[140px]">Acheteur :</dt>
                <dd>utilisateur effectuant un achat</dd>
              </div>
              <div class="flex">
                <dt class="font-semibold min-w-[140px]">Compte :</dt>
                <dd>espace personnel créé sur la plateforme</dd>
              </div>
            </dl>
          </article>

          <article id="objet" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
              Objet des CGU
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Les présentes CGU ont pour objet de définir les modalités d'accès, de navigation et d'utilisation de la plateforme Uber-Market.com.
            </p>
          </article>

          <article id="acces" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
              Accès à la plateforme
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-3">
              <p>La plateforme est accessible à toute personne disposant d'un accès à Internet. Certains services sont réservés aux utilisateurs inscrits.</p>
              <p>Uber-Market se réserve le droit de suspendre ou limiter l'accès pour maintenance, mise à jour ou en cas de force majeure.</p>
            </div>
          </article>

          <article id="services" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
              Services proposés
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-4">
              <p>La plateforme propose notamment :</p>
              <ul class="space-y-2 ml-6">
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>La création de site web et de boutiques en ligne</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>La mise en relation vendeurs / acheteurs</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Des outils de paiement, marketing et logistique</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Des services visuels et audiovisuels partenaires</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Un accompagnement à la vente internationale</span>
                </li>
              </ul>
              <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p class="text-sm text-gray-700">
                  <strong>Important :</strong> Uber-Market agit en qualité d'intermédiaire technique.
                </p>
              </div>
            </div>
          </article>

          <article id="responsabilite" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">5</span>
              Responsabilité
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-4">
              <p>Uber-Market n'est pas partie aux contrats conclus entre vendeurs et acheteurs.</p>
              <p>La responsabilité de la plateforme ne saurait être engagée en cas de :</p>
              <ul class="space-y-2 ml-6">
                <li>• Litige commercial entre utilisateurs</li>
                <li>• Contenu illicite publié par un vendeur</li>
                <li>• Indisponibilité temporaire du service</li>
              </ul>
              <div class="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p class="text-sm text-amber-900">
                  Conformément au Code du numérique béninois, Uber-Market agit en hébergeur de contenus.
                </p>
              </div>
            </div>
          </article>

          <article id="obligations" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">6</span>
              Obligations des utilisateurs
            </h3>
            <div class="text-gray-700 leading-relaxed">
              <p class="mb-3">Les utilisateurs s'engagent à :</p>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="flex items-start p-4 bg-green-50 rounded-lg border border-green-100">
                  <svg class="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Fournir des informations exactes</span>
                </div>
                <div class="flex items-start p-4 bg-green-50 rounded-lg border border-green-100">
                  <svg class="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Respecter les lois en vigueur</span>
                </div>
                <div class="flex items-start p-4 bg-green-50 rounded-lg border border-green-100">
                  <svg class="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Ne pas publier de contenus illicites</span>
                </div>
                <div class="flex items-start p-4 bg-green-50 rounded-lg border border-green-100">
                  <svg class="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Utiliser la plateforme loyalement</span>
                </div>
              </div>
            </div>
          </article>

          <article id="propriete" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">7</span>
              Propriété intellectuelle
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Tous les éléments de la plateforme (marques, logos, design, contenus) sont protégés. Toute reproduction sans autorisation est interdite.
            </p>
          </article>

          <article id="donnees" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">8</span>
              Données personnelles
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-3">
              <p>Uber-Market collecte et traite les données personnelles conformément :</p>
              <ul class="space-y-2 ml-6">
                <li>• Au Code du numérique béninois</li>
                <li>• Aux principes du RGPD (information, consentement, sécurité, droits des personnes)</li>
              </ul>
              <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p class="text-sm font-medium text-blue-900">
                  Les utilisateurs disposent d'un droit d'accès, de rectification et de suppression.
                </p>
              </div>
            </div>
          </article>

          <article id="suspension" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">9</span>
              Suspension / Résiliation
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-3">
              <p>Uber-Market se réserve le droit de suspendre ou supprimer un compte en cas de :</p>
              <div class="space-y-2">
                <div class="flex items-start p-3 bg-red-50 rounded-lg border border-red-100">
                  <svg class="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Violation des CGU/CGI</span>
                </div>
                <div class="flex items-start p-3 bg-red-50 rounded-lg border border-red-100">
                  <svg class="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Activité frauduleuse</span>
                </div>
                <div class="flex items-start p-3 bg-red-50 rounded-lg border border-red-100">
                  <svg class="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Atteinte à l'image ou à la sécurité de la plateforme</span>
                </div>
              </div>
            </div>
          </article>

          <article id="droit" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">10</span>
              Droit applicable & Litiges
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-3">
              <p>Les présentes CGU sont régies par le droit béninois, le droit OHADA, et à titre supplétif par les principes du droit français.</p>
              <div class="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p class="text-sm text-purple-900">
                  Tout litige fera l'objet d'une tentative de règlement amiable avant saisie des juridictions compétentes.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- PARTIE II - CGI -->
      <section id="cgi" class="mb-16">
        <div class="flex items-center mb-8">
          <div class="flex-grow border-t border-gray-300"></div>
          <div class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-bold uppercase tracking-wider">
            Partie II – CGI
          </div>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Articles CGI -->
        <div class="space-y-8">
          <article id="conditions-inscription" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">11</span>
              Conditions d'inscription
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-3">
              <p>L'inscription est ouverte à toute personne majeure juridiquement capable.</p>
              <p>Pour les vendeurs professionnels, des documents justificatifs peuvent être exigés.</p>
            </div>
          </article>

          <article id="creation-compte" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">12</span>
              Création de compte
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-3">
              <p>L'utilisateur s'engage à fournir des informations exactes et à maintenir leur mise à jour.</p>
              <div class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p class="text-sm font-medium text-orange-900">
                  ⚠️ Chaque utilisateur est responsable de la confidentialité de ses identifiants.
                </p>
              </div>
            </div>
          </article>

          <article id="inscription-vendeurs" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">13</span>
              Inscription des vendeurs
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-4">
              <p>Les vendeurs doivent :</p>
              <ul class="space-y-2 ml-6">
                <li>• Détenir les droits sur les produits proposés</li>
                <li>• Respecter la réglementation commerciale et fiscale applicable</li>
                <li>• Garantir la conformité et la qualité des produits</li>
              </ul>
              <p class="text-sm italic text-gray-600">Uber-Market se réserve le droit de refuser ou suspendre un vendeur.</p>
            </div>
          </article>

          <article id="tarification" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">14</span>
              Tarification & Commissions
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-4">
              <p>L'inscription peut être gratuite ou payante selon les offres.</p>
              <p>Uber-Market peut percevoir :</p>
              <div class="grid md:grid-cols-3 gap-4 mt-4">
                <div class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div class="text-2xl mb-2">💰</div>
                  <p class="text-sm font-medium text-gray-900">Frais d'abonnement</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div class="text-2xl mb-2">📊</div>
                  <p class="text-sm font-medium text-gray-900">Commissions sur ventes</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div class="text-2xl mb-2">⚡</div>
                  <p class="text-sm font-medium text-gray-900">Services additionnels</p>
                </div>
              </div>
              <p class="text-sm text-gray-600">Les conditions tarifaires sont précisées sur la plateforme.</p>
            </div>
          </article>

          <article id="engagements-vendeur" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">15</span>
              Engagements du vendeur
            </h3>
            <div class="text-gray-700 leading-relaxed">
              <p class="mb-3">Le vendeur s'engage à :</p>
              <div class="space-y-2">
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Honorer les commandes</span>
                </div>
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Assurer le service après-vente</span>
                </div>
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Respecter les délais de livraison</span>
                </div>
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Gérer les litiges avec les acheteurs</span>
                </div>
              </div>
            </div>
          </article>

          <article id="resiliation-compte" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">16</span>
              Résiliation du compte
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-3">
              <p>L'utilisateur peut résilier son compte à tout moment.</p>
              <p>Uber-Market peut résilier un compte en cas de manquement grave.</p>
            </div>
          </article>

          <article id="modification" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">17</span>
              Modification des CGU / CGI
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-3">
              <p>Uber-Market se réserve le droit de modifier les présentes conditions.</p>
              <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p class="text-sm text-blue-900">
                  Les utilisateurs seront informés par tout moyen approprié.
                </p>
              </div>
            </div>
          </article>

          <article id="acceptation" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">18</span>
              Acceptation
            </h3>
            <div class="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
              <p class="text-gray-900 font-medium leading-relaxed">
                L'inscription et l'utilisation de la plateforme valent acceptation expresse des présentes CGU et CGI.
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- Footer de la page -->
      <div class="mt-20 pt-12 border-t border-gray-200">
        <div class="text-center">
          <div class="inline-flex items-center justify-center space-x-4 mb-6">
            <a href="mailto:contact@uber-market.com" class="flex items-center text-gray-600 hover:text-primary transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Contact
            </a>
            <span class="text-gray-300">•</span>
            <NuxtLink to="/" class="text-gray-600 hover:text-primary transition-colors">
              Retour à l'accueil
            </NuxtLink>
          </div>
          <p class="text-sm text-gray-500">
            © {{ new Date().getFullYear() }} Uber-Market. Tous droits réservés.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: false
})

useHead({
  title: 'Conditions Générales d\'Utilisation & d\'Inscription - Uber-Market',
  meta: [
    { name: 'description', content: 'Consultez les conditions générales d\'utilisation (CGU) et d\'inscription (CGI) de la plateforme Uber-Market.' }
  ]
})

const lastUpdate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
})

const sections = ref([
  { id: 'cgu', title: 'Partie I – CGU' },
  { id: 'definitions', title: 'Article 1 – Définitions' },
  { id: 'objet', title: 'Article 2 – Objet des CGU' },
  { id: 'acces', title: 'Article 3 – Accès à la plateforme' },
  { id: 'services', title: 'Article 4 – Services proposés' },
  { id: 'responsabilite', title: 'Article 5 – Responsabilité' },
  { id: 'obligations', title: 'Article 6 – Obligations des utilisateurs' },
  { id: 'propriete', title: 'Article 7 – Propriété intellectuelle' },
  { id: 'donnees', title: 'Article 8 – Données personnelles' },
  { id: 'suspension', title: 'Article 9 – Suspension / Résiliation' },
  { id: 'droit', title: 'Article 10 – Droit applicable & Litiges' },
  { id: 'cgi', title: 'Partie II – CGI' },
  { id: 'conditions-inscription', title: 'Article 11 – Conditions d\'inscription' },
  { id: 'creation-compte', title: 'Article 12 – Création de compte' },
  { id: 'inscription-vendeurs', title: 'Article 13 – Inscription des vendeurs' },
  { id: 'tarification', title: 'Article 14 – Tarification & Commissions' },
  { id: 'engagements-vendeur', title: 'Article 15 – Engagements du vendeur' },
  { id: 'resiliation-compte', title: 'Article 16 – Résiliation du compte' },
  { id: 'modification', title: 'Article 17 – Modification des CGU / CGI' },
  { id: 'acceptation', title: 'Article 18 – Acceptation' }
])
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

.prose {
  max-width: none;
}
</style>
