<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader :user-override="user" />
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="card space-y-4">
        <div class="text-lg">用户资料</div>
        <div v-if="user" class="flex items-center gap-4">
          <img :src="user.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" loading="lazy" class="w-16 h-16 rounded-full object-cover" />
          <div class="flex-1">
            <!-- 昵称显示和编辑 -->
            <div class="flex items-center gap-2">
              <template v-if="isEditingNickname">
                <input
                  v-model="editingNickname"
                  ref="nicknameInputRef"
                  type="text"
                  maxlength="20"
                  class="border border-#ece7e1 rounded px-2 py-1 bg-white text-#333 focus:outline-none focus:ring-2 focus:ring-#d4a574 flex-1"
                  @keyup.enter="saveNickname"
                  @keyup.esc="cancelEditNickname"
                />
                <button
                  class="px-2 py-1 text-xs rounded bg-#d4a574 text-white hover:bg-#c49564 transition"
                  @click="saveNickname"
                  :disabled="savingNickname"
                >
                  {{ savingNickname ? '保存中...' : '保存' }}
                </button>
                <button
                  class="px-2 py-1 text-xs rounded bg-#f7f6f3 hover:bg-#e8e8e8 transition"
                  @click="cancelEditNickname"
                  :disabled="savingNickname"
                >
                  取消
                </button>
              </template>
              <div v-else class="font-medium flex items-center gap-2">
                <span>{{ user.nickName }}</span>
                <button
                  class="text-xs text-#999 hover:text-#666 ml-1"
                  @click="startEditNickname"
                  title="点击编辑昵称"
                >
                  ✏️
                </button>
              </div>
            </div>
            <div class="text-sm text-#777">{{ user.email }}</div>
          </div>
        </div>
        <form class="flex items-center gap-3" @submit.prevent="onUpload">
          <input ref="fileRef" type="file" accept="image/*" />
          <button class="px-3 py-1 rounded bg-#e9e4de">上传头像</button>
        </form>
        <div class="border-t border-#ece7e1 pt-4 space-y-3">
          <div class="text-base">情侣关系</div>
          <template v-if="couple">
            <div v-if="couple.members?.length >= 2" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="text-sm">邀请码：<span class="font-mono">{{ couple.code }}</span></div>
                <div class="flex -space-x-3">
                  <img v-for="m in couple.members" :key="m.id" :src="m.avatarUrl || '/assets/images/couple/couple-2.png'" class="w-8 h-8 rounded-full border-2 border-white" />
                </div>
              </div>
              <NuxtLink to="/user/couple" class="text-sm underline">管理情侣</NuxtLink>
            </div>
            <div v-else class="text-sm text-#777">
              已创建情侣但尚未完成绑定，邀请码：<span class="font-mono">{{ couple.code }}</span>
              <NuxtLink to="/user/couple" class="underline ml-1">去邀请对方</NuxtLink>
            </div>
          </template>
          <template v-else>
            <div class="text-sm text-#777">你还没有绑定情侣。
              <NuxtLink to="/user/couple" class="underline ml-1">去绑定</NuxtLink>
            </div>
          </template>
        </div>
        <div class="flex items-center gap-3 text-sm pt-2">
          <NuxtLink to="/" class="underline">返回首页</NuxtLink>
          <button class="underline" @click="doLogout">退出登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import { ref, onMounted, nextTick, watch } from 'vue'
import { useAuthMe, updateNickname, uploadAvatar, logout } from '@/services/api/auth'
import { useCouple } from '@/services/api/couple'

// 检查登录状态，未登录会自动跳转到登录页
definePageMeta({
  middleware: 'auth',
})

const user = ref<{ id: string; nickName: string; email?: string; avatarUrl?: string } | null>(null)
const fileRef = ref<HTMLInputElement | null>(null)
const couple = ref<{ id: string; code: string; members: Array<{ id: string; nickName: string; avatarUrl?: string; role: string }> } | null>(null)

// 昵称编辑相关
const isEditingNickname = ref(false)
const editingNickname = ref('')
const nicknameInputRef = ref<HTMLInputElement | null>(null)
const savingNickname = ref(false)

// 使用统一的 API
const { data: meData } = useAuthMe()
const { data: coupleData } = useCouple()

watch(meData, (newData) => {
  // meData 是 Ref<MeResponse | null>，直接访问 .user
  if (newData?.user) {
    user.value = newData.user
  }
}, { immediate: true })

watch(coupleData, (newData) => {
  // coupleData 是 Ref<CoupleResponse | null>，直接访问 .couple
  if (newData?.couple !== undefined) {
    couple.value = newData.couple
  }
}, { immediate: true })

onMounted(async () => {
  // 数据会通过 watch 自动更新
})

async function onUpload() {
  if (!fileRef.value?.files?.length) return
  try {
    const file = fileRef.value.files[0] as File
    const result = await uploadAvatar(file)
    // 刷新用户信息
    if (meData.value?.user) {
      user.value = { ...meData.value.user, avatarUrl: result.avatarUrl }
    }
  } catch (e: any) {
    console.error('上传头像失败:', e)
    alert(e?.friendlyMessage || '上传头像失败，请稍后再试')
  }
}

function startEditNickname() {
  if (!user.value) return
  editingNickname.value = user.value.nickName
  isEditingNickname.value = true
  // 等待 DOM 更新后聚焦输入框
  nextTick(() => {
    nicknameInputRef.value?.focus()
    nicknameInputRef.value?.select()
  })
}

function cancelEditNickname() {
  isEditingNickname.value = false
  editingNickname.value = ''
}

async function saveNickname() {
  if (savingNickname.value) return
  if (!user.value) return

  const trimmed = editingNickname.value.trim()
  if (!trimmed) {
    cancelEditNickname()
    return
  }

  // 如果昵称没有变化，直接取消编辑
  if (trimmed === user.value.nickName) {
    cancelEditNickname()
    return
  }

  savingNickname.value = true
  try {
    await updateNickname(trimmed)
    // 更新本地用户信息
    if (meData.value?.user) {
      user.value = { ...meData.value.user, nickName: trimmed }
    }
    isEditingNickname.value = false
    editingNickname.value = ''
  } catch (e: any) {
    alert(e?.friendlyMessage || '修改昵称失败，请稍后再试')
  } finally {
    savingNickname.value = false
  }
}

async function doLogout() {
  try {
    await logout()
    user.value = null
    navigateTo('/user/login')
  } catch (e: any) {
    console.error('退出登录失败:', e)
  }
}
</script>


