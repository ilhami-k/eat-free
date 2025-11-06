/**
 * Meal Plan Repository
 * 
 * All operations related to weekly meal planning.
 */

import prisma from '../prisma/client';

/**
 * Create a meal plan for a user
 */
export async function create(userId: bigint, weekStartDate: Date) {
  return prisma.plansRepas.create({
    data: {
      userId,
      weekStartDate,
    },
  });
}

/**
 * Get meal plan by ID
 */
export async function getById(id: bigint) {
  return prisma.plansRepas.findUnique({
    where: { id },
  });
}

/**
 * Get meal plan with all planned meals
 */
export async function getWithMeals(id: bigint) {
  return prisma.plansRepas.findUnique({
    where: { id },
    include: {
      plansRepasRecette: {
        include: {
          recette: true,
        },
        orderBy: [{ date: 'asc' }, { mealType: 'asc' }],
      },
    },
  });
}

/**
 * Get all meal plans for a user
 */
export async function getByUserId(userId: bigint) {
  return prisma.plansRepas.findMany({
    where: { userId },
    orderBy: { weekStartDate: 'desc' },
  });
}

/**
 * Get meal plan for a specific week
 */
export async function getByWeek(userId: bigint, weekStartDate: Date) {
  return prisma.plansRepas.findUnique({
    where: {
      userId_weekStartDate: {
        userId,
        weekStartDate,
      },
    },
    include: {
      plansRepasRecette: {
        include: {
          recette: true,
        },
      },
    },
  });
}

/**
 * Get all meal plans
 */
export async function getAll() {
  return prisma.plansRepas.findMany({
    orderBy: { weekStartDate: 'desc' },
  });
}

/**
 * Update meal plan
 */
export async function update(id: bigint, weekStartDate: Date) {
  return prisma.plansRepas.update({
    where: { id },
    data: {
      weekStartDate,
    },
  });
}

/**
 * Delete meal plan
 */
export async function deletePlan(id: bigint) {
  return prisma.plansRepas.delete({
    where: { id },
  });
}

/**
 * Get meal plan count for a user
 */
export async function countByUser(userId: bigint) {
  return prisma.plansRepas.count({
    where: { userId },
  });
}

/**
 * Add recipe to meal plan
 */
export async function addMeal(
  planId: bigint,
  date: Date,
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  recipeId: bigint,
  plannedServings: number = 1
) {
  return prisma.plansRepasRecette.create({
    data: {
      planId,
      date,
      mealType,
      recipeId,
      plannedServings,
    },
  });
}

/**
 * Get meals for a specific day in a plan
 */
export async function getMealsForDay(planId: bigint, date: Date) {
  return prisma.plansRepasRecette.findMany({
    where: {
      planId,
      date,
    },
    include: {
      recette: true,
    },
    orderBy: { mealType: 'asc' },
  });
}

/**
 * Remove meal from plan
 */
export async function removeMeal(mealId: bigint) {
  return prisma.plansRepasRecette.delete({
    where: { id: mealId },
  });
}

/**
 * Update meal in plan
 */
export async function updateMeal(mealId: bigint, plannedServings: number) {
  return prisma.plansRepasRecette.update({
    where: { id: mealId },
    data: {
      plannedServings,
    },
  });
}

/**
 * Get daily nutrition totals for a planned day
 */
export async function getDayNutrition(planId: bigint, date: Date) {
  const meals = await prisma.plansRepasRecette.findMany({
    where: {
      planId,
      date,
    },
    include: {
      recette: true,
    },
  });

  const totals = {
    mealCount: meals.length,
    totalKcal: 0,
    totalProteinG: 0,
    totalCarbsG: 0,
    totalFatG: 0,
  };

  meals.forEach((meal) => {
    totals.totalKcal += meal.recette.kcalPerServing * meal.plannedServings;
    totals.totalProteinG += meal.recette.proteinGPerServing * meal.plannedServings;
    totals.totalCarbsG += meal.recette.carbsGPerServing * meal.plannedServings;
    totals.totalFatG += meal.recette.fatGPerServing * meal.plannedServings;
  });

  return totals;
}

/**
 * Get weekly nutrition totals
 */
export async function getWeekNutrition(planId: bigint) {
  const plan = await prisma.plansRepas.findUnique({
    where: { id: planId },
    include: {
      plansRepasRecette: {
        include: {
          recette: true,
        },
      },
    },
  });

  if (!plan) return null;

  const totals = {
    mealCount: plan.plansRepasRecette.length,
    totalKcal: 0,
    totalProteinG: 0,
    totalCarbsG: 0,
    totalFatG: 0,
  };

  plan.plansRepasRecette.forEach((meal) => {
    totals.totalKcal += meal.recette.kcalPerServing * meal.plannedServings;
    totals.totalProteinG += meal.recette.proteinGPerServing * meal.plannedServings;
    totals.totalCarbsG += meal.recette.carbsGPerServing * meal.plannedServings;
    totals.totalFatG += meal.recette.fatGPerServing * meal.plannedServings;
  });

  return totals;
}
