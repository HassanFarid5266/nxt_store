<template>
  <aside class="sidebar" id="sidebar">
    <div class="boxed">
      <h4 class="section-subtitle">Navigate</h4>
      <ul class="list menu-list">
        <li class="list-item">
          <router-link to="/" class="list-link">Home</router-link>
        </li>
        <li class="list-item">
          <a target="_blank" href="https://nextash.com/about-us/" class="list-link">About</a>
        </li>
        <li class="list-item">
          <a target="_blank" href="https://nextash.com/faqs/" class="list-link">FAQs</a>
        </li>
        <li class="list-item">
          <a target="_blank" href="https://nextash.com/contact-us/" class="list-link">Contact</a>
        </li>
        
        <template v-if="isLoggedIn">
          <li class="list-item">
            <router-link to="/account" class="list-link">{{ user?.name || 'Account' }}</router-link>
          </li>
          <li class="list-item">
            <a href="/logout" id="logout" class="list-link" @click.prevent="logout">Logout</a>
          </li>
        </template>
        <template v-else>
          <li class="list-item">
            <router-link to="/login" class="list-link">Login / Signup</router-link>
          </li>
        </template>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)

const logout = async () => {
  await authStore.logout()
}
</script>
