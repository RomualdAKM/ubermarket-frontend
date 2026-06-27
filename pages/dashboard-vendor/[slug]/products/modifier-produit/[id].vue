<template>
  <div class="max-w-7xl mx-auto">
    <!-- En-tête -->
    <div class="mb-4">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-bold text-gray-900">Modifier le produit</h1>
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

    <!-- Spinner de chargement du produit -->
    <div v-if="isLoadingProduct" class="bg-white border border-gray-200 p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p class="mt-2 text-gray-600">Chargement du produit...</p>
    </div>

    <!-- Panneau info boutique (repliable) -->
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

    <!-- Formulaire de modification — affiché après chargement -->
    <div v-if="!isLoadingProduct" class="bg-white overflow-hidden">
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
                <input type="text" id="nom-produit" v-model="productForm.name" required
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

              <!-- Sous-catégorie -->
              <div>
                <label for="sous-categorie" class="block text-sm font-medium text-gray-700 mb-1">
                  Sous-catégorie <span class="text-red-500">*</span>
                </label>
                <select id="sous-categorie" v-model="productForm.subcategory_id" required
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  :disabled="subcategories.length === 0"
                >
                  <option value="0">Sélectionnez une sous-catégorie</option>
                  <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
                    {{ subcategory.name }}
                  </option>
                </select>
                <p v-if="subcategories.length === 0" class="text-sm text-gray-500 mt-1">
                  Aucune sous-catégorie disponible pour "{{ shopCategory?.name }}"
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

              <div>
                <label for="prix-normal" class="block text-sm font-medium text-gray-700 mb-1">
                  Prix normal ({{ currentShop?.currency || 'XOF' }})<span class="text-red-500">*</span>
                </label>
                <input type="number" id="prix-normal" v-model.number="productForm.price"
                  step="0.01" min="0" required
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Ex. : 29.99"
                />
              </div>

              <div>
                <label for="prix-promo" class="block text-sm font-medium text-gray-700 mb-1">
                  Prix promotionnel ({{ currentShop?.currency || 'XOF' }})
                </label>
                <input type="number" id="prix-promo" v-model.number="productForm.promotional_price"
                  step="0.01" min="0"
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Ex. : 19.99"
                />
              </div>

              <!-- Dates de promotion -->
              <div v-if="productForm.promotional_price" class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="date-debut-promo" class="block text-sm font-medium text-gray-700 mb-1">Date de début de promotion</label>
                  <input type="date" id="date-debut-promo" v-model="productForm.promotion_start_date"
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  />
                </div>
                <div>
                  <label for="date-fin-promo" class="block text-sm font-medium text-gray-700 mb-1">Date de fin de promotion</label>
                  <input type="date" id="date-fin-promo" v-model="productForm.promotion_end_date"
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  />
                </div>
              </div>

              <!-- Stock global (physique sans variantes) -->
              <template v-if="isPhysicalShop">
                <div>
                  <label for="stock" class="block text-sm font-medium text-gray-700 mb-1">
                    Stock global<span class="text-red-500">*</span>
                    <span class="text-gray-400 font-normal text-xs ml-1">(ignoré si des variantes sont définies)</span>
                  </label>
                  <input type="number" id="stock" v-model.number="productForm.stock_quantity" min="0" required
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
                          <span>Télécharger un nouveau fichier</span>
                          <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload">
                        </label>
                        <p class="pl-1">ou glisser-déposer</p>
                      </div>
                      <p class="text-xs text-gray-500">PDF, MP4, ZIP jusqu'à 100MB</p>
                    </div>
                  </div>
                  <!-- Nouveau fichier sélectionné -->
                  <div v-if="productForm.digital_file" class="mt-2 text-sm text-blue-600">
                    Nouveau fichier : {{ productForm.digital_file.name }}
                  </div>
                  <!-- Fichier actuel sur le serveur -->
                  <div v-else-if="currentDigitalFile" class="mt-2 text-sm text-gray-500">
                    Fichier actuel : {{ currentDigitalFile.split('/').pop() }}
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
              </div>

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
                </div>

                <template v-if="productForm.preorder_payment_type === 'deposit'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Type d'acompte</label>
                    <div class="flex gap-4 mt-2">
                      <label class="flex items-center">
                        <input type="radio" v-model="depositType" value="percentage" class="h-4 w-4 text-primary" />
                        <span class="ml-2 text-sm text-gray-700">Pourcentage</span>
                      </label>
                      <label class="flex items-center">
                        <input type="radio" v-model="depositType" value="fixed" class="h-4 w-4 text-primary" />
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
               SECTION 4 — Variantes (dimensions + combinaisons)
               Identique à ajouter-produit.vue — les données
               existantes sont chargées dans loadProductData()
               via product.variant_options et product.variant_combinations.
               ══════════════════════════════════════════════ -->
          <div v-if="isPhysicalShop" class="border-b border-gray-200 pb-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Variantes</h2>
                <p class="text-xs text-gray-500 mt-0.5">
                  Modifiez les dimensions et régénérez les combinaisons si nécessaire
                </p>
              </div>
              <button type="button" @click="addVariantOption"
                class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Ajouter une dimension
              </button>
            </div>

            <!-- Dimensions -->
            <div v-if="productForm.variant_options.length > 0" class="space-y-6">
              <div
                v-for="(option, optIdx) in productForm.variant_options"
                :key="optIdx"
                class="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div class="flex items-center justify-between mb-3">
                  <input
                    v-model="option.name"
                    type="text"
                    class="flex-1 px-3 py-1.5 text-sm font-medium border-0 border-b-2 border-gray-300 focus:border-primary focus:outline-none bg-transparent"
                    placeholder="Nom de la dimension (ex: Couleur)"
                  />
                  <button type="button" @click="removeVariantOption(optIdx)"
                    class="ml-3 text-red-400 hover:text-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>

                <div class="space-y-2">
                  <div
                    v-for="(val, valIdx) in option.values"
                    :key="valIdx"
                    class="flex items-center gap-3 bg-white rounded p-2 border border-gray-100"
                  >
                    <input v-model="val.value" type="text"
                      class="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary"
                      placeholder="Valeur"
                    />
                    <div class="flex items-center gap-1.5">
                      <input v-model="val.color" type="color"
                        class="w-7 h-7 rounded cursor-pointer border border-gray-200"
                      />
                      <span class="text-xs text-gray-400">Couleur</span>
                    </div>
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
                    <button type="button" @click="removeVariantValue(optIdx, valIdx)"
                      class="text-red-400 hover:text-red-600 flex-shrink-0"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
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
              Aucune dimension. Cliquez sur "Ajouter une dimension" pour commencer.
            </div>

            <!-- Bouton de (re)génération des combinaisons -->
            <div v-if="productForm.variant_options.length > 0 && canGenerateCombinations" class="mt-4 flex items-center gap-3">
              <button type="button" @click="generateCombinations"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-secondary rounded"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Régénérer les combinaisons ({{ totalCombinations }})
              </button>
            </div>

            <!-- Tableau des combinaisons -->
            <div v-if="productForm.variant_combinations.length > 0" class="mt-6 overflow-x-auto">
              <table class="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead class="bg-gray-50">
                  <tr>
                    <th v-for="option in productForm.variant_options" :key="option.name"
                      class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >{{ option.name }}</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix supp. ({{ currentShop?.currency || 'XOF' }})
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th class="w-8"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                  <tr v-for="(combo, comboIdx) in productForm.variant_combinations" :key="comboIdx" class="hover:bg-gray-50">
                    <td v-for="option in productForm.variant_options" :key="option.name" class="px-3 py-2">
                      <div class="flex items-center gap-2">
                        <span
                          v-if="getValueColor(option.name, combo.attributes[option.name])"
                          class="inline-block w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                          :style="{ backgroundColor: getValueColor(option.name, combo.attributes[option.name]) }"
                        ></span>
                        <img
                          v-else-if="getValueImage(option.name, combo.attributes[option.name])"
                          :src="getValueImage(option.name, combo.attributes[option.name])"
                          class="w-5 h-5 rounded object-cover border border-gray-200"
                          alt=""
                        />
                        <span>{{ combo.attributes[option.name] }}</span>
                      </div>
                    </td>
                    <td class="px-3 py-2">
                      <input v-model.number="combo.price_modifier" type="number" min="0" step="1"
                        class="w-24 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary"
                        placeholder="0"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <input v-model.number="combo.stock_quantity" type="number" min="0"
                        class="w-20 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary"
                        placeholder="0"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <input v-model="combo.sku" type="text"
                        class="w-28 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-primary"
                        placeholder="Ex: SKU-001"
                      />
                    </td>
                    <td class="px-2 py-2">
                      <button type="button" @click="removeCombination(comboIdx)" class="text-red-400 hover:text-red-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
              <div v-for="(image, index) in productForm.images" :key="index" class="relative group">
                <div
                  :class="['border-2 w-full aspect-square flex items-center justify-center overflow-hidden cursor-pointer transition-all',
                    image.is_primary ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300 bg-gray-100 hover:border-gray-400']"
                  @click="setPrimaryImage(index)"
                >
                  <img v-if="image.preview" :src="image.preview" alt="Aperçu" class="w-full h-full object-cover" />
                  <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div v-if="image.is_primary" class="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Principale
                </div>
                <button type="button" @click="removeImage(index)"
                  class="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 rounded-full"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div v-if="productForm.images.length < 10"
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
              {{ productForm.status === 'active' ? 'Visible et disponible à l\'achat' : 'Masqué pour les acheteurs' }}
            </p>
          </div>

          <!-- Message d'erreur -->
          <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
            {{ error }}
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="router.back()"
              class="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              :disabled="isLoading"
            >
              Annuler
            </button>
            <button type="submit"
              :disabled="!isFormValid || isLoading"
              :class="['px-4 py-2 text-sm font-medium text-white',
                isFormValid && !isLoading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed']"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mise à jour...
              </span>
              <span v-else>Mettre à jour le produit</span>
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
import type { ProductData, VariantOption, VariantCombination } from '~/types/product'
import type { Subcategory } from '~/types/product'
import { sanitizeImage } from '~/utils/sanitizeImage'

