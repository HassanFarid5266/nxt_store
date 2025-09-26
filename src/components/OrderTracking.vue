<template>
  <div class="order-tracking">
    <div class="tracking-header">
      <h3 class="tracking-title">Order Status</h3>
      <div class="tracking-info">
        <span class="order-status" :class="statusClass">{{ statusLabel }}</span>
        <span v-if="trackingNumber" class="tracking-number">
          Tracking: <strong>{{ trackingNumber }}</strong>
        </span>
      </div>
    </div>

    <div class="tracking-timeline">
      <div 
        v-for="(step, index) in timelineSteps" 
        :key="index"
        class="timeline-step"
        :class="{ 
          'step-completed': step.completed, 
          'step-current': step.current,
          'step-pending': !step.completed && !step.current
        }"
      >
        <div class="step-indicator">
          <div class="step-icon">
            <i v-if="step.completed" class="bx bx-check"></i>
            <i v-else-if="step.current" class="bx bx-time"></i>
            <i v-else :class="step.icon"></i>
          </div>
        </div>
        <div class="step-content">
          <h4 class="step-title">{{ step.title }}</h4>
          <p class="step-description">{{ step.description }}</p>
          <time v-if="step.timestamp" class="step-time">
            {{ formatDateTime(step.timestamp) }}
          </time>
          <div v-if="step.details" class="step-details">
            <p v-for="detail in step.details" :key="detail">{{ detail }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="estimatedDelivery" class="delivery-estimate">
      <div class="estimate-icon">
        <i class="bx bx-calendar"></i>
      </div>
      <div class="estimate-content">
        <h4 class="estimate-title">Estimated Delivery</h4>
        <p class="estimate-date">{{ formatDeliveryDate(estimatedDelivery) }}</p>
      </div>
    </div>

    <div v-if="trackingNumber" class="tracking-actions">
      <button @click="trackShipment" class="btn btn-outline-primary btn-pill">
        <i class="bx bx-package"></i> Track Shipment
      </button>
      <button v-if="canCancel" @click="$emit('cancel-order')" class="btn btn-outline-danger btn-pill">
        <i class="bx bx-x"></i> Cancel Order
      </button>
    </div>

    <div v-if="showContactSupport" class="support-section">
      <p class="support-text">Need help with your order?</p>
      <button @click="$emit('contact-support')" class="btn btn-secondary btn-sm btn-pill">
        <i class="bx bx-support"></i> Contact Support
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOrderStore } from '@/stores/orders'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['cancel-order', 'contact-support'])

const orderStore = useOrderStore()

const statusClass = computed(() => {
  return `status-${orderStore.getStatusColor(props.order.status)}`
})

const statusLabel = computed(() => {
  return orderStore.getStatusLabel(props.order.status)
})

const trackingNumber = computed(() => {
  return props.order.tracking_number
})

const canCancel = computed(() => {
  return [
    orderStore.ORDER_STATUSES.PENDING,
    orderStore.ORDER_STATUSES.CONFIRMED,
    orderStore.ORDER_STATUSES.PROCESSING
  ].includes(props.order.status)
})

const showContactSupport = computed(() => {
  return ![orderStore.ORDER_STATUSES.DELIVERED, orderStore.ORDER_STATUSES.CANCELLED].includes(props.order.status)
})

const estimatedDelivery = computed(() => {
  if (props.order.status === orderStore.ORDER_STATUSES.SHIPPED) {
    const shippedDate = new Date(props.order.updated_at)
    const deliveryDate = new Date(shippedDate)
    deliveryDate.setDate(shippedDate.getDate() + 3) // 3 days after shipping
    return deliveryDate
  }
  return null
})

