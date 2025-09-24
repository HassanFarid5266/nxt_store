<!-- TabPane Component -->
<template>
  <div v-show="isActive" :id="id" class="tab-pane" :class="{ active: isActive }">
    <slot />
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const tabs = inject('tabs')

const isActive = computed(() => {
  return tabs.activeTab.value === props.id
})

onMounted(() => {
  tabs.addTab({
    id: props.id,
    title: props.title
  })
})

onUnmounted(() => {
  tabs.removeTab(props.id)
})
</script>
