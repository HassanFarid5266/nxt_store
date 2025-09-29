// Error handler utility for graceful API error management
import { toast } from '@/utils/toast'

// Error types and their user-friendly messages
const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Check your internet connection and try again',
  TIMEOUT_ERROR: 'Request timed out. Please try again',
  SERVER_ERROR: 'Server is temporarily unavailable. Please try again later',
  
  // Auth errors
  UNAUTHORIZED: 'Please log in to continue',
  FORBIDDEN: 'You do not have permission to perform this action',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again',
  
  // Validation errors
  VALIDATION_ERROR: 'Please check your input and try again',
  MISSING_FIELDS: 'Please fill in all required fields',
  INVALID_EMAIL: 'Please enter a valid email address',
  WEAK_PASSWORD: 'Password must be at least 8 characters long',
  
  // Business logic errors
  USER_EXISTS: 'An account with this email already exists',
  USER_NOT_FOUND: 'No account found with this email',
  PRODUCT_NOT_FOUND: 'Product not found',
  INSUFFICIENT_STOCK: 'Not enough items in stock',
  PAYMENT_FAILED: 'Payment could not be processed. Please try again',
  ORDER_NOT_FOUND: 'Order not found',
  
  // Generic fallback
  UNKNOWN_ERROR: 'Something went wrong. Please try again'
}

// Development mode messages for better debugging
const DEV_MESSAGES = {
  API_NOT_READY: 'Backend API is not available yet. Using mock data for development.',
  MOCK_API_ACTIVE: 'Running in development mode with mock API responses.',
  FEATURE_NOT_IMPLEMENTED: 'This feature is not yet implemented in the backend.'
}

