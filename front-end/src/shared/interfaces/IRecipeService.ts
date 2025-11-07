import Recipe from "../recipe";

export default interface IRecipeService {
    getRecipes: (userId?: bigint) => Promise<Recipe[]>
    getRecipeById: (id: bigint) => Promise<Recipe | null>
    createRecipe: (recipe: Omit<Recipe, "id" | "created_at">) => Promise<Recipe>
    updateRecipe: (id: bigint, recipe: Partial<Omit<Recipe, "id" | "created_at">>) => Promise<Recipe>
    deleteRecipe: (id: bigint) => Promise<void>
}
