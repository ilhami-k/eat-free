import { ipcRenderer } from "electron"
import IRecipeService from "../../shared/interfaces/IRecipeService"
import type { RecipeIngredientInput } from "../../shared/interfaces/IRecipeService"
import Recipe from "../../shared/recipe"

export function recipeService(): IRecipeService {
    return { 
        getRecipes: async () => {
            const recipes = await ipcRenderer.invoke("recipeRepository:getRecipes")
            return recipes
        },
        getRecipeById: (id: number) => ipcRenderer.invoke("recipeRepository:getRecipeById", id),
        createRecipe: (recipe: Omit<Recipe, "id" | "created_at">, ingredients?: RecipeIngredientInput[]) => ipcRenderer.invoke("recipeRepository:createRecipe", recipe, ingredients),
        updateRecipe: (id: number, recipe: Partial<Omit<Recipe, "id" | "created_at">>) => ipcRenderer.invoke("recipeRepository:updateRecipe", id, recipe),
        deleteRecipe: (id: number) => ipcRenderer.invoke("recipeRepository:deleteRecipe", id)
    }
}
