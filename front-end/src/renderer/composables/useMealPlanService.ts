import { ref, readonly } from 'vue'
import type IMealPlanService from '@/shared/interfaces/IMealPlanService'
import type MealPlan from '@/shared/mealPlan'
import type { MealPlanRecipe, MealType } from '@/shared/mealPlan'
import type { RecipeWithIngredients } from './useRecipeService'

function normalizeToMonday(date: Date): Date {
  const normalized = new Date(date)
  const dayOfWeek = normalized.getDay()
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  normalized.setDate(normalized.getDate() - daysToMonday)
  normalized.setUTCHours(0, 0, 0, 0)
  return normalized
}

function normalizeDateOnly(date: Date): Date {
  const normalized = new Date(date)
  normalized.setUTCHours(0, 0, 0, 0)
  return normalized
}

export interface MealPlanWithRecipes extends MealPlan {
  meal_plan_recipe?: Array<MealPlanRecipe & { recipe?: RecipeWithIngredients }>
}

const sharedCurrentMealPlan = ref<MealPlanWithRecipes | null>(null)

export function useMealPlanService(service: IMealPlanService) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const currentMealPlan = sharedCurrentMealPlan

  const getMealPlanForWeek = async (userId: number, weekStartDate: Date) => {
    isLoading.value = true
    error.value = null
    try {
      const normalizedDate = normalizeToMonday(weekStartDate)
      currentMealPlan.value = (await service.getMealPlanForWeek(userId, normalizedDate)) as MealPlanWithRecipes
      return currentMealPlan.value
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to load meal plan')
    } finally {
      isLoading.value = false
    }
  }

  const createMealPlan = async (userId: number, weekStartDate: Date) => {
    isLoading.value = true
    error.value = null
    try {
      const normalizedDate = normalizeToMonday(weekStartDate)
      currentMealPlan.value = (await service.createMealPlan(userId, normalizedDate)) as MealPlanWithRecipes
      return currentMealPlan.value
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to create meal plan')
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const addRecipeToMealPlan = async (
    planId: number,
    recipeId: number,
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

      if (currentMealPlan.value) {
        const normalizedWeekStart = normalizeToMonday(new Date(currentMealPlan.value.week_start_date))
        const updated = await service.getMealPlanForWeek(
          currentMealPlan.value.user_id,
          normalizedWeekStart
        )
        currentMealPlan.value = updated as MealPlanWithRecipes
      }

      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to add recipe to meal plan')
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const updateMealPlanRecipe = async (recipeId: number, plannedServings: number) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await service.updateMealPlanRecipe(recipeId, plannedServings)

      if (currentMealPlan.value) {
        const updated = await service.getMealPlanForWeek(
          currentMealPlan.value.user_id,
          new Date(currentMealPlan.value.week_start_date)
        )
        currentMealPlan.value = updated as MealPlanWithRecipes
      }

      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to update meal plan recipe')
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const removeRecipeFromMealPlan = async (mealPlanRecipeId: number) => {
    isLoading.value = true
    error.value = null
    try {
      await service.removeRecipeFromMealPlan(mealPlanRecipeId)

      if (currentMealPlan.value) {
        const updated = await service.getMealPlanForWeek(
          currentMealPlan.value.user_id,
          new Date(currentMealPlan.value.week_start_date)
        )
        currentMealPlan.value = updated as MealPlanWithRecipes
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to remove recipe from meal plan')
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const deleteMealPlan = async (planId: number) => {
    isLoading.value = true
    error.value = null
    try {
      await service.deleteMealPlan(planId)
      currentMealPlan.value = null
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to delete meal plan')
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
