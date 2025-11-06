/**
 * Ingredient Repository
 * Manages ingredient catalog data access
 */

import prisma from '../prisma/client';
import type { Ingredient, CreateIngredientRequest } from '../../shared/types';

export class IngredientRepository {
  async create(data: CreateIngredientRequest): Promise<Ingredient> {
    return prisma.ingredients.create({
      data,
    }) as Promise<Ingredient>;
  }

  async search(query: string): Promise<Ingredient[]> {
    return prisma.ingredients.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    }) as Promise<Ingredient[]>;
  }

  async getById(id: bigint): Promise<Ingredient | null> {
    return prisma.ingredients.findUnique({
      where: { id },
    }) as Promise<Ingredient | null>;
  }

  async getAll(): Promise<Ingredient[]> {
    return prisma.ingredients.findMany() as Promise<Ingredient[]>;
  }

  async getByNutritionRange(
    minKcal: number,
    maxKcal: number,
    minProtein: number,
    maxProtein: number
  ): Promise<Ingredient[]> {
    return prisma.ingredients.findMany({
      where: {
        AND: [
          { kcalPer100g: { gte: minKcal, lte: maxKcal } },
          { proteinGPer100g: { gte: minProtein, lte: maxProtein } },
        ],
      },
    }) as Promise<Ingredient[]>;
  }

  async getHighProteinIngredients(minProtein: number = 15): Promise<Ingredient[]> {
    return prisma.ingredients.findMany({
      where: {
        proteinGPer100g: { gte: minProtein },
      },
      orderBy: { proteinGPer100g: 'desc' },
    }) as Promise<Ingredient[]>;
  }

  async getLowCalorieIngredients(maxKcal: number = 100): Promise<Ingredient[]> {
    return prisma.ingredients.findMany({
      where: {
        kcalPer100g: { lte: maxKcal },
      },
      orderBy: { kcalPer100g: 'asc' },
    }) as Promise<Ingredient[]>;
  }

  async getWithUsageCount(): Promise<any[]> {
    return prisma.ingredients.findMany({
      include: {
        _count: {
          select: { recetteIngredients: true },
        },
      },
    });
  }

  async count(): Promise<number> {
    return prisma.ingredients.count();
  }

  async update(id: bigint, data: Partial<CreateIngredientRequest>): Promise<Ingredient> {
    return prisma.ingredients.update({
      where: { id },
      data,
    }) as Promise<Ingredient>;
  }

  async delete(id: bigint): Promise<void> {
    await prisma.ingredients.delete({
      where: { id },
    });
  }
}

export const ingredientRepository = new IngredientRepository();
