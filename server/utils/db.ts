import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

interface GlobalWithPrisma {
  __prisma?: PrismaClient
}

const g = globalThis as GlobalWithPrisma & typeof globalThis & { process?: any }

if (!g.__prisma) {
  // 尝试多种方式读取 DATABASE_URL
  let url: string | undefined
  
  // 方式1: 从 process.env 读取（Node.js 环境）
  if (typeof process !== 'undefined' && process.env) {
    url = process.env.DATABASE_URL
  }
  
  // 方式2: 从 globalThis.process 读取（某些运行时环境）
  if (!url && g.process?.env) {
    url = g.process.env.DATABASE_URL
  }
  
  // 如果还是没有，抛出清晰的错误
  if (!url) {
    const error = new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please check your .env file and ensure PM2 is loading environment variables correctly.'
    )
    console.error('❌ Database configuration error:', error.message)
    console.error('Current process.env keys:', Object.keys(process?.env || {}))
    throw error
  }
  g.__prisma = new PrismaClient({ datasources: { db: { url } } })
}

prisma = g.__prisma as PrismaClient

export default prisma


