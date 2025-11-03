<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-3xl mx-auto px-4 py-6">
      <div class="rounded-xl bg-white p-4 shadow mb-4">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl font-semibold">通知</h1>
          <button
            v-if="unreadCount > 0"
            class="px-3 py-1.5 text-sm rounded bg-#d4a574 text-white hover:bg-#c49564"
            @click="markAllAsRead"
            :disabled="markingAllAsRead"
          >
            {{ markingAllAsRead ? '处理中...' : '全部标记为已读' }}
          </button>
        </div>
        
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="h-16 bg-#f0f0f0 rounded"></div>
          </div>
        </div>
        
        <div v-else-if="items.length === 0" class="text-center py-12">
          <EmptyState text="暂无通知" img="/assets/images/xiaojimao/xiaojimao-4.png" />
        </div>
        
        <div v-else class="space-y-2">
          <div
            v-for="notification in items"
            :key="notification.id"
            class="flex items-start gap-3 p-3 rounded-lg hover:bg-#f7f6f3 transition"
            :class="{ 'bg-#f0f5ff border border-#e6eef5': !notification.read }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex-shrink-0 mt-1">
              <div
                class="w-2 h-2 rounded-full"
                :class="notification.read ? 'bg-transparent' : 'bg-#b42318'"
              ></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm text-#666">{{ notification.content }}</div>
              <div class="text-xs text-#999 mt-1">
                {{ formatTime(notification.createdAt) }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="hasMore && !loading" class="mt-4 flex justify-center">
          <button
            class="btn-secondary"
            @click="loadMore"
            :disabled="loadingMore"
          >
            {{ loadingMore ? '加载中…' : '加载更多' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useNotifications, useUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, type Notification } from '@/services/api/notifications'

// 检查登录状态
definePageMeta({
  middleware: 'auth',
})

const items = ref<Notification[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const markingAllAsRead = ref(false)
const pageSize = 20
const cursor = ref<string | null>(null)
const hasMore = ref(false)

const { data: notificationsData, refresh: refreshNotifications, pending } = useNotifications({ take: pageSize })

// 获取未读数量
const { data: unreadCountData, refresh: refreshUnreadCount } = useUnreadNotificationCount()
const unreadCount = computed(() => unreadCountData.value?.count || 0)

watch(notificationsData, (newData) => {
  if (newData?.items) {
    items.value = newData.items
    hasMore.value = newData.items.length === pageSize
    if (newData.items.length > 0) {
      cursor.value = newData.items[newData.items.length - 1].id
    }
    loading.value = false
  }
}, { immediate: true })

watch(pending, (newPending) => {
  if (!newPending && loading.value) {
    loading.value = false
  }
})

onMounted(async () => {
  await refreshNotifications()
  await refreshUnreadCount()
})

async function loadMore() {
  if (loadingMore.value || !cursor.value) return
  
  loadingMore.value = true
  try {
    const res = await $fetch<{ items: Notification[] }>(`/api/notifications?take=${pageSize}&cursor=${encodeURIComponent(cursor.value)}`)
    if (res.items.length > 0) {
      items.value = items.value.concat(res.items)
      hasMore.value = res.items.length === pageSize
      cursor.value = res.items[res.items.length - 1].id
    } else {
      hasMore.value = false
    }
  } catch (e: any) {
    console.error('加载更多通知失败:', e)
  } finally {
    loadingMore.value = false
  }
}

async function handleNotificationClick(notification: Notification) {
  if (!notification.read) {
    try {
      await markNotificationAsRead(notification.id)
      notification.read = true
      await refreshUnreadCount()
    } catch (e: any) {
      console.error('标记通知为已读失败:', e)
    }
  }
  
  // 根据通知类型跳转到相应页面
  if (notification.type === 'daily_posted' || notification.type === 'daily_comment' || notification.type === 'daily_comment_reply') {
    if (notification.relatedId) {
      navigateTo(`/daily`)
    }
  } else if (notification.type === 'message_posted' || notification.type === 'message_comment' || notification.type === 'message_comment_reply') {
    navigateTo(`/messages`)
  }
}

async function markAllAsRead() {
  markingAllAsRead.value = true
  try {
    await markAllNotificationsAsRead()
    // 更新本地状态
    items.value.forEach(item => {
      item.read = true
    })
    await refreshUnreadCount()
  } catch (e: any) {
    console.error('全部标记为已读失败:', e)
  } finally {
    markingAllAsRead.value = false
  }
}

function formatTime(time: string | Date): string {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
}
</script>

