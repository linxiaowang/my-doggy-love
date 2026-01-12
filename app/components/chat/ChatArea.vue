<template>
  <div class="flex flex-col h-full">
    <!-- 头部 -->
    <div class="h-14 border-b flex items-center justify-between px-4 flex-shrink-0">
      <div class="flex items-center gap-2">
        <button
          v-if="showBackButton"
          class="md:hidden p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          @click="$emit('back')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="font-semibold">{{ currentTitle }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          class="h-8 text-muted-foreground"
          @click="$emit('regenerate')"
          :disabled="!canRegenerate || isStreaming"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重新生成
        </Button>
      </div>
    </div>

    <!-- 消息区域 -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto relative">
      <div class="max-w-3xl mx-auto px-4 py-6">
        <!-- 空状态 -->
        <div
          v-if="messages.length === 0 && !isStreaming"
          class="flex flex-col items-center justify-center min-h-[400px] text-center"
        >
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium mb-2">开始新对话</h3>
          <p class="text-sm text-muted-foreground max-w-sm mb-6">
            你可以问我任何问题，我会尽力帮助你。
          </p>
          <!-- 快捷提示 -->
          <div class="flex flex-wrap gap-2 justify-center max-w-md">
            <button
              v-for="prompt in quickPrompts"
              :key="prompt"
              class="px-3 py-1.5 text-xs bg-muted hover:bg-muted/70 rounded-full transition-colors"
              @click="$emit('send', prompt)"
            >
              {{ prompt }}
            </button>
          </div>
        </div>

        <!-- 消息列表 -->
        <template v-else>
          <TransitionGroup
            name="message"
            tag="div"
            class="space-y-6"
          >
            <ChatMessage
              v-for="msg in messages"
              :key="msg.id"
              :message="msg"
            />
          </TransitionGroup>

          <!-- 流式消息 -->
          <Transition name="message">
            <div v-if="streamingMessage" class="flex gap-3 group">
              <Avatar class="w-8 h-8 flex-shrink-0 bg-muted">
                <img src="/assets/images/couple/couple-1.png" alt="AI" class="w-full h-full object-cover" />
              </Avatar>
              <div class="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-2.5 bg-muted text-foreground">
                <div
                  class="prose prose-sm dark:prose-invert max-w-none"
                  v-html="renderStreamingContent"
                />
                <TypingIndicator v-if="isStreaming" />
              </div>
            </div>
          </Transition>
        </template>
      </div>
    </div>

    <!-- 滚动到底部按钮 -->
    <Transition name="fade">
      <button
        v-if="showScrollToBottom"
        class="absolute bottom-20 right-6 p-2 bg-muted hover:bg-muted/80 rounded-full shadow-lg transition-colors z-10"
        @click="scrollToBottom"
      >
        <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </Transition>

    <!-- 输入框 -->
    <ChatInput
      ref="inputRef"
      :disabled="isStreaming"
      @send="handleSend"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { ChatMessage as ChatMessageType } from '@/services/api/chat'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import TypingIndicator from './TypingIndicator.vue'

type ChatMessage = ChatMessageType

const props = defineProps<{
  messages: ChatMessage[]
  streamingMessage?: string
  isStreaming: boolean
  showBackButton?: boolean
  title?: string
}>()

const emit = defineEmits<{
  send: [message: string]
  regenerate: []
  back: []
}>()

const messagesContainer = ref<HTMLElement>()
const inputRef = ref<InstanceType<typeof ChatInput>>()
const showScrollToBottom = ref(false)

// 快捷提示
const quickPrompts = [
  '写一封情书',
  '推荐约会地点',
  '解决矛盾建议',
  '创意礼物点子',
]

const currentTitle = computed(() => props.title || 'AI 对话')

const canRegenerate = computed(() => props.messages.length > 0)

// 简单的 Markdown 渲染（流式消息）
const renderStreamingContent = computed(() => {
  if (!props.streamingMessage) return ''

  let content = props.streamingMessage

  // 转义 HTML
  content = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 代码块
  content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-muted-foreground/10 rounded-lg p-3 my-2 overflow-x-auto"><code>${code}</code></pre>`
  })

  // 行内代码
  content = content.replace(/`([^`]+)`/g, '<code class="bg-muted-foreground/10 px-1.5 py-0.5 rounded text-sm">$1</code>')

  // 粗体
  content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  // 斜体
  content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  // 链接
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-primary hover:underline">$1</a>')

  // 换行
  content = content.replace(/\n/g, '<br>')

  return content
})

function handleSend(message: string) {
  emit('send', message)
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  })
}

// 检测是否需要显示滚动到底部按钮
function checkScrollToBottom() {
  if (!messagesContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight
  showScrollToBottom.value = distanceFromBottom > 200
}

// 自动滚动到底部
watch(
  () => [props.messages.length, props.streamingMessage],
  () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTo({
          top: messagesContainer.value.scrollHeight,
          behavior: 'smooth',
        })
      }
    })
  }
)

// 监听滚动事件
onMounted(() => {
  messagesContainer.value?.addEventListener('scroll', checkScrollToBottom)
})

onUnmounted(() => {
  messagesContainer.value?.removeEventListener('scroll', checkScrollToBottom)
})

// 暴露方法
defineExpose({
  focusInput: () => inputRef.value?.clearInput(),
})
</script>

<style scoped>
.message-enter-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
