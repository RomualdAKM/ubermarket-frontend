<template>
  <div class="theme-cuisine" :style="cssVars">
    <HeaderCuisine :shop="shop" :primaryColor="primaryColor" force-scrolled-style />

    <main class="cuisine-cart-page">
      <div class="cuisine-container">

        <!-- Panier vide -->
        <div v-if="cartItems.length === 0" class="cuisine-cart-empty">
          <span class="cuisine-cart-empty__icon">🍽️</span>
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des plats pour commencer votre commande</p>
          <NuxtLink :to="`/boutique/${shopSubdomain}`" class="cuisine-btn cuisine-btn--primary">
            Continuer vos achats
          </NuxtLink>
        </div>

        <!-- Panier avec articles -->
        <div v-else class="cuisine-cart">
          <!-- Contenu du panier -->
          <div class="cuisine-cart__items-col">
            <div class="cuisine-cart__header">
              <h1 class="cuisine-section-title">Votre panier ({{ itemsCount }} article{{ itemsCount > 1 ? 's' : '' }})</h1>
              <NuxtLink :to="getHomeUrl(shop)" class="cuisine-cart__continue-link">Continuer vos achats</NuxtLink>
            </div>

            <div v-if="successMessage" class="cuisine-alert cuisine-alert--success">{{ successMessage }}</div>
            <div v-if="errorMessage" class="cuisine-alert cuisine-alert--error">{{ errorMessage }}</div>

            <div class="cuisine-cart__items">
              <div v-for="item in cartItems" :key="item.id" class="cuisine-cart-item">
                <div class="cuisine-cart-item__img">
                  <img
                    :src="getProductImage(item.product)"
                    :alt="item.product.name"
                    @contextmenu.prevent
                    @dragstart.prevent
                    draggable="false"
                  />
                </div>

                <div class="cuisine-cart-item__info">
                  <div class="cuisine-cart-item__top">
                    <h3>{{ item.product.name }}</h3>
                    <span v-if="item.product?.availability_type === 'preorder'" class="cuisine-cart-item__badge">
                      Précommande
                    </span>
                  </div>

                  <div v-if="item.variants && item.variants.length > 0" class="cuisine-cart-item__variants">
                    <p v-for="variant in item.variants" :key="variant.id">
                      {{ variant.name }}: <strong>{{ variant.value }}</strong>
                      <span v-if="variant.price_modifier && parseFloat(variant.price_modifier) !== 0">
                        ({{ parseFloat(variant.price_modifier) > 0 ? '+' : '' }}{{ parseFloat(variant.price_modifier).toLocaleString('fr-FR') }} {{ shop?.currency }})
                      </span>
                    </p>
                  </div>

                  <p class="cuisine-cart-item__unit-price">{{ formatPrice(item.price) }} l'unité</p>
                </div>

                <div class="cuisine-cart-item__total">{{ formatPrice(item.price * item.quantity) }}</div>

                <div class="cuisine-cart-item__controls">
                  <div class="cuisine-qty-control">
                    <button @click="decreaseQuantity(item)" :disabled="isUpdating === item.id" aria-label="Diminuer">−</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item)" :disabled="isUpdating === item.id" aria-label="Augmenter">+</button>
                  </div>
                  <button class="cuisine-cart-item__remove" @click="handleRemoveItem(item.id)" :disabled="isRemoving === item.id" aria-label="Retirer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <button @click="handleClearCart" :disabled="isClearing" class="cuisine-cart__clear">
              {{ isClearing ? 'Suppression en cours...' : 'Vider le panier' }}
            </button>
          </div>

          <!-- Résumé de la commande -->
          <aside class="cuisine-cart__summary">
            <h2>Résumé de la commande</h2>

            <!-- Connexion requise -->
            <div v-if="!user" class="cuisine-cart__auth-required">
              <div class="cuisine-alert cuisine-alert--info">
                <strong>Connexion requise</strong>
                <p>Vous devez être connecté pour passer commande et suivre vos achats.</p>
              </div>

              <NuxtLink :to="getLoginUrl(getCartUrl(shop), shop)" class="cuisine-btn cuisine-btn--primary cuisine-btn--full">
                Se connecter
              </NuxtLink>
              <NuxtLink :to="getSignupUrl(getCartUrl(shop), shop)" class="cuisine-btn cuisine-btn--ghost-dark cuisine-btn--full">
                Créer un compte
              </NuxtLink>

              <p class="cuisine-cart__auth-hint">
                Pas encore inscrit ? Créez votre compte en 30 secondes pour profiter du suivi de commande.
              </p>
            </div>

            <!-- Formulaire commande (si connecté) -->
            <div v-else>
              <div class="cuisine-cart__totals">
                <div v-if="hasPreorderProducts" class="cuisine-alert cuisine-alert--warning">
                  <strong>Précommande</strong>
                  <p v-if="preorderPaymentInfo?.paymentType === 'none'">
                    Certains plats sont en précommande. Vous serez contacté quand ils seront disponibles.
                  </p>
                  <p v-else-if="preorderPaymentInfo?.paymentType === 'deposit'">
                    Un acompte de {{ preorderPaymentInfo.totalDeposit.toLocaleString('fr-FR') }} {{ shop?.currency || 'XOF' }} est requis.
                  </p>
                  <p v-else>Le paiement intégral est requis pour les plats en précommande.</p>
                </div>

                <div class="cuisine-cart__summary-row">
                  <span>Sous-total</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div v-if="promoApplied && appliedPromoCode" class="cuisine-cart__summary-row cuisine-cart__summary-row--discount">
                  <span>Réduction</span>
                  <span>-{{ formatPrice(appliedPromoCode.discount_amount) }}</span>
                </div>
                <div class="cuisine-cart__summary-row cuisine-cart__summary-row--total">
                  <span>Total</span>
                  <span>{{ formatPrice(finalTotal) }}</span>
                </div>
              </div>

              <!-- Informations client -->
              <div class="cuisine-cart__section">
                <h3>Vos informations</h3>
                <input type="text" v-model="orderForm.customer_name" placeholder="Nom complet *" required />
                <input type="email" v-model="orderForm.customer_email" placeholder="Email *" required />
                <input type="tel" v-model="orderForm.customer_phone" placeholder="Téléphone *" required />
              </div>

              <!-- Mode de livraison -->
              <div v-if="!isDigitalShop" class="cuisine-cart__section">
                <h3>Mode de livraison</h3>
                <label class="cuisine-radio-option" :class="{ 'is-active': orderForm.delivery_method === 'pickup' }">
                  <input type="radio" v-model="orderForm.delivery_method" value="pickup" />
                  <span>Retrait sur place (Gratuit)</span>
                </label>
                <label class="cuisine-radio-option" :class="{ 'is-active': orderForm.delivery_method === 'delivery' }">
                  <input type="radio" v-model="orderForm.delivery_method" value="delivery" />
                  <span>Livraison à domicile</span>
                </label>

                <div v-if="orderForm.delivery_method === 'delivery'" class="cuisine-cart__address">
                  <input type="text" v-model="orderForm.shipping_address.address" placeholder="Adresse *" />
                  <input type="text" v-model="orderForm.shipping_address.city" placeholder="Ville *" />
                  <input type="text" v-model="orderForm.shipping_address.postal_code" placeholder="Code postal" />
                  <input type="text" v-model="orderForm.shipping_address.country" placeholder="Pays *" />
                </div>
              </div>

              <!-- Message boutiques digitales -->
              <div v-if="isDigitalShop" class="cuisine-cart__section">
                <div class="cuisine-alert cuisine-alert--info">
                  <strong>Produits numériques</strong>
                  <p>Après paiement, vous recevrez un email avec les liens de téléchargement.</p>
                </div>
              </div>

              <!-- Méthode de paiement -->
              <div class="cuisine-cart__section">
                <h3>Méthode de paiement</h3>
                <label
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="cuisine-radio-option"
                  :class="{ 'is-active': selectedPaymentMethod === method.id }"
                >
                  <input type="radio" v-model="selectedPaymentMethod" :value="method.id" />
                  <span>
                    <strong>{{ method.label }}</strong>
                    <small>{{ method.description }}</small>
                  </span>
                </label>
              </div>

              <!-- Code promo -->
              <div class="cuisine-cart__section">
                <h3>Code promo</h3>
                <div v-if="promoApplied" class="cuisine-alert cuisine-alert--success">
                  <span><strong>{{ appliedPromoCode?.code }}</strong></span>
                  <button @click="removePromoCode" class="cuisine-link-btn">Retirer</button>
                </div>
                <div v-else class="cuisine-promo-form">
                  <input type="text" v-model="promoCodeInput" placeholder="Code promo" @keyup.enter="applyPromoCode" />
                  <button @click="applyPromoCode" :disabled="!promoCodeInput || isValidatingPromo" class="cuisine-btn cuisine-btn--ghost-dark">
                    {{ isValidatingPromo ? '...' : 'Appliquer' }}
                  </button>
                </div>
                <p v-if="promoError" class="cuisine-field-error">{{ promoError }}</p>
              </div>

              <!-- CGV -->
              <div class="cuisine-cart__section">
                <label class="cuisine-checkbox-option">
                  <input type="checkbox" v-model="acceptCGV" />
                  <span>
                    J'accepte les
                    <NuxtLink :to="`/boutique/${shopSubdomain}/cgv`" target="_blank">Conditions Générales de Vente</NuxtLink>
                  </span>
                </label>
              </div>

              <button
                @click="handleCreateOrder"
                :disabled="isCreatingOrder || !isFormValid"
                class="cuisine-btn cuisine-btn--primary cuisine-btn--full"
              >
                {{ isCreatingOrder ? 'Création en cours...' : 'Valider la commande' }}
              </button>
              <p v-if="!isFormValid" class="cuisine-field-error cuisine-field-error--center">
                <span v-if="!acceptCGV">Veuillez accepter les CGV</span>
                <span v-else>Veuillez remplir tous les champs obligatoires</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>

    <FooterCuisine
      :shop="shop"
      :backgroundColor="bgColor"
      :primaryColor="primaryColor"
      :footerText="footerText"
      :socialLinks="socialLinks"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import HeaderCuisine from '@/components/theme_cuisine/HeaderCuisine.vue'
