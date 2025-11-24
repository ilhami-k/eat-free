<template>
  <div class="ingredients-grid">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .ingredients-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .ingredients-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  .ingredients-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 639px) {
  .ingredients-grid {
    gap: 0.75rem;
  }
}
</style>
