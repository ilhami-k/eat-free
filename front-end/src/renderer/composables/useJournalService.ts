import { ref, readonly } from 'vue'
import type Journal from '../../shared/journal'
import type IJournalService from '../../shared/interfaces/IJournalService'

interface UseJournalServiceOptions {
  onSuccess?: (entry: Journal) => void
  onError?: (error: Error) => void
}

export function useJournalService(service: IJournalService | undefined, options?: UseJournalServiceOptions) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const journalEntries = ref<Journal[]>([])

  if (!service) {
    throw new Error('Journal service is not available')
  }

  const fetchJournalEntries = async (
    userId: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<Journal[]> => {
    isLoading.value = true
    error.value = null

    try {
      journalEntries.value = await service.getJournalEntries(userId, startDate, endDate)
      return journalEntries.value
    } catch (err) {
      const error_obj = err instanceof Error ? err : new Error(String(err))
      error.value = error_obj
      options?.onError?.(error_obj)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getJournalEntryById = async (id: number): Promise<Journal | null> => {
    isLoading.value = true
    error.value = null

    try {
      const entry = await service.getJournalEntryById(id)
      return entry
    } catch (err) {
      const error_obj = err instanceof Error ? err : new Error(String(err))
      error.value = error_obj
      options?.onError?.(error_obj)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createJournalEntry = async (
    user_id: number,
    recipe_id: number,
    servings_eaten: number,
    kcal: number,
    protein_g: number,
    carbs_g: number,
    fat_g: number
  ): Promise<Journal | null> => {
    isLoading.value = true
    error.value = null

    try {
      const newEntry = await service.createJournalEntry(
        user_id,
        recipe_id,
        servings_eaten,
        kcal,
        protein_g,
        carbs_g,
        fat_g
      )
      options?.onSuccess?.(newEntry)
      return newEntry
    } catch (err) {
      const error_obj = err instanceof Error ? err : new Error(String(err))
      error.value = error_obj
      options?.onError?.(error_obj)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createJournalEntryWithTime = async (
    user_id: number,
    recipe_id: number,
    servings_eaten: number,
    kcal: number,
    protein_g: number,
    carbs_g: number,
    fat_g: number,
    logged_at: Date
  ): Promise<Journal | null> => {
    isLoading.value = true
    error.value = null

    try {
      const newEntry = await service.createJournalEntryWithTime(
        user_id,
        recipe_id,
        servings_eaten,
        kcal,
        protein_g,
        carbs_g,
        fat_g,
        logged_at
      )
      options?.onSuccess?.(newEntry)
      return newEntry
    } catch (err) {
      const error_obj = err instanceof Error ? err : new Error(String(err))
      error.value = error_obj
      options?.onError?.(error_obj)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateJournalEntry = async (
    id: number,
    data: {
      servings_eaten?: number
      kcal?: number
      protein_g?: number
      carbs_g?: number
      fat_g?: number
    }
  ): Promise<Journal | null> => {
    isLoading.value = true
    error.value = null

    try {
      const updatedEntry = await service.updateJournalEntry(id, data)
      options?.onSuccess?.(updatedEntry)
      return updatedEntry
    } catch (err) {
      const error_obj = err instanceof Error ? err : new Error(String(err))
      error.value = error_obj
      options?.onError?.(error_obj)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteJournalEntry = async (id: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      await service.deleteJournalEntry(id)
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

  const clearError = (): void => {
    error.value = null
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    journalEntries: readonly(journalEntries),

    fetchJournalEntries,
    getJournalEntryById,
    createJournalEntry,
    createJournalEntryWithTime,
    updateJournalEntry,
    deleteJournalEntry,
    clearError,
  }
}
