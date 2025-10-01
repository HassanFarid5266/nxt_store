<!-- Orders Page View -->
<template>
  <div>
    <!-- Page Head -->
    <section class="page-head boxed">
      <h1 class="page-title">Orders</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">Orders</li>
      </ul>
    </section>

    <!-- Main Content -->
    <main class="boxed">
      <section class="section-meta">
        <h4 class="section-title">Orders <span class="count">({{ orders.length }})</span></h4>
        <div class="filter-controls">
          <div class="select">
            <label for="status-filter">Filter by Status</label>
            <select name="status-filter" id="status-filter" v-model="filterStatus">
              <option value="all">All Orders</option>
              <option :value="orderStore.ORDER_STATUSES.PENDING">Pending Payment</option>
              <option :value="orderStore.ORDER_STATUSES.CONFIRMED">Confirmed</option>
              <option :value="orderStore.ORDER_STATUSES.PROCESSING">Processing</option>
              <option :value="orderStore.ORDER_STATUSES.SHIPPED">Shipped</option>
              <option :value="orderStore.ORDER_STATUSES.DELIVERED">Delivered</option>
              <option :value="orderStore.ORDER_STATUSES.CANCELLED">Cancelled</option>
            </select>
          </div>
          <div class="select">
            <label for="sort">Sort</label>
            <select name="sort" id="sort" v-model="sortOrder" @change="sortOrders">
              <option value="desc">Recents</option>
              <option value="asc">Oldest</option>
            </select>
          </div>
        </div>
      </section>

      <section v-if="loading" class="loading-state">
        <p>Loading orders...</p>
      </section>

      <section v-else-if="orders.length === 0" class="empty-state">
        <div class="card">
          <div class="card-body center">
            <h3 class="card-title">No Orders Found</h3>
            <p class="card-desc">You haven't placed any orders yet.</p>
            <br>
            <router-link to="/shop" class="btn btn-primary">Start Shopping</router-link>
          </div>
        </div>
      </section>

      <section v-else class="table-responsive">
        <table class="table table-basic table-sm table-striped-even">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Tax</th>
              <th scope="col">Sub total</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
              <th scope="col">Date</th>
              <th scope="col">Controls</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in paginatedOrders" :key="order.name">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ order.customer_name }}</td>
              <td>{{ order.email }}</td>
              <td>${{ order.tax || '0.00' }}</td>
              <td>${{ order.subtotal }}</td>
              <td>${{ order.total }}</td>
              <td>
                <span class="badge" :class="`badge-${orderStore.getStatusColor(order.status)}`">
                  {{ orderStore.getStatusLabel(order.status) }}
                </span>
              </td>
              <td>{{ formatDate(order.created_at) }}</td>
              <td>
                <div class="order-actions">
                  <!-- <router-link :to="`/order/${order.id}`" class="btn btn-sm btn-primary">
                    <i class="bx bx-show"></i> View
                  </router-link> -->
                  <button
                    v-if="order.status === orderStore.ORDER_STATUSES.PENDING || order.status === orderStore.ORDER_STATUSES.CONFIRMED"
                    @click="cancelOrder(order.id)" class="btn btn-sm btn-danger"
                    :disabled="order.status === orderStore.ORDER_STATUSES.SHIPPED">
                    <i class="bx bx-x"></i> Cancel
                  </button>
                  <button v-if="order.tracking_number" @click="trackOrder(order.tracking_number)"
                    class="btn btn-sm btn-outline-primary">
                    <i class="bx bx-package"></i> Track
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="totalPages > 1" class="pagination-controls">
        <button @click="previousPage" :disabled="currentPage === 1" class="btn btn-primary btn-sm btn-pill">
          Previous
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-primary btn-sm btn-pill">
          Next
        </button>
      </section>

      <section v-if="hasMore && !loading" class="pagination">
        <button @click="loadMoreOrders" :disabled="loadingMore" class="btn btn-primary btn-sm btn-pill">
          {{ loadingMore ? 'Loading...' : 'Load more' }}
        </button>
      </section>

      <br>
      <br>
      <br>
      <br>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ApiUrl, apiRequest } from '@/utils/api'
import { showMessage } from '@/utils/message'
import { useOrderStore } from '@/stores/orders'

const router = useRouter()
const orderStore = useOrderStore()
const loading = ref(false)
const loadingMore = ref(false)
const sortOrder = ref('desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const hasMore = ref(false)
const filterStatus = ref('all')

// Use order store
const orders = computed(() => {
  let filteredOrders = orderStore.orders

  if (filterStatus.value !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === filterStatus.value)
  }

  return filteredOrders
})

const sortedOrders = computed(() => {
  return [...orders.value].sort((a, b) => {
    const dateA = new Date(a.creation)
    const dateB = new Date(b.creation)
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })
})

const totalPages = computed(() => {
  return Math.ceil(sortedOrders.value.length / itemsPerPage.value)
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedOrders.value.slice(start, end)
})

const loadOrders = async (append = false) => {
  try {
    if (!append) {
      loading.value = true
    } else {
      loadingMore.value = true
    }

    const response = await apiRequest(ApiUrl('nextash_store.events.orders.get_user_orders'), {
      method: 'POST',
      body: JSON.stringify({
        page: append ? Math.ceil(orders.value.length / 20) + 1 : 1,
        limit: 20,
        sort: sortOrder.value
      })
    })

    if (response.message) {
      if (append) {
        orders.value = [...orders.value, ...response.message.orders]
      } else {
        orders.value = response.message.orders || []
      }
      hasMore.value = response.message.has_more || false
    }
  } catch (error) {
    console.error('Error loading orders:', error)
    showMessage('Error loading orders: ' + error.message, 'error')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMoreOrders = () => {
  loadOrders(true)
}

const sortOrders = () => {
  currentPage.value = 1
  // Orders will be re-sorted by the computed property
}

const cancelOrder = async (orderId) => {
  if (!confirm('Are you sure you want to cancel this order?')) {
    return
  }

  try {
    const success = orderStore.cancelOrder(orderId)
    if (success) {
      showMessage('Order cancelled successfully', 'success')
    }
  } catch (error) {
    showMessage('Error cancelling order: ' + error.message, 'error')
  }
}

const trackOrder = (trackingNumber) => {
  // Open tracking in new window/tab
  const trackingUrl = `https://www.example-shipping.com/track/${trackingNumber}`
  window.open(trackingUrl, '_blank')
  showMessage(`Tracking order with number: ${trackingNumber}`, 'info')
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(() => {
  orderStore.initializeStore()
  loadOrders()
})
</script>
