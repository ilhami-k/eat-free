import { describe, it, expect, beforeEach } from 'vitest'
import { useInventoryStore } from '../useInventoryStore'
import type Inventory from '../../../shared/inventory'
import type { InventoryIngredientWithDetails } from '../useInventoryService'

describe('useInventoryStore', () => {
  let store: ReturnType<typeof useInventoryStore>

  beforeEach(() => {
    // Reset store before each test
    store = useInventoryStore()
    store.reset()
  })

  describe('Initial State', () => {
    it('should have null inventory initially', () => {
      expect(store.inventory.value).toBeNull()
    })

    it('should have empty inventory ingredients initially', () => {
      expect(store.inventoryIngredients.value).toEqual([])
    })

    it('should not be loading initially', () => {
      expect(store.isLoading.value).toBe(false)
    })

    it('should have no error initially', () => {
      expect(store.error.value).toBeNull()
    })

    it('should have inventory count of 0 initially', () => {
      expect(store.inventoryCount.value).toBe(0)
    })

    it('should not have inventory initially', () => {
      expect(store.hasInventory.value).toBe(false)
    })
  })

  describe('setInventory', () => {
    it('should set inventory correctly', () => {
      const mockInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01T00:00:00.000Z',
        inventory_ingredient: [],
      }

      store.setInventory(mockInventory)
      expect(store.inventory.value).toEqual(mockInventory)
      expect(store.hasInventory.value).toBe(true)
    })

    it('should allow setting inventory to null', () => {
      const mockInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01T00:00:00.000Z',
        inventory_ingredient: [],
      }

      store.setInventory(mockInventory)
      expect(store.inventory.value).toEqual(mockInventory)

      store.setInventory(null)
      expect(store.inventory.value).toBeNull()
      expect(store.hasInventory.value).toBe(false)
    })
  })

  describe('setInventoryIngredients', () => {
    it('should set inventory ingredients correctly', () => {
      const mockIngredients: InventoryIngredientWithDetails[] = [
        {
          inventory_id: 1,
          ingredient_id: 1,
          qty_grams: 100,
          ingredient: {
            id: 1,
            name: 'Chicken Breast',
            kcal_per_100g: 165,
            protein_g_per_100g: 31,
            carbs_g_per_100g: 0,
            fat_g_per_100g: 3.6,
            created_at: '2025-01-01T00:00:00.000Z',
          },
        },
        {
          inventory_id: 1,
          ingredient_id: 2,
          qty_grams: 200,
          ingredient: {
            id: 2,
            name: 'Rice',
            kcal_per_100g: 130,
            protein_g_per_100g: 2.7,
            carbs_g_per_100g: 28,
            fat_g_per_100g: 0.3,
            created_at: '2025-01-01T00:00:00.000Z',
          },
        },
      ]

      store.setInventoryIngredients(mockIngredients)
      expect(store.inventoryIngredients.value).toEqual(mockIngredients)
      expect(store.inventoryCount.value).toBe(2)
    })

    it('should update inventory count when ingredients change', () => {
      expect(store.inventoryCount.value).toBe(0)

      store.setInventoryIngredients([
        {
          inventory_id: 1,
          ingredient_id: 1,
          qty_grams: 100,
          ingredient: {
            id: 1,
            name: 'Test',
            kcal_per_100g: 100,
            protein_g_per_100g: 10,
            carbs_g_per_100g: 10,
            fat_g_per_100g: 10,
            created_at: '2025-01-01T00:00:00.000Z',
          },
        },
      ])
      expect(store.inventoryCount.value).toBe(1)
    })
  })

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      store.setLoading(true)
      expect(store.isLoading.value).toBe(true)
    })

    it('should set loading state to false', () => {
      store.setLoading(true)
      store.setLoading(false)
      expect(store.isLoading.value).toBe(false)
    })
  })

  describe('setError', () => {
    it('should set error correctly', () => {
      const mockError = new Error('Test error')
      store.setError(mockError)
      expect(store.error.value).toEqual(mockError)
    })

    it('should allow setting error to null', () => {
      const mockError = new Error('Test error')
      store.setError(mockError)
      expect(store.error.value).toEqual(mockError)

      store.setError(null)
      expect(store.error.value).toBeNull()
    })
  })

  describe('clearError', () => {
    it('should clear error', () => {
      const mockError = new Error('Test error')
      store.setError(mockError)
      expect(store.error.value).toEqual(mockError)

      store.clearError()
      expect(store.error.value).toBeNull()
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      // Set up some state
      const mockInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01T00:00:00.000Z',
        inventory_ingredient: [],
      }
      const mockIngredients: InventoryIngredientWithDetails[] = [
        {
          inventory_id: 1,
          ingredient_id: 1,
          qty_grams: 100,
          ingredient: {
            id: 1,
            name: 'Test',
            kcal_per_100g: 100,
            protein_g_per_100g: 10,
            carbs_g_per_100g: 10,
            fat_g_per_100g: 10,
            created_at: '2025-01-01T00:00:00.000Z',
          },
        },
      ]
      const mockError = new Error('Test error')

      store.setInventory(mockInventory)
      store.setInventoryIngredients(mockIngredients)
      store.setLoading(true)
      store.setError(mockError)

      // Verify state is set
      expect(store.inventory.value).toEqual(mockInventory)
      expect(store.inventoryIngredients.value).toEqual(mockIngredients)
      expect(store.isLoading.value).toBe(true)
      expect(store.error.value).toEqual(mockError)

      // Reset
      store.reset()

      // Verify all state is reset
      expect(store.inventory.value).toBeNull()
      expect(store.inventoryIngredients.value).toEqual([])
      expect(store.isLoading.value).toBe(false)
      expect(store.error.value).toBeNull()
    })
  })

  describe('Computed Properties', () => {
    it('inventoryCount should react to changes', () => {
      expect(store.inventoryCount.value).toBe(0)

      const ingredients: InventoryIngredientWithDetails[] = [
        {
          inventory_id: 1,
          ingredient_id: 1,
          qty_grams: 100,
          ingredient: {
            id: 1,
            name: 'Test 1',
            kcal_per_100g: 100,
            protein_g_per_100g: 10,
            carbs_g_per_100g: 10,
            fat_g_per_100g: 10,
            created_at: '2025-01-01T00:00:00.000Z',
          },
        },
        {
          inventory_id: 1,
          ingredient_id: 2,
          qty_grams: 200,
          ingredient: {
            id: 2,
            name: 'Test 2',
            kcal_per_100g: 200,
            protein_g_per_100g: 20,
            carbs_g_per_100g: 20,
            fat_g_per_100g: 20,
            created_at: '2025-01-01T00:00:00.000Z',
          },
        },
      ]

      store.setInventoryIngredients(ingredients)
      expect(store.inventoryCount.value).toBe(2)

      store.setInventoryIngredients([])
      expect(store.inventoryCount.value).toBe(0)
    })

    it('hasInventory should react to changes', () => {
      expect(store.hasInventory.value).toBe(false)

      const mockInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01T00:00:00.000Z',
        inventory_ingredient: [],
      }

      store.setInventory(mockInventory)
      expect(store.hasInventory.value).toBe(true)

      store.setInventory(null)
      expect(store.hasInventory.value).toBe(false)
    })
  })
})
