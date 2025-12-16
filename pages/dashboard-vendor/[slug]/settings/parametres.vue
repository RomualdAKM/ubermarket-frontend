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
          <button @click="activeTab = 'domaine'" :class="[activeTab === 'domaine' ? 'border-secondary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Domaine
          </button>
          <button @click="activeTab = 'paiement'" :class="[activeTab === 'paiement' ? 'border-secondary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Paiement
          </button>
          <button @click="activeTab = 'methodes'" :class="[activeTab === 'methodes' ? 'border-secondary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Méthodes de paiement
          </button>
          <!-- <button @click="activeTab = 'notifications'" :class="[activeTab === 'notifications' ? 'border-secondary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Notifications
          </button>
          <button @click="activeTab = 'collaborateurs'" :class="[activeTab === 'collaborateurs' ? 'border-secondary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Collaborateurs
          </button> -->
        </nav>
      </div>
    </div>

    <!-- Section Général -->
    <div v-if="activeTab === 'general'" class="bg-white p-6 border-t border-gray-200">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Paramètres généraux</h2>
      
      <!-- Messages -->
      <div v-if="generalSuccessMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
        <p class="text-sm text-green-800">{{ generalSuccessMessage }}</p>
      </div>
      
      <div v-if="generalErrorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-800">{{ generalErrorMessage }}</p>
      </div>
      
      <form @submit.prevent="updateGeneralSettings" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nom complet</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              v-model="profileForm.name"
              required
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
            >
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              v-model="profileForm.email"
              required
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
            >
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone</label>
            <input 
              type="text" 
              name="phone" 
              id="phone" 
              v-model="profileForm.phone"
              required
              placeholder="+33612345678"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" 
            >
          </div>
          
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700">Pays</label>
            <select 
              id="country" 
              name="country" 
              v-model="profileForm.country"
              required
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
            >
              <option value="FR">France</option>
              <option value="BE">Belgique</option>
              <option value="CH">Suisse</option>
              <option value="CA">Canada</option>
              <option value="MA">Maroc</option>
              <option value="TN">Tunisie</option>
              <option value="DZ">Algérie</option>
              <option value="US">États-Unis</option>
              <option value="GB">Royaume-Uni</option>
              <option value="DE">Allemagne</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="submit" 
            :disabled="isUpdatingGeneral"
            :class="[
              'px-4 py-2 text-white text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2',
              isUpdatingGeneral ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-secondary focus:ring-secondary'
            ]"
          >
            <span v-if="isUpdatingGeneral" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mise à jour...
            </span>
            <span v-else>Sauvegarder</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Section Domaine -->
    <div v-if="activeTab === 'domaine'" class="bg-white p-6 border-t border-gray-200">
      <h2 class="text-lg font-medium text-gray-900 mb-6">Configuration du domaine</h2>
      
      <!-- Messages -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
        {{ errorMessage }}
      </div>
      
      <!-- Sous-domaine -->
      <div class="mb-8">
        <h3 class="text-sm font-medium text-gray-900 mb-2">Sous-domaine actuel</h3>
        <div class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded">
          <code class="text-sm text-gray-700">{{ currentShopSubdomain }}.uber-market.com</code>
          <button 
            @click="copyToClipboard(currentShopSubdomain + '.uber-market.com')"
            class="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Copier
          </button>
        </div>
      </div>
      
      <!-- Domaine personnalisé -->
      <div class="border-t border-gray-200 pt-8">
        <h3 class="text-sm font-medium text-gray-900 mb-2">Domaine personnalisé</h3>
        <p class="text-sm text-gray-600 mb-4">Connectez votre propre nom de domaine</p>
        
        <!-- Domaine actif -->
        <div v-if="customDomain" class="mb-6 p-4 bg-white border border-gray-300 rounded">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Domaine actif</span>
            <button 
              @click="removeDomain"
              :disabled="isUpdating"
              class="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              Retirer
            </button>
          </div>
          <code class="text-sm font-mono text-gray-900">{{ customDomain }}</code>
        </div>
        
        <!-- Formulaire -->
        <div class="space-y-4">
          <div>
            <label for="custom_domain" class="block text-sm font-medium text-gray-700 mb-2">
              Nouveau domaine
            </label>
            <div class="flex gap-2">
              <input 
                type="text" 
                id="custom_domain" 
                v-model="customDomainInput"
                @input="domainCheckMessage = ''"
                :disabled="isUpdating"
                placeholder="www.maboutique.com"
                class="mt-1 block w-full px-2 py-1 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              >
              <button 
                @click="checkDomain"
                :disabled="!customDomainInput || isChecking"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isChecking ? 'Vérification...' : 'Vérifier' }}
              </button>
            </div>
            
            <p v-if="domainCheckMessage" :class="[
              'text-sm mt-2',
              domainAvailable ? 'text-green-600' : 'text-red-600'
            ]">
              {{ domainCheckMessage }}
            </p>
          </div>
          
          <button 
            @click="updateDomain"
            :disabled="!customDomainInput || isUpdating || !domainAvailable"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {{ isUpdating ? 'Mise à jour...' : (customDomain ? 'Changer le domaine' : 'Configurer le domaine') }}
          </button>
          
          <!-- Instructions DNS -->
          <div v-if="dnsConfig" class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Configuration DNS requise</h4>
            <p class="text-sm text-gray-600 mb-3">
              Ajoutez cet enregistrement chez votre registrar :
            </p>
            
            <div class="p-3 bg-white border border-gray-300 rounded font-mono text-xs text-gray-700">
              <div class="grid grid-cols-2 gap-2">
                <div><span class="font-semibold">Type:</span> CNAME</div>
                <div><span class="font-semibold">Nom:</span> {{ customDomain }}</div>
                <div class="col-span-2"><span class="font-semibold">Valeur:</span> cname.vercel-dns.com</div>
              </div>
            </div>
            
            <p class="text-xs text-gray-500 mt-3">
              La propagation DNS peut prendre jusqu'à 48h.
            </p>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Section Paiement -->
