export default defineNuxtRouteMiddleware(async (to) => {
  // Verifier si nous sommes sur une route dashboard-vendor avec slug
  if (!to.params.slug) {
    return
  }

  const { isAuthenticated, token, initAuth } = useAuth()
  const { shops, fetchShops, setCurrentShop } = useShops()

  // Cote client : s'assurer que l'auth est initialisee depuis localStorage
  if (process.client) {
    // Verifier si le token n'est pas encore charge mais existe dans localStorage
    if (!token.value) {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        // Initialiser l'auth depuis localStorage
        await initAuth()
      }
    }
  }

  // Rediriger vers la connexion si non authentifie
  if (!isAuthenticated.value) {
    return navigateTo('/connexion-vendeur')
  }

  try {
    // Recuperer les boutiques de l'utilisateur si pas encore fait
    if (shops.value.length === 0) {
      await fetchShops()
    }

    // Verifier que l'utilisateur a acces a cette boutique
    const requestedSlug = to.params.slug as string
    const userShop = shops.value.find(shop => shop.slug === requestedSlug)

    if (!userShop) {
      // L'utilisateur n'a pas acces a cette boutique
      throw createError({
        statusCode: 403,
        statusMessage: 'Acces non autorise a cette boutique'
      })
    }

    // Stocker la boutique courante
    setCurrentShop(userShop)

  } catch (error) {
    console.error('Erreur lors de la validation du slug:', error)
    
    // Rediriger vers la page de selection des boutiques
    return navigateTo('/mes-boutiques')
  }
})