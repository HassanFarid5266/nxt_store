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
              <input type="text" class="form-field" :class="fieldClasses.firstname" placeholder="Enter your first Name" id="firstname" name="firstname"
                v-model="checkoutForm.firstname" @blur="validateField('firstname')" required />
              <span v-if="formErrors.firstname" class="error-message">{{
                ValidationHelpers.formatErrorMessage(formErrors.firstname) }}</span>
              <i v-if="validationIcons.firstname"
                :class="['validation-icon', validationIcons.firstname, fieldClasses.firstname]"></i>
            </div>
            <div class="form-group">
              <label for="lastname" class="form-label">Last Name</label>
              <input type="text" class="form-field" :class="fieldClasses.lastname" placeholder="Enter your last name" id="lastname" name="lastname"
                v-model="checkoutForm.lastname" @blur="validateField('lastname')" required />
              <span v-if="formErrors.lastname" class="error-message">{{
                ValidationHelpers.formatErrorMessage(formErrors.lastname) }}</span>
              <i v-if="validationIcons.lastname"
                :class="['validation-icon', validationIcons.lastname, fieldClasses.lastname]"></i>
            </div>
          </div>
          <div class="form-cols-2">
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input type="email" class="form-field" :class="fieldClasses.email" placeholder="Enter your email address" id="email" name="email"
                v-model="checkoutForm.email" @blur="validateField('email')" required />
              <span v-if="formErrors.email" class="error-message">{{
                ValidationHelpers.formatErrorMessage(formErrors.email) }}</span>
              <i v-if="validationIcons.email"
                :class="['validation-icon', validationIcons.email, fieldClasses.email]"></i>
            </div>
            <div class="form-group">
              <label for="phone" class="form-label">Phone Number</label>
              <input type="text" class="form-field" :class="fieldClasses.phone" id="phone" name="phone"
                v-model="checkoutForm.phone" @blur="validateField('phone')" placeholder="Enter your number" required />
              <span v-if="formErrors.phone" class="error-message">{{
                ValidationHelpers.formatErrorMessage(formErrors.phone) }}</span>
              <i v-if="validationIcons.phone"
                :class="['validation-icon', validationIcons.phone, fieldClasses.phone]"></i>
            </div>
          </div>
          <div class="form-cols-2">
            <div class="form-group">
              <label for="city" class="form-label">City</label>
              <input type="text" class="form-field" :class="fieldClasses.city" placeholder="Enter your city" id="city" name="city"
                v-model="checkoutForm.city" @blur="validateField('city')" required />
              <span v-if="formErrors.city" class="error-message">{{
                ValidationHelpers.formatErrorMessage(formErrors.city) }}</span>
              <i v-if="validationIcons.city" :class="['validation-icon', validationIcons.city, fieldClasses.city]"></i>
            </div>
            <div class="form-group">
              <label for="country" class="form-label">Country</label>

              <input type="text" class="form-field" :class="fieldClasses.country" placeholder="Enter your country" id="city" name="city"
                v-model="checkoutForm.country" @blur="validateField('country')" required />
              <span v-if="formErrors.country" class="error-message">{{
                ValidationHelpers.formatErrorMessage(formErrors.country) }}</span>
              <i v-if="validationIcons.country"
                :class="['validation-icon', validationIcons.country, fieldClasses.country]"></i>
            </div>
          </div>
        </div>
        <div class="card-foot">
          <h3 class="card-title">Payment Method</h3>

          <!-- Payment Method Selection -->
          <div class="payment-methods">
            <div class="payment-method-grid">
              <div v-for="method in paymentMethods" :key="method.id" class="payment-method-option"
                :class="{ 'active': selectedPaymentMethod === method.id }" @click="selectPaymentMethod(method.id)">
                <div class="payment-method-icon">
                  <i :class="method.icon"></i>
                </div>
                <div class="payment-method-info">
                  <h4 class="payment-method-name">{{ method.name }}</h4>
                  <p class="payment-method-desc">{{ method.description }}</p>
                </div>
                <div class="payment-method-selector">
                  <div class="radio-indicator" :class="{ 'selected': selectedPaymentMethod === method.id }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Details Section -->
          <div class="payment-details" v-if="selectedPaymentMethod">

            <!-- Credit Card Details -->
            <div v-if="selectedPaymentMethod === 'card'" class="payment-form card-payment-form">
              <h4 class="payment-section-title">Card Information</h4>
              <div class="form-cols-2">
                <div class="form-group">
                  <label for="chn" class="form-label">Card holder name</label>
                  <input type="text" class="form-field" :class="fieldClasses.chn" placeholder="Enter card holder name" id="chn" name="chn"
                    v-model="checkoutForm.chn" @blur="validateField('chn')" required />
                  <span v-if="formErrors.chn" class="error-message">{{
                    ValidationHelpers.formatErrorMessage(formErrors.chn) }}</span>
                  <i v-if="validationIcons.chn" :class="['validation-icon', validationIcons.chn, fieldClasses.chn]"></i>
                </div>
                <div class="form-group">
                  <label for="edate" class="form-label">Expiry date</label>
                  <input type="text" class="form-field" :class="fieldClasses.edate" id="edate" name="edate"
                    v-model="checkoutForm.edate" @blur="validateField('edate')" @input="formatExpiryDate"
                    placeholder="MM/YY" maxlength="5" required />
                  <span v-if="formErrors.edate" class="error-message">{{
                    ValidationHelpers.formatErrorMessage(formErrors.edate) }}</span>
                  <i v-if="validationIcons.edate"
                    :class="['validation-icon', validationIcons.edate, fieldClasses.edate]"></i>
                </div>
                <div class="form-group">
                  <label for="cardnumber" class="form-label">Card number</label>
                  <input type="text" class="form-field" :class="fieldClasses.cardnumber" id="cardnumber"
                    name="cardnumber" v-model="checkoutForm.cardnumber" @blur="validateField('cardnumber')"
                    @input="formatCardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required />
                  <span v-if="formErrors.cardnumber" class="error-message">{{
                    ValidationHelpers.formatErrorMessage(formErrors.cardnumber) }}</span>
                  <i v-if="validationIcons.cardnumber"
                    :class="['validation-icon', validationIcons.cardnumber, fieldClasses.cardnumber]"></i>
                </div>
                <div class="form-group">
                  <label for="code" class="form-label">CVC / CVV</label>
                  <input type="text" class="form-field" :class="fieldClasses.code" id="code" name="code"
                    v-model="checkoutForm.code" @blur="validateField('code')" @input="formatCVC" placeholder="123"
                    maxlength="4" required />
                  <span v-if="formErrors.code" class="error-message">{{
                    ValidationHelpers.formatErrorMessage(formErrors.code) }}</span>
                  <i v-if="validationIcons.code"
                    :class="['validation-icon', validationIcons.code, fieldClasses.code]"></i>
                </div>
              </div>
              <div class="card-types">
                <img
                  src="@/assets/images/payment/visa.jpg"
                  alt="Visa" class="card-type-icon">
                <img
                  src="@/assets/images/payment/mastercard.png"
                  alt="Mastercard" class="card-type-icon">
                <img
                  src="@/assets/images/payment/amex.jpg"
                  alt="American Express" class="card-type-icon">
              </div>
            </div>

            <!-- Bank Account Details -->
            <div v-if="selectedPaymentMethod === 'bank-account'" class="payment-form bank-account-form">
              <h4 class="payment-section-title">Bank Account Information</h4>
              <div class="form-cols-2">
                <div class="form-group">
                  <label for="bankName" class="form-label">Bank Name</label>
                  <input type="text" class="form-field" :class="fieldClasses.bankName" placeholder="Enter your Bank name" id="bankName" name="bankName"
                    v-model="checkoutForm.bankName" @blur="validateField('bankName')" required />
                  <span v-if="formErrors.bankName" class="error-message">{{
                    ValidationHelpers.formatErrorMessage(formErrors.bankName) }}</span>
                  <i v-if="validationIcons.bankName"
                    :class="['validation-icon', validationIcons.bankName, fieldClasses.bankName]"></i>
                </div>
                <div class="form-group">
                  <label for="accountHolderName" class="form-label">Account Holder Name</label>
                  <input type="text" class="form-field" :class="fieldClasses.accountHolderName" placeholder="Enter account holder name" id="accountHolderName"
                    name="accountHolderName" v-model="checkoutForm.accountHolderName"
                    @blur="validateField('accountHolderName')" required />
                  <span v-if="formErrors.accountHolderName" class="error-message">{{
                    ValidationHelpers.formatErrorMessage(formErrors.accountHolderName) }}</span>
                  <i v-if="validationIcons.accountHolderName"
                    :class="['validation-icon', validationIcons.accountHolderName, fieldClasses.accountHolderName]"></i>
                </div>
                <div class="form-group">
                  <label for="accountNumber" class="form-label">Account Number</label>
                  <input type="text" class="form-field" :class="fieldClasses.accountNumber" id="accountNumber"
                    name="accountNumber" v-model="checkoutForm.accountNumber" @blur="validateField('accountNumber')"
                    placeholder="1234567890123456" required />
                  <span v-if="formErrors.accountNumber" class="error-message">{{
                    ValidationHelpers.formatErrorMessage(formErrors.accountNumber) }}</span>
                  <i v-if="validationIcons.accountNumber"
                    :class="['validation-icon', validationIcons.accountNumber, fieldClasses.accountNumber]"></i>
                </div>
                <div class="form-group">
                  <label for="routingNumber" class="form-label">Routing Number</label>
                  <input type="text" class="form-field" :class="fieldClasses.routingNumber" id="routingNumber"
                    name="routingNumber" v-model="checkoutForm.routingNumber" @blur="validateField('routingNumber')"
                    placeholder="123456789" required />
                  <span v-if="formErrors.routingNumber" class="error-message">{{
                    ValidationHelpers.formatErrorMessage(formErrors.routingNumber) }}</span>
                  <i v-if="validationIcons.routingNumber"
                    :class="['validation-icon', validationIcons.routingNumber, fieldClasses.routingNumber]"></i>
                </div>
              </div>
              <div class="form-group">
                <label for="swiftCode" class="form-label">SWIFT Code (Optional)</label>
                <input type="text" class="form-field" id="swiftCode" name="swiftCode" v-model="checkoutForm.swiftCode"
                  placeholder="ABCDUS33XXX" />
              </div>
              <div class="bank-transfer-note">
                <div class="bank-icon">
                  <i class="bx bx-info-circle"></i>
                </div>
                <div class="bank-text">
                  <p><strong>Note:</strong> Bank transfers may take 1-3 business days to process. You will receive
                    confirmation once payment is received.</p>
                </div>
              </div>
            </div>
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
          <button class="btn btn-primary btn-lg btn-pill" type="submit" form="checkout-form"
            :disabled="loading || !stripeToken" @click="processCheckout">
            {{ loading ? 'Processing...' : 'Checkout' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ApiUrl, apiRequest } from '@/utils/api'
import { showMessage } from '@/utils/message'
import { FormValidator, CheckoutValidationConfig, ValidationHelpers } from '@/utils/validation'

const router = useRouter()
const loading = ref(false)
const stripe = ref(null)
const cardElement = ref(null)
const stripeToken = ref('')
const cartItems = ref([])
const selectedPaymentMethod = ref('card')

const checkoutForm = reactive({
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  chn: '',
  edate: '',
  cardnumber: '',
  code: '',
  bankName: '',
  accountHolderName: '',
  accountNumber: '',
  routingNumber: '',
  swiftCode: ''
})

const validator = new FormValidator()
const formErrors = reactive({})
const fieldClasses = reactive({})
const validationIcons = reactive({})

// Watch for validation changes and update reactive objects
watch(() => validator.errors, (newErrors) => {
  Object.keys(formErrors).forEach(key => delete formErrors[key])
  Object.assign(formErrors, Object.fromEntries(newErrors))
}, { deep: true })

watch(() => validator.touched, () => {
  updateFieldClasses()
  updateValidationIcons()
}, { deep: true })

const paymentMethods = ref([
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    icon: 'bx bx-credit-card'
  },
  {
    id: 'bank-account',
    name: 'Bank Account',
    description: 'Direct bank account transfer',
    icon: 'bx bx-building'
  }
])

