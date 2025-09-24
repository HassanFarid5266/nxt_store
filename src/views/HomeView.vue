<template>
  <main class="layout-home">
    <!-- SLIDER -->
    <HeroSlider
      :slides="banners"
      slider-id="welcome"
      :autoplay="true"
      :space-between="20"
    />

    <!-- FEATURED -->
    <section v-if="featured.length" class="boxed featured-1">
      <span class="section-badge">Featured</span>
      <div class="swiper carousel" id="featured">
        <div class="swiper-wrapper">
          <div v-for="item in featured" :key="item.name" class="swiper-slide">
            <ProductCard
              :product="item"
              :show-add-to-cart="true"
              :show-button="true"
              button-text="See details"
            />
          </div>
        </div>
        <div class="swiper-pagination"></div>
        <button class="slide-prev btn btn-primary">
          <i class="bx bx-left-arrow-alt"></i>
        </button>
        <button class="slide-next btn btn-primary">
          <i class="bx bx-right-arrow-alt"></i>
        </button>
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
        <div class="swiper-pagination"></div>
        <button class="slide-prev btn btn-primary btn-sm">
          <i class="bx bx-left-arrow-alt"></i>
        </button>
        <button class="slide-next btn btn-primary btn-sm">
          <i class="bx bx-right-arrow-alt"></i>
        </button>
      </div>
    </section>

    <!-- ALL PRODUCTS -->
    <section v-if="allProducts.length" class="boxed featured-2">
      <span class="section-badge">Check All Products</span>
      <div class="grid grid-related">
        <MediaProductCard
          v-for="item in allProducts"
          :key="item.name"
          :product="item"
          :show-rating="true"
          button-text="See details"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue'
import { Swiper } from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import HeroSlider from '@/components/HeroSlider.vue'
import TestimonialCard from '@/components/TestimonialCard.vue'
import ProductCard from '@/components/ProductCard.vue'
import MediaProductCard from '@/components/MediaProductCard.vue'
import { useHomeStore } from '@/stores/home'

const homeStore = useHomeStore()

// Get data from store
const banners = computed(() => homeStore.banners)
const featured = computed(() => homeStore.featured)
const testimonials = computed(() => homeStore.testimonials)
const allProducts = computed(() => homeStore.getAllHomeProducts)

// Initialize Swiper instances
const initSwipers = () => {
  // Featured carousel
  if (featured.value.length) {
    new Swiper("#featured", {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: "#featured .slide-next",
        prevEl: "#featured .slide-prev",
      },
      pagination: {
        el: "#featured .swiper-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
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

  // Feedbacks carousel
  if (testimonials.value.length) {
    new Swiper("#feedbacks", {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: "#feedbacks .slide-next",
        prevEl: "#feedbacks .slide-prev",
      },
      pagination: {
        el: "#feedbacks .swiper-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
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

onMounted(async () => {
  await homeStore.loadHomeData()
  await nextTick()
  initSwipers()
})
</script>
