<!-- Main App Component -->
<template>
  <div id="app">
    <!-- CSRF Token -->
    <input type="hidden" id="csrf_token" :value="csrfToken" />
    
    <!-- Navbar -->
    <AppNavbar />
    
    <!-- Sidebar -->
    <AppSidebar />
    
    <!-- Main Content -->
    <router-view />
    
    <!-- CTA Section -->
    <section class="card card-cta card-centered boxed" data-aos-duration="1000" data-aos="fade-up" data-aos-once="true" data-aos-easing="ease-in-out">
      <div class="card-body">
        <h3 class="card-title">Still have questions?</h3>
        <p class="card-subtitle">
          Can't find the answer you're looking for? Please chat to our
          friendly team.
        </p>
        <a href="https://nextash.com/contact-us/" target="_blank" class="btn btn-primary btn-lg btn-pill pro">Get in touch</a>
      </div>
    </section>
    
    <!-- Footer -->
    <AppFooter />
    
    <!-- Copyright Footer -->
    <footer class="footer">
      <p class="copyright" style="border-top: none">
        &copy; 2024
        This website is powered by NexTash (SMC-PVT) Ltd, and all right reserved to the 
        <a href="https://nextash.com/" class="link" target="_blank" style="text-decoration: underline;">NexTash</a>. 
        Please check parent site for other 
        <a href="https://nextash.com/" target="_blank" class="link" style="text-decoration: underline;">terms of use and policies.</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const csrfToken = ref('')

onMounted(async () => {
  // Check if user is authenticated
  await authStore.checkAuth()
  
  // Get CSRF token from meta tag or API
  const metaToken = document.querySelector('meta[name="csrf-token"]')
  if (metaToken) {
    csrfToken.value = metaToken.getAttribute('content')
  }
  
  // Initialize AOS (Animate On Scroll)
  if (window.AOS) {
    window.AOS.init()
  }
})
</script>

<style>
/* Global styles can be added here if needed */
</style>
