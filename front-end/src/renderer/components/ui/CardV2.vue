<template>
  <div
    :class="[
      'rounded-lg border bg-white transition-all duration-200',
      'hover:shadow-md hover:border-fresh-green',
      isClickable && 'cursor-pointer hover:shadow-lg',
      isSelected ? 'border-fresh-green bg-fresh-green/5' : 'border-neutral-200',
      'overflow-hidden group'
    ]"
    @click="$emit('click')"
  >
    <!-- Header with Badge -->
    <div v-if="header || $slots.header" class="px-4 py-3 border-b border-neutral-200">
      <slot name="header" :header="header">
        <div v-if="header" class="flex items-start justify-between">
          <h3 class="font-semibold text-neutral-900 truncate">{{ header }}</h3>
        </div>
      </slot>
    </div>

    <!-- Content -->
    <div class="p-4">
      <slot />
    </div>

    <!-- Footer with metadata -->
    <div v-if="footer || $slots.footer" class="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
      <slot name="footer" :footer="footer">
        <p v-if="footer" class="text-xs text-neutral-600">{{ footer }}</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  header?: string
  footer?: string
  isClickable?: boolean
  isSelected?: boolean
}

withDefaults(defineProps<Props>(), {
  isClickable: false,
  isSelected: false
})

defineEmits<{
  click: []
}>()
</script>

<style scoped>
/* Smooth transitions */
div {
  will-change: transform, box-shadow, border-color;
}
</style>
