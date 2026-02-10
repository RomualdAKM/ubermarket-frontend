// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  ssr: false,
  app: {
    head: {
      title: 'Uber-Market - Créez votre boutique en ligne en 1m30s',
      htmlAttrs: {
        lang: 'fr'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Uber-Market, une plateforme intuitive et clé en main qui vous permet de créer ou de développer votre activité en ligne sans aucune connaissance en programmation.' },
        { name: 'keywords', content: 'créer boutique en ligne, e-commerce, site web, marketplace, sans code, solution clé en main, uber-market' },
        { property: 'og:site_name', content: 'Uber-Market' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Uber-Market - Créez votre boutique en ligne en 1m30s' },
        { property: 'og:description', content: 'Uber-Market, une plateforme intuitive et clé en main qui vous permet de créer ou de développer votre activité en ligne sans aucune connaissance en programmation.' },
        { property: 'og:image', content: 'https://www.uber-market.com/uber-market.png' },
        { property: 'og:url', content: 'https://www.uber-market.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Uber-Market - Créez votre boutique en ligne en 1m30s' },
        { name: 'twitter:description', content: 'Uber-Market, une plateforme intuitive et clé en main qui vous permet de créer ou de développer votre activité en ligne sans aucune connaissance en programmation.' },
        { name: 'twitter:image', content: 'https://www.uber-market.com/uber-market.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/uber-market.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap' 
        }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://ubermarket.fga-numerik.fr/api',
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'https://ubermarket.fga-numerik.fr'
    }
  },
  typescript: {
    strict: false,
    typeCheck: false
  }
})
