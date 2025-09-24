<!-- Tabs Component -->
<template>
  <div class="tabs">
    <div class="tab-nav" v-if="showNavigation">
      <button v-for="(tab, index) in tabs" :key="tab.id" :class="['tab-item', { active: activeTab === tab.id }]"
        @click="setActiveTab(tab.id)" :data-nxt-toggle="tab.id">
        {{ tab.title }}
      </button>
    </div>
    <div class="tab-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'

const props = defineProps({
  defaultTab: {
    type: String,
    default: ''
  },
  showNavigation: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['tab-change'])

const activeTab = ref(props.defaultTab)
const tabs = ref([])

const addTab = (tab) => {
  tabs.value.push(tab)
  if (!activeTab.value && tabs.value.length === 1) {
    activeTab.value = tab.id
  }
}

const removeTab = (tabId) => {
  const index = tabs.value.findIndex(tab => tab.id === tabId)
  if (index > -1) {
    tabs.value.splice(index, 1)
  }
}

const setActiveTab = (tabId) => {
  activeTab.value = tabId
  emit('tab-change', tabId)
}

provide('tabs', {
  activeTab,
  addTab,
  removeTab
})

onMounted(() => {
  if (props.defaultTab) {
    activeTab.value = props.defaultTab
  }
})
</script>
