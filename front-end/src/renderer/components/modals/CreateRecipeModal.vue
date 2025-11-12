<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="mb-6 flex items-start justify-between">
        <h2 class="text-h2 font-display text-neutral-900">Create New Recipe</h2>
        <button
          @click="closeModal"
          class="text-neutral-500 hover:text-neutral-700"
          aria-label="Close"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Recipe Name -->
        <Input
          v-model="form.name"
          label="Recipe Name"
          placeholder="e.g., Grilled Chicken with Vegetables"
          :error="errors.name"
          required
        />

        <!-- Servings -->
        <Input
          :modelValue="form.servings.toString()"
          @update:modelValue="form.servings = parseFloat($event) || 1"
          label="Number of Servings"
          type="number"
          placeholder="1"
          :error="errors.servings"
          required
          min="0.5"
          step="0.5"
        />

        <!-- Add Ingredients Section -->
        <div class="rounded-lg border border-neutral-200 p-4">
          <h3 class="mb-3 font-medium text-neutral-900">Ingredients</h3>
          
          <!-- Ingredients List -->
          <div v-if="form.ingredients.length > 0" class="mb-4 space-y-2">
            <div
              v-for="(ing, idx) in form.ingredients"
              :key="`ingredient-${idx}`"
              class="flex items-center gap-2 rounded-lg bg-neutral-50 p-3"
            >
              <div class="flex-1 min-w-0">
                <p class="font-medium text-neutral-900 truncate">{{ ing.ingredient_name }}</p>
                <p class="text-xs text-neutral-600">{{ ing.qty_grams }}g</p>
              </div>
              <button
                type="button"
                @click="removeIngredient(idx)"
                class="text-strawberry-red hover:text-strawberry-red/80"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Add Ingredient Button -->
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth
            @click="showIngredientSearch = true"
          >
            + Add Ingredient
          </Button>
        </div>

        <!-- Nutrition Summary -->
        <div class="rounded-lg bg-sky-blue/10 p-4">
          <p class="mb-3 text-xs font-medium text-sky-blue/80">Calculated Nutrition (per serving)</p>
          <div class="grid grid-cols-4 gap-3">
            <div>
              <p class="text-xs text-neutral-600">Calories</p>
              <p class="font-medium text-neutral-900">{{ calculatedNutrition.kcal }} kcal</p>
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

        <!-- Error Message -->
        <div v-if="generalError" class="rounded-lg bg-strawberry-red/10 p-3">
          <p class="text-sm text-strawberry-red">{{ generalError }}</p>
        </div>

        <!-- Submit Buttons -->
        <div class="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            @click="closeModal"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            fullWidth
            :isLoading="isCreating"
            :disabled="form.ingredients.length === 0"
          >
            Create Recipe
          </Button>
        </div>
      </form>

      <!-- Ingredient Search Dialog -->
      <IngredientSearchForRecipe
        v-if="showIngredientSearch"
        @close="showIngredientSearch = false"
        @selected="addIngredient"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type Recipe from '@/shared/recipe'
import type { RecipeWithIngredients } from '@/renderer/composables/useRecipeService'
import { useRecipeService } from '@/renderer/composables/useRecipeService'
import Input from '@/renderer/components/ui/Input.vue'
import Button from '@/renderer/components/ui/Button.vue'
import IngredientSearchForRecipe from '@/renderer/components/modals/IngredientSearchForRecipe.vue'

interface Emits {
  (e: 'close'): void
  (e: 'created', recipe: RecipeWithIngredients): void
}

const emit = defineEmits<Emits>()

const recipeService = useRecipeService(window.electronService?.recipes)
const isCreating = ref(false)
const generalError = ref('')
const showIngredientSearch = ref(false)

const form = ref({
  name: '',
  servings: 1,
  ingredients: [] as Array<{
    ingredient_id: bigint
    ingredient_name: string
    qty_grams: number
  }>,
})

const errors = ref({
  name: '',
  servings: '',
})

const calculatedNutrition = computed(() => {
  const servings = form.value.servings || 1
  let totalKcal = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0

  form.value.ingredients.forEach(ing => {
    // Note: In a real app, we'd fetch nutrition data for each ingredient
    // For now, this assumes nutrition data is available in window.electronService
    totalKcal += 0
    totalProtein += 0
    totalCarbs += 0
    totalFat += 0
  })

  return {
    kcal: Math.round(totalKcal / servings),
    protein: (totalProtein / servings).toFixed(1),
    carbs: (totalCarbs / servings).toFixed(1),
    fat: (totalFat / servings).toFixed(1),
  }
})

const validateForm = () => {
  errors.value.name = ''
  errors.value.servings = ''
  generalError.value = ''

  if (!form.value.name.trim()) {
    errors.value.name = 'Recipe name is required'
    return false
  }

  if (form.value.servings <= 0) {
    errors.value.servings = 'Servings must be greater than 0'
    return false
  }

  if (form.value.ingredients.length === 0) {
    generalError.value = 'Add at least one ingredient'
    return false
  }

  return true
}

const removeIngredient = (index: number) => {
  form.value.ingredients.splice(index, 1)
}

const addIngredient = (ingredient: any) => {
  // Add ingredient with default 100g
  form.value.ingredients.push({
    ingredient_id: ingredient.id,
    ingredient_name: ingredient.name,
    qty_grams: 100,
  })
  showIngredientSearch.value = false
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isCreating.value = true
  try {
    const newRecipe: Omit<Recipe, 'id' | 'created_at'> = {
      user_id: null, // Will be set by backend
      name: form.value.name,
      servings: form.value.servings,
      kcal_per_serving: calculatedNutrition.value.kcal,
      protein_g_per_serving: parseFloat(calculatedNutrition.value.protein),
      carbs_g_per_serving: parseFloat(calculatedNutrition.value.carbs),
      fat_g_per_serving: parseFloat(calculatedNutrition.value.fat),
    }

    const created = await recipeService.createRecipe(newRecipe)
    emit('created', created)
    closeModal()
  } catch (err) {
    generalError.value =
      err instanceof Error ? err.message : 'Failed to create recipe. Please try again.'
    console.error('Error creating recipe:', err)
  } finally {
    isCreating.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>
