/**
 * Electron Services (Preload Wrappers)
 * Safe wrapper for IPC communication between Renderer and Main processes
 * Used by Vue components and composables
 */

import { ipcRenderer } from 'electron';
import type { ApiResponse, User, CreateUserRequest, UpdateUserRequest, Ingredient, CreateIngredientRequest, Recipe, CreateRecipeRequest, RecipeIngredient, DatabaseStats } from '../shared/types';

/**
 * User Service
 * Provides type-safe access to user repository methods
 */
export const userService = {
  create: (data: CreateUserRequest) =>
    ipcRenderer.invoke('user:create', data) as Promise<ApiResponse<User>>,
  getById: (id: bigint) =>
    ipcRenderer.invoke('user:getById', id) as Promise<ApiResponse<User | null>>,
  getByEmail: (email: string) =>
    ipcRenderer.invoke('user:getByEmail', email) as Promise<ApiResponse<User | null>>,
  getAll: () =>
    ipcRenderer.invoke('user:getAll') as Promise<ApiResponse<User[]>>,
  update: (data: UpdateUserRequest) =>
    ipcRenderer.invoke('user:update', data) as Promise<ApiResponse<User>>,
  delete: (id: bigint) =>
    ipcRenderer.invoke('user:delete', id) as Promise<ApiResponse<void>>,
  count: () =>
    ipcRenderer.invoke('user:count') as Promise<ApiResponse<number>>,
  getWithRelations: (id: bigint) =>
    ipcRenderer.invoke('user:getWithRelations', id) as Promise<ApiResponse<any>>,
};

/**
 * Ingredient Service
 * Provides type-safe access to ingredient repository methods
 */
export const ingredientService = {
  create: (data: CreateIngredientRequest) =>
    ipcRenderer.invoke('ingredient:create', data) as Promise<ApiResponse<Ingredient>>,
  search: (query: string) =>
    ipcRenderer.invoke('ingredient:search', query) as Promise<ApiResponse<Ingredient[]>>,
  getById: (id: bigint) =>
    ipcRenderer.invoke('ingredient:getById', id) as Promise<ApiResponse<Ingredient | null>>,
  getAll: () =>
    ipcRenderer.invoke('ingredient:getAll') as Promise<ApiResponse<Ingredient[]>>,
  getByNutritionRange: (minKcal: number, maxKcal: number, minProtein: number, maxProtein: number) =>
    ipcRenderer.invoke('ingredient:getByNutritionRange', minKcal, maxKcal, minProtein, maxProtein) as Promise<ApiResponse<Ingredient[]>>,
  getHighProteinIngredients: (minProtein?: number) =>
    ipcRenderer.invoke('ingredient:getHighProteinIngredients', minProtein) as Promise<ApiResponse<Ingredient[]>>,
  getLowCalorieIngredients: (maxKcal?: number) =>
    ipcRenderer.invoke('ingredient:getLowCalorieIngredients', maxKcal) as Promise<ApiResponse<Ingredient[]>>,
  getWithUsageCount: () =>
    ipcRenderer.invoke('ingredient:getWithUsageCount') as Promise<ApiResponse<any[]>>,
  count: () =>
    ipcRenderer.invoke('ingredient:count') as Promise<ApiResponse<number>>,
  update: (id: bigint, data: Partial<CreateIngredientRequest>) =>
    ipcRenderer.invoke('ingredient:update', id, data) as Promise<ApiResponse<Ingredient>>,
  delete: (id: bigint) =>
    ipcRenderer.invoke('ingredient:delete', id) as Promise<ApiResponse<void>>,
};

/**
 * Recipe Service
 * Provides type-safe access to recipe repository methods
 */
