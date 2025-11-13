<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Gestion des livreurs</h1>
        <p class="text-gray-600">Gérez vos livreurs</p>
      </div>
      <button @click="showAddForm = true" class="px-4 py-2 bg-primary rounded-md text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
        Ajouter un livreur
      </button>
    </div>

    <!-- Liste des livreurs -->
    <div class="bg-white mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livreur</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone de couverture</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">Pierre Martin</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">pierre.martin@email.com</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+33 6 12 34 56 78</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Paris centre</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Disponible
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-secondary mr-3">Modifier</button>
                <button class="text-red-600 hover:text-red-900">Supprimer</button>
              </td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">Sophie Dubois</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">sophie.dubois@email.com</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+33 6 87 65 43 21</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Banlieue parisienne</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  En livraison
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-secondary mr-3">Modifier</button>
                <button class="text-red-600 hover:text-red-900">Supprimer</button>
              </td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">Jean Lambert</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">jean.lambert@email.com</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+33 6 11 22 33 44</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Province</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Disponible
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-secondary mr-3">Modifier</button>
                <button class="text-red-600 hover:text-red-900">Supprimer</button>
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
              Affichage de <span class="font-medium">1</span> à <span class="font-medium">3</span> sur <span class="font-medium">3</span> résultats
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
    
    <!-- Modal pour ajouter un livreur -->
    <Teleport to="body">
      <div v-if="showAddForm" class="modal-overlay" @click.self="showAddForm = false">
        <div class="modal-container rounded-md">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Ajouter un nouveau livreur</h2>
              <button @click="showAddForm = false" class="px-3 py-1 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                Fermer
              </button>
            </div>
            
            <form class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">Nom complet</label>
                  <input type="text" name="name" id="name" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="email" id="email" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input type="text" name="phone" id="phone" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="zone" class="block text-sm font-medium text-gray-700">Zone de couverture</label>
                  <input type="text" name="zone" id="zone" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
              </div>
              
              <div>
                <label for="vehicle" class="block text-sm font-medium text-gray-700">Type de véhicule</label>
                <select id="vehicle" name="vehicle" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                  <option>Vélo</option>
                  <option>Scooter</option>
                  <option>Voiture</option>
                  <option>Camionnette</option>
                </select>
              </div>
              
              <div class="flex justify-end">
                <button type="button" @click="showAddForm = false" class="px-4 rounded-md py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                  Annuler
                </button>
                <button type="submit" class="ml-3 px-4 py-2 bg-primary rounded-md text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                  Ajouter le livreur
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const showAddForm = ref(false)

definePageMeta({
  layout: 'dashboard'
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  background-color: white;
  max-width: 56rem;
  width: 100%;
  z-index: 1000;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
