import { ref, reactive } from 'vue'

// Global toast state
const toasts = ref([])
let toastId = 0

// Toast management composable
export function useToast() {
  const showToast = (options) => {
    const id = ++toastId
    const toast = {
      id,
      show: true,
      type: options.type || 'info',
      title: options.title || 'Notification',
      message: options.message || '',
      duration: options.duration !== undefined ? options.duration : 4000,
      ...options
    }

    toasts.value.push(toast)

    // Auto remove toast after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        hideToast(id)
      }, toast.duration)
    }

    return id
  }

  const hideToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  // Convenience methods
  const showSuccess = (title, message, options = {}) => {
    return showToast({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  const showError = (title, message, options = {}) => {
    return showToast({
      type: 'error',
      title,
      message,
      duration: 6000, // Longer duration for errors
      ...options
    })
  }

  const showWarning = (title, message, options = {}) => {
    return showToast({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  const showInfo = (title, message, options = {}) => {
    return showToast({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

// Global toast instance for direct usage
export const toast = useToast()
