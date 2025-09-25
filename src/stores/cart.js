import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([
    {
      id: 'sample-1',
      product_name: 'iPhone 15 Pro',
      product_title: 'iPhone 15 Pro',
      variation: 'Space Black',
      quantity: 1,
      price: 999.99,
      image: 'https://via.placeholder.com/150x150/007bff/ffffff?text=Phone'
    },
    {
      id: 'sample-2',
      product_name: 'MacBook Pro',
      product_title: 'MacBook Pro 16-inch',
      variation: 'Silver',
      quantity: 1,
      price: 2499.99,
      image: 'https://via.placeholder.com/150x150/28a745/ffffff?text=Laptop'
    }
  ])
  const loading = ref(false)
  const isOpen = ref(false)
  const addingToCart = ref({})

  // Computed properties
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      const price = parseFloat(item.price || 0)
      return total + (price * item.quantity)
    }, 0)
  })

  const tax = computed(() => {
    return subtotal.value * 0.1 // 10% tax
  })

  const total = computed(() => {
    return subtotal.value + tax.value
  })

  const isEmpty = computed(() => {
    return items.value.length === 0
  })

  // Local storage helpers
  const saveToLocalStorage = () => {
    localStorage.setItem('cart_items', JSON.stringify(items.value))
  }

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('cart_items')
      if (saved) {
        items.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }

  // Frontend-only actions
  const fetchCart = () => {
    loadFromLocalStorage()
  }

  const addToCart = (product, variation = null, quantity = 1) => {
    const productKey = product.name || product.id

    // Set individual product loading state
    addingToCart.value[productKey] = true

    try {
      const selectedVariation = variation || (product.variations && product.variations[0]) || { name: 'standard', price: product.price }

      const newItem = {
        id: `${product.name || product.id}_${selectedVariation.name || 'standard'}_${Date.now()}`,
        product_name: product.name || product.id,
        product_title: product.title || product.name,
        variation: selectedVariation.name || 'standard',
        quantity: quantity,
        price: parseFloat(selectedVariation.price || product.price || 0),
        image: product.featured_image || product.image || '/default-product.jpg'
      }

      // Check if item already exists and update quantity
      const existingItemIndex = items.value.findIndex(item =>
        item.product_name === newItem.product_name && item.variation === newItem.variation
      )

      if (existingItemIndex >= 0) {
        items.value[existingItemIndex].quantity += quantity
      } else {
        items.value.push(newItem)
      }

      saveToLocalStorage()
      return { success: true, message: 'Product added to cart!' }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, message: error.message || 'Failed to add product to cart' }
    } finally {
      addingToCart.value[productKey] = false
    }
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      return removeItem(itemId)
    }

    try {
      const item = items.value.find(item => item.id === itemId)
      if (item) {
        item.quantity = quantity
        saveToLocalStorage()
        return { success: true }
      } else {
        return { success: false, message: 'Item not found' }
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      return { success: false, message: error.message }
    }
  }

  const removeItem = (itemId) => {
    try {
      items.value = items.value.filter(item => item.id !== itemId)
      saveToLocalStorage()
      return { success: true }
    } catch (error) {
      console.error('Error removing item:', error)
      return { success: false, message: error.message }
    }
  }

  const clearCart = () => {
    try {
      items.value = []
      saveToLocalStorage()
      return { success: true }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { success: false, message: error.message }
    }
  }

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  const openCart = () => {
    isOpen.value = true
  }

  const closeCart = () => {
    isOpen.value = false
  }

  // Helper functions for addingToCart state
  const isAddingToCart = (productName) => {
    return !!addingToCart.value[productName]
  }

  const setAddingToCart = (productName, isAdding) => {
    addingToCart.value[productName] = isAdding
  }

  const clearAddingToCart = () => {
    addingToCart.value = {}
  }

  // Initialize cart on store creation
  const initializeCart = () => {
    loadFromLocalStorage()
  }

  return {
    items,
    loading,
    isOpen,
    addingToCart,
    itemCount,
    subtotal,
    tax,
    total,
    isEmpty,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    isAddingToCart,
    setAddingToCart,
    clearAddingToCart,
    initializeCart
  }
})
