import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

interface GlobalWithPrisma {
  __prisma?: PrismaClient
}

const g = globalThis as GlobalWithPrisma & typeof globalThis & { process?: any }

if (!g.__prisma) {
  const url = g.process?.env?.DATABASE_URL
  g.__prisma = new PrismaClient({ datasources: { db: { url } } })
}

prisma = g.__prisma as PrismaClient

export default prisma


