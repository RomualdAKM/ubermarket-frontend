/**
 * Composable pour gérer le tracking marketing (Facebook Pixel, Google Analytics, Systeme.io)
 */
export const useMarketingTracking = () => {
  const config = useRuntimeConfig()
  const integrations = useState<any[]>('marketing.tracking.integrations', () => [])
  const isInitialized = useState<boolean>('marketing.tracking.initialized', () => false)

  /**
   * Charger les intégrations marketing actives d'une boutique
   */
  const loadIntegrations = async (subdomain: string) => {
    try {
      const response = await fetch(`${config.public.apiBase}/shop/${subdomain}/marketing/active`)
      const data = await response.json()

      if (data.success && data.data) {
        integrations.value = data.data
        return data.data
      }
      return []
    } catch (error) {
      console.error('Erreur chargement intégrations marketing:', error)
      return []
    }
  }

  /**
   * Initialiser les scripts de tracking
   */
  const initializeTracking = async (subdomain: string) => {
    if (isInitialized.value) return

    const activeIntegrations = await loadIntegrations(subdomain)

    activeIntegrations.forEach((integration: any) => {
      if (integration.platform === 'facebook_pixel') {
        initFacebookPixel(integration.credentials.pixel_id)
      } else if (integration.platform === 'google_analytics') {
        initGoogleAnalytics(integration.credentials.tracking_id)
      } else if (integration.platform === 'systeme_io') {
        initSystemeIo(integration.credentials.api_key)
      }
    })

    isInitialized.value = true
  }

  /**
   * Initialiser Facebook Pixel
   */
  const initFacebookPixel = (pixelId: string) => {
    if (typeof window === 'undefined') return

    // @ts-ignore
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    // @ts-ignore
    window.fbq('init', pixelId)
    // @ts-ignore
    window.fbq('track', 'PageView')
  }

  /**
   * Initialiser Google Analytics
   */
  const initGoogleAnalytics = (trackingId: string) => {
    if (typeof window === 'undefined') return

    // Charger gtag.js
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    document.head.appendChild(script)

    // Initialiser gtag
    // @ts-ignore
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      // @ts-ignore
      window.dataLayer.push(args)
    }
    // @ts-ignore
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', trackingId)
  }

  /**
   * Initialiser Systeme.io (tracking de base)
   */
  const initSystemeIo = (apiKey: string) => {
    if (typeof window === 'undefined') return
    
    // Stocker la clé pour utilisation ultérieure
    // @ts-ignore
    window.systeme_io_key = apiKey
  }

  /**
   * Tracker un événement PageView
   */
  const trackPageView = (pagePath?: string) => {
    integrations.value.forEach((integration: any) => {
      if (!integration.is_active) return

      if (integration.platform === 'facebook_pixel') {
        // @ts-ignore
        if (typeof window.fbq !== 'undefined') {
          // @ts-ignore
          window.fbq('track', 'PageView')
        }
      } else if (integration.platform === 'google_analytics') {
        // @ts-ignore
        if (typeof window.gtag !== 'undefined') {
          // @ts-ignore
          window.gtag('event', 'page_view', {
            page_path: pagePath || window.location.pathname
          })
        }
      }
    })
  }

  /**
   * Tracker une vue de produit
   */
  const trackViewContent = (product: any) => {
    integrations.value.forEach((integration: any) => {
      if (!integration.is_active) return

      if (integration.platform === 'facebook_pixel') {
        // @ts-ignore
        if (typeof window.fbq !== 'undefined') {
          // @ts-ignore
          window.fbq('track', 'ViewContent', {
            content_name: product.name,
            content_ids: [product.id],
            content_type: 'product',
            value: product.price,
            currency: 'XOF'
          })
        }
      } else if (integration.platform === 'google_analytics') {
        // @ts-ignore
        if (typeof window.gtag !== 'undefined') {
          // @ts-ignore
          window.gtag('event', 'view_item', {
            currency: 'XOF',
            value: product.price,
            items: [{
              item_id: product.id,
              item_name: product.name,
              price: product.price
            }]
          })
        }
      }
    })
  }

  /**
   * Tracker un ajout au panier
   */
  const trackAddToCart = (product: any, quantity: number = 1) => {
    integrations.value.forEach((integration: any) => {
      if (!integration.is_active) return

      if (integration.platform === 'facebook_pixel') {
        // @ts-ignore
        if (typeof window.fbq !== 'undefined') {
          // @ts-ignore
          window.fbq('track', 'AddToCart', {
            content_name: product.name,
            content_ids: [product.id],
            content_type: 'product',
            value: product.price * quantity,
            currency: 'XOF'
          })
        }
      } else if (integration.platform === 'google_analytics') {
        // @ts-ignore
        if (typeof window.gtag !== 'undefined') {
          // @ts-ignore
          window.gtag('event', 'add_to_cart', {
            currency: 'XOF',
            value: product.price * quantity,
            items: [{
              item_id: product.id,
              item_name: product.name,
              price: product.price,
              quantity: quantity
            }]
          })
        }
      }
    })
  }

  /**
   * Tracker le début d'un processus de commande
   */
  const trackInitiateCheckout = (cart: any) => {
    integrations.value.forEach((integration: any) => {
      if (!integration.is_active) return

      const totalValue = cart.items?.reduce((sum: number, item: any) => 
        sum + (item.price * item.quantity), 0) || 0

      if (integration.platform === 'facebook_pixel') {
        // @ts-ignore
        if (typeof window.fbq !== 'undefined') {
          // @ts-ignore
          window.fbq('track', 'InitiateCheckout', {
            value: totalValue,
            currency: 'XOF',
            num_items: cart.items?.length || 0
          })
        }
      } else if (integration.platform === 'google_analytics') {
        // @ts-ignore
        if (typeof window.gtag !== 'undefined') {
          // @ts-ignore
          window.gtag('event', 'begin_checkout', {
            currency: 'XOF',
            value: totalValue,
            items: cart.items?.map((item: any) => ({
              item_id: item.product_id,
              item_name: item.name,
              price: item.price,
              quantity: item.quantity
            })) || []
          })
        }
      }
    })
  }

  /**
   * Tracker une commande finalisée
   */
  const trackPurchase = (order: any) => {
    integrations.value.forEach((integration: any) => {
      if (!integration.is_active) return

      if (integration.platform === 'facebook_pixel') {
        // @ts-ignore
        if (typeof window.fbq !== 'undefined') {
          // @ts-ignore
          window.fbq('track', 'Purchase', {
            value: order.total_amount,
            currency: 'XOF',
            content_ids: order.items?.map((item: any) => item.product_id) || [],
            content_type: 'product',
            num_items: order.items?.length || 0
          })
        }
      } else if (integration.platform === 'google_analytics') {
        // @ts-ignore
        if (typeof window.gtag !== 'undefined') {
          // @ts-ignore
          window.gtag('event', 'purchase', {
            transaction_id: order.id,
            value: order.total_amount,
            currency: 'XOF',
            items: order.items?.map((item: any) => ({
              item_id: item.product_id,
              item_name: item.product_name,
              price: item.price,
              quantity: item.quantity
            })) || []
          })
        }
      }
    })
  }

  return {
    integrations,
    isInitialized,
    loadIntegrations,
    initializeTracking,
    trackPageView,
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase
  }
}
