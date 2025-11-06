/**
 * Recipe Repository
 * Manages recipe data access and ingredient composition
 */

import prisma from '../prisma/client';
import type { Recipe, CreateRecipeRequest, RecipeIngredient } from '../../shared/types';

export class RecipeRepository {
  async create(data: CreateRecipeRequest): Promise<Recipe> {
    return prisma.recette.create({
      data: {
        name: data.name,
        servings: data.servings,
        kcalPerServing: data.kcalPerServing,
        proteinGPerServing: data.proteinGPerServing,
        carbsGPerServing: data.carbsGPerServing,
        fatGPerServing: data.fatGPerServing,
        ...(data.userId && { userId: data.userId }),
      },
    }) as Promise<Recipe>;
  }

  async getById(id: bigint): Promise<Recipe | null> {
    return prisma.recette.findUnique({
      where: { id },
    }) as Promise<Recipe | null>;
  }

  async getAll(): Promise<Recipe[]> {
    return prisma.recette.findMany() as Promise<Recipe[]>;
  }

  async getByUser(userId: bigint): Promise<Recipe[]> {
    return prisma.recette.findMany({
      where: { userId },
    }) as Promise<Recipe[]>;
  }

  async update(id: bigint, data: Partial<CreateRecipeRequest>): Promise<Recipe> {
    return prisma.recette.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.servings && { servings: data.servings }),
        ...(data.kcalPerServing !== undefined && { kcalPerServing: data.kcalPerServing }),
        ...(data.proteinGPerServing !== undefined && { proteinGPerServing: data.proteinGPerServing }),
        ...(data.carbsGPerServing !== undefined && { carbsGPerServing: data.carbsGPerServing }),
        ...(data.fatGPerServing !== undefined && { fatGPerServing: data.fatGPerServing }),
      },
    }) as Promise<Recipe>;
  }

  async delete(id: bigint): Promise<void> {
    await prisma.recette.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return prisma.recette.count();
  }

  async addIngredient(recipeId: bigint, ingredientId: bigint, qtyGrams: number, notes?: string): Promise<RecipeIngredient> {
    return prisma.recetteIngredients.create({
      data: {
        recipeId,
        ingredientId,
        qtyGrams,
        notes,
      },
    }) as Promise<RecipeIngredient>;
  }

  async removeIngredient(recipeId: bigint, ingredientId: bigint): Promise<void> {
    await prisma.recetteIngredients.delete({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
    });
  }

  async getIngredients(recipeId: bigint) {
    return prisma.recetteIngredients.findMany({
      where: { recipeId },
      include: {
        ingredient: true,
      },
    });
  }

  async updateIngredient(recipeId: bigint, ingredientId: bigint, qtyGrams: number): Promise<RecipeIngredient> {
    return prisma.recetteIngredients.update({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
      data: { qtyGrams },
    }) as Promise<RecipeIngredient>;
  }

  async getWithDetails(id: bigint) {
    return prisma.recette.findUnique({
      where: { id },
      include: {
        recetteIngredients: {
          include: {
            ingredient: true,
          },
        },
        user: true,
      },
    });
  }

  async searchByName(query: string): Promise<Recipe[]> {
    return prisma.recette.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    }) as Promise<Recipe[]>;
  }

  async getHighProteinRecipes(minProtein: number = 30): Promise<Recipe[]> {
    return prisma.recette.findMany({
      where: {
        proteinGPerServing: { gte: minProtein },
      },
      orderBy: { proteinGPerServing: 'desc' },
    }) as Promise<Recipe[]>;
  }

  async getLowCalorieRecipes(maxKcal: number = 400): Promise<Recipe[]> {
    return prisma.recette.findMany({
      where: {
        kcalPerServing: { lte: maxKcal },
      },
      orderBy: { kcalPerServing: 'asc' },
    }) as Promise<Recipe[]>;
  }

  async getRecipesWithIngredientsCount() {
    return prisma.recette.findMany({
      include: {
        _count: {
          select: { recetteIngredients: true },
        },
      },
    });
  }

  async getPublicRecipes(): Promise<Recipe[]> {
    return prisma.recette.findMany({
      where: { userId: null },
    }) as Promise<Recipe[]>;
  }
}

export const recipeRepository = new RecipeRepository();
