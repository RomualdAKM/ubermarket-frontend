<template>
  <div class="max-w-7xl mx-auto">
    <!-- En-tête -->
    <div class="mb-4">
      <!-- <NuxtLink to="/dashboard/produits" class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Retour aux produits
      </NuxtLink> -->
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-bold text-gray-900">Ajouter un produit</h1>
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

    <!-- Informations boutique (repliable) -->
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

    <!-- Formulaire d'ajout de produit -->
    <div class="bg-white overflow-hidden">
      <div>
        <form @submit.prevent="submitForm">
          <!-- Informations de base -->
          <div class="border-b border-gray-200 pb-6 mb-6">
            <!-- <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations de base</h2> -->
            
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
              
              <div class="sm:col-span-2">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                  Description<span class="text-red-500">*</span>
                  <!-- <span class="text-gray-500 font-normal"> (max 1000 caractères)</span> -->
                </label>
                <textarea
                  id="description"
                  v-model="productForm.description"
                  rows="4"
                  maxlength="1000"
                  required
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Décrivez votre produit en détail..."
                ></textarea>
                <div class="text-right text-sm text-gray-500 mt-1">
                  {{ productForm.description.length }}/1000
                </div>
              </div>
              
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
                  <option 
                    v-for="subcategory in subcategories" 
                    :key="subcategory.id" 
                    :value="subcategory.id"
                  >
                    {{ subcategory.name }}
                  </option>
                </select>
                <p v-if="subcategories.length === 0" class="text-sm text-gray-500 mt-1">
                  Aucune sous-catégorie disponible pour la catégorie "{{ shopCategory?.name }}"
                </p>
              </div>

            </div>
          </div>

          <!-- Informations de prix et stock -->
          <div class="border-b border-gray-200 pb-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Prix et stock</h2>
            
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="prix-normal" class="block text-sm font-medium text-gray-700 mb-1">
                  Prix normal ({{ currentShop?.currency || 'XOF' }})<span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="prix-normal"
                  v-model.number="productForm.price"
                  step="0.01"
                  min="0"
                  required
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Ex. : 29.99"
                />
              </div>
              
              <div>
                <label for="prix-promo" class="block text-sm font-medium text-gray-700 mb-1">
                  Prix promotionnel ({{ currentShop?.currency || 'XOF' }})
                </label>
                <input
                  type="number"
                  id="prix-promo"
                  v-model.number="productForm.promotional_price"
                  step="0.01"
                  min="0"
                  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="Ex. : 19.99"
                />
              </div>
              
              <!-- Dates de promotion (affichées si prix promo est renseigné) -->
              <div v-if="productForm.promotional_price" class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="date-debut-promo" class="block text-sm font-medium text-gray-700 mb-1">
                    Date de début de promotion
                  </label>
                  <input
                    type="date"
                    id="date-debut-promo"
                    v-model="productForm.promotion_start_date"
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label for="date-fin-promo" class="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin de promotion
                  </label>
                  <input
                    type="date"
                    id="date-fin-promo"
                    v-model="productForm.promotion_end_date"
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  />
                </div>
              </div>
              
              <!-- Champs spécifiques selon le type de boutique -->
              <template v-if="isPhysicalShop">
                <div>
                  <label for="stock" class="block text-sm font-medium text-gray-700 mb-1">
                    Stock<span class="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    v-model.number="productForm.stock_quantity"
                    min="0"
                    required
                    class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                    placeholder="Ex. : 50"
                  />
                </div>
                

              </template>
              
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
              
              <!-- Options d'affichage -->
              <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div class="flex items-center">
                  <input
                    id="afficher-ventes"
                    type="checkbox"
                    v-model="productForm.show_sales_count"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label for="afficher-ventes" class="ml-2 block text-sm text-gray-700">
                    Afficher le nombre de ventes
                  </label>
                </div>
                

              </div>
            </div>
          </div>

          <!-- Variantes (uniquement pour les produits physiques) -->
          <div v-if="isPhysicalShop" class="border-b border-gray-200 pb-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Variantes</h2>
              <button
                type="button"
                @click="addVariant"
                class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Ajouter une variante
              </button>
            </div>
            
            <div v-if="productForm.variants.length > 0" class="space-y-4">
              <div
                v-for="(variant, index) in productForm.variants"
                :key="index"
                class="bg-gray-50 p-3"
              >
                <div class="flex justify-between items-start">
                  <h3 class="text-sm font-medium text-gray-900">Variante {{ index + 1 }}</h3>
                  <button
                    type="button"
                    @click="removeVariant(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                  <div>
                    <label :for="'variant-name-' + index" class="block text-xs font-medium text-gray-700 mb-1">
                      Nom (ex. : Taille)
                    </label>
                    <input
                      :id="'variant-name-' + index"
                      v-model="variant.name"
                      type="text"
                      class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex. : Taille"
                    />
                  </div>
                  
                  <div>
                    <label :for="'variant-value-' + index" class="block text-xs font-medium text-gray-700 mb-1">
                      Valeur
                    </label>
                    <input
                      :id="'variant-value-' + index"
                      v-model="variant.value"
                      type="text"
                      class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex. : Rouge, M, 32GB"
                    />
                  </div>
                  
                  <div>
                    <label :for="'variant-price-' + index" class="block text-xs font-medium text-gray-700 mb-1">
                      Prix supplémentaire ({{ currentShop?.currency || 'XOF' }})
                    </label>
                    <input
                      :id="'variant-price-' + index"
                      v-model.number="variant.price_modifier"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex. : 2.00"
                    />
                  </div>
                  
                  <div>
                    <label :for="'variant-stock-' + index" class="block text-xs font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      :id="'variant-stock-' + index"
                      v-model.number="variant.stock_quantity"
                      type="number"
                      min="0"
                      class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex. : 10"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-4 text-gray-500">
              <p>Aucune variante ajoutée. Cliquez sur "Ajouter une variante" pour commencer.</p>
            </div>
          </div>

          <!-- Images du produit -->
          <div class="border-b border-gray-200 pb-6 mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Images du produit<span class="text-red-500">*</span>
              <span class="text-gray-500 font-normal text-base"> (jusqu'à 5 images, PNG/JPEG, max 5 Mo chacune)</span>
            </h3>
            
            <div class="mb-3 text-sm text-gray-600">
              <span class="font-medium">💡 Astuce :</span> Cliquez sur une image pour la définir comme image principale
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div
                v-for="(image, index) in productForm.images"
                :key="index"
                class="relative group"
              >
                <div 
                  :class="[
                    'border-2 w-full aspect-square flex items-center justify-center overflow-hidden cursor-pointer transition-all',
                    image.is_primary 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-dashed border-gray-300 bg-gray-100 hover:border-gray-400'
                  ]"
                  @click="setPrimaryImage(index)"
                >
                  <img
                    v-if="image.preview"
                    :src="image.preview"
                    alt="Aperçu de l'image"
                    class="w-full h-full object-cover"
                  />
                  <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                
                <!-- Badge image principale -->
                <div 
                  v-if="image.is_primary"
                  class="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                >
                  Principale
                </div>
                
                <!-- Bouton supprimer -->
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 rounded-full"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div
                v-if="productForm.images.length < 5"
                class="border-2 border-dashed border-gray-300 aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
                @click="triggerImageUpload"
              >
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span class="mt-1 text-xs text-gray-500">Ajouter</span>
                <input
                  ref="imageInput"
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  class="sr-only"
                  @change="handleImageUpload"
                />
              </div>
            </div>
            
            <div v-if="productForm.images.length === 0" class="mt-2 text-sm text-red-500">
              Au moins une image est requise.
            </div>
          </div>

          <!-- Statut du produit -->
          <div class="pb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Statut du produit</h2>
            
            <div class="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <button
                type="button"
                @click="productForm.status = 'active'"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  productForm.status === 'active' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                Actif
              </button>
              <button
                type="button"
                @click="productForm.status = 'inactive'"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  productForm.status === 'inactive' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                Inactif
              </button>
            </div>
            <p class="mt-2 text-sm text-gray-500">
              {{ productForm.status === 'active' 
                ? 'Le produit sera visible et disponible à l\'achat' 
                : 'Le produit sera masqué pour les acheteurs' }}
            </p>
          </div>

          <!-- Message d'erreur -->
          <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Erreur lors de la création du produit
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ error }}
                </div>
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
              :class="[
                'px-4 py-2 text-sm font-medium text-white rounded-md',
                isFormValid && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-300 cursor-not-allowed'
              ]"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
