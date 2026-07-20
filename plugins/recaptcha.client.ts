// plugins/recaptcha.client.ts
//
// Charge le script Google reCAPTCHA v3 une seule fois (client uniquement,
// jamais en SSR) et expose un helper `$recaptcha(action)` qui retourne
// un token prêt à envoyer au backend pour vérification.
//
// Usage dans un composant :
//   const { $recaptcha } = useNuxtApp()
//   const token = await $recaptcha('contact_form')

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const siteKey = config.public.recaptchaSiteKey as string

  if (!siteKey) {
    console.warn('[recaptcha] NUXT_PUBLIC_RECAPTCHA_SITE_KEY non configurée — reCAPTCHA désactivé.')
    return {
      provide: {
        recaptcha: async () => null
      }
    }
  }

  let scriptLoadPromise: Promise<void> | null = null

  const loadScript = (): Promise<void> => {
    if (scriptLoadPromise) return scriptLoadPromise

    scriptLoadPromise = new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).grecaptcha) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Impossible de charger le script reCAPTCHA'))
      document.head.appendChild(script)
    })

    return scriptLoadPromise
  }

  const executeRecaptcha = async (action: string): Promise<string | null> => {
    try {
      await loadScript()
      const grecaptcha = (window as any).grecaptcha

      return await new Promise((resolve, reject) => {
        grecaptcha.ready(() => {
          grecaptcha.execute(siteKey, { action })
            .then((token: string) => resolve(token))
            .catch((err: any) => reject(err))
        })
      })
    } catch (err) {
      console.error('[recaptcha] Erreur lors de la génération du token:', err)
      return null
    }
  }

  return {
    provide: {
      recaptcha: executeRecaptcha
    }
  }
})
