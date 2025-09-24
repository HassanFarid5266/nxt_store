<!-- App Navbar Component -->
<template>
  <header class="navbar">
    <div class="boxed">
      <router-link to="/" class="logo">
        <img src="/assets/nextash_store/images/logos/logo.png" id="logo" alt="Nextash Clouds Logo" />
      </router-link>
      <div class="nav-items">
        <nav class="menu-items">
          <router-link to="/" class="nav-link">Home</router-link>
          <a class="nav-link" target="_blank" href="https://nextash.com/about-us/">About</a>
          <a class="nav-link" target="_blank" href="https://nextash.com/faqs/">FAQs</a>
          <a class="nav-link" target="_blank" href="https://nextash.com/contact-us/">Contact</a>
        </nav>
        <nav class="auth-items">
          <div v-if="user" class="dropdown" :class="{ active: showDropdown }">
            <a href="javascript:void(0)" @click="toggleDropdown" class="nav-link nav-auth-menu">
              <img :src="user.user_image || '/assets/nextash_store/images/man.png'" alt="">
              <span class="dropdown-toggle"></span>
            </a>
            <div class="dropdown-menu">
              <router-link to="/account" class="dropdown-item">Profile</router-link>
              <a href="#" @click="logout" class="dropdown-item">Logout</a>
            </div>
          </div>
          <router-link v-else to="/login" class="btn btn-primary btn-sm">Login / Signup</router-link>
        </nav>
      </div>
      <button type="button" class="menu-btn" @click="toggleSidebar"></button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = ref(authStore.user)
const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const toggleSidebar = () => {
  document.getElementById('sidebar')?.classList.toggle('active')
  document.body.style.overflowY = document.getElementById('sidebar')?.classList.contains('active') ? 'hidden' : 'auto'
}

const logout = async () => {
  await authStore.logout()
  showDropdown.value = false
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    showDropdown.value = false
  }
})
</script>
