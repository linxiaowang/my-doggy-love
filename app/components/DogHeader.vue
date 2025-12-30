<template>
  <header class="fixed top-0 left-0 right-0 z-30 w-screen flex items-center justify-between px-4 md:px-8 lg:px-12 py-3 bg-background/95 backdrop-blur-md border-b border-border pt-[calc(0.75rem+env(safe-area-inset-top))]">
    <NuxtLink to="/" class="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition flex-shrink-0 min-w-0" aria-label="回到首页">
      <img src="/assets/images/couple/couple-1.png" alt="My Doggy Love Logo" class="w-6 h-6 flex-shrink-0" />
      <span class="font-semibold text-sm md:text-base truncate">My Doggy Love</span>
    </NuxtLink>
    
    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center gap-6 lg:gap-8 text-sm" role="navigation" aria-label="主导航">
      <Button variant="link" as-child class="text-foreground hover:no-underline px-0">
        <NuxtLink to="/">首页</NuxtLink>
      </Button>
      <Button variant="link" as-child class="text-foreground hover:no-underline px-0">
        <NuxtLink to="/daily">日常</NuxtLink>
      </Button>
      <Button variant="link" as-child class="text-foreground hover:no-underline px-0">
        <NuxtLink to="/anniversaries">纪念日</NuxtLink>
      </Button>
      <Button variant="link" as-child class="text-foreground hover:no-underline px-0">
        <NuxtLink to="/wishes">愿望清单</NuxtLink>
      </Button>
      <Button variant="link" as-child class="text-foreground hover:no-underline px-0">
        <NuxtLink to="/messages">留言板</NuxtLink>
      </Button>
    </nav>

    <div class="flex items-center gap-1.5 md:gap-2 relative flex-shrink-0">
      <!-- 暗黑模式切换按钮 -->
      <DarkToggle />

      <template v-if="me">
        <div class="md:block hidden">
          <UserStatusSelector :current-status="me?.status" @update="updateStatusHandler" />
        </div>

        <!-- 通知图标 -->
        <Button
          variant="ghost"
          size="icon"
          as-child
          class="relative w-8 h-8 hover:bg-muted/50 group"
          :aria-label="unreadCount > 0 ? `有 ${unreadCount} 条未读通知` : '查看通知'"
        >
          <NuxtLink to="/notifications">
            <Bell class="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" aria-hidden="true" />
            <Badge
              v-if="unreadCount > 0"
              variant="destructive"
              :aria-label="`${unreadCount} 条未读通知`"
              class="absolute -top-1 -right-1 px-1.5 py-0.5 h-5 min-w-[18px] flex items-center justify-center text-[10px] font-semibold shadow-md border-2 border-white dark:border-slate-900 bg-red-600 dark:bg-red-600 text-white animate-in zoom-in-50 duration-200 group-hover:scale-110 transition-transform"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </Badge>
          </NuxtLink>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="flex items-center gap-2 px-1 hover:bg-transparent" aria-label="用户菜单">
              <Avatar class="w-8 h-8">
                <AvatarImage :src="me.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" />
                <AvatarFallback>{{ me.nickName?.slice(0, 2) || '用户' }}</AvatarFallback>
              </Avatar>
              <span class="hidden md:inline text-sm font-normal">{{ me.nickName }}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
              <NuxtLink to="/user/profile" class="w-full cursor-pointer">用户资料</NuxtLink>
            </DropdownMenuItem>
             <DropdownMenuItem as-child>
              <NuxtLink to="/user/couple" class="w-full cursor-pointer">情侣绑定</NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="isPushEnabled ? disableNotification() : enableNotification()"
              :disabled="pushLoading"
              :aria-label="isPushEnabled ? '关闭推送通知' : '开启推送通知'"
            >
              <div class="flex items-center justify-between w-full">
                <span>{{ isPushEnabled ? '关闭通知' : '开启通知' }}</span>
                <span v-if="pushLoading" class="text-xs text-muted-foreground" aria-hidden="true">...</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem v-if="isPushEnabled" @click="testNotification">
              测试通知
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="doLogout" class="text-destructive focus:text-destructive">
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>

      <template v-else>
        <Button variant="ghost" as-child>
          <NuxtLink to="/user/login">登录</NuxtLink>
        </Button>
        <Button as-child>
          <NuxtLink to="/user/register">注册</NuxtLink>
        </Button>
      </template>

      <!-- Mobile Menu (Sheet) -->
      <Sheet v-if="me">
        <SheetTrigger as-child>
           <Button variant="ghost" size="icon" class="md:hidden" aria-label="打开菜单">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
           </Button>
        </SheetTrigger>
        <SheetContent side="right" class="w-[250px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle>导航</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div class="flex flex-col gap-4 mt-6">
            <div class="flex items-center gap-3">
               <Avatar class="w-10 h-10">
                <AvatarImage :src="me?.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" />
                <AvatarFallback>{{ me?.nickName?.slice(0, 2) || '用户' }}</AvatarFallback>
              </Avatar>
              <div class="flex flex-col">
                <span class="font-medium">{{ me?.nickName }}</span>
                 <UserStatusSelector :current-status="me?.status" @update="updateStatusHandler" size="sm" />
              </div>
            </div>

            <!-- 暗黑模式切换 -->
            <div class="flex items-center justify-between px-2 py-2">
              <span class="text-sm">外观模式</span>
              <DarkToggle />
            </div>

            <Separator />
            
            <nav class="flex flex-col gap-2" role="navigation" aria-label="移动端导航">
              <SheetClose as-child>
                <NuxtLink to="/" class="px-2 py-2 hover:bg-muted rounded-md transition-colors">首页</NuxtLink>
              </SheetClose>
              <SheetClose as-child>
                <NuxtLink to="/daily" class="px-2 py-2 hover:bg-muted rounded-md transition-colors">日常</NuxtLink>
              </SheetClose>
              <SheetClose as-child>
                <NuxtLink to="/anniversaries" class="px-2 py-2 hover:bg-muted rounded-md transition-colors">纪念日</NuxtLink>
              </SheetClose>
              <SheetClose as-child>
                <NuxtLink to="/wishes" class="px-2 py-2 hover:bg-muted rounded-md transition-colors">愿望清单</NuxtLink>
              </SheetClose>
              <SheetClose as-child>
                <NuxtLink to="/messages" class="px-2 py-2 hover:bg-muted rounded-md transition-colors">留言板</NuxtLink>
              </SheetClose>
            </nav>
            
            <Separator />
            
             <SheetClose as-child>
                <NuxtLink to="/user/profile" class="px-2 py-2 hover:bg-muted rounded-md transition-colors">用户资料</NuxtLink>
              </SheetClose>
              <SheetClose as-child>
                <Button variant="ghost" class="w-full justify-start px-2 py-2 text-destructive hover:text-destructive hover:bg-destructive/10" @click="doLogout">退出登录</Button>
              </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </header>
  
  <!-- 占位元素，避免内容被固定头部遮挡 -->
  <div class="h-[64px] pt-[env(safe-area-inset-top)] box-content"></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Bell } from 'lucide-vue-next'
