<template>
  <div class="min-h-screen">
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
  layout: false,
})

// 获取路由参数
const route = useRoute()
const initialConversationId = computed(() => route.query.id as string | undefined)
</script>
