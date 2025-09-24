<!-- Shop Page View -->
<template>
  <div>
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
          <form @submit.prevent="searchProducts">
            <div class="page-search">
              <input 
                type="search" 
                placeholder="Search..." 
                v-model="searchQuery"
                class="field" 
              />
              <button type="submit" class="bx bx-search btn-search"></button>
            </div>
          </form>
          
          <div class="categories">
            <h3 class="section-subtitle">Categories</h3>
            <label 
              v-for="category in categories" 
              :key="category.name"
              class="check check-block" 
              :for="category.name"
            >
              <input 
                type="checkbox" 
                name="category" 
                class="category" 
                :id="category.name" 
                :value="category.name"
                v-model="selectedCategories"
                @change="filterProducts"
              />
              {{ category.name }}
            </label>
          </div>
        </div>
      </section>
      
      <section class="col-right">
        <div class="page-meta">
          <h4 class="page-title">Products <span class="count">({{ totalCount }})</span></h4>
          <div class="select">
            <label for="sort">Sort</label>
            <select v-model="sortOrder" @change="filterProducts">
              <option value="DESC">Recent</option>
              <option value="ASC">Oldest</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-shop">
          <div v-if="loading" class="loading">Loading products...</div>
          <div v-else-if="products.length === 0" class="no-records">No products exist!</div>
          <div 
            v-else 
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
              <h3 class="card-subtitle">{{ product.price }}</h3>
              <div class="card-ratings ratings">
                <span class="bx bxs-star active"></span><b>5</b>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="hasMore" class="pagination">
          <button 
            class="btn btn-primary btn-sm btn-pill" 
            @click="loadMore"
            :disabled="loading"
          >
            {{ loading ? 'Loading...' : 'Load more' }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ApiUrl, apiRequest, searchParams } from '@/utils/api'

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

const fetchCategories = async () => {
  try {
    const response = await apiRequest(ApiUrl('nextash_store.events.products.get_categories'))
    categories.value = response.message || []
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchProducts = async (page = 1, append = false) => {
  loading.value = true
  
  try {
    const params = {
      limit: 6,
      page: page,
      sort: sortOrder.value,
      categories: selectedCategories.value.join(','),
      search: searchQuery.value,
    }
    
    const queryString = searchParams(params)
    const response = await apiRequest(ApiUrl(`nextash_store.events.products.listing?${queryString}`))
    const data = response.message
    
    if (data.count === 0) {
      totalCount.value = 0
      products.value = []
    } else {
      totalCount.value = data.count
      if (append) {
        products.value = [...products.value, ...data.results]
      } else {
        products.value = data.results
      }
    }
    
    hasMore.value = !!data.next
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
  
  const categoryFromRoute = route.params.category
  if (categoryFromRoute) {
    selectedCategories.value = [categoryFromRoute]
  }
  
  await fetchProducts()
})

// Watch for route changes
watch(() => route.params.category, (newCategory) => {
  if (newCategory) {
    selectedCategories.value = [newCategory]
    filterProducts()
  }
})
</script>
