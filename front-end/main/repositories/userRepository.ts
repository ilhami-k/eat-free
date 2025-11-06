/**
 * User Repository
 * Manages user account data access
 */

import prisma from '../prisma/client';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../shared/types';

export class UserRepository {
  async create(data: CreateUserRequest): Promise<User> {
    return prisma.utilisateur.create({
      data: {
        email: data.email,
        name: data.name,
      },
    }) as Promise<User>;
  }

  async getById(id: bigint): Promise<User | null> {
    return prisma.utilisateur.findUnique({
      where: { id },
    }) as Promise<User | null>;
  }

  async getByEmail(email: string): Promise<User | null> {
    return prisma.utilisateur.findUnique({
      where: { email },
    }) as Promise<User | null>;
  }

  async getAll(): Promise<User[]> {
    return prisma.utilisateur.findMany() as Promise<User[]>;
  }

  async update(data: UpdateUserRequest): Promise<User> {
    return prisma.utilisateur.update({
      where: { id: data.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
      },
    }) as Promise<User>;
  }

  async deleteUser(id: bigint): Promise<void> {
    await prisma.utilisateur.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return prisma.utilisateur.count();
  }

  async getWithRelations(id: bigint) {
    return prisma.utilisateur.findUnique({
      where: { id },
      include: {
        inventaire: true,
        recettes: true,
        plansRepas: true,
        journal: true,
        repasEnregistres: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