// ── Méta de page ──
definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})

const router = useRouter()
const route  = useRoute()
const config = useRuntimeConfig()
const { currentShop }                           = useShops()
const { categories, fetchCategories }           = useCategories()
const { fetchSubcategoriesByCategory }          = useSubcategories()
const { updateProduct, fetchProductDetails }    = useProducts()

// ── État local ──
const isLoading        = ref(false)
const isLoadingProduct = ref(true)  // True pendant le chargement initial du produit
const error            = ref<string | null>(null)
const subcategories    = ref<Subcategory[]>([])
const showShopInfo     = ref(false)
// ID du produit extrait de la route /modifier-produit/[id]
const productId        = computed(() => parseInt(route.params.id as string))
// URL du fichier numérique actuellement sur le serveur (produits digitaux)
const currentDigitalFile = ref<string | null>(null)
const imageInput       = ref<HTMLInputElement | null>(null)

/**
 * productForm — identique à ajouter-produit.vue.
 * Sera peuplé par loadProductData() au montage.
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
  availability_type:       'in_stock',
  preorder_payment_type:   null,
  deposit_amount:          null,
  deposit_percentage:      null,
  variant_options:      [],
  variant_combinations: [],
  images:               []
})

const depositType = ref<'percentage' | 'fixed'>('percentage')

// Déterminants du type de boutique
const isPhysicalShop = computed(() => currentShop.value?.product_type === 'physical')
const isDigitalShop  = computed(() => currentShop.value?.product_type === 'digital')
const shopCategory   = computed(() => currentShop.value?.category)

// ═══════════════════════════════════════════════════════════════
// GESTION DES VARIANTES (identique à ajouter-produit.vue)
// ═══════════════════════════════════════════════════════════════

const addVariantOption = () => {
  productForm.variant_options.push({ name: '', values: [{ value: '' }] })
}

const removeVariantOption = (optIdx: number) => {
  productForm.variant_options.splice(optIdx, 1)
  if (productForm.variant_combinations.length > 0) generateCombinations()
}

const addVariantValue = (optIdx: number) => {
  productForm.variant_options[optIdx].values.push({ value: '' })
}

const removeVariantValue = (optIdx: number, valIdx: number) => {
  productForm.variant_options[optIdx].values.splice(valIdx, 1)
}

const handleVariantValueImage = async (event: Event, optIdx: number, valIdx: number) => {
  const original = (event.target as HTMLInputElement).files?.[0]
  if (!original) return
  // Ré-encodage canvas : la data URL base64 est alors générée à partir d'octets propres.
  const file = await sanitizeImage(original)
  const reader = new FileReader()
  reader.onload = (e) => {
    productForm.variant_options[optIdx].values[valIdx].image     = e.target?.result as string
    productForm.variant_options[optIdx].values[valIdx].imageFile = file
  }
  reader.readAsDataURL(file)
}

const canGenerateCombinations = computed(() =>
  productForm.variant_options.length > 0 &&
  productForm.variant_options.every(o => o.name.trim() !== '' && o.values.some(v => v.value.trim() !== ''))
)

const totalCombinations = computed(() =>
  productForm.variant_options.reduce(
    (acc, o) => acc * o.values.filter(v => v.value.trim() !== '').length,
    1
  )
)

/**
 * generateCombinations — produit cartésien des dimensions.
 * Les données saisies pour les combinaisons existantes sont préservées.
 */
