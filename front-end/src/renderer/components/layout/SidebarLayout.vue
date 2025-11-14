<template>
  <div class="flex h-screen overflow-hidden bg-light-gray">
    <!-- Sidebar -->
    <Sidebar :title="sidebarTitle" :is-visible="isSidebarVisible">
      <slot name="sidebar" />
      <template v-if="$slots['sidebar-footer']" #footer>
        <slot name="sidebar-footer" />
      </template>
    </Sidebar>

    <!-- Main Content Area with Drawer -->
    <div class="flex flex-1 overflow-hidden relative">
      <!-- Main scrollable area -->
      <main class="flex-1 flex flex-col overflow-hidden relative">
        <!-- Top Bar -->
        <TopBar v-if="$slots.topbar" :title="title" :subtitle="subtitle">
          <slot name="topbar" />
          <template v-if="$slots['topbar-extended']" #extended>
            <slot name="topbar-extended" />
          </template>
        </TopBar>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
            <slot />
          </div>
        </div>
      </main>

      <!-- Right Drawer (positioned within flex container, slides in from right) -->
      <Drawer
        v-if="$slots['drawer-content']"
        :is-open="isDrawerOpen"
        :title="drawerTitle"
        @close="$emit('update:isDrawerOpen', false)"
      >
        <slot name="drawer-content" />
        <template v-if="$slots['drawer-footer']" #footer>
          <slot name="drawer-footer" />
        </template>
      </Drawer>
    </div>

    <!-- Floating Action Button -->
    <FloatingActionButton
      v-if="showFab"
      :icon="fabIcon"
      :label="fabLabel"
      :variant="fabVariant"
      @click="$emit('fab-click')"
    />
  </div>
</template>

<script setup lang="ts">
import Sidebar from '../ui/Sidebar.vue'
import TopBar from './TopBar.vue'
import Drawer from '../ui/Drawer.vue'
import FloatingActionButton from '../ui/FloatingActionButton.vue'

interface Props {
  title?: string
  subtitle?: string
  sidebarTitle?: string
  drawerTitle?: string
  isDrawerOpen?: boolean
  isSidebarVisible?: boolean
  showFab?: boolean
  fabIcon?: string
  fabLabel?: string
  fabVariant?: 'primary' | 'secondary' | 'danger'
}

interface Emits {
  (e: 'update:isDrawerOpen', value: boolean): void
  (e: 'fab-click'): void
}

withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  sidebarTitle: '',
  drawerTitle: '',
  isDrawerOpen: false,
  isSidebarVisible: true,
  showFab: true,
  fabIcon: '+',
  fabLabel: 'Add',
  fabVariant: 'primary'
})

defineEmits<Emits>()
</script>

<style scoped>
/* Smooth scrolling */
.overflow-y-auto {
  scroll-behavior: smooth;
}
</style>

