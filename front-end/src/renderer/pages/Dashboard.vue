<template>
  <div class="dashboard-wrapper">
    <div class="dashboard">
      <DashboardHero :user-name="userName" />
      
      <DashboardStats
        :inventory-count="inventoryCount"
        :recipes-count="recipesCount"
        :week-meals-count="weekMealsCount"
        :today-calories="todayCalories"
      />

      <section class="nav-cards">
        <DashboardNavCard
          variant="green"
          title="Inventory"
          description="Manage your ingredients and track what's in stock"
          :badge="`${inventoryCount} items`"
          feature="Track expiry dates"
          icon="inventory"
          @click="handleNavigate('inventory')"
        />

        <DashboardNavCard
          variant="blue"
          title="Recipes"
          description="Browse and create your favorite recipes with nutrition info"
          :badge="`${recipesCount} recipes`"
          feature="Full nutrition data"
          icon="recipes"
          @click="handleNavigate('recipes')"
        />

        <DashboardNavCard
          variant="yellow"
          title="Meal Plans"
          description="Plan your weekly meals and stay organized"
          :badge="`${weekMealsCount} this week`"
          feature="Weekly planning"
          icon="mealplans"
          @click="handleNavigate('mealplans')"
        />

        <DashboardNavCard
          variant="red"
          title="Journal"
          description="Track your daily nutrition and calorie intake"
          :badge="`${todayCalories} kcal today`"
          feature="Daily tracking"
          icon="journal"
          @click="handleNavigate('journal')"
        />
      </section>

      <DashboardQuickActions @action-click="handleNavigate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHero from '@/renderer/components/dashboard/DashboardHero.vue'
import DashboardStats from '@/renderer/components/dashboard/DashboardStats.vue'
import DashboardNavCard from '@/renderer/components/dashboard/DashboardNavCard.vue'
import DashboardQuickActions from '@/renderer/components/dashboard/DashboardQuickActions.vue'
import { useDashboard } from '@/renderer/composables/useDashboard'
import type User from '@/shared/user'

type NavigationPage = 'inventory' | 'recipes' | 'mealplans' | 'journal'

interface Props {
  currentUser: User
}

interface Emits {
  (e: 'navigate', page: NavigationPage): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use the dashboard controller composable
const {
  userName,
  inventoryCount,
  recipesCount,
  weekMealsCount,
  todayCalories,
  isLoading
} = useDashboard(props.currentUser.id)

/**
 * Handle navigation to different pages
 */
const handleNavigate = (page: NavigationPage) => {
  emit('navigate', page)
}
</script>

<style scoped>
.dashboard-wrapper {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 5rem; /* Account for fixed navbar height */
}

.dashboard {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background: transparent;
}

/* -------- Navigation Cards Grid -------- */
.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: calc(var(--spacing-8) + var(--spacing-4));
}

/* ==================== RESPONSIVE STYLES ==================== */

/* Mobile devices (< 640px) */
@media (max-width: 639px) {
  .dashboard {
    padding: 1rem;
  }

  .nav-cards {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: box-shadow var(--duration-fast) ease-in-out !important;
  }
}
</style>
