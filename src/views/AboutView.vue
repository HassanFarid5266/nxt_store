<!-- About Page View -->
<template>
  <div>
    <!-- Page Head -->
    <section class="page-head boxed">
      <h1 class="page-title">About Us</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">About Us</li>
      </ul>
    </section>

    <!-- Main Content -->
    <main class="layout-about boxed">
      <div v-if="loading" class="loading-state">
        <p>Loading about content...</p>
      </div>
      <div v-else-if="content" class="content" v-html="content"></div>
      <div v-else class="error-state">
        <div class="card">
          <div class="card-body">
            <h3>About NexTash Marketplace</h3>
            <p>Welcome to NexTash Marketplace, your premier destination for digital products and services.</p>
            <p>We are committed to providing high-quality digital solutions that help businesses and individuals succeed in the modern digital landscape.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ApiUrl, apiRequest } from '@/utils/api'

const content = ref('')
const loading = ref(false)

const loadAboutContent = async () => {
  try {
    loading.value = true
    const response = await apiRequest(ApiUrl('nextash_store.events.content.get_about'))
    content.value = response.message?.about || ''
  } catch (error) {
    console.error('Error loading about content:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAboutContent()
})
</script>

<style scoped>
.layout-about {
  max-width: 800px;
  margin: 0 auto;
}

.content {
  line-height: 1.6;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
}
</style>
