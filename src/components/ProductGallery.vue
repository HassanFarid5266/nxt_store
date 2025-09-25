<template>
  <div class="product-gallery-section">
    <h3 class="section-title">Product Gallery</h3>

    <div class="carousel gallery" :class="{ 'has-images': images.length > 0 }" @mouseenter="stopAutoSlide"
      @mouseleave="startAutoSlide">
      <template v-if="images.length > 0">
        <a v-for="(image, index) in images" :key="index" class="gallery-item"
          :class="{ 'z-index': index === currentIndex }">
          <img :src="image.image || image" :alt="image.alt || `Gallery image ${index + 1}`" class="gallery-image"
            :style="getImageStyle(index)" loading="lazy" />
        </a>

        <!-- Navigation -->
        <button v-if="images.length > 1" class="slide-prev btn btn-primary bx bx-left-arrow-alt"
          @click="moveToPrevious"></button>
        <button v-if="images.length > 1" class="slide-next btn btn-primary bx bx-right-arrow-alt"
          @click="moveToNext"></button>
      </template>

      <div v-else class="no-images">
        <p>No gallery images available</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['image-change'])

const currentIndex = ref(0)
let autoSlideInterval = null
const isAutoSlideStopped = ref(false)

// Image style with rotation array for variety
const rotations = [-2, 3, -4, 6, -3, 5, -2, 4, -5, 2]
const getImageStyle = (index) => {
  const rotation = rotations[index % rotations.length] || 0
  return {
    transform: index === currentIndex.value
      ? `rotate(${rotation}deg) scale(1)`
      : `rotate(${rotation * 0.8}deg) scale(0.95)`,
    zIndex: index === currentIndex.value ? 2 : 1
  }
}

// Next / Previous
const moveToNext = () => {
  if (props.images.length > 0) {
    let oldIndex = currentIndex.value
    currentIndex.value++
    if (currentIndex.value >= props.images.length) currentIndex.value = 0
    emit('image-change', currentIndex.value)
    toggleZIndex(oldIndex, currentIndex.value)
  }
}

const moveToPrevious = () => {
  if (props.images.length > 0) {
    let oldIndex = currentIndex.value
    currentIndex.value--
    if (currentIndex.value < 0) currentIndex.value = props.images.length - 1
    emit('image-change', currentIndex.value)

    toggleZIndex(oldIndex, currentIndex.value)
  }
}

const toggleZIndex = (oldIndex, newIndex) => {
  const images = document.querySelectorAll('.gallery img')
  if (images[oldIndex]) images[oldIndex].classList.remove('z-index')
  if (images[newIndex]) images[newIndex].classList.add('z-index')
}

// Auto slide
const startAutoSlide = () => {
  if (props.images.length <= 1) return

  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
  }

  isAutoSlideStopped.value = false
  autoSlideInterval = setInterval(() => {
    if (isAutoSlideStopped.value) {
      clearInterval(autoSlideInterval)
      return
    }
    moveToNext()
  }, 1500)
}

const stopAutoSlide = () => {
  isAutoSlideStopped.value = true
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

// Lifecycle
onMounted(() => {
  startAutoSlide()
})
onUnmounted(() => {
  stopAutoSlide()
})
</script>


<style scoped>
.gallery {
  position: relative;
  height: 470px;
}

.gallery-image {
  width: 100%;
  border-radius: 10px;
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  box-shadow: 2px 2px 10px #6a0408;
  z-index: 0;
  transition: all 0.5s ease;
}

.z-index {
  z-index: 2 !important;
  scale: 1 !important;
}
</style>
