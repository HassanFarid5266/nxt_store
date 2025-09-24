<template>
  <div>
    <main class="boxed">
      <section class="card card-error">
        <div class="card-image">
          <svg xmlns="http://www.w3.org/2000/svg" class="image" data-name="Layer 1" viewBox="0 0 816.21532 621"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <path
              d="M518.50083,268.28111h-2.97759V186.71075A47.2107,47.2107,0,0,0,468.31258,139.5H295.49464a47.2107,47.2107,0,0,0-47.21079,47.2106V634.21209a47.2107,47.2107,0,0,0,47.21065,47.21075H468.31235a47.21071,47.21071,0,0,0,47.21084-47.21057v-307.868h2.97764Z"
              transform="translate(-191.89234 -139.5)" fill="#3f3d56" />
            <path
              d="M470.21737,151.7826H447.65892A16.75027,16.75027,0,0,1,432.15047,174.859H333.14532a16.75024,16.75024,0,0,1-15.50845-23.0764H296.56722A35.25642,35.25642,0,0,0,261.31077,187.039V633.88382a35.25643,35.25643,0,0,0,35.25641,35.25646H470.21737a35.25643,35.25643,0,0,0,35.25645-35.25642h0V187.039A35.2564,35.2564,0,0,0,470.21737,151.7826Z"
              transform="translate(-191.89234 -139.5)" fill="#fff" />
            <path d="M573.89234,681.5h-381a1,1,0,0,1,0-2h381a1,1,0,0,1,0,2Z" transform="translate(-191.89234 -139.5)"
              fill="#cbcbcb" />
            <circle id="baf12095-0797-4180-a98d-6422936d747a" data-name="Ellipse 44" cx="191.5" cy="261.2336"
              r="84.4462" fill="#ff0000" />
            <path id="b582f34e-fd02-4670-b1d8-d23f069ed737-138" data-name="Path 395"
              d="M375.02417,432.94733a8.75832,8.75832,0,0,1-5.26905-1.75113l-.09426-.07069-19.846-15.18155a8.81941,8.81941,0,1,1,10.73182-13.99843l12.85463,9.85753L403.77751,372.174a8.81571,8.81571,0,0,1,12.36-1.63259l.00256.00192-.18852.26177.19363-.26177a8.82633,8.82633,0,0,1,1.63067,12.36249l-35.729,46.5917a8.821,8.821,0,0,1-7.01492,3.4394Z"
              transform="translate(-191.89234 -139.5)" fill="#fff" />
            <!-- Additional SVG paths from original -->
          </svg>
        </div>
        <div class="card-body">
          <h1 class="card-title">Order Confirmation!</h1>
          <p class="card-subtitle">
            Thank you for your purchase! Your order has been successfully placed.
            <template v-if="orderDetails">
              Order #{{ orderDetails.orderId }} has been confirmed.
            </template>
            If you have any questions or need further assistance, please contact our customer support.
          </p>

          <div v-if="orderDetails" class="order-summary">
            <div class="summary-item">
              <strong>Order ID:</strong> {{ orderDetails.orderId }}
            </div>
            <div class="summary-item">
              <strong>Total Amount:</strong> ${{ orderDetails.total }}
            </div>
            <div class="summary-item">
              <strong>Payment Method:</strong> {{ orderDetails.paymentMethod }}
            </div>
            <div class="summary-item">
              <strong>Email:</strong> {{ orderDetails.email }}
            </div>
          </div>
        </div>
        <div class="card-foot">
          <div class="action-buttons">
            <router-link to="/contact-us" class="btn btn-primary btn-lg btn-pill">
              Contact Us
            </router-link>
            <router-link to="/orders" class="btn btn-outline-primary btn-lg btn-pill">
              View Orders
            </router-link>
            <router-link to="/" class="btn btn-secondary btn-lg btn-pill">
              Continue Shopping
            </router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'PaymentView',
  data() {
    return {
      orderDetails: null,
      loading: true
    }
  },
  async mounted() {
    await this.loadOrderDetails()
  },
  methods: {
    async loadOrderDetails() {
      try {
        // Get order details from query params or route
        const orderId = this.$route.query.order_id || this.$route.query.orderId
        const sessionId = this.$route.query.session_id
        const paymentId = this.$route.query.payment_id

        if (orderId || sessionId || paymentId) {
          // In a real app, you'd fetch order details from API
          this.orderDetails = {
            orderId: orderId || 'ORD-' + Date.now(),
            total: this.$route.query.total || '99.99',
            paymentMethod: this.$route.query.payment_method || 'Credit Card',
            email: this.$route.query.email || 'customer@example.com'
          }
        }

        this.loading = false
      } catch (error) {
        console.error('Failed to load order details:', error)
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.order-summary {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: var(--bg-light, #f8f9fa);
  border-radius: 0.375rem;
  text-align: left;
}

.summary-item {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.action-buttons .btn {
  min-width: 200px;
}

@media (min-width: 768px) {
  .action-buttons {
    flex-direction: row;
    justify-content: center;
  }

  .action-buttons .btn {
    min-width: auto;
  }
}

.card-error {
  max-width: 600px;
  margin: 2rem auto;
}

.card-image .image {
  max-width: 300px;
  height: auto;
}

.card-title {
  color: var(--color-success, #28a745);
  margin-bottom: 1rem;
}

.card-subtitle {
  line-height: 1.6;
  margin-bottom: 1.5rem;
}
</style>
