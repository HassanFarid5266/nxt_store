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

<style scoped>
.page-head {
  background: var(--dark);
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text);
}

.breadcrumb {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 0.5rem;
}

.page-item {
  display: flex;
  align-items: center;
}

.page-item:not(:last-child)::after {
  content: '/';
  margin-left: 0.5rem;
  color: var(--muted);
}

.page-item.active {
  color: var(--muted);
}

.page-link {
  color: var(--primary);
  text-decoration: none;
}

.page-link:hover {
  text-decoration: underline;
}

.contact-layout {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.card-form {
  width: 100%;
  max-width: 600px;
  background: var(--dark);
  border-radius: var(--rounded);
  box-shadow: var(--shadow);
}

.card-head {
  padding: 2rem 2rem 1rem;
}

.center {
  text-align: center;
}

.card-badge {
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text);
}

.card-subtitle {
  color: var(--muted);
  line-height: 1.6;
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
  background: var(--body);
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
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

.btn-pill {
  border-radius: 50px;
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