import UserStatusSelector from './UserStatusSelector.vue'
import { updateStatus, logout } from '@/services/api/auth'
import { useUnreadNotificationCount } from '@/services/api/notifications'
import { apiFetch } from '@/services/api'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const isPushEnabled = ref(false)
const pushLoading = ref(false)

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
    if (!authStore.initialized) {
      await authStore.fetchUser()
    }

    await nextTick()
    await refreshUnreadCount()
    checkPushStatus()
    
    pollInterval = setInterval(() => {
      refreshUnreadCount()
    }, 30000)
    
    window.addEventListener('user-login-success', async () => {
      await nextTick()
      setTimeout(async () => {
        await refreshUnreadCount()
        checkPushStatus()
      }, 200)
    })
    
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
    await nextTick()
    await refreshUnreadCount()
  }
}, { immediate: false })

async function doLogout() {
  try {
    await logout()
    navigateTo('/user/login')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

async function updateStatusHandler(status: string | null) {
  try {
    await updateStatus(status)
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

async function enableNotification() {
  if (!('Notification' in window)) {
    alert('您的浏览器不支持通知功能')
    return
  }
  
  pushLoading.value = true
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const { key } = await apiFetch<{ key: string }>('/api/notifications/vapid-public-key')
      
      if (!key) {
        throw new Error('无法获取 VAPID 公钥')
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key)
      })
      
      await apiFetch('/api/notifications/subscribe', {
        method: 'POST',
        body: { subscription }
      })
      
      isPushEnabled.value = true
      alert('通知已开启！')
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
      try {
        await apiFetch('/api/notifications/unsubscribe', { 
          method: 'POST', 
          body: { endpoint: subscription.endpoint } 
        })
      } catch (e) {
        console.warn('后端删除订阅失败，继续取消浏览器订阅', e)
      }

      await subscription.unsubscribe()
    }
    
    isPushEnabled.value = false
    alert('通知已关闭')
  } catch (e) {
    console.error('关闭通知失败:', e)
    alert('关闭通知失败，请重试')
  } finally {
    pushLoading.value = false
  }
}

async function testNotification() {
  if (!('Notification' in window)) return
  
  if (Notification.permission === 'granted') {
    try {
      await apiFetch('/api/test-push', { method: 'POST' })
      alert('测试通知已发送，请检查通知栏')
    } catch (e) {
      console.error('发送测试通知失败:', e)
      alert('发送失败')
    }
  } else {
    alert('请先点击"开启通知"')
  }
}
</script>


