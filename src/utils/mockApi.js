// Mock API service for frontend development when backend API is not ready
import { toast } from '@/utils/toast'

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data storage (simulates database)
const mockData = {
  users: [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      user_image: null,
      phone: '+1234567890'
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith', 
      email: 'jane@example.com',
      user_image: null,
      phone: '+1234567891'
    }
  ],
  
  orders: [
    {
      id: 'ORD-001',
      user_email: 'john@example.com',
      status: 'delivered',
      items: [
        {
          product_name: 'nxt-theme',
          variation: 'personal',
          quantity: 1,
          price: 350
        }
      ],
      total: 350,
      date: '2024-01-15',
      tracking_number: 'TRK-123456789'
    },
    {
      id: 'ORD-002',
      user_email: 'john@example.com',
      status: 'processing',
      items: [
        {
          product_name: 'pos-awesome',
          variation: 'commercial',
          quantity: 1,
          price: 700
        }
      ],
      total: 700,
      date: '2024-01-20',
      tracking_number: 'TRK-987654321'
    }
  ],

  currentUser: null,
  isLoggedIn: false
}

// Helper function to find user by email
const findUserByEmail = (email) => {
  return mockData.users.find(user => user.email === email)
}

// Helper function to simulate API response format
const createApiResponse = (data, success = true, message = '') => {
  return {
    success,
    message: success ? message || 'Operation completed successfully' : message || 'Operation failed',
    data
  }
}

