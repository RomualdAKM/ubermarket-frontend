import { ref, computed } from 'vue'
import { useAuth } from './useAuth'

// Types
export interface RoleInfo {
  code: string
  name: string
  description: string
  permissions_count?: number
}

export interface RoleDetails extends RoleInfo {
  permissions: Permission[]
  permissions_grouped: Record<string, Permission[]>
}

export interface Permission {
  code: string
  label: string
  group?: string
}

export interface CollaboratorUser {
  id: number
  name: string
  email: string
}

export interface Collaborator {
  id: number
  user: CollaboratorUser | null
  invited_email: string | null
  role: RoleInfo
  permissions: string[]
  status: 'pending' | 'active' | 'inactive'
  invited_by: { id: number; name: string } | null
  created_at: string
  accepted_at: string | null
  invitation_expires_at: string | null
  is_expired: boolean
}

export interface CollaboratorStats {
  total: number
  active: number
  pending: number
  inactive: number
  by_role: Record<string, number>
}

export interface CollaboratorLimits {
  allowed: boolean
  reason?: string
  limit: number
  current: number
  remaining?: number
}

export interface CollaboratorListResponse {
  collaborators: Collaborator[]
  stats: CollaboratorStats
  limits: CollaboratorLimits
}

export interface CollaborationShop {
  id: number
  shop: {
    id: number
    name: string
    slug: string
    logo: string | null
  }
  role: RoleInfo
  permissions: string[]
  invited_by: string | null
  accepted_at: string
}

export interface InvitationInfo {
  shop: {
    name: string
    logo: string | null
  }
  role: RoleInfo
  invited_by: string | null
  invited_email: string
  expires_at: string
}

