<template>
  <div class="order-completion">
    <br>
    <br>
    <br>
    <!-- <br> -->
    <br>
    <!-- Hero Success Section -->
    <section class="success-hero boxed">
      <div class="success-container">
        <div class="success-icon">
          <i class="bx bx-check-circle"></i>
        </div>
        <h1 class="success-title">{{ successTitle }}</h1>
        <p class="success-subtitle">{{ successSubtitle }}</p>
        <div v-if="order" class="order-badge">
          <span class="order-label">Order</span>
          <span class="order-id">#{{ order.id }}</span>
        </div>
      </div>
    </section>

    <!-- Order Details Section -->
    <section class="order-details-section boxed">
      <div class="details-card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="bx bx-receipt"></i>
            Order Details
          </h3>
          <span class="status-badge" :class="statusClass">
            <i class="bx bx-shield-check" v-if="order?.status === 'confirmed'"></i>
            <i class="bx bx-time-five" v-else></i>
            {{ statusLabel }}
          </span>
        </div>

        <div class="details-content">
          <div class="details-grid">
            <!-- Order Information -->
            <div class="detail-section">
              <h4 class="section-title">
                <i class="bx bx-info-circle"></i>
                Order Information
              </h4>
              <div class="detail-list">
                <div class="detail-row">
                  <span class="detail-label">Order ID</span>
                  <span class="detail-value">#{{ order?.id }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date & Time</span>
                  <span class="detail-value">{{ formatDate(order?.created_at) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Amount</span>
                  <span class="detail-value amount">${{ order?.total }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Method</span>
                  <span class="detail-value">{{ formatPaymentMethod(order?.payment_method) }}</span>
                </div>
              </div>
            </div>

            <!-- Customer Information -->
            <div class="detail-section">
              <h4 class="section-title">
                <i class="bx bx-user"></i>
                Customer Information
              </h4>
              <div class="detail-list">
                <div class="detail-row">
                  <span class="detail-label">Full Name</span>
                  <span class="detail-value">{{ order?.customer_name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email Address</span>
                  <span class="detail-value">{{ order?.email }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone Number</span>
                  <span class="detail-value">{{ order?.phone }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location</span>
                  <span class="detail-value">{{ shippingAddressText }}</span>
                </div>
              </div>
            </div>

            <!-- Delivery Information -->
            <div class="detail-section">
              <h4 class="section-title">
                <i class="bx bx-truck"></i>
                Delivery Information
              </h4>
              <div class="detail-list">
                <div class="detail-row">
                  <span class="detail-label">Estimated Delivery</span>
                  <span class="detail-value delivery-date">{{ estimatedDeliveryText }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Shipping Method</span>
                  <span class="detail-value">Standard Delivery</span>
                </div>
                <div v-if="order?.tracking_number" class="detail-row">
                  <span class="detail-label">Tracking Number</span>
                  <span class="detail-value tracking">{{ order.tracking_number }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Delivery Status</span>
                  <span class="detail-value">
                    <span class="delivery-status preparing">Preparing</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Email Notifications Status -->
          <div class="notifications-section">
            <h4 class="section-title">
              <i class="bx bx-envelope"></i>
              Email Notifications
            </h4>
            <div class="notification-list">
              <div v-for="notification in emailNotifications" :key="notification.type" class="notification-item"
                :class="{ 'sent': notification.sent, 'sending': !notification.sent }">
                <div class="notification-icon">
                  <i class="bx bx-check" v-if="notification.sent"></i>
                  <i class="bx bx-loader-alt bx-spin" v-else></i>
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
    <section class="actions-section boxed">
      <div class="actions-card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="bx bx-zap"></i>
            Quick Actions
          </h3>
        </div>
        <div class="actions-grid">
          <button @click="downloadInvoice" :disabled="downloadingInvoice" class="action-btn primary">
            <div class="action-icon">
              <i class="bx bx-download" v-if="!downloadingInvoice"></i>
              <i class="bx bx-loader-alt bx-spin" v-else></i>
            </div>
            <div class="action-content">
              <h4 class="action-title">{{ downloadingInvoice ? 'Generating...' : 'Download Invoice' }}</h4>
              <p class="action-desc">Get PDF copy of your invoice</p>
            </div>
          </button>

          <button @click="trackOrder" class="action-btn secondary">
            <div class="action-icon">
              <i class="bx bx-map"></i>
            </div>
            <div class="action-content">
              <h4 class="action-title">Track Order</h4>
              <p class="action-desc">Monitor your order progress</p>
            </div>
          </button>

          <a href="https://nextash.com/contact-us" target="_blank" class="action-btn support">
            <div class="action-icon">
              <i class="bx bx-support"></i>
            </div>
            <div class="action-content">
              <h4 class="action-title">Contact Support</h4>
              <p class="action-desc">Get help with your order</p>
            </div>
          </a>

          <button @click="shareOrder" class="action-btn share">
            <div class="action-icon">
              <i class="bx bx-share"></i>
            </div>
            <div class="action-content">
              <h4 class="action-title">Share Order</h4>
              <p class="action-desc">Share your experience</p>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Order Timeline -->
    <section v-if="order" class="timeline-section boxed">
      <div class="timeline-card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="bx bx-time"></i>
            What's Next?
          </h3>
        </div>
        <div class="timeline-content">
          <div class="timeline-track">
            <div v-for="(step, index) in nextSteps" :key="step.id" class="timeline-step"
              :class="{ 'active': step.active, 'completed': index === 0 }">
              <div class="step-indicator">
                <i :class="step.icon"></i>
              </div>
              <div class="step-content">
                <h4 class="step-title">{{ step.title }}</h4>
                <p class="step-description">{{ step.description }}</p>
                <span v-if="step.timeframe" class="step-timeframe">{{ step.timeframe }}</span>
              </div>
              <div v-if="index < nextSteps.length - 1" class="step-connector"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Navigation Actions -->
    <section class="navigation-section boxed">
      <div class="nav-actions">
        <router-link to="/orders" class="nav-btn primary">
          <i class="bx bx-list-ul"></i>
          <span>View All Orders</span>
        </router-link>
        <router-link v-if="order?.id" :to="`/product/${product.id}`" class="nav-btn secondary">
          <i class="bx bx-show"></i>
          <span>Product Details</span>
        </router-link>
        <router-link to="/shop" class="nav-btn outline">
          <i class="bx bx-shopping-bag"></i>
          <span>Continue Shopping</span>
        </router-link>
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
  return `status-${order.value.status}`
})

const statusLabel = computed(() => {
  if (!order.value) return 'Processing'
  return order.value.status === 'confirmed' ? 'Confirmed' : 'Pending'
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
      const existingOrder = orderStore.orders.find(o => o.id === orderId)
      if (existingOrder) {
        order.value = existingOrder
      } else {
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

      initializeEmailNotifications()
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
    setTimeout(async () => {
      await emailNotificationService.sendOrderConfirmation(order.value, order.value.email)
      updateEmailNotificationStatus('confirmation', 'Sent successfully', true)
    }, 2000)

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
      await navigator.clipboard.writeText(window.location.href)
      showMessage('Order link copied to clipboard!', 'success')
    }
  } else {
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
  background: var(--body);
  color: var(--text);
  padding: 2rem 0 4rem;
}

/* Success Hero Section */
.success-hero {
  margin-bottom: 3rem;
}

.success-container {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.success-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.success-icon i {
  font-size: 3rem;
  color: #fff;
}

.success-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.success-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 2rem 0;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.order-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.order-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.order-id {
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
}

/* Cards */
.details-card,
.actions-card,
.timeline-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;
}

.card-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.02);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
}

.card-title i {
  color: var(--primary);
  font-size: 1.4rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-confirmed {
  background: rgba(0, 176, 15, 0.2);
  color: var(--success);
  border: 1px solid rgba(0, 176, 15, 0.3);
}

.status-pending {
  background: rgba(255, 42, 42, 0.2);
  color: var(--warning);
  border: 1px solid rgba(255, 42, 42, 0.3);
}

/* Details Content */
.details-content {
  padding: 2rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
}

.section-title i {
  color: var(--primary);
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: rgba(238, 234, 234, 0.7);
  font-weight: 500;
  font-size: 0.9rem;
}

.detail-value {
  color: var(--text);
  font-weight: 600;
  text-align: right;
}

.detail-value.amount {
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 700;
}

.detail-value.delivery-date {
  color: var(--success);
}

.detail-value.tracking {
  font-family: monospace;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.delivery-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.delivery-status.preparing {
  background: rgba(30, 108, 217, 0.2);
  color: var(--info);
}

/* Notifications */
.notifications-section {
  border-top: 1px solid var(--border);
  padding-top: 2rem;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.notification-item.sent {
  background: rgba(0, 176, 15, 0.1);
  border-color: rgba(0, 176, 15, 0.2);
}

.notification-item.sending {
  background: rgba(255, 42, 42, 0.1);
  border-color: rgba(255, 42, 42, 0.2);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  transition: all 0.3s ease;
}

.notification-item.sent .notification-icon {
  background: var(--success);
  color: #fff;
}

.notification-content {
  flex: 1;
}

.notification-title {
  display: block;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.notification-status {
  font-size: 0.875rem;
  color: rgba(238, 234, 234, 0.7);
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: var(--text);
  text-decoration: none;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(217, 31, 38, 0.15);
  border-color: var(--primary);
}

.action-btn.primary:hover {
  background: rgba(217, 31, 38, 0.1);
}

.action-btn.secondary:hover {
  background: rgba(30, 108, 217, 0.1);
  border-color: var(--info);
  box-shadow: 0 8px 25px rgba(30, 108, 217, 0.15);
}

.action-btn.support:hover {
  background: rgba(0, 176, 15, 0.1);
  border-color: var(--success);
  box-shadow: 0 8px 25px rgba(0, 176, 15, 0.15);
}

.action-btn.share:hover {
  background: rgba(109, 0, 0, 0.1);
  border-color: var(--secondary);
  box-shadow: 0 8px 25px rgba(109, 0, 0, 0.15);
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.action-btn.secondary .action-icon {
  background: var(--info);
}

.action-btn.support .action-icon {
  background: var(--success);
}

.action-btn.share .action-icon {
  background: var(--secondary);
}

.action-content {
  flex: 1;
}

.action-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
}

.action-desc {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(238, 234, 234, 0.7);
  line-height: 1.4;
}

/* Timeline */
.timeline-content {
  padding: 2rem;
}

.timeline-track {
  position: relative;
}

.timeline-step {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.timeline-step.active,
.timeline-step.completed {
  opacity: 1;
}

.step-indicator {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(238, 234, 234, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.timeline-step.active .step-indicator,
.timeline-step.completed .step-indicator {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.step-content {
  flex: 1;
  padding-top: 0.5rem;
}

.step-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
}

.step-description {
  margin: 0 0 0.5rem 0;
  color: rgba(238, 234, 234, 0.7);
  line-height: 1.5;
}

.step-timeframe {
  font-size: 0.875rem;
  color: var(--primary);
  font-weight: 500;
}

.step-connector {
  position: absolute;
  left: 24px;
  top: 50px;
  width: 2px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}

/* Navigation */
.navigation-section {
  margin-bottom: 2rem;
}

.nav-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-btn.primary {
  background: var(--primary);
  color: #fff;
}

.nav-btn.primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(217, 31, 38, 0.3);
}

.nav-btn.secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  border-color: rgba(255, 255, 255, 0.1);
}

.nav-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.nav-btn.outline {
  background: transparent;
  color: var(--text);
  border-color: var(--border);
}

.nav-btn.outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .order-completion {
    padding: 1rem 0 2rem;
  }

  .success-container {
    padding: 2rem 1rem;
  }

  .success-title {
    font-size: 2rem;
  }

  .success-subtitle {
    font-size: 1rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .nav-actions {
    flex-direction: column;
  }

  .nav-btn {
    width: 100%;
    justify-content: center;
  }

  .timeline-step {
    gap: 1rem;
  }

  .step-indicator {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .step-connector {
    left: 19px;
    top: 40px;
    height: 30px;
  }

  .card-header {
    padding: 1rem 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .details-content,
  .actions-grid,
  .timeline-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .success-icon {
    width: 60px;
    height: 60px;
  }

  .success-icon i {
    font-size: 2rem;
  }

  .success-title {
    font-size: 1.5rem;
  }

  .order-badge {
    padding: 0.5rem 1rem;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .detail-value {
    text-align: left;
  }
}
</style>
