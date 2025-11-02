<template>
  <header class="sticky top-0 z-30 w-full flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur border-b border-#ece7e1">
    <NuxtLink to="/" class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
      <img src="/assets/images/couple/couple-1.png" alt="logo" class="w-6 h-6" />
      <span class="font-semibold">My Doggy Love</span>
    </NuxtLink>
    <nav class="hidden md:flex items-center gap-4 text-sm">
      <NuxtLink to="/" class="hover:underline">首页</NuxtLink>
      <NuxtLink to="/daily" class="hover:underline">日常</NuxtLink>
      <NuxtLink to="/anniversaries" class="hover:underline">纪念日</NuxtLink>
      <NuxtLink to="/wishes" class="hover:underline">愿望清单</NuxtLink>
      <NuxtLink to="/messages" class="hover:underline">留言板</NuxtLink>
    </nav>
    <div class="flex items-center gap-3 relative">
      <template v-if="me">
        <UserStatusSelector :current-status="me?.status" @update="updateStatusHandler" />
        <button class="flex items-center gap-2" @click="menu = !menu">
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
        <NuxtLink to="/user/login" class="text-sm hover:underline">登录</NuxtLink>
        <NuxtLink to="/user/register" class="text-sm hover:underline">注册</NuxtLink>
      </template>
      <button class="md:hidden" @click="open = !open" aria-label="menu">☰</button>
    </div>
  </header>
  <transition name="fade">
    <div v-if="open" class="md:hidden px-4 py-2 border-b border-#ece7e1 bg-white/90 backdrop-blur">
      <nav class="flex flex-col gap-2 text-sm">
        <NuxtLink to="/" @click="open=false">首页</NuxtLink>
        <NuxtLink to="/daily" @click="open=false">日常</NuxtLink>
        <NuxtLink to="/anniversaries" @click="open=false">纪念日</NuxtLink>
        <NuxtLink to="/wishes" @click="open=false">愿望清单</NuxtLink>
        <NuxtLink to="/messages" @click="open=false">留言板</NuxtLink>
      </nav>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import UserStatusSelector from './UserStatusSelector.vue'
import { useAuthMe, updateStatus, logout } from '@/services/api/auth'

const open = ref(false)
const menu = ref(false)

// 使用统一的 API
const { data: meData, refresh: refreshMe } = useAuthMe()
const me = computed(() => {
  // meData 是 Ref<MeResponse | null>，直接访问 .value.user
  const user = meData.value?.user || null
  return user
})

// 监听路由变化，登录后刷新用户信息
const route = useRoute()
watch(() => route.path, () => {
  if (process.client) {
    // 延迟一下，确保 cookie 已设置
    setTimeout(() => {
      refreshMe()
    }, 100)
  }
})

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
    // 状态会通过 useAuthMe 自动更新
  } catch (error) {
    console.error('更新状态失败:', error)
  }
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity: 0 }
</style>


