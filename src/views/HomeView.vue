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
    // TODO: Replace with actual API call
    // Dummy data for now
    banners.value = [
      {
        name: "banner1",
        image: "/images/banner1.jpg",
        alt: "Banner 1",
        title: "Sample Banner 1",
        excerpt: "This is a sample banner"
      }
    ]
    
    featured.value = [
      {
        name: "product1",
        image: "/images/product1.jpg",
        alt: "Product 1",
        title: "Sample Product",
        excerpt: "This is a sample product",
        category: { name: "category1", title: "Category 1" },
        variations: [{ price: "99.99", discount: null }]
      }
    ]

    testimonials.value = [
      {
        name: "testimonial1",
        feedback: "Great service!",
        feedback_image: "/images/user1.jpg",
        full_name: "John Doe",
        designation: "CEO, Company"
      }
    ]

    allProducts.value = [
      {
        name: "product2",
        image: "/images/product2.jpg",
        alt: "Product 2",
        title: "Another Product",
        category: { name: "category2", title: "Category 2" },
        variations: [{ price: "149.99", discount: null }]
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
