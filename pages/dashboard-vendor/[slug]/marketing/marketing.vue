<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Marketing</h1>
      <p class="text-gray-600">Connectez vos outils de suivi marketing</p>
    </div>

    <!-- Outils de suivi -->
    <div class="bg-white p-6 mb-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Outils de suivi</h2>
      
      <div class="space-y-6">
        <!-- Facebook Pixel -->
        <div class="border-b border-gray-200 rounded-md p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Facebook Pixel</p>
                <p class="text-sm text-gray-500">Suivez les conversions et optimisez vos campagnes Facebook</p>
              </div>
            </div>
            <div class="flex items-center">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Déconnecté
              </span>
            </div>
          </div>
          
          <div class="mt-4">
            <label for="pixel-id" class="block text-sm font-medium text-gray-700">ID du Pixel Facebook</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <input type="text" name="pixel-id" id="pixel-id" class="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md rounded-l-md focus:outline-none focus:ring-secondary focus:border-secondary" placeholder="Ex: 123456789012345">
              <button class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                Connecter
              </button>
            </div>
          </div>
        </div>
        
        <!-- Google Analytics -->
        <div class="border-b border-gray-200 rounded p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Google Analytics</p>
                <p class="text-sm text-gray-500">Analysez le trafic et le comportement des visiteurs</p>
              </div>
            </div>
            <div class="flex items-center">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connecté
              </span>
            </div>
          </div>
          
          <div class="mt-4">
            <label for="ga-id" class="block text-sm font-medium text-gray-700">ID de suivi Google Analytics</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <input type="text" name="ga-id" id="ga-id" class="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md rounded-l-md focus:outline-none focus:ring-secondary focus:border-secondary" value="G-XXXXXXXXXX" disabled>
              <button class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                Déconnecter
              </button>
            </div>
          </div>
        </div>
        
        <!-- Système.io -->
        <div class="border-b border-gray-200 rounded p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Système.io</p>
                <p class="text-sm text-gray-500">Automatisez vos campagnes email et marketing</p>
              </div>
            </div>
            <div class="flex items-center">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Déconnecté
              </span>
            </div>
          </div>
          
          <div class="mt-4">
            <label for="system-io-key" class="block text-sm font-medium text-gray-700">Clé API Système.io</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <input type="password" name="system-io-key" id="system-io-key" class="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md rounded-l-md focus:outline-none focus:ring-secondary focus:border-secondary" placeholder="Entrez votre clé API">
              <button class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                Connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Campagnes marketing -->
    <div class="bg-white p-6 ">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-900">Campagnes marketing</h2>
        <button @click="showCreateForm = true" class="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
          Créer une campagne
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campagne</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outil</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créée le</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Soldes d'été</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Facebook Pixel</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/07/2025</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="showCampaignDetails('Soldes d\'été', 'Facebook Pixel', 'Active', '15/07/2025')" class="text-primary hover:text-secondary mr-3">Voir</button>
                <button class="text-red-600 hover:text-red-900">Désactiver</button>
              </td>
            </tr>
            
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lancement collection automne</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Google Analytics</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  En pause
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/08/2025</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="showCampaignDetails('Lancement collection automne', 'Google Analytics', 'En pause', '01/08/2025')" class="text-primary hover:text-secondary mr-3">Voir</button>
                <button class="text-green-600 hover:text-green-900">Activer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal pour les détails de la campagne -->
    <Teleport to="body">
      <div v-if="showCampaignModal" class="modal-overlay" @click.self="showCampaignModal = false">
        <div class="modal-container rounded-md">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Détails de la campagne - {{ currentCampaign.name }}</h2>
              <button @click="showCampaignModal = false" class="px-3 py-1 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                Fermer
              </button>
            </div>
            
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom de la campagne</label>
                <div class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100">
                  {{ currentCampaign.name }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Outil de suivi</label>
                <div class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100">
                  {{ currentCampaign.tool }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Statut</label>
                <div class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100">
                  <span v-if="currentCampaign.status === 'Active'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {{ currentCampaign.status }}
                  </span>
                  <span v-else-if="currentCampaign.status === 'En pause'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {{ currentCampaign.status }}
                  </span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Date de création</label>
                <div class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100">
                  {{ currentCampaign.createdDate }}
                </div>
              </div>
            </div>
            
            <div class="border border-gray-200 p-4">
              <h3 class="text-md font-medium text-gray-900 mb-3">Statistiques de la campagne</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="border border-gray-200 p-3 text-center">
                  <p class="text-2xl font-bold text-gray-900">1 248</p>
                  <p class="text-sm text-gray-500">Impressions</p>
                </div>
                <div class="border border-gray-200 p-3 text-center">
                  <p class="text-2xl font-bold text-gray-900">86</p>
                  <p class="text-sm text-gray-500">Clics</p>
                </div>
                <div class="border border-gray-200 p-3 text-center">
                  <p class="text-2xl font-bold text-gray-900">12</p>
                  <p class="text-sm text-gray-500">Conversions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Modal pour créer une campagne -->
    <Teleport to="body">
      <div v-if="showCreateForm" class="modal-overlay" @click.self="showCreateForm = false">
        <div class="modal-container rounded-md">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Créer une nouvelle campagne</h2>
              <button @click="showCreateForm = false" class="px-3 py-1 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                Fermer
              </button>
            </div>
            
            <form class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="campaign-name" class="block text-sm font-medium text-gray-700">Nom de la campagne</label>
                  <input type="text" name="campaign-name" id="campaign-name" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="tracking-tool" class="block text-sm font-medium text-gray-700">Outil de suivi</label>
                  <select id="tracking-tool" name="tracking-tool" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                    <option>Facebook Pixel</option>
                    <option>Google Analytics</option>
                    <option>Système.io</option>
                  </select>
                </div>
                
                <div>
                  <label for="start-date" class="block text-sm font-medium text-gray-700">Date de début</label>
                  <input type="date" name="start-date" id="start-date" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
                
                <div>
                  <label for="end-date" class="block text-sm font-medium text-gray-700">Date de fin</label>
                  <input type="date" name="end-date" id="end-date" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary">
                </div>
              </div>
              
              <div>
                <label for="campaign-description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="campaign-description" name="campaign-description" rows="3" class="mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-secondary focus:border-secondary"></textarea>
              </div>
              
              <div class="flex justify-end">
                <button type="button" @click="showCreateForm = false" class="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary">
                  Annuler
                </button>
                <button type="submit" class="ml-3 px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                  Créer la campagne
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
definePageMeta({
  layout: 'dashboard'
})

import { ref, reactive } from 'vue'

// État pour les modaux
const showCampaignModal = ref(false)
const showCreateForm = ref(false)

// État pour la campagne sélectionnée
const currentCampaign = reactive({
  name: '',
  tool: '',
  status: '',
  createdDate: ''
})

// Fonction pour afficher le modal avec les détails de la campagne
function showCampaignDetails(name: string, tool: string, status: string, createdDate: string) {
  currentCampaign.name = name
  currentCampaign.tool = tool
  currentCampaign.status = status
  currentCampaign.createdDate = createdDate
  showCampaignModal.value = true
}
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