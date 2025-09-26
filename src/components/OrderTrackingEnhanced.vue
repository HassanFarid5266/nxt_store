<template>
  <div class="order-tracking-enhanced">
    <!-- Tracking Header -->
    <div class="tracking-header">
      <div class="header-content">
        <h3 class="tracking-title">
          <i class="bx bx-package"></i>
          Order Tracking
        </h3>
        <div class="order-info">
          <span class="order-id">Order #{{ order.id }}</span>
          <span class="order-status" :class="statusClass">{{ statusLabel }}</span>
        </div>
      </div>
      <div class="tracking-actions">
        <button v-if="trackingNumber" @click="trackShipment" class="track-btn">
          <i class="bx bx-map"></i>
          Track Package
        </button>
        <button v-if="canShare" @click="shareTracking" class="share-btn">
          <i class="bx bx-share"></i>
          Share
        </button>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="progress-section">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="progress-labels">
        <span class="progress-label" v-for="step in progressSteps" :key="step.id" 
              :class="{ 'active': step.active, 'completed': step.completed }">
          {{ step.shortLabel }}
        </span>
      </div>
    </div>

    <!-- Tracking Timeline -->
    <div class="tracking-timeline">
      <div class="timeline-container">
        <div v-for="(step, index) in timelineSteps" :key="index"
             class="timeline-step" 
             :class="{ 
               'step-completed': step.completed, 
               'step-current': step.current,
               'step-pending': !step.completed && !step.current,
               'step-cancelled': step.cancelled
             }">
          <div class="step-indicator">
            <div class="step-icon">
              <i v-if="step.completed && !step.cancelled" class="bx bx-check"></i>
              <i v-else-if="step.current" class="bx bx-time"></i>
              <i v-else-if="step.cancelled" class="bx bx-x"></i>
              <i v-else :class="step.icon"></i>
            </div>
            <div v-if="step.current" class="step-pulse"></div>
          </div>
          <div class="step-content">
            <div class="step-header">
              <h4 class="step-title">{{ step.title }}</h4>
              <time v-if="step.timestamp" class="step-time">
                {{ formatDateTime(step.timestamp) }}
              </time>
            </div>
            <p class="step-description">{{ step.description }}</p>
            <div v-if="step.details && step.details.length" class="step-details">
              <div v-for="detail in step.details" :key="detail" class="detail-item">
                <i class="bx bx-info-circle"></i>
                <span>{{ detail }}</span>
              </div>
            </div>
            <div v-if="step.location" class="step-location">
              <i class="bx bx-map-pin"></i>
              <span>{{ step.location }}</span>
            </div>
            <div v-if="step.carrier" class="step-carrier">
              <i class="bx bx-truck"></i>
              <span>{{ step.carrier }}</span>
              <span v-if="step.trackingNumber" class="tracking-number">
                Tracking: {{ step.trackingNumber }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery Information -->
    <div v-if="deliveryInfo" class="delivery-info">
      <div class="delivery-card">
        <div class="delivery-header">
          <div class="delivery-icon">
            <i class="bx bx-calendar-check"></i>
          </div>
          <div class="delivery-content">
            <h4 class="delivery-title">{{ deliveryInfo.title }}</h4>
            <p class="delivery-date">{{ deliveryInfo.date }}</p>
          </div>
        </div>
        <div v-if="deliveryInfo.address" class="delivery-address">
          <div class="address-header">
            <i class="bx bx-map"></i>
            <span>Delivery Address</span>
          </div>
          <div class="address-content">
            <p>{{ deliveryInfo.address.name }}</p>
            <p>{{ deliveryInfo.address.street }}</p>
            <p>{{ deliveryInfo.address.city }}, {{ deliveryInfo.address.state }} {{ deliveryInfo.address.zip }}</p>
          </div>
        </div>
        <div v-if="deliveryInfo.instructions" class="delivery-instructions">
          <div class="instructions-header">
            <i class="bx bx-note"></i>
            <span>Delivery Instructions</span>
          </div>
          <p class="instructions-content">{{ deliveryInfo.instructions }}</p>
        </div>
      </div>
    </div>

    <!-- Package Information -->
    <div v-if="packageInfo" class="package-info">
      <h4 class="package-title">
        <i class="bx bx-package"></i>
        Package Details
      </h4>
      <div class="package-grid">
        <div class="package-item">
          <span class="package-label">Weight:</span>
          <span class="package-value">{{ packageInfo.weight }}</span>
        </div>
        <div class="package-item">
          <span class="package-label">Dimensions:</span>
          <span class="package-value">{{ packageInfo.dimensions }}</span>
        </div>
        <div class="package-item">
          <span class="package-label">Service:</span>
          <span class="package-value">{{ packageInfo.service }}</span>
        </div>
        <div class="package-item">
          <span class="package-label">Carrier:</span>
          <span class="package-value">{{ packageInfo.carrier }}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="tracking-actions-bottom">
      <div class="action-group">
        <button v-if="canCancel" @click="$emit('cancel-order')" class="action-btn cancel-btn">
          <i class="bx bx-x"></i>
          Cancel Order
        </button>
        <button v-if="canModify" @click="$emit('modify-order')" class="action-btn modify-btn">
          <i class="bx bx-edit"></i>
          Modify Order
        </button>
        <button v-if="canReturn" @click="$emit('return-order')" class="action-btn return-btn">
          <i class="bx bx-undo"></i>
          Return Item
        </button>
      </div>
      <div class="action-group">
        <button @click="$emit('contact-support')" class="action-btn support-btn">
          <i class="bx bx-support"></i>
          Contact Support
        </button>
        <button @click="downloadTrackingInfo" class="action-btn download-btn">
          <i class="bx bx-download"></i>
          Download Info
        </button>
      </div>
    </div>

    <!-- Notifications -->
    <div v-if="notifications && notifications.length" class="tracking-notifications">
      <h4 class="notifications-title">
        <i class="bx bx-bell"></i>
        Recent Updates
      </h4>
      <div class="notifications-list">
        <div v-for="notification in notifications" :key="notification.id" 
             class="notification-item" :class="{ 'unread': !notification.read }">
          <div class="notification-icon">
            <i :class="notification.icon"></i>
          </div>
          <div class="notification-content">
            <p class="notification-title">{{ notification.title }}</p>
            <p class="notification-message">{{ notification.message }}</p>
            <time class="notification-time">{{ formatDateTime(notification.timestamp) }}</time>
          </div>
          <button v-if="!notification.read" @click="markAsRead(notification.id)" 
                  class="notification-read-btn">
            <i class="bx bx-check"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Tracking Map -->
    <div v-if="showMap && trackingNumber" class="tracking-map">
      <h4 class="map-title">
        <i class="bx bx-map"></i>
        Package Location
      </h4>
      <div class="map-container">
        <div class="map-placeholder">
          <div class="map-icon">
            <i class="bx bx-map-pin"></i>
          </div>
          <p>Interactive map showing package location</p>
          <p class="map-note">Real-time tracking available when shipped</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useOrderStore } from '@/stores/orders'
