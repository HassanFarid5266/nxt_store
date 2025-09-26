<template>
  <div class="order-success-animation">
    <div class="success-container" :class="{ 'animate': animate }">
      <!-- Animated Check Circle -->
      <div class="check-circle">
        <div class="check-background"></div>
        <svg class="check-svg" viewBox="0 0 52 52">
          <circle class="check-circle-path" cx="26" cy="26" r="25" fill="none"/>
          <path class="check-mark" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
      </div>

      <!-- Success Message -->
      <div class="success-message">
        <h2 class="success-title">{{ title }}</h2>
        <p class="success-subtitle">{{ subtitle }}</p>
      </div>

      <!-- Order Details -->
      <div v-if="orderDetails" class="order-details">
        <div class="detail-item">
          <span class="detail-label">Order ID:</span>
          <span class="detail-value">#{{ orderDetails.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Total:</span>
          <span class="detail-value">${{ orderDetails.total }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Payment:</span>
          <span class="detail-value">{{ orderDetails.paymentMethod }}</span>
        </div>
      </div>

      <!-- Confetti Animation -->
      <div class="confetti-container">
        <div v-for="i in 50" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Order Placed Successfully!'
  },
  subtitle: {
    type: String,
    default: 'Thank you for your purchase. We\'ll process your order shortly.'
  },
  orderDetails: {
    type: Object,
    default: null
  }
})

const animate = ref(false)

const getConfettiStyle = (index) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7']
  const color = colors[index % colors.length]
  const left = Math.random() * 100
  const delay = Math.random() * 3
  const duration = 3 + Math.random() * 2

  return {
    backgroundColor: color,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

onMounted(() => {
  setTimeout(() => {
    animate.value = true
  }, 100)
})
</script>

<style scoped>
.order-success-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  overflow: hidden;
  margin: 2rem 0;
}

.success-container {
  text-align: center;
  color: white;
  z-index: 2;
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.success-container.animate {
  opacity: 1;
  transform: translateY(0);
}

.check-circle {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
}

.check-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(10px);
}

.check-svg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #28a745;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #28a745;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
  position: relative;
  top: -80px;
  margin: 0 auto;
}

.check-circle-path {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: rgba(40, 167, 69, 0.3);
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.check-mark {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  stroke: #28a745;
  stroke-width: 3;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #28a745;
  }
}

.success-message {
  margin-bottom: 2rem;
}

.success-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  animation: slideInUp 0.8s ease 0.3s both;
}

.success-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
  animation: slideInUp 0.8s ease 0.5s both;
}

.order-details {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideInUp 0.8s ease 0.7s both;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.75rem 0;
  font-size: 1rem;
}

.detail-label {
  opacity: 0.8;
}

.detail-value {
  font-weight: 600;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: confettiFall linear infinite;
  top: -10px;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-100vh) rotateZ(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotateZ(720deg);
    opacity: 0;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .success-title {
    font-size: 1.5rem;
  }
  
  .success-subtitle {
    font-size: 1rem;
  }
  
  .order-details {
    padding: 1rem;
  }
  
  .detail-item {
    font-size: 0.9rem;
  }
}
</style>
