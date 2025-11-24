<template>
  <div class="space-y-2">
    <button
      v-for="item in items"
      :key="item.id"
      @click="toggleItem(item.id)"
      class="w-full flex items-center justify-between p-4
             bg-white border border-neutral-200 rounded-lg
             hover:bg-neutral-50 hover:border-neutral-300
             transition-colors text-left"
    >
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-neutral-900 truncate">{{ item.label }}</h3>
        <p v-if="item.description" class="text-sm text-neutral-600 truncate">
          {{ item.description }}
        </p>
      </div>
      <span
        :class="[
          'ml-2 flex-shrink-0 transition-transform text-neutral-600',
          expandedId === item.id && 'rotate-180'
        ]"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </span>
    </button>

    <!-- Expanded Content -->
    <transition-group name="accordion" tag="div" class="space-y-2">
      <div
        v-for="item in items"
        v-show="expandedId === item.id"
        :key="`${item.id}-content`"
        class="animate-accordion-slide"
      >
        <div class="pl-4 pr-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200 border-t-0 -mt-0.5">
          <slot :item="item" />
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface AccordionItem {
  id: string | number
  label: string
  description?: string
}

interface Props {
  items: AccordionItem[]
  modelValue?: string | number | null
}

interface Emits {
  (e: 'update:modelValue', value: string | number | null): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null
})

const emit = defineEmits<Emits>()

const expandedId = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const toggleItem = (id: string | number) => {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<style scoped>

.accordion-enter-active,
.accordion-leave-active {
  transition: all 200ms ease-out;
}

.accordion-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.accordion-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.animate-accordion-slide {
  animation: slideDown 200ms ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 500px;
  }
}
</style>