export function useCollaborators() {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const apiBase = config.public.apiBase

  // Fonction utilitaire pour les requêtes API authentifiées
  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue')
    }

    return data
  }

  // State
  const collaborators = ref<Collaborator[]>([])
  const stats = ref<CollaboratorStats | null>(null)
  const limits = ref<CollaboratorLimits | null>(null)
  const roles = ref<RoleInfo[]>([])
  const permissions = ref<Record<string, Permission[]>>({})
  const myCollaborations = ref<CollaborationShop[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Obtenir la liste des rôles disponibles
   */
  const fetchRoles = async (): Promise<RoleInfo[]> => {
    try {
      const response = await apiRequest<{ success: boolean; data: RoleInfo[] }>(
        '/collaborators/config/roles'
      )
      roles.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  /**
   * Obtenir les détails d'un rôle
   */
  const fetchRoleDetails = async (roleCode: string): Promise<RoleDetails> => {
    try {
      const response = await apiRequest<{ success: boolean; data: RoleDetails }>(
        `/collaborators/config/roles/${roleCode}`
      )
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  /**
   * Obtenir toutes les permissions groupées
   */
  const fetchPermissions = async (): Promise<Record<string, Permission[]>> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Record<string, Permission[]> }>(
        '/collaborators/config/permissions'
      )
      permissions.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  /**
   * Lister les collaborateurs d'une boutique
   */
  const fetchCollaborators = async (shopId: number): Promise<CollaboratorListResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await apiRequest<{ success: boolean; data: CollaboratorListResponse }>(
        `/shops/${shopId}/collaborators`
      )
      collaborators.value = response.data.collaborators
      stats.value = response.data.stats
      limits.value = response.data.limits
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Vérifier la limite de collaborateurs
   */
  const checkLimit = async (shopId: number): Promise<CollaboratorLimits> => {
    try {
      const response = await apiRequest<{ success: boolean; data: CollaboratorLimits }>(
        `/shops/${shopId}/collaborators/check-limit`
      )
      limits.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  /**
   * Inviter un collaborateur
   */
  const invite = async (shopId: number, payload: {
    email: string
    role: string
    custom_permissions?: string[]
  }): Promise<Collaborator> => {
    loading.value = true
    error.value = null

    try {
      const response = await apiRequest<{ success: boolean; data: Collaborator }>(
        `/shops/${shopId}/collaborators/invite`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      )
      // Recharger la liste
      await fetchCollaborators(shopId)
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Renvoyer une invitation
   */
  const resendInvitation = async (shopId: number, collaboratorId: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await apiRequest<{ success: boolean }>(
        `/shops/${shopId}/collaborators/${collaboratorId}/resend`,
        { method: 'POST' }
      )
      // Recharger la liste
      await fetchCollaborators(shopId)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Mettre à jour le rôle d'un collaborateur
   */
  const updateRole = async (shopId: number, collaboratorId: number, payload: {
    role: string
    custom_permissions?: string[]
  }): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await apiRequest<{ success: boolean }>(
        `/shops/${shopId}/collaborators/${collaboratorId}/role`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      )
      // Recharger la liste
      await fetchCollaborators(shopId)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Activer/Désactiver un collaborateur
   */
  const toggleStatus = async (shopId: number, collaboratorId: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await apiRequest<{ success: boolean }>(
        `/shops/${shopId}/collaborators/${collaboratorId}/toggle-status`,
        { method: 'PATCH' }
      )
      // Recharger la liste
      await fetchCollaborators(shopId)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Supprimer un collaborateur
   */
  const remove = async (shopId: number, collaboratorId: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await apiRequest<{ success: boolean }>(
        `/shops/${shopId}/collaborators/${collaboratorId}`,
        { method: 'DELETE' }
      )
      // Recharger la liste
      await fetchCollaborators(shopId)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtenir les boutiques où l'utilisateur est collaborateur
   */
  const fetchMyCollaborations = async (): Promise<CollaborationShop[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await apiRequest<{ success: boolean; data: CollaborationShop[] }>(
        '/collaborations'
      )
      myCollaborations.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Vérifier les informations d'une invitation
   */
  const checkInvitation = async (invitationToken: string): Promise<InvitationInfo> => {
    try {
      const response = await apiRequest<{ success: boolean; data: InvitationInfo }>(
        '/collaborations/check-invitation',
        {
          method: 'POST',
          body: JSON.stringify({ token: invitationToken }),
        }
      )
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  /**
   * Accepter une invitation
   */
  const acceptInvitation = async (invitationToken: string): Promise<{ shop: any; role: RoleInfo }> => {
    loading.value = true
    error.value = null

    try {
      const response = await apiRequest<{ success: boolean; data: { shop: any; role: RoleInfo } }>(
        '/collaborations/accept',
        {
          method: 'POST',
          body: JSON.stringify({ token: invitationToken }),
        }
      )
      // Recharger les collaborations
      await fetchMyCollaborations()
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Quitter une boutique
   */
  const leaveShop = async (shopId: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await apiRequest<{ success: boolean }>(
        `/collaborations/leave/${shopId}`,
        { method: 'DELETE' }
      )
      // Recharger les collaborations
      await fetchMyCollaborations()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed
  const activeCollaborators = computed(() => 
    collaborators.value.filter(c => c.status === 'active')
  )

  const pendingCollaborators = computed(() => 
    collaborators.value.filter(c => c.status === 'pending')
  )

  const canAddMore = computed(() => 
    limits.value?.allowed ?? false
  )

  const remainingSlots = computed(() => 
    limits.value?.remaining ?? 0
  )

  const isUnlimited = computed(() => 
    limits.value?.limit === -1
  )

  return {
    // State
    collaborators,
    stats,
    limits,
    roles,
    permissions,
    myCollaborations,
    loading,
    error,

    // Computed
    activeCollaborators,
    pendingCollaborators,
    canAddMore,
    remainingSlots,
    isUnlimited,

    // Methods - Config
    fetchRoles,
    fetchRoleDetails,
    fetchPermissions,

    // Methods - Gestion boutique
    fetchCollaborators,
    checkLimit,
    invite,
    resendInvitation,
    updateRole,
    toggleStatus,
    remove,

    // Methods - Collaborations utilisateur
    fetchMyCollaborations,
    checkInvitation,
    acceptInvitation,
    leaveShop,
  }
}
