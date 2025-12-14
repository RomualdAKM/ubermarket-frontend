<template>
  <div class="min-h-screen bg-white">
    <!-- En-tête -->
    <HeaderEpure :shop="shop" :primaryColor="primaryColor" />

    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Panier vide -->
        <div v-if="cartItems.length === 0" class="text-center py-16">
          <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <h2 class="mt-4 text-2xl font-medium text-gray-900">Votre panier est vide</h2>
          <p class="mt-2 text-gray-600">Ajoutez des produits pour commencer vos achats</p>
          <NuxtLink :to="`/boutique/${shopSubdomain}`" class="mt-6 inline-block px-6 py-3 bg-primary text-white font-medium hover:bg-secondary rounded-md">
            Continuer vos achats
          </NuxtLink>
        </div>

        <!-- Panier avec articles -->
        <div v-else class="flex flex-col md:flex-row gap-8">
          <!-- Contenu du panier -->
          <div class="md:w-2/3">
            <div class="flex justify-between items-center mb-8">
              <h1 class="text-2xl font-medium text-gray-900">Votre panier ({{ itemsCount }} article{{ itemsCount > 1 ? 's' : '' }})</h1>
              <NuxtLink :to="getHomeUrl(shop)" class="text-primary hover:text-secondary">
                Continuer vos achats
              </NuxtLink>
            </div>

            <!-- Messages -->
            <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p class="text-sm text-green-800">{{ successMessage }}</p>
            </div>
            
            <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>

            <!-- Articles dans le panier -->
            <div class="space-y-4">
              <div 
                v-for="item in cartItems" 
                :key="item.id" 
                class="flex items-center p-6 border border-gray-200 rounded-lg"
              >
                <!-- Image -->
                <div class="bg-gray-100 w-24 h-24 flex items-center justify-center overflow-hidden rounded-md flex-shrink-0">
                  <img 
                    :src="getProductImage(item.product)" 
                    :alt="item.product.name" 
                    class="w-full h-full object-cover"
                  >
                </div>

                <!-- Détails -->
                <div class="ml-6 flex-1">
                  <div class="flex justify-between">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">{{ item.product.name }}</h3>
                      <!-- Afficher TOUTES les variantes sélectionnées -->
                      <div v-if="item.variants && item.variants.length > 0" class="mt-1 space-y-1">
                        <p v-for="variant in item.variants" :key="variant.id" class="text-sm text-gray-600">
                          {{ variant.name }}: <span class="font-medium">{{ variant.value }}</span>
                          <span v-if="variant.price_modifier && parseFloat(variant.price_modifier) !== 0" class="text-xs text-gray-500">
                            ({{ parseFloat(variant.price_modifier) > 0 ? '+' : '' }}{{ parseFloat(variant.price_modifier).toLocaleString('fr-FR') }} {{ shop?.currency }})
                          </span>
                        </p>
                      </div>
                      <p class="mt-1 text-sm text-gray-600">
                        {{ formatPrice(item.price) }} l'unité
                      </p>
                    </div>
                    <p class="text-lg font-medium text-gray-900">
                      {{ formatPrice(item.price * item.quantity) }}
                    </p>
                  </div>

                  <!-- Contrôles quantité et suppression -->
                  <div class="mt-4 flex items-center space-x-4">
                    <!-- Quantité -->
                    <div class="inline-flex items-center border border-gray-300 rounded-md">
                      <button 
                        @click="decreaseQuantity(item)"
                        :disabled="isUpdating === item.id"
                        class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span class="px-3 py-1 border-l border-r border-gray-300 min-w-[3rem] text-center">
                        {{ item.quantity }}
                      </span>
                      <button 
                        @click="increaseQuantity(item)"
                        :disabled="isUpdating === item.id"
                        class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <!-- Bouton supprimer -->
                    <button 
                      @click="handleRemoveItem(item.id)"
                      :disabled="isRemoving === item.id"
                      class="text-gray-600 hover:text-red-600 disabled:opacity-50"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bouton vider le panier -->
            <div class="mt-6">
              <button 
                @click="handleClearCart"
                :disabled="isClearing"
                class="text-sm text-gray-600 hover:text-red-600 underline disabled:opacity-50"
              >
                {{ isClearing ? 'Suppression en cours...' : 'Vider le panier' }}
              </button>
            </div>
          </div>

          <!-- Résumé de la commande -->
          <div class="md:w-1/3">
            <div class="border border-gray-200 rounded-lg p-6 sticky top-4">
              <h2 class="text-lg font-medium text-gray-900 mb-6">Résumé de la commande</h2>
              
              <!-- Message : Connexion requise -->
              <div v-if="!user" class="mb-6">
                <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <div class="flex">
                    <svg class="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <h3 class="text-sm font-medium text-blue-800 mb-1">Connexion requise</h3>
                      <p class="text-xs text-blue-700">Vous devez être connecté pour passer commande et suivre vos achats.</p>
                    </div>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <NuxtLink 
                    :to="getLoginUrl(getCartUrl(shop), shop)"
                    class="block w-full px-6 py-3 bg-primary text-white font-medium hover:bg-secondary rounded-md transition-colors text-center"
                  >
                    Se connecter
                  </NuxtLink>
                  
                  <NuxtLink 
                    :to="getSignupUrl(getCartUrl(shop), shop)"
                    class="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 rounded-md transition-colors text-center"
                  >
                    Créer un compte
                  </NuxtLink>
                </div>
                
                <p class="mt-4 text-xs text-gray-500 text-center">
                  Pas encore inscrit ? Créez votre compte en 30 secondes pour profiter du suivi de commande.
                </p>
              </div>
              
              <!-- Formulaire commande (si connecté) -->
              <div v-else>
                <!-- Totaux (affichés en haut quand connecté) -->
                <div class="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div class="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span class="text-gray-900">{{ formatPrice(subtotal) }}</span>
                  </div>
                  
                  <div v-if="promoApplied && appliedPromoCode" class="flex justify-between text-green-600">
                    <span>Réduction</span>
                    <span>-{{ formatPrice(appliedPromoCode.discount_amount) }}</span>
                  </div>

                  <div class="border-t border-gray-200 pt-3 flex justify-between">
                    <span class="text-lg font-medium text-gray-900">Total</span>
                    <span class="text-lg font-medium text-gray-900">{{ formatPrice(finalTotal) }}</span>
                  </div>
                </div>

                <!-- Formulaire informations client -->
                <div class="mb-6 pb-6 border-b border-gray-200">
                  <h3 class="text-sm font-medium text-gray-900 mb-3">Vos informations</h3>
                  
                  <div class="space-y-3">
                    <div>
                      <input 
                        type="text" 
                        v-model="orderForm.customer_name"
                        placeholder="Nom complet *"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                    </div>
                    
                    <div>
                      <input 
                        type="email" 
                        v-model="orderForm.customer_email"
                        placeholder="Email *"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                    </div>
                    
                    <div>
                      <input 
                        type="tel" 
                        v-model="orderForm.customer_phone"
                        placeholder="Téléphone *"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                    </div>
                  </div>
                </div>
              
              <!-- Mode de livraison (UNIQUEMENT pour boutiques physiques) -->
              <div v-if="!isDigitalShop" class="mb-6 pb-6 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-900 mb-3">Mode de livraison</h3>
                
                <div class="space-y-2">
                  <label class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50" :class="orderForm.delivery_method === 'pickup' ? 'border-primary bg-blue-50' : ''">
                    <input 
                      type="radio" 
                      v-model="orderForm.delivery_method" 
                      value="pickup"
                      class="mr-2"
                    >
                    <span class="text-sm text-gray-700">Retrait en boutique (Gratuit)</span>
                  </label>
                  
                  <label class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50" :class="orderForm.delivery_method === 'delivery' ? 'border-primary bg-blue-50' : ''">
                    <input 
                      type="radio" 
                      v-model="orderForm.delivery_method" 
                      value="delivery"
                      class="mr-2"
                    >
                    <span class="text-sm text-gray-700">Livraison à domicile</span>
                  </label>
                </div>
                
                <!-- Adresse de livraison (si delivery) -->
                <div v-if="orderForm.delivery_method === 'delivery'" class="mt-3 space-y-2">
                  <input 
                    type="text" 
                    v-model="orderForm.shipping_address.address"
                    placeholder="Adresse *"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                  <input 
                    type="text" 
                    v-model="orderForm.shipping_address.city"
                    placeholder="Ville *"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                  <input 
                    type="text" 
                    v-model="orderForm.shipping_address.postal_code"
                    placeholder="Code postal"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                  <input 
                    type="text" 
                    v-model="orderForm.shipping_address.country"
                    placeholder="Pays *"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                </div>
              </div>
              
              <!-- Message informatif pour boutiques digitales -->
              <div v-if="isDigitalShop" class="mb-6 pb-6 border-b border-gray-200">
                <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div class="flex">
                    <svg class="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <h3 class="text-sm font-medium text-blue-800 mb-1">Produits numériques</h3>
                      <p class="text-xs text-blue-700">Après paiement, vous recevrez un email avec les liens de téléchargement de vos fichiers.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Méthode de paiement -->
              <div class="mb-6 pb-6 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-900 mb-3">Méthode de paiement</h3>
                
                <div class="space-y-2">
                  <label 
                    v-for="method in paymentMethods" 
                    :key="method.id"
                    class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50" 
                    :class="selectedPaymentMethod === method.id ? 'border-primary bg-blue-50' : ''"
                  >
                    <input 
                      type="radio" 
                      v-model="selectedPaymentMethod" 
                      :value="method.id"
                      class="mr-2"
                    >
                    <div class="flex-1">
                      <span class="text-sm font-medium text-gray-700">{{ method.label }}</span>
                      <p class="text-xs text-gray-500 mt-0.5">{{ method.description }}</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <!-- Code promo -->
              <div class="mb-6 pb-6 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-900 mb-3">Code promo</h3>
                
                <!-- Code appliqué -->
                <div v-if="promoApplied" class="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-sm text-green-800">
                        <strong>{{ appliedPromoCode?.code }}</strong>
                      </span>
                    </div>
                    <button @click="removePromoCode" class="text-red-600 hover:text-red-800 text-xs">
                      Retirer
                    </button>
                  </div>
                </div>

                <!-- Formulaire code promo -->
                <div v-else class="flex gap-2">
                  <input 
                    type="text" 
                    v-model="promoCodeInput"
                    placeholder="Code promo"
                    class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    @keyup.enter="applyPromoCode"
                  >
                  <button 
                    @click="applyPromoCode"
                    :disabled="!promoCodeInput || isValidatingPromo"
                    class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-secondary disabled:opacity-50"
                  >
                    {{ isValidatingPromo ? '...' : 'Appliquer' }}
                  </button>
                </div>

                <!-- Erreur code promo -->
                <p v-if="promoError" class="mt-2 text-xs text-red-600">{{ promoError }}</p>
              </div>
              
              <!-- Bouton commander -->
              <div>
                <button 
                  @click="handleCreateOrder"
                  :disabled="isCreatingOrder || !isFormValid"
                  class="w-full px-6 py-3 bg-primary text-white font-medium hover:bg-secondary rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg v-if="isCreatingOrder" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isCreatingOrder ? 'Création en cours...' : 'Valider la commande' }}
                </button>
                <p v-if="!isFormValid" class="mt-2 text-xs text-red-600 text-center">
                  Veuillez remplir tous les champs obligatoires
                </p>
              </div>
            </div>
            </div>
            <!-- Fin div v-else (formulaire connecté) -->
          </div>
        </div>
      </div>
    </main>

    <FooterEpure 
      :backgroundColor="backgroundColor" 
      :primaryColor="primaryColor"
      :footerText="footerText"
      :socialLinks="footerSocialLinks"
    />
  </div>
