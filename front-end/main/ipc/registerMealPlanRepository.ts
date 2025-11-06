/**
 * Meal Plan Repository IPC Handler Registration
 */

import { ipcMain } from 'electron';
import { mealPlanRepository } from '../repositories/mealPlanRepository';
import type {
  ApiResponse,
  MealPlan,
  CreateMealPlanRequest,
  AddRecipeToMealPlanRequest,
} from '../../src/shared/types';

export function registerMealPlanRepository(): void {
  ipcMain.handle(
    'mealplan:create',
    async (_event, data: CreateMealPlanRequest): Promise<ApiResponse<MealPlan>> => {
      try {
        const result = await mealPlanRepository.create(data.userId, data.weekStartDate);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:getById',
    async (_event, id: bigint): Promise<ApiResponse<MealPlan | null>> => {
      try {
        const result = await mealPlanRepository.getById(id);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:getByUser',
    async (_event, userId: bigint): Promise<ApiResponse<MealPlan[]>> => {
      try {
        const result = await mealPlanRepository.getByUser(userId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:getCurrentWeek',
    async (_event, userId: bigint): Promise<ApiResponse<Record<string, unknown> | null>> => {
      try {
        const result = await mealPlanRepository.getCurrentWeek(userId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:addMeal',
    async (_event, data: AddRecipeToMealPlanRequest): Promise<ApiResponse<Record<string, unknown>>> => {
      try {
        const result = await mealPlanRepository.addMeal(
          data.planId,
          data.recipeId,
          new Date(data.date),
          data.mealType,
          data.plannedServings
        );
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:removeMeal',
    async (_event, mealId: bigint): Promise<ApiResponse<boolean>> => {
      try {
        await mealPlanRepository.removeMeal(mealId);
        return { success: true, data: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:updateMeal',
    async (_event, data: { mealId: bigint; plannedServings: number }): Promise<ApiResponse<Record<string, unknown>>> => {
      try {
        const result = await mealPlanRepository.updateMeal(data.mealId, data.plannedServings);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:getMealsForDate',
    async (_event, data: { planId: bigint; date: Date }): Promise<ApiResponse<Record<string, unknown>[]>> => {
      try {
        const result = await mealPlanRepository.getMealsForDate(data.planId, data.date);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:getDayNutrition',
    async (_event, data: { planId: bigint; date: Date }): Promise<ApiResponse<Record<string, number>>> => {
      try {
        const result = await mealPlanRepository.getDayNutrition(data.planId, data.date);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:getWeekNutrition',
    async (_event, planId: bigint): Promise<ApiResponse<Record<string, unknown>>> => {
      try {
        const result = await mealPlanRepository.getWeekNutrition(planId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:getMealsForMealType',
    async (
      _event,
      data: { planId: bigint; mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' }
    ): Promise<ApiResponse<Record<string, unknown>[]>> => {
      try {
        const result = await mealPlanRepository.getMealsForMealType(data.planId, data.mealType);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:count',
    async (): Promise<ApiResponse<number>> => {
      try {
        const result = await mealPlanRepository.count();
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'mealplan:delete',
    async (_event, id: bigint): Promise<ApiResponse<boolean>> => {
      try {
        await mealPlanRepository.delete(id);
        return { success: true, data: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );
}
