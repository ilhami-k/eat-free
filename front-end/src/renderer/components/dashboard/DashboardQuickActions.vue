<template>
  <section class="quick-actions">
    <div class="quick-actions-header">
      <h3 class="quick-actions-title">Quick Actions</h3>
      <p class="quick-actions-subtitle">Jump right into what you need</p>
    </div>
    <div class="quick-actions-grid">
      <button
        v-for="action in actions"
        :key="action.label"
        @click="$emit('action-click', action.page)"
        :class="['quick-action-btn', `quick-action--${action.variant}`]"
      >
        <div class="quick-action-icon">
          <component :is="getIcon(action.icon)" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
        </div>
        <div class="quick-action-content">
          <span class="quick-action-label">{{ action.label }}</span>
          <span class="quick-action-desc">{{ action.description }}</span>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { h } from 'vue'

type ActionVariant = 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'orange'
type Page = 'inventory' | 'recipes' | 'mealplans' | 'journal'

interface QuickAction {
  label: string
  description: string
  variant: ActionVariant
  icon: 'add' | 'edit' | 'book' | 'calendar' | 'search'
  page: Page
}

interface Emits {
  (e: 'action-click', page: Page): void
}

defineEmits<Emits>()

const actions: QuickAction[] = [
  {
    label: 'Create Recipe',
    description: 'Add a new recipe',
    variant: 'green',
    icon: 'add',
    page: 'recipes'
  },
  {
    label: 'Log Meal',
    description: 'Track what you ate',
    variant: 'blue',
    icon: 'edit',
    page: 'journal'
  },
  {
    label: 'Journal Entry',
    description: 'Record your day',
    variant: 'red',
    icon: 'book',
    page: 'journal'
  },
  {
    label: 'Plan Week',
    description: 'Organize meals',
    variant: 'yellow',
    icon: 'calendar',
    page: 'mealplans'
  },
  {
    label: 'Add Ingredient',
    description: 'Stock up items',
    variant: 'purple',
    icon: 'add',
    page: 'inventory'
  },
  {
    label: 'Browse Recipes',
    description: 'Find inspiration',
    variant: 'orange',
    icon: 'search',
    page: 'recipes'
  }
]

const getIcon = (iconType: string) => {
  const icons = {
    add: () => h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 6v6m0 0v6m0-6h6m-6 0H6'
    }),
    edit: () => h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
    }),
    book: () => h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    }),
    calendar: () => h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    }),
    search: () => h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    })
  }
  return icons[iconType as keyof typeof icons]
}
</script>

<style scoped>

.quick-actions {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-lg);
  border: 2px solid rgba(120, 224, 143, 0.2);
  margin-bottom: 2rem;
  padding-bottom: var(--spacing-8);
  backdrop-filter: blur(10px);
}

.quick-actions-header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}

.quick-actions-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: var(--spacing-1);
}

.quick-actions-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-dark-gray);
  font-weight: 400;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
  gap: var(--spacing-4);
  width: 100%;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  border-radius: var(--radius-xl);
  border: 2px solid var(--color-medium-gray);
  background-color: var(--color-white);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-bounce);
  position: relative;
  overflow: hidden;
  min-height: 180px;
  height: 100%;
}

.quick-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.quick-action-btn:hover::before {
  opacity: 1;
}

.quick-action-btn:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-md);
}

.quick-action-btn:active {
  transform: translateY(-2px) scale(1.01);
}

.quick-action--green:hover {
  border-color: var(--color-fresh-green);
  background: linear-gradient(135deg, rgba(120, 224, 143, 0.05) 0%, rgba(120, 224, 143, 0.1) 100%);
}

.quick-action--blue:hover {
  border-color: var(--color-sky-blue);
  background: linear-gradient(135deg, rgba(52, 172, 224, 0.05) 0%, rgba(52, 172, 224, 0.1) 100%);
}

.quick-action--yellow:hover {
  border-color: var(--color-banana-yellow);
  background: linear-gradient(135deg, rgba(255, 211, 42, 0.05) 0%, rgba(255, 211, 42, 0.1) 100%);
}

.quick-action--red:hover {
  border-color: var(--color-strawberry-red);
  background: linear-gradient(135deg, rgba(255, 107, 129, 0.05) 0%, rgba(255, 107, 129, 0.1) 100%);
}

.quick-action--purple:hover {
  border-color: #9B59B6;
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.05) 0%, rgba(155, 89, 182, 0.1) 100%);
}

.quick-action--orange:hover {
  border-color: #FF8C42;
  background: linear-gradient(135deg, rgba(255, 140, 66, 0.05) 0%, rgba(255, 140, 66, 0.1) 100%);
}

.quick-action-icon {
  padding: var(--spacing-3);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--duration-normal) var(--ease-bounce);
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
}

.quick-action--green .quick-action-icon {
  background-color: rgba(120, 224, 143, 0.15);
  color: #2d5a3d;
}

.quick-action--blue .quick-action-icon {
  background-color: rgba(52, 172, 224, 0.15);
  color: #1e5f7a;
}

.quick-action--yellow .quick-action-icon {
  background-color: rgba(255, 211, 42, 0.15);
  color: #8B6914;
}

.quick-action--red .quick-action-icon {
  background-color: rgba(255, 107, 129, 0.15);
  color: #a83241;
}

.quick-action--purple .quick-action-icon {
  background-color: rgba(155, 89, 182, 0.15);
  color: #6C3483;
}

.quick-action--orange .quick-action-icon {
  background-color: rgba(255, 140, 66, 0.15);
  color: #D35400;
}

.quick-action-btn:hover .quick-action-icon {
  transform: scale(1.15) rotate(-5deg);
}

.quick-action-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.quick-action-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  flex: 1;
  align-items: center;
  width: 100%;
}

.quick-action-label {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-black);
  line-height: 1.2;
  text-align: center;
}

.quick-action-desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-dark-gray);
  text-align: center;
}

@media (min-width: 640px) {
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .quick-actions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .quick-actions-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 639px) {
  .quick-actions {
    padding: var(--spacing-5);
  }

  .quick-actions-title {
    font-size: var(--text-xl);
  }

  .quick-actions-subtitle {
    font-size: var(--text-sm);
  }

  .quick-action-btn {
    padding: var(--spacing-4);
    min-height: 120px;
  }

  .quick-action-icon {
    width: 2.5rem;
    height: 2.5rem;
    padding: var(--spacing-2);
  }

  .quick-action-icon svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .quick-action-label {
    font-size: var(--text-sm);
  }

  .quick-action-desc {
    font-size: 0.65rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quick-action-btn {
    transition: box-shadow var(--duration-fast) ease-in-out;
  }

  .quick-action-btn:hover {
    transform: none;
  }
}
</style>
