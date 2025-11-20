<template>
  <Modal
    :isOpen="true"
    title="Create New Recipe"
    size="lg"
    :showDefaultFooter="false"
    @close="closeModal"
  >

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
          
          <!-- Fixed height container for consistent modal size -->
          <div style="min-height: 340px;">
            <!-- Ingredients List -->
            <div v-if="form.ingredients.length > 0" class="mb-4 space-y-2">
              <div
                v-for="(ing, idx) in form.ingredients"
                :key="`ingredient-${idx}`"
                class="flex items-center gap-2 rounded-lg bg-neutral-50 p-3"
              >
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-neutral-900 truncate">{{ ing.ingredient_name }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <input
                      v-model.number="ing.qty_grams"
                      type="number"
                      min="1"
                      step="1"
                      class="w-20 px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-fresh-green/50"
                    />
                    <span class="text-xs text-neutral-600">grams</span>
                  </div>
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

            <!-- Ingredient Search (always shown) -->
            <div class="space-y-3">
              <Input
                v-model="ingredientSearchQuery"
                placeholder="Type to search ingredients..."
                label="Search Ingredients"
              />

              <!-- Loading State -->
              <div v-if="isLoadingIngredients" class="flex justify-center py-8">
                <div class="h-6 w-6 animate-spin rounded-full border-4 border-fresh-green/20 border-t-fresh-green"></div>
              </div>

              <!-- Results List - Fixed height container -->
              <div v-else class="space-y-2" style="min-height: 220px;">
                <div v-if="!ingredientSearchQuery.trim()" class="py-8 text-center">
                  <p class="text-sm text-neutral-500">Start typing to search</p>
                </div>

                <div v-else-if="filteredAvailableIngredients.length === 0" class="py-8 text-center">
                  <p class="text-sm text-neutral-500">No ingredients found</p>
                </div>

                <button
                  v-else
                  v-for="ingredient in filteredAvailableIngredients"
                  :key="`available-${ingredient.id}`"
                  type="button"
                  @click="addIngredient(ingredient)"
                  class="w-full rounded-lg border border-neutral-200 p-2 text-left transition-all hover:bg-fresh-green/5 hover:border-fresh-green"
                >
                  <p class="text-sm font-medium text-neutral-900">{{ ingredient.name }}</p>
                  <p class="text-xs text-neutral-500">{{ ingredient.kcal_per_100g }} kcal per 100g</p>
                </button>
              </div>
            </div>
          </div>
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
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type Recipe from '@/shared/recipe'
import type Ingredient from '@/shared/ingredient'
import type { RecipeWithIngredients } from '@/renderer/composables/useRecipeService'
import { useRecipeService } from '@/renderer/composables/useRecipeService'
import { useIngredientsService } from '@/renderer/composables/useIngredientsService'
import Input from '@/renderer/components/ui/Input.vue'
import Button from '@/renderer/components/ui/Button.vue'
import Modal from '@/renderer/components/ui/Modal.vue'

interface Props {
  userId?: bigint | null
}

interface Emits {
  (e: 'close'): void
  (e: 'created', recipe: RecipeWithIngredients): void
}

const props = withDefaults(defineProps<Props>(), {
  userId: null,
})
const emit = defineEmits<Emits>()

const recipeService = useRecipeService(window.electronService?.recipes)
const ingredientService = useIngredientsService(window.electronService?.ingredients)
const isCreating = ref(false)
const generalError = ref('')
const ingredientSearchQuery = ref('')
const availableIngredients = ref<Ingredient[]>([])

const form = ref({
  name: '',
  servings: 1,
  ingredients: [] as Array<{
    ingredient_id: bigint
    ingredient_name: string
    qty_grams: number
    kcal_per_100g: number
    protein_g_per_100g: number
    carbs_g_per_100g: number
    fat_g_per_100g: number
  }>,
})

const errors = ref({
  name: '',
  servings: '',
})

const isLoadingIngredients = computed(() => ingredientService.isLoading.value)

const filteredAvailableIngredients = computed(() => {
  const query = ingredientSearchQuery.value.toLowerCase().trim()
  if (!query) return []
  
  // Filter out already added ingredients
  const addedIds = form.value.ingredients.map(ing => Number(ing.ingredient_id))
  return availableIngredients.value
    .filter(ing => !addedIds.includes(ing.id))
    .filter(ing => ing.name.toLowerCase().includes(query))
    .slice(0, 3) // Limit to 3 most relevant results
})

const calculatedNutrition = computed(() => {
  const servings = form.value.servings || 1
  let totalKcal = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0

  form.value.ingredients.forEach(ing => {
    // Calculate nutrition based on quantity (grams) and per-100g values
    const factor = ing.qty_grams / 100
    totalKcal += ing.kcal_per_100g * factor
    totalProtein += ing.protein_g_per_100g * factor
    totalCarbs += ing.carbs_g_per_100g * factor
    totalFat += ing.fat_g_per_100g * factor
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

const addIngredient = (ingredient: Ingredient) => {
  // Add ingredient with default 100g and nutrition data
  form.value.ingredients.push({
    ingredient_id: BigInt(ingredient.id),
    ingredient_name: ingredient.name,
    qty_grams: 100,
    kcal_per_100g: ingredient.kcal_per_100g,
    protein_g_per_100g: ingredient.protein_g_per_100g,
    carbs_g_per_100g: ingredient.carbs_g_per_100g,
    fat_g_per_100g: ingredient.fat_g_per_100g,
  })
  // Clear search
  ingredientSearchQuery.value = ''
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isCreating.value = true
  try {
    const newRecipe: Omit<Recipe, 'id' | 'created_at'> = {
      user_id: props.userId ? Number(props.userId) : null,
      name: form.value.name,
      servings: form.value.servings,
      kcal_per_serving: calculatedNutrition.value.kcal,
      protein_g_per_serving: parseFloat(calculatedNutrition.value.protein),
      carbs_g_per_serving: parseFloat(calculatedNutrition.value.carbs),
      fat_g_per_serving: parseFloat(calculatedNutrition.value.fat),
    }

    // Prepare ingredients for creation
    const ingredientsData = form.value.ingredients.map(ing => ({
      ingredient_id: ing.ingredient_id,
      qty_grams: ing.qty_grams,
      notes: null as string | null,
    }))

    const created = await recipeService.createRecipe(newRecipe, ingredientsData)
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

// Fetch ingredients when modal opens
onMounted(async () => {
  const ingredients = await ingredientService.fetchIngredients()
  if (ingredients) {
    availableIngredients.value = ingredients
  }
})
</script>
