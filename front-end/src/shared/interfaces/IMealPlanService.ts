import MealPlan, { MealPlanRecipe, MealType } from "../mealPlan";

export default interface IMealPlanService {
  getMealPlans: (userId: bigint) => Promise<MealPlan[]>;
  getMealPlanById: (id: bigint) => Promise<MealPlan | null>;
  getMealPlanForWeek: (userId: bigint, weekStartDate: Date) => Promise<MealPlan | null>;
  createMealPlan: (user_id: bigint, week_start_date: Date) => Promise<MealPlan>;
  deleteMealPlan: (id: bigint) => Promise<void>;
  addRecipeToMealPlan: (
    plan_id: bigint,
    recipe_id: bigint,
    date: Date,
    meal_type: MealType,
    planned_servings: number
  ) => Promise<MealPlanRecipe>;
  updateMealPlanRecipe: (
    id: bigint,
    planned_servings: number
  ) => Promise<MealPlanRecipe>;
  removeRecipeFromMealPlan: (id: bigint) => Promise<void>;
}
