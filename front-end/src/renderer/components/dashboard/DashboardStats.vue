<template>
  <section class="stats-grid">
    <div class="stat-card stat-card--green animate-pop" style="animation-delay: 0.1s;">
      <div class="stat-icon-wrapper stat-icon--green">
        <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <div class="stat-content">
        <p class="stat-value">{{ inventoryCount }}</p>
        <p class="stat-label">Inventory Items</p>
      </div>
    </div>

    <div class="stat-card stat-card--blue animate-pop" style="animation-delay: 0.2s;">
      <div class="stat-icon-wrapper stat-icon--blue">
        <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div class="stat-content">
        <p class="stat-value">{{ recipesCount }}</p>
        <p class="stat-label">Saved Recipes</p>
      </div>
    </div>

    <div class="stat-card stat-card--yellow animate-pop" style="animation-delay: 0.3s;">
      <div class="stat-icon-wrapper stat-icon--yellow">
        <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div class="stat-content">
        <p class="stat-value">{{ weekMealsCount }}</p>
        <p class="stat-label">Meals This Week</p>
      </div>
    </div>

    <div class="stat-card stat-card--red animate-pop" style="animation-delay: 0.4s;">
      <div class="stat-icon-wrapper stat-icon--red">
        <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div class="stat-content">
        <p class="stat-value">{{ todayCalories }}</p>
        <p class="stat-label">Calories Today</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  inventoryCount: number
  recipesCount: number
  weekMealsCount: number
  todayCalories: number
}

defineProps<Props>()
</script>

<style scoped>

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
}

.stat-card {
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-3);
  box-shadow: var(--shadow-sm);
  border: 2px solid transparent;
  transition: all var(--duration-normal) var(--ease-out);
}

@media (min-width: 640px) {
  .stat-card {
    flex-direction: row;
    align-items: center;
  }
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.stat-card--green:hover {
  border-color: rgba(120, 224, 143, 0.3);
}

.stat-card--blue:hover {
  border-color: rgba(52, 172, 224, 0.3);
}

.stat-card--yellow:hover {
  border-color: rgba(255, 211, 42, 0.3);
}

.stat-card--red:hover {
  border-color: rgba(255, 107, 129, 0.3);
}

.stat-icon-wrapper {
  padding: var(--spacing-3);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--duration-normal) var(--ease-bounce);
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1);
}

.stat-icon--green {
  background-color: rgba(120, 224, 143, 0.15);
  color: #2d5a3d;
}

.stat-icon--blue {
  background-color: rgba(52, 172, 224, 0.15);
  color: #1e5f7a;
}

.stat-icon--yellow {
  background-color: rgba(255, 211, 42, 0.15);
  color: #8B6914;
}

.stat-icon--red {
  background-color: rgba(255, 107, 129, 0.15);
  color: #a83241;
}

.stat-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-black);
  line-height: 1;
  margin-bottom: var(--spacing-1);
}

.stat-label {
  font-family: var(--font-body);
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--color-dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 639px) {
  .stat-value {
    font-size: var(--text-xl);
  }

  .stat-label {
    font-size: 0.625rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-pop {
    animation: none;
  }

  .stat-card {
    transition: box-shadow var(--duration-fast) ease-in-out;
  }

  .stat-card:hover {
    transform: none;
  }
}
</style>