<div v-if="activeTab === 'paiement'" class="bg-white p-6 border-t border-gray-200">
  <h2 class="text-lg font-medium text-gray-900 mb-6">Configuration des paiements</h2>
  
  <!-- Moneroo -->
  <div class="mb-6 border border-gray-200 rounded overflow-hidden">
    <div class="flex items-center justify-between p-4 bg-gray-50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center">
          <span class="text-sm font-semibold text-gray-700">M</span>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-900">Moneroo</h4>
          <p class="text-xs text-gray-500">Mobile Money & Cartes bancaires</p>
        </div>
      </div>
      <button @click="toggleMonerooConfig" class="text-sm font-medium text-gray-700 hover:text-gray-900">
        {{ showMonerooConfig ? 'Masquer' : 'Configurer' }}
      </button>
    </div>
    
    <div v-if="showMonerooConfig" class="p-4 bg-white border-t border-gray-200">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Clé API (Secret Key)</label>
          <input v-model="monerooConfig.api_key" type="password" class="mt-1 block w-full px-2 py-1 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" placeholder="sk_test_...">
          <p class="mt-1 text-xs text-gray-500">La clé secrète disponible dans votre tableau de bord Moneroo</p>
        </div>
        <div class="flex items-center">
          <input v-model="monerooConfig.is_active" type="checkbox" class="h-4 w-4 text-gray-900 border-gray-300 rounded">
          <label class="ml-2 text-sm text-gray-700">Activer ce mode de paiement</label>
        </div>
        <div class="flex justify-end pt-2">
          <button @click="savePaymentConfig('mobile_money', monerooConfig)" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- PayPal -->
  <div class="border border-gray-200 rounded overflow-hidden">
    <div class="flex items-center justify-between p-4 bg-gray-50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center">
          <span class="text-sm font-semibold text-gray-700">PP</span>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-900">PayPal</h4>
          <p class="text-xs text-gray-500">Compte PayPal & Cartes bancaires</p>
        </div>
      </div>
      <button @click="togglePaypalConfig" class="text-sm font-medium text-gray-700 hover:text-gray-900">
        {{ showPaypalConfig ? 'Masquer' : 'Configurer' }}
      </button>
    </div>
    
    <div v-if="showPaypalConfig" class="p-4 bg-white border-t border-gray-200">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
          <input v-model="paypalConfig.client_id" type="text" class="mt-1 block w-full px-2 py-1 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" placeholder="AYSq3RDGsmBLJE-otTkBtM-jBRd1TCQwFf9RGfwddNXWz0uFU9ztymylOhRS">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
          <input v-model="paypalConfig.client_secret" type="password" class="mt-1 block w-full px-2 py-1 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" placeholder="EGnHDxD_qRPdaLdZz8iCr8N7_MzF-YHPTkjs6NKYQvQSBngp4PTTVWkPZRbL">
        </div>
        <div class="flex items-center">
          <input v-model="paypalConfig.is_active" type="checkbox" class="h-4 w-4 text-gray-900 border-gray-300 rounded">
          <label class="ml-2 text-sm text-gray-700">Activer ce mode de paiement</label>
        </div>
        <div class="flex justify-end pt-2">
          <button @click="savePaymentConfig('paypal', paypalConfig)" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

    <!-- Section Méthodes de paiement (NOUVEAU) -->
    <div v-if="activeTab === 'methodes'" class="bg-white p-6 border-t border-gray-200">
      <h2 class="text-lg font-medium text-gray-900 mb-6">
        Méthodes de paiement disponibles pour vos clients
      </h2>
      
      <p class="text-sm text-gray-600 mb-6">
        Activez ou désactivez les méthodes de paiement que vous souhaitez proposer à vos clients lors du passage de commande.
      </p>
      
      <div class="space-y-4">
        <!-- Mobile Money -->
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-medium text-gray-900">Mobile Money</h3>
            <p class="text-sm text-gray-500">MTN, Moov, Orange Money</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="paymentMethodsStatus.mobile_money"
              @change="togglePaymentMethod('mobile_money')"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <!-- Carte bancaire -->
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-medium text-gray-900">Carte bancaire</h3>
            <p class="text-sm text-gray-500">Visa, Mastercard</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="paymentMethodsStatus.card"
              @change="togglePaymentMethod('card')"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <!-- PayPal -->
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-medium text-gray-900">PayPal</h3>
            <p class="text-sm text-gray-500">Compte PayPal</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="paymentMethodsStatus.paypal"
              @change="togglePaymentMethod('paypal')"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <!-- Paiement à la livraison (conditionnel) -->
        <div 
          v-if="currentShop?.product_type === 'physical'" 
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
        >
          <div>
            <h3 class="font-medium text-gray-900">Paiement à la livraison</h3>
            <p class="text-sm text-gray-500">Payer en espèces à la réception</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="paymentMethodsStatus.cash_on_delivery"
              @change="togglePaymentMethod('cash_on_delivery')"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
      
      <!-- Information -->
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-800">
          💡 <strong>Bon à savoir :</strong> Les méthodes activées utilisent les clés API d'UberMarket par défaut. Pour utiliser vos propres clés, configurez-les dans l'onglet "Paiement".
        </p>
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
              <input type="text" name="collab-name" id="collab-name"  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200">
            </div>
            
            <div>
              <label for="collab-email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="collab-email" id="collab-email"  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200">
            </div>
            
            <div>
              <label for="collab-role" class="block text-sm font-medium text-gray-700">Rôle</label>
              <select id="collab-role" name="collab-role"  class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200">
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
import type { Shop } from '~/types/auth'
import type { User } from '~/types/auth'

