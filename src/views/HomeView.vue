<template>
  <main class="layout-home">
    <!-- SLIDER -->
    <section v-if="banners.length" class="boxed welcome">
      <div class="swiper carousel" id="welcome">
        <div class="swiper-wrapper">
          <article v-for="item in banners" :key="item.name" class="swiper-slide">
            <div class="card card-slide">
              <div class="card-image">
                <img :src="item.image" class="image" :alt="item.alt" loading="lazy" />
              </div>
              <div class="card-body">
                <h3 class="card-title text-ellipsis text-ellipsis-2">
                  <router-link :to="`/product/${item.name}`">{{ item.title }}</router-link>
                </h3>
                <p class="card-subtitle">{{ item.excerpt }}</p>
                <router-link :to="`/product/${item.name}`" class="btn btn-primary" style="margin-top: 20px;">
                  See details
                  <i class="bx bx-right-arrow-alt con-end"></i>
                </router-link>
              </div>
            </div>
          </article>
        </div>
        <div class="swiper-pagination"></div>
        <button class="slide-prev btn btn-primary bx bx-left-arrow-alt"></button>
        <button class="slide-next btn btn-primary bx bx-right-arrow-alt"></button>
      </div>
    </section>

    <!-- FEATURED -->
    <section v-if="featured.length" class="boxed featured-1">
      <span class="section-badge">Featured</span>
      <div class="swiper carousel" id="featured">
        <div class="swiper-wrapper">
          <div v-for="item in featured" :key="item.name" class="swiper-slide">
            <div class="card card-product">
              <router-link class="card-image" :to="`/product/${item.name}`">
                <img :src="item.image" class="image" :alt="item.alt" />
              </router-link>
              <div class="card-body">
                <router-link class="card-badge" :to="`/shop/${item.category.name}`">{{ item.category.title }}</router-link>
                <h3 class="card-title text-ellipsis">
                  <router-link :to="`/product/${item.name}`">{{ item.title }}</router-link>
                </h3>
                <p class="card-subtitle text-ellipsis-2">{{ item.excerpt }}</p>
              </div>
              <div class="card-foot">
                <h3 class="card-subtitle">
                  <template v-if="item.variations && item.variations.length">
                    <template v-if="item.variations[0].discount">
                      {{ item.variations[0].discount }} <del>{{ item.variations[0].price }}</del>
                    </template>
                    <template v-else>
                      ${{ item.variations[0].price }}
                    </template>
                  </template>
                  <template v-else>
                    $ 0.0
                  </template>
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
        <button class="slide-prev btn btn-primary bx bx-left-arrow-alt"></button>
        <button class="slide-next btn btn-primary bx bx-right-arrow-alt"></button>
      </div>
    </section>

    <!-- FEEDBACKS -->
    <section v-if="testimonials.length" class="boxed feedbacks">
      <span class="section-badge">Feedbacks</span>
      <h3 class="section-title">Trusted by the World Wide Web.</h3>
      <div class="swiper carousel" id="feedbacks">
        <div class="swiper-wrapper">
          <div v-for="testimonial in testimonials" :key="testimonial.name" class="swiper-slide">
            <TestimonialCard :testimonial="testimonial" />
          </div>
        </div>
        <button class="slide-prev btn btn-primary btn-sm bx bx-left-arrow-alt"></button>
        <button class="slide-next btn btn-primary btn-sm bx bx-right-arrow-alt"></button>
      </div>
    </section>

    <!-- ALL PRODUCTS -->
    <section v-if="allProducts.length" class="boxed featured-2">
      <span class="section-badge">Check All Products</span>
      <div class="grid grid-related">
        <article v-for="item in allProducts" :key="item.name" class="media media-product">
          <router-link class="media-image" :to="`/product/${item.name}`">
            <img :src="item.image" class="image" :alt="item.alt" />
          </router-link>
          <div class="media-body">
            <router-link class="media-badge" :to="`/shop/${item.category.name}`">{{ item.category.title }}</router-link>
            <span class="ratings"><b>5</b> <span class="bx bxs-star active"></span></span>
            <h3 class="media-title text-ellipsis">
              <router-link :to="`/product/${item.name}`">{{ item.title }}</router-link>
            </h3>
            <p class="media-desc">
              <template v-if="item.variations && item.variations.length">
                <template v-if="item.variations[0].discount">
                  {{ item.variations[0].discount }} <del>{{ item.variations[0].price }}</del>
                </template>
                <template v-else>
                  ${{ item.variations[0].price }}
                </template>
              </template>
              <template v-else>
                Custom price
              </template>
            </p>
            <router-link :to="`/product/${item.name}`" class="btn btn-pill btn-sm btn-primary">
              See details <i class="bx bx-right-arrow-alt icon-end"></i>
            </router-link>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Swiper } from 'swiper'
import TestimonialCard from '@/components/TestimonialCard.vue'

const banners = ref([])
const featured = ref([])
const testimonials = ref([])
const allProducts = ref([])

// Initialize Swiper instances
const initSwipers = () => {
  // Featured carousel
  if (featured.value.length) {
    new Swiper("#featured", {
      slidesPerView: 1,
      navigation: {
        nextEl: ".slide-next",
        prevEl: ".slide-prev",
      },
      pagination: {
        el: ".swiper-pagination",
      },
      breakpoints: {
        340: { slidesPerView: 1 },
        576: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
        1440: { slidesPerView: 4 },
      },
    })
  }

  // Welcome carousel
  if (banners.value.length) {
    new Swiper("#welcome", {
      slidesPerView: "auto",
      spaceBetween: 20,
      navigation: {
        nextEl: ".slide-next",
        prevEl: ".slide-prev",
      },
      pagination: {
        el: ".swiper-pagination",
      },
    })
  }

  // Feedbacks carousel
  if (testimonials.value.length) {
    new Swiper("#feedbacks", {
      slidesPerView: 1,
      pagination: true,
      navigation: {
        nextEl: ".slide-next",
        prevEl: ".slide-prev",
      },
      breakpoints: {
        340: { slidesPerView: 1 },
        576: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      },
    })
  }
}

const fetchHomeData = async () => {
  try {
    // Real NexTash Store data
    banners.value = [
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
        name: "Payswitch",
        image: "/src/assets/images/products/payswitch.png", 
        alt: "Payswitch",
        title: "Payswitch",
        excerpt: "Providing a seamless and secure platform for managing online transactions"
      }
    ]
    
    featured.value = [
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
    ]

    testimonials.value = [
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
        full_name: "Mike Chen",
        designation: "Retail Manager, QuickMart"
      }
    ]
    
    allProducts.value = [
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
    ]

    // Initialize Swiper after data is loaded
    await nextTick()
    initSwipers()
    
  } catch (error) {
    console.error('Error fetching home data:', error)
  }
}

onMounted(async () => {
  await fetchHomeData()
})
</script>
