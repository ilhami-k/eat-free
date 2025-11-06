/**
 * Journal Repository
 * 
 * All operations related to meal logging (food journal/diary).
 */

import prisma from '../prisma/client';

/**
 * Log a meal
 */
export async function logMeal(
  userId: bigint,
  recipeId: bigint,
  servingsEaten: number,
  kcal: number,
  proteinG: number,
  carbsG: number,
  fatG: number
) {
  return prisma.journal.create({
    data: {
      userId,
      recipeId,
      servingsEaten,
      loggedAt: new Date(),
      kcal,
      proteinG,
      carbsG,
      fatG,
    },
  });
}

/**
 * Get journal entry by ID
 */
export async function getById(id: bigint) {
  return prisma.journal.findUnique({
    where: { id },
    include: {
      recette: true,
    },
  });
}

/**
 * Get all journal entries for a user
 */
export async function getByUserId(userId: bigint) {
  return prisma.journal.findMany({
    where: { userId },
    include: {
      recette: true,
    },
    orderBy: { loggedAt: 'desc' },
  });
}

/**
 * Get journal entries for a user within a date range
 */
export async function getByDateRange(userId: bigint, startDate: Date, endDate: Date) {
  return prisma.journal.findMany({
    where: {
      userId,
      loggedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      recette: true,
    },
    orderBy: { loggedAt: 'desc' },
  });
}

/**
 * Get journal entries for a specific date
 */
export async function getByDate(userId: bigint, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.journal.findMany({
    where: {
      userId,
      loggedAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      recette: true,
    },
    orderBy: { loggedAt: 'asc' },
  });
}

/**
 * Update journal entry
 */
export async function update(
  id: bigint,
  data: {
    servingsEaten?: number;
    kcal?: number;
    proteinG?: number;
    carbsG?: number;
    fatG?: number;
  }
) {
  return prisma.journal.update({
    where: { id },
    data,
  });
}

/**
 * Delete journal entry
 */
export async function deleteEntry(id: bigint) {
  return prisma.journal.delete({
    where: { id },
  });
}

/**
 * Get journal entry count for a user
 */
export async function countByUser(userId: bigint) {
  return prisma.journal.count({
    where: { userId },
  });
}

/**
 * Get daily nutrition totals
 */
export async function getDailyNutrition(userId: bigint, date: Date) {
  const entries = await getByDate(userId, date);

  const totals = {
    mealCount: entries.length,
    totalKcal: 0,
    totalProteinG: 0,
    totalCarbsG: 0,
    totalFatG: 0,
    meals: entries,
  };

  entries.forEach((entry) => {
    totals.totalKcal += entry.kcal;
    totals.totalProteinG += entry.proteinG;
    totals.totalCarbsG += entry.carbsG;
    totals.totalFatG += entry.fatG;
  });

  return totals;
}

/**
 * Get weekly nutrition summary
 */
export async function getWeeklyNutrition(userId: bigint, weekStartDate: Date) {
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 7);

  const entries = await getByDateRange(userId, weekStartDate, weekEndDate);

  const dailySummary: Record<string, any> = {};

  entries.forEach((entry) => {
    const dateKey = entry.loggedAt.toISOString().split('T')[0];
    if (!dailySummary[dateKey]) {
      dailySummary[dateKey] = {
        mealCount: 0,
        totalKcal: 0,
        totalProteinG: 0,
        totalCarbsG: 0,
        totalFatG: 0,
      };
    }

    dailySummary[dateKey].mealCount += 1;
    dailySummary[dateKey].totalKcal += entry.kcal;
    dailySummary[dateKey].totalProteinG += entry.proteinG;
    dailySummary[dateKey].totalCarbsG += entry.carbsG;
    dailySummary[dateKey].totalFatG += entry.fatG;
  });

  const weekTotals = {
    weekStartDate,
    dayCount: Object.keys(dailySummary).length,
    mealCount: entries.length,
    totalKcal: 0,
    totalProteinG: 0,
    totalCarbsG: 0,
    totalFatG: 0,
    dailySummary,
  };

  Object.values(dailySummary).forEach((day: any) => {
    weekTotals.totalKcal += day.totalKcal;
    weekTotals.totalProteinG += day.totalProteinG;
    weekTotals.totalCarbsG += day.totalCarbsG;
    weekTotals.totalFatG += day.totalFatG;
  });

  return weekTotals;
}

/**
 * Get average daily nutrition for a user (last 30 days)
 */
export async function getAverageDailyNutrition(userId: bigint) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const entries = await getByDateRange(userId, thirtyDaysAgo, new Date());

  if (entries.length === 0) {
    return null;
  }

  const uniqueDays = new Set<string>();
  entries.forEach((entry) => {
    uniqueDays.add(entry.loggedAt.toISOString().split('T')[0]);
  });

  const totals = {
    totalKcal: 0,
    totalProteinG: 0,
    totalCarbsG: 0,
    totalFatG: 0,
    mealCount: entries.length,
  };

  entries.forEach((entry) => {
    totals.totalKcal += entry.kcal;
    totals.totalProteinG += entry.proteinG;
    totals.totalCarbsG += entry.carbsG;
    totals.totalFatG += entry.fatG;
  });

  return {
    periodDays: uniqueDays.size,
    avgDailyKcal: Math.round((totals.totalKcal / uniqueDays.size) * 100) / 100,
    avgDailyProteinG: Math.round((totals.totalProteinG / uniqueDays.size) * 100) / 100,
    avgDailyCarbsG: Math.round((totals.totalCarbsG / uniqueDays.size) * 100) / 100,
    avgDailyFatG: Math.round((totals.totalFatG / uniqueDays.size) * 100) / 100,
    totalMealsLogged: totals.mealCount,
  };
}

/**
 * Get most frequently logged recipes
 */
export async function getTopRecipes(userId: bigint, limit: number = 5) {
  const entries = await getByUserId(userId);

  const recipeCount: Record<string, { recipeId: bigint; name: string; count: number }> = {};

  entries.forEach((entry) => {
    const key = entry.recipeId.toString();
    if (!recipeCount[key]) {
      recipeCount[key] = {
        recipeId: entry.recipeId,
        name: entry.recette.name,
        count: 0,
      };
    }
    recipeCount[key].count += 1;
  });

  return Object.values(recipeCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
