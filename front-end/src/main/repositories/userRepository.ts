import User from "../../shared/user";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, user } from "./prisma/generated/client";

export class UserRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getUsers(): Promise<User[]> {
    const users = await this.dbclient.user.findMany();

    return users.map((u: user) => {
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        created_at: u.created_at,
      } as User;
    });
  }

  async getUserById(id: bigint): Promise<User | null> {
    const user = await this.dbclient.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
    } as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.dbclient.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
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
      id: created.id,
      email: created.email,
      name: created.name,
      created_at: created.created_at,
    } as User;
  }

  async updateUser(id: bigint, data: { email?: string; name?: string }): Promise<User> {
    const updated = await this.dbclient.user.update({
      where: { id },
      data,
    });

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      created_at: updated.created_at,
    } as User;
  }

  async deleteUser(id: bigint): Promise<void> {
    await this.dbclient.user.delete({
      where: { id },
    });
  }
}