const generateCombinations = () => {
  const existingMap = new Map<string, VariantCombination>()
  productForm.variant_combinations.forEach(c => existingMap.set(JSON.stringify(c.attributes), c))

  const validOptions = productForm.variant_options.map(o => ({
    name:   o.name,
    values: o.values.filter(v => v.value.trim() !== '')
  })).filter(o => o.values.length > 0)

  if (validOptions.length === 0) return

  const cartesian = (opts: typeof validOptions): Record<string, string>[] => {
    if (opts.length === 0) return [{}]
    const [first, ...rest] = opts
    const restCombos = cartesian(rest)
    return first.values.flatMap(v => restCombos.map(combo => ({ [first.name]: v.value, ...combo })))
  }

  productForm.variant_combinations = cartesian(validOptions).map(attrs => {
    const key      = JSON.stringify(attrs)
    const existing = existingMap.get(key)
    return existing || { attributes: attrs, price_modifier: 0, stock_quantity: 0, sku: '' }
  })
}

const removeCombination     = (idx: number) => { productForm.variant_combinations.splice(idx, 1) }
const getValueColor         = (optionName: string, value: string) =>
  productForm.variant_options.find(o => o.name === optionName)?.values.find(v => v.value === value)?.color || null
const getValueImage         = (optionName: string, value: string) =>
  productForm.variant_options.find(o => o.name === optionName)?.values.find(v => v.value === value)?.image || null
