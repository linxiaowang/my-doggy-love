/**
 * 图片 URL 处理工具
 * 用于处理原图和缩略图的 URL 转换
 */

/**
 * 从原图 URL 生成缩略图 URL
 * @param originalUrl 原图 URL
 * @returns 缩略图 URL，如果无法生成则返回原 URL
 */
export function getThumbnailUrl(originalUrl: string): string {
  if (!originalUrl) return originalUrl
  
  // 如果已经是缩略图，直接返回
  if (originalUrl.includes('/thumb_')) {
    return originalUrl
  }
  
  // 尝试从原图 URL 生成缩略图 URL
  // 格式：/uploads/media/2025/11/03/xxx.jpg -> /uploads/media/2025/11/03/thumb_xxx.jpg
  const urlParts = originalUrl.split('/')
  const fileName = urlParts[urlParts.length - 1]
  
  // 如果文件名已经包含 thumb_，说明已经是缩略图
  if (fileName.startsWith('thumb_')) {
    return originalUrl
  }
  
  // 生成缩略图文件名
  const thumbnailFileName = `thumb_${fileName}`
  urlParts[urlParts.length - 1] = thumbnailFileName
  const thumbnailUrl = urlParts.join('/')
  
  return thumbnailUrl
}

/**
 * 检查 URL 是否为图片
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false
  const lowerUrl = url.toLowerCase()
  return lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|#|$)/i) !== null ||
         lowerUrl.includes('image/') ||
         lowerUrl.startsWith('data:image/')
}

/**
 * 检查 URL 是否为视频
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false
  const lowerUrl = url.toLowerCase()
  return lowerUrl.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?|#|$)/i) !== null ||
         lowerUrl.includes('video/') ||
         lowerUrl.startsWith('data:video/')
}

