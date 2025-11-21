import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MealPlanRepository } from '../mealPlanRepository'

const mockMealPlanMethods = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  upsert: vi.fn(),
  delete: vi.fn(),
}

const mockMealPlanRecipeMethods = {
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

const mockPrismaClient = {
  meal_plan: mockMealPlanMethods,
  meal_plan_recipe: mockMealPlanRecipeMethods,
}

describe('MealPlanRepository', () => {
  let repository: MealPlanRepository

  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository = new MealPlanRepository(mockPrismaClient as any)
  })

  describe('getMealPlans', () => {
    it('should return all meal plans for user', async () => {
      const mockData = [
        {
          id: 1,
          user_id: 1,
          week_start_date: new Date('2025-01-06'),
          created_at: new Date('2025-01-01'),
          meal_plan_recipe: [
            {
              id: 1,
              plan_id: 1,
              recipe_id: 1,
              date: new Date('2025-01-06'),
              meal_type: 'breakfast',
              planned_servings: 1,
              recipe: {
                id: 1,
                user_id: 1,
                name: 'Oatmeal',
                servings: 1,
                kcal_per_serving: 150,
                protein_g_per_serving: 5,
                carbs_g_per_serving: 27,
                fat_g_per_serving: 3,
                created_at: new Date('2025-01-01'),
                recipe_ingredients: [],
              },
            },
          ],
        },
      ]

      mockMealPlanMethods.findMany.mockResolvedValue(mockData)

      const result = await repository.getMealPlans(1)

      expect(mockMealPlanMethods.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
        include: {
          meal_plan_recipe: {
            include: {
              recipe: {
                include: {
                  recipe_ingredients: {
                    include: { ingredients: true },
                  },
                },
              },
            },
          },
        },
      })
      expect(result).toHaveLength(1)
      expect(result[0].meal_plan_recipe).toHaveLength(1)
    })

    it('should return empty array when no meal plans exist', async () => {
      mockMealPlanMethods.findMany.mockResolvedValue([])

      const result = await repository.getMealPlans(1)

      expect(result).toEqual([])
    })
  })

  describe('getMealPlanById', () => {
    it('should return meal plan by id', async () => {
      const mockData = {
        id: 1,
        user_id: 1,
        week_start_date: new Date('2025-01-06'),
        created_at: new Date('2025-01-01'),
        meal_plan_recipe: [],
      }

      mockMealPlanMethods.findUnique.mockResolvedValue(mockData)

      const result = await repository.getMealPlanById(1)

      expect(mockMealPlanMethods.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          meal_plan_recipe: {
            include: {
              recipe: {
                include: {
                  recipe_ingredients: {
                    include: { ingredients: true },
                  },
                },
              },
            },
          },
        },
      })
      expect(result).toBeDefined()
      expect(result?.id).toBe(1)
    })

    it('should return null when meal plan not found', async () => {
      mockMealPlanMethods.findUnique.mockResolvedValue(null)

      const result = await repository.getMealPlanById(999)

      expect(result).toBeNull()
    })
  })

  describe('getMealPlanForWeek', () => {
    it('should return meal plan for specific week', async () => {
      const mockData = {
        id: 1,
        user_id: 1,
        week_start_date: new Date('2025-01-06'),
        created_at: new Date('2025-01-01'),
        meal_plan_recipe: [],
      }

      mockMealPlanMethods.findUnique.mockResolvedValue(mockData)

      const result = await repository.getMealPlanForWeek(1, new Date('2025-01-08'))

      expect(mockMealPlanMethods.findUnique).toHaveBeenCalled()
      expect(result).toBeDefined()
    })

    it('should normalize date to Monday', async () => {
      const mockData = {
        id: 1,
        user_id: 1,
        week_start_date: new Date('2025-01-06'),
        created_at: new Date('2025-01-01'),
        meal_plan_recipe: [],
      }

      mockMealPlanMethods.findUnique.mockResolvedValue(mockData)

      await repository.getMealPlanForWeek(1, new Date('2025-01-08'))

      const callArgs = mockMealPlanMethods.findUnique.mock.calls[0][0]
      const passedDate = callArgs.where.user_id_week_start_date.week_start_date
      
      expect(passedDate.getDay()).toBe(1)
    })

    it('should return null when no plan exists for week', async () => {
      mockMealPlanMethods.findUnique.mockResolvedValue(null)

      const result = await repository.getMealPlanForWeek(1, new Date('2025-01-13'))

      expect(result).toBeNull()
    })
  })

  describe('createMealPlan', () => {
    it('should create new meal plan', async () => {
      const mockData = {
        id: 5,
        user_id: 1,
        week_start_date: new Date('2025-01-13'),
        created_at: new Date('2025-01-10'),
        meal_plan_recipe: [],
      }

      mockMealPlanMethods.upsert.mockResolvedValue(mockData)

      const result = await repository.createMealPlan(1, new Date('2025-01-13'))

      expect(mockMealPlanMethods.upsert).toHaveBeenCalled()
      expect(result.id).toBe(5)
      expect(result.user_id).toBe(1)
    })

    it('should normalize week_start_date to Monday', async () => {
      const mockData = {
        id: 5,
        user_id: 1,
        week_start_date: new Date('2025-01-13'),
        created_at: new Date('2025-01-10'),
        meal_plan_recipe: [],
      }

      mockMealPlanMethods.upsert.mockResolvedValue(mockData)

      await repository.createMealPlan(1, new Date('2025-01-15'))

      const callArgs = mockMealPlanMethods.upsert.mock.calls[0][0]
      const passedDate = callArgs.where.user_id_week_start_date.week_start_date
      
      expect(passedDate.getDay()).toBe(1)
    })
  })

  describe('deleteMealPlan', () => {
    it('should delete meal plan by id', async () => {
      mockMealPlanMethods.delete.mockResolvedValue({})

      await repository.deleteMealPlan(1)

      expect(mockMealPlanMethods.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })
  })

  describe('addRecipeToMealPlan', () => {
    it('should add recipe to meal plan', async () => {
      const mockData = {
        id: 10,
        plan_id: 1,
        recipe_id: 5,
        date: new Date('2025-01-06'),
        meal_type: 'lunch',
        planned_servings: 2,
      }

      mockMealPlanRecipeMethods.create.mockResolvedValue(mockData)

      await repository.addRecipeToMealPlan(
        1,
        5,
        new Date('2025-01-06'),
        'lunch',
        2
      )

      expect(mockMealPlanRecipeMethods.create).toHaveBeenCalled()
    })
  })

  describe('updateMealPlanRecipe', () => {
    it('should update planned servings', async () => {
      const mockData = {
        id: 10,
        plan_id: 1,
        recipe_id: 5,
        date: new Date('2025-01-06'),
        meal_type: 'lunch',
        planned_servings: 3,
      }

      mockMealPlanRecipeMethods.update.mockResolvedValue(mockData)

      await repository.updateMealPlanRecipe(10, 3)

      expect(mockMealPlanRecipeMethods.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: { planned_servings: 3 },
        include: {
          recipe: {
            include: {
              recipe_ingredients: {
                include: { ingredients: true },
              },
            },
          },
        },
      })
    })
  })

  describe('removeRecipeFromMealPlan', () => {
    it('should remove recipe from meal plan', async () => {
      mockMealPlanRecipeMethods.delete.mockResolvedValue({})

      await repository.removeRecipeFromMealPlan(10)

      expect(mockMealPlanRecipeMethods.delete).toHaveBeenCalledWith({
        where: { id: 10 },
      })
    })
  })
})
