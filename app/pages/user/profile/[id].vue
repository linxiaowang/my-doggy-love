<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="rounded-xl bg-white p-6 shadow space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <NuxtLink to="/user/couple" class="text-sm text-#999 hover:text-#666">← 返回</NuxtLink>
        </div>
        <div class="text-lg">用户资料</div>
        <div v-if="loading" class="text-sm text-#777">加载中…</div>
        <div v-else-if="user" class="space-y-4">
          <div class="flex items-center gap-4">
            <img 
              :src="user.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" 
              :alt="user.nickName"
              loading="lazy" 
              class="w-16 h-16 rounded-full object-cover border-2 border-#ece7e1"
              @error="handleImageError"
            />
            <div class="flex-1">
              <div class="font-medium text-#333">{{ user.nickName }}</div>
              <div v-if="user.status" class="text-sm text-#666 mt-1">
                状态：{{ user.status }}
                <span v-if="user.statusUpdatedAt" class="text-xs text-#999 ml-1">
                  ({{ formatStatusTime(user.statusUpdatedAt) }})
                </span>
              </div>
              <div v-else class="text-xs text-#999 mt-1">暂无状态</div>
            </div>
          </div>
          <div class="border-t border-#ece7e1 pt-4">
            <div class="text-sm text-#777">
              <div class="mb-2">这是你的情侣伙伴</div>
              <div>你们共同拥有：日常记录、愿望清单、留言板和纪念日</div>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-#777">用户不存在或无权查看</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/DogHeader.vue'
import { ref, onMounted, watch, computed } from 'vue'
import { apiFetch } from '@/services/api'

// 检查登录状态，未登录会自动跳转到登录页
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()

const userId = computed(() => {
  // 获取路由参数，Nuxt 动态路由参数在 params.id 中
  const params = route.params
  const id = (params as any).id as string | string[] | undefined
  if (!id) {
    return ''
  }
  // 如果是数组，取第一个
  const finalId = Array.isArray(id) ? id[0] : id
  return finalId || ''
})

const user = ref<{ 
  id: string
  nickName: string
  avatarUrl?: string
  status?: string | null
  statusUpdatedAt?: string | Date | null
} | null>(null)

const loading = ref(true)

// 格式化状态时间
function formatStatusTime(time: string | Date) {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  // 超过7天显示日期
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

// 头像加载失败时使用默认头像
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  if (img.src !== '/assets/images/xiaobai/xiaobai-2.png') {
    img.src = '/assets/images/xiaobai/xiaobai-2.png'
  }
}

async function loadUser(userIdToLoad: string) {
  if (!userIdToLoad || userIdToLoad === 'undefined') {
    loading.value = false
    user.value = null
    return
  }
  
  loading.value = true
  try {
    const res = await apiFetch<{ user: any }>(`/api/user/${userIdToLoad}`)
    user.value = res.user
  } catch (e: any) {
    console.error('加载用户信息失败:', e)
    user.value = null
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (userId.value) {
    await loadUser(userId.value)
  } else {
    loading.value = false
    navigateTo('/user/couple')
  }
})

// 监听路由参数变化
watch(userId, async (newId) => {
  if (newId) {
    await loadUser(newId)
  }
})
</script>