definePageMeta({
  layout: 'dashboard',
  middleware: 'shop-access'
})

const route = useRoute()
const { shops, checkCustomDomainAvailability, updateShop } = useShops()
const { user, updateProfile, token } = useAuth()

const activeTab = ref('general')
const customDomainInput = ref('')
const customDomain = ref<string | null>(null)
const currentShopSubdomain = ref('')
const isChecking = ref(false)
const isUpdating = ref(false)
const domainAvailable = ref(false)
const domainCheckMessage = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const dnsConfig = ref<any>(null)
const showMonerooConfig = ref(false)
const showPaypalConfig = ref(false)
const monerooConfig = ref({ api_key: '', is_active: false })
const paypalConfig = ref({ client_id: '', client_secret: '', is_active: false })

// Section Méthodes de paiement
const paymentMethodsStatus = ref({
  mobile_money: true,
  card: true,
  paypal: true,
  cash_on_delivery: true
})

// Section Général
const isUpdatingGeneral = ref(false)
const generalSuccessMessage = ref('')
const generalErrorMessage = ref('')
const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  country: 'FR'
})

// Initialiser le formulaire avec les données utilisateur
onMounted(() => {
  if (user.value) {
    profileForm.name = user.value.name || ''
    profileForm.email = user.value.email || ''
    profileForm.phone = user.value.phone || ''
    profileForm.country = user.value.country || 'FR'
  }
  
  if (currentShop.value) {
    currentShopSubdomain.value = currentShop.value.subdomain || ''
    customDomain.value = currentShop.value.custom_domain || null
    customDomainInput.value = customDomain.value || ''
  }
})

// Mettre à jour les paramètres généraux
const updateGeneralSettings = async () => {
  isUpdatingGeneral.value = true
  generalErrorMessage.value = ''
  generalSuccessMessage.value = ''
  
  try {
    const response = await updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      country: profileForm.country
    })
    
    if (response.success) {
      generalSuccessMessage.value = 'Profil mis à jour avec succès'
      setTimeout(() => generalSuccessMessage.value = '', 3000)
    } else {
      generalErrorMessage.value = response.message || 'Erreur lors de la mise à jour'
    }
  } catch (error: any) {
    generalErrorMessage.value = error.message || 'Erreur lors de la mise à jour du profil'
  } finally {
    isUpdatingGeneral.value = false
  }
}

