<template>
  <header class="fixed top-0 left-0 right-0 z-30 w-screen flex items-center justify-between px-4 md:px-8 lg:px-12 py-3 glass pt-[calc(0.75rem+env(safe-area-inset-top))]">
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
        <div ref="avatarBtnRef" class="flex items-center gap-1 md:gap-2 flex-shrink-0 cursor-pointer" @click="menu = !menu">
          <img :src="me.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" class="w-7 h-7 rounded-full object-cover" alt="avatar" />
          <span class="hidden md:inline text-sm">{{ me.nickName }}</span>
        </div>
        <div ref="userMenuRef" v-if="menu" class="absolute right-0 top-full mt-2 w-40 rounded-lg border border-#ece7e1 bg-white shadow p-2 z-40">
          <NuxtLink to="/user/profile" class="block px-3 py-2 text-sm hover:bg-#f7f6f3" @click="menu=false">用户资料</NuxtLink>
          <NuxtLink to="/user/couple" class="block px-3 py-2 text-sm hover:bg-#f7f6f3" @click="menu=false">情侣绑定</NuxtLink>
          <button 
            class="block w-full text-left px-3 py-2 text-sm hover:bg-#f7f6f3 flex items-center justify-between" 
            @click="isPushEnabled ? disableNotification() : enableNotification()"
            :disabled="pushLoading"
          >
            <span>{{ isPushEnabled ? '关闭通知' : '开启通知' }}</span>
            <span v-if="pushLoading" class="text-xs text-gray-400">...</span>
          </button>
          <!-- 仅开发环境或测试用 -->
          <button v-if="isPushEnabled" class="block w-full text-left px-3 py-2 text-sm hover:bg-#f7f6f3 text-gray-400" @click="testNotification">测试通知</button>
          <button class="block w-full text-left px-3 py-2 text-sm hover:bg-#f7f6f3" @click="doLogout">退出登录</button>
        </div>
      </template>
      <template v-else>
        <NuxtLink to="/user/login" class="text-sm hover:underline whitespace-nowrap">登录</NuxtLink>
        <NuxtLink to="/user/register" class="text-sm hover:underline whitespace-nowrap">注册</NuxtLink>
      </template>
      <button ref="hamburgerBtnRef" class="md:hidden flex-shrink-0" @click="open = !open" aria-label="menu">☰</button>
    </div>
  </header>
  <div class="fixed top-[57px] left-0 right-0 z-30 w-screen md:hidden pt-[env(safe-area-inset-top)] pointer-events-none">
    <transition name="fade">
      <div ref="mobileMenuRef" v-if="open" class="px-6 py-2 border-b border-#ece7e1 bg-white/90 backdrop-blur pointer-events-auto">
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
  <div :class="open ? 'h-[105px]' : 'h-[57px]'" class="md:h-[57px] pt-[env(safe-area-inset-top)] box-content"></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, provide } from 'vue'
import { onClickOutside } from '@vueuse/core'
import UserStatusSelector from './UserStatusSelector.vue'
import { updateStatus, logout } from '@/services/api/auth'
import { useUnreadNotificationCount } from '@/services/api/notifications'
import { apiFetch } from '@/services/api'

const open = ref(false)
const menu = ref(false)
const isPushEnabled = ref(false)
const pushLoading = ref(false)

const userMenuRef = ref(null)
const avatarBtnRef = ref(null)
const mobileMenuRef = ref(null)
const hamburgerBtnRef = ref(null)

onClickOutside(userMenuRef, () => {
  if (menu.value) menu.value = false
}, { ignore: [avatarBtnRef] })

onClickOutside(mobileMenuRef, () => {
  if (open.value) open.value = false
}, { ignore: [hamburgerBtnRef] })

// 提供关闭所有弹窗的方法给子组件
const closeAllPopups = () => {
  menu.value = false
  open.value = false
}

provide('closeOtherPopups', closeAllPopups)

// 监听弹窗状态变化，当打开一个弹窗时关闭其他弹窗
watch(menu, (newVal) => {
  if (newVal) {
    open.value = false
    checkPushStatus()
  }
})

watch(open, (newVal) => {
  if (newVal) {
    menu.value = false
  }
})

// 使用 Pinia store 获取用户信息
const authStore = useAuthStore()
const me = computed(() => authStore.user)

// 获取未读通知数量
const { data: unreadCountData, refresh: refreshUnreadCount } = useUnreadNotificationCount()
const unreadCount = computed(() => unreadCountData.value?.count || 0)

