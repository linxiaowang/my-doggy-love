// @ts-nocheck
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { H3Event, getRequestHeader, readMultipartFormData } from 'h3'
import OSS from 'ali-oss'

export interface FileLike {
  filename: string
  type?: string
  data: any
}

export interface StorageSaveResult {
  url: string
  path: string
}

export interface StorageService {
  save(file: FileLike, opts?: { prefix?: string }): Promise<StorageSaveResult>
  getSignedUrl?(path: string, expires?: number): string
  toAccessibleUrl?(storedUrl: string, expires?: number): string
}

export class LocalStorageService implements StorageService {
  constructor(private baseDir: string = (globalThis as any).process?.env?.UPLOAD_DIR || 'public/uploads') {}

  async save(file: FileLike, opts?: { prefix?: string }): Promise<StorageSaveResult> {
    const now = new Date()
    const yyyy = String(now.getFullYear())
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const prefix = opts?.prefix ? `${opts.prefix}/` : ''
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.filename.replace(/[^a-zA-Z0-9_.-]/g, '_')}`
    const relPath = `${prefix}${yyyy}/${mm}/${dd}/${safeName}`
    const absPath = join(this.baseDir, relPath)
    await fs.mkdir(dirname(absPath), { recursive: true })
    await fs.writeFile(absPath, file.data)
    const publicUrl = `/uploads/${relPath}`
    return { url: publicUrl, path: absPath }
  }
}

export class OSSStorageService implements StorageService {
  private client: OSS
  private customDomain?: string
  private signUrlExpires: number
  private readonly OSS_PREFIX = 'oss:'

  constructor() {
    const env = (globalThis as any).process?.env
    const accessKeyId = env?.OSS_ACCESS_KEY_ID
    const accessKeySecret = env?.OSS_ACCESS_KEY_SECRET
    const bucket = env?.OSS_BUCKET
    const region = env?.OSS_REGION
    const endpoint = env?.OSS_ENDPOINT
    this.customDomain = env?.OSS_CUSTOM_DOMAIN
    // 签名 URL 有效期（秒），默认 1 年（31536000 秒），可通过环境变量配置
    this.signUrlExpires = parseInt(env?.OSS_SIGN_URL_EXPIRES || '31536000', 10)

    // 调试信息：打印配置（隐藏敏感信息）
    console.log('[OSS Storage] 初始化配置:')
    console.log('  - OSS_ACCESS_KEY_ID:', accessKeyId ? `${accessKeyId.substring(0, 8)}...` : '未设置')
    console.log('  - OSS_ACCESS_KEY_SECRET:', accessKeySecret ? '已设置（已隐藏）' : '未设置')
    console.log('  - OSS_BUCKET:', bucket || '未设置')
    console.log('  - OSS_REGION:', region || '未设置（使用默认: oss-cn-hangzhou）')
    console.log('  - OSS_ENDPOINT:', endpoint || '未设置')
    console.log('  - OSS_CUSTOM_DOMAIN:', this.customDomain || '未设置')
    console.log('  - OSS_SIGN_URL_EXPIRES:', this.signUrlExpires)

    if (!accessKeyId || !accessKeySecret || !bucket) {
      console.error('[OSS Storage] 配置缺失!')
      throw new Error('OSS configuration is missing. Please set OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, and OSS_BUCKET environment variables.')
    }

    // 构建 OSS 配置对象
    const ossConfig: any = {
      accessKeyId,
      accessKeySecret,
      bucket,
      region: region || 'oss-cn-hangzhou',
    }

    // 只在 endpoint 有值时才添加（空字符串会导致错误）
    if (endpoint && endpoint.trim()) {
      let endpointValue = endpoint.trim()
      // 如果 endpoint 没有协议前缀，自动添加 https://
      if (!endpointValue.startsWith('http://') && !endpointValue.startsWith('https://')) {
        endpointValue = `https://${endpointValue}`
        console.log('[OSS Storage] Endpoint 自动添加 https:// 前缀:', endpointValue)
      }
      ossConfig.endpoint = endpointValue
    }

    console.log('[OSS Storage] 最终 OSS 配置:', {
      accessKeyId: ossConfig.accessKeyId ? `${ossConfig.accessKeyId.substring(0, 8)}...` : '未设置',
      accessKeySecret: '已设置（已隐藏）',
      bucket: ossConfig.bucket,
      region: ossConfig.region,
      endpoint: ossConfig.endpoint || '未设置（使用 region 默认）',
    })

    try {
      this.client = new OSS(ossConfig)
      console.log('[OSS Storage] OSS 客户端初始化成功')
    } catch (error: any) {
      console.error('[OSS Storage] OSS 客户端初始化失败:', error.message)
      console.error('[OSS Storage] 错误详情:', error)
      throw error
    }
  }

  async save(file: FileLike, opts?: { prefix?: string }): Promise<StorageSaveResult> {
    const now = new Date()
    const yyyy = String(now.getFullYear())
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const prefix = opts?.prefix ? `${opts.prefix}/` : ''
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.filename.replace(/[^a-zA-Z0-9_.-]/g, '_')}`
    const objectName = `${prefix}${yyyy}/${mm}/${dd}/${safeName}`

    await this.client.put(objectName, file.data, {
      mime: file.type || 'application/octet-stream',
    })

    // 存储时使用前缀标识 OSS 路径，而不是完整的签名 URL
    // 这样可以避免数据库字段长度限制问题
    const storedUrl = `${this.OSS_PREFIX}${objectName}`

    return {
      url: storedUrl,
      path: objectName,
    }
  }

  getSignedUrl(path: string, expires: number = 3600): string {
    if (this.customDomain) {
      return this.client.signatureUrl(path, {
        expires,
        domain: this.customDomain,
      })
    }
    return this.client.signatureUrl(path, {
      expires,
    })
  }

  // 检查是否是 OSS 路径
  isOSSPath(url: string): boolean {
    return url.startsWith(this.OSS_PREFIX)
  }

  // 从存储的 URL 中提取 OSS 对象路径
  getOSSPath(url: string): string | null {
    if (this.isOSSPath(url)) {
      return url.substring(this.OSS_PREFIX.length)
    }
    return null
  }

  // 将存储的 URL 转换为可访问的签名 URL
  toAccessibleUrl(storedUrl: string, expires?: number): string {
    const ossPath = this.getOSSPath(storedUrl)
    if (ossPath) {
      return this.getSignedUrl(ossPath, expires || this.signUrlExpires)
    }
    // 如果不是 OSS 路径，直接返回原 URL（本地存储）
    return storedUrl
  }
}

// 工厂函数：根据环境变量选择存储服务
export function createStorageService(): StorageService {
  const env = (globalThis as any).process?.env
  const useOSS = env?.OSS_ACCESS_KEY_ID && env?.OSS_ACCESS_KEY_SECRET && env?.OSS_BUCKET

  if (useOSS) {
    return new OSSStorageService()
  }
  return new LocalStorageService()
}

export async function parseMultipartToFileLikes(event: H3Event): Promise<FileLike[]> {
  const parts = await readMultipartFormData(event)
  if (!parts) return []
  const files: FileLike[] = []
  for (const p of parts as any[]) {
    // In h3, file parts have { name, filename, type (mime), data }
    if (p && p.filename && p.data) {
      files.push({ filename: p.filename, type: (p.type as string | undefined), data: p.data as Buffer })
    }
  }
  return files
}

export function getContentTypeFromRequest(event: H3Event): string | undefined {
  return getRequestHeader(event, 'content-type') || undefined
}


