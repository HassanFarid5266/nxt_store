<template>
  <div>
    <!-- Page Head -->
    <section class="page-head boxed">
      <h1 class="page-title">Contact us</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">Contact us</li>
      </ul>
    </section>

    <!-- Main Content -->
    <main class="contact-layout boxed">
      <form @submit.prevent="handleSubmit" class="card card-form" autocomplete="on" data-aos-duration="1000" data-aos="fade-up" data-aos-once="true">
        <div class="card-head center">
          <span class="card-badge">Contact</span>
          <h2 class="card-title">Get in touch</h2>
          <p class="card-subtitle">
            If you have any query please fill out the form below. We do our
            best to respond within 1 business day.
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
            <label for="fullname" class="form-label">Fullname</label>
            <input 
              type="text" 
              class="form-field" 
              id="fullname" 
              v-model="form.fullname"
              required
            />
          </div>
          <div class="form-cols-2">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input 
                type="email" 
                class="form-field" 
                id="email" 
                v-model="form.email"
                required
              />
            </div>
            <div class="form-group">
              <label for="phone" class="form-label">Phone</label>
              <input 
                type="tel" 
                class="form-field" 
                id="phone" 
                v-model="form.phone"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="message" class="form-label">Message</label>
            <textarea 
              class="form-field" 
              id="message" 
              v-model="form.message" 
              rows="5"
              required
            ></textarea>
          </div>
        </div>
        <div class="card-foot center">
          <button 
            type="submit" 
            class="btn btn-primary btn-block btn-pill" 
            :disabled="loading"
          >
            {{ loading ? 'Sending...' : 'Send message' }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ApiUrl, apiRequest } from '@/utils/api'
import { showMessage } from '@/utils/message'

const form = ref({
  fullname: '',
  email: '',
  phone: '',
  message: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  if (!form.value.fullname || !form.value.email || !form.value.message) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await apiRequest(ApiUrl('nextash_store.events.contact.create'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': document.getElementById('csrf_token')?.value
      },
      body: JSON.stringify({
        fullname: form.value.fullname,
        email: form.value.email,
        phone: form.value.phone,
        message: form.value.message
      })
    })

    successMessage.value = 'Thank you for your message! We will get back to you soon.'
    showMessage('Message sent successfully!', 'success')
    
    // Reset form
    form.value = {
      fullname: '',
      email: '',
      phone: '',
      message: ''
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to send message. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>