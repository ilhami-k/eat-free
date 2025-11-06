/**
 * Meal Plan Service
 * Preload service wrapper for meal plan operations
 */

import { ipcRenderer } from 'electron';
import type { ApiResponse, MealPlan, CreateMealPlanRequest, AddRecipeToMealPlanRequest } from '../../src/shared/types';

export const mealPlanService = {
  create: (data: CreateMealPlanRequest): Promise<ApiResponse<MealPlan>> =>
    ipcRenderer.invoke('mealplan:create', data),

  getById: (id: bigint): Promise<ApiResponse<MealPlan | null>> =>
    ipcRenderer.invoke('mealplan:getById', id),

  getByUser: (userId: bigint): Promise<ApiResponse<MealPlan[]>> =>
    ipcRenderer.invoke('mealplan:getByUser', userId),

  getCurrentWeek: (userId: bigint): Promise<ApiResponse<Record<string, unknown> | null>> =>
    ipcRenderer.invoke('mealplan:getCurrentWeek', userId),

  addMeal: (data: AddRecipeToMealPlanRequest): Promise<ApiResponse<Record<string, unknown>>> =>
    ipcRenderer.invoke('mealplan:addMeal', data),

  removeMeal: (mealId: bigint): Promise<ApiResponse<boolean>> =>
    ipcRenderer.invoke('mealplan:removeMeal', mealId),

  updateMeal: (mealId: bigint, plannedServings: number): Promise<ApiResponse<Record<string, unknown>>> =>
    ipcRenderer.invoke('mealplan:updateMeal', { mealId, plannedServings }),

  getMealsForDate: (planId: bigint, date: Date): Promise<ApiResponse<Record<string, unknown>[]>> =>
    ipcRenderer.invoke('mealplan:getMealsForDate', { planId, date }),

  getDayNutrition: (planId: bigint, date: Date): Promise<ApiResponse<Record<string, number>>> =>
    ipcRenderer.invoke('mealplan:getDayNutrition', { planId, date }),

  getWeekNutrition: (planId: bigint): Promise<ApiResponse<Record<string, unknown>>> =>
    ipcRenderer.invoke('mealplan:getWeekNutrition', planId),

  getMealsForMealType: (planId: bigint, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'): Promise<ApiResponse<Record<string, unknown>[]>> =>
    ipcRenderer.invoke('mealplan:getMealsForMealType', { planId, mealType }),

  count: (): Promise<ApiResponse<number>> =>
    ipcRenderer.invoke('mealplan:count'),

  delete: (id: bigint): Promise<ApiResponse<boolean>> =>
    ipcRenderer.invoke('mealplan:delete', id),
};
