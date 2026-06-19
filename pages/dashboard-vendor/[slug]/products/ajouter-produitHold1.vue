<template>
  <div class="max-w-7xl mx-auto">
    <!-- En-tête de la page -->
    <div class="mb-4">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-bold text-gray-900">Ajouter un produit</h1>
        <!-- Bouton info boutique (toggle) -->
        <button 
          type="button"
          @click="showShopInfo = !showShopInfo"
          class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          :title="showShopInfo ? 'Masquer les informations' : 'Voir les informations de la boutique'"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Panneau info boutique (repliable via transition CSS) -->
    <transition name="slide-fade">
      <div v-if="showShopInfo && currentShop" class="mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-700">Informations de la boutique</h3>
        </div>
        <div class="p-4">
          <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide">Boutique</dt>
              <dd class="mt-1 text-sm text-gray-900 font-medium">{{ currentShop.name }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide">Type de produits</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ isPhysicalShop ? 'Produits physiques' : 'Produits numériques' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide">Catégorie</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ shopCategory?.name || 'Non définie' }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </transition>

    <!-- Formulaire principal -->
    <div class="bg-white overflow-hidden">
      <div>
        <form @submit.prevent="submitForm">

          <!-- ══════════════════════════════════════════════
               SECTION 1 — Informations de base
               ══════════════════════════════════════════════ -->
          <div class="border-b border-gray-200 pb-6 mb-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">

              <!-- Nom du produit -->
              <div class="sm:col-span-2">
                <label for="nom-produit" class="block text-sm font-medium text-gray-700 mb-1">
                  Nom du produit<span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nom-produit"
                  v-model="productForm.name"
                  required
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Ex. : T-shirt bleu"
                />
              </div>

              <!-- Description (éditeur riche) -->
              <div class="sm:col-span-2">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                  Description <span class="text-red-500">*</span>
                </label>
                <RichEditor id="description" v-model="productForm.description" />
              </div>

              <!-- Sous-catégorie — peuplée selon la catégorie de la boutique -->
              <div>
                <label for="sous-categorie" class="block text-sm font-medium text-gray-700 mb-1">
                  Sous-catégorie <span class="text-red-500">*</span>
                </label>
                <select
                  id="sous-categorie"
                  v-model="productForm.subcategory_id"
                  required
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  :disabled="subcategories.length === 0"
                >
                  <option value="0">Sélectionnez une sous-catégorie</option>
                  <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
                    {{ subcategory.name }}
                  </option>
                </select>
                <p v-if="subcategories.length === 0" class="text-sm text-gray-500 mt-1">
                  Aucune sous-catégorie disponible pour la catégorie "{{ shopCategory?.name }}"
                </p>
              </div>
            </div>
          </div>

          <!-- ══════════════════════════════════════════════
               SECTION 2 — Prix et stock
               ══════════════════════════════════════════════ -->
          <div class="border-b border-gray-200 pb-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Prix et stock</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">

              <!-- Prix de base -->
              <div>
                <label for="prix-normal" class="block text-sm font-medium text-gray-700 mb-1">
                  Prix normal ({{ currentShop?.currency || 'XOF' }})<span class="text-red-500">*</span>
                </label>
                <input type="number" id="prix-normal" v-model.number="productForm.price"
                  step="0.01" min="0" required
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Ex. : 29.99"
                />
              </div>

              <!-- Prix promotionnel -->
              <div>
                <label for="prix-promo" class="block text-sm font-medium text-gray-700 mb-1">
                  Prix promotionnel ({{ currentShop?.currency || 'XOF' }})
                </label>
                <input type="number" id="prix-promo" v-model.number="productForm.promotional_price"
                  step="0.01" min="0"
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Ex. : 19.99"
                />
              </div>

              <!-- Dates de promotion — affichées uniquement si un prix promo est saisi -->
              <div v-if="productForm.promotional_price" class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="date-debut-promo" class="block text-sm font-medium text-gray-700 mb-1">
                    Date de début de promotion
                  </label>
                  <input type="date" id="date-debut-promo" v-model="productForm.promotion_start_date"
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  />
                </div>
                <div>
                  <label for="date-fin-promo" class="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin de promotion
                  </label>
                  <input type="date" id="date-fin-promo" v-model="productForm.promotion_end_date"
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  />
                </div>
              </div>

              <!-- Stock global (physique, sans variantes) -->
              <template v-if="isPhysicalShop">
                <div>
                  <label for="stock" class="block text-sm font-medium text-gray-700 mb-1">
                    Stock global<span class="text-red-500">*</span>
                    <span class="text-gray-400 font-normal text-xs ml-1">(ignoré si des variantes sont définies)</span>
                  </label>
                  <input type="number" id="stock" v-model.number="productForm.stock_quantity"
                    min="0" required
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                    placeholder="Ex. : 50"
                  />
                </div>
              </template>

              <!-- Fichier numérique (boutiques digitales) -->
              <template v-else-if="isDigitalShop">
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Fichier numérique<span class="text-red-500">*</span>
                    <span class="text-gray-500 font-normal"> (PDF, MP4, ZIP, max 100 Mo)</span>
                  </label>
                  <div class="mt-1 flex justify-center px-4 pt-3 pb-4 border-2 border-gray-300 border-dashed">
                    <div class="space-y-1 text-center">
                      <svg class="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div class="flex text-sm text-gray-600">
                        <label for="file-upload" class="relative cursor-pointer bg-white font-medium text-blue-600 hover:text-blue-500">
                          <span>Télécharger un fichier</span>
                          <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload">
                        </label>
                        <p class="pl-1">ou glisser-déposer</p>
                      </div>
                      <p class="text-xs text-gray-500">PDF, MP4, ZIP jusqu'à 100MB</p>
                    </div>
                  </div>
                  <div v-if="productForm.digital_file" class="mt-2 text-sm text-gray-500">
                    Fichier sélectionné : {{ productForm.digital_file.name }}
                  </div>
                </div>
              </template>

              <!-- Option : afficher le compteur de ventes -->
              <div class="sm:col-span-2 mt-4">
                <div class="flex items-center">
                  <input id="afficher-ventes" type="checkbox" v-model="productForm.show_sales_count"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label for="afficher-ventes" class="ml-2 block text-sm text-gray-700">
                    Afficher le nombre de ventes
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════════════════════════════════════════════
               SECTION 3 — Disponibilité / Précommande
               (produits physiques uniquement)
               ══════════════════════════════════════════════ -->
          <div v-if="isPhysicalShop" class="border-b border-gray-200 pb-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Disponibilité</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type de disponibilité</label>
                <select v-model="productForm.availability_type"
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                >
                  <option value="in_stock">En stock</option>
                  <option value="preorder">Précommande</option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  Précommande : les clients peuvent commander même si le produit n'est pas encore disponible
                </p>
              </div>

              <!-- Options précommande — affichées uniquement si preorder sélectionné -->
              <template v-if="productForm.availability_type === 'preorder'">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Paiement requis</label>
                  <select v-model="productForm.preorder_payment_type"
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  >
                    <option value="none">Aucun paiement à la commande</option>
                    <option value="deposit">Acompte à la commande</option>
                    <option value="full">Paiement intégral à la commande</option>
                  </select>
                  <p class="mt-1 text-xs text-gray-500">
                    <span v-if="productForm.preorder_payment_type === 'none'">Le client commande sans payer, vous le contactez quand le produit est disponible</span>
                    <span v-else-if="productForm.preorder_payment_type === 'deposit'">Le client paie un acompte, puis le solde quand le produit est disponible</span>
                    <span v-else>Le client paie la totalité lors de la commande</span>
                  </p>
                </div>

                <!-- Options d'acompte -->
                <template v-if="productForm.preorder_payment_type === 'deposit'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Type d'acompte</label>
                    <div class="flex gap-4 mt-2">
                      <label class="flex items-center">
                        <input type="radio" v-model="depositType" value="percentage"
                          class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span class="ml-2 text-sm text-gray-700">Pourcentage</span>
                      </label>
                      <label class="flex items-center">
                        <input type="radio" v-model="depositType" value="fixed"
                          class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span class="ml-2 text-sm text-gray-700">Montant fixe</span>
                      </label>
                    </div>
                  </div>

                  <div v-if="depositType === 'percentage'">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Pourcentage d'acompte</label>
                    <div class="flex items-center gap-2">
                      <input type="number" v-model.number="productForm.deposit_percentage" min="1" max="100"
                        class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                        placeholder="Ex. : 30"
                      />
                      <span class="text-gray-500">%</span>
                    </div>
                    <p v-if="productForm.price && productForm.deposit_percentage" class="mt-1 text-xs text-gray-500">
                      Soit {{ Math.round((productForm.price * productForm.deposit_percentage) / 100).toLocaleString('fr-FR') }} {{ currentShop?.currency || 'XOF' }} d'acompte
                    </p>
                  </div>

                  <div v-else-if="depositType === 'fixed'">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Montant de l'acompte ({{ currentShop?.currency || 'XOF' }})
                    </label>
                    <input type="number" v-model.number="productForm.deposit_amount" min="0"
                      class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                      placeholder="Ex. : 5000"
                    />
                  </div>
                </template>
              </template>
            </div>
          </div>

          <!-- ══════════════════════════════════════════════
               SECTION 4 — Variantes par dimensions + combinaisons
               (produits physiques uniquement)

               Architecture :
               ┌─────────────────────────────────────────┐
               │  Dimensions (variant_options)            │
               │  ex: Couleur → [Rouge, Bleu]            │
               │      Taille  → [M, L, XL]               │
               ├─────────────────────────────────────────┤
               │  Combinaisons (variant_combinations)     │
               │  générées automatiquement via le bouton  │
               │  "Générer les combinaisons"              │
               │  ex: Rouge+M, Rouge+L, Bleu+M, Bleu+L  │
               │  → stock et prix par combinaison         │
               └─────────────────────────────────────────┘
               ══════════════════════════════════════════════ -->
          <div v-if="isPhysicalShop" class="border-b border-gray-200 pb-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Variantes</h2>
                <p class="text-xs text-gray-500 mt-0.5">
                  Définissez des dimensions (ex: Couleur, Taille) puis générez les combinaisons avec stock individuel
                </p>
              </div>
              <!-- Ajouter une nouvelle dimension d'attribut -->
              <button type="button" @click="addVariantOption"
                class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Ajouter une dimension
              </button>
            </div>

            <!-- ── Dimensions : chaque option a un nom + N valeurs ── -->
            <div v-if="productForm.variant_options.length > 0" class="space-y-6">
              <div
                v-for="(option, optIdx) in productForm.variant_options"
                :key="optIdx"
                class="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <!-- En-tête de la dimension -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3 flex-1">
                    <!-- Nom de la dimension : Couleur, Taille, Matière… -->
                    <input
                      v-model="option.name"
                      type="text"
                      class="flex-1 px-3 py-1.5 text-sm font-medium border-0 border-b-2 border-gray-300 focus:border-primary focus:outline-none bg-transparent"
                      placeholder="Nom de la dimension (ex: Couleur)"
                    />
                  </div>
                  <!-- Supprimer la dimension entière -->
                  <button type="button" @click="removeVariantOption(optIdx)"
                    class="ml-3 text-red-400 hover:text-red-600"
                    title="Supprimer cette dimension"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>

                <!-- Valeurs de la dimension -->
                <div class="space-y-2">
                  <div
                    v-for="(val, valIdx) in option.values"
                    :key="valIdx"
                    class="flex items-center gap-3 bg-white rounded p-2 border border-gray-100"
                  >
                    <!-- Valeur textuelle -->
                    <input
                      v-model="val.value"
                      type="text"
                      class="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary focus:border-primary"
                      :placeholder="'Ex: ' + (option.name === 'Couleur' ? 'Rouge' : option.name === 'Taille' ? 'M' : 'Valeur')"
                    />
                    <!-- Couleur (pickers hex) — optionnel -->
                    <div class="flex items-center gap-1.5" :title="'Couleur de ' + val.value">
                      <input
                        v-model="val.color"
                        type="color"
                        class="w-7 h-7 rounded cursor-pointer border border-gray-200"
                      />
                      <span class="text-xs text-gray-400">Couleur</span>
                    </div>
                    <!-- Image de la valeur (upload) — optionnel -->
                    <div class="flex items-center gap-1.5">
                      <div v-if="val.image" class="w-8 h-8 rounded overflow-hidden border border-gray-200">
                        <img :src="val.image" alt="Aperçu" class="w-full h-full object-cover" />
                      </div>
                      <label class="cursor-pointer text-xs text-blue-600 hover:text-blue-800">
                        <span>{{ val.image ? '✎' : '+ img' }}</span>
                        <input type="file" accept="image/*" class="sr-only"
                          @change="(e) => handleVariantValueImage(e, optIdx, valIdx)"
                        />
                      </label>
                    </div>
                    <!-- Supprimer la valeur -->
                    <button type="button" @click="removeVariantValue(optIdx, valIdx)"
                      class="text-red-400 hover:text-red-600 flex-shrink-0"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Ajouter une valeur à cette dimension -->
                  <button type="button" @click="addVariantValue(optIdx)"
                    class="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Ajouter une valeur
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-4 text-gray-500 text-sm">
              Aucune dimension ajoutée. Cliquez sur "Ajouter une dimension" pour commencer.
            </div>

            <!--
              Bouton de génération des combinaisons.
              Calcule le produit cartésien de toutes les dimensions.
              Les combinaisons déjà existantes sont conservées (stock/prix).
            -->
            <div v-if="productForm.variant_options.length > 0 && canGenerateCombinations" class="mt-4 flex items-center gap-3">
              <button
                type="button"
                @click="generateCombinations"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-secondary rounded"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Générer les combinaisons ({{ totalCombinations }})
              </button>
              <span class="text-xs text-gray-500">
                {{ productForm.variant_options.map(o => o.name + ' (' + o.values.length + ')').join(' × ') }}
              </span>
            </div>

            <!-- ── Tableau des combinaisons générées ── -->
            <div v-if="productForm.variant_combinations.length > 0" class="mt-6 overflow-x-auto">
              <table class="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead class="bg-gray-50">
                  <tr>
                    <!-- En-têtes dynamiques selon les dimensions définies -->
                    <th
                      v-for="option in productForm.variant_options"
                      :key="option.name"
                      class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {{ option.name }}
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix supp. ({{ currentShop?.currency || 'XOF' }})
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th class="w-8"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                  <tr
                    v-for="(combo, comboIdx) in productForm.variant_combinations"
                    :key="comboIdx"
                    class="hover:bg-gray-50"
                  >
                    <!-- Afficher la valeur + couleur pour chaque dimension -->
                    <td
                      v-for="option in productForm.variant_options"
                      :key="option.name"
                      class="px-3 py-2"
                    >
                      <div class="flex items-center gap-2">
                        <!-- Swatch couleur si disponible -->
                        <span
                          v-if="getValueColor(option.name, combo.attributes[option.name])"
                          class="inline-block w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                          :style="{ backgroundColor: getValueColor(option.name, combo.attributes[option.name]) }"
                        ></span>
                        <!-- Image miniature si disponible -->
                        <img
                          v-else-if="getValueImage(option.name, combo.attributes[option.name])"
                          :src="getValueImage(option.name, combo.attributes[option.name])"
                          class="w-5 h-5 rounded object-cover border border-gray-200"
                          alt=""
                        />
                        <span class="text-sm text-gray-900">{{ combo.attributes[option.name] }}</span>
                      </div>
                    </td>
                    <!-- Prix supplémentaire de cette combinaison -->
                    <td class="px-3 py-2">
                      <input
                        v-model.number="combo.price_modifier"
                        type="number" min="0" step="1"
                        class="w-24 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary"
                        placeholder="0"
                      />
                    </td>
                    <!-- Stock de cette combinaison -->
                    <td class="px-3 py-2">
                      <input
                        v-model.number="combo.stock_quantity"
                        type="number" min="0"
                        class="w-20 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary"
                        placeholder="0"
                      />
                    </td>
                    <!-- SKU optionnel pour la gestion d'inventaire -->
                    <td class="px-3 py-2">
                      <input
                        v-model="combo.sku"
                        type="text"
                        class="w-28 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary"
                        placeholder="Ex: SKU-001"
                      />
                    </td>
                    <!-- Supprimer cette combinaison -->
                    <td class="px-2 py-2">
                      <button type="button" @click="removeCombination(comboIdx)"
                        class="text-red-400 hover:text-red-600"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- Résumé du stock total calculé depuis les combinaisons -->
              <p class="mt-2 text-xs text-gray-500">
                Stock total calculé : {{ totalStockFromCombinations }} unités
              </p>
            </div>
          </div>

          <!-- ══════════════════════════════════════════════
               SECTION 5 — Images du produit
               ══════════════════════════════════════════════ -->
          <div class="border-b border-gray-200 pb-6 mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Images du produit<span class="text-red-500">*</span>
              <span class="text-gray-500 font-normal text-base"> (jusqu'à 10 images, PNG/JPEG, max 5 Mo chacune)</span>
            </h3>
            <div class="mb-3 text-sm text-gray-600">
              <span class="font-medium">💡 Astuce :</span> Cliquez sur une image pour la définir comme image principale
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <!-- Images existantes -->
              <div v-for="(image, index) in productForm.images" :key="index" class="relative group">
                <div
                  :class="[
                    'border-2 w-full aspect-square flex items-center justify-center overflow-hidden cursor-pointer transition-all',
                    image.is_primary ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300 bg-gray-100 hover:border-gray-400'
                  ]"
                  @click="setPrimaryImage(index)"
                >
                  <img v-if="image.preview" :src="image.preview" alt="Aperçu" class="w-full h-full object-cover" />
                  <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <!-- Badge image principale -->
                <div v-if="image.is_primary" class="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Principale
                </div>
                <!-- Bouton supprimer (visible au survol) -->
                <button type="button" @click="removeImage(index)"
                  class="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 rounded-full"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Zone d'ajout — masquée quand 10 images atteintes -->
              <div
                v-if="productForm.images.length < 10"
                class="border-2 border-dashed border-gray-300 aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
                @click="triggerImageUpload"
              >
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span class="mt-1 text-xs text-gray-500">Ajouter</span>
                <input ref="imageInput" type="file" multiple accept="image/png, image/jpeg"
                  class="sr-only" @change="handleImageUpload"
                />
              </div>
            </div>

            <div v-if="productForm.images.length === 0" class="mt-2 text-sm text-red-500">
              Au moins une image est requise.
            </div>
          </div>

          <!-- ══════════════════════════════════════════════
               SECTION 6 — Statut du produit
               ══════════════════════════════════════════════ -->
          <div class="pb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Statut du produit</h2>
            <div class="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <button type="button" @click="productForm.status = 'active'"
                :class="['px-4 py-2 text-sm font-medium rounded-md transition-all',
                  productForm.status === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']"
              >Actif</button>
              <button type="button" @click="productForm.status = 'inactive'"
                :class="['px-4 py-2 text-sm font-medium rounded-md transition-all',
                  productForm.status === 'inactive' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']"
              >Inactif</button>
            </div>
            <p class="mt-2 text-sm text-gray-500">
              {{ productForm.status === 'active'
                ? 'Le produit sera visible et disponible à l\'achat'
                : 'Le produit sera masqué pour les acheteurs' }}
            </p>
          </div>

          <!-- Message d'erreur global -->
          <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Erreur lors de la création du produit</h3>
                <p class="mt-2 text-sm text-red-700">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3 pt-4">
            <NuxtLink
              :to="`/dashboard-vendor/${currentShop?.slug}/products`"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </NuxtLink>
            <button
              type="submit"
              :disabled="!isFormValid || isLoading"
              :class="['px-4 py-2 text-sm font-medium text-white rounded-md',
                isFormValid && !isLoading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed']"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création...
              </span>
              <span v-else>Ajouter le produit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ProductData, ProductImage, VariantOption, VariantValue, VariantCombination } from '~/types/product'