export class ApiError extends Error {
  constructor(message, type = 'UNKNOWN_ERROR', statusCode = 500, details = null) {
    super(message)
    this.name = 'ApiError'
    this.type = type
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

// Main error handler function
export function handleApiError(error, context = '') {
  console.error(`API Error in ${context}:`, error)
  
  let userMessage = ERROR_MESSAGES.UNKNOWN_ERROR
  let errorType = 'UNKNOWN_ERROR'
  let shouldRetry = false
  
  // Determine error type and appropriate message
  if (error instanceof ApiError) {
    userMessage = ERROR_MESSAGES[error.type] || error.message
    errorType = error.type
    shouldRetry = isRetryableError(error.type)
  } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
    userMessage = ERROR_MESSAGES.NETWORK_ERROR
    errorType = 'NETWORK_ERROR'
    shouldRetry = true
  } else if (error.name === 'AbortError') {
    userMessage = ERROR_MESSAGES.TIMEOUT_ERROR
    errorType = 'TIMEOUT_ERROR'
    shouldRetry = true
  } else if (error.message) {
    // Try to extract meaningful message from error
    userMessage = extractUserMessage(error.message)
    errorType = determineErrorType(error.message)
    shouldRetry = isRetryableError(errorType)
  }
  
  // Show appropriate notification
  showErrorNotification(userMessage, errorType, shouldRetry)
  
  // Return structured error info
  return {
    type: errorType,
    message: userMessage,
    originalError: error,
    shouldRetry,
    timestamp: new Date().toISOString()
  }
}

// Extract user-friendly message from error text
function extractUserMessage(errorMessage) {
  const message = errorMessage.toLowerCase()
  
  if (message.includes('network') || message.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }
  
  if (message.includes('unauthorized') || message.includes('401')) {
    return ERROR_MESSAGES.UNAUTHORIZED
  }
  
  if (message.includes('forbidden') || message.includes('403')) {
    return ERROR_MESSAGES.FORBIDDEN
  }
  
  if (message.includes('not found') || message.includes('404')) {
    return ERROR_MESSAGES.PRODUCT_NOT_FOUND
  }
  
  if (message.includes('timeout')) {
    return ERROR_MESSAGES.TIMEOUT_ERROR
  }
  
  if (message.includes('server') || message.includes('500')) {
    return ERROR_MESSAGES.SERVER_ERROR
  }
  
  if (message.includes('email') && message.includes('exists')) {
    return ERROR_MESSAGES.USER_EXISTS
  }
  
  if (message.includes('invalid email')) {
    return ERROR_MESSAGES.INVALID_EMAIL
  }
  
  if (message.includes('password')) {
    return ERROR_MESSAGES.WEAK_PASSWORD
  }
  
  // Return original message if no pattern matches, but clean it up
  return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
}

// Determine error type from message
function determineErrorType(errorMessage) {
  const message = errorMessage.toLowerCase()
  
  if (message.includes('network') || message.includes('fetch')) return 'NETWORK_ERROR'
  if (message.includes('unauthorized') || message.includes('401')) return 'UNAUTHORIZED'
  if (message.includes('forbidden') || message.includes('403')) return 'FORBIDDEN'
  if (message.includes('not found') || message.includes('404')) return 'PRODUCT_NOT_FOUND'
  if (message.includes('timeout')) return 'TIMEOUT_ERROR'
  if (message.includes('server') || message.includes('500')) return 'SERVER_ERROR'
  if (message.includes('email') && message.includes('exists')) return 'USER_EXISTS'
  if (message.includes('invalid email')) return 'INVALID_EMAIL'
  if (message.includes('password')) return 'WEAK_PASSWORD'
  
  return 'UNKNOWN_ERROR'
}

// Check if error type is retryable
function isRetryableError(errorType) {
  const retryableErrors = [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'SERVER_ERROR'
  ]
  
  return retryableErrors.includes(errorType)
}

// Show error notification to user
function showErrorNotification(message, errorType, shouldRetry) {
  const isDevelopment = import.meta.env.DEV
  
  // In development, show additional context
  if (isDevelopment && ['NETWORK_ERROR', 'SERVER_ERROR'].includes(errorType)) {
    toast.showInfo('Development Mode', DEV_MESSAGES.API_NOT_READY)
    return
  }
  
  // Show retry option for retryable errors
  if (shouldRetry) {
    toast.showError('Connection Error', `${message} Please try again.`)
  } else {
    toast.showError('Error', message)
  }
}

// Specific error handlers for common scenarios
export const errorHandlers = {
  // Authentication errors
  auth: {
    loginFailed: (error) => {
      const handledError = handleApiError(error, 'login')
      return {
        ...handledError,
        redirectToLogin: handledError.type === 'UNAUTHORIZED'
      }
    },
    
    signupFailed: (error) => {
      return handleApiError(error, 'signup')
    },
    
    sessionExpired: () => {
      toast.showWarning('Session Expired', 'Please log in again to continue')
      // Could redirect to login page here
      return {
        type: 'TOKEN_EXPIRED',
        shouldRedirect: true,
        redirectPath: '/auth/login'
      }
    }
  },
  
  // Product-related errors
  product: {
    notFound: () => {
      toast.showError('Product Not Found', 'The requested product could not be found')
      return { type: 'PRODUCT_NOT_FOUND' }
    },
    
    loadFailed: (error) => {
      return handleApiError(error, 'product loading')
    }
  },
  
  // Cart-related errors
  cart: {
    addFailed: (error, productName) => {
      const handledError = handleApiError(error, 'add to cart')
      toast.showError('Add to Cart Failed', `Could not add ${productName} to cart`)
      return handledError
    },
    
    updateFailed: (error) => {
      return handleApiError(error, 'cart update')
    }
  },
  
  // Order-related errors
  order: {
    createFailed: (error) => {
      const handledError = handleApiError(error, 'order creation')
      if (handledError.type === 'PAYMENT_FAILED') {
        toast.showError('Payment Failed', 'Your payment could not be processed. Please try a different payment method.')
      }
      return handledError
    },
    
    trackingFailed: (error) => {
      return handleApiError(error, 'order tracking')
    }
  }
}

// Retry mechanism for failed requests
export class RetryHandler {
  constructor(maxRetries = 3, baseDelay = 1000) {
    this.maxRetries = maxRetries
    this.baseDelay = baseDelay
  }
  
  async retry(asyncFunction, errorHandler = handleApiError) {
    let lastError = null
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await asyncFunction()
      } catch (error) {
        lastError = error
        
        const handledError = errorHandler(error, `attempt ${attempt}`)
        
        // Don't retry non-retryable errors
        if (!handledError.shouldRetry) {
          throw error
        }
        
        // Don't retry on last attempt
        if (attempt === this.maxRetries) {
          throw error
        }
        
        // Wait before retrying (exponential backoff)
        const delay = this.baseDelay * Math.pow(2, attempt - 1)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        console.log(`Retrying after ${delay}ms (attempt ${attempt + 1}/${this.maxRetries})`)
      }
    }
    
    throw lastError
  }
}

export default {
  handleApiError,
  errorHandlers,
  ApiError,
  RetryHandler,
  ERROR_MESSAGES,
  DEV_MESSAGES
}
