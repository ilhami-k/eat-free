import { ipcMain } from "electron";
import { MealPlanRepository } from "./mealPlanRepository";
import { meal_plan_recipe_meal_type } from "./prisma/generated/client";

export function registerMealPlanRepository() {
  const mealPlanRepository = new MealPlanRepository();

  ipcMain.handle("mealPlanRepository:getMealPlans", (e, userId: bigint) => {
    return mealPlanRepository.getMealPlans(userId);
  });

  ipcMain.handle("mealPlanRepository:getMealPlanById", (e, id: bigint) => {
    return mealPlanRepository.getMealPlanById(id);
  });

  ipcMain.handle(
    "mealPlanRepository:getMealPlanForWeek",
    (e, userId: bigint, weekStartDate: Date) => {
      return mealPlanRepository.getMealPlanForWeek(userId, weekStartDate);
    }
  );

  ipcMain.handle(
    "mealPlanRepository:createMealPlan",
    (e, user_id: bigint, week_start_date: Date) => {
      return mealPlanRepository.createMealPlan(user_id, week_start_date);
    }
  );

  ipcMain.handle("mealPlanRepository:deleteMealPlan", (e, id: bigint) => {
    return mealPlanRepository.deleteMealPlan(id);
  });

  ipcMain.handle(
    "mealPlanRepository:addRecipeToMealPlan",
    (e, plan_id: bigint, recipe_id: bigint, date: Date, meal_type: meal_plan_recipe_meal_type, planned_servings: number) => {
      return mealPlanRepository.addRecipeToMealPlan(plan_id, recipe_id, date, meal_type, planned_servings);
    }
  );

  ipcMain.handle(
    "mealPlanRepository:updateMealPlanRecipe",
    (e, id: bigint, planned_servings: number) => {
      return mealPlanRepository.updateMealPlanRecipe(id, planned_servings);
    }
  );

  ipcMain.handle(
    "mealPlanRepository:removeRecipeFromMealPlan",
    (e, id: bigint) => {
      return mealPlanRepository.removeRecipeFromMealPlan(id);
    }
  );
}
