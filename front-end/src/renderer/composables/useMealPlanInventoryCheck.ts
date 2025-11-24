import { computed, type Ref, type ComputedRef } from 'vue'
import type { MealPlanRecipe } from '@/shared/mealPlan'
import type { InventoryIngredientWithDetails } from './useInventoryService'
import type { RecipeWithIngredients } from './useRecipeService'

export interface IngredientRequirement {
  ingredient_id: number
  ingredient_name: string
  required_grams: number
  available_grams: number
  shortfall_grams: number
  isMissing: boolean
  isInsufficient: boolean
}

export interface InventoryItemStatus {
  ingredient: InventoryIngredientWithDetails
  isNeededForMealPlan: boolean
  required_grams: number
  shortfall_grams: number
  isSufficient: boolean
}

export function useMealPlanInventoryCheck(
  mealPlanRecipes: Ref<MealPlanRecipe[]> | ComputedRef<readonly MealPlanRecipe[]>,
  inventoryItems: Ref<InventoryIngredientWithDetails[]> | ComputedRef<readonly InventoryIngredientWithDetails[]>,
  recipes: Ref<RecipeWithIngredients[]> | ComputedRef<readonly RecipeWithIngredients[]>
) {
  const requiredIngredients = computed((): Map<number, IngredientRequirement> => {
    const requirements = new Map<number, IngredientRequirement>()

    mealPlanRecipes.value.forEach(mealPlanRecipe => {
      const recipe = recipes.value.find(r => r.id === mealPlanRecipe.recipe_id)
      if (!recipe?.recipe_ingredients) return

      const servingMultiplier = mealPlanRecipe.planned_servings / recipe.servings

      recipe.recipe_ingredients.forEach(recipeIng => {
        const ingredientId = Number(recipeIng.ingredient_id)
        const requiredGrams = recipeIng.qty_grams * servingMultiplier

        const existing = requirements.get(ingredientId)
        if (existing) {
          existing.required_grams += requiredGrams
        } else {
          requirements.set(ingredientId, {
            ingredient_id: ingredientId,
            ingredient_name: recipeIng.ingredients.name,
            required_grams: requiredGrams,
            available_grams: 0,
            shortfall_grams: 0,
            isMissing: false,
            isInsufficient: false,
          })
        }
      })
    })

    requirements.forEach((requirement, ingredientId) => {
      const inventoryItem = inventoryItems.value.find(
        item => Number(item.ingredient_id) === ingredientId
      )

      if (inventoryItem) {
        requirement.available_grams = inventoryItem.qty_grams
        requirement.shortfall_grams = Math.max(0, requirement.required_grams - inventoryItem.qty_grams)
        requirement.isInsufficient = requirement.shortfall_grams > 0
        requirement.isMissing = false
      } else {
        requirement.available_grams = 0
        requirement.shortfall_grams = requirement.required_grams
        requirement.isMissing = true
        requirement.isInsufficient = false
      }
    })

    return requirements
  })

  const missingIngredients = computed((): IngredientRequirement[] => {
    return Array.from(requiredIngredients.value.values()).filter(req => req.isMissing)
  })

  const insufficientIngredients = computed((): IngredientRequirement[] => {
    return Array.from(requiredIngredients.value.values()).filter(req => req.isInsufficient)
  })

  const inventoryWithStatus = computed((): InventoryItemStatus[] => {
    return inventoryItems.value.map(item => {
      const ingredientId = Number(item.ingredient_id)
      const requirement = requiredIngredients.value.get(ingredientId)

      return {
        ingredient: item,
        isNeededForMealPlan: !!requirement,
        required_grams: requirement?.required_grams || 0,
        shortfall_grams: requirement?.shortfall_grams || 0,
        isSufficient: requirement ? requirement.shortfall_grams === 0 : true,
      }
    })
  })

  const summary = computed(() => ({
    totalIngredientsNeeded: requiredIngredients.value.size,
    missingCount: missingIngredients.value.length,
    insufficientCount: insufficientIngredients.value.length,
    sufficientCount: requiredIngredients.value.size - missingIngredients.value.length - insufficientIngredients.value.length,
    hasAllIngredients: missingIngredients.value.length === 0 && insufficientIngredients.value.length === 0,
  }))

  return {
    requiredIngredients,
    missingIngredients,
    insufficientIngredients,
    inventoryWithStatus,
    summary,
  }
}
