import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  role: string
}
// Renommé 'UserResponse' en 'UserApiResponse' pour éviter le conflit
interface UserApiResponse {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })
        
        if (!response.token || !response.user) {
          throw new Error('Identifiants invalides')
        }
        
        this.setToken(response.token)
        this.user = response.user

        // Rediriger en fonction du rôle de l'utilisateur
        if (this.isAdmin) {
          return navigateTo('/')
        }
        
        return navigateTo('/decomptes')
      } catch (error: any) {
        const message = error.data?.message || error.message || 'Erreur de connexion'
        throw new Error(message)
      } finally {
        this.loading = false
      }
    },

    setToken(token: string) {
      this.token = token
      if (process.client) {
        localStorage.setItem('auth:token', token)
      }
    },

    logout() {
      this.token = null
      this.user = null
      if (process.client) {
        localStorage.removeItem('auth:token')
      }
      return navigateTo('/login')
    },

    async initAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth:token')
        if (token) {
          try {
            this.setToken(token)
            await this.fetchUser()
          } catch (error) {
            this.logout()
          }
        }
      }
    },

    async fetchUser() {
      if (!this.token) return
      
      try {
        const user = await $fetch<UserApiResponse>('/api/auth/me')
        this.user = {
          id: user._id,
          email: user.email,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          role: user.role || 'user' // default role if not specified
        }
      } catch (error) {
        this.logout()
      }
    },

    async register(userData: { firstName: string; lastName: string; email: string; password: string }) {
      this.loading = true
      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData
        })
        
        if (!response.token) {
          throw new Error('Inscription échouée')
        }
        
        this.setToken(response.token)
        await this.fetchUser()

        return navigateTo('/decomptes')
      } catch (error: any) {
        const message = error.data?.message || error.message || 'Erreur lors de l\'inscription'
        throw new Error(message)
      } finally {
        this.loading = false
      }
    },
  }
})
