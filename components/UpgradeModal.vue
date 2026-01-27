<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="close"
      >
        <div class="bg-white w-full max-w-lg shadow-xl">
          <!-- Header -->
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Mise à niveau requise</h3>
                <p class="text-sm text-gray-500">{{ message }}</p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <p class="text-gray-600 mb-4">
              Cette fonctionnalité n'est pas disponible avec votre abonnement actuel. 
              Passez à un plan supérieur pour débloquer cette fonctionnalité et bien plus encore.
            </p>

            <!-- Fonctionnalités du plan recommandé -->
            <div class="bg-gray-50 p-4 mb-6">
              <p class="text-sm font-medium text-gray-700 mb-3">Avec le plan {{ recommendedPlan }}, vous avez accès à :</p>
              <ul class="space-y-2">
                <li v-for="feature in features" :key="feature" class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-6 pt-0 flex gap-3">
            <button 
              @click="close" 
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Plus tard
            </button>
            <NuxtLink 
              :to="subscriptionLink"
              @click="close"
              class="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium text-center hover:bg-primary/90 transition-colors"
            >
              Voir les plans
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  isOpen: boolean
  message?: string
  feature?: string
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  message: 'Passez à un plan supérieur pour accéder à cette fonctionnalité',
  feature: ''
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()

// Plan recommandé selon la fonctionnalité
const recommendedPlan = computed(() => {
  if (props.feature === 'custom_payment_keys') {
    return 'Premium'
  }
  return 'Standard'
})

// Fonctionnalités selon le plan
const features = computed(() => {
  if (props.feature === 'custom_payment_keys') {
    return [
      'Clés de paiement personnalisées',
      'Jusqu\'à 10 boutiques',
      'Jusqu\'à 1000 produits',
      'Tous les modules inclus',
      'Support prioritaire 24/7'
    ]
  }
  return [
    'Jusqu\'à 3 boutiques',
    'Jusqu\'à 200 produits',
    'Module Livraisons',
    'Module Codes Promo',
    'Support prioritaire'
  ]
})

// Lien vers la page d'abonnement
const subscriptionLink = computed(() => {
  const pathParts = route.path.split('/')
  const slugIndex = pathParts.findIndex(p => p === 'dashboard-vendor') + 1
  const slug = pathParts[slugIndex] || ''
  if (slug) {
    return `/dashboard-vendor/${slug}/subscription/abonnement`
  }
  return '/mes-boutiques'
})

const close = () => {
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
