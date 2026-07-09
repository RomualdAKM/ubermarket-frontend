<template>
  <!--
    pages/boutique/theme-organic/contact.vue
    ─────────────────────────────────────────
    Page Contact avec formulaire fonctionnel du thème Organic.

    Le formulaire envoie les données à :
      POST /api/shops/{subdomain}/contact
    
    Infos de contact configurables dans :
      Dashboard → Personnalisation → onglet "Contact"
      → customizations.contact.email/phone/address/hours

    Le vendeur peut désactiver/activer cette page depuis
    le dashboard de personnalisation (thème la supporte).
  -->
  <div class="min-h-screen bg-gray-50" :style="{ fontFamily }">
    <HeaderOrganic :shop="shop" :primaryColor="primaryColor" :cartCount="0" />

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

      <!-- En-tête -->
      <div class="text-center mb-12">
        <span class="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          :style="{ backgroundColor: primaryColor + '20', color: primaryColor }">
          Nous contacter
        </span>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {{ contactTitle || 'Une question ? Un conseil ?' }}
        </h1>
        <p class="text-gray-500 max-w-md mx-auto">
          {{ contactSubtitle || 'Notre équipe vous répond dans les meilleurs délais.' }}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">

        <!-- ════════════════════════════════════════
             INFORMATIONS DE CONTACT (sidebar)
             ════════════════════════════════════════ -->
        <div class="space-y-5">

          <!-- Carte info -->
          <div v-for="info in contactInfos" :key="info.label"
            class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              :style="{ backgroundColor: primaryColor + '15' }">
              <span class="text-xl">{{ info.icon }}</span>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ info.label }}</p>
              <p class="text-sm font-medium text-gray-900 whitespace-pre-line">{{ info.value }}</p>
            </div>
          </div>

          <!-- Réseaux sociaux -->
          <div v-if="hasSocialLinks" class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Retrouvez-nous</p>
            <div class="flex gap-3">
              <a v-if="socialLinks?.facebook" :href="socialLinks.facebook" target="_blank"
                class="w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-blue-50 hover:bg-blue-100">
                <svg class="w-4 h-4 text-blue-600 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a v-if="socialLinks?.instagram" :href="socialLinks.instagram" target="_blank"
                class="w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-pink-50 hover:bg-pink-100">
                <svg class="w-4 h-4 text-pink-600 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════════════════
             FORMULAIRE DE CONTACT
             ════════════════════════════════════════ -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

            <!-- Message de succès -->
            <div v-if="formSent"
              class="text-center py-10">
              <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                :style="{ backgroundColor: primaryColor + '20' }">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  :style="{ color: primaryColor }">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Message envoyé !</h3>
              <p class="text-gray-500 text-sm mb-6">
                Merci pour votre message. Nous vous répondons généralement sous 24 heures.
              </p>
              <button @click="formSent = false"
                class="px-5 py-2 text-sm font-medium rounded-full text-white"
                :style="{ backgroundColor: primaryColor }">
                Envoyer un autre message
              </button>
            </div>

            <!-- Formulaire -->
            <form v-else @submit.prevent="submitForm" class="space-y-5">
              <h2 class="text-lg font-semibold text-gray-900 mb-6">Envoyez-nous un message</h2>

              <!-- Nom + Email -->
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Nom complet <span class="text-red-500">*</span>
                  </label>
                  <input v-model="form.name" type="text" required
                    placeholder="Votre nom"
                    class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                    :style="{ '--tw-ring-color': primaryColor + '40' }"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input v-model="form.email" type="email" required
                    placeholder="votre@email.com"
                    class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
              </div>

              <!-- Téléphone + Sujet -->
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                  <input v-model="form.phone" type="tel"
                    placeholder="+229 90 00 00 00"
                    class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Sujet</label>
                  <select v-model="form.subject"
                    class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all">
                    <option value="question">Question sur un produit</option>
                    <option value="commande">Suivi de commande</option>
                    <option value="retour">Retour / Remboursement</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <!-- Message -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Message <span class="text-red-500">*</span>
                </label>
                <textarea v-model="form.message" required rows="5"
                  placeholder="Décrivez votre demande en détail..."
                  class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 resize-none transition-all">
                </textarea>
              </div>

              <!-- Erreur API -->
              <p v-if="formError" class="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                ⚠️ {{ formError }}
              </p>

              <!-- Bouton envoi -->
              <button type="submit" :disabled="isSubmitting"
                class="w-full py-3.5 text-white font-semibold text-sm rounded-xl transition-all
                       flex items-center justify-center gap-2 disabled:opacity-60"
                :style="{ backgroundColor: primaryColor }">
                <svg v-if="isSubmitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le message' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>

    <FooterOrganic :shop="shop" :primaryColor="primaryColor"
      :footerText="footerText" :socialLinks="socialLinks"/>
  </div>
</template>

<script setup lang="ts">
    import { ref, computed, reactive } from 'vue'
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
    const hasSocialLinks = computed(() =>
    Object.values(socialLinks.value || {}).some(Boolean)
    )

    // ── Contenu depuis customizations.contact ─────────────────────────
    const contactTitle    = computed(() => props.customizations?.contact?.title    || '')
    const contactSubtitle = computed(() => props.customizations?.contact?.subtitle || '')

    // ── Infos de contact (configurables dans personnalisation.vue) ────
    const contactInfos = computed(() => {
    const c = props.customizations?.contact || {}
    const infos = []
    if (c.email || props.shop?.email) {
        infos.push({ icon: '📧', label: 'Email', value: c.email || props.shop?.email })
    }
    if (c.phone || props.shop?.phone) {
        infos.push({ icon: '📞', label: 'Téléphone', value: c.phone || props.shop?.phone })
    }
    if (c.address) {
        infos.push({ icon: '📍', label: 'Adresse', value: c.address })
    }
    if (c.hours) {
        infos.push({ icon: '🕐', label: 'Horaires', value: c.hours })
    }
    // Valeurs par défaut si rien de configuré
    if (!infos.length) {
        infos.push(
        { icon: '📧', label: 'Email', value: 'contact@boutique.com' },
        { icon: '📞', label: 'Téléphone', value: '+229 90 00 00 00' },
        { icon: '🕐', label: 'Horaires', value: 'Lun-Sam : 8h - 18h' },
        )
    }
    return infos
    })

    // ── Formulaire ────────────────────────────────────────────────────
    const form = reactive({
    name: '', email: '', phone: '', subject: 'question', message: ''
    })
    const isSubmitting = ref(false)
    const formSent     = ref(false)
    const formError    = ref('')

    /**
     * Soumet le formulaire de contact.
     * Endpoint : POST /api/shops/{subdomain}/contact
     * Le backend envoie un email au vendeur avec les infos du client.
     */
    const submitForm = async () => {
    isSubmitting.value = true
    formError.value = ''
    try {
        const res = await fetch(
        `${config.public.apiBase}/shops/${props.shop?.subdomain}/contact`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(form),
        }
        )
        const data = await res.json()
        if (data.success) {
        formSent.value = true
        Object.assign(form, { name: '', email: '', phone: '', subject: 'question', message: '' })
        } else {
        formError.value = data.message || 'Une erreur est survenue. Veuillez réessayer.'
        }
    } catch {
        formError.value = 'Impossible d\'envoyer le message. Vérifiez votre connexion.'
    } finally {
        isSubmitting.value = false
    }
    }
</script>