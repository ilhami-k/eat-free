<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <transition name="fade">
      <div
        v-if="isOpen"
        @click="$emit('close')"
        class="fixed inset-0 bg-black/30 z-[55]"
      />
    </transition>

    <!-- Drawer -->
    <transition name="slide-right">
      <div
        v-if="isOpen"
        class="fixed right-0 top-0 h-screen w-full sm:w-96
                bg-white shadow-2xl z-[60] flex flex-col"
      >
        <!-- Header with close -->
        <div class="flex items-center justify-between p-4 border-b border-medium-gray">
          <h2 class="text-lg font-semibold text-neutral-900">{{ title }}</h2>
          <button
            @click="$emit('close')"
            class="text-dark-gray hover:text-black transition"
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        <!-- Content (scrollable) -->
        <div class="flex-1 overflow-y-auto p-4">
          <slot />
        </div>

        <!-- Footer with actions (optional) -->
        <div v-if="$slots.footer" class="border-t border-medium-gray p-4 flex gap-2">
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 300ms ease-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
