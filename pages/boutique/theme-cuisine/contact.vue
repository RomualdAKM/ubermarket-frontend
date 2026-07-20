<template>
  <div class="theme-cuisine" :style="cssVars">
    <HeaderCuisine :shop="shop" :primaryColor="primaryColor" force-scrolled-style />

    <main class="cuisine-contact-page">
      <div class="cuisine-container">
        <div class="cuisine-section-header">
          <p class="cuisine-eyebrow">Une question, une réservation ?</p>
          <h1 class="cuisine-section-title">Contactez-nous</h1>
          <div class="cuisine-divider"><span class="cuisine-divider__ornament">✦</span></div>
        </div>

        <div class="cuisine-contact">
          <!-- Colonne infos -->
          <div class="cuisine-contact__info">
            <div v-if="contactPhone" class="cuisine-contact__item">
              <div class="cuisine-contact__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z"/>
                </svg>
              </div>
              <div>
                <h3>Téléphone</h3>
                <a :href="`tel:${contactPhone.replace(/\s/g, '')}`">{{ contactPhone }}</a>
              </div>
            </div>

            <div v-if="contactAddress" class="cuisine-contact__item">
              <div class="cuisine-contact__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                </svg>
              </div>
              <div>
                <h3>Adresse</h3>
                <p>{{ contactAddress }}</p>
              </div>
            </div>

            <div v-if="contactHours" class="cuisine-contact__item">
              <div class="cuisine-contact__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
              </div>
              <div>
                <h3>Horaires</h3>
                <p class="cuisine-contact__hours">{{ contactHours }}</p>
              </div>
            </div>

            <div v-if="!contactPhone && !contactAddress && !contactHours" class="cuisine-contact__empty">
              <p>Les informations de contact de cette boutique seront bientôt disponibles.</p>
            </div>

            <!-- Réseaux sociaux -->
            <div v-if="hasSocialLinks" class="cuisine-contact__social">
              <h3>Suivez-nous</h3>
              <div class="cuisine-contact__social-links">
                <a v-if="socialLinks.facebook" :href="socialLinks.facebook" target="_blank" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a v-if="socialLinks.instagram" :href="socialLinks.instagram" target="_blank" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a v-if="socialLinks.twitter" :href="socialLinks.twitter" target="_blank" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Colonne formulaire -->
          <div class="cuisine-contact__form-col">
            <form v-if="!formSubmitted" class="cuisine-contact-form" @submit.prevent="submitForm">
              <!-- Honeypot anti-spam : champ invisible pour un humain, souvent rempli par les bots -->
              <div class="cuisine-honeypot" aria-hidden="true">
                <label for="website">Ne pas remplir ce champ</label>
                <input id="website" v-model="honeypot" type="text" name="website" tabindex="-1" autocomplete="off" />
              </div>

              <div class="cuisine-form-row">
                <label for="contact-form-name">Nom complet <span>*</span></label>
                <input id="contact-form-name" v-model="form.name" type="text" required maxlength="255" />
              </div>

              <div class="cuisine-form-row">
                <label for="contact-form-email">Email <span>*</span></label>
                <input id="contact-form-email" v-model="form.email" type="email" required maxlength="255" />
              </div>

              <div class="cuisine-form-row">
                <label for="contact-form-phone">Téléphone</label>
                <input id="contact-form-phone" v-model="form.phone" type="tel" maxlength="30" />
              </div>

              <div class="cuisine-form-row">
                <label for="contact-form-subject">Sujet</label>
                <input id="contact-form-subject" v-model="form.subject" type="text" maxlength="255" />
              </div>

              <div class="cuisine-form-row">
                <label for="contact-form-message">Message <span>*</span></label>
                <textarea id="contact-form-message" v-model="form.message" rows="5" required maxlength="5000"></textarea>
              </div>

              <div v-if="formError" class="cuisine-form-error">{{ formError }}</div>

              <button type="submit" class="cuisine-btn cuisine-btn--primary cuisine-btn--full" :disabled="isSubmitting">
                {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le message' }}
              </button>

              <p class="cuisine-form-disclaimer">
                Ce site est protégé par reCAPTCHA. La
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">politique de confidentialité</a>
                et les
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener">conditions d'utilisation</a>
                de Google s'appliquent.
              </p>
            </form>

            <div v-else class="cuisine-contact__form-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <h3>Message envoyé</h3>
              <p>Merci de nous avoir contactés. Nous reviendrons vers vous dès que possible.</p>
            </div>
          </div>
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
import { computed, reactive, ref } from 'vue'
import HeaderCuisine from '@/components/theme_cuisine/HeaderCuisine.vue'
import FooterCuisine from '@/components/theme_cuisine/FooterCuisine.vue'

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

const footerText = computed(() =>
  props.customizations?.footer?.text ||
  `© ${new Date().getFullYear()} ${props.shop?.name || 'Restaurant'}. Tous droits réservés.`
)
const socialLinks = computed(() => props.customizations?.footer?.socialLinks || {})
const hasSocialLinks = computed(() =>
  !!(socialLinks.value?.facebook || socialLinks.value?.instagram || socialLinks.value?.twitter)
)

// ============================
// INFOS DE CONTACT (customizations vendeur)
// ============================
const contactPhone   = computed(() => props.customizations?.contact?.phone   || '')
const contactAddress = computed(() => props.customizations?.contact?.address || '')
const contactHours   = computed(() => props.customizations?.contact?.hours   || '')

// ============================
// FORMULAIRE DE CONTACT
// ============================
const { $recaptcha } = useNuxtApp()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})
const honeypot = ref('') // doit rester vide — rempli automatiquement = bot

