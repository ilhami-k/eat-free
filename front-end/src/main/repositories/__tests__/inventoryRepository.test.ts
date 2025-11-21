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

  describe('Error Handling - Database Failures (Sad Path)', () => {
    it('should throw error when database connection fails on getInventories', async () => {
      const dbError = new Error('Connection to database failed')
      mockInventoryMethods.findMany.mockRejectedValue(dbError)

      await expect(repository.getInventories()).rejects.toThrow('Connection to database failed')
    })

    it('should throw error when query timeout on getInventoryById', async () => {
      const timeoutError = new Error('Query execution timeout')
      mockInventoryMethods.findUnique.mockRejectedValue(timeoutError)

      await expect(repository.getInventoryById(1)).rejects.toThrow('Query execution timeout')
    })

    it('should throw error when network issue on getInventoryByUserId', async () => {
      const networkError = new Error('Network error: ETIMEDOUT')
      mockInventoryMethods.findUnique.mockRejectedValue(networkError)

      await expect(repository.getInventoryByUserId(1)).rejects.toThrow('Network error: ETIMEDOUT')
    })

    it('should throw error when database unavailable on createInventory', async () => {
      const unavailableError = new Error('Database server not responding')
      mockInventoryMethods.create.mockRejectedValue(unavailableError)

      await expect(repository.createInventory(1)).rejects.toThrow(
        'Database server not responding'
      )
    })

    it('should throw error when database fails on deleteInventory', async () => {
      const deleteError = new Error('Failed to delete inventory')
      mockInventoryMethods.delete.mockRejectedValue(deleteError)

      await expect(repository.deleteInventory(1)).rejects.toThrow('Failed to delete inventory')
    })

    it('should throw error when database fails on addIngredientToInventory', async () => {
      const addError = new Error('Failed to add ingredient')
      mockInventoryIngredientMethods.upsert.mockRejectedValue(addError)

      await expect(repository.addIngredientToInventory(1, 5, 100)).rejects.toThrow(
        'Failed to add ingredient'
      )
    })

    it('should throw error when database fails on updateIngredientInInventory', async () => {
      const updateError = new Error('Failed to update ingredient quantity')
      mockInventoryIngredientMethods.update.mockRejectedValue(updateError)

      await expect(repository.updateIngredientInInventory(1, 5, 200)).rejects.toThrow(
        'Failed to update ingredient quantity'
      )
    })

    it('should throw error when database fails on removeIngredientFromInventory', async () => {
      const removeError = new Error('Failed to remove ingredient')
      mockInventoryIngredientMethods.delete.mockRejectedValue(removeError)

      await expect(repository.removeIngredientFromInventory(1, 5)).rejects.toThrow(
        'Failed to remove ingredient'
      )
    })
  })

  describe('Error Handling - Constraint Violations (Sad Path)', () => {
    it('should throw error when creating duplicate inventory for same user (unique constraint)', async () => {
      const uniqueConstraintError = {
        code: 'P2002',
        meta: { target: ['user_id'] },
        message: 'Unique constraint failed on the constraint: `inventory_user_id_key`',
      }
      mockInventoryMethods.create.mockRejectedValue(uniqueConstraintError)

      await expect(repository.createInventory(1)).rejects.toMatchObject({
        code: 'P2002',
        message: expect.stringContaining('Unique constraint failed'),
      })
    })

    it('should throw error when inventory not found for deletion', async () => {
      const notFoundError = {
        code: 'P2025',
        message: 'Record to delete does not exist.',
      }
      mockInventoryMethods.delete.mockRejectedValue(notFoundError)

      await expect(repository.deleteInventory(999)).rejects.toMatchObject({
        code: 'P2025',
        message: expect.stringContaining('does not exist'),
      })
    })

    it('should throw error when foreign key constraint fails (invalid user_id)', async () => {
      const foreignKeyError = {
        code: 'P2003',
        message: 'Foreign key constraint failed on the field: `inventory_user_id_fkey`',
      }
      mockInventoryMethods.create.mockRejectedValue(foreignKeyError)

      await expect(repository.createInventory(9999)).rejects.toMatchObject({
        code: 'P2003',
        message: expect.stringContaining('Foreign key constraint'),
      })
    })

    it('should throw error when adding ingredient with invalid ingredient_id', async () => {
      const foreignKeyError = {
        code: 'P2003',
        message:
          'Foreign key constraint failed on the field: `inventory_ingredient_ingredient_id_fkey`',
      }
      mockInventoryIngredientMethods.upsert.mockRejectedValue(foreignKeyError)

      await expect(repository.addIngredientToInventory(1, 9999, 100)).rejects.toMatchObject({
        code: 'P2003',
        message: expect.stringContaining('Foreign key constraint'),
      })
    })

    it('should throw error when updating non-existent ingredient in inventory', async () => {
      const notFoundError = {
        code: 'P2025',
        message: 'Record to update not found.',
      }
      mockInventoryIngredientMethods.update.mockRejectedValue(notFoundError)

      await expect(repository.updateIngredientInInventory(1, 999, 100)).rejects.toMatchObject({
        code: 'P2025',
        message: expect.stringContaining('not found'),
      })
    })

    it('should throw error when removing non-existent ingredient from inventory', async () => {
      const notFoundError = {
        code: 'P2025',
        message: 'Record to delete does not exist.',
      }
      mockInventoryIngredientMethods.delete.mockRejectedValue(notFoundError)

      await expect(repository.removeIngredientFromInventory(1, 999)).rejects.toMatchObject({
        code: 'P2025',
        message: expect.stringContaining('does not exist'),
      })
    })

    it('should throw error when deleting inventory with existing ingredients (cascade issue)', async () => {
      const cascadeError = {
        code: 'P2014',
        message: 'The change you are trying to make would violate the required relation',
      }
      mockInventoryMethods.delete.mockRejectedValue(cascadeError)

      await expect(repository.deleteInventory(1)).rejects.toMatchObject({
        code: 'P2014',
        message: expect.stringContaining('violate the required relation'),
      })
    })
  })

  describe('Error Handling - Invalid Data (Sad Path)', () => {
    it('should throw error when creating inventory with invalid user_id type', async () => {
      const typeError = new Error('Invalid user_id type')
      mockInventoryMethods.create.mockRejectedValue(typeError)

      await expect(repository.createInventory(NaN as number)).rejects.toThrow(
        'Invalid user_id type'
      )
    })

    it('should throw error when adding ingredient with negative quantity', async () => {
      const validationError = new Error('Quantity must be positive')
      mockInventoryIngredientMethods.upsert.mockRejectedValue(validationError)

      await expect(repository.addIngredientToInventory(1, 5, -100)).rejects.toThrow(
        'Quantity must be positive'
      )
    })

    it('should handle error when deleting ingredient with zero quantity', async () => {
      const deleteError = new Error('Cannot delete with zero quantity')
      mockInventoryIngredientMethods.delete.mockRejectedValue(deleteError)

      await expect(repository.updateIngredientInInventory(1, 5, 0)).rejects.toThrow(
        'Cannot delete with zero quantity'
      )
    })
  })
})
