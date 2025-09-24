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
            {{ item.name }}
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
        <template v-else-if="products.length === 0">
          <div class="no-records">No products found!</div>
        </template>
        <template v-else>
          <div 
            v-for="product in products" 
            :key="product.name"
            class="card card-product"
          >
            <router-link :to="`/product/${product.name}`" class="card-image">
              <img :src="product.image" class="image" :alt="product.alt" />
            </router-link>
            <div class="card-body">
              <router-link :to="`/shop/${product.category}`" class="card-badge">{{ product.category }}</router-link>
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
              <div class="card-ratings ratings">
                <span class="bx bxs-star active"></span><b>5</b>
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

const route = useRoute()

const products = ref([])
const categories = ref([])
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const hasMore = ref(false)

const searchQuery = ref('')
const selectedCategories = ref([])
const sortOrder = ref('DESC')

const routeCategory = computed(() => route.params.category || '')

const fetchCategories = async () => {
  try {
    // TODO: Replace with actual API call
    // Simulating API call for now
    categories.value = [
      { name: "Web Development" },
      { name: "Mobile Apps" },
      { name: "E-commerce" },
      { name: "Design" }
    ]
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchProducts = async (page = 1, append = false) => {
  loading.value = true
  
  try {
    // TODO: Replace with actual API call
    // Simulating API response for now
    const mockProducts = [
      {
        name: "product1",
        image: "/images/product1.jpg",
        alt: "Product 1",
        title: "Sample Product 1",
        excerpt: "This is a sample product description",
        category: "Web Development",
        variations: [{ price: "99.99", discount: null }]
      },
      {
        name: "product2", 
        image: "/images/product2.jpg",
        alt: "Product 2",
        title: "Sample Product 2",
        excerpt: "Another sample product",
        category: "Mobile Apps",
        variations: [{ price: "149.99", discount: "$199.99" }]
      }
    ]
    
    if (append) {
      products.value = [...products.value, ...mockProducts]
    } else {
      products.value = mockProducts
    }
    
    totalCount.value = mockProducts.length
    hasMore.value = false // Set to true if more pages available
    currentPage.value = page
    
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const searchProducts = () => {
  currentPage.value = 1
  fetchProducts(1, false)
}

const filterProducts = () => {
  currentPage.value = 1
  fetchProducts(1, false)
}

const loadMore = () => {
  if (hasMore.value) {
    fetchProducts(currentPage.value + 1, true)
  }
}

// Set initial category from route if provided
onMounted(async () => {
  await fetchCategories()
  
  if (routeCategory.value) {
    selectedCategories.value = [routeCategory.value]
  }
  
  await fetchProducts()
})

// Watch for route changes
watch(() => route.params.category, (newCategory) => {
  if (newCategory && !selectedCategories.value.includes(newCategory)) {
    selectedCategories.value = [newCategory]
    filterProducts()
  }
})
</script>
