<template>
  <div class="post-purchase-recommendations">
    <div class="recommendations-header">
      <h3 class="recommendations-title">
        <i class="bx bx-gift"></i>
        You Might Also Like
      </h3>
      <p class="recommendations-subtitle">
        Based on your recent purchase, here are some items other customers also bought
      </p>
    </div>

    <div class="recommendations-grid">
      <div v-for="product in recommendations" :key="product.id" class="recommendation-card">
        <div class="card-image">
          <img :src="product.image" :alt="product.title" class="image">
          <div v-if="product.discount" class="discount-badge">
            -{{ product.discount }}%
          </div>
          <div class="quick-actions">
            <button @click="viewProduct(product)" class="action-btn view-btn">
              <i class="bx bx-show"></i>
            </button>
            <button @click="addToWishlist(product)" class="action-btn wishlist-btn" :class="{ 'active': product.inWishlist }">
              <i class="bx bx-heart" :class="{ 'bxs-heart': product.inWishlist }"></i>
            </button>
          </div>
        </div>
        
        <div class="card-content">
          <div class="product-category">{{ product.category }}</div>
          <h4 class="product-title">{{ product.title }}</h4>
          <div class="product-rating">
            <div class="stars">
              <i v-for="star in 5" :key="star" 
                 class="bx" 
                 :class="star <= product.rating ? 'bx-star bxs-star' : 'bx-star'"
                 :style="{ color: star <= product.rating ? '#ffc107' : '#e9ecef' }">
              </i>
            </div>
            <span class="rating-count">({{ product.reviewCount }})</span>
          </div>
          
          <div class="product-pricing">
            <div class="price-container">
              <span v-if="product.originalPrice" class="original-price">${{ product.originalPrice }}</span>
              <span class="current-price">${{ product.price }}</span>
            </div>
            <div class="savings" v-if="product.originalPrice">
              Save ${{ (product.originalPrice - product.price).toFixed(2) }}
            </div>
          </div>

          <div class="product-features">
            <span v-for="feature in product.keyFeatures?.slice(0, 2)" :key="feature" class="feature-tag">
              {{ feature }}
            </span>
          </div>
        </div>

        <div class="card-actions">
          <button @click="addToCart(product)" 
                  :disabled="isAddingToCart(product.id)"
                  class="btn btn-primary btn-sm btn-pill add-to-cart-btn">
            <i class="bx bx-cart-add"></i>
            {{ isAddingToCart(product.id) ? 'Adding...' : 'Add to Cart' }}
          </button>
          <div class="shipping-info">
            <i class="bx bx-truck"></i>
            <span>{{ product.shippingInfo || 'Free shipping' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="recommendations-footer">
      <router-link to="/shop" class="btn btn-outline-primary btn-lg btn-pill">
        <i class="bx bx-shopping-bag"></i>
        Browse All Products
      </router-link>
      <button @click="refreshRecommendations" class="btn btn-secondary btn-lg btn-pill">
        <i class="bx bx-refresh"></i>
        Show Different Items
      </button>
    </div>

    <!-- Special Offers Section -->
    <div class="special-offers">
      <div class="offer-banner">
        <div class="offer-content">
          <div class="offer-icon">
            <i class="bx bx-gift"></i>
          </div>
          <div class="offer-text">
            <h4 class="offer-title">First-time Customer Discount</h4>
            <p class="offer-description">Get 15% off your next order with code WELCOME15</p>
          </div>
          <button @click="copyDiscountCode" class="offer-button">
            <i class="bx bx-copy"></i>
            {{ codeCopied ? 'Copied!' : 'Copy Code' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { showMessage } from '@/utils/message'

const props = defineProps({
  purchasedItems: {
    type: Array,
    default: () => []
  },
  customerData: {
    type: Object,
    default: () => ({})
  }
})

const router = useRouter()
const cartStore = useCartStore()

const recommendations = ref([])
const addingToCart = ref({})
const codeCopied = ref(false)

const isAddingToCart = (productId) => {
  return !!addingToCart.value[productId]
}

const generateRecommendations = () => {
  // Mock recommendations based on purchase history
  const mockRecommendations = [
    {
      id: 'rec-1',
      title: 'Premium Wireless Mouse',
      category: 'Electronics',
      price: 49.99,
      originalPrice: 69.99,
      discount: 28,
      rating: 4.5,
      reviewCount: 1247,
      image: 'https://via.placeholder.com/300x200/007bff/ffffff?text=Mouse',
      keyFeatures: ['Wireless', 'Ergonomic'],
      shippingInfo: 'Free 2-day shipping',
      inWishlist: false
    },
    {
      id: 'rec-2',
      title: 'USB-C Charging Cable',
      category: 'Accessories',
      price: 19.99,
      rating: 4.8,
      reviewCount: 892,
      image: 'https://via.placeholder.com/300x200/28a745/ffffff?text=Cable',
      keyFeatures: ['Fast Charging', 'Durable'],
      shippingInfo: 'Free shipping',
      inWishlist: false
    },
    {
      id: 'rec-3',
      title: 'Bluetooth Speaker',
      category: 'Audio',
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      rating: 4.6,
      reviewCount: 356,
      image: 'https://via.placeholder.com/300x200/dc3545/ffffff?text=Speaker',
      keyFeatures: ['Waterproof', '12hr Battery'],
      shippingInfo: 'Free shipping',
      inWishlist: true
    },
    {
      id: 'rec-4',
      title: 'Phone Stand Holder',
      category: 'Accessories',
      price: 24.99,
      rating: 4.3,
      reviewCount: 567,
      image: 'https://via.placeholder.com/300x200/ffc107/ffffff?text=Stand',
      keyFeatures: ['Adjustable', 'Foldable'],
      shippingInfo: 'Free shipping',
      inWishlist: false
    }
  ]

  recommendations.value = mockRecommendations
}

const viewProduct = (product) => {
  router.push(`/product/${product.id}`)
}

const addToCart = async (product) => {
  addingToCart.value[product.id] = true
  
  try {
    const result = await cartStore.addToCart({
      id: product.id,
      name: product.id,
      title: product.title,
      price: product.price,
      image: product.image
    })

    if (result.success) {
      showMessage(`${product.title} added to cart!`, 'success')
    } else {
      showMessage('Failed to add item to cart', 'error')
    }
  } catch (error) {
    showMessage('Error adding item to cart', 'error')
  } finally {
    addingToCart.value[product.id] = false
  }
}

const addToWishlist = (product) => {
  product.inWishlist = !product.inWishlist
  const action = product.inWishlist ? 'added to' : 'removed from'
  showMessage(`${product.title} ${action} wishlist`, 'success')
}

const refreshRecommendations = () => {
  showMessage('Loading new recommendations...', 'info')
  setTimeout(() => {
    generateRecommendations()
    showMessage('New recommendations loaded!', 'success')
  }, 1000)
}

const copyDiscountCode = async () => {
  try {
    await navigator.clipboard.writeText('WELCOME15')
    codeCopied.value = true
    showMessage('Discount code copied to clipboard!', 'success')
    setTimeout(() => {
      codeCopied.value = false
    }, 3000)
  } catch (error) {
    showMessage('Failed to copy code', 'error')
  }
}

onMounted(() => {
  generateRecommendations()
})
</script>

<style scoped>
.post-purchase-recommendations {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.recommendations-header {
  text-align: center;
  margin-bottom: 2rem;
}

.recommendations-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #343a40;
}

.recommendations-title i {
  color: #007bff;
  font-size: 1.75rem;
}

.recommendations-subtitle {
  margin: 0;
  color: #6c757d;
  font-size: 1rem;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.recommendation-card {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e9ecef;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image .image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recommendation-card:hover .image {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: #dc3545;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.quick-actions {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recommendation-card:hover .quick-actions {
  opacity: 1;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #343a40;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: white;
  transform: scale(1.1);
}

.wishlist-btn.active {
  background: #dc3545;
  color: white;
}

.card-content {
  padding: 1.25rem;
}

.product-category {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.product-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
  line-height: 1.4;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.rating-count {
  color: #6c757d;
  font-size: 0.875rem;
}

.product-pricing {
  margin-bottom: 1rem;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.original-price {
  color: #6c757d;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.current-price {
  color: #343a40;
  font-size: 1.25rem;
  font-weight: 700;
}

.savings {
  color: #28a745;
  font-size: 0.875rem;
  font-weight: 500;
}

.product-features {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.feature-tag {
  background: #e7f3ff;
  color: #007bff;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-actions {
  padding: 0 1.25rem 1.25rem;
}

.add-to-cart-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.shipping-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #28a745;
  font-size: 0.875rem;
  font-weight: 500;
}

.recommendations-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.special-offers {
  border-top: 1px solid #e9ecef;
  padding-top: 2rem;
}

.offer-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
}

.offer-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.offer-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.offer-text {
  flex: 1;
}

.offer-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.offer-description {
  margin: 0;
  opacity: 0.9;
}

.offer-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.offer-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .post-purchase-recommendations {
    padding: 1rem;
    margin: 1rem 0;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .recommendations-footer {
    flex-direction: column;
  }

  .recommendations-footer .btn {
    width: 100%;
  }

  .offer-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .offer-button {
    align-self: stretch;
    justify-content: center;
  }
}
</style>
