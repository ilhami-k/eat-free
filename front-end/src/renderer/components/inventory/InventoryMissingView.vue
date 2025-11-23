<template>
  <div class="missing-container">
    <div class="alert-banner">
      <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <div>
        <h3 class="alert-title">
          {{ missingIngredients.length }} Missing Ingredient{{ missingIngredients.length !== 1 ? 's' : '' }}
        </h3>
        <p class="alert-message">
          Add these to your inventory to complete your weekly meal plan.
        </p>
      </div>
    </div>

    <div class="ingredients-grid">
      <div
        v-for="missing in missingIngredients"
        :key="missing.ingredient_id"
        class="ingredient-card card-missing"
      >
        <div class="card-header">
          <h4 class="card-title">{{ missing.ingredient_name }}</h4>
          <span class="status-badge status-badge-danger">Missing</span>
        </div>
        <div class="card-body">
          <div class="quantity-display">
            <span class="quantity-label">Need:</span>
            <span class="quantity-value">{{ Math.round(missing.required_grams) }}g</span>
          </div>
        </div>
        <button @click="$emit('add', missing)" class="add-button">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add to Inventory
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MissingIngredient {
  ingredient_id: number
  ingredient_name: string
  required_grams: number
}

defineProps<{
  missingIngredients: MissingIngredient[]
}>()

defineEmits<{
  add: [ingredient: MissingIngredient]
}>()
</script>

<style scoped>
.missing-container {
  max-width: 1200px;
  margin: 0 auto;
}

.alert-banner {
  background: linear-gradient(135deg, rgba(255, 107, 129, 0.1) 0%, rgba(255, 107, 129, 0.05) 100%);
  border: 2px solid rgba(255, 107, 129, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  box-shadow: 0 4px 12px rgba(255, 107, 129, 0.15);
}

.alert-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-strawberry-red);
  flex-shrink: 0;
}

.alert-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #c62828;
  margin-bottom: 0.375rem;
}

.alert-message {
  font-size: 0.875rem;
  color: #d32f2f;
}

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

.ingredient-card {
  background: white;
  border: 2px solid rgba(255, 107, 129, 0.4);
  border-radius: 1.25rem;
  padding: 1rem;
  text-align: left;
  box-shadow: 0 2px 8px rgba(255, 107, 129, 0.15);
  display: flex;
  flex-direction: column;
  min-height: 210px;
}

.card-missing {
  background: linear-gradient(135deg, rgba(255, 107, 129, 0.03) 0%, white 100%);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-black);
  line-height: 1.3;
  flex: 1;
  min-width: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.status-badge-danger {
  background: rgba(255, 107, 129, 0.15);
  color: #c62828;
}

.card-body {
  margin-bottom: 0.75rem;
  flex: 1;
}

.quantity-display {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.quantity-label {
  font-size: 0.75rem;
  color: var(--color-dark-gray);
  font-weight: 500;
}

.quantity-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-strawberry-red);
}

.add-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0 0.75rem;
  height: 2.5rem;
  background: linear-gradient(135deg, var(--color-fresh-green) 0%, #6bc785 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(120, 224, 143, 0.3);
  line-height: 1;
  margin-top: auto;
}

.add-button svg {
  width: 1rem;
  height: 1rem;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(120, 224, 143, 0.4);
}

.add-button:active {
  transform: translateY(0);
}

@media (max-width: 639px) {
  .ingredients-grid {
    gap: 0.75rem;
  }
}
</style>
