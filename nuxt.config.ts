// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // ✅ CSS Tailwind — NE PAS SUPPRIMER
  css: ['~/assets/css/main.css'],

  // ✅ SSR activé pour le SEO (remplace ssr: false)
  ssr: true,
  //ssr: false,

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'UberMarket — Créez votre boutique en ligne en 1m30s | Gratuit',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Lancez votre boutique e-commerce en 1m30s. Paiements Mobile Money & Carte, livraison intégrée, analytics temps réel. Commencez gratuitement. 1000+ vendeurs satisfaits.' },
        { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
        { name: 'author', content: 'UberMarket' },
        { name: 'theme-color', content: '#5B6AC5' },
        // Open Graph
        { property: 'og:site_name', content: 'UberMarket' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://www.uber-market.com/' },
        { property: 'og:title', content: 'UberMarket — Créez votre boutique en ligne en 1m30s' },
        { property: 'og:description', content: 'Lancez votre e-commerce en 1m30s. Paiements Mobile Money & Carte, livraison, analytics inclus. Commencez gratuitement.' },
        { property: 'og:image', content: 'https://www.uber-market.com/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'fr_FR' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'UberMarket — Créez votre boutique en ligne en 1m30s' },
        { name: 'twitter:description', content: 'Lancez votre e-commerce en 1m30s. Mobile Money, livraison, analytics inclus.' },
        { name: 'twitter:image', content: 'https://www.uber-market.com/og-image.png' },
        // Géolocalisation
        { name: 'geo.region', content: 'BJ' },
        { name: 'geo.placename', content: 'Cotonou, Bénin' },
      ],
      link: [
        { rel: 'canonical', href: 'https://www.uber-market.com/' },
        { rel: 'icon', type: 'image/png', href: '/uber-market.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        // Fonts avec preconnect
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap'
        }
      ]
    }
  },

  // ✅ Vite + Tailwind — NE PAS SUPPRIMER
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // ✅ Variables d'environnement API
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://ubermarket.fga-numerik.fr/api',
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'https://ubermarket.fga-numerik.fr',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },

  // ✅ Modules SEO (installer d'abord si pas déjà fait)
  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  sitemap: {
    hostname: 'https://www.uber-market.com',
    routes: ['/', '/marketplace', '/conditions'],
    exclude: [
      '/dashboard-admin/**',
      '/dashboard-vendor/**',
      '/dashboard-client/**',
      '/dashboard-courier/**',
      '/dashboard-affiliate/**',
      '/mes-boutiques',
      '/connexion-vendeur',
    ]
  },

  robots: {
    rules: [
      {
        UserAgent: '*',
        Allow: '/',
        Disallow: [
          '/dashboard-admin/',
          '/dashboard-vendor/',
          '/dashboard-client/',
          '/mes-boutiques',
        ],
        Sitemap: 'https://www.uber-market.com/sitemap.xml'
      }
    ]
  },

  typescript: {
    strict: false,
    typeCheck: false
  }
})

/*export default defineNuxtConfig({
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
})*/
