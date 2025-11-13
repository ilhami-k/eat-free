import Recipe from "./recipe";

export default interface Journal {
  id: number;
  user_id: number;
  recipe_id: number;
  servings_eaten: number;
  logged_at: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  recipe?: Recipe;
}
