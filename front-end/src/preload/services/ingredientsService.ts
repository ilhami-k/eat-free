import { ipcRenderer } from "electron";
import IIngredientsService from "../../shared/interfaces/IIngredientsService";

export function ingredientsService(): IIngredientsService {
  return {
    getIngredients: () => ipcRenderer.invoke("ingredientsRepository:getIngredients"),
    getIngredientById: (id: number) => ipcRenderer.invoke("ingredientsRepository:getIngredientById", id),
    getIngredientByName: (name: string) => ipcRenderer.invoke("ingredientsRepository:getIngredientByName", name),
    createIngredient: (name: string, kcal_per_100g: number, protein_g_per_100g: number, carbs_g_per_100g: number, fat_g_per_100g: number) =>
      ipcRenderer.invoke("ingredientsRepository:createIngredient", name, kcal_per_100g, protein_g_per_100g, carbs_g_per_100g, fat_g_per_100g),
    updateIngredient: (id: number, data: { name?: string; kcal_per_100g?: number; protein_g_per_100g?: number; carbs_g_per_100g?: number; fat_g_per_100g?: number }) =>
      ipcRenderer.invoke("ingredientsRepository:updateIngredient", id, data),
    deleteIngredient: (id: number) => ipcRenderer.invoke("ingredientsRepository:deleteIngredient", id),
  };
}
