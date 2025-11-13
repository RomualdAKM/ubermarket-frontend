export default defineNuxtRouteMiddleware(async (to) => {
  // Vérifier si nous sommes sur une route dashboard-vendor avec slug
  if (!to.params.slug) {
    return
  }

  const { isAuthenticated } = useAuth()
  const { shops, fetchShops } = useShops()

  // Rediriger vers la connexion si non authentifié
  if (!isAuthenticated.value) {
    return navigateTo('/connexion-vendeur')
  }

  try {
    // Récupérer les boutiques de l'utilisateur si pas encore fait
    if (shops.value.length === 0) {
      await fetchShops()
    }

    // Vérifier que l'utilisateur a accès à cette boutique
    const requestedSlug = to.params.slug as string
    const userShop = shops.value.find(shop => shop.slug === requestedSlug)

    if (!userShop) {
      // L'utilisateur n'a pas accès à cette boutique
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès non autorisé à cette boutique'
      })
    }

    // Stocker la boutique courante dans le contexte
    const { setCurrentShop } = useShops()
    setCurrentShop(userShop)

  } catch (error) {
    console.error('Erreur lors de la validation du slug:', error)
    
    // Rediriger vers la page de sélection des boutiques
    return navigateTo('/mes-boutiques')
  }
})