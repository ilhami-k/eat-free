import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import type Journal from "../../shared/journal";

export class JournalRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getJournalEntries(userId: number, startDate?: Date, endDate?: Date): Promise<Journal[]> {
    const result = await this.dbclient.journal.findMany({
      where: {
        user_id: (userId),
        logged_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { recipe: true },
    });
    return result.map((j) => ({
      id: (j.id),
      user_id: (j.user_id),
      recipe_id: (j.recipe_id),
      servings_eaten: (j.servings_eaten),
      logged_at: j.logged_at.toISOString(),
      kcal: (j.kcal),
      protein_g: (j.protein_g),
      carbs_g: (j.carbs_g),
      fat_g: (j.fat_g),
      recipe: j.recipe ? {
        id: (j.recipe.id),
        user_id: j.recipe.user_id ? (j.recipe.user_id) : null,
        name: j.recipe.name,
        servings: (j.recipe.servings),
        kcal_per_serving: (j.recipe.kcal_per_serving),
        protein_g_per_serving: (j.recipe.protein_g_per_serving),
        carbs_g_per_serving: (j.recipe.carbs_g_per_serving),
        fat_g_per_serving: (j.recipe.fat_g_per_serving),
        created_at: j.recipe.created_at.toISOString(),
      } : undefined,
    })) as Journal[];
  }

  async getJournalEntryById(id: number): Promise<Journal | null> {
    const result = await this.dbclient.journal.findUnique({
      where: { id: (id) },
      include: { recipe: true },
    });
    if (!result) return null;
    return {
      id: (result.id),
      user_id: (result.user_id),
      recipe_id: (result.recipe_id),
      servings_eaten: (result.servings_eaten),
      logged_at: result.logged_at.toISOString(),
      kcal: (result.kcal),
      protein_g: (result.protein_g),
      carbs_g: (result.carbs_g),
      fat_g: (result.fat_g),
      recipe: result.recipe
        ? {
            id: (result.recipe.id),
            user_id: result.recipe.user_id ? (result.recipe.user_id) : null,
            name: result.recipe.name,
            servings: (result.recipe.servings),
            kcal_per_serving: (result.recipe.kcal_per_serving),
            protein_g_per_serving: (result.recipe.protein_g_per_serving),
            carbs_g_per_serving: (result.recipe.carbs_g_per_serving),
            fat_g_per_serving: (result.recipe.fat_g_per_serving),
            created_at: result.recipe.created_at.toISOString(),
          }
        : undefined,
    } as Journal;
  }

  async createJournalEntry(
    user_id: number,
    recipe_id: number,
    servings_eaten: number,
    kcal: number,
    protein_g: number,
    carbs_g: number,
    fat_g: number
  ): Promise<Journal> {
    // Use a transaction to ensure both journal entry and inventory deduction happen atomically
    const result = await this.dbclient.$transaction(async (tx) => {
      // 1. Create the journal entry
      const journalEntry = await tx.journal.create({
        data: {
          user_id: (user_id),
          recipe_id: (recipe_id),
          servings_eaten,
          kcal,
          protein_g,
          carbs_g,
          fat_g,
        },
        include: { recipe: true },
      });

      // 2. Deduct ingredients from inventory
      try {
        await this.deductIngredientsFromInventory(tx, user_id, recipe_id, servings_eaten);
      } catch (error) {
        console.error('Error deducting ingredients from inventory:', error);
        // Continue anyway - don't fail the journal entry creation
      }

      return journalEntry;
    });

    return {
      id: (result.id),
      user_id: (result.user_id),
      recipe_id: (result.recipe_id),
      servings_eaten: (result.servings_eaten),
      logged_at: result.logged_at.toISOString(),
      kcal: (result.kcal),
      protein_g: (result.protein_g),
      carbs_g: (result.carbs_g),
      fat_g: (result.fat_g),
      recipe: result.recipe ? {
        id: (result.recipe.id),
        user_id: result.recipe.user_id ? (result.recipe.user_id) : null,
        name: result.recipe.name,
        servings: (result.recipe.servings),
        kcal_per_serving: (result.recipe.kcal_per_serving),
        protein_g_per_serving: (result.recipe.protein_g_per_serving),
        carbs_g_per_serving: (result.recipe.carbs_g_per_serving),
        fat_g_per_serving: (result.recipe.fat_g_per_serving),
        created_at: result.recipe.created_at.toISOString(),
      } : undefined,
    } as Journal;
  }

