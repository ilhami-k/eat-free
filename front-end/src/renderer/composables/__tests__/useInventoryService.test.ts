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
})
