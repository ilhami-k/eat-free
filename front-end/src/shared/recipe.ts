export default interface Recipe {
  id: number;
  user_id: number | null;
  name: string;
  servings: number;
  kcal_per_serving: number;
  protein_g_per_serving: number;
  carbs_g_per_serving: number;
  fat_g_per_serving: number;
  created_at: string;
}
