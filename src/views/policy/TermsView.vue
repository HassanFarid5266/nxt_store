<!-- Terms of Use Page -->
<template>
  <div>
    <!-- Page Head -->
    <section class="page-head boxed">
      <h1 class="page-title">Terms of Use</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">Terms of Use</li>
      </ul>
    </section>

    <!-- Main Content -->
    <main class="layout-policy boxed">
      <div v-if="loading" class="loading-state">
        <p>Loading terms...</p>
      </div>
      <div v-else-if="content" class="policy-content" v-html="content"></div>
      <div v-else class="error-state">
        <p>Terms of Use content not available.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ApiUrl, apiRequest } from '@/utils/api'

const content = ref('')
const loading = ref(false)

const loadTerms = async () => {
  try {
    loading.value = true
    const response = await apiRequest(ApiUrl('nextash_store.events.policy.get_terms'))
    content.value = response.message || `
      <div class="card">
        <div class="card-body">
          <h3>Terms of Use</h3>
          <p>Welcome to NexTash Marketplace. By using our services, you agree to these terms.</p>
          
          <h4>1. Acceptance of Terms</h4>
          <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h4>2. Use License</h4>
          <p>Permission is granted to temporarily download one copy of the materials on NexTash's website for personal, non-commercial transitory viewing only.</p>
          
          <h4>3. Disclaimer</h4>
          <p>The materials on NexTash's website are provided on an 'as is' basis. NexTash makes no warranties, expressed or implied.</p>
          
          <h4>4. Limitations</h4>
          <p>In no event shall NexTash or its suppliers be liable for any damages arising out of the use or inability to use the materials on NexTash's website.</p>
          
          <h4>5. Contact Information</h4>
          <p>If you have any questions about these Terms of Use, please contact us at support@nextash.com</p>
        </div>
      </div>
    `
  } catch (error) {
    console.error('Error loading terms:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTerms()
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
