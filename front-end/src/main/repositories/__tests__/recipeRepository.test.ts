import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RecipeRepository } from '../recipeRepository'

const mockRecipeMethods = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

const mockPrismaClient = {
  recipe: mockRecipeMethods,
}

describe('RecipeRepository', () => {
  let repository: RecipeRepository

  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository = new RecipeRepository(mockPrismaClient as any)
  })

  describe('getRecipes', () => {
    it('should return all recipes with ingredients', async () => {
      const mockData = [
        {
          id: 1,
          user_id: 1,
          name: 'Grilled Chicken',
          servings: 2,
          kcal_per_serving: 250,
          protein_g_per_serving: 40,
          carbs_g_per_serving: 5,
          fat_g_per_serving: 8,
          created_at: new Date('2025-01-01'),
          recipe_ingredients: [
            {
              recipe_id: 1,
              ingredient_id: 1,
              qty_grams: 200,
              notes: 'boneless',
              ingredients: {
                id: 1,
                name: 'Chicken Breast',
                kcal_per_100g: 165,
                protein_g_per_100g: 31,
                carbs_g_per_100g: 0,
                fat_g_per_100g: 3.6,
              },
            },
          ],
        },
      ]

      mockRecipeMethods.findMany.mockResolvedValue(mockData)

      const result = await repository.getRecipes()

      expect(mockRecipeMethods.findMany).toHaveBeenCalledWith({
        include: {
          recipe_ingredients: {
            include: { ingredients: true },
          },
        },
      })
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Grilled Chicken')
      expect(result[0].recipe_ingredients).toHaveLength(1)
    })

    it('should handle recipes with null user_id (global recipes)', async () => {
      const mockData = [
        {
          id: 1,
          user_id: null,
          name: 'Global Recipe',
          servings: 1,
          kcal_per_serving: 100,
          protein_g_per_serving: 10,
          carbs_g_per_serving: 10,
          fat_g_per_serving: 3,
          created_at: new Date('2025-01-01'),
          recipe_ingredients: [],
        },
      ]

      mockRecipeMethods.findMany.mockResolvedValue(mockData)

      const result = await repository.getRecipes()

      expect(result[0].user_id).toBeNull()
    })
  })

  describe('getRecipeById', () => {
    it('should return recipe by id', async () => {
      const mockData = {
        id: 1,
        user_id: 1,
        name: 'Grilled Chicken',
        servings: 2,
        kcal_per_serving: 250,
        protein_g_per_serving: 40,
        carbs_g_per_serving: 5,
        fat_g_per_serving: 8,
        created_at: new Date('2025-01-01'),
        recipe_ingredients: [],
      }

      mockRecipeMethods.findUnique.mockResolvedValue(mockData)

      const result = await repository.getRecipeById(1)

      expect(mockRecipeMethods.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          recipe_ingredients: {
            include: { ingredients: true },
          },
        },
      })
      expect(result).toBeDefined()
      expect(result?.name).toBe('Grilled Chicken')
      expect(result?.servings).toBe(2)
    })

    it('should return null when recipe not found', async () => {
      mockRecipeMethods.findUnique.mockResolvedValue(null)

      const result = await repository.getRecipeById(999)

      expect(result).toBeNull()
    })
  })

  describe('createRecipe', () => {
    it('should create recipe without ingredients', async () => {
      const mockData = {
        id: 5,
        user_id: 1,
        name: 'New Recipe',
        servings: 1,
        kcal_per_serving: 200,
        protein_g_per_serving: 20,
        carbs_g_per_serving: 15,
        fat_g_per_serving: 10,
        created_at: new Date('2025-01-01'),
        recipe_ingredients: [],
      }

      mockRecipeMethods.create.mockResolvedValue(mockData)

      const recipeData = {
        user_id: 1,
        name: 'New Recipe',
        servings: 1,
        kcal_per_serving: 200,
        protein_g_per_serving: 20,
        carbs_g_per_serving: 15,
        fat_g_per_serving: 10,
        recipe_ingredients: [],
      }

      const result = await repository.createRecipe(recipeData)

      expect(result.id).toBe(5)
      expect(result.name).toBe('New Recipe')
    })

    it('should create recipe with ingredients', async () => {
      const mockData = {
        id: 5,
        user_id: 1,
        name: 'Chicken Salad',
        servings: 2,
        kcal_per_serving: 150,
        protein_g_per_serving: 25,
        carbs_g_per_serving: 10,
        fat_g_per_serving: 5,
        created_at: new Date('2025-01-01'),
        recipe_ingredients: [
          {
            recipe_id: 5,
            ingredient_id: 1,
            qty_grams: 150,
            notes: 'diced',
            ingredients: {
              id: 1,
              name: 'Chicken Breast',
              kcal_per_100g: 165,
              protein_g_per_100g: 31,
              carbs_g_per_100g: 0,
              fat_g_per_100g: 3.6,
            },
          },
        ],
      }

      mockRecipeMethods.create.mockResolvedValue(mockData)

      const recipeData = {
        user_id: 1,
        name: 'Chicken Salad',
        servings: 2,
        kcal_per_serving: 150,
        protein_g_per_serving: 25,
        carbs_g_per_serving: 10,
        fat_g_per_serving: 5,
        recipe_ingredients: [],
      }

      const ingredients = [
        { ingredient_id: 1, qty_grams: 150, notes: 'diced' },
      ]

      const result = await repository.createRecipe(recipeData, ingredients)

      expect(result.recipe_ingredients).toHaveLength(1)
      expect(result.recipe_ingredients?.[0].qty_grams).toBe(150)
    })
  })

  describe('updateRecipe', () => {
    it('should update recipe details', async () => {
      const mockData = {
        id: 1,
        user_id: 1,
        name: 'Updated Recipe',
        servings: 3,
        kcal_per_serving: 300,
        protein_g_per_serving: 30,
        carbs_g_per_serving: 20,
        fat_g_per_serving: 15,
        created_at: new Date('2025-01-01'),
      }

      mockRecipeMethods.update.mockResolvedValue(mockData)

      const result = await repository.updateRecipe(1, {
        name: 'Updated Recipe',
        servings: 3,
      })

      expect(mockRecipeMethods.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Recipe',
          servings: 3,
          kcal_per_serving: undefined,
          protein_g_per_serving: undefined,
          carbs_g_per_serving: undefined,
          fat_g_per_serving: undefined,
        },
      })
      expect(result.name).toBe('Updated Recipe')
      expect(result.servings).toBe(3)
    })

    it('should update nutrition values', async () => {
      const mockData = {
        id: 1,
        user_id: 1,
        name: 'Recipe',
        servings: 2,
        kcal_per_serving: 350,
        protein_g_per_serving: 35,
        carbs_g_per_serving: 25,
        fat_g_per_serving: 12,
        created_at: new Date('2025-01-01'),
      }

      mockRecipeMethods.update.mockResolvedValue(mockData)

      const result = await repository.updateRecipe(1, {
        kcal_per_serving: 350,
        protein_g_per_serving: 35,
      })

      expect(result.kcal_per_serving).toBe(350)
      expect(result.protein_g_per_serving).toBe(35)
    })
  })

  describe('deleteRecipe', () => {
    it('should delete recipe by id', async () => {
      mockRecipeMethods.delete.mockResolvedValue({})

      await repository.deleteRecipe(1)

      expect(mockRecipeMethods.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })
  })
})
