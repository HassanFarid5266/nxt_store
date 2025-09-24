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

<style scoped>
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 2rem 0;
}

.card-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.card-head {
  text-align: center;
  padding: 2rem 2rem 1rem;
}

.card-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.card-desc {
  color: var(--muted);
  margin-bottom: 0;
  line-height: 1.5;
}

.card-link {
  color: var(--primary);
  text-decoration: none;
}

.card-link:hover {
  text-decoration: underline;
}

.card-body {
  padding: 0 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text);
}

.form-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--rounded);
  background: var(--dark);
  color: var(--text);
  font-size: 1rem;
}

.form-field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.1);
}

.form-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-foot {
  padding: 1rem 2rem 2rem;
}

.btn-block {
  width: 100%;
}

.alert {
  padding: 0.75rem;
  border-radius: var(--rounded);
  margin-bottom: 1rem;
}

.alert-error {
  background: var(--danger-subtle);
  color: var(--danger);
  border: 1px solid var(--danger);
}

.alert-success {
  background: var(--success-subtle);
  color: var(--success);
  border: 1px solid var(--success);
}
</style>
