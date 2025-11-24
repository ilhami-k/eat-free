<template>
  <Card elevation="lg" class="daily-summary-card">
    <div class="summary-header">
      <h2 class="summary-title">Daily Summary</h2>
    </div>

    <!-- Calories Remaining -->
    <div class="calories-section">
      <p class="calories-label">Calories Remaining</p>
      <p :class="['calories-value', caloriesRemainingClass]">
        {{ caloriesRemaining }}
      </p>
      <div class="calories-breakdown">
        <span class="breakdown-item">{{ calorieGoal }} Goal</span>
        <span class="breakdown-separator">−</span>
        <span class="breakdown-item">{{ totalCalories }} Food</span>
        <span class="breakdown-separator">=</span>
        <span :class="['breakdown-item', caloriesRemainingClass]">{{ caloriesRemaining }} Remaining</span>
      </div>
    </div>

    <!-- Macronutrients -->
    <div class="macros-section">
      <div class="macro-item">
        <div class="macro-header">
          <span class="macro-label">Protein</span>
          <span class="macro-value">{{ totalProtein }}g / {{ proteinGoal }}g</span>
        </div>
        <div class="macro-bar">
          <div
            class="macro-bar-fill protein"
            :style="{ width: `${Math.min((totalProtein / proteinGoal) * 100, 100)}%` }"
          ></div>
        </div>
      </div>

      <div class="macro-item">
        <div class="macro-header">
          <span class="macro-label">Carbs</span>
          <span class="macro-value">{{ totalCarbs }}g / {{ carbsGoal }}g</span>
        </div>
        <div class="macro-bar">
          <div
            class="macro-bar-fill carbs"
            :style="{ width: `${Math.min((totalCarbs / carbsGoal) * 100, 100)}%` }"
          ></div>
        </div>
      </div>

      <div class="macro-item">
        <div class="macro-header">
          <span class="macro-label">Fat</span>
          <span class="macro-value">{{ totalFat }}g / {{ fatGoal }}g</span>
        </div>
        <div class="macro-bar">
          <div
            class="macro-bar-fill fat"
            :style="{ width: `${Math.min((totalFat / fatGoal) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@/renderer/components/ui'

interface Props {
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  calorieGoal: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
}

const props = defineProps<Props>()

const caloriesRemaining = computed(() => {
  return props.calorieGoal - props.totalCalories
})

const caloriesRemainingClass = computed(() => {
  if (caloriesRemaining.value < 0) return 'calories-over'
  if (caloriesRemaining.value < 200) return 'calories-low'
  return 'calories-good'
})
</script>

<style scoped>

.daily-summary-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: var(--spacing-5);
}

.summary-header {
  margin-bottom: var(--spacing-4);
}

.summary-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-black);
  margin: 0;
}

.calories-section {
  text-align: center;
  padding: var(--spacing-4) 0;
  border-bottom: 2px solid var(--color-light-gray);
  margin-bottom: var(--spacing-4);
}

.calories-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 var(--spacing-2) 0;
}

.calories-value {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-3) 0;
  line-height: 1;
}

.calories-good {
  color: var(--color-fresh-green);
}

.calories-low {
  color: #f59e0b;
}

.calories-over {
  color: #ef4444;
}

.calories-breakdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
  color: var(--color-dark-gray);
  flex-wrap: wrap;
}

.breakdown-item {
  font-weight: 500;
}

.breakdown-separator {
  color: var(--color-medium-gray);
  font-weight: 300;
}

.macros-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-4);
}

.macro-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.macro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.macro-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-black);
}

.macro-value {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-dark-gray);
}

.macro-bar {
  height: 8px;
  background-color: var(--color-light-gray);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.macro-bar-fill {
  height: 100%;
  transition: width var(--duration-normal) var(--ease-in-out);
  border-radius: var(--radius-full);
}

.macro-bar-fill.protein {
  background: linear-gradient(90deg, #10b981, #059669);
}

.macro-bar-fill.carbs {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.macro-bar-fill.fat {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

@media (max-width: 768px) {
  .macros-section {
    grid-template-columns: 1fr;
  }

  .calories-value {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .calories-value {
    font-size: 2.5rem;
  }

  .daily-summary-card {
    padding: var(--spacing-4);
  }
}
</style>
