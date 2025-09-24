<template>
  <main class="boxed auth-layout">
    <form @submit.prevent="handleForgotPassword" class="card card-form" data-aos-duration="1000" data-aos="fade-up" data-aos-once="true">
      <div class="card-head">
        <h1 class="card-title">Forgot Password</h1>
        <p class="card-desc">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <div class="card-body">
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
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
            :disabled="loading"
          />
        </div>
        <p>
          Remember your password?
          <router-link to="/login" class="card-link">Back to Login</router-link>
        </p>
      </div>
      <div class="card-foot">
        <button 
          type="submit" 
          class="btn btn-primary btn-block btn-pill" 
          :disabled="loading || !form.email"
        >
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { showMessage } from '@/utils/message'

const authStore = useAuthStore()

const form = ref({
  email: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleForgotPassword = async () => {
  if (!form.value.email) {
    errorMessage.value = 'Please enter your email address'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await authStore.forgotPassword(form.value.email)
    successMessage.value = 'Password reset link has been sent to your email address.'
    showMessage('Password reset link sent!', 'success')
    form.value.email = ''
  } catch (error) {
    errorMessage.value = error.message || 'Failed to send reset link. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