import type { Subcategory } from '~/types/product'

// ── Méta de page : layout dashboard + middleware d'accès boutique ──
definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})

const router = useRouter()
const route  = useRoute()
const { currentShop }                              = useShops()
const { categories, fetchCategories }              = useCategories()
const { fetchSubcategoriesByCategory }             = useSubcategories()
const { createProduct, isLoading: isCreatingProduct } = useProducts()

// ── État local ──
const isLoading    = ref(false)
const error        = ref<string | null>(null)
const subcategories = ref<Subcategory[]>([])
const showShopInfo = ref(false)

/**
 * productForm — état réactif du formulaire.
 * variant_options  : les dimensions (Couleur, Taille…)
 * variant_combinations : les SKUs générés
 * images           : jusqu'à 10 images (File + preview DataURL)
 */
const productForm = reactive<ProductData>({
  name:                '',
  description:         '',
  subcategory_id:      0,
  price:               0,
  promotional_price:   undefined,
  promotion_start_date:'',
  promotion_end_date:  '',
  stock_quantity:      0,
  digital_file:        undefined,
  status:              'active',
  show_sales_count:    false,
  // Précommande
  availability_type:       'in_stock',
  preorder_payment_type:   'none',
  deposit_amount:          null,
  deposit_percentage:      null,
  // Nouveau système de variantes
  variant_options:      [] as VariantOption[],
  variant_combinations: [] as VariantCombination[],
  images:               [] as ProductImage[]
})

