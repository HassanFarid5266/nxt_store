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
</style>
