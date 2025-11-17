/**
 * 文件上传相关 API
 */

import { apiFetch } from './index'

export interface UploadItem {
  url: string
  thumbnailUrl?: string
}

export interface UploadResponse {
  urls: (string | UploadItem)[]
}

/**
 * 上传文件
 */
export async function uploadFiles(files: File[]): Promise<UploadResponse> {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('file', file)
  })
  
  return apiFetch<UploadResponse>('/api/upload', {
    method: 'POST',
    body: formData,
  })
}

/**
 * 获取 OSS 签名 URL
 */
export async function getOSSSignedUrl(path: string, expires?: number): Promise<{ url: string }> {
  const query = new URLSearchParams({ path })
  if (expires) {
    query.append('expires', String(expires))
  }
  return apiFetch<{ url: string }>(`/api/oss/sign-url?${query.toString()}`)
}

