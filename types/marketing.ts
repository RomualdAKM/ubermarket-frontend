export interface MarketingIntegration {
  id: number
  shop_id: number
  platform: 'facebook_pixel' | 'systeme_io' | 'google_analytics'
  credentials: FacebookPixelCredentials | GoogleAnalyticsCredentials | SystemeIoCredentials
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FacebookPixelCredentials {
  pixel_id: string
}

export interface GoogleAnalyticsCredentials {
  tracking_id: string
  measurement_id?: string
}

export interface SystemeIoCredentials {
  api_key: string
  webhook_url?: string
}

export interface MarketingIntegrationData {
  platform: 'facebook_pixel' | 'systeme_io' | 'google_analytics'
  credentials: Record<string, any>
  is_active?: boolean
}

export interface PlatformInfo {
  name: string
  description: string
  icon: string
  fields: Array<{
    name: string
    label: string
    type: string
    placeholder: string
    required: boolean
  }>
}