import type { ProductData, ProductImage, ProductVariant } from '~/types/product'
import type { Subcategory } from '~/types/product'

definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})

const router = useRouter()
const route = useRoute()
const { currentShop } = useShops()
const { categories, fetchCategories } = useCategories()
const { fetchSubcategoriesByCategory, getSubcategoriesByCategory } = useSubcategories()
const { createProduct, isLoading: isCreatingProduct, error: productError } = useProducts()

// État de chargement et erreurs
const isLoading = ref(false)
const error = ref<string | null>(null)
const subcategories = ref<Subcategory[]>([])
const showShopInfo = ref(false)

// Formulaire du produit
const productForm = reactive<ProductData>({
  name: '',
  description: '',
  subcategory_id: 0,
  price: 0,
  promotional_price: undefined,
  promotion_start_date: '',
  promotion_end_date: '',
  stock_quantity: 0,
  digital_file: undefined,
  status: 'active',
  show_sales_count: false,
  variants: [] as ProductVariant[],
  images: [] as ProductImage[]
})



// Références pour les inputs de fichiers
const imageInput = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Computed pour déterminer si la boutique est physique ou digitale
const isPhysicalShop = computed(() => {
  return currentShop.value?.product_type === 'physical'
})

const isDigitalShop = computed(() => {
  return currentShop.value?.product_type === 'digital'
})

