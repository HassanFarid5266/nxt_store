<!-- Badge Component -->
<template>
  <component :is="tag" :href="href" :to="to" :class="badgeClasses" v-bind="$attrs">
    <slot>{{ text }}</slot>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'card', 'media', 'section'].includes(value)
  },
  href: {
    type: String,
    default: null
  },
  to: {
    type: [String, Object],
    default: null
  },
  customClass: {
    type: String,
    default: ''
  }
})

const tag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'span'
})

const badgeClasses = computed(() => {
  const baseClass = props.variant === 'default' ? 'badge' : `${props.variant}-badge`
  return [baseClass, props.customClass].filter(Boolean).join(' ')
})
</script>
