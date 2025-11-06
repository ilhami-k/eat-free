/**
 * Recipe Service
 * Preload service wrapper for recipe operations
 */

import { ipcRenderer } from 'electron';
import type { ApiResponse, Recipe, CreateRecipeRequest, RecipeListResponse, AddRecipeIngredientRequest, RecipeIngredient } from '../../src/shared/types';

export const recipeService = {
  create: (data: CreateRecipeRequest): Promise<ApiResponse<Recipe>> =>
    ipcRenderer.invoke('recipe:create', data),

  getById: (id: bigint): Promise<ApiResponse<Recipe | null>> =>
    ipcRenderer.invoke('recipe:getById', id),

  getAll: (): Promise<ApiResponse<RecipeListResponse>> =>
    ipcRenderer.invoke('recipe:getAll'),

  getByUser: (userId: bigint): Promise<ApiResponse<RecipeListResponse>> =>
    ipcRenderer.invoke('recipe:getByUser', userId),

  update: (data: { id: bigint } & Partial<CreateRecipeRequest>): Promise<ApiResponse<Recipe>> =>
    ipcRenderer.invoke('recipe:update', data),

  delete: (id: bigint): Promise<ApiResponse<boolean>> =>
    ipcRenderer.invoke('recipe:delete', id),

  addIngredient: (data: AddRecipeIngredientRequest): Promise<ApiResponse<RecipeIngredient>> =>
    ipcRenderer.invoke('recipe:addIngredient', data),

  removeIngredient: (recipeId: bigint, ingredientId: bigint): Promise<ApiResponse<boolean>> =>
    ipcRenderer.invoke('recipe:removeIngredient', { recipeId, ingredientId }),

  getDetails: (id: bigint): Promise<ApiResponse<Record<string, unknown> | null>> =>
    ipcRenderer.invoke('recipe:getDetails', id),

  getIngredients: (recipeId: bigint): Promise<ApiResponse<RecipeIngredient[]>> =>
    ipcRenderer.invoke('recipe:getIngredients', recipeId),

  searchByName: (query: string): Promise<ApiResponse<RecipeListResponse>> =>
    ipcRenderer.invoke('recipe:searchByName', query),

  getHighProtein: (minProtein?: number): Promise<ApiResponse<RecipeListResponse>> =>
    ipcRenderer.invoke('recipe:getHighProtein', minProtein),

  getLowCalorie: (maxKcal?: number): Promise<ApiResponse<RecipeListResponse>> =>
    ipcRenderer.invoke('recipe:getLowCalorie', maxKcal),

  getPublic: (): Promise<ApiResponse<RecipeListResponse>> =>
    ipcRenderer.invoke('recipe:getPublic'),

  getWithCount: (): Promise<ApiResponse<Record<string, unknown>[]>> =>
    ipcRenderer.invoke('recipe:getWithCount'),
};