const detectedCardType = ref('')

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const total = computed(() => {
  return subtotal.value
})

const selectPaymentMethod = (methodId) => {
  selectedPaymentMethod.value = methodId
  if (methodId === 'bank-account') {
    stripeToken.value = 'bank-account-payment'
  } else {
    stripeToken.value = ''
  }
  clearValidationErrors()
}

const updateFieldClasses = () => {
  Object.keys(checkoutForm).forEach(fieldName => {
    fieldClasses[fieldName] = ValidationHelpers.getFieldClass(fieldName, validator)
  })
}

const updateValidationIcons = () => {
  Object.keys(checkoutForm).forEach(fieldName => {
    validationIcons[fieldName] = ValidationHelpers.getValidationIcon(fieldName, validator)
  })
}

const validateField = async (fieldName) => {
  const value = checkoutForm[fieldName]?.trim()
  let rules = []

  const baseConfig = {
    firstname: CheckoutValidationConfig.firstname,
    lastname: CheckoutValidationConfig.lastname,
    email: CheckoutValidationConfig.email,
    phone: CheckoutValidationConfig.phone,
    city: CheckoutValidationConfig.city,
    country: CheckoutValidationConfig.country
  }

  // Apply base rules first if this is a base field
  if (baseConfig[fieldName]) {
    rules = baseConfig[fieldName].slice() // clone the array
  }

  // Add payment-specific rules if applicable
  if (selectedPaymentMethod.value === 'card') {
    const cardValidation = CheckoutValidationConfig.createCardValidation()
    if (cardValidation[fieldName]) {
      rules = [...(rules || []), ...cardValidation[fieldName]]
    }
  } else if (selectedPaymentMethod.value === 'bank-account') {
    const bankValidation = CheckoutValidationConfig.createBankValidation(checkoutForm.country)
    if (bankValidation[fieldName]) {
      rules = [...(rules || []), ...bankValidation[fieldName]]
    }
  }

  try {
    const result = await ValidationHelpers.debounceValidation(validator, fieldName, value, rules, 300)
    updateFieldClasses()
    updateValidationIcons()
    return result
  } catch (error) {
    console.error('Validation error:', error)
    return { isValid: false, error: error.message }
  }
}

