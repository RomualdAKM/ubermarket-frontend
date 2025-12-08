// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  ssr: false,
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://backend.uber-market.com/api',
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'https://backend.uber-market.com'
    }
  },
  typescript: {
    strict: false,
    typeCheck: false
  }
})
