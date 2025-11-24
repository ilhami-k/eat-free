<template>
  <Modal
    :isOpen="true"
    title="Log Meal"
    :subtitle="`${formatDate(date)} - ${mealTypeLabel}`"
    size="lg"
    :showDefaultFooter="false"
    @close="closeModal"
  >

    <!-- Recipe Source Toggle -->
    <div class="flex gap-2 mb-4">
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

    <!-- Search Recipes -->
    <div v-if="!selectedRecipe" class="mb-6">
      <Input
        v-model="searchQuery"
        label="Search Recipes"
        placeholder="Type to search recipes..."
      />
      <p v-if="searchQuery && displayedRecipes.length > 0" class="mt-2 text-xs text-neutral-500">
        Showing {{ Math.min(displayedRecipes.length, 3) }} of {{ displayedRecipes.length }} recipe{{ displayedRecipes.length !== 1 ? 's' : '' }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-fresh-green/20 border-t-fresh-green"></div>
    </div>

    <!-- Recipes List -->
    <div v-else-if="!selectedRecipe" class="space-y-2 mb-6" style="min-height: 150px;">
      <div v-if="displayedRecipes.length === 0 && searchQuery.length > 0" class="py-8 text-center text-neutral-500">
        No recipes found matching "{{ searchQuery }}"
      </div>

      <div v-else-if="displayedRecipes.length === 0 && recipeSource === 'mealplan'" class="py-8 text-center text-neutral-500">
        No recipes in today's meal plan
      </div>

      <div v-else-if="displayedRecipes.length === 0" class="py-8 text-center text-neutral-500">
        No recipes available
      </div>

      <button
        v-for="recipe in displayedRecipes.slice(0, 3)"
        :key="`recipe-${recipe.id}`"
        @click="selectRecipe(recipe)"
        class="w-full rounded-lg border border-neutral-200 p-3 text-left hover:border-fresh-green hover:bg-fresh-green/5 transition-all"
      >
        <p class="text-sm font-medium text-neutral-900">{{ recipe.name }}</p>
        <p class="text-xs text-neutral-500">
          {{ recipe.kcal_per_serving }} kcal/serving
        </p>
      </button>

      <p v-if="displayedRecipes.length > 3" class="text-xs text-center text-neutral-500 pt-2">
        + {{ displayedRecipes.length - 3 }} more recipe{{ displayedRecipes.length - 3 !== 1 ? 's' : '' }}. Type to refine search.
      </p>
    </div>

    <!-- Servings Selector (if recipe selected) -->
    <div v-if="selectedRecipe" class="space-y-4">
      <div class="rounded-lg border border-neutral-200 p-4">
        <h3 class="mb-3 font-medium text-neutral-900">{{ selectedRecipe.name }}</h3>

        <!-- Servings Input -->
        <div class="mb-4">
          <Input
            :modelValue="servings.toString()"
            @update:modelValue="servings = parseFloat($event) || 1"
            label="Servings"
            type="number"
            placeholder="1"
            min="0.5"
            step="0.5"
          />
        </div>

        <!-- Nutrition Preview -->
        <div class="rounded-lg bg-sky-blue/10 p-3">
          <p class="mb-2 text-xs font-medium text-sky-blue/80">Nutrition for {{ servings }} serving(s)</p>
          <div class="grid grid-cols-4 gap-2">
            <div>
              <p class="text-xs text-neutral-600">Calories</p>
              <p class="text-sm font-medium text-neutral-900">
                {{ calculatedNutrition.calories }}
              </p>
            </div>
            <div>
              <p class="text-xs text-neutral-600">Protein</p>
              <p class="text-sm font-medium text-neutral-900">
                {{ calculatedNutrition.protein }}g
              </p>
            </div>
            <div>
              <p class="text-xs text-neutral-600">Carbs</p>
              <p class="text-sm font-medium text-neutral-900">
                {{ calculatedNutrition.carbs }}g
              </p>
            </div>
            <div>
              <p class="text-xs text-neutral-600">Fat</p>
              <p class="text-sm font-medium text-neutral-900">
                {{ calculatedNutrition.fat }}g
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <Button
          variant="secondary"
          fullWidth
          @click="selectedRecipe = null; searchQuery = ''"
        >
          Choose Different Recipe
        </Button>
        <Button
          fullWidth
          @click="handleSubmit"
          :isLoading="isSubmitting"
        >
          Log Meal
        </Button>
      </div>
    </div>

    <!-- Cancel Button -->
    <div v-if="!selectedRecipe" class="flex gap-2">
      <Button variant="secondary" fullWidth @click="closeModal">
        Cancel
      </Button>
    </div>

  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRecipeService, type RecipeWithIngredients } from '@/renderer/composables/useRecipeService'
import { useJournalService } from '@/renderer/composables/useJournalService'
import { useMealPlanService } from '@/renderer/composables/useMealPlanService'
import Button from '@/renderer/components/ui/Button.vue'
import Input from '@/renderer/components/ui/Input.vue'
import Modal from '@/renderer/components/ui/Modal.vue'

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

const selectedRecipe = ref<RecipeWithIngredients | null>(null)
const servings = ref<number>(1)
const isSubmitting = ref(false)
const recipeSource = ref<'all' | 'mealplan'>('all')
const searchQuery = ref('')

const recipes = computed(() => recipeService.recipes.value)
const isLoading = computed(() => recipeService.isLoading.value)

const mealTypeLabel = computed(() => {
  return props.mealType.charAt(0).toUpperCase() + props.mealType.slice(1)
})

const todaysMealPlanRecipes = computed(() => {
  const mealPlan = mealPlanService.currentMealPlan.value
  if (!mealPlan?.meal_plan_recipe) return []

  const selectedDateStr = props.date.toISOString().split('T')[0]

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

const displayedRecipes = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return filteredRecipes.value

  return filteredRecipes.value.filter(recipe =>
    recipe.name.toLowerCase().includes(query)
  )
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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function selectRecipe(recipe: RecipeWithIngredients): void {
  selectedRecipe.value = recipe
  servings.value = Number(recipe.servings) || 1
}

function closeModal(): void {
  emit('close')
}

function getLoggedAtTime(): Date {
  const loggedAt = new Date(props.date)

  switch (props.mealType) {
    case 'breakfast':
      loggedAt.setHours(8, 0, 0, 0)
      break
    case 'lunch':
      loggedAt.setHours(12, 30, 0, 0)
      break
    case 'dinner':
      loggedAt.setHours(18, 0, 0, 0)
      break
    case 'snack':
      loggedAt.setHours(15, 0, 0, 0)
      break
  }

  return loggedAt
}

async function handleSubmit(): Promise<void> {
  if (!selectedRecipe.value || servings.value <= 0) {
    return
  }

  isSubmitting.value = true
  try {
    const nutrition = calculatedNutrition.value
    const loggedAt = getLoggedAtTime()

    const result = await journalService.createJournalEntryWithTime(
      props.userId,
      selectedRecipe.value.id,
      servings.value,
      nutrition.calories,
      nutrition.protein,
      nutrition.carbs,
      nutrition.fat,
      loggedAt
    )

    emit('added')
    closeModal()
  } catch (err) {
    alert('Failed to log meal. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await recipeService.fetchRecipes()
  const startOfWeek = new Date(props.date)
  await mealPlanService.getMealPlanForWeek(props.userId, startOfWeek)
})
</script>
