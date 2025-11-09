import Ingredient from "../ingredient";

export default interface IIngredientsService {
  getIngredients: () => Promise<Ingredient[]>;
  getIngredientById: (id: bigint) => Promise<Ingredient | null>;
  getIngredientByName: (name: string) => Promise<Ingredient | null>;
  createIngredient: (
    name: string,
    kcal_per_100g: number,
    protein_g_per_100g: number,
    carbs_g_per_100g: number,
    fat_g_per_100g: number
  ) => Promise<Ingredient>;
  updateIngredient: (
    id: bigint,
    data: {
      name?: string;
      kcal_per_100g?: number;
      protein_g_per_100g?: number;
      carbs_g_per_100g?: number;
      fat_g_per_100g?: number;
    }
  ) => Promise<Ingredient>;
  deleteIngredient: (id: bigint) => Promise<void>;
}
