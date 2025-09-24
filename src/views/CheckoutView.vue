<template>
  <div>
    <!-- Page Head -->
    <section class="page-head boxed">
      <h1 class="page-title">Checkout</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">Checkout</li>
      </ul>
    </section>

    <!-- Main Content -->
    <main class="layout-cart boxed">
      <form class="card" @submit.prevent="processCheckout">
        <div class="card-head">
          <h3 class="card-title">Contact information</h3>
        </div>
        <div class="card-body">
          <input type="hidden" v-model="stripeToken" name="token" />
          <div class="form-cols-2">
            <div class="form-group">
              <label for="firstname" class="form-label">First Name</label>
              <input 
                type="text" 
                class="form-field" 
                id="firstname" 
                name="firstname"
                v-model="checkoutForm.firstname"
                required
              />
            </div>
            <div class="form-group">
              <label for="lastname" class="form-label">Last Name</label>
              <input 
                type="text" 
                class="form-field" 
                id="lastname" 
                name="lastname"
                v-model="checkoutForm.lastname"
                required
              />
            </div>
          </div>
          <div class="form-cols-2">
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input 
                type="email" 
                class="form-field" 
                id="email" 
                name="email"
                v-model="checkoutForm.email"
                required
              />
            </div>
            <div class="form-group">
              <label for="phone" class="form-label">Phone Number</label>
              <input 
                type="text" 
                class="form-field" 
                id="phone" 
                name="phone"
                v-model="checkoutForm.phone"
                required
              />
            </div>
          </div>
          <div class="form-cols-2">
            <div class="form-group">
              <label for="country" class="form-label">Country</label>
              <input 
                type="text" 
                class="form-field" 
                id="country" 
                name="country"
                v-model="checkoutForm.country"
                required
              />
            </div>
            <div class="form-group">
              <label for="state" class="form-label">State</label>
              <input 
                type="text" 
                class="form-field" 
                id="state" 
                name="state"
                v-model="checkoutForm.state"
                required
              />
            </div>
            <div class="form-group">
              <label for="city" class="form-label">City</label>
              <input 
                type="text" 
                class="form-field" 
                id="city" 
                name="city"
                v-model="checkoutForm.city"
                required
              />
            </div>
            <div class="form-group">
              <label for="postal_code" class="form-label">Postal Code</label>
              <input 
                type="text" 
                class="form-field" 
                id="zip" 
                name="zip"
                v-model="checkoutForm.zip"
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label for="address_1" class="form-label">Address 1</label>
            <input 
              type="text" 
              class="form-field" 
              id="address_1" 
              name="address_1"
              v-model="checkoutForm.address_1"
              required
            />
          </div>
          <div class="form-group">
            <label for="address_2" class="form-label">Address 2</label>
            <input 
              type="text" 
              class="form-field" 
              id="address_2" 
              name="address_2"
              v-model="checkoutForm.address_2"
            />
          </div>
        </div>
        <div class="card-foot">
          <h3 class="card-title">Card information</h3>
          <div class="form-group">
            <div id="card-element" class="form-field"></div><br>
            <div id="card-errors" role="alert" style="color:red;"></div>
          </div>
        </div>
      </form>

      <div class="card card-summary">
        <div class="card-head">
          <h3 class="card-title">Summary</h3>
        </div>
        <div class="card-body">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="media">
              <div class="media-image">
                <img :src="item.image" :alt="item.title" class="image">
              </div>
              <div class="media-body">
                <h4 class="media-title">{{ item.title }}</h4>
                <p class="media-desc">Qty: {{ item.quantity }}</p>
                <p class="media-price">${{ item.price }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body">
          <h2 class="card-subtitle">
            <b>Sub Total</b> <b class="text-primary">${{ subtotal.toFixed(2) }}</b>
          </h2>
          <h3 class="card-title">
            <b>Total</b> <b class="text-primary">${{ total.toFixed(2) }}</b>
          </h3>
        </div>
        <div class="card-foot center">
          <button 
            class="btn btn-primary btn-lg btn-pill" 
            type="submit" 
            form="checkout-form"
            :disabled="loading || !stripeToken"
            @click="processCheckout"
          >
            {{ loading ? 'Processing...' : 'Checkout' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ApiUrl, apiRequest } from '@/utils/api'
import { showMessage } from '@/utils/message'

const router = useRouter()
const loading = ref(false)
const stripe = ref(null)
const cardElement = ref(null)
const stripeToken = ref('')
const cartItems = ref([])

const checkoutForm = reactive({
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  country: '',
  state: '',
  city: '',
  zip: '',
  address_1: '',
  address_2: ''
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const total = computed(() => {
  // Add any tax or shipping calculations here
  return subtotal.value
})

const loadCartItems = async () => {
  try {
    const response = await apiRequest(ApiUrl('nextash_store.events.cart.get_items'))
    cartItems.value = response.message || []
  } catch (error) {
    console.error('Error loading cart items:', error)
  }
}

const initializeStripe = async () => {
  try {
    // Get Stripe settings
    const settingsResponse = await apiRequest(ApiUrl('nextash_store.events.settings.get_stripe_key'))
    const stripePublicKey = settingsResponse.message?.stripe_public_key
    
    if (!stripePublicKey) {
      showMessage('Payment system not configured', 'error')
      return
    }
    
    // Load Stripe
    if (window.Stripe) {
      stripe.value = window.Stripe(stripePublicKey)
      const elements = stripe.value.elements()
      cardElement.value = elements.create('card', {
        style: {
          base: {
            color: "#fff",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            "::placeholder": {
              color: "#aab7c4",
            },
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        },
      })
      
      cardElement.value.mount('#card-element')
      
      cardElement.value.addEventListener('change', function (event) {
        const errors = document.getElementById('card-errors')
        if (event.error) {
          errors.textContent = event.error.message
          stripeToken.value = ''
        } else {
          errors.textContent = ''
          
          // Create token when card is complete
          if (event.complete) {
            stripe.value.createToken(cardElement.value).then(function (result) {
              if (result.error) {
                errors.textContent = result.error.message
                stripeToken.value = ''
              } else {
                stripeToken.value = result.token.id
              }
            })
          }
        }
      })
    }
  } catch (error) {
    console.error('Error initializing Stripe:', error)
    showMessage('Error initializing payment system', 'error')
  }
}

const processCheckout = async () => {
  if (!stripeToken.value) {
    showMessage('Please complete your card information', 'error')
    return
  }
  
  try {
    loading.value = true
    
    const checkoutData = {
      ...checkoutForm,
      token: stripeToken.value,
      items: cartItems.value,
      total: total.value
    }
    
    const response = await apiRequest(ApiUrl('nextash_store.events.cart.checkout'), {
      method: 'POST',
      body: JSON.stringify(checkoutData)
    })
    
    if (response.message) {
      showMessage('Order placed successfully!', 'success')
      router.push('/orders')
    }
  } catch (error) {
    showMessage('Error processing checkout: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadCartItems()
  await initializeStripe()
})
</script>