import FooterCuisine from '@/components/theme_cuisine/FooterCuisine.vue'
import { usePayment } from '~/composables/usePayment'
import { useCart } from '~/composables/useCart'
import { usePromoCodes } from '~/composables/usePromoCodes'
import { useOrders } from '~/composables/useOrders'
import { useAuth } from '~/composables/useAuth'
import { useRouter, useRuntimeConfig } from '#app'

interface Props {
  shop?: any
  customizations?: any
}
const props = defineProps<Props>()

definePageMeta({ layout: false })

// ============================
// COULEURS
// ============================
const primaryColor   = computed(() => props.customizations?.home?.colors?.primary    || '#8B1A1A')
const secondaryColor = computed(() => props.customizations?.home?.colors?.secondary  || '#C9A84C')
const bgColor        = computed(() => props.customizations?.home?.colors?.background || '#FAF7F2')
const textColor      = computed(() => props.customizations?.home?.colors?.text       || '#1C1C1C')
const fontFamily     = computed(() => props.customizations?.home?.fonts?.family      || "'Cormorant Garamond', Georgia, serif")

const cssVars = computed(() => ({
  '--c-primary':   primaryColor.value,
  '--c-secondary': secondaryColor.value,
  '--c-bg':        bgColor.value,
  '--c-text':      textColor.value,
  '--c-font':      fontFamily.value,
}))

