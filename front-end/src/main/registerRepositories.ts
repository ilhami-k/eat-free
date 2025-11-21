import { registerUserRepository } from "./repositories/register/registerUserRepository";
import { registerRecipeRepository } from "./repositories/register/registerRecipeRepository";
import { registerIngredientsRepository } from "./repositories/register/registerIngredientsRepository";
import { registerInventoryRepository } from "./repositories/register/registerInventoryRepository";
import { registerJournalRepository } from "./repositories/register/registerJournalRepository";
import { registerMealPlanRepository } from "./repositories/register/registerMealPlanRepository";
import { registerSavedRecipeRepository } from "./repositories/register/registerSavedRecipeRepository";

export function registerAllRepositories() {
  registerUserRepository();
  registerRecipeRepository();
  registerIngredientsRepository();
  registerInventoryRepository();
  registerJournalRepository();
  registerMealPlanRepository();
  registerSavedRecipeRepository();
}