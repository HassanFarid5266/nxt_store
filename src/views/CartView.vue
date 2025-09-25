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
          
          <div v-else-if="cartItems.length === 0" class="empty-cart">
            <div class="empty-cart-icon">
              <i class="bx bx-cart"></i>
            </div>
            <h3 class="empty-cart-title">Your cart is empty</h3>
            <p class="empty-cart-message">Looks like you haven't added any items to your cart yet.</p>
            <router-link to="/shop" class="btn btn-primary btn-pill">Start Shopping</router-link>
          </div>
          
          <div v-else class="cart-items-list">
            <div
              v-for="item in cartItems"
              :key="item.id || item.name"
              class="cart-item-card"
            >
              <div class="cart-item-image">
                <img :src="item.image" :alt="item.title" class="product-image" />
              </div>

              <div class="cart-item-content">
                <div class="cart-item-header">
                  <h4 class="cart-item-title">{{ item.product_title || item.title }}</h4>
                  <button
                    @click="removeItem(item.id || item.name)"
                    class="remove-btn"
                    :disabled="loading"
                    title="Remove item"
                  >
                    <i class="bx bx-x"></i>
                  </button>
                </div>

                <p v-if="item.variation" class="cart-item-variation">
                  <span class="variation-label">Variant:</span> {{ item.variation }}
                </p>

                <div class="cart-item-footer">
                  <div class="cart-item-price">
                    <span class="current-price">${{ item.price }}</span>
                    <span v-if="item.original_price && item.original_price !== item.price" class="original-price">
                      <del>${{ item.original_price }}</del>
                    </span>
                  </div>

                  <div class="quantity-controls">
                    <button
                      @click="updateQuantity(item.id || item.name, (item.quantity || 1) - 1)"
                      class="quantity-btn quantity-decrease"
                      :disabled="loading || (item.quantity || 1) <= 1"
                    >
                      <i class="bx bx-minus"></i>
                    </button>
                    <span class="quantity-display">{{ item.quantity || 1 }}</span>
                    <button
                      @click="updateQuantity(item.id || item.name, (item.quantity || 1) + 1)"
                      class="quantity-btn quantity-increase"
                      :disabled="loading"
                    >
                      <i class="bx bx-plus"></i>
                    </button>
                  </div>

                  <div class="item-total-price">
                    <span class="total-label">Total:</span>
                    <span class="total-amount">${{ ((item.price || 0) * (item.quantity || 1)).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import { onMounted, computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

// Use cart store data
const cartItems = computed(() => cartStore.items)
const loading = computed(() => cartStore.loading)
const subtotal = computed(() => cartStore.subtotal)
const tax = computed(() => cartStore.tax)
const total = computed(() => cartStore.total)

const updateQuantity = (itemId, newQuantity) => {
  cartStore.updateQuantity(itemId, newQuantity)
}

const removeItem = (itemId) => {
  if (!confirm('Are you sure you want to remove this item?')) {
    return
  }

  cartStore.removeItem(itemId)
}

onMounted(() => {
  cartStore.initializeCart()
})
</script>
