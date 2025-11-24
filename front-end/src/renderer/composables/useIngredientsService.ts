import { ref, readonly } from 'vue'
import type IIngredientsService from '../../shared/interfaces/IIngredientsService'
import type Ingredient from '../../shared/ingredient'

export function useIngredientsService(service: IIngredientsService) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const ingredients = ref<Ingredient[]>([])
  const selectedIngredient = ref<Ingredient | null>(null)

  const fetchIngredients = async () => {
    isLoading.value = true
    error.value = null
    try {
      ingredients.value = await service.getIngredients()
      return ingredients.value
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch ingredients')
    } finally {
      isLoading.value = false
    }
  }

  const getIngredientById = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      const ingredient = await service.getIngredientById(id)
      selectedIngredient.value = ingredient
      return ingredient
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch ingredient')
    } finally {
      isLoading.value = false
    }
  }

  const searchIngredients = async (query: string) => {
    if (!query.trim()) {
      ingredients.value = await service.getIngredients()
      return ingredients.value
    }

    isLoading.value = true
    error.value = null
    try {
      const allIngredients = await service.getIngredients()

      ingredients.value = allIngredients.filter(ing =>
        ing.name.toLowerCase().includes(query.toLowerCase())
      )

      return ingredients.value
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to search ingredients')
    } finally {
      isLoading.value = false
    }
  }

  const createIngredient = async (
    name: string,
    kcal_per_100g: number,
    protein_g_per_100g: number,
    carbs_g_per_100g: number,
    fat_g_per_100g: number
  ) => {
    isLoading.value = true
    error.value = null
    try {
      const newIngredient = await service.createIngredient(
        name,
        kcal_per_100g,
        protein_g_per_100g,
        carbs_g_per_100g,
        fat_g_per_100g
      )
      ingredients.value.push(newIngredient)
      return newIngredient
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to create ingredient')
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const updateIngredient = async (
    id: number,
    data: {
      name?: string
      kcal_per_100g?: number
      protein_g_per_100g?: number
      carbs_g_per_100g?: number
      fat_g_per_100g?: number
    }
  ) => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await service.updateIngredient(id, data)
      const index = ingredients.value.findIndex(ing => ing.id === id)
      if (index !== -1) {
        ingredients.value[index] = updated
      }
      if (selectedIngredient.value?.id === id) {
        selectedIngredient.value = updated
      }
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to update ingredient')
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const deleteIngredient = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      await service.deleteIngredient(id)
      ingredients.value = ingredients.value.filter(ing => ing.id !== id)
      if (selectedIngredient.value?.id === id) {
        selectedIngredient.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to delete ingredient')
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const clearSelection = () => {
    selectedIngredient.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    ingredients: readonly(ingredients),
    selectedIngredient: readonly(selectedIngredient),
    fetchIngredients,
    getIngredientById,
    searchIngredients,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    clearSelection,
    clearError,
  }
}
