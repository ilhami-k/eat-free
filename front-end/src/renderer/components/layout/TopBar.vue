<template>
  <div
    class="sticky top-0 z-30 bg-white border-b border-neutral-200 
           shadow-sm p-4 backdrop-blur-sm bg-white/95"
  >
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <!-- Title -->
      <div v-if="title" class="min-w-0">
        <h1 class="text-2xl font-display font-bold text-neutral-900 truncate">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="text-sm text-neutral-600">{{ subtitle }}</p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 flex-wrap md:flex-nowrap">
        <slot />
      </div>
    </div>

    <!-- Extended content (optional) -->
    <div v-if="$slots.extended" class="mt-3 pt-3 border-t border-neutral-200">
      <slot name="extended" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: ''
})
</script>

<style scoped>
/* Subtle backdrop blur effect */
div {
  backdrop-filter: blur(10px);
}
</style>
