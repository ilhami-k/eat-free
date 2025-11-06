/**
 * IPC Handler Registration
 * Registers all repository methods as IPC handlers for Renderer → Main communication
 */

import { ipcMain } from 'electron';
import { repositories } from './repositories/registry';
import type { ApiResponse } from './src/shared/types';

/**
 * Wraps repository methods in try-catch for safe IPC communication
 */
async function safeCall<T>(fn: () => Promise<T>): Promise<ApiResponse<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    console.error('[IPC Error]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Register all User repository IPC handlers
 */
function registerUserHandlers() {
  ipcMain.handle('user:create', async (_event, data) =>
    safeCall(() => repositories.user.create(data))
  );

  ipcMain.handle('user:getById', async (_event, id) =>
    safeCall(() => repositories.user.getById(BigInt(id)))
  );

  ipcMain.handle('user:getByEmail', async (_event, email) =>
    safeCall(() => repositories.user.getByEmail(email))
  );

  ipcMain.handle('user:getAll', async () =>
    safeCall(() => repositories.user.getAll())
  );

  ipcMain.handle('user:update', async (_event, data) =>
    safeCall(() => repositories.user.update({ ...data, id: BigInt(data.id) }))
  );

  ipcMain.handle('user:delete', async (_event, id) =>
    safeCall(() => repositories.user.deleteUser(BigInt(id)))
  );

  ipcMain.handle('user:count', async () =>
    safeCall(() => repositories.user.count())
  );

  ipcMain.handle('user:getWithRelations', async (_event, id) =>
    safeCall(() => repositories.user.getWithRelations(BigInt(id)))
  );
}

/**
 * Register all Ingredient repository IPC handlers
 */
function registerIngredientHandlers() {
  ipcMain.handle('ingredient:create', async (_event, data) =>
    safeCall(() => repositories.ingredient.create(data))
  );

  ipcMain.handle('ingredient:search', async (_event, query) =>
    safeCall(() => repositories.ingredient.search(query))
  );

  ipcMain.handle('ingredient:getById', async (_event, id) =>
    safeCall(() => repositories.ingredient.getById(BigInt(id)))
  );

  ipcMain.handle('ingredient:getAll', async () =>
    safeCall(() => repositories.ingredient.getAll())
  );

  ipcMain.handle('ingredient:getByNutritionRange', async (_event, minKcal, maxKcal, minProtein, maxProtein) =>
    safeCall(() =>
      repositories.ingredient.getByNutritionRange(minKcal, maxKcal, minProtein, maxProtein)
    )
  );

  ipcMain.handle('ingredient:getHighProteinIngredients', async (_event, minProtein = 15) =>
    safeCall(() => repositories.ingredient.getHighProteinIngredients(minProtein))
  );

  ipcMain.handle('ingredient:getLowCalorieIngredients', async (_event, maxKcal = 100) =>
    safeCall(() => repositories.ingredient.getLowCalorieIngredients(maxKcal))
  );

  ipcMain.handle('ingredient:getWithUsageCount', async () =>
    safeCall(() => repositories.ingredient.getWithUsageCount())
  );

  ipcMain.handle('ingredient:count', async () =>
    safeCall(() => repositories.ingredient.count())
  );

  ipcMain.handle('ingredient:update', async (_event, id, data) =>
    safeCall(() => repositories.ingredient.update(BigInt(id), data))
  );

  ipcMain.handle('ingredient:delete', async (_event, id) =>
    safeCall(() => repositories.ingredient.delete(BigInt(id)))
  );
}

/**
 * Register all Recipe repository IPC handlers
 */
function registerRecipeHandlers() {
  ipcMain.handle('recipe:create', async (_event, data) =>
    safeCall(() => repositories.recipe.create(data))
  );

  ipcMain.handle('recipe:getById', async (_event, id) =>
    safeCall(() => repositories.recipe.getById(BigInt(id)))
  );

  ipcMain.handle('recipe:getAll', async () =>
    safeCall(() => repositories.recipe.getAll())
  );

  ipcMain.handle('recipe:getByUser', async (_event, userId) =>
    safeCall(() => repositories.recipe.getByUser(BigInt(userId)))
  );

  ipcMain.handle('recipe:update', async (_event, id, data) =>
    safeCall(() => repositories.recipe.update(BigInt(id), data))
  );

  ipcMain.handle('recipe:delete', async (_event, id) =>
    safeCall(() => repositories.recipe.delete(BigInt(id)))
  );

  ipcMain.handle('recipe:count', async () =>
    safeCall(() => repositories.recipe.count())
  );

  ipcMain.handle('recipe:addIngredient', async (_event, recipeId, ingredientId, qtyGrams, notes) =>
    safeCall(() =>
      repositories.recipe.addIngredient(BigInt(recipeId), BigInt(ingredientId), qtyGrams, notes)
    )
  );

  ipcMain.handle('recipe:removeIngredient', async (_event, recipeId, ingredientId) =>
    safeCall(() => repositories.recipe.removeIngredient(BigInt(recipeId), BigInt(ingredientId)))
  );

  ipcMain.handle('recipe:getIngredients', async (_event, recipeId) =>
    safeCall(() => repositories.recipe.getIngredients(BigInt(recipeId)))
  );

  ipcMain.handle('recipe:updateIngredient', async (_event, recipeId, ingredientId, qtyGrams) =>
    safeCall(() =>
      repositories.recipe.updateIngredient(BigInt(recipeId), BigInt(ingredientId), qtyGrams)
    )
  );

  ipcMain.handle('recipe:getWithDetails', async (_event, id) =>
    safeCall(() => repositories.recipe.getWithDetails(BigInt(id)))
  );

  ipcMain.handle('recipe:searchByName', async (_event, query) =>
    safeCall(() => repositories.recipe.searchByName(query))
  );

  ipcMain.handle('recipe:getHighProteinRecipes', async (_event, minProtein = 30) =>
    safeCall(() => repositories.recipe.getHighProteinRecipes(minProtein))
  );

  ipcMain.handle('recipe:getLowCalorieRecipes', async (_event, maxKcal = 400) =>
    safeCall(() => repositories.recipe.getLowCalorieRecipes(maxKcal))
  );

  ipcMain.handle('recipe:getRecipesWithIngredientsCount', async () =>
    safeCall(() => repositories.recipe.getRecipesWithIngredientsCount())
  );

  ipcMain.handle('recipe:getPublicRecipes', async () =>
    safeCall(() => repositories.recipe.getPublicRecipes())
  );
}

/**
 * Register all Inventory repository IPC handlers
 */
function registerInventoryHandlers() {
  ipcMain.handle('inventory:createForUser', async (_event, userId) =>
    safeCall(() => repositories.inventory.createForUser(BigInt(userId)))
  );

  ipcMain.handle('inventory:getByUserId', async (_event, userId) =>
    safeCall(() => repositories.inventory.getByUserId(BigInt(userId)))
  );

  ipcMain.handle('inventory:addOrUpdateIngredient', async (_event, inventaireId, ingredientId, qtyGrams) =>
    safeCall(() =>
      repositories.inventory.addOrUpdateIngredient(
        BigInt(inventaireId),
        BigInt(ingredientId),
        qtyGrams
      )
    )
  );

  ipcMain.handle('inventory:removeIngredient', async (_event, inventaireId, ingredientId) =>
    safeCall(() =>
      repositories.inventory.removeIngredient(BigInt(inventaireId), BigInt(ingredientId))
    )
  );

  ipcMain.handle('inventory:getIngredients', async (_event, inventaireId) =>
    safeCall(() => repositories.inventory.getIngredients(BigInt(inventaireId)))
  );

  ipcMain.handle('inventory:canMakeRecipe', async (_event, inventaireId, recipeId) =>
    safeCall(() =>
      repositories.inventory.canMakeRecipe(BigInt(inventaireId), BigInt(recipeId))
    )
  );

  ipcMain.handle('inventory:consumeRecipe', async (_event, inventaireId, recipeId) =>
    safeCall(() =>
      repositories.inventory.consumeRecipe(BigInt(inventaireId), BigInt(recipeId))
    )
  );

  ipcMain.handle('inventory:getTotalValue', async (_event, inventaireId) =>
    safeCall(() => repositories.inventory.getTotalValue(BigInt(inventaireId)))
  );

  ipcMain.handle('inventory:getEstimatedNutrition', async (_event, inventaireId) =>
    safeCall(() => repositories.inventory.getEstimatedNutrition(BigInt(inventaireId)))
  );

  ipcMain.handle('inventory:clearExpired', async (_event, inventaireId, thresholdDays = 30) =>
    safeCall(() => repositories.inventory.clearExpired(BigInt(inventaireId), thresholdDays))
  );

  ipcMain.handle('inventory:getUsageTrends', async (_event, inventaireId, days = 30) =>
    safeCall(() => repositories.inventory.getUsageTrends(BigInt(inventaireId), days))
  );

  ipcMain.handle('inventory:getCount', async () =>
    safeCall(() => repositories.inventory.getCount())
  );
}

/**
 * Register all Meal Plan repository IPC handlers
 */
function registerMealPlanHandlers() {
  ipcMain.handle('mealplan:create', async (_event, userId, weekStartDate) =>
    safeCall(() =>
      repositories.mealPlan.create(BigInt(userId), new Date(weekStartDate))
    )
  );

  ipcMain.handle('mealplan:getById', async (_event, id) =>
    safeCall(() => repositories.mealPlan.getById(BigInt(id)))
  );

  ipcMain.handle('mealplan:getByUser', async (_event, userId) =>
    safeCall(() => repositories.mealPlan.getByUser(BigInt(userId)))
  );

  ipcMain.handle('mealplan:getCurrentWeek', async (_event, userId) =>
    safeCall(() => repositories.mealPlan.getCurrentWeek(BigInt(userId)))
  );

  ipcMain.handle('mealplan:addMeal', async (_event, planId, date, mealType, recipeId, plannedServings = 1) =>
    safeCall(() =>
      repositories.mealPlan.addMeal(
        BigInt(planId),
        new Date(date),
        mealType,
        BigInt(recipeId),
        plannedServings
      )
    )
  );

  ipcMain.handle('mealplan:removeMeal', async (_event, mealId) =>
    safeCall(() => repositories.mealPlan.removeMeal(BigInt(mealId)))
  );

  ipcMain.handle('mealplan:updateMeal', async (_event, mealId, plannedServings) =>
    safeCall(() =>
      repositories.mealPlan.updateMeal(BigInt(mealId), plannedServings)
    )
  );

  ipcMain.handle('mealplan:getMealsForDate', async (_event, planId, date) =>
    safeCall(() =>
      repositories.mealPlan.getMealsForDate(BigInt(planId), new Date(date))
    )
  );

  ipcMain.handle('mealplan:getDayNutrition', async (_event, planId, date) =>
    safeCall(() =>
      repositories.mealPlan.getDayNutrition(BigInt(planId), new Date(date))
    )
  );

  ipcMain.handle('mealplan:getWeekNutrition', async (_event, planId) =>
    safeCall(() => repositories.mealPlan.getWeekNutrition(BigInt(planId)))
  );

  ipcMain.handle('mealplan:getMealsForMealType', async (_event, planId, mealType) =>
    safeCall(() =>
      repositories.mealPlan.getMealsForMealType(BigInt(planId), mealType)
    )
  );

  ipcMain.handle('mealplan:count', async () =>
    safeCall(() => repositories.mealPlan.count())
  );

  ipcMain.handle('mealplan:delete', async (_event, id) =>
    safeCall(() => repositories.mealPlan.delete(BigInt(id)))
  );
}

/**
 * Register all Journal repository IPC handlers
 */
function registerJournalHandlers() {
  ipcMain.handle('journal:logMeal', async (_event, data) =>
    safeCall(() => repositories.journal.logMeal(data))
  );

  ipcMain.handle('journal:getById', async (_event, id) =>
    safeCall(() => repositories.journal.getById(BigInt(id)))
  );

  ipcMain.handle('journal:getByUser', async (_event, userId) =>
    safeCall(() => repositories.journal.getByUser(BigInt(userId)))
  );

  ipcMain.handle('journal:getByDateRange', async (_event, userId, startDate, endDate) =>
    safeCall(() =>
      repositories.journal.getByDateRange(
        BigInt(userId),
        new Date(startDate),
        new Date(endDate)
      )
    )
  );

  ipcMain.handle('journal:getDailyNutrition', async (_event, userId, date) =>
    safeCall(() =>
      repositories.journal.getDailyNutrition(BigInt(userId), new Date(date))
    )
  );

  ipcMain.handle('journal:getAverageDailyNutrition', async (_event, userId, days = 7) =>
    safeCall(() =>
      repositories.journal.getAverageDailyNutrition(BigInt(userId), days)
    )
  );

  ipcMain.handle('journal:delete', async (_event, id) =>
    safeCall(() => repositories.journal.delete(BigInt(id)))
  );

  ipcMain.handle('journal:count', async () =>
    safeCall(() => repositories.journal.count())
  );

  ipcMain.handle('journal:countByUser', async (_event, userId) =>
    safeCall(() => repositories.journal.countByUser(BigInt(userId)))
  );

  ipcMain.handle('journal:getMostLoggedRecipes', async (_event, userId, limit = 10) =>
    safeCall(() =>
      repositories.journal.getMostLoggedRecipes(BigInt(userId), limit)
    )
  );
}

/**
 * Register all Saved Meal repository IPC handlers
 */
function registerSavedMealHandlers() {
  ipcMain.handle('savedmeal:create', async (_event, userId, name, recipeId, defaultServings = 1) =>
    safeCall(() =>
      repositories.savedMeal.create(BigInt(userId), name, BigInt(recipeId), defaultServings)
    )
  );

  ipcMain.handle('savedmeal:getById', async (_event, id) =>
    safeCall(() => repositories.savedMeal.getById(BigInt(id)))
  );

  ipcMain.handle('savedmeal:getByUser', async (_event, userId) =>
    safeCall(() => repositories.savedMeal.getByUser(BigInt(userId)))
  );

  ipcMain.handle('savedmeal:update', async (_event, id, name, defaultServings) =>
    safeCall(() =>
      repositories.savedMeal.update(BigInt(id), name, defaultServings)
    )
  );

  ipcMain.handle('savedmeal:delete', async (_event, id) =>
    safeCall(() => repositories.savedMeal.delete(BigInt(id)))
  );

  ipcMain.handle('savedmeal:quickLog', async (_event, userId, savedMealId, servings) =>
    safeCall(() =>
      repositories.savedMeal.quickLog(BigInt(userId), BigInt(savedMealId), servings)
    )
  );

  ipcMain.handle('savedmeal:getDefaultNutrition', async (_event, savedMealId) =>
    safeCall(() => repositories.savedMeal.getDefaultNutrition(BigInt(savedMealId)))
  );

  ipcMain.handle('savedmeal:getMostUsed', async (_event, userId, limit = 5) =>
    safeCall(() =>
      repositories.savedMeal.getMostUsed(BigInt(userId), limit)
    )
  );

  ipcMain.handle('savedmeal:count', async () =>
    safeCall(() => repositories.savedMeal.count())
  );

  ipcMain.handle('savedmeal:countByUser', async (_event, userId) =>
    safeCall(() =>
      repositories.savedMeal.countByUser(BigInt(userId))
    )
  );
}

/**
 * Register all Database repository IPC handlers
 */
function registerDatabaseHandlers() {
  ipcMain.handle('database:healthCheck', async () =>
    safeCall(() => repositories.database.healthCheck())
  );

  ipcMain.handle('database:getStats', async () =>
    safeCall(() => repositories.database.getStats())
  );

  ipcMain.handle('database:backup', async () =>
    safeCall(() => repositories.database.backup())
  );

  ipcMain.handle('database:getTableStats', async () =>
    safeCall(() => repositories.database.getTableStats())
  );

  ipcMain.handle('database:clearAllData', async () =>
    safeCall(() => repositories.database.clearAllData())
  );

  ipcMain.handle('database:disconnect', async () =>
    safeCall(() => repositories.database.disconnect())
  );
}

/**
 * Register all IPC handlers
 */
export function registerAllIpcHandlers() {
  console.log('[IPC] Registering repository handlers...');
  registerUserHandlers();
  registerIngredientHandlers();
  registerRecipeHandlers();
  registerInventoryHandlers();
  registerMealPlanHandlers();
  registerJournalHandlers();
  registerSavedMealHandlers();
  registerDatabaseHandlers();
  console.log('[IPC] All handlers registered successfully');
}
