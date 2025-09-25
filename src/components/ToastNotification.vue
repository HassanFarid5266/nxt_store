<template>
  <teleport to="body">
    <transition name="toast" appear>
      <div v-if="show" class="toast-notification" :class="typeClass">
        <div class="toast-content">
          <i class="toast-icon" :class="iconClass"></i>
          <div class="toast-message">
            <h4 class="toast-title">{{ title }}</h4>
            <p class="toast-text">{{ message }}</p>
          </div>
          <button @click="close" class="toast-close">
            <i class="bx bx-x"></i>
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'success', // success, error, warning, info
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 4000
  }
})

const emit = defineEmits(['close'])

const typeClass = computed(() => `toast-notification--${props.type}`)

const iconClass = computed(() => {
  const icons = {
    success: 'bx bx-check-circle',
    error: 'bx bx-error-circle',
    warning: 'bx bx-error',
    info: 'bx bx-info-circle'
  }
  return icons[props.type]
})

const close = () => {
  emit('close')
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  min-width: 320px;
  max-width: 400px;
  background: var(--dark);
  border: 1px solid var(--border);
  border-radius: var(--rounded);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 1rem;
}

.toast-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-message {
  flex: 1;
}

.toast-title {
  color: var(--text);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.toast-text {
  color: var(--muted);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
}

/* Toast Type Styles */
.toast-notification--success {
  border-left: 4px solid var(--success);
}

.toast-notification--success .toast-icon {
  color: var(--success);
}

.toast-notification--error {
  border-left: 4px solid var(--danger);
}

.toast-notification--error .toast-icon {
  color: var(--danger);
}

.toast-notification--warning {
  border-left: 4px solid var(--warning);
}

.toast-notification--warning .toast-icon {
  color: var(--warning);
}

.toast-notification--info {
  border-left: 4px solid var(--primary);
}

.toast-notification--info .toast-icon {
  color: var(--primary);
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

/* Responsive Design */
@media (max-width: 576px) {
  .toast-notification {
    left: 10px;
    right: 10px;
    top: 10px;
    min-width: auto;
    max-width: none;
  }
  
  .toast-content {
    padding: 0.875rem;
  }
  
  .toast-title {
    font-size: 0.9rem;
  }
  
  .toast-text {
    font-size: 0.8rem;
  }
}
</style>
