import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// CSS imports
import './assets/css/nextash_store.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Initialize AOS after Vue app is mounted
document.addEventListener('DOMContentLoaded', async () => {
  // Dynamically import AOS
  try {
    const AOS = await import('aos')
    AOS.default.init()
  } catch (error) {
    console.log('AOS not available:', error)
  }
})
