<template>
  <div class="ratings">
    <span 
      v-for="star in totalStars" 
      :key="star"
      class="bx bxs-star rating-icon"
      :class="{ active: star <= rating }"
    ></span>
    <span v-if="showNumber" class="rating-number">{{ rating }}/{{ totalStars }}</span>
  </div>
</template>

<script setup>
defineProps({
  rating: {
    type: Number,
    default: 5,
    validator: (value) => value >= 0 && value <= 5
  },
  totalStars: {
    type: Number,
    default: 5
  },
  showNumber: {
    type: Boolean,
    default: false
  }
})
</script>