const totalStockFromCombinations = computed(() =>
  productForm.variant_combinations.reduce((sum, c) => sum + (c.stock_quantity || 0), 0)
)

// ═══════════════════════════════════════════════════════════════
// GESTION DES IMAGES
// ═══════════════════════════════════════════════════════════════

const triggerImageUpload = () => { imageInput.value?.click() }

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  const filesToAdd = Array.from(input.files).slice(0, 10 - productForm.images.length)
  for (const original of filesToAdd) {
    // Ré-encodage canvas : neutralise les PNG IA/C2PA refusés par GD côté serveur.
    const file = await sanitizeImage(original)
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.images.push({
        file,
        preview:    e.target?.result as string,
        is_primary: productForm.images.length === 0,
        image_path: ''
      })
    }
    reader.readAsDataURL(file)
  }
  input.value = ''
}

const removeImage = (index: number) => {
  const wasPrimary = productForm.images[index].is_primary
  productForm.images.splice(index, 1)
  if (wasPrimary && productForm.images.length > 0) productForm.images[0].is_primary = true
}

const setPrimaryImage = (index: number) => {
  productForm.images.forEach((img, i) => { img.is_primary = i === index })
}

// ═══════════════════════════════════════════════════════════════
// FICHIER NUMÉRIQUE
// ═══════════════════════════════════════════════════════════════

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) productForm.digital_file = input.files[0]
}

