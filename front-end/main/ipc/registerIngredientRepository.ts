/**
 * Ingredient Repository IPC Handler Registration
 */

import { ipcMain } from 'electron';
import { ingredientRepository } from '../repositories/ingredientRepository';
import type { ApiResponse, Ingredient, CreateIngredientRequest, NutritionRange } from '../../src/shared/types';

export function registerIngredientRepository(): void {
  ipcMain.handle(
    'ingredient:create',
    async (_event, data: CreateIngredientRequest): Promise<ApiResponse<Ingredient>> => {
      try {
        const result = await ingredientRepository.create(data);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'ingredient:search',
    async (_event, query: string): Promise<ApiResponse<Ingredient[]>> => {
      try {
        const result = await ingredientRepository.search(query);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'ingredient:getById',
    async (_event, id: bigint): Promise<ApiResponse<Ingredient | null>> => {
      try {
        const result = await ingredientRepository.getById(id);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'ingredient:getAll',
    async (): Promise<ApiResponse<Ingredient[]>> => {
      try {
        const result = await ingredientRepository.getAll();
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'ingredient:getByNutritionRange',
    async (
      _event,
      data: NutritionRange
    ): Promise<ApiResponse<Ingredient[]>> => {
      try {
        const result = await ingredientRepository.getByNutritionRange(
          data.minKcal,
          data.maxKcal,
          data.minProtein,
          data.maxProtein
        );
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'ingredient:getHighProtein',
    async (_event, minProtein = 15): Promise<ApiResponse<Ingredient[]>> => {
      try {
        const result = await ingredientRepository.getHighProteinIngredients(minProtein);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'ingredient:getLowCalorie',
    async (_event, maxKcal = 100): Promise<ApiResponse<Ingredient[]>> => {
      try {
        const result = await ingredientRepository.getLowCalorieIngredients(maxKcal);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'ingredient:getWithUsageCount',
    async (): Promise<ApiResponse<unknown[]>> => {
      try {
        const result = await ingredientRepository.getWithUsageCount();
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'ingredient:count',
    async (): Promise<ApiResponse<number>> => {
      try {
        const result = await ingredientRepository.count();
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'ingredient:update',
    async (
      _event,
      data: { id: bigint; updateData: Partial<CreateIngredientRequest> }
    ): Promise<ApiResponse<Ingredient>> => {
      try {
        const result = await ingredientRepository.update(data.id, data.updateData);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'ingredient:delete',
    async (_event, id: bigint): Promise<ApiResponse<boolean>> => {
      try {
        await ingredientRepository.delete(id);
        return { success: true, data: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );
}
