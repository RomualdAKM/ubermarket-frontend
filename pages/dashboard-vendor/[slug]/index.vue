<template>
  <div class="bg-white">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Tableau de bord vendeur</h1>
      <p class="text-gray-600">Bienvenue sur votre espace de gestion</p>
    </div>

    <!-- Statistiques générales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white p-6 border-r border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Commandes</h3>
            <p class="text-2xl font-semibold text-gray-900">23</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 border-r border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Revenus</h3>
            <p class="text-2xl font-semibold text-primary">1 254 €</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 border-r border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Produits</h3>
            <p class="text-2xl font-semibold text-gray-900">42</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 border-r border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Clients</h3>
            <p class="text-2xl font-semibold text-gray-900">18</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Commandes récentes -->
    <div class="bg-white p-6 border-t border-gray-200 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-900">Commandes récentes</h2>
        <NuxtLink :to="getDashboardLink('orders/commandes')" class="text-sm font-medium text-blue-600 hover:text-blue-800">
          Voir toutes les commandes
        </NuxtLink>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-2305</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jean Dupont</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18/07/2023</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">125,90 €</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold bg-green-100 text-green-800">
                  Livré
                </span>
              </td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-2304</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Marie Martin</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">17/07/2023</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">89,00 €</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold bg-blue-100 text-blue-800">
                  En transit
                </span>
              </td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-2303</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Paul Durand</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16/07/2023</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45,50 €</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold bg-purple-100 text-purple-800">
                  Préparation
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Produits populaires -->
    <div class="bg-white p-6 border-t border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-900">Produits populaires</h2>
        <NuxtLink :to="getDashboardLink('products/produits')" class="text-sm font-medium text-blue-600 hover:text-blue-800">
          Gérer les produits
        </NuxtLink>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventes</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="bg-gray-200 border-2 border-dashed w-10 h-10" />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">T-shirt casual</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Vêtements</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">29,90 €</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">42</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15</td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="bg-gray-200 border-2 border-dashed w-10 h-10" />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">Casque audio</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Électronique</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">89,90 €</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">28</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5</td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="bg-gray-200 border-2 border-dashed w-10 h-10" />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">Lampe de bureau</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maison</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">34,90 €</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">19</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const getDashboardLink = (path: string = '') => {
  return `/dashboard-vendor/${slug}/${path}`
}

definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})
</script>