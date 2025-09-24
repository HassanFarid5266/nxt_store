<template>
  <section v-if="slides && slides.length > 0" class="boxed welcome">
    <div class="swiper carousel" :id="sliderId">
      <div class="swiper-wrapper">
        <article 
          v-for="(slide, index) in slides" 
          :key="index" 
          class="swiper-slide"
        >
          <div class="card card-slide">
            <div class="card-image">
              <img 
                :src="slide.image" 
                class="image" 
                :alt="slide.alt || slide.title" 
                loading="lazy" 
              />
            </div>
            <div class="card-body">
              <h3 class="card-title text-ellipsis text-ellipsis-2">
                <router-link :to="slideLink(slide)">{{ slide.title }}</router-link>
              </h3>
              <p class="card-subtitle">{{ slide.excerpt || slide.description }}</p>
              <router-link 
                :to="slideLink(slide)" 
                class="btn btn-primary" 
                style="margin-top: 20px;"
              >
                {{ slide.buttonText || 'See details' }}
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
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Swiper } from 'swiper'

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

onMounted(() => {
  const swiperConfig = {
    slidesPerView: 'auto',
    spaceBetween: props.spaceBetween,
    navigation: {
      nextEl: '.slide-next',
      prevEl: '.slide-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  }

  if (props.autoplay) {
    swiperConfig.autoplay = {
      delay: 5000,
      disableOnInteraction: false,
    }
  }

  swiper.value = new Swiper(`#${props.sliderId}`, swiperConfig)
})
</script>
