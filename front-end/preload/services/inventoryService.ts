/**
 * Inventory Service
 * Preload service wrapper for inventory operations
 */

import { ipcRenderer } from 'electron';
import type { ApiResponse, Inventory, AddToInventoryRequest } from '../../src/shared/types';

export const inventoryService = {
  createForUser: (userId: bigint): Promise<ApiResponse<Inventory>> =>
    ipcRenderer.invoke('inventory:createForUser', userId),

  getByUser: (userId: bigint): Promise<ApiResponse<Record<string, unknown> | null>> =>
    ipcRenderer.invoke('inventory:getByUser', userId),

  addOrUpdateIngredient: (inventaireId: bigint, ingredientId: bigint, qtyGrams: number): Promise<ApiResponse<Record<string, unknown>>> =>
    ipcRenderer.invoke('inventory:addOrUpdateIngredient', { inventaireId, ingredientId, qtyGrams }),

  removeIngredient: (inventaireId: bigint, ingredientId: bigint): Promise<ApiResponse<boolean>> =>
    ipcRenderer.invoke('inventory:removeIngredient', { inventaireId, ingredientId }),

  getIngredients: (inventaireId: bigint): Promise<ApiResponse<Record<string, unknown>[]>> =>
    ipcRenderer.invoke('inventory:getIngredients', inventaireId),

  canMakeRecipe: (inventaireId: bigint, recipeId: bigint): Promise<ApiResponse<boolean>> =>
    ipcRenderer.invoke('inventory:canMakeRecipe', { inventaireId, recipeId }),

  consumeRecipe: (inventaireId: bigint, recipeId: bigint): Promise<ApiResponse<boolean>> =>
    ipcRenderer.invoke('inventory:consumeRecipe', { inventaireId, recipeId }),

  getTotalValue: (inventaireId: bigint): Promise<ApiResponse<number>> =>
    ipcRenderer.invoke('inventory:getTotalValue', inventaireId),

  getEstimatedNutrition: (inventaireId: bigint): Promise<ApiResponse<Record<string, number>>> =>
    ipcRenderer.invoke('inventory:getEstimatedNutrition', inventaireId),

  clearExpired: (inventaireId: bigint, thresholdDays?: number): Promise<ApiResponse<number>> =>
    ipcRenderer.invoke('inventory:clearExpired', { inventaireId, thresholdDays }),
};
