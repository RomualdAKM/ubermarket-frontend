export const useDelivery = (shopId?: string) => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${config.public.apiBase}${endpoint}`, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
        ...(options.headers as any || {})
      }
    })
    const data = await response.json()
    if (!response.ok || !data.success) throw new Error(data.message || 'Erreur')
    return data
  }

  // Zones de livraison
  const fetchZones = () => apiRequest(`/shops/${shopId}/delivery-zones`)
  const createZone = (zone: any) => apiRequest(`/shops/${shopId}/delivery-zones`, { method: 'POST', body: JSON.stringify(zone) })
  const updateZone = (id: number, zone: any) => apiRequest(`/shops/${shopId}/delivery-zones/${id}`, { method: 'PUT', body: JSON.stringify(zone) })
  const deleteZone = (id: number) => apiRequest(`/shops/${shopId}/delivery-zones/${id}`, { method: 'DELETE' })

  // Tarifs distance
  const fetchPricing = () => apiRequest(`/shops/${shopId}/distance-pricing`)
  const createPricing = (p: any) => apiRequest(`/shops/${shopId}/distance-pricing`, { method: 'POST', body: JSON.stringify(p) })
  const updatePricing = (id: number, p: any) => apiRequest(`/shops/${shopId}/distance-pricing/${id}`, { method: 'PUT', body: JSON.stringify(p) })
  const deletePricing = (id: number) => apiRequest(`/shops/${shopId}/distance-pricing/${id}`, { method: 'DELETE' })
  const togglePricing = (id: number) => apiRequest(`/shops/${shopId}/distance-pricing/${id}/toggle`, { method: 'PATCH' })

  // Frais additionnels
  const fetchFees = () => apiRequest(`/shops/${shopId}/delivery-fees`)
  const createFee = (f: any) => apiRequest(`/shops/${shopId}/delivery-fees`, { method: 'POST', body: JSON.stringify(f) })
  const updateFee = (id: number, f: any) => apiRequest(`/shops/${shopId}/delivery-fees/${id}`, { method: 'PUT', body: JSON.stringify(f) })
  const deleteFee = (id: number) => apiRequest(`/shops/${shopId}/delivery-fees/${id}`, { method: 'DELETE' })
  const toggleFee = (id: number) => apiRequest(`/shops/${shopId}/delivery-fees/${id}/toggle`, { method: 'PATCH' })

  // Livreurs
  const fetchCouriers = () => apiRequest(`/shops/${shopId}/couriers`)
  const createCourier = (c: any) => apiRequest(`/shops/${shopId}/couriers`, { method: 'POST', body: JSON.stringify(c) })
  const updateCourier = (id: number, c: any) => apiRequest(`/shops/${shopId}/couriers/${id}`, { method: 'PUT', body: JSON.stringify(c) })
  const deleteCourier = (id: number) => apiRequest(`/shops/${shopId}/couriers/${id}`, { method: 'DELETE' })

  // Livraisons
  const fetchDeliveries = (status?: string) => apiRequest(`/shops/${shopId}/deliveries${status ? `?status=${status}` : ''}`)
  const assignCourier = (deliveryId: number, courierId: number) =>
    apiRequest(`/shops/${shopId}/deliveries/${deliveryId}/assign`, { method: 'POST', body: JSON.stringify({ courier_id: courierId }) })
  const checkPendingAlerts = () => apiRequest(`/shops/${shopId}/deliveries/pending-alert`)

  // Calcul prix
  const calculatePrice = (distanceKm: number, type: string, fees: number[]) =>
    apiRequest(`/shops/${shopId}/delivery/calculate`, {
      method: 'POST',
      body: JSON.stringify({ distance_km: distanceKm, type, selected_fees: fees })
    })

  return {
    fetchZones, createZone, updateZone, deleteZone,
    fetchPricing, createPricing, updatePricing, deletePricing, togglePricing,
    fetchFees, createFee, updateFee, deleteFee, toggleFee,
    fetchCouriers, createCourier, updateCourier, deleteCourier,
    fetchDeliveries, assignCourier, checkPendingAlerts, calculatePrice,
  }
}