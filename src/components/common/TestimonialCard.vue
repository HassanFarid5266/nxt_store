<template>
  <article class="card card-review">
    <div class="card-head">
      <RatingStars :rating="testimonial.rating || 5" />
    </div>
    <div class="card-body">
      <p class="card-subtitle">
        <q>{{ testimonial.feedback }}</q>
      </p>
    </div>
    <div class="card-foot">
      <div class="media">
        <div class="media-image">
          <img 
            :src="testimonial.feedback_image || testimonial.image" 
            :alt="testimonial.full_name || testimonial.name" 
            class="image" 
            loading="lazy"
          />
        </div>
        <div class="media-body">
          <h3 class="media-title">
            {{ testimonial.full_name || testimonial.name }}
          </h3>
          <p class="media-desc">
            {{ testimonial.designation || testimonial.position }}
          </p>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import RatingStars from './RatingStars.vue'

defineProps({
  testimonial: {
    type: Object,
    required: true
  }
})
</script>
