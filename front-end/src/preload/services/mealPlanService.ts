import { ipcRenderer } from "electron";
import IMealPlanService from "../../shared/interfaces/IMealPlanService";
import { MealType } from "../../shared/mealPlan";

export function mealPlanService(): IMealPlanService {
  return {
    getMealPlans: (userId: number) => ipcRenderer.invoke("mealPlanRepository:getMealPlans", userId),
    getMealPlanById: (id: number) => ipcRenderer.invoke("mealPlanRepository:getMealPlanById", id),
    getMealPlanForWeek: async (userId: number, weekStartDate: Date) => {
      return await ipcRenderer.invoke("mealPlanRepository:getMealPlanForWeek", userId, weekStartDate);
    },
    createMealPlan: async (user_id: number, week_start_date: Date) => {
      return await ipcRenderer.invoke("mealPlanRepository:createMealPlan", user_id, week_start_date);
    },
    deleteMealPlan: (id: number) => ipcRenderer.invoke("mealPlanRepository:deleteMealPlan", id),
    addRecipeToMealPlan: async (plan_id: number, recipe_id: number, date: Date, meal_type: MealType, planned_servings: number) => {
      return await ipcRenderer.invoke("mealPlanRepository:addRecipeToMealPlan", plan_id, recipe_id, date, meal_type, planned_servings);
    },
    updateMealPlanRecipe: (id: number, planned_servings: number) =>
      ipcRenderer.invoke("mealPlanRepository:updateMealPlanRecipe", id, planned_servings),
    removeRecipeFromMealPlan: (id: number) =>
      ipcRenderer.invoke("mealPlanRepository:removeRecipeFromMealPlan", id),
  };
}
