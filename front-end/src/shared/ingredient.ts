export default interface Ingredient {
  id: number;
  name: string;
  kcal_per_100g: number;
  protein_g_per_100g: number;
  carbs_g_per_100g: number;
  fat_g_per_100g: number;
  created_at: string;
}
