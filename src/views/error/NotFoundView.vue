<!-- 404 Not Found Page -->
<template>
  <div class="error-page">
    <div class="error-container boxed">
      <div class="error-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-message">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <div class="error-actions">
          <router-link to="/" class="btn btn-primary btn-lg">
            <i class="bx bx-home"></i> Go Home
          </router-link>
          <button @click="goBack" class="btn btn-secondary btn-lg">
            <i class="bx bx-left-arrow-alt"></i> Go Back
          </button>
        </div>
      </div>
      <div class="error-illustration">
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="150" r="100" fill="var(--primary)" opacity="0.1"/>
          <text x="200" y="150" text-anchor="middle" dy="0.3em" 
                font-size="60" font-weight="bold" fill="var(--primary)">404</text>
          <text x="200" y="200" text-anchor="middle" dy="0.3em" 
                font-size="16" fill="var(--text)" opacity="0.7">Not Found</text>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.error-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.error-content {
  text-align: left;
}

.error-code {
  font-size: 6rem;
  font-weight: 900;
  color: var(--primary);
  margin: 0;
  line-height: 1;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text);
  margin: 1rem 0;
}

.error-message {
  font-size: 1.1rem;
  color: var(--text);
  opacity: 0.8;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.error-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-illustration svg {
  width: 100%;
  max-width: 300px;
  height: auto;
}

@media (max-width: 768px) {
  .error-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .error-content {
    text-align: center;
  }
  
  .error-code {
    font-size: 4rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-actions {
    justify-content: center;
  }
}
</style>
