import { createApp } from 'vue'
import { createPinia } from 'pinia'
import AOS from 'aos'

import App from './App.vue'
import router from './router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

// CSS imports
import '@/assets/css/style.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'aos/dist/aos.css'
import 'boxicons/css/boxicons.min.css'
import "@/assets/libs/lightbox/fslightbox"
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Initialize stores after app is mounted
const cartStore = useCartStore()
const authStore = useAuthStore()

// Check authentication and initialize cart
authStore.checkAuth().then(() => {
  // Initialize cart after auth check
  cartStore.initializeCart()
})

// Initialize AOS after Vue app is mounted
setTimeout(() => {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  })
}, 100)
