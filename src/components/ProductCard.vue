<template>
  <div class="card card-product" :class="cardClass">
    <router-link 
      :to="`/product/${product.name}/`" 
      class="card-image"
    >
      <img 
        :src="product.image" 
        class="image" 
        :alt="product.alt || product.title" 
        loading="lazy"
      />
    </router-link>
    <div class="card-body">
      <router-link 
        v-if="product.category" 
        :to="`/shop/${product.category.name}/`" 
        class="card-badge"
      >
        {{ product.category.title }}
      </router-link>
      <RatingStars 
        v-if="showRating" 
        :rating="product.rating || 5" 
        :show-number="showRatingNumber"
      />
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
      <router-link 
        v-if="showButton"
        :to="`/product/${product.name}/`" 
        class="btn btn-pill btn-sm btn-primary"
      >
        {{ buttonText }}
        <i class="bx bx-right-arrow-alt icon-end"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import RatingStars from './RatingStars.vue'

defineProps({
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
    default: 'text-ellipsis-2'
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
  buttonText: {
    type: String,
    default: 'See details'
  }
})
</script>
