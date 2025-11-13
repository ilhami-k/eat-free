import { ref, readonly } from 'vue'
import type User from '../../shared/user'
import type IUserService from '../../shared/interfaces/IUserService'

interface UseUserServiceOptions {
  onSuccess?: (user: User) => void
  onError?: (error: Error) => void
}

/**
 * Composable for managing user operations with loading and error states
 */
export function useUserService(service: IUserService, options?: UseUserServiceOptions) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)

  /**
   * Create a new user
   */
  const createUser = async (name: string, email: string): Promise<User | null> => {
    isLoading.value = true
    error.value = null

    try {
      const newUser = await service.createUser(email, name)
      currentUser.value = newUser
      await fetchUsers()
      options?.onSuccess?.(newUser)
      return newUser
    } catch (err) {
      const error_obj = err instanceof Error ? err : new Error(String(err))
      error.value = error_obj
      options?.onError?.(error_obj)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch all users
   */
  const fetchUsers = async (): Promise<User[]> => {
    isLoading.value = true
    error.value = null

    try {
      users.value = await service.getUsers()
      return users.value
    } catch (err) {
      const error_obj = err instanceof Error ? err : new Error(String(err))
      error.value = error_obj
      options?.onError?.(error_obj)
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get a user by ID
   */
  const getUserById = async (id: number): Promise<User | null> => {
    isLoading.value = true
    error.value = null

    try {
      const user = await service.getUserById(id)
      return user
    } catch (err) {
      const error_obj = err instanceof Error ? err : new Error(String(err))
      error.value = error_obj
      options?.onError?.(error_obj)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update a user
   */
  const updateUser = async (
    id: number,
    data: { email?: string; name?: string }
  ): Promise<User | null> => {
    isLoading.value = true
    error.value = null

    try {
      const updatedUser = await service.updateUser(id, data)
      if (currentUser.value?.id === id) {
        currentUser.value = updatedUser
      }
      await fetchUsers()
      options?.onSuccess?.(updatedUser)
      return updatedUser
    } catch (err) {
      const error_obj = err instanceof Error ? err : new Error(String(err))
      error.value = error_obj
      options?.onError?.(error_obj)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete a user
   */
  const deleteUser = async (id: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      await service.deleteUser(id)
      if (currentUser.value?.id === id) {
        currentUser.value = null
      }
      await fetchUsers()
      return true
    } catch (err) {
      const error_obj = err instanceof Error ? err : new Error(String(err))
      error.value = error_obj
      options?.onError?.(error_obj)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Set the current user
   */
  const setCurrentUser = (user: User): void => {
    currentUser.value = user
  }

  /**
   * Clear the current user
   */
  const clearCurrentUser = (): void => {
    currentUser.value = null
  }

  /**
   * Clear error state
   */
  const clearError = (): void => {
    error.value = null
  }

  return {
    // State (read-only)
    isLoading: readonly(isLoading),
    error: readonly(error),
    users: readonly(users),
    currentUser: readonly(currentUser),

    // Actions
    createUser,
    fetchUsers,
    getUserById,
    updateUser,
    deleteUser,
    setCurrentUser,
    clearCurrentUser,
    clearError,
  }
}
