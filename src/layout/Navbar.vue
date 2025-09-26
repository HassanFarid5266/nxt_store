<template>
  <header class="navbar">
    <div class="boxed">
      <router-link to="/" class="logo">
        <img src="@/assets/images/logos/logo.png" id="logo" alt="Nextash Clouds Logo" />
      </router-link>
      <div class="nav-items">
        <nav class="menu-items">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/shop" class="nav-link">Shop</router-link>
          <a class="nav-link" target="_blank" href="https://nextash.com/about-us/">About</a>
          <a class="nav-link" target="_blank" href="https://nextash.com/faqs/">FAQs</a>
          <a class="nav-link" target="_blank" href="https://nextash.com/contact-us/">Contact</a>
        </nav>
        <nav class="cart-section">
          <router-link to="/cart" class="cart-button">
            <i class="bx bx-shopping-bag"></i>
            <span v-if="cartStore.itemCount > 0" class="cart-count">{{ cartStore.itemCount }}</span>
          </router-link>
        </nav>
        <nav class="auth-items">
          <div v-if="isLoggedIn" class="dropdown">
            <a href="javascript:void(0)" data-nxt-toggle="dropdown" class="nav-link nav-auth-menu">
              <img v-if="user?.user_image" :src="user.user_image" alt="">
              <img v-else src="@/assets/images/man.png" alt="">
              <span class="dropdown-toggle"></span>
            </a>
            <div class="dropdown-menu">
              <router-link to="/account" class="dropdown-item">Profile</router-link>
              <router-link to="/logout" id="logout" class="dropdown-item" @click.prevent="logout">Logout</router-link>
            </div>
          </div>
          <router-link v-else to="/login" class="btn btn-primary btn-sm">Login / Signup</router-link>
        </nav>
      </div>
      <button type="button" class="menu-btn"></button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)

const logout = async () => {
  await authStore.logout()
}

</script>