</template>

<script setup lang="ts">
import FooterEpure from '@/components/theme_epure/FooterEpure.vue'
import HeaderEpure from '@/components/theme_epure/HeaderEpure.vue'
import { usePayment } from '~/composables/usePayment'
import { useCart } from '~/composables/useCart'
import { usePromoCodes } from '~/composables/usePromoCodes'
import { useOrders } from '~/composables/useOrders'
import { useAuth } from '~/composables/useAuth'
import { useRouter, useRuntimeConfig } from '#app'

definePageMeta({
  layout: false
})

import { ref, computed, watch } from 'vue'

// Props
interface Props {
  shop?: any
  customizations?: any
}

const props = defineProps<Props>()

// Variables locales pour le template
const shop = computed(() => props.shop)

// Composables
const router = useRouter()
const { cartItems, subtotal, updateQuantity, removeItem, clearCart, fetchCart, getSessionId } = useCart()
const { validatePromoCode } = usePromoCodes()
const { createOrder } = useOrders()
const { initializePayment } = usePayment()
const { user } = useAuth()
const { getHomeUrl, getCartUrl, getLoginUrl, getSignupUrl } = useShopNavigation()
const config = useRuntimeConfig()

// Données
const shopSubdomain = computed(() => props.shop?.subdomain || '')
const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#e56a19')
const secondaryColor = computed(() => props.customizations?.home?.colors?.secondary || '#5b6ac5')
const backgroundColor = computed(() => props.customizations?.home?.colors?.background || '#ffffff')
const itemsCount = computed(() => cartItems.value.reduce((total: number, item: any) => total + item.quantity, 0))