// Type d'acompte (pourcentage | montant fixe)
const depositType = ref<'percentage' | 'fixed'>('percentage')

// Réinitialiser l'autre valeur quand le type d'acompte change
watch(depositType, (newType) => {
  if (newType === 'percentage') productForm.deposit_amount     = null
  else                          productForm.deposit_percentage = null
})

// Réinitialiser les options de précommande quand on passe à "en stock"
watch(() => productForm.availability_type, (newType) => {
  if (newType === 'in_stock') {
    productForm.preorder_payment_type = null
    productForm.deposit_amount        = null
    productForm.deposit_percentage    = null
  } else {
    productForm.preorder_payment_type = 'none'
  }
})

// Input file caché pour les images du produit
const imageInput = ref<HTMLInputElement | null>(null)

// Détermine le type de boutique depuis currentShop.product_type
const isPhysicalShop = computed(() => currentShop.value?.product_type === 'physical')
const isDigitalShop  = computed(() => currentShop.value?.product_type === 'digital')
const shopCategory   = computed(() => currentShop.value?.category)

// ═══════════════════════════════════════════════════════════════
// GESTION DES VARIANTES PAR DIMENSIONS
// ═══════════════════════════════════════════════════════════════

/** Ajouter une nouvelle dimension (ex: Couleur) avec une valeur vide */
const addVariantOption = () => {
  productForm.variant_options.push({ name: '', values: [{ value: '' }] })
}

