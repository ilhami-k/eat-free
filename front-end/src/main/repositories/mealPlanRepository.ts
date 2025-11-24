import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, meal_plan_recipe_meal_type } from "./prisma/generated/client";
import type MealPlan from "../../shared/mealPlan";
import type { MealPlanRecipe } from "../../shared/mealPlan";

function normalizeToMonday(date: Date): Date {
  const normalized = new Date(date);
  const dayOfWeek = normalized.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  normalized.setDate(normalized.getDate() - daysToMonday);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
}

function normalizeDateOnly(date: Date): Date {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
}

export class MealPlanRepository {
  private dbclient: PrismaClient;

  constructor(dbclient?: PrismaClient) {
    if (dbclient) {
      this.dbclient = dbclient;
    } else {
      const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
      this.dbclient = new PrismaClient({ adapter });
    }
  }

  async getMealPlans(userId: number): Promise<MealPlan[]> {
    const plans = await this.dbclient.meal_plan.findMany({
      where: { user_id: (userId) },
      include: {
        meal_plan_recipe: {
          include: {
            recipe: {
              include: {
                recipe_ingredients: {
                  include: { ingredients: true },
                },
              },
            },
          },
        },
      },
    });
    return plans.map((p) => ({
      id: (p.id),
      user_id: (p.user_id),
      week_start_date: p.week_start_date.toISOString(),
      created_at: p.created_at.toISOString(),
      meal_plan_recipe: p.meal_plan_recipe?.map((mpr) => ({
        id: (mpr.id),
        plan_id: (mpr.plan_id),
        recipe_id: (mpr.recipe_id),
        date: mpr.date.toISOString(),
        meal_type: mpr.meal_type,
        planned_servings: (mpr.planned_servings),
        recipe: mpr.recipe
          ? {
              id: (mpr.recipe.id),
              user_id: mpr.recipe.user_id ? (mpr.recipe.user_id) : null,
              name: mpr.recipe.name,
              servings: (mpr.recipe.servings),
              kcal_per_serving: (mpr.recipe.kcal_per_serving),
              protein_g_per_serving: (mpr.recipe.protein_g_per_serving),
              carbs_g_per_serving: (mpr.recipe.carbs_g_per_serving),
              fat_g_per_serving: (mpr.recipe.fat_g_per_serving),
              created_at: mpr.recipe.created_at.toISOString(),
            }
          : undefined,
      })),
    })) as MealPlan[];
  }

  async getMealPlanById(id: number): Promise<MealPlan | null> {
    const plan = await this.dbclient.meal_plan.findUnique({
      where: { id: (id) },
      include: {
        meal_plan_recipe: {
          include: {
            recipe: {
              include: {
                recipe_ingredients: {
                  include: { ingredients: true },
                },
              },
            },
          },
        },
      },
    });
    if (!plan) return null;
    return {
      id: (plan.id),
      user_id: (plan.user_id),
      week_start_date: plan.week_start_date.toISOString(),
      created_at: plan.created_at.toISOString(),
      meal_plan_recipe: plan.meal_plan_recipe?.map((mpr) => ({
        id: (mpr.id),
        plan_id: (mpr.plan_id),
        recipe_id: (mpr.recipe_id),
        date: mpr.date.toISOString(),
        meal_type: mpr.meal_type,
        planned_servings: (mpr.planned_servings),
        recipe: mpr.recipe
          ? {
              id: (mpr.recipe.id),
              user_id: mpr.recipe.user_id ? (mpr.recipe.user_id) : null,
              name: mpr.recipe.name,
              servings: (mpr.recipe.servings),
              kcal_per_serving: (mpr.recipe.kcal_per_serving),
              protein_g_per_serving: (mpr.recipe.protein_g_per_serving),
              carbs_g_per_serving: (mpr.recipe.carbs_g_per_serving),
              fat_g_per_serving: (mpr.recipe.fat_g_per_serving),
              created_at: mpr.recipe.created_at.toISOString(),
            }
          : undefined,
      })),
    } as MealPlan;
  }

  async getMealPlanForWeek(userId: number, weekStartDate: Date): Promise<MealPlan | null> {
    const normalizedDate = normalizeToMonday(weekStartDate);

    const plan = await this.dbclient.meal_plan.findUnique({
      where: {
        user_id_week_start_date: {
          user_id: (userId),
          week_start_date: normalizedDate,
        },
      },
      include: {
        meal_plan_recipe: {
          include: {
            recipe: {
              include: {
                recipe_ingredients: {
                  include: { ingredients: true },
                },
              },
            },
          },
        },
      },
    });

    if (!plan) return null;
    return {
      id: (plan.id),
      user_id: (plan.user_id),
      week_start_date: plan.week_start_date.toISOString(),
      created_at: plan.created_at.toISOString(),
      meal_plan_recipe: plan.meal_plan_recipe?.map((mpr) => ({
        id: (mpr.id),
        plan_id: (mpr.plan_id),
        recipe_id: (mpr.recipe_id),
        date: mpr.date.toISOString(),
        meal_type: mpr.meal_type,
        planned_servings: (mpr.planned_servings),
        recipe: mpr.recipe
          ? {
              id: (mpr.recipe.id),
              user_id: mpr.recipe.user_id ? (mpr.recipe.user_id) : null,
              name: mpr.recipe.name,
              servings: (mpr.recipe.servings),
              kcal_per_serving: (mpr.recipe.kcal_per_serving),
              protein_g_per_serving: (mpr.recipe.protein_g_per_serving),
              carbs_g_per_serving: (mpr.recipe.carbs_g_per_serving),
              fat_g_per_serving: (mpr.recipe.fat_g_per_serving),
              created_at: mpr.recipe.created_at.toISOString(),
            }
          : undefined,
      })),
    } as MealPlan;
  }

