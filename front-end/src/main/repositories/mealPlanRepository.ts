import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, meal_plan, meal_plan_recipe, meal_plan_recipe_meal_type } from "./prisma/generated/client";
import { serializeForIPC } from "../../shared/utils/ipcSerializer";

export class MealPlanRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getMealPlans(userId: bigint): Promise<meal_plan[]> {
    const plans = await this.dbclient.meal_plan.findMany({
      where: { user_id: userId },
      include: { meal_plan_recipe: { include: { recipe: true } } },
    });
    return serializeForIPC(plans) as meal_plan[];
  }

  async getMealPlanById(id: bigint): Promise<meal_plan | null> {
    const plan = await this.dbclient.meal_plan.findUnique({
      where: { id },
      include: { meal_plan_recipe: { include: { recipe: true } } },
    });
    return serializeForIPC(plan) as meal_plan | null;
  }

  async getMealPlanForWeek(userId: bigint, weekStartDate: Date): Promise<meal_plan | null> {
    const plan = await this.dbclient.meal_plan.findUnique({
      where: {
        user_id_week_start_date: {
          user_id: userId,
          week_start_date: weekStartDate,
        },
      },
      include: { meal_plan_recipe: { include: { recipe: true } } },
    });
    return serializeForIPC(plan) as meal_plan | null;
  }

  async createMealPlan(user_id: bigint, week_start_date: Date): Promise<meal_plan> {
    const plan = await this.dbclient.meal_plan.create({
      data: {
        user_id,
        week_start_date,
      },
      include: { meal_plan_recipe: true },
    });
    return serializeForIPC(plan) as meal_plan;
  }

  async deleteMealPlan(id: bigint): Promise<void> {
    await this.dbclient.meal_plan.delete({
      where: { id },
    });
  }

  async addRecipeToMealPlan(
    plan_id: bigint,
    recipe_id: bigint,
    date: Date,
    meal_type: meal_plan_recipe_meal_type,
    planned_servings: number
  ): Promise<meal_plan_recipe> {
    const result = await this.dbclient.meal_plan_recipe.create({
      data: {
        plan_id,
        recipe_id,
        date,
        meal_type,
        planned_servings,
      },
      include: { recipe: true },
    });
    return serializeForIPC(result) as meal_plan_recipe;
  }

  async updateMealPlanRecipe(
    id: bigint,
    planned_servings: number
  ): Promise<meal_plan_recipe> {
    const result = await this.dbclient.meal_plan_recipe.update({
      where: { id },
      data: { planned_servings },
      include: { recipe: true },
    });
    return serializeForIPC(result) as meal_plan_recipe;
  }

  async removeRecipeFromMealPlan(id: bigint): Promise<void> {
    await this.dbclient.meal_plan_recipe.delete({
      where: { id },
    });
  }
}
