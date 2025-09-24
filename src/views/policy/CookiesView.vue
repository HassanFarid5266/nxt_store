<template>
  <div>
    <!-- Page Head -->
    <section class="page-head boxed">
      <h1 class="page-title">Cookies Policy</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">Cookies Policy</li>
      </ul>
    </section>

    <!-- Main Content -->
    <main class="layout-policy boxed">
      <div v-if="loading" class="loading-state">
        <p>Loading cookies policy...</p>
      </div>
      <div v-else-if="content" class="policy-content" v-html="content"></div>
      <div v-else class="error-state">
        <p>Cookies Policy content not available.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ApiUrl, apiRequest } from '@/utils/api'

const content = ref('')
const loading = ref(false)

const loadCookiesPolicy = async () => {
  try {
    loading.value = true
    const response = await apiRequest(ApiUrl('nextash_store.events.policy.get_cookies'))
    content.value = response.message || `
      <div class="card">
        <div class="card-body">
          <h3>Cookies Policy</h3>
          <p>This Cookies Policy explains how NexTash uses cookies and similar technologies.</p>
          
          <h4>1. What Are Cookies</h4>
          <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience.</p>
          
          <h4>2. Types of Cookies We Use</h4>
          <ul>
            <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly.</li>
            <li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website.</li>
            <li><strong>Functionality Cookies:</strong> These remember your preferences and settings.</li>
          </ul>
          
          <h4>3. Managing Cookies</h4>
          <p>You can control and manage cookies through your browser settings. However, disabling cookies may affect the functionality of our website.</p>
          
          <h4>4. Third-Party Cookies</h4>
          <p>We may use third-party services that place cookies on your device to help us analyze website usage and improve our services.</p>
          
          <h4>5. Contact Us</h4>
          <p>If you have any questions about our use of cookies, please contact us at cookies@nextash.com</p>
        </div>
      </div>
    `
  } catch (error) {
    console.error('Error loading cookies policy:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCookiesPolicy()
})
</script>
