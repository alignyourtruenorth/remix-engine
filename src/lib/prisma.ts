import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Resolved relative to the process's working directory (the project root, for
// both `next dev`/`next start` and the Prisma CLI via prisma.config.ts).
const url = process.env.DATABASE_URL!.replace(/^file:/, "");

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
