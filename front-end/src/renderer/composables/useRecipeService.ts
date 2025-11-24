import { ref, readonly } from 'vue'
import type IRecipeService from '@/shared/interfaces/IRecipeService'
import type Recipe from '@/shared/recipe'

export interface RecipeWithIngredients extends Recipe {
  recipe_ingredients?: Array<{
    recipe_id: number
    ingredient_id: number
    qty_grams: number
    notes: string | null
    ingredients: {
      id: number
      name: string
      kcal_per_100g: number
      protein_g_per_100g: number
      carbs_g_per_100g: number
      fat_g_per_100g: number
    }
  }>
}

export function useRecipeService(service: IRecipeService) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const recipes = ref<RecipeWithIngredients[]>([])
  const selectedRecipe = ref<RecipeWithIngredients | null>(null)

  const fetchRecipes = async () => {
    isLoading.value = true
    error.value = null
    try {
      const fetchedRecipes = (await service.getRecipes()) as RecipeWithIngredients[]
      recipes.value = fetchedRecipes
      return recipes.value
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch recipes')
    } finally {
      isLoading.value = false
    }
  }

  const getRecipeById = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      const recipe = (await service.getRecipeById(id)) as RecipeWithIngredients
      selectedRecipe.value = recipe
      return recipe
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch recipe')
    } finally {
      isLoading.value = false
    }
  }

  const searchRecipes = async (query: string) => {
    if (!query.trim()) {
      return await fetchRecipes()
    }

    isLoading.value = true
    error.value = null
    try {
      const allRecipes = await service.getRecipes()
      recipes.value = (allRecipes as RecipeWithIngredients[]).filter(recipe =>
        recipe.name.toLowerCase().includes(query.toLowerCase())
      )
      return recipes.value
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to search recipes')
    } finally {
      isLoading.value = false
    }
  }

  const createRecipe = async (recipe: Omit<Recipe, 'id' | 'created_at'>, ingredients?: Array<{ ingredient_id: number, qty_grams: number, notes?: string | null }>) => {
    isLoading.value = true
    error.value = null
    try {
      const newRecipe = (await service.createRecipe(recipe, ingredients)) as RecipeWithIngredients
      recipes.value.push(newRecipe)
      return newRecipe
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to create recipe')
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const updateRecipe = async (
    id: number,
    data: Partial<Omit<Recipe, 'id' | 'created_at'>>
  ) => {
    isLoading.value = true
    error.value = null
    try {
      const updated = (await service.updateRecipe(id, data)) as RecipeWithIngredients
      const index = recipes.value.findIndex(r => r.id === (id))
      if (index !== -1) {
        recipes.value[index] = updated
      }
      if (selectedRecipe.value?.id === (id)) {
        selectedRecipe.value = updated
      }
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to update recipe')
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const deleteRecipe = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      await service.deleteRecipe(id)
      recipes.value = recipes.value.filter(r => r.id !== (id))
      if (selectedRecipe.value?.id === (id)) {
        selectedRecipe.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to delete recipe')
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const clearSelection = () => {
    selectedRecipe.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    recipes: readonly(recipes),
    selectedRecipe: readonly(selectedRecipe),
    fetchRecipes,
    getRecipeById,
    searchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    clearSelection,
    clearError,
  }
}
