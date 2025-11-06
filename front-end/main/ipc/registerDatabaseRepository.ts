/**
 * Database Repository IPC Handler Registration
 */

import { ipcMain } from 'electron';
import { databaseRepository } from '../repositories/databaseRepository';
import type { ApiResponse, DatabaseStats } from '../../src/shared/types';

export function registerDatabaseRepository(): void {
  ipcMain.handle(
    'database:healthCheck',
    async (): Promise<ApiResponse<boolean>> => {
      try {
        const result = await databaseRepository.healthCheck();
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'database:getStats',
    async (): Promise<ApiResponse<DatabaseStats>> => {
      try {
        const result = await databaseRepository.getStats();
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'database:backup',
    async (): Promise<ApiResponse<Record<string, unknown>>> => {
      try {
        const result = await databaseRepository.backup();
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'database:getTableStats',
    async (): Promise<ApiResponse<Record<string, unknown>>> => {
      try {
        const result = await databaseRepository.getTableStats();
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'database:clearAllData',
    async (): Promise<ApiResponse<boolean>> => {
      try {
        await databaseRepository.clearAllData();
        return { success: true, data: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );

  ipcMain.handle(
    'database:disconnect',
    async (): Promise<ApiResponse<boolean>> => {
      try {
        await databaseRepository.disconnect();
        return { success: true, data: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
      }
    }
  );
}