/** Supprimer une dimension et régénérer les combinaisons en conséquence */
const removeVariantOption = (optIdx: number) => {
  productForm.variant_options.splice(optIdx, 1)
  // Régénérer uniquement si des combinaisons existent
  if (productForm.variant_combinations.length > 0) generateCombinations()
}

/** Ajouter une valeur à une dimension existante */
const addVariantValue = (optIdx: number) => {
  productForm.variant_options[optIdx].values.push({ value: '' })
}

/** Supprimer une valeur d'une dimension */
const removeVariantValue = (optIdx: number, valIdx: number) => {
  productForm.variant_options[optIdx].values.splice(valIdx, 1)
}

/** Gérer l'upload d'image pour une valeur de variante (ex: image du coloris Rouge) */
const handleVariantValueImage = (event: Event, optIdx: number, valIdx: number) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    productForm.variant_options[optIdx].values[valIdx].image     = e.target?.result as string
    productForm.variant_options[optIdx].values[valIdx].imageFile = file
  }
  reader.readAsDataURL(file)
}

/**
 * canGenerateCombinations — true si toutes les dimensions ont au moins une valeur remplie.
 * Empêche la génération avec des valeurs vides.
 */
const canGenerateCombinations = computed(() =>
  productForm.variant_options.length > 0 &&
  productForm.variant_options.every(o => o.name.trim() !== '' && o.values.some(v => v.value.trim() !== ''))
)

