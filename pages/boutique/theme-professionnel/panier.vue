<template>
  <div class="min-h-screen bg-white">
    <HeaderProfessionnel />
    
    <main class="py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Contenu du panier -->
          <div class="lg:col-span-2">
            <div class="flex justify-between items-center mb-10">
              <h1 class="text-3xl font-light text-gray-900">Votre panier</h1>
              <span class="text-sm text-gray-500">{{ cartItems.length }} articles</span>
            </div>

            <!-- Articles dans le panier -->
            <div class="bg-white">
              <div v-for="(item, index) in cartItems" :key="item.id" class="flex items-start p-8 border-b border-gray-100 last:border-b-0">
                <div class="w-28 h-28 bg-gray-100 flex-shrink-0">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
                </div>
                <div class="ml-8 flex-1">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-xl font-medium text-gray-900 mb-2">{{ item.name }}</h3>
                      <p class="text-gray-500 mb-4">{{ item.color }}</p>
                    </div>
                    <p class="text-xl font-medium text-gray-900">{{ item.price }}</p>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center border border-gray-200">
                      <button @click="decreaseQuantity(item.id)" class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                        −
                      </button>
                      <span class="w-12 h-10 flex items-center justify-center border-l border-r border-gray-200 text-gray-900">{{ item.quantity }}</span>
                      <button @click="increaseQuantity(item.id)" class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                        +
                      </button>
                    </div>
                    <button @click="removeItem(item.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Code promo -->
            <div class="mt-8 bg-white p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Code promotionnel</h3>
              <div class="flex gap-4">
                <input 
                  v-model="promoCode" 
                  type="text" 
                  placeholder="Entrez votre code" 
                  class="flex-1 px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                >
                <button class="px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
                  Appliquer
                </button>
              </div>
            </div>

            <div class="mt-6">
              <a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">← Continuer mes achats</a>
            </div>
          </div>

          <!-- Résumé de la commande -->
          <div class="lg:col-span-1">
            <div class="bg-white p-8 sticky top-8">
              <h2 class="text-xl font-medium text-gray-900 mb-8">Résumé</h2>
              
              <!-- Options de livraison -->
              <div class="mb-8">
                <h3 class="text-base font-medium text-gray-900 mb-6">Livraison</h3>
                
                <div class="space-y-4">
                  <div v-for="option in deliveryOptions" :key="option.id" class="flex items-center p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                    <input 
                      type="radio" 
                      :id="option.id" 
                      :value="option.id" 
                      v-model="selectedDeliveryOption"
                      @change="selectDeliveryOption(option.id)"
                      class="w-4 h-4 text-gray-900 border-gray-300"
                    >
                    <label :for="option.id" class="ml-4 flex-1 text-gray-700 cursor-pointer">
                      {{ option.label }}
                    </label>
                  </div>
                </div>
              </div>
              
              <!-- Formulaire d'adresse -->
              <div v-if="selectedDeliveryOption === 'delivery' || selectedDeliveryOption === 'payment_on_delivery'" class="mb-8">
                <h3 class="text-base font-medium text-gray-900 mb-6">Adresse de livraison</h3>
                
                <div class="space-y-4">
                  <div>
                    <select 
                      v-model="deliveryAddress.country" 
                      class="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                    >
                      <option value="" disabled>Pays</option>
                      <option v-for="country in countries" :key="country.name" :value="country.name">
                        {{ country.name }}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <select v-if="availableCities.length > 0" 
                      v-model="deliveryAddress.city" 
                      class="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                    >
                      <option value="" disabled>Ville</option>
                      <option v-for="city in availableCities" :key="city.name" :value="city.name">
                        {{ city.name }}
                      </option>
                    </select>
                    <input v-else
                      type="text" 
                      v-model="deliveryAddress.city" 
                      placeholder="Ville" 
                      class="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                    >
                  </div>
                  
                  <div>
                    <input 
                      type="text" 
                      v-model="deliveryAddress.address" 
                      placeholder="Adresse" 
                      class="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                    >
                  </div>
                  
                  <div>
                    <input 
                      type="text" 
                      v-model="deliveryAddress.zipCode" 
                      placeholder="Code postal" 
                      class="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                    >
                  </div>
                  
                  <div>
                    <textarea 
                      v-model="deliveryAddress.additionalInfo" 
                      placeholder="Informations complémentaires (optionnel)" 
                      class="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <!-- Informations boutique -->
              <div v-if="selectedDeliveryOption === 'pickup'" class="mb-8">
                <h3 class="text-base font-medium text-gray-900 mb-6">Point de retrait</h3>
                <div class="bg-gray-50 p-6">
                  <div class="space-y-2 text-sm">
                    <p class="font-medium text-gray-900">Boutique Professionnelle</p>
                    <p class="text-gray-600">14 Rue de la Paix</p>
                    <p class="text-gray-600">75002 Paris</p>
                    <p class="text-gray-600">Lun-Sam: 10h-19h</p>
                  </div>
                  <p class="text-xs text-gray-500 mt-4">Disponible sous 24h</p>
                </div>
              </div>
              
              <!-- Calculs -->
              <div class="space-y-4 mb-8 pb-6 border-b border-gray-200">
                <div class="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{{ formattedSubtotal }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>{{ formattedDeliveryPrice }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span>{{ formattedTaxes }}</span>
                </div>
              </div>
              
              <div class="flex justify-between text-xl font-medium text-gray-900 mb-8">
                <span>Total</span>
                <span>{{ totalPrice }}</span>
              </div>
              
              <button class="w-full py-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors mb-4">
                {{ selectedDeliveryOption === 'payment_on_delivery' ? 'Valider la commande' : 'Procéder au paiement' }}
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterProfessionnel />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import HeaderProfessionnel from '~/components/theme_professionnel/HeaderProfessionnel.vue'
import FooterProfessionnel from '~/components/theme_professionnel/FooterProfessionnel.vue'

