<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="mb-6 flex items-start justify-between">
        <div>
          <h2 class="text-h2 font-display text-neutral-900">Log {{ mealTypeLabel }}</h2>
          <p class="mt-1 text-sm text-neutral-600">
            {{ formatDate(date) }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-neutral-500 hover:text-neutral-700"
          aria-label="Close"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <!-- Recipe Source Toggle -->
        <div class="flex gap-2 mb-2">
          <button
            @click="recipeSource = 'all'"
            :class="[
              'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all',
              recipeSource === 'all'
                ? 'bg-fresh-green text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            ]"
          >
            All Recipes
          </button>
          <button
            @click="recipeSource = 'mealplan'"
            :class="[
              'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all',
              recipeSource === 'mealplan'
                ? 'bg-fresh-green text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            ]"
          >
            Today's Meal Plan
          </button>
        </div>

        <!-- Recipe Selection -->
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-2">
            Recipe
          </label>
          <select
            v-model="selectedRecipeId"
            class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fresh-green"
            required
          >
            <option :value="null">Select a recipe...</option>
            <option
              v-for="recipe in filteredRecipes"
              :key="`recipe-${recipe.id}`"
              :value="recipe.id"
            >
              {{ recipe.name }} ({{ recipe.kcal_per_serving }} kcal/serving)
            </option>
          </select>
          <p v-if="recipeSource === 'mealplan' && filteredRecipes.length === 0" class="mt-2 text-xs text-neutral-500">
            No recipes in today's meal plan
          </p>
        </div>

        <!-- Servings Input -->
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-2">
            Servings
          </label>
          <input
            v-model.number="servings"
            type="number"
            min="0.1"
            step="0.1"
            class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fresh-green"
            placeholder="1.0"
            required
          />
        </div>

        <!-- Nutrition Preview -->
        <div v-if="selectedRecipe" class="rounded-lg bg-sky-blue/10 p-4">
          <p class="mb-3 text-xs font-medium text-sky-blue/80">Nutritional Values</p>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs text-neutral-600">Calories</p>
              <p class="font-medium text-neutral-900">{{ calculatedNutrition.calories }} kcal</p>
            </div>
            <div>
              <p class="text-xs text-neutral-600">Protein</p>
              <p class="font-medium text-neutral-900">{{ calculatedNutrition.protein }}g</p>
            </div>
            <div>
              <p class="text-xs text-neutral-600">Carbs</p>
              <p class="font-medium text-neutral-900">{{ calculatedNutrition.carbs }}g</p>
            </div>
            <div>
              <p class="text-xs text-neutral-600">Fat</p>
              <p class="font-medium text-neutral-900">{{ calculatedNutrition.fat }}g</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4">
          <Button
            variant="secondary"
            fullWidth
            @click="$emit('close')"
          >
            Cancel
          </Button>
          <Button
            fullWidth
            @click="handleSubmit"
            :isLoading="isSubmitting"
            :disabled="!selectedRecipeId || servings <= 0"
          >
            Log Meal
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRecipeService, type RecipeWithIngredients } from '@/renderer/composables/useRecipeService'
import { useJournalService } from '@/renderer/composables/useJournalService'
import { useMealPlanService } from '@/renderer/composables/useMealPlanService'
import Button from '@/renderer/components/ui/Button.vue'

interface Props {
  userId: number
  date: Date
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

interface Emits {
  (e: 'close'): void
  (e: 'added'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const recipeService = useRecipeService(window.electronService?.recipes)
const journalService = useJournalService(window.electronService?.journal)
const mealPlanService = useMealPlanService(window.electronService?.mealPlans)

const selectedRecipeId = ref<bigint | null>(null)
const servings = ref<number>(1)
const isSubmitting = ref(false)
const recipeSource = ref<'all' | 'mealplan'>('all')

const recipes = computed(() => recipeService.recipes.value)

const mealTypeLabel = computed(() => {
  return props.mealType.charAt(0).toUpperCase() + props.mealType.slice(1)
})

const todaysMealPlanRecipes = computed(() => {
  const mealPlan = mealPlanService.currentMealPlan.value
  if (!mealPlan?.meal_plan_recipe) return []
  
  // Get the date string for the selected date (YYYY-MM-DD format)
  const selectedDateStr = props.date.toISOString().split('T')[0]
  
  // Filter recipes for the selected date
  return mealPlan.meal_plan_recipe.filter(mpr => {
    const mprDate = new Date(mpr.date).toISOString().split('T')[0]
    return mprDate === selectedDateStr
  })
})

const mealPlanRecipes = computed(() => {
  const recipeIds = new Set(todaysMealPlanRecipes.value.map(mpr => Number(mpr.recipe_id)))
  return recipes.value.filter(recipe => recipeIds.has(Number(recipe.id)))
})

const filteredRecipes = computed(() => {
  return recipeSource.value === 'mealplan' ? mealPlanRecipes.value : recipes.value
})

const selectedRecipe = computed(() => {
  if (!selectedRecipeId.value) return null
  return recipes.value.find(r => r.id === Number(selectedRecipeId.value))
})

const calculatedNutrition = computed(() => {
  if (!selectedRecipe.value) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 }
  }

  const multiplier = servings.value
  const result = {
    calories: Math.round(selectedRecipe.value.kcal_per_serving * multiplier),
    protein: Math.round(selectedRecipe.value.protein_g_per_serving * multiplier * 10) / 10,
    carbs: Math.round(selectedRecipe.value.carbs_g_per_serving * multiplier * 10) / 10,
    fat: Math.round(selectedRecipe.value.fat_g_per_serving * multiplier * 10) / 10,
  }
  
  return result
})

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function getLoggedAtTime(): Date {
  const loggedAt = new Date(props.date)
  
  // Set the time based on meal type
  switch (props.mealType) {
    case 'breakfast':
      loggedAt.setHours(8, 0, 0, 0) // 8:00 AM
      break
    case 'lunch':
      loggedAt.setHours(12, 30, 0, 0) // 12:30 PM
      break
    case 'dinner':
      loggedAt.setHours(18, 0, 0, 0) // 6:00 PM
      break
    case 'snack':
      loggedAt.setHours(15, 0, 0, 0) // 3:00 PM
      break
  }
  
  return loggedAt
}

async function handleSubmit(): Promise<void> {
  if (!selectedRecipeId.value || servings.value <= 0) {
    return
  }

  isSubmitting.value = true
  try {
    const nutrition = calculatedNutrition.value
    const loggedAt = getLoggedAtTime()
    
    const result = await journalService.createJournalEntryWithTime(
      props.userId,
      selectedRecipeId.value,
      servings.value,
      nutrition.calories,
      nutrition.protein,
      nutrition.carbs,
      nutrition.fat,
      loggedAt
    )
    
    console.log('Journal entry created:', result)
    emit('added')
  } catch (err) {
    console.error('Error creating journal entry:', err)
    alert('Failed to log meal. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await recipeService.fetchRecipes()
  // Load meal plan for the current week
  const startOfWeek = new Date(props.date)
  await mealPlanService.getMealPlanForWeek(props.userId, startOfWeek)
})



</script>