/**
 * totalCombinations — nombre de combinaisons qui seront générées
 * = produit cartésien de toutes les dimensions
 */
const totalCombinations = computed(() =>
  productForm.variant_options.reduce(
    (acc, o) => acc * o.values.filter(v => v.value.trim() !== '').length,
    1
  )
)

/**
 * generateCombinations — calcule le produit cartésien de toutes les dimensions.
 * Conserve les valeurs de stock/prix des combinaisons déjà saisies (par clé d'attributs).
 *
 * Exemple :
 *   Couleur: [Rouge, Bleu] × Taille: [M, L]
 *   → [{Couleur:Rouge, Taille:M}, {Couleur:Rouge, Taille:L},
 *      {Couleur:Bleu,  Taille:M}, {Couleur:Bleu,  Taille:L}]
 */
const generateCombinations = () => {
  // Construire un index des combinaisons existantes pour ne pas écraser les données saisies
  const existingMap = new Map<string, VariantCombination>()
  productForm.variant_combinations.forEach(c => {
    existingMap.set(JSON.stringify(c.attributes), c)
  })

  // Filtrer les valeurs vides
  const validOptions = productForm.variant_options.map(o => ({
    name:   o.name,
    values: o.values.filter(v => v.value.trim() !== '')
  })).filter(o => o.values.length > 0)

  if (validOptions.length === 0) return

  // Produit cartésien récursif
  const cartesian = (options: typeof validOptions): Record<string, string>[] => {
    if (options.length === 0) return [{}]
    const [first, ...rest] = options
    const restCombos = cartesian(rest)
    return first.values.flatMap(v =>
      restCombos.map(combo => ({ [first.name]: v.value, ...combo }))
    )
  }

  const allAttributes = cartesian(validOptions)

  // Construire les nouvelles combinaisons en réutilisant les données existantes
  productForm.variant_combinations = allAttributes.map(attrs => {
    const key      = JSON.stringify(attrs)
    const existing = existingMap.get(key)
    return existing || {
      attributes:     attrs,
      price_modifier: 0,
      stock_quantity: 0,
      sku:            ''
    }
  })
}

