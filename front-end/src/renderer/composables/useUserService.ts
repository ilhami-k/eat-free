import { ref, readonly } from 'vue'
import type User from '../../shared/user'
import type IUserService from '../../shared/interfaces/IUserService'

interface UseUserServiceOptions {
  onSuccess?: (user: User) => void
  onError?: (error: Error) => void
}

export function useUserService(service: IUserService, options?: UseUserServiceOptions) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)

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

  const setCurrentUser = (user: User): void => {
    currentUser.value = user
  }

  const clearCurrentUser = (): void => {
    currentUser.value = null
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    users: readonly(users),
    currentUser: readonly(currentUser),

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
