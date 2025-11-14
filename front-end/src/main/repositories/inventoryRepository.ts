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
      id: Number(inv.id),
      user_id: Number(inv.user_id),
      inventory_ingredient: inv.inventory_ingredient?.map((ii) => ({
        inventory_id: Number(ii.inventory_id),
        ingredient_id: Number(ii.ingredient_id),
        qty_grams: Number(ii.qty_grams),
        ingredients: ii.ingredients ? {
          id: Number(ii.ingredients.id),
          name: ii.ingredients.name,
          kcal_per_100g: Number(ii.ingredients.kcal_per_100g),
          protein_g_per_100g: Number(ii.ingredients.protein_g_per_100g),
          carbs_g_per_100g: Number(ii.ingredients.carbs_g_per_100g),
          fat_g_per_100g: Number(ii.ingredients.fat_g_per_100g),
          created_at: ii.ingredients.created_at.toISOString(),
        } : undefined,
      })),
      created_at: inv.created_at.toISOString(),
    })) as Inventory[];
  }

  async getInventoryById(id: number): Promise<Inventory | null> {
    const inventory = await this.dbclient.inventory.findUnique({
      where: { id: BigInt(id) },
      include: {
        inventory_ingredient: {
          include: { ingredients: true },
        },
      },
    });
    if (!inventory) return null;
    return {
      id: Number(inventory.id),
      user_id: Number(inventory.user_id),
      inventory_ingredient: inventory.inventory_ingredient?.map((ii) => ({
        inventory_id: Number(ii.inventory_id),
        ingredient_id: Number(ii.ingredient_id),
        qty_grams: Number(ii.qty_grams),
        ingredients: ii.ingredients ? {
          id: Number(ii.ingredients.id),
          name: ii.ingredients.name,
          kcal_per_100g: Number(ii.ingredients.kcal_per_100g),
          protein_g_per_100g: Number(ii.ingredients.protein_g_per_100g),
          carbs_g_per_100g: Number(ii.ingredients.carbs_g_per_100g),
          fat_g_per_100g: Number(ii.ingredients.fat_g_per_100g),
          created_at: ii.ingredients.created_at.toISOString(),
        } : undefined,
      })),
      created_at: inventory.created_at.toISOString(),
    } as Inventory;
  }

  async getInventoryByUserId(user_id: number): Promise<Inventory | null> {
    const inventory = await this.dbclient.inventory.findUnique({
      where: { user_id: BigInt(user_id) },
      include: {
        inventory_ingredient: {
          include: { ingredients: true },
        },
      },
    });
    if (!inventory) return null;
    return {
      id: Number(inventory.id),
      user_id: Number(inventory.user_id),
      inventory_ingredient: inventory.inventory_ingredient?.map((ii) => ({
        inventory_id: Number(ii.inventory_id),
        ingredient_id: Number(ii.ingredient_id),
        qty_grams: Number(ii.qty_grams),
        ingredients: ii.ingredients ? {
          id: Number(ii.ingredients.id),
          name: ii.ingredients.name,
          kcal_per_100g: Number(ii.ingredients.kcal_per_100g),
          protein_g_per_100g: Number(ii.ingredients.protein_g_per_100g),
          carbs_g_per_100g: Number(ii.ingredients.carbs_g_per_100g),
          fat_g_per_100g: Number(ii.ingredients.fat_g_per_100g),
          created_at: ii.ingredients.created_at.toISOString(),
        } : undefined,
      })),
      created_at: inventory.created_at.toISOString(),
    } as Inventory;
  }

  async createInventory(user_id: number): Promise<Inventory> {
    const inventory = await this.dbclient.inventory.create({
      data: { user_id: BigInt(user_id) },
      include: {
        inventory_ingredient: {
          include: { ingredients: true },
        },
      },
    });
    return {
      id: Number(inventory.id),
      user_id: Number(inventory.user_id),
      inventory_ingredient: inventory.inventory_ingredient?.map((ii) => ({
        inventory_id: Number(ii.inventory_id),
        ingredient_id: Number(ii.ingredient_id),
        qty_grams: Number(ii.qty_grams),
        ingredients: ii.ingredients ? {
          id: Number(ii.ingredients.id),
          name: ii.ingredients.name,
          kcal_per_100g: Number(ii.ingredients.kcal_per_100g),
          protein_g_per_100g: Number(ii.ingredients.protein_g_per_100g),
          carbs_g_per_100g: Number(ii.ingredients.carbs_g_per_100g),
          fat_g_per_100g: Number(ii.ingredients.fat_g_per_100g),
          created_at: ii.ingredients.created_at.toISOString(),
        } : undefined,
      })),
      created_at: inventory.created_at.toISOString(),
    } as Inventory;
  }

  async deleteInventory(id: number): Promise<void> {
    await this.dbclient.inventory.delete({
      where: { id: BigInt(id) },
    });
  }

  async addIngredientToInventory(
    inventory_id: number,
    ingredient_id: number,
    qty_grams: number
  ): Promise<void> {
    await this.dbclient.inventory_ingredient.create({
      data: {
        inventory_id: BigInt(inventory_id),
        ingredient_id: BigInt(ingredient_id),
        qty_grams,
      },
    });
  }

  async updateIngredientInInventory(
    inventory_id: number,
    ingredient_id: number,
    qty_grams: number
  ): Promise<void> {
    await this.dbclient.inventory_ingredient.update({
      where: {
        inventory_id_ingredient_id: {
          inventory_id: BigInt(inventory_id),
          ingredient_id: BigInt(ingredient_id),
        },
      },
      data: { qty_grams },
    });
  }

  async removeIngredientFromInventory(
    inventory_id: number,
    ingredient_id: number
  ): Promise<void> {
    await this.dbclient.inventory_ingredient.delete({
      where: {
        inventory_id_ingredient_id: {
          inventory_id: BigInt(inventory_id),
          ingredient_id: BigInt(ingredient_id),
        },
      },
    });
  }
}
