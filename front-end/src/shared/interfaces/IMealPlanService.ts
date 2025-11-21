import MealPlan, { MealPlanRecipe, MealType } from "../mealPlan";

export default interface IMealPlanService {
  getMealPlans: (userId: number) => Promise<MealPlan[]>;
  getMealPlanById: (id: number) => Promise<MealPlan | null>;
  getMealPlanForWeek: (userId: number, weekStartDate: Date) => Promise<MealPlan | null>;
  createMealPlan: (user_id: number, week_start_date: Date) => Promise<MealPlan>;
  deleteMealPlan: (id: number) => Promise<void>;
  addRecipeToMealPlan: (
    plan_id: number,
    recipe_id: number,
    date: Date,
    meal_type: MealType,
    planned_servings: number
  ) => Promise<MealPlanRecipe>;
  updateMealPlanRecipe: (
    id: number,
    planned_servings: number
  ) => Promise<MealPlanRecipe>;
  removeRecipeFromMealPlan: (id: number) => Promise<void>;
}
