<template>
  <div class="max-w-7xl mx-auto">

    <!-- ══ En-tête avec stats rapides ══════════════════════════════ -->
    <div class="mb-6">
      <h1 class="text-xl font-bold text-gray-900">Produits numériques</h1>
      <p class="text-sm text-gray-500 mt-1">Gérez vos fichiers téléchargeables — pas de stock ni de livraison</p>
    </div>

    <!-- Cartes de statistiques (adaptées au digital : pas de stock) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      <!-- Total produits -->
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Produits</span>
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ stats.totalProducts }}</p>
        <p class="text-xs text-gray-400 mt-1">fichiers en ligne</p>
      </div>

      <!-- Ventes totales -->
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Ventes</span>
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ stats.totalSales }}</p>
        <p class="text-xs text-gray-400 mt-1">téléchargements payés</p>
      </div>

      <!-- Revenus -->
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Revenus</span>
          <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.totalRevenue) }}</p>
        <p class="text-xs text-gray-400 mt-1">ce mois-ci</p>
      </div>

      <!-- Avis clients (conservé pour le digital) -->
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Avis</span>
          <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—' }}</p>
        <p class="text-xs text-gray-400 mt-1">note moyenne ({{ stats.totalReviews }} avis)</p>
      </div>
    </div>

    <!-- ══ Barre d'outils : recherche + filtre + bouton ajout ══════ -->
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

        <!-- Recherche par nom -->
        <div class="relative flex-1 max-w-sm">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher un produit…"
            class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <!-- Filtre par statut -->
        <select
          v-model="statusFilter"
          class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>

        <!-- Bouton ajouter un produit numérique -->
        <NuxtLink
          :to="`/dashboard-vendor/${currentShop?.slug}/products/ajouter-produit`"
          class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors whitespace-nowrap"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Ajouter un produit numérique
        </NuxtLink>
      </div>
    </div>

    <!-- ══ Loader ═══════════════════════════════════════════════════ -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- ══ Liste des produits numériques ════════════════════════════ -->
    <div v-else-if="filteredProducts.length > 0" class="space-y-3">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
      >
        <div class="flex items-start gap-4">

          <!-- Miniature du produit -->
          <div class="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
            <img
              v-if="product.preview_image"
              :src="product.preview_image"
              :alt="product.name"
              class="w-full h-full object-cover"
              @contextmenu.prevent
              @dragstart.prevent
              draggable="false"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <!-- Icône fichier par défaut si pas d'image -->
              <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>

          <!-- Infos produit -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 truncate">{{ product.name }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ product.subcategory?.name || 'Sans catégorie' }}
                </p>
              </div>
              <!-- Badge statut -->
              <span
                class="shrink-0 px-2 py-0.5 text-xs font-medium rounded-full"
                :class="product.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'"
              >
                {{ product.status === 'active' ? 'Actif' : 'Inactif' }}
              </span>
            </div>

            <!-- Ligne prix + indicateurs digitaux -->
            <div class="flex items-center gap-4 mt-2 flex-wrap">
              <span class="text-sm font-bold text-primary">
                {{ formatCurrency(product.price) }}
              </span>
              <!-- Type fichier (si disponible) -->
              <span v-if="product.digital_file" class="inline-flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                {{ getFileExtension(product.digital_file) }}
              </span>
              <!-- Ventes -->
              <span class="text-xs text-gray-500">
                {{ product.sales_count || 0 }} vente{{ (product.sales_count || 0) > 1 ? 's' : '' }}
              </span>
              <!-- Note moyenne -->
              <span v-if="product.reviews_count > 0" class="inline-flex items-center gap-1 text-xs text-yellow-600">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                {{ product.average_rating?.toFixed(1) }} ({{ product.reviews_count }})
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0">
            <!-- Modifier -->
            <NuxtLink
              :to="`/dashboard-vendor/${currentShop?.slug}/products/modifier-produit/${product.id}`"
              class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
              title="Modifier"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </NuxtLink>
            <!-- Voir les avis -->
            <NuxtLink
              :to="`/dashboard-vendor/${currentShop?.slug}/products/${product.id}/avis`"
              class="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Voir les avis clients"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </NuxtLink>
            <!-- Supprimer -->
            <button
              @click="confirmDelete(product)"
              class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ État vide ════════════════════════════════════════════════ -->
    <div v-else class="bg-white border border-gray-200 rounded-lg p-12 text-center">
      <div class="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      </div>
      <h3 class="text-sm font-semibold text-gray-900 mb-1">
        {{ searchQuery || statusFilter ? 'Aucun résultat' : 'Aucun produit numérique' }}
      </h3>
      <p class="text-sm text-gray-500 mb-4">
        {{ searchQuery || statusFilter
          ? 'Essayez de modifier vos critères de recherche.'
          : 'Commencez par ajouter votre premier fichier téléchargeable (PDF, ZIP, MP4…).' }}
      </p>
      <NuxtLink
        v-if="!searchQuery && !statusFilter"
        :to="`/dashboard-vendor/${currentShop?.slug}/products/ajouter-produit`"
        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        Ajouter mon premier produit numérique
      </NuxtLink>
    </div>

    <!-- ══ Modal de confirmation de suppression ═════════════════════ -->
    <div v-if="productToDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 class="text-base font-semibold text-gray-900 mb-2">Supprimer ce produit ?</h3>
        <p class="text-sm text-gray-600 mb-4">
          <strong>{{ productToDelete.name }}</strong> sera définitivement supprimé, ainsi que son fichier téléchargeable. Cette action est irréversible.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="productToDelete = null"
            class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="deleteProduct"
            :disabled="isDeleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {{ isDeleting ? 'Suppression…' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══ Toast de notification ════════════════════════════════════ -->
    <transition name="toast">
      <div
        v-if="toast.visible"
        class="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium"
        :class="toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'"
      >
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useShops } from '~/composables/useShops'
import { useProducts } from '~/composables/useProducts'

