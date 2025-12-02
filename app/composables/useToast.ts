/**
 * Toast 提示组合式函数
 * 提供统一的提示消息功能
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  /** 提示类型 */
  type?: ToastType
  /** 显示时长（毫秒），默认 3000 */
  duration?: number
  /** 是否可手动关闭 */
  closable?: boolean
}

export interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration: number
  closable: boolean
}

let toastIdCounter = 0

/**
 * 显示 Toast 提示
 * @param message 提示消息
 * @param options 配置选项
 */
export function useToast() {
  // 使用 useState 确保全局共享状态（必须在函数内部调用）
  const toasts = useState<ToastItem[]>('toasts', () => [])
  
  function show(message: string, options: ToastOptions = {}) {
    const {
      type = 'info',
      duration = 3000,
      closable = true,
    } = options

    const toast: ToastItem = {
      id: `toast-${++toastIdCounter}`,
      message,
      type,
      duration,
      closable,
    }

    toasts.value.push(toast)

    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        remove(toast.id)
      }, duration)
    }

    return toast.id
  }

  /**
   * 显示成功提示
   */
  function success(message: string, duration?: number) {
    return show(message, { type: 'success', duration })
  }

  /**
   * 显示错误提示
   */
  function error(message: string, duration?: number) {
    return show(message, { type: 'error', duration: duration || 5000 })
  }

  /**
   * 显示警告提示
   */
  function warning(message: string, duration?: number) {
    return show(message, { type: 'warning', duration })
  }

  /**
   * 显示信息提示
   */
  function info(message: string, duration?: number) {
    return show(message, { type: 'info', duration })
  }

  /**
   * 移除指定的 Toast
   */
  function remove(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * 清除所有 Toast
   */
  function clear() {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear,
  }
}
