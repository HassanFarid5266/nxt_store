<template>
  <div>
    <main class="boxed">
      <!-- Enhanced Success Animation -->
      <OrderSuccessAnimation
        :title="successTitle"
        :subtitle="successSubtitle"
        :order-details="orderSummary"
      />

      <section class="card card-success">
        <div class="card-body">
          <h1 class="card-title">
            <i class="bx bx-check-circle" style="color: #28a745; margin-right: 8px;"></i>
            Order {{ orderDetails?.status === 'pending' ? 'Received' : 'Confirmed' }}!
          </h1>
          <p class="card-subtitle">
            <template v-if="orderDetails?.status === 'pending'">
              Thank you! Your order has been received and is being processed.
              You will receive bank transfer instructions via email shortly.
            </template>
            <template v-else>
              Thank you for your purchase! Your order has been successfully confirmed and paid.
            </template>
            <template v-if="orderDetails">
              <br><strong>Order #{{ orderDetails.orderId }}</strong> - Keep this for your records.
            </template>
          </p>

          <div v-if="orderDetails" class="order-summary">
            <h3 class="summary-title">Order Summary</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">Order ID:</span>
                <span class="summary-value">#{{ orderDetails.orderId }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Amount:</span>
                <span class="summary-value">${{ orderDetails.total }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Payment Method:</span>
                <span class="summary-value">{{ orderDetails.paymentMethod }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Email:</span>
                <span class="summary-value">{{ orderDetails.email }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Status:</span>
                <span class="summary-value">
                  <span class="status-badge" :class="statusClass">
                    {{ statusText }}
                  </span>
                </span>
              </div>
            </div>

            <div v-if="orderDetails.status === 'pending'" class="status-info">
              <div class="info-icon">
                <i class="bx bx-info-circle"></i>
              </div>
              <div class="info-text">
                <strong>Next Steps:</strong>
                <ul>
                  <li>Check your email for bank transfer instructions</li>
                  <li>Complete the transfer within 24 hours</li>
                  <li>Your order will be processed once payment is received</li>
                </ul>
              </div>
            </div>

            <div v-else class="status-info success">
              <div class="info-icon">
                <i class="bx bx-check-circle"></i>
              </div>
              <div class="info-text">
                <strong>Order Processing:</strong>
                <p>Your order is being prepared for shipment. You'll receive tracking information within 1-2 business days.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card-foot">
          <!-- Download Options -->
          <div v-if="orderDetails" class="download-section">
            <h4 class="download-title">Download Options</h4>
            <div class="download-buttons">
              <button
                @click="downloadInvoice"
                :disabled="downloadingInvoice || !orderDetails.order"
                class="btn btn-outline-primary btn-pill"
              >
                <i class="bx bx-download"></i>
                {{ downloadingInvoice ? 'Generating...' : 'Download Invoice' }}
              </button>
              <button
                @click="downloadReceipt"
                :disabled="downloadingReceipt || !orderDetails.order"
                class="btn btn-outline-secondary btn-pill"
              >
                <i class="bx bx-receipt"></i>
                {{ downloadingReceipt ? 'Generating...' : 'Download Receipt' }}
              </button>
            </div>
          </div>

          <div class="action-buttons">
            <router-link to="/orders" class="btn btn-primary btn-lg btn-pill">
              <i class="bx bx-list-ul"></i> View All Orders
            </router-link>
            <router-link v-if="orderDetails?.orderId" :to="`/order/${orderDetails.orderId}`" class="btn btn-outline-primary btn-lg btn-pill">
              <i class="bx bx-show"></i> Order Details
            </router-link>
            <router-link to="/" class="btn btn-secondary btn-lg btn-pill">
              <i class="bx bx-shopping-bag"></i> Continue Shopping
            </router-link>
          </div>

          <div class="help-text">
            Need help? <router-link to="/contact" class="contact-link">Contact our support team</router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/orders'
import { InvoiceGenerator } from '@/utils/invoice'
import { showMessage } from '@/utils/message'
import OrderSuccessAnimation from '@/components/OrderSuccessAnimation.vue'

const route = useRoute()
const orderStore = useOrderStore()

const orderDetails = ref(null)
const loading = ref(true)
const downloadingInvoice = ref(false)
const downloadingReceipt = ref(false)
const statusClass = computed(() => {
  if (!orderDetails.value?.status) return 'status-pending'
  return orderDetails.value.status === 'confirmed' ? 'status-confirmed' : 'status-pending'
})

const statusText = computed(() => {
  if (!orderDetails.value?.status) return 'Processing'
  return orderDetails.value.status === 'confirmed' ? 'Confirmed & Paid' : 'Awaiting Payment'
})

const successTitle = computed(() => {
  if (!orderDetails.value?.status) return 'Order Received!'
  return orderDetails.value.status === 'confirmed' ? 'Order Confirmed!' : 'Order Received!'
})

const successSubtitle = computed(() => {
  if (!orderDetails.value?.status) return 'Thank you for your purchase!'
  return orderDetails.value.status === 'confirmed'
    ? 'Your payment has been processed and your order is confirmed!'
    : 'We\'ve received your order and will process it once payment is confirmed.'
})

const orderSummary = computed(() => {
  if (!orderDetails.value) return null
  return {
    id: orderDetails.value.orderId,
    total: orderDetails.value.total,
    paymentMethod: orderDetails.value.paymentMethod
  }
})
const loadOrderDetails = async () => {
  try {
    // Get order details from query params or route
    const orderId = route.query.order_id || route.query.orderId
    const sessionId = route.query.session_id
    const paymentId = route.query.payment_id
    const status = route.query.status || 'confirmed'

    if (orderId || sessionId || paymentId) {
      // Try to get order from store first
      const existingOrder = orderStore.orders.find(o => o.id === orderId)

      if (existingOrder) {
        orderDetails.value = {
          orderId: existingOrder.id,
          total: existingOrder.total.toFixed(2),
          paymentMethod: existingOrder.payment_method,
          email: existingOrder.email,
          status: status,
          order: existingOrder
        }
      } else {
        // Create from query params
        orderDetails.value = {
          orderId: orderId || 'ORD-' + Date.now(),
          total: route.query.total || '99.99',
          paymentMethod: route.query.payment_method || 'Credit Card',
          email: route.query.email || 'customer@example.com',
          status: status
        }
      }
    }

    loading.value = false
  } catch (error) {
    console.error('Failed to load order details:', error)
    loading.value = false
  }
}

const downloadInvoice = async () => {
  if (!orderDetails.value?.order) {
    showMessage('Order details not available for invoice generation', 'error')
    return
  }

  downloadingInvoice.value = true
  try {
    const result = await InvoiceGenerator.downloadInvoice(
      orderDetails.value.order,
      orderDetails.value.order.items || []
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

const downloadReceipt = async () => {
  if (!orderDetails.value?.order) {
    showMessage('Order details not available for receipt generation', 'error')
    return
  }

  downloadingReceipt.value = true
  try {
    const result = await InvoiceGenerator.downloadReceipt(
      orderDetails.value.order,
      orderDetails.value.order.items || []
    )

    if (result.success) {
      showMessage(result.message, 'success')
    } else {
      showMessage(result.message, 'error')
    }
  } catch (error) {
    showMessage('Error downloading receipt', 'error')
  } finally {
    downloadingReceipt.value = false
  }
}

onMounted(async () => {
  orderStore.initializeStore()
  await loadOrderDetails()
})
</script>

<style scoped>
.order-summary {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.summary-title {
  margin-bottom: 1rem;
  color: #343a40;
  font-size: 1.1rem;
  font-weight: 600;
}

.summary-grid {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  font-weight: 500;
  color: #6c757d;
}

.summary-value {
  font-weight: 600;
  color: #343a40;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-confirmed {
  background-color: #d4edda;
  color: #155724;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #e7f3ff;
  border: 1px solid #b8daff;
  border-radius: 6px;
  margin-top: 1rem;
}

.status-info.success {
  background: #d4edda;
  border-color: #c3e6cb;
}

.info-icon {
  font-size: 1.25rem;
  color: #0066cc;
  margin-top: 0.125rem;
}

.status-info.success .info-icon {
  color: #28a745;
}

.info-text {
  flex: 1;
}

.info-text strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #343a40;
}

.info-text ul {
  margin: 0;
  padding-left: 1.25rem;
}

.info-text li {
  margin-bottom: 0.25rem;
  color: #495057;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.download-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.download-title {
  margin: 0 0 1rem 0;
  color: #343a40;
  font-size: 1.1rem;
  font-weight: 600;
}

.download-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.download-buttons .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.help-text {
  text-align: center;
  color: #6c757d;
  font-size: 0.875rem;
}

.contact-link {
  color: #007bff;
  text-decoration: none;
}

.contact-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .btn {
    width: 100%;
  }
}
</style>
