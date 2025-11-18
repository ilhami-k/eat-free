import { ipcRenderer } from "electron";
import IMealPlanService from "../../shared/interfaces/IMealPlanService";
import { MealType } from "../../shared/mealPlan";

export function mealPlanService(): IMealPlanService {
  return {
    getMealPlans: (userId: bigint) => ipcRenderer.invoke("mealPlanRepository:getMealPlans", Number(userId)),
    getMealPlanById: (id: bigint) => ipcRenderer.invoke("mealPlanRepository:getMealPlanById", Number(id)),
    getMealPlanForWeek: (userId: bigint, weekStartDate: Date) =>
      ipcRenderer.invoke("mealPlanRepository:getMealPlanForWeek", Number(userId), weekStartDate),
    createMealPlan: (user_id: bigint, week_start_date: Date) =>
      ipcRenderer.invoke("mealPlanRepository:createMealPlan", Number(user_id), week_start_date),
    deleteMealPlan: (id: bigint) => ipcRenderer.invoke("mealPlanRepository:deleteMealPlan", Number(id)),
    addRecipeToMealPlan: (plan_id: bigint, recipe_id: bigint, date: Date, meal_type: MealType, planned_servings: number) =>
      ipcRenderer.invoke("mealPlanRepository:addRecipeToMealPlan", Number(plan_id), Number(recipe_id), date, meal_type, planned_servings),
    updateMealPlanRecipe: (id: bigint, planned_servings: number) =>
      ipcRenderer.invoke("mealPlanRepository:updateMealPlanRecipe", Number(id), planned_servings),
    removeRecipeFromMealPlan: (id: bigint) =>
      ipcRenderer.invoke("mealPlanRepository:removeRecipeFromMealPlan", Number(id)),
  };
}
