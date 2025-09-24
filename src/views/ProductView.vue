<template>
  <main v-if="product" class="product-layout">
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
          <div class="product-actions">
            <div v-if="product.variations && product.variations.length" class="variation-selector">
              <label for="variation">Select Package:</label>
              <select v-model="selectedVariation" id="variation" class="form-field">
                <option v-for="variation in product.variations" :key="variation.name" :value="variation">
                  {{ variation.title }} - ${{ variation.price }}
                </option>
              </select>
            </div>

            <div class="action-buttons">
              <button
                @click="addToCart"
                :disabled="addingToCart || !selectedVariation"
                class="btn btn-primary add-to-cart-btn"
                style="margin-right: 10px; margin-bottom: 20px;"
              >
                <i v-if="addingToCart" class="bx bx-loader-alt bx-spin"></i>
                <i v-else class="bx bx-cart-add"></i>
                {{ addingToCart ? 'Adding...' : 'Add to Cart' }}
              </button>

              <a target="_blank" :href="`https://wa.me/+9203083077165?text=Hello NexTash,i am intrested in ${product.name}, can we talk?`" class="btn btn-outline-primary" style="margin-right: 10px; margin-bottom: 20px;">Book a Demo</a>

              <a v-if="product.video" data-fslightbox="gallery" :href="product.video" class="btn btn-error">Check Demo Video</a>
            </div>

            <div v-if="cartMessage" class="cart-message" :class="cartMessage.includes('success') ? 'success' : 'error'">
              {{ cartMessage }}
            </div>
          </div>
        </div> 
      </div>
    </section>

    <section class="product-body boxed">
      <div class="col-left">
        <h3 class="section-title">Product Gallery</h3>
        
        <div class="carousel gallery">
          <a v-for="(row, index) in product.images" :key="index" data-fslightbox="gallery" :href="row.image">
            <img 
              :src="row.image" 
              :alt="`Image ${row.idx}`" 
              class="gallery-image" 
              :style="`transform: rotate(${rotation[row.idx] || 0}deg) translate(${transform[row.idx] || 0}px);`"
              :class="{ 'z-index': index === currentImageIndex }"
            />
          </a>

          <button class="slide-prev btn btn-primary bx bx-left-arrow-alt" @click="movePrevious()"></button>
          <button class="slide-next btn btn-primary bx bx-right-arrow-alt" @click="moveNext()"></button>
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

        <div class="reviews" style="display: none;">
          <h3 class="section-title">What's our customers thinks about this product?</h3>
          <div class="section-meta" style="display: none;">
            <div class="select">
              <label for="reviews_sort">Sort</label>
              <select name="reviews_sort" id="reviews_sort" v-model="reviewsSort">
                <option value="desc">Recents</option>
                <option value="asc">Oldest</option>
              </select>
            </div>
          </div>
          <div id="all_reviews"></div>
          <div class="pagination">
            <button class="btn btn-sm btn-primary btn-pill" id="load_reviews" @click="loadReviews">Load more</button>
          </div>
          
          <form v-if="isLoggedIn" id="createReview" class="media media-image-rounded review-form" @submit.prevent="submitReview">
            <div class="media-image">
              <img v-if="user" :src="user.user_image" class="image" />
              <img v-else src="@/assets/images/review.webp" class="image" />
            </div>
            <div class="form-group media-body">
              <input type="hidden" name="product" id="product" :value="product.name">
              <input type="hidden" name="review_id" id="review_id">
              <textarea class="form-field" id="description" name="description" v-model="newReview"
                  placeholder="Write your comment..." rows="3"></textarea>
              <button class="btn btn-primary btn-pill" id="reviewBtn" type="submit">Add Review</button>
            </div>
          </form>
          
          <h3 v-else>Please login to comment!</h3>
        </div>
      </div>

      <div class="col-right">
        <div v-if="product.variations && product.variations.length" class="tabs">
          <div class="tab-items tab-pills">
            <button 
              v-for="(item, index) in product.variations" 
              :key="item.name"
              class="tab-item"
              :class="{ active: index === 0 }"
              data-nxt-toggle="tab"
              :data-nxt-target="`#tab${item.name}`"
            >
              {{ item.title }}
            </button>
          </div>
          
          <div 
            v-for="(item, index) in product.variations" 
            :key="item.name"
            class="tab-pane"
            :class="{ active: index === 0 }"
            :id="`tab${item.name}`"
          >
            <div class="card card-pricing" data-aos-duration="1000" data-aos="fade-up" data-aos-once="true" data-aos-easing="ease-in-out">
              <div class="card-head">
                <span class="card-badge">{{ item.title }}</span>
                <br />
                <h4 class="card-title">${{ item.price }}</h4>
                <p class="card-subtitle">{{ item.excerpt }}</p>
              </div>
              <div class="card-body" v-html="item.description"></div>
              <div class="card-foot">
                <button
                  @click="addToCartWithVariation(item)"
                  :disabled="addingToCart"
                  class="btn btn-primary btn-block btn-pill add-to-cart-btn"
                  style="margin-bottom: 10px;"
                >
                  <i v-if="addingToCart" class="bx bx-loader-alt bx-spin"></i>
                  <i v-else class="bx bx-cart-add"></i>
                  {{ addingToCart ? 'Adding...' : 'Add to Cart' }}
                </button>

                <a :href="`https://wa.me/+9203083077165?text=Hello NexTash,i want to purchase ${item.title} package of ${product.name}, can we talk?`" target="_blank" class="media-desc" style="text-decoration: none;">
                  <button class="btn btn-outline-primary btn-block btn-pill">
                    {{ item.link_title || "Contact for Demo" }}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No variations available for this product.</p>
        </div>

        <br><br>

        <div v-if="product.email || product.phone || product.demo">
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

        <br><br>

        <div>
          <h3 class="section-title">Related</h3>
          <template v-if="relateable && relateable.length">
            <article
              v-for="item in relateable"
              :key="item.name"
              v-show="item.name !== product.name"
              class="media media-product"
            >
              <router-link class="media-image" :to="`/product/${item.name}`">
                <img :src="item.image" class="image" :alt="item.alt" />
              </router-link>
              <div class="media-body">
                <span class="media-badge">{{ item.category }}</span>
                <h3 class="media-title text-ellipsis">
                  <router-link :to="`/product/${item.name}`">{{ item.title }}</router-link>
                </h3>
                <p class="media-desc">
                  <template v-if="item.variations && item.variations.length">
                    <template v-if="item.variations[0].discount">
                      {{ item.variations[0].discount }} <del>${{ item.variations[0].price }}</del>
                    </template>
                    <template v-else>
                      ${{ item.variations[0].price }}
                    </template>
                  </template>
                  <template v-else>
                    Custom price
                  </template>
                </p>
                <router-link :to="`/product/${item.name}`" class="btn btn-pill btn-sm btn-primary">
                  See details <i class="bx bx-right-arrow-alt icon-end"></i>
                </router-link>
              </div>
            </article>
          </template>
          <p v-else>No relevant Products</p>
        </div>
      </div>
    </section>
  </main>

  <!-- Loading state -->
  <main v-else-if="productsStore.loading" class="product-layout">
    <section class="page-head boxed">
      <div class="loading">Loading product...</div>
    </section>
  </main>

  <!-- Product not found -->
  <main v-else class="product-layout">
    <section class="page-head boxed">
      <h1 class="page-title">Product Not Found</h1>
      <p>The product you're looking for doesn't exist.</p>
      <router-link to="/shop" class="btn btn-primary">Back to Shop</router-link>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const authStore = useAuthStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const product = ref(null)
