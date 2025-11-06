/**
 * Recipe Repository
 * 
 * All operations related to recipes (both global and user-specific).
 */

import prisma from '../prisma/client';

/**
 * Create a new recipe
 */
export async function create(
  name: string,
  servings: number,
  kcalPerServing: number,
  proteinGPerServing: number,
  carbsGPerServing: number,
  fatGPerServing: number,
  userId?: bigint
) {
  return prisma.recette.create({
    data: {
      name,
      servings,
      kcalPerServing,
      proteinGPerServing,
      carbsGPerServing,
      fatGPerServing,
      userId,
    },
  });
}

/**
 * Get recipe by ID
 */
export async function getById(id: bigint) {
  return prisma.recette.findUnique({
    where: { id },
  });
}

/**
 * Get recipe with all ingredients
 */
export async function getWithIngredients(id: bigint) {
  return prisma.recette.findUnique({
    where: { id },
    include: {
      ingredientsRecette: {
        include: {
          ingredient: true,
        },
      },
    },
  });
}

/**
 * Get all recipes by user ID
 */
export async function getByUserId(userId: bigint) {
  return prisma.recette.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get all global recipes (admin recipes, user_id = NULL)
 */
export async function getGlobalRecipes() {
  return prisma.recette.findMany({
    where: { userId: null },
    orderBy: { name: 'asc' },
  });
}

/**
 * Get all recipes (both global and user-specific)
 */
export async function getAll() {
  return prisma.recette.findMany({
    orderBy: [{ userId: 'asc' }, { name: 'asc' }],
  });
}

/**
 * Search recipes by name
 */
export async function search(query: string) {
  return prisma.recette.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    orderBy: { name: 'asc' },
  });
}

/**
 * Update recipe
 */
export async function update(
  id: bigint,
  data: {
    name?: string;
    servings?: number;
    kcalPerServing?: number;
    proteinGPerServing?: number;
    carbsGPerServing?: number;
    fatGPerServing?: number;
  }
) {
  return prisma.recette.update({
    where: { id },
    data,
  });
}

/**
 * Delete recipe
 */
export async function deleteRecipe(id: bigint) {
  return prisma.recette.delete({
    where: { id },
  });
}

/**
 * Get recipe count
 */
export async function count() {
  return prisma.recette.count();
}

/**
 * Get recipe count for a specific user
 */
export async function countByUser(userId: bigint) {
  return prisma.recette.count({
    where: { userId },
  });
}

/**
 * Get recipes available to a user (global + their own)
 */
export async function getAvailableToUser(userId: bigint) {
  return prisma.recette.findMany({
    where: {
      OR: [{ userId: null }, { userId }],
    },
    orderBy: [{ userId: 'asc' }, { name: 'asc' }],
  });
}

/**
 * Add ingredient to recipe
 */
export async function addIngredient(recipeId: bigint, ingredientId: bigint, qtyGrams: number, notes?: string) {
  return prisma.ingredientsRecette.create({
    data: {
      recipeId,
      ingredientId,
      qtyGrams,
      notes,
    },
  });
}

/**
 * Get recipe ingredients with details
 */
export async function getIngredientsDetailed(recipeId: bigint) {
  return prisma.ingredientsRecette.findMany({
    where: { recipeId },
    include: {
      ingredient: true,
    },
    orderBy: { ingredient: { name: 'asc' } },
  });
}

/**
 * Remove ingredient from recipe
 */
export async function removeIngredient(recipeId: bigint, ingredientId: bigint) {
  return prisma.ingredientsRecette.delete({
    where: {
      recipeId_ingredientId: {
        recipeId,
        ingredientId,
      },
    },
  });
}

/**
 * Update ingredient quantity in recipe
 */
export async function updateIngredientQty(recipeId: bigint, ingredientId: bigint, qtyGrams: number) {
  return prisma.ingredientsRecette.update({
    where: {
      recipeId_ingredientId: {
        recipeId,
        ingredientId,
      },
    },
    data: {
      qtyGrams,
    },
  });
}