export const recipeService = {
  create: (data: CreateRecipeRequest) =>
    ipcRenderer.invoke('recipe:create', data) as Promise<ApiResponse<Recipe>>,
  getById: (id: bigint) =>
    ipcRenderer.invoke('recipe:getById', id) as Promise<ApiResponse<Recipe | null>>,
  getAll: () =>
    ipcRenderer.invoke('recipe:getAll') as Promise<ApiResponse<Recipe[]>>,
  getByUser: (userId: bigint) =>
    ipcRenderer.invoke('recipe:getByUser', userId) as Promise<ApiResponse<Recipe[]>>,
  update: (id: bigint, data: Partial<CreateRecipeRequest>) =>
    ipcRenderer.invoke('recipe:update', id, data) as Promise<ApiResponse<Recipe>>,
  delete: (id: bigint) =>
    ipcRenderer.invoke('recipe:delete', id) as Promise<ApiResponse<void>>,
  count: () =>
    ipcRenderer.invoke('recipe:count') as Promise<ApiResponse<number>>,
  addIngredient: (recipeId: bigint, ingredientId: bigint, qtyGrams: number, notes?: string) =>
    ipcRenderer.invoke('recipe:addIngredient', recipeId, ingredientId, qtyGrams, notes) as Promise<ApiResponse<RecipeIngredient>>,
  removeIngredient: (recipeId: bigint, ingredientId: bigint) =>
    ipcRenderer.invoke('recipe:removeIngredient', recipeId, ingredientId) as Promise<ApiResponse<void>>,
  getIngredients: (recipeId: bigint) =>
    ipcRenderer.invoke('recipe:getIngredients', recipeId) as Promise<ApiResponse<any>>,
  updateIngredient: (recipeId: bigint, ingredientId: bigint, qtyGrams: number) =>
    ipcRenderer.invoke('recipe:updateIngredient', recipeId, ingredientId, qtyGrams) as Promise<ApiResponse<RecipeIngredient>>,
  getWithDetails: (id: bigint) =>
    ipcRenderer.invoke('recipe:getWithDetails', id) as Promise<ApiResponse<any>>,
  searchByName: (query: string) =>
    ipcRenderer.invoke('recipe:searchByName', query) as Promise<ApiResponse<Recipe[]>>,
  getHighProteinRecipes: (minProtein?: number) =>
    ipcRenderer.invoke('recipe:getHighProteinRecipes', minProtein) as Promise<ApiResponse<Recipe[]>>,
  getLowCalorieRecipes: (maxKcal?: number) =>
    ipcRenderer.invoke('recipe:getLowCalorieRecipes', maxKcal) as Promise<ApiResponse<Recipe[]>>,
  getRecipesWithIngredientsCount: () =>
    ipcRenderer.invoke('recipe:getRecipesWithIngredientsCount') as Promise<ApiResponse<any>>,
  getPublicRecipes: () =>
    ipcRenderer.invoke('recipe:getPublicRecipes') as Promise<ApiResponse<Recipe[]>>,
};

/**
 * Inventory Service
 * Provides type-safe access to inventory repository methods
 */
export const inventoryService = {
  createForUser: (userId: bigint) =>
    ipcRenderer.invoke('inventory:createForUser', userId) as Promise<ApiResponse<any>>,
  getByUserId: (userId: bigint) =>
    ipcRenderer.invoke('inventory:getByUserId', userId) as Promise<ApiResponse<any>>,
  addOrUpdateIngredient: (inventaireId: bigint, ingredientId: bigint, qtyGrams: number) =>
    ipcRenderer.invoke('inventory:addOrUpdateIngredient', inventaireId, ingredientId, qtyGrams) as Promise<ApiResponse<any>>,
  removeIngredient: (inventaireId: bigint, ingredientId: bigint) =>
    ipcRenderer.invoke('inventory:removeIngredient', inventaireId, ingredientId) as Promise<ApiResponse<void>>,
  getIngredients: (inventaireId: bigint) =>
    ipcRenderer.invoke('inventory:getIngredients', inventaireId) as Promise<ApiResponse<any>>,
  canMakeRecipe: (inventaireId: bigint, recipeId: bigint) =>
    ipcRenderer.invoke('inventory:canMakeRecipe', inventaireId, recipeId) as Promise<ApiResponse<boolean>>,
  consumeRecipe: (inventaireId: bigint, recipeId: bigint) =>
    ipcRenderer.invoke('inventory:consumeRecipe', inventaireId, recipeId) as Promise<ApiResponse<void>>,
  getTotalValue: (inventaireId: bigint) =>
    ipcRenderer.invoke('inventory:getTotalValue', inventaireId) as Promise<ApiResponse<number>>,
  getEstimatedNutrition: (inventaireId: bigint) =>
    ipcRenderer.invoke('inventory:getEstimatedNutrition', inventaireId) as Promise<ApiResponse<any>>,
  clearExpired: (inventaireId: bigint, thresholdDays?: number) =>
    ipcRenderer.invoke('inventory:clearExpired', inventaireId, thresholdDays) as Promise<ApiResponse<number>>,
  getUsageTrends: (inventaireId: bigint, days?: number) =>
    ipcRenderer.invoke('inventory:getUsageTrends', inventaireId, days) as Promise<ApiResponse<any>>,
  getCount: () =>
    ipcRenderer.invoke('inventory:getCount') as Promise<ApiResponse<number>>,
};

