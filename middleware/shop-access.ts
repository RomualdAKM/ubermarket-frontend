export default defineNuxtRouteMiddleware(async (to) => {
  // Verifier si nous sommes sur une route dashboard-vendor avec slug
  if (!to.params.slug) {
    return
  }

  const { isAuthenticated, token, initAuth } = useAuth()
  const { shops, fetchShops, setCurrentShop, fetchShopDetails, currentAccess } = useShops()
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
    const requestedSlug = to.params.slug as string
    
    // Charger les détails de la boutique avec les permissions depuis l'API
    // Cette méthode appelle le backend qui vérifie l'accès et retourne les permissions
    let accessLoaded = false
    try {
      accessLoaded = await fetchShopDetails(requestedSlug)
    } catch (apiError) {
      // L'API a retourné une erreur (probablement 403 non autorisé)
      console.warn('API fetchShopDetails échoué, tentative de fallback...', apiError)
    }
    
    // Vérifier si les permissions ont été chargées
    if (!accessLoaded || !currentAccess.value) {
      // Fallback : vérifier l'accès localement
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

      // Chercher dans les boutiques proprietaires
      let userShop = shops.value.find(shop => shop.slug === requestedSlug)
      let access = null
      
      if (userShop) {
        // Propriétaire - toutes les permissions
        access = {
          is_owner: true,
          is_collaborator: false,
          role: 'owner',
          permissions: []
        }
      } else {
        // Chercher dans les collaborations
        const collaboration = myCollaborations.value.find(c => c.shop.slug === requestedSlug)
        if (collaboration) {
          userShop = {
            id: collaboration.shop.id,
            name: collaboration.shop.name,
            slug: collaboration.shop.slug,
            subdomain: collaboration.shop.subdomain,
            logo: collaboration.shop.logo,
            is_collaboration: true
          } as any
          
          access = {
            is_owner: false,
            is_collaborator: true,
            role: collaboration.role?.code || 'collaborator',
            permissions: collaboration.permissions || []
          }
        }
      }

      if (!userShop) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Acces non autorise a cette boutique'
        })
      }

      setCurrentShop(userShop, access)
    }

  } catch (error) {
    console.error('Erreur lors de la validation du slug:', error)
    
    // Rediriger vers la page de selection des boutiques
    return navigateTo('/mes-boutiques')
  }
})