/** Supprimer une combinaison spécifique du tableau */
const removeCombination = (idx: number) => {
  productForm.variant_combinations.splice(idx, 1)
}

/**
 * getValueColor — retrouve la couleur hex d'une valeur dans ses options.
 * Utilisé pour afficher le swatch dans le tableau des combinaisons.
 */
const getValueColor = (optionName: string, value: string): string | null => {
  const opt = productForm.variant_options.find(o => o.name === optionName)
  return opt?.values.find(v => v.value === value)?.color || null
}

/**
 * getValueImage — retrouve l'image d'une valeur dans ses options.
 * Utilisé pour afficher la miniature dans le tableau des combinaisons.
 */
const getValueImage = (optionName: string, value: string): string | null => {
  const opt = productForm.variant_options.find(o => o.name === optionName)
  return opt?.values.find(v => v.value === value)?.image || null
}

/**
 * totalStockFromCombinations — somme du stock de toutes les combinaisons.
 * Affiché en bas du tableau comme récapitulatif.
 */
const totalStockFromCombinations = computed(() =>
  productForm.variant_combinations.reduce((sum, c) => sum + (c.stock_quantity || 0), 0)
)

// ═══════════════════════════════════════════════════════════════
// GESTION DES IMAGES DU PRODUIT
// ═══════════════════════════════════════════════════════════════

