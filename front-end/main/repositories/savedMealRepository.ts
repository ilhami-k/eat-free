/**
 * Saved Meal Repository
 * Manages favorite/saved meals for quick logging
 */

import prisma from '../prisma/client';
import type { SavedMeal } from '../../shared/types';

export class SavedMealRepository {
  async create(userId: bigint, name: string, recipeId: bigint, defaultServings: number = 1): Promise<SavedMeal> {
    return prisma.repasEnregistre.create({
      data: {
        userId,
        name,
        recipeId,
        defaultServings,
      },
    }) as Promise<SavedMeal>;
  }

  async getById(id: bigint): Promise<SavedMeal | null> {
    return prisma.repasEnregistre.findUnique({
      where: { id },
    }) as Promise<SavedMeal | null>;
  }

  async getByUser(userId: bigint): Promise<SavedMeal[]> {
    return prisma.repasEnregistre.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<SavedMeal[]>;
  }

  async update(id: bigint, name?: string, defaultServings?: number): Promise<SavedMeal> {
    return prisma.repasEnregistre.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(defaultServings && { defaultServings }),
      },
    }) as Promise<SavedMeal>;
  }

  async delete(id: bigint): Promise<void> {
    await prisma.repasEnregistre.delete({
      where: { id },
    });
  }

  async quickLog(userId: bigint, savedMealId: bigint, servings?: number) {
    const savedMeal = await prisma.repasEnregistre.findUnique({
      where: { id: savedMealId },
      include: { recipe: true },
    });

    if (!savedMeal) throw new Error('Saved meal not found');

    const servingsToLog = servings ?? savedMeal.defaultServings;
    const recipe = savedMeal.recipe;

    return prisma.journal.create({
      data: {
        userId,
        recipeId: recipe.id,
        servingsEaten: servingsToLog,
        kcal: recipe.kcalPerServing * servingsToLog,
        proteinG: recipe.proteinGPerServing * servingsToLog,
        carbsG: recipe.carbsGPerServing * servingsToLog,
        fatG: recipe.fatGPerServing * servingsToLog,
      },
    });
  }

  async getDefaultNutrition(savedMealId: bigint) {
    const savedMeal = await prisma.repasEnregistre.findUnique({
      where: { id: savedMealId },
      include: { recipe: true },
    });

    if (!savedMeal) return null;

    return {
      kcal: savedMeal.recipe.kcalPerServing * savedMeal.defaultServings,
      protein: savedMeal.recipe.proteinGPerServing * savedMeal.defaultServings,
      carbs: savedMeal.recipe.carbsGPerServing * savedMeal.defaultServings,
      fat: savedMeal.recipe.fatGPerServing * savedMeal.defaultServings,
    };
  }

  async getMostUsed(userId: bigint, limit: number = 5) {
    return prisma.repasEnregistre.findMany({
      where: { userId },
      include: {
        _count: {
          select: { recipe: true },
        },
      },
      take: limit,
    });
  }

  async count(): Promise<number> {
    return prisma.repasEnregistre.count();
  }

  async countByUser(userId: bigint): Promise<number> {
    return prisma.repasEnregistre.count({
      where: { userId },
    });
  }
}

export const savedMealRepository = new SavedMealRepository();
