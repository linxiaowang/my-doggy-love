<template>
  <div class="flex h-[calc(100vh-64px-64px)] md:h-[calc(100vh-64px)] overflow-hidden">
    <!-- 侧边栏（桌面端显示，移动端根据 showSidebar 控制） -->
    <div
      :class="[
        'w-72 flex-shrink-0 transition-transform duration-300',
        'fixed left-0 top-0 md:relative md:left-auto md:top-auto z-40',
        // 移动端全屏高度，桌面端适应容器
        'h-screen md:h-full',
        // 移动端：根据 showSidebar 控制显示/隐藏
        showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <ConversationList
        :conversations="conversations"
        :active-conversation-id="activeConversationId"
        :loading="loadingConversations"
        :has-couple="hasCouple"
        :filter-type="filterType"
        @new-conversation="handleNewConversation"
        @filter-change="filterType = $event"
        @select-conversation="handleSelectConversation"
        @delete-conversation="handleDeleteConversation"
      />
    </div>

    <!-- 遮罩层（移动端） -->
    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-black/50 z-30 md:hidden"
      @click="showSidebar = false"
    />

    <!-- 聊天区域 -->
    <div class="flex-1 min-w-0 h-full overflow-hidden">
      <ChatArea
        ref="chatAreaRef"
        :messages="currentMessages"
        :streaming-message="streamingMessage"
        :is-streaming="isStreaming"
        :show-back-button="!!activeConversationId"
        :title="currentConversationTitle"
        :is-couple-conversation="isCoupleConversation"
        @send="handleSend"
        @regenerate="handleRegenerate"
        @back="handleBackToSidebar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { ChatConversation, ChatMessage } from '@/services/api/chat'
import {
  getConversations,
  deleteConversation,
  getMessages,
  streamChat,
} from '@/services/api/chat'
import { useAuth } from '@/composables/useAuth'
import { useGlobalWebSocket } from '@/composables/useWebSocket'
import ConversationList from './ConversationList.vue'
import ChatArea from './ChatArea.vue'

const props = defineProps<{
  initialConversationId?: string
}>()

// 状态
const conversations = ref<ChatConversation[]>([])
const activeConversationId = ref<string | null>(props.initialConversationId || null)
const currentMessages = ref<ChatMessage[]>([])
const loadingConversations = ref(false)
const isStreaming = ref(false)
const streamingMessage = ref('')
const hasCouple = ref(false)
const filterType = ref<'all' | 'personal' | 'couple'>('all')
const showSidebar = ref(false)
const chatAreaRef = ref<InstanceType<typeof ChatArea>>()

// WebSocket 和 Auth
const { user: currentUser } = useAuth()
const ws = useGlobalWebSocket()

// 取消流式请求的函数
let cancelStream: (() => void) | null = null

// 当前会话标题
const currentConversationTitle = computed(() => {
  // 如果没有选中的会话，显示新建会话的标题
  if (!activeConversationId.value) {
    return filterType.value === 'couple' ? '💑 新建情侣对话' : '新建对话'
  }
  const conv = conversations.value.find(c => c.id === activeConversationId.value)
  return conv?.title || 'AI 对话'
})

// 当前会话是否是情侣会话
const isCoupleConversation = computed(() => {
  if (!activeConversationId.value) {
    return filterType.value === 'couple'
  }
  const conv = conversations.value.find(c => c.id === activeConversationId.value)
  return conv?.type === 'couple' || false
})

// 加载会话列表
async function loadConversations() {
  loadingConversations.value = true
  try {
    const type = filterType.value === 'all' ? undefined : filterType.value
    const result = await getConversations(type)
    hasCouple.value = result.hasCouple
    conversations.value = result.items
  } catch (error) {
    console.error('Failed to load conversations:', error)
  } finally {
    loadingConversations.value = false
  }
}

