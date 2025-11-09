import SavedRecipe from "../savedRecipe";

export default interface ISavedRecipeService {
  getSavedRecipes: (userId: bigint) => Promise<SavedRecipe[]>;
  getSavedRecipeById: (id: bigint) => Promise<SavedRecipe | null>;
  createSavedRecipe: (
    user_id: bigint,
    name: string,
    recipe_id: bigint,
    default_servings: number
  ) => Promise<SavedRecipe>;
  updateSavedRecipe: (
    id: bigint,
    data: {
      name?: string;
      default_servings?: number;
    }
  ) => Promise<SavedRecipe>;
  deleteSavedRecipe: (id: bigint) => Promise<void>;
}
