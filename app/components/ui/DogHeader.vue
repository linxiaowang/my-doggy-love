<template>
  <header class="fixed top-0 left-0 right-0 z-30 w-screen flex items-center justify-between px-4 md:px-8 lg:px-12 py-3 bg-white/70 backdrop-blur border-b border-#ece7e1">
    <NuxtLink to="/" class="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition flex-shrink-0 min-w-0">
      <img src="/assets/images/couple/couple-1.png" alt="logo" class="w-6 h-6 flex-shrink-0" />
      <span class="font-semibold text-sm md:text-base truncate">My Doggy Love</span>
    </NuxtLink>
    <nav class="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
      <NuxtLink to="/" class="hover:underline">首页</NuxtLink>
      <NuxtLink to="/daily" class="hover:underline">日常</NuxtLink>
      <NuxtLink to="/anniversaries" class="hover:underline">纪念日</NuxtLink>
      <NuxtLink to="/wishes" class="hover:underline">愿望清单</NuxtLink>
      <NuxtLink to="/messages" class="hover:underline">留言板</NuxtLink>
    </nav>
    <div class="flex items-center gap-2 md:gap-3 relative flex-shrink-0">
      <template v-if="me">
        <div class="md:block">
          <UserStatusSelector :current-status="me?.status" @update="updateStatusHandler" />
        </div>
        <!-- 通知图标 -->
        <NuxtLink to="/notifications" class="relative flex items-center justify-center w-8 h-8 hover:opacity-80 transition flex-shrink-0">
          <svg class="w-6 h-6 text-#666" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-#b42318 text-white text-xs font-medium"
          >
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </NuxtLink>
        <button class="flex items-center gap-1 md:gap-2 flex-shrink-0" @click="menu = !menu">
          <img :src="me.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" class="w-7 h-7 rounded-full object-cover" alt="avatar" />
          <span class="hidden md:inline text-sm">{{ me.nickName }}</span>
        </button>
        <div v-if="menu" class="absolute right-0 top-full mt-2 w-40 rounded-lg border border-#ece7e1 bg-white shadow p-2 z-40">
          <NuxtLink to="/user/profile" class="block px-3 py-2 text-sm hover:bg-#f7f6f3" @click="menu=false">资料</NuxtLink>
          <NuxtLink to="/user/couple" class="block px-3 py-2 text-sm hover:bg-#f7f6f3" @click="menu=false">情侣绑定</NuxtLink>
          <button class="block w-full text-left px-3 py-2 text-sm hover:bg-#f7f6f3" @click="doLogout">退出登录</button>
        </div>
      </template>
      <template v-else>
        <NuxtLink to="/user/login" class="text-sm hover:underline whitespace-nowrap">登录</NuxtLink>
        <NuxtLink to="/user/register" class="text-sm hover:underline whitespace-nowrap">注册</NuxtLink>
      </template>
      <button class="md:hidden flex-shrink-0" @click="open = !open" aria-label="menu">☰</button>
    </div>
  </header>
  <div class="fixed top-[57px] left-0 right-0 z-30 w-screen md:hidden">
    <transition name="fade">
      <div v-if="open" class="px-6 py-2 border-b border-#ece7e1 bg-white/90 backdrop-blur">
      <nav class="flex flex-col gap-2 text-sm">
        <NuxtLink to="/" @click="open=false">首页</NuxtLink>
        <NuxtLink to="/daily" @click="open=false">日常</NuxtLink>
        <NuxtLink to="/anniversaries" @click="open=false">纪念日</NuxtLink>
        <NuxtLink to="/wishes" @click="open=false">愿望清单</NuxtLink>
        <NuxtLink to="/messages" @click="open=false">留言板</NuxtLink>
      </nav>
      </div>
    </transition>
  </div>
  <!-- 占位元素，避免内容被固定头部遮挡 -->
  <div :class="open ? 'h-[105px]' : 'h-[57px]'" class="md:h-[57px]"></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import UserStatusSelector from './UserStatusSelector.vue'
import { useAuthMe, updateStatus, logout } from '@/services/api/auth'
import { useUnreadNotificationCount } from '@/services/api/notifications'

const open = ref(false)
const menu = ref(false)

// 使用统一的 API
const { data: meData, refresh: refreshMe, pending } = useAuthMe()
const me = computed(() => {
  // meData 是 Ref<MeResponse | null>，直接访问 .value.user
  const user = meData.value?.user || null
  return user
})

// 获取未读通知数量
const { data: unreadCountData, refresh: refreshUnreadCount } = useUnreadNotificationCount()
const unreadCount = computed(() => unreadCountData.value?.count || 0)

// 轮询获取未读通知数量（每30秒刷新一次）
let pollInterval: ReturnType<typeof setInterval> | null = null

// 组件挂载时确保加载数据并设置事件监听
onMounted(async () => {
  if (process.client) {
    await nextTick()
    // 立即尝试加载数据
    await refreshMe()
    await refreshUnreadCount()
    
    // 开始轮询未读通知数量
    pollInterval = setInterval(() => {
      refreshUnreadCount()
    }, 30000) // 每30秒刷新一次
    
    // 监听全局登录成功事件
    window.addEventListener('user-login-success', async () => {
      await nextTick()
      setTimeout(async () => {
        await refreshMe()
        await refreshUnreadCount()
      }, 200)
    })
    
    // 监听页面可见性变化，从隐藏变为可见时刷新
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', async () => {
        if (!document.hidden) {
          await refreshMe()
          await refreshUnreadCount()
        }
      })
    }
  }
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
})

// 监听路由变化，登录后刷新用户信息
const route = useRoute()
watch(() => route.fullPath, async (newPath, oldPath) => {
  // 从登录页面跳转出来时，确保刷新数据
  if (process.client && oldPath === '/user/login') {
    // 延迟一下，确保 cookie 已设置
    await nextTick()
    setTimeout(async () => {
      await refreshMe()
      await refreshUnreadCount()
    }, 300)
  } else if (process.client && newPath !== oldPath && newPath !== '/user/login' && oldPath !== '/user/login') {
    // 其他路由变化时也刷新，确保数据最新
    await nextTick()
    setTimeout(async () => {
      await refreshMe()
      // 从通知页面返回时，刷新未读数量
      if (oldPath === '/notifications') {
        await refreshUnreadCount()
      }
    }, 100)
  }
}, { immediate: false })

async function doLogout() {
  try {
    await logout()
    menu.value = false
    navigateTo('/user/login')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

async function updateStatusHandler(status: string | null) {
  try {
    await updateStatus(status)
    // 状态更新后刷新用户信息
    await refreshMe()
  } catch (error) {
    console.error('更新状态失败:', error)
  }
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity: 0 }
</style>


