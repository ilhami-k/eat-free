import SavedRecipe from "../savedRecipe";

export default interface ISavedRecipeService {
  getSavedRecipes: (userId: number) => Promise<SavedRecipe[]>;
  getSavedRecipeById: (id: number) => Promise<SavedRecipe | null>;
  createSavedRecipe: (
    user_id: number,
    name: string,
    recipe_id: number,
    default_servings: number
  ) => Promise<SavedRecipe>;
  updateSavedRecipe: (
    id: number,
    data: {
      name?: string;
      default_servings?: number;
    }
  ) => Promise<SavedRecipe>;
  deleteSavedRecipe: (id: number) => Promise<void>;
}
