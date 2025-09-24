import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useHomeStore = defineStore('home', () => {
  const loading = ref(false)

  // Banners data for welcome slider
  const banners = ref([
    {
      name: "nxt-theme",
      image: "/src/assets/images/products/nxt-theme.png",
      alt: "NXT Theme - Rich UI/UX Theme for Frappe",
      title: "NXT Theme - Transform Your Frappe Experience",
      excerpt: "A rich UI/UX theme designed to enhance Frappe applications with modern design"
    },
    {
      name: "pos-awesome",
      image: "/src/assets/images/products/pos-awesome.png", 
      alt: "POS Awesome - Advanced POS System",
      title: "POS Awesome - Next Generation POS",
      excerpt: "Upscale POS system with unified order tracking and intuitive UI/UX(Version-15)"
    },
    {
      name: "payswitch",
      image: "/src/assets/images/products/payswitch.png", 
      alt: "Payswitch",
      title: "Payswitch",
      excerpt: "Providing a seamless and secure platform for managing online transactions"
    }
  ])

  // Featured products for carousel
  const featured = ref([
    {
      name: "nxt-theme",
      image: "/src/assets/images/products/nxt-theme.png",
      alt: "NXT Theme",
      title: "NXT Theme",
      excerpt: "A rich UI/UX theme for Frappe applications",
      category: { name: "themes", title: "Themes" },
      variations: [{ price: "700", discount: null }]
    },
    {
      name: "pos-awesome",
      image: "/src/assets/images/products/pos-awesome.png",
      alt: "POS Awesome",
      title: "POS Awesome", 
      excerpt: "Upscale POS system with unified order tracking",
      category: { name: "pos", title: "POS Systems" },
      variations: [{ price: "700", discount: null }]
    },
    {
      name: "payswitch",
      image: "/src/assets/images/products/payswitch.png",
      alt: "Payswitch",
      title: "Payswitch",
      excerpt: "Platform for seamless and secure online transactions",
      category: { name: "payments", title: "Payment Solutions" },
      variations: [{ price: "200", discount: null }]
    },
    {
      name: "jitsi-meet",
      image: "/src/assets/images/products/nxt-theme.png",
      alt: "Jitsi Meet",
      title: "Jitsi Meet",
      excerpt: "Seamless online meetings with secure video and chat",
      category: { name: "communication", title: "Communication" },
      variations: [{ price: "200", discount: null }]
    }
  ])

  // Testimonials data
  const testimonials = ref([
    {
      name: "testimonial1",
      feedback: "The Frappe apps from NexTash are incredibly useful and user-friendly. They've significantly improved our workflow and productivity.",
      feedback_image: "/src/assets/images/review.webp",
      full_name: "Ahmed Hassan",
      designation: "Project Manager, Tech Solutions"
    },
    {
      name: "testimonial2", 
      feedback: "Outstanding customer support and high-quality products. The NXT Theme transformed our ERPNext interface completely.",
      feedback_image: "/src/assets/images/review.webp",
      full_name: "Sarah Johnson",
      designation: "IT Director, Global Corp"
    },
    {
      name: "testimonial3",
      feedback: "POS Awesome has revolutionized our retail operations. The unified order tracking is exactly what we needed.",
      feedback_image: "/src/assets/images/review.webp",
      full_name: "Mike Chen",
      designation: "Retail Manager, QuickMart"
    },
    {
      name: "testimonial4",
      feedback: "The Frappe apps from this store are fantastic. They are intuitive and have greatly improved our efficiency.",
      feedback_image: "/src/assets/images/review.webp",
      full_name: "Lisa Williams",
      designation: "Business Analyst, Enterprise Solutions"
    }
  ])

  // Additional home products for "Check All Products" section
  const additionalProducts = ref([
    {
      name: "crunchbase",
      image: "/src/assets/images/products/nxt-theme.png",
      alt: "Crunchbase Integration",
      title: "Crunchbase",
      category: { name: "integrations", title: "Business Intelligence" },
      variations: [{ price: "150", discount: null }]
    },
    {
      name: "hijri-calendar",
      image: "/src/assets/images/products/pos-awesome.png",
      alt: "Hijri Calendar",
      title: "Hijri Calendar",
      category: { name: "utilities", title: "Utilities" },
      variations: [{ price: "50", discount: null }]
    },
    {
      name: "language-switcher", 
      image: "/src/assets/images/products/payswitch.png",
      alt: "Language Switcher",
      title: "Language Switcher",
      category: { name: "utilities", title: "Utilities" },
      variations: [{ price: "0", discount: null }]
    }
  ])

  // Computed properties
  const getAllHomeProducts = computed(() => {
    return [...featured.value, ...additionalProducts.value]
  })

  // Actions
  const loadHomeData = async () => {
    loading.value = true
    try {
      // Here you could make API calls to fetch dynamic data
      // For now, the data is static but stored in the store
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return {
        banners: banners.value,
        featured: featured.value,
        testimonials: testimonials.value,
        additionalProducts: additionalProducts.value
      }
    } catch (error) {
      console.error('Error loading home data:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateBanner = (bannerData) => {
    const index = banners.value.findIndex(b => b.name === bannerData.name)
    if (index !== -1) {
      banners.value[index] = { ...banners.value[index], ...bannerData }
    } else {
      banners.value.push(bannerData)
    }
  }

  const addTestimonial = (testimonialData) => {
    testimonials.value.push({
      name: `testimonial${testimonials.value.length + 1}`,
      ...testimonialData
    })
  }

  const getFeaturedProducts = (limit = null) => {
    return limit ? featured.value.slice(0, limit) : featured.value
  }

  return {
    // State
    banners,
    featured,
    testimonials,
    additionalProducts,
    loading,

    // Computed
    getAllHomeProducts,

    // Actions
    loadHomeData,
    updateBanner,
    addTestimonial,
    getFeaturedProducts
  }
})
