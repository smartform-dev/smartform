import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export function isMockMode() {
  return process.env.MOCK_MODE === "true";
}

export async function safeQuery<T>(fn: () => Promise<T>, fallback?: T): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    console.error("safeQuery error:", error);
    return fallback;
  }
}
