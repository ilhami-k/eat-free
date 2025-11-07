import Recipe from "../../shared/recipe";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";

export class RecipeRepository {
  private dbclient: PrismaClient;
  
  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getRecipes(userId?: bigint): Promise<Recipe[]> {
    const recipes = await this.dbclient.recipe.findMany({
      where: userId ? { user_id: userId } : undefined,
    });

    return recipes.map((r) => {
      return {
        id: r.id,
        user_id: r.user_id,
        name: r.name,
        servings: Number(r.servings),
        kcal_per_serving: Number(r.kcal_per_serving),
        protein_g_per_serving: Number(r.protein_g_per_serving),
        carbs_g_per_serving: Number(r.carbs_g_per_serving),
        fat_g_per_serving: Number(r.fat_g_per_serving),
        created_at: r.created_at,
      } as Recipe;
    });
  }

  async getRecipeById(id: bigint): Promise<Recipe | null> {
    const recipe = await this.dbclient.recipe.findUnique({
      where: { id },
    });

    if (!recipe) return null;

    return {
      id: recipe.id,
      user_id: recipe.user_id,
      name: recipe.name,
      servings: Number(recipe.servings),
      kcal_per_serving: Number(recipe.kcal_per_serving),
      protein_g_per_serving: Number(recipe.protein_g_per_serving),
      carbs_g_per_serving: Number(recipe.carbs_g_per_serving),
      fat_g_per_serving: Number(recipe.fat_g_per_serving),
      created_at: recipe.created_at,
    } as Recipe;
  }

  async createRecipe(recipe: Omit<Recipe, "id" | "created_at">): Promise<Recipe> {
    const created = await this.dbclient.recipe.create({
      data: {
        user_id: recipe.user_id,
        name: recipe.name,
        servings: recipe.servings,
        kcal_per_serving: recipe.kcal_per_serving,
        protein_g_per_serving: recipe.protein_g_per_serving,
        carbs_g_per_serving: recipe.carbs_g_per_serving,
        fat_g_per_serving: recipe.fat_g_per_serving,
      },
    });

    return {
      id: created.id,
      user_id: created.user_id,
      name: created.name,
      servings: Number(created.servings),
      kcal_per_serving: Number(created.kcal_per_serving),
      protein_g_per_serving: Number(created.protein_g_per_serving),
      carbs_g_per_serving: Number(created.carbs_g_per_serving),
      fat_g_per_serving: Number(created.fat_g_per_serving),
      created_at: created.created_at,
    } as Recipe;
  }

  async updateRecipe(id: bigint, recipe: Partial<Omit<Recipe, "id" | "created_at">>): Promise<Recipe> {
    const updated = await this.dbclient.recipe.update({
      where: { id },
      data: {
        name: recipe.name,
        servings: recipe.servings,
        kcal_per_serving: recipe.kcal_per_serving,
        protein_g_per_serving: recipe.protein_g_per_serving,
        carbs_g_per_serving: recipe.carbs_g_per_serving,
        fat_g_per_serving: recipe.fat_g_per_serving,
      },
    });

    return {
      id: updated.id,
      user_id: updated.user_id,
      name: updated.name,
      servings: Number(updated.servings),
      kcal_per_serving: Number(updated.kcal_per_serving),
      protein_g_per_serving: Number(updated.protein_g_per_serving),
      carbs_g_per_serving: Number(updated.carbs_g_per_serving),
      fat_g_per_serving: Number(updated.fat_g_per_serving),
      created_at: updated.created_at,
    } as Recipe;
  }

  async deleteRecipe(id: bigint): Promise<void> {
    await this.dbclient.recipe.delete({
      where: { id },
    });
  }
}
