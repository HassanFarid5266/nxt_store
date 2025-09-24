<template>
  <section v-if="slides && slides.length > 0" class="boxed welcome">
    <div class="swiper carousel" :id="sliderId">
      <div class="swiper-wrapper">
        <article v-for="(slide, index) in slides" :key="index" class="swiper-slide">
          <div class="card card-slide">
            <div class="card-image">
              <img :src="slide.image" class="image" :alt="slide.alt || slide.title" loading="lazy" />
            </div>
            <div class="card-body">
              <h3 class="card-title text-ellipsis text-ellipsis-2">
                <router-link :to="slideLink(slide)">{{ slide.title }}</router-link>
              </h3>
              <p class="card-subtitle">{{ slide.excerpt || slide.description }}</p>
              <router-link :to="slideLink(slide)" class="btn btn-primary" style="margin-top: 20px;">
                {{ slide.buttonText || 'See details' }}
                <i class="bx bx-right-arrow-alt icon-end"></i>
              </router-link>
            </div>
          </div>
        </article>
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
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue'
import { Swiper } from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'

const props = defineProps({
  slides: {
    type: Array,
    required: true
  },
  sliderId: {
    type: String,
    default: 'hero-slider'
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  spaceBetween: {
    type: Number,
    default: 20
  }
})

const swiper = ref(null)

const slideLink = (slide) => {
  return slide.link || `/product/${slide.name}/`
}

onMounted(async () => {
  await nextTick()

  const swiperConfig = {
    modules: [Navigation, Pagination],
    slidesPerView: 'auto',
    spaceBetween: props.spaceBetween,
    navigation: {
      nextEl: `#${props.sliderId} .slide-next`,
      prevEl: `#${props.sliderId} .slide-prev`,
    },
    pagination: {
      el: `#${props.sliderId} .swiper-pagination`,
      clickable: true,
    },
  }
  swiper.value = new Swiper(`#${props.sliderId}`, swiperConfig)
})
</script>
