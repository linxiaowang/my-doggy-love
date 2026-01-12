<template>
  <div class="h-full flex flex-col bg-muted/30 border-r">
    <!-- 头部 -->
    <div class="p-4 border-b flex items-center justify-between">
      <h2 class="font-semibold text-sm">对话列表</h2>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        @click="$emit('new-conversation')"
        :disabled="loading"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </Button>
    </div>

    <!-- 筛选标签 -->
    <div class="px-3 py-2 border-b flex gap-2">
      <button
        :class="[
          'px-3 py-1 text-xs rounded-full transition-colors',
          filterType === 'all'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/70'
        ]"
        @click="$emit('filter-change', 'all')"
      >
        全部
      </button>
      <button
        :class="[
          'px-3 py-1 text-xs rounded-full transition-colors',
          filterType === 'personal'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/70'
        ]"
        @click="$emit('filter-change', 'personal')"
      >
        个人
      </button>
      <button
        v-if="hasCouple"
        :class="[
          'px-3 py-1 text-xs rounded-full transition-colors',
          filterType === 'couple'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/70'
        ]"
        @click="$emit('filter-change', 'couple')"
      >
        情侣
      </button>
    </div>

    <!-- 会话列表 -->
    <div class="flex-1 overflow-y-auto p-2 space-y-1">
      <!-- 骨架屏 -->
      <template v-if="loading && conversations.length === 0">
        <div
          v-for="i in 5"
          :key="i"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg"
        >
          <div class="w-8 h-8 rounded-lg bg-muted/50 animate-pulse" />
          <div class="flex-1 min-w-0 space-y-2">
            <div class="h-3.5 bg-muted/50 rounded w-3/4 animate-pulse" />
            <div class="h-3 bg-muted/50 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </template>

      <!-- 空状态 -->
      <div v-else-if="conversations.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
        <div class="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p class="text-sm text-muted-foreground">暂无对话</p>
        <p class="text-xs text-muted-foreground mt-1">点击 + 开始新对话</p>
      </div>

      <!-- 会话列表 -->
      <template v-else>
        <TransitionGroup
          name="list"
          tag="div"
          class="space-y-1"
        >
          <ConversationItem
            v-for="conv in conversations"
            :key="conv.id"
            :conversation="conv"
            :is-active="conv.id === activeConversationId"
            @select="$emit('select-conversation', $event)"
            @delete="$emit('delete-conversation', $event)"
          />
        </TransitionGroup>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { ChatConversation } from '@/services/api/chat'
import ConversationItem from './ConversationItem.vue'

const props = defineProps<{
  conversations: ChatConversation[]
  activeConversationId: string | null
  loading: boolean
  hasCouple: boolean
  filterType: 'all' | 'personal' | 'couple'
}>()

defineEmits<{
  'new-conversation': []
  'filter-change': [type: 'all' | 'personal' | 'couple']
  'select-conversation': [id: string]
  'delete-conversation': [id: string]
}>()
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