/** Ouvrir le sélecteur de fichiers caché */
const triggerImageUpload = () => { if (imageInput.value) imageInput.value.click() }

/**
 * handleImageUpload — traite les fichiers images sélectionnés.
 * Limite : 10 images max, 5 Mo/image, formats PNG/JPEG/WebP.
 * La première image ajoutée devient automatiquement l'image principale.
 */
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files  = target.files
  if (!files) return

  const remainingSlots = 10 - productForm.images.length
  const filesToAdd     = Array.from(files).slice(0, remainingSlots)

  for (const file of filesToAdd) {
    if (file.size > 5 * 1024 * 1024) {
      alert(`L'image ${file.name} est trop volumineuse. Taille maximale : 5 Mo.`)
      continue
    }
    if (!file.type.match('image/(png|jpeg|webp)')) {
      alert(`Format non supporté pour ${file.name}. Formats acceptés : PNG, JPEG, WebP.`)
      continue
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.images.push({
        file,
        preview:    e.target?.result as string,
        is_primary: productForm.images.length === 0 // La 1ère image = principale
      })
    }
    reader.readAsDataURL(file)
  }
}

/** Définir une image comme image principale (une seule à la fois) */
const setPrimaryImage = (index: number) => {
  productForm.images.forEach((img, i) => { img.is_primary = i === index })
}

