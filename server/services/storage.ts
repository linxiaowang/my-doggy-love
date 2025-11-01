// @ts-nocheck
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { H3Event, getRequestHeader, readMultipartFormData } from 'h3'

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


