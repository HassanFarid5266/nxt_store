<!-- App Sidebar Component -->
<template>
  <div id="sidebar" class="sidebar">
    <div class="sidebar-content">
      <nav class="sidebar-menu">
        <router-link to="/" class="sidebar-link" @click="closeSidebar">Home</router-link>
        <a class="sidebar-link" target="_blank" href="https://nextash.com/about-us/">About</a>
        <a class="sidebar-link" target="_blank" href="https://nextash.com/faqs/">FAQs</a>
        <a class="sidebar-link" target="_blank" href="https://nextash.com/contact-us/">Contact</a>
      </nav>
      <div class="sidebar-auth">
        <div v-if="user" class="sidebar-user">
          <div class="user-info">
            <img :src="user.user_image || '/assets/nextash_store/images/man.png'" alt="User" class="user-avatar">
            <span class="user-name">{{ user.name }}</span>
          </div>
          <div class="user-actions">
            <router-link to="/account" class="sidebar-link" @click="closeSidebar">Profile</router-link>
            <a href="#" @click="logout" class="sidebar-link">Logout</a>
          </div>
        </div>
        <router-link v-else to="/login" class="btn btn-primary" @click="closeSidebar">Login / Signup</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = ref(authStore.user)

const closeSidebar = () => {
  document.getElementById('sidebar')?.classList.remove('active')
  document.body.style.overflowY = 'auto'
  document.documentElement.style.overflowY = 'auto'
}

const logout = async () => {
  await authStore.logout()
  closeSidebar()
}
</script>
