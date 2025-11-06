/**
 * Inventory Repository IPC Handler Registration
 * 
 * Registers all inventory-related IPC handlers for the Main process.
 */

import { ipcMain } from 'electron';
import { inventoryRepository } from '../repositories/inventoryRepository';
import type {
  ApiResponse,
  Inventory,
  InventoryListResponse,
  AddToInventoryRequest,
  UpdateInventoryRequest,
} from '../../src/shared/types';

/**
 * Register all Inventory IPC handlers
 */
export function registerInventoryRepository(): void {
  /**
   * Create inventory for user
   * IPC Channel: inventory:createForUser
   */
  ipcMain.handle(
    'inventory:createForUser',
    async (_event, userId: bigint): Promise<ApiResponse<Inventory>> => {
      try {
        const result = await inventoryRepository.createForUser(userId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get inventory by user ID
   * IPC Channel: inventory:getByUser
   */
  ipcMain.handle(
    'inventory:getByUser',
    async (_event, userId: bigint): Promise<ApiResponse<Record<string, unknown> | null>> => {
      try {
        const inventory = await inventoryRepository.getByUserId(userId);
        return { success: true, data: inventory };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Add or update ingredient in inventory
   * IPC Channel: inventory:addOrUpdateIngredient
   */
  ipcMain.handle(
    'inventory:addOrUpdateIngredient',
    async (
      _event,
      data: { inventaireId: bigint; ingredientId: bigint; qtyGrams: number }
    ): Promise<ApiResponse<Record<string, unknown>>> => {
      try {
        const result = await inventoryRepository.addOrUpdateIngredient(
          data.inventaireId,
          data.ingredientId,
          data.qtyGrams
        );
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Remove ingredient from inventory
   * IPC Channel: inventory:removeIngredient
   */
  ipcMain.handle(
    'inventory:removeIngredient',
    async (
      _event,
      data: { inventaireId: bigint; ingredientId: bigint }
    ): Promise<ApiResponse<boolean>> => {
      try {
        await inventoryRepository.removeIngredient(data.inventaireId, data.ingredientId);
        return { success: true, data: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get all ingredients in inventory
   * IPC Channel: inventory:getIngredients
   */
  ipcMain.handle(
    'inventory:getIngredients',
    async (_event, inventaireId: bigint): Promise<ApiResponse<Record<string, unknown>[]>> => {
      try {
        const result = await inventoryRepository.getIngredients(inventaireId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Check if recipe can be made with current inventory
   * IPC Channel: inventory:canMakeRecipe
   */
  ipcMain.handle(
    'inventory:canMakeRecipe',
    async (_event, data: { inventaireId: bigint; recipeId: bigint }): Promise<ApiResponse<boolean>> => {
      try {
        const result = await inventoryRepository.canMakeRecipe(data.inventaireId, data.recipeId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Consume recipe ingredients from inventory
   * IPC Channel: inventory:consumeRecipe
   */
  ipcMain.handle(
    'inventory:consumeRecipe',
    async (
      _event,
      data: { inventaireId: bigint; recipeId: bigint }
    ): Promise<ApiResponse<boolean>> => {
      try {
        await inventoryRepository.consumeRecipe(data.inventaireId, data.recipeId);
        return { success: true, data: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get total nutrition value of inventory
   * IPC Channel: inventory:getTotalValue
   */
  ipcMain.handle(
    'inventory:getTotalValue',
    async (_event, inventaireId: bigint): Promise<ApiResponse<number>> => {
      try {
        const result = await inventoryRepository.getTotalValue(inventaireId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Get estimated nutrition of inventory
   * IPC Channel: inventory:getEstimatedNutrition
   */
  ipcMain.handle(
    'inventory:getEstimatedNutrition',
    async (_event, inventaireId: bigint): Promise<ApiResponse<Record<string, number>>> => {
      try {
        const result = await inventoryRepository.getEstimatedNutrition(inventaireId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  /**
   * Clear expired ingredients from inventory
   * IPC Channel: inventory:clearExpired
   */
  ipcMain.handle(
    'inventory:clearExpired',
    async (_event, data: { inventaireId: bigint; thresholdDays?: number }): Promise<ApiResponse<number>> => {
      try {
        const result = await inventoryRepository.clearExpired(data.inventaireId, data.thresholdDays);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );
}