const relateable = ref([])

const reviewsSort = ref('desc')
const newReview = ref('')
const currentImageIndex = ref(0)
const selectedVariation = ref(null)
const addingToCart = ref(false)
const cartMessage = ref('')

const rotation = [0, 2, -5, 5, -2, 4, 3, -4, 0, 3]
const transform = [20, 0, -20, 13, 0, -16, 15, 18, 10, -7, 4, 8]

const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)

let autoSlideInterval = null
let stopAuto = false

const moveNext = () => {
  stopAuto = true
  moveToNext()
}

const moveToNext = () => {
  const numImages = product.value.images?.length || 0
  if (numImages > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % numImages
  }
}

const movePrevious = () => {
  stopAuto = true
  const numImages = product.value.images?.length || 0
  if (numImages > 0) {
    currentImageIndex.value = currentImageIndex.value === 0 ? numImages - 1 : currentImageIndex.value - 1
  }
}

const loadReviews = () => {
  // TODO: Implement review loading
  console.log('Loading reviews with sort:', reviewsSort.value)
}

const addToCart = async () => {
  if (!selectedVariation.value) {
    cartMessage.value = 'Please select a package'
    setTimeout(() => cartMessage.value = '', 3000)
    return
  }

  addingToCart.value = true
  cartMessage.value = ''

  try {
    const result = await cartStore.addToCart(product.value, selectedVariation.value, 1)

    if (result.success) {
      cartMessage.value = 'Product added to cart successfully!'
      // Open cart drawer to show added item
      cartStore.openCart()
    } else {
      cartMessage.value = result.message || 'Failed to add product to cart'
    }
  } catch (error) {
    cartMessage.value = 'Error adding product to cart'
    console.error('Add to cart error:', error)
  } finally {
    addingToCart.value = false
    setTimeout(() => cartMessage.value = '', 5000)
  }
}

const addToCartWithVariation = async (variation) => {
  addingToCart.value = true
  cartMessage.value = ''

  try {
    const result = await cartStore.addToCart(product.value, variation, 1)

    if (result.success) {
      cartMessage.value = 'Product added to cart successfully!'
      cartStore.openCart()
    } else {
      cartMessage.value = result.message || 'Failed to add product to cart'
    }
  } catch (error) {
    cartMessage.value = 'Error adding product to cart'
    console.error('Add to cart error:', error)
  } finally {
    addingToCart.value = false
    setTimeout(() => cartMessage.value = '', 5000)
  }
}

const submitReview = () => {
  if (!newReview.value.trim()) return

  // TODO: Implement review submission
  console.log('Submitting review:', newReview.value)
  newReview.value = ''
}

onMounted(async () => {
  // Load products from store
  await productsStore.loadProducts()

  // Get product by name from route
  const productName = route.params.id
  const foundProduct = productsStore.getProductByName(productName)

  if (foundProduct) {
    product.value = foundProduct

    // Set default selected variation
    if (foundProduct.variations && foundProduct.variations.length > 0) {
      selectedVariation.value = foundProduct.variations[0]
    }

    // Get related products
    relateable.value = productsStore.getRelatedProducts(foundProduct, 3)
  } else {
    console.error('Product not found:', productName)
    // Redirect to 404 or shop page
  }

  // Auto-slide gallery
  if (product.value?.images?.length > 1) {
    autoSlideInterval = setInterval(() => {
      if (stopAuto) {
        clearInterval(autoSlideInterval)
        return
      }
      moveToNext()
    }, 2000)
  }

  // Initialize lightbox if available
  try {
    if (window.fslightbox) {
      window.fslightbox.refreshFsLightbox()
    }
  } catch (err) {
    console.log('Lightbox not available')
  }
})
</script>