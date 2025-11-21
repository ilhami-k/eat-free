import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useInventoryService } from '../useInventoryService'
import { useInventoryStore } from '../useInventoryStore'
import type IInventoryService from '../../../shared/interfaces/IInventoryService'
import type Inventory from '../../../shared/inventory'

// Mock the store
vi.mock('../useInventoryStore', () => ({
  useInventoryStore: vi.fn(),
}))

describe('useInventoryService', () => {
  let mockService: IInventoryService
  let mockStore: ReturnType<typeof useInventoryStore>
  let service: ReturnType<typeof useInventoryService>

  beforeEach(() => {
    // Setup mock store
    mockStore = {
      inventory: { value: null },
      inventoryIngredients: { value: [] },
      isLoading: { value: false },
      error: { value: null },
      inventoryCount: { value: 0 },
      hasInventory: { value: false },
      setInventory: vi.fn(),
      setInventoryIngredients: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      clearError: vi.fn(),
      reset: vi.fn(),
    } as unknown as ReturnType<typeof useInventoryStore>

    // Setup mock service
    mockService = {
      getInventories: vi.fn(),
      getInventoryById: vi.fn(),
      getInventoryByUserId: vi.fn(),
      createInventory: vi.fn(),
      deleteInventory: vi.fn(),
      addIngredientToInventory: vi.fn(),
      updateIngredientInInventory: vi.fn(),
      removeIngredientFromInventory: vi.fn(),
    }

    // Make useInventoryStore return our mock
    vi.mocked(useInventoryStore).mockReturnValue(mockStore)

    // Create service instance
    service = useInventoryService(mockService)
  })

  describe('mapInventoryEntries', () => {
    it('should map inventory items to detailed format', async () => {
      const mockInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [
          {
            inventory_id: 1,
            ingredient_id: 1,
            qty_grams: 150,
            ingredients: {
              id: 1,
              name: 'Chicken Breast',
              kcal_per_100g: 165,
              protein_g_per_100g: 31,
              carbs_g_per_100g: 0,
              fat_g_per_100g: 3.6,
              created_at: '2025-01-01',
            },
          },
        ],
      }

      vi.mocked(mockService.getInventoryByUserId).mockResolvedValue(mockInventory)

      await service.getOrCreateInventory(1)

      expect(mockStore.setInventoryIngredients).toHaveBeenCalledWith([
        {
          inventory_id: 1,
          ingredient_id: 1,
          ingredient_name: 'Chicken Breast',
          qty_grams: 150,
          kcal_per_100g: 165,
          protein_g_per_100g: 31,
          carbs_g_per_100g: 0,
          fat_g_per_100g: 3.6,
        },
      ])
    })

    it('should filter out items with 0 or negative quantities', async () => {
      const mockInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [
          {
            inventory_id: 1,
            ingredient_id: 1,
            qty_grams: 100,
            ingredients: {
              id: 1,
              name: 'Chicken',
              kcal_per_100g: 165,
              protein_g_per_100g: 31,
              carbs_g_per_100g: 0,
              fat_g_per_100g: 3.6,
              created_at: '2025-01-01',
            },
          },
          {
            inventory_id: 1,
            ingredient_id: 2,
            qty_grams: 0,
            ingredients: {
              id: 2,
              name: 'Rice',
              kcal_per_100g: 130,
              protein_g_per_100g: 2.7,
              carbs_g_per_100g: 28,
              fat_g_per_100g: 0.3,
              created_at: '2025-01-01',
            },
          },
        ],
      }

      vi.mocked(mockService.getInventoryByUserId).mockResolvedValue(mockInventory)

      await service.getOrCreateInventory(1)

      // Should only include the item with qty > 0
      expect(mockStore.setInventoryIngredients).toHaveBeenCalledWith([
        expect.objectContaining({
          ingredient_name: 'Chicken',
          qty_grams: 100,
        }),
      ])
    })
  })

  describe('getOrCreateInventory', () => {
    it('should get existing inventory', async () => {
      const mockInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [],
      }

      vi.mocked(mockService.getInventoryByUserId).mockResolvedValue(mockInventory)

      const result = await service.getOrCreateInventory(1)

      expect(mockService.getInventoryByUserId).toHaveBeenCalledWith(1)
      expect(mockService.createInventory).not.toHaveBeenCalled()
      expect(mockStore.setInventory).toHaveBeenCalledWith(mockInventory)
      expect(result).toEqual(mockInventory)
    })

    it('should create inventory if none exists', async () => {
      const mockNewInventory: Inventory = {
        id: 2,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [],
      }

      vi.mocked(mockService.getInventoryByUserId).mockResolvedValue(null)
      vi.mocked(mockService.createInventory).mockResolvedValue(mockNewInventory)

      const result = await service.getOrCreateInventory(1)

      expect(mockService.getInventoryByUserId).toHaveBeenCalledWith(1)
      expect(mockService.createInventory).toHaveBeenCalledWith(1)
      expect(mockStore.setInventory).toHaveBeenCalledWith(mockNewInventory)
      expect(result).toEqual(mockNewInventory)
    })

    it('should set loading states correctly', async () => {
      const mockInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [],
      }

      vi.mocked(mockService.getInventoryByUserId).mockResolvedValue(mockInventory)

      await service.getOrCreateInventory(1)

      expect(mockStore.setLoading).toHaveBeenCalledWith(true)
      expect(mockStore.setLoading).toHaveBeenCalledWith(false)
      expect(mockStore.clearError).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      vi.mocked(mockService.getInventoryByUserId).mockRejectedValue(error)

      await expect(service.getOrCreateInventory(1)).rejects.toThrow('Database error')

      expect(mockStore.setError).toHaveBeenCalledWith(error)
      expect(mockStore.setLoading).toHaveBeenCalledWith(false)
    })
  })

  describe('addIngredient', () => {
    it('should add ingredient and refresh inventory', async () => {
      const updatedInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [
          {
            inventory_id: 1,
            ingredient_id: 5,
            qty_grams: 200,
            ingredients: {
              id: 5,
              name: 'Tomato',
              kcal_per_100g: 18,
              protein_g_per_100g: 0.9,
              carbs_g_per_100g: 3.9,
              fat_g_per_100g: 0.2,
              created_at: '2025-01-01',
            },
          },
        ],
      }

      vi.mocked(mockService.addIngredientToInventory).mockResolvedValue(undefined)
      vi.mocked(mockService.getInventoryById).mockResolvedValue(updatedInventory)

      const result = await service.addIngredient(1, 5, 200)

      expect(mockService.addIngredientToInventory).toHaveBeenCalledWith(1, 5, 200)
      expect(mockService.getInventoryById).toHaveBeenCalledWith(1)
      expect(mockStore.setInventory).toHaveBeenCalledWith(updatedInventory)
      expect(result).toBe(true)
    })

    it('should set loading states correctly', async () => {
      const updatedInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [],
      }

      vi.mocked(mockService.addIngredientToInventory).mockResolvedValue(undefined)
      vi.mocked(mockService.getInventoryById).mockResolvedValue(updatedInventory)

      await service.addIngredient(1, 5, 200)

      expect(mockStore.setLoading).toHaveBeenCalledWith(true)
      expect(mockStore.setLoading).toHaveBeenCalledWith(false)
      expect(mockStore.clearError).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Failed to add')
      vi.mocked(mockService.addIngredientToInventory).mockRejectedValue(error)

      await expect(service.addIngredient(1, 5, 200)).rejects.toThrow('Failed to add')

      expect(mockStore.setError).toHaveBeenCalledWith(error)
      expect(mockStore.setLoading).toHaveBeenCalledWith(false)
    })
  })

  describe('updateIngredient', () => {
    it('should update ingredient quantity and refresh inventory', async () => {
      const updatedInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [
          {
            inventory_id: 1,
            ingredient_id: 3,
            qty_grams: 500,
            ingredients: {
              id: 3,
              name: 'Brown Rice',
              kcal_per_100g: 370,
              protein_g_per_100g: 7.9,
              carbs_g_per_100g: 77,
              fat_g_per_100g: 2.9,
              created_at: '2025-01-01',
            },
          },
        ],
      }

      vi.mocked(mockService.updateIngredientInInventory).mockResolvedValue(undefined)
      vi.mocked(mockService.getInventoryById).mockResolvedValue(updatedInventory)

      const result = await service.updateIngredient(1, 3, 500)

      expect(mockService.updateIngredientInInventory).toHaveBeenCalledWith(1, 3, 500)
      expect(mockService.getInventoryById).toHaveBeenCalledWith(1)
      expect(mockStore.setInventory).toHaveBeenCalledWith(updatedInventory)
      expect(result).toBe(true)
    })

    it('should set loading states correctly', async () => {
      const updatedInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [],
      }

      vi.mocked(mockService.updateIngredientInInventory).mockResolvedValue(undefined)
      vi.mocked(mockService.getInventoryById).mockResolvedValue(updatedInventory)

      await service.updateIngredient(1, 3, 500)

      expect(mockStore.setLoading).toHaveBeenCalledWith(true)
      expect(mockStore.setLoading).toHaveBeenCalledWith(false)
      expect(mockStore.clearError).toHaveBeenCalled()
    })

    it('should handle errors when updating', async () => {
      const error = new Error('Failed to update ingredient')
      vi.mocked(mockService.updateIngredientInInventory).mockRejectedValue(error)

      await expect(service.updateIngredient(1, 3, 500)).rejects.toThrow(
        'Failed to update ingredient'
      )

      expect(mockStore.setError).toHaveBeenCalledWith(error)
      expect(mockStore.setLoading).toHaveBeenCalledWith(false)
    })

    it('should update ingredient to zero quantity (deletion)', async () => {
      const updatedInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [],
      }

      vi.mocked(mockService.updateIngredientInInventory).mockResolvedValue(undefined)
      vi.mocked(mockService.getInventoryById).mockResolvedValue(updatedInventory)

      const result = await service.updateIngredient(1, 3, 0)

      expect(mockService.updateIngredientInInventory).toHaveBeenCalledWith(1, 3, 0)
      expect(result).toBe(true)
    })

    it('should filter out zero quantity items after update', async () => {
      const updatedInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [
          {
            inventory_id: 1,
            ingredient_id: 1,
            qty_grams: 0,
            ingredients: {
              id: 1,
              name: 'Deleted Item',
              kcal_per_100g: 100,
              protein_g_per_100g: 10,
              carbs_g_per_100g: 10,
              fat_g_per_100g: 5,
              created_at: '2025-01-01',
            },
          },
          {
            inventory_id: 1,
            ingredient_id: 2,
            qty_grams: 150,
            ingredients: {
              id: 2,
              name: 'Active Item',
              kcal_per_100g: 200,
              protein_g_per_100g: 20,
              carbs_g_per_100g: 20,
              fat_g_per_100g: 10,
              created_at: '2025-01-01',
            },
          },
        ],
      }

      vi.mocked(mockService.updateIngredientInInventory).mockResolvedValue(undefined)
      vi.mocked(mockService.getInventoryById).mockResolvedValue(updatedInventory)

      await service.updateIngredient(1, 1, 0)

      // Should only include items with qty > 0
      expect(mockStore.setInventoryIngredients).toHaveBeenCalledWith([
        expect.objectContaining({
          ingredient_name: 'Active Item',
          qty_grams: 150,
        }),
      ])
    })
  })

  describe('removeIngredient', () => {
    it('should remove ingredient and refresh inventory', async () => {
      const updatedInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [],
      }

      vi.mocked(mockService.removeIngredientFromInventory).mockResolvedValue(undefined)
      vi.mocked(mockService.getInventoryById).mockResolvedValue(updatedInventory)

      const result = await service.removeIngredient(1, 5)

      expect(mockService.removeIngredientFromInventory).toHaveBeenCalledWith(1, 5)
      expect(mockService.getInventoryById).toHaveBeenCalledWith(1)
      expect(mockStore.setInventory).toHaveBeenCalledWith(updatedInventory)
      expect(result).toBe(true)
    })

    it('should set loading states correctly', async () => {
      const updatedInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [],
      }

      vi.mocked(mockService.removeIngredientFromInventory).mockResolvedValue(undefined)
      vi.mocked(mockService.getInventoryById).mockResolvedValue(updatedInventory)

      await service.removeIngredient(1, 5)

      expect(mockStore.setLoading).toHaveBeenCalledWith(true)
      expect(mockStore.setLoading).toHaveBeenCalledWith(false)
      expect(mockStore.clearError).toHaveBeenCalled()
    })

    it('should handle errors when removing', async () => {
      const error = new Error('Failed to remove ingredient')
      vi.mocked(mockService.removeIngredientFromInventory).mockRejectedValue(error)

      await expect(service.removeIngredient(1, 5)).rejects.toThrow('Failed to remove ingredient')

      expect(mockStore.setError).toHaveBeenCalledWith(error)
      expect(mockStore.setLoading).toHaveBeenCalledWith(false)
    })

    it('should update store with remaining ingredients after removal', async () => {
      const updatedInventory: Inventory = {
        id: 1,
        user_id: 1,
        created_at: '2025-01-01',
        inventory_ingredient: [
          {
            inventory_id: 1,
            ingredient_id: 2,
            qty_grams: 300,
            ingredients: {
              id: 2,
              name: 'Remaining Item',
              kcal_per_100g: 150,
              protein_g_per_100g: 15,
              carbs_g_per_100g: 15,
              fat_g_per_100g: 8,
              created_at: '2025-01-01',
            },
          },
        ],
      }

      vi.mocked(mockService.removeIngredientFromInventory).mockResolvedValue(undefined)
      vi.mocked(mockService.getInventoryById).mockResolvedValue(updatedInventory)

      await service.removeIngredient(1, 5)

      expect(mockStore.setInventoryIngredients).toHaveBeenCalledWith([
        expect.objectContaining({
          ingredient_name: 'Remaining Item',
          qty_grams: 300,
        }),
      ])
    })
  })

  describe('searchIngredients', () => {
    beforeEach(() => {
      // Setup mock inventory ingredients in store
      mockStore.inventoryIngredients.value = [
        {
          inventory_id: 1,
          ingredient_id: 1,
          ingredient_name: 'Chicken Breast',
          qty_grams: 500,
          kcal_per_100g: 165,
          protein_g_per_100g: 31,
          carbs_g_per_100g: 0,
          fat_g_per_100g: 3.6,
        },
        {
          inventory_id: 1,
          ingredient_id: 2,
          ingredient_name: 'Brown Rice',
          qty_grams: 1000,
          kcal_per_100g: 370,
          protein_g_per_100g: 7.9,
          carbs_g_per_100g: 77,
          fat_g_per_100g: 2.9,
        },
        {
          inventory_id: 1,
          ingredient_id: 3,
          ingredient_name: 'Olive Oil',
          qty_grams: 250,
          kcal_per_100g: 884,
          protein_g_per_100g: 0,
          carbs_g_per_100g: 0,
          fat_g_per_100g: 100,
        },
      ]
    })

    it('should return all ingredients when query is empty', () => {
      const results = service.searchIngredients('')

      expect(results).toHaveLength(3)
      expect(results).toEqual(mockStore.inventoryIngredients.value)
    })

    it('should return all ingredients when query is whitespace', () => {
      const results = service.searchIngredients('   ')

      expect(results).toHaveLength(3)
    })

    it('should filter ingredients by name (case insensitive)', () => {
      const results = service.searchIngredients('chicken')

      expect(results).toHaveLength(1)
      expect(results[0].ingredient_name).toBe('Chicken Breast')
    })

    it('should filter ingredients by partial name match', () => {
      const results = service.searchIngredients('rice')

      expect(results).toHaveLength(1)
      expect(results[0].ingredient_name).toBe('Brown Rice')
    })

    it('should handle uppercase search query', () => {
      const results = service.searchIngredients('OLIVE')

      expect(results).toHaveLength(1)
      expect(results[0].ingredient_name).toBe('Olive Oil')
    })

    it('should return empty array when no matches found', () => {
      const results = service.searchIngredients('Nonexistent Ingredient')

      expect(results).toHaveLength(0)
    })

    it('should match multiple ingredients with common term', () => {
      mockStore.inventoryIngredients.value = [
        {
          inventory_id: 1,
          ingredient_id: 1,
          ingredient_name: 'Chicken Breast',
          qty_grams: 500,
          kcal_per_100g: 165,
          protein_g_per_100g: 31,
          carbs_g_per_100g: 0,
          fat_g_per_100g: 3.6,
        },
        {
          inventory_id: 1,
          ingredient_id: 2,
          ingredient_name: 'Chicken Thigh',
          qty_grams: 300,
          kcal_per_100g: 209,
          protein_g_per_100g: 26,
          carbs_g_per_100g: 0,
          fat_g_per_100g: 11,
        },
      ]

      const results = service.searchIngredients('chicken')

      expect(results).toHaveLength(2)
      expect(results[0].ingredient_name).toBe('Chicken Breast')
      expect(results[1].ingredient_name).toBe('Chicken Thigh')
    })

    it('should handle special characters in search query', () => {
      mockStore.inventoryIngredients.value = [
        {
          inventory_id: 1,
          ingredient_id: 1,
          ingredient_name: 'Jalapeño Peppers',
          qty_grams: 100,
          kcal_per_100g: 29,
          protein_g_per_100g: 0.9,
          carbs_g_per_100g: 6,
          fat_g_per_100g: 0.4,
        },
      ]

      const results = service.searchIngredients('jalapeño')

      expect(results).toHaveLength(1)
    })

    it('should return original list reference when empty query', () => {
      const results = service.searchIngredients('')

      expect(results).toBe(mockStore.inventoryIngredients.value)
    })
  })

  describe('Exposed Properties and Methods', () => {
    it('should expose isLoading from store', () => {
      expect(service.isLoading).toBe(mockStore.isLoading)
    })

    it('should expose error from store', () => {
      expect(service.error).toBe(mockStore.error)
    })

    it('should expose inventory from store', () => {
      expect(service.inventory).toBe(mockStore.inventory)
    })

    it('should expose inventoryIngredients from store', () => {
      expect(service.inventoryIngredients).toBe(mockStore.inventoryIngredients)
    })

    it('should expose clearError method from store', () => {
      expect(service.clearError).toBe(mockStore.clearError)
    })

    it('should expose all required methods', () => {
      expect(typeof service.getOrCreateInventory).toBe('function')
      expect(typeof service.addIngredient).toBe('function')
      expect(typeof service.updateIngredient).toBe('function')
      expect(typeof service.removeIngredient).toBe('function')
      expect(typeof service.searchIngredients).toBe('function')
      expect(typeof service.clearError).toBe('function')
    })
  })
})