// Mock API methods
export const mockApi = {
  // Authentication APIs
  auth: {
    async login(credentials) {
      await delay(1000)
      
      const { email, password } = credentials
      
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      
      const user = findUserByEmail(email)
      
      if (!user) {
        throw new Error('Invalid email or password')
      }
      
      // Simulate successful login
      mockData.currentUser = user
      mockData.isLoggedIn = true
      
      return createApiResponse({
        user,
        token: 'mock-jwt-token-' + Date.now()
      }, true, 'Login successful')
    },

    async signup(userData) {
      await delay(1500)
      
      const { first_name, last_name, email, password } = userData
      
      if (!first_name || !last_name || !email || !password) {
        throw new Error('All fields are required')
      }
      
      // Check if user already exists
      const existingUser = findUserByEmail(email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
      
      // Create new user
      const newUser = {
        id: mockData.users.length + 1,
        first_name,
        last_name,
        email,
        user_image: null,
        phone: userData.phone || null
      }
      
      mockData.users.push(newUser)
      mockData.currentUser = newUser
      mockData.isLoggedIn = true
      
      return createApiResponse({
        user: newUser,
        token: 'mock-jwt-token-' + Date.now()
      }, true, 'Account created successfully')
    },

    async logout() {
      await delay(500)
      
      mockData.currentUser = null
      mockData.isLoggedIn = false
      
      return createApiResponse(null, true, 'Logout successful')
    },

    async checkAuth() {
      await delay(300)
      
      if (mockData.isLoggedIn && mockData.currentUser) {
        return createApiResponse({
          user: mockData.currentUser
        }, true, 'User authenticated')
      }
      
      throw new Error('User not authenticated')
    },

    async forgotPassword(email) {
      await delay(1000)
      
      if (!email) {
        throw new Error('Email is required')
      }
      
      const user = findUserByEmail(email)
      if (!user) {
        throw new Error('No account found with this email address')
      }
      
      return createApiResponse(null, true, 'Password reset email sent')
    },

    async resetPassword(token, newPassword) {
      await delay(1000)
      
      if (!token || !newPassword) {
        throw new Error('Token and new password are required')
      }
      
      return createApiResponse(null, true, 'Password reset successful')
    }
  },

  // Products APIs
  products: {
    async getAll() {
      await delay(500)
      
      // This would come from products store allProducts
      return createApiResponse([], true, 'Products fetched successfully')
    },

    async getByName(name) {
      await delay(300)
      
      if (!name) {
        throw new Error('Product name is required')
      }
      
      return createApiResponse(null, true, 'Product fetched successfully')
    },

    async search(query) {
      await delay(400)
      
      return createApiResponse([], true, 'Search completed successfully')
    }
  },

  // Cart APIs
  cart: {
    async get() {
      await delay(300)
      
      // Return empty cart for mock
      return createApiResponse([], true, 'Cart fetched successfully')
    },

    async add(productData) {
      await delay(500)
      
      if (!productData) {
        throw new Error('Product data is required')
      }
      
      return createApiResponse(productData, true, 'Product added to cart')
    },

    async update(itemId, quantity) {
      await delay(300)
      
      if (!itemId || quantity < 0) {
        throw new Error('Valid item ID and quantity are required')
      }
      
      return createApiResponse({ itemId, quantity }, true, 'Cart updated successfully')
    },

    async remove(itemId) {
      await delay(300)
      
      if (!itemId) {
        throw new Error('Item ID is required')
      }
      
      return createApiResponse(null, true, 'Item removed from cart')
    },

    async clear() {
      await delay(400)
      
      return createApiResponse(null, true, 'Cart cleared successfully')
    }
  },

  // Orders APIs
  orders: {
    async create(orderData) {
      await delay(2000) // Longer delay for order processing
      
      if (!orderData || !orderData.items || orderData.items.length === 0) {
        throw new Error('Order data with items is required')
      }
      
      const newOrder = {
        id: 'ORD-' + String(Date.now()).slice(-6),
        user_email: mockData.currentUser?.email || 'guest@example.com',
        status: 'processing',
        items: orderData.items,
        total: orderData.total || 0,
        date: new Date().toISOString().split('T')[0],
        tracking_number: 'TRK-' + Math.random().toString(36).substring(2, 11).toUpperCase(),
        billing_address: orderData.billing_address,
        payment_method: orderData.payment_method
      }
      
      mockData.orders.push(newOrder)
      
      return createApiResponse(newOrder, true, 'Order created successfully')
    },

    async getAll() {
      await delay(600)
      
      if (!mockData.isLoggedIn || !mockData.currentUser) {
        throw new Error('User must be logged in to view orders')
      }
      
      const userOrders = mockData.orders.filter(
        order => order.user_email === mockData.currentUser.email
      )
      
      return createApiResponse(userOrders, true, 'Orders fetched successfully')
    },

    async getById(orderId) {
      await delay(400)
      
      if (!orderId) {
        throw new Error('Order ID is required')
      }
      
      const order = mockData.orders.find(order => order.id === orderId)
      
      if (!order) {
        throw new Error('Order not found')
      }
      
      if (mockData.currentUser && order.user_email !== mockData.currentUser.email) {
        throw new Error('Unauthorized to view this order')
      }
      
      return createApiResponse(order, true, 'Order fetched successfully')
    },

    async track(trackingNumber) {
      await delay(800)
      
      if (!trackingNumber) {
        throw new Error('Tracking number is required')
      }
      
      const order = mockData.orders.find(order => order.tracking_number === trackingNumber)
      
      if (!order) {
        throw new Error('Order not found with this tracking number')
      }
      
      // Mock tracking data
      const trackingData = {
        tracking_number: trackingNumber,
        status: order.status,
        history: [
          {
            status: 'order_placed',
            message: 'Order has been placed',
            date: order.date,
            location: 'Online Store'
          },
          {
            status: 'processing',
            message: 'Order is being processed',
            date: order.date,
            location: 'Fulfillment Center'
          }
        ]
      }
      
      if (order.status === 'shipped' || order.status === 'delivered') {
        trackingData.history.push({
          status: 'shipped',
          message: 'Order has been shipped',
          date: order.date,
          location: 'Shipping Facility'
        })
      }
      
      if (order.status === 'delivered') {
        trackingData.history.push({
          status: 'delivered',
          message: 'Order has been delivered',
          date: order.date,
          location: 'Customer Address'
        })
      }
      
      return createApiResponse(trackingData, true, 'Tracking information retrieved')
    }
  },

  // Profile APIs
  profile: {
    async get() {
      await delay(400)
      
      if (!mockData.isLoggedIn || !mockData.currentUser) {
        throw new Error('User must be logged in')
      }
      
      return createApiResponse(mockData.currentUser, true, 'Profile fetched successfully')
    },

    async update(profileData) {
      await delay(800)
      
      if (!mockData.isLoggedIn || !mockData.currentUser) {
        throw new Error('User must be logged in')
      }
      
      // Update current user data
      Object.assign(mockData.currentUser, profileData)
      
      // Update in users array
      const userIndex = mockData.users.findIndex(user => user.id === mockData.currentUser.id)
      if (userIndex >= 0) {
        mockData.users[userIndex] = { ...mockData.currentUser }
      }
      
      return createApiResponse(mockData.currentUser, true, 'Profile updated successfully')
    }
  },

  // Contact APIs
  contact: {
    async submit(contactData) {
      await delay(1500)
      
      if (!contactData || !contactData.name || !contactData.email || !contactData.message) {
        throw new Error('Name, email, and message are required')
      }
      
      return createApiResponse(null, true, 'Your message has been sent successfully. We will get back to you soon.')
    }
  }
}

// Enhanced API request wrapper that uses mock API when real API fails
export async function mockApiRequest(url, options = {}) {
  try {
    // Try real API first if available
    const response = await fetch(url, options)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.warn('Real API failed, using mock API:', error.message)
    
    // Use mock API as fallback
    return handleMockApiCall(url, options)
  }
}

// Route mock API calls to appropriate handlers
function handleMockApiCall(url, options = {}) {
  const method = options.method || 'GET'
  const body = options.body ? JSON.parse(options.body) : {}
  
  // Extract API endpoint from URL
  const urlParts = url.split('/')
  const endpoint = urlParts[urlParts.length - 1]
  
  // Route to appropriate mock API handler
  try {
    if (endpoint.includes('auth.login') || endpoint === 'login') {
      return mockApi.auth.login(body)
    }
    
    if (endpoint.includes('auth.signup') || endpoint === 'signup') {
      return mockApi.auth.signup(body)
    }
    
    if (endpoint.includes('auth.logout') || endpoint === 'logout') {
      return mockApi.auth.logout()
    }
    
    if (endpoint.includes('auth.check') || endpoint === 'check-auth') {
      return mockApi.auth.checkAuth()
    }
    
    if (endpoint.includes('forgot-password')) {
      return mockApi.auth.forgotPassword(body.email)
    }
    
    if (endpoint.includes('reset-password')) {
      return mockApi.auth.resetPassword(body.token, body.password)
    }
    
    if (endpoint.includes('products') && method === 'GET') {
      return mockApi.products.getAll()
    }
    
    if (endpoint.includes('cart') && method === 'GET') {
      return mockApi.cart.get()
    }
    
    if (endpoint.includes('cart') && method === 'POST') {
      return mockApi.cart.add(body)
    }
    
    if (endpoint.includes('orders') && method === 'POST') {
      return mockApi.orders.create(body)
    }
    
    if (endpoint.includes('orders') && method === 'GET') {
      return mockApi.orders.getAll()
    }
    
    if (endpoint.includes('track') && method === 'GET') {
      return mockApi.orders.track(body.tracking_number)
    }
    
    if (endpoint.includes('profile') && method === 'GET') {
      return mockApi.profile.get()
    }
    
    if (endpoint.includes('profile') && method === 'POST') {
      return mockApi.profile.update(body)
    }
    
    if (endpoint.includes('contact') && method === 'POST') {
      return mockApi.contact.submit(body)
    }
    
    // Default fallback
    return Promise.resolve(createApiResponse(null, true, 'Mock API response'))
    
  } catch (error) {
    console.error('Mock API error:', error)
    throw error
  }
}

// Export enhanced API request function
export { mockApiRequest as apiRequest }
