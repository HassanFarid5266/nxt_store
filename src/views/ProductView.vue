<!-- Product Page View -->
<template>
  <div v-if="loading" class="loading">Loading product...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <main v-else class="product-layout">
    <!-- Page Head -->
    <section class="page-head">
      <div class="page-image">
        <img :src="product.featured_image" class="image" :alt="product.alt" />
      </div>
      <div class="boxed">
        <div class="product-details">
          <span class="page-badge" style="color: white;">{{ product.category }}</span>
          <h1 class="page-title">{{ product.title }}</h1>
          <p class="page-desc">{{ product.excerpt }}</p>
          <span>
            <a target="_blank" :href="`https://wa.me/+9203083077165?text=Hello NexTash,i am intrested in ${product.name}, can we talk?`" class="btn btn-primary" style="margin-right:10px; margin-bottom: 20px;">Book a Demo</a>
            
            <a v-if="product.video" data-fslightbox="gallery" :href="product.video" class="btn btn-error">Check Demo Video</a>
          </span>
        </div> 
      </div>
    </section>

    <!-- Product Body -->
    <section class="product-body boxed">
      <div class="col-left">
        <h3 class="section-title">Product Gallery</h3>
        
        <div class="carousel gallery">
          <a v-for="(image, index) in product.images" :key="index" data-fslightbox="gallery" :href="image.image">
            <img 
              :src="image.image" 
              :alt="`Image ${image.idx}`" 
              class="gallery-image" 
              :style="`transform: rotate(${rotation[image.idx] || 0}deg) translate(${transform[image.idx] || 0}px);`"
              :class="{ 'z-index': index === currentImageIndex }"
            />
          </a>

          <button class="slide-prev btn btn-primary bx bx-left-arrow-alt" @click="movePrevious"></button>
          <button class="slide-next btn btn-primary bx bx-right-arrow-alt" @click="moveNext"></button>
        </div>

        <div class="about">
          <h3 class="section-title">About</h3>
          <div class="content" v-html="product.description"></div>
        </div>

        <div class="ratings-section">
          <h3 class="section-title">Ratings</h3>
          <div class="media">
            <div class="media-body" style="width: 100%; margin: 0; text-align: left;">
              <div class="ratings">
                <span class="bx bxs-star active"></span>
                <span class="bx bxs-star active"></span>
                <span class="bx bxs-star active"></span>
                <span class="bx bxs-star active"></span>
                <span class="bx bxs-star active"></span>
              </div>
              <p class="media-desc">
                Based on ({{ product.rating_count || 1 }}) Sales
              </p>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div class="reviews" v-show="showReviews">
          <h3 class="section-title">What's our customers thinks about this product?</h3>
          <div class="section-meta" v-show="reviews.length > 0">
            <div class="select">
              <label for="reviews_sort">Sort</label>
              <select v-model="reviewsSort" @change="loadReviews">
                <option value="desc">Recents</option>
                <option value="asc">Oldest</option>
              </select>
            </div>
          </div>
          
          <div id="all_reviews">
            <div v-for="review in reviews" :key="review.name" class="review-item">
              {{ review.description }}
            </div>
          </div>
          
          <div v-if="hasMoreReviews" class="pagination">
            <button class="btn btn-sm btn-primary btn-pill" @click="loadMoreReviews">Load more</button>
          </div>
          
          <!-- Add Review Form -->
          <form v-if="isLoggedIn" @submit.prevent="submitReview" class="media media-image-rounded review-form">
            <div class="media-image">
              <img :src="user?.user_image || '/assets/nextash_store/images/review.webp'" class="image" />
            </div>
            <div class="form-group media-body">
              <textarea 
                class="form-field" 
                v-model="newReview"
                placeholder="Write your comment..." 
                rows="3"
              ></textarea>
              <button class="btn btn-primary btn-pill" type="submit">Add Review</button>
            </div>
          </form>
          
          <h3 v-else>Please login to comment!</h3>
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-right">
        <!-- Product Variations -->
        <div v-if="product.variations && product.variations.length" class="tabs">
          <div class="tab-items tab-pills">
            <button 
              v-for="(variation, index) in product.variations" 
              :key="variation.name"
              class="tab-item"
              :class="{ active: activeTab === index }"
              @click="activeTab = index"
            >
              {{ variation.title }}
            </button>
          </div>
          
          <div 
            v-for="(variation, index) in product.variations" 
            :key="variation.name"
            class="tab-pane"
            :class="{ active: activeTab === index }"
          >
            <div class="card card-pricing" data-aos-duration="1000" data-aos="fade-up" data-aos-once="true" data-aos-easing="ease-in-out">
              <div class="card-head">
                <span class="card-badge">{{ variation.title }}</span>
                <br />
                <h4 class="card-title">${{ variation.price }}</h4>
                <p class="card-subtitle">{{ variation.excerpt }}</p>
              </div>
              <div class="card-body" v-html="variation.description"></div>
              <div class="card-foot">
                <a 
                  :href="`https://wa.me/+9203083077165?text=Hello NexTash,i want to purchase ${variation.title} package of ${product.name}, can we talk?`" 
                  target="_blank" 
                  class="media-desc" 
                  style="text-decoration: none;"
                >
                  <button class="btn btn-primary btn-block btn-pill">
                    {{ variation.link_title || "Get Package" }}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No variations available for this product.</p>
        </div>

        <!-- Support Section -->
        <div v-if="product.email || product.phone || product.demo" style="margin-top: 2rem;">
          <h3 class="section-title">Support</h3>
          
          <div v-if="product.email" class="media">
            <i class="bx bx-envelope media-icon"></i>
            <div class="media-body">
              <h4 class="media-title">Email address</h4>
              <p class="media-desc">
                <a :href="`mailto:${product.email}`" style="text-decoration: underline;">{{ product.email }}</a>
              </p>
            </div>
          </div>
          
          <div v-if="product.phone" class="media">
            <i class="bx bx-phone media-icon"></i>
            <div class="media-body">
              <h4 class="media-title">Phone</h4>
              <p class="media-desc">
                <a :href="`tel:${product.phone}`" style="text-decoration: underline;">{{ product.phone }}</a>
              </p>
            </div>
          </div>
          
          <div v-if="product.phone" class="media">
            <i class="bx bxl-whatsapp media-icon"></i>
            <div class="media-body">
              <h4 class="media-title">Whatsapp</h4>
              <p class="media-desc">
                <a href="https://wa.me/+9203083077165?text=Hello NexTash" style="text-decoration: underline;">{{ product.phone }}</a>
              </p>
            </div>
          </div>
          
          <div v-if="product.demo" class="media">
            <i class="bx bx-globe media-icon"></i>
            <div class="media-body">
              <h4 class="media-title">Demo Link</h4>
              <p class="media-desc">
                <a :href="product.demo" style="text-decoration: underline;">{{ product.demo }}</a>
                <br>
                Demo User: {{ product.demo_user || "demo@nextash.com" }}
                <br>
                Demo Pass: {{ product.demo_password || "Demo@123" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div style="margin-top: 2rem;">
          <h3 class="section-title">Related</h3>
          <div v-if="relatedProducts.length">
            <article 
              v-for="item in relatedProducts" 
              :key="item.name"
              class="media media-product"
            >
              <router-link class="media-image" :to="`/product/${item.name}`">
                <img :src="item.image" class="image" :alt="item.alt" />
              </router-link>
              <div class="media-body">
                <router-link class="media-badge" :to="`/shop/${item.category.name}`">{{ item.category.title }}</router-link>
                <h3 class="media-title text-ellipsis">
                  <router-link :to="`/product/${item.name}`">{{ item.title }}</router-link>
                </h3>
                <p class="media-desc">
                  <span v-if="item.variations && item.variations.length">
                    <span v-if="item.variations[0].discount">
                      {{ item.variations[0].discount }} <del>${{ item.variations[0].price }}</del>
                    </span>
                    <span v-else>
                      ${{ item.variations[0].price }}
                    </span>
                  </span>
                  <span v-else>Custom price</span>
                </p>
                <router-link :to="`/product/${item.name}`" class="btn btn-pill btn-sm btn-primary">
                  See details <i class="bx bx-right-arrow-alt icon-end"></i>
                </router-link>
              </div>
            </article>
          </div>
          <p v-else>No relevant Products</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ApiUrl, apiRequest } from '@/utils/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const product = ref({})
const relatedProducts = ref([])
const reviews = ref([])
const loading = ref(true)
const error = ref('')

const activeTab = ref(0)
const currentImageIndex = ref(0)
const showReviews = ref(false)
const reviewsSort = ref('desc')
const hasMoreReviews = ref(false)
const newReview = ref('')

const rotation = [0, 2, -5, 5, -2, 4, 3, -4, 0, 3]
const transform = [20, 0, -20, 13, 0, -16, 15, 18, 10, -7, 4, 8]

const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)

