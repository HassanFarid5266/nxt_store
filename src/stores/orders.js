import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from '@/utils/toast'
import { showMessage } from '@/utils/message'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref([])
  const currentOrder = ref(null)
  const loading = ref(false)
  const notifications = ref([])

  // Order status definitions
  const ORDER_STATUSES = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed', 
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  }

  const STATUS_LABELS = {
    [ORDER_STATUSES.PENDING]: 'Awaiting Payment',
    [ORDER_STATUSES.CONFIRMED]: 'Payment Confirmed',
    [ORDER_STATUSES.PROCESSING]: 'Processing Order',
    [ORDER_STATUSES.SHIPPED]: 'Shipped',
    [ORDER_STATUSES.DELIVERED]: 'Delivered',
    [ORDER_STATUSES.CANCELLED]: 'Cancelled'
  }

  const STATUS_COLORS = {
    [ORDER_STATUSES.PENDING]: 'warning',
    [ORDER_STATUSES.CONFIRMED]: 'info',
    [ORDER_STATUSES.PROCESSING]: 'primary',
    [ORDER_STATUSES.SHIPPED]: 'success',
    [ORDER_STATUSES.DELIVERED]: 'success',
    [ORDER_STATUSES.CANCELLED]: 'danger'
  }

  // Computed properties
  const pendingOrders = computed(() => 
    orders.value.filter(order => order.status === ORDER_STATUSES.PENDING)
  )

  const activeOrders = computed(() => 
    orders.value.filter(order => 
      [ORDER_STATUSES.CONFIRMED, ORDER_STATUSES.PROCESSING, ORDER_STATUSES.SHIPPED].includes(order.status)
    )
  )

  const completedOrders = computed(() => 
    orders.value.filter(order => 
      [ORDER_STATUSES.DELIVERED, ORDER_STATUSES.CANCELLED].includes(order.status)
    )
  )

  const recentOrders = computed(() => 
    orders.value
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
  )

  // Helper functions
  const getStatusLabel = (status) => STATUS_LABELS[status] || status
  const getStatusColor = (status) => STATUS_COLORS[status] || 'secondary'

  // Order tracking functions
  const trackOrderStatus = (orderId, currentStatus) => {
    const steps = [
      { status: ORDER_STATUSES.PENDING, label: 'Order Placed', completed: true },
      { status: ORDER_STATUSES.CONFIRMED, label: 'Payment Confirmed', completed: false },
      { status: ORDER_STATUSES.PROCESSING, label: 'Processing', completed: false },
      { status: ORDER_STATUSES.SHIPPED, label: 'Shipped', completed: false },
      { status: ORDER_STATUSES.DELIVERED, label: 'Delivered', completed: false }
    ]

    const statusIndex = steps.findIndex(step => step.status === currentStatus)
    
    if (statusIndex >= 0) {
      for (let i = 0; i <= statusIndex; i++) {
        steps[i].completed = true
      }
    }

    return steps
  }

  // Order creation and management
  const createOrder = (orderData) => {
    const order = {
      id: orderData.id || 'ORD-' + Date.now(),
      customer_name: `${orderData.firstname} ${orderData.lastname}`,
      email: orderData.email,
      phone: orderData.phone,
      payment_method: orderData.payment_method,
      payment_id: orderData.payment_id || null,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      total: orderData.total,
      status: orderData.payment_method === 'card' ? ORDER_STATUSES.CONFIRMED : ORDER_STATUSES.PENDING,
      items: orderData.items || [],
      shipping_address: {
        city: orderData.city,
        country: orderData.country,
        phone: orderData.phone
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    orders.value.unshift(order)
    saveOrdersToStorage()
    
    // Add notification
    addNotification({
      type: 'order_created',
      title: 'Order Created',
      message: `Order #${order.id} has been created successfully`,
      orderId: order.id,
      timestamp: new Date().toISOString()
    })

    return order
  }

  const updateOrderStatus = (orderId, newStatus, trackingNumber = null) => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order) return false

    const oldStatus = order.status
    order.status = newStatus
    order.updated_at = new Date().toISOString()
    
    if (trackingNumber) {
      order.tracking_number = trackingNumber
    }

    saveOrdersToStorage()

    // Add status change notification
    addNotification({
      type: 'status_change',
      title: 'Order Status Updated',
      message: `Order #${orderId} status changed from ${getStatusLabel(oldStatus)} to ${getStatusLabel(newStatus)}`,
      orderId: orderId,
      timestamp: new Date().toISOString()
    })

    // Show toast notification
    toast.showSuccess('Order Updated', `Order #${orderId} is now ${getStatusLabel(newStatus)}`)

    return true
  }

  const cancelOrder = (orderId) => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order) return false

    if (order.status === ORDER_STATUSES.SHIPPED || order.status === ORDER_STATUSES.DELIVERED) {
      showMessage('Cannot cancel order that has already been shipped', 'error')
      return false
    }

    order.status = ORDER_STATUSES.CANCELLED
    order.updated_at = new Date().toISOString()
    saveOrdersToStorage()

    addNotification({
      type: 'order_cancelled',
      title: 'Order Cancelled',
      message: `Order #${orderId} has been cancelled`,
      orderId: orderId,
      timestamp: new Date().toISOString()
    })

    toast.showSuccess('Order Cancelled', `Order #${orderId} has been cancelled`)
    return true
  }

  // Notification management
  const addNotification = (notification) => {
    notifications.value.unshift({
      id: Date.now(),
      read: false,
      ...notification
    })
    
    // Keep only last 50 notifications
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
    
    saveNotificationsToStorage()
  }

  const markNotificationAsRead = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      saveNotificationsToStorage()
    }
  }

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach(n => n.read = true)
    saveNotificationsToStorage()
  }

  const unreadNotificationsCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  // Storage functions
  const saveOrdersToStorage = () => {
    localStorage.setItem('user_orders', JSON.stringify(orders.value))
  }

  const loadOrdersFromStorage = () => {
    try {
      const saved = localStorage.getItem('user_orders')
      if (saved) {
        orders.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading orders from storage:', error)
    }
  }

  const saveNotificationsToStorage = () => {
    localStorage.setItem('order_notifications', JSON.stringify(notifications.value))
  }

  const loadNotificationsFromStorage = () => {
    try {
      const saved = localStorage.getItem('order_notifications')
      if (saved) {
        notifications.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error)
    }
  }

  // Mock data for demonstration
  const addMockOrders = () => {
    if (orders.value.length === 0) {
      const mockOrders = [
        {
          id: 'ORD-1672531200000',
          customer_name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          payment_method: 'card',
          payment_id: 'PAY_123456',
          subtotal: 99.99,
          tax: 10.00,
          total: 109.99,
          status: ORDER_STATUSES.SHIPPED,
          tracking_number: 'TRK123456789',
          items: [
            { id: 1, name: 'Sample Product', quantity: 1, price: 99.99 }
          ],
          shipping_address: {
            city: 'New York',
            country: 'USA',
            phone: '+1234567890'
          },
          created_at: '2023-12-01T10:00:00Z',
          updated_at: '2023-12-03T14:30:00Z'
        }
      ]
      
      orders.value = mockOrders
      saveOrdersToStorage()
    }
  }

  // Initialize store
  const initializeStore = () => {
    loadOrdersFromStorage()
    loadNotificationsFromStorage()
    addMockOrders()
  }

  // Simulate order status progression for demo
  const simulateOrderProgress = (orderId) => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order) return

    const statusProgression = [
      ORDER_STATUSES.CONFIRMED,
      ORDER_STATUSES.PROCESSING,
      ORDER_STATUSES.SHIPPED,
      ORDER_STATUSES.DELIVERED
    ]

    let currentIndex = statusProgression.indexOf(order.status)
    if (currentIndex < statusProgression.length - 1) {
      setTimeout(() => {
        updateOrderStatus(orderId, statusProgression[currentIndex + 1], 
          statusProgression[currentIndex + 1] === ORDER_STATUSES.SHIPPED ? 'TRK' + Date.now() : null)
      }, 3000)
    }
  }

  return {
    // State
    orders,
    currentOrder,
    loading,
    notifications,
    
    // Constants
    ORDER_STATUSES,
    STATUS_LABELS,
    STATUS_COLORS,
    
    // Computed
    pendingOrders,
    activeOrders,
    completedOrders,
    recentOrders,
    unreadNotificationsCount,
    
    // Order management
    createOrder,
    updateOrderStatus,
    cancelOrder,
    trackOrderStatus,
    
    // Helpers
    getStatusLabel,
    getStatusColor,
    
    // Notifications
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    
    // Demo functions
    simulateOrderProgress,
    initializeStore
  }
})
