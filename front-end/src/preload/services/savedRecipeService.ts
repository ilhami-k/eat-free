import { ipcRenderer } from "electron";
import ISavedRecipeService from "../../shared/interfaces/ISavedRecipeService";

export function savedRecipeService(): ISavedRecipeService {
  return {
    getSavedRecipes: (userId: number) => ipcRenderer.invoke("savedRecipeRepository:getSavedRecipes", userId),
    getSavedRecipeById: (id: number) => ipcRenderer.invoke("savedRecipeRepository:getSavedRecipeById", id),
    createSavedRecipe: (user_id: number, name: string, recipe_id: number, default_servings: number) =>
      ipcRenderer.invoke("savedRecipeRepository:createSavedRecipe", user_id, name, recipe_id, default_servings),
    updateSavedRecipe: (id: number, data: { name?: string; default_servings?: number }) =>
      ipcRenderer.invoke("savedRecipeRepository:updateSavedRecipe", id, data),
    deleteSavedRecipe: (id: number) => ipcRenderer.invoke("savedRecipeRepository:deleteSavedRecipe", id),
  };
}
