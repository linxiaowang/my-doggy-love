export type AppDialogKind = 'alert' | 'confirm'

export interface AppDialogOptions {
  title?: string
  confirmText?: string
  cancelText?: string
}

export interface AppDialogState {
  open: boolean
  kind: AppDialogKind
  title: string
  message: string
  confirmText: string
  cancelText: string
}

type Resolver = ((value: boolean) => void) | null

let resolver: Resolver = null

function getState() {
  return useState<AppDialogState>('app-dialog', () => ({
    open: false,
    kind: 'alert',
    title: '提示',
    message: '',
    confirmText: '确定',
    cancelText: '取消',
  }))
}

function close(result: boolean) {
  const state = getState()
  state.value.open = false
  const resolve = resolver
  resolver = null
  resolve?.(result)
}

/**
 * 应用内通用弹窗：替代原生 alert / confirm
 */
export function useAppDialog() {
  const state = getState()

  function alert(message: string, options: AppDialogOptions = {}) {
    return new Promise<void>((resolve) => {
      resolver = () => resolve()
      state.value = {
        open: true,
        kind: 'alert',
        title: options.title || '提示',
        message,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
      }
    })
  }

  function confirm(message: string, options: AppDialogOptions = {}) {
    return new Promise<boolean>((resolve) => {
      resolver = resolve
      state.value = {
        open: true,
        kind: 'confirm',
        title: options.title || '请确认',
        message,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
      }
    })
  }

  function confirmAction() {
    close(true)
  }

  function cancelAction() {
    close(false)
  }

  function setOpen(open: boolean) {
    if (!open && state.value.open)
      close(false)
    else
      state.value.open = open
  }

  return {
    state: readonly(state),
    alert,
    confirm,
    confirmAction,
    cancelAction,
    setOpen,
  }
}
