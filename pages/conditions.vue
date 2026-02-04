<template>
  <div class="landing-page antialiased text-sm text-gray-900">
    <!-- Navbar (même que landing page) -->
    <nav class="fixed w-full top-0 z-50 px-4 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-neutral-300 bg-white/80 backdrop-blur">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <NuxtLink to="/">
          <img alt="UberMarket Logo" class="h-14 md:h-16" src="/uber-market.png">
        </NuxtLink>
        <div class="hidden md:flex gap-3">
          <NuxtLink to="/marketplace" class="py-1 px-3 hover:text-zinc-500">Marketplace</NuxtLink>
          <NuxtLink to="/#fonctionnalites" class="py-1 px-3 hover:text-zinc-500">Fonctionnalités</NuxtLink>
          <NuxtLink to="/#tarifs" class="py-1 px-3 hover:text-zinc-500">Tarifs</NuxtLink>
        </div>
        <button @click="toggleMobileMenu" class="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>
        </button>
        <NuxtLink to="/inscription-vendeur" class="hidden md:inline-block py-2.5 px-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] bg-primary text-white rounded-full hover:opacity-90 transition-opacity">
          Commencer gratuitement
        </NuxtLink>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div :class="['fixed top-0 right-0 z-50 w-full bg-white shadow-xl shadow-black/5 transition-all duration-300 ease-in-out overflow-hidden', mobileMenuOpen ? 'h-72' : 'h-0']">
      <div class="flex items-center justify-between p-4">
        <img alt="UberMarket Logo" class="h-14" src="/uber-market.png">
        <button @click="toggleMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>
      <div class="flex flex-col gap-4 p-4 text-base">
        <NuxtLink to="/marketplace" @click="closeMobileMenu" class="py-1 px-3">Marketplace</NuxtLink>
        <NuxtLink to="/#fonctionnalites" @click="closeMobileMenu" class="py-1 px-3">Fonctionnalités</NuxtLink>
        <NuxtLink to="/#tarifs" @click="closeMobileMenu" class="py-1 px-3">Tarifs</NuxtLink>
        <NuxtLink to="/inscription-vendeur" @click="closeMobileMenu" class="py-2.5 px-6 w-max text-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] bg-primary text-white rounded-full">
          Commencer gratuitement
        </NuxtLink>
      </div>
    </div>

    <!-- Contenu principal -->
    <main class="pt-28 pb-16 max-w-3xl mx-auto px-4 md:px-8">
      <h1 class="text-2xl md:text-3xl font-urbanist font-semibold text-gray-900 mb-2">
        Conditions Générales d'Utilisation et d'Inscription
      </h1>
      <p class="text-sm text-gray-500 mb-10">
        Dernière mise à jour : {{ lastUpdate }}
      </p>

      <!-- Sommaire -->
      <nav class="mb-10 pb-8 border-b border-gray-200">
        <h2 class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Sommaire</h2>
        <ul class="space-y-1 text-sm">
          <li v-for="section in sections" :key="section.id">
            <a :href="`#${section.id}`" class="text-gray-600 hover:text-primary">{{ section.title }}</a>
          </li>
        </ul>
      </nav>

      <!-- Préambule -->
      <section class="mb-10">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Préambule</h2>
        <div class="text-gray-600 leading-relaxed space-y-4">
          <p>La plateforme Uber-Market.com est une solution numérique de type marketplace permettant la mise en relation entre vendeurs (professionnels, PME, créateurs, artisans) et acheteurs, en vue de la commercialisation de produits et services.</p>
          <p>Les présentes Conditions Générales d'Utilisation (CGU) et Conditions Générales d'Inscription (CGI) sont établies conformément :</p>
          <ul class="list-disc pl-5 space-y-1">
            <li>au Code du numérique de la République du Bénin (Loi n°2017-20 et textes subséquents),</li>
            <li>au droit OHADA,</li>
            <li>au droit français applicable au commerce électronique (LCEN, RGPD à titre de référence),</li>
            <li>et aux principes généraux du droit des contrats.</li>
          </ul>
          <p class="text-sm text-gray-500 italic">L'utilisation et/ou l'inscription sur la plateforme implique l'acceptation pleine et entière des présentes conditions.</p>
        </div>
      </section>

      <!-- PARTIE I - CGU -->
      <section class="mb-10">
        <h2 id="cgu" class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">Partie I – Conditions Générales d'Utilisation</h2>

        <article id="definitions" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 1 – Définitions</h3>
          <dl class="text-gray-600 leading-relaxed space-y-2">
            <div><dt class="inline font-medium">Plateforme :</dt> <dd class="inline">site web et services numériques Uber-Market.com</dd></div>
            <div><dt class="inline font-medium">Utilisateur :</dt> <dd class="inline">toute personne accédant à la plateforme</dd></div>
            <div><dt class="inline font-medium">Vendeur :</dt> <dd class="inline">utilisateur proposant des produits ou services</dd></div>
            <div><dt class="inline font-medium">Acheteur :</dt> <dd class="inline">utilisateur effectuant un achat</dd></div>
            <div><dt class="inline font-medium">Compte :</dt> <dd class="inline">espace personnel créé sur la plateforme</dd></div>
          </dl>
        </article>

        <article id="objet" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 2 – Objet des CGU</h3>
          <p class="text-gray-600 leading-relaxed">Les présentes CGU ont pour objet de définir les modalités d'accès, de navigation et d'utilisation de la plateforme Uber-Market.com.</p>
        </article>

        <article id="acces" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 3 – Accès à la plateforme</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>La plateforme est accessible à toute personne disposant d'un accès à Internet. Certains services sont réservés aux utilisateurs inscrits.</p>
            <p>Uber-Market se réserve le droit de suspendre ou limiter l'accès pour maintenance, mise à jour ou en cas de force majeure.</p>
          </div>
        </article>

        <article id="services" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 4 – Services proposés</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>La plateforme propose notamment :</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>La création de site web et de boutiques en ligne</li>
              <li>La mise en relation vendeurs / acheteurs</li>
              <li>Des outils de paiement, marketing et logistique</li>
              <li>Des services visuels et audiovisuels partenaires</li>
              <li>Un accompagnement à la vente internationale</li>
            </ul>
            <p class="text-sm text-gray-500">Uber-Market agit en qualité d'intermédiaire technique.</p>
          </div>
        </article>

        <article id="responsabilite" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 5 – Responsabilité</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>Uber-Market n'est pas partie aux contrats conclus entre vendeurs et acheteurs.</p>
            <p>La responsabilité de la plateforme ne saurait être engagée en cas de :</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Litige commercial entre utilisateurs</li>
              <li>Contenu illicite publié par un vendeur</li>
              <li>Indisponibilité temporaire du service</li>
            </ul>
            <p class="text-sm text-gray-500">Conformément au Code du numérique béninois, Uber-Market agit en hébergeur de contenus.</p>
          </div>
        </article>

        <article id="obligations" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 6 – Obligations des utilisateurs</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>Les utilisateurs s'engagent à :</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Fournir des informations exactes</li>
              <li>Respecter les lois en vigueur</li>
              <li>Ne pas publier de contenus illicites</li>
              <li>Utiliser la plateforme loyalement</li>
            </ul>
          </div>
        </article>

        <article id="propriete" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 7 – Propriété intellectuelle</h3>
          <p class="text-gray-600 leading-relaxed">Tous les éléments de la plateforme (marques, logos, design, contenus) sont protégés. Toute reproduction sans autorisation est interdite.</p>
        </article>

        <article id="donnees" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 8 – Données personnelles</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>Uber-Market collecte et traite les données personnelles conformément :</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Au Code du numérique béninois</li>
              <li>Aux principes du RGPD (information, consentement, sécurité, droits des personnes)</li>
            </ul>
            <p>Les utilisateurs disposent d'un droit d'accès, de rectification et de suppression.</p>
          </div>
        </article>

        <article id="suspension" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 9 – Suspension / Résiliation</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>Uber-Market se réserve le droit de suspendre ou supprimer un compte en cas de :</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Violation des CGU/CGI</li>
              <li>Activité frauduleuse</li>
              <li>Atteinte à l'image ou à la sécurité de la plateforme</li>
            </ul>
          </div>
        </article>

        <article id="droit" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 10 – Droit applicable et Litiges</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>Les présentes CGU sont régies par le droit béninois, le droit OHADA, et à titre supplétif par les principes du droit français.</p>
            <p>Tout litige fera l'objet d'une tentative de règlement amiable avant saisie des juridictions compétentes.</p>
          </div>
        </article>
      </section>

      <!-- PARTIE II - CGI -->
      <section class="mb-10">
        <h2 id="cgi" class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">Partie II – Conditions Générales d'Inscription</h2>

        <article id="conditions-inscription" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 11 – Conditions d'inscription</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>L'inscription est ouverte à toute personne majeure juridiquement capable.</p>
            <p>Pour les vendeurs professionnels, des documents justificatifs peuvent être exigés.</p>
          </div>
        </article>

        <article id="creation-compte" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 12 – Création de compte</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>L'utilisateur s'engage à fournir des informations exactes et à maintenir leur mise à jour.</p>
            <p>Chaque utilisateur est responsable de la confidentialité de ses identifiants.</p>
          </div>
        </article>

        <article id="inscription-vendeurs" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 13 – Inscription des vendeurs</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>Les vendeurs doivent :</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Détenir les droits sur les produits proposés</li>
              <li>Respecter la réglementation commerciale et fiscale applicable</li>
              <li>Garantir la conformité et la qualité des produits</li>
            </ul>
            <p class="text-sm text-gray-500">Uber-Market se réserve le droit de refuser ou suspendre un vendeur.</p>
          </div>
        </article>

        <article id="tarification" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 14 – Tarification et Commissions</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>L'inscription peut être gratuite ou payante selon les offres.</p>
            <p>Uber-Market peut percevoir :</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Des frais d'abonnement</li>
              <li>Des commissions sur ventes</li>
              <li>Des frais pour services additionnels</li>
            </ul>
            <p class="text-sm text-gray-500">Les conditions tarifaires sont précisées sur la plateforme.</p>
          </div>
        </article>

        <article id="engagements-vendeur" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 15 – Engagements du vendeur</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>Le vendeur s'engage à :</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Honorer les commandes</li>
              <li>Assurer le service après-vente</li>
              <li>Respecter les délais de livraison</li>
              <li>Gérer les litiges avec les acheteurs</li>
            </ul>
          </div>
        </article>

        <article id="resiliation-compte" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 16 – Résiliation du compte</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>L'utilisateur peut résilier son compte à tout moment.</p>
            <p>Uber-Market peut résilier un compte en cas de manquement grave.</p>
          </div>
        </article>

        <article id="modification" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 17 – Modification des CGU / CGI</h3>
          <div class="text-gray-600 leading-relaxed space-y-3">
            <p>Uber-Market se réserve le droit de modifier les présentes conditions.</p>
            <p>Les utilisateurs seront informés par tout moyen approprié.</p>
          </div>
        </article>

        <article id="acceptation" class="mb-8">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Article 18 – Acceptation</h3>
          <p class="text-gray-600 leading-relaxed">L'inscription et l'utilisation de la plateforme valent acceptation expresse des présentes CGU et CGI.</p>
        </article>
      </section>
    </main>

    <!-- Footer (même que landing page) -->
    <footer class="px-4 md:px-16 lg:px-24 xl:px-32 border-t border-gray-200">
      <div class="border-x border-gray-200 px-4 md:px-12 max-w-7xl mx-auto pt-16">
        <div class="flex flex-col md:flex-row items-start justify-between gap-8 p-8 md:p-12 bg-gradient-to-t from-primary/10 to-primary/5 rounded-t-2xl">
          <div class="max-w-72">
            <img alt="Logo" class="h-9" src="/uber-market.png">
            <p class="text-zinc-500 mt-4 pb-6">La plateforme e-commerce la plus simple pour lancer votre boutique en ligne.</p>
          </div>
          <div>
            <p class="uppercase font-semibold text-primary text-sm">Réseaux sociaux</p>
            <div class="flex flex-col mt-4 gap-2">
              <a href="#" class="flex items-center gap-2 text-primary hover:opacity-70 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                Twitter
              </a>
              <a href="#" class="flex items-center gap-2 text-primary hover:opacity-70 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                Instagram
              </a>
              <a href="mailto:contact@uber-market.com" class="flex items-center gap-2 text-primary hover:opacity-70 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                Email
              </a>
            </div>
          </div>
          <div>
            <p class="uppercase font-semibold text-primary text-sm">Légal</p>
            <div class="flex flex-col mt-4 gap-2">
              <NuxtLink to="/conditions" class="flex items-center gap-2 text-primary hover:opacity-70 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                CGU & CGI
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="py-6 text-center text-sm text-gray-500">
          © {{ new Date().getFullYear() }} Uber-Market. Tous droits réservés.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Conditions Générales - Uber-Market',
  meta: [{ name: 'description', content: 'Conditions générales d\'utilisation et d\'inscription de la plateforme Uber-Market.' }],
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap' }]
})

