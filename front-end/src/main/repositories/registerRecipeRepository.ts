import { ipcMain } from "electron";
import { RecipeRepository } from "./recipeRepository";
import Recipe from "../../shared/recipe";

export function registerRecipeRepository() {
  const recipeRepository = new RecipeRepository();

  ipcMain.handle("recipeRepository:getRecipes", (e, userId?: bigint) => {
    return recipeRepository.getRecipes(userId);
  });

  ipcMain.handle("recipeRepository:getRecipeById", (e, id: bigint) => {
    return recipeRepository.getRecipeById(id);
  });

  ipcMain.handle("recipeRepository:createRecipe", (e, recipe: Omit<Recipe, "id" | "created_at">) => {
    return recipeRepository.createRecipe(recipe);
  });

  ipcMain.handle("recipeRepository:updateRecipe", (e, id: bigint, recipe: Partial<Omit<Recipe, "id" | "created_at">>) => {
    return recipeRepository.updateRecipe(id, recipe);
  });

  ipcMain.handle("recipeRepository:deleteRecipe", (e, id: bigint) => {
    return recipeRepository.deleteRecipe(id);
  });
}
