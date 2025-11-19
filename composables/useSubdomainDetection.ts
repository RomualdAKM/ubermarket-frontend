export const useSubdomainDetection = () => {
  /**
   * Extrait le sous-domaine depuis l'URL actuelle
   * Retourne null si on est sur le domaine principal ou localhost
   */
  const getSubdomain = (): string | null => {
    // Seulement côté client
    if (process.server) return null

    const host = window.location.host

    // Environnement local - pas de sous-domaine
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return null
    }

    // Domaine Vercel de preview - ignorer
    if (host.includes('vercel.app')) {
      return null
    }

    // Extraire le sous-domaine de uber-market.com
    const match = host.match(/^([a-z0-9-]+)\.uber-market\.com$/i)

    if (match && match[1]) {
      const subdomain = match[1].toLowerCase()

      // Ignorer les sous-domaines réservés
      const reserved = ['www', 'api', 'admin', 'app', 'dashboard']
      if (reserved.includes(subdomain)) {
        return null
      }

      return subdomain
    }

    // Si ce n'est pas un sous-domaine uber-market.com, c'est peut-être un domaine personnalisé
    // On retourne le host complet comme identifiant
    return host
  }

  /**
   * Vérifie si on est sur un sous-domaine de boutique
   */
  const isOnShopSubdomain = (): boolean => {
    return getSubdomain() !== null
  }

  return {
    getSubdomain,
    isOnShopSubdomain
  }
}
