<template>
  <div class="state-container">
    <!-- Loading State -->
    <template v-if="state === 'loading'">
      <div class="loading-spinner"></div>
    </template>

    <!-- Error State -->
    <template v-else-if="state === 'error'">
      <div class="error-card">
        <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <h3 class="error-title">Error Loading Inventory</h3>
        <p class="error-message">{{ errorMessage }}</p>
        <button @click="$emit('retry')" class="retry-button">
          Try Again
        </button>
      </div>
    </template>

    <!-- Success (All Set) State -->
    <template v-else-if="state === 'success'">
      <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="success-title">All Set!</p>
      <p class="success-message">You have all ingredients needed for your meal plan.</p>
    </template>

    <!-- Empty State -->
    <template v-else-if="state === 'empty'">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p class="empty-message">{{ emptyMessage }}</p>
      <button @click="$emit('add')" class="primary-button">
        {{ emptyActionText }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  state: 'loading' | 'error' | 'success' | 'empty'
  errorMessage?: string
  emptyMessage?: string
  emptyActionText?: string
}>()

defineEmits<{
  retry: []
  add: []
}>()
</script>

<style scoped>
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(120, 224, 143, 0.2);
  border-top-color: var(--color-fresh-green);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-card {
  background: rgba(255, 107, 129, 0.08);
  border: 2px solid rgba(255, 107, 129, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
}

.error-icon {
  width: 3rem;
  height: 3rem;
  color: var(--color-strawberry-red);
  margin: 0 auto 1rem;
}

.error-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #c62828;
  margin-bottom: 0.5rem;
}

.error-message {
  font-size: 0.875rem;
  color: #d32f2f;
  margin-bottom: 1.5rem;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid rgba(255, 107, 129, 0.3);
  border-radius: 0.75rem;
  color: var(--color-strawberry-red);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background: rgba(255, 107, 129, 0.05);
  border-color: var(--color-strawberry-red);
}

.success-icon {
  width: 4rem;
  height: 4rem;
  color: var(--color-fresh-green);
  margin-bottom: 1rem;
  stroke-width: 2;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 0.5rem;
}

.success-message {
  color: var(--color-dark-gray);
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: var(--color-medium-gray);
  margin-bottom: 1rem;
}

.empty-message {
  color: var(--color-dark-gray);
  margin-bottom: 1.5rem;
}

.primary-button {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, var(--color-fresh-green) 0%, #6bc785 100%);
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(120, 224, 143, 0.3);
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(120, 224, 143, 0.4);
}

.primary-button:active {
  transform: translateY(0);
}
</style>
