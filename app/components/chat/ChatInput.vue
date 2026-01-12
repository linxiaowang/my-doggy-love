<template>
  <div class="border-t bg-muted/30 p-4">
    <div class="flex items-end gap-2 max-w-4xl mx-auto bg-background rounded-2xl border shadow-sm p-2">
      <div class="flex-1 relative min-h-[44px]">
        <Textarea
          ref="textareaRef"
          v-model="input"
          :placeholder="placeholder"
          :disabled="disabled"
          rows="1"
          class="min-h-[36px] max-h-[200px] resize-none overflow-y-auto border-0 focus-visible:ring-0 bg-transparent px-3"
          @keydown="handleKeydown"
          @input="adjustHeight"
        />
        <!-- 字符计数（仅长消息时显示） -->
        <span
          v-if="input.length > 100"
          class="absolute bottom-1.5 right-2 text-xs text-muted-foreground"
        >
          {{ input.length }} / 2000
        </span>
      </div>
      <Button
        :disabled="disabled || !input.trim()"
        size="icon"
        class="h-9 w-9 flex-shrink-0 transition-all mb-0.5"
        @click="handleSend"
      >
        <svg
          v-if="!disabled"
          :class="['w-4 h-4 transition-transform', input.trim() ? 'translate-x-0.5 translate-y-0.5' : '']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        <svg
          v-else
          class="w-4 h-4 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </Button>
    </div>
    <p class="text-xs text-muted-foreground text-center mt-2">
      Enter 发送，Shift + Enter 换行
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  disabled?: boolean
  placeholder?: string
  autoFocus?: boolean
}>()

const emit = defineEmits<{
  send: [message: string]
}>()

const input = ref('')
const textareaRef = ref<any>()

// 不在 mount 时自动聚焦，避免页面初始化时的干扰

function handleSend() {
  const message = input.value.trim()
  if (!message || props.disabled) return
  if (message.length > 2000) {
    alert('消息过长，请控制在 2000 字以内')
    return
  }

  emit('send', message)
  input.value = ''

  // 重置高度
  const textarea = textareaRef.value?.$el?.querySelector('textarea')
  if (textarea) {
    textarea.style.height = 'auto'
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function adjustHeight(e: Event) {
  const target = e.target as HTMLTextAreaElement
  target.style.height = 'auto'
  const newHeight = Math.min(target.scrollHeight, 200)
  target.style.height = `${newHeight}px`
}

// 外部聚焦输入
function focusInput() {
  nextTick(() => {
    const textarea = textareaRef.value?.$el?.querySelector('textarea')
    if (textarea) {
      textarea.focus()
    }
  })
}

// 外部清空输入
function clearInput() {
  input.value = ''
  const textarea = textareaRef.value?.$el?.querySelector('textarea')
  if (textarea) {
    textarea.style.height = 'auto'
  }
}

defineExpose({
  clearInput,
  focusInput,
})
</script>
