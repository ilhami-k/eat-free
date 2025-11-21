import { ipcMain } from "electron";
import { RecipeRepository } from "./recipeRepository";
import Recipe from "../../shared/recipe";

export function registerRecipeRepository() {
  const recipeRepository = new RecipeRepository();

  ipcMain.handle("recipeRepository:getRecipes", () => {
    return recipeRepository.getRecipes();
  });

  ipcMain.handle("recipeRepository:getRecipeById", (e, id: number) => {
    return recipeRepository.getRecipeById(id);
  });

  ipcMain.handle("recipeRepository:createRecipe", (e, recipe: Omit<Recipe, "id" | "created_at">, ingredients?: Array<{ ingredient_id: number, qty_grams: number, notes?: string | null }>) => {
    return recipeRepository.createRecipe(recipe, ingredients);
  });

  ipcMain.handle("recipeRepository:updateRecipe", (e, id: number, recipe: Partial<Omit<Recipe, "id" | "created_at">>) => {
    return recipeRepository.updateRecipe(id, recipe);
  });

  ipcMain.handle("recipeRepository:deleteRecipe", (e, id: number) => {
    return recipeRepository.deleteRecipe(id);
  });
}
