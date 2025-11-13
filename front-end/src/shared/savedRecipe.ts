import Recipe from "./recipe";

export default interface SavedRecipe {
  id: number;
  user_id: number;
  name: string;
  recipe_id: number;
  default_servings: number;
  created_at: string;
  recipe?: Recipe;
}
