import { PrismaClient } from "@prisma/client";

// In dev mode, ts-node-dev restarts the file frequently.
// Without this pattern, each restart creates a NEW PrismaClient instance,
// eventually exhausting the database connection pool.
// So we cache a single instance on the global object.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;