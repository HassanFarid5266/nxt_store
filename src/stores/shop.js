import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductsStore } from './products'

export const useShopStore = defineStore('shop', () => {
  // Filter and pagination state
  const searchQuery = ref('')
  const selectedCategories = ref([])
  const sortOrder = ref('DESC')
  const currentPage = ref(1)
  const hasMore = ref(false)
  const loading = ref(false)

  // Get products store
  const productsStore = useProductsStore()

  // Computed filtered products
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
        const category = productsStore.allCategories.find(cat => 
          selectedCategories.value.includes(cat.name)
        )
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

  // Actions
  const setSearchQuery = (query) => {
    searchQuery.value = query
    currentPage.value = 1
  }

  const setSelectedCategories = (categories) => {
    selectedCategories.value = categories
    currentPage.value = 1
  }

  const setSortOrder = (order) => {
    sortOrder.value = order
    currentPage.value = 1
  }

  const addSelectedCategory = (categoryName) => {
    if (!selectedCategories.value.includes(categoryName)) {
      selectedCategories.value.push(categoryName)
      currentPage.value = 1
    }
  }

  const removeSelectedCategory = (categoryName) => {
    selectedCategories.value = selectedCategories.value.filter(cat => cat !== categoryName)
    currentPage.value = 1
  }

  const toggleCategory = (categoryName) => {
    if (selectedCategories.value.includes(categoryName)) {
      removeSelectedCategory(categoryName)
    } else {
      addSelectedCategory(categoryName)
    }
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedCategories.value = []
    sortOrder.value = 'DESC'
    currentPage.value = 1
  }

  const initializeWithCategory = (categoryName) => {
    if (categoryName && !selectedCategories.value.includes(categoryName)) {
      selectedCategories.value = [categoryName]
    }
  }

  const searchProducts = () => {
    // Products are filtered reactively through computed property
    // This function is kept for compatibility but could trigger additional actions
    currentPage.value = 1
  }

  const filterProducts = () => {
    // Products are filtered reactively through computed property
    // This function is kept for compatibility but could trigger additional actions
    currentPage.value = 1
  }

  const loadMore = () => {
    // For future implementation when pagination is needed
    // Currently all products are loaded at once
    currentPage.value += 1
  }

  const resetPagination = () => {
    currentPage.value = 1
    hasMore.value = false
  }

  return {
    // State
    searchQuery,
    selectedCategories,
    sortOrder,
    currentPage,
    hasMore,
    loading,

    // Computed
    filteredProducts,
    totalCount,

    // Actions
    setSearchQuery,
    setSelectedCategories,
    setSortOrder,
    addSelectedCategory,
    removeSelectedCategory,
    toggleCategory,
    clearFilters,
    initializeWithCategory,
    searchProducts,
    filterProducts,
    loadMore,
    resetPagination
  }
})
