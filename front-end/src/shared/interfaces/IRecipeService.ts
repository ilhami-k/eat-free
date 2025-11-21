import Recipe from "../recipe"

export interface RecipeIngredientInput {
    ingredient_id: number
    qty_grams: number
    notes?: string
}

export default interface IRecipeService {
    getRecipes: () => Promise<Recipe[]>
    getRecipeById: (id: number) => Promise<Recipe | null>
    createRecipe: (recipe: Omit<Recipe, "id" | "created_at">, ingredients: RecipeIngredientInput[]) => Promise<Recipe>
    updateRecipe: (id: number, recipe: Partial<Omit<Recipe, "id" | "created_at">>) => Promise<Recipe>
    deleteRecipe: (id: number) => Promise<void>
}
