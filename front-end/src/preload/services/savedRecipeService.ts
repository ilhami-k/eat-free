import { ipcRenderer } from "electron";
import ISavedRecipeService from "../../shared/interfaces/ISavedRecipeService";

export function savedRecipeService(): ISavedRecipeService {
  return {
    getSavedRecipes: (userId: bigint) => ipcRenderer.invoke("savedRecipeRepository:getSavedRecipes", userId),
    getSavedRecipeById: (id: bigint) => ipcRenderer.invoke("savedRecipeRepository:getSavedRecipeById", id),
    createSavedRecipe: (user_id: bigint, name: string, recipe_id: bigint, default_servings: number) =>
      ipcRenderer.invoke("savedRecipeRepository:createSavedRecipe", user_id, name, recipe_id, default_servings),
    updateSavedRecipe: (id: bigint, data: { name?: string; default_servings?: number }) =>
      ipcRenderer.invoke("savedRecipeRepository:updateSavedRecipe", id, data),
    deleteSavedRecipe: (id: bigint) => ipcRenderer.invoke("savedRecipeRepository:deleteSavedRecipe", id),
  };
}
