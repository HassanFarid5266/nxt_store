<!-- Product Gallery Component -->
<template>
  <div class="product-gallery-section">
    <h3 class="section-title">Product Gallery</h3>

    <div class="carousel gallery" :class="{ 'has-images': images.length > 0 }">
      <template v-if="images.length > 0">
        <a v-for="(image, index) in images" :key="index" :data-fslightbox="galleryId" :href="image.image || image"
          class="gallery-item" @click.prevent="openLightbox(index)">
          <img :src="image.image || image" :alt="image.alt || `Gallery image ${index + 1}`" class="gallery-image"
            :class="{ 'z-index': index === currentIndex }" :style="getImageStyle(index)" loading="lazy" />
        </a>

        <button v-if="images.length > 1" class="slide-prev btn btn-primary bx bx-left-arrow-alt" @click="movePrevious"
          :disabled="currentIndex === 0"></button>
        <button v-if="images.length > 1" class="slide-next btn btn-primary bx bx-right-arrow-alt" @click="moveNext"
          :disabled="currentIndex === images.length - 1"></button>
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
  const rotation = props.rotationAngles[index % props.rotationAngles.length] || 0
  const translate = props.translateValues[index % props.translateValues.length] || 0

  return {
    transform: `rotate(${rotation}deg) translate(${translate}px)`,
    zIndex: index === currentIndex.value ? 1 : 0
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

// Initialize lightbox on mount
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
  }
})

onUnmounted(() => {
  // Clean up lightbox instance
  if (window.fsLightboxInstances && window.fsLightboxInstances[props.galleryId]) {
    delete window.fsLightboxInstances[props.galleryId]
  }
})
</script>

<!-- <style scoped>
.gallery {
  position: relative;
  height: 470px;
  margin-bottom: 2rem;
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
  transition: transform 0.3s ease, z-index 0.3s ease;
  cursor: pointer;
}

.gallery-image:hover {
  transform: scale(1.02) !important;
}

.z-index {
  z-index: 1 !important;
}

.slide-prev,
.slide-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.slide-prev {
  left: 10px;
}

.slide-next {
  right: 10px;
}

.slide-prev:disabled,
.slide-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-images {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
  background: #f5f5f5;
  border-radius: 10px;
}

.gallery-item {
  display: block;
  text-decoration: none;
}
</style> -->