const shop = computed(() => props.shop)
const shopSubdomain = computed(() => props.shop?.subdomain || '')

const footerText = computed(() =>
  props.customizations?.footer?.text ||
  `© ${new Date().getFullYear()} ${props.shop?.name || 'Restaurant'}. Tous droits réservés.`
)
const socialLinks = computed(() => props.customizations?.footer?.socialLinks || {})

// ============================
// COMPOSABLES
// ============================
const router = useRouter()
const { cartItems, subtotal, updateQuantity, removeItem, clearCart, fetchCart, getSessionId } = useCart()
const { validatePromoCode } = usePromoCodes()
const { createOrder } = useOrders()
const { initializePayment } = usePayment()
const { user } = useAuth()
const { getHomeUrl, getCartUrl, getLoginUrl, getSignupUrl } = useShopNavigation()
const config = useRuntimeConfig()

const itemsCount = computed(() => cartItems.value.reduce((total: number, item: any) => total + item.quantity, 0))

const isDigitalShop = computed(() => props.shop?.product_type === 'digital')

const hasPreorderProducts = computed(() =>
  cartItems.value.some((item: any) => item.product?.availability_type === 'preorder')
)

const preorderPaymentInfo = computed(() => {
  const preorderItems = cartItems.value.filter((item: any) => item.product?.availability_type === 'preorder')
  if (preorderItems.length === 0) return null

  let paymentType: 'none' | 'deposit' | 'full' = 'none'
  let totalDeposit = 0

  for (const item of preorderItems) {
    const product = item.product
    if (product.preorder_payment_type === 'full') {
      paymentType = 'full'
    } else if (product.preorder_payment_type === 'deposit' && paymentType !== 'full') {
      paymentType = 'deposit'
      const basePrice = product.promotional_price || product.price
      if (product.deposit_percentage) {
        totalDeposit += Math.round((basePrice * product.deposit_percentage) / 100) * item.quantity
      } else if (product.deposit_amount) {
        totalDeposit += product.deposit_amount * item.quantity
      }
    }
  }

  return { paymentType, totalDeposit }
})

