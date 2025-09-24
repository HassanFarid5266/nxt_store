<template>
  <article class="media media-product">
    <router-link 
      :to="`/product/${product.name}/`" 
      class="media-image"
    >
      <img 
        :src="product.image" 
        class="image" 
        :alt="product.alt || product.title" 
        loading="lazy"
      />
    </router-link>
    <div class="media-body">
      <router-link 
        v-if="product.category" 
        :to="`/shop/${product.category.name}/`" 
        class="media-badge"
      >
        {{ product.category.title }}
      </router-link>
      <RatingStars 
        v-if="showRating" 
        :rating="product.rating || 5" 
        :show-number="true"
      />
      <h3 class="media-title text-ellipsis">
        <router-link :to="`/product/${product.name}/`">
          {{ product.title }}
        </router-link>
      </h3>
      <p class="media-desc">
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
      </p>
      <router-link 
        :to="`/product/${product.name}/`" 
        class="btn btn-pill btn-sm btn-primary"
      >
        {{ buttonText }}
        <i class="bx bx-right-arrow-alt icon-end"></i>
      </router-link>
    </div>
  </article>
</template>

<script setup>
import RatingStars from './RatingStars.vue'

defineProps({
  product: {
    type: Object,
    required: true
  },
  showRating: {
    type: Boolean,
    default: true
  },
  buttonText: {
    type: String,
    default: 'See details'
  }
})
</script>