const toggleMonerooConfig = () => showMonerooConfig.value = !showMonerooConfig.value
const togglePaypalConfig = () => showPaypalConfig.value = !showPaypalConfig.value
const savePaymentConfig = async (method: string, credentials: any) => {
  if (!currentShop.value) return
  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBase}/shops/${currentShop.value.id}/payment-methods`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token.value}`,
        Accept: 'application/json'
      },
      body: { method, credentials, is_active: credentials.is_active }
    })
    alert('Configuration enregistrée !')
  } catch (e) {
    alert('Erreur lors de l\'enregistrement')
  }
}

// Charger les méthodes de paiement
const loadPaymentMethods = async () => {
  if (!currentShop.value) return
  
  try {
    const config = useRuntimeConfig()
    const response: any = await $fetch(`${config.public.apiBase}/shops/${currentShop.value.id}/payment-methods`, {
      headers: { 
        Authorization: `Bearer ${token.value}`,
        Accept: 'application/json'
      }
    })
    
    if (response.success && response.data) {
      // Mettre à jour les status
      response.data.forEach((method: any) => {
        if (method.method in paymentMethodsStatus.value) {
          paymentMethodsStatus.value[method.method as keyof typeof paymentMethodsStatus.value] = method.is_active
        }
      })
    }
  } catch (error) {
    console.error('Erreur chargement méthodes:', error)
  }
}

// Toggle une méthode de paiement ON/OFF
const togglePaymentMethod = async (method: string) => {
  if (!currentShop.value) return
  
  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBase}/shops/${currentShop.value.id}/payment-methods/${method}/toggle`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${token.value}`,
        Accept: 'application/json'
      },
      body: { is_active: paymentMethodsStatus.value[method as keyof typeof paymentMethodsStatus.value] }
    })
  } catch (error) {
    console.error('Erreur toggle:', error)
    // Revenir à l'état précédent en cas d'erreur
    paymentMethodsStatus.value[method as keyof typeof paymentMethodsStatus.value] = !paymentMethodsStatus.value[method as keyof typeof paymentMethodsStatus.value]
  }
}
// Récupérer la boutique actuelle
const currentShop = computed(() => {
  const slug = route.params.slug as string
  return shops.value.find(s => s.slug === slug) || null
})

// Initialiser les données au montage
onMounted(() => {
  if (currentShop.value) {
    currentShopSubdomain.value = currentShop.value.subdomain || ''
    customDomain.value = currentShop.value.custom_domain || null
    customDomainInput.value = customDomain.value || ''
  }
  
  // Charger les méthodes de paiement
  loadPaymentMethods()
})

// Vérifier la disponibilité du domaine
const checkDomain = async () => {
  if (!customDomainInput.value || !currentShop.value) return
  
  isChecking.value = true
  domainCheckMessage.value = ''
  domainAvailable.value = false
  
  try {
    const result = await checkCustomDomainAvailability(customDomainInput.value, currentShop.value.id)
    domainAvailable.value = result.available
    domainCheckMessage.value = result.message
  } catch (error) {
    domainCheckMessage.value = 'Erreur lors de la vérification'
  } finally {
    isChecking.value = false
  }
}

// Mettre à jour le domaine
const updateDomain = async () => {
  if (!customDomainInput.value || !currentShop.value) return
  
  isUpdating.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const response = await updateShop(currentShop.value.id, {
      custom_domain: customDomainInput.value
    })
    
    if (response.success) {
      customDomain.value = customDomainInput.value
      // Stocker la configuration DNS si disponible
      if (response.dns_config) {
        dnsConfig.value = response.dns_config
      }
      successMessage.value = 'Domaine configuré avec succès'
      domainCheckMessage.value = ''
      domainAvailable.value = false
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = response.message || 'Erreur lors de la mise à jour'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Erreur lors de la mise à jour'
  } finally {
    isUpdating.value = false
  }
}

// Retirer le domaine personnalisé
const removeDomain = async () => {
  if (!currentShop.value) return
  
  if (!confirm('Voulez-vous vraiment retirer le domaine personnalisé ?')) return
  
  isUpdating.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const response = await updateShop(currentShop.value.id, {
      custom_domain: null
    })
    
    if (response.success) {
      customDomain.value = null
      customDomainInput.value = ''
      successMessage.value = 'Domaine retiré avec succès'
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = response.message || 'Erreur lors de la mise à jour'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Erreur lors de la mise à jour'
  } finally {
    isUpdating.value = false
  }
}

// Copier dans le presse-papier
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    successMessage.value = 'Copié dans le presse-papier'
    setTimeout(() => successMessage.value = '', 2000)
  } catch (error) {
    errorMessage.value = 'Erreur lors de la copie'
    setTimeout(() => errorMessage.value = '', 2000)
  }
}
</script>