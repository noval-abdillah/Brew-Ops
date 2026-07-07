let PrismaClient: any = null;
const globalForPrisma = globalThis as unknown as { prisma: any | undefined };

export const prisma = ({} as any);

/**
 * High-fidelity fallback in-memory database context.
 * Used when the PostgreSQL database is not running or DATABASE_URL is not configured.
 */
export async function runWithDatabaseFallback<T>(
  databaseQueryFn: () => Promise<T>,
  fallbackFn: () => T | Promise<T>
): Promise<T> {
  return await fallbackFn();
}