// Computed pour obtenir la catégorie de la boutique
const shopCategory = computed(() => {
  return currentShop.value?.category
})

// Fonction pour charger les sous-catégories
const loadSubcategories = async (categoryId: number) => {
  try {
    const subs = await fetchSubcategoriesByCategory(categoryId)
    subcategories.value = subs
  } catch (err) {
    console.error('Erreur lors du chargement des sous-catégories:', err)
  }
}

// Watcher pour charger les sous-catégories quand la boutique est chargée
watch(currentShop, async (newShop) => {
  if (newShop && newShop.category_id) {
    await loadSubcategories(newShop.category_id)
  }
}, { immediate: true })

// Validation du formulaire
const isFormValid = computed(() => {
  // Vérifications de base
  if (!productForm.name || !productForm.description || productForm.subcategory_id <= 0 || productForm.price <= 0) {
    return false
  }
  
  // Vérification de la longueur de la description
  if (productForm.description.length > 1000) {
    return false
  }
  
  // Vérifications selon le type de boutique
  if (isPhysicalShop.value) {
    // Vérification du stock pour les produits physiques
    if (productForm.stock_quantity < 0) {
      return false
    }
  } else if (isDigitalShop.value) {
    // Vérification du fichier numérique pour les produits digitaux
    if (!productForm.digital_file) {
      return false
    }
  }
  
  // Vérification des images (au moins une image requise)
  if (productForm.images.length === 0) {
    return false
  }
  
  // Vérification des variantes (si présentes)
  for (const variant of productForm.variants) {
    if (!variant.name || !variant.value) {
      return false
    }
    
    if (variant.price_modifier && variant.price_modifier < 0) {
      return false
    }
  }
  
  return true
})

// Fonctions pour gérer les images
const triggerImageUpload = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files) {
    // Limiter à 5 images maximum
    const remainingSlots = 5 - productForm.images.length
    const filesToAdd = Array.from(files).slice(0, remainingSlots)
    
    for (const file of filesToAdd) {
      // Vérifier la taille du fichier (max 5 Mo)
      if (file.size > 5 * 1024 * 1024) {
        alert(`L'image ${file.name} est trop volumineuse. Taille maximale : 5 Mo.`)
        continue
      }
      
      // Vérifier le type de fichier
      if (!file.type.match('image/png') && !file.type.match('image/jpeg') && !file.type.match('image/webp')) {
        alert(`Format de fichier non supporté pour ${file.name}. Formats acceptés : PNG, JPEG, WebP.`)
        continue
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const isFirstImage = productForm.images.length === 0
        productForm.images.push({
          file,
          preview: e.target?.result as string,
          is_primary: isFirstImage // La première image devient automatiquement l'image principale
        })
      }
      reader.readAsDataURL(file)
    }
  }
}

const setPrimaryImage = (index: number) => {
  // Retirer le statut principal de toutes les images
  productForm.images.forEach((image, i) => {
    image.is_primary = i === index
  })
}

const removeImage = (index: number) => {
  const removedImage = productForm.images[index]
  productForm.images.splice(index, 1)
  
  // Si l'image supprimée était l'image principale et qu'il reste des images,
  // définir la première image restante comme principale
  if (removedImage.is_primary && productForm.images.length > 0) {
    productForm.images[0].is_primary = true
  }
}

// Fonctions pour gérer les variantes
const addVariant = () => {
  productForm.variants.push({
    name: '',
    value: '',
    price_modifier: undefined,
    stock_quantity: undefined
  })
}

const removeVariant = (index: number) => {
  productForm.variants.splice(index, 1)
}

// Fonction pour gérer le fichier numérique
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Vérifier la taille du fichier (max 100 Mo)
    if (file.size > 100 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale : 100 Mo.')
      return
    }
    
    // Vérifier le type de fichier
    const validTypes = [
      'application/pdf', 
      'video/mp4', 
      'application/zip', 
      'application/x-zip-compressed',
      'audio/mpeg',
      'audio/mp3',
      'image/jpeg',
      'image/png',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!validTypes.includes(file.type)) {
      alert('Format de fichier non supporté. Formats acceptés : PDF, MP4, ZIP, MP3, Images, Documents Word, etc.')
      return
    }
    
    productForm.digital_file = file
  }
}

// Initialisation des données
onMounted(async () => {
  // Charger les catégories si nécessaire
  if (categories.value.length === 0) {
    await fetchCategories()
  }
  

})

// Soumission du formulaire
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
  error.value = null
  
  try {
    // Préparer les données du produit
    const productData: ProductData = {
      ...productForm
    }
    
    // Créer le produit
    const newProduct = await createProduct(currentShop.value.id, productData)
    
    if (newProduct) {
      // Redirection vers la liste des produits avec un message de succès
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
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>