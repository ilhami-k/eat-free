import { ipcMain } from "electron";
import { IngredientsRepository } from "./ingredientsRepository";

export function registerIngredientsRepository() {
  const ingredientsRepository = new IngredientsRepository();

  ipcMain.handle("ingredientsRepository:getIngredients", () => {
    return ingredientsRepository.getIngredients();
  });

  ipcMain.handle("ingredientsRepository:getIngredientById", (e, id: number) => {
    return ingredientsRepository.getIngredientById(id);
  });

  ipcMain.handle("ingredientsRepository:getIngredientByName", (e, name: string) => {
    return ingredientsRepository.getIngredientByName(name);
  });

  ipcMain.handle(
    "ingredientsRepository:createIngredient",
    (e, name: string, kcal_per_100g: number, protein_g_per_100g: number, carbs_g_per_100g: number, fat_g_per_100g: number) => {
      return ingredientsRepository.createIngredient(name, kcal_per_100g, protein_g_per_100g, carbs_g_per_100g, fat_g_per_100g);
    }
  );

  ipcMain.handle(
    "ingredientsRepository:updateIngredient",
    (e, id: number, data: { name?: string; kcal_per_100g?: number; protein_g_per_100g?: number; carbs_g_per_100g?: number; fat_g_per_100g?: number }) => {
      return ingredientsRepository.updateIngredient(id, data);
    }
  );

  ipcMain.handle("ingredientsRepository:deleteIngredient", (e, id: number) => {
    return ingredientsRepository.deleteIngredient(id);
  });
}
