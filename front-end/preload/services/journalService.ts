/**
 * Journal Service
 * Preload service wrapper for food journal operations
 */

import { ipcRenderer } from 'electron';
import type { ApiResponse, JournalEntry, LogMealRequest, JournalListResponse } from '../../src/shared/types';

export const journalService = {
  logMeal: (data: LogMealRequest): Promise<ApiResponse<JournalEntry>> =>
    ipcRenderer.invoke('journal:logMeal', data),

  getById: (id: bigint): Promise<ApiResponse<JournalEntry | null>> =>
    ipcRenderer.invoke('journal:getById', id),

  getByUser: (userId: bigint): Promise<ApiResponse<JournalEntry[]>> =>
    ipcRenderer.invoke('journal:getByUser', userId),

  getByDateRange: (userId: bigint, startDate: Date, endDate: Date): Promise<ApiResponse<JournalEntry[]>> =>
    ipcRenderer.invoke('journal:getByDateRange', { userId, startDate, endDate }),

  getDailyNutrition: (userId: bigint, date: Date): Promise<ApiResponse<Record<string, number>>> =>
    ipcRenderer.invoke('journal:getDailyNutrition', { userId, date }),

  getAverageDailyNutrition: (userId: bigint, days?: number): Promise<ApiResponse<Record<string, number>>> =>
    ipcRenderer.invoke('journal:getAverageDailyNutrition', { userId, days }),

  delete: (id: bigint): Promise<ApiResponse<boolean>> =>
    ipcRenderer.invoke('journal:delete', id),

  count: (): Promise<ApiResponse<number>> =>
    ipcRenderer.invoke('journal:count'),

  countByUser: (userId: bigint): Promise<ApiResponse<number>> =>
    ipcRenderer.invoke('journal:countByUser', userId),

  getMostLoggedRecipes: (userId: bigint, limit?: number): Promise<ApiResponse<unknown[]>> =>
    ipcRenderer.invoke('journal:getMostLoggedRecipes', { userId, limit }),
};
