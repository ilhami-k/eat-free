/**
 * User Service
 * IPC wrapper for user repository operations
 */

import { ipcRenderer } from 'electron';
import type { User, CreateUserRequest, UpdateUserRequest, ApiResponse } from '../../shared/types';

export const userService = {
  create: (data: CreateUserRequest): Promise<ApiResponse<User>> =>
    ipcRenderer.invoke('user:create', data),

  getById: (id: bigint): Promise<ApiResponse<User | null>> =>
    ipcRenderer.invoke('user:getById', id),

  getByEmail: (email: string): Promise<ApiResponse<User | null>> =>
    ipcRenderer.invoke('user:getByEmail', email),

  getAll: (): Promise<ApiResponse<User[]>> =>
    ipcRenderer.invoke('user:getAll'),

  update: (data: UpdateUserRequest): Promise<ApiResponse<User>> =>
    ipcRenderer.invoke('user:update', data),

  delete: (id: bigint): Promise<ApiResponse<void>> =>
    ipcRenderer.invoke('user:delete', id),

  count: (): Promise<ApiResponse<number>> =>
    ipcRenderer.invoke('user:count'),

  getWithRelations: (id: bigint): Promise<ApiResponse<any>> =>
    ipcRenderer.invoke('user:getWithRelations', id),
};
