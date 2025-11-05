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

  // 打印连接信息（脱敏）
  try {
    const masked = url.replace(/(mysql:\/\/[^:]+:)([^@]+)(@)/, (_, a, _pwd, c) => a + '******' + c)
    console.info('[DB] Connecting to', masked)
  } catch {}

  // 启用 Prisma 更详细日志以便定位 P1000/P1017 等
  g.__prisma = new PrismaClient({
    datasources: { db: { url } },
    errorFormat: 'pretty',
    log: [
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
  })

  // 输出运行期错误日志
  g.__prisma.$on('error', (e: any) => {
    console.error('[Prisma Error]', e?.message || e)
  })
  g.__prisma.$on('warn', (e: any) => {
    console.warn('[Prisma Warn]', e?.message || e)
  })
}

prisma = g.__prisma as PrismaClient

export default prisma


