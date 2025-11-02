/**
 * 统一的 API 请求管理
 * 提供统一的错误处理和响应式状态管理
 */

export interface ApiError {
  statusCode?: number
  statusMessage?: string
  message?: string
  data?: any
  friendlyMessage?: string
}

/**
 * 统一错误处理函数
 */
export function handleApiError(error: any): string {
  const apiError = error as ApiError
  const statusMessage = apiError?.statusMessage || apiError?.data?.statusMessage
  const message = apiError?.message || apiError?.data?.message || '请求失败，请稍后再试'
  
  // 特殊错误处理
  if (statusMessage === 'not in couple' || message.includes('not in couple')) {
    return '您还没有绑定情侣，无法执行此操作。'
  }
  
  if (apiError?.statusCode === 400) {
    return message || '请求参数错误'
  }
  
  if (apiError?.statusCode === 401) {
    return '登录已过期，请重新登录'
  }
  
  if (apiError?.statusCode === 403) {
    return '没有权限执行此操作'
  }
  
  if (apiError?.statusCode === 404) {
    return '请求的资源不存在'
  }
  
  if (apiError?.statusCode === 500) {
    return '服务器错误，请稍后再试'
  }
  
  return message
}

/**
 * 封装的 useFetch，提供统一的错误处理和配置
 */
export function useApiFetch<T>(url: string | (() => string), options: any = {}) {
  const errorMessage = ref<string>('')
  const isError = computed(() => !!errorMessage.value)
  
  // 使用 Nuxt 的 useFetch
  const result = useFetch<T>(url, {
    credentials: 'include', // 自动包含 cookie
    ...options,
    onResponseError({ response }) {
      // 统一错误处理
      const message = handleApiError(response._data || response)
      errorMessage.value = message
      
      // 调用用户自定义的错误处理
      if (options.onResponseError) {
        options.onResponseError({ response })
      }
    },
    onRequestError({ error }) {
      errorMessage.value = '网络错误，请检查网络连接'
      if (options.onRequestError) {
        options.onRequestError({ error })
      }
    },
  })
  
  // 清除错误消息的方法
  const clearError = () => {
    errorMessage.value = ''
  }
  
  return {
    ...result,
    errorMessage: readonly(errorMessage),
    isError,
    clearError,
  }
}

/**
 * 封装的 $fetch，提供统一的错误处理
 */
export async function apiFetch<T = any>(
  url: string,
  options: any = {}
): Promise<T> {
  try {
    const result = await $fetch(url, {
      credentials: 'include',
      ...options,
    })
    return result as T
  } catch (error: any) {
    const message = handleApiError(error)
    // 将处理后的错误信息附加到错误对象上
    const enhancedError = error as ApiError & { friendlyMessage: string }
    enhancedError.friendlyMessage = message
    throw enhancedError
  }
}
