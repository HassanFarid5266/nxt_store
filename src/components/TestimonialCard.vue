<template>
  <article class="card card-review">
    <div class="card-head">
      <div class="ratings">
        <span v-for="n in 5" :key="n" class="bx bxs-star rating-icon active"></span>
      </div>
    </div>
    <div class="card-body">
      <p class="card-subtitle">
        <q>{{ testimonial.feedback }}</q>
      </p>
    </div>
    <div class="card-foot">
      <div class="media">
        <div class="media-image">
          <img :src="testimonial.feedback_image" :alt="testimonial.full_name" class="image" />
        </div>
        <div class="media-body">
          <h3 class="media-title">{{ testimonial.full_name }}</h3>
          <p class="media-desc">{{ testimonial.designation }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  testimonial: {
    type: Object,
    required: true
  }
})
</script>