// ============================
// ÉTAT
// ============================
const isUpdating = ref<number | null>(null)
const isRemoving = ref<number | null>(null)
const isClearing = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const promoCodeInput = ref('')
const promoApplied = ref(false)
const appliedPromoCode = ref<any>(null)
const promoError = ref('')
const isValidatingPromo = ref(false)

const acceptCGV = ref(false)

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

const paymentMethods = computed(() => {
  const methodsMap: Record<string, { id: string; label: string; description: string }> = {
    mobile_money: { id: 'mobile_money', label: 'Mobile Money', description: 'MTN, Moov, Orange Money' },
    card: { id: 'card', label: 'Carte bancaire', description: 'Visa, Mastercard' },
    cash_on_delivery: { id: 'cash_on_delivery', label: 'Paiement à la livraison', description: 'Payer en espèces à la réception' }
  }

  const shopMethods = props.shop?.payment_methods || []
  if (shopMethods.length > 0) {
    return shopMethods.map((m: any) => methodsMap[m.method]).filter(Boolean)
  }

  const defaultMethods = [methodsMap.mobile_money, methodsMap.card]
  if (!isDigitalShop.value) defaultMethods.push(methodsMap.cash_on_delivery)
  return defaultMethods
})

const selectedPaymentMethod = ref('mobile_money')

watch(user, (newUser) => {
  if (newUser) {
    orderForm.value.customer_name = newUser.name || ''
    orderForm.value.customer_email = newUser.email || ''
    orderForm.value.customer_phone = newUser.phone || ''
  }
}, { immediate: true })

watch(() => props.shop?.product_type, (productType) => {
  if (productType === 'digital') orderForm.value.delivery_method = 'pickup'
}, { immediate: true })

const isFormValid = computed(() => {
  const form = orderForm.value
  if (!form.customer_name || !form.customer_email || !form.customer_phone) return false
  if (!acceptCGV.value) return false

  if (!isDigitalShop.value && form.delivery_method === 'delivery') {
    if (!form.shipping_address.address || !form.shipping_address.city || !form.shipping_address.country) return false
  }

  if (isDigitalShop.value && selectedPaymentMethod.value === 'cash_on_delivery') return false

  return true
})

