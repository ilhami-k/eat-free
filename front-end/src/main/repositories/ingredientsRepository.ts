import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, ingredients } from "./prisma/generated/client";
import { serializeForIPC } from "../../shared/utils/ipcSerializer";

export class IngredientsRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getIngredients(): Promise<unknown> {
    const result = await this.dbclient.ingredients.findMany();
    return serializeForIPC(result);
  }

  async getIngredientById(id: bigint): Promise<unknown> {
    const result = await this.dbclient.ingredients.findUnique({
      where: { id },
    });
    return serializeForIPC(result);
  }

  async getIngredientByName(name: string): Promise<unknown> {
    const result = await this.dbclient.ingredients.findUnique({
      where: { name },
    });
    return serializeForIPC(result);
  }

  async createIngredient(
    name: string,
    kcal_per_100g: number,
    protein_g_per_100g: number,
    carbs_g_per_100g: number,
    fat_g_per_100g: number
  ): Promise<unknown> {
    const result = await this.dbclient.ingredients.create({
      data: {
        name,
        kcal_per_100g,
        protein_g_per_100g,
        carbs_g_per_100g,
        fat_g_per_100g,
      },
    });
    return serializeForIPC(result);
  }

  async updateIngredient(
    id: bigint,
    data: {
      name?: string;
      kcal_per_100g?: number;
      protein_g_per_100g?: number;
      carbs_g_per_100g?: number;
      fat_g_per_100g?: number;
    }
  ): Promise<unknown> {
    const result = await this.dbclient.ingredients.update({
      where: { id },
      data,
    });
    return serializeForIPC(result);
  }

  async deleteIngredient(id: bigint): Promise<void> {
    await this.dbclient.ingredients.delete({
      where: { id },
    });
  }
}
