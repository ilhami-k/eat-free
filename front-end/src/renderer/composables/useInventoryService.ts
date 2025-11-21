import type IInventoryService from '../../shared/interfaces/IInventoryService'
import type { InventoryIngredient } from '../../shared/inventory'
import { useInventoryStore } from './useInventoryStore'

export interface InventoryIngredientWithDetails {
  inventory_id: number
  ingredient_id: number
  ingredient_name: string
  qty_grams: number
  kcal_per_100g: number
  protein_g_per_100g: number
  carbs_g_per_100g: number
  fat_g_per_100g: number
}

export function useInventoryService(service: IInventoryService) {
  const store = useInventoryStore()

  const mapInventoryEntries = (items: InventoryIngredient[] | undefined): InventoryIngredientWithDetails[] => {
    if (!items) return []

    return items
      .map((item) => {
        const ingredientData = item.ingredients

        return {
          inventory_id: item.inventory_id,
          ingredient_id: item.ingredient_id,
          ingredient_name: ingredientData?.name || `Ingredient ${item.ingredient_id}`,
          qty_grams: item.qty_grams,
          kcal_per_100g: ingredientData?.kcal_per_100g || 0,
          protein_g_per_100g: ingredientData?.protein_g_per_100g || 0,
          carbs_g_per_100g: ingredientData?.carbs_g_per_100g || 0,
          fat_g_per_100g: ingredientData?.fat_g_per_100g || 0,
        }
      })
      .filter(item => item.qty_grams > 0) // Only show items with positive quantities
  }

  const getOrCreateInventory = async (userId: number) => {
    store.setLoading(true)
    store.clearError()
    try {
      // First try to get existing inventory
      let userInventory = await service.getInventoryByUserId(userId)

      // If no inventory exists, create one
      if (!userInventory) {
        userInventory = await service.createInventory(userId)
      }

      store.setInventory(userInventory)
      store.setInventoryIngredients(mapInventoryEntries(userInventory.inventory_ingredient))
      return userInventory
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get/create inventory')
      store.setError(error)
      console.error('Error getting/creating inventory:', err)
      throw error
    } finally {
      store.setLoading(false)
    }
  }

  const addIngredient = async (inventoryId: number, ingredientId: number, qtyGrams: number) => {
    store.setLoading(true)
    store.clearError()
    try {
      await service.addIngredientToInventory(inventoryId, ingredientId, qtyGrams)

      // Refresh inventory
      const updated = await service.getInventoryById(inventoryId)
      if (updated) {
        store.setInventory(updated)
        store.setInventoryIngredients(mapInventoryEntries(updated.inventory_ingredient))
      }

      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add ingredient')
      store.setError(error)
      console.error('Error adding ingredient:', err)
      throw error
    } finally {
      store.setLoading(false)
    }
  }

  const updateIngredient = async (
    inventoryId: number,
    ingredientId: number,
    qtyGrams: number
  ) => {
    store.setLoading(true)
    store.clearError()
    try {
      await service.updateIngredientInInventory(inventoryId, ingredientId, qtyGrams)

      // Refresh inventory
      const updated = await service.getInventoryById(inventoryId)
      if (updated) {
        store.setInventory(updated)
        store.setInventoryIngredients(mapInventoryEntries(updated.inventory_ingredient))
      }

      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update ingredient')
      store.setError(error)
      console.error('Error updating ingredient:', err)
      throw error
    } finally {
      store.setLoading(false)
    }
  }

  const removeIngredient = async (inventoryId: number, ingredientId: number) => {
    store.setLoading(true)
    store.clearError()
    try {
      await service.removeIngredientFromInventory(inventoryId, ingredientId)

      // Refresh inventory
      const updated = await service.getInventoryById(inventoryId)
      if (updated) {
        store.setInventory(updated)
        store.setInventoryIngredients(mapInventoryEntries(updated.inventory_ingredient))
      }

      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove ingredient')
      store.setError(error)
      console.error('Error removing ingredient:', err)
      throw error
    } finally {
      store.setLoading(false)
    }
  }

  const searchIngredients = (query: string) => {
    const ingredients = store.inventoryIngredients.value
    if (!query.trim()) {
      return ingredients
    }

    return ingredients.filter(item =>
      item.ingredient_name.toLowerCase().includes(query.toLowerCase())
    )
  }

  return {
    isLoading: store.isLoading,
    error: store.error,
    inventory: store.inventory,
    inventoryIngredients: store.inventoryIngredients,
    getOrCreateInventory,
    addIngredient,
    updateIngredient,
    removeIngredient,
    searchIngredients,
    clearError: store.clearError,
  }
}
