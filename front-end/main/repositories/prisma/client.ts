/**
 * Prisma Client Singleton
 * Ensures only one instance of PrismaClient is created throughout the application
 */

import { PrismaClient } from '../../generated/prisma';

// Prevent multiple instances during development (especially with hot reload)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