import { showMessage } from '@/utils/message'

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  showMap: {
    type: Boolean,
    default: false
  },
  notifications: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'cancel-order', 
  'modify-order', 
  'return-order', 
  'contact-support'
])

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

const canModify = computed(() => {
  return [
    orderStore.ORDER_STATUSES.PENDING,
    orderStore.ORDER_STATUSES.CONFIRMED
  ].includes(props.order.status)
})

const canReturn = computed(() => {
  return props.order.status === orderStore.ORDER_STATUSES.DELIVERED
})

const canShare = computed(() => {
  return navigator.share !== undefined
})

const progressSteps = computed(() => [
  { id: 1, shortLabel: 'Placed', completed: true, active: false },
  { id: 2, shortLabel: 'Confirmed', completed: props.order.status !== orderStore.ORDER_STATUSES.PENDING, active: props.order.status === orderStore.ORDER_STATUSES.CONFIRMED },
  { id: 3, shortLabel: 'Processing', completed: ['shipped', 'delivered'].includes(props.order.status), active: props.order.status === orderStore.ORDER_STATUSES.PROCESSING },
  { id: 4, shortLabel: 'Shipped', completed: props.order.status === orderStore.ORDER_STATUSES.DELIVERED, active: props.order.status === orderStore.ORDER_STATUSES.SHIPPED },
  { id: 5, shortLabel: 'Delivered', completed: props.order.status === orderStore.ORDER_STATUSES.DELIVERED, active: false }
])

