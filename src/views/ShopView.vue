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
            <input type="search" placeholder="Search..." id="search" name="search" v-model="shopStore.searchQuery"
              class="field" />
            <button type="submit" class="bx bx-search btn-search"></button>
          </div>
        </form>

        <div class="categories">
          <h3 class="section-subtitle">Categories</h3>
          <input type="hidden" id="categories" :value="routeCategory" name="categories">
          <label v-for="item in categories" :key="item.name" class="check check-block" :for="item.name">
            <input type="checkbox" name="category" class="category" :id="item.name" :value="item.name"
              v-model="shopStore.selectedCategories" @change="filterProducts" />
            {{ item.title }}
          </label>
        </div>
      </div>
    </section>

    <section class="col-right">
      <div class="page-meta">
        <h4 class="page-title">Products <span class="count" id="count">({{ shopStore.totalCount }})</span></h4>
        <div class="select">
          <label for="sort">Sort</label>
          <select name="sort" id="sort" v-model="shopStore.sortOrder" @change="filterProducts">
            <option value="DESC" selected>Recent</option>
            <option value="ASC">Oldest</option>
          </select>
        </div>
      </div>

      <div class="grid grid-shop" id="listing">
        <template v-if="shopStore.loading && shopStore.currentPage === 1">
          <div class="loading">Loading products...</div>
        </template>
        <template v-else-if="shopStore.filteredProducts.length === 0">
          <div class="no-records">No products found!</div>
        </template>
        <template v-else>
          <ProductCard v-for="product in shopStore.filteredProducts" :key="product.name" :product="product"
            :show-add-to-cart="true" :show-button="true" button-text="View Details" />
        </template>
      </div>

      <div class="pagination">
        <button v-if="shopStore.hasMore" class="btn btn-primary btn-sm btn-pill" id="loadmore" @click="loadMore"
          :disabled="shopStore.loading">
          {{ shopStore.loading ? 'Loading...' : 'Load more' }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useShopStore } from '@/stores/shop'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const productsStore = useProductsStore()
const shopStore = useShopStore()

const routeCategory = computed(() => route.params.category || '')

// Use store data
const categories = computed(() => productsStore.categories)

const fetchData = async () => {
  await productsStore.loadProducts()
  shopStore.resetPagination()
}

const searchProducts = () => {
  shopStore.searchProducts()
}

const filterProducts = () => {
  shopStore.filterProducts()
}

const loadMore = () => {
  shopStore.loadMore()
}

// Set initial category from route if provided
onMounted(async () => {
  await fetchData()

  if (routeCategory.value) {
    shopStore.initializeWithCategory(routeCategory.value)
  }
})

// Watch for route changes
watch(() => route.params.category, (newCategory) => {
  if (newCategory) {
    shopStore.initializeWithCategory(newCategory)
  }
})
</script>
