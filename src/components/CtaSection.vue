<template>
  <section class="card card-cta card-centered boxed" :class="sectionClass" data-aos-duration="1000" data-aos="fade-up"
    data-aos-once="true" data-aos-easing="ease-in-out">
    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-subtitle">{{ subtitle }}</p>
      <component :is="linkType" :to="linkType === 'router-link' ? to : undefined"
        :href="linkType === 'a' ? href : undefined" :target="target" class="btn btn-primary btn-lg btn-pill"
        :class="buttonClass">
        {{ buttonText }}
      </component>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Still have questions?'
  },
  subtitle: {
    type: String,
    default: "Can't find the answer you're looking for? Please chat to our friendly team."
  },
  buttonText: {
    type: String,
    default: 'Get in touch'
  },
  href: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    default: ''
  },
  target: {
    type: String,
    default: '_blank'
  },
  buttonClass: {
    type: String,
    default: 'pro'
  },
  sectionClass: {
    type: String,
    default: ''
  },
  isExternal: {
    type: Boolean,
    default: true
  }
})

const linkType = computed(() => {
  return props.isExternal ? 'a' : 'router-link'
})
</script>
