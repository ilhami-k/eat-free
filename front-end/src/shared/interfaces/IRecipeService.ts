import Recipe from "../recipe";

export interface RecipeIngredientInput {
    ingredient_id: bigint
    qty_grams: number
    notes?: string | null
}

export default interface IRecipeService {
    getRecipes: () => Promise<Recipe[]>
    getRecipeById: (id: bigint) => Promise<Recipe | null>
    createRecipe: (recipe: Omit<Recipe, "id" | "created_at">, ingredients?: RecipeIngredientInput[]) => Promise<Recipe>
    updateRecipe: (id: bigint, recipe: Partial<Omit<Recipe, "id" | "created_at">>) => Promise<Recipe>
    deleteRecipe: (id: bigint) => Promise<void>
}
