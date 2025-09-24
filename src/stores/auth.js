import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ApiUrl, apiRequest } from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  const setUser = (userData) => {
    user.value = userData
    isLoggedIn.value = !!userData
  }

  const login = async (credentials) => {
    try {
      const response = await apiRequest(ApiUrl('nextash_store.events.auth.login'), {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      
      if (response.message && response.message.user) {
        setUser(response.message.user)
        return { success: true }
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await apiRequest(ApiUrl('nextash_store.events.auth.logout'), {
        method: 'POST'
      })
      setUser(null)
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
      return { success: false, error: error.message }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await apiRequest(ApiUrl('nextash_store.events.auth.signup'), {
        method: 'POST',
        body: JSON.stringify(userData)
      })
      
      if (response.message) {
        return { success: true }
      } else {
        throw new Error('Signup failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: error.message }
    }
  }

  const checkAuth = async () => {
    try {
      const response = await apiRequest(ApiUrl('nextash_store.events.auth.check'))
      if (response.message && response.message.user) {
        setUser(response.message.user)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    }
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
    signup,
    checkAuth,
    setUser
  }
})
