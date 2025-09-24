<template>
  <!-- Page Head -->
  <section class="page-head boxed">
    <h1 class="page-title">Shop</h1>
    <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
      <li class="page-item">
        <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
      </li>
      <li class="page-item active">Shop</li>
    </ul>
  </section>

  <!-- Main Content -->
  <main class="layout-shop boxed">
    <section class="col-left">
      <div class="product-filters">
        <form id="searchForm" @submit.prevent="searchProducts">
          <div class="page-search">
            <input 
              type="search" 
              placeholder="Search..." 
              id="search"
              name="search"
              v-model="searchQuery"
              class="field" 
            />
            <button type="submit" class="bx bx-search btn-search"></button>
          </div>
        </form>
        
        <div class="categories">
          <h3 class="section-subtitle">Categories</h3>
          <input type="hidden" id="categories" :value="routeCategory" name="categories">
          <label
            v-for="item in categories"
            :key="item.name"
            class="check check-block"
            :for="item.name"
          >
            <input
              type="checkbox"
              name="category"
              class="category"
              :id="item.name"
              :value="item.name"
              v-model="selectedCategories"
              @change="filterProducts"
              :checked="routeCategory === item.name"
            />
            {{ item.title }}
          </label>
        </div>
      </div>
    </section>
    
    <section class="col-right">
      <div class="page-meta">
        <h4 class="page-title">Products <span class="count" id="count">({{ totalCount }})</span></h4>
        <div class="select">
          <label for="sort">Sort</label>
          <select name="sort" id="sort" v-model="sortOrder" @change="filterProducts">
            <option value="DESC" selected>Recent</option>
            <option value="ASC">Oldest</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-shop" id="listing">
        <template v-if="loading && currentPage === 1">
          <div class="loading">Loading products...</div>
        </template>
        <template v-else-if="filteredProducts.length === 0">
          <div class="no-records">No products found!</div>
        </template>
        <template v-else>
          <div 
            v-for="product in filteredProducts" 
            :key="product.name"
            class="card card-product"
          >
            <router-link :to="`/product/${product.name}`" class="card-image">
              <img :src="product.image" class="image" :alt="product.alt" />
            </router-link>
            <div class="card-body">
              <span class="card-badge">{{ product.category }}</span>
              <h3 class="card-title text-ellipsis">
                <router-link :to="`/product/${product.name}`">{{ product.title }}</router-link>
              </h3>
              <p class="card-subtitle text-ellipsis-2">{{ product.excerpt }}</p>
            </div>
            <div class="card-foot">
              <h3 class="card-subtitle">
                <template v-if="product.variations && product.variations.length">
                  <template v-if="product.variations[0].discount">
                    {{ product.variations[0].discount }} <del>${{ product.variations[0].price }}</del>
                  </template>
                  <template v-else>
                    ${{ product.variations[0].price }}
                  </template>
                </template>
                <template v-else>
                  Custom price
                </template>
              </h3>
              <div class="card-actions">
                <button
                  @click="addToCart(product)"
                  :disabled="addingToCart[product.name]"
                  class="btn btn-pill btn-sm btn-primary add-to-cart-btn"
                  style="margin-bottom: 10px;"
                >
                  <i v-if="addingToCart[product.name]" class="bx bx-loader-alt bx-spin"></i>
                  <i v-else class="bx bx-cart-add"></i>
                  {{ addingToCart[product.name] ? 'Adding...' : 'Add to Cart' }}
                </button>

                <router-link
                  :to="`/product/${product.name}`"
                  class="btn btn-pill btn-sm btn-outline-primary"
                >
                  View Details
                  <i class="bx bx-right-arrow-alt icon-end"></i>
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </div>
      
      <div class="pagination">
        <button 
          v-if="hasMore"
          class="btn btn-primary btn-sm btn-pill" 
          id="loadmore"
          @click="loadMore"
          :disabled="loading"
        >
          {{ loading ? 'Loading...' : 'Load more' }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const addingToCart = ref({})

const currentPage = ref(1)
const hasMore = ref(false)

const searchQuery = ref('')
const selectedCategories = ref([])
const sortOrder = ref('DESC')

const routeCategory = computed(() => route.params.category || '')

// Use store data
const products = computed(() => productsStore.products)
const categories = computed(() => productsStore.categories)
const loading = computed(() => productsStore.loading)

const filteredProducts = computed(() => {
  let filtered = [...productsStore.allProducts]
  
  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // Filter by categories
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(product => {
      const category = productsStore.allCategories.find(cat => cat.name === selectedCategories.value.find(sc => sc === cat.name))
      return category && product.category === category.title
    })
  }
  
  // Sort products
  if (sortOrder.value === 'ASC') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    filtered.sort((a, b) => b.title.localeCompare(a.title))
  }
  
  return filtered
})

const totalCount = computed(() => filteredProducts.value.length)

const fetchData = async () => {
  await productsStore.loadProducts()
  hasMore.value = false // All products loaded at once
}

const searchProducts = () => {
  // Products are filtered reactively through computed property
}

const filterProducts = () => {
  // Products are filtered reactively through computed property
}

const addToCart = async (product) => {
  if (!product.variations || product.variations.length === 0) {
    console.error('No variations available for this product')
    return
  }

  addingToCart.value[product.name] = true

  try {
    const defaultVariation = product.variations[0]
    const result = await cartStore.addToCart(product, defaultVariation, 1)

    if (result.success) {
      // Show success feedback
      cartStore.openCart()
    } else {
      console.error('Failed to add to cart:', result.message)
    }
  } catch (error) {
    console.error('Add to cart error:', error)
  } finally {
    addingToCart.value[product.name] = false
  }
}

const loadMore = () => {
  // All products loaded at once for this simple implementation
}

// Set initial category from route if provided
onMounted(async () => {
  await fetchData()

  if (routeCategory.value) {
    selectedCategories.value = [routeCategory.value]
  }
})

// Watch for route changes
watch(() => route.params.category, (newCategory) => {
  if (newCategory && !selectedCategories.value.includes(newCategory)) {
    selectedCategories.value = [newCategory]
  }
})
</script>

<style scoped>
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
}

.add-to-cart-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .card-actions {
    flex-direction: row;
    align-items: center;
  }
}
</style>
