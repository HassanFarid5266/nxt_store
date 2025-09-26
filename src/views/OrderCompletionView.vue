<template>
  <div class="order-completion">
    <!-- Success Animation -->
    <OrderSuccessAnimation 
      :title="successTitle"
      :subtitle="successSubtitle"
      :order-details="orderSummary"
    />

    <!-- Order Details Section -->
    <section class="order-details-section boxed">
      <div class="card">
        <div class="card-head">
          <h3 class="card-title">
            <i class="bx bx-receipt"></i>
            Order Details
          </h3>
          <span class="status-badge" :class="statusClass">
            {{ statusLabel }}
          </span>
        </div>
        <div class="card-body">
          <div class="details-grid">
            <div class="detail-group">
              <h4 class="group-title">
                <i class="bx bx-info-circle"></i>
                Order Information
              </h4>
              <div class="detail-item">
                <span class="detail-label">Order ID:</span>
                <span class="detail-value">#{{ order?.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date:</span>
                <span class="detail-value">{{ formatDate(order?.created_at) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value">${{ order?.total }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">{{ formatPaymentMethod(order?.payment_method) }}</span>
              </div>
            </div>

            <div class="detail-group">
              <h4 class="group-title">
                <i class="bx bx-user"></i>
                Customer Information
              </h4>
              <div class="detail-item">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{{ order?.customer_name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ order?.email }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">{{ order?.phone }}</span>
              </div>
            </div>

            <div class="detail-group">
              <h4 class="group-title">
                <i class="bx bx-truck"></i>
                Delivery Information
              </h4>
              <div class="detail-item">
                <span class="detail-label">Estimated Delivery:</span>
                <span class="detail-value">{{ estimatedDeliveryText }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Shipping Address:</span>
                <span class="detail-value">{{ shippingAddressText }}</span>
              </div>
              <div v-if="order?.tracking_number" class="detail-item">
                <span class="detail-label">Tracking Number:</span>
                <span class="detail-value">{{ order.tracking_number }}</span>
              </div>
            </div>
          </div>

          <!-- Email Notifications Status -->
          <div class="email-notifications">
            <h4 class="notifications-title">
              <i class="bx bx-envelope"></i>
              Email Notifications
            </h4>
            <div class="notification-status">
              <div v-for="notification in emailNotifications" :key="notification.type" 
                   class="notification-item" :class="{ 'sent': notification.sent }">
                <div class="notification-icon">
                  <i class="bx bx-check" v-if="notification.sent"></i>
                  <i class="bx bx-time" v-else></i>
                </div>
                <div class="notification-content">
                  <span class="notification-title">{{ notification.title }}</span>
                  <span class="notification-status">{{ notification.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions-section boxed">
      <div class="card">
        <div class="card-head">
          <h3 class="card-title">
            <i class="bx bx-zap"></i>
            Quick Actions
          </h3>
        </div>
        <div class="card-body">
          <div class="actions-grid">
            <button @click="downloadInvoice" :disabled="downloadingInvoice" class="action-card">
              <div class="action-icon">
                <i class="bx bx-download"></i>
              </div>
              <div class="action-content">
                <h4 class="action-title">{{ downloadingInvoice ? 'Generating...' : 'Download Invoice' }}</h4>
                <p class="action-description">Get a PDF copy of your invoice</p>
              </div>
            </button>

            <button @click="trackOrder" class="action-card">
              <div class="action-icon">
                <i class="bx bx-map"></i>
              </div>
              <div class="action-content">
                <h4 class="action-title">Track Order</h4>
                <p class="action-description">Monitor your order progress</p>
              </div>
            </button>

            <button @click="contactSupport" class="action-card">
              <div class="action-icon">
                <i class="bx bx-support"></i>
              </div>
              <div class="action-content">
                <h4 class="action-title">Contact Support</h4>
                <p class="action-description">Get help with your order</p>
              </div>
            </button>

            <button @click="shareOrder" class="action-card">
              <div class="action-icon">
                <i class="bx bx-share"></i>
              </div>
              <div class="action-content">
                <h4 class="action-title">Share Order</h4>
                <p class="action-description">Share your purchase experience</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Navigation Actions -->
    <section class="navigation-section boxed">
      <div class="navigation-actions">
        <router-link to="/orders" class="btn btn-primary btn-lg btn-pill">
          <i class="bx bx-list-ul"></i>
          View All Orders
        </router-link>
        <router-link v-if="order?.id" :to="`/order/${order.id}`" class="btn btn-outline-primary btn-lg btn-pill">
          <i class="bx bx-show"></i>
          Order Details
        </router-link>
        <router-link to="/shop" class="btn btn-secondary btn-lg btn-pill">
          <i class="bx bx-shopping-bag"></i>
          Continue Shopping
        </router-link>
      </div>
    </section>

    <!-- Product Recommendations -->
    <section class="recommendations-section boxed">
      <PostPurchaseRecommendations 
        :purchased-items="order?.items || []"
        :customer-data="customerData"
      />
    </section>

    <!-- Order Timeline Preview -->
    <section v-if="order" class="timeline-preview-section boxed">
      <div class="card">
        <div class="card-head">
          <h3 class="card-title">
            <i class="bx bx-time"></i>
            What's Next?
          </h3>
        </div>
        <div class="card-body">
          <div class="timeline-preview">
            <div v-for="step in nextSteps" :key="step.id" 
                 class="timeline-step" :class="{ 'active': step.active }">
              <div class="step-indicator">
                <i :class="step.icon"></i>
              </div>
              <div class="step-content">
                <h4 class="step-title">{{ step.title }}</h4>
                <p class="step-description">{{ step.description }}</p>
                <span v-if="step.timeframe" class="step-timeframe">{{ step.timeframe }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orders'
import { InvoiceGenerator } from '@/utils/invoice'
import { showMessage } from '@/utils/message'
import { emailNotificationService } from '@/utils/emailNotifications'
import OrderSuccessAnimation from '@/components/OrderSuccessAnimation.vue'
import PostPurchaseRecommendations from '@/components/PostPurchaseRecommendations.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = ref(null)
const downloadingInvoice = ref(false)
const emailNotifications = ref([])

const successTitle = computed(() => {
  if (!order.value) return 'Order Received!'
  return order.value.status === 'pending' ? 'Order Received!' : 'Order Confirmed!'
})

const successSubtitle = computed(() => {
  if (!order.value) return 'Thank you for your purchase!'
  return order.value.status === 'pending' 
    ? 'We\'ve received your order and will process it once payment is confirmed.'
    : 'Your payment has been processed and your order is confirmed!'
})

const orderSummary = computed(() => {
  if (!order.value) return null
  return {
    id: order.value.id,
    total: order.value.total.toFixed(2),
    paymentMethod: formatPaymentMethod(order.value.payment_method)
  }
})

const statusClass = computed(() => {
  if (!order.value) return 'status-pending'
  return `status-${orderStore.getStatusColor(order.value.status)}`
})

const statusLabel = computed(() => {
  if (!order.value) return 'Processing'
  return orderStore.getStatusLabel(order.value.status)
})

const estimatedDeliveryText = computed(() => {
  if (!order.value) return 'Calculating...'
  
  const deliveryDate = new Date()
  const days = order.value.payment_method === 'bank-account' ? 5 : 3
  deliveryDate.setDate(deliveryDate.getDate() + days)
  
  return deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const shippingAddressText = computed(() => {
  if (!order.value) return 'Address on file'
  return `${order.value.city || 'City'}, ${order.value.country || 'Country'}`
})

const customerData = computed(() => {
  if (!order.value) return {}
  return {
    name: order.value.customer_name,
    email: order.value.email,
    phone: order.value.phone
  }
})

const nextSteps = computed(() => {
  if (!order.value) return []
  
  const steps = [
    {
      id: 1,
      title: 'Order Confirmation',
      description: 'You\'ll receive an email confirmation shortly',
      icon: 'bx bx-envelope',
      timeframe: 'Within 5 minutes',
      active: true
    },
    {
      id: 2,
      title: order.value.status === 'pending' ? 'Payment Processing' : 'Order Processing',
      description: order.value.status === 'pending' 
        ? 'Complete your bank transfer to confirm the order'
        : 'We\'ll start preparing your items for shipment',
      icon: order.value.status === 'pending' ? 'bx bx-credit-card' : 'bx bx-package',
      timeframe: order.value.status === 'pending' ? 'Within 24 hours' : '1-2 business days',
      active: false
    },
    {
      id: 3,
      title: 'Shipping Notification',
      description: 'You\'ll get tracking details when your order ships',
      icon: 'bx bx-truck',
      timeframe: '2-3 business days',
      active: false
    },
    {
      id: 4,
      title: 'Delivery',
      description: 'Your order will be delivered to your specified address',
      icon: 'bx bx-home',
      timeframe: estimatedDeliveryText.value,
      active: false
    }
  ]
  
  return steps
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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

const loadOrderDetails = async () => {
  try {
    const orderId = route.query.order_id || route.query.orderId || route.params.id
    
    if (orderId) {
      // Try to get order from store
      const existingOrder = orderStore.orders.find(o => o.id === orderId)
      if (existingOrder) {
        order.value = existingOrder
      } else {
        // Create order from query params if not found
        order.value = {
          id: orderId,
          customer_name: route.query.customer_name || 'Customer',
          email: route.query.email || 'customer@example.com',
          phone: route.query.phone || '+1234567890',
          total: parseFloat(route.query.total || '99.99'),
          payment_method: route.query.payment_method || 'card',
          status: route.query.status || 'confirmed',
          created_at: new Date().toISOString(),
          city: route.query.city || 'City',
          country: route.query.country || 'Country',
          items: []
        }
      }

      // Initialize email notifications tracking
      initializeEmailNotifications()

      // Send confirmation email
      await sendOrderEmails()
    }
  } catch (error) {
    console.error('Failed to load order details:', error)
    showMessage('Error loading order details', 'error')
  }
}

const initializeEmailNotifications = () => {
  emailNotifications.value = [
    {
      type: 'confirmation',
      title: 'Order Confirmation',
      status: 'Sending...',
      sent: false
    },
    {
      type: 'payment',
      title: 'Payment Confirmation',
      status: order.value?.status === 'pending' ? 'Pending payment' : 'Sending...',
      sent: false
    }
  ]
}

const sendOrderEmails = async () => {
  if (!order.value) return

  try {
    // Send order confirmation email
    setTimeout(async () => {
      await emailNotificationService.sendOrderConfirmation(order.value, order.value.email)
      updateEmailNotificationStatus('confirmation', 'Sent successfully', true)
    }, 2000)

    // Send payment confirmation if order is confirmed
    if (order.value.status === 'confirmed') {
      setTimeout(async () => {
        await emailNotificationService.sendPaymentConfirmation(order.value, order.value.email)
        updateEmailNotificationStatus('payment', 'Sent successfully', true)
      }, 4000)
    }
  } catch (error) {
    console.error('Error sending emails:', error)
  }
}

const updateEmailNotificationStatus = (type, status, sent) => {
  const notification = emailNotifications.value.find(n => n.type === type)
  if (notification) {
    notification.status = status
    notification.sent = sent
  }
}

const downloadInvoice = async () => {
  if (!order.value) {
    showMessage('Order details not available', 'error')
    return
  }

  downloadingInvoice.value = true
  try {
    const result = await InvoiceGenerator.downloadInvoice(order.value, order.value.items || [])
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
  if (order.value?.id) {
    router.push(`/order/${order.value.id}`)
  }
}

const contactSupport = () => {
  showMessage('Redirecting to support chat...', 'info')
  setTimeout(() => {
    router.push('/contact')
  }, 1000)
}

const shareOrder = async () => {
  if (navigator.share && order.value) {
    try {
      await navigator.share({
        title: `Order #${order.value.id}`,
        text: `I just placed an order! Order #${order.value.id}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Error sharing:', error)
      // Fallback to copy link
      await navigator.clipboard.writeText(window.location.href)
      showMessage('Order link copied to clipboard!', 'success')
    }
  } else {
    // Fallback for browsers without share API
    try {
      await navigator.clipboard.writeText(window.location.href)
      showMessage('Order link copied to clipboard!', 'success')
    } catch (error) {
      showMessage('Sharing not supported', 'info')
    }
  }
}

onMounted(async () => {
  orderStore.initializeStore()
  await loadOrderDetails()
})
</script>

<style scoped>
.order-completion {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.order-details-section,
.quick-actions-section,
.navigation-section,
.recommendations-section,
.timeline-preview-section {
  margin-bottom: 2rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-group {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
}

.group-title i {
  color: #007bff;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #6c757d;
  font-weight: 500;
}

.detail-value {
  color: #343a40;
  font-weight: 600;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.status-confirmed {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.email-notifications {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.notifications-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
}

.notifications-title i {
  color: #007bff;
}

.notification-status {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.notification-item.sent {
  background: #f8fff9;
  border-color: #d4edda;
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  color: #6c757d;
  transition: all 0.3s ease;
}

.notification-item.sent .notification-icon {
  background: #28a745;
  color: white;
}

.notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.notification-title {
  font-weight: 600;
  color: #343a40;
}

.notification-status {
  font-size: 0.875rem;
  color: #6c757d;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.action-card:hover {
  background: #e7f3ff;
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,123,255,0.15);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
}

.action-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #343a40;
}

.action-description {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
}

.navigation-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.timeline-preview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.timeline-step.active {
  opacity: 1;
}

.step-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.timeline-step.active .step-indicator {
  background: #007bff;
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

.step-timeframe {
  font-size: 0.875rem;
  color: #007bff;
  font-weight: 500;
}

@media (max-width: 768px) {
  .order-completion {
    padding: 1rem 0;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .navigation-actions {
    flex-direction: column;
  }

  .navigation-actions .btn {
    width: 100%;
  }

  .timeline-step {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>
