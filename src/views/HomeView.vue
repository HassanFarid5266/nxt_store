<!-- Home Page View -->
<template>
  <main class="layout-home">
    <!-- HERO SLIDER -->
    <HeroSlider 
      v-if="banners.length" 
      :slides="banners" 
      slider-id="welcome"
    />

    <!-- FEATURED PRODUCTS -->
    <SwiperCarousel 
      v-if="featured.length"
      :items="featured"
      carousel-id="featured"
      badge="Featured"
      section-class="featured-1"
    >
      <template #default="{ item }">
        <ProductCard 
          :product="item" 
          :show-description="true"
          :show-price="true"
        />
      </template>
    </SwiperCarousel>

    <!-- TESTIMONIALS -->
    <SwiperCarousel 
      v-if="testimonials.length"
      :items="testimonials"
      carousel-id="feedbacks"
      badge="Feedbacks"
      title="Trusted by the World Wide Web."
      section-class="feedbacks"
      nav-button-class="btn-sm"
      :show-pagination="false"
      :breakpoints="{
        340: { slidesPerView: 1 },
        576: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 }
      }"
    >
      <template #default="{ item }">
        <TestimonialCard :testimonial="item" />
      </template>
    </SwiperCarousel>

    <!-- ALL PRODUCTS GRID -->
    <section v-if="allProducts.length" class="boxed featured-2">
      <span class="section-badge">Check All Products</span>
      <div class="grid grid-related">
        <MediaProductCard 
          v-for="item in allProducts" 
          :key="item.name"
          :product="item"
          :show-rating="true"
        />
      </div>
    </section>

    <!-- CTA SECTION -->
    <CtaSection 
      title="Still have questions?"
      subtitle="Can't find the answer you're looking for? Please chat to our friendly team."
      href="https://nextash.com/contact-us/"
      button-text="Get in touch"
      :is-external="true"
    />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ApiUrl, apiRequest } from '@/utils/api'
import HeroSlider from '@/components/common/HeroSlider.vue'
import SwiperCarousel from '@/components/common/SwiperCarousel.vue'
import ProductCard from '@/components/common/ProductCard.vue'
import TestimonialCard from '@/components/common/TestimonialCard.vue'
import MediaProductCard from '@/components/common/MediaProductCard.vue'
import CtaSection from '@/components/common/CtaSection.vue'

const banners = ref([])
const featured = ref([])
const testimonials = ref([])
const allProducts = ref([])

const fetchHomeData = async () => {
  try {
    const response = await apiRequest(ApiUrl('nextash_store.events.home.get_data'))
    const data = response.message
    
    banners.value = data.banners || []
    featured.value = data.featured || []
    testimonials.value = data.testimonials || []
    allProducts.value = data.all_products || []
  } catch (error) {
    console.error('Error fetching home data:', error)
    // Set some dummy data for development/testing
    banners.value = []
    featured.value = []
    testimonials.value = []
    allProducts.value = []
  }
}

onMounted(async () => {
  await fetchHomeData()
})
</script>