  async createMealPlan(user_id: number, week_start_date: Date): Promise<MealPlan> {
    const normalizedDate = normalizeToMonday(week_start_date);

    const plan = await this.dbclient.meal_plan.upsert({
      where: {
        user_id_week_start_date: {
          user_id: (user_id),
          week_start_date: normalizedDate,
        },
      },
      create: {
        user_id: (user_id),
        week_start_date: normalizedDate,
      },
      update: {},
      include: {
        meal_plan_recipe: {
          include: {
            recipe: {
              include: {
                recipe_ingredients: {
                  include: { ingredients: true },
                },
              },
            },
          },
        },
      },
    });

    return {
      id: (plan.id),
      user_id: (plan.user_id),
      week_start_date: plan.week_start_date.toISOString(),
      created_at: plan.created_at.toISOString(),
      meal_plan_recipe: plan.meal_plan_recipe?.map((mpr) => ({
        id: (mpr.id),
        plan_id: (mpr.plan_id),
        recipe_id: (mpr.recipe_id),
        date: mpr.date.toISOString(),
        meal_type: mpr.meal_type,
        planned_servings: (mpr.planned_servings),
        recipe: mpr.recipe
          ? {
              id: (mpr.recipe.id),
              user_id: mpr.recipe.user_id ? (mpr.recipe.user_id) : null,
              name: mpr.recipe.name,
              servings: (mpr.recipe.servings),
              kcal_per_serving: (mpr.recipe.kcal_per_serving),
              protein_g_per_serving: (mpr.recipe.protein_g_per_serving),
              carbs_g_per_serving: (mpr.recipe.carbs_g_per_serving),
              fat_g_per_serving: (mpr.recipe.fat_g_per_serving),
              created_at: mpr.recipe.created_at.toISOString(),
            }
          : undefined,
      })),
    } as MealPlan;
  }

  async deleteMealPlan(id: number): Promise<void> {
    await this.dbclient.meal_plan.delete({
      where: { id: (id) },
    });
  }

  async addRecipeToMealPlan(
    plan_id: number,
    recipe_id: number,
    date: Date,
    meal_type: meal_plan_recipe_meal_type,
    planned_servings: number
  ): Promise<MealPlanRecipe> {
    const normalizedDate = normalizeDateOnly(date);
    const result = await this.dbclient.meal_plan_recipe.create({
      data: {
        plan_id: (plan_id),
        recipe_id: (recipe_id),
        date: normalizedDate,
        meal_type,
        planned_servings,
      },
      include: {
        recipe: {
          include: {
            recipe_ingredients: {
              include: { ingredients: true },
            },
          },
        },
      },
    });
    return {
      id: (result.id),
      plan_id: (result.plan_id),
      recipe_id: (result.recipe_id),
      date: result.date.toISOString(),
      meal_type: result.meal_type,
      planned_servings: (result.planned_servings),
      recipe: result.recipe
        ? {
            id: (result.recipe.id),
            user_id: result.recipe.user_id ? (result.recipe.user_id) : null,
            name: result.recipe.name,
            servings: (result.recipe.servings),
            kcal_per_serving: (result.recipe.kcal_per_serving),
            protein_g_per_serving: (result.recipe.protein_g_per_serving),
            carbs_g_per_serving: (result.recipe.carbs_g_per_serving),
            fat_g_per_serving: (result.recipe.fat_g_per_serving),
            created_at: result.recipe.created_at.toISOString(),
          }
        : undefined,
    } as MealPlanRecipe;
  }

  async updateMealPlanRecipe(
    id: number,
    planned_servings: number
  ): Promise<MealPlanRecipe> {
    const result = await this.dbclient.meal_plan_recipe.update({
      where: { id: (id) },
      data: { planned_servings },
      include: {
        recipe: {
          include: {
            recipe_ingredients: {
              include: { ingredients: true },
            },
          },
        },
      },
    });
    return {
      id: (result.id),
      plan_id: (result.plan_id),
      recipe_id: (result.recipe_id),
      date: result.date.toISOString(),
      meal_type: result.meal_type,
      planned_servings: (result.planned_servings),
      recipe: result.recipe
        ? {
            id: (result.recipe.id),
            user_id: result.recipe.user_id ? (result.recipe.user_id) : null,
            name: result.recipe.name,
            servings: (result.recipe.servings),
            kcal_per_serving: (result.recipe.kcal_per_serving),
            protein_g_per_serving: (result.recipe.protein_g_per_serving),
            carbs_g_per_serving: (result.recipe.carbs_g_per_serving),
            fat_g_per_serving: (result.recipe.fat_g_per_serving),
            created_at: result.recipe.created_at.toISOString(),
          }
        : undefined,
    } as MealPlanRecipe;
  }

  async removeRecipeFromMealPlan(id: number): Promise<void> {
    await this.dbclient.meal_plan_recipe.delete({
      where: { id: (id) },
    });
  }
}