// Footer (pied de page)
const footerText = computed(() => {
  if (props.customizations?.footer?.text) {
    return props.customizations.footer.text
  }
  return `© ${new Date().getFullYear()} ${shop.value?.name || 'Boutique'}. Tous droits réservés.`
})

const footerSocialLinks = computed(() => {
  return props.customizations?.footer?.socialLinks || {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  }
})

// Déterminer si la boutique vend des produits digitaux
const isDigitalShop = computed(() => props.shop?.product_type === 'digital')

// État
const isUpdating = ref<number | null>(null)
const isRemoving = ref<number | null>(null)
const isClearing = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Code promo
const promoCodeInput = ref('')
const promoApplied = ref(false)
const appliedPromoCode = ref<any>(null)
const promoError = ref('')
const isValidatingPromo = ref(false)

// Formulaire de commande
const orderForm = ref({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  delivery_method: 'pickup' as 'pickup' | 'delivery' | 'partner',
  shipping_address: {
    address: '',
    city: '',
    postal_code: '',
    country: ''
  }
})

const isCreatingOrder = ref(false)

// Méthodes de paiement (adaptées selon le type de boutique)
const paymentMethods = computed(() => {
  const methods = [
    {
      id: 'mobile_money',
      label: 'Mobile Money',
      description: 'MTN, Moov, Orange Money'
    },
    {
      id: 'card',
      label: 'Carte bancaire',
      description: 'Visa, Mastercard'
    },
    {
      id: 'paypal',
      label: 'PayPal',
      description: 'Compte PayPal'
    }
  ]
  
  // Ajouter "Paiement à la livraison" UNIQUEMENT pour boutiques physiques
  if (!isDigitalShop.value) {
    methods.push({
      id: 'cash_on_delivery',
      label: 'Paiement à la livraison',
      description: 'Payer en espèces à la réception'
    })
  }
  
  return methods
})