const mobileMenuOpen = ref(false)
const toggleMobileMenu = () => { mobileMenuOpen.value = !mobileMenuOpen.value }
const closeMobileMenu = () => { mobileMenuOpen.value = false }

const lastUpdate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
})

const sections = [
  { id: 'cgu', title: 'Partie I – CGU' },
  { id: 'definitions', title: '1. Définitions' },
  { id: 'objet', title: '2. Objet des CGU' },
  { id: 'acces', title: '3. Accès à la plateforme' },
  { id: 'services', title: '4. Services proposés' },
  { id: 'responsabilite', title: '5. Responsabilité' },
  { id: 'obligations', title: '6. Obligations des utilisateurs' },
  { id: 'propriete', title: '7. Propriété intellectuelle' },
  { id: 'donnees', title: '8. Données personnelles' },
  { id: 'suspension', title: '9. Suspension / Résiliation' },
  { id: 'droit', title: '10. Droit applicable et Litiges' },
  { id: 'cgi', title: 'Partie II – CGI' },
  { id: 'conditions-inscription', title: '11. Conditions d\'inscription' },
  { id: 'creation-compte', title: '12. Création de compte' },
  { id: 'inscription-vendeurs', title: '13. Inscription des vendeurs' },
  { id: 'tarification', title: '14. Tarification et Commissions' },
  { id: 'engagements-vendeur', title: '15. Engagements du vendeur' },
  { id: 'resiliation-compte', title: '16. Résiliation du compte' },
  { id: 'modification', title: '17. Modification des CGU / CGI' },
  { id: 'acceptation', title: '18. Acceptation' }
]
</script>

<style scoped>
html { scroll-behavior: smooth; }
.landing-page { --color-primary: #5B6AC5; }
.font-urbanist { font-family: 'Urbanist', sans-serif; }
.text-primary { color: var(--color-primary); }
.bg-primary { background-color: var(--color-primary); }
.bg-primary\/10 { background-color: rgba(91, 106, 197, 0.1); }
.bg-primary\/5 { background-color: rgba(91, 106, 197, 0.05); }
.from-primary\/10 { --tw-gradient-from: rgba(91, 106, 197, 0.1); }
.to-primary\/5 { --tw-gradient-to: rgba(91, 106, 197, 0.05); }
.size-6 { width: 1.5rem; height: 1.5rem; }
.h-72 { height: 18rem; }
</style>