// ── Méta : layout dashboard, middleware accès boutique ────────────
definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})

const { currentShop } = useShops()
const { fetchProducts, deleteProduct: deleteProductApi } = useProducts()

// ── État local ────────────────────────────────────────────────────
const products      = ref<any[]>([])
const isLoading     = ref(true)
const isDeleting    = ref(false)
const searchQuery   = ref('')
const statusFilter  = ref('')
const productToDelete = ref<any>(null)

// Toast de notification
const toast = ref({ visible: false, message: '', type: 'success' as 'success' | 'error' })

// ─────────────────────────────────────────────────────────────────
// STATISTIQUES — calculées depuis la liste des produits chargés
// Pas de stock ni de livraison pour le digital.
// ─────────────────────────────────────────────────────────────────
const stats = computed(() => ({
  totalProducts: products.value.length,
  totalSales:    products.value.reduce((sum, p) => sum + (p.sales_count || 0), 0),
  totalRevenue:  products.value.reduce((sum, p) => sum + (p.sales_count || 0) * (p.price || 0), 0),
  totalReviews:  products.value.reduce((sum, p) => sum + (p.reviews_count || 0), 0),
  averageRating: (() => {
    const rated = products.value.filter(p => p.reviews_count > 0)
    if (rated.length === 0) return 0
    return rated.reduce((sum, p) => sum + (p.average_rating || 0), 0) / rated.length
  })()
}))

// ─────────────────────────────────────────────────────────────────
// FILTRAGE — recherche par nom + filtre par statut
// ─────────────────────────────────────────────────────────────────
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = !searchQuery.value
      || p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value
      || p.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

// ─────────────────────────────────────────────────────────────────
// CHARGEMENT DES PRODUITS
// ─────────────────────────────────────────────────────────────────

/**
 * loadProducts — charge la liste des produits de la boutique courante.
 * Utilise fetchProducts() du composable useProducts (même que les boutiques physiques).
 * Le filtrage numérique est géré par product_type === 'digital' sur la boutique,
 * le backend ne retourne que les produits correspondants.
 */
const loadProducts = async () => {
  if (!currentShop.value) return

  isLoading.value = true
  try {
    const result = await fetchProducts(currentShop.value.id)
    products.value = result || []
  } catch (err) {
    console.error('Erreur chargement produits numériques:', err)
    showToast('Erreur lors du chargement des produits', 'error')
  } finally {
    isLoading.value = false
  }
}

// ─────────────────────────────────────────────────────────────────
// SUPPRESSION
// ─────────────────────────────────────────────────────────────────

/** Ouvrir la modale de confirmation avant suppression */
const confirmDelete = (product: any) => {
  productToDelete.value = product
}

/**
 * deleteProduct — supprime le produit et son fichier numérique associé.
 * La suppression du fichier côté serveur est gérée par le backend
 * (Storage::delete dans ProductController).
 */
const deleteProduct = async () => {
  if (!productToDelete.value || !currentShop.value) return

  isDeleting.value = true
  try {
    await deleteProductApi(currentShop.value.id, productToDelete.value.id)
    // Retirer le produit de la liste locale sans recharger
    products.value = products.value.filter(p => p.id !== productToDelete.value.id)
    showToast('Produit supprimé avec succès', 'success')
  } catch (err: any) {
    showToast(err.message || 'Erreur lors de la suppression', 'error')
  } finally {
    isDeleting.value  = false
    productToDelete.value = null
  }
}

// ─────────────────────────────────────────────────────────────────
// UTILITAIRES
// ─────────────────────────────────────────────────────────────────

/**
 * formatCurrency — formate un montant avec la devise de la boutique.
 * Utilise currentShop.currency en priorité (ex: XOF, EUR, USD).
 */
const formatCurrency = (amount: number) => {
  const currency = currentShop.value?.currency || 'XOF'
  try {
    return new Intl.NumberFormat('fr-FR', {
      style:    'currency',
      currency,
      maximumFractionDigits: currency === 'XOF' ? 0 : 2
    }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

/**
 * getFileExtension — extrait l'extension du fichier numérique
 * pour l'afficher comme badge (ex: "PDF", "ZIP", "MP4").
 */
const getFileExtension = (filePath: string): string => {
  if (!filePath) return 'Fichier'
  const ext = filePath.split('.').pop()?.toUpperCase()
  return ext || 'Fichier'
}

/** Afficher un toast de notification pendant 4 secondes */
const showToast = (message: string, type: 'success' | 'error') => {
  toast.value = { visible: true, message, type }
  setTimeout(() => { toast.value.visible = false }, 4000)
}

// ─────────────────────────────────────────────────────────────────
// INITIALISATION
// ─────────────────────────────────────────────────────────────────

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
/* Animation du toast de notification */
.toast-enter-active { transition: all 0.3s ease-out; }
.toast-leave-active { transition: all 0.2s ease-in; }
.toast-enter-from,
.toast-leave-to     { transform: translateY(10px); opacity: 0; }
</style>