const progressPercentage = computed(() => {
  const completedSteps = progressSteps.value.filter(step => step.completed).length
  return (completedSteps / progressSteps.value.length) * 100
})

const timelineSteps = computed(() => {
  const steps = [
    {
      title: 'Order Placed',
      description: 'Your order has been placed successfully and is being reviewed',
      icon: 'bx bx-check-circle',
      completed: true,
      current: false,
      timestamp: props.order.created_at,
      details: ['Order received and payment processing', 'Inventory check completed'],
      location: 'Order Processing Center'
    },
    {
      title: 'Payment Confirmed',
      description: 'Payment has been processed and confirmed successfully',
      icon: 'bx bx-credit-card',
      completed: props.order.status !== orderStore.ORDER_STATUSES.PENDING,
      current: props.order.status === orderStore.ORDER_STATUSES.CONFIRMED,
      timestamp: props.order.status !== orderStore.ORDER_STATUSES.PENDING ? props.order.updated_at : null,
      details: props.order.status === orderStore.ORDER_STATUSES.PENDING ? 
        ['Awaiting payment confirmation', 'Bank transfer verification in progress'] : 
        ['Payment successfully processed', 'Order moved to fulfillment'],
      location: 'Payment Processing Center'
    },
    {
      title: 'Order Processing',
      description: 'Your items are being picked, packed, and prepared for shipment',
      icon: 'bx bx-package',
      completed: [orderStore.ORDER_STATUSES.SHIPPED, orderStore.ORDER_STATUSES.DELIVERED].includes(props.order.status),
      current: props.order.status === orderStore.ORDER_STATUSES.PROCESSING,
      timestamp: props.order.status === orderStore.ORDER_STATUSES.PROCESSING ? props.order.updated_at : null,
      details: props.order.status === orderStore.ORDER_STATUSES.PROCESSING ? 
        ['Items being picked from warehouse', 'Quality check and packaging in progress', 'Preparing shipping label'] : 
        props.order.status === orderStore.ORDER_STATUSES.SHIPPED || props.order.status === orderStore.ORDER_STATUSES.DELIVERED ?
        ['Items picked and packed successfully', 'Quality check completed', 'Ready for shipment'] : [],
      location: 'Fulfillment Center - Warehouse A'
    },
    {
      title: 'Package Shipped',
      description: 'Your package has been handed over to the carrier and is on its way',
      icon: 'bx bx-truck',
      completed: props.order.status === orderStore.ORDER_STATUSES.DELIVERED,
      current: props.order.status === orderStore.ORDER_STATUSES.SHIPPED,
      timestamp: props.order.status === orderStore.ORDER_STATUSES.SHIPPED ? props.order.updated_at : null,
      details: props.order.tracking_number ? 
        [`Package tracking: ${props.order.tracking_number}`, 'Estimated delivery in 2-3 business days', 'SMS notifications enabled'] : 
        ['Package prepared for shipment', 'Tracking information will be available soon'],
      location: 'Shipping Hub - Distribution Center',
      carrier: 'FedEx Express',
      trackingNumber: props.order.tracking_number
    },
    {
      title: 'Out for Delivery',
      description: 'Your package is out for delivery and will arrive today',
      icon: 'bx bx-home',
      completed: props.order.status === orderStore.ORDER_STATUSES.DELIVERED,
      current: false, // This would be a separate status in a real system
      timestamp: null,
      details: ['Package loaded on delivery vehicle', 'Delivery scheduled for today', 'Driver will call before delivery'],
      location: 'Local Delivery Hub'
    },
    {
      title: 'Delivered',
      description: 'Your package has been delivered successfully',
      icon: 'bx bx-check-circle',
      completed: props.order.status === orderStore.ORDER_STATUSES.DELIVERED,
      current: false,
      timestamp: props.order.status === orderStore.ORDER_STATUSES.DELIVERED ? props.order.updated_at : null,
      details: props.order.status === orderStore.ORDER_STATUSES.DELIVERED ? 
        ['Package delivered to front door', 'Signature obtained', 'Delivery photo taken', 'Thank you for your order!'] : [],
      location: 'Customer Address'
    }
  ]

  // Handle cancelled status
  if (props.order.status === orderStore.ORDER_STATUSES.CANCELLED) {
    return [
      steps[0], // Order placed
      steps[1], // Payment (if confirmed before cancellation)
      {
        title: 'Order Cancelled',
        description: 'Your order has been cancelled as requested',
        icon: 'bx bx-x-circle',
        completed: true,
        current: false,
        cancelled: true,
        timestamp: props.order.updated_at,
        details: ['Cancellation request processed', 'Refund initiated', 'Refund will appear in 3-5 business days'],
        location: 'Customer Service Center'
      }
    ]
  }

  return steps
})

