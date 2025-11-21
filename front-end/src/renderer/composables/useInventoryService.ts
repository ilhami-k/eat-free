import { ref, readonly } from 'vue'
import type IInventoryService from '../../shared/interfaces/IInventoryService'
import type Inventory from '../../shared/inventory'

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
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const inventory = ref<Inventory | null>(null)
  const inventoryIngredients = ref<InventoryIngredientWithDetails[]>([])

  const mapInventoryEntries = (items: Record<string, unknown>[] | undefined) => {
    if (!items) return [] as InventoryIngredientWithDetails[]

    return items
      .map((it: Record<string, unknown>) => {
        // Extract ingredient data if it's nested in the ingredients property
        const ingredientsData = (it.ingredients as Record<string, unknown> | undefined) || {}

        return {
          inventory_id: it.inventory_id as number,
          ingredient_id: it.ingredient_id as number,
          ingredient_name: (ingredientsData.name as string) || (it.ingredient_name as string) || `Ingredient ${String(it.ingredient_id)}`,
          qty_grams: (it.qty_grams as number) || 0,
          kcal_per_100g: (ingredientsData.kcal_per_100g as number) || (it.kcal_per_100g as number) || 0,
          protein_g_per_100g: (ingredientsData.protein_g_per_100g as number) || (it.protein_g_per_100g as number) || 0,
          carbs_g_per_100g: (ingredientsData.carbs_g_per_100g as number) || (it.carbs_g_per_100g as number) || 0,
          fat_g_per_100g: (ingredientsData.fat_g_per_100g as number) || (it.fat_g_per_100g as number) || 0,
        } as InventoryIngredientWithDetails
      })
      .filter(item => item.qty_grams > 0) // Only show items with positive quantities
  }

  const getOrCreateInventory = async (userId: number) => {
    isLoading.value = true
    error.value = null
    try {
      // First try to get existing inventory
      let userInventory = await service.getInventoryByUserId(userId)

      // If no inventory exists, create one
      if (!userInventory) {
        userInventory = await service.createInventory(userId)
      }

  inventory.value = userInventory
  // Map inventory_ingredient entries to a consistent shape (pulling ingredients.name if joined)
  inventoryIngredients.value = mapInventoryEntries(userInventory.inventory_ingredient as unknown as Record<string, unknown>[])
      return userInventory
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to get/create inventory')
      console.error('Error getting/creating inventory:', err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const addIngredient = async (inventoryId: number, ingredientId: number, qtyGrams: number) => {
    isLoading.value = true
    error.value = null
    try {
      await service.addIngredientToInventory(inventoryId, ingredientId, qtyGrams)

      // Refresh inventory
      if (inventory.value) {
        const updated = await service.getInventoryById(inventoryId)
        inventory.value = updated
        inventoryIngredients.value = mapInventoryEntries(updated?.inventory_ingredient as unknown as Record<string, unknown>[])
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to add ingredient')
      console.error('Error adding ingredient:', err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const updateIngredient = async (
    inventoryId: number,
    ingredientId: number,
    qtyGrams: number
  ) => {
    isLoading.value = true
    error.value = null
    try {
      await service.updateIngredientInInventory(inventoryId, ingredientId, qtyGrams)

      // Refresh inventory
      if (inventory.value) {
        const updated = await service.getInventoryById(inventoryId)
        inventory.value = updated
        inventoryIngredients.value = mapInventoryEntries(updated?.inventory_ingredient as unknown as Record<string, unknown>[])
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to update ingredient')
      console.error('Error updating ingredient:', err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const removeIngredient = async (inventoryId: number, ingredientId: number) => {
    isLoading.value = true
    error.value = null
    try {
      await service.removeIngredientFromInventory(inventoryId, ingredientId)

      // Refresh inventory
      if (inventory.value) {
        const updated = await service.getInventoryById(inventoryId)
        inventory.value = updated
        inventoryIngredients.value = mapInventoryEntries(updated?.inventory_ingredient as unknown as Record<string, unknown>[])
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to remove ingredient')
      console.error('Error removing ingredient:', err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const searchIngredients = (query: string) => {
    if (!query.trim()) {
      return inventoryIngredients.value || []
    }

    return (inventoryIngredients.value || []).filter(item =>
      item.ingredient_name.toLowerCase().includes(query.toLowerCase())
    )
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    inventory: readonly(inventory),
    inventoryIngredients: readonly(inventoryIngredients),
    getOrCreateInventory,
    addIngredient,
    updateIngredient,
    removeIngredient,
    searchIngredients,
    clearError,
  }
}
