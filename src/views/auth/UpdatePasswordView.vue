<template>
  <main class="boxed auth-layout">
    <form @submit.prevent="handleSubmit" class="card card-form" data-aos-duration="1000" data-aos="fade-up" data-aos-once="true">
      <div class="card-head">
        <h1 class="card-title">Reset password</h1>
        <p class="card-desc">Change your password</p>
      </div>
      
      <div class="card-body">
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Create Password</label>
          <input 
            type="password" 
            class="form-field" 
            id="password" 
            v-model="form.password"
            minlength="8"
            required
          />
          <small class="form-hint">Password must be at least 8 characters long</small>
        </div>
        
        <div class="form-group">
          <label for="cpassword" class="form-label">Confirm Password</label>
          <input 
            type="password" 
            class="form-field" 
            id="cpassword" 
            v-model="form.confirmPassword"
            minlength="8"
            required
          />
          <small v-if="form.confirmPassword && !passwordsMatch" class="form-error">
            Passwords do not match
          </small>
        </div>
      </div>
      
      <div class="card-foot">
        <button 
          type="submit" 
          class="btn btn-primary btn-block btn-pill" 
          :disabled="loading || !isFormValid"
        >
          {{ loading ? 'Changing...' : 'Change' }}
        </button>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApiUrl, apiRequest } from '@/utils/api'
import { showMessage } from '@/utils/message'

const route = useRoute()
const router = useRouter()

const form = ref({
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const passwordsMatch = computed(() => {
  return form.value.password === form.value.confirmPassword
})

const isFormValid = computed(() => {
  return form.value.password.length >= 8 && 
         form.value.confirmPassword.length >= 8 && 
         passwordsMatch.value
})

const handleSubmit = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Please ensure both passwords match and are at least 8 characters long'
    return
  }

  const resetKey = route.query.key
  if (!resetKey) {
    errorMessage.value = 'Invalid reset link. Please request a new password reset.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await apiRequest(ApiUrl('nextash_store.events.profile.update_password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': document.getElementById('csrf_token')?.value
      },
      body: JSON.stringify({
        key: resetKey,
        password: form.value.password,
        confirm_password: form.value.confirmPassword
      })
    })

    successMessage.value = 'Password updated successfully! Redirecting to login...'
    showMessage('Password updated successfully!', 'success')
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    
  } catch (error) {
    errorMessage.value = error.message || 'Failed to update password. Please try again.'
  } finally {
    loading.value = false
  }
}

// Check if reset key is present
onMounted(() => {
  const resetKey = route.query.key
  if (!resetKey) {
    errorMessage.value = 'Invalid reset link. Please request a new password reset.'
  }
})
</script>
