<template>
  <div class="container max-w-4xl mx-auto p-6">
    <div class="mb-4">
      <NuxtLink to="/mes-boutiques" class="inline-flex items-center text-primary hover:text-secondary mb-4">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Retour à mes projets
      </NuxtLink>
      <h1 class="text-xl font-bold text-gray-900">
        {{ isWebsite ? 'Créer un nouveau site web' : 'Créer une nouvelle boutique' }}
      </h1>
    </div>

    <div class="bg-white">
      <form @submit.prevent="createBoutique" class="space-y-2">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">

          <!-- ── Logo ─────────────────────────────────────────────── -->
          <div>
            <label for="logo" class="block text-sm font-medium text-gray-700 mb-1">Logo de la boutique</label>
            <div class="mt-2 flex items-center gap-4">
              <div class="relative">
                <div v-if="boutiqueForm.logoPreview" class="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm">
                  <img :src="boutiqueForm.logoPreview" alt="Logo" class="w-full h-full object-cover">
                </div>
                <div v-else class="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <label for="logo-upload" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  {{ boutiqueForm.logoPreview ? 'Modifier' : 'Télécharger' }}
                </label>
                <input id="logo-upload" name="logo-upload" type="file" accept="image/png, image/jpeg" @change="handleLogoUpload" class="sr-only">
                <p class="mt-1.5 text-xs text-gray-500">PNG ou JPEG, max 2 Mo</p>
              </div>
            </div>
          </div>

          <!-- ── Nom ──────────────────────────────────────────────── -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Nom {{ isWebsite ? 'du site' : 'de la boutique' }} <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              v-model="boutiqueForm.name"
              required
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              :placeholder="isWebsite ? 'Nom de votre site' : 'Nom de votre boutique'"
            >
          </div>

          <!-- ── Type projet : E-commerce ou Site web ───────────── -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
              E-commerce ou site web <span class="text-red-500">*</span>
              <button type="button" @click="showTypeInfo = !showTypeInfo"
                class="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </label>
            <select
              id="type"
              name="type"
              v-model="boutiqueForm.type"
              required
              class="block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary bg-white"
            >
              <option value="e-commerce">E-commerce</option>
              <option value="website">Site web</option>
            </select>
            <transition name="fade">
              <p v-if="showTypeInfo" class="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <span v-if="isWebsite" class="block">
                  <strong class="text-blue-700">Site web :</strong> Site vitrine pour présenter votre activité sans fonction de commande en ligne.
                </span>
                <span v-else class="block">
                  <strong class="text-blue-700">E-commerce :</strong> Vos clients pourront passer commande et acheter en ligne ou payer à la livraison.
                </span>
              </p>
            </transition>

            <!--
              Bandeau informatif quand "Site web" est sélectionné.
              Explique pourquoi certains champs sont grisés.
            -->
            <transition name="fade">
              <div v-if="isWebsite" class="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded p-3">
                <svg class="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <p class="text-xs text-blue-700">
                  En mode <strong>Site web</strong>, le type de produit, la devise et la catégorie sont facultatifs — votre site est un vitrine sans vente en ligne.
                </p>
              </div>
            </transition>
          </div>

          <!-- ── Type de produit (grisé et non-obligatoire si site web) ── -->
          <div>
            <label for="productType" class="block text-sm font-medium mb-1"
              :class="isWebsite ? 'text-gray-400' : 'text-gray-700'"
            >
              Type de produit
              <span v-if="!isWebsite" class="text-red-500">*</span>
              <span v-else class="text-gray-400 font-normal">(non applicable)</span>
              <button type="button" @click="showProductTypeInfo = !showProductTypeInfo"
                class="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs focus:outline-none"
                :class="isWebsite ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'"
                :disabled="isWebsite"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </label>
            <select
              id="productType"
              name="productType"
              v-model="boutiqueForm.productType"
              :disabled="isWebsite"
              :required="!isWebsite"
              class="block w-full px-3 py-2 border-0 border-b-2 text-gray-900 focus:outline-none focus:ring-0 bg-white transition-colors duration-200"
              :class="isWebsite
                ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed opacity-60'
                : 'border-gray-300 focus:border-primary'"
            >
              <option value="physical">Produits physiques</option>
              <option value="digital">Produits numériques</option>
            </select>
            <transition name="fade">
              <p v-if="showProductTypeInfo && !isWebsite" class="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <span v-if="isDigitalShop" class="block">
                  <strong class="text-blue-700">Produits numériques :</strong> Fichiers téléchargeables (ebooks, logiciels, musique, PDF, etc.). Pas de gestion de stock ni de livraison.
                </span>
                <span v-else class="block">
                  <strong class="text-blue-700">Produits physiques :</strong> Articles nécessitant une livraison (vêtements, électronique, etc.). Gestion du stock et des livraisons incluse.
                </span>
              </p>
            </transition>

            <!--
              Bandeau informatif quand "Produits numériques" est sélectionné.
              Prévient le vendeur des différences dans son dashboard.
            -->
            <transition name="fade">
              <div v-if="isDigitalShop && !isWebsite" class="mt-3 flex items-start gap-2 bg-purple-50 border border-purple-200 rounded p-3">
                <svg class="w-4 h-4 text-purple-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z"/>
                  <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd"/>
                </svg>
                <div class="text-xs text-purple-700">
                  <strong>Dashboard produits numériques :</strong> votre espace vendeur sera adapté — pas de gestion de stock, pas de module livraison. Vous pourrez attacher un fichier à télécharger (ZIP, PDF, MP4…) à chaque produit. Les avis clients restent disponibles.
                </div>
              </div>
            </transition>
          </div>

          <!-- ── Catégorie principale (grisée si site web) ────────── -->
          <div>
            <label for="category" class="block text-sm font-medium mb-1"
              :class="isWebsite ? 'text-gray-400' : 'text-gray-700'"
            >
              Catégorie principale
              <span v-if="!isWebsite" class="text-red-500">*</span>
              <span v-else class="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <select
              id="category"
              name="category"
              v-model="boutiqueForm.category_id"
              :disabled="isWebsite || categoriesLoading"
              :required="!isWebsite"
              class="block w-full px-3 py-2 border-0 border-b-2 text-gray-900 focus:outline-none focus:ring-0 bg-white transition-colors duration-200"
              :class="isWebsite
                ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed opacity-60'
                : 'border-gray-300 focus:border-primary'"
            >
              <option value="" disabled>
                {{ categoriesLoading ? 'Chargement…' : isWebsite ? 'Non applicable' : 'Sélectionnez une catégorie' }}
              </option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- ── Sous-catégorie (affichée si catégorie sélectionnée et pas site web) -->
          <div v-if="boutiqueForm.category_id && !isWebsite">
            <label for="subcategory" class="block text-sm font-medium text-gray-700 mb-1">
              Sous-catégorie <span class="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <select
              id="subcategory"
              name="subcategory"
              v-model="boutiqueForm.subcategory_id"
              class="block w-full px-3 py-2 border-0 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary bg-white"
              :disabled="subcategoriesLoading"
            >
              <option :value="null">
                {{ subcategoriesLoading ? 'Chargement…' : '— Aucune sous-catégorie —' }}
              </option>
              <option v-for="sub in subcategories" :key="sub.id" :value="sub.id">
                {{ sub.name }}
              </option>
            </select>
            <p v-if="!subcategoriesLoading && subcategories.length === 0" class="mt-1 text-xs text-gray-400 italic">
              Aucune sous-catégorie pour cette catégorie.
            </p>
          </div>

          <!-- ── Devise (grisée si site web) ──────────────────────── -->
          <div>
            <label for="currency" class="block text-sm font-medium mb-1"
              :class="isWebsite ? 'text-gray-400' : 'text-gray-700'"
            >
              Devise
              <span v-if="!isWebsite" class="text-red-500">*</span>
              <span v-else class="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <select
              id="currency"
              name="currency"
              v-model="boutiqueForm.currency"
              :disabled="isWebsite"
              :required="!isWebsite"
              class="block w-full px-3 py-2 border-0 border-b-2 text-gray-900 focus:outline-none focus:ring-0 bg-white transition-colors duration-200"
              :class="isWebsite
                ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed opacity-60'
                : 'border-gray-300 focus:border-primary'"
            >
              <option value="XOF">Franc CFA (XOF)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dollar US (USD)</option>
            </select>
            <p v-if="!isWebsite" class="mt-1 text-xs text-gray-500">
              La devise ne pourra plus être modifiée après création
            </p>
          </div>

          <!-- ── Sous-domaine ──────────────────────────────────────── -->
          <div class="sm:col-span-2">
            <label for="domain" class="block text-sm font-medium text-gray-700 mb-1">
              Sous-domaine personnalisé <span class="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <div class="mt-1 flex items-center">
              <input
                type="text"
                name="domain"
                id="domain"
                v-model="boutiqueForm.domain"
                @input="sanitizeSubdomain"
                placeholder="ex: jeansfashion"
                pattern="[a-z0-9-]+"
                class="block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              >
              <span class="ml-2 text-gray-500 whitespace-nowrap">.uber-market.com</span>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Si laissé vide, le nom de votre {{ isWebsite ? 'site' : 'boutique' }} sera utilisé automatiquement. Lettres minuscules, chiffres et tirets uniquement.
            </p>
            <p v-if="boutiqueForm.domain" class="mt-1 text-sm text-primary font-medium">
              Votre {{ isWebsite ? 'site' : 'boutique' }} sera accessible sur :
              <span class="font-semibold">{{ boutiqueForm.domain }}.uber-market.com</span>
            </p>
          </div>
        </div>

        <!-- ── Message d'erreur global ────────────────────────────── -->
        <div v-if="submitError" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg" role="alert">
          <span class="block sm:inline">{{ submitError }}</span>
        </div>

        <!-- ── Boutons d'action ───────────────────────────────────── -->
        <div class="flex justify-end space-x-3 pt-4">
          <NuxtLink
            to="/mes-boutiques"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Annuler
          </NuxtLink>
          <button
            type="submit"
            :disabled="isSubmitting"
            :class="{'opacity-50 cursor-not-allowed': isSubmitting, 'hover:bg-secondary': !isSubmitting}"
            class="relative px-4 py-2 bg-primary text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span v-if="isSubmitting" class="inline-flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création en cours…
            </span>
            <span v-else>{{ isWebsite ? 'Créer le site' : 'Créer la boutique' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- ── Message de succès ─────────────────────────────────────── -->
    <div v-if="showSuccessMessage" class="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
      <div class="flex">
        <svg class="h-5 w-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-green-800">
            {{ isWebsite ? 'Votre site web est prêt !' : 'Votre boutique est prête !' }}
          </h3>
          <p class="mt-2 text-sm text-green-700">
            {{ isDigitalShop && !isWebsite
              ? 'Commencez à ajouter vos produits numériques.'
              : 'Commencez à ajouter des produits.' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { ShopData } from '~/types/auth'
import { useShops } from '~/composables/useShops'
import type { Category } from '~/composables/useCategories'
import { useCategories } from '~/composables/useCategories'

const router = useRouter()
const { createShop } = useShops()
const {
  categories, fetchCategories, isLoading: categoriesLoading,
  subcategories, subcategoriesLoading, fetchSubcategories
} = useCategories()

// ── État UI ──────────────────────────────────────────────────────
const showSuccessMessage  = ref(false)
const isSubmitting        = ref(false)
const submitError         = ref('')
const showTypeInfo        = ref(false)
const showProductTypeInfo = ref(false)

// ── Formulaire ───────────────────────────────────────────────────
const boutiqueForm = reactive({
  name:         '',
  type:         'e-commerce' as 'e-commerce' | 'website',
  productType:  'physical'   as 'physical' | 'digital',
  category_id:  null         as number | null,
  subcategory_id: null       as number | null,
  logo:         null         as File | null,
  logoPreview:  '',
  color:        '#FF0000',
  description:  '',
  domain:       '',
  themeId:      1,
  currency:     'XOF'        as 'EUR' | 'USD' | 'XOF'
})

// ─────────────────────────────────────────────────────────────────
// COMPUTED — déterminants du comportement conditionnel
// ─────────────────────────────────────────────────────────────────

/**
 * isWebsite — true si le type de projet est "Site web".
 * Quand true :
 *  - type de produit → grisé, non obligatoire
 *  - devise         → grisée, non obligatoire
 *  - catégorie      → grisée, non obligatoire
 *  - libellés et bouton adaptés
 */
const isWebsite = computed(() => boutiqueForm.type === 'website')

/**
 * isDigitalShop — true si le type de produit est "Produits numériques"
 * ET que c'est bien un e-commerce (pas un site vitrine).
 * Quand true → bandeau informatif + dashboard adapté après création.
 */
const isDigitalShop = computed(() => boutiqueForm.productType === 'digital' && !isWebsite.value)

// ─────────────────────────────────────────────────────────────────
// WATCHERS
// ─────────────────────────────────────────────────────────────────

/**
 * Réinitialiser les champs dépendants quand le type de projet change.
 * - Passage à "Site web" → vider catégorie, sous-cat, forcer productType physical
 * - Retour à "E-commerce" → rien à faire, les valeurs précédentes restent
 */
watch(() => boutiqueForm.type, (newType) => {
  if (newType === 'website') {
    // On vide les champs non-pertinents pour un site vitrine
    boutiqueForm.category_id    = null
    boutiqueForm.subcategory_id = null
    boutiqueForm.productType    = 'physical' // valeur neutre par défaut
  }
})

// Recharger les sous-catégories quand la catégorie change
watch(() => boutiqueForm.category_id, async (newId) => {
  boutiqueForm.subcategory_id = null
  if (newId) await fetchSubcategories(newId)
})

// ─────────────────────────────────────────────────────────────────
// INITIALISATION
// ─────────────────────────────────────────────────────────────────

onMounted(async () => {
  await fetchCategories()
})

// ─────────────────────────────────────────────────────────────────
// GESTION DU LOGO
// ─────────────────────────────────────────────────────────────────

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file   = target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('Le fichier est trop volumineux. Taille maximale : 2 Mo.')
    return
  }
  if (!file.type.match('image/png') && !file.type.match('image/jpeg')) {
    alert('Format de fichier non supporté. Formats acceptés : PNG, JPEG.')
    return
  }

  boutiqueForm.logo = file
  const reader = new FileReader()
  reader.onload = (e) => { boutiqueForm.logoPreview = e.target?.result as string }
  reader.readAsDataURL(file)
}

// ─────────────────────────────────────────────────────────────────
// SANITISATION DU SOUS-DOMAINE
// ─────────────────────────────────────────────────────────────────

const sanitizeSubdomain = () => {
  boutiqueForm.domain = boutiqueForm.domain
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─────────────────────────────────────────────────────────────────
// SOUMISSION DU FORMULAIRE
//
// Règles de validation selon le type de projet :
//  - Site web : seul le nom est obligatoire
//  - E-commerce physique : nom + catégorie + devise obligatoires
//  - E-commerce numérique : idem + pas de stock/livraison dans le dashboard
// ─────────────────────────────────────────────────────────────────

const createBoutique = async () => {
  submitError.value = ''

  // Validation minimale : le nom est toujours requis
  if (!boutiqueForm.name.trim()) {
    submitError.value = `Le nom de la ${isWebsite.value ? 'site' : 'boutique'} est obligatoire.`
    return
  }

  // Pour un e-commerce, la catégorie est obligatoire
  if (!isWebsite.value && !boutiqueForm.category_id) {
    submitError.value = 'Veuillez sélectionner une catégorie.'
    return
  }

  isSubmitting.value = true
  try {
    const shopData: ShopData = {
      name:          boutiqueForm.name,
      shop_type:     boutiqueForm.type,
      // Pour un site web, product_type est envoyé comme 'physical' par défaut
      // mais le backend ignorera stock/livraison selon shop_type = 'website'
      product_type:  isWebsite.value ? 'physical' : boutiqueForm.productType,
      category_id:   boutiqueForm.category_id   || undefined,
      subcategory_id:boutiqueForm.subcategory_id || undefined,
      description:   boutiqueForm.description,
      primary_color: boutiqueForm.color,
      logo:          boutiqueForm.logo           || undefined,
      theme_id:      boutiqueForm.themeId,
      currency:      isWebsite.value ? 'XOF' : boutiqueForm.currency,
      subdomain:     boutiqueForm.domain         || undefined
    }

    const response = await createShop(shopData)
    if (response.success) {
      showSuccessMessage.value = true
      // Réinitialiser le formulaire
      Object.assign(boutiqueForm, {
        name: '', type: 'e-commerce', productType: 'physical',
        category_id: null, subcategory_id: null, logo: null,
        logoPreview: '', color: '#FF0000', description: '', domain: ''
      })
      // Redirection automatique après 2s
      setTimeout(() => { router.push('/mes-boutiques') }, 2000)
    }
  } catch (error: any) {
    console.error('Erreur création boutique:', error)
    submitError.value = error.message || 'Une erreur est survenue lors de la création.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; transform: translateY(-10px); }
.fade-enter-to, .fade-leave-from       { opacity: 1; transform: translateY(0); }
</style>