const selectedPaymentMethod = ref('mobile_money')

// Pré-remplir le formulaire avec les infos de l'utilisateur connecté
watch(user, (newUser) => {
  if (newUser) {
    orderForm.value.customer_name = newUser.name || ''
    orderForm.value.customer_email = newUser.email || ''
    orderForm.value.customer_phone = newUser.phone || ''
  }
}, { immediate: true })

// Adapter le mode de livraison par défaut selon le type de boutique
watch(() => props.shop?.product_type, (productType) => {
  if (productType === 'digital') {
    // Pour boutiques digitales : pas de livraison
    orderForm.value.delivery_method = 'pickup' // Valeur technique (sera ignorée côté backend)
  }
}, { immediate: true })

// Validation du formulaire
const isFormValid = computed(() => {
  const form = orderForm.value
  
  // Champs obligatoires de base
  if (!form.customer_name || !form.customer_email || !form.customer_phone) {
    return false
  }
  
  // Pour boutiques PHYSIQUES : vérifier livraison
  if (!isDigitalShop.value) {
    // Si livraison à domicile, vérifier l'adresse
    if (form.delivery_method === 'delivery') {
      if (!form.shipping_address.address || !form.shipping_address.city || !form.shipping_address.country) {
        return false
      }
    }
  }
  
  // Pour boutiques DIGITALES : paiement en ligne obligatoire
  if (isDigitalShop.value && selectedPaymentMethod.value === 'cash_on_delivery') {
    return false
  }
  
  return true
})

