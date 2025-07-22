import { defineStore } from 'pinia'
//import { loginAjax, resetPasswordAjax, registerAjax } from "src/api/auth"
import { loginAjax } from "src/api/auth"

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoading: false,
    user: null,
    token: null,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getLoadingState: (state) => state.isLoading
  },

  actions: {
    setLoading(loading) {
      this.isLoading = loading
    },

    setError(error) {
      this.error = error
    },

    clearError() {
      this.error = null
    },

    // Delay 3 sec (MOCK)
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    async login(credentials) {
      this.setLoading(true)
      this.clearError()
      
      try {
        await this.sleep(3000)
        
        const response = await loginAjax(credentials)
        
        this.user = response.user
        this.token = response.token
        
        if (response.token) {
          localStorage.setItem('auth_token', response.token)
        }
        
        return response
      } catch (error) {
        this.setError(error.message || 'Error al iniciar sesión')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async register(userData) {
      this.setLoading(true)
      this.clearError()
      
      try {
        await this.sleep(3000)
        //mock for test
        let test = userData
        /*
        const response = await registerAjax(userData)
        return response
        */
       return test
      } catch (error) {
        this.setError(error.message || 'Error en el registro')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async resetPassword(emailData) {
      this.setLoading(true)
      this.clearError()
      
      try {
        await this.sleep(3000)
        
        //const response = await resetPasswordAjax(emailData)
        //return response
        return emailData // Mock response for testing
      } catch (error) {
        this.setError(error.message || 'Error al enviar email de recuperación')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isLoading = false
      this.error = null
      localStorage.removeItem('auth_token')
    },

    // Initialize auth state from localStorage
    initializeAuth() {
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
      }
    }
  }
})