/**
 * Meal Plan Service
 * Provides type-safe access to meal plan repository methods
 */
export const mealPlanService = {
  create: (userId: bigint, weekStartDate: Date) =>
    ipcRenderer.invoke('mealplan:create', userId, weekStartDate.toISOString()) as Promise<ApiResponse<any>>,
  getById: (id: bigint) =>
    ipcRenderer.invoke('mealplan:getById', id) as Promise<ApiResponse<any>>,
  getByUser: (userId: bigint) =>
    ipcRenderer.invoke('mealplan:getByUser', userId) as Promise<ApiResponse<any[]>>,
  getCurrentWeek: (userId: bigint) =>
    ipcRenderer.invoke('mealplan:getCurrentWeek', userId) as Promise<ApiResponse<any>>,
  addMeal: (planId: bigint, date: Date, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', recipeId: bigint, plannedServings?: number) =>
    ipcRenderer.invoke('mealplan:addMeal', planId, date.toISOString(), mealType, recipeId, plannedServings) as Promise<ApiResponse<any>>,
  removeMeal: (mealId: bigint) =>
    ipcRenderer.invoke('mealplan:removeMeal', mealId) as Promise<ApiResponse<void>>,
  updateMeal: (mealId: bigint, plannedServings: number) =>
    ipcRenderer.invoke('mealplan:updateMeal', mealId, plannedServings) as Promise<ApiResponse<any>>,
  getMealsForDate: (planId: bigint, date: Date) =>
    ipcRenderer.invoke('mealplan:getMealsForDate', planId, date.toISOString()) as Promise<ApiResponse<any>>,
  getDayNutrition: (planId: bigint, date: Date) =>
    ipcRenderer.invoke('mealplan:getDayNutrition', planId, date.toISOString()) as Promise<ApiResponse<any>>,
  getWeekNutrition: (planId: bigint) =>
    ipcRenderer.invoke('mealplan:getWeekNutrition', planId) as Promise<ApiResponse<any>>,
  getMealsForMealType: (planId: bigint, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') =>
    ipcRenderer.invoke('mealplan:getMealsForMealType', planId, mealType) as Promise<ApiResponse<any>>,
  count: () =>
    ipcRenderer.invoke('mealplan:count') as Promise<ApiResponse<number>>,
  delete: (id: bigint) =>
    ipcRenderer.invoke('mealplan:delete', id) as Promise<ApiResponse<void>>,
};

/**
 * Journal Service
 * Provides type-safe access to journal repository methods
 */
export const journalService = {
  logMeal: (data: any) =>
    ipcRenderer.invoke('journal:logMeal', data) as Promise<ApiResponse<any>>,
  getById: (id: bigint) =>
    ipcRenderer.invoke('journal:getById', id) as Promise<ApiResponse<any>>,
  getByUser: (userId: bigint) =>
    ipcRenderer.invoke('journal:getByUser', userId) as Promise<ApiResponse<any[]>>,
  getByDateRange: (userId: bigint, startDate: Date, endDate: Date) =>
    ipcRenderer.invoke('journal:getByDateRange', userId, startDate.toISOString(), endDate.toISOString()) as Promise<ApiResponse<any[]>>,
  getDailyNutrition: (userId: bigint, date: Date) =>
    ipcRenderer.invoke('journal:getDailyNutrition', userId, date.toISOString()) as Promise<ApiResponse<any>>,
  getAverageDailyNutrition: (userId: bigint, days?: number) =>
    ipcRenderer.invoke('journal:getAverageDailyNutrition', userId, days) as Promise<ApiResponse<any>>,
  delete: (id: bigint) =>
    ipcRenderer.invoke('journal:delete', id) as Promise<ApiResponse<void>>,
  count: () =>
    ipcRenderer.invoke('journal:count') as Promise<ApiResponse<number>>,
  countByUser: (userId: bigint) =>
    ipcRenderer.invoke('journal:countByUser', userId) as Promise<ApiResponse<number>>,
  getMostLoggedRecipes: (userId: bigint, limit?: number) =>
    ipcRenderer.invoke('journal:getMostLoggedRecipes', userId, limit) as Promise<ApiResponse<any>>,
};

/**
 * Saved Meal Service
 * Provides type-safe access to saved meal repository methods
 */
export const savedMealService = {
  create: (userId: bigint, name: string, recipeId: bigint, defaultServings?: number) =>
    ipcRenderer.invoke('savedmeal:create', userId, name, recipeId, defaultServings) as Promise<ApiResponse<any>>,
  getById: (id: bigint) =>
    ipcRenderer.invoke('savedmeal:getById', id) as Promise<ApiResponse<any>>,
  getByUser: (userId: bigint) =>
    ipcRenderer.invoke('savedmeal:getByUser', userId) as Promise<ApiResponse<any[]>>,
  update: (id: bigint, name?: string, defaultServings?: number) =>
    ipcRenderer.invoke('savedmeal:update', id, name, defaultServings) as Promise<ApiResponse<any>>,
  delete: (id: bigint) =>
    ipcRenderer.invoke('savedmeal:delete', id) as Promise<ApiResponse<void>>,
  quickLog: (userId: bigint, savedMealId: bigint, servings?: number) =>
    ipcRenderer.invoke('savedmeal:quickLog', userId, savedMealId, servings) as Promise<ApiResponse<any>>,
  getDefaultNutrition: (savedMealId: bigint) =>
    ipcRenderer.invoke('savedmeal:getDefaultNutrition', savedMealId) as Promise<ApiResponse<any>>,
  getMostUsed: (userId: bigint, limit?: number) =>
    ipcRenderer.invoke('savedmeal:getMostUsed', userId, limit) as Promise<ApiResponse<any>>,
  count: () =>
    ipcRenderer.invoke('savedmeal:count') as Promise<ApiResponse<number>>,
  countByUser: (userId: bigint) =>
    ipcRenderer.invoke('savedmeal:countByUser', userId) as Promise<ApiResponse<number>>,
};

/**
 * Database Service
 * Provides type-safe access to database repository methods
 */
export const databaseService = {
  healthCheck: () =>
    ipcRenderer.invoke('database:healthCheck') as Promise<ApiResponse<boolean>>,
  getStats: () =>
    ipcRenderer.invoke('database:getStats') as Promise<ApiResponse<DatabaseStats>>,
  backup: () =>
    ipcRenderer.invoke('database:backup') as Promise<ApiResponse<any>>,
  getTableStats: () =>
    ipcRenderer.invoke('database:getTableStats') as Promise<ApiResponse<any>>,
  clearAllData: () =>
    ipcRenderer.invoke('database:clearAllData') as Promise<ApiResponse<void>>,
  disconnect: () =>
    ipcRenderer.invoke('database:disconnect') as Promise<ApiResponse<void>>,
};

/**
 * Electron API
 * Complete namespace for all services
 */
export const electronAPI = {
  user: userService,
  ingredient: ingredientService,
  recipe: recipeService,
  inventory: inventoryService,
  mealPlan: mealPlanService,
  journal: journalService,
  savedMeal: savedMealService,
  database: databaseService,
};

export type ElectronAPI = typeof electronAPI;
