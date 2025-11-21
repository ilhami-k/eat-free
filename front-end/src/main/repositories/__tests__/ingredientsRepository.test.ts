import { describe, it, expect, beforeEach, vi } from 'vitest'
import { IngredientsRepository } from '../ingredientsRepository'

const mockIngredientsMethods = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

const mockPrismaClient = {
  ingredients: mockIngredientsMethods,
}

describe('IngredientsRepository', () => {
  let repository: IngredientsRepository

  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository = new IngredientsRepository(mockPrismaClient as any)
  })

  describe('getIngredients', () => {
    it('should return all ingredients', async () => {
      const mockData = [
        {
          id: 1,
          name: 'Chicken Breast',
          kcal_per_100g: 165,
          protein_g_per_100g: 31,
          carbs_g_per_100g: 0,
          fat_g_per_100g: 3.6,
          created_at: new Date('2025-01-01'),
        },
        {
          id: 2,
          name: 'Brown Rice',
          kcal_per_100g: 370,
          protein_g_per_100g: 7.9,
          carbs_g_per_100g: 77,
          fat_g_per_100g: 2.9,
          created_at: new Date('2025-01-01'),
        },
      ]

      mockIngredientsMethods.findMany.mockResolvedValue(mockData)

      const result = await repository.getIngredients()

      expect(mockIngredientsMethods.findMany).toHaveBeenCalled()
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Chicken Breast')
      expect(result[1].name).toBe('Brown Rice')
    })

    it('should return empty array when no ingredients exist', async () => {
      mockIngredientsMethods.findMany.mockResolvedValue([])

      const result = await repository.getIngredients()

      expect(result).toEqual([])
    })
  })

  describe('getIngredientById', () => {
    it('should return ingredient by id', async () => {
      const mockData = {
        id: 1,
        name: 'Chicken Breast',
        kcal_per_100g: 165,
        protein_g_per_100g: 31,
        carbs_g_per_100g: 0,
        fat_g_per_100g: 3.6,
        created_at: new Date('2025-01-01'),
      }

      mockIngredientsMethods.findUnique.mockResolvedValue(mockData)

      const result = await repository.getIngredientById(1)

      expect(mockIngredientsMethods.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(result).toBeDefined()
      expect(result?.name).toBe('Chicken Breast')
      expect(result?.protein_g_per_100g).toBe(31)
    })

    it('should return null when ingredient not found', async () => {
      mockIngredientsMethods.findUnique.mockResolvedValue(null)

      const result = await repository.getIngredientById(999)

      expect(result).toBeNull()
    })
  })

  describe('getIngredientByName', () => {
    it('should return ingredient by name', async () => {
      const mockData = {
        id: 1,
        name: 'Chicken Breast',
        kcal_per_100g: 165,
        protein_g_per_100g: 31,
        carbs_g_per_100g: 0,
        fat_g_per_100g: 3.6,
        created_at: new Date('2025-01-01'),
      }

      mockIngredientsMethods.findUnique.mockResolvedValue(mockData)

      const result = await repository.getIngredientByName('Chicken Breast')

      expect(mockIngredientsMethods.findUnique).toHaveBeenCalledWith({
        where: { name: 'Chicken Breast' },
      })
      expect(result).toBeDefined()
      expect(result?.name).toBe('Chicken Breast')
    })

    it('should return null when name not found', async () => {
      mockIngredientsMethods.findUnique.mockResolvedValue(null)

      const result = await repository.getIngredientByName('Nonexistent Food')

      expect(result).toBeNull()
    })
  })

  describe('createIngredient', () => {
    it('should create new ingredient', async () => {
      const mockData = {
        id: 5,
        name: 'Salmon',
        kcal_per_100g: 208,
        protein_g_per_100g: 20,
        carbs_g_per_100g: 0,
        fat_g_per_100g: 13,
        created_at: new Date('2025-01-01'),
      }

      mockIngredientsMethods.create.mockResolvedValue(mockData)

      const result = await repository.createIngredient('Salmon', 208, 20, 0, 13)

      expect(mockIngredientsMethods.create).toHaveBeenCalledWith({
        data: {
          name: 'Salmon',
          kcal_per_100g: 208,
          protein_g_per_100g: 20,
          carbs_g_per_100g: 0,
          fat_g_per_100g: 13,
        },
      })
      expect(result.id).toBe(5)
      expect(result.name).toBe('Salmon')
      expect(result.kcal_per_100g).toBe(208)
    })
  })

  describe('updateIngredient', () => {
    it('should update ingredient nutritional values', async () => {
      const mockData = {
        id: 1,
        name: 'Chicken Breast',
        kcal_per_100g: 170,
        protein_g_per_100g: 32,
        carbs_g_per_100g: 0,
        fat_g_per_100g: 4,
        created_at: new Date('2025-01-01'),
      }

      mockIngredientsMethods.update.mockResolvedValue(mockData)

      const result = await repository.updateIngredient(1, {
        kcal_per_100g: 170,
        protein_g_per_100g: 32,
        fat_g_per_100g: 4,
      })

      expect(mockIngredientsMethods.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          kcal_per_100g: 170,
          protein_g_per_100g: 32,
          fat_g_per_100g: 4,
        },
      })
      expect(result.kcal_per_100g).toBe(170)
      expect(result.protein_g_per_100g).toBe(32)
    })

    it('should update ingredient name', async () => {
      const mockData = {
        id: 1,
        name: 'Grilled Chicken Breast',
        kcal_per_100g: 165,
        protein_g_per_100g: 31,
        carbs_g_per_100g: 0,
        fat_g_per_100g: 3.6,
        created_at: new Date('2025-01-01'),
      }

      mockIngredientsMethods.update.mockResolvedValue(mockData)

      const result = await repository.updateIngredient(1, { name: 'Grilled Chicken Breast' })

      expect(result.name).toBe('Grilled Chicken Breast')
    })
  })

  describe('deleteIngredient', () => {
    it('should delete ingredient by id', async () => {
      mockIngredientsMethods.delete.mockResolvedValue({})

      await repository.deleteIngredient(1)

      expect(mockIngredientsMethods.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })
  })

  describe('Error Handling - Database Failures (Sad Path)', () => {
    it('should throw error when database connection fails on getIngredients', async () => {
      const dbError = new Error('Database connection lost')
      mockIngredientsMethods.findMany.mockRejectedValue(dbError)

      await expect(repository.getIngredients()).rejects.toThrow('Database connection lost')
    })

    it('should throw error when database times out on getIngredientById', async () => {
      const timeoutError = new Error('Query timeout exceeded')
      mockIngredientsMethods.findUnique.mockRejectedValue(timeoutError)

      await expect(repository.getIngredientById(1)).rejects.toThrow('Query timeout exceeded')
    })

    it('should throw error when network fails on getIngredientByName', async () => {
      const networkError = new Error('ECONNREFUSED: Connection refused')
      mockIngredientsMethods.findUnique.mockRejectedValue(networkError)

      await expect(repository.getIngredientByName('Chicken')).rejects.toThrow(
        'ECONNREFUSED: Connection refused'
      )
    })

    it('should throw error when database is unavailable on createIngredient', async () => {
      const unavailableError = new Error('Cannot reach database server')
      mockIngredientsMethods.create.mockRejectedValue(unavailableError)

      await expect(
        repository.createIngredient('Salmon', 208, 20, 0, 13)
      ).rejects.toThrow('Cannot reach database server')
    })

    it('should throw error when database fails on updateIngredient', async () => {
      const updateError = new Error('Update operation failed')
      mockIngredientsMethods.update.mockRejectedValue(updateError)

      await expect(
        repository.updateIngredient(1, { kcal_per_100g: 170 })
      ).rejects.toThrow('Update operation failed')
    })

    it('should throw error when database fails on deleteIngredient', async () => {
      const deleteError = new Error('Delete operation failed')
      mockIngredientsMethods.delete.mockRejectedValue(deleteError)

      await expect(repository.deleteIngredient(1)).rejects.toThrow('Delete operation failed')
    })
  })

  describe('Error Handling - Constraint Violations (Sad Path)', () => {
    it('should throw error when creating duplicate ingredient (unique constraint)', async () => {
      const uniqueConstraintError = {
        code: 'P2002',
        meta: { target: ['name'] },
        message:
          'Unique constraint failed on the constraint: `ingredients_name_key`',
      }
      mockIngredientsMethods.create.mockRejectedValue(uniqueConstraintError)

      await expect(
        repository.createIngredient('Chicken Breast', 165, 31, 0, 3.6)
      ).rejects.toMatchObject({
        code: 'P2002',
        message: expect.stringContaining('Unique constraint failed'),
      })
    })

    it('should throw error when updating to duplicate name (unique constraint)', async () => {
      const uniqueConstraintError = {
        code: 'P2002',
        meta: { target: ['name'] },
        message:
          'Unique constraint failed on the constraint: `ingredients_name_key`',
      }
      mockIngredientsMethods.update.mockRejectedValue(uniqueConstraintError)

      await expect(
        repository.updateIngredient(1, { name: 'Existing Ingredient' })
      ).rejects.toMatchObject({
        code: 'P2002',
      })
    })

    it('should throw error when ingredient not found for update', async () => {
      const notFoundError = {
        code: 'P2025',
        message: 'Record to update not found.',
      }
      mockIngredientsMethods.update.mockRejectedValue(notFoundError)

      await expect(
        repository.updateIngredient(999, { kcal_per_100g: 200 })
      ).rejects.toMatchObject({
        code: 'P2025',
        message: expect.stringContaining('not found'),
      })
    })

    it('should throw error when ingredient not found for delete', async () => {
      const notFoundError = {
        code: 'P2025',
        message: 'Record to delete does not exist.',
      }
      mockIngredientsMethods.delete.mockRejectedValue(notFoundError)

      await expect(repository.deleteIngredient(999)).rejects.toMatchObject({
        code: 'P2025',
        message: expect.stringContaining('does not exist'),
      })
    })

    it('should throw error when foreign key constraint prevents deletion', async () => {
      const foreignKeyError = {
        code: 'P2003',
        message: 'Foreign key constraint failed on the field: `recipe_ingredients_ingredient_id_fkey`',
      }
      mockIngredientsMethods.delete.mockRejectedValue(foreignKeyError)

      await expect(repository.deleteIngredient(1)).rejects.toMatchObject({
        code: 'P2003',
        message: expect.stringContaining('Foreign key constraint'),
      })
    })
  })

  describe('Error Handling - Invalid Data (Sad Path)', () => {
    it('should throw error when creating ingredient with invalid data types', async () => {
      const validationError = new Error('Invalid input data')
      mockIngredientsMethods.create.mockRejectedValue(validationError)

      await expect(
        repository.createIngredient('Invalid', NaN, -1, 0, 0)
      ).rejects.toThrow('Invalid input data')
    })

    it('should throw error when required field is missing', async () => {
      const missingFieldError = {
        code: 'P2000',
        message: 'The provided value for the column is too long for the column\'s type',
      }
      mockIngredientsMethods.create.mockRejectedValue(missingFieldError)

      await expect(
        repository.createIngredient('', 165, 31, 0, 3.6)
      ).rejects.toMatchObject({
        code: 'P2000',
      })
    })
  })
})