const fetchProduct = async () => {
  try {
    const response = await apiRequest(ApiUrl(`nextash_store.events.products.get_product?name=${route.params.id}`))
    const data = response.message
    
    product.value = data.product
    relatedProducts.value = data.related || []
  } catch (err) {
    error.value = 'Failed to load product'
    console.error('Error fetching product:', err)
  } finally {
    loading.value = false
  }
}

const loadReviews = async () => {
  try {
    const response = await apiRequest(ApiUrl(`nextash_store.events.reviews.get_reviews?product=${route.params.id}&sort=${reviewsSort.value}`))
    reviews.value = response.message.reviews || []
    hasMoreReviews.value = response.message.has_more || false
  } catch (err) {
    console.error('Error loading reviews:', err)
  }
}

const loadMoreReviews = async () => {
  // Implementation for loading more reviews
}

const submitReview = async () => {
  if (!newReview.value.trim()) return
  
  try {
    await apiRequest(ApiUrl('nextash_store.events.reviews.create'), {
      method: 'POST',
      body: JSON.stringify({
        product: route.params.id,
        description: newReview.value
      })
    })
    
    newReview.value = ''
    await loadReviews()
  } catch (err) {
    console.error('Error submitting review:', err)
  }
}

const movePrevious = () => {
  if (product.value.images && product.value.images.length > 0) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? product.value.images.length - 1 
      : currentImageIndex.value - 1
  }
}

const moveNext = () => {
  if (product.value.images && product.value.images.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length
  }
}

onMounted(async () => {
  await fetchProduct()
  if (isLoggedIn.value) {
    await loadReviews()
  }
  
  // Initialize lightbox
  try {
    const { refreshFsLightbox } = await import('fslightbox')
    refreshFsLightbox()
  } catch (err) {
    console.log('Lightbox not available:', err)
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
  transform: translate(0) rotate(0) !important;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}
</style>
