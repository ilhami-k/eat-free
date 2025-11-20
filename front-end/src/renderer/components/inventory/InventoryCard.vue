<template>
  <button
    @click="$emit('click')"
    :class="['ingredient-card', cardClass]"
  >
    <div class="card-header">
      <h4 class="card-title">{{ ingredient.ingredient_name }}</h4>
      <span
        v-if="ingredient.mealPlanStatus?.isNeededForMealPlan"
        :class="[
          'status-badge',
          ingredient.mealPlanStatus.isSufficient ? 'status-badge-success' : 'status-badge-warning'
        ]"
      >
        <svg v-if="ingredient.mealPlanStatus.isSufficient" class="status-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="status-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ ingredient.mealPlanStatus.isSufficient ? 'Ready' : 'Low' }}
      </span>
    </div>

    <div class="card-body">
      <div class="quantity-display">
        <span class="quantity-value">{{ Math.round(ingredient.qty_grams) }}</span>
        <span class="quantity-unit">g</span>
      </div>
      <p class="quantity-label">Available</p>

      <div v-if="ingredient.mealPlanStatus?.isNeededForMealPlan" class="need-info">
        <span class="need-label">Need:</span>
        <span :class="ingredient.mealPlanStatus.isSufficient ? 'need-value' : 'shortage-value'">
          {{ Math.round(ingredient.mealPlanStatus.required_grams) }}g
        </span>
        <span v-if="!ingredient.mealPlanStatus.isSufficient" class="shortage-value">
          ({{ Math.round(ingredient.mealPlanStatus.shortfall_grams) }}g short)
        </span>
      </div>

      <div v-if="ingredient.mealPlanStatus?.isNeededForMealPlan" class="progress-bar">
        <div
          class="progress-fill"
          :class="ingredient.mealPlanStatus.isSufficient ? 'progress-success' : 'progress-warning'"
          :style="{ width: `${Math.min((ingredient.qty_grams / ingredient.mealPlanStatus.required_grams) * 100, 100)}%` }"
        ></div>
      </div>
    </div>

    <div class="card-footer">
      <span class="view-text">View details</span>
      <svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InventoryIngredientWithDetails } from '../../composables/useInventoryService'

interface InventoryItemWithMealPlanStatus extends InventoryIngredientWithDetails {
  mealPlanStatus?: {
    isNeededForMealPlan: boolean
    isSufficient: boolean
    required_grams: number
    shortfall_grams: number
  } | null
}

const props = defineProps<{
  ingredient: InventoryItemWithMealPlanStatus
}>()

defineEmits<{
  click: []
}>()

const cardClass = computed(() => {
  if (props.ingredient.mealPlanStatus?.isNeededForMealPlan) {
    return props.ingredient.mealPlanStatus.isSufficient ? 'card-success' : 'card-warning'
  }
  return ''
})
</script>

<style scoped>
.ingredient-card {
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 1.25rem;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  width: 100%;
}

.ingredient-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.ingredient-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  border-color: var(--color-fresh-green);
}

.ingredient-card:hover::before {
  opacity: 1;
}

.card-success {
  border-color: rgba(120, 224, 143, 0.4);
  background: linear-gradient(135deg, rgba(120, 224, 143, 0.03) 0%, white 100%);
  box-shadow: 0 2px 8px rgba(120, 224, 143, 0.15);
}

.card-success:hover {
  border-color: var(--color-fresh-green);
  box-shadow: 0 8px 20px rgba(120, 224, 143, 0.25);
}

.card-warning {
  border-color: rgba(255, 152, 0, 0.4);
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.03) 0%, white 100%);
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.15);
}

.card-warning:hover {
  border-color: #ff9800;
  box-shadow: 0 8px 20px rgba(255, 152, 0, 0.25);
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
  transition: color 0.2s ease;
}

.ingredient-card:hover .card-title {
  color: var(--color-fresh-green);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.status-badge-success {
  background: rgba(120, 224, 143, 0.15);
  color: var(--color-fresh-green);
}

.status-badge-warning {
  background: rgba(255, 152, 0, 0.15);
  color: #e65100;
}

.status-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.card-body {
  margin-bottom: 0.75rem;
}

.quantity-display {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}

.quantity-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-fresh-green);
  line-height: 1;
}

.quantity-unit {
  font-size: 0.875rem;
  color: var(--color-dark-gray);
  font-weight: 600;
}

.quantity-label {
  font-size: 0.75rem;
  color: var(--color-dark-gray);
  font-weight: 500;
}

.need-info {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

.need-label {
  color: var(--color-dark-gray);
  font-weight: 500;
}

.need-value {
  color: var(--color-black);
  font-weight: 700;
}

.shortage-value {
  color: #ff9800;
  font-weight: 700;
}

.progress-bar {
  width: 100%;
  height: 0.375rem;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 0.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 0.5rem;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-success {
  background: linear-gradient(90deg, var(--color-fresh-green) 0%, #6bc785 100%);
}

.progress-warning {
  background: linear-gradient(90deg, #ff9800 0%, #f57c00 100%);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.view-text {
  font-size: 0.75rem;
  color: var(--color-dark-gray);
  font-weight: 500;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-fresh-green);
  opacity: 0;
  transition: all 0.2s ease;
}

.ingredient-card:hover .arrow-icon {
  opacity: 1;
  transform: translateX(2px);
}

@media (max-width: 639px) {
  .ingredient-card {
    padding: 0.875rem;
  }

  .quantity-value {
    font-size: 1.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ingredient-card {
    transition: box-shadow 0.2s ease;
  }

  .ingredient-card:hover {
    transform: none;
  }
}
</style>
