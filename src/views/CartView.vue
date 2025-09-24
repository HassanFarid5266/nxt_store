<template>
  <div>
    <!-- Page Head -->
    <section class="page-head boxed">
      <h1 class="page-title">Cart</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">Cart</li>
      </ul>
    </section>

    <!-- Main Content -->
    <main class="layout-cart boxed">
      <div class="card">
        <div class="card-head">
          <h3 class="card-title">Products <span id="count">({{ cartItems.length }})</span></h3>
        </div>
        <div class="card-body">
          <div v-if="loading" class="loading">Loading cart items...</div>
          
          <div v-else-if="cartItems.length === 0" class="no-records">
            <p>Your cart is empty!</p>
            <router-link to="/shop" class="btn btn-primary btn-sm">Start Shopping</router-link>
          </div>
          
          <div v-else class="cart-items-list">
            <div 
              v-for="item in cartItems" 
              :key="item.id || item.name" 
              class="cart-item-card"
            >
              <div class="cart-item-image">
                <img :src="item.image" :alt="item.title" class="image" />
              </div>
              
              <div class="cart-item-details">
                <h4 class="cart-item-title">{{ item.title }}</h4>
                <p v-if="item.variation" class="cart-item-variation">{{ item.variation }}</p>
                <div class="cart-item-price">
                  <span class="price">${{ item.price }}</span>
                  <span v-if="item.original_price && item.original_price !== item.price" class="original-price">
                    <del>${{ item.original_price }}</del>
                  </span>
                </div>
              </div>
              
              <div class="cart-item-actions">
                <div class="quantity-controls">
                  <button 
                    @click="updateQuantity(item.id || item.name, (item.quantity || 1) - 1)" 
                    class="btn btn-sm btn-quantity"
                    :disabled="loading"
                  >
                    -
                  </button>
                  <span class="quantity">{{ item.quantity || 1 }}</span>
                  <button 
                    @click="updateQuantity(item.id || item.name, (item.quantity || 1) + 1)" 
                    class="btn btn-sm btn-quantity"
                    :disabled="loading"
                  >
                    +
                  </button>
                </div>
                
                <div class="item-total-price">
                  ${{ ((item.price || 0) * (item.quantity || 1)).toFixed(2) }}
                </div>
                
                <button 
                  @click="removeItem(item.id || item.name)" 
                  class="btn btn-sm btn-remove"
                  :disabled="loading"
                >
                  <i class="bx bx-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="hasMore" class="card-foot center">
          <button 
            class="btn btn-primary btn-sm btn-pill" 
            @click="loadMore"
            :disabled="loading"
          >
            {{ loading ? 'Loading...' : 'Load more' }}
          </button>
        </div>
      </div>
      
      <!-- Cart Summary -->
      <div class="card card-summary">
        <div class="card-head">
          <h3 class="card-title">Cart</h3>
        </div>
        <div class="card-body">
          <h3 class="card-subtitle">
            <b>Tax</b> 
            <b class="text-primary">${{ tax.toFixed(2) }}</b>
          </h3>
          <h3 class="card-subtitle">
            <b>Sub Total</b> 
            <b class="text-primary" id="subtotal">${{ subtotal.toFixed(2) }}</b>
          </h3>
        </div>
        <div class="card-body">
          <h2 class="card-title">
            <b>Total</b> 
            <b class="text-primary" id="total">${{ total.toFixed(2) }}</b>
          </h2>
        </div>
        <div class="card-foot center">
          <p class="card-desc">Payments methods we accept</p>
          <p class="card-desc">
            <img src="@/assets/images/cards.webp" width="150" alt="Payment methods" />
          </p>
          <router-link 
            to="/checkout" 
            class="btn btn-primary btn-pill"
            :class="{ disabled: cartItems.length === 0 }"
          >
            Checkout
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ApiUrl, apiRequest } from '@/utils/api'
import { showMessage } from '@/utils/message'

const cartItems = ref([])
const loading = ref(false)
const hasMore = ref(false)
const currentPage = ref(1)

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + ((item.price || 0) * (item.quantity || 1))
  }, 0)
})

const tax = computed(() => {
  return subtotal.value * 0.1 // 10% tax
})

