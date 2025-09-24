<template>
  <section v-if="items && items.length > 0" class="boxed" :class="sectionClass">
    <span v-if="badge" class="section-badge">{{ badge }}</span>
    <h3 v-if="title" class="section-title">{{ title }}</h3>
    <div class="swiper carousel" :id="carouselId">
      <div class="swiper-wrapper">
        <div v-for="(item, index) in items" :key="index" class="swiper-slide">
          <slot :item="item" :index="index">
            <!-- Default slot content if needed -->
          </slot>
        </div>
      </div>
      <div v-if="showPagination" class="swiper-pagination"></div>
      <button v-if="showNavigation" class="slide-prev btn btn-primary" :class="navButtonClass">
        <i class="bx bx-left-arrow-alt"></i>
      </button>
      <button v-if="showNavigation" class="slide-next btn btn-primary" :class="navButtonClass">
        <i class="bx bx-right-arrow-alt"></i>
      </button>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Swiper } from 'swiper/bundle'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  carouselId: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  sectionClass: {
    type: String,
    default: ''
  },
  slidesPerView: {
    type: [Number, String],
    default: 1
  },
  spaceBetween: {
    type: Number,
    default: 20
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  showNavigation: {
    type: Boolean,
    default: true
  },
  navButtonClass: {
    type: String,
    default: ''
  },
  breakpoints: {
    type: Object,
    default: () => ({
      340: { slidesPerView: 1 },
      576: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
      1440: { slidesPerView: 4 }
    })
  },
  autoplay: {
    type: Boolean,
    default: false
  }
})

const swiper = ref(null)

onMounted(() => {
  const swiperConfig = {
    slidesPerView: props.slidesPerView,
    spaceBetween: props.spaceBetween,
    breakpoints: props.breakpoints,
  }

  if (props.showNavigation) {
    swiperConfig.navigation = {
      nextEl: `#${props.carouselId} .slide-next`,
      prevEl: `#${props.carouselId} .slide-prev`,
    }
  }

  if (props.showPagination) {
    swiperConfig.pagination = {
      el: `#${props.carouselId} .swiper-pagination`,
      clickable: true,
    }
  }

  if (props.autoplay) {
    swiperConfig.autoplay = {
      delay: 5000,
      disableOnInteraction: false,
    }
  }

  swiper.value = new Swiper(`#${props.carouselId}`, swiperConfig)
})
</script>