// ═══════════════════════════════════════════════════════════════
// SOUS-CATÉGORIES
// ═══════════════════════════════════════════════════════════════

const loadSubcategories = async (categoryId: number) => {
  try {
    subcategories.value = await fetchSubcategoriesByCategory(categoryId)
  } catch (err) {
    console.error('Erreur chargement sous-catégories:', err)
  }
}

watch(currentShop, async (shop) => {
  if (shop?.category_id) await loadSubcategories(shop.category_id)
}, { immediate: true })

// ═══════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════

const isFormValid = computed(() => {
  if (!productForm.name || !productForm.description) return false
  if (productForm.subcategory_id <= 0 || productForm.price <= 0) return false
  if (productForm.description.length > 10000) return false
  if (productForm.images.length === 0) return false
  if (isPhysicalShop.value && productForm.stock_quantity < 0) return false
  if (isDigitalShop.value && !currentDigitalFile.value && !productForm.digital_file) return false
  if (productForm.variant_options.length > 0 && productForm.variant_combinations.length === 0) return false
  return true
})

// ═══════════════════════════════════════════════════════════════
// CHARGEMENT DU PRODUIT EXISTANT
// ═══════════════════════════════════════════════════════════════

/**
 * loadProductData — récupère le produit via fetchProductDetails() et peuple productForm.
 *
 * Nouveautés vs. l'ancien système :
 * - product.variant_options  → dimensions chargées dans productForm.variant_options
 * - product.variant_combinations → combinaisons chargées dans productForm.variant_combinations
 *
 * Fallback : si l'API retourne encore l'ancien format (product_variants plat),
 * on regroupe les variantes par name pour reconstituer les options.
 */
