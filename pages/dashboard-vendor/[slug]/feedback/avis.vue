<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Avis clients</h1>
        <p class="text-gray-600">Gérez les avis et notes de vos clients</p>
      </div>
    </div>

    <!-- Statistiques -->
    <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <!-- Note moyenne -->
      <div class="bg-white border border-gray-200 rounded p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Note moyenne</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.average_rating }}/5</p>
          </div>
        </div>
      </div>

      <!-- Avis positifs -->
      <div class="bg-white border border-gray-200 rounded p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded bg-green-50 flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Avis positifs</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.positive_percentage }}%</p>
          </div>
        </div>
      </div>

      <!-- Total avis -->
      <div class="bg-white border border-gray-200 rounded p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded bg-yellow-50 flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total avis</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.total_reviews }}</p>
          </div>
        </div>
      </div>

      <!-- Réponse rapide -->
      <div class="bg-white border border-gray-200 rounded p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded bg-purple-50 flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Réponse rapide</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.average_response_time }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="error" class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
      {{ error }}
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="bg-white p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      <p class="mt-2 text-gray-600">Chargement des avis...</p>
    </div>

    <!-- Liste des avis -->
    <div v-else-if="filteredReviews.length > 0" class="bg-white border border-gray-200 rounded">
      <!-- Filtres -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <select 
              v-model="selectedRating" 
              class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="all">Toutes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
          </div>

          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un client, produit..."
                class="w-full px-3 py-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- En-têtes du tableau -->
      <div class="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
        <div class="col-span-2">Client</div>
        <div class="col-span-2">Produit</div>
        <div class="col-span-1">Note</div>
        <div class="col-span-4">Commentaire</div>
        <div class="col-span-2">Date</div>
        <div class="col-span-1">Statut</div>
      </div>

      <!-- Liste -->
      <div class="divide-y divide-gray-200">
        <div 
          v-for="review in filteredReviews" 
          :key="review.id"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <!-- Client -->
            <div class="md:col-span-2">
              <p class="font-medium text-gray-900">{{ review.user.name }}</p>
              <p class="text-sm text-gray-500">{{ review.user.email }}</p>
            </div>

            <!-- Produit -->
            <div class="md:col-span-2">
              <p class="font-medium text-gray-900">{{ review.product.name }}</p>
            </div>

            <!-- Note (étoiles) -->
            <div class="md:col-span-1">
              <div class="flex items-center gap-1">
                <span 
                  v-for="star in 5" 
                  :key="star"
                  :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
                <span class="ml-1 text-sm text-gray-600">{{ review.rating }}/5</span>
              </div>
            </div>

            <!-- Commentaire -->
            <div class="md:col-span-4">
              <p class="text-gray-700 text-sm line-clamp-2">
                {{ review.comment || 'Aucun commentaire' }}
              </p>
            </div>

            <!-- Date -->
            <div class="md:col-span-2">
              <p class="text-sm text-gray-600">{{ formatDate(review.created_at) }}</p>
            </div>

            <!-- Statut -->
            <div class="md:col-span-1">
              <span 
                v-if="review.is_verified_purchase"
                class="inline-block px-2 py-1 text-xs font-medium rounded bg-green-50 text-green-700"
              >
                Vérifié
              </span>
              <span 
                v-else
                class="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600"
              >
                Non vérifié
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="bg-white border border-gray-200 rounded p-12 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Aucun avis pour le moment</h3>
      <p class="mt-2 text-gray-600">Les avis de vos clients apparaîtront ici</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'shop-access'
})

const route = useRoute()
const { reviews, stats, isLoading, error, fetchShopReviews } = useReviews()

const selectedRating = ref<string>('all')
const searchQuery = ref('')

// Charger les avis au montage
onMounted(async () => {
  const shopSlug = route.params.slug as string
  await fetchShopReviews(shopSlug)
})

// Filtrer les avis
const filteredReviews = computed(() => {
  let filtered = reviews.value

  // Filtrer par note
  if (selectedRating.value !== 'all') {
    filtered = filtered.filter(review => review.rating === parseInt(selectedRating.value))
  }

  // Filtrer par recherche
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(review => 
      review.user.name.toLowerCase().includes(query) ||
      review.user.email.toLowerCase().includes(query) ||
      review.product.name.toLowerCase().includes(query) ||
      (review.comment && review.comment.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