// 监听未读数量变化，更新 PWA 角标
watch(unreadCount, (count) => {
  if (process.client && 'setAppBadge' in navigator) {
    if (count > 0) {
      navigator.setAppBadge(count).catch((e) => {
        console.warn('设置 PWA 角标失败:', e)
      })
    } else {
      navigator.clearAppBadge().catch((e) => {
        console.warn('清除 PWA 角标失败:', e)
      })
    }
  }
}, { immediate: true })

// 轮询获取未读通知数量（每30秒刷新一次）
let pollInterval: ReturnType<typeof setInterval> | null = null

// 组件挂载时设置事件监听
onMounted(async () => {
  if (process.client) {
    // 确保用户信息已拉取，避免首页头像为空
    if (!authStore.initialized) {
      await authStore.fetchUser()
    }

    await nextTick()
    await refreshUnreadCount()
    checkPushStatus()
    
    // 开始轮询未读通知数量
    pollInterval = setInterval(() => {
      refreshUnreadCount()
    }, 30000) // 每30秒刷新一次
    
    // 监听全局登录成功事件（登录后 store 会自动更新，这里只需要刷新通知）
    window.addEventListener('user-login-success', async () => {
      await nextTick()
      setTimeout(async () => {
        await refreshUnreadCount()
        checkPushStatus()
      }, 200)
    })
    
    // 监听页面可见性变化，从隐藏变为可见时刷新通知
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', async () => {
        if (!document.hidden) {
          await refreshUnreadCount()
          checkPushStatus()
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

// 监听路由变化，从通知页面返回时刷新未读数量
const route = useRoute()
watch(() => route.fullPath, async (newPath, oldPath) => {
  if (process.client && newPath !== oldPath && oldPath === '/notifications') {
    // 从通知页面返回时，刷新未读数量
    await nextTick()
    await refreshUnreadCount()
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
    // updateStatus 会自动更新 store，无需手动刷新
  } catch (error) {
    console.error('更新状态失败:', error)
  }
}

async function checkPushStatus() {
  if (!process.client || !('serviceWorker' in navigator) || !('PushManager' in window)) return
  
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    isPushEnabled.value = !!subscription
  } catch (e) {
    console.error('检查推送状态失败:', e)
  }
}

async function enableNotification() {
  if (!('Notification' in window)) {
    alert('您的浏览器不支持通知功能')
    return
  }
  
  pushLoading.value = true
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      // 获取 VAPID 公钥
      const { key } = await apiFetch<{ key: string }>('/api/notifications/vapid-public-key')
      
      if (!key) {
        throw new Error('无法获取 VAPID 公钥')
      }

      // 注册 Service Worker 并订阅
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key)
      })
      
      // 发送订阅信息给后端
      await apiFetch('/api/notifications/subscribe', {
        method: 'POST',
        body: { subscription }
      })
      
      isPushEnabled.value = true
      alert('通知已开启！')
      menu.value = false
    } else {
      alert('您拒绝了通知权限，无法接收消息提醒')
    }
  } catch (e) {
    console.error('请求通知权限失败:', e)
    alert('开启通知失败，请重试')
  } finally {
    pushLoading.value = false
  }
}

async function disableNotification() {
  pushLoading.value = true
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    
    if (subscription) {
      // 先通知后端删除订阅
      try {
        await apiFetch('/api/notifications/unsubscribe', { 
          method: 'POST', 
          body: { endpoint: subscription.endpoint } 
        })
      } catch (e) {
        console.warn('后端删除订阅失败，继续取消浏览器订阅', e)
      }

      // 取消浏览器订阅
      await subscription.unsubscribe()
    }
    
    isPushEnabled.value = false
    alert('通知已关闭')
    menu.value = false
  } catch (e) {
    console.error('关闭通知失败:', e)
    alert('关闭通知失败，请重试')
  } finally {
    pushLoading.value = false
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function testNotification() {
  if (!('Notification' in window)) return
  
  if (Notification.permission === 'granted') {
    try {
      await apiFetch('/api/test-push', { method: 'POST' })
      alert('测试通知已发送，请检查通知栏')
      menu.value = false
    } catch (e) {
      console.error('发送测试通知失败:', e)
      alert('发送失败')
    }
  } else {
    alert('请先点击"开启通知"')
  }
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity: 0 }
</style>


