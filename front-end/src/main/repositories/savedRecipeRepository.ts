import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import type SavedRecipe from "../../shared/savedRecipe";

export class SavedRecipeRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getSavedRecipes(userId: number): Promise<SavedRecipe[]> {
    const result = await this.dbclient.saved_recipe.findMany({
      where: { user_id: BigInt(userId) },
      include: { recipe: true },
    });
    return result.map((sr) => ({
      id: Number(sr.id),
      user_id: Number(sr.user_id),
      name: sr.name,
      recipe_id: Number(sr.recipe_id),
      default_servings: Number(sr.default_servings),
      created_at: sr.created_at.toISOString(),
      recipe: sr.recipe
        ? {
            id: Number(sr.recipe.id),
            user_id: sr.recipe.user_id ? Number(sr.recipe.user_id) : null,
            name: sr.recipe.name,
            servings: Number(sr.recipe.servings),
            kcal_per_serving: Number(sr.recipe.kcal_per_serving),
            protein_g_per_serving: Number(sr.recipe.protein_g_per_serving),
            carbs_g_per_serving: Number(sr.recipe.carbs_g_per_serving),
            fat_g_per_serving: Number(sr.recipe.fat_g_per_serving),
            created_at: sr.recipe.created_at.toISOString(),
          }
        : undefined,
    })) as SavedRecipe[];
  }

  async getSavedRecipeById(id: number): Promise<SavedRecipe | null> {
    const result = await this.dbclient.saved_recipe.findUnique({
      where: { id: BigInt(id) },
      include: { recipe: true },
    });
    if (!result) return null;
    return {
      id: Number(result.id),
      user_id: Number(result.user_id),
      name: result.name,
      recipe_id: Number(result.recipe_id),
      default_servings: Number(result.default_servings),
      created_at: result.created_at.toISOString(),
      recipe: result.recipe
        ? {
            id: Number(result.recipe.id),
            user_id: result.recipe.user_id ? Number(result.recipe.user_id) : null,
            name: result.recipe.name,
            servings: Number(result.recipe.servings),
            kcal_per_serving: Number(result.recipe.kcal_per_serving),
            protein_g_per_serving: Number(result.recipe.protein_g_per_serving),
            carbs_g_per_serving: Number(result.recipe.carbs_g_per_serving),
            fat_g_per_serving: Number(result.recipe.fat_g_per_serving),
            created_at: result.recipe.created_at.toISOString(),
          }
        : undefined,
    } as SavedRecipe;
  }

  async createSavedRecipe(
    user_id: number,
    name: string,
    recipe_id: number,
    default_servings: number
  ): Promise<SavedRecipe> {
    const result = await this.dbclient.saved_recipe.create({
      data: {
        user_id: BigInt(user_id),
        name,
        recipe_id: BigInt(recipe_id),
        default_servings,
      },
      include: { recipe: true },
    });
    return {
      id: Number(result.id),
      user_id: Number(result.user_id),
      name: result.name,
      recipe_id: Number(result.recipe_id),
      default_servings: Number(result.default_servings),
      created_at: result.created_at.toISOString(),
      recipe: result.recipe
        ? {
            id: Number(result.recipe.id),
            user_id: result.recipe.user_id ? Number(result.recipe.user_id) : null,
            name: result.recipe.name,
            servings: Number(result.recipe.servings),
            kcal_per_serving: Number(result.recipe.kcal_per_serving),
            protein_g_per_serving: Number(result.recipe.protein_g_per_serving),
            carbs_g_per_serving: Number(result.recipe.carbs_g_per_serving),
            fat_g_per_serving: Number(result.recipe.fat_g_per_serving),
            created_at: result.recipe.created_at.toISOString(),
          }
        : undefined,
    } as SavedRecipe;
  }

  async updateSavedRecipe(
    id: number,
    data: {
      name?: string;
      default_servings?: number;
    }
  ): Promise<SavedRecipe> {
    const result = await this.dbclient.saved_recipe.update({
      where: { id: BigInt(id) },
      data,
      include: { recipe: true },
    });
    return {
      id: Number(result.id),
      user_id: Number(result.user_id),
      name: result.name,
      recipe_id: Number(result.recipe_id),
      default_servings: Number(result.default_servings),
      created_at: result.created_at.toISOString(),
      recipe: result.recipe
        ? {
            id: Number(result.recipe.id),
            user_id: result.recipe.user_id ? Number(result.recipe.user_id) : null,
            name: result.recipe.name,
            servings: Number(result.recipe.servings),
            kcal_per_serving: Number(result.recipe.kcal_per_serving),
            protein_g_per_serving: Number(result.recipe.protein_g_per_serving),
            carbs_g_per_serving: Number(result.recipe.carbs_g_per_serving),
            fat_g_per_serving: Number(result.recipe.fat_g_per_serving),
            created_at: result.recipe.created_at.toISOString(),
          }
        : undefined,
    } as SavedRecipe;
  }

  async deleteSavedRecipe(id: number): Promise<void> {
    await this.dbclient.saved_recipe.delete({
      where: { id: BigInt(id) },
    });
  }
}
