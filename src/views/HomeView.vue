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
            <ProductCard
              :product="item"
              :show-add-to-cart="true"
              :show-button="true"
              button-text="See details"
            />
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

onMounted(async () => {
  await homeStore.loadHomeData()
  await nextTick()
  initSwipers()
})
</script>
