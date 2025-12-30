import { PrismaClient } from '@prisma/client';

let prisma;
const g = globalThis;
if (!g.__prisma) {
  let url;
  if (typeof process !== "undefined" && process.env) {
    url = process.env.DATABASE_URL;
  }
  if (!url && g.process?.env) {
    url = g.process.env.DATABASE_URL;
  }
  if (!url) {
    const error = new Error(
      "DATABASE_URL environment variable is not set. Please check your .env file and ensure PM2 is loading environment variables correctly."
    );
    console.error("\u274C Database configuration error:", error.message);
    console.error("Current process.env keys:", Object.keys(process?.env || {}));
    throw error;
  }
  g.__prisma = new PrismaClient({ datasources: { db: { url } } });
}
prisma = g.__prisma;

export { prisma as p };
