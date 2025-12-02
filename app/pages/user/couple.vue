<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-xl mx-auto px-4 py-8">
      <div class="card space-y-4">
        <div class="text-lg">情侣绑定</div>
        <div v-if="loading" class="text-sm text-#777">加载中…</div>
        <div v-else-if="couple" class="space-y-4">
          <div class="flex items-center justify-between">
            <div>邀请码：<span class="font-mono">{{ couple.code }}</span></div>
            <button class="btn-secondary text-xs" @click="copyCode">
              {{ copied ? '已复制' : '复制' }}
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="m in couple.members" :key="m.id" class="flex items-start gap-3 p-3 rounded-lg bg-#f7f6f3 hover:bg-#f0efe9 transition">
              <img 
                :src="m.avatarUrl || '/assets/images/xiaojimao/xiaojimao-2.png'" 
                :alt="m.nickName"
                loading="lazy" 
                class="w-12 h-12 rounded-full border-2 border-white object-cover flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium text-#333">{{ m.nickName }}</span>
                  <span class="text-xs text-#999">（{{ m.role==='A' ? '发起者' : '伴侣' }}）</span>
                </div>
                <!-- 状态显示 -->
                <div v-if="m.status" class="flex items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 rounded-full bg-#f0e9e2 text-#666 text-sm">{{ m.status }}</span>
                  <span v-if="m.statusUpdatedAt" class="text-xs text-#999">
                    {{ formatStatusTime(m.statusUpdatedAt) }}
                  </span>
                </div>
                <div v-else class="text-xs text-#999 mb-2">暂无状态</div>
                <!-- 操作按钮 -->
                <div class="flex items-center gap-2">
                  <button
                    @click="viewProfile(m.id, m.id === currentUserId)"
                    class="text-xs text-#d4a574 hover:text-#c49564 underline"
                  >
                    {{ m.id === currentUserId ? '查看我的主页' : '查看主页' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="couple.members.length === 1" class="space-y-2">
            <div class="text-xs text-#777">已创建情侣：等待对方加入。你也可以直接加入对方的情侣（将切换绑定）。</div>
            <form class="flex gap-2" @submit.prevent="switchToCode">
              <input v-model="switchCode" placeholder="输入对方的邀请码切换绑定" class="input" />
              <button class="btn-secondary">切换加入</button>
            </form>
          </div>
        </div>
        <div v-else class="space-y-4">
          <div class="text-sm text-#777">你还没有绑定情侣。可以创建情侣，或直接输入对方的邀请码加入。</div>
          <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <button class="btn-primary" @click="createCoupleHandler">创建情侣</button>
            <form class="flex gap-2 w-full sm:w-auto" @submit.prevent="joinCoupleHandler">
              <input v-model="code" placeholder="输入邀请码（如 ABC123）" class="input w-full sm:w-56" />
              <button class="btn-secondary">加入</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import { ref, onMounted, computed } from 'vue'
import { useCouple, createCouple, joinCouple, switchCouple } from '@/services/api/couple'

// 检查登录状态，未登录会自动跳转到登录页
definePageMeta({
  middleware: 'auth',
})

const code = ref('')
const switchCode = ref('')
const copied = ref(false)

// 使用统一的 API
const { data: coupleData, pending, refresh } = useCouple()
// coupleData 是 Ref<CoupleResponse | null>，直接访问 .couple
const couple = computed(() => coupleData.value?.couple || null)
const loading = computed(() => pending.value)

// 获取当前用户ID
const authStore = useAuthStore()
const currentUserId = computed(() => authStore.user?.id || null)

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

onMounted(async () => {
  await refresh()
})

async function createCoupleHandler() {
  try {
    await createCouple()
    await refresh()
  } catch (e: any) {
    console.error('创建情侣失败:', e)
    alert(e?.friendlyMessage || '创建情侣失败，请稍后再试')
  }
}

async function joinCoupleHandler() {
  if (!code.value) return
  try {
    await joinCouple(code.value)
    code.value = ''
    await refresh()
  } catch (e: any) {
    console.error('加入情侣失败:', e)
    alert(e?.friendlyMessage || '加入情侣失败，请检查邀请码是否正确')
  }
}

async function copyCode() {
  if (!couple.value?.code) return
  
  const codeToCopy = couple.value.code
  
  try {
    // 使用 Clipboard API（需要 HTTPS 或 localhost）
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(codeToCopy)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
      return
    }
  } catch (e) {
    console.warn('Clipboard API 失败，使用降级方案:', e)
  }
  
  // 降级方案：使用传统的 execCommand 方法
  try {
    const textArea = document.createElement('textarea')
    textArea.value = codeToCopy
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (successful) {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } else {
      // 最后的降级：直接提示用户手动复制
      alert(`邀请码：${codeToCopy}\n\n请手动复制`)
    }
  } catch (e) {
    console.error('复制失败:', e)
    // 最后的降级：直接提示用户手动复制
    alert(`邀请码：${codeToCopy}\n\n请手动复制`)
  }
}

async function switchToCode() {
  if (!switchCode.value) return
  try {
    await switchCouple(switchCode.value)
    switchCode.value = ''
    await refresh()
  } catch (e: any) {
    console.error('切换情侣失败:', e)
    alert(e?.friendlyMessage || '切换情侣失败，请检查邀请码是否正确')
  }
}

async function viewProfile(userId: string, isCurrentUser: boolean) {
  if (isCurrentUser) {
    await navigateTo('/user/profile')
  } else {
    await navigateTo(`/user/profile/${userId}`)
  }
}
</script>


