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
        user_id: BigInt(userId),
        logged_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { recipe: true },
    });
    return result.map((j) => ({
      id: Number(j.id),
      user_id: Number(j.user_id),
      recipe_id: Number(j.recipe_id),
      servings_eaten: Number(j.servings_eaten),
      logged_at: j.logged_at.toISOString(),
      kcal: Number(j.kcal),
      protein_g: Number(j.protein_g),
      carbs_g: Number(j.carbs_g),
      fat_g: Number(j.fat_g),
      recipe: j.recipe
        ? {
            id: Number(j.recipe.id),
            user_id: j.recipe.user_id ? Number(j.recipe.user_id) : null,
            name: j.recipe.name,
            servings: Number(j.recipe.servings),
            kcal_per_serving: Number(j.recipe.kcal_per_serving),
            protein_g_per_serving: Number(j.recipe.protein_g_per_serving),
            carbs_g_per_serving: Number(j.recipe.carbs_g_per_serving),
            fat_g_per_serving: Number(j.recipe.fat_g_per_serving),
            created_at: j.recipe.created_at.toISOString(),
          }
        : undefined,
    })) as Journal[];
  }

  async getJournalEntryById(id: number): Promise<Journal | null> {
    const result = await this.dbclient.journal.findUnique({
      where: { id: BigInt(id) },
      include: { recipe: true },
    });
    if (!result) return null;
    return {
      id: Number(result.id),
      user_id: Number(result.user_id),
      recipe_id: Number(result.recipe_id),
      servings_eaten: Number(result.servings_eaten),
      logged_at: result.logged_at.toISOString(),
      kcal: Number(result.kcal),
      protein_g: Number(result.protein_g),
      carbs_g: Number(result.carbs_g),
      fat_g: Number(result.fat_g),
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
    const result = await this.dbclient.journal.create({
      data: {
        user_id: BigInt(user_id),
        recipe_id: BigInt(recipe_id),
        servings_eaten,
        kcal,
        protein_g,
        carbs_g,
        fat_g,
      },
      include: { recipe: true },
    });
    return {
      id: Number(result.id),
      user_id: Number(result.user_id),
      recipe_id: Number(result.recipe_id),
      servings_eaten: Number(result.servings_eaten),
      logged_at: result.logged_at.toISOString(),
      kcal: Number(result.kcal),
      protein_g: Number(result.protein_g),
      carbs_g: Number(result.carbs_g),
      fat_g: Number(result.fat_g),
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
      where: { id: BigInt(id) },
      data,
      include: { recipe: true },
    });
    return {
      id: Number(result.id),
      user_id: Number(result.user_id),
      recipe_id: Number(result.recipe_id),
      servings_eaten: Number(result.servings_eaten),
      logged_at: result.logged_at.toISOString(),
      kcal: Number(result.kcal),
      protein_g: Number(result.protein_g),
      carbs_g: Number(result.carbs_g),
      fat_g: Number(result.fat_g),
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
    } as Journal;
  }

  async deleteJournalEntry(id: number): Promise<void> {
    await this.dbclient.journal.delete({
      where: { id: BigInt(id) },
    });
  }
}
