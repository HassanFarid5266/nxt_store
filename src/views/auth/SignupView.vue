<template>
  <main class="boxed auth-layout">
    <form @submit.prevent="handleSignup" class="card card-form" data-aos-duration="1000" data-aos="fade-up" data-aos-once="true">
      <div class="card-head">
        <h1 class="card-title">Signup</h1>
        <p class="card-desc">
          Already have an account?
          <router-link to="/login" class="card-link">Login</router-link>
        </p>
      </div>
      <div class="card-body">
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
        <div class="form-cols-2">
          <div class="form-group">
            <label for="first_name" class="form-label">First Name</label>
            <input 
              type="text" 
              class="form-field" 
              id="first_name" 
              v-model="form.first_name" 
              placeholder="Faisal"
              required
            />
          </div>
          <div class="form-group">
            <label for="last_name" class="form-label">Last Name</label>
            <input 
              type="text" 
              class="form-field" 
              id="last_name" 
              v-model="form.last_name" 
              placeholder="Zahoor"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input 
            type="email" 
            class="form-field" 
            id="email" 
            v-model="form.email" 
            placeholder="user@site.com"
            required
          />
        </div>
        <label class="check">
          <input 
            type="checkbox" 
            v-model="form.agreement" 
            required
          />
          I agree to the
          <a href="https://nextash.com/terms-and-conditions/" target="_blank" class="card-link">Terms and conditions</a>
          and
          <a href="https://nextash.com/privacy-policy/" target="_blank" class="card-link">Privacy policy</a>
        </label>
      </div>
      <div class="card-foot">
        <button 
          type="submit" 
          class="btn btn-primary btn-block btn-pill" 
          :disabled="loading || !form.agreement"
        >
          {{ loading ? 'Creating account...' : 'Signup' }}
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
  first_name: '',
  last_name: '',
  email: '',
  agreement: false
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSignup = async () => {
  if (!form.value.first_name || !form.value.last_name || !form.value.email) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (!form.value.agreement) {
    errorMessage.value = 'Please agree to the terms and conditions'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await authStore.signup({
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email
    })
    
    successMessage.value = 'Account created successfully! Please check your email to verify your account.'
    showMessage('Signup successful! Please check your email.', 'success')
    
    // Optionally redirect to login after a delay
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    errorMessage.value = error.message || 'Signup failed. Please try again.'
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

.form-cols-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.check {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--text);
  font-size: 0.9rem;
  line-height: 1.4;
}

.check input[type="checkbox"] {
  margin-top: 0.2rem;
  flex-shrink: 0;
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

@media (max-width: 768px) {
  .form-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