// Calculer le total final (avec réduction)
const finalTotal = computed(() => {
  if (promoApplied.value && appliedPromoCode.value) {
    return Math.max(0, subtotal.value - appliedPromoCode.value.discount_amount)
  }
  return subtotal.value
})

// Formater le prix
const formatPrice = (price: number) => {
  const currency = props.shop?.currency || 'XOF'
  return `${price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency}`
}

// Obtenir l'image du produit
const getProductImage = (product: any) => {
  const config = useRuntimeConfig()
  const backendUrl = config.public.apiBase.replace('/api', '')
  
  if (product.preview_image) {
    return `${backendUrl}/storage/${product.preview_image}`
  }
  
  if (product.product_images && product.product_images.length > 0) {
    return `${backendUrl}/storage/${product.product_images[0].image_path}`
  }
  
  return 'https://placehold.co/400x400?text=Produit'
}

// Augmenter la quantité
const increaseQuantity = async (item: any) => {
  if (isUpdating.value) return
  
  isUpdating.value = item.id
  errorMessage.value = ''
  
  const success = await updateQuantity(shopSubdomain.value, item.id, item.quantity + 1)
  
  if (!success) {
    errorMessage.value = 'Erreur lors de la mise à jour'
  }
  
  isUpdating.value = null
}

// Diminuer la quantité
const decreaseQuantity = async (item: any) => {
  if (isUpdating.value || item.quantity <= 1) return
  
  isUpdating.value = item.id
  errorMessage.value = ''
  
  const success = await updateQuantity(shopSubdomain.value, item.id, item.quantity - 1)
  
  if (!success) {
    errorMessage.value = 'Erreur lors de la mise à jour'
  }
  
  isUpdating.value = null
}

// Supprimer un article
const handleRemoveItem = async (itemId: number) => {
  if (isRemoving.value) return
  
  if (!confirm('Voulez-vous vraiment supprimer cet article ?')) return
  
  isRemoving.value = itemId
  errorMessage.value = ''
  successMessage.value = ''
  
  const success = await removeItem(shopSubdomain.value, itemId)
  
  if (success) {
    successMessage.value = 'Article supprimé'
    setTimeout(() => successMessage.value = '', 3000)
  } else {
    errorMessage.value = 'Erreur lors de la suppression'
  }
  
  isRemoving.value = null
}

// Vider le panier
const handleClearCart = async () => {
  if (isClearing.value) return
  
  if (!confirm('Voulez-vous vraiment vider le panier ?')) return
  
  isClearing.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  const success = await clearCart(shopSubdomain.value)
  
  if (success) {
    successMessage.value = 'Panier vidé'
  } else {
    errorMessage.value = 'Erreur lors du vidage du panier'
  }
  
  isClearing.value = false
}

