<template>
  <footer id="contact" class="cuisine-footer">
    <div class="cuisine-footer__top">
      <div class="cuisine-container cuisine-footer__grid">

        <div class="cuisine-footer__col cuisine-footer__col--brand">
          <div class="cuisine-footer__logo">
            <img v-if="shop?.logo" :src="getImageUrl(shop.logo)" :alt="shop?.name" />
            <span v-else>{{ shop?.name }}</span>
          </div>
          <p class="cuisine-footer__desc">
            {{ shop?.description || 'Une expérience gastronomique inoubliable, au cœur de la tradition culinaire.' }}
          </p>
          <div class="cuisine-footer__social">
            <a v-if="socialLinks?.facebook"  :href="socialLinks.facebook"  target="_blank" class="cuisine-footer__social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a v-if="socialLinks?.instagram" :href="socialLinks.instagram" target="_blank" class="cuisine-footer__social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a v-if="socialLinks?.twitter"   :href="socialLinks.twitter"   target="_blank" class="cuisine-footer__social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>

        <div class="cuisine-footer__col">
          <h4 class="cuisine-footer__col-title">Navigation</h4>
          <ul class="cuisine-footer__links">
            <li><NuxtLink :to="`/boutique/${shop?.subdomain}#accueil`">Accueil</NuxtLink></li>
            <li><NuxtLink :to="`/boutique/${shop?.subdomain}#menu`">Notre menu</NuxtLink></li>
            <li><NuxtLink :to="`/boutique/${shop?.subdomain}#specialites`">Nos spécialités</NuxtLink></li>
            <li><NuxtLink :to="`/boutique/${shop?.subdomain}/a-propos`">À propos</NuxtLink></li>
          </ul>
        </div>

        <div class="cuisine-footer__col">
          <h4 class="cuisine-footer__col-title">Contact</h4>
          <ul class="cuisine-footer__contact">
            <li v-if="shop?.phone">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z"/></svg>
              {{ shop.phone }}
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/></svg>
              <a href="mailto:contact@uber-market.com">contact@uber-market.com</a>
            </li>
          </ul>
        </div>

        <div class="cuisine-footer__col">
          <h4 class="cuisine-footer__col-title">Informations</h4>
          <ul class="cuisine-footer__links">
            <li><NuxtLink :to="`/boutique/${shop?.subdomain}/cgu`">CGU</NuxtLink></li>
            <li><NuxtLink :to="`/boutique/${shop?.subdomain}/cgv`">CGV</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="cuisine-footer__bottom">
      <p>{{ footerText }}</p>
      <p class="cuisine-footer__powered">
        Propulsé par <a href="https://uber-market.com" target="_blank">UberMarket</a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
// ─────────────────────────────────────────────────────────────
// FooterCuisine — footer partagé entre toutes les pages du thème.
// Suit le même contrat de props que FooterEpure (theme-epure) :
// backgroundColor, primaryColor, footerText, socialLinks.
// backgroundColor n'est pas utilisé ici (le footer garde son
// fond sombre fixe #0D0D0D quel que soit le thème de couleurs
// choisi par le vendeur, pour préserver le contraste doré/sombre
// caractéristique de ce thème) — gardé en prop pour cohérence
// d'interface avec les autres thèmes.
// ─────────────────────────────────────────────────────────────
interface Props {
  shop?: any
  backgroundColor?: string
  primaryColor?: string
  footerText?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
}
defineProps<Props>()

const config = useRuntimeConfig()
const backendUrl = config.public.backendUrl || config.public.apiBase?.replace('/api', '')

const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${backendUrl}/storage/${path}`
}
</script>

<style scoped>
.cuisine-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.cuisine-footer { background: #0D0D0D; color: rgba(255,255,255,0.7); }
.cuisine-footer__top { padding: 70px 24px; }

.cuisine-footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; }
@media (max-width: 900px) { .cuisine-footer__grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
@media (max-width: 600px) { .cuisine-footer__grid { grid-template-columns: 1fr; } }

.cuisine-footer__logo { margin-bottom: 16px; }
.cuisine-footer__logo img { height: 40px; width: auto; filter: brightness(0) invert(1); opacity: 0.9; }
.cuisine-footer__logo span { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.4rem; font-weight: 600; color: white; }

.cuisine-footer__desc { font-size: 0.85rem; line-height: 1.8; color: rgba(255,255,255,0.45); margin-bottom: 20px; }

.cuisine-footer__social { display: flex; gap: 12px; }
.cuisine-footer__social-link {
  width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center;
  justify-content: center; color: rgba(255,255,255,0.5); text-decoration: none; transition: all 0.25s;
}
.cuisine-footer__social-link svg { width: 16px; height: 16px; }
.cuisine-footer__social-link:hover { border-color: #C9A84C; color: #C9A84C; background: rgba(201,168,76,0.1); }

.cuisine-footer__col-title {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
  color: #C9A84C; margin-bottom: 20px;
}

.cuisine-footer__links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.cuisine-footer__links a { font-size: 0.85rem; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }
.cuisine-footer__links a:hover { color: white; }

.cuisine-footer__contact { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
.cuisine-footer__contact li { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: rgba(255,255,255,0.5); }
.cuisine-footer__contact svg { width: 16px; height: 16px; flex-shrink: 0; color: #C9A84C; }
.cuisine-footer__contact a { color: inherit; text-decoration: none; transition: color 0.2s; }
.cuisine-footer__contact a:hover { color: white; }

.cuisine-footer__bottom {
  border-top: 1px solid rgba(255,255,255,0.06); padding: 20px 24px; max-width: 1200px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
  font-size: 0.75rem; color: rgba(255,255,255,0.3);
}
.cuisine-footer__powered a { color: #C9A84C; text-decoration: none; }
</style>
