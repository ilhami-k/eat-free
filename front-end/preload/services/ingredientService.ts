/**
 * Ingredient Service
 * Preload service wrapper for ingredient operations
 */

import { ipcRenderer } from 'electron';
import type { ApiResponse, Ingredient, CreateIngredientRequest, NutritionRange } from '../../src/shared/types';

export const ingredientService = {
  create: (data: CreateIngredientRequest): Promise<ApiResponse<Ingredient>> =>
    ipcRenderer.invoke('ingredient:create', data),

  search: (query: string): Promise<ApiResponse<Ingredient[]>> =>
    ipcRenderer.invoke('ingredient:search', query),

  getById: (id: bigint): Promise<ApiResponse<Ingredient | null>> =>
    ipcRenderer.invoke('ingredient:getById', id),

  getAll: (): Promise<ApiResponse<Ingredient[]>> =>
    ipcRenderer.invoke('ingredient:getAll'),

  getByNutritionRange: (data: NutritionRange): Promise<ApiResponse<Ingredient[]>> =>
    ipcRenderer.invoke('ingredient:getByNutritionRange', data),

  getHighProtein: (minProtein?: number): Promise<ApiResponse<Ingredient[]>> =>
    ipcRenderer.invoke('ingredient:getHighProtein', minProtein),

  getLowCalorie: (maxKcal?: number): Promise<ApiResponse<Ingredient[]>> =>
    ipcRenderer.invoke('ingredient:getLowCalorie', maxKcal),

  getWithUsageCount: (): Promise<ApiResponse<unknown[]>> =>
    ipcRenderer.invoke('ingredient:getWithUsageCount'),

  count: (): Promise<ApiResponse<number>> =>
    ipcRenderer.invoke('ingredient:count'),

  update: (id: bigint, updateData: Partial<CreateIngredientRequest>): Promise<ApiResponse<Ingredient>> =>
    ipcRenderer.invoke('ingredient:update', { id, updateData }),

  delete: (id: bigint): Promise<ApiResponse<boolean>> =>
    ipcRenderer.invoke('ingredient:delete', id),
};
