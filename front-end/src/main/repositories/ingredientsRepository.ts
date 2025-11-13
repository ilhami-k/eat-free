import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import type Ingredient from "../../shared/ingredient";

export class IngredientsRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getIngredients(): Promise<Ingredient[]> {
    const result = await this.dbclient.ingredients.findMany();
    return result.map((ing) => ({
      id: Number(ing.id),
      name: ing.name,
      kcal_per_100g: Number(ing.kcal_per_100g),
      protein_g_per_100g: Number(ing.protein_g_per_100g),
      carbs_g_per_100g: Number(ing.carbs_g_per_100g),
      fat_g_per_100g: Number(ing.fat_g_per_100g),
      created_at: ing.created_at.toISOString(),
    })) as Ingredient[];
  }

  async getIngredientById(id: number): Promise<Ingredient | null> {
    const result = await this.dbclient.ingredients.findUnique({
      where: { id: BigInt(id) },
    });
    if (!result) return null;
    return {
      id: Number(result.id),
      name: result.name,
      kcal_per_100g: Number(result.kcal_per_100g),
      protein_g_per_100g: Number(result.protein_g_per_100g),
      carbs_g_per_100g: Number(result.carbs_g_per_100g),
      fat_g_per_100g: Number(result.fat_g_per_100g),
      created_at: result.created_at.toISOString(),
    } as Ingredient;
  }

  async getIngredientByName(name: string): Promise<Ingredient | null> {
    const result = await this.dbclient.ingredients.findUnique({
      where: { name },
    });
    if (!result) return null;
    return {
      id: Number(result.id),
      name: result.name,
      kcal_per_100g: Number(result.kcal_per_100g),
      protein_g_per_100g: Number(result.protein_g_per_100g),
      carbs_g_per_100g: Number(result.carbs_g_per_100g),
      fat_g_per_100g: Number(result.fat_g_per_100g),
      created_at: result.created_at.toISOString(),
    } as Ingredient;
  }

  async createIngredient(
    name: string,
    kcal_per_100g: number,
    protein_g_per_100g: number,
    carbs_g_per_100g: number,
    fat_g_per_100g: number
  ): Promise<Ingredient> {
    const result = await this.dbclient.ingredients.create({
      data: {
        name,
        kcal_per_100g,
        protein_g_per_100g,
        carbs_g_per_100g,
        fat_g_per_100g,
      },
    });
    return {
      id: Number(result.id),
      name: result.name,
      kcal_per_100g: Number(result.kcal_per_100g),
      protein_g_per_100g: Number(result.protein_g_per_100g),
      carbs_g_per_100g: Number(result.carbs_g_per_100g),
      fat_g_per_100g: Number(result.fat_g_per_100g),
      created_at: result.created_at.toISOString(),
    } as Ingredient;
  }

  async updateIngredient(
    id: number,
    data: {
      name?: string;
      kcal_per_100g?: number;
      protein_g_per_100g?: number;
      carbs_g_per_100g?: number;
      fat_g_per_100g?: number;
    }
  ): Promise<Ingredient> {
    const result = await this.dbclient.ingredients.update({
      where: { id: BigInt(id) },
      data,
    });
    return {
      id: Number(result.id),
      name: result.name,
      kcal_per_100g: Number(result.kcal_per_100g),
      protein_g_per_100g: Number(result.protein_g_per_100g),
      carbs_g_per_100g: Number(result.carbs_g_per_100g),
      fat_g_per_100g: Number(result.fat_g_per_100g),
      created_at: result.created_at.toISOString(),
    } as Ingredient;
  }

  async deleteIngredient(id: number): Promise<void> {
    await this.dbclient.ingredients.delete({
      where: { id: BigInt(id) },
    });
  }
}
