import type Recipe from "../../shared/recipe";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";

export class RecipeRepository {
  private dbclient: PrismaClient;
  
  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getRecipes(): Promise<Recipe[]> {
    const recipes = await this.dbclient.recipe.findMany({
      include: {
        recipe_ingredients: {
          include: { ingredients: true },
        },
      },
    });

    console.log('Raw recipes from database:', recipes.map(r => ({
      id: r.id,
      name: r.name,
      kcal_per_serving: r.kcal_per_serving,
      protein_g_per_serving: r.protein_g_per_serving
    })))

    const result = recipes.map((r) => ({
      id: Number(r.id),
      user_id: r.user_id ? Number(r.user_id) : null,
      name: r.name,
      servings: Number(r.servings),
      kcal_per_serving: Number(r.kcal_per_serving),
      protein_g_per_serving: Number(r.protein_g_per_serving),
      carbs_g_per_serving: Number(r.carbs_g_per_serving),
      fat_g_per_serving: Number(r.fat_g_per_serving),
      created_at: r.created_at.toISOString(),
      recipe_ingredients: r.recipe_ingredients?.map(ri => ({
        recipe_id: Number(ri.recipe_id),
        ingredient_id: Number(ri.ingredient_id),
        qty_grams: Number(ri.qty_grams),
        notes: ri.notes,
        ingredients: {
          id: Number(ri.ingredients.id),
          name: ri.ingredients.name,
          kcal_per_100g: Number(ri.ingredients.kcal_per_100g),
          protein_g_per_100g: Number(ri.ingredients.protein_g_per_100g),
          carbs_g_per_100g: Number(ri.ingredients.carbs_g_per_100g),
          fat_g_per_100g: Number(ri.ingredients.fat_g_per_100g),
        },
      })),
    })) as Recipe[];

    console.log('Mapped recipes:', result.map(r => ({
      id: r.id,
      name: r.name,
      kcal_per_serving: r.kcal_per_serving,
      protein_g_per_serving: r.protein_g_per_serving
    })))

    return result
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    const recipe = await this.dbclient.recipe.findUnique({
      where: { id: BigInt(id) },
      include: {
        recipe_ingredients: {
          include: { ingredients: true },
        },
      },
    });

    if (!recipe) return null;

    return {
      id: Number(recipe.id),
      user_id: recipe.user_id ? Number(recipe.user_id) : null,
      name: recipe.name,
      servings: Number(recipe.servings),
      kcal_per_serving: Number(recipe.kcal_per_serving),
      protein_g_per_serving: Number(recipe.protein_g_per_serving),
      carbs_g_per_serving: Number(recipe.carbs_g_per_serving),
      fat_g_per_serving: Number(recipe.fat_g_per_serving),
      created_at: recipe.created_at.toISOString(),
      recipe_ingredients: recipe.recipe_ingredients?.map(ri => ({
        recipe_id: Number(ri.recipe_id),
        ingredient_id: Number(ri.ingredient_id),
        qty_grams: Number(ri.qty_grams),
        notes: ri.notes,
        ingredients: {
          id: Number(ri.ingredients.id),
          name: ri.ingredients.name,
          kcal_per_100g: Number(ri.ingredients.kcal_per_100g),
          protein_g_per_100g: Number(ri.ingredients.protein_g_per_100g),
          carbs_g_per_100g: Number(ri.ingredients.carbs_g_per_100g),
          fat_g_per_100g: Number(ri.ingredients.fat_g_per_100g),
        },
      })),
    } as Recipe;
  }

  async createRecipe(recipe: Omit<Recipe, "id" | "created_at">, ingredients?: Array<{ ingredient_id: bigint, qty_grams: number, notes?: string | null }>): Promise<Recipe> {
    const created = await this.dbclient.recipe.create({
      data: {
        user_id: recipe.user_id ? BigInt(recipe.user_id) : null,
        name: recipe.name,
        servings: recipe.servings,
        kcal_per_serving: recipe.kcal_per_serving,
        protein_g_per_serving: recipe.protein_g_per_serving,
        carbs_g_per_serving: recipe.carbs_g_per_serving,
        fat_g_per_serving: recipe.fat_g_per_serving,
        recipe_ingredients: ingredients && ingredients.length > 0 ? {
          create: ingredients.map(ing => ({
            ingredient_id: BigInt(ing.ingredient_id),
            qty_grams: ing.qty_grams,
            notes: ing.notes || null,
          })),
        } : undefined,
      },
      include: {
        recipe_ingredients: {
          include: { ingredients: true },
        },
      },
    });

    return {
      id: Number(created.id),
      user_id: created.user_id ? Number(created.user_id) : null,
      name: created.name,
      servings: Number(created.servings),
      kcal_per_serving: Number(created.kcal_per_serving),
      protein_g_per_serving: Number(created.protein_g_per_serving),
      carbs_g_per_serving: Number(created.carbs_g_per_serving),
      fat_g_per_serving: Number(created.fat_g_per_serving),
      created_at: created.created_at.toISOString(),
      recipe_ingredients: created.recipe_ingredients?.map(ri => ({
        recipe_id: Number(ri.recipe_id),
        ingredient_id: Number(ri.ingredient_id),
        qty_grams: Number(ri.qty_grams),
        notes: ri.notes,
        ingredients: {
          id: Number(ri.ingredients.id),
          name: ri.ingredients.name,
          kcal_per_100g: Number(ri.ingredients.kcal_per_100g),
          protein_g_per_100g: Number(ri.ingredients.protein_g_per_100g),
          carbs_g_per_100g: Number(ri.ingredients.carbs_g_per_100g),
          fat_g_per_100g: Number(ri.ingredients.fat_g_per_100g),
        },
      })),
    } as Recipe;
  }

  async updateRecipe(id: number, recipe: Partial<Omit<Recipe, "id" | "created_at">>): Promise<Recipe> {
    const updated = await this.dbclient.recipe.update({
      where: { id: BigInt(id) },
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
      id: Number(updated.id),
      user_id: updated.user_id ? Number(updated.user_id) : null,
      name: updated.name,
      servings: Number(updated.servings),
      kcal_per_serving: Number(updated.kcal_per_serving),
      protein_g_per_serving: Number(updated.protein_g_per_serving),
      carbs_g_per_serving: Number(updated.carbs_g_per_serving),
      fat_g_per_serving: Number(updated.fat_g_per_serving),
      created_at: updated.created_at.toISOString(),
    } as Recipe;
  }

  async deleteRecipe(id: number): Promise<void> {
    await this.dbclient.recipe.delete({
      where: { id: BigInt(id) },
    });
  }
}
