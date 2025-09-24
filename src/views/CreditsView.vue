<template>
  <div>
    <!-- Page Header -->
    <section class="page-head boxed">
      <h1 class="page-title">Credits</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">Credits</li>
      </ul>
    </section>

    <!-- Content -->
    <main class="boxed content">
      <div v-if="creditsContent" v-html="creditsContent"></div>
      <div v-else-if="loading" class="loading-container">
        <p>Loading credits...</p>
      </div>
      <div v-else class="error-container">
        <p>Unable to load credits information.</p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'CreditsView',
  data() {
    return {
      creditsContent: '',
      loading: true
    }
  },
  async mounted() {
    await this.loadCredits()
  },
  methods: {
    async loadCredits() {
      try {
        // This would typically fetch from your API
        // For now, using placeholder content
        this.creditsContent = `
          <h2>Website Credits</h2>
          <p>This website was built with the following technologies and resources:</p>
          <ul>
            <li><strong>Vue.js</strong> - Frontend framework</li>
            <li><strong>Vite</strong> - Build tool</li>
            <li><strong>Swiper</strong> - Carousel component</li>
            <li><strong>AOS</strong> - Animation library</li>
            <li><strong>Pinia</strong> - State management</li>
          </ul>
          <p>Special thanks to all the open source contributors and designers who made this project possible.</p>
        `
        this.loading = false
      } catch (error) {
        console.error('Failed to load credits:', error)
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.loading-container,
.error-container {
  text-align: center;
  padding: 2rem;
}

.error-container {
  color: var(--color-danger, #dc3545);
}
</style>
