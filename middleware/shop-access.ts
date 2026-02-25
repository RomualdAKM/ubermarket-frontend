export default defineNuxtRouteMiddleware(async (to) => {
  // Verifier si nous sommes sur une route dashboard-vendor avec slug
  if (!to.params.slug) {
    return
  }

  const { isAuthenticated, token, initAuth } = useAuth()
  const { shops, fetchShops, setCurrentShop } = useShops()
  const { myCollaborations, fetchMyCollaborations } = useCollaborators()

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
    // Recuperer les boutiques proprietaires et collaboratives si pas encore fait
    const promises: Promise<any>[] = []
    
    if (shops.value.length === 0) {
      promises.push(fetchShops())
    }
    
    if (myCollaborations.value.length === 0) {
      promises.push(fetchMyCollaborations())
    }
    
    if (promises.length > 0) {
      await Promise.all(promises)
    }

    // Verifier que l'utilisateur a acces a cette boutique
    const requestedSlug = to.params.slug as string
    
    // Chercher dans les boutiques proprietaires
    let userShop = shops.value.find(shop => shop.slug === requestedSlug)
    
    // Si pas trouve, chercher dans les collaborations
    if (!userShop) {
      const collaboration = myCollaborations.value.find(c => c.shop.slug === requestedSlug)
      if (collaboration) {
        // Creer un objet shop compatible depuis la collaboration
        userShop = {
          id: collaboration.shop.id,
          name: collaboration.shop.name,
          slug: collaboration.shop.slug,
          logo: collaboration.shop.logo,
          // Marquer comme collaboration pour reference
          is_collaboration: true,
          collaboration_role: collaboration.role,
          collaboration_permissions: collaboration.permissions
        } as any
      }
    }

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