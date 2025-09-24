import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiRequest, ApiUrl } from '@/utils/api'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)
  const isOpen = ref(false)

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

  // Actions
  const fetchCart = async () => {
    loading.value = true
    try {
      const params = new URLSearchParams({
        page: '1',
        page_size: '50'
      })
      
      const response = await apiRequest(ApiUrl(`nextash_store.events.cart.listing?${params}`))
      
      if (response && response.data) {
        items.value = response.data.map(item => ({
          id: item.name,
          product_name: item.product,
          product_title: item.product_title || item.product,
          variation: item.variation || 'standard',
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
          image: item.image || '/default-product.jpg',
          ...item
        }))
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      // Keep existing items on error
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (product, variation = null, quantity = 1) => {
    loading.value = true
    try {
      const selectedVariation = variation || (product.variations && product.variations[0]) || null
      
      if (!selectedVariation) {
        throw new Error('No variation selected')
      }

      const cartData = {
        product: product.name,
        product_title: product.title,
        variation: selectedVariation.name || 'standard',
        quantity: quantity,
        price: parseFloat(selectedVariation.price),
        image: product.featured_image || product.image
      }

      const response = await apiRequest(ApiUrl('nextash_store.events.cart.create'), {
        method: 'POST',
        body: JSON.stringify(cartData)
      })

      if (response && response.success) {
        // Refresh cart after adding item
        await fetchCart()
        return { success: true, message: 'Product added to cart successfully!' }
      } else {
        throw new Error(response?.message || 'Failed to add product to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, message: error.message || 'Failed to add product to cart' }
    } finally {
      loading.value = false
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeItem(itemId)
    }

    loading.value = true
    try {
      const response = await apiRequest(ApiUrl('nextash_store.events.cart.update'), {
        method: 'POST',
        body: JSON.stringify({
          item_id: itemId,
          quantity: quantity
        })
      })

      if (response && response.success) {
        // Update local state
        const item = items.value.find(item => item.id === itemId)
        if (item) {
          item.quantity = quantity
        }
        return { success: true }
      } else {
        throw new Error(response?.message || 'Failed to update quantity')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const removeItem = async (itemId) => {
    loading.value = true
    try {
      const response = await apiRequest(ApiUrl('nextash_store.events.cart.delete'), {
        method: 'POST',
        body: JSON.stringify({
          item_id: itemId
        })
      })

      if (response && response.success) {
        // Remove from local state
        items.value = items.value.filter(item => item.id !== itemId)
        return { success: true }
      } else {
        throw new Error(response?.message || 'Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    loading.value = true
    try {
      // Remove all items one by one
      const removePromises = items.value.map(item => removeItem(item.id))
      await Promise.all(removePromises)
      
      items.value = []
      return { success: true }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { success: false, message: error.message }
    } finally {
      loading.value = false
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

  // Initialize cart on store creation
  const initializeCart = async () => {
    await fetchCart()
  }

  return {
    items,
    loading,
    isOpen,
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
    initializeCart
  }
})
