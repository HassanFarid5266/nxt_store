import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ApiUrl } from '@/utils/api'
import { mockApi } from '@/utils/mockApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  const setUser = (userData) => {
    user.value = userData
    isLoggedIn.value = !!userData

    if (userData) {
      // Save user data to localStorage for persistence
      localStorage.setItem('user_profile', JSON.stringify(userData))
      localStorage.setItem('is_logged_in', 'true')
    } else {
      // Clear user data from localStorage
      localStorage.removeItem('user_profile')
      localStorage.removeItem('is_logged_in')
    }
  }

  const login = async (credentials) => {
    try {
      const response = await mockApi.auth.login(credentials)

      if (response.success && response.data.user) {
        setUser(response.data.user)
        localStorage.setItem('auth_token', response.data.token)
        return { success: true, user: response.data.user }
      }

      return { success: false, error: response.message }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await mockApi.auth.logout()
      setUser(null)
      localStorage.removeItem('auth_token')
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
      localStorage.removeItem('auth_token')
      return { success: false, error: error.message }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await mockApi.auth.signup(userData)

      if (response.success && response.data.user) {
        setUser(response.data.user)
        localStorage.setItem('auth_token', response.data.token)
        return { success: true, user: response.data.user }
      }

      return { success: false, error: response.message }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: error.message }
    }
  }

  const restoreAuthFromStorage = () => {
    try {
      const token = localStorage.getItem('auth_token')
      const isLoggedInStored = localStorage.getItem('is_logged_in')
      const userProfile = localStorage.getItem('user_profile')

      if (token && isLoggedInStored === 'true' && userProfile) {
        const userData = JSON.parse(userProfile)
        user.value = userData
        isLoggedIn.value = true
        return true
      }
    } catch (error) {
      console.error('Error restoring auth from storage:', error)
      // Clear invalid auth data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('is_logged_in')
      localStorage.removeItem('user_profile')
    }
    return false
  }

  const checkAuth = async () => {
    // First, try to restore from localStorage synchronously
    if (restoreAuthFromStorage()) {
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return
      }

      // Fallback to API check if localStorage data is incomplete
      const response = await mockApi.auth.checkAuth()
      if (response.success && response.data.user) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      // Clear invalid auth data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('is_logged_in')
      localStorage.removeItem('user_profile')
    }
  }

  const forgotPassword = async (email) => {
    try {
      const response = await mockApi.auth.forgotPassword(email)
      return { success: response.success, message: response.message }
    } catch (error) {
      console.error('Forgot password error:', error)
      return { success: false, error: error.message }
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await mockApi.auth.resetPassword(token, newPassword)
      return { success: response.success, message: response.message }
    } catch (error) {
      console.error('Reset password error:', error)
      return { success: false, error: error.message }
    }
  }

  // Initialize auth state from localStorage immediately when store is created
  restoreAuthFromStorage()

  return {
    user,
    isLoggedIn,
    login,
    logout,
    signup,
    checkAuth,
    restoreAuthFromStorage,
    forgotPassword,
    resetPassword,
    setUser
  }
})
