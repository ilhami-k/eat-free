import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import { serializeForIPC } from "../../shared/utils/ipcSerializer";

export class SavedRecipeRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getSavedRecipes(userId: bigint): Promise<unknown> {
    const result = await this.dbclient.saved_recipe.findMany({
      where: { user_id: userId },
      include: { recipe: true },
    });
    return serializeForIPC(result);
  }

  async getSavedRecipeById(id: bigint): Promise<unknown> {
    const result = await this.dbclient.saved_recipe.findUnique({
      where: { id },
      include: { recipe: true },
    });
    return serializeForIPC(result);
  }

  async createSavedRecipe(
    user_id: bigint,
    name: string,
    recipe_id: bigint,
    default_servings: number
  ): Promise<unknown> {
    const result = await this.dbclient.saved_recipe.create({
      data: {
        user_id,
        name,
        recipe_id,
        default_servings,
      },
      include: { recipe: true },
    });
    return serializeForIPC(result);
  }

  async updateSavedRecipe(
    id: bigint,
    data: {
      name?: string;
      default_servings?: number;
    }
  ): Promise<unknown> {
    const result = await this.dbclient.saved_recipe.update({
      where: { id },
      data,
      include: { recipe: true },
    });
    return serializeForIPC(result);
  }

  async deleteSavedRecipe(id: bigint): Promise<void> {
    await this.dbclient.saved_recipe.delete({
      where: { id },
    });
  }
}
