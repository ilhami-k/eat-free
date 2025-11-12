<template>
  <div class="space-y-4">
    <!-- Header with Date Navigation -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-h1 font-display text-neutral-900">Meal Plan</h2>
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

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-fresh-green/20 border-t-fresh-green"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-lg bg-strawberry-red/10 p-4">
      <p class="text-sm text-strawberry-red">{{ error.message }}</p>
      <Button variant="secondary" size="sm" class="mt-2" @click="retryLoad">
        Try Again
      </Button>
    </div>

    <!-- Meal Plan Grid -->
    <div v-else-if="mealPlan" class="space-y-4">
      <!-- Day Rows -->
      <div v-for="(day, dayIdx) in daysOfWeek" :key="`day-${dayIdx}`" class="rounded-lg border border-neutral-200 overflow-hidden">
        <!-- Day Header -->
        <div class="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
          <h3 class="font-medium text-neutral-900">
            {{ formatDayOfWeek(day) }}
          </h3>
          <p class="text-xs text-neutral-600">{{ formatDate(day) }}</p>
        </div>

        <!-- Meal Types for this Day -->
        <div class="divide-y divide-neutral-200">
          <div v-for="mealType in mealTypes" :key="`${dayIdx}-${mealType}`" class="p-4">
            <!-- Meal Type Header -->
            <div class="mb-3 flex items-center justify-between">
              <h4 class="font-medium text-neutral-900 capitalize">{{ mealType }}</h4>
              <Button
                variant="ghost"
                size="sm"
                @click="openAddRecipeDialog(day, mealType)"
              >
                + Add Recipe
              </Button>
            </div>

            <!-- Recipes for this Meal -->
            <div v-if="getMealsForDayAndType(day, mealType).length === 0" class="text-sm text-neutral-500">
              No recipes planned
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="mealRecipe in getMealsForDayAndType(day, mealType)"
                :key="`meal-${mealRecipe.id}`"
                class="rounded-lg bg-neutral-50 p-3"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-medium text-neutral-900">{{ mealRecipe.recipe?.name }}</p>
                    <p class="text-xs text-neutral-600">
                      {{ mealRecipe.planned_servings }} serving<span v-if="mealRecipe.planned_servings !== 1">s</span>
                      •
                      {{ calculateMealCalories(mealRecipe) }} kcal
                    </p>
                  </div>
                  <button
                    @click="removeRecipe(mealRecipe.id)"
                    class="text-strawberry-red hover:text-strawberry-red/80"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daily Totals -->
      <div class="rounded-lg bg-sky-blue/10 p-4">
        <h3 class="mb-4 font-medium text-neutral-900">Daily Totals</h3>
        <div class="space-y-2">
          <div v-for="(day, dayIdx) in daysOfWeek" :key="`total-${dayIdx}`" class="flex items-center justify-between">
            <span class="text-sm text-neutral-600">{{ formatDayOfWeek(day) }}</span>
            <span class="text-sm font-medium text-neutral-900">
              {{ calculateDayCalories(day) }} kcal
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- No Meal Plan State -->
    <div v-else class="rounded-lg bg-neutral-50 p-8 text-center">
      <p class="text-neutral-600 mb-4">No meal plan for this week</p>
      <Button @click="createMealPlan">
        Create Meal Plan
      </Button>
    </div>

    <!-- Add Recipe Dialog -->
    <AddRecipeToMealPlanModal
      v-if="showAddRecipeDialog && mealPlan"
      :date="selectedDate"
      :mealType="selectedMealType"
      :planId="mealPlan.id"
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
  // JavaScript getDay(): 0=Sunday, 1=Monday, ...6=Saturday
  // We want Monday, so: if Sunday (0), subtract 6 days; otherwise subtract (day - 1) days
  const dayOfWeek = d.getDay()
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  d.setDate(d.getDate() - daysToMonday)
  // Normalize to midnight UTC
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

function openAddRecipeDialog(date: Date, mealType: MealType): void {
  selectedDate.value = date
  selectedMealType.value = mealType
  showAddRecipeDialog.value = true
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

// Watch for week changes and reload meal plan
watch(currentWeekStart, () => {
  loadMealPlan()
}, { deep: true })

onMounted(async () => {
  await loadMealPlan()
})
</script>
