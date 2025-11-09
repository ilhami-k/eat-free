import { ipcMain } from "electron";
import { SavedRecipeRepository } from "./savedRecipeRepository";

export function registerSavedRecipeRepository() {
  const savedRecipeRepository = new SavedRecipeRepository();

  ipcMain.handle("savedRecipeRepository:getSavedRecipes", (e, userId: bigint) => {
    return savedRecipeRepository.getSavedRecipes(userId);
  });

  ipcMain.handle("savedRecipeRepository:getSavedRecipeById", (e, id: bigint) => {
    return savedRecipeRepository.getSavedRecipeById(id);
  });

  ipcMain.handle(
    "savedRecipeRepository:createSavedRecipe",
    (e, user_id: bigint, name: string, recipe_id: bigint, default_servings: number) => {
      return savedRecipeRepository.createSavedRecipe(user_id, name, recipe_id, default_servings);
    }
  );

  ipcMain.handle(
    "savedRecipeRepository:updateSavedRecipe",
    (e, id: bigint, data: { name?: string; default_servings?: number }) => {
      return savedRecipeRepository.updateSavedRecipe(id, data);
    }
  );

  ipcMain.handle("savedRecipeRepository:deleteSavedRecipe", (e, id: bigint) => {
    return savedRecipeRepository.deleteSavedRecipe(id);
  });
}
