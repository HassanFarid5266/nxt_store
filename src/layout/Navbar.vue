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
          <div v-if="isLoggedIn" class="user-profile-dropdown dropdown" :class="{ active: dropdownOpen }">
            <button class="profile-button" @click="toggleDropdown">
              <div class="profile-avatar">
                <img v-if="user?.user_image" :src="user.user_image" :alt="userDisplayName" class="avatar-image" @error="handleImageError">
                <img v-else src="@/assets/images/default-avatar.svg" :alt="userDisplayName" class="avatar-image">
              </div>
              <div class="profile-info">
                <span class="profile-name">{{ userDisplayName }}</span>
                <span class="profile-email">{{ user?.email }}</span>
              </div>
              <i class="bx bx-chevron-down profile-chevron"></i>
            </button>
            <div class="dropdown-menu profile-dropdown-menu">
              <div class="dropdown-header">
                <div class="dropdown-avatar">
                  <img v-if="user?.user_image" :src="user.user_image" :alt="userDisplayName" class="avatar-image" @error="handleImageError">
                  <img v-else src="@/assets/images/default-avatar.svg" :alt="userDisplayName" class="avatar-image">
                </div>
                <div class="dropdown-user-info">
                  <div class="dropdown-name">{{ userDisplayName }}</div>
                  <div class="dropdown-email">{{ user?.email }}</div>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <router-link to="/profile" @click="toggleDropdown" class="dropdown-item">
                <i class="bx bx-user"></i>
                <span>My Profile</span>
              </router-link>
              <router-link to="/orders" @click="toggleDropdown" class="dropdown-item">
                <i class="bx bx-list-ul"></i>
                <span>My Orders</span>
              </router-link>
              <div class="dropdown-divider"></div>
              <button @click="logout" class="dropdown-item logout-item">
                <i class="bx bx-log-out"></i>
                <span>Logout</span>
              </button>
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { showMessage } from '@/utils/message'

const authStore = useAuthStore()
const cartStore = useCartStore()
const dropdownOpen = ref(false)

const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)

const userDisplayName = computed(() => {
  if (!user.value) return 'User'

  if (user.value.first_name && user.value.last_name) {
    return `${user.value.first_name} ${user.value.last_name}`
  } else if (user.value.name) {
    return user.value.name
  } else if (user.value.first_name) {
    return user.value.first_name
  } else if (user.value.email) {
    return user.value.email.split('@')[0]
  }

  return 'User'
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleImageError = (event) => {
  event.target.src = '/src/assets/images/default-avatar.svg'
}

const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.user-profile-dropdown')
  if (dropdown && !dropdown.contains(event.target)) {
    closeDropdown()
  }
}

const logout = async () => {
  try {
    closeDropdown()
    await authStore.logout()
    showMessage('Logged out successfully', 'success')
    if (window.location.pathname.includes('/account') || window.location.pathname.includes('/orders')) {
      window.location.href = '/'
    }
  } catch (error) {
    console.error('Logout error:', error)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>
