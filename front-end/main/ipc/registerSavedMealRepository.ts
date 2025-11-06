/**
 * Saved Meal Repository IPC Handler Registration
 */

import { ipcMain } from 'electron';
import { savedMealRepository } from '../repositories/savedMealRepository';
import type { ApiResponse, SavedMeal, CreateSavedMealRequest } from '../../src/shared/types';

export function registerSavedMealRepository(): void {
  ipcMain.handle(
    'savedmeal:create',
    async (
      _event,
      data: { userId: bigint; name: string; recipeId: bigint; defaultServings?: number }
    ): Promise<ApiResponse<SavedMeal>> => {
      try {
        const result = await savedMealRepository.create(
          data.userId,
          data.name,
          data.recipeId,
          data.defaultServings
        );
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'savedmeal:getById',
    async (_event, id: bigint): Promise<ApiResponse<SavedMeal | null>> => {
      try {
        const result = await savedMealRepository.getById(id);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'savedmeal:getByUser',
    async (_event, userId: bigint): Promise<ApiResponse<SavedMeal[]>> => {
      try {
        const result = await savedMealRepository.getByUser(userId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'savedmeal:update',
    async (
      _event,
      data: { id: bigint; name?: string; defaultServings?: number }
    ): Promise<ApiResponse<SavedMeal>> => {
      try {
        const result = await savedMealRepository.update(data.id, data.name, data.defaultServings);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'savedmeal:delete',
    async (_event, id: bigint): Promise<ApiResponse<boolean>> => {
      try {
        await savedMealRepository.delete(id);
        return { success: true, data: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'savedmeal:quickLog',
    async (
      _event,
      data: { userId: bigint; savedMealId: bigint; servings?: number }
    ): Promise<ApiResponse<Record<string, unknown>>> => {
      try {
        const result = await savedMealRepository.quickLog(data.userId, data.savedMealId, data.servings);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'savedmeal:getDefaultNutrition',
    async (_event, savedMealId: bigint): Promise<ApiResponse<Record<string, number>>> => {
      try {
        const result = await savedMealRepository.getDefaultNutrition(savedMealId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'savedmeal:getMostUsed',
    async (_event, data: { userId: bigint; limit?: number }): Promise<ApiResponse<unknown[]>> => {
      try {
        const result = await savedMealRepository.getMostUsed(data.userId, data.limit);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'savedmeal:count',
    async (): Promise<ApiResponse<number>> => {
      try {
        const result = await savedMealRepository.count();
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'savedmeal:countByUser',
    async (_event, userId: bigint): Promise<ApiResponse<number>> => {
      try {
        const result = await savedMealRepository.countByUser(userId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );
}
