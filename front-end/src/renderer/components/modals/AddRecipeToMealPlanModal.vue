<template>
  <Modal
    :isOpen="true"
    title="Add Recipe to Meal Plan"
    :subtitle="`${formatDayOfWeek(date)}, ${formatDate(date)} - ${capitalize(mealType)}`"
    size="lg"
    :showDefaultFooter="false"
    @close="closeModal"
  >

      <!-- Error State -->
      <div v-if="!recipeService || !mealPlanService" class="py-8 text-center">
        <p class="text-red-500">Service not available. Please restart the app.</p>
      </div>

      <template v-else>

      <!-- Search Recipes -->
      <div v-if="!selectedRecipe" class="mb-6">
        <Input
          v-model="searchQuery"
          label="Search Recipes"
          placeholder="Type to search recipes..."
        />
        <p v-if="searchQuery && filteredRecipes.length > 0" class="mt-2 text-xs text-neutral-500">
          Showing {{ Math.min(filteredRecipes.length, 3) }} of {{ filteredRecipes.length }} recipe{{ filteredRecipes.length !== 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isSearching" class="flex justify-center py-8">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-fresh-green/20 border-t-fresh-green"></div>
      </div>

      <!-- Recipes List -->
      <div v-else-if="!selectedRecipe" class="space-y-2 mb-6">
        <div v-if="filteredRecipes.length === 0 && searchQuery.length > 0" class="py-8 text-center text-neutral-500">
          No recipes found matching "{{ searchQuery }}"
        </div>
        
        <div v-else-if="filteredRecipes.length === 0" class="py-8 text-center text-neutral-500">
          No recipes available. Create a recipe first!
        </div>

        <button
          v-for="recipe in filteredRecipes.slice(0, 10)"
          :key="`recipe-${recipe.id}`"
          @click="selectRecipe(recipe as any)"
          class="w-full rounded-lg border border-neutral-200 p-4 text-left hover:border-fresh-green hover:bg-fresh-green/5"
        >
          <p class="font-medium text-neutral-900">{{ recipe.name }}</p>
          <p class="text-xs text-neutral-600">
            {{ recipe.kcal_per_serving }} kcal/serving
          </p>
        </button>
        
        <p v-if="filteredRecipes.length > 10" class="text-xs text-center text-neutral-500 pt-2">
          + {{ filteredRecipes.length - 10 }} more recipe{{ filteredRecipes.length - 10 !== 1 ? 's' : '' }}. Type to refine search.
        </p>
      </div>

      <!-- Servings Selector (if recipe selected) -->
      <div v-if="selectedRecipe" class="space-y-4">
        <div class="rounded-lg border border-neutral-200 p-4">
          <h3 class="mb-3 font-medium text-neutral-900">{{ selectedRecipe.name }}</h3>
          
          <!-- Servings Input -->
          <div class="mb-4">
            <Input
              :modelValue="selectedServings.toString()"
              @update:modelValue="selectedServings = parseFloat($event) || 1"
              label="Planned Servings"
              type="number"
              placeholder="1"
              min="0.5"
              step="0.5"
            />
          </div>

          <!-- Nutrition Preview -->
          <div class="rounded-lg bg-sky-blue/10 p-3">
            <p class="mb-2 text-xs font-medium text-sky-blue/80">Nutrition for {{ selectedServings }} serving(s)</p>
            <div class="grid grid-cols-4 gap-2">
              <div>
                <p class="text-xs text-neutral-600">Calories</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ Math.round(selectedRecipe.kcal_per_serving * selectedServings) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600">Protein</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ (selectedRecipe.protein_g_per_serving * selectedServings).toFixed(1) }}g
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600">Carbs</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ (selectedRecipe.carbs_g_per_serving * selectedServings).toFixed(1) }}g
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600">Fat</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ (selectedRecipe.fat_g_per_serving * selectedServings).toFixed(1) }}g
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
            @click="handleAddRecipe"
            :isLoading="isAdding"
          >
            Add to Meal Plan
          </Button>
        </div>
      </div>

      <!-- Cancel Button -->
      <div v-if="!selectedRecipe" class="flex gap-2">
        <Button variant="secondary" fullWidth @click="closeModal">
          Cancel
        </Button>
      </div>

      </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { RecipeWithIngredients } from '@/renderer/composables/useRecipeService'
import { useRecipeService } from '@/renderer/composables/useRecipeService'
import { useMealPlanService } from '@/renderer/composables/useMealPlanService'
import Input from '@/renderer/components/ui/Input.vue'
import Button from '@/renderer/components/ui/Button.vue'
import Modal from '@/renderer/components/ui/Modal.vue'
import type { MealType } from '@/shared/mealPlan'

interface Props {
  date: Date
  mealType: MealType
  planId: number
}

interface Emits {
  (e: 'close'): void
  (e: 'added'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const recipeService = useRecipeService(window.electronService?.recipes)
const mealPlanService = useMealPlanService(window.electronService?.mealPlans)

const searchQuery = ref('')
const selectedRecipe = ref<RecipeWithIngredients | null>(null)
const selectedServings = ref(1)
const isAdding = ref(false)
let searchTimeout: NodeJS.Timeout | null = null

const isSearching = computed(() => recipeService.isLoading.value)
const filteredRecipes = computed(() => recipeService.recipes.value)

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function formatDayOfWeek(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
  })
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Debounced search to prevent flickering
watch(searchQuery, (newQuery) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  if (newQuery.trim().length > 0) {
    searchTimeout = setTimeout(async () => {
      await recipeService.searchRecipes(newQuery)
    }, 300)
  }
})

function selectRecipe(recipe: RecipeWithIngredients): void {
  selectedRecipe.value = recipe
  selectedServings.value = Number(recipe.servings) || 1
}

async function handleAddRecipe(): Promise<void> {
  if (!selectedRecipe.value) return

  isAdding.value = true
  try {
    await mealPlanService.addRecipeToMealPlan(
      props.planId,
      selectedRecipe.value.id,
      props.date,
      props.mealType,
      selectedServings.value
    )
    emit('added')
    closeModal()
  } catch (err) {
    console.error('Error adding recipe to meal plan:', err)
  } finally {
    isAdding.value = false
  }
}

function closeModal(): void {
  emit('close')
}

onMounted(async () => {
  // Load all recipes on mount for searching
  await recipeService.fetchRecipes()
})
</script>
