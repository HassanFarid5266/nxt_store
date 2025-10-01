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
                <!-- Card Payment Details -->
                <template v-if="order?.payment_method === 'card' || order?.payment_method === 'Credit Card'">
                  <div class="detail-row" v-if="order?.card_holder_name">
                    <span class="detail-label">Card Holder Name</span>
                    <span class="detail-value">{{ order.card_holder_name }}</span>
                  </div>
                  <div class="detail-row" v-if="order?.card_number_masked">
                    <span class="detail-label">Card Number</span>
                    <span class="detail-value card-masked">{{ order.card_number_masked }}</span>
                  </div>
                  <div class="detail-row" v-if="order?.expiry_date">
                    <span class="detail-label">Expiry Date</span>
                    <span class="detail-value">{{ order.expiry_date }}</span>
                  </div>
                </template>
                <!-- Bank Transfer Details -->
                <template v-if="order?.payment_method === 'bank-account' || order?.payment_method === 'Bank Transfer'">
                  <div class="detail-row">
                    <span class="detail-label">Bank Name</span>
                    <span class="detail-value">{{ order?.bank_name || 'N/A' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Account Holder</span>
                    <span class="detail-value">{{ order?.account_holder || 'N/A' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Account Number</span>
                    <span class="detail-value">{{ order?.account_number || 'N/A' }}</span>
                  </div>
                </template>
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
                  <span class="detail-value">{{ order?.customer_name || `${order?.firstname} ${order?.lastname}`
                    }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email Address</span>
                  <span class="detail-value">{{ order?.email }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone Number</span>
                  <span class="detail-value">{{ order?.phone }}</span>
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
          firstname: route.query.firstname,
          lastname: route.query.lastname,
          email: route.query.email || 'customer@example.com',
          phone: route.query.phone || '+1234567890',
          total: parseFloat(route.query.total || '99.99'),
          payment_method: route.query.payment_method || 'card',
          status: route.query.status || 'confirmed',
          created_at: new Date().toISOString(),
          // Card details
          card_holder_name: route.query.card_holder_name,
          card_number_masked: route.query.card_number_masked,
          expiry_date: route.query.expiry_date,
          // Bank details
          bank_name: route.query.bank_name,
          account_holder: route.query.account_holder,
          account_number: route.query.account_number,
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
