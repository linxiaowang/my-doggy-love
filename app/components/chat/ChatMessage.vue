<template>
  <div class="flex gap-3 group" :class="isOwnMessage ? 'flex-row-reverse' : 'flex-row'">
    <!-- 头像 -->
    <Avatar
      :class="['w-8 h-8 flex-shrink-0', isOwnMessage ? 'bg-primary' : 'bg-muted', !isOwnMessage && message.role === 'user' ? 'cursor-pointer hover:ring-2 hover:ring-primary/50' : '']"
      @click="handleAvatarClick"
      @contextmenu.prevent="handleContextMenu"
    >
      <template v-if="message.role === 'user'">
        <!-- 用户消息：显示消息发送者的头像 -->
        <img
          v-if="message.user?.avatarUrl"
          :src="message.user.avatarUrl"
          :alt="message.user.nickName"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-sm font-medium text-primary-foreground">
          {{ message.user?.nickName?.slice(0, 2) || '我' }}
        </span>
      </template>
      <template v-else>
        <!-- AI 消息：显示固定头像 -->
        <img src="/assets/images/couple/couple-1.png" alt="AI" class="w-full h-full object-cover" />
      </template>
    </Avatar>

    <!-- 右键菜单 -->
    <Teleport to="body">
      <Transition name="context-menu">
        <div
          v-if="showContextMenu"
          :style="contextMenuStyle"
          class="fixed bg-background rounded-lg border shadow-lg z-50 py-1 min-w-[150px]"
          @click="closeContextMenu"
        >
          <button
            class="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 transition-colors"
            @click.stop="handleMentionUser"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            提及 @{{ message.user?.nickName }}
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- 消息内容区域 -->
    <div class="flex flex-col min-w-0 flex-1" :class="isOwnMessage ? 'items-end' : 'items-start'">
      <!-- 发送者名称（仅情侣会话且非自己时显示） -->
      <span v-if="shouldShowUserName" class="text-xs text-muted-foreground mb-1 px-1">
        {{ message.user?.nickName }}
      </span>

      <!-- 消息气泡 -->
      <div
        class="inline-block max-w-full rounded-2xl px-4 py-2.5 text-left break-words"
        :class="isOwnMessage
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
import { computed, ref } from 'vue'
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

const emit = defineEmits<{
  mentionUser: [user: { id: string; nickName: string }]
}>()

const { user: currentUser } = useAuth()

// 右键菜单状态
const showContextMenu = ref(false)
const contextMenuStyle = ref({
  left: '0px',
  top: '0px',
})

// 判断是否是自己的消息
const isOwnMessage = computed(() => {
  // AI 消息不是自己的消息
  if (props.message.role === 'assistant') {
    return false
  }
  // 用户消息：检查 userId 或 user.id
  const senderId = props.message.userId || props.message.user?.id
  return senderId === currentUser?.id
})

// 判断是否显示用户名（情侣会话中非自己的消息）
const shouldShowUserName = computed(() => {
  return props.message.role === 'user' &&
    !isOwnMessage.value &&
    props.message.user
})

// 处理头像点击（也可以触发提及）
function handleAvatarClick() {
  // 只有非自己的用户消息才能提及
  if (props.message.role === 'user' && !isOwnMessage.value && props.message.user) {
    emit('mentionUser', {
      id: props.message.user.id,
      nickName: props.message.user.nickName,
    })
  }
}

// 处理右键菜单
function handleContextMenu(e: MouseEvent) {
  // 只有非自己的用户消息才显示右键菜单
  if (props.message.role === 'user' && !isOwnMessage.value && props.message.user) {
    showContextMenu.value = true
    contextMenuStyle.value = {
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
    }

    // 点击其他地方关闭菜单
    document.addEventListener('click', closeContextMenu, { once: true })
  }
}

function closeContextMenu() {
  showContextMenu.value = false
}

function handleMentionUser() {
  if (props.message.user) {
    emit('mentionUser', {
      id: props.message.user.id,
      nickName: props.message.user.nickName,
    })
  }
  closeContextMenu()
}

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

<style scoped>
.context-menu-enter-active,
.context-menu-leave-active {
  transition: all 0.15s ease;
}

.context-menu-enter-from,
.context-menu-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