// Appliquer un code promo
const applyPromoCode = async () => {
  if (!promoCodeInput.value || !shopSubdomain.value) return
  
  promoError.value = ''
  isValidatingPromo.value = true
  
  try {
    const productIds = cartItems.value.map((item: any) => item.product_id)
    
    const result = await validatePromoCode(shopSubdomain.value, {
      code: promoCodeInput.value.toUpperCase(),
      cart_total: subtotal.value,
      product_ids: productIds
    })
    
    if (result) {
      promoApplied.value = true
      appliedPromoCode.value = result
      promoCodeInput.value = ''
    }
  } catch (err: any) {
    promoError.value = err.message || 'Code promo invalide'
  } finally {
    isValidatingPromo.value = false
  }
}

// Retirer le code promo
const removePromoCode = () => {
  promoApplied.value = false
  appliedPromoCode.value = null
  promoError.value = ''
  promoCodeInput.value = ''
}

// Créer la commande
const handleCreateOrder = async () => {
  if (!isFormValid.value || isCreatingOrder.value) return
  
  isCreatingOrder.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const orderData: any = {
      customer_name: orderForm.value.customer_name,
      customer_email: orderForm.value.customer_email,
      customer_phone: orderForm.value.customer_phone,
      delivery_method: orderForm.value.delivery_method,
      payment_method: selectedPaymentMethod.value,
      session_id: getSessionId()
    }
    
    // Ajouter l'adresse si livraison
    if (orderForm.value.delivery_method === 'delivery') {
      orderData.shipping_address = orderForm.value.shipping_address
    }
    
    // Ajouter le code promo si appliqué
    if (promoApplied.value && appliedPromoCode.value) {
      orderData.promo_code_id = appliedPromoCode.value.id
      orderData.discount_amount = appliedPromoCode.value.discount_amount
    }
    
    const order = await createOrder(shopSubdomain.value, orderData)
    
    if (order) {
      // Si paiement en ligne, initialiser le paiement
      if (selectedPaymentMethod.value !== 'cash_on_delivery') {
        try {
          // Construire l'URL de retour de base
          // Le backend ajoutera automatiquement le payment_id
          // Moneroo ajoutera: ?status=X&paymentId=Y&paymentStatus=Z
          // PayPal ajoutera: ?token=ORDER_ID&PayerID=PAYER_ID
          const returnUrl = `${window.location.origin}/boutique/${shopSubdomain.value}/payment-callback`
          
          const paymentResult = await initializePayment(
            order.id,
            selectedPaymentMethod.value,
            returnUrl
          )
          
          if (paymentResult.success && paymentResult.checkout_url) {
            // Rediriger vers la passerelle de paiement
            window.location.href = paymentResult.checkout_url
            return
          } else {
            errorMessage.value = 'Erreur lors de l\'initialisation du paiement'
          }
        } catch (paymentErr: any) {
          errorMessage.value = paymentErr.message || 'Erreur lors de l\'initialisation du paiement'
        }
      } else {
        // Paiement à la livraison - flux normal
        successMessage.value = 'Commande créée avec succès !'
        
        setTimeout(() => {
          fetchCart(shopSubdomain.value)
          
          if (!user.value) {
            orderForm.value.customer_name = ''
            orderForm.value.customer_email = ''
            orderForm.value.customer_phone = ''
          }
          orderForm.value.delivery_method = 'pickup'
          orderForm.value.shipping_address = {
            address: '',
            city: '',
            postal_code: '',
            country: ''
          }
          promoApplied.value = false
          appliedPromoCode.value = null
          
          alert(`Commande N°${order.order_number} créée avec succès !\n\nVous recevrez un email de confirmation à ${order.customer_email}`)
          
          router.push(`/boutique/${shopSubdomain.value}`)
        }, 1000)
      }
    } else {
      errorMessage.value = 'Erreur lors de la création de la commande'
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Erreur lors de la création de la commande'
  } finally {
    isCreatingOrder.value = false
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: v-bind(primaryColor);
}

.hover\:bg-secondary:hover {
  background-color: v-bind(secondaryColor);
}

.text-primary {
  color: v-bind(primaryColor);
}

.hover\:text-secondary:hover {
  color: v-bind(secondaryColor);
}
</style>
