export const usePayment = () => {
    const config = useRuntimeConfig()
    const isLoading = ref(false)
    const error = ref(null)

    const initializePayment = async (orderId: number, method: string, returnUrl: string) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await $fetch(`${config.public.apiBase}/payments/initialize`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${useCookie('auth_token').value}`
                },
                body: {
                    order_id: orderId,
                    payment_method: method,
                    return_url: returnUrl
                }
            })

            return response
        } catch (e: any) {
            error.value = e.message || 'Payment initialization failed'
            throw e
        } finally {
            isLoading.value = false
        }
    }

    const verifyPayment = async (paymentId: number, gatewayId?: string) => {
        isLoading.value = true
        try {
            const response = await $fetch(`${config.public.apiBase}/payments/verify`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${useCookie('auth_token').value}`
                },
                body: {
                    payment_id: paymentId,
                    gateway_id: gatewayId
                }
            })
            return response
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            isLoading.value = false
        }
    }

    return {
        initializePayment,
        verifyPayment,
        isLoading,
        error
    }
}
