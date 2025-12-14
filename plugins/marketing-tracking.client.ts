/**
 * Plugin pour initialiser automatiquement le tracking marketing sur les pages boutiques
 * S'exécute uniquement côté client et sur les pages avec sous-domaine
 */
export default defineNuxtPlugin(() => {
  if (process.server) return

  const router = useRouter()
  const { getSubdomain } = useSubdomainDetection()
  const { initializeTracking, trackPageView } = useMarketingTracking()

  // Initialiser le tracking au chargement si on est sur une boutique
  const subdomain = getSubdomain()
  if (subdomain) {
    initializeTracking(subdomain)
  }

  // Tracker les changements de page
  router.afterEach((to, from) => {
    // Vérifier si on est toujours sur une boutique
    const currentSubdomain = getSubdomain()
    if (currentSubdomain) {
      // Petit délai pour laisser le temps au DOM de se charger
      setTimeout(() => {
        trackPageView(to.fullPath)
      }, 100)
    }
  })
})
