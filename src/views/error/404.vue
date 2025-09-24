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
