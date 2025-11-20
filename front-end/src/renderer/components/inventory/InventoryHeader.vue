<template>
  <div class="inventory-header">
    <div class="header-content">
      <h1 class="page-title">My Inventory</h1>
      <p class="page-subtitle">{{ count }} ingredient{{ count !== 1 ? 's' : '' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count: number
}>()
</script>

<style scoped>
.inventory-header {
  background: linear-gradient(135deg, rgba(120, 224, 143, 0.08) 0%, rgba(255, 255, 255, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(120, 224, 143, 0.2);
  padding: 1.5rem 1rem 1rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 0.5rem;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 0.25rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--color-dark-gray);
  font-weight: 500;
}

@media (max-width: 639px) {
  .page-title {
    font-size: 1.5rem;
  }
}
</style>