const finalTotal = computed(() => {
  if (promoApplied.value && appliedPromoCode.value) {
    return Math.max(0, subtotal.value - appliedPromoCode.value.discount_amount)
  }
  return subtotal.value
})

const formatPrice = (price: number) => {
  const currency = props.shop?.currency || 'XOF'
  return `${price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency}`
}

const getProductImage = (product: any) => {
  const backendUrl = config.public.apiBase.replace('/api', '')
  if (product.preview_image) return `${backendUrl}/storage/${product.preview_image}`
  if (product.product_images && product.product_images.length > 0) return `${backendUrl}/storage/${product.product_images[0].image_path}`
  return 'https://placehold.co/400x400?text=Plat'
}

const increaseQuantity = async (item: any) => {
  if (isUpdating.value) return
  if (item.product?.availability_type !== 'preorder' && item.quantity >= (item.product?.stock_quantity || 0)) {
    errorMessage.value = `Stock insuffisant (${item.product?.stock_quantity} disponible${item.product?.stock_quantity > 1 ? 's' : ''})`
    return
  }
  isUpdating.value = item.id
  errorMessage.value = ''
  const success = await updateQuantity(shopSubdomain.value, item.id, item.quantity + 1)
  if (!success) errorMessage.value = 'Erreur lors de la mise à jour'
  isUpdating.value = null
}

const decreaseQuantity = async (item: any) => {
  if (isUpdating.value || item.quantity <= 1) return
  isUpdating.value = item.id
  errorMessage.value = ''
  const success = await updateQuantity(shopSubdomain.value, item.id, item.quantity - 1)
  if (!success) errorMessage.value = 'Erreur lors de la mise à jour'
  isUpdating.value = null
}

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

const handleClearCart = async () => {
  if (isClearing.value) return
  if (!confirm('Voulez-vous vraiment vider le panier ?')) return
  isClearing.value = true
  errorMessage.value = ''
  successMessage.value = ''
  const success = await clearCart(shopSubdomain.value)
  if (success) successMessage.value = 'Panier vidé'
  else errorMessage.value = 'Erreur lors du vidage du panier'
  isClearing.value = false
}

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

const removePromoCode = () => {
  promoApplied.value = false
  appliedPromoCode.value = null
  promoError.value = ''
  promoCodeInput.value = ''
}

