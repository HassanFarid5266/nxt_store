<template>
  <div class="ratings">
    <span v-if="showNumber" class="rating-number">{{ totalStars }}</span>
    &nbsp;
    <span class="bx bxs-star rating-icon active"></span>
  </div>
</template>

<script setup>
defineProps({
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
