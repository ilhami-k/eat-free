/**
 * Register User Repository IPC Handlers
 * Maps IPC channels to UserRepository methods
 */

import { ipcMain } from 'electron';
import { userRepository } from '../userRepository';
import type { ApiResponse } from '../../shared/types';

export function registerUserRepository() {
  // User CRUD operations
  ipcMain.handle('user:create', async (_event, data) => {
    try {
      const result = await userRepository.create(data);
      return { success: true, data: result } as ApiResponse<any>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<any>;
    }
  });

  ipcMain.handle('user:getById', async (_event, id) => {
    try {
      const result = await userRepository.getById(BigInt(id));
      return { success: true, data: result } as ApiResponse<any>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<any>;
    }
  });

  ipcMain.handle('user:getByEmail', async (_event, email) => {
    try {
      const result = await userRepository.getByEmail(email);
      return { success: true, data: result } as ApiResponse<any>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<any>;
    }
  });

  ipcMain.handle('user:getAll', async () => {
    try {
      const result = await userRepository.getAll();
      return { success: true, data: result } as ApiResponse<any>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<any>;
    }
  });

  ipcMain.handle('user:update', async (_event, data) => {
    try {
      const result = await userRepository.update({
        ...data,
        id: BigInt(data.id),
      });
      return { success: true, data: result } as ApiResponse<any>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<any>;
    }
  });

  ipcMain.handle('user:delete', async (_event, id) => {
    try {
      await userRepository.deleteUser(BigInt(id));
      return { success: true, data: undefined } as ApiResponse<any>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<any>;
    }
  });

  ipcMain.handle('user:count', async () => {
    try {
      const result = await userRepository.count();
      return { success: true, data: result } as ApiResponse<any>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<any>;
    }
  });

  ipcMain.handle('user:getWithRelations', async (_event, id) => {
    try {
      const result = await userRepository.getWithRelations(BigInt(id));
      return { success: true, data: result } as ApiResponse<any>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<any>;
    }
  });

  console.log('[IPC] User repository handlers registered');
}