const handleCreateOrder = async () => {
  if (!user.value) {
    router.push(getLoginUrl())
    return
  }
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

    if (orderForm.value.delivery_method === 'delivery') {
      orderData.shipping_address = orderForm.value.shipping_address
    }
    if (promoApplied.value && appliedPromoCode.value) {
      orderData.promo_code_id = appliedPromoCode.value.id
      orderData.discount_amount = appliedPromoCode.value.discount_amount
    }

    const order = await createOrder(shopSubdomain.value, orderData)

    if (order) {
      const isPreorderNone = hasPreorderProducts.value && preorderPaymentInfo.value?.paymentType === 'none'

      if (selectedPaymentMethod.value !== 'cash_on_delivery' && !isPreorderNone) {
        try {
          const returnUrl = `${window.location.origin}/boutique/${shopSubdomain.value}/payment-callback`
          const paymentResult = await initializePayment(order.id, selectedPaymentMethod.value, returnUrl)

          if (paymentResult.success && paymentResult.checkout_url) {
            window.location.href = paymentResult.checkout_url
            return
          } else {
            errorMessage.value = "Erreur lors de l'initialisation du paiement"
          }
        } catch (paymentErr: any) {
          errorMessage.value = paymentErr.message || "Erreur lors de l'initialisation du paiement"
        }
      } else {
        const messageType = isPreorderNone ? 'Précommande' : 'Commande'
        successMessage.value = `${messageType} créée avec succès !`

        setTimeout(() => {
          fetchCart(shopSubdomain.value)
          if (!user.value) {
            orderForm.value.customer_name = ''
            orderForm.value.customer_email = ''
            orderForm.value.customer_phone = ''
          }
          orderForm.value.delivery_method = 'pickup'
          orderForm.value.shipping_address = { address: '', city: '', postal_code: '', country: '' }
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
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

.theme-cuisine {
  --c-primary:   #8B1A1A;
  --c-secondary: #C9A84C;
  --c-bg:        #FAF7F2;
  --c-text:      #1C1C1C;
  --c-font:      'Cormorant Garamond', Georgia, serif;
  --c-cream:     #F5EFE6;
  --c-gold:      #C9A84C;

  font-family: 'Jost', sans-serif;
  background-color: var(--c-bg);
  color: var(--c-text);
  min-height: 100vh;
}

.cuisine-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.cuisine-cart-page { padding-top: 140px; padding-bottom: 80px; }

.cuisine-section-title { font-family: var(--c-font); font-size: clamp(1.6rem, 3vw, 2rem); font-weight: 600; }

.cuisine-cart-empty { text-align: center; padding: 100px 20px; color: #888; }
.cuisine-cart-empty__icon { font-size: 3rem; display: block; margin-bottom: 16px; }
.cuisine-cart-empty h2 { font-family: var(--c-font); font-size: 1.8rem; font-weight: 600; color: var(--c-text); margin-bottom: 8px; }
.cuisine-cart-empty p { margin-bottom: 24px; }

.cuisine-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 28px;
  font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  text-decoration: none; cursor: pointer; transition: all 0.25s; border: none;
}
.cuisine-btn--full { width: 100%; margin-bottom: 10px; }
.cuisine-btn--primary { background: var(--c-primary); color: white; }
.cuisine-btn--primary:hover:not(:disabled) { background: color-mix(in srgb, var(--c-primary) 80%, black); }
.cuisine-btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
.cuisine-btn--ghost-dark { background: transparent; color: var(--c-text); border: 1.5px solid #ccc; }
.cuisine-btn--ghost-dark:hover { border-color: var(--c-primary); color: var(--c-primary); }

.cuisine-cart { display: grid; grid-template-columns: 1fr 380px; gap: 48px; align-items: start; }
@media (max-width: 900px) { .cuisine-cart { grid-template-columns: 1fr; } }

.cuisine-cart__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.cuisine-cart__continue-link { font-size: 0.8rem; color: var(--c-primary); text-decoration: none; }
.cuisine-cart__continue-link:hover { text-decoration: underline; }

.cuisine-alert { padding: 12px 16px; font-size: 0.85rem; margin-bottom: 16px; }
.cuisine-alert--error { background: #FDECEC; color: #A32020; }
.cuisine-alert--success { background: #EAF7EE; color: #1E7A3D; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.cuisine-alert--info { background: var(--c-cream); color: #555; }
.cuisine-alert--warning { background: #FFF6E5; color: #8A5A00; }
.cuisine-alert strong { display: block; margin-bottom: 4px; }
.cuisine-alert p { margin: 0; font-size: 0.8rem; }

.cuisine-cart__items { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }

.cuisine-cart-item {
  display: grid; grid-template-columns: 80px 1fr auto auto; align-items: center; gap: 16px;
  background: white; padding: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
@media (max-width: 640px) { .cuisine-cart-item { grid-template-columns: 60px 1fr; grid-template-rows: auto auto; } }

.cuisine-cart-item__img { width: 80px; height: 80px; background: var(--c-cream); overflow: hidden; flex-shrink: 0; }
.cuisine-cart-item__img img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; user-select: none; -webkit-user-drag: none; }

.cuisine-cart-item__top { display: flex; align-items: center; gap: 8px; }
.cuisine-cart-item__info h3 { font-family: var(--c-font); font-size: 1.1rem; font-weight: 600; }
.cuisine-cart-item__badge {
  background: #FFF6E5; color: #8A5A00; font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.05em; padding: 2px 8px; border-radius: 999px;
}
.cuisine-cart-item__variants { margin-top: 4px; }
.cuisine-cart-item__variants p { font-size: 0.78rem; color: #888; }
.cuisine-cart-item__unit-price { font-size: 0.8rem; color: #999; margin-top: 4px; }

.cuisine-cart-item__total { font-family: var(--c-font); font-weight: 600; font-size: 1rem; white-space: nowrap; }

.cuisine-cart-item__controls { display: flex; align-items: center; gap: 12px; }
.cuisine-qty-control { display: inline-flex; align-items: center; border: 1.5px solid #ddd; }
.cuisine-qty-control button { width: 30px; height: 30px; background: none; border: none; cursor: pointer; font-size: 1rem; }
.cuisine-qty-control button:disabled { opacity: 0.4; cursor: not-allowed; }
.cuisine-qty-control span { width: 30px; text-align: center; border-left: 1px solid #ddd; border-right: 1px solid #ddd; font-size: 0.85rem; }

.cuisine-cart-item__remove { background: none; border: none; cursor: pointer; color: #bbb; padding: 6px; transition: color 0.2s; }
.cuisine-cart-item__remove svg { width: 18px; height: 18px; }
.cuisine-cart-item__remove:hover:not(:disabled) { color: #A32020; }

.cuisine-cart__clear { background: none; border: none; font-size: 0.8rem; color: #888; text-decoration: underline; cursor: pointer; }
.cuisine-cart__clear:hover { color: #A32020; }

.cuisine-cart__summary {
  background: white; padding: 28px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); position: sticky; top: 100px;
}
.cuisine-cart__summary h2 { font-family: var(--c-font); font-size: 1.3rem; font-weight: 600; margin-bottom: 20px; }

.cuisine-cart__auth-hint { font-size: 0.75rem; color: #999; text-align: center; margin-top: 12px; }

.cuisine-cart__totals { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
.cuisine-cart__summary-row { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 10px; color: #555; }
.cuisine-cart__summary-row--discount { color: #1E7A3D; }
.cuisine-cart__summary-row--total { font-family: var(--c-font); font-size: 1.2rem; font-weight: 600; color: var(--c-text); }

.cuisine-cart__section { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #eee; }
.cuisine-cart__section h3 { font-size: 0.85rem; font-weight: 600; margin-bottom: 12px; }
.cuisine-cart__section input[type="text"],
.cuisine-cart__section input[type="email"],
.cuisine-cart__section input[type="tel"] {
  width: 100%; border: 1.5px solid #ddd; padding: 10px 14px; font-size: 0.85rem; margin-bottom: 8px; font-family: 'Jost', sans-serif;
}
.cuisine-cart__section input:focus { outline: none; border-color: var(--c-primary); }

.cuisine-cart__address { margin-top: 10px; }

.cuisine-radio-option {
  display: flex; align-items: center; gap: 10px; padding: 12px; border: 1.5px solid #ddd; margin-bottom: 8px; cursor: pointer; transition: all 0.2s;
}
.cuisine-radio-option.is-active { border-color: var(--c-primary); background: var(--c-cream); }
.cuisine-radio-option span { font-size: 0.85rem; display: flex; flex-direction: column; }
.cuisine-radio-option small { font-size: 0.72rem; color: #999; margin-top: 2px; }

.cuisine-promo-form { display: flex; gap: 8px; }
.cuisine-promo-form input { flex: 1; border: 1.5px solid #ddd; padding: 10px 14px; font-size: 0.85rem; text-transform: uppercase; }
.cuisine-link-btn { background: none; border: none; color: #A32020; text-decoration: underline; cursor: pointer; font-size: 0.75rem; }

.cuisine-checkbox-option { display: flex; align-items: flex-start; gap: 8px; font-size: 0.82rem; cursor: pointer; }
.cuisine-checkbox-option input { margin-top: 3px; }
.cuisine-checkbox-option a { color: var(--c-primary); font-weight: 600; }

.cuisine-field-error { font-size: 0.75rem; color: #A32020; margin-top: 6px; }
.cuisine-field-error--center { text-align: center; }
</style>