const loadProductData = async () => {
  if (!currentShop.value) return

  isLoadingProduct.value = true
  error.value = null

  try {
    const product = await fetchProductDetails(currentShop.value.id, productId.value)
    if (!product) throw new Error('Produit introuvable')

    // Informations de base
    productForm.name                 = product.name
    productForm.description          = product.description
    productForm.subcategory_id       = product.subcategory_id
    productForm.price                = product.price
    productForm.promotional_price    = product.promotional_price || undefined
    productForm.promotion_start_date = product.promotion_start_date
      ? new Date(product.promotion_start_date).toISOString().split('T')[0] : ''
    productForm.promotion_end_date   = product.promotion_end_date
      ? new Date(product.promotion_end_date).toISOString().split('T')[0] : ''
    productForm.stock_quantity       = product.stock_quantity
    productForm.status               = product.status
    productForm.show_sales_count     = product.show_sales_count

    // Précommande
    productForm.availability_type      = product.availability_type || 'in_stock'
    productForm.preorder_payment_type  = product.preorder_payment_type || null
    productForm.deposit_amount         = product.deposit_amount || null
    productForm.deposit_percentage     = product.deposit_percentage || null
    if (product.deposit_percentage)    depositType.value = 'percentage'
    else if (product.deposit_amount)   depositType.value = 'fixed'

    // Fichier numérique
    currentDigitalFile.value = product.digital_file || null

    // Chargement des images (avec construction de l'URL storage)
    if (product.product_images) {
      const storageBase = config.public.apiBase.replace('/api', '') + '/storage/'
      productForm.images = product.product_images.map(img => ({
        id:         img.id,
        image_path: img.image_path,
        preview:    img.image_path.startsWith('http') ? img.image_path : storageBase + img.image_path,
        is_primary: img.image_path === product.preview_image
      }))
    }

    // ── Chargement des variantes ──
    if (product.variant_options && product.variant_combinations) {
      // Nouveau format API (après migration backend)
      productForm.variant_options      = product.variant_options
      productForm.variant_combinations = product.variant_combinations
    } else if (product.product_variants) {
      // Fallback : ancien format plat (product_variants) → reconstruction des dimensions
      // Regrouper par nom d'attribut pour reconstituer les options
      const optionsMap = new Map<string, VariantOption>()
      product.product_variants.forEach((v: any) => {
        if (!optionsMap.has(v.name)) optionsMap.set(v.name, { name: v.name, values: [] })
        optionsMap.get(v.name)!.values.push({ value: v.value })
      })
      productForm.variant_options = Array.from(optionsMap.values())
      // Reconstruire les combinaisons depuis l'ancien format (1 variante = 1 attribut seul)
      productForm.variant_combinations = product.product_variants.map((v: any) => ({
        id:             v.id,
        attributes:     { [v.name]: v.value },
        price_modifier: v.price_modifier ? parseFloat(v.price_modifier) : 0,
        stock_quantity: v.stock_quantity ? parseInt(v.stock_quantity) : 0,
        sku:            v.sku || ''
      }))
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement du produit'
    console.error('Erreur loadProductData:', err)
  } finally {
    isLoadingProduct.value = false
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════════

onMounted(async () => {
  if (categories.value.length === 0) await fetchCategories()
  await loadProductData()
})

// ═══════════════════════════════════════════════════════════════
// SOUMISSION
// ═══════════════════════════════════════════════════════════════

/**
 * submitForm — met à jour le produit via updateProduct().
 * Envoie variant_options + variant_combinations au lieu de l'ancien product_variants plat.
 */
const submitForm = async () => {
  if (!isFormValid.value) { alert('Veuillez remplir correctement tous les champs obligatoires.'); return }
  if (!currentShop.value) { alert('Aucune boutique sélectionnée.'); return }

  isLoading.value = true
  error.value     = null

  try {
    const productData: any = {
      ...productForm,
      promotion_start_date: productForm.promotion_start_date || null,
      promotion_end_date:   productForm.promotion_end_date   || null,
    }

    // Gérer l'image principale (existante ou nouvellement uploadée)
    const primaryImage = productForm.images.find(img => img.is_primary)
    if (primaryImage) {
      if (primaryImage.image_path) {
        productData.preview_image = primaryImage.image_path
      } else {
        const newImagesOnly = productForm.images.filter(img => img.file)
        productData.primary_image_index = newImagesOnly.indexOf(primaryImage)
      }
    }

    const updatedProduct = await updateProduct(currentShop.value.id, productId.value, productData)
    if (updatedProduct) {
      alert('Produit mis à jour avec succès !')
      // NOTE : utiliser .slug et non .subdomain (cohérence avec les routes)
      router.push(`/dashboard-vendor/${currentShop.value.slug}/products/produits`)
    } else {
      throw new Error('Erreur lors de la mise à jour du produit')
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue lors de la mise à jour du produit'
    alert(error.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active  { transition: all 0.2s ease-in; }
.slide-fade-enter-from,
.slide-fade-leave-to      { transform: translateY(-10px); opacity: 0; }
</style>