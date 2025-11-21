import type User from "../../shared/user";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";

export class UserRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getUsers(): Promise<User[]> {
    const users = await this.dbclient.user.findMany();
    return users.map((u) => ({
      id: (u.id),
      email: u.email,
      name: u.name,
      created_at: u.created_at.toISOString(),
    })) as User[];
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.dbclient.user.findUnique({
      where: { id: (id) },
    });

    if (!user) return null;

    return {
      id: (user.id),
      email: user.email,
      name: user.name,
      created_at: user.created_at.toISOString(),
    } as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.dbclient.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: (user.id),
      email: user.email,
      name: user.name,
      created_at: user.created_at.toISOString(),
    } as User;
  }

  async createUser(email: string, name: string): Promise<User> {
    const created = await this.dbclient.user.create({
      data: {
        email,
        name,
      },
    });

    return {
      id: (created.id),
      email: created.email,
      name: created.name,
      created_at: created.created_at.toISOString(),
    } as User;
  }

  async updateUser(id: number, data: { email?: string; name?: string }): Promise<User> {
    const updated = await this.dbclient.user.update({
      where: { id: (id) },
      data,
    });

    return {
      id: (updated.id),
      email: updated.email,
      name: updated.name,
      created_at: updated.created_at.toISOString(),
    } as User;
  }

  async deleteUser(id: number): Promise<void> {
    await this.dbclient.user.delete({
      where: { id: (id) },
    });
  }
}

