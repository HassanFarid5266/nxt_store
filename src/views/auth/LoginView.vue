<template>
  <main class="boxed auth-layout">
    <form @submit.prevent="handleLogin" class="card card-form" data-aos-duration="1000" data-aos="fade-up" data-aos-once="true">
      <div class="card-head">
        <h1 class="card-title">Login</h1>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showMessage } from '@/utils/message'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(form.value.email, form.value.password)
    showMessage('Login successful!', 'success')
    router.push('/')
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>