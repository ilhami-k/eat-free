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
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type Recipe from '@/shared/recipe'
import type Ingredient from '@/shared/ingredient'
import type { RecipeWithIngredients } from '@/renderer/composables/useRecipeService'
import { useRecipeService } from '@/renderer/composables/useRecipeService'
import Input from '@/renderer/components/ui/Input.vue'
import Button from '@/renderer/components/ui/Button.vue'
import Modal from '@/renderer/components/ui/Modal.vue'
import IngredientSearchForRecipe from '@/renderer/components/modals/IngredientSearchForRecipe.vue'

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
  showIngredientSearch.value = false
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
      notes: null,
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
</script>