const formatCardNumber = (event) => {
  const formatted = ValidationHelpers.formatCardNumber(event.target.value)
  checkoutForm.cardnumber = formatted

  // Update card type detection in real-time
  const cleaned = formatted.replace(/\s/g, '')
  if (cleaned.length >= 4) {
    detectedCardType.value = ValidationHelpers.detectCardType(cleaned)
  }
}

const formatExpiryDate = (event) => {
  const formatted = ValidationHelpers.formatExpiryDate(event.target.value)
  checkoutForm.edate = formatted
}

const formatCVC = (event) => {
  const formatted = ValidationHelpers.formatCVC(event.target.value)
  checkoutForm.code = formatted
}

const clearValidationErrors = () => {
  validator.clearErrors()
  updateFieldClasses()
  updateValidationIcons()
}

const onCountryChange = () => {
  // Update placeholder for ZIP code based on country
  const zipInput = document.getElementById('zipCode')
  if (zipInput) {
    const country = countries.value.find(c => c.code === checkoutForm.country)
    zipInput.placeholder = country ? country.zipFormat : 'Enter ZIP/Postal code'
  }
}

const validateAllFields = async () => {
  try {
    // Build base validation configuration
    let validationConfig = {
      firstname: CheckoutValidationConfig.firstname,
      lastname: CheckoutValidationConfig.lastname,
      email: CheckoutValidationConfig.email,
      phone: CheckoutValidationConfig.phone,
      city: CheckoutValidationConfig.city,
      country: CheckoutValidationConfig.country,
    }

    // Add payment method specific validations
    if (selectedPaymentMethod.value === 'card') {
      const cardValidation = CheckoutValidationConfig.createCardValidation()
      validationConfig = { ...validationConfig, ...cardValidation }
    } else if (selectedPaymentMethod.value === 'bank-account') {
      const bankValidation = CheckoutValidationConfig.createBankValidation(checkoutForm.country)
      validationConfig = { ...validationConfig, ...bankValidation }
    } else if (selectedPaymentMethod.value === 'wire-transfer') {
      const wireValidation = CheckoutValidationConfig.createWireTransferValidation()
      validationConfig = { ...validationConfig, ...wireValidation }
    }

    // Validate all fields
    const isValid = validator.validateAll(checkoutForm, validationConfig)

    // Update UI state
    updateFieldClasses()
    updateValidationIcons()

    if (!isValid) {
      const errors = validator.getAllErrors()
      const errorCount = Object.keys(errors).length
      const firstError = Object.keys(errors)[0]

      // Show validation summary message
      showMessage(`Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''} before proceeding`, 'error')

      if (firstError) {
        // Scroll to first error field
        setTimeout(() => {
          const errorElement = document.getElementById(firstError)
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            errorElement.focus()
          }
        }, 100)
      }
    }

    return isValid
  } catch (error) {
    console.error('Validation error:', error)
    showMessage('Validation error occurred. Please check your inputs.', 'error')
    return false
  }
}

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
  // Validate all form fields first
  const isFormValid = await validateAllFields()
  if (!isFormValid) {
    return
  }

  // Validate payment method selection
  if (!selectedPaymentMethod.value) {
    showMessage('Please select a payment method', 'error')
    return
  }

  // Validate payment method specific requirements
  if (selectedPaymentMethod.value === 'card') {
    if (!stripeToken.value || stripeToken.value === 'bank-account-payment') {
      showMessage('Please complete your card information', 'error')
      return
    }

    // Additional card validation
    if (!ValidationHelpers.validateCreditCard(checkoutForm.cardnumber)) {
      showMessage('Please enter a valid credit card number', 'error')
      return
    }
  }

  try {
    loading.value = true

    const checkoutData = {
      ...checkoutForm,
      payment_method: selectedPaymentMethod.value,
      token: selectedPaymentMethod.value === 'card' ? stripeToken.value : null,
      items: cartItems.value,
      total: total.value,
      currency: 'USD' // Add currency for international support
    }

    // Handle different payment methods
    let response
    switch (selectedPaymentMethod.value) {
      case 'card':
        showMessage('Processing card payment...', 'info')
        response = await apiRequest(ApiUrl('nextash_store.events.cart.checkout'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checkoutData)
        })

        if (response?.message?.success) {
          showMessage('Payment processed successfully!', 'success')
          setTimeout(() => {
            router.push('/orders')
          }, 1500)
        } else {
          throw new Error(response?.message?.response || 'Payment processing failed')
        }
        break

      case 'bank-account':
        showMessage('Processing bank transfer request...', 'info')
        // Create order with bank transfer payment method
        response = await apiRequest(ApiUrl('nextash_store.events.cart.checkout'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checkoutData)
        })

        showMessage('Order created! Bank transfer instructions sent to your email.', 'success')
        setTimeout(() => {
          router.push('/orders')
        }, 2000)
        break

      default:
        throw new Error('Invalid payment method selected')
    }

  } catch (error) {
    console.error('Checkout error:', error)
    const errorMessage = error.message || 'An error occurred while processing your order'
    showMessage('Error: ' + errorMessage, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadCartItems()
  await initializeStripe()
})
</script>
