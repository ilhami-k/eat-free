/**
 * Journal Repository
 * Manages food logging and nutrition analytics
 */

import prisma from '../prisma/client';
import type { JournalEntry, LogMealRequest } from '../../shared/types';

export class JournalRepository {
  async logMeal(data: LogMealRequest): Promise<JournalEntry> {
    return prisma.journal.create({
      data: {
        userId: data.userId,
        recipeId: data.recipeId,
        servingsEaten: data.servingsEaten,
        kcal: data.kcal,
        proteinG: data.proteinG,
        carbsG: data.carbsG,
        fatG: data.fatG,
      },
    }) as Promise<JournalEntry>;
  }

  async getById(id: bigint): Promise<JournalEntry | null> {
    return prisma.journal.findUnique({
      where: { id },
    }) as Promise<JournalEntry | null>;
  }

  async getByUser(userId: bigint): Promise<JournalEntry[]> {
    return prisma.journal.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
    }) as Promise<JournalEntry[]>;
  }

  async getByDateRange(userId: bigint, startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    return prisma.journal.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { loggedAt: 'desc' },
    }) as Promise<JournalEntry[]>;
  }

  async getDailyNutrition(userId: bigint, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const entries = await prisma.journal.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return entries.reduce(
      (acc, entry) => ({
        kcal: acc.kcal + entry.kcal,
        protein: acc.protein + entry.proteinG,
        carbs: acc.carbs + entry.carbsG,
        fat: acc.fat + entry.fatG,
        mealCount: acc.mealCount + 1,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0 }
    );
  }

  async getAverageDailyNutrition(userId: bigint, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await this.getByDateRange(userId, startDate, new Date());

    const groupedByDay: { [key: string]: any[] } = {};
    for (const entry of entries) {
      const dateKey = entry.loggedAt.toDateString();
      if (!groupedByDay[dateKey]) {
        groupedByDay[dateKey] = [];
      }
      groupedByDay[dateKey].push(entry);
    }

    const dailyTotals = Object.values(groupedByDay).map((dayEntries: any[]) =>
      dayEntries.reduce(
        (acc: any, entry: any) => ({
          kcal: acc.kcal + entry.kcal,
          protein: acc.protein + entry.proteinG,
          carbs: acc.carbs + entry.carbsG,
          fat: acc.fat + entry.fatG,
        }),
        { kcal: 0, protein: 0, carbs: 0, fat: 0 }
      )
    );

    const numDays = dailyTotals.length || 1;
    const totalNutrition = dailyTotals.reduce(
      (acc: any, day: any) => ({
        kcal: acc.kcal + day.kcal,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      averageKcal: totalNutrition.kcal / numDays,
      averageProtein: totalNutrition.protein / numDays,
      averageCarbs: totalNutrition.carbs / numDays,
      averageFat: totalNutrition.fat / numDays,
    };
  }

  async delete(id: bigint): Promise<void> {
    await prisma.journal.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return prisma.journal.count();
  }

  async countByUser(userId: bigint): Promise<number> {
    return prisma.journal.count({
      where: { userId },
    });
  }

  async getMostLoggedRecipes(userId: bigint, limit: number = 10) {
    const entries = await prisma.journal.findMany({
      where: { userId },
      include: { recipe: true },
    });

    const grouped: { [key: bigint]: { recipe: any; count: number } } = {};
    for (const entry of entries) {
      if (!grouped[entry.recipeId]) {
        grouped[entry.recipeId] = { recipe: entry.recipe, count: 0 };
      }
      grouped[entry.recipeId].count += 1;
    }

    return Object.values(grouped)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}

export const journalRepository = new JournalRepository();