const timelineSteps = computed(() => {
  const steps = [
    {
      title: 'Order Placed',
      description: 'Your order has been placed successfully',
      icon: 'bx bx-check-circle',
      completed: true,
      current: false,
      timestamp: props.order.created_at
    },
    {
      title: 'Payment Confirmed',
      description: 'Payment has been processed and confirmed',
      icon: 'bx bx-credit-card',
      completed: props.order.status !== orderStore.ORDER_STATUSES.PENDING,
      current: props.order.status === orderStore.ORDER_STATUSES.CONFIRMED,
      timestamp: props.order.status !== orderStore.ORDER_STATUSES.PENDING ? props.order.updated_at : null,
      details: props.order.status === orderStore.ORDER_STATUSES.PENDING ? 
        ['Awaiting payment confirmation via bank transfer'] : null
    },
    {
      title: 'Processing',
      description: 'Your order is being prepared for shipment',
      icon: 'bx bx-package',
      completed: [
        orderStore.ORDER_STATUSES.SHIPPED,
        orderStore.ORDER_STATUSES.DELIVERED
      ].includes(props.order.status),
      current: props.order.status === orderStore.ORDER_STATUSES.PROCESSING,
      timestamp: props.order.status === orderStore.ORDER_STATUSES.PROCESSING ? props.order.updated_at : null,
      details: props.order.status === orderStore.ORDER_STATUSES.PROCESSING ? 
        ['Items are being picked and packed', 'Quality check in progress'] : null
    },
    {
      title: 'Shipped',
      description: 'Your order has been shipped',
      icon: 'bx bx-truck',
      completed: props.order.status === orderStore.ORDER_STATUSES.DELIVERED,
      current: props.order.status === orderStore.ORDER_STATUSES.SHIPPED,
      timestamp: props.order.status === orderStore.ORDER_STATUSES.SHIPPED ? props.order.updated_at : null,
      details: props.order.tracking_number ? 
        [`Tracking number: ${props.order.tracking_number}`, 'Estimated delivery in 2-3 business days'] : null
    },
    {
      title: 'Delivered',
      description: 'Your order has been delivered successfully',
      icon: 'bx bx-home',
      completed: props.order.status === orderStore.ORDER_STATUSES.DELIVERED,
      current: false,
      timestamp: props.order.status === orderStore.ORDER_STATUSES.DELIVERED ? props.order.updated_at : null,
      details: props.order.status === orderStore.ORDER_STATUSES.DELIVERED ? 
        ['Package delivered to your address', 'Thank you for your order!'] : null
    }
  ]

  // Handle cancelled status
  if (props.order.status === orderStore.ORDER_STATUSES.CANCELLED) {
    return [
      steps[0], // Order placed
      {
        title: 'Order Cancelled',
        description: 'Your order has been cancelled',
        icon: 'bx bx-x-circle',
        completed: true,
        current: false,
        timestamp: props.order.updated_at,
        details: ['Refund will be processed within 3-5 business days']
      }
    ]
  }

  return steps
})

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDeliveryDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const trackShipment = () => {
  if (trackingNumber.value) {
    const trackingUrl = `https://www.example-shipping.com/track/${trackingNumber.value}`
    window.open(trackingUrl, '_blank')
  }
}
</script>

<style scoped>
.order-tracking {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.tracking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.tracking-title {
  margin: 0;
  color: #343a40;
  font-size: 1.5rem;
  font-weight: 600;
}

.tracking-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-warning {
  background-color: #fff3cd;
  color: #856404;
}

.status-info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-primary {
  background-color: #d4edda;
  color: #155724;
}

.status-success {
  background-color: #d4edda;
  color: #155724;
}

.status-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.tracking-number {
  font-size: 0.875rem;
  color: #6c757d;
}

.tracking-timeline {
  position: relative;
  padding: 1rem 0;
}

.timeline-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 50px;
  width: 2px;
  height: calc(100% + 1rem);
  background: #e9ecef;
  z-index: 1;
}

.step-completed::after {
  background: #28a745 !important;
}

.step-current::after {
  background: linear-gradient(to bottom, #007bff 50%, #e9ecef 50%) !important;
}

.step-indicator {
  position: relative;
  z-index: 2;
  margin-right: 1rem;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.step-completed .step-icon {
  background: #28a745;
  color: white;
}

.step-current .step-icon {
  background: #007bff;
  color: white;
  animation: pulse 2s infinite;
}

.step-pending .step-icon {
  background: #e9ecef;
  color: #6c757d;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
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

.step-current .step-title {
  color: #007bff;
}

.step-description {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
  line-height: 1.5;
}

.step-time {
  display: block;
  font-size: 0.875rem;
  color: #28a745;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.step-details {
  margin-top: 0.5rem;
}

.step-details p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #6c757d;
  font-style: italic;
}

.delivery-estimate {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 2rem 0;
  border-left: 4px solid #007bff;
}

.estimate-icon {
  font-size: 1.5rem;
  color: #007bff;
}

.estimate-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #343a40;
}

.estimate-date {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #007bff;
}

.tracking-actions {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.support-section {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 2rem;
}

.support-text {
  margin: 0 0 1rem 0;
  color: #6c757d;
}

@media (max-width: 768px) {
  .order-tracking {
    padding: 1rem;
  }

  .tracking-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .tracking-info {
    align-items: flex-start;
  }

  .tracking-actions {
    flex-direction: column;
  }

  .tracking-actions .btn {
    width: 100%;
  }
}
</style>
