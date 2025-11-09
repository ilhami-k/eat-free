import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import { serializeForIPC } from "../../shared/utils/ipcSerializer";

export class JournalRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getJournalEntries(userId: bigint, startDate?: Date, endDate?: Date): Promise<unknown> {
    const result = await this.dbclient.journal.findMany({
      where: {
        user_id: userId,
        logged_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { recipe: true },
    });
    return serializeForIPC(result);
  }

  async getJournalEntryById(id: bigint): Promise<unknown> {
    const result = await this.dbclient.journal.findUnique({
      where: { id },
      include: { recipe: true },
    });
    return serializeForIPC(result);
  }

  async createJournalEntry(
    user_id: bigint,
    recipe_id: bigint,
    servings_eaten: number,
    kcal: number,
    protein_g: number,
    carbs_g: number,
    fat_g: number
  ): Promise<unknown> {
    const result = await this.dbclient.journal.create({
      data: {
        user_id,
        recipe_id,
        servings_eaten,
        kcal,
        protein_g,
        carbs_g,
        fat_g,
      },
      include: { recipe: true },
    });
    return serializeForIPC(result);
  }

  async updateJournalEntry(
    id: bigint,
    data: {
      servings_eaten?: number;
      kcal?: number;
      protein_g?: number;
      carbs_g?: number;
      fat_g?: number;
    }
  ): Promise<unknown> {
    const result = await this.dbclient.journal.update({
      where: { id },
      data,
      include: { recipe: true },
    });
    return serializeForIPC(result);
  }

  async deleteJournalEntry(id: bigint): Promise<void> {
    await this.dbclient.journal.delete({
      where: { id },
    });
  }
}