const deliveryInfo = computed(() => {
  if (props.order.status === orderStore.ORDER_STATUSES.SHIPPED) {
    const estimatedDate = new Date(props.order.updated_at)
    estimatedDate.setDate(estimatedDate.getDate() + 3)
    return {
      title: 'Estimated Delivery',
      date: formatDeliveryDate(estimatedDate),
      address: {
        name: props.order.customer_name,
        street: props.order.shipping_address?.address || '123 Main Street',
        city: props.order.shipping_address?.city || 'City',
        state: 'State',
        zip: '12345'
      },
      instructions: 'Leave at front door if not home'
    }
  } else if (props.order.status === orderStore.ORDER_STATUSES.DELIVERED) {
    return {
      title: 'Delivered',
      date: formatDeliveryDate(new Date(props.order.updated_at)),
      address: {
        name: props.order.customer_name,
        street: props.order.shipping_address?.address || '123 Main Street',
        city: props.order.shipping_address?.city || 'City',
        state: 'State',
        zip: '12345'
      }
    }
  }
  return null
})

const packageInfo = computed(() => {
  if (props.order.status === orderStore.ORDER_STATUSES.SHIPPED || props.order.status === orderStore.ORDER_STATUSES.DELIVERED) {
    return {
      weight: '2.5 lbs',
      dimensions: '12" x 8" x 4"',
      service: 'Ground Shipping',
      carrier: 'FedEx'
    }
  }
  return null
})

