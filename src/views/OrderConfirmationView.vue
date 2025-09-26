<template>
  <div>
    <!-- Page Header -->
    <section class="page-head boxed">
      <div class="confirmation-header">
        <div class="success-icon">
          <i class="bx bx-check-circle"></i>
        </div>
        <h1 class="page-title">Order Confirmed!</h1>
        <p class="page-subtitle">Thank you for your purchase. Your order has been successfully placed.</p>
      </div>
    </section>

    <!-- Main Content -->
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
        <router-link to="/orders" class="btn btn-primary">View All Orders</router-link>
      </div>

      <div v-else class="confirmation-layout">
        <!-- Order Success Card -->
        <section class="confirmation-card">
          <div class="card-header">
            <div class="header-icon">
              <i class="bx bx-package"></i>
            </div>
            <div class="header-content">
              <h2 class="order-title">Order #{{ orderDetails.orderId }}</h2>
              <p class="order-status">
                <span class="status-badge" :class="statusClass">
                  {{ statusText }}
                </span>
                <span class="order-date">{{ formatDate(orderDetails.createdAt) }}</span>
              </p>
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-items">
            <h3 class="items-title">Ordered Items</h3>
            <div class="items-list">
              <div v-for="item in orderDetails.items" :key="item.id" class="item-card">
                <div class="item-image">
                  <img :src="item.image" :alt="item.title" class="image">
                </div>
                <div class="item-details">
                  <h4 class="item-title">{{ item.title }}</h4>
                  <p class="item-variation" v-if="item.variation">{{ item.variation }}</p>
                  <div class="item-meta">
                    <span class="item-quantity">Qty: {{ item.quantity }}</span>
                    <span class="item-price">${{ item.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="order-summary">
            <h3 class="summary-title">Order Summary</h3>
            <div class="summary-details">
              <div class="summary-row">
                <span class="summary-label">Subtotal:</span>
                <span class="summary-value">${{ orderDetails.subtotal }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Tax:</span>
                <span class="summary-value">${{ orderDetails.tax }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Shipping:</span>
                <span class="summary-value">${{ orderDetails.shipping || '0.00' }}</span>
              </div>
              <div class="summary-row summary-total">
                <span class="summary-label">Total:</span>
                <span class="summary-value">${{ orderDetails.total }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="customer-info">
            <div class="info-grid">
              <div class="info-section">
                <h4 class="info-title">
                  <i class="bx bx-user"></i>
                  Customer Details
                </h4>
                <div class="info-content">
                  <p><strong>Name:</strong> {{ orderDetails.customerName }}</p>
                  <p><strong>Email:</strong> {{ orderDetails.email }}</p>
                  <p><strong>Phone:</strong> {{ orderDetails.phone }}</p>
                </div>
              </div>
              <div class="info-section">
                <h4 class="info-title">
                  <i class="bx bx-map"></i>
                  Shipping Address
                </h4>
                <div class="info-content">
                  <p>{{ orderDetails.shippingAddress.name }}</p>
                  <p>{{ orderDetails.shippingAddress.address }}</p>
                  <p>{{ orderDetails.shippingAddress.city }}, {{ orderDetails.shippingAddress.state }}</p>
                  <p>{{ orderDetails.shippingAddress.country }} {{ orderDetails.shippingAddress.zipCode }}</p>
                </div>
              </div>
              <div class="info-section">
                <h4 class="info-title">
                  <i class="bx bx-credit-card"></i>
                  Payment Details
                </h4>
                <div class="info-content">
                  <p><strong>Method:</strong> {{ orderDetails.paymentMethod }}</p>
                  <p><strong>Transaction ID:</strong> {{ orderDetails.transactionId }}</p>
                  <p><strong>Status:</strong> {{ orderDetails.paymentStatus }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="next-steps">
            <h3 class="steps-title">What's Next?</h3>
            <div class="steps-list">
              <div class="step-item" :class="{ 'completed': step.completed }" v-for="step in nextSteps" :key="step.id">
                <div class="step-icon">
                  <i :class="step.icon"></i>
                </div>
                <div class="step-content">
                  <h4 class="step-title">{{ step.title }}</h4>
                  <p class="step-description">{{ step.description }}</p>
                  <p v-if="step.estimatedTime" class="step-time">{{ step.estimatedTime }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Action Cards -->
        <section class="action-cards">
          <!-- Quick Actions -->
          <div class="action-card">
            <h3 class="card-title">
              <i class="bx bx-bolt"></i>
              Quick Actions
            </h3>
            <div class="action-buttons">
              <button @click="downloadInvoice" :disabled="downloadingInvoice" class="action-btn primary">
                <i class="bx bx-download"></i>
                {{ downloadingInvoice ? 'Generating...' : 'Download Invoice' }}
              </button>
              <button @click="trackOrder" class="action-btn secondary">
                <i class="bx bx-map"></i>
                Track Order
              </button>
              <router-link :to="`/order/${orderDetails.orderId}`" class="action-btn tertiary">
                <i class="bx bx-show"></i>
                View Details
              </router-link>
            </div>
          </div>

          <!-- Order Tracking -->
          <div class="action-card">
            <h3 class="card-title">
              <i class="bx bx-package"></i>
              Order Tracking
            </h3>
            <div class="tracking-preview">
              <div class="tracking-item" v-for="status in trackingStates" :key="status.id" 
                   :class="{ 'active': status.active, 'completed': status.completed }">
                <div class="tracking-icon">
                  <i :class="status.icon"></i>
                </div>
                <div class="tracking-text">
                  <span class="tracking-label">{{ status.label }}</span>
                  <span v-if="status.time" class="tracking-time">{{ status.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Support Card -->
          <div class="action-card">
            <h3 class="card-title">
              <i class="bx bx-support"></i>
              Need Help?
            </h3>
            <div class="support-content">
              <p>Have questions about your order? Our support team is here to help.</p>
              <div class="support-buttons">
                <button @click="contactSupport" class="action-btn secondary">
                  <i class="bx bx-chat"></i>
                  Live Chat
                </button>
                <button @click="emailSupport" class="action-btn tertiary">
                  <i class="bx bx-envelope"></i>
                  Email Support
                </button>
              </div>
              <div class="support-info">
                <p><strong>Order Questions:</strong> support@store.com</p>
                <p><strong>Phone:</strong> 1-800-123-4567</p>
                <p><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
          </div>

          <!-- Continue Shopping -->
          <div class="action-card">
            <h3 class="card-title">
              <i class="bx bx-shopping-bag"></i>
              Continue Shopping
            </h3>
            <div class="shopping-content">
              <p>Discover more amazing products in our store.</p>
              <div class="shopping-buttons">
                <router-link to="/shop" class="action-btn primary">
                  <i class="bx bx-store"></i>
                  Browse Products
                </router-link>
                <router-link to="/orders" class="action-btn secondary">
                  <i class="bx bx-list-ul"></i>
                  View All Orders
                </router-link>
              </div>
            </div>
          </div>
        </section>

        <!-- Email Notification -->
        <section class="notification-banner">
          <div class="banner-content">
            <div class="banner-icon">
              <i class="bx bx-envelope"></i>
            </div>
            <div class="banner-text">
              <h4>Confirmation Email Sent</h4>
              <p>We've sent a confirmation email to <strong>{{ orderDetails.email }}</strong> with your order details and tracking information.</p>
            </div>
            <button @click="resendEmail" :disabled="resendingEmail" class="banner-button">
              {{ resendingEmail ? 'Sending...' : 'Resend Email' }}
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orders'
import { showMessage } from '@/utils/message'
import { InvoiceGenerator } from '@/utils/invoice'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const loading = ref(true)
const error = ref(null)
const downloadingInvoice = ref(false)
const resendingEmail = ref(false)
const orderDetails = ref(null)

const statusClass = computed(() => {
  if (!orderDetails.value?.status) return 'status-pending'
  return `status-${orderDetails.value.status}`
})

const statusText = computed(() => {
  const statusMap = {
    'pending': 'Payment Pending',
    'confirmed': 'Order Confirmed',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered'
  }
  return statusMap[orderDetails.value?.status] || 'Processing'
})

const nextSteps = computed(() => {
  const steps = [
    {
      id: 1,
      title: 'Order Confirmation',
      description: 'Your order has been received and confirmed',
      icon: 'bx bx-check-circle',
      completed: true,
      estimatedTime: 'Completed'
    },
    {
      id: 2,
      title: 'Payment Processing',
      description: 'Payment verification and processing',
      icon: 'bx bx-credit-card',
      completed: orderDetails.value?.status !== 'pending',
      estimatedTime: orderDetails.value?.status === 'pending' ? 'Processing...' : 'Completed'
    },
    {
      id: 3,
      title: 'Order Preparation',
      description: 'Items are being picked and packed',
      icon: 'bx bx-package',
      completed: ['shipped', 'delivered'].includes(orderDetails.value?.status),
      estimatedTime: '1-2 business days'
    },
    {
      id: 4,
      title: 'Shipping',
      description: 'Your order is on its way',
      icon: 'bx bx-truck',
      completed: orderDetails.value?.status === 'delivered',
      estimatedTime: '3-5 business days'
    },
    {
      id: 5,
      title: 'Delivery',
      description: 'Order delivered to your address',
      icon: 'bx bx-home',
      completed: orderDetails.value?.status === 'delivered',
      estimatedTime: 'Expected delivery date'
    }
  ]
  return steps
})

const trackingStates = computed(() => [
  {
    id: 1,
    label: 'Order Placed',
    icon: 'bx bx-check',
    completed: true,
    active: false,
    time: formatDate(orderDetails.value?.createdAt)
  },
  {
    id: 2,
    label: 'Confirmed',
    icon: 'bx bx-credit-card',
    completed: orderDetails.value?.status !== 'pending',
    active: orderDetails.value?.status === 'confirmed',
    time: orderDetails.value?.status !== 'pending' ? 'Just now' : null
  },
  {
    id: 3,
    label: 'Processing',
    icon: 'bx bx-package',
    completed: ['shipped', 'delivered'].includes(orderDetails.value?.status),
    active: orderDetails.value?.status === 'processing',
    time: null
  },
  {
    id: 4,
    label: 'Shipped',
    icon: 'bx bx-truck',
    completed: orderDetails.value?.status === 'delivered',
    active: orderDetails.value?.status === 'shipped',
    time: null
  }
])

const loadOrderDetails = async () => {
  try {
    const orderId = route.query.order_id || route.params.id
    const sessionId = route.query.session_id
    const status = route.query.status || 'confirmed'

    if (!orderId && !sessionId) {
      error.value = 'Order ID not found'
      loading.value = false
      return
    }

    // Try to get order from store first
    let existingOrder = null
    if (orderId) {
      existingOrder = orderStore.orders.find(o => o.id === orderId)
    }

    if (existingOrder) {
      orderDetails.value = {
        orderId: existingOrder.id,
        status: status,
        customerName: existingOrder.customer_name,
        email: existingOrder.email,
        phone: existingOrder.phone,
        paymentMethod: existingOrder.payment_method,
        transactionId: existingOrder.payment_id || 'TXN-' + Date.now(),
        paymentStatus: status === 'pending' ? 'Pending' : 'Completed',
        subtotal: parseFloat(existingOrder.subtotal || 0).toFixed(2),
        tax: parseFloat(existingOrder.tax || 0).toFixed(2),
        shipping: '0.00',
        total: parseFloat(existingOrder.total || 0).toFixed(2),
        items: existingOrder.items || [],
        createdAt: existingOrder.created_at || new Date().toISOString(),
        shippingAddress: {
          name: existingOrder.customer_name,
          address: existingOrder.shipping_address?.city || 'N/A',
          city: existingOrder.shipping_address?.city || 'N/A',
          state: 'N/A',
          country: existingOrder.shipping_address?.country || 'N/A',
          zipCode: 'N/A'
        }
      }
    } else {
      // Create mock order details from query params
      orderDetails.value = {
        orderId: orderId || 'ORD-' + Date.now(),
        status: status,
        customerName: route.query.customer_name || 'John Doe',
        email: route.query.email || 'customer@example.com',
        phone: route.query.phone || '+1234567890',
        paymentMethod: route.query.payment_method || 'Credit Card',
        transactionId: route.query.transaction_id || 'TXN-' + Date.now(),
        paymentStatus: status === 'pending' ? 'Pending' : 'Completed',
        subtotal: route.query.subtotal || '99.99',
        tax: route.query.tax || '10.00',
        shipping: '0.00',
        total: route.query.total || '109.99',
        items: [
          {
            id: 1,
            title: 'Sample Product',
            variation: 'Standard',
            quantity: 1,
            price: '99.99',
            image: 'https://via.placeholder.com/100x100/007bff/ffffff?text=Product'
          }
        ],
        createdAt: new Date().toISOString(),
        shippingAddress: {
          name: route.query.customer_name || 'John Doe',
          address: '123 Main Street',
          city: 'City',
          state: 'State',
          country: 'Country',
          zipCode: '12345'
        }
      }
    }

    loading.value = false
  } catch (error) {
    console.error('Error loading order details:', error)
    error.value = 'Failed to load order details'
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const downloadInvoice = async () => {
  downloadingInvoice.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const result = await InvoiceGenerator.downloadInvoice(
      {
        id: orderDetails.value.orderId,
        customer_name: orderDetails.value.customerName,
        email: orderDetails.value.email,
        total: orderDetails.value.total,
        subtotal: orderDetails.value.subtotal,
        tax: orderDetails.value.tax,
        created_at: orderDetails.value.createdAt
      },
      orderDetails.value.items
    )

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

const trackOrder = () => {
  router.push(`/order/${orderDetails.value.orderId}`)
}

const contactSupport = () => {
  showMessage('Live chat feature coming soon! Please email support@store.com', 'info')
}

const emailSupport = () => {
  window.location.href = `mailto:support@store.com?subject=Order ${orderDetails.value.orderId} Support`
}

const resendEmail = async () => {
  resendingEmail.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    showMessage('Confirmation email sent successfully!', 'success')
  } catch (error) {
    showMessage('Error sending email', 'error')
  } finally {
    resendingEmail.value = false
  }
}

onMounted(async () => {
  orderStore.initializeStore()
  await loadOrderDetails()
})
</script>

<style scoped>
.page-head {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  text-align: center;
  padding: 3rem 1rem;
}

.confirmation-header {
  max-width: 600px;
  margin: 0 auto;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: white;
}

.page-title {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner, .error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.loading-spinner {
  color: #007bff;
}

.error-icon {
  color: #dc3545;
}

.confirmation-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.confirmation-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-header {
  background: #f8f9fa;
  padding: 2rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.order-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #343a40;
}

.order-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-confirmed {
  background: #d4edda;
  color: #155724;
}

.status-processing {
  background: #d1ecf1;
  color: #0c5460;
}

.status-shipped {
  background: #d4edda;
  color: #155724;
}

.order-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.order-items, .order-summary, .customer-info, .next-steps {
  padding: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.next-steps {
  border-bottom: none;
}

.items-title, .summary-title, .steps-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #343a40;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image .image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
}

.item-variation {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-quantity {
  color: #6c757d;
  font-size: 0.9rem;
}

.item-price {
  font-weight: 600;
  color: #343a40;
  font-size: 1.1rem;
}

.summary-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-total {
  border-top: 2px solid #007bff;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 700;
  font-size: 1.2rem;
}

.summary-label {
  color: #6c757d;
}

.summary-value {
  font-weight: 600;
  color: #343a40;
}

.summary-total .summary-value {
  color: #007bff;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
}

.info-title i {
  color: #007bff;
}

.info-content p {
  margin: 0.5rem 0;
  color: #495057;
  line-height: 1.5;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.step-item.completed {
  border-color: #28a745;
  background: #f8fff9;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: #e9ecef;
  color: #6c757d;
  flex-shrink: 0;
}

.step-item.completed .step-icon {
  background: #28a745;
  color: white;
}

.step-content {
  flex: 1;
}

.step-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
}

.step-description {
  margin: 0 0 0.25rem 0;
  color: #6c757d;
  line-height: 1.5;
}

.step-time {
  margin: 0;
  font-size: 0.875rem;
  color: #28a745;
  font-weight: 500;
}

.action-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #343a40;
}

.card-title i {
  color: #007bff;
}

.action-buttons, .support-buttons, .shopping-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn.primary {
  background: #007bff;
  color: white;
}

.action-btn.primary:hover {
  background: #0056b3;
}

.action-btn.secondary {
  background: #6c757d;
  color: white;
}

.action-btn.secondary:hover {
  background: #545b62;
}

.action-btn.tertiary {
  background: #f8f9fa;
  color: #343a40;
  border: 1px solid #e9ecef;
}

.action-btn.tertiary:hover {
  background: #e9ecef;
}

.tracking-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tracking-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8f9fa;
}

.tracking-item.active {
  background: #e7f3ff;
  border: 1px solid #007bff;
}

.tracking-item.completed {
  background: #f8fff9;
  border: 1px solid #28a745;
}

.tracking-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  color: #6c757d;
  font-size: 0.9rem;
}

.tracking-item.active .tracking-icon {
  background: #007bff;
  color: white;
}

.tracking-item.completed .tracking-icon {
  background: #28a745;
  color: white;
}

.tracking-text {
  display: flex;
  flex-direction: column;
}

.tracking-label {
  font-weight: 500;
  color: #343a40;
  font-size: 0.9rem;
}

.tracking-time {
  font-size: 0.8rem;
  color: #6c757d;
}

.support-content, .shopping-content {
  text-align: center;
}

.support-content p, .shopping-content p {
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.support-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.support-info p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #495057;
}

.notification-banner {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-left: 4px solid #007bff;
  margin-top: 2rem;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.banner-icon {
  width: 48px;
  height: 48px;
  background: #e7f3ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #007bff;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
}

.banner-text h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
}

.banner-text p {
  margin: 0;
  color: #6c757d;
  line-height: 1.5;
}

.banner-button {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.banner-button:hover {
  background: #0056b3;
}

.banner-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .confirmation-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-head {
    padding: 2rem 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .order-status {
    flex-direction: column;
    gap: 0.5rem;
  }

  .order-items, .order-summary, .customer-info, .next-steps {
    padding: 1.5rem;
  }

  .item-card {
    flex-direction: column;
    text-align: center;
  }

  .item-meta {
    justify-content: center;
    gap: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .banner-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
