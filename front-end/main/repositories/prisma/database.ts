/**
 * Database Repository Functions
 * 
 * All basic CRUD operations for eat-free database tables.
 * For complex operations with relationships, see the examples.ts file.
 */

import prisma from './client';

// ============================
// UTILISATEUR (Users) OPERATIONS
// ============================

export async function createUser(email: string, name: string) {
  return prisma.utilisateur.create({
    data: {
      email,
      name,
    },
  });
}

export async function getUser(id: bigint) {
  return prisma.utilisateur.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.utilisateur.findUnique({
    where: { email },
  });
}

export async function getAllUsers() {
  return prisma.utilisateur.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateUser(id: bigint, data: { name?: string; email?: string }) {
  return prisma.utilisateur.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: bigint) {
  return prisma.utilisateur.delete({
    where: { id },
  });
}

export async function getUserCount() {
  return prisma.utilisateur.count();
}

// ============================
// INGREDIENTS OPERATIONS
// ============================

export async function createIngredient(
  name: string,
  kcalPer100g: number,
  proteinGPer100g: number,
  carbsGPer100g: number,
  fatGPer100g: number
) {
  return prisma.ingredients.create({
    data: {
      name,
      kcalPer100g,
      proteinGPer100g,
      carbsGPer100g,
      fatGPer100g,
    },
  });
}

export async function getIngredient(id: bigint) {
  return prisma.ingredients.findUnique({
    where: { id },
  });
}

export async function getIngredientByName(name: string) {
  return prisma.ingredients.findUnique({
    where: { name },
  });
}

export async function getAllIngredients() {
  return prisma.ingredients.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function searchIngredients(query: string) {
  return prisma.ingredients.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function updateIngredient(
  id: bigint,
  data: {
    name?: string;
    kcalPer100g?: number;
    proteinGPer100g?: number;
    carbsGPer100g?: number;
    fatGPer100g?: number;
  }
) {
  return prisma.ingredients.update({
    where: { id },
    data,
  });
}

export async function deleteIngredient(id: bigint) {
  return prisma.ingredients.delete({
    where: { id },
  });
}

export async function getIngredientCount() {
  return prisma.ingredients.count();
}

// ============================
// RECETTE (Recipes) OPERATIONS
// ============================

export async function createRecipe(
  userId: bigint | null,
  name: string,
  servings: number,
  kcalPerServing = 0,
  proteinGPerServing = 0,
  carbsGPerServing = 0,
  fatGPerServing = 0
) {
  return prisma.recette.create({
    data: {
      userId,
      name,
      servings,
      kcalPerServing,
      proteinGPerServing,
      carbsGPerServing,
      fatGPerServing,
    },
  });
}

export async function getRecipe(id: bigint) {
  return prisma.recette.findUnique({
    where: { id },
  });
}

export async function getRecipesByUser(userId: bigint) {
  return prisma.recette.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getGlobalRecipes() {
  return prisma.recette.findMany({
    where: { userId: null },
    orderBy: { name: 'asc' },
  });
}

export async function getAllRecipes() {
  return prisma.recette.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function searchRecipes(query: string) {
  return prisma.recette.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function updateRecipe(
  id: bigint,
  data: {
    name?: string;
    servings?: number;
    kcalPerServing?: number;
    proteinGPerServing?: number;
    carbsGPerServing?: number;
    fatGPerServing?: number;
  }
) {
  return prisma.recette.update({
    where: { id },
    data,
  });
}

export async function deleteRecipe(id: bigint) {
  return prisma.recette.delete({
    where: { id },
  });
}

export async function getRecipeCount() {
  return prisma.recette.count();
}

export async function getUserRecipeCount(userId: bigint) {
  return prisma.recette.count({
    where: { userId },
  });
}

// ============================
// INVENTAIRE (Inventory) OPERATIONS
// ============================

export async function createInventory(userId: bigint) {
  return prisma.inventaire.create({
    data: {
      userId,
    },
  });
}

export async function getInventory(id: bigint) {
  return prisma.inventaire.findUnique({
    where: { id },
  });
}

export async function getUserInventory(userId: bigint) {
  return prisma.inventaire.findUnique({
    where: { userId },
  });
}

export async function getAllInventories() {
  return prisma.inventaire.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteInventory(id: bigint) {
  return prisma.inventaire.delete({
    where: { id },
  });
}

// ============================
// PLANSREPAS (Meal Plans) OPERATIONS
// ============================

export async function createMealPlan(userId: bigint, weekStartDate: Date) {
  return prisma.plansRepas.create({
    data: {
      userId,
      weekStartDate,
    },
  });
}

export async function getMealPlan(id: bigint) {
  return prisma.plansRepas.findUnique({
    where: { id },
  });
}

export async function getUserMealPlans(userId: bigint) {
  return prisma.plansRepas.findMany({
    where: { userId },
    orderBy: { weekStartDate: 'desc' },
  });
}

export async function getMealPlanByWeek(userId: bigint, weekStartDate: Date) {
  return prisma.plansRepas.findFirst({
    where: {
      userId,
      weekStartDate,
    },
  });
}

export async function getAllMealPlans() {
  return prisma.plansRepas.findMany({
    orderBy: { weekStartDate: 'desc' },
  });
}

export async function updateMealPlan(id: bigint, weekStartDate: Date) {
  return prisma.plansRepas.update({
    where: { id },
    data: { weekStartDate },
  });
}

export async function deleteMealPlan(id: bigint) {
  return prisma.plansRepas.delete({
    where: { id },
  });
}

export async function getUserMealPlanCount(userId: bigint) {
  return prisma.plansRepas.count({
    where: { userId },
  });
}

// ============================
// JOURNAL (Meal Log) OPERATIONS
// ============================

export async function logMeal(
  userId: bigint,
  recipeId: bigint,
  servingsEaten: number,
  kcal: number,
  proteinG: number,
  carbsG: number,
  fatG: number
) {
  return prisma.journal.create({
    data: {
      userId,
      recipeId,
      servingsEaten,
      kcal,
      proteinG,
      carbsG,
      fatG,
    },
  });
}

export async function getJournalEntry(id: bigint) {
  return prisma.journal.findUnique({
    where: { id },
  });
}

export async function getUserJournal(userId: bigint) {
  return prisma.journal.findMany({
    where: { userId },
    orderBy: { loggedAt: 'desc' },
  });
}

export async function getUserJournalByDateRange(userId: bigint, startDate: Date, endDate: Date) {
  return prisma.journal.findMany({
    where: {
      userId,
      loggedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { loggedAt: 'desc' },
  });
}

export async function getJournalByDate(userId: bigint, date: Date) {
  // Get entries for a specific day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.journal.findMany({
    where: {
      userId,
      loggedAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: { loggedAt: 'asc' },
  });
}

export async function updateJournalEntry(
  id: bigint,
  data: {
    servingsEaten?: number;
    kcal?: number;
    proteinG?: number;
    carbsG?: number;
    fatG?: number;
  }
) {
  return prisma.journal.update({
    where: { id },
    data,
  });
}

export async function deleteJournalEntry(id: bigint) {
  return prisma.journal.delete({
    where: { id },
  });
}

export async function getUserJournalCount(userId: bigint) {
  return prisma.journal.count({
    where: { userId },
  });
}

export async function getUserDailyNutrition(userId: bigint, date: Date) {
  const entries = await getJournalByDate(userId, date);
  
  const totals = {
    kcal: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    mealCount: entries.length,
  };

  entries.forEach((entry) => {
    totals.kcal += Number(entry.kcal);
    totals.proteinG += Number(entry.proteinG);
    totals.carbsG += Number(entry.carbsG);
    totals.fatG += Number(entry.fatG);
  });

  return totals;
}

// ============================
// REPASSENREGISTRE (Saved Meals) OPERATIONS
// ============================

export async function createSavedMeal(
  userId: bigint,
  name: string,
  recipeId: bigint,
  defaultServings = 1
) {
  return prisma.repasEnregistre.create({
    data: {
      userId,
      name,
      recipeId,
      defaultServings,
    },
  });
}

export async function getSavedMeal(id: bigint) {
  return prisma.repasEnregistre.findUnique({
    where: { id },
  });
}

export async function getUserSavedMeals(userId: bigint) {
  return prisma.repasEnregistre.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllSavedMeals() {
  return prisma.repasEnregistre.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateSavedMeal(
  id: bigint,
  data: {
    name?: string;
    recipeId?: bigint;
    defaultServings?: number;
  }
) {
  return prisma.repasEnregistre.update({
    where: { id },
    data,
  });
}

export async function deleteSavedMeal(id: bigint) {
  return prisma.repasEnregistre.delete({
    where: { id },
  });
}

export async function getUserSavedMealCount(userId: bigint) {
  return prisma.repasEnregistre.count({
    where: { userId },
  });
}

// ============================
// GENERIC UTILITIES
// ============================

/**
 * Disconnect from database (call this on app exit)
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
}

/**
 * Get all database statistics
 */
export async function getDatabaseStats() {
  const [userCount, ingredientCount, recipeCount, journalCount, mealPlanCount, savedMealCount] =
    await Promise.all([
      prisma.utilisateur.count(),
      prisma.ingredients.count(),
      prisma.recette.count(),
      prisma.journal.count(),
      prisma.plansRepas.count(),
      prisma.repasEnregistre.count(),
    ]);

  return {
    users: userCount,
    ingredients: ingredientCount,
    recipes: recipeCount,
    journalEntries: journalCount,
    mealPlans: mealPlanCount,
    savedMeals: savedMealCount,
  };
}
