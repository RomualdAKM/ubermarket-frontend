<template>
  <div class="theme-cuisine" :style="cssVars">
    <HeaderCuisine :shop="shop" :primaryColor="primaryColor" :secondaryColor="secondaryColor" />

    <main class="cuisine-product-page">
      <div class="cuisine-container">
        <!-- Fil d'ariane -->
        <nav class="cuisine-breadcrumb" aria-label="Fil d'ariane">
          <NuxtLink :to="`/boutique/${shopSubdomain}`">Accueil</NuxtLink>
          <span>/</span>
          <span>{{ categoryName }}</span>
          <span>/</span>
          <span class="is-current">{{ productName }}</span>
        </nav>

        <div class="cuisine-product">
          <!-- Galerie -->
          <div class="cuisine-product__gallery">
            <div class="cuisine-product__main-img">
              <img
                :src="images[selectedImage].src"
                :alt="images[selectedImage].alt"
                @contextmenu.prevent
                @dragstart.prevent
                draggable="false"
              />
            </div>
            <div v-if="images.length > 1" class="cuisine-product__thumbs">
              <button
                v-for="(image, index) in images"
                :key="index"
                class="cuisine-product__thumb"
                :class="{ 'is-active': selectedImage === index }"
                @click="selectedImage = index"
              >
                <img :src="image.src" :alt="image.alt" />
              </button>
            </div>
          </div>

          <!-- Informations -->
          <div class="cuisine-product__info">
            <p class="cuisine-eyebrow">{{ categoryName }}</p>
            <h1 class="cuisine-product__title">{{ productName }}</h1>

            <div class="cuisine-product__rating">
              <span class="cuisine-product__stars">
                <span v-for="i in 5" :key="i" :class="{ 'is-filled': i <= Math.round(parseFloat(averageRating)) }">★</span>
              </span>
              <span class="cuisine-product__rating-count">{{ averageRating }} ({{ totalReviews }} avis)</span>
            </div>

            <div class="cuisine-product__price">
              <template v-if="isOnPromotion && totalOriginalPrice">
                <span class="cuisine-product__price-main">{{ formattedCalculatedPrice }}</span>
                <span class="cuisine-product__price-old">{{ totalOriginalPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) }} {{ shop?.currency }}</span>
                <span class="cuisine-product__badge">Promo</span>
              </template>
              <span v-else class="cuisine-product__price-main">{{ formattedCalculatedPrice }}</span>
            </div>

            <div v-if="isOnPromotion && product?.promotion_end_date" class="cuisine-product__countdown">
              <span>Offre valable encore :</span>
              <div class="cuisine-product__countdown-blocks">
                <span v-if="countdown.days > 0">{{ countdown.days }}j</span>
                <span>{{ String(countdown.hours).padStart(2, '0') }}h</span>
                <span>{{ String(countdown.minutes).padStart(2, '0') }}m</span>
                <span>{{ String(countdown.seconds).padStart(2, '0') }}s</span>
              </div>
            </div>

            <div class="cuisine-product__desc rich-description" v-html="productDescription"></div>

            <!-- Variantes -->
            <div v-if="!isDigitalProduct && Object.keys(groupedVariants).length > 0" class="cuisine-product__variants">
              <div v-for="(variants, variantName) in sortedGroupedVariants" :key="variantName" class="cuisine-variant-group">
                <p class="cuisine-variant-group__label">
                  {{ variantName }} : <strong>{{ selectedVariants[variantName]?.value || 'Non sélectionné' }}</strong>
                </p>
                <div class="cuisine-variant-group__options">
                  <button
                    v-for="variant in variants"
                    :key="variant.id"
                    type="button"
                    class="cuisine-variant-chip"
                    :class="{ 'is-active': selectedVariants[variantName]?.value === variant.value }"
                    @click="selectVariant(variantName, variant)"
                  >
                    {{ variant.value }}
                    <span v-if="variant.price_modifier && parseFloat(variant.price_modifier) !== 0" class="cuisine-variant-chip__mod">
                      ({{ parseFloat(variant.price_modifier) > 0 ? '+' : '' }}{{ parseFloat(variant.price_modifier).toLocaleString('fr-FR') }} {{ shop?.currency }})
                    </span>
                  </button>
                </div>
              </div>

              <div v-if="showVariantError" class="cuisine-alert cuisine-alert--error">
                {{ variantErrorMessage }}
              </div>
            </div>

            <!-- Quantité -->
            <div v-if="!isDigitalProduct" class="cuisine-product__qty">
              <span>Quantité</span>
              <div class="cuisine-qty-control">
                <button @click="decreaseQuantity" aria-label="Diminuer">−</button>
                <span>{{ quantity }}</span>
                <button @click="increaseQuantity" aria-label="Augmenter">+</button>
              </div>
              <span v-if="availableStock < 10 && availableStock > 0" class="cuisine-product__stock cuisine-product__stock--low">
                Plus que {{ availableStock }} disponible(s)
              </span>
              <span v-else-if="availableStock === 0" class="cuisine-product__stock cuisine-product__stock--out">
                Rupture de stock
              </span>
            </div>
            <div v-else class="cuisine-product__digital">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
              </svg>
              Produit numérique — livraison instantanée après achat
            </div>

            <!-- Code promo -->
            <div v-if="shop?.shop_type !== 'website'" class="cuisine-product__promo">
              <h3>Code promo</h3>
              <div v-if="promoApplied" class="cuisine-alert cuisine-alert--success">
                <span>Code <strong>{{ appliedPromoCode?.code }}</strong> appliqué (-{{ appliedPromoCode?.discount_amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) }} {{ shop?.currency }})</span>
                <button @click="removePromoCode" class="cuisine-link-btn">Retirer</button>
              </div>
              <div v-if="promoError" class="cuisine-alert cuisine-alert--error">{{ promoError }}</div>
              <div v-if="!promoApplied" class="cuisine-promo-form">
                <input
                  type="text"
                  v-model="promoCodeInput"
                  placeholder="Entrez votre code"
                  @keyup.enter="applyPromoCode"
                />
                <button @click="applyPromoCode" :disabled="!promoCodeInput || isValidatingPromo" class="cuisine-btn cuisine-btn--ghost-dark">
                  {{ isValidatingPromo ? 'Vérification...' : 'Appliquer' }}
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="cuisine-product__actions">
              <template v-if="shop?.shop_type !== 'website'">
                <div v-if="addToCartSuccess" class="cuisine-alert cuisine-alert--success">Ajouté au panier avec succès</div>
                <div v-if="addToCartError" class="cuisine-alert cuisine-alert--error">{{ addToCartError }}</div>

                <div class="cuisine-product__buttons">
                  <button
                    @click="handleAddToCart"
                    :disabled="isAddingToCart || (availableStock === 0 && !isPreorder)"
                    class="cuisine-btn cuisine-btn--primary cuisine-btn--full"
                  >
                    {{ isAddingToCart ? 'Ajout en cours...' : (availableStock === 0 && !isPreorder ? 'Rupture de stock' : 'Commander') }}
                  </button>
                  <NuxtLink :to="getCartUrl(props.shop)" class="cuisine-btn cuisine-btn--ghost-dark cuisine-btn--full">
                    Voir le panier
                  </NuxtLink>
                </div>
              </template>
              <template v-else>
                <div class="cuisine-alert cuisine-alert--info">
                  Ce plat est présenté à titre informatif. Contactez-nous pour réserver.
                </div>
              </template>

              <button
                @click="toggleWishlist"
                :disabled="isTogglingWishlist"
                class="cuisine-btn cuisine-btn--outline cuisine-btn--full"
                :class="{ 'is-active': isInWishlist(product?.id) }"
              >
                {{ isTogglingWishlist ? 'Chargement...' : (isInWishlist(product?.id) ? 'Retirer des favoris' : 'Ajouter aux favoris') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Avis clients -->
        <section class="cuisine-reviews">
          <div class="cuisine-section-header">
            <p class="cuisine-eyebrow">Ils ont goûté</p>
            <h2 class="cuisine-section-title">Avis clients</h2>
            <div class="cuisine-divider"><span class="cuisine-divider__ornament">✦</span></div>
          </div>

          <div v-if="isLoadingReviews" class="cuisine-reviews__loading">Chargement des avis...</div>

          <div v-else-if="!productReviews || productReviews.length === 0" class="cuisine-reviews__empty">
            <p>Aucun avis pour ce plat pour le moment.</p>
            <p class="cuisine-reviews__empty-sub">Soyez le premier à donner votre avis.</p>
          </div>

          <div v-else>
            <div class="cuisine-reviews__summary">
              <span class="cuisine-reviews__summary-number">{{ averageRating }}</span>
              <div>
                <span class="cuisine-product__stars">
                  <span v-for="i in 5" :key="i" :class="{ 'is-filled': i <= Math.round(parseFloat(averageRating)) }">★</span>
                </span>
                <p>Basé sur {{ totalReviews }} avis</p>
              </div>
            </div>

            <div class="cuisine-reviews__list">
              <div v-for="review in productReviews" :key="review.id" class="cuisine-review">
                <div class="cuisine-review__top">
                  <div>
                    <strong>{{ review.user?.name || 'Client' }}</strong>
                    <span v-if="review.is_verified_purchase" class="cuisine-review__verified">✓ Achat vérifié</span>
                  </div>
                  <span class="cuisine-review__date">{{ formatReviewDate(review.created_at) }}</span>
                </div>
                <span class="cuisine-product__stars">
                  <span v-for="(isFilled, index) in stars(review.rating)" :key="index" :class="{ 'is-filled': isFilled }">★</span>
                </span>
                <p v-if="review.comment" class="cuisine-review__comment">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <FooterCuisine
      :shop="shop"
      :backgroundColor="bgColor"
      :primaryColor="primaryColor"
      :footerText="footerText"
      :socialLinks="footerSocialLinks"
    />
  </div>
</template>

<script setup lang="ts">
    import HeaderCuisine from '@/components/theme_cuisine/HeaderCuisine.vue'
    import FooterCuisine from '@/components/theme_cuisine/FooterCuisine.vue'
    definePageMeta({ layout: false })
    // NOTE : HeaderCuisine et FooterCuisine sont désormais de vrais composants
    // partagés (voir components/theme_cuisine/). Tous les fichiers du thème
    // (produit.vue, produits.vue, panier.vue, a-propos.vue, cgu.vue, cgv.vue)
    // doivent les utiliser au lieu de dupliquer nav/footer inline.

    import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
    import { useReviews } from '~/composables/useReviews'
    import { useWishlist } from '~/composables/useWishlist'

    interface Props {
    shop?: any
    product?: any
    customizations?: any
    }
    const props = defineProps<Props>()

    const shop = computed(() => props.shop)
    const productName = computed(() => props.product?.name || 'Plat')
    const isPreorder = computed(() => props.product?.availability_type === 'preorder')

    // ============================
    // COULEURS (cohérentes avec index.vue)
    // ============================
    const primaryColor   = computed(() => props.customizations?.home?.colors?.primary    || '#8B1A1A')
    const secondaryColor = computed(() => props.customizations?.home?.colors?.secondary  || '#C9A84C')
    const bgColor         = computed(() => props.customizations?.home?.colors?.background || '#FAF7F2')
    const textColor       = computed(() => props.customizations?.home?.colors?.text       || '#1C1C1C')
    const fontFamily      = computed(() => props.customizations?.home?.fonts?.family      || "'Cormorant Garamond', Georgia, serif")

    const cssVars = computed(() => ({
    '--c-primary':   primaryColor.value,
    '--c-secondary': secondaryColor.value,
    '--c-bg':        bgColor.value,
    '--c-text':      textColor.value,
    '--c-font':      fontFamily.value,
    }))

    const isOnPromotion = computed(() => {
    if (!props.product?.promotional_price) return false
    const now = new Date()
    const startDate = props.product.promotion_start_date ? new Date(props.product.promotion_start_date) : null
    const endDate   = props.product.promotion_end_date   ? new Date(props.product.promotion_end_date)   : null
    if (!startDate && !endDate) return true
    return (!startDate || now >= startDate) && (!endDate || now <= endDate)
    })

    const basePrice = computed(() => {
    if (isOnPromotion.value && props.product?.promotional_price) return parseFloat(props.product.promotional_price)
    return parseFloat(props.product?.price || 0)
    })
    const originalPrice = computed(() => parseFloat(props.product?.price || 0))

    const productDescription = computed(() => props.product?.description || '')
    const categoryName = computed(() => props.product?.subcategory?.category?.name || 'Menu')
    const shopSubdomain = computed(() => props.shop?.subdomain || '')

    const footerText = computed(() => {
    if (props.customizations?.footer?.text) return props.customizations.footer.text
    return `© ${new Date().getFullYear()} ${shop.value?.name || 'Restaurant'}. Tous droits réservés.`
    })
    const footerSocialLinks = computed(() => props.customizations?.footer?.socialLinks || {
    facebook: '', instagram: '', twitter: '', linkedin: ''
    })

    // ============================
    // IMAGES
    // ============================
    const images = computed(() => {
    const productImages = []
    const config = useRuntimeConfig()
    const backendUrl = config.public.apiBase.replace('/api', '')

    if (props.product?.preview_image) {
        productImages.push({ src: `${backendUrl}/storage/${props.product.preview_image}`, alt: `${productName.value} - Image principale` })
    }
    if (props.product?.product_images && props.product.product_images.length > 0) {
        props.product.product_images.forEach((img: any, index: number) => {
        productImages.push({ src: `${backendUrl}/storage/${img.image_path}`, alt: img.alt_text || `${productName.value} - Image ${index + 1}` })
        })
    }
    if (productImages.length === 0) {
        productImages.push({ src: 'https://placehold.co/800x800?text=Aucune+image', alt: 'Aucune image disponible' })
    }
    return productImages
    })
    const selectedImage = ref(0)

    // ============================
    // VARIANTES (même logique fiabilisée que theme-epure)
    // ============================
    const productVariants = computed(() => props.product?.productVariants || props.product?.product_variants || [])
    const isDigitalProduct = computed(() => props.shop?.product_type === 'digital')

    const groupedVariants = computed(() => {
    const groups: Record<string, any[]> = {}
    if (!productVariants.value || !Array.isArray(productVariants.value)) return groups

    productVariants.value.forEach((v: any) => {
        if (v.attributes && typeof v.attributes === 'object') {
        Object.entries(v.attributes).forEach(([key, value]) => {
            const cleanedKey = key.trim()
            const cleanedValue = String(value).trim()
            if (!groups[cleanedKey]) groups[cleanedKey] = []
            if (!groups[cleanedKey].some(item => item.value === cleanedValue)) {
            groups[cleanedKey].push({
                id: v.id,
                value: cleanedValue,
                price_modifier: v.price_modifier || 0,
                stock: v.stock_quantity ?? 0
            })
            }
        })
        } else {
        const cleanedKey = typeof v.name === 'string' ? v.name.trim() : 'Option'
        const cleanedValue = typeof v.value === 'string' ? v.value.trim() : String(v.value || '')
        if (cleanedKey && cleanedValue) {
            if (!groups[cleanedKey]) groups[cleanedKey] = []
            if (!groups[cleanedKey].some(item => item.value === cleanedValue)) {
            groups[cleanedKey].push({
                id: v.id,
                value: cleanedValue,
                price_modifier: v.price_modifier || 0,
                stock: v.stock_quantity ?? 0
            })
            }
        }
        }
    })
    return groups
    })

    const sortedGroupedVariants = computed(() => {
    const sorted: Record<string, any[]> = {}
    const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '3XL', '4XL']
    Object.entries(groupedVariants.value).forEach(([key, list]) => {
        if (key.toLowerCase().includes('taille')) {
        sorted[key] = [...list].sort((a, b) => {
            const valA = String(a.value).toUpperCase().trim()
            const valB = String(b.value).toUpperCase().trim()
            const indexA = sizeOrder.indexOf(valA)
            const indexB = sizeOrder.indexOf(valB)
            if (indexA !== -1 && indexB !== -1) return indexA - indexB
            if (indexA !== -1) return -1
            if (indexB !== -1) return 1
            return valA.localeCompare(valB, undefined, { numeric: true })
        })
        } else {
        sorted[key] = list
        }
    })
    return sorted
    })

    const selectedVariants = ref<Record<string, any>>({})
    const showVariantError = ref(false)
    const variantErrorMessage = ref('')

    const selectVariant = (variantName: string, variant: any) => {
    selectedVariants.value[variantName] = variant
    showVariantError.value = false
    }

    const selectedVariantId = computed(() => {
    const selected = selectedVariants.value
    const requiredKeys = Object.keys(sortedGroupedVariants.value)
    if (requiredKeys.length === 0) return null
    if (requiredKeys.some(k => !selected[k])) return null

    const match = productVariants.value.find((v: any) => {
        if (!v.attributes || typeof v.attributes !== 'object') return false
        return requiredKeys.every(key => String(v.attributes[key]).trim() === String(selected[key]?.value).trim())
    })
    return match?.id ?? null
    })

    const calculatedPrice = computed(() => {
    let price = basePrice.value
    Object.values(selectedVariants.value).forEach((variant: any) => {
        if (variant?.price_modifier) price += parseFloat(variant.price_modifier)
    })
    return price
    })
    const totalPrice = computed(() => calculatedPrice.value * quantity.value)
    const finalPrice = computed(() => {
    if (promoApplied.value && appliedPromoCode.value) return Math.max(0, totalPrice.value - appliedPromoCode.value.discount_amount)
    return totalPrice.value
    })
    const calculatedOriginalPrice = computed(() => {
    if (!isOnPromotion.value) return null
    let price = originalPrice.value
    Object.values(selectedVariants.value).forEach((variant: any) => {
        if (variant?.price_modifier) price += parseFloat(variant.price_modifier)
    })
    return price
    })
    const totalOriginalPrice = computed(() => calculatedOriginalPrice.value ? calculatedOriginalPrice.value * quantity.value : null)
    const formattedCalculatedPrice = computed(() => `${finalPrice.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${props.shop?.currency || 'XOF'}`)

    const availableStock = computed(() => {
    if (isDigitalProduct.value || isPreorder.value) return 999999
    const requiredOptions = Object.keys(sortedGroupedVariants.value)
    const selectedOptionsList = Object.keys(selectedVariants.value)
    if (requiredOptions.length > selectedOptionsList.length) return 0

    const matchedId = selectedVariantId.value
    if (matchedId) {
        const matchedVariant = productVariants.value.find((v: any) => v.id === matchedId)
        return matchedVariant?.stock_quantity ?? 0
    }
    return props.product?.stock_quantity || 0
    })

    // ============================
    // SERVICES
    // ============================
    const { validatePromoCode } = usePromoCodes()
    const { addToCart } = useCart()
    const { reviews: productReviews, fetchProductReviews, isLoading: isLoadingReviews } = useReviews()
    const { addToWishlist, removeFromWishlist: removeFromWishlistAPI, isInWishlist } = useWishlist()
    const { isAuthenticated } = useAuth()
    const { getCartUrl } = useShopNavigation()

    const promoCodeInput = ref('')
    const promoApplied = ref(false)
    const appliedPromoCode = ref<any>(null)
    const promoError = ref('')
    const isValidatingPromo = ref(false)

    const isAddingToCart = ref(false)
    const addToCartSuccess = ref(false)
    const addToCartError = ref('')

    const handleAddToCart = async () => {
    if (!props.product?.id || !shopSubdomain.value) return

    const requiredOptions = Object.keys(sortedGroupedVariants.value)
    const selectedOptionsList = Object.keys(selectedVariants.value)
    const missingOptions = requiredOptions.filter(opt => !selectedOptionsList.includes(opt))

    if (missingOptions.length > 0) {
        variantErrorMessage.value = `Veuillez sélectionner : ${missingOptions.join(', ')}.`
        showVariantError.value = true
        return
    }

    if (availableStock.value === 0 && !isPreorder.value) {
        addToCartError.value = 'Ce plat est en rupture de stock avec ces options.'
        return
    }

    let variantIds: number[] | null = null
    if (!isDigitalProduct.value && requiredOptions.length > 0) {
        const matchedId = selectedVariantId.value
        if (matchedId) variantIds = [matchedId]
    }

    isAddingToCart.value = true
    addToCartSuccess.value = false
    addToCartError.value = ''

    try {
        const success = await addToCart(shopSubdomain.value, props.product.id, quantity.value, variantIds)
        if (success) {
        addToCartSuccess.value = true
        setTimeout(() => { addToCartSuccess.value = false }, 3000)
        } else {
        addToCartError.value = "Erreur lors de l'ajout au panier"
        }
    } catch (err: any) {
        addToCartError.value = err.message || "Erreur lors de l'ajout au panier"
    } finally {
        isAddingToCart.value = false
    }
    }

    const applyPromoCode = async () => {
    if (!promoCodeInput.value || !shopSubdomain.value) return
    promoError.value = ''
    isValidatingPromo.value = true
    try {
        const result = await validatePromoCode(shopSubdomain.value, {
        code: promoCodeInput.value.toUpperCase(),
        cart_total: totalPrice.value,
        product_ids: [props.product?.id]
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

    // ============================
    // QUANTITÉ
    // ============================
    const quantity = ref(1)
    const decreaseQuantity = () => {
    if (isDigitalProduct.value) { quantity.value = 1; return }
    if (quantity.value > 1) quantity.value--
    }
    const increaseQuantity = () => {
    if (isDigitalProduct.value) { quantity.value = 1; return }
    const stock = availableStock.value
    if (isPreorder.value || quantity.value < stock) quantity.value++
    }
    watch(isDigitalProduct, (isDigital) => { if (isDigital) quantity.value = 1 })

    // ============================
    // COMPTE À REBOURS PROMO
    // ============================
    const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const countdownInterval = ref<NodeJS.Timeout | null>(null)
    const updateCountdown = () => {
    if (!isOnPromotion.value || !props.product?.promotion_end_date) {
        countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
        return
    }
    const now = new Date().getTime()
    const endDate = new Date(props.product.promotion_end_date).getTime()
    const timeLeft = endDate - now
    if (timeLeft <= 0) {
        countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
        if (countdownInterval.value) clearInterval(countdownInterval.value)
        return
    }
    countdown.value = {
        days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeLeft % (1000 * 60)) / 1000)
    }
    }

    onMounted(() => {
    if (isOnPromotion.value && props.product?.promotion_end_date) {
        updateCountdown()
        countdownInterval.value = setInterval(updateCountdown, 1000)
    }
    if (props.product?.id) fetchProductReviews(props.product.id)
    })
    onUnmounted(() => { if (countdownInterval.value) clearInterval(countdownInterval.value) })

    const averageRating = computed(() => {
    if (!productReviews.value || productReviews.value.length === 0) return '0'
    const sum = productReviews.value.reduce((acc, review) => acc + review.rating, 0)
    return (sum / productReviews.value.length).toFixed(1)
    })
    const totalReviews = computed(() => productReviews.value?.length || 0)
    const stars = (rating: number) => Array.from({ length: 5 }, (_, i) => i < rating)
    const formatReviewDate = (dateString: string) => new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })

    // ============================
    // WISHLIST
    // ============================
    const isTogglingWishlist = ref(false)
    const toggleWishlist = async () => {
    if (!props.product?.id) return
    if (!isAuthenticated.value) {
        alert('Vous devez être connecté pour ajouter des plats à vos favoris')
        return
    }
    isTogglingWishlist.value = true
    try {
        if (isInWishlist(props.product.id)) await removeFromWishlistAPI(props.product.id)
        else await addToWishlist(props.product.id)
    } catch (err: any) {
        alert(err.message || "Erreur lors de l'opération")
    } finally {
        isTogglingWishlist.value = false
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

    .cuisine-eyebrow {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--c-gold); margin-bottom: 12px;
    }
    .cuisine-section-header { text-align: center; margin: 80px 0 48px; }
    .cuisine-section-title { font-family: var(--c-font); font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 600; margin-bottom: 12px; }
    .cuisine-divider { display: flex; align-items: center; justify-content: center; gap: 12px; }
    .cuisine-divider::before, .cuisine-divider::after { content: ''; width: 60px; height: 1px; background: var(--c-gold); }
    .cuisine-divider__ornament { color: var(--c-gold); font-size: 0.65rem; }

    .cuisine-product-page { padding-top: 120px; padding-bottom: 80px; }

    .cuisine-breadcrumb {
    display: flex; gap: 8px; align-items: center; font-size: 0.8rem; color: #888; margin-bottom: 40px;
    }
    .cuisine-breadcrumb a { color: #888; text-decoration: none; }
    .cuisine-breadcrumb a:hover { color: var(--c-primary); }
    .cuisine-breadcrumb .is-current { color: var(--c-text); font-weight: 500; }

    .cuisine-product { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
    @media (max-width: 900px) { .cuisine-product { grid-template-columns: 1fr; gap: 32px; } }

    .cuisine-product__main-img {
    aspect-ratio: 1; background: white; display: flex; align-items: center; justify-content: center; overflow: hidden;
    }
    .cuisine-product__main-img img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; user-select: none; -webkit-user-drag: none; }

    .cuisine-product__thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 12px; }
    .cuisine-product__thumb {
    aspect-ratio: 1; background: white; border: 2px solid transparent; padding: 0; cursor: pointer; overflow: hidden;
    }
    .cuisine-product__thumb.is-active { border-color: var(--c-primary); }
    .cuisine-product__thumb img { width: 100%; height: 100%; object-fit: cover; }

    .cuisine-product__title { font-family: var(--c-font); font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 600; margin-bottom: 16px; }

    .cuisine-product__rating { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
    .cuisine-product__stars { color: #ddd; letter-spacing: 2px; }
    .cuisine-product__stars .is-filled { color: var(--c-gold); }
    .cuisine-product__rating-count { font-size: 0.85rem; color: #888; }

    .cuisine-product__price { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
    .cuisine-product__price-main { font-family: var(--c-font); font-size: 2rem; font-weight: 600; color: var(--c-primary); }
    .cuisine-product__price-old { font-size: 1.1rem; color: #aaa; text-decoration: line-through; }
    .cuisine-product__badge {
    background: var(--c-primary); color: white; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 4px 10px;
    }

    .cuisine-product__countdown {
    display: flex; align-items: center; gap: 10px; font-size: 0.85rem; margin-bottom: 20px; color: var(--c-primary);
    }
    .cuisine-product__countdown-blocks { display: flex; gap: 4px; }
    .cuisine-product__countdown-blocks span {
    background: var(--c-cream); padding: 4px 8px; font-weight: 600; font-size: 0.8rem;
    }

    .cuisine-product__desc { font-size: 0.95rem; line-height: 1.8; color: #666; margin-bottom: 32px; }

    .cuisine-variant-group { margin-bottom: 24px; }
    .cuisine-variant-group__label { font-size: 0.85rem; margin-bottom: 10px; color: #666; }
    .cuisine-variant-group__label strong { color: var(--c-text); }
    .cuisine-variant-group__options { display: flex; flex-wrap: wrap; gap: 10px; }
    .cuisine-variant-chip {
    padding: 8px 18px; font-size: 0.8rem; font-weight: 500; background: white; border: 1.5px solid #ddd; cursor: pointer; transition: all 0.2s;
    }
    .cuisine-variant-chip:hover { border-color: var(--c-primary); }
    .cuisine-variant-chip.is-active { background: var(--c-primary); border-color: var(--c-primary); color: white; }
    .cuisine-variant-chip__mod { opacity: 0.75; font-size: 0.7rem; }

    .cuisine-alert { padding: 12px 16px; font-size: 0.85rem; margin-bottom: 16px; }
    .cuisine-alert--error { background: #FDECEC; color: #A32020; }
    .cuisine-alert--success { background: #EAF7EE; color: #1E7A3D; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .cuisine-alert--info { background: var(--c-cream); color: #555; }
    .cuisine-link-btn { background: none; border: none; color: #A32020; text-decoration: underline; cursor: pointer; font-size: 0.8rem; }

    .cuisine-product__qty { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
    .cuisine-qty-control { display: inline-flex; align-items: center; border: 1.5px solid #ddd; }
    .cuisine-qty-control button { width: 36px; height: 36px; background: none; border: none; cursor: pointer; font-size: 1.1rem; color: var(--c-text); }
    .cuisine-qty-control span { width: 36px; text-align: center; border-left: 1px solid #ddd; border-right: 1px solid #ddd; font-size: 0.9rem; }
    .cuisine-product__stock { font-size: 0.8rem; }
    .cuisine-product__stock--low { color: #B8860B; }
    .cuisine-product__stock--out { color: #A32020; }

    .cuisine-product__digital { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--c-primary); margin-bottom: 28px; }
    .cuisine-product__digital svg { width: 20px; height: 20px; }

    .cuisine-product__promo { margin-bottom: 28px; }
    .cuisine-product__promo h3 { font-size: 0.85rem; font-weight: 600; margin-bottom: 12px; }
    .cuisine-promo-form { display: flex; gap: 8px; }
    .cuisine-promo-form input {
    flex: 1; border: 1.5px solid #ddd; padding: 10px 14px; font-size: 0.85rem; text-transform: uppercase;
    }
    .cuisine-promo-form input:focus { outline: none; border-color: var(--c-primary); }

    .cuisine-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 28px;
    font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; cursor: pointer; transition: all 0.25s; border: none;
    }
    .cuisine-btn--full { width: 100%; }
    .cuisine-btn--primary { background: var(--c-primary); color: white; }
    .cuisine-btn--primary:hover:not(:disabled) { background: color-mix(in srgb, var(--c-primary) 80%, black); }
    .cuisine-btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .cuisine-btn--ghost-dark { background: transparent; color: var(--c-text); border: 1.5px solid #ccc; }
    .cuisine-btn--ghost-dark:hover { border-color: var(--c-primary); color: var(--c-primary); }
    .cuisine-btn--outline { background: transparent; border: 1.5px solid var(--c-gold); color: var(--c-text); margin-top: 12px; }
    .cuisine-btn--outline.is-active { background: var(--c-cream); border-color: var(--c-primary); color: var(--c-primary); }

    .cuisine-product__buttons { display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px; }
    @media (min-width: 480px) { .cuisine-product__buttons { flex-direction: row; } }

    .cuisine-reviews { padding-top: 40px; border-top: 1px solid #eee; }
    .cuisine-reviews__loading, .cuisine-reviews__empty { text-align: center; padding: 60px 20px; color: #999; }
    .cuisine-reviews__empty-sub { font-size: 0.85rem; margin-top: 6px; }

    .cuisine-reviews__summary { display: flex; align-items: center; gap: 16px; margin-bottom: 40px; }
    .cuisine-reviews__summary-number { font-family: var(--c-font); font-size: 2.5rem; font-weight: 600; color: var(--c-primary); }
    .cuisine-reviews__summary p { font-size: 0.85rem; color: #888; margin-top: 4px; }

    .cuisine-reviews__list { display: flex; flex-direction: column; gap: 28px; }
    .cuisine-review { border-bottom: 1px solid #eee; padding-bottom: 28px; }
    .cuisine-review__top { display: flex; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
    .cuisine-review__verified { margin-left: 10px; padding: 2px 8px; background: #EAF7EE; color: #1E7A3D; font-size: 0.7rem; font-weight: 600; }
    .cuisine-review__date { font-size: 0.8rem; color: #999; }
    .cuisine-review__comment { margin-top: 10px; font-size: 0.9rem; color: #555; line-height: 1.7; }

    .rich-description :deep(ul) { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
    .rich-description :deep(ol) { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
    .rich-description :deep(li) { margin-bottom: 0.25rem; }
    .rich-description :deep(p) { margin-bottom: 0.75rem; }
    .rich-description :deep(b), .rich-description :deep(strong) { font-weight: bold; }
    .rich-description :deep(i), .rich-description :deep(em) { font-style: italic; }
</style>