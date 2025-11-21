import type Recipe from "../../shared/recipe";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";

export class RecipeRepository {
  private dbclient: PrismaClient;
  
  constructor(dbclient?: PrismaClient) {
    if (dbclient) {
      this.dbclient = dbclient;
    } else {
      const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
      this.dbclient = new PrismaClient({ adapter });
    }
  }

  async getRecipes(): Promise<Recipe[]> {
    const recipes = await this.dbclient.recipe.findMany({
      include: {
        recipe_ingredients: {
          include: { ingredients: true },
        },
      },
    });

    const result = recipes.map((r) => ({
      id: (r.id),
      user_id: r.user_id ? (r.user_id) : null,
      name: r.name,
      servings: (r.servings),
      kcal_per_serving: (r.kcal_per_serving),
      protein_g_per_serving: (r.protein_g_per_serving),
      carbs_g_per_serving: (r.carbs_g_per_serving),
      fat_g_per_serving: (r.fat_g_per_serving),
      created_at: r.created_at.toISOString(),
      recipe_ingredients: r.recipe_ingredients?.map(ri => ({
        recipe_id: (ri.recipe_id),
        ingredient_id: (ri.ingredient_id),
        qty_grams: (ri.qty_grams),
        notes: ri.notes,
        ingredients: {
          id: (ri.ingredients.id),
          name: ri.ingredients.name,
          kcal_per_100g: (ri.ingredients.kcal_per_100g),
          protein_g_per_100g: (ri.ingredients.protein_g_per_100g),
          carbs_g_per_100g: (ri.ingredients.carbs_g_per_100g),
          fat_g_per_100g: (ri.ingredients.fat_g_per_100g),
        },
      })),
    })) as Recipe[];

    return result;
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    const recipe = await this.dbclient.recipe.findUnique({
      where: { id: (id) },
      include: {
        recipe_ingredients: {
          include: { ingredients: true },
        },
      },
    });

    if (!recipe) return null;

    return {
      id: (recipe.id),
      user_id: recipe.user_id ? (recipe.user_id) : null,
      name: recipe.name,
      servings: (recipe.servings),
      kcal_per_serving: (recipe.kcal_per_serving),
      protein_g_per_serving: (recipe.protein_g_per_serving),
      carbs_g_per_serving: (recipe.carbs_g_per_serving),
      fat_g_per_serving: (recipe.fat_g_per_serving),
      created_at: recipe.created_at.toISOString(),
      recipe_ingredients: recipe.recipe_ingredients?.map(ri => ({
        recipe_id: (ri.recipe_id),
        ingredient_id: (ri.ingredient_id),
        qty_grams: (ri.qty_grams),
        notes: ri.notes,
        ingredients: {
          id: (ri.ingredients.id),
          name: ri.ingredients.name,
          kcal_per_100g: (ri.ingredients.kcal_per_100g),
          protein_g_per_100g: (ri.ingredients.protein_g_per_100g),
          carbs_g_per_100g: (ri.ingredients.carbs_g_per_100g),
          fat_g_per_100g: (ri.ingredients.fat_g_per_100g),
        },
      })),
    } as Recipe;
  }

  async createRecipe(recipe: Omit<Recipe, "id" | "created_at">, ingredients?: Array<{ ingredient_id: number, qty_grams: number, notes?: string | null }>): Promise<Recipe> {
    const created = await this.dbclient.recipe.create({
      data: {
        user_id: recipe.user_id ? recipe.user_id : null,
        name: recipe.name,
        servings: recipe.servings,
        kcal_per_serving: recipe.kcal_per_serving,
        protein_g_per_serving: recipe.protein_g_per_serving,
        carbs_g_per_serving: recipe.carbs_g_per_serving,
        fat_g_per_serving: recipe.fat_g_per_serving,
        recipe_ingredients: ingredients && ingredients.length > 0 ? {
          create: ingredients.map(ing => ({
            ingredient_id: ing.ingredient_id,
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
      id: created.id,
      user_id: created.user_id ? created.user_id : null,
      name: created.name,
      servings: created.servings,
      kcal_per_serving: created.kcal_per_serving,
      protein_g_per_serving: created.protein_g_per_serving,
      carbs_g_per_serving: created.carbs_g_per_serving,
      fat_g_per_serving: created.fat_g_per_serving,
      created_at: created.created_at.toISOString(),
      recipe_ingredients: created.recipe_ingredients?.map(ri => ({
        recipe_id: ri.recipe_id,
        ingredient_id: ri.ingredient_id,
        qty_grams: ri.qty_grams,
        notes: ri.notes,
        ingredients: {
          id: (ri.ingredients.id),
          name: ri.ingredients.name,
          kcal_per_100g: (ri.ingredients.kcal_per_100g),
          protein_g_per_100g: (ri.ingredients.protein_g_per_100g),
          carbs_g_per_100g: (ri.ingredients.carbs_g_per_100g),
          fat_g_per_100g: (ri.ingredients.fat_g_per_100g),
        },
      })),
    } as Recipe;
  }

  async updateRecipe(id: number, recipe: Partial<Omit<Recipe, "id" | "created_at">>): Promise<Recipe> {
    const updated = await this.dbclient.recipe.update({
      where: { id: (id) },
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
      id: (updated.id),
      user_id: updated.user_id ? (updated.user_id) : null,
      name: updated.name,
      servings: (updated.servings),
      kcal_per_serving: (updated.kcal_per_serving),
      protein_g_per_serving: (updated.protein_g_per_serving),
      carbs_g_per_serving: (updated.carbs_g_per_serving),
      fat_g_per_serving: (updated.fat_g_per_serving),
      created_at: updated.created_at.toISOString(),
    } as Recipe;
  }

  async deleteRecipe(id: number): Promise<void> {
    await this.dbclient.recipe.delete({
      where: { id: (id) },
    });
  }
}
