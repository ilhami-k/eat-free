<template>
  <div class="h-full overflow-y-auto bg-gradient-to-br from-neutral-50 to-neutral-100">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-fresh-green/10 rounded-lg">
              <svg class="w-6 h-6 text-fresh-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-neutral-900">{{ inventoryCount }}</p>
              <p class="text-xs text-neutral-600">Inventory Items</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-sky-blue/10 rounded-lg">
              <svg class="w-6 h-6 text-sky-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-neutral-900">{{ recipesCount }}</p>
              <p class="text-xs text-neutral-600">Saved Recipes</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-sunset-orange/10 rounded-lg">
              <svg class="w-6 h-6 text-sunset-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-neutral-900">{{ weekMealsCount }}</p>
              <p class="text-xs text-neutral-600">Meals This Week</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-strawberry-red/10 rounded-lg">
              <svg class="w-6 h-6 text-strawberry-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-neutral-900">{{ todayCalories }}</p>
              <p class="text-xs text-neutral-600">Calories Today</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Inventory Card -->
        <button
          @click="$emit('navigate', 'inventory')"
          class="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-fresh-green text-left relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-fresh-green/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-4">
              <div class="p-4 bg-fresh-green/10 rounded-xl group-hover:bg-fresh-green/20 transition-colors">
                <svg class="w-8 h-8 text-fresh-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <svg class="w-6 h-6 text-neutral-400 group-hover:text-fresh-green group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-fresh-green transition-colors">
              Inventory
            </h2>
            <p class="text-neutral-600 mb-4">
              Manage your ingredients and track what's in stock
            </p>
            <div class="flex items-center gap-4 text-sm">
              <span class="font-semibold text-fresh-green">{{ inventoryCount }} items</span>
              <span class="text-neutral-400">•</span>
              <span class="text-neutral-500">Track expiry dates</span>
            </div>
          </div>
        </button>

        <!-- Recipes Card -->
        <button
          @click="$emit('navigate', 'recipes')"
          class="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-sky-blue text-left relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-sky-blue/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-4">
              <div class="p-4 bg-sky-blue/10 rounded-xl group-hover:bg-sky-blue/20 transition-colors">
                <svg class="w-8 h-8 text-sky-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <svg class="w-6 h-6 text-neutral-400 group-hover:text-sky-blue group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-sky-blue transition-colors">
              Recipes
            </h2>
            <p class="text-neutral-600 mb-4">
              Browse and create your favorite recipes with nutrition info
            </p>
            <div class="flex items-center gap-4 text-sm">
              <span class="font-semibold text-sky-blue">{{ recipesCount }} recipes</span>
              <span class="text-neutral-400">•</span>
              <span class="text-neutral-500">Full nutrition data</span>
            </div>
          </div>
        </button>

        <!-- Meal Plans Card -->
        <button
          @click="$emit('navigate', 'mealplans')"
          class="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-sunset-orange text-left relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-sunset-orange/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-4">
              <div class="p-4 bg-sunset-orange/10 rounded-xl group-hover:bg-sunset-orange/20 transition-colors">
                <svg class="w-8 h-8 text-sunset-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <svg class="w-6 h-6 text-neutral-400 group-hover:text-sunset-orange group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-sunset-orange transition-colors">
              Meal Plans
            </h2>
            <p class="text-neutral-600 mb-4">
              Plan your weekly meals and stay organized
            </p>
            <div class="flex items-center gap-4 text-sm">
              <span class="font-semibold text-sunset-orange">{{ weekMealsCount }} this week</span>
              <span class="text-neutral-400">•</span>
              <span class="text-neutral-500">Weekly planning</span>
            </div>
          </div>
        </button>

        <!-- Journal Card -->
        <button
          @click="$emit('navigate', 'journal')"
          class="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-strawberry-red text-left relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-strawberry-red/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-4">
              <div class="p-4 bg-strawberry-red/10 rounded-xl group-hover:bg-strawberry-red/20 transition-colors">
                <svg class="w-8 h-8 text-strawberry-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <svg class="w-6 h-6 text-neutral-400 group-hover:text-strawberry-red group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-strawberry-red transition-colors">
              Journal
            </h2>
            <p class="text-neutral-600 mb-4">
              Track your daily nutrition and calorie intake
            </p>
            <div class="flex items-center gap-4 text-sm">
              <span class="font-semibold text-strawberry-red">{{ todayCalories }} kcal today</span>
              <span class="text-neutral-400">•</span>
              <span class="text-neutral-500">Daily tracking</span>
            </div>
          </div>
        </button>
      </div>

      <!-- Recent Activity Section (Optional) -->
      <div class="mt-8 bg-white rounded-2xl p-6 shadow-md border border-neutral-200">
        <h3 class="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            @click="$emit('navigate', 'recipes')"
            class="flex items-center gap-3 p-4 rounded-lg border border-neutral-200 hover:border-fresh-green hover:bg-fresh-green/5 transition-all text-left"
          >
            <div class="p-2 bg-fresh-green/10 rounded-lg">
              <svg class="w-5 h-5 text-fresh-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span class="font-medium text-neutral-900">Create New Recipe</span>
          </button>

          <button
            @click="$emit('navigate', 'journal')"
            class="flex items-center gap-3 p-4 rounded-lg border border-neutral-200 hover:border-sky-blue hover:bg-sky-blue/5 transition-all text-left"
          >
            <div class="p-2 bg-sky-blue/10 rounded-lg">
              <svg class="w-5 h-5 text-sky-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span class="font-medium text-neutral-900">Log Today's Meal</span>
          </button>

          <button
            @click="$emit('navigate', 'mealplans')"
            class="flex items-center gap-3 p-4 rounded-lg border border-neutral-200 hover:border-sunset-orange hover:bg-sunset-orange/5 transition-all text-left"
          >
            <div class="p-2 bg-sunset-orange/10 rounded-lg">
              <svg class="w-5 h-5 text-sunset-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span class="font-medium text-neutral-900">Plan This Week</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/renderer/components/ui'
import type User from '@/shared/user'

interface Props {
  currentUser: User
  inventoryCount: number
  recipesCount: number
  weekMealsCount: number
  todayCalories: number
}

interface Emits {
  (e: 'navigate', page: 'inventory' | 'recipes' | 'mealplans' | 'journal'): void
  (e: 'logout'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
