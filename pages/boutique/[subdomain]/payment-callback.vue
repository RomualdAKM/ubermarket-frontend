<template>
  <div class="min-h-screen bg-white flex items-center justify-center">
    <div v-if="isVerifying" class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Vérification du paiement...</p>
    </div>

    <div v-else-if="verificationError" class="text-center max-w-md mx-auto p-6">
      <svg class="h-16 w-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      <h2 class="mt-4 text-2xl font-medium text-gray-900">Paiement échoué</h2>
      <p class="mt-2 text-gray-600">{{ verificationError }}</p>
      <NuxtLink :to="`/boutique/${subdomain}`" class="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary">
        Retour à la boutique
      </NuxtLink>
    </div>

    <div v-else-if="paymentSuccess" class="text-center max-w-md mx-auto p-6">
      <svg class="h-16 w-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <h2 class="mt-4 text-2xl font-medium text-gray-900">Paiement réussi !</h2>
      <p class="mt-2 text-gray-600">Votre commande a été confirmée.</p>
      <p class="mt-1 text-sm text-gray-500">Numéro de commande : <strong>{{ orderNumber }}</strong></p>
      <div class="mt-6 space-y-3">
        <NuxtLink :to="`/boutique/${subdomain}`" class="block px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary">
          Retour à la boutique
        </NuxtLink>
        <NuxtLink v-if="isAuthenticated" to="/dashboard-client/commandes" class="block px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
          Voir mes commandes
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePayment } from '~/composables/usePayment'
import { useAuth } from '~/composables/useAuth'
import { useCart } from '~/composables/useCart'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const subdomain = route.params.subdomain as string
const { verifyPayment } = usePayment()
const { user } = useAuth()
const { clearCart } = useCart()

const isVerifying = ref(true)
const verificationError = ref('')
const paymentSuccess = ref(false)
const orderNumber = ref('')
const isAuthenticated = computed(() => !!user.value)

onMounted(async () => {
  // Extract local payment ID (our internal ID)
  const localPaymentId = route.query.local_payment_id as string
  
  // Extract gateway-specific IDs
  // Moneroo returns: ?status=X&paymentId=Y&paymentStatus=Z
  // PayPal returns: ?token=ORDER_ID&PayerID=PAYER_ID
  const monerooPaymentId = route.query.paymentId as string
  const paypalToken = route.query.token as string
  const gatewayId = monerooPaymentId || paypalToken

  if (!localPaymentId) {
    verificationError.value = 'Identifiant de paiement manquant'
    isVerifying.value = false
    return
  }

  try {
    const result = await verifyPayment(parseInt(localPaymentId), gatewayId)
    
    if (result.success && result.status === 'completed') {
      paymentSuccess.value = true
      orderNumber.value = result.order_number || 'N/A'
      
      // Vider le panier après paiement réussi
      await clearCart(subdomain)
    } else {
      verificationError.value = 'Le paiement n\'a pas pu être confirmé'
    }
  } catch (error: any) {
    verificationError.value = error.message || 'Erreur lors de la vérification du paiement'
  } finally {
    isVerifying.value = false
  }
})
</script>
