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
