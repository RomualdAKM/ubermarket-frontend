<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Paramètres</h1>
      <p class="text-gray-600">Gérez les paramètres de votre compte et de vos boutiques</p>
    </div>

    <!-- Navigation des paramètres -->
    <div class="bg-white border-t border-gray-200 mb-6">
      <div>
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button @click="activeTab = 'general'" :class="[activeTab === 'general' ? 'border-secondary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Général
          </button>
          <button @click="activeTab = 'paiement'" :class="[activeTab === 'paiement' ? 'border-secondary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Paiement
          </button>
          <button @click="activeTab = 'notifications'" :class="[activeTab === 'notifications' ? 'border-secondary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Notifications
          </button>
          <button @click="activeTab = 'collaborateurs'" :class="[activeTab === 'collaborateurs' ? 'border-secondary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Collaborateurs
          </button>
        </nav>
      </div>
    </div>

    <!-- Section Général -->
    <div v-if="activeTab === 'general'" class="bg-white p-6 border-t border-gray-200">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Paramètres généraux</h2>
      
      <form class="space-y-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nom complet</label>
            <input type="text" name="name" id="name" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" value="Jean Dupont">
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" value="jean.dupont@email.com">
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone</label>
            <input type="text" name="phone" id="phone" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary" value="+33 6 12 34 56 78">
          </div>
          
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700">Pays</label>
            <select id="country" name="country" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
              <option>France</option>
              <option>Belgique</option>
              <option>Suisse</option>
            </select>
          </div>
        </div>
        
        <div>
          <label for="about" class="block text-sm font-medium text-gray-700">À propos</label>
          <textarea id="about" name="about" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"></textarea>
        </div>
        
        <div class="flex justify-end">
          <button type="submit" class="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
            Sauvegarder
          </button>
        </div>
      </form>
    </div>

    <!-- Section Paiement -->
    <div v-if="activeTab === 'paiement'" class="bg-white p-6 border-t border-gray-200">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Méthodes de paiement</h2>
      
      <div class="mb-6">
        <h3 class="text-md font-medium text-gray-900 mb-3">Devise par défaut</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="border border-gray-200 rounded p-4">
            <div class="flex items-center">
              <input id="euro" name="currency" type="radio" class="h-4 w-4 text-primary focus:ring-secondary" checked>
              <label for="euro" class="ml-3 block text-sm font-medium text-gray-700">Euro (€)</label>
            </div>
          </div>
          
          <div class="border border-gray-200 rounded p-4">
            <div class="flex items-center">
              <input id="dollar" name="currency" type="radio" class="h-4 w-4 text-primary focus:ring-secondary">
              <label for="dollar" class="ml-3 block text-sm font-medium text-gray-700">Dollar ($)</label>
            </div>
          </div>
          
          <div class="border border-gray-200 rounded p-4">
            <div class="flex items-center">
              <input id="xof" name="currency" type="radio" class="h-4 w-4 text-primary focus:ring-secondary">
              <label for="xof" class="ml-3 block text-sm font-medium text-gray-700">Franc CFA (XOF)</label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-200 rounded p-4 mb-6">
        <h3 class="text-md font-medium text-gray-900 mb-3">Paiements activés</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">PayPal</p>
                <p class="text-sm text-gray-500">Connecté</p>
              </div>
            </div>
            <button class="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">
              Déconnecter
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Mobile Money</p>
                <p class="text-sm text-gray-500">Connecté via Fedapay</p>
              </div>
            </div>
            <button class="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">
              Déconnecter
            </button>
          </div>
        </div>
      </div>
      
    </div>

    <!-- Section Notifications -->
    <div v-if="activeTab === 'notifications'" class="bg-white p-6 border-t border-gray-200">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Préférences de notification</h2>
      
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">Nouvelles commandes</p>
            <p class="text-sm text-gray-500">Recevoir une notification lors d'une nouvelle commande</p>
          </div>
          <button type="button" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 bg-primary" role="switch" aria-checked="true">
            <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5"></span>
          </button>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">Stock bas</p>
            <p class="text-sm text-gray-500">Recevoir une notification lorsque le stock d'un produit est bas</p>
          </div>
          <button type="button" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 bg-primary" role="switch" aria-checked="true">
            <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5"></span>
          </button>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">Nouveaux messages</p>
            <p class="text-sm text-gray-500">Recevoir une notification lors d'un nouveau message client</p>
          </div>
          <button type="button" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-200" role="switch" aria-checked="false">
            <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0"></span>
          </button>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">Rapports hebdomadaires</p>
            <p class="text-sm text-gray-500">Recevoir un résumé hebdomadaire des performances</p>
          </div>
          <button type="button" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-200" role="switch" aria-checked="false">
            <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Section Collaborateurs -->
    <div v-if="activeTab === 'collaborateurs'" class="bg-white p-6 border-t border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-900">Gestion des collaborateurs</h2>
        <button class="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
          Ajouter un collaborateur
        </button>
      </div>
      
      <div class=" rounded overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collaborateur</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
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
                    <div class="text-sm font-medium text-gray-900">Marie Martin</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">marie.martin@email.com</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Gestion des produits</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Actif
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
                    <div class="text-sm font-medium text-gray-900">Pierre Durand</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">pierre.durand@email.com</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Gestion des commandes</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Actif
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
      
      <!-- Formulaire d'ajout de collaborateur (caché par défaut) -->
      <div class="mt-6 bg-gray-50 p-4 border border-gray-200">
        <h3 class="text-md font-medium text-gray-900 mb-3">Ajouter un nouveau collaborateur</h3>
        
        <form class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="collab-name" class="block text-sm font-medium text-gray-700">Nom complet</label>
              <input type="text" name="collab-name" id="collab-name" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
            </div>
            
            <div>
              <label for="collab-email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="collab-email" id="collab-email" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
            </div>
            
            <div>
              <label for="collab-role" class="block text-sm font-medium text-gray-700">Rôle</label>
              <select id="collab-role" name="collab-role" class="mt-1 block w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                <option>Gestion des produits</option>
                <option>Gestion des commandes</option>
                <option>Gestion des clients</option>
                <option>Analyses</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button type="button" class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Annuler
            </button>
            <button type="submit" class="ml-3 px-3 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'shop-access'
})

const activeTab = ref('general')
</script>