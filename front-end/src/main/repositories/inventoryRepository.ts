import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, inventory, inventory_ingredient } from "./prisma/generated/client";
import { serializeForIPC } from "../../shared/utils/ipcSerializer";

export class InventoryRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getInventories(): Promise<inventory[]> {
    const inventories = await this.dbclient.inventory.findMany({
      include: {
        inventory_ingredient: {
          include: { ingredients: true },
        },
      },
    });
    return serializeForIPC(inventories) as inventory[];
  }

  async getInventoryById(id: bigint): Promise<inventory | null> {
    const inventory = await this.dbclient.inventory.findUnique({
      where: { id },
      include: {
        inventory_ingredient: {
          include: { ingredients: true },
        },
      },
    });
    return serializeForIPC(inventory) as inventory | null;
  }

  async getInventoryByUserId(user_id: bigint): Promise<inventory | null> {
    const inventory = await this.dbclient.inventory.findUnique({
      where: { user_id },
      include: {
        inventory_ingredient: {
          include: { ingredients: true },
        },
      },
    });
    return serializeForIPC(inventory) as inventory | null;
  }

  async createInventory(user_id: bigint): Promise<inventory> {
    const inventory = await this.dbclient.inventory.create({
      data: { user_id },
      include: {
        inventory_ingredient: {
          include: { ingredients: true },
        },
      },
    });
    return serializeForIPC(inventory) as inventory;
  }

  async deleteInventory(id: bigint): Promise<void> {
    await this.dbclient.inventory.delete({
      where: { id },
    });
  }

  async addIngredientToInventory(
    inventory_id: bigint,
    ingredient_id: bigint,
    qty_grams: number
  ): Promise<inventory_ingredient> {
    const result = await this.dbclient.inventory_ingredient.create({
      data: {
        inventory_id,
        ingredient_id,
        qty_grams,
      },
    });
    return serializeForIPC(result) as inventory_ingredient;
  }

  async updateIngredientInInventory(
    inventory_id: bigint,
    ingredient_id: bigint,
    qty_grams: number
  ): Promise<inventory_ingredient> {
    const result = await this.dbclient.inventory_ingredient.update({
      where: {
        inventory_id_ingredient_id: {
          inventory_id,
          ingredient_id,
        },
      },
      data: { qty_grams },
    });
    return serializeForIPC(result) as inventory_ingredient;
  }

  async removeIngredientFromInventory(
    inventory_id: bigint,
    ingredient_id: bigint
  ): Promise<void> {
    await this.dbclient.inventory_ingredient.delete({
      where: {
        inventory_id_ingredient_id: {
          inventory_id,
          ingredient_id,
        },
      },
    });
  }
}