definePageMeta({
  layout: false
})

// Données des produits avec leurs images
const cartItems = ref([
  {
    id: 1,
    name: "Chaise minimaliste",
    color: "Bois clair",
    price: "299,00 €",
    quantity: 1,
    image: "https://placehold.co/800x800"
  },
  {
    id: 2,
    name: "Lampe de bureau",
    color: "Noir mat",
    price: "149,00 €",
    quantity: 2,
    image: "https://placehold.co/800x800/222222/ffffff"
  },
  {
    id: 3,
    name: "Cadre photo",
    color: "Bois naturel",
    price: "39,00 €",
    quantity: 1,
    image: "https://placehold.co/800x800/dddddd/333333"
  }
])

// Options de livraison
const deliveryOptions = ref([
  {
    id: 'delivery',
    label: 'Livraison à domicile',
    selected: true
  },
  {
    id: 'pickup',
    label: 'Retrait en boutique',
    selected: false
  },
  {
    id: 'payment_on_delivery',
    label: 'Paiement à la livraison',
    selected: false
  }
])

// Sélection de l'option de livraison
const selectedDeliveryOption = ref('delivery')

// Code promo
const promoCode = ref('')

// Données de l'adresse de livraison
const deliveryAddress = ref({
  country: '',
  city: '',
  address: '',
  zipCode: '',
  additionalInfo: ''
})

// Liste de pays avec tarifs de livraison
const countries = ref([
  { name: 'France', cities: [
    { name: 'Paris', price: 5.90 },
    { name: 'Lyon', price: 7.90 },
    { name: 'Marseille', price: 8.90 },
    { name: 'Autres villes', price: 9.90 }
  ]},
  { name: 'Belgique', price: 12.90 },
  { name: 'Suisse', price: 14.90 },
  { name: 'Luxembourg', price: 10.90 },
  { name: 'Canada', price: 29.90 }
])

// Villes disponibles en fonction du pays sélectionné
const availableCities = computed(() => {
  const selectedCountry = countries.value.find(c => c.name === deliveryAddress.value.country)
  return selectedCountry && selectedCountry.cities ? selectedCountry.cities : []
})

// Prix de la livraison calculé en fonction du pays et de la ville
const deliveryPrice = computed(() => {
  if (selectedDeliveryOption.value === 'pickup') {
    return 0
  }
  
  const selectedCountry = countries.value.find(c => c.name === deliveryAddress.value.country)
  
  // Si le pays a des villes spécifiques
  if (selectedCountry && selectedCountry.cities) {
    const selectedCity = selectedCountry.cities.find(city => city.name === deliveryAddress.value.city)
    return selectedCity ? selectedCity.price : (selectedCountry.cities.find(city => city.name === 'Autres villes')?.price || 9.90)
  }
  
  // Prix par défaut du pays
  return selectedCountry ? selectedCountry.price : 9.90
})

// Formatage du prix de livraison
const formattedDeliveryPrice = computed(() => {
  if (selectedDeliveryOption.value === 'pickup') {
    return 'Gratuit'
  }
  return `${deliveryPrice.value.toFixed(2).replace('.', ',')} €`
})

// Sous-total du panier (sans livraison)
const subtotal = 587.00
const formattedSubtotal = computed(() => `${subtotal.toFixed(2).replace('.', ',')} €`)

// Taxes (20%)
const taxes = computed(() => subtotal * 0.2)
const formattedTaxes = computed(() => `${taxes.value.toFixed(2).replace('.', ',')} €`)

// Total de la commande
const totalPrice = computed(() => {
  const total = subtotal + (selectedDeliveryOption.value === 'pickup' ? 0 : deliveryPrice.value) + taxes.value
  return `${total.toFixed(2).replace('.', ',')} €`
})

// Fonction pour sélectionner une option de livraison
const selectDeliveryOption = (optionId) => {
  selectedDeliveryOption.value = optionId
  deliveryOptions.value = deliveryOptions.value.map(option => ({
    ...option,
    selected: option.id === optionId
  }))
}

// Méthodes pour gérer les quantités
const increaseQuantity = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) item.quantity++
}

const decreaseQuantity = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item && item.quantity > 1) item.quantity--
}

const removeItem = (itemId) => {
  cartItems.value = cartItems.value.filter(item => item.id !== itemId)
}

// Réinitialiser la ville lorsque le pays change
watch(() => deliveryAddress.value.country, () => {
  deliveryAddress.value.city = ''
})
</script>

<style scoped>
.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}
</style>