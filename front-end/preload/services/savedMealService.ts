/**
 * Saved Meal Service
 * Preload service wrapper for saved meal operations
 */

import { ipcRenderer } from 'electron';
import type { ApiResponse, SavedMeal } from '../../src/shared/types';

export const savedMealService = {
  create: (userId: bigint, name: string, recipeId: bigint, defaultServings?: number): Promise<ApiResponse<SavedMeal>> =>
    ipcRenderer.invoke('savedmeal:create', { userId, name, recipeId, defaultServings }),

  getById: (id: bigint): Promise<ApiResponse<SavedMeal | null>> =>
    ipcRenderer.invoke('savedmeal:getById', id),

  getByUser: (userId: bigint): Promise<ApiResponse<SavedMeal[]>> =>
    ipcRenderer.invoke('savedmeal:getByUser', userId),

  update: (id: bigint, name?: string, defaultServings?: number): Promise<ApiResponse<SavedMeal>> =>
    ipcRenderer.invoke('savedmeal:update', { id, name, defaultServings }),

  delete: (id: bigint): Promise<ApiResponse<boolean>> =>
    ipcRenderer.invoke('savedmeal:delete', id),

  quickLog: (userId: bigint, savedMealId: bigint, servings?: number): Promise<ApiResponse<Record<string, unknown>>> =>
    ipcRenderer.invoke('savedmeal:quickLog', { userId, savedMealId, servings }),

  getDefaultNutrition: (savedMealId: bigint): Promise<ApiResponse<Record<string, number>>> =>
    ipcRenderer.invoke('savedmeal:getDefaultNutrition', savedMealId),

  getMostUsed: (userId: bigint, limit?: number): Promise<ApiResponse<unknown[]>> =>
    ipcRenderer.invoke('savedmeal:getMostUsed', { userId, limit }),

  count: (): Promise<ApiResponse<number>> =>
    ipcRenderer.invoke('savedmeal:count'),

  countByUser: (userId: bigint): Promise<ApiResponse<number>> =>
    ipcRenderer.invoke('savedmeal:countByUser', userId),
};
