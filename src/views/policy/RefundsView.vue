<template>
  <div>
    <!-- Page Head -->
    <section class="page-head boxed">
      <h1 class="page-title">Refunds Policy</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">Refunds Policy</li>
      </ul>
    </section>

    <!-- Main Content -->
    <main class="layout-policy boxed">
      <div v-if="loading" class="loading-state">
        <p>Loading refunds policy...</p>
      </div>
      <div v-else-if="content" class="policy-content" v-html="content"></div>
      <div v-else class="error-state">
        <p>Refunds Policy content not available.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ApiUrl, apiRequest } from '@/utils/api'

const content = ref('')
const loading = ref(false)

const loadRefundsPolicy = async () => {
  try {
    loading.value = true
    const response = await apiRequest(ApiUrl('nextash_store.events.policy.get_refunds'))
    content.value = response.message || `
      <div class="card">
        <div class="card-body">
          <h3>Refunds Policy</h3>
          <p>This Refunds Policy outlines the conditions under which refunds may be provided for purchases made on NexTash Marketplace.</p>
          
          <h4>1. Digital Products</h4>
          <p>Due to the nature of digital products, all sales are generally final. However, we may provide refunds in the following circumstances:</p>
          <ul>
            <li>The product was not delivered due to a technical error on our part</li>
            <li>The product is significantly different from what was described</li>
            <li>The product contains major defects that prevent its intended use</li>
          </ul>
          
          <h4>2. Refund Request Process</h4>
          <p>To request a refund, please contact our support team within 30 days of purchase with:</p>
          <ul>
            <li>Your order number</li>
            <li>A detailed description of the issue</li>
            <li>Any relevant screenshots or evidence</li>
          </ul>
          
          <h4>3. Processing Time</h4>
          <p>Approved refunds will be processed within 5-10 business days using the original payment method.</p>
          
          <h4>4. Non-Refundable Items</h4>
          <p>The following items are not eligible for refunds:</p>
          <ul>
            <li>Products purchased more than 30 days ago</li>
            <li>Products that have been used or modified</li>
            <li>Products downloaded or accessed after purchase (unless defective)</li>
          </ul>
          
          <h4>5. Contact Us</h4>
          <p>For refund requests or questions, please contact us at refunds@nextash.com</p>
        </div>
      </div>
    `
  } catch (error) {
    console.error('Error loading refunds policy:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRefundsPolicy()
})
</script>
