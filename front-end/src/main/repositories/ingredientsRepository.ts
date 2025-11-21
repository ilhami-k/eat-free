import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import type Ingredient from "../../shared/ingredient";

export class IngredientsRepository {
  private dbclient: PrismaClient;

  constructor(dbclient?: PrismaClient) {
    if (dbclient) {
      this.dbclient = dbclient;
    } else {
      const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
      this.dbclient = new PrismaClient({ adapter });
    }
  }

  async getIngredients(): Promise<Ingredient[]> {
    const result = await this.dbclient.ingredients.findMany();
    
    return result.map((ing) => ({
      id: (ing.id),
      name: ing.name,
      kcal_per_100g: (ing.kcal_per_100g),
      protein_g_per_100g: (ing.protein_g_per_100g),
      carbs_g_per_100g: (ing.carbs_g_per_100g),
      fat_g_per_100g: (ing.fat_g_per_100g),
      created_at: ing.created_at.toISOString(),
    })) as Ingredient[];
  }

  async getIngredientById(id: number): Promise<Ingredient | null> {
    const result = await this.dbclient.ingredients.findUnique({
      where: { id: (id) },
    });
    if (!result) return null;
    return {
      id: (result.id),
      name: result.name,
      kcal_per_100g: (result.kcal_per_100g),
      protein_g_per_100g: (result.protein_g_per_100g),
      carbs_g_per_100g: (result.carbs_g_per_100g),
      fat_g_per_100g: (result.fat_g_per_100g),
      created_at: result.created_at.toISOString(),
    } as Ingredient;
  }

  async getIngredientByName(name: string): Promise<Ingredient | null> {
    const result = await this.dbclient.ingredients.findUnique({
      where: { name },
    });
    if (!result) return null;
    return {
      id: (result.id),
      name: result.name,
      kcal_per_100g: (result.kcal_per_100g),
      protein_g_per_100g: (result.protein_g_per_100g),
      carbs_g_per_100g: (result.carbs_g_per_100g),
      fat_g_per_100g: (result.fat_g_per_100g),
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
      id: (result.id),
      name: result.name,
      kcal_per_100g: (result.kcal_per_100g),
      protein_g_per_100g: (result.protein_g_per_100g),
      carbs_g_per_100g: (result.carbs_g_per_100g),
      fat_g_per_100g: (result.fat_g_per_100g),
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
      where: { id: (id) },
      data,
    });
    return {
      id: (result.id),
      name: result.name,
      kcal_per_100g: (result.kcal_per_100g),
      protein_g_per_100g: (result.protein_g_per_100g),
      carbs_g_per_100g: (result.carbs_g_per_100g),
      fat_g_per_100g: (result.fat_g_per_100g),
      created_at: result.created_at.toISOString(),
    } as Ingredient;
  }

  async deleteIngredient(id: number): Promise<void> {
    await this.dbclient.ingredients.delete({
      where: { id: (id) },
    });
  }
}
