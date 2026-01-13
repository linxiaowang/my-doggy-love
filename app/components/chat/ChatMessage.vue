<template>
  <div class="flex gap-3 group" :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'">
    <!-- 头像 -->
    <Avatar :class="message.role === 'user' ? 'bg-primary' : 'bg-muted'" class="w-8 h-8 flex-shrink-0">
      <template v-if="message.role === 'user'">
        <img v-if="userAvatar" :src="userAvatar" alt="我" class="w-full h-full object-cover" />
        <span v-else class="text-sm font-medium text-primary-foreground">我</span>
      </template>
      <template v-else>
        <img src="/assets/images/couple/couple-1.png" alt="AI" class="w-full h-full object-cover" />
      </template>
    </Avatar>

    <!-- 消息内容区域 -->
    <div class="flex flex-col min-w-0 flex-1" :class="message.role === 'user' ? 'items-end' : 'items-start'">
      <!-- 消息气泡 -->
      <div
        class="inline-block max-w-full rounded-2xl px-4 py-2.5 text-left break-words"
        :class="message.role === 'user'
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-muted text-foreground rounded-tl-sm'"
      >
        <!-- AI 消息使用 Markdown 渲染 -->
        <div
          v-if="message.role === 'assistant'"
          class="prose prose-sm dark:prose-invert max-w-none"
          v-html="renderedContent"
        />
        <!-- 用户消息直接显示文本 -->
        <span v-else>{{ message.content }}</span>
      </div>
      <!-- 时间戳 -->
      <span class="text-xs text-muted-foreground mt-1 px-1">{{ formatTime(message.createdAt) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar } from '@/components/ui/avatar'
import type { ChatMessage } from '@/services/api/chat'
import { useAuth } from '@/composables/useAuth'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const props = defineProps<{
  message: ChatMessage
}>()

const { user } = useAuth()
const userAvatar = computed(() => user?.avatarUrl)

// 格式化时间
function formatTime(dateStr: string): string {
  const date = dayjs(dateStr)
  const now = dayjs()
  const diffMinutes = now.diff(date, 'minute')
  const diffHours = now.diff(date, 'hour')
  const diffDays = now.diff(date, 'day')

  if (diffMinutes < 1) return '刚刚'
  if (diffMinutes < 60) return `${diffMinutes}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return date.format('MM-DD HH:mm')
  return date.format('YYYY-MM-DD HH:mm')
}

// 简单的 Markdown 渲染（支持基本的格式）
const renderedContent = computed(() => {
  let content = props.message.content

  // 转义 HTML
  content = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 代码块 ```code```
  content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-muted-foreground/10 rounded-lg p-3 my-2 overflow-x-auto"><code>${code}</code></pre>`
  })

  // 行内代码 `code`
  content = content.replace(/`([^`]+)`/g, '<code class="bg-muted-foreground/10 px-1.5 py-0.5 rounded text-sm">$1</code>')

  // 粗体 **text**
  content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  // 斜体 *text*
  content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  // 链接 [text](url)
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-primary hover:underline">$1</a>')

  // 换行
  content = content.replace(/\n/g, '<br>')

  return content
})
</script>
