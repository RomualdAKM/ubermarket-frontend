<template>
  <!--
    pages/dashboard-vendor/[slug]/customizations/personnalisation.vue
    ──────────────────────────────────────────────────────────────────
    Dashboard vendeur — Page de personnalisation de la boutique.

    ONGLETS STANDARDS (tous les thèmes) :
      Thème · Page d'accueil · À propos · CGU · CGV · Pied de page · Couleurs · Police

    ONGLETS DYNAMIQUES (selon les capacités du thème actif) :
      ✅ Produits vedettes  → theme.features.includes('featured_products')
      ✅ Newsletter         → theme.features.includes('newsletter')
      ✅ Livraison          → theme.features.includes('delivery_page')
      ✅ Contact            → theme.features.includes('contact_page')
      ✅ Avis clients       → theme.features.includes('reviews')

    Les onglets dynamiques sont injectés automatiquement en fonction
    du thème activé — le vendeur ne voit que les sections pertinentes.

    MODIFICATIONS PROJET PRISES EN COMPTE :
      - ShopController::update() résout theme_id par slug ou id
      - Relation theme chargée via GET /shops/{slug} (pas le cache useShops)
      - currentThemeSlug synchronisé depuis l'API directement au onMounted
      - viewportStyleObj = objet (pas string CSS) pour l'aperçu iframe
      - Toast local déclaré : toastMessage/toastType/toastVisible/showToast()
      - Booléens FormData envoyés en '1'/'0' (pas true/false)
  -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- ══════════════════════════════════════════════════
         EN-TÊTE
         ══════════════════════════════════════════════════ -->
    <div class="flex items-center justify-between flex-wrap gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Personnalisation de la boutique</h1>
        <p class="text-sm text-gray-500 mt-1">
          Thème actif :
          <span class="font-semibold" :style="{ color: currentShopData?.theme?.primary_color || '#5B6AC5' }">
            {{ currentThemeLabel }}
          </span>
        </p>
      </div>
      <!-- Bouton aperçu -->
      <a v-if="previewUrl" :href="previewUrl" target="_blank"
        class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        Aperçu
      </a>
    </div>

    <!-- ══════════════════════════════════════════════════
         TOAST NOTIFICATION LOCAL
         ══════════════════════════════════════════════════ -->
    <Transition name="slide-fade">
      <div v-if="toastVisible"
        class="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium"
        :class="toastType === 'success' ? 'bg-green-600' : 'bg-red-600'">
        <svg v-if="toastType === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ toastMessage }}
      </div>
    </Transition>

    <div class="flex flex-col lg:flex-row gap-8">

      <!-- ══════════════════════════════════════════════════
           SIDEBAR — Onglets de navigation
           ══════════════════════════════════════════════════ -->
      <aside class="lg:w-56 flex-shrink-0">
        <nav class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <!-- Onglets standard — présents pour tous les thèmes -->
          <div class="p-3 space-y-1">
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-2">
              Standard
            </p>
            <button v-for="tab in standardTabs" :key="tab.key"
              @click="activeTab = tab.key"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              :class="activeTab === tab.key
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'">
              <span>{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          </div>

          <!-- Onglets dynamiques selon les capacités du thème actif -->
          <div v-if="dynamicTabs.length > 0" class="p-3 space-y-1 border-t border-gray-100">
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-2">
              Options du thème
            </p>
            <button v-for="tab in dynamicTabs" :key="tab.key"
              @click="activeTab = tab.key"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              :class="activeTab === tab.key
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'">
              <span>{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          </div>
        </nav>
      </aside>

      <!-- ══════════════════════════════════════════════════
           ZONE PRINCIPALE — Contenu de l'onglet actif
           ══════════════════════════════════════════════════ -->
      <div class="flex-1 min-w-0">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <!-- ─────────────────────────────────────────────
               ONGLET : THÈME (sélection et activation)
               ───────────────────────────────────────────── -->
          <div v-if="activeTab === 'theme'" class="p-6 md:p-8">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Choisir un thème</h2>
            <p class="text-sm text-gray-500 mb-6">
              Cliquez sur un thème pour le prévisualiser, puis activez-le.
            </p>

            <!-- Chargement -->
            <div v-if="loadingThemes" class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>

            <div v-else class="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <div v-for="theme in allThemes" :key="theme.id"
                class="border-2 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-md"
                :class="currentThemeSlug === theme.slug
                  ? 'border-indigo-500 shadow-indigo-100 shadow-md'
                  : 'border-gray-100'"
                @click="previewTheme(theme)">

                <!-- Aperçu image du thème -->
                <div class="relative aspect-video bg-gray-100 overflow-hidden">
                  <img v-if="theme.preview_image" :src="theme.preview_image" :alt="theme.name"
                    class="w-full h-full object-cover"/>
                  <div v-else class="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-50 to-gray-200">
                    🎨
                  </div>
                  <!-- Badge "Actif" -->
                  <div v-if="currentThemeSlug === theme.slug"
                    class="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✓ Actif
                  </div>
                  <!-- Badge "Payant" -->
                  <div v-if="theme.price > 0"
                    class="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Premium
                  </div>
                </div>

                <!-- Infos thème -->
                <div class="p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-gray-900">{{ theme.name }}</h3>
                    <span v-if="theme.price > 0" class="text-xs font-bold text-amber-600">
                      {{ theme.price.toLocaleString() }} XOF/mois
                    </span>
                    <span v-else class="text-xs font-medium text-green-600">Gratuit</span>
                  </div>
                  <p class="text-xs text-gray-500 leading-relaxed mb-4">{{ theme.description }}</p>

                  <!-- Bouton Activer -->
                  <button
                    v-if="currentThemeSlug !== theme.slug"
                    @click.stop="confirmActivate(theme)"
                    class="w-full py-2 text-sm font-semibold rounded-xl border-2 transition-all hover:bg-indigo-50"
                    :class="activatingTheme === theme.slug ? 'border-indigo-300 text-indigo-400' : 'border-indigo-200 text-indigo-600'">
                    {{ activatingTheme === theme.slug ? 'Activation...' : 'Activer ce thème' }}
                  </button>
                  <div v-else class="w-full py-2 text-sm font-semibold text-center text-green-700 bg-green-50 rounded-xl">
                    ✓ Thème actif
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal confirmation activation thème payant -->
            <Teleport to="body">
              <div v-if="showConfirmModal"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                  <h3 class="text-lg font-bold text-gray-900 mb-2">Thème payant</h3>
                  <p class="text-sm text-gray-600 mb-5">
                    Le thème <strong>{{ pendingTheme?.name }}</strong> nécessite un abonnement
                    supplémentaire de <strong>{{ pendingTheme?.price?.toLocaleString() }} XOF/mois</strong>.
                    Voulez-vous continuer ?
                  </p>
                  <div class="flex gap-3">
                    <button @click="showConfirmModal = false"
                      class="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm">
                      Annuler
                    </button>
                    <button @click="activateTheme(pendingTheme)"
                      class="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-semibold">
                      Continuer
                    </button>
                  </div>
                </div>
              </div>
            </Teleport>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET : PAGE D'ACCUEIL
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'home'" class="p-6 md:p-8 space-y-6">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Page d'accueil</h2>
            <p class="text-sm text-gray-500 mb-6">Configurez le contenu affiché sur la page d'accueil de votre boutique.</p>

            <!-- Bannière principale -->
            <div>
              <h3 class="text-sm font-semibold text-gray-700 mb-4">Bannière principale</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Titre</label>
                  <input v-model="form.home.banner.title" type="text"
                    placeholder="Ex : Produits frais & naturels"
                    class="input-field"/>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Sous-titre</label>
                  <textarea v-model="form.home.banner.subtitle" rows="2"
                    placeholder="Décrivez votre boutique en une phrase..."
                    class="input-field resize-none"/>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Texte du bouton</label>
                  <input v-model="form.home.banner.button_text" type="text"
                    placeholder="Ex : Découvrir notre boutique"
                    class="input-field"/>
                </div>

                <!-- Images bannière -->
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-2">
                    Images du slider (max 3 images)
                  </label>
                  <div class="flex gap-3 flex-wrap">
                    <div v-for="(img, i) in form.home.banner.images" :key="i"
                      class="relative w-28 h-20 rounded-xl overflow-hidden border border-gray-200 group">
                      <img :src="img" class="w-full h-full object-cover"/>
                      <button @click="removeBannerImage(i)"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </button>
                    </div>
                    <label v-if="form.home.banner.images.length < 3"
                      class="w-28 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      <span class="text-xs text-gray-400 mt-1">Ajouter</span>
                      <input type="file" accept="image/*" class="sr-only" @change="uploadBannerImage"/>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button @click="save('home')" :disabled="saving"
              class="save-btn">
              {{ saving ? 'Enregistrement...' : '💾 Enregistrer la page d\'accueil' }}
            </button>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET : À PROPOS
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'about'" class="p-6 md:p-8 space-y-5">
            <h2 class="text-lg font-bold text-gray-900 mb-1">À propos</h2>
            <p class="text-sm text-gray-500 mb-6">Racontez l'histoire de votre boutique.</p>

            <div>
              <label class="label-field">Titre de la section</label>
              <input v-model="form.about.title" type="text"
                placeholder="Ex : Notre histoire" class="input-field"/>
            </div>
            <div>
              <label class="label-field">Sous-titre</label>
              <input v-model="form.about.subtitle" type="text"
                placeholder="Une phrase accroche..." class="input-field"/>
            </div>
            <div>
              <label class="label-field">Texte principal</label>
              <textarea v-model="form.about.text" rows="6"
                placeholder="Décrivez votre boutique, vos valeurs, votre histoire..."
                class="input-field resize-none"/>
            </div>
            <div>
              <label class="label-field">Image principale</label>
              <div class="flex items-center gap-4">
                <div v-if="form.about.image"
                  class="w-24 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                  <img :src="getImageUrl(form.about.image)" class="w-full h-full object-cover"/>
                </div>
                <label class="cursor-pointer px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-indigo-400 transition-colors">
                  {{ form.about.image ? 'Changer l\'image' : 'Choisir une image' }}
                  <input type="file" accept="image/*" class="sr-only" @change="(e) => uploadImage(e, 'about.image')"/>
                </label>
              </div>
            </div>

            <!-- Points clés -->
            <div>
              <label class="label-field">Points forts (un par ligne)</label>
              <textarea v-model="keyPointsText" rows="4"
                placeholder="100% naturel&#10;Producteurs locaux&#10;Livraison rapide"
                class="input-field resize-none"/>
            </div>

            <!-- Statistiques -->
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="label-field">Clients</label>
                <input v-model.number="form.about.stats.clients" type="number"
                  placeholder="500" class="input-field"/>
              </div>
              <div>
                <label class="label-field">Années</label>
                <input v-model.number="form.about.stats.years" type="number"
                  placeholder="2" class="input-field"/>
              </div>
              <div>
                <label class="label-field">Commandes</label>
                <input v-model.number="form.about.stats.orders" type="number"
                  placeholder="1000" class="input-field"/>
              </div>
            </div>

            <button @click="save('about')" :disabled="saving" class="save-btn">
              {{ saving ? 'Enregistrement...' : '💾 Enregistrer À propos' }}
            </button>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET : COULEURS
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'colors'" class="p-6 md:p-8 space-y-5">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Couleurs</h2>
            <p class="text-sm text-gray-500 mb-6">Personnalisez la palette de couleurs de votre boutique.</p>

            <div class="grid sm:grid-cols-2 gap-5">
              <div v-for="color in colorFields" :key="color.key">
                <label class="label-field">{{ color.label }}</label>
                <div class="flex items-center gap-3">
                  <input type="color"
                    :value="form.home.colors[color.key]"
                    @input="(e) => form.home.colors[color.key] = (e.target as HTMLInputElement).value"
                    class="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"/>
                  <input type="text"
                    :value="form.home.colors[color.key]"
                    @input="(e) => form.home.colors[color.key] = (e.target as HTMLInputElement).value"
                    class="input-field flex-1 font-mono text-sm uppercase"
                    placeholder="#2d9b5c" maxlength="7"/>
                </div>
              </div>
            </div>

            <!-- Aperçu palette -->
            <div class="flex gap-3 mt-4">
              <div v-for="color in colorFields" :key="color.key"
                class="flex-1 h-12 rounded-xl border border-gray-200"
                :style="{ backgroundColor: form.home.colors[color.key] }"
                :title="color.label">
              </div>
            </div>

            <button @click="save('colors')" :disabled="saving" class="save-btn">
              {{ saving ? 'Enregistrement...' : '💾 Enregistrer les couleurs' }}
            </button>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET : POLICE
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'fonts'" class="p-6 md:p-8 space-y-5">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Police de caractères</h2>

            <div class="grid sm:grid-cols-2 gap-4">
              <div v-for="font in fontOptions" :key="font.value"
                @click="form.home.fonts.family = font.value"
                class="border-2 rounded-xl p-4 cursor-pointer transition-all"
                :class="form.home.fonts.family === font.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-100 hover:border-gray-300'">
                <p class="font-semibold text-sm text-gray-900 mb-1">{{ font.label }}</p>
                <p class="text-gray-500 text-sm" :style="{ fontFamily: font.value }">
                  Aperçu de la police — Abc 123
                </p>
              </div>
            </div>

            <button @click="save('fonts')" :disabled="saving" class="save-btn">
              {{ saving ? 'Enregistrement...' : '💾 Enregistrer la police' }}
            </button>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET : CGU
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'cgu'" class="p-6 md:p-8 space-y-5">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Conditions Générales d'Utilisation</h2>
            <p class="text-sm text-gray-500 mb-4">Ce contenu est affiché sur la page /cgu de votre boutique.</p>

            <div>
              <label class="label-field">Titre de la page</label>
              <input v-model="form.cgu.title" type="text"
                placeholder="Conditions Générales d'Utilisation" class="input-field"/>
            </div>
            <div>
              <label class="label-field">Contenu (HTML autorisé)</label>
              <RichEditor v-model="form.cgu.content" />
            </div>

            <button @click="save('cgu')" :disabled="saving" class="save-btn">
              {{ saving ? 'Enregistrement...' : '💾 Enregistrer les CGU' }}
            </button>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET : CGV
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'cgv'" class="p-6 md:p-8 space-y-5">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Conditions Générales de Vente</h2>
            <p class="text-sm text-gray-500 mb-4">Ce contenu est affiché sur la page /cgv de votre boutique.</p>

            <div>
              <label class="label-field">Titre de la page</label>
              <input v-model="form.cgv.title" type="text"
                placeholder="Conditions Générales de Vente" class="input-field"/>
            </div>
            <div>
              <label class="label-field">Contenu (HTML autorisé)</label>
              <RichEditor v-model="form.cgv.content" />
            </div>

            <button @click="save('cgv')" :disabled="saving" class="save-btn">
              {{ saving ? 'Enregistrement...' : '💾 Enregistrer les CGV' }}
            </button>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET : PIED DE PAGE
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'footer'" class="p-6 md:p-8 space-y-5">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Pied de page</h2>

            <div>
              <label class="label-field">Texte du pied de page</label>
              <textarea v-model="form.footer.text" rows="3"
                placeholder="© 2025 Ma Boutique. Tous droits réservés."
                class="input-field resize-none"/>
            </div>

            <div class="space-y-4">
              <p class="text-sm font-semibold text-gray-700">Réseaux sociaux</p>
              <div v-for="social in socialFields" :key="social.key">
                <label class="label-field">{{ social.label }}</label>
                <input v-model="form.footer.socialLinks[social.key]" type="url"
                  :placeholder="social.placeholder" class="input-field"/>
              </div>
            </div>

            <button @click="save('footer')" :disabled="saving" class="save-btn">
              {{ saving ? 'Enregistrement...' : '💾 Enregistrer le pied de page' }}
            </button>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET DYNAMIQUE : PRODUITS VEDETTES
               Affiché uniquement si le thème supporte cette fonctionnalité.
               Le vendeur sélectionne ses produits mis en avant.
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'featured'" class="p-6 md:p-8 space-y-5">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Produits vedettes</h2>
            <p class="text-sm text-gray-500 mb-6">
              Sélectionnez jusqu'à <strong>10 produits</strong> à mettre en avant sur la page d'accueil.
              Les produits non sélectionnés resteront visibles dans la liste complète.
            </p>

            <!-- Produits déjà sélectionnés -->
            <div v-if="form.home.featured_products.length > 0">
              <p class="label-field mb-3">
                Sélectionnés ({{ form.home.featured_products.length }}/10)
              </p>
              <div class="flex flex-wrap gap-2 mb-5">
                <div v-for="id in form.home.featured_products" :key="id"
                  class="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-sm">
                  <span class="font-medium text-indigo-800 max-w-[140px] truncate">
                    {{ getProductName(id) }}
                  </span>
                  <button @click="removeFeatured(id)"
                    class="text-indigo-400 hover:text-red-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Liste de tous les produits de la boutique -->
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <input v-model="featuredSearch" type="text"
                  placeholder="Rechercher un produit..."
                  class="w-full text-sm focus:outline-none bg-transparent"/>
              </div>
              <div class="max-h-80 overflow-y-auto divide-y divide-gray-100">
                <div v-if="filteredShopProducts.length === 0"
                  class="py-8 text-center text-sm text-gray-400">
                  Aucun produit trouvé
                </div>
                <label v-for="product in filteredShopProducts" :key="product.id"
                  class="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input type="checkbox"
                    :checked="form.home.featured_products.includes(product.id)"
                    @change="toggleFeatured(product.id)"
                    :disabled="!form.home.featured_products.includes(product.id) && form.home.featured_products.length >= 10"
                    class="rounded border-gray-300 text-indigo-600"/>
                  <!-- Miniature -->
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img v-if="product.preview_image"
                      :src="getImageUrl(product.preview_image)"
                      :alt="product.name"
                      class="w-full h-full object-cover"/>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
                    <p class="text-xs text-gray-400">
                      {{ product.subcategory?.name }} · {{ formatPrice(product.price) }}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <button @click="save('featured')" :disabled="saving" class="save-btn">
              {{ saving ? 'Enregistrement...' : '💾 Enregistrer les produits vedettes' }}
            </button>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET DYNAMIQUE : NEWSLETTER
               Affiché uniquement si le thème supporte la newsletter.
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'newsletter'" class="p-6 md:p-8 space-y-5">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h2 class="text-lg font-bold text-gray-900">Newsletter</h2>
                <p class="text-sm text-gray-500 mt-1">
                  Configurez la section newsletter affichée sur votre boutique.
                </p>
              </div>
              <!-- Toggle activer/désactiver -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">
                  {{ form.newsletter.enabled ? 'Activée' : 'Désactivée' }}
                </span>
                <button @click="form.newsletter.enabled = !form.newsletter.enabled"
                  class="relative w-11 h-6 rounded-full transition-colors"
                  :class="form.newsletter.enabled ? 'bg-indigo-600' : 'bg-gray-200'">
                  <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                    :class="form.newsletter.enabled ? 'translate-x-5' : 'translate-x-0'"></span>
                </button>
              </div>
            </div>

            <div :class="{ 'opacity-40 pointer-events-none': !form.newsletter.enabled }">
              <div>
                <label class="label-field">Titre de la section</label>
                <input v-model="form.newsletter.title" type="text"
                  placeholder="Restez informé(e)" class="input-field"/>
              </div>
              <div class="mt-4">
                <label class="label-field">Sous-titre</label>
                <input v-model="form.newsletter.subtitle" type="text"
                  placeholder="Recevez nos offres exclusives..." class="input-field"/>
              </div>
              <div class="mt-4">
                <label class="label-field">Email de réception des abonnés</label>
                <input v-model="form.newsletter.recipient_email" type="email"
                  placeholder="monmail@email.com" class="input-field"/>
                <p class="text-xs text-gray-400 mt-1">
                  Vous recevrez un email à chaque nouvelle inscription à la newsletter.
                </p>
              </div>

              <!-- Statistiques abonnés -->
              <div class="mt-5 grid grid-cols-2 gap-4">
                <div class="bg-indigo-50 rounded-xl p-4 text-center">
                  <p class="text-2xl font-bold text-indigo-700">{{ subscribersCount }}</p>
                  <p class="text-xs text-indigo-500 mt-1">Abonnés actifs</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4 text-center">
                  <p class="text-2xl font-bold text-gray-700">{{ lastSubscriberDate || '—' }}</p>
                  <p class="text-xs text-gray-500 mt-1">Dernier abonné</p>
                </div>
              </div>
            </div>

            <button @click="save('newsletter')" :disabled="saving" class="save-btn">
              {{ saving ? 'Enregistrement...' : '💾 Enregistrer la newsletter' }}
            </button>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET DYNAMIQUE : LIVRAISON & RETOURS
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'delivery'" class="p-6 md:p-8 space-y-5">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Livraison & Retours</h2>
            <p class="text-sm text-gray-500 mb-6">
              Configurez les informations affichées sur la page Livraison de votre boutique.
            </p>

            <div>
              <label class="label-field">Titre de la page</label>
              <input v-model="form.livraison.title" type="text"
                placeholder="Livraison & Retours" class="input-field"/>
            </div>
            <div>
              <label class="label-field">Sous-titre</label>
              <input v-model="form.livraison.subtitle" type="text"
                placeholder="Toutes les informations sur nos livraisons..." class="input-field"/>
            </div>

            <!-- Seuil livraison gratuite -->
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="label-field">
                  Seuil livraison gratuite ({{ currentShopData?.currency || 'XOF' }})
                </label>
                <input v-model.number="form.livraison.free_threshold_amount" type="number"
                  placeholder="25000" class="input-field"/>
              </div>
              <div>
                <label class="label-field">
                  Frais de livraison standard ({{ currentShopData?.currency || 'XOF' }})
                </label>
                <input v-model.number="form.livraison.delivery_fee" type="number"
                  placeholder="1000" class="input-field"/>
              </div>
            </div>

            <div>
              <label class="label-field">Contenu détaillé (HTML autorisé)</label>
              <RichEditor v-model="form.livraison.content" />
              <p class="text-xs text-gray-400 mt-1">
                Si vide, un contenu générique avec vos tarifs sera affiché.
              </p>
            </div>

            <button @click="save('livraison')" :disabled="saving" class="save-btn">
              {{ saving ? 'Enregistrement...' : '💾 Enregistrer Livraison' }}
            </button>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET DYNAMIQUE : CONTACT
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'contact'" class="p-6 md:p-8 space-y-5">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h2 class="text-lg font-bold text-gray-900">Page Contact</h2>
                <p class="text-sm text-gray-500 mt-1">
                  Configurez le formulaire de contact visible par vos clients.
                </p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">
                  {{ form.contact.enabled ? 'Activé' : 'Désactivé' }}
                </span>
                <button @click="form.contact.enabled = !form.contact.enabled"
                  class="relative w-11 h-6 rounded-full transition-colors"
                  :class="form.contact.enabled ? 'bg-indigo-600' : 'bg-gray-200'">
                  <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                    :class="form.contact.enabled ? 'translate-x-5' : 'translate-x-0'"></span>
                </button>
              </div>
            </div>

            <div :class="{ 'opacity-40 pointer-events-none': !form.contact.enabled }">
              <div>
                <label class="label-field">Titre de la page</label>
                <input v-model="form.contact.title" type="text"
                  placeholder="Une question ? Contactez-nous" class="input-field"/>
              </div>
              <div class="mt-4">
                <label class="label-field">Sous-titre</label>
                <input v-model="form.contact.subtitle" type="text"
                  placeholder="Notre équipe vous répond dans les 24h..." class="input-field"/>
              </div>
              <div class="mt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="label-field">Email affiché</label>
                  <input v-model="form.contact.email" type="email"
                    placeholder="contact@maboutique.com" class="input-field"/>
                </div>
                <div>
                  <label class="label-field">Téléphone affiché</label>
                  <input v-model="form.contact.phone" type="tel"
                    placeholder="+229 90 00 00 00" class="input-field"/>
                </div>
                <div>
                  <label class="label-field">Adresse physique</label>
                  <input v-model="form.contact.address" type="text"
                    placeholder="Rue 123, Cotonou, Bénin" class="input-field"/>
                </div>
                <div>
                  <label class="label-field">Horaires d'ouverture</label>
                  <input v-model="form.contact.hours" type="text"
                    placeholder="Lun-Sam : 8h - 18h" class="input-field"/>
                </div>
              </div>
            </div>

            <button @click="save('contact')" :disabled="saving" class="save-btn">
              {{ saving ? 'Enregistrement...' : '💾 Enregistrer Contact' }}
            </button>
          </div>

          <!-- ─────────────────────────────────────────────
               ONGLET DYNAMIQUE : AVIS CLIENTS
               Affiche les avis soumis, le vendeur peut les approuver/rejeter.
               ───────────────────────────────────────────── -->
          <div v-else-if="activeTab === 'reviews'" class="p-6 md:p-8 space-y-5">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Avis clients</h2>
            <p class="text-sm text-gray-500 mb-6">
              Approuvez les avis clients à afficher sur vos fiches produit.
              Seuls les avis approuvés sont visibles par les acheteurs.
            </p>

            <!-- Stats avis -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-amber-50 rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-amber-700">{{ pendingReviews.length }}</p>
                <p class="text-xs text-amber-600 mt-1">En attente</p>
              </div>
              <div class="bg-green-50 rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-green-700">{{ approvedReviews.length }}</p>
                <p class="text-xs text-green-600 mt-1">Approuvés</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-gray-700">{{ allReviews.length }}</p>
                <p class="text-xs text-gray-500 mt-1">Total</p>
              </div>
            </div>

            <!-- Filtre statut -->
            <div class="flex gap-2 mb-4">
              <button v-for="f in ['all','pending','approved']" :key="f"
                @click="reviewFilter = f"
                class="px-3 py-1.5 text-xs font-medium rounded-full transition-colors"
                :class="reviewFilter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                {{ f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : 'Approuvés' }}
              </button>
            </div>

            <!-- Liste des avis -->
            <div v-if="filteredReviews.length === 0" class="text-center py-8 text-gray-400">
              <span class="text-3xl block mb-2">⭐</span>
              <p class="text-sm">Aucun avis dans cette catégorie.</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="review in filteredReviews" :key="review.id"
                class="border border-gray-100 rounded-xl p-4">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <p class="font-semibold text-sm text-gray-900">{{ review.client_name || 'Client' }}</p>
                      <div class="flex">
                        <span v-for="s in 5" :key="s"
                          class="text-sm"
                          :class="s <= review.rating ? 'text-amber-400' : 'text-gray-200'">★</span>
                      </div>
                    </div>
                    <p class="text-xs text-gray-400 mb-2">
                      {{ review.product?.name }} · {{ formatDate(review.created_at) }}
                    </p>
                    <p class="text-sm text-gray-600">{{ review.comment }}</p>
                  </div>
                  <!-- Actions -->
                  <div class="flex gap-2 flex-shrink-0">
                    <button v-if="!review.is_approved"
                      @click="approveReview(review)"
                      class="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors">
                      ✓ Approuver
                    </button>
                    <button @click="deleteReview(review)"
                      class="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors">
                      Supprimer
                    </button>
                  </div>
                </div>
                <!-- Badge statut -->
                <div class="mt-3">
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    :class="review.is_approved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'">
                    {{ review.is_approved ? '✓ Publié' : '⏳ En attente' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { ref, reactive, computed, onMounted, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    // ── Méta page ────────────────────────────────────────────────────
    definePageMeta({ layout: 'dashboard' })

    const route   = useRoute()
    const router  = useRouter()
    const config  = useRuntimeConfig()
    const { token } = useAuth()

    // Le slug de la boutique vient du paramètre de route
    const shopSlug = route.params.slug as string

    // ════════════════════════════════════════════════════════════════
    // ÉTAT PRINCIPAL
    // ════════════════════════════════════════════════════════════════
    const activeTab      = ref('theme')
    const saving         = ref(false)
    const loadingThemes  = ref(true)
    const currentShopData = ref<any>(null)
    const allThemes       = ref<any[]>([])

    // ── currentThemeSlug : chargé depuis l'API directement ───────────
    // Ne pas utiliser useShops() ici car le cache ne reflète pas toujours
    // le thème le plus récemment activé.
    const currentThemeSlug = ref<string | null>(null)

    const currentThemeLabel = computed(() => {
    if (!currentThemeSlug.value) return 'Aucun thème sélectionné'
    const t = allThemes.value.find(t => t.slug === currentThemeSlug.value)
    return t ? t.name : currentThemeSlug.value
    })

    // ── URL d'aperçu (utilise le subdomain réel de la boutique) ──────
    // CORRECTION : on utilise currentShopData.value.subdomain
    // (pas shopSlug qui est le slug du dashboard, différent du subdomain boutique)
    const previewUrl = computed(() => {
    if (!currentThemeSlug.value || !currentShopData.value?.subdomain) return ''
    const base = config.public.siteUrl || (process.client ? window.location.origin : 'http://localhost:3000')
    return `${base}/boutique/${currentShopData.value.subdomain}?preview_theme=${currentThemeSlug.value}`
    })

    // ── Toast local ──────────────────────────────────────────────────
    const toastMessage = ref('')
    const toastType    = ref<'success' | 'error'>('success')
    const toastVisible = ref(false)

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value    = type
    toastVisible.value = true
    setTimeout(() => { toastVisible.value = false }, 3500)
    }

    // ════════════════════════════════════════════════════════════════
    // FORMULAIRE DE PERSONNALISATION (mirrors customizations structure)
    // ════════════════════════════════════════════════════════════════
    const form = reactive({
    home: {
        banner: { title: '', subtitle: '', button_text: '', images: [] as string[] },
        colors: { primary: '#2d9b5c', secondary: '#f4a261', background: '#ffffff', text: '#111827' },
        fonts:  { family: 'sans-serif' },
        featured_products: [] as number[], // IDs des produits vedettes (onglet dynamique)
    },
    about: {
        title: '', subtitle: '', text: '', image: '',
        key_points: [] as string[],
        stats: { clients: 500, years: 2, orders: 1000 }
    },
    footer: { text: '', socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '' } },
    cgu:     { title: '', content: '', updated_at: '' },
    cgv:     { title: '', content: '', updated_at: '' },
    livraison: {
        title: '', subtitle: '', content: '',
        free_threshold_amount: 25000, delivery_fee: 1000
    },
    newsletter: { enabled: true, title: '', subtitle: '', recipient_email: '' },
    contact: {
        enabled: true, title: '', subtitle: '',
        email: '', phone: '', address: '', hours: ''
    },
    })

    // ── Texte des points clés À propos (textarea → array) ─────────────
    const keyPointsText = computed({
    get: () => form.about.key_points.join('\n'),
    set: (val) => { form.about.key_points = val.split('\n').filter(Boolean) }
    })

    // ════════════════════════════════════════════════════════════════
    // ONGLETS STANDARDS — toujours affichés
    // ════════════════════════════════════════════════════════════════
    const standardTabs = [
    { key: 'theme',  icon: '🎨', label: 'Thème' },
    { key: 'home',   icon: '🏠', label: 'Page d\'accueil' },
    { key: 'about',  icon: '📖', label: 'À propos' },
    { key: 'colors', icon: '🎨', label: 'Couleurs' },
    { key: 'fonts',  icon: '✒️', label: 'Police' },
    { key: 'cgu',    icon: '📜', label: 'CGU' },
    { key: 'cgv',    icon: '📋', label: 'CGV' },
    { key: 'footer', icon: '🔻', label: 'Pied de page' },
    ]

    // ════════════════════════════════════════════════════════════════
    // ONGLETS DYNAMIQUES — selon les capacités du thème actif
    // Chaque thème déclare ses fonctionnalités via theme.features[]
    // Exemple : ['featured_products', 'newsletter', 'delivery_page', 'contact_page', 'reviews']
    // ════════════════════════════════════════════════════════════════
    const activeThemeFeatures = computed((): string[] => {
    const theme = allThemes.value.find(t => t.slug === currentThemeSlug.value)
    // Si le thème n'a pas encore de features définies, on expose tout pour le thème organic
    if (!theme?.features && currentThemeSlug.value === 'theme-organic') {
        return ['featured_products', 'newsletter', 'delivery_page', 'contact_page', 'reviews']
    }
    return theme?.features || []
    })

    const dynamicTabs = computed(() => {
    const tabs = []
    if (activeThemeFeatures.value.includes('featured_products')) {
        tabs.push({ key: 'featured',    icon: '⭐', label: 'Produits vedettes' })
    }
    if (activeThemeFeatures.value.includes('newsletter')) {
        tabs.push({ key: 'newsletter',  icon: '📩', label: 'Newsletter' })
    }
    if (activeThemeFeatures.value.includes('delivery_page')) {
        tabs.push({ key: 'delivery',    icon: '🚚', label: 'Livraison' })
    }
    if (activeThemeFeatures.value.includes('contact_page')) {
        tabs.push({ key: 'contact',     icon: '💬', label: 'Contact' })
    }
    if (activeThemeFeatures.value.includes('reviews')) {
        tabs.push({ key: 'reviews',     icon: '⭐', label: 'Avis clients' })
    }
    return tabs
    })

    // ════════════════════════════════════════════════════════════════
    // PRODUITS VEDETTES — recherche et sélection
    // ════════════════════════════════════════════════════════════════
    const featuredSearch = ref('')

    const filteredShopProducts = computed(() => {
    const products = currentShopData.value?.products || []
    if (!featuredSearch.value.trim()) return products
    const q = featuredSearch.value.toLowerCase()
    return products.filter((p: any) => p.name?.toLowerCase().includes(q))
    })

    const toggleFeatured = (productId: number) => {
    const idx = form.home.featured_products.indexOf(productId)
    if (idx >= 0) {
        form.home.featured_products.splice(idx, 1)
    } else if (form.home.featured_products.length < 10) {
        form.home.featured_products.push(productId)
    }
    }

    const removeFeatured = (productId: number) => {
    form.home.featured_products = form.home.featured_products.filter(id => id !== productId)
    }

    const getProductName = (id: number): string => {
    const p = (currentShopData.value?.products || []).find((p: any) => p.id === id)
    return p?.name || `Produit #${id}`
    }

    // ════════════════════════════════════════════════════════════════
    // GESTION DES THÈMES — activation
    // ════════════════════════════════════════════════════════════════
    const pendingTheme    = ref<any>(null)
    const activatingTheme = ref<string | null>(null)
    const showConfirmModal = ref(false)

    const previewTheme = (theme: any) => {
    // Ouvrir l'aperçu dans un nouvel onglet sans activer
    const base = config.public.siteUrl || (process.client ? window.location.origin : '')
    if (currentShopData.value?.subdomain && base) {
        window.open(`${base}/boutique/${currentShopData.value.subdomain}?preview_theme=${theme.slug}`, '_blank')
    }
    }

    const confirmActivate = (theme: any) => {
    if (theme.price > 0) {
        pendingTheme.value = theme
        showConfirmModal.value = true
    } else {
        activateTheme(theme)
    }
    }

    const activateTheme = async (theme: any) => {
    if (!theme) return
    showConfirmModal.value = false
    activatingTheme.value  = theme.slug
    try {
        // ShopController::update() résout theme_id par slug ou id
        const res  = await apiRequest(`/shops/${shopSlug}`, {
        method: 'PUT',
        body: JSON.stringify({ theme_id: theme.slug })
        })
        const data = await res.json()
        if (data.success) {
        currentThemeSlug.value = theme.slug
        showToast(`Thème "${theme.name}" activé avec succès !`, 'success')
        } else {
        showToast(data.message || 'Erreur lors de l\'activation', 'error')
        }
    } catch (err: any) {
        showToast('Erreur réseau', 'error')
    } finally {
        activatingTheme.value = null
    }
    }

    // ════════════════════════════════════════════════════════════════
    // NEWSLETTER — stats abonnés
    // ════════════════════════════════════════════════════════════════
    const subscribersCount  = ref(0)
    const lastSubscriberDate = ref('')

    // ════════════════════════════════════════════════════════════════
    // AVIS CLIENTS
    // ════════════════════════════════════════════════════════════════
    const allReviews      = ref<any[]>([])
    const reviewFilter    = ref<'all' | 'pending' | 'approved'>('all')

    const pendingReviews  = computed(() => allReviews.value.filter(r => !r.is_approved))
    const approvedReviews = computed(() => allReviews.value.filter(r => r.is_approved))

    const filteredReviews = computed(() => {
    if (reviewFilter.value === 'pending')  return pendingReviews.value
    if (reviewFilter.value === 'approved') return approvedReviews.value
    return allReviews.value
    })

    const approveReview = async (review: any) => {
    try {
        const res = await apiRequest(`/reviews/${review.id}/approve`, { method: 'POST' })
        const d   = await res.json()
        if (d.success) {
        review.is_approved = true
        showToast('Avis approuvé et publié', 'success')
        }
    } catch { showToast('Erreur', 'error') }
    }

    const deleteReview = async (review: any) => {
    if (!confirm('Supprimer définitivement cet avis ?')) return
    try {
        const res = await apiRequest(`/reviews/${review.id}`, { method: 'DELETE' })
        const d   = await res.json()
        if (d.success) {
        allReviews.value = allReviews.value.filter(r => r.id !== review.id)
        showToast('Avis supprimé', 'success')
        }
    } catch { showToast('Erreur', 'error') }
    }

    // ════════════════════════════════════════════════════════════════
    // SAUVEGARDE
    // Envoie uniquement la section modifiée (pas tout le formulaire)
    // pour éviter d'écraser des données non touchées.
    // ════════════════════════════════════════════════════════════════
    const save = async (section: string) => {
    saving.value = true
    try {
        // Préparer le payload selon la section
        let customizations: any = {}

        switch (section) {
        case 'home':
            customizations = { home: { ...form.home } }; break
        case 'featured':
            customizations = { home: { featured_products: form.home.featured_products } }; break
        case 'colors':
            customizations = { home: { colors: form.home.colors } }; break
        case 'fonts':
            customizations = { home: { fonts: form.home.fonts } }; break
        case 'about':
            customizations = { about: { ...form.about } }; break
        case 'footer':
            customizations = { footer: { ...form.footer } }; break
        case 'cgu':
            customizations = { cgu: { ...form.cgu, updated_at: new Date().toISOString() } }; break
        case 'cgv':
            customizations = { cgv: { ...form.cgv, updated_at: new Date().toISOString() } }; break
        case 'livraison':
            customizations = { livraison: { ...form.livraison } }; break
        case 'newsletter':
            customizations = { newsletter: { ...form.newsletter } }; break
        case 'contact':
            customizations = { contact: { ...form.contact } }; break
        }

        const res  = await apiRequest(`/shops/${shopSlug}/customizations`, {
        method: 'PUT',
        body: JSON.stringify({ customizations })
        })
        const data = await res.json()

        if (data.success) {
        showToast('Modifications enregistrées avec succès !', 'success')
        } else {
        showToast(data.message || 'Erreur lors de l\'enregistrement', 'error')
        }
    } catch (err: any) {
        showToast('Erreur réseau — réessayez', 'error')
    } finally {
        saving.value = false
    }
    }

    // ════════════════════════════════════════════════════════════════
    // UPLOAD D'IMAGES
    // ════════════════════════════════════════════════════════════════

    /** Upload une image et retourne son chemin storage */
    const uploadImageFile = async (file: File, folder = 'customizations'): Promise<string> => {
    const fd = new FormData()
    fd.append('image', file)
    fd.append('folder', folder)

    // RÈGLE FORMDATA : seulement Authorization dans les headers
    const res = await fetch(`${config.public.apiBase}/shops/${shopSlug}/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: fd
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    return data.path
    }

    const uploadImage = async (event: Event, path: string) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    try {
        const imagePath = await uploadImageFile(file)
        // Écrire dans le chemin imbriqué du formulaire (ex: 'about.image')
        const [section, field] = path.split('.') as [keyof typeof form, string]
        ;(form[section] as any)[field] = imagePath
    } catch (err: any) {
        showToast('Erreur upload image', 'error')
    }
    }

    const uploadBannerImage = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file || form.home.banner.images.length >= 3) return
    try {
        const path = await uploadImageFile(file, 'banners')
        form.home.banner.images.push(getImageUrl(path))
    } catch { showToast('Erreur upload bannière', 'error') }
    }

    const removeBannerImage = (index: number) => {
    form.home.banner.images.splice(index, 1)
    }

    // ════════════════════════════════════════════════════════════════
    // CHARGEMENT INITIAL
    // ════════════════════════════════════════════════════════════════
    const loadShop = async () => {
    try {
        // Appel API direct (pas le cache useShops) pour avoir theme.slug à jour
        const res  = await apiRequest(`/shops/${shopSlug}`)
        const data = await res.json()
        if (data.success) {
        currentShopData.value = data.data
        // Lire le slug du thème actif depuis la relation theme chargée
        if (data.data.theme?.slug) {
            currentThemeSlug.value = data.data.theme.slug
        } else if (data.data.theme_id) {
            // Fallback si la relation n'est pas chargée
            const theme = allThemes.value.find(t => t.id === data.data.theme_id)
            if (theme) currentThemeSlug.value = theme.slug
        }
        // Hydrater le formulaire avec les customizations existantes
        hydrateForm(data.data.customizations || {})
        }
    } catch (err) {
        console.error('loadShop error:', err)
    }
    }

    const loadThemes = async () => {
    loadingThemes.value = true
    try {
        const res  = await apiRequest('/themes')
        const data = await res.json()
        if (data.success) allThemes.value = data.data
    } catch (err) {
        console.error('loadThemes error:', err)
    } finally {
        loadingThemes.value = false
    }
    }

    const loadReviews = async () => {
    try {
        const res  = await apiRequest(`/shops/${shopSlug}/reviews`)
        const data = await res.json()
        if (data.success) allReviews.value = data.data
    } catch {}
    }

    const loadNewsletterStats = async () => {
    try {
        const res  = await apiRequest(`/shops/${shopSlug}/newsletter/stats`)
        const data = await res.json()
        if (data.success) {
        subscribersCount.value  = data.data.count || 0
        lastSubscriberDate.value = data.data.last_at
            ? new Date(data.data.last_at).toLocaleDateString('fr-FR')
            : ''
        }
    } catch {}
    }

    /** Hydrate le formulaire depuis les customizations sauvegardées */
    const hydrateForm = (customizations: any) => {
    if (customizations.home) {
        Object.assign(form.home, customizations.home)
        if (!form.home.banner)  form.home.banner = { title: '', subtitle: '', button_text: '', images: [] }
        if (!form.home.colors)  form.home.colors  = { primary: '#2d9b5c', secondary: '#f4a261', background: '#ffffff', text: '#111827' }
        if (!form.home.fonts)   form.home.fonts   = { family: 'sans-serif' }
        if (!form.home.featured_products) form.home.featured_products = []
    }
    if (customizations.about)      Object.assign(form.about,      customizations.about)
    if (customizations.footer)     Object.assign(form.footer,     customizations.footer)
    if (customizations.cgu)        Object.assign(form.cgu,        customizations.cgu)
    if (customizations.cgv)        Object.assign(form.cgv,        customizations.cgv)
    if (customizations.livraison)  Object.assign(form.livraison,  customizations.livraison)
    if (customizations.newsletter) Object.assign(form.newsletter, customizations.newsletter)
    if (customizations.contact)    Object.assign(form.contact,    customizations.contact)
    }

    onMounted(async () => {
    await loadThemes()
    await loadShop()
    await loadReviews()
    await loadNewsletterStats()
    })

    // ════════════════════════════════════════════════════════════════
    // HELPERS
    // ════════════════════════════════════════════════════════════════

    /** Helper API authentifié (headers JSON + Authorization) */
    const apiRequest = (path: string, opts: RequestInit = {}) =>
    fetch(`${config.public.apiBase}${path}`, {
        ...opts,
        headers: {
        Authorization:  `Bearer ${token.value}`,
        'Content-Type': 'application/json',
        Accept:         'application/json',
        ...(opts.headers || {})
        }
    })

    /** Construit l'URL complète d'une image storage */
    const getImageUrl = (path: string): string => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${config.public.apiBase.replace('/api', '')}/storage/${path}`
    }

    const formatPrice = (price: number): string =>
    `${Number(price || 0).toLocaleString('fr-FR')} ${currentShopData.value?.currency || 'XOF'}`

    const formatDate = (d: string): string =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''

    // ── Données statiques pour les champs de formulaire ──────────────
    const colorFields = [
    { key: 'primary',    label: 'Couleur principale' },
    { key: 'secondary',  label: 'Couleur secondaire' },
    { key: 'background', label: 'Fond' },
    { key: 'text',       label: 'Texte' },
    ]

    const socialFields = [
    { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/maboutique' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/maboutique' },
    { key: 'twitter',   label: 'Twitter/X', placeholder: 'https://twitter.com/maboutique' },
    { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/company/maboutique' },
    ]

    const fontOptions = [
    { value: 'sans-serif',        label: 'Sans-serif (défaut)' },
    { value: 'Georgia, serif',    label: 'Georgia (élégant)' },
    { value: '"Courier New", monospace', label: 'Courier (technique)' },
    { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet (moderne)' },
    ]
</script>

<style scoped>
    /* Ajoutez cette ligne tout en haut du bloc */
    @reference "tailwindcss"; 
    /* ── Champs de formulaire standardisés ── */
    .input-field {
    @apply w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all;
    }
    .label-field {
    @apply block text-xs font-medium text-gray-600 mb-1.5;
    }
    .save-btn {
    @apply w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl
            hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
    }

    /* ── Toast animation ── */
    .slide-fade-enter-active { transition: all 0.3s ease; }
    .slide-fade-leave-active  { transition: all 0.25s ease; }
    .slide-fade-enter-from, .slide-fade-leave-to {
    opacity: 0;
    transform: translateX(20px);
    }
</style>