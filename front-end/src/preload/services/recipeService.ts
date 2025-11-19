import { ipcRenderer } from "electron"
import IRecipeService from "../../shared/interfaces/IRecipeService"
import type { RecipeIngredientInput } from "../../shared/interfaces/IRecipeService"
import Recipe from "../../shared/recipe"

export function recipeService(): IRecipeService {
    return { 
        getRecipes: () => ipcRenderer.invoke("recipeRepository:getRecipes"),
        getRecipeById: (id: bigint) => ipcRenderer.invoke("recipeRepository:getRecipeById", id),
        createRecipe: (recipe: Omit<Recipe, "id" | "created_at">, ingredients?: RecipeIngredientInput[]) => ipcRenderer.invoke("recipeRepository:createRecipe", recipe, ingredients),
        updateRecipe: (id: bigint, recipe: Partial<Omit<Recipe, "id" | "created_at">>) => ipcRenderer.invoke("recipeRepository:updateRecipe", id, recipe),
        deleteRecipe: (id: bigint) => ipcRenderer.invoke("recipeRepository:deleteRecipe", id)
    }
}
