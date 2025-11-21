import { reactive, readonly, computed } from 'vue'
import type Inventory from '../../shared/inventory'
import type { InventoryIngredientWithDetails } from './useInventoryService'

interface InventoryState {
  inventory: Inventory | null
  inventoryIngredients: InventoryIngredientWithDetails[]
  isLoading: boolean
  error: Error | null
}

// Global state - shared across all components
const state = reactive<InventoryState>({
  inventory: null,
  inventoryIngredients: [],
  isLoading: false,
  error: null,
})

export function useInventoryStore() {
  // Computed values
  const inventoryCount = computed(() => state.inventoryIngredients.length)
  
  const hasInventory = computed(() => state.inventory !== null)

  // Mutations
  const setInventory = (inventory: Inventory | null) => {
    state.inventory = inventory
  }

  const setInventoryIngredients = (ingredients: InventoryIngredientWithDetails[]) => {
    state.inventoryIngredients = ingredients
  }

  const setLoading = (loading: boolean) => {
    state.isLoading = loading
  }

  const setError = (error: Error | null) => {
    state.error = error
  }

  const clearError = () => {
    state.error = null
  }

  const reset = () => {
    state.inventory = null
    state.inventoryIngredients = []
    state.isLoading = false
    state.error = null
  }

  return {
    // Read-only state
    inventory: readonly(computed(() => state.inventory)),
    inventoryIngredients: readonly(computed(() => state.inventoryIngredients)),
    isLoading: readonly(computed(() => state.isLoading)),
    error: readonly(computed(() => state.error)),
    
    // Computed
    inventoryCount,
    hasInventory,
    
    // Actions
    setInventory,
    setInventoryIngredients,
    setLoading,
    setError,
    clearError,
    reset,
  }
}
