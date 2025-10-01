<template>
  <main class="boxed auth-layout">
    <form @submit.prevent="handleLogin" class="card card-form" data-aos-duration="1000" data-aos="fade-up" data-aos-once="true">
      <div class="card-head">
        <h1 class="card-title">Login</h1>
        <div v-if="route.query.redirect" class="alert alert-info">
          <i class="bx bx-info-circle"></i>
          {{ getRedirectMessage() }}
        </div>
        <p class="card-desc">
          Don't have an account?
          <router-link to="/signup" class="card-link">Signup</router-link>
        </p>
      </div>
      <div class="card-body">
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>
        <div class="form-group">
          <label for="email" class="form-label">Email address</label>
          <input 
            type="email" 
            class="form-field" 
            id="email" 
            v-model="form.email" 
            placeholder="user@example.com"
            required
          />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input 
            type="password" 
            class="form-field" 
            id="password" 
            v-model="form.password" 
            placeholder="********"
            required
          />
        </div>
        <p>
          <router-link to="/forgot-password" class="card-link">Forgot password?</router-link>
        </p>
      </div>
      <div class="card-foot">
        <button 
          type="submit" 
          class="btn btn-primary btn-block btn-pill" 
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showMessage } from '@/utils/message'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const getRedirectMessage = () => {
  const redirect = route.query.redirect
  if (redirect === '/checkout') {
    return 'Please log in to continue to checkout'
  } else if (redirect === '/profile') {
    return 'Please log in to view your profile'
  } else if (redirect === '/orders') {
    return 'Please log in to view your orders'
  }
  return 'Please log in to continue'
}

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.login(form.value)
    if (result.success) {
      showMessage('Login successful!', 'success')
      const redirectTo = route.query.redirect || '/'
      router.push(redirectTo)
    } else {
      errorMessage.value = result.error || 'Login failed. Please try again.'
    }
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
