import Recipe from "./recipe";

export default interface SavedRecipe {
  id: bigint;
  user_id: bigint;
  name: string;
  recipe_id: bigint;
  default_servings: number;
  created_at: Date;
  recipe?: Recipe;
}
