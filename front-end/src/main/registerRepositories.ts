import { registerUserRepository } from "./repositories/registerUserRepository";
import { registerRecipeRepository } from "./repositories/registerRecipeRepository";
import { registerIngredientsRepository } from "./repositories/registerIngredientsRepository";
import { registerInventoryRepository } from "./repositories/registerInventoryRepository";
import { registerJournalRepository } from "./repositories/registerJournalRepository";
import { registerMealPlanRepository } from "./repositories/registerMealPlanRepository";
import { registerSavedRecipeRepository } from "./repositories/registerSavedRecipeRepository";

export function registerAllRepositories() {
  registerUserRepository();
  registerRecipeRepository();
  registerIngredientsRepository();
  registerInventoryRepository();
  registerJournalRepository();
  registerMealPlanRepository();
  registerSavedRecipeRepository();
}