// 加载当前会话的消息
async function loadCurrentMessages() {
  if (!activeConversationId.value) {
    currentMessages.value = []
    return
  }

  try {
    const result = await getMessages(activeConversationId.value, 50)
    currentMessages.value = result.items
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

// 选择会话
async function handleSelectConversation(id: string) {
  activeConversationId.value = id
  showSidebar.value = false
  await loadCurrentMessages()
}

// 新建会话（只是清空视图，不真正创建会话）
function handleNewConversation() {
  activeConversationId.value = null
  currentMessages.value = []
  showSidebar.value = false
}

// 删除会话
async function handleDeleteConversation(id: string) {
  if (!confirm('确定要删除这个对话吗？')) return

  try {
    await deleteConversation(id)
    conversations.value = conversations.value.filter((c) => c.id !== id)

    // 如果删除的是当前会话，清空消息
    if (activeConversationId.value === id) {
      activeConversationId.value = null
      currentMessages.value = []
    }
  } catch (error) {
    console.error('Failed to delete conversation:', error)
  }
}

// 发送消息
async function handleSend(message: string) {
  if (isStreaming.value && cancelStream) {
    cancelStream()
  }

  // 如果没有当前会话，不预先创建，让流式请求时根据类型创建
  const isNewConversation = !activeConversationId.value
  const conversationType = filterType.value === 'couple' ? 'couple' : 'personal'

  // 添加用户消息到列表
  const userMessage: ChatMessage = {
    id: `temp-${Date.now()}`,
    conversationId: activeConversationId.value || 'temp',
    role: 'user',
    content: message,
    userId: currentUser?.id,
    user: currentUser ? {
      id: currentUser.id,
      nickName: currentUser.nickName,
      avatarUrl: currentUser.avatarUrl,
    } : undefined,
    createdAt: new Date().toISOString(),
  }
  currentMessages.value.push(userMessage)

  // 开始流式响应
  isStreaming.value = true
  streamingMessage.value = ''

  try {
    cancelStream = await streamChat(
      message,
      activeConversationId.value || undefined,
      undefined,
      {
        onConversationId: (id) => {
          // 如果是新会话，更新会话 ID
          if (id !== activeConversationId.value) {
            activeConversationId.value = id
            // 更新临时消息的会话 ID
            userMessage.conversationId = id
          }
        },
        onUserMessageId: (userMessageId) => {
          // 更新用户消息的真实 ID
          const msgIndex = currentMessages.value.findIndex(m => m.id === userMessage?.id)
          if (msgIndex !== -1 && currentMessages.value[msgIndex]) {
            currentMessages.value[msgIndex].id = userMessageId
            console.log('[ChatLayout] Updated user message ID:', {
              oldId: userMessage?.id,
              newId: userMessageId,
            })
          }
        },
        onChunk: (chunk) => {
          streamingMessage.value += chunk
        },
        onDone: (data) => {
          // 只有当有实际内容时才添加助手消息
          if (data.content && data.messageId) {
            const assistantMessage: ChatMessage = {
              id: data.messageId,
              conversationId: activeConversationId.value!,
              role: 'assistant',
              content: data.content,
              createdAt: new Date().toISOString(),
            }
            currentMessages.value.push(assistantMessage)
          }

          // 清空流式消息
          streamingMessage.value = ''

          // 重新加载会话列表（更新最后消息）
          loadConversations()
        },
        onError: (error) => {
          console.error('Stream error:', error)
          streamingMessage.value = ''
        },
        onEnd: () => {
          isStreaming.value = false
          cancelStream = null
        },
      },
      isNewConversation ? conversationType : undefined
    )
  } catch (error) {
    console.error('Failed to send message:', error)
    isStreaming.value = false
    streamingMessage.value = ''
  }
}

// 重新生成
async function handleRegenerate() {
  if (!activeConversationId.value || currentMessages.value.length === 0) return

  // 获取最后一条助手消息
  const lastAssistantMsg = [...currentMessages.value].reverse().find((m) => m.role === 'assistant')
  if (!lastAssistantMsg) return

  // 取消当前流式请求
  if (isStreaming.value && cancelStream) {
    cancelStream()
  }

  // 移除最后一条助手消息
  currentMessages.value = currentMessages.value.filter((m) => m.id !== lastAssistantMsg.id)

  // 重新生成
  isStreaming.value = true
  streamingMessage.value = ''

  try {
    cancelStream = await streamChat(
      '', // 空消息，因为使用 regenerateMessageId
      undefined,
      lastAssistantMsg.id,
      {
        onConversationId: (id) => {
          if (id !== activeConversationId.value) {
            activeConversationId.value = id
          }
        },
        onChunk: (chunk) => {
          streamingMessage.value += chunk
        },
        onDone: (data) => {
          const assistantMessage: ChatMessage = {
            id: data.messageId,
            conversationId: activeConversationId.value!,
            role: 'assistant',
            content: data.content,
            createdAt: new Date().toISOString(),
          }
          currentMessages.value.push(assistantMessage)
          streamingMessage.value = ''
          loadConversations()
        },
        onError: (error) => {
          console.error('Stream error:', error)
          streamingMessage.value = ''
        },
        onEnd: () => {
          isStreaming.value = false
          cancelStream = null
        },
      }
    )
  } catch (error) {
    console.error('Failed to regenerate:', error)
    isStreaming.value = false
    streamingMessage.value = ''
  }
}

// 返回侧边栏（移动端）
function handleBackToSidebar() {
  showSidebar.value = true
}

// 监听筛选类型变化，重新加载会话列表
watch(filterType, () => {
  loadConversations()
})

// 自动选择第一个会话（当没有选中会话且列表加载完成后）
watch(conversations, (newConversations) => {
  if (newConversations.length > 0 && !activeConversationId.value) {
    activeConversationId.value = newConversations[0]?.id || null
    if (activeConversationId.value) {
      loadCurrentMessages()
    }
  }
})

// 初始化
onMounted(() => {
  // 监听 WebSocket 新消息事件
  const unsubscribe = ws.on('chat:message:new', (message: ChatMessage) => {
    console.log('[ChatLayout] Received WebSocket message:', {
      message,
      currentConversationId: activeConversationId.value,
      currentUserId: currentUser?.id,
    })

    // 只处理当前会话的消息
    if (message.conversationId === activeConversationId.value) {
      // 对于 AI 消息，检查是否已经存在（通过 SSE 添加的）
      if (message.role === 'assistant') {
        const exists = currentMessages.value.some(m => m.id === message.id)
        if (exists) {
          console.log('[ChatLayout] AI message already exists (from SSE), ignoring WebSocket message', message.id)
          return
        }
        // 不存在的话，说明是对方触发的 AI 回复，需要添加
        console.log('[ChatLayout] Adding AI message from partner (triggered by partner)', message.id)
        currentMessages.value.push({ ...message })
        return
      }

      // 对于用户消息，只添加不是自己发送的消息
      const senderId = message.userId || message.user?.id
      console.log('[ChatLayout] Message sender ID:', senderId, 'Current user ID:', currentUser?.id)

      if (senderId !== currentUser?.id) {
        // 检查是否已存在该消息（避免重复）
        const exists = currentMessages.value.some(m => m.id === message.id)
        if (!exists) {
          console.log('[ChatLayout] Adding new message from partner:', message)
          // 创建新对象确保响应式
          currentMessages.value.push({ ...message })
          console.log('[ChatLayout] Message added. Total messages:', currentMessages.value.length)
        } else {
          console.log('[ChatLayout] Message already exists, skipping')
        }
      } else {
        console.log('[ChatLayout] Ignoring own message:', message.id)
      }
    } else {
      console.log('[ChatLayout] Message for different conversation, ignoring')
    }
  })

  // 保存取消订阅函数，在组件卸载时调用
  onUnmounted(() => {
    unsubscribe()
  })

  loadConversations()
  if (activeConversationId.value) {
    loadCurrentMessages()
  }
  // 移动端不再自动打开侧边栏，用户需要点击返回按钮才会显示
})

// 监听会话切换，自动加入/离开 WebSocket 房间
watch(activeConversationId, (newId, oldId) => {
  console.log('[ChatLayout] Conversation changed:', { oldId, newId })

  // 离开旧房间
  if (oldId) {
    ws.leaveRoom(`conversation:${oldId}`)
  }
  // 加入新房间
  if (newId) {
    // 延迟加入房间，确保 WebSocket 已连接
    nextTick(() => {
      ws.joinRoom(`conversation:${newId}`)
    })
  }
})

// 监听 WebSocket 连接状态，确保在连接成功后加入当前房间
watch(() => ws.status.value, (newStatus) => {
  console.log('[ChatLayout] WebSocket status changed:', newStatus)

  if (newStatus === 'OPEN' && activeConversationId.value) {
    // WebSocket 连接成功后，加入当前会话房间
    console.log('[ChatLayout] WebSocket connected, joining room:', activeConversationId.value)
    ws.joinRoom(`conversation:${activeConversationId.value}`)
  }
})
</script>
