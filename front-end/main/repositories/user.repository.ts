/**
 * User Repository
 * 
 * All operations related to user management.
 */

import prisma from '../prisma/client';

/**
 * Create a new user
 */
export async function create(email: string, name: string) {
  return prisma.utilisateur.create({
    data: {
      email,
      name,
    },
  });
}

/**
 * Get user by ID
 */
export async function getById(id: bigint) {
  return prisma.utilisateur.findUnique({
    where: { id },
  });
}

/**
 * Get user by email
 */
export async function getByEmail(email: string) {
  return prisma.utilisateur.findUnique({
    where: { email },
  });
}

/**
 * Get all users
 */
export async function getAll() {
  return prisma.utilisateur.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Update user
 */
export async function update(id: bigint, data: { name?: string; email?: string }) {
  return prisma.utilisateur.update({
    where: { id },
    data,
  });
}

/**
 * Delete user and cascade delete related data
 */
export async function deleteUser(id: bigint) {
  return prisma.utilisateur.delete({
    where: { id },
  });
}

/**
 * Get total user count
 */
export async function count() {
  return prisma.utilisateur.count();
}

/**
 * Get user with related data (inventory, recipes, journal)
 */
export async function getWithRelations(id: bigint) {
  return prisma.utilisateur.findUnique({
    where: { id },
    include: {
      inventaire: {
        include: {
          ingredientInventaire: {
            include: {
              ingredient: true,
            },
          },
        },
      },
      recettes: true,
      journal: {
        orderBy: { loggedAt: 'desc' },
        take: 50,
      },
      plansRepas: true,
      repasEnregistre: true,
    },
  });
}
