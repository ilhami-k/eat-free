/**
 * Register All Repositories
 * Hub file that calls all individual repository registrations
 * This keeps main.ts clean and makes it easy to add new repositories
 */

import { registerUserRepository } from './registerUserRepository';
import { registerIngredientRepository } from './registerIngredientRepository';
import { registerRecipeRepository } from './registerRecipeRepository';
import { registerInventoryRepository } from './registerInventoryRepository';
import { registerMealPlanRepository } from './registerMealPlanRepository';
import { registerJournalRepository } from './registerJournalRepository';
import { registerSavedMealRepository } from './registerSavedMealRepository';
import { registerDatabaseRepository } from './registerDatabaseRepository';

/**
 * Register all IPC handlers for all repositories
 * Called once during app startup in main.ts
 */
export function registerAllRepositories() {
  console.log('[IPC] Registering all repository handlers...');

  registerUserRepository();
  registerIngredientRepository();
  registerRecipeRepository();
  registerInventoryRepository();
  registerMealPlanRepository();
  registerJournalRepository();
  registerSavedMealRepository();
  registerDatabaseRepository();

  console.log('[IPC] All repository handlers registered successfully');
}
