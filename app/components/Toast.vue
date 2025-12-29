<template>
  <Teleport to="body">
    <div class="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      <transition-group name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 pointer-events-auto min-w-[280px] max-w-[420px] backdrop-blur-sm"
          :class="getToastClass(toast.type)"
          role="alert"
          :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
        >
          <!-- 图标 -->
          <ToastIcon :type="toast.type" :class="getIconClass(toast.type)" />

          <!-- 消息 -->
          <span class="text-sm font-medium flex-1">{{ toast.message }}</span>

          <!-- 关闭按钮 -->
          <button
            v-if="toast.closable"
            class="flex-shrink-0 hover:opacity-70 transition-opacity rounded-md p-0.5 -mr-1"
            :class="getCloseButtonClass(toast.type)"
            @click="remove(toast.id)"
            aria-label="关闭通知"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { h, defineComponent, type PropType } from 'vue'
import { useToast, type ToastType } from '@/composables/useToast'

const { toasts, remove } = useToast()

function getToastClass(type: ToastType): string {
  const classes = {
    success: 'bg-amber-600 text-white dark:bg-amber-500',
    error: 'bg-red-500 text-white dark:bg-red-600',
    warning: 'bg-amber-500 text-white dark:bg-amber-600',
    info: 'bg-blue-500 text-white dark:bg-blue-600',
  }
  return classes[type] || classes.info
}

function getIconClass(type: ToastType): string {
  const classes = {
    success: 'text-white',
    error: 'text-white',
    warning: 'text-white',
    info: 'text-white',
  }
  return classes[type] || classes.info
}

function getCloseButtonClass(type: ToastType): string {
  return 'text-white/90 hover:text-white hover:bg-white/10'
}

// 图标组件
const ToastIcon = defineComponent({
  props: {
    type: {
      type: String as PropType<ToastType>,
      required: true,
    },
    class: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const iconPaths: Record<ToastType, string> = {
      success: 'M5 13l4 4L19 7',
      error: 'M6 18L18 6M6 6l12 12',
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    }
    
    return () => h('svg', {
      class: `w-5 h-5 flex-shrink-0 ${props.class}`,
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2.5',
        d: iconPaths[props.type] || iconPaths.info,
      }),
    ])
  },
})
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
