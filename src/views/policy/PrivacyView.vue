<!-- Privacy Policy Page -->
<template>
  <div>
    <!-- Page Head -->
    <section class="page-head boxed">
      <h1 class="page-title">Privacy Policy</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">Privacy Policy</li>
      </ul>
    </section>

    <!-- Main Content -->
    <main class="layout-policy boxed">
      <div v-if="loading" class="loading-state">
        <p>Loading privacy policy...</p>
      </div>
      <div v-else-if="content" class="policy-content" v-html="content"></div>
      <div v-else class="error-state">
        <p>Privacy Policy content not available.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ApiUrl, apiRequest } from '@/utils/api'

const content = ref('')
const loading = ref(false)

const loadPrivacyPolicy = async () => {
  try {
    loading.value = true
    const response = await apiRequest(ApiUrl('nextash_store.events.policy.get_privacy'))
    content.value = response.message || `
      <div class="card">
        <div class="card-body">
          <h3>Privacy Policy</h3>
          <p>This Privacy Policy describes how NexTash collects, uses, and protects your information.</p>
          
          <h4>1. Information We Collect</h4>
          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p>
          
          <h4>2. How We Use Your Information</h4>
          <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
          
          <h4>3. Information Sharing</h4>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
          
          <h4>4. Data Security</h4>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          
          <h4>5. Contact Us</h4>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@nextash.com</p>
        </div>
      </div>
    `
  } catch (error) {
    console.error('Error loading privacy policy:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPrivacyPolicy()
})
</script>

<style scoped>
.layout-policy {
  max-width: 800px;
  margin: 0 auto;
}

.policy-content {
  line-height: 1.6;
}

.policy-content h3,
.policy-content h4 {
  color: var(--primary);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.policy-content h3:first-child {
  margin-top: 0;
}

.policy-content p {
  margin-bottom: 1rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
}
</style>
