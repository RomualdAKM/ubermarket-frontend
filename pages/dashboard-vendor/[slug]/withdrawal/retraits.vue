<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Retraits</h1>
      <p class="text-gray-600">Gérez vos demandes de retrait de fonds</p>
    </div>

    <!-- Solde disponible -->
    <div class="bg-white p-6 border-t border-gray-200 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-medium text-gray-900">Solde disponible</h2>
          <p class="text-3xl font-bold text-gray-900 mt-2">12 450,00 €</p>
        </div>
        <button class="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
          Demander un retrait
        </button>
      </div>
    </div>

    <!-- Formulaire de demande de retrait -->
    <div class="bg-white p-6 border-t border-gray-200 mb-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Demander un retrait</h2>
      
      <form class="space-y-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">Montant (€)</label>
            <input type="number" name="amount" id="amount" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" placeholder="Minimum 10 €">
          </div>
          
          <div>
            <label for="method" class="block text-sm font-medium text-gray-700">Méthode de retrait</label>
            <select id="method" name="method" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
              <option>PayPal</option>
              <option>Mobile Money</option>
              <option>Virement bancaire</option>
            </select>
          </div>
        </div>
        
        <div>
          <label for="details" class="block text-sm font-medium text-gray-700">Détails de retrait</label>
          <input type="text" name="details" id="details" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" placeholder="Email PayPal, numéro de téléphone, IBAN, etc.">
        </div>
        
        <div class="flex justify-end">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
            Annuler
          </button>
          <button type="submit" class="ml-3 px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
            Demander le retrait
          </button>
        </div>
      </form>
    </div>

    <!-- Historique des retraits -->
    <div class="bg-white border-t border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Historique des retraits</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15/08/2025</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2 500,00 €</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PayPal</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">jean.dupont@email.com</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Complété
                </span>
              </td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">01/08/2025</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1 800,00 €</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mobile Money</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+33 6 12 34 56 78</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Complété
                </span>
              </td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">18/07/2025</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3 200,00 €</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Virement bancaire</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">FR76 XXXX XXXX XXXX XXXX XXX</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  En attente
                </span>
              </td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">05/07/2025</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1 200,00 €</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PayPal</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">jean.dupont@email.com</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Refusé
                </span>
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
              Affichage de <span class="font-medium">1</span> à <span class="font-medium">4</span> sur <span class="font-medium">12</span> résultats
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

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: ['shop-access']
})
</script>