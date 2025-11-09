import Recipe from "./recipe";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealPlanRecipe {
  id: bigint;
  plan_id: bigint;
  date: Date;
  meal_type: MealType;
  recipe_id: bigint;
  planned_servings: number;
  recipe?: Recipe;
}

export default interface MealPlan {
  id: bigint;
  user_id: bigint;
  week_start_date: Date;
  created_at: Date;
  meal_plan_recipe?: MealPlanRecipe[];
}
