/**
 * Inventory Repository
 * Manages user inventory/stock tracking
 */

import prisma from '../prisma/client';
import type { InventoryIngredient } from '../../shared/types';

export class InventoryRepository {
  async createForUser(userId: bigint) {
    return prisma.inventaire.create({
      data: { userId },
    });
  }

  async getByUserId(userId: bigint) {
    return prisma.inventaire.findFirst({
      where: { userId },
      include: { inventaireIngredients: true },
    });
  }

  async addOrUpdateIngredient(inventaireId: bigint, ingredientId: bigint, qtyGrams: number): Promise<InventoryIngredient> {
    return prisma.inventaireIngredients.upsert({
      where: {
        inventaireId_ingredientId: {
          inventaireId,
          ingredientId,
        },
      },
      create: {
        inventaireId,
        ingredientId,
        qtyGrams,
      },
      update: { qtyGrams },
    }) as Promise<InventoryIngredient>;
  }

  async removeIngredient(inventaireId: bigint, ingredientId: bigint): Promise<void> {
    await prisma.inventaireIngredients.delete({
      where: {
        inventaireId_ingredientId: {
          inventaireId,
          ingredientId,
        },
      },
    });
  }

  async getIngredients(inventaireId: bigint) {
    return prisma.inventaireIngredients.findMany({
      where: { inventaireId },
      include: { ingredient: true },
    });
  }

  async canMakeRecipe(inventaireId: bigint, recipeId: bigint): Promise<boolean> {
    const recipe = await prisma.recette.findUnique({
      where: { id: recipeId },
      include: { recetteIngredients: true },
    });

    if (!recipe) return false;

    for (const recipeIng of recipe.recetteIngredients) {
      const invIng = await prisma.inventaireIngredients.findUnique({
        where: {
          inventaireId_ingredientId: {
            inventaireId,
            ingredientId: recipeIng.ingredientId,
          },
        },
      });

      if (!invIng || invIng.qtyGrams < recipeIng.qtyGrams) {
        return false;
      }
    }

    return true;
  }

  async consumeRecipe(inventaireId: bigint, recipeId: bigint): Promise<void> {
    const recipe = await prisma.recette.findUnique({
      where: { id: recipeId },
      include: { recetteIngredients: true },
    });

    if (!recipe) throw new Error('Recipe not found');

    for (const recipeIng of recipe.recetteIngredients) {
      await prisma.inventaireIngredients.update({
        where: {
          inventaireId_ingredientId: {
            inventaireId,
            ingredientId: recipeIng.ingredientId,
          },
        },
        data: {
          qtyGrams: {
            decrement: recipeIng.qtyGrams,
          },
        },
      });
    }
  }

  async getTotalValue(inventaireId: bigint): Promise<number> {
    const ingredients = await prisma.inventaireIngredients.findMany({
      where: { inventaireId },
      include: { ingredient: true },
    });

    return ingredients.reduce((total, item) => {
      const ingredientValue = (item.ingredient.kcalPer100g * item.qtyGrams) / 100;
      return total + ingredientValue;
    }, 0);
  }

  async getEstimatedNutrition(inventaireId: bigint) {
    const ingredients = await prisma.inventaireIngredients.findMany({
      where: { inventaireId },
      include: { ingredient: true },
    });

    return ingredients.reduce(
      (acc, item) => ({
        kcal: acc.kcal + (item.ingredient.kcalPer100g * item.qtyGrams) / 100,
        protein: acc.protein + (item.ingredient.proteinGPer100g * item.qtyGrams) / 100,
        carbs: acc.carbs + (item.ingredient.carbsGPer100g * item.qtyGrams) / 100,
        fat: acc.fat + (item.ingredient.fatGPer100g * item.qtyGrams) / 100,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  async clearExpired(inventaireId: bigint, thresholdDays: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - thresholdDays);

    const deleted = await prisma.inventaireIngredients.deleteMany({
      where: {
        inventaireId,
        createdAt: { lt: cutoffDate },
      },
    });

    return deleted.count;
  }

  async getUsageTrends(inventaireId: bigint, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.inventaireIngredients.findMany({
      where: {
        inventaireId,
        createdAt: { gte: startDate },
      },
      include: { ingredient: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCount(): Promise<number> {
    return prisma.inventaire.count();
  }
}

export const inventoryRepository = new InventoryRepository();