const formatDateTime = (dateString) => {
  if (!dateString) return ''
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
    const trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber.value}`
    window.open(trackingUrl, '_blank')
    showMessage(`Opening tracking for ${trackingNumber.value}`, 'info')
  }
}

const shareTracking = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Order #${props.order.id} Tracking`,
        text: `Track my order: ${statusLabel.value}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Error sharing:', error)
    }
  }
}

const downloadTrackingInfo = () => {
  const trackingData = {
    orderId: props.order.id,
    status: statusLabel.value,
    trackingNumber: trackingNumber.value,
    timeline: timelineSteps.value.filter(step => step.completed)
  }
  
  const dataStr = JSON.stringify(trackingData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `order-${props.order.id}-tracking.json`
  link.click()
  URL.revokeObjectURL(url)
  
  showMessage('Tracking information downloaded', 'success')
}

const markAsRead = (notificationId) => {
  const notification = props.notifications.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
    showMessage('Notification marked as read', 'success')
  }
}
</script>

<style scoped>
.order-tracking-enhanced {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.tracking-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-content {
  flex: 1;
}

.tracking-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-id {
  font-size: 1.1rem;
  font-weight: 500;
  opacity: 0.9;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
  width: fit-content;
}

.tracking-actions {
  display: flex;
  gap: 0.5rem;
}

.track-btn, .share-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.track-btn:hover, .share-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.progress-section {
  padding: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
  border-radius: 4px;
  transition: width 0.6s ease;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
}

.progress-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
  transition: color 0.3s ease;
}

.progress-label.completed {
  color: #28a745;
}

.progress-label.active {
  color: #007bff;
  font-weight: 600;
}

.tracking-timeline {
  padding: 2rem;
}

.timeline-container {
  position: relative;
}

.timeline-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 3rem;
  position: relative;
}

.timeline-step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 60px;
  width: 2px;
  height: calc(100% + 1rem);
  background: #e9ecef;
  z-index: 1;
}

.step-completed::after {
  background: linear-gradient(to bottom, #28a745 0%, #28a745 100%) !important;
}

.step-current::after {
  background: linear-gradient(to bottom, #007bff 50%, #e9ecef 50%) !important;
}

.step-indicator {
  position: relative;
  z-index: 2;
  margin-right: 1.5rem;
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
  border: 3px solid transparent;
}

.step-completed .step-icon {
  background: #28a745;
  color: white;
  box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.2);
}

.step-current .step-icon {
  background: #007bff;
  color: white;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.2);
}

.step-pending .step-icon {
  background: #f8f9fa;
  color: #6c757d;
  border-color: #e9ecef;
}

.step-cancelled .step-icon {
  background: #dc3545;
  color: white;
  box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.2);
}

.step-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: #007bff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.4);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.step-content {
  flex: 1;
  padding-top: 0.25rem;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.step-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #343a40;
}

.step-current .step-title {
  color: #007bff;
}

.step-time {
  font-size: 0.875rem;
  color: #28a745;
  font-weight: 500;
  background: #f8fff9;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  border: 1px solid #d4edda;
}

.step-description {
  margin: 0 0 1rem 0;
  color: #6c757d;
  line-height: 1.6;
}

.step-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #495057;
}

.detail-item i {
  color: #007bff;
  flex-shrink: 0;
}

.step-location, .step-carrier {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #6c757d;
}

.step-location i, .step-carrier i {
  color: #007bff;
}

.tracking-number {
  margin-left: auto;
  background: #e7f3ff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.8rem;
}

.delivery-info, .package-info {
  margin: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.delivery-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.delivery-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.delivery-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.delivery-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #343a40;
}

.delivery-date {
  margin: 0;
  font-size: 1.1rem;
  color: #28a745;
  font-weight: 500;
}

.delivery-address, .delivery-instructions {
  margin-bottom: 1rem;
}

.address-header, .instructions-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #343a40;
}

.address-header i, .instructions-header i {
  color: #007bff;
}

.address-content p, .instructions-content {
  margin: 0.25rem 0;
  color: #495057;
  line-height: 1.5;
}

.package-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #343a40;
}

.package-title i {
  color: #007bff;
}

.package-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.package-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.package-label {
  color: #6c757d;
  font-weight: 500;
}

.package-value {
  color: #343a40;
  font-weight: 600;
}

.tracking-actions-bottom {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.action-group {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.cancel-btn {
  background: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background: #c82333;
}

.modify-btn {
  background: #ffc107;
  color: #212529;
}

.modify-btn:hover {
  background: #e0a800;
}

.return-btn {
  background: #6c757d;
  color: white;
}

.return-btn:hover {
  background: #545b62;
}

.support-btn {
  background: #007bff;
  color: white;
}

.support-btn:hover {
  background: #0056b3;
}

.download-btn {
  background: #28a745;
  color: white;
}

.download-btn:hover {
  background: #1e7e34;
}

.tracking-notifications {
  margin: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.notifications-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #343a40;
}

.notifications-title i {
  color: #007bff;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.notification-item.unread {
  border-left: 4px solid #007bff;
  background: #f8fcff;
}

.notification-icon {
  width: 32px;
  height: 32px;
  background: #e7f3ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #007bff;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-title {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #343a40;
}

.notification-message {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
  line-height: 1.5;
}

.notification-time {
  font-size: 0.875rem;
  color: #6c757d;
}

.notification-read-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.notification-read-btn:hover {
  background: #e7f3ff;
}

.tracking-map {
  margin: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.map-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #343a40;
}

.map-title i {
  color: #007bff;
}

.map-container {
  background: white;
  border-radius: 8px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e9ecef;
}

.map-placeholder {
  text-align: center;
  color: #6c757d;
}

.map-icon {
  font-size: 3rem;
  color: #007bff;
  margin-bottom: 1rem;
}

.map-note {
  font-size: 0.875rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .tracking-header {
    flex-direction: column;
    gap: 1rem;
  }

  .tracking-actions {
    align-self: stretch;
  }

  .track-btn, .share-btn {
    flex: 1;
    justify-content: center;
  }

  .progress-labels {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .step-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .package-grid {
    grid-template-columns: 1fr;
  }

  .tracking-actions-bottom {
    flex-direction: column;
  }

  .action-group {
    justify-content: center;
  }

  .action-btn {
    flex: 1;
  }

  .delivery-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
