<template>
  <main class="boxed auth-layout">
    <form @submit.prevent="handleSignup" class="card card-form" data-aos-duration="1000" data-aos="fade-up"
      data-aos-once="true">
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
            <input type="text" class="form-field" id="first_name" v-model="form.first_name" placeholder="Faisal"
              required />
          </div>
          <div class="form-group">
            <label for="last_name" class="form-label">Last Name</label>
            <input type="text" class="form-field" id="last_name" v-model="form.last_name" placeholder="Zahoor"
              required />
          </div>
        </div>
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input type="email" class="form-field" id="email" v-model="form.email" placeholder="user@site.com" required />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-field" id="password" v-model="form.password"
            placeholder="Enter your password" required minlength="6" />
        </div>
        <div class="form-group">
          <label for="confirm_password" class="form-label">Confirm Password</label>
          <input type="password" class="form-field" id="confirm_password" v-model="form.confirm_password"
            placeholder="Confirm your password" required minlength="6" />
        </div>
        <label class="check">
          <input type="checkbox" v-model="form.agreement" required />
          I agree to the
          <a href="https://nextash.com/terms-and-conditions/" target="_blank" class="card-link">Terms and conditions</a>
          and
          <a href="https://nextash.com/privacy-policy/" target="_blank" class="card-link">Privacy policy</a>
        </label>
      </div>
      <div class="card-foot">
        <button type="submit" class="btn btn-primary btn-block btn-pill" :disabled="loading || !form.agreement">
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
  password: '',
  confirm_password: '',
  agreement: false
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSignup = async () => {
  if (!form.value.first_name || !form.value.last_name || !form.value.email || !form.value.password || !form.value.confirm_password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (form.value.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long'
    return
  }

  if (form.value.password !== form.value.confirm_password) {
    errorMessage.value = 'Passwords do not match'
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
    const result = await authStore.signup({
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      password: form.value.password
    })

    if (result.success) {
      if (result.user) {
        // User was automatically logged in
        successMessage.value = 'Account created successfully! Welcome!'
        showMessage('Signup successful! Welcome!', 'success')
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } else {
        // User needs to verify email or login manually
        successMessage.value = 'Account created successfully! Please check your email to verify your account.'
        showMessage('Signup successful! Please check your email.', 'success')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } else {
      errorMessage.value = result.error || 'Signup failed. Please try again.'
    }
  } catch (error) {
    errorMessage.value = error.message || 'Signup failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
