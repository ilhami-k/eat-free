<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="mb-6 flex items-start justify-between">
        <div>
          <h2 class="text-h2 font-display text-neutral-900">{{ recipe.name }}</h2>
          <p class="mt-1 text-sm text-neutral-600">
            {{ recipe.servings }} serving<span v-if="recipe.servings !== 1">s</span>
          </p>
        </div>
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

      <!-- Nutrition Summary -->
      <div class="mb-6 rounded-lg bg-sky-blue/10 p-4">
        <p class="mb-3 text-xs font-medium text-sky-blue/80">Nutritional Values (per serving)</p>
        <div class="grid grid-cols-4 gap-3">
          <div>
            <p class="text-xs text-neutral-600">Calories</p>
            <p class="font-medium text-neutral-900">{{ recipe.kcal_per_serving }} kcal</p>
          </div>
          <div>
            <p class="text-xs text-neutral-600">Protein</p>
            <p class="font-medium text-neutral-900">{{ recipe.protein_g_per_serving }}g</p>
          </div>
          <div>
            <p class="text-xs text-neutral-600">Carbs</p>
            <p class="font-medium text-neutral-900">{{ recipe.carbs_g_per_serving }}g</p>
          </div>
          <div>
            <p class="text-xs text-neutral-600">Fat</p>
            <p class="font-medium text-neutral-900">{{ recipe.fat_g_per_serving }}g</p>
          </div>
        </div>
      </div>

      <!-- Ingredients List -->
      <div class="mb-6">
        <h3 class="mb-3 font-medium text-neutral-900">Ingredients</h3>
        <div v-if="ingredientsList.length === 0" class="text-sm text-neutral-500">
          No ingredients added to this recipe yet.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(item, idx) in ingredientsList"
            :key="`ingredient-${idx}`"
            class="rounded-lg bg-neutral-50 p-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="font-medium text-neutral-900">{{ item.ingredient_name }}</p>
                <p class="text-xs text-neutral-600">{{ item.qty_grams }}g</p>
              </div>
              <div v-if="item.notes" class="text-xs text-neutral-500">
                {{ item.notes }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <Button
          variant="secondary"
          fullWidth
          @click="closeModal"
        >
          Close
        </Button>
        <Button
          variant="secondary"
          fullWidth
          @click="handleDelete"
          :isLoading="isDeleting"
          class="text-strawberry-red hover:bg-strawberry-red/10"
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RecipeWithIngredients } from '@/renderer/composables/useRecipeService'
import { useRecipeService } from '@/renderer/composables/useRecipeService'
import Button from '@/renderer/components/ui/Button.vue'

interface Props {
  recipe: RecipeWithIngredients
}

interface Emits {
  (e: 'close'): void
  (e: 'updated'): void
  (e: 'deleted'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const recipeService = useRecipeService(window.electronService?.recipes)
const isDeleting = ref(false)

const ingredientsList = computed(() => {
  return (props.recipe.recipe_ingredients || []).map(item => ({
    ingredient_name: item.ingredients?.name || `Ingredient ${item.ingredient_id}`,
    qty_grams: item.qty_grams,
    notes: item.notes,
  }))
})

const handleDelete = async () => {
  if (!confirm(`Delete recipe "${props.recipe.name}"?`)) {
    return
  }

  isDeleting.value = true
  try {
    await recipeService.deleteRecipe(props.recipe.id)
    emit('deleted')
    closeModal()
  } catch (err) {
    console.error('Error deleting recipe:', err)
  } finally {
    isDeleting.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>
