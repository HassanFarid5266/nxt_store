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
    <CtaSection
      title="Still have questions?"
      subtitle="Can't find the answer you're looking for? Please chat to our friendly team."
      href="https://nextash.com/contact-us/"
      button-text="Get in touch"
      :is-external="true"
    />
    
    <!-- Footer -->
    <AppFooter />

    <!-- Toast Notifications -->
    <ToastNotification
      v-for="toastItem in toasts"
      :key="toastItem.id"
      :show="toastItem.show"
      :type="toastItem.type"
      :title="toastItem.title"
      :message="toastItem.message"
      :duration="toastItem.duration"
      @close="hideToast(toastItem.id)"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppNavbar from '@/layout/Navbar.vue'
import AppFooter from '@/layout/Footer.vue'
import AppSidebar from '@/layout/Sidebar.vue'
import CtaSection from '@/components/CtaSection.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/utils/toast'

const authStore = useAuthStore()
const csrfToken = ref('')
const { toasts, hideToast } = useToast()

onMounted(async () => {
  // Check if user is authenticated
  await authStore.checkAuth()

  // Get CSRF token from meta tag or API
  const metaToken = document.querySelector('meta[name="csrf-token"]')
  if (metaToken) {
    csrfToken.value = metaToken.getAttribute('content')
  }
})
</script>
