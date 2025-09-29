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

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return
      }

      const response = await mockApi.auth.checkAuth()
      if (response.success && response.data.user) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('auth_token')
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

  return {
    user,
    isLoggedIn,
    login,
    logout,
    signup,
    checkAuth,
    forgotPassword,
    resetPassword,
    setUser
  }
})
