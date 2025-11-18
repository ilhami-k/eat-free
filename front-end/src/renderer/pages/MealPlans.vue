<template>
  <div class="flex flex-col h-screen overflow-hidden bg-neutral-50">
    <!-- Header -->
    <div class="bg-white border-b border-neutral-200 shadow-sm p-4 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-display font-bold text-neutral-900">
            Meal Plan
          </h1>
          <p class="text-sm text-neutral-600">
            Week of {{ formatDate(currentWeekStart) }}
          </p>
        </div>
        <div class="flex gap-2">
          <Button variant="secondary" size="sm" @click="previousWeek">
            ← Previous
          </Button>
          <Button variant="secondary" size="sm" @click="nextWeek">
            Next →
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto">
      <div class="p-4 md:p-6 lg:p-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-16">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-fresh-green/20 border-t-fresh-green"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="rounded-lg bg-red-50 p-6 border border-red-200">
          <h3 class="font-semibold text-red-900 mb-2">Error Loading Meal Plan</h3>
          <p class="text-sm text-red-700 mb-4">{{ error.message }}</p>
          <Button variant="secondary" size="sm" @click="retryLoad">
            Try Again
          </Button>
        </div>

        <!-- No Meal Plan State -->
        <div v-else-if="!mealPlan" class="flex flex-col items-center justify-center py-16">
          <div class="text-center">
            <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-neutral-600 mb-4">No meal plan for this week</p>
            <Button @click="createMealPlan">
              Create Meal Plan
            </Button>
          </div>
        </div>

        <!-- Accordion Sections for Each Day -->
        <div v-else class="space-y-2 pb-16">
          <div v-for="(day, dayIdx) in daysOfWeek" :key="`day-${dayIdx}`" class="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <!-- Day Header (Always visible) -->
            <button
              @click="toggleDay(dayIdx)"
              class="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
            >
              <div class="text-left">
                <h3 class="font-semibold text-neutral-900">{{ formatDayOfWeek(day) }}</h3>
                <p class="text-sm text-neutral-600">{{ formatDate(day) }}</p>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-fresh-green">
                  {{ calculateDayCalories(day) }} kcal
                </span>
                <span :class="['transition-transform', expandedDays.includes(dayIdx) && 'rotate-180']">
                  <svg class="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </span>
              </div>
            </button>

            <!-- Collapsible Content -->
            <transition name="slide-down">
              <div v-if="expandedDays.includes(dayIdx)" class="border-t border-neutral-200">
                <!-- Meal Type Sections -->
                <div v-for="mealType in mealTypes" :key="`${dayIdx}-${mealType}`" class="border-b border-neutral-100 last:border-b-0">
                  <!-- Meal Type Header -->
                  <div class="px-4 py-3 bg-neutral-50 flex items-center justify-between">
                    <h4 class="font-medium text-neutral-900 capitalize">
                      {{ mealType }}
                    </h4>
                    <Button
                      variant="secondary"
                      size="sm"
                      @click="openAddRecipeDialog(day, mealType)"
                    >
                      + Add
                    </Button>
                  </div>

                  <!-- Meal Items -->
                  <div v-if="getMealsForDayAndType(day, mealType).length === 0" class="px-4 py-4 text-sm text-neutral-500 italic">
                    No recipes planned
                  </div>
                  <div v-else class="divide-y divide-neutral-100">
                    <div
                      v-for="mealRecipe in getMealsForDayAndType(day, mealType)"
                      :key="`meal-${mealRecipe.id}`"
                      class="px-4 py-3 flex items-start justify-between group hover:bg-neutral-50 transition-colors"
                    >
                      <div class="flex-1 min-w-0">
                        <p class="font-medium text-neutral-900 truncate">{{ mealRecipe.recipe?.name }}</p>
                        <p class="text-xs text-neutral-600">
                          {{ mealRecipe.planned_servings }} serving<span v-if="mealRecipe.planned_servings !== 1">s</span>
                          •
                          <span class="font-semibold text-fresh-green">{{ calculateMealCalories(mealRecipe) }} kcal</span>
                        </p>
                      </div>
                      <button
                        @click="removeRecipe(BigInt(mealRecipe.id))"
                        class="ml-2 text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </main>

    <!-- Sticky Footer with Daily Totals Summary -->
    <div class="sticky bottom-0 bg-white border-t border-neutral-200 shadow-lg py-2 px-4 flex-shrink-0">
      <div class="grid grid-cols-7 gap-2">
        <div v-for="(day, dayIdx) in daysOfWeek" :key="`summary-${dayIdx}`" class="text-center">
          <p class="text-xs font-medium text-neutral-600 mb-0.5">
            {{ formatDayOfWeek(day).substring(0, 3) }}
          </p>
          <p class="text-sm font-bold text-fresh-green">
            {{ calculateDayCalories(day) }}
          </p>
        </div>
      </div>
    </div>

    <!-- FAB for Adding Recipes -->
    <div class="fixed bottom-24 right-6 z-40">
      <Button
        @click="openAddRecipeQuick"
        class="rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-bold text-lg md:text-xl shadow-lg hover:shadow-xl transition-all"
      >
        +
      </Button>
    </div>

    <!-- Add Recipe Dialog -->
    <AddRecipeToMealPlanModal
      v-if="showAddRecipeDialog && mealPlan"
      :date="selectedDate"
      :mealType="selectedMealType"
      :planId="BigInt(mealPlan.id)"
      @close="showAddRecipeDialog = false"
      @added="handleRecipeAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useMealPlanService, type MealPlanWithRecipes } from '@/renderer/composables/useMealPlanService'
