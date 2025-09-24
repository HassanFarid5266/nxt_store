<template>
  <div>
    <!-- Page Header -->
    <section class="page-head boxed">
      <h1 class="page-title">{{ order?.name || 'Order Details' }}</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item">
          <router-link to="/orders" class="page-link" aria-label="Orders">Orders</router-link>
        </li>
        <li class="page-item active">{{ order?.name || 'Loading...' }}</li>
      </ul>
    </section>

    <!-- Content -->
    <main class="boxed">
      <div v-if="loading" class="loading-container">
        <p>Loading order details...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <router-link to="/orders" class="btn btn-primary">Back to Orders</router-link>
      </div>

      <div v-else-if="order" class="layout-order">
        <!-- Basic Information -->
        <section>
          <h3 class="section-title">Basic Information</h3>
          <table class="table">
            <tr>
              <td>Order #</td>
              <td><b>{{ order.name }}</b></td>
            </tr>
            <tr>
              <td>Full Name</td>
              <td><b>{{ order.first_name }} {{ order.last_name }}</b></td>
            </tr>
            <tr>
              <td>Email Address</td>
              <td><b>{{ order.email }}</b></td>
            </tr>
            <tr>
              <td>Phone</td>
              <td><b>{{ order.phone }}</b></td>
            </tr>
            <tr>
              <td>Payment ID</td>
              <td><b>{{ order.payment_id }}</b></td>
            </tr>
            <tr>
              <td>Country</td>
              <td><b>{{ order.country }}</b></td>
            </tr>
            <tr>
              <td>State</td>
              <td><b>{{ order.state }}</b></td>
            </tr>
            <tr>
              <td>City</td>
              <td><b>{{ order.city }}</b></td>
            </tr>
            <tr>
              <td>Address 1</td>
              <td><b>{{ order.address_1 }}</b></td>
            </tr>
            <tr v-if="order.address_2">
              <td>Address 2</td>
              <td><b>{{ order.address_2 }}</b></td>
            </tr>
            <tr>
              <td>Postal Code</td>
              <td><b>{{ order.postal_code }}</b></td>
            </tr>
          </table>
        </section>

        <!-- Ordered Products -->
        <section>
          <h3 class="section-title">Ordered Products</h3>
          <article v-for="item in orderProducts" :key="item.id" class="media media-product">
            <router-link :to="`/product/${item.product_name}`" class="media-image">
              <img :src="item.image" class="image" :alt="item.alt || item.product_title" />
            </router-link>
            <div class="media-body">
              <router-link :to="`/shop/${item.category_name}`" class="media-badge">
                {{ item.category_title }}
              </router-link>
              <h3 class="media-title text-ellipsis">
                <router-link :to="`/product/${item.product_name}`">
                  {{ item.product_title }}
                </router-link>
              </h3>
              <p class="media-desc">
                <template v-if="item.variation_title && item.variation_name">
                  <template v-if="item.discount">
                    {{ item.discount }} <del>${{ item.price }}</del>
                  </template>
                  <template v-else>
                    ${{ item.price }}
                  </template>
                </template>
                <template v-else>
                  Custom price
                </template>
              </p>
              <router-link :to="`/product/${item.product_name}`" class="btn btn-pill btn-sm btn-primary">
                See details <i class="bx bx-right-arrow-alt icon-end"></i>
              </router-link>
            </div>
          </article>

          <!-- Order Summary -->
          <div class="order-summary">
            <table class="table">
              <tr>
                <td>Tax</td>
                <td><b>${{ order.tax }}</b></td>
              </tr>
              <tr>
                <td>Sub Total</td>
                <td><b>${{ order.sub_total }}</b></td>
              </tr>
              <tr>
                <td>Total</td>
                <td><b>${{ order.total }}</b></td>
              </tr>
            </table>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'OrderView',
  data() {
    return {
      order: null,
      orderProducts: [],
      loading: true,
      error: null
    }
  },
  async mounted() {
    await this.loadOrder()
  },
  methods: {
    async loadOrder() {
      try {
        const orderId = this.$route.params.id
        if (!orderId) {
          this.error = 'Order ID is required'
          this.loading = false
          return
        }

        // This would typically fetch from your API
        // For now, using mock data
        await this.mockLoadOrder(orderId)

        this.loading = false
      } catch (error) {
        console.error('Failed to load order:', error)
        this.error = 'Failed to load order details'
        this.loading = false
      }
    },

    async mockLoadOrder(orderId) {
      // Mock data - replace with actual API call
      this.order = {
        name: orderId,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        payment_id: 'PAY_123456789',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        address_1: '123 Main Street',
        address_2: 'Apt 4B',
        postal_code: '94102',
        tax: '8.50',
        sub_total: '91.50',
        total: '100.00'
      }

      this.orderProducts = [
        {
          id: 1,
          product_name: 'sample-product',
          product_title: 'Sample Product',
          category_name: 'electronics',
          category_title: 'Electronics',
          image: 'https://via.placeholder.com/300x200',
          alt: 'Sample Product',
          variation_title: 'Standard',
          variation_name: 'standard',
          price: '91.50',
          discount: null
        }
      ]
    }
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadOrder()
      },
      immediate: false
    }
  }
}
</script>