const total = computed(() => {
  return subtotal.value + tax.value
})

const fetchCart = async (page = 1, append = false) => {
  loading.value = true
  
  try {
    const params = new URLSearchParams({
      limit: 10,
      page: page
    })
    
    const response = await apiRequest(ApiUrl(`nextash_store.events.cart.listing?${params}`))
    const data = response.message
    
    if (data.count === 0) {
      cartItems.value = []
    } else {
      if (append) {
        cartItems.value = [...cartItems.value, ...data.results]
      } else {
        cartItems.value = data.results
      }
    }
    
    hasMore.value = !!data.next
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching cart:', error)
    showMessage('Failed to load cart items', 'error')
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (hasMore.value) {
    fetchCart(currentPage.value + 1, true)
  }
}

const updateQuantity = async (itemId, newQuantity) => {
  if (newQuantity < 1) {
    await removeItem(itemId)
    return
  }
  
  try {
    await apiRequest(ApiUrl('nextash_store.events.cart.update'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': document.getElementById('csrf_token')?.value
      },
      body: JSON.stringify({
        item_id: itemId,
        quantity: newQuantity
      })
    })
    
    // Update local state
    const item = cartItems.value.find(item => (item.id || item.name) === itemId)
    if (item) {
      item.quantity = newQuantity
    }
    
    showMessage('Cart updated successfully', 'success')
  } catch (error) {
    console.error('Error updating quantity:', error)
    showMessage('Failed to update cart', 'error')
  }
}

const removeItem = async (itemId) => {
  if (!confirm('Are you sure you want to remove this item?')) {
    return
  }
  
  try {
    await apiRequest(ApiUrl('nextash_store.events.cart.delete'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': document.getElementById('csrf_token')?.value
      },
      body: JSON.stringify({
        item_id: itemId
      })
    })
    
    // Remove from local state
    cartItems.value = cartItems.value.filter(item => (item.id || item.name) !== itemId)
    
    showMessage('Item removed from cart', 'success')
  } catch (error) {
    console.error('Error removing item:', error)
    showMessage('Failed to remove item', 'error')
  }
}

onMounted(() => {
  fetchCart()
})
</script>

<style scoped>
.layout-cart {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  padding: 2rem 0;
}

.card {
  background: var(--dark);
  border-radius: var(--rounded);
  box-shadow: var(--shadow);
}

.card-head {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.card-body {
  padding: 1.5rem;
}

.card-foot {
  padding: 1.5rem;
  border-top: 1px solid var(--border);
}

.center {
  text-align: center;
}

.loading, .no-records {
  text-align: center;
  padding: 2rem;
  color: var(--muted);
}

.no-records p {
  margin-bottom: 1rem;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item-card {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: var(--body);
  border-radius: var(--rounded);
  border: 1px solid var(--border);
}

.cart-item-image .image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--rounded);
}

.cart-item-details {
  flex: 1;
}

.cart-item-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text);
}

.cart-item-variation {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: var(--muted);
}

.cart-item-price .price {
  font-weight: 600;
  color: var(--primary);
}

.cart-item-price .original-price {
  margin-left: 0.5rem;
  color: var(--muted);
  font-size: 0.875rem;
}

.cart-item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-quantity {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--rounded);
  cursor: pointer;
}

.btn-quantity:hover {
  background: var(--primary-hover);
}

.btn-quantity:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 2rem;
  text-align: center;
  font-weight: 500;
  padding: 0.25rem;
}

.item-total-price {
  font-weight: 600;
  color: var(--primary);
}

.btn-remove {
  background: var(--danger);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: var(--rounded);
  cursor: pointer;
}

.btn-remove:hover {
  background: var(--danger-hover);
}

.card-summary {
  height: fit-content;
}

.card-subtitle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.text-primary {
  color: var(--primary);
}

.card-desc {
  color: var(--muted);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.btn-pill {
  border-radius: 50px;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

@media (max-width: 768px) {
  .layout-cart {
    grid-template-columns: 1fr;
  }
  
  .cart-item-card {
    grid-template-columns: 60px 1fr;
    gap: 0.75rem;
  }
  
  .cart-item-actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 0.5rem;
  }
}
</style>