const isSubmitting = ref(false)
const formError = ref('')
const formSubmitted = ref(false)

const submitForm = async () => {
  formError.value = ''

  // Le honeypot n'est jamais censé être rempli par un humain.
  // On ne dit rien à l'utilisateur si c'est le cas — on affiche
  // juste un faux succès pour ne pas alerter un bot automatisé.
  if (honeypot.value) {
    formSubmitted.value = true
    return
  }

  isSubmitting.value = true
  try {
    const token = await $recaptcha('contact_form')

    const shopSubdomain = props.shop?.subdomain
    if (!shopSubdomain) {
      formError.value = 'Impossible de déterminer la boutique. Veuillez réessayer.'
      return
    }

    const config = useRuntimeConfig()
    const res = await fetch(`${config.public.apiBase}/shop/${shopSubdomain}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
        recaptcha_token: token,
        website: honeypot.value
      })
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      formError.value = data.message || "Une erreur est survenue lors de l'envoi de votre message."
      return
    }

    formSubmitted.value = true
  } catch (err: any) {
    formError.value = "Impossible d'envoyer le message pour le moment. Veuillez réessayer."
  } finally {
    isSubmitting.value = false
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

.cuisine-container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
.cuisine-contact-page { padding-top: 140px; padding-bottom: 100px; }

.cuisine-eyebrow {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--c-gold); margin-bottom: 12px;
}
.cuisine-section-header { text-align: center; margin-bottom: 60px; }
.cuisine-section-title { font-family: var(--c-font); font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 600; margin-bottom: 16px; }
.cuisine-divider { display: flex; align-items: center; justify-content: center; gap: 12px; }
.cuisine-divider::before, .cuisine-divider::after { content: ''; width: 60px; height: 1px; background: var(--c-gold); }
.cuisine-divider__ornament { color: var(--c-gold); font-size: 0.65rem; }

.cuisine-contact { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
@media (max-width: 800px) { .cuisine-contact { grid-template-columns: 1fr; gap: 40px; } }

.cuisine-contact__info { display: flex; flex-direction: column; gap: 32px; }

.cuisine-contact__item { display: flex; gap: 18px; align-items: flex-start; }
.cuisine-contact__icon {
  width: 48px; height: 48px; flex-shrink: 0; background: var(--c-cream); color: var(--c-primary);
  display: flex; align-items: center; justify-content: center; border-radius: 50%;
}
.cuisine-contact__icon svg { width: 22px; height: 22px; }

.cuisine-contact__item h3 {
  font-family: var(--c-font); font-size: 1.05rem; font-weight: 600; margin-bottom: 4px; color: var(--c-text);
}
.cuisine-contact__item p, .cuisine-contact__item a {
  font-size: 0.9rem; color: #666; text-decoration: none; line-height: 1.6;
}
.cuisine-contact__item a:hover { color: var(--c-primary); }
.cuisine-contact__hours { white-space: pre-line; }

.cuisine-contact__empty {
  padding: 24px; background: white; color: #999; font-size: 0.9rem; text-align: center;
}

.cuisine-contact__social { margin-top: 8px; }
.cuisine-contact__social h3 {
  font-family: var(--c-font); font-size: 1.05rem; font-weight: 600; margin-bottom: 12px; color: var(--c-text);
}
.cuisine-contact__social-links { display: flex; gap: 12px; }
.cuisine-contact__social-links a {
  width: 40px; height: 40px; border: 1.5px solid #ddd; display: flex; align-items: center; justify-content: center;
  color: #888; transition: all 0.25s;
}
.cuisine-contact__social-links a svg { width: 18px; height: 18px; }
.cuisine-contact__social-links a:hover { border-color: var(--c-primary); color: var(--c-primary); }

.cuisine-contact__form-placeholder {
  background: white; padding: 48px 32px; text-align: center; display: flex; flex-direction: column;
  align-items: center; gap: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.cuisine-contact__form-placeholder svg { width: 40px; height: 40px; color: var(--c-gold); }
.cuisine-contact__form-placeholder h3 {
  font-family: var(--c-font); font-size: 1.3rem; font-weight: 600; color: var(--c-text);
}
.cuisine-contact__form-placeholder p {
  font-size: 0.9rem; color: #777; line-height: 1.7; max-width: 320px;
}

/* Honeypot : invisible pour un humain, présent pour les bots qui remplissent tout */
.cuisine-honeypot {
  position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;
}

.cuisine-contact-form {
  background: white; padding: 40px 32px; display: flex; flex-direction: column; gap: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.cuisine-form-row { display: flex; flex-direction: column; gap: 6px; }
.cuisine-form-row label {
  font-size: 0.8rem; font-weight: 600; color: var(--c-text); letter-spacing: 0.02em;
}
.cuisine-form-row label span { color: var(--c-primary); }
.cuisine-form-row input,
.cuisine-form-row textarea {
  border: 1.5px solid #ddd; padding: 10px 14px; font-size: 0.9rem; font-family: 'Jost', sans-serif;
  background: white; color: var(--c-text); resize: vertical;
}
.cuisine-form-row input:focus,
.cuisine-form-row textarea:focus { outline: none; border-color: var(--c-primary); }

.cuisine-form-error {
  padding: 10px 14px; background: #FDECEC; color: #A32020; font-size: 0.85rem;
}

.cuisine-form-disclaimer {
  font-size: 0.72rem; color: #999; line-height: 1.6; text-align: center; margin-top: 4px;
}
.cuisine-form-disclaimer a { color: var(--c-gold); text-decoration: underline; }

.cuisine-contact__form-success {
  background: white; padding: 48px 32px; text-align: center; display: flex; flex-direction: column;
  align-items: center; gap: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.cuisine-contact__form-success svg { width: 44px; height: 44px; color: #1E7A3D; }
.cuisine-contact__form-success h3 {
  font-family: var(--c-font); font-size: 1.3rem; font-weight: 600; color: var(--c-text);
}
.cuisine-contact__form-success p { font-size: 0.9rem; color: #777; line-height: 1.7; max-width: 320px; }
</style>
