import type { RegisterData, LoginData, User, ApiResponse } from '~/types/auth'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const user = useState<User | null>('auth.user', () => null)
  const token = useState<string | null>('auth.token', () => null)
  const isAuthenticated = computed(() => !!token.value)

  // Fonction utilitaire pour les requêtes API
  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }

    // Ne pas ajouter Content-Type pour FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    try {
      const response = await fetch(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers
      })

      const data = await response.json()

      if (!response.ok) {
        // Gérer spécifiquement les erreurs de validation (422)
        if (response.status === 422) {
          return {
            success: false,
            message: data.message || 'Erreurs de validation',
            errors: data.errors
          }
        }
        throw new Error(data.message || 'Une erreur est survenue')
      }

      return data
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion au serveur')
    }
  }

  // Inscription
  const register = async (userData: RegisterData): Promise<ApiResponse<{ user: User, token: string }>> => {
    try {
      const response = await apiRequest<{ user: User, token: string }>('/vendor/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      })

      if (response.success && response.token && response.user) {
        token.value = response.token
        user.value = response.user
        
        // Stocker le token dans le localStorage pour la persistance
        if (process.client) {
          localStorage.setItem('auth_token', response.token)
        }
      }

      return response
    } catch (error: any) {
      throw error
    }
  }

  // Connexion
  const login = async (credentials: LoginData): Promise<ApiResponse<{ user: User, token: string }>> => {
    try {
      const response = await apiRequest<{ user: User, token: string }>('/vendor/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })

      if (response.success && response.token && response.user) {
        token.value = response.token
        user.value = response.user
        
        // Stocker le token dans le localStorage pour la persistance
        if (process.client) {
          localStorage.setItem('auth_token', response.token)
        }
      }

      return response
    } catch (error: any) {
      throw error
    }
  }

  // Déconnexion
  const logout = async (): Promise<void> => {
    try {
      if (token.value) {
        // Déterminer le endpoint selon le rôle
        const storedRole = process.client ? localStorage.getItem('user_role') : null
        const endpoint = storedRole === 'client' ? '/client/logout' : '/vendor/logout'
        
        await apiRequest(endpoint, {
          method: 'POST'
        })
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      token.value = null
      user.value = null
      
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_role')
      }
    }
  }

  // Récupérer l'utilisateur connecté
  const fetchUser = async (): Promise<User | null> => {
    try {
      // Déterminer le endpoint selon le rôle stocké
      const storedRole = process.client ? localStorage.getItem('user_role') : null
      const endpoint = storedRole === 'client' ? '/client/user' : '/vendor/user'
      
      const response = await apiRequest<User>(endpoint)
      if (response.success && response.user) {
        user.value = response.user
        return response.user
      }
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      await logout()
      return null
    }
  }

  // Initialiser l'authentification depuis le localStorage
  const initAuth = async (): Promise<void> => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        token.value = storedToken
        await fetchUser()
      }
    }
  }

  // Setter pour le token (utile pour login manuel)
  const setToken = (newToken: string) => {
    token.value = newToken
    if (process.client) {
      localStorage.setItem('auth_token', newToken)
    }
  }

  // Setter pour l'utilisateur
  const setUser = (newUser: User) => {
    user.value = newUser
    // Stocker le rôle pour déterminer les endpoints
    if (process.client && newUser.role) {
      localStorage.setItem('user_role', newUser.role)
    }
  }

  // Mettre à jour le profil utilisateur
  const updateProfile = async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const storedRole = process.client ? localStorage.getItem('user_role') : null
      const endpoint = storedRole === 'client' ? '/client/user' : '/vendor/user'
      
      const response = await apiRequest<User>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(profileData)
      })

      if (response.success && response.user) {
        user.value = response.user
      }

      return response
    } catch (error: any) {
      throw error
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    register,
    login,
    logout,
    fetchUser,
    updateProfile,
    initAuth,
    setToken,
    setUser
  }
}