<template>
  <div class="h-[calc(100vh-64px)] flex">
    <!-- 侧边栏（桌面端显示，移动端根据 showSidebar 控制） -->
    <div
      :class="[
        'w-72 flex-shrink-0 transition-transform duration-300',
        'fixed md:relative z-40 h-full',
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
    <div class="flex-1 min-w-0">
      <ChatArea
        ref="chatAreaRef"
        :messages="currentMessages"
        :streaming-message="streamingMessage"
        :is-streaming="isStreaming"
        :show-back-button="!!activeConversationId"
        :title="currentConversationTitle"
        @send="handleSend"
        @regenerate="handleRegenerate"
        @back="handleBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { ChatConversation, ChatMessage } from '@/services/api/chat'
import {
  getConversations,
  createConversation,
  deleteConversation,
  getMessages,
  streamChat,
} from '@/services/api/chat'
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

// 取消流式请求的函数
let cancelStream: (() => void) | null = null

// 当前会话标题
const currentConversationTitle = computed(() => {
  const conv = conversations.value.find(c => c.id === activeConversationId.value)
  return conv?.title || 'AI 对话'
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

// 新建会话
async function handleNewConversation() {
  try {
    const newConv = await createConversation({
      type: filterType.value === 'couple' ? 'couple' : 'personal',
    })
    conversations.value.unshift(newConv)
    await handleSelectConversation(newConv.id)
  } catch (error: any) {
    console.error('Failed to create conversation:', error)
    if (error.friendlyMessage) {
      alert(error.friendlyMessage)
    }
  }
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
    createdAt: new Date().toISOString(),
  }
  currentMessages.value.push(userMessage)

  // 开始流式响应
  isStreaming.value = true
  streamingMessage.value = ''

  try {
    cancelStream = await streamChat(
      message,
      activeConversationId.value,
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
        onChunk: (chunk) => {
          streamingMessage.value += chunk
        },
        onDone: (data) => {
          // 添加助手消息到列表
          const assistantMessage: ChatMessage = {
            id: data.messageId,
            conversationId: activeConversationId.value!,
            role: 'assistant',
            content: data.content,
            createdAt: new Date().toISOString(),
          }
          currentMessages.value.push(assistantMessage)

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

// 返回（移动端）
function handleBack() {
  showSidebar.value = true
}

// 监听筛选类型变化，重新加载会话列表
watch(filterType, () => {
  loadConversations()
})

// 初始化
onMounted(() => {
  loadConversations()
  if (activeConversationId.value) {
    loadCurrentMessages()
  }
})
</script>
