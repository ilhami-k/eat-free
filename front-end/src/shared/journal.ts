import Recipe from "./recipe";

export default interface Journal {
  id: bigint;
  user_id: bigint;
  recipe_id: bigint;
  servings_eaten: number;
  logged_at: Date;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  recipe?: Recipe;
}
