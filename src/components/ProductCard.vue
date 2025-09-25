<template>
  <div class="card card-product" :class="cardClass">
    <router-link :to="`/product/${product.name}/`" class="card-image">
      <img :src="product.image" class="image" :alt="product.alt || product.title" loading="lazy" />
    </router-link>
    <div class="card-body">
      <router-link v-if="product.category" :to="`/shop/${product.category.name}/`" class="card-badge">
        {{ product.category.title }}
      </router-link>
      <RatingStars v-if="showRating" :rating="product.rating || 5" :show-number="showRatingNumber" />
      <h3 class="card-title" :class="titleClass">
        <router-link :to="`/product/${product.name}/`">
          {{ product.title }}
        </router-link>
      </h3>
      <p v-if="showDescription" class="card-subtitle" :class="descriptionClass">
        {{ product.excerpt || product.description }}
      </p>
    </div>
    <div v-if="showPrice" class="card-foot">
      <h3 class="card-subtitle">
        <template v-if="product.variations && product.variations.length > 0">
          <template v-if="product.variations[0].discount">
            {{ product.variations[0].discount }}
            <del>${{ product.variations[0].price }}</del>
          </template>
          <template v-else>
            ${{ product.variations[0].price }}
          </template>
        </template>
        <template v-else>
          Custom price
        </template>
      </h3>
      <div v-if="showButton || showAddToCart" class="card-actions">
        <!-- <button v-if="showAddToCart" @click="addToCart" :disabled="addingToCart"
          class="btn btn-pill btn-sm btn-primary add-to-cart-btn" style="margin-right: 10px;">
          <i v-if="addingToCart" class="bx bx-loader-alt bx-spin"></i>
          <i v-else class="bx bx-cart-add"></i>
          {{ addingToCart ? 'Adding...' : 'Add to Cart' }}
        </button> -->

        <router-link v-if="showButton" :to="`/product/${product.name}/`"
          class="btn btn-pill btn-sm btn-outline-primary">
          {{ buttonText }}
          <i class="bx bx-right-arrow-alt icon-end"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import RatingStars from './RatingStars.vue'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  cardClass: {
    type: String,
    default: ''
  },
  titleClass: {
    type: String,
    default: 'text-ellipsis'
  },
  descriptionClass: {
    type: String,
    default: 'text-ellipsis text-ellipsis-3'
  },
  showDescription: {
    type: Boolean,
    default: true
  },
  showPrice: {
    type: Boolean,
    default: true
  },
  showRating: {
    type: Boolean,
    default: false
  },
  showRatingNumber: {
    type: Boolean,
    default: false
  },
  showButton: {
    type: Boolean,
    default: false
  },
  showAddToCart: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: 'See details'
  }
})

const cartStore = useCartStore()

// Use centralized addingToCart state from cart store
const addingToCart = computed(() => cartStore.isAddingToCart(props.product.name))

const addToCart = async () => {
  if (!props.product.variations || props.product.variations.length === 0) {
    console.error('No variations available for this product')
    return
  }

  try {
    const defaultVariation = props.product.variations[0]
    const result = await cartStore.addToCart(props.product, defaultVariation, 1)

    if (result.success) {
      // Show success feedback (could be a toast/notification)
      cartStore.openCart()
    } else {
      console.error('Failed to add to cart:', result.message)
    }
  } catch (error) {
    console.error('Add to cart error:', error)
  }
}
</script>
