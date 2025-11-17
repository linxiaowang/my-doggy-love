/**
 * 图片压缩工具
 * 使用 compressorjs 库进行图片压缩
 * 在上传前压缩图片，减少文件大小
 * 
 * @see https://github.com/fengyuanchen/compressorjs
 */

import Compressor from 'compressorjs'

export interface CompressOptions {
  /** 最大宽度（像素），默认 1920 */
  maxWidth?: number
  /** 最大高度（像素），默认 1920 */
  maxHeight?: number
  /** 图片质量（0-1），默认 0.8 */
  quality?: number
  /** 是否检查图片方向（EXIF），默认 true */
  checkOrientation?: boolean
  /** 是否保留 EXIF 信息，默认 false（不保留以减小体积） */
  retainExif?: boolean
  /** 输出格式，默认 'auto'（自动） */
  mimeType?: 'auto' | 'image/png' | 'image/jpeg' | 'image/webp'
  /** 需要转换为 JPEG 的格式列表，默认 ['image/png'] */
  convertTypes?: string[]
  /** 转换阈值（字节），超过此大小的 convertTypes 中的格式会被转换为 JPEG，默认 5MB */
  convertSize?: number
  /** 是否保持原始格式（如果为 true，则使用原格式） */
  keepOriginalFormat?: boolean
}

/**
 * 压缩图片文件
 * @param file 原始图片文件
 * @param options 压缩选项
 * @returns 压缩后的 File 对象
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    checkOrientation = true,
    retainExif = false,
    mimeType,
    convertTypes = ['image/png'],
    convertSize = 5 * 1024 * 1024, // 5MB
    keepOriginalFormat = false,
  } = options

  // 确定输出格式
  let outputMimeType: 'auto' | 'image/png' | 'image/jpeg' | 'image/webp' = mimeType || 'auto'
  if (keepOriginalFormat && !mimeType) {
    // 保持原始格式
    if (file.type === 'image/png') {
      outputMimeType = 'image/png'
    } else if (file.type === 'image/webp') {
      outputMimeType = 'image/webp'
    } else {
      outputMimeType = 'image/jpeg'
    }
  }

  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      maxWidth,
      maxHeight,
      checkOrientation,
      retainExif,
      mimeType: outputMimeType,
      convertTypes,
      convertSize,
      success(result) {
        // compressorjs 返回的是 Blob，需要转换为 File
        const compressedFile = new File(
          [result],
          file.name,
          {
            type: result.type || file.type,
            lastModified: Date.now(),
          }
        )
        resolve(compressedFile)
      },
      error(err) {
        console.error('图片压缩失败:', err)
        reject(err)
      },
    })
  })
}

/**
 * 检查文件是否需要压缩
 * @param file 文件对象
 * @param maxSize 最大文件大小（字节），默认 1MB
 * @returns 是否需要压缩
 */
export function shouldCompress(file: File, maxSize: number = 1024 * 1024): boolean {
  // 只压缩图片
  if (!file.type.startsWith('image/')) {
    return false
  }
  
  // 如果文件小于阈值，不压缩
  if (file.size <= maxSize) {
    return false
  }
  
  return true
}

/**
 * 批量压缩图片
 * @param files 文件数组
 * @param options 压缩选项
 * @returns 压缩后的 File 对象数组
 */
export async function compressImages(
  files: File[],
  options: CompressOptions = {}
): Promise<File[]> {
  const results: File[] = []
  
  for (const file of files) {
    if (shouldCompress(file)) {
      try {
        const compressedBlob = await compressImage(file, options)
        // 创建新的 File 对象，保持原始文件名
        const compressedFile = new File(
          [compressedBlob],
          file.name,
          { type: compressedBlob.type }
        )
        results.push(compressedFile)
      } catch (error) {
        console.warn(`压缩图片 ${file.name} 失败:`, error)
        // 压缩失败时使用原文件
        results.push(file)
      }
    } else {
      // 不需要压缩的文件直接添加
      results.push(file)
    }
  }
  
  return results
}

