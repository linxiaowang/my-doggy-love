<template>
  <div
    :class="[
      'group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'hover:bg-muted/50'
    ]"
    @click="$emit('select', conversation.id)"
  >
    <!-- 图标 -->
    <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
      isActive ? 'bg-primary/20' : 'bg-muted'
    ]">
      <svg v-if="conversation.type === 'personal'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>

    <!-- 标题和预览 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="font-medium text-sm truncate">{{ conversation.title }}</span>
          <span v-if="conversation.type === 'couple'" class="text-xs flex-shrink-0">💑</span>
        </div>
        <span v-if="conversation.lastMessage" class="text-xs text-muted-foreground flex-shrink-0">
          {{ formatTime(conversation.lastMessage.createdAt) }}
        </span>
      </div>
      <p v-if="conversation.lastMessage" class="text-xs text-muted-foreground truncate mt-0.5">
        {{ formatPreview(conversation.lastMessage.content) }}
      </p>
    </div>

    <!-- 删除按钮（仅个人会话显示） -->
    <button
      v-if="conversation.type === 'personal'"
      class="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 rounded transition-all"
      @click.stop="$emit('delete', conversation.id)"
    >
      <svg class="w-4 h-4 text-muted-foreground hover:text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ChatConversation } from '@/services/api/chat'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const props = defineProps<{
  conversation: ChatConversation
  isActive: boolean
}>()

defineEmits<{
  select: [id: string]
  delete: [id: string]
}>()

function formatPreview(content: string): string {
  // 直接显示内容，截断过长的内容
  if (content.length > 30) {
    return content.slice(0, 30) + '...'
  }
  return content
}

function formatTime(dateStr: string): string {
  const date = dayjs(dateStr)
  const now = dayjs()
  const diffMinutes = now.diff(date, 'minute')
  const diffHours = now.diff(date, 'hour')
  const diffDays = now.diff(date, 'day')

  if (diffMinutes < 1) return '刚刚'
  if (diffMinutes < 60) return `${diffMinutes}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return date.format('MM-DD')
  return date.format('YYYY-MM-DD')
}
</script>
