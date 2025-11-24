<template>
  <div class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
    <button
      @click="$emit('click')"
      :class="[
        'rounded-full w-14 h-14 md:w-16 md:h-16',
        'flex items-center justify-center font-bold text-lg md:text-xl',
        'shadow-lg hover:shadow-xl',
        'transition-all duration-200',
        'hover:scale-110 active:scale-95',
        variantClasses
      ]"
      :aria-label="label"
    >
      <slot>{{ icon }}</slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon?: string
  label?: string
  variant?: 'primary' | 'secondary' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  icon: '+',
  label: 'Add item',
  variant: 'primary'
})

defineEmits<{
  click: []
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-neutral-500 text-white hover:bg-neutral-600'
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600'
    default:
      return 'bg-fresh-green text-white hover:bg-green-600'
  }
})
</script>

<style scoped>

button {
  will-change: transform, box-shadow;
}
</style>
