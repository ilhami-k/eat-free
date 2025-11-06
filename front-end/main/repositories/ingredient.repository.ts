/**
 * Ingredient Repository
 * 
 * All operations related to ingredients (global catalog).
 */

import prisma from '../prisma/client';

/**
 * Create a new ingredient
 */
export async function create(
  name: string,
  kcalPer100g: number,
  proteinGPer100g: number,
  carbsGPer100g: number,
  fatGPer100g: number
) {
  return prisma.ingredients.create({
    data: {
      name,
      kcalPer100g,
      proteinGPer100g,
      carbsGPer100g,
      fatGPer100g,
    },
  });
}

/**
 * Get ingredient by ID
 */
export async function getById(id: bigint) {
  return prisma.ingredients.findUnique({
    where: { id },
  });
}

/**
 * Get ingredient by name
 */
export async function getByName(name: string) {
  return prisma.ingredients.findUnique({
    where: { name },
  });
}

/**
 * Get all ingredients
 */
export async function getAll() {
  return prisma.ingredients.findMany({
    orderBy: { name: 'asc' },
  });
}

/**
 * Search ingredients by name
 */
export async function search(query: string) {
  return prisma.ingredients.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    orderBy: { name: 'asc' },
  });
}

/**
 * Update ingredient
 */
export async function update(
  id: bigint,
  data: {
    name?: string;
    kcalPer100g?: number;
    proteinGPer100g?: number;
    carbsGPer100g?: number;
    fatGPer100g?: number;
  }
) {
  return prisma.ingredients.update({
    where: { id },
    data,
  });
}

/**
 * Delete ingredient
 */
export async function deleteIngredient(id: bigint) {
  return prisma.ingredients.delete({
    where: { id },
  });
}

/**
 * Get ingredient count
 */
export async function count() {
  return prisma.ingredients.count();
}

/**
 * Get ingredients by nutrition range
 */
export async function getByNutritionRange(minKcal?: number, maxKcal?: number) {
  return prisma.ingredients.findMany({
    where: {
      AND: [
        minKcal ? { kcalPer100g: { gte: minKcal } } : {},
        maxKcal ? { kcalPer100g: { lte: maxKcal } } : {},
      ],
    },
    orderBy: { kcalPer100g: 'desc' },
  });
}

/**
 * Get ingredients with their recipe usage count
 */
export async function getWithUsageCount() {
  return prisma.ingredients.findMany({
    include: {
      ingredientsRecette: {
        select: { recipeId: true },
      },
      ingredientInventaire: {
        select: { inventaireId: true },
      },
    },
    orderBy: { name: 'asc' },
  });
}
