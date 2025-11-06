/**
 * Journal Repository IPC Handler Registration
 */

import { ipcMain } from 'electron';
import { journalRepository } from '../repositories/journalRepository';
import type { ApiResponse, JournalEntry, LogMealRequest } from '../../src/shared/types';

export function registerJournalRepository(): void {
  ipcMain.handle(
    'journal:logMeal',
    async (_event, data: LogMealRequest): Promise<ApiResponse<JournalEntry>> => {
      try {
        const result = await journalRepository.logMeal(data);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'journal:getById',
    async (_event, id: bigint): Promise<ApiResponse<JournalEntry | null>> => {
      try {
        const result = await journalRepository.getById(id);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'journal:getByUser',
    async (_event, userId: bigint): Promise<ApiResponse<JournalEntry[]>> => {
      try {
        const result = await journalRepository.getByUser(userId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'journal:getByDateRange',
    async (
      _event,
      data: { userId: bigint; startDate: Date; endDate: Date }
    ): Promise<ApiResponse<JournalEntry[]>> => {
      try {
        const result = await journalRepository.getByDateRange(data.userId, data.startDate, data.endDate);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'journal:getDailyNutrition',
    async (_event, data: { userId: bigint; date: Date }): Promise<ApiResponse<Record<string, number>>> => {
      try {
        const result = await journalRepository.getDailyNutrition(data.userId, data.date);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'journal:getAverageDailyNutrition',
    async (_event, data: { userId: bigint; days?: number }): Promise<ApiResponse<Record<string, number>>> => {
      try {
        const result = await journalRepository.getAverageDailyNutrition(data.userId, data.days);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'journal:delete',
    async (_event, id: bigint): Promise<ApiResponse<boolean>> => {
      try {
        await journalRepository.delete(id);
        return { success: true, data: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'journal:count',
    async (): Promise<ApiResponse<number>> => {
      try {
        const result = await journalRepository.count();
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'journal:countByUser',
    async (_event, userId: bigint): Promise<ApiResponse<number>> => {
      try {
        const result = await journalRepository.countByUser(userId);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'journal:getMostLoggedRecipes',
    async (_event, data: { userId: bigint; limit?: number }): Promise<ApiResponse<unknown[]>> => {
      try {
        const result = await journalRepository.getMostLoggedRecipes(data.userId, data.limit);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );
}