import { Button } from '@/renderer/components/ui'
import AddRecipeToMealPlanModal from '@/renderer/components/modals/AddRecipeToMealPlanModal.vue'
import type { MealType, MealPlanRecipe } from '@/shared/mealPlan'

interface Props {
  currentUserId: bigint
}

const props = defineProps<Props>()

const mealPlanService = useMealPlanService(window.electronService?.mealPlans)
const currentWeekStart = ref(getWeekStart(new Date()))
const mealPlan = ref<MealPlanWithRecipes | null>(null)
const showAddRecipeDialog = ref(false)
const selectedDate = ref<Date>(new Date())
const selectedMealType = ref<MealType>('breakfast')
const expandedDays = ref<number[]>([]) // Start with all days collapsed

const isLoading = computed(() => mealPlanService.isLoading.value)
const error = computed(() => mealPlanService.error.value)

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

const daysOfWeek = computed(() => {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(currentWeekStart.value)
    day.setDate(day.getDate() + i)
    days.push(day)
  }
  return days
})

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const dayOfWeek = d.getDay()
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  d.setDate(d.getDate() - daysToMonday)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDayOfWeek(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
  })
}

function toggleDay(dayIdx: number): void {
  if (expandedDays.value.includes(dayIdx)) {
    expandedDays.value = expandedDays.value.filter(d => d !== dayIdx)
  } else {
    expandedDays.value.push(dayIdx)
  }
}

function getMealsForDayAndType(day: Date, mealType: MealType): (MealPlanRecipe & { recipe?: any })[] {
  if (!mealPlan.value?.meal_plan_recipe) return []

  const dayStart = new Date(day)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(day)
  dayEnd.setHours(23, 59, 59, 999)

  return mealPlan.value.meal_plan_recipe.filter(
    meal =>
      new Date(meal.date).getTime() >= dayStart.getTime() &&
      new Date(meal.date).getTime() <= dayEnd.getTime() &&
      meal.meal_type === mealType
  )
}

function calculateMealCalories(mealRecipe: MealPlanRecipe & { recipe?: any }): number {
  if (!mealRecipe.recipe) return 0
  return Math.round(mealRecipe.recipe.kcal_per_serving * mealRecipe.planned_servings)
}

function calculateDayCalories(day: Date): number {
  let total = 0
  for (const mealType of mealTypes) {
    const meals = getMealsForDayAndType(day, mealType)
    for (const meal of meals) {
      total += calculateMealCalories(meal)
    }
  }
  return total
}

function previousWeek(): void {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() - 7)
  currentWeekStart.value = newStart
}

function nextWeek(): void {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() + 7)
  currentWeekStart.value = newStart
}

async function loadMealPlan(): Promise<void> {
  const plan = await mealPlanService.getMealPlanForWeek(props.currentUserId, currentWeekStart.value)
  mealPlan.value = plan
}

async function createMealPlan(): Promise<void> {
  try {
    const newPlan = await mealPlanService.createMealPlan(props.currentUserId, currentWeekStart.value)
    mealPlan.value = newPlan
  } catch (err) {
    console.error('Error creating meal plan:', err)
  }
}

async function openAddRecipeDialog(date: Date, mealType: MealType): Promise<void> {
  console.log('openAddRecipeDialog called', { date, mealType, hasMealPlan: !!mealPlan.value })
  // Ensure we have a meal plan first
  if (!mealPlan.value) {
    console.log('No meal plan, creating one...')
    await createMealPlan()
    console.log('Meal plan created:', mealPlan.value)
  }
  selectedDate.value = date
  selectedMealType.value = mealType
  showAddRecipeDialog.value = true
  console.log('showAddRecipeDialog set to true')
}

async function openAddRecipeQuick(): Promise<void> {
  console.log('openAddRecipeQuick called', { hasMealPlan: !!mealPlan.value })
  // Ensure we have a meal plan first
  if (!mealPlan.value) {
    console.log('No meal plan, creating one...')
    await createMealPlan()
    console.log('Meal plan created:', mealPlan.value)
  }
  // Open dialog for today's first meal
  selectedDate.value = new Date()
  selectedMealType.value = 'breakfast'
  showAddRecipeDialog.value = true
  console.log('showAddRecipeDialog set to true')
}

async function handleRecipeAdded(): Promise<void> {
  showAddRecipeDialog.value = false
  await loadMealPlan()
}

async function removeRecipe(mealPlanRecipeId: bigint): Promise<void> {
  if (!confirm('Remove this recipe from the meal plan?')) {
    return
  }
  try {
    await mealPlanService.removeRecipeFromMealPlan(mealPlanRecipeId)
    await loadMealPlan()
  } catch (err) {
    console.error('Error removing recipe:', err)
  }
}

function retryLoad(): void {
  mealPlanService.clearError()
  loadMealPlan()
}

watch(currentWeekStart, () => {
  loadMealPlan()
}, { deep: true })

onMounted(async () => {
  await loadMealPlan()
})
</script>

<style scoped>
/* Accordion slide transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 200ms ease-out;
  max-height: 500px;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}
</style>
