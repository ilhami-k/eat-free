/**
 * Database Repository
 * Manages database utilities and administration
 */

import prisma from '../prisma/client';
import type { DatabaseStats } from '../../shared/types';

export class DatabaseRepository {
  async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async getStats(): Promise<DatabaseStats> {
    const [utilisateur, ingredients, recette, inventaire, plansRepas, journal, repasEnregistre] =
      await Promise.all([
        prisma.utilisateur.count(),
        prisma.ingredients.count(),
        prisma.recette.count(),
        prisma.inventaire.count(),
        prisma.plansRepas.count(),
        prisma.journal.count(),
        prisma.repasEnregistre.count(),
      ]);

    return {
      utilisateur,
      ingredients,
      recette,
      inventaire,
      plansRepas,
      journal,
      repasEnregistre,
      timestamp: new Date(),
    };
  }

  async backup() {
    const stats = await this.getStats();
    return {
      ...stats,
      backupDate: new Date(),
      version: '1.0.0',
    };
  }

  async clearAllData(): Promise<void> {
    // Delete in order of foreign key dependencies
    await prisma.planRecettes.deleteMany({});
    await prisma.plansRepas.deleteMany({});
    await prisma.journal.deleteMany({});
    await prisma.repasEnregistre.deleteMany({});
    await prisma.inventaireIngredients.deleteMany({});
    await prisma.inventaire.deleteMany({});
    await prisma.recetteIngredients.deleteMany({});
    await prisma.recette.deleteMany({});
    await prisma.ingredients.deleteMany({});
    await prisma.utilisateur.deleteMany({});
  }

  async getTableStats() {
    return {
      utilisateur: await prisma.utilisateur.count(),
      ingredients: await prisma.ingredients.count(),
      recette: await prisma.recette.count(),
      inventaire: await prisma.inventaire.count(),
      plansRepas: await prisma.plansRepas.count(),
      journal: await prisma.journal.count(),
      repasEnregistre: await prisma.repasEnregistre.count(),
      recetteIngredients: await prisma.recetteIngredients.count(),
      inventaireIngredients: await prisma.inventaireIngredients.count(),
      planRecettes: await prisma.planRecettes.count(),
    };
  }
}

export const databaseRepository = new DatabaseRepository();
