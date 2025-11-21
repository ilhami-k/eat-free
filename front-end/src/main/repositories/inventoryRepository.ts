import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import type Inventory from "../../shared/inventory";

export class InventoryRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getInventories(): Promise<Inventory[]> {
    const result = await this.dbclient.inventory.findMany({
      include: {
        inventory_ingredient: {
          include: { ingredients: true },
        },
      },
    });
    return result.map((inv) => ({
      id: (inv.id),
      user_id: (inv.user_id),
      inventory_ingredient: inv.inventory_ingredient?.map((ii) => ({
        inventory_id: (ii.inventory_id),
        ingredient_id: (ii.ingredient_id),
        qty_grams: (ii.qty_grams),
        ingredients: ii.ingredients ? {
          id: (ii.ingredients.id),
          name: ii.ingredients.name,
          kcal_per_100g: (ii.ingredients.kcal_per_100g),
          protein_g_per_100g: (ii.ingredients.protein_g_per_100g),
          carbs_g_per_100g: (ii.ingredients.carbs_g_per_100g),
          fat_g_per_100g: (ii.ingredients.fat_g_per_100g),
          created_at: ii.ingredients.created_at.toISOString(),
        } : undefined,
      })),
      created_at: inv.created_at.toISOString(),
    })) as Inventory[];
  }

  async getInventoryById(id: number): Promise<Inventory | null> {
    const inventory = await this.dbclient.inventory.findUnique({
      where: { id: (id) },
      include: {
        inventory_ingredient: {
          include: { ingredients: true },
        },
      },
    });
    if (!inventory) return null;
    return {
      id: (inventory.id),
      user_id: (inventory.user_id),
      inventory_ingredient: inventory.inventory_ingredient?.map((ii) => ({
        inventory_id: (ii.inventory_id),
        ingredient_id: (ii.ingredient_id),
        qty_grams: (ii.qty_grams),
        ingredients: ii.ingredients ? {
          id: (ii.ingredients.id),
          name: ii.ingredients.name,
          kcal_per_100g: (ii.ingredients.kcal_per_100g),
          protein_g_per_100g: (ii.ingredients.protein_g_per_100g),
          carbs_g_per_100g: (ii.ingredients.carbs_g_per_100g),
          fat_g_per_100g: (ii.ingredients.fat_g_per_100g),
          created_at: ii.ingredients.created_at.toISOString(),
        } : undefined,
      })),
      created_at: inventory.created_at.toISOString(),
    } as Inventory;
  }

  async getInventoryByUserId(user_id: number): Promise<Inventory | null> {
    const inventory = await this.dbclient.inventory.findUnique({
      where: { user_id: (user_id) },
      include: {
        inventory_ingredient: {
          include: { ingredients: true },
        },
      },
    });
    if (!inventory) return null;
    return {
      id: (inventory.id),
      user_id: (inventory.user_id),
      inventory_ingredient: inventory.inventory_ingredient?.map((ii) => ({
        inventory_id: (ii.inventory_id),
        ingredient_id: (ii.ingredient_id),
        qty_grams: (ii.qty_grams),
        ingredients: ii.ingredients ? {
          id: (ii.ingredients.id),
          name: ii.ingredients.name,
          kcal_per_100g: (ii.ingredients.kcal_per_100g),
          protein_g_per_100g: (ii.ingredients.protein_g_per_100g),
          carbs_g_per_100g: (ii.ingredients.carbs_g_per_100g),
          fat_g_per_100g: (ii.ingredients.fat_g_per_100g),
          created_at: ii.ingredients.created_at.toISOString(),
        } : undefined,
      })),
      created_at: inventory.created_at.toISOString(),
    } as Inventory;
  }

  async createInventory(user_id: number): Promise<Inventory> {
    const inventory = await this.dbclient.inventory.create({
      data: { user_id: (user_id) },
      include: {
        inventory_ingredient: {
          include: { ingredients: true },
        },
      },
    });
    return {
      id: (inventory.id),
      user_id: (inventory.user_id),
      inventory_ingredient: inventory.inventory_ingredient?.map((ii) => ({
        inventory_id: (ii.inventory_id),
        ingredient_id: (ii.ingredient_id),
        qty_grams: (ii.qty_grams),
        ingredients: ii.ingredients ? {
          id: (ii.ingredients.id),
          name: ii.ingredients.name,
          kcal_per_100g: (ii.ingredients.kcal_per_100g),
          protein_g_per_100g: (ii.ingredients.protein_g_per_100g),
          carbs_g_per_100g: (ii.ingredients.carbs_g_per_100g),
          fat_g_per_100g: (ii.ingredients.fat_g_per_100g),
          created_at: ii.ingredients.created_at.toISOString(),
        } : undefined,
      })),
      created_at: inventory.created_at.toISOString(),
    } as Inventory;
  }

  async deleteInventory(id: number): Promise<void> {
    await this.dbclient.inventory.delete({
      where: { id: (id) },
    });
  }

  async addIngredientToInventory(
    inventory_id: number,
    ingredient_id: number,
    qty_grams: number
  ): Promise<void> {
    // Use upsert to handle case where ingredient already exists (even with 0 grams)
    await this.dbclient.inventory_ingredient.upsert({
      where: {
        inventory_id_ingredient_id: {
          inventory_id: (inventory_id),
          ingredient_id: (ingredient_id),
        },
      },
      create: {
        inventory_id: (inventory_id),
        ingredient_id: (ingredient_id),
        qty_grams,
      },
      update: {
        qty_grams: {
          increment: qty_grams, // Add to existing quantity
        },
      },
    });
  }

  async updateIngredientInInventory(
    inventory_id: number,
    ingredient_id: number,
    qty_grams: number
  ): Promise<void> {
    // If quantity is 0 or less, delete the entry entirely
    if (qty_grams <= 0) {
      await this.dbclient.inventory_ingredient.delete({
        where: {
          inventory_id_ingredient_id: {
            inventory_id: (inventory_id),
            ingredient_id: (ingredient_id),
          },
        },
      });
    } else {
      // Otherwise, update the quantity
      await this.dbclient.inventory_ingredient.update({
        where: {
          inventory_id_ingredient_id: {
            inventory_id: (inventory_id),
            ingredient_id: (ingredient_id),
          },
        },
        data: { qty_grams },
      });
    }
  }

  async removeIngredientFromInventory(
    inventory_id: number,
    ingredient_id: number
  ): Promise<void> {
    await this.dbclient.inventory_ingredient.delete({
      where: {
        inventory_id_ingredient_id: {
          inventory_id: (inventory_id),
          ingredient_id: (ingredient_id),
        },
      },
    });
  }
}
