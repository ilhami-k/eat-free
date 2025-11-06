/**
 * Database Service
 * IPC wrapper for database repository operations
 */

import { ipcRenderer } from 'electron';
import type { ApiResponse, DatabaseStats } from '../../shared/types';

export const databaseService = {
  healthCheck: (): Promise<ApiResponse<boolean>> =>
    ipcRenderer.invoke('database:healthCheck'),

  getStats: (): Promise<ApiResponse<DatabaseStats>> =>
    ipcRenderer.invoke('database:getStats'),

  backup: (): Promise<ApiResponse<any>> =>
    ipcRenderer.invoke('database:backup'),

  getTableStats: (): Promise<ApiResponse<any>> =>
    ipcRenderer.invoke('database:getTableStats'),

  clearAllData: (): Promise<ApiResponse<void>> =>
    ipcRenderer.invoke('database:clearAllData'),

  disconnect: (): Promise<ApiResponse<void>> =>
    ipcRenderer.invoke('database:disconnect'),
};
