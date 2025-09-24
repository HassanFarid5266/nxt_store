<template>
  <main class="layout-cart boxed">
    <form class="card" @submit.prevent="processCheckout" id="checkout">
      <div class="card-head">
        <h3 class="card-title">Contact information</h3>
      </div>
      <div class="card-body">
        <input type="hidden" v-model="stripeToken" name="token" />
        
        <!-- Name Fields -->
        <div class="form-cols-2">
          <div class="form-group">
            <label for="firstname" class="form-label">First Name</label>
            <input 
              type="text" 
              class="form-field" 
              id="firstname" 
              name="firstname"
              v-model="form.firstname"
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
              v-model="form.lastname"
              required
            />
          </div>
        </div>

        <!-- Contact Fields -->
        <div class="form-cols-2">
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input 
              type="email" 
              class="form-field" 
              id="email" 
              name="email"
              v-model="form.email"
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
              v-model="form.phone"
              required
            />
          </div>
        </div>

        <!-- Location Fields -->
        <div class="form-cols-2">
          <div class="form-group">
            <label for="country" class="form-label">Country</label>
            <input 
              type="text" 
              class="form-field" 
              id="country" 
              name="country"
              v-model="form.country"
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
              v-model="form.state"
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
              v-model="form.city"
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
              v-model="form.zip"
              required
            />
          </div>
        </div>

        <!-- Address Fields -->
        <div class="form-group">
          <label for="address_1" class="form-label">Address 1</label>
          <input 
            type="text" 
            class="form-field" 
            id="address_1" 
            name="address_1"
            v-model="form.address_1"
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
            v-model="form.address_2"
          />
        </div>
      </div>

      <!-- Card Information Section -->
      <div class="card-foot">
        <h3 class="card-title">Card information</h3>
        <div class="form-group">
          <div id="card-element" class="form-field"></div>
          <div id="card-errors" role="alert" class="error-message" v-if="cardError">
            {{ cardError }}
          </div>
        </div>
      </div>
    </form>

    <!-- Order Summary -->
    <div class="card card-summary">
      <div class="card-head">
        <h3 class="card-title">Summary</h3>
      </div>
      <div class="card-body">
        <div v-if="cartItems.length > 0" class="order-items">
          <div 
            v-for="item in cartItems" 
            :key="item.id"
            class="order-item"
          >
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">${{ item.price }}</span>
          </div>
        </div>
        <div v-else>
          <p>No items in cart</p>
        </div>
      </div>
      <div class="card-body">
        <h2 class="card-subtitle">
          <b>Sub Total</b> 
          <b class="text-primary">${{ subtotal.toFixed(2) }}</b>
        </h2>
        <h3 class="card-title">
          <b>Total</b> 
          <b class="text-primary">${{ total.toFixed(2) }}</b>
        </h3>
      </div>
      <div class="card-foot center">
        <button 
          form="checkout" 
          class="btn btn-primary btn-lg btn-pill" 
          type="submit"
          :disabled="isProcessing || !stripeToken"
        >
          {{ isProcessing ? 'Processing...' : 'Checkout' }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { ApiUrl, apiRequest } from '@/utils/api'
import { showMessage } from '@/utils/message'

const props = defineProps({
  cartItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['checkout-success', 'checkout-error'])

// Form data
const form = ref({
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

// Stripe variables
const stripe = ref(null)
const stripeCard = ref(null)
const stripeToken = ref('')
const cardError = ref('')
const isProcessing = ref(false)
const stripePublicKey = ref('')

// Computed properties
const subtotal = computed(() => {
  return props.cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
})

const total = computed(() => {
  // Add any taxes or fees here if needed
  return subtotal.value
})

// Initialize Stripe
const initializeStripe = async () => {
  try {
    // Get Stripe public key from settings
    const response = await apiRequest(ApiUrl('nextash_store.events.settings.get_stripe_key'))
    stripePublicKey.value = response.message.stripe_public_key

    if (!stripePublicKey.value) {
      throw new Error('Stripe public key not found')
    }

    // Load Stripe script dynamically
    if (!window.Stripe) {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = () => setupStripe()
      document.head.appendChild(script)
    } else {
      setupStripe()
    }
  } catch (error) {
    console.error('Error initializing Stripe:', error)
    showMessage('Error loading payment system', 'error')
  }
}

const setupStripe = () => {
  try {
    stripe.value = window.Stripe(stripePublicKey.value)
    const elements = stripe.value.elements()
    
    stripeCard.value = elements.create('card', {
      style: {
        base: {
          color: '#fff',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    })

    stripeCard.value.mount('#card-element')

    // Listen for card changes
    stripeCard.value.addEventListener('change', handleCardChange)
  } catch (error) {
    console.error('Error setting up Stripe:', error)
    cardError.value = 'Error setting up payment system'
  }
}

const handleCardChange = async (event) => {
  if (event.error) {
    cardError.value = event.error.message
    stripeToken.value = ''
  } else {
    cardError.value = ''
    
    // Create token when card is complete
    if (event.complete) {
      try {
        const result = await stripe.value.createToken(stripeCard.value)
        if (result.error) {
          cardError.value = result.error.message
          stripeToken.value = ''
        } else {
          stripeToken.value = result.token.id
        }
      } catch (error) {
        cardError.value = 'Error processing card'
        stripeToken.value = ''
      }
    }
  }
}

const processCheckout = async () => {
  if (!stripeToken.value) {
    cardError.value = 'Please enter valid card information'
    return
  }

  if (isProcessing.value) return

  isProcessing.value = true

  try {
    const checkoutData = {
      ...form.value,
      token: stripeToken.value,
      items: props.cartItems
    }

    const response = await apiRequest(
      ApiUrl('nextash_store.events.cart.checkout'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': document.getElementById('csrf_token')?.value || ''
        },
        body: JSON.stringify(checkoutData)
      }
    )

    if (response.message) {
      showMessage('Checkout successful!', 'success')
      emit('checkout-success', response.message)
    }
  } catch (error) {
    console.error('Checkout error:', error)
    const errorMessage = error.message || 'Checkout failed. Please try again.'
    showMessage(errorMessage, 'error')
    emit('checkout-error', error)
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  initializeStripe()
})

onUnmounted(() => {
  // Clean up Stripe card element
  if (stripeCard.value) {
    stripeCard.value.removeEventListener('change', handleCardChange)
    stripeCard.value.unmount()
  }
})
</script>