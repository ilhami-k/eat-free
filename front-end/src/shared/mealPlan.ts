import Recipe from "./recipe";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealPlanRecipe {
  id: number;
  plan_id: number;
  date: string;
  meal_type: MealType;
  recipe_id: number;
  planned_servings: number;
  recipe?: Recipe;
}

export default interface MealPlan {
  id: number;
  user_id: number;
  week_start_date: string;
  created_at: string;
  meal_plan_recipe?: MealPlanRecipe[];
}
