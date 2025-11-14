<template>
  <aside
    :class="[
      'hidden md:flex flex-col border-r border-neutral-200',
      'bg-white w-64 sticky top-0 h-screen overflow-y-auto z-20',
      'transition-transform duration-200',
      !isVisible && 'md:hidden'
    ]"
  >
    <!-- Header -->
    <div v-if="title" class="p-6 border-b border-neutral-200 flex-shrink-0">
      <h3 class="font-semibold text-neutral-900 text-lg">{{ title }}</h3>
    </div>

    <!-- Content -->
    <nav class="flex-1 space-y-1 p-4 overflow-y-auto">
      <slot />
    </nav>

    <!-- Footer -->
    <div v-if="$slots.footer" class="p-4 border-t border-neutral-200 flex-shrink-0">
      <slot name="footer" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  isVisible?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  isVisible: true
})
</script>

<style scoped>
/* Smooth scrolling */
aside {
  scroll-behavior: smooth;
}
</style>
