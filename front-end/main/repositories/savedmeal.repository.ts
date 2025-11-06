/**
 * Saved Meal Repository
 * 
 * All operations related to saved/favorite meals.
 */

import prisma from '../prisma/client';

/**
 * Create a saved meal
 */
export async function create(
  userId: bigint,
  name: string,
  recipeId: bigint,
  defaultServings: number = 1
) {
  return prisma.repasEnregistre.create({
    data: {
      userId,
      name,
      recipeId,
      defaultServings,
    },
  });
}

/**
 * Get saved meal by ID
 */
export async function getById(id: bigint) {
  return prisma.repasEnregistre.findUnique({
    where: { id },
    include: {
      recette: true,
    },
  });
}

/**
 * Get all saved meals for a user
 */
export async function getByUserId(userId: bigint) {
  return prisma.repasEnregistre.findMany({
    where: { userId },
    include: {
      recette: true,
    },
    orderBy: { name: 'asc' },
  });
}

/**
 * Get all saved meals
 */
export async function getAll() {
  return prisma.repasEnregistre.findMany({
    include: {
      recette: true,
      utilisateur: true,
    },
    orderBy: { utilisateur: { name: 'asc' } },
  });
}

/**
 * Update saved meal
 */
export async function update(
  id: bigint,
  data: {
    name?: string;
    recipeId?: bigint;
    defaultServings?: number;
  }
) {
  return prisma.repasEnregistre.update({
    where: { id },
    data,
  });
}

/**
 * Delete saved meal
 */
export async function deleteSavedMeal(id: bigint) {
  return prisma.repasEnregistre.delete({
    where: { id },
  });
}

/**
 * Get saved meal count for a user
 */
export async function countByUser(userId: bigint) {
  return prisma.repasEnregistre.count({
    where: { userId },
  });
}

/**
 * Get nutrition for saved meal with default servings
 */
export async function getDefaultNutrition(id: bigint) {
  const savedMeal = await prisma.repasEnregistre.findUnique({
    where: { id },
    include: {
      recette: true,
    },
  });

  if (!savedMeal) return null;

  return {
    id: savedMeal.id,
    name: savedMeal.name,
    recipeName: savedMeal.recette.name,
    defaultServings: savedMeal.defaultServings,
    kcal: savedMeal.recette.kcalPerServing * savedMeal.defaultServings,
    proteinG: savedMeal.recette.proteinGPerServing * savedMeal.defaultServings,
    carbsG: savedMeal.recette.carbsGPerServing * savedMeal.defaultServings,
    fatG: savedMeal.recette.fatGPerServing * savedMeal.defaultServings,
  };
}

/**
 * Quick-log a saved meal (creates a journal entry)
 */
export async function quickLog(userId: bigint, savedMealId: bigint) {
  const savedMeal = await prisma.repasEnregistre.findUnique({
    where: { id: savedMealId },
    include: {
      recette: true,
    },
  });

  if (!savedMeal) throw new Error('Saved meal not found');

  return prisma.journal.create({
    data: {
      userId,
      recipeId: savedMeal.recipeId,
      servingsEaten: savedMeal.defaultServings,
      loggedAt: new Date(),
      kcal: savedMeal.recette.kcalPerServing * savedMeal.defaultServings,
      proteinG: savedMeal.recette.proteinGPerServing * savedMeal.defaultServings,
      carbsG: savedMeal.recette.carbsGPerServing * savedMeal.defaultServings,
      fatG: savedMeal.recette.fatGPerServing * savedMeal.defaultServings,
    },
  });
}

/**
 * Search saved meals by name
 */
export async function search(userId: bigint, query: string) {
  return prisma.repasEnregistre.findMany({
    where: {
      userId,
      name: {
        contains: query,
      },
    },
    include: {
      recette: true,
    },
    orderBy: { name: 'asc' },
  });
}
