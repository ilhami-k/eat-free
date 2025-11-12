import { ref, readonly } from 'vue'
import type IMealPlanService from '@/shared/interfaces/IMealPlanService'
import type MealPlan from '@/shared/mealPlan'
import type { MealPlanRecipe, MealType } from '@/shared/mealPlan'
import type { RecipeWithIngredients } from './useRecipeService'

/**
 * Normalize a date to Monday UTC midnight to match the database trigger behavior
 * JavaScript getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
 * We want Monday as week start
 */
function normalizeToMonday(date: Date): Date {
  const normalized = new Date(date)
  const dayOfWeek = normalized.getDay()
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  normalized.setDate(normalized.getDate() - daysToMonday)
  normalized.setUTCHours(0, 0, 0, 0)
  return normalized
}

/**
 * Normalize a date to midnight UTC (keep the actual day, just zero out time)
 */
function normalizeDateOnly(date: Date): Date {
  const normalized = new Date(date)
  normalized.setUTCHours(0, 0, 0, 0)
  return normalized
}

export interface MealPlanWithRecipes extends MealPlan {
  meal_plan_recipe?: Array<MealPlanRecipe & { recipe?: RecipeWithIngredients }>
}

export function useMealPlanService(service: IMealPlanService) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const currentMealPlan = ref<MealPlanWithRecipes | null>(null)

  const getMealPlanForWeek = async (userId: bigint, weekStartDate: Date) => {
    isLoading.value = true
    error.value = null
    try {
      const normalizedDate = normalizeToMonday(weekStartDate)
      currentMealPlan.value = (await service.getMealPlanForWeek(userId, normalizedDate)) as MealPlanWithRecipes
      return currentMealPlan.value
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch meal plan')
      console.error('Error fetching meal plan:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createMealPlan = async (userId: bigint, weekStartDate: Date) => {
    isLoading.value = true
    error.value = null
    try {
      const normalizedDate = normalizeToMonday(weekStartDate)
      currentMealPlan.value = (await service.createMealPlan(userId, normalizedDate)) as MealPlanWithRecipes
      return currentMealPlan.value
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to create meal plan')
      console.error('Error creating meal plan:', err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const addRecipeToMealPlan = async (
    planId: bigint,
    recipeId: bigint,
    date: Date,
    mealType: MealType,
    plannedServings: number
  ) => {
    isLoading.value = true
    error.value = null
    try {
      const normalizedDate = normalizeDateOnly(date)
      const result = await service.addRecipeToMealPlan(
        planId,
        recipeId,
        normalizedDate,
        mealType,
        plannedServings
      )

      // Refresh meal plan
      if (currentMealPlan.value) {
        const normalizedWeekStart = normalizeToMonday(currentMealPlan.value.week_start_date)
        const updated = await service.getMealPlanForWeek(
          currentMealPlan.value.user_id,
          normalizedWeekStart
        )
        currentMealPlan.value = updated as MealPlanWithRecipes
      }

      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to add recipe to meal plan')
      console.error('Error adding recipe:', err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const updateMealPlanRecipe = async (recipeId: bigint, plannedServings: number) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await service.updateMealPlanRecipe(recipeId, plannedServings)

      // Refresh meal plan
      if (currentMealPlan.value) {
        const updated = await service.getMealPlanForWeek(
          currentMealPlan.value.user_id,
          currentMealPlan.value.week_start_date
        )
        currentMealPlan.value = updated as MealPlanWithRecipes
      }

      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to update meal plan recipe')
      console.error('Error updating meal plan recipe:', err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const removeRecipeFromMealPlan = async (mealPlanRecipeId: bigint) => {
    isLoading.value = true
    error.value = null
    try {
      await service.removeRecipeFromMealPlan(mealPlanRecipeId)

      // Refresh meal plan
      if (currentMealPlan.value) {
        const updated = await service.getMealPlanForWeek(
          currentMealPlan.value.user_id,
          currentMealPlan.value.week_start_date
        )
        currentMealPlan.value = updated as MealPlanWithRecipes
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to remove recipe from meal plan')
      console.error('Error removing recipe:', err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const deleteMealPlan = async (planId: bigint) => {
    isLoading.value = true
    error.value = null
    try {
      await service.deleteMealPlan(planId)
      currentMealPlan.value = null
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to delete meal plan')
      console.error('Error deleting meal plan:', err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    currentMealPlan: readonly(currentMealPlan),
    getMealPlanForWeek,
    createMealPlan,
    addRecipeToMealPlan,
    updateMealPlanRecipe,
    removeRecipeFromMealPlan,
    deleteMealPlan,
    clearError,
  }
}
