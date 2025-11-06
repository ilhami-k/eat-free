/**
 * Meal Plan Repository
 * Manages meal planning data
 */

import prisma from '../prisma/client';
import type { MealPlan, MealPlanRecipe } from '../../shared/types';

export class MealPlanRepository {
  async create(userId: bigint, weekStartDate: Date): Promise<MealPlan> {
    return prisma.plansRepas.create({
      data: {
        userId,
        weekStartDate,
      },
    }) as Promise<MealPlan>;
  }

  async getById(id: bigint): Promise<MealPlan | null> {
    return prisma.plansRepas.findUnique({
      where: { id },
    }) as Promise<MealPlan | null>;
  }

  async getByUser(userId: bigint): Promise<MealPlan[]> {
    return prisma.plansRepas.findMany({
      where: { userId },
      orderBy: { weekStartDate: 'desc' },
    }) as Promise<MealPlan[]>;
  }

  async getCurrentWeek(userId: bigint) {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    return prisma.plansRepas.findFirst({
      where: {
        userId,
        weekStartDate: { lte: today },
      },
      orderBy: { weekStartDate: 'desc' },
      include: { planRecettes: true },
    });
  }

  async addMeal(
    planId: bigint,
    date: Date,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    recipeId: bigint,
    plannedServings: number = 1
  ): Promise<MealPlanRecipe> {
    return prisma.planRecettes.create({
      data: {
        planId,
        date,
        mealType,
        recipeId,
        plannedServings,
      },
    }) as Promise<MealPlanRecipe>;
  }

  async removeMeal(mealId: bigint): Promise<void> {
    await prisma.planRecettes.delete({
      where: { id: mealId },
    });
  }

  async updateMeal(mealId: bigint, plannedServings: number): Promise<MealPlanRecipe> {
    return prisma.planRecettes.update({
      where: { id: mealId },
      data: { plannedServings },
    }) as Promise<MealPlanRecipe>;
  }

  async getMealsForDate(planId: bigint, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.planRecettes.findMany({
      where: {
        planId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: { recipe: true },
    });
  }

  async getDayNutrition(planId: bigint, date: Date) {
    const meals = await this.getMealsForDate(planId, date);

    return meals.reduce(
      (acc, meal) => ({
        kcal: acc.kcal + meal.recipe.kcalPerServing * meal.plannedServings,
        protein: acc.protein + meal.recipe.proteinGPerServing * meal.plannedServings,
        carbs: acc.carbs + meal.recipe.carbsGPerServing * meal.plannedServings,
        fat: acc.fat + meal.recipe.fatGPerServing * meal.plannedServings,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  async getWeekNutrition(planId: bigint) {
    const plan = await prisma.plansRepas.findUnique({
      where: { id: planId },
      include: {
        planRecettes: { include: { recipe: true } },
      },
    });

    if (!plan) return null;

    const nutrition = {
      kcal: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      averageKcalPerDay: 0,
      averageProteinPerDay: 0,
      averageCarbsPerDay: 0,
      averageFatPerDay: 0,
    };

    for (const meal of plan.planRecettes) {
      nutrition.kcal += meal.recipe.kcalPerServing * meal.plannedServings;
      nutrition.protein += meal.recipe.proteinGPerServing * meal.plannedServings;
      nutrition.carbs += meal.recipe.carbsGPerServing * meal.plannedServings;
      nutrition.fat += meal.recipe.fatGPerServing * meal.plannedServings;
    }

    const uniqueDays = new Set(
      plan.planRecettes.map((m) => m.date.toDateString())
    ).size;

    nutrition.averageKcalPerDay = nutrition.kcal / uniqueDays;
    nutrition.averageProteinPerDay = nutrition.protein / uniqueDays;
    nutrition.averageCarbsPerDay = nutrition.carbs / uniqueDays;
    nutrition.averageFatPerDay = nutrition.fat / uniqueDays;

    return nutrition;
  }

  async getMealsForMealType(planId: bigint, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') {
    return prisma.planRecettes.findMany({
      where: { planId, mealType },
      include: { recipe: true },
    });
  }

  async count(): Promise<number> {
    return prisma.plansRepas.count();
  }

  async delete(id: bigint): Promise<void> {
    await prisma.plansRepas.delete({
      where: { id },
    });
  }
}

export const mealPlanRepository = new MealPlanRepository();
