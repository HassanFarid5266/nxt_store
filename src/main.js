import { createApp } from 'vue'
import { createPinia } from 'pinia'
import AOS from 'aos'
import App from './App.vue'
import router from './router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

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

const cartStore = useCartStore()
const authStore = useAuthStore()

authStore.checkAuth().then(() => cartStore.initializeCart())

setTimeout(() => {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  })
}, 100)
