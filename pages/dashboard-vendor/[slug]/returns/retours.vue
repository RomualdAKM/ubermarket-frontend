<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Retours produits</h1>
        <p class="text-gray-600">Gérez les demandes de retour de vos clients</p>
      </div>
      <button class="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
        Politique de retour
      </button>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white p-6 border-r border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-lg font-medium text-gray-800">Total retours</h2>
            <p class="text-2xl font-semibold">24</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 border-r border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-lg font-medium text-gray-800">En attente</h2>
            <p class="text-2xl font-semibold">8</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 border-r border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-lg font-medium text-gray-800">Acceptés</h2>
            <p class="text-2xl font-semibold">12</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 border-r border-gray-200">
        <div class="flex items-center">
          <div class="p-3 bg-red-100 rounded">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-lg font-medium text-gray-800">Refusés</h2>
            <p class="text-2xl font-semibold">4</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white p-4  mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div class="flex space-x-4">
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
            <select id="status" name="status" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
              <option>Tous</option>
              <option>En attente</option>
              <option>Accepté</option>
              <option>Refusé</option>
              <option>En cours</option>
              <option>Terminé</option>
            </select>
          </div>
          
          <div>
            <label for="period" class="block text-sm font-medium text-gray-700">Période</label>
            <select id="period" name="period" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
              <option>30 derniers jours</option>
              <option>3 derniers mois</option>
              <option>12 derniers mois</option>
            </select>
          </div>
        </div>
        
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input type="text" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md rounded focus:outline-none focus:ring-secondary focus:border-secondary" placeholder="Rechercher...">
        </div>
      </div>
    </div>

    <!-- Liste des retours -->
    <div class="bg-white ">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retour</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motif</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#RET-001</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">Jean Dupont</div>
                <div class="text-sm text-gray-500">jean.dupont@email.com</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">T-shirt casual - M</td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                <div class="truncate max-w-xs">Taille incorrecte</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12/08/2025</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  En attente
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-secondary mr-3">Traiter</button>
                <button class="text-gray-600 hover:text-gray-900">Détails</button>
              </td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#RET-002</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">Marie Martin</div>
                <div class="text-sm text-gray-500">marie.martin@email.com</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Casque audio</td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                <div class="truncate max-w-xs">Produit défectueux</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">11/08/2025</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Accepté
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-secondary mr-3">Traiter</button>
                <button class="text-gray-600 hover:text-gray-900">Détails</button>
              </td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#RET-003</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">Pierre Durand</div>
                <div class="text-sm text-gray-500">pierre.durand@email.com</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Lampe de bureau</td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                <div class="truncate max-w-xs">Produit ne correspond pas à la description</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10/08/2025</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Refusé
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-secondary mr-3">Traiter</button>
                <button class="text-gray-600 hover:text-gray-900">Détails</button>
              </td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#RET-004</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">Sophie Lambert</div>
                <div class="text-sm text-gray-500">sophie.lambert@email.com</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Chaussures de sport - 42</td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                <div class="truncate max-w-xs">Changement d'avis</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">09/08/2025</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  En cours
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-secondary mr-3">Traiter</button>
                <button class="text-gray-600 hover:text-gray-900">Détails</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Précédent
          </a>
          <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Suivant
          </a>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Affichage de <span class="font-medium">1</span> à <span class="font-medium">4</span> sur <span class="font-medium">24</span> résultats
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Précédent</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </a>
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Suivant</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
</script>