/**
 * removeImage — supprime une image.
 * Si l'image supprimée était la principale et qu'il en reste, la première devient principale.
 */
const removeImage = (index: number) => {
  const removed = productForm.images[index]
  productForm.images.splice(index, 1)
  if (removed.is_primary && productForm.images.length > 0) {
    productForm.images[0].is_primary = true
  }
}

// ═══════════════════════════════════════════════════════════════
// GESTION DU FICHIER NUMÉRIQUE (produits digitaux uniquement)
// ═══════════════════════════════════════════════════════════════

/** Valide le type et la taille du fichier numérique avant assignation */
const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 100 * 1024 * 1024) {
    alert('Le fichier est trop volumineux. Taille maximale : 100 Mo.')
    return
  }
  const validTypes = [
    'application/pdf', 'video/mp4', 'application/zip',
    'application/x-zip-compressed', 'audio/mpeg', 'audio/mp3',
    'image/jpeg', 'image/png', 'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  if (!validTypes.includes(file.type)) {
    alert('Format non supporté. Formats acceptés : PDF, MP4, ZIP, MP3, Images, Documents Word.')
    return
  }
  productForm.digital_file = file
}

// ═══════════════════════════════════════════════════════════════
// SOUS-CATÉGORIES
// ═══════════════════════════════════════════════════════════════

/** Charger les sous-catégories en fonction de la catégorie de la boutique */
const loadSubcategories = async (categoryId: number) => {
  try {
    subcategories.value = await fetchSubcategoriesByCategory(categoryId)
  } catch (err) {
    console.error('Erreur chargement sous-catégories:', err)
  }
}

// Recharger si la boutique change (ex: changement de contexte)
watch(currentShop, async (shop) => {
  if (shop?.category_id) await loadSubcategories(shop.category_id)
}, { immediate: true })

// ═══════════════════════════════════════════════════════════════
// VALIDATION DU FORMULAIRE
// ═══════════════════════════════════════════════════════════════

/**
 * isFormValid — active ou désactive le bouton de soumission.
 * Vérifie les champs obligatoires + cohérence variantes.
 */
const isFormValid = computed(() => {
  if (!productForm.name || !productForm.description) return false
  if (productForm.subcategory_id <= 0) return false
  if (productForm.price <= 0) return false
  if (productForm.description.length > 10000) return false
  if (productForm.images.length === 0) return false

  if (isPhysicalShop.value && productForm.stock_quantity < 0) return false
  if (isDigitalShop.value && !productForm.digital_file) return false

  // Si des options sont définies, au moins une combinaison doit être générée
  if (productForm.variant_options.length > 0 && productForm.variant_combinations.length === 0) return false

  return true
})

// ═══════════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════════

onMounted(async () => {
  if (categories.value.length === 0) await fetchCategories()
})

// ═══════════════════════════════════════════════════════════════
// SOUMISSION
// ═══════════════════════════════════════════════════════════════

/**
 * submitForm — prépare et envoie les données du produit via createProduct().
 * Les variantes (options + combinaisons) sont incluses dans le payload.
 */
const submitForm = async () => {
  if (!isFormValid.value) {
    alert('Veuillez remplir correctement tous les champs obligatoires.')
    return
  }
  if (!currentShop.value) {
    alert('Aucune boutique sélectionnée.')
    return
  }

  isLoading.value = true
  error.value     = null

  try {
    const newProduct = await createProduct(currentShop.value.id, { ...productForm })
    if (newProduct) {
      alert('Produit ajouté avec succès !')
      router.push(`/dashboard-vendor/${currentShop.value.slug}/products/produits`)
    } else {
      throw new Error('Erreur lors de la création du produit')
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue lors de la création du produit'
    alert(error.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Animation de déploiement du panneau info boutique */
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active  { transition: all 0.2s ease-in; }
.slide-fade-enter-from,
.slide-fade-leave-to      { transform: translateY(-10px); opacity: 0; }
</style>