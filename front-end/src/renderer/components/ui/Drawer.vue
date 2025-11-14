<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <transition name="fade">
      <div
        v-if="isOpen"
        @click="$emit('close')"
        class="fixed inset-0 bg-black/30 z-40 transition-opacity"
      />
    </transition>

    <!-- Drawer -->
    <transition name="slide-right">
      <div
        v-if="isOpen"
        class="fixed right-0 top-0 bottom-0 w-full sm:w-96 
                bg-white shadow-2xl z-50 flex flex-col overflow-hidden sm:rounded-l-3xl"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-neutral-200 flex-shrink-0">
          <h2 class="text-lg font-semibold text-neutral-900">{{ title }}</h2>
          <button
            @click="$emit('close')"
            class="p-1 text-neutral-500 hover:text-neutral-900 transition rounded-md hover:bg-neutral-100"
            aria-label="Close drawer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <slot />
        </div>

        <!-- Footer Actions (optional) -->
        <div v-if="$slots.footer" class="border-t border-neutral-200 p-4 flex-shrink-0 flex gap-2">
          <slot name="footer" />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title?: string
}>()

defineEmits<{
  close: []
}>()
</script>

<style scoped>
/* Backdrop fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Drawer slide transition */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  transform: translateX(100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