  async createJournalEntryWithTime(
    user_id: number,
    recipe_id: number,
    servings_eaten: number,
    kcal: number,
    protein_g: number,
    carbs_g: number,
    fat_g: number,
    logged_at: Date
  ): Promise<Journal> {
    // Use a transaction to ensure both journal entry and inventory deduction happen atomically
    const result = await this.dbclient.$transaction(async (tx) => {
      // 1. Create the journal entry
      const journalEntry = await tx.journal.create({
        data: {
          user_id: (user_id),
          recipe_id: (recipe_id),
          servings_eaten,
          kcal,
          protein_g,
          carbs_g,
          fat_g,
          logged_at,
        },
        include: { recipe: true },
      });

      // 2. Deduct ingredients from inventory
      try {
        await this.deductIngredientsFromInventory(tx, user_id, recipe_id, servings_eaten);
      } catch (error) {
        console.error('Error deducting ingredients from inventory:', error);
        // Continue anyway - don't fail the journal entry creation
      }

      return journalEntry;
    });
    return {
      id: (result.id),
      user_id: (result.user_id),
      recipe_id: (result.recipe_id),
      servings_eaten: (result.servings_eaten),
      logged_at: result.logged_at.toISOString(),
      kcal: (result.kcal),
      protein_g: (result.protein_g),
      carbs_g: (result.carbs_g),
      fat_g: (result.fat_g),
      recipe: result.recipe ? {
        id: (result.recipe.id),
        user_id: result.recipe.user_id ? (result.recipe.user_id) : null,
        name: result.recipe.name,
        servings: (result.recipe.servings),
        kcal_per_serving: (result.recipe.kcal_per_serving),
        protein_g_per_serving: (result.recipe.protein_g_per_serving),
        carbs_g_per_serving: (result.recipe.carbs_g_per_serving),
        fat_g_per_serving: (result.recipe.fat_g_per_serving),
        created_at: result.recipe.created_at.toISOString(),
      } : undefined,
    } as Journal;
  }

  async updateJournalEntry(
    id: number,
    data: {
      servings_eaten?: number;
      kcal?: number;
      protein_g?: number;
      carbs_g?: number;
      fat_g?: number;
    }
  ): Promise<Journal> {
    const result = await this.dbclient.journal.update({
      where: { id: (id) },
      data,
      include: { recipe: true },
    });
    return {
      id: (result.id),
      user_id: (result.user_id),
      recipe_id: (result.recipe_id),
      servings_eaten: (result.servings_eaten),
      logged_at: result.logged_at.toISOString(),
      kcal: (result.kcal),
      protein_g: (result.protein_g),
      carbs_g: (result.carbs_g),
      fat_g: (result.fat_g),
      recipe: result.recipe ? {
        id: (result.recipe.id),
        user_id: result.recipe.user_id ? (result.recipe.user_id) : null,
        name: result.recipe.name,
        servings: (result.recipe.servings),
        kcal_per_serving: (result.recipe.kcal_per_serving),
        protein_g_per_serving: (result.recipe.protein_g_per_serving),
        carbs_g_per_serving: (result.recipe.carbs_g_per_serving),
        fat_g_per_serving: (result.recipe.fat_g_per_serving),
        created_at: result.recipe.created_at.toISOString(),
      } : undefined,
    } as Journal;
  }

  async deleteJournalEntry(id: number): Promise<void> {
    await this.dbclient.journal.delete({
      where: { id: (id) },
    });
  }

  /**
   * Helper method to deduct recipe ingredients from user's inventory
   * Mirrors the logic from the log_meal stored procedure
   */
  private async deductIngredientsFromInventory(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tx: any,
    user_id: number,
    recipe_id: number,
    servings_eaten: number
  ): Promise<void> {
    // Get the recipe to know how many servings it makes
    const recipe = await tx.recipe.findUnique({
      where: { id: (recipe_id) },
      select: { servings: true },
    });

    if (!recipe) {
      throw new Error(`Recipe with id ${recipe_id} not found`);
    }

    const recipe_servings = (recipe.servings) || 1;

    // Get user's inventory
    const inventory = await tx.inventory.findFirst({
      where: { user_id: (user_id) },
    });

    if (!inventory) {
      throw new Error(`Inventory for user ${user_id} not found`);
    }

    // Get all ingredients needed for this recipe
    const recipeIngredients = await tx.recipe_ingredients.findMany({
      where: { recipe_id: (recipe_id) },
    });

    // Calculate the scaling factor: servings_eaten / recipe_servings
    const scalingFactor = servings_eaten / recipe_servings;

    // For each ingredient, deduct from inventory
    for (const recipeIngredient of recipeIngredients) {
      const qtyNeeded = (recipeIngredient.qty_grams) * scalingFactor;

      // Try to find existing inventory item
      const existingInventoryItem = await tx.inventory_ingredient.findUnique({
        where: {
          inventory_id_ingredient_id: {
            inventory_id: inventory.id,
            ingredient_id: recipeIngredient.ingredient_id,
          },
        },
      });

      if (existingInventoryItem) {
        const newQty = (existingInventoryItem.qty_grams) - qtyNeeded;
        
        if (newQty <= 0) {
          // Delete the item if quantity reaches zero or below
          await tx.inventory_ingredient.delete({
            where: {
              inventory_id_ingredient_id: {
                inventory_id: inventory.id,
                ingredient_id: recipeIngredient.ingredient_id,
              },
            },
          });
        } else {
          // Update existing item - deduct the quantity
          await tx.inventory_ingredient.update({
            where: {
              inventory_id_ingredient_id: {
                inventory_id: inventory.id,
                ingredient_id: recipeIngredient.ingredient_id,
              },
            },
            data: {
              qty_grams: newQty,
            },
          });
        }
      }
      // If ingredient doesn't exist in inventory, we simply don't create it
      // The user didn't have it to begin with, so we don't track a deficit
    }
  }
}
