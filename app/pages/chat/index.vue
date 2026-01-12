<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/50 to-slate-50 dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900">
    <DogHeader />
    <ChatLayout :initial-conversation-id="initialConversationId" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DogHeader from '@/components/DogHeader.vue'
import ChatLayout from '@/components/chat/ChatLayout.vue'

// 检查登录状态
definePageMeta({
  middleware: 'auth',
})

// 获取路由参数
const route = useRoute()
const initialConversationId = computed(() => route.query.id as string | undefined)
</script>
