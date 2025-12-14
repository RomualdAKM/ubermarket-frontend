/**
 * Composable pour gérer la navigation dans une boutique
 * Gère automatiquement les URLs pour sous-domaines et domaines personnalisés
 */
export const useShopNavigation = () => {
  const { getSubdomain, isOnShopSubdomain } = useSubdomainDetection()

  /**
   * Détermine si on est sur un domaine personnalisé
   * (détecté si on est sur un sous-domaine MAIS pas sur uber-market.com)
   */
  const isCustomDomain = computed(() => {
    if (process.server) return false
    
    const host = window.location.host
    
    // Si on est sur localhost ou un sous-domaine uber-market.com, ce n'est PAS un domaine personnalisé
    if (host.includes('localhost') || 
        host.includes('127.0.0.1') || 
        host.match(/\.uber-market\.com$/i)) {
      return false
    }
    
    // Sinon, c'est un domaine personnalisé
    return isOnShopSubdomain()
  })

  /**
   * Génère l'URL de la page d'accueil de la boutique
   */
  const getHomeUrl = (shop?: any): string => {
    // Si on a les infos du shop
    if (shop?.subdomain) {
      // Sur domaine personnalisé, utiliser la racine
      if (isCustomDomain.value) {
        return '/'
      }
      // Sinon utiliser le sous-domaine
      return `/boutique/${shop.subdomain}`
    }
    
    // Fallback : détecter automatiquement
    const subdomain = getSubdomain()
    if (!subdomain) return '/'
    
    if (isCustomDomain.value) {
      return '/'
    }
    
    return `/boutique/${subdomain}`
  }

  /**
   * Génère l'URL d'une page de la boutique
   */
  const getShopUrl = (path: string, shop?: any): string => {
    const homeUrl = getHomeUrl(shop)
    
    // Nettoyer le path
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    
    // Si homeUrl est '/', on retourne juste le path
    if (homeUrl === '/') {
      return `/${cleanPath}`
    }
    
    return `${homeUrl}/${cleanPath}`
  }

  /**
   * Génère l'URL du panier
   */
  const getCartUrl = (shop?: any): string => {
    return getShopUrl('panier', shop)
  }

  /**
   * Génère l'URL d'un produit
   */
  const getProductUrl = (productId: number, shop?: any): string => {
    return getShopUrl(`produit/${productId}`, shop)
  }

  /**
   * Génère l'URL de la page produits
   */
  const getProductsUrl = (shop?: any): string => {
    return getShopUrl('produits', shop)
  }

  /**
   * Génère l'URL de connexion avec redirection
   */
  const getLoginUrl = (redirectTo?: string, shop?: any): string => {
    const baseUrl = '/connexion'
    
    if (!redirectTo) {
      return baseUrl
    }
    
    return `${baseUrl}?redirect=${encodeURIComponent(redirectTo)}`
  }

  /**
   * Génère l'URL d'inscription avec redirection
   */
  const getSignupUrl = (redirectTo?: string, shop?: any): string => {
    const baseUrl = '/inscription'
    
    if (!redirectTo) {
      return baseUrl
    }
    
    return `${baseUrl}?redirect=${encodeURIComponent(redirectTo)}`
  }

  return {
    isCustomDomain,
    getHomeUrl,
    getShopUrl,
    getCartUrl,
    getProductUrl,
    getProductsUrl,
    getLoginUrl,
    getSignupUrl
  }
}
