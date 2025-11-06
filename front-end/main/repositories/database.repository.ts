/**
 * Database Utility Repository
 * 
 * General database operations and statistics.
 */

import prisma from '../prisma/client';

/**
 * Disconnect from the database
 */
export async function disconnect() {
  await prisma.$disconnect();
}

/**
 * Get database statistics (record counts)
 */
export async function getStats() {
  const [
    userCount,
    ingredientCount,
    recipeCount,
    inventoryCount,
    mealPlanCount,
    journalCount,
    savedMealCount,
  ] = await Promise.all([
    prisma.utilisateur.count(),
    prisma.ingredients.count(),
    prisma.recette.count(),
    prisma.inventaire.count(),
    prisma.plansRepas.count(),
    prisma.journal.count(),
    prisma.repasEnregistre.count(),
  ]);

  return {
    utilisateur: userCount,
    ingredients: ingredientCount,
    recette: recipeCount,
    inventaire: inventoryCount,
    plansRepas: mealPlanCount,
    journal: journalCount,
    repasEnregistre: savedMealCount,
    timestamp: new Date(),
  };
}

/**
 * Health check - verify database connection
 */
export async function healthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'healthy',
      connected: true,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date(),
    };
  }
}

/**
 * Execute a raw query (use with caution)
 */
export async function rawQuery(query: string) {
  return prisma.$queryRawUnsafe(query);
}

/**
 * Clear all data (CAUTION: This deletes everything!)
 */
export async function clearAllData() {
  // Delete in reverse order of dependencies
  await prisma.journal.deleteMany({});
  await prisma.plansRepasRecette.deleteMany({});
  await prisma.plansRepas.deleteMany({});
  await prisma.repasEnregistre.deleteMany({});
  await prisma.ingredientsRecette.deleteMany({});
  await prisma.inventaireIngredient.deleteMany({});
  await prisma.recette.deleteMany({});
  await prisma.inventaire.deleteMany({});
  await prisma.ingredients.deleteMany({});
  await prisma.utilisateur.deleteMany({});

  return {
    cleared: true,
    timestamp: new Date(),
  };
}

/**
 * Get database size information
 */
export async function getDatabaseSize() {
  const result = await prisma.$queryRaw<Array<{ TABLE_NAME: string; TABLE_ROWS: number }>>`
    SELECT TABLE_NAME, TABLE_ROWS
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'eat_free'
    ORDER BY TABLE_ROWS DESC;
  `;

  return result;
}

/**
 * Backup current state (export counts and summary)
 */
export async function backup() {
  const stats = await getStats();
  const users = await prisma.utilisateur.findMany({ select: { id: true, email: true } });
  const recipes = await prisma.recette.findMany({ select: { id: true, name: true, userId: true } });

  return {
    backup_timestamp: new Date(),
    stats,
    summary: {
      users: users.map((u) => ({ id: u.id.toString(), email: u.email })),
      recipes: recipes.map((r) => ({ id: r.id.toString(), name: r.name, userId: r.userId?.toString() })),
    },
  };
}
