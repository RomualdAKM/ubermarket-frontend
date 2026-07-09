<template>
  <!--
    pages/boutique/theme-organic/panier.vue
    ────────────────────────────────────────
    Page panier du thème Organic.

    Gestion :
      - Liste des articles (quantité modifiable, suppression)
      - Sous-total + frais de livraison + total
      - Code promo (si boutique abonnée plan standard+)
      - Bouton de validation commande
      - Articles recommandés (produits liés)
    
    Le panier est géré via le composable useCart() s'il est disponible,
    sinon via le localStorage avec réactivité locale.
  -->
  <div class="min-h-screen bg-gray-50" :style="{ fontFamily }">
    <HeaderOrganic :shop="shop" :primaryColor="primaryColor" :cartCount="cartItems.length" />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

      <!-- En-tête -->
      <div class="mb-8">
        <nav class="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <NuxtLink :to="`/boutique/${shop?.subdomain}`" class="hover:text-gray-600">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-gray-700">Panier</span>
        </nav>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
          Mon panier
          <span class="text-lg font-normal text-gray-400 ml-2">
            ({{ cartItems.length }} article{{ cartItems.length !== 1 ? 's' : '' }})
          </span>
        </h1>
      </div>

      <!-- ── Panier vide ── -->
      <div v-if="cartItems.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 text-5xl"
          :style="{ backgroundColor: primaryColor + '15' }">
          🛒
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-3">Votre panier est vide</h2>
        <p class="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
          Explorez nos produits et ajoutez vos articles préférés.
        </p>
        <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`"
          class="inline-block px-8 py-3.5 text-white font-semibold text-sm rounded-full transition-all hover:opacity-90"
          :style="{ backgroundColor: primaryColor }">
          Voir nos produits
        </NuxtLink>
      </div>

      <!-- ── Contenu panier ── -->
      <div v-else class="grid lg:grid-cols-3 gap-8">

        <!-- ════════════════════════════
             LISTE DES ARTICLES
             ════════════════════════════ -->
        <div class="lg:col-span-2 space-y-4">

          <!-- Article -->
          <div v-for="item in cartItems" :key="item.id"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5
                   flex gap-4 items-start">

            <!-- Image -->
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <img v-if="item.image" :src="item.image" :alt="item.name"
                class="w-full h-full object-cover select-none"
                @contextmenu.prevent @dragstart.prevent draggable="false" loading="lazy"/>
              <div v-else class="w-full h-full flex items-center justify-center text-gray-200">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>

            <!-- Infos -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between gap-2">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide mb-1"
                    :style="{ color: primaryColor }">
                    {{ item.subcategory || '' }}
                  </p>
                  <h3 class="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                    {{ item.name }}
                  </h3>
                  <!-- Variante sélectionnée -->
                  <p v-if="item.variant" class="text-xs text-gray-400 mt-0.5">{{ item.variant }}</p>
                </div>
                <!-- Bouton supprimer -->
                <button @click="removeItem(item.id)"
                  class="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                  title="Supprimer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>

              <!-- Prix + quantité -->
              <div class="flex items-center justify-between mt-3 flex-wrap gap-2">
                <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button @click="updateQty(item, item.qty - 1)"
                    class="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-bold">−</button>
                  <span class="px-4 py-1.5 text-sm font-semibold min-w-[2.5rem] text-center border-x border-gray-200">
                    {{ item.qty }}
                  </span>
                  <button @click="updateQty(item, item.qty + 1)"
                    class="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-bold">+</button>
                </div>
                <p class="text-base font-bold" :style="{ color: primaryColor }">
                  {{ formatPrice(item.price * item.qty) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Continuer les achats -->
          <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`"
            class="flex items-center gap-2 text-sm font-medium transition-colors"
            :style="{ color: primaryColor }">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Continuer les achats
          </NuxtLink>
        </div>

        <!-- ════════════════════════════
             RÉCAPITULATIF COMMANDE
             ════════════════════════════ -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 sticky top-28">
            <h2 class="text-base font-bold text-gray-900 mb-5">Récapitulatif</h2>

            <!-- Lignes de total -->
            <div class="space-y-3 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>

              <!-- Code promo -->
              <div v-if="promoApplied" class="flex justify-between text-green-600">
                <span>Réduction ({{ promoCode }})</span>
                <span>- {{ formatPrice(promoDiscount) }}</span>
              </div>

              <div class="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span v-if="deliveryFee === 0" class="text-green-600 font-medium">Gratuite 🎁</span>
                <span v-else>{{ formatPrice(deliveryFee) }}</span>
              </div>

              <div class="pt-3 border-t border-gray-100 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span :style="{ color: primaryColor }">{{ formatPrice(total) }}</span>
              </div>
            </div>

            <!-- Code promo (si plan standard+) -->
            <div v-if="!promoApplied" class="mt-5">
              <p class="text-xs font-medium text-gray-500 mb-2">Code promo</p>
              <div class="flex gap-2">
                <input v-model="promoInput" type="text" placeholder="PROMO2024"
                  class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 uppercase"
                  @keyup.enter="applyPromo"/>
                <button @click="applyPromo"
                  class="px-3 py-2 text-sm font-medium text-white rounded-xl"
                  :style="{ backgroundColor: primaryColor }">
                  OK
                </button>
              </div>
              <p v-if="promoError" class="text-xs text-red-500 mt-1">{{ promoError }}</p>
            </div>

            <!-- Livraison gratuite progress bar -->
            <div v-if="deliveryFee > 0" class="mt-4 p-3 bg-amber-50 rounded-xl text-xs text-amber-700">
              <p class="font-medium mb-1.5">
                Plus que {{ formatPrice(freeDeliveryThreshold - subtotal) }} pour la livraison gratuite !
              </p>
              <div class="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all"
                  :style="{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`, backgroundColor: '#f59e0b' }">
                </div>
              </div>
            </div>

            <!-- Bouton commander -->
            <button @click="checkout"
              class="mt-6 w-full py-3.5 text-white font-bold text-sm rounded-xl transition-all
                     hover:opacity-90 active:scale-[0.98]"
              :style="{ backgroundColor: primaryColor }">
              Commander maintenant →
            </button>

            <!-- Réassurance -->
            <div class="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span class="flex items-center gap-1">🔒 Paiement sécurisé</span>
              <span class="flex items-center gap-1">↩️ Retour 7j</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Articles recommandés ── -->
      <div v-if="recommendedProducts.length > 0" class="mt-16">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Vous aimerez aussi</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <NuxtLink v-for="p in recommendedProducts" :key="p.id"
            :to="`/boutique/${shop?.subdomain}/produit/${p.id}`"
            class="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all">
            <div class="aspect-square overflow-hidden bg-gray-50">
              <img v-if="p.preview_image" :src="getImageUrl(p.preview_image)" :alt="p.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 select-none"
                @contextmenu.prevent @dragstart.prevent draggable="false" loading="lazy"/>
            </div>
            <div class="p-3">
              <h3 class="text-sm font-semibold text-gray-900 line-clamp-2">{{ p.name }}</h3>
              <p class="text-sm font-bold mt-1" :style="{ color: primaryColor }">
                {{ formatPrice(p.promotional_price || p.price) }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </main>

    <FooterOrganic :shop="shop" :primaryColor="primaryColor"
      :footerText="footerText" :socialLinks="socialLinks"/>
  </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import HeaderOrganic from '@/components/theme_organic/HeaderOrganic.vue'
    import FooterOrganic from '@/components/theme_organic/FooterOrganic.vue'

    definePageMeta({ layout: false })

    interface Props { shop?: any; customizations?: any }
    const props  = defineProps<Props>()
    const config = useRuntimeConfig()

    // ── Couleurs / polices ────────────────────────────────────────────
    const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#2d9b5c')
    const fontFamily   = computed(() => props.customizations?.home?.fonts?.family   || 'sans-serif')
    const footerText   = computed(() => props.customizations?.footer?.text || `© ${new Date().getFullYear()} ${props.shop?.name}`)
    const socialLinks  = computed(() => props.customizations?.footer?.socialLinks || {})

    // ── Panier (état local réactif)
    // TODO : remplacer par useCart() si le composable est disponible dans le projet
    const cartItems = ref<any[]>([])

    // ── Seuil livraison gratuite (depuis customizations) ─────────────
    const freeDeliveryThreshold = computed(() =>
    props.customizations?.livraison?.free_threshold_amount || 25000
    )
    const deliveryFeeAmount = computed(() =>
    props.customizations?.livraison?.delivery_fee || 1000
    )

    // ── Calculs financiers ───────────────────────────────────────────
    const subtotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
    )
    const promoDiscount = ref(0)
    const deliveryFee   = computed(() =>
    subtotal.value >= freeDeliveryThreshold.value ? 0 : deliveryFeeAmount.value
    )
    const total = computed(() =>
    subtotal.value - promoDiscount.value + deliveryFee.value
    )

    // ── Gestion quantités ────────────────────────────────────────────
    const updateQty = (item: any, qty: number) => {
    if (qty < 1) { removeItem(item.id); return }
    item.qty = qty
    }
    const removeItem = (id: number) => {
    cartItems.value = cartItems.value.filter(i => i.id !== id)
    }

    // ── Code promo ───────────────────────────────────────────────────
    const promoInput   = ref('')
    const promoCode    = ref('')
    const promoApplied = ref(false)
    const promoError   = ref('')

    const applyPromo = async () => {
    if (!promoInput.value.trim()) return
    promoError.value = ''
    try {
        const res  = await fetch(`${config.public.apiBase}/shops/${props.shop?.subdomain}/promo/${promoInput.value.toUpperCase()}`)
        const data = await res.json()
        if (data.success) {
        promoCode.value    = promoInput.value.toUpperCase()
        promoApplied.value = true
        promoDiscount.value = data.discount_amount || Math.round(subtotal.value * (data.discount_percent || 0) / 100)
        } else {
        promoError.value = data.message || 'Code invalide ou expiré.'
        }
    } catch {
        promoError.value = 'Impossible de vérifier le code. Réessayez.'
    }
    }

    // ── Validation commande ──────────────────────────────────────────
    const checkout = () => {
    // Rediriger vers la page de commande / paiement
    navigateTo(`/boutique/${props.shop?.subdomain}/commande`)
    }

    // ── Produits recommandés (hors panier, actifs) ───────────────────
    const recommendedProducts = computed(() =>
    (props.shop?.products || [])
        .filter((p: any) => p.status === 'active' && !cartItems.value.find(i => i.id === p.id))
        .slice(0, 4)
    )

    // ── Helpers ──────────────────────────────────────────────────────
    const getImageUrl = (path: string): string => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${config.public.apiBase.replace('/api', '')}/storage/${path}`
    }

    const formatPrice = (price: number): string =>
    `${Number(price || 0).toLocaleString('fr-FR')} ${props.shop?.currency || 'XOF'}`
</script>