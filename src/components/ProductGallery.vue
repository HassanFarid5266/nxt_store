<template>
  <div class="product-gallery-section">
    <h3 class="section-title">Product Gallery</h3>

    <div class="carousel gallery" :class="{ 'has-images': images.length > 0 }" @mouseenter="stopAutoSlide"
      @mouseleave="startAutoSlide">
      <template v-if="images.length > 0">
        <a v-for="(image, index) in images" :key="index" data-fslightbox="gallery" :href="image.image || image"
          class="gallery-item" :class="{ 'active': index === currentIndex, 'z-index': index === currentIndex }"
          @click.prevent="openLightbox(index)">
          <img :src="image.image || image" :alt="image.alt || `Gallery image ${index + 1}`" class="gallery-image"
            :style="getImageStyle(index)" loading="lazy" />
        </a>

        <!-- Navigation buttons -->
        <button v-if="images.length > 1" class="slide-prev btn btn-primary bx bx-left-arrow-alt" @click="handlePrevious"
          :disabled="currentIndex === 0"></button>
        <button v-if="images.length > 1" class="slide-next btn btn-primary bx bx-right-arrow-alt" @click="handleNext"
          :disabled="currentIndex === images.length - 1"></button>

        <!-- Gallery indicators -->
        <div v-if="images.length > 1" class="gallery-indicators">
          <button v-for="(image, index) in images" :key="`indicator-${index}`" class="indicator"
            :class="{ 'active': index === currentIndex }" @click="currentIndex = index"></button>
        </div>
      </template>

      <div v-else class="no-images">
        <p>No gallery images available</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  galleryId: {
    type: String,
    default: 'gallery'
  },
  rotationAngles: {
    type: Array,
    default: () => [0, 2, -5, 5, -2, 4, 3, -4, 0, 3]
  },
  translateValues: {
    type: Array,
    default: () => [20, 0, -20, 13, 0, -16, 15, 18, 10, -7, 4, 8]
  }
})

const emit = defineEmits(['image-change'])

const currentIndex = ref(0)
let fsLightbox = null

const getImageStyle = (index) => {
  // Only apply rotation and translation to non-active images for subtle effect
  if (index === currentIndex.value) {
    return {
      transform: 'rotate(0deg) translate(0px)',
      zIndex: 2
    }
  }

  const rotation = props.rotationAngles[index % props.rotationAngles.length] || 0
  const translate = props.translateValues[index % props.translateValues.length] || 0

  return {
    transform: `rotate(${rotation * 0.5}deg) translate(${translate * 0.5}px)`,
    zIndex: index === currentIndex.value ? 2 : 1
  }
}

const movePrevious = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    emit('image-change', currentIndex.value)
  }
}

const moveNext = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
    emit('image-change', currentIndex.value)
  }
}

const handlePrevious = () => {
  movePrevious()
  // Reset auto-slide timer
  stopAutoSlide()
  setTimeout(() => {
    startAutoSlide()
  }, 1000)
}

const handleNext = () => {
  moveNext()
  // Reset auto-slide timer
  stopAutoSlide()
  setTimeout(() => {
    startAutoSlide()
  }, 1000)
}

// Auto-slide functionality
let autoSlideInterval = null

const startAutoSlide = () => {
  if (props.images.length <= 1) return

  autoSlideInterval = setInterval(() => {
    if (currentIndex.value < props.images.length - 1) {
      currentIndex.value++
    } else {
      currentIndex.value = 0
    }
    emit('image-change', currentIndex.value)
  }, 4000) // Change image every 4 seconds
}

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

const openLightbox = async (index) => {
  // Dynamically import fslightbox
  try {
    const { default: FsLightbox } = await import('/src/assets/libs/lightbox/fslightbox.js')

    // Initialize lightbox with all images
    const imageUrls = props.images.map(img => img.image || img)

    if (window.fsLightboxInstances) {
      window.fsLightboxInstances[props.galleryId] = new FsLightbox()
      window.fsLightboxInstances[props.galleryId].props.sources = imageUrls
      window.fsLightboxInstances[props.galleryId].props.slide = index + 1
      window.fsLightboxInstances[props.galleryId].open()
    } else {
      // Fallback: try to refresh existing lightbox
      if (window.refreshFsLightbox) {
        window.refreshFsLightbox()
      }
    }
  } catch (error) {
    console.warn('Could not load lightbox library:', error)
    // Fallback: open image in new tab
    const imageUrl = props.images[index]?.image || props.images[index]
    if (imageUrl) {
      window.open(imageUrl, '_blank')
    }
  }
}

// Initialize lightbox and auto-slide on mount
onMounted(async () => {
  if (props.images.length > 0) {
    try {
      // Check if fslightbox is already loaded
      if (!window.fsLightboxInstances) {
        window.fsLightboxInstances = {}
      }

      // Initialize for this gallery
      const imageUrls = props.images.map(img => img.image || img)

      // Set data attributes for fslightbox to work with existing implementation
      const galleryLinks = document.querySelectorAll(`[data-fslightbox="${props.galleryId}"]`)
      galleryLinks.forEach((link, index) => {
        link.href = imageUrls[index] || ''
      })

      // Refresh lightbox if the refresh function exists
      if (window.refreshFsLightbox) {
        setTimeout(() => {
          window.refreshFsLightbox()
        }, 100)
      }
    } catch (error) {
      console.warn('Error initializing lightbox:', error)
    }

    // Start auto-slide after a delay
    setTimeout(() => {
      startAutoSlide()
    }, 2000)
  }
})

onUnmounted(() => {
  // Clean up auto-slide
  stopAutoSlide()

  // Clean up lightbox instance
  if (window.fsLightboxInstances && window.fsLightboxInstances[props.galleryId]) {
    delete window.fsLightboxInstances[props.galleryId]
  }
})
</script>

<style scoped>
.gallery {
  position: relative;
  height: 470px;
}

.gallery-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  position: absolute;
  top: 50px;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 2px 2px 10px #6a0408;
  z-index: 0;
}

.z-index {
  z-index: 1;
  transform: translate(0) rotate(0);
}
</style>