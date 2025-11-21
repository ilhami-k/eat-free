import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InventoryRepository } from '../inventoryRepository'

// Create mock Prisma client
const mockInventoryMethods = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
}

const mockInventoryIngredientMethods = {
  upsert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

const mockPrismaClient = {
  inventory: mockInventoryMethods,
  inventory_ingredient: mockInventoryIngredientMethods,
}

describe('InventoryRepository', () => {
  let repository: InventoryRepository

  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository = new InventoryRepository(mockPrismaClient as any)
  })

  describe('getInventories', () => {
    it('should return all inventories with ingredients', async () => {
      const mockData = [
        {
          id: 1,
          user_id: 1,
          created_at: new Date('2025-01-01'),
          inventory_ingredient: [
            {
              inventory_id: 1,
              ingredient_id: 1,
              qty_grams: 100,
              ingredients: {
                id: 1,
                name: 'Chicken Breast',
                kcal_per_100g: 165,
                protein_g_per_100g: 31,
                carbs_g_per_100g: 0,
                fat_g_per_100g: 3.6,
                created_at: new Date('2025-01-01'),
              },
            },
          ],
        },
      ]

      mockInventoryMethods.findMany.mockResolvedValue(mockData)

      const result = await repository.getInventories()

      expect(mockInventoryMethods.findMany).toHaveBeenCalledWith({
        include: {
          inventory_ingredient: {
            include: { ingredients: true },
          },
        },
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
      expect(result[0].user_id).toBe(1)
      expect(result[0].inventory_ingredient).toHaveLength(1)
      expect(result[0].inventory_ingredient?.[0].ingredients?.name).toBe('Chicken Breast')
    })

    it('should return empty array when no inventories exist', async () => {
      mockInventoryMethods.findMany.mockResolvedValue([])

      const result = await repository.getInventories()

      expect(result).toEqual([])
    })
  })

  describe('getInventoryById', () => {
    it('should return inventory by id', async () => {
      const mockData = {
        id: 1,
        user_id: 1,
        created_at: new Date('2025-01-01'),
        inventory_ingredient: [] as never[],
      }

      mockInventoryMethods.findUnique.mockResolvedValue(mockData)

      const result = await repository.getInventoryById(1)

      expect(mockInventoryMethods.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          inventory_ingredient: {
            include: { ingredients: true },
          },
        },
      })

      expect(result).toBeDefined()
      expect(result?.id).toBe(1)
      expect(result?.user_id).toBe(1)
    })

    it('should return null when inventory not found', async () => {
      mockInventoryMethods.findUnique.mockResolvedValue(null)

      const result = await repository.getInventoryById(999)

      expect(result).toBeNull()
    })
  })

  describe('getInventoryByUserId', () => {
    it('should return inventory by user_id', async () => {
      const mockData = {
        id: 1,
        user_id: 5,
        created_at: new Date('2025-01-01'),
        inventory_ingredient: [] as never[],
      }

      mockInventoryMethods.findUnique.mockResolvedValue(mockData)

      const result = await repository.getInventoryByUserId(5)

      expect(mockInventoryMethods.findUnique).toHaveBeenCalledWith({
        where: { user_id: 5 },
        include: {
          inventory_ingredient: {
            include: { ingredients: true },
          },
        },
      })

      expect(result).toBeDefined()
      expect(result?.user_id).toBe(5)
    })

    it('should return null when user has no inventory', async () => {
      mockInventoryMethods.findUnique.mockResolvedValue(null)

      const result = await repository.getInventoryByUserId(999)

      expect(result).toBeNull()
    })
  })

  describe('createInventory', () => {
    it('should create new inventory for user', async () => {
      const mockData = {
        id: 10,
        user_id: 5,
        created_at: new Date('2025-01-01'),
        inventory_ingredient: [] as never[],
      }

      mockInventoryMethods.create.mockResolvedValue(mockData)

      const result = await repository.createInventory(5)

      expect(mockInventoryMethods.create).toHaveBeenCalledWith({
        data: { user_id: 5 },
        include: {
          inventory_ingredient: {
            include: { ingredients: true },
          },
        },
      })

      expect(result.id).toBe(10)
      expect(result.user_id).toBe(5)
    })
  })

  describe('deleteInventory', () => {
    it('should delete inventory by id', async () => {
      mockInventoryMethods.delete.mockResolvedValue({})

      await repository.deleteInventory(1)

      expect(mockInventoryMethods.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })
  })

  describe('addIngredientToInventory', () => {
    it('should add new ingredient to inventory', async () => {
      mockInventoryIngredientMethods.upsert.mockResolvedValue({})

      await repository.addIngredientToInventory(1, 5, 100)

      expect(mockInventoryIngredientMethods.upsert).toHaveBeenCalledWith({
        where: {
          inventory_id_ingredient_id: {
            inventory_id: 1,
            ingredient_id: 5,
          },
        },
        create: {
          inventory_id: 1,
          ingredient_id: 5,
          qty_grams: 100,
        },
        update: {
          qty_grams: {
            increment: 100,
          },
        },
      })
    })

    it('should increment quantity if ingredient already exists', async () => {
      mockInventoryIngredientMethods.upsert.mockResolvedValue({})

      await repository.addIngredientToInventory(1, 5, 50)

      expect(mockInventoryIngredientMethods.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: {
            qty_grams: {
              increment: 50,
            },
          },
        })
      )
    })
  })

  describe('updateIngredientInInventory', () => {
    it('should update ingredient quantity', async () => {
      mockInventoryIngredientMethods.update.mockResolvedValue({})

      await repository.updateIngredientInInventory(1, 5, 200)

      expect(mockInventoryIngredientMethods.update).toHaveBeenCalledWith({
        where: {
          inventory_id_ingredient_id: {
            inventory_id: 1,
            ingredient_id: 5,
          },
        },
        data: { qty_grams: 200 },
      })
    })

    it('should delete ingredient when quantity is 0', async () => {
      mockInventoryIngredientMethods.delete.mockResolvedValue({})

      await repository.updateIngredientInInventory(1, 5, 0)

      expect(mockInventoryIngredientMethods.delete).toHaveBeenCalledWith({
        where: {
          inventory_id_ingredient_id: {
            inventory_id: 1,
            ingredient_id: 5,
          },
        },
      })
      expect(mockInventoryIngredientMethods.update).not.toHaveBeenCalled()
    })

    it('should delete ingredient when quantity is negative', async () => {
      mockInventoryIngredientMethods.delete.mockResolvedValue({})

      await repository.updateIngredientInInventory(1, 5, -10)

      expect(mockInventoryIngredientMethods.delete).toHaveBeenCalled()
      expect(mockInventoryIngredientMethods.update).not.toHaveBeenCalled()
    })
  })

  describe('removeIngredientFromInventory', () => {
    it('should remove ingredient from inventory', async () => {
      mockInventoryIngredientMethods.delete.mockResolvedValue({})

      await repository.removeIngredientFromInventory(1, 5)

      expect(mockInventoryIngredientMethods.delete).toHaveBeenCalledWith({
        where: {
          inventory_id_ingredient_id: {
            inventory_id: 1,
            ingredient_id: 5,
          },
        },
      })
    })
  })
})
