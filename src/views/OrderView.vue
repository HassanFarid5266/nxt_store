<template>
  <div>
    <!-- Page Header -->
    <section class="page-head boxed">
      <h1 class="page-title">Order #{{ order?.id || order?.name || 'Order Details' }}</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item">
          <router-link to="/orders" class="page-link" aria-label="Orders">Orders</router-link>
        </li>
        <li class="page-item active">{{ order?.id || order?.name || 'Loading...' }}</li>
      </ul>
    </section>

    <!-- Content -->
    <main class="boxed">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner">
          <i class="bx bx-loader-alt bx-spin"></i>
        </div>
        <p>Loading order details...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <div class="error-icon">
          <i class="bx bx-error-circle"></i>
        </div>
        <p>{{ error }}</p>
        <router-link to="/orders" class="btn btn-primary">Back to Orders</router-link>
      </div>

      <div v-else-if="order" class="layout-order">
        <!-- Order Tracking Section -->
        <OrderTracking
          :order="order"
          @cancel-order="handleCancelOrder"
          @contact-support="handleContactSupport"
        />

        <!-- Quick Actions -->
        <section class="quick-actions">
          <div class="action-buttons">
            <div class="btn-group">
              <button
                @click="downloadInvoice"
                :disabled="downloadingInvoice"
                class="btn btn-primary btn-pill"
              >
                <i class="bx bx-download"></i>
                {{ downloadingInvoice ? 'Generating...' : 'Download Invoice' }}
              </button>
              <button
                @click="printInvoice"
                class="btn btn-outline-primary btn-pill"
              >
                <i class="bx bx-printer"></i>
                Print Invoice
              </button>
              <button
                @click="downloadReceipt"
                class="btn btn-outline-secondary btn-pill"
              >
                <i class="bx bx-receipt"></i>
                Download Receipt
              </button>
            </div>
            <button
              v-if="canReorder"
              @click="reorderItems"
              :disabled="reordering"
              class="btn btn-outline-primary btn-pill"
            >
              <i class="bx bx-refresh"></i>
              {{ reordering ? 'Adding to Cart...' : 'Reorder' }}
            </button>
            <button
              v-if="canRate && !order.rated"
              @click="showRatingModal = true"
              class="btn btn-outline-secondary btn-pill"
            >
              <i class="bx bx-star"></i>
              Rate Order
            </button>
          </div>
        </section>
        <!-- Customer Information -->
        <section class="order-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="bx bx-user"></i>
              Customer Information
            </h3>
          </div>
          <div class="info-grid">
            <div class="info-card">
              <h4 class="info-title">Contact Details</h4>
              <div class="info-item">
                <span class="info-label">Full Name:</span>
                <span class="info-value">{{ order.customer_name || `${order.first_name} ${order.last_name}` }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ order.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Phone:</span>
                <span class="info-value">{{ order.phone }}</span>
              </div>
            </div>
            <div class="info-card">
              <h4 class="info-title">Billing Address</h4>
              <div class="address-block">
                <p>{{ order.customer_name || `${order.first_name} ${order.last_name}` }}</p>
                <p>{{ order.address_1 || order.shipping_address?.city }}</p>
                <p v-if="order.address_2">{{ order.address_2 }}</p>
                <p>{{ order.city || order.shipping_address?.city }}, {{ order.state }} {{ order.postal_code }}</p>
                <p>{{ order.country || order.shipping_address?.country }}</p>
              </div>
            </div>
            <div class="info-card">
              <h4 class="info-title">Payment Information</h4>
              <div class="info-item">
                <span class="info-label">Payment Method:</span>
                <span class="info-value">{{ formatPaymentMethod(order.payment_method) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Payment ID:</span>
                <span class="info-value">{{ order.payment_id || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Order Date:</span>
                <span class="info-value">{{ formatDate(order.created_at) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Ordered Products -->
        <section class="order-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="bx bx-package"></i>
              Ordered Items ({{ orderProducts.length }})
            </h3>
          </div>

          <div class="products-container">
            <article v-for="item in orderProducts" :key="item.id" class="product-item">
              <div class="product-image">
                <img :src="item.image" class="image" :alt="item.alt || item.product_title" />
              </div>
              <div class="product-details">
                <div class="product-category">{{ item.category_title || 'Product' }}</div>
                <h4 class="product-title">{{ item.product_title || item.title }}</h4>
                <div class="product-variation" v-if="item.variation">
                  Variation: {{ item.variation }}
                </div>
                <div class="product-quantity">Quantity: {{ item.quantity || 1 }}</div>
              </div>
              <div class="product-pricing">
                <div class="product-price">
                  <template v-if="item.discount">
                    <span class="discounted-price">${{ item.discount }}</span>
                    <span class="original-price">${{ item.price }}</span>
                  </template>
                  <template v-else>
                    ${{ item.price }}
                  </template>
                </div>
                <router-link :to="`/product/${item.product_name}`" class="view-product-btn">
                  <i class="bx bx-show"></i> View Product
                </router-link>
              </div>
            </article>
          </div>

          <!-- Order Financial Summary -->
          <div class="financial-summary">
            <div class="summary-card">
              <h4 class="summary-title">Order Summary</h4>
              <div class="summary-row">
                <span class="summary-label">Subtotal:</span>
                <span class="summary-value">${{ order.subtotal || order.sub_total }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Tax:</span>
                <span class="summary-value">${{ order.tax }}</span>
              </div>
              <div class="summary-row summary-total">
                <span class="summary-label">Total:</span>
                <span class="summary-value">${{ order.total }}</span>
              </div>
            </div>
          </div>
        </section>
        <!-- Rating Modal -->
        <div v-if="showRatingModal" class="modal-overlay" @click="showRatingModal = false">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>Rate Your Order</h3>
              <button @click="showRatingModal = false" class="close-btn">
                <i class="bx bx-x"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="rating-section">
                <p>How was your overall experience?</p>
                <div class="star-rating">
                  <button
                    v-for="star in 5"
                    :key="star"
                    @click="rating = star"
                    class="star-btn"
                    :class="{ 'active': star <= rating }"
                  >
                    <i class="bx bx-star"></i>
                  </button>
                </div>
              </div>
              <div class="review-section">
                <label for="review-text">Share your feedback (optional):</label>
                <textarea
                  id="review-text"
                  v-model="reviewText"
                  placeholder="Tell us about your experience..."
                  rows="4"
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button @click="showRatingModal = false" class="btn btn-secondary">Cancel</button>
              <button @click="submitRating" :disabled="!rating" class="btn btn-primary">Submit Rating</button>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orders'
import { useCartStore } from '@/stores/cart'
import { showMessage } from '@/utils/message'
import { InvoiceGenerator } from '@/utils/invoice'
import OrderTracking from '@/components/OrderTracking.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const cartStore = useCartStore()

const order = ref(null)
const orderProducts = ref([])
const loading = ref(true)
const error = ref(null)
const downloadingInvoice = ref(false)
const reordering = ref(false)
const showRatingModal = ref(false)
const rating = ref(0)
const reviewText = ref('')

const canReorder = computed(() => {
  return order.value && [orderStore.ORDER_STATUSES.DELIVERED, orderStore.ORDER_STATUSES.CANCELLED].includes(order.value.status)
})

const canRate = computed(() => {
  return order.value && order.value.status === orderStore.ORDER_STATUSES.DELIVERED
})

const loadOrder = async () => {
  try {
    const orderId = route.params.id
    if (!orderId) {
      error.value = 'Order ID is required'
      loading.value = false
      return
    }

    // Try to find order in store first
    const existingOrder = orderStore.orders.find(o => o.id === orderId)
    if (existingOrder) {
      order.value = existingOrder
      orderProducts.value = existingOrder.items || []
    } else {
      // Mock data - replace with actual API call
      await mockLoadOrder(orderId)
    }

    loading.value = false
  } catch (error) {
    console.error('Failed to load order:', error)
    error.value = 'Failed to load order details'
    loading.value = false
  }
}

const mockLoadOrder = async (orderId) => {
  // Enhanced mock data with more realistic structure
  order.value = {
    id: orderId,
    customer_name: 'John Doe',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    payment_method: 'card',
    payment_id: 'PAY_123456789',
    country: 'United States',
    state: 'California',
    city: 'San Francisco',
    address_1: '123 Main Street',
    address_2: 'Apt 4B',
    postal_code: '94102',
    status: orderStore.ORDER_STATUSES.SHIPPED,
    tracking_number: 'TRK' + Date.now(),
    tax: 8.50,
    subtotal: 91.50,
    sub_total: 91.50,
    total: 100.00,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date().toISOString(),
    rated: false
  }

  orderProducts.value = [
    {
      id: 1,
      product_name: 'sample-product',
      product_title: 'Premium Wireless Headphones',
      title: 'Premium Wireless Headphones',
      category_name: 'electronics',
      category_title: 'Electronics',
      image: 'https://via.placeholder.com/300x200/007bff/ffffff?text=Headphones',
      alt: 'Premium Wireless Headphones',
      variation: 'Black',
      quantity: 1,
      price: 91.50,
      discount: null
    }
  ]
}

const formatPaymentMethod = (method) => {
  const methods = {
    'card': 'Credit/Debit Card',
    'bank-account': 'Bank Transfer',
    'paypal': 'PayPal',
    'wire-transfer': 'Wire Transfer'
  }
  return methods[method] || method
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleCancelOrder = async () => {
  if (!confirm('Are you sure you want to cancel this order?')) {
    return
  }

  try {
    const success = orderStore.cancelOrder(order.value.id)
    if (success) {
      order.value.status = orderStore.ORDER_STATUSES.CANCELLED
      showMessage('Order cancelled successfully', 'success')
    }
  } catch (error) {
    showMessage('Error cancelling order: ' + error.message, 'error')
  }
}

const handleContactSupport = () => {
  showMessage('Support feature coming soon! Please email support@store.com', 'info')
}

const downloadInvoice = async () => {
  downloadingInvoice.value = true
  try {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    const result = await InvoiceGenerator.downloadInvoice(order.value, orderProducts.value)

    if (result.success) {
      showMessage(result.message, 'success')
    } else {
      showMessage(result.message, 'error')
    }
  } catch (error) {
    showMessage('Error downloading invoice', 'error')
  } finally {
    downloadingInvoice.value = false
  }
}

const printInvoice = async () => {
  try {
    const result = await InvoiceGenerator.printInvoice(order.value, orderProducts.value)

    if (result.success) {
      showMessage(result.message, 'success')
    } else {
      showMessage(result.message, 'error')
    }
  } catch (error) {
    showMessage('Error printing invoice', 'error')
  }
}

const downloadReceipt = async () => {
  try {
    const result = await InvoiceGenerator.downloadReceipt(order.value, orderProducts.value)

    if (result.success) {
      showMessage(result.message, 'success')
    } else {
      showMessage(result.message, 'error')
    }
  } catch (error) {
    showMessage('Error downloading receipt', 'error')
  }
}

const reorderItems = async () => {
  reordering.value = true
  try {
    // Add all items from this order to cart
    for (const item of orderProducts.value) {
      await cartStore.addToCart({
        id: item.product_name,
        name: item.product_name,
        title: item.product_title,
        price: item.price,
        image: item.image
      }, { name: item.variation, price: item.price }, item.quantity)
    }

    showMessage('Items added to cart successfully!', 'success')
    setTimeout(() => {
      router.push('/cart')
    }, 1000)
  } catch (error) {
    showMessage('Error adding items to cart', 'error')
  } finally {
    reordering.value = false
  }
}

const submitRating = async () => {
  try {
    // In a real app, you'd submit to API
    await new Promise(resolve => setTimeout(resolve, 1000))

    order.value.rated = true
    order.value.rating = rating.value
    order.value.review = reviewText.value

    showRatingModal.value = false
    rating.value = 0
    reviewText.value = ''

    showMessage('Thank you for your rating!', 'success')
  } catch (error) {
    showMessage('Error submitting rating', 'error')
  }
}

watch(() => route.params.id, () => {
  if (route.params.id) {
    loadOrder()
  }
})

onMounted(() => {
  orderStore.initializeStore()
  loadOrder()
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  font-size: 3rem;
  color: #007bff;
  margin-bottom: 1rem;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.layout-order {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.order-section {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.section-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: #343a40;
  font-size: 1.5rem;
  font-weight: 600;
}

.section-title i {
  font-size: 1.75rem;
  color: #007bff;
}

.quick-actions {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.info-title {
  margin: 0 0 1rem 0;
  color: #343a40;
  font-size: 1.1rem;
  font-weight: 600;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #6c757d;
}

.info-value {
  font-weight: 600;
  color: #343a40;
}

.address-block {
  line-height: 1.6;
}

.address-block p {
  margin: 0.25rem 0;
  color: #495057;
}

.products-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.product-image {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.product-image .image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.product-category {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.product-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
}

.product-variation,
.product-quantity {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.product-pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
}

.discounted-price {
  color: #28a745;
  margin-right: 0.5rem;
}

.original-price {
  color: #6c757d;
  text-decoration: line-through;
}

.view-product-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #007bff;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.view-product-btn:hover {
  background-color: #e7f3ff;
}

.financial-summary {
  display: flex;
  justify-content: flex-end;
}

.summary-card {
  background: #fff;
  border: 2px solid #007bff;
  border-radius: 8px;
  padding: 1.5rem;
  min-width: 300px;
}

.summary-title {
  margin: 0 0 1rem 0;
  color: #343a40;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-total {
  border-top: 2px solid #007bff;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.summary-label {
  color: #6c757d;
}

.summary-value {
  color: #343a40;
  font-weight: 600;
}

.summary-total .summary-value {
  color: #007bff;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.rating-section {
  margin-bottom: 1.5rem;
  text-align: center;
}

.star-rating {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 1rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.star-btn.active,
.star-btn:hover {
  color: #ffc107;
}

.review-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.review-section textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
}

@media (max-width: 768px) {
  .layout-order {
    padding: 1rem 0.5rem;
  }

  .order-section {
    padding: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .btn {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .product-item {
    flex-direction: column;
    text-align: center;
  }

  .product-pricing {
    align-items: center;
  }

  .financial-summary {
    justify-content: center;
  }

  .summary-card {
    min-width: auto;
    width: 100%;
  }
}
